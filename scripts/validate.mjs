#!/usr/bin/env node
/**
 * validate.mjs — Validates all JSON blocks in spec.md and readme.md.
 *
 * For each ```json block:
 *   - schema-def  : contains "$schema" (Appendix D–J schemas) — syntax-check only
 *   - pseudo       : contains a line that is exactly "..." — skipped with notice
 *   - fragment     : starts with a quoted key ("key": …) — wrapped in {} for syntax check
 *   - full-object  : top-level {} — syntax + schema validation if type is determinable
 *   - full-array   : top-level [] — syntax + schema validation if type is determinable
 *
 * Schema validation uses the schemas embedded in the spec's own Appendices D–J,
 * compiled with AJV (JSON Schema 2020-12). Format keywords are NOT enforced to
 * avoid false positives from tel: URIs and namespace IRIs ending in "#".
 *
 * Run: node scripts/validate.mjs
 * Extra files: node scripts/validate.mjs path/to/other.md
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_PATH = path.join(ROOT, 'spec.md');

// Files validated by default (schemas are always sourced from spec.md)
const DEFAULT_PATHS = [
  path.join(ROOT, 'spec.md'),
  path.join(ROOT, 'readme.md'),
];

// ── 1. Extract ```json blocks from the markdown ──────────────────────────────

function extractBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  const headingStack = []; // { level, text }[]

  let inBlock = false;
  let blockLines = [];
  let blockStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inBlock) {
      const m = line.match(/^(#{1,6})\s+(.*)/);
      if (m) {
        const level = m[1].length;
        const text = m[2].trim();
        // Pop headings at the same level or deeper, then push this one
        while (headingStack.length && headingStack[headingStack.length - 1].level >= level) {
          headingStack.pop();
        }
        headingStack.push({ level, text });
      }

      if (line.trim() === '```json') {
        inBlock = true;
        blockLines = [];
        blockStart = i + 2; // 1-indexed first content line
      }
    } else {
      if (line.trim() === '```') {
        inBlock = false;
        blocks.push({
          content: blockLines.join('\n'),
          startLine: blockStart,
          // Snapshot the heading path at extraction time
          headingPath: headingStack.map(h => h.text),
        });
      } else {
        blockLines.push(line);
      }
    }
  }

  return blocks;
}

// ── 2. Classify each block ────────────────────────────────────────────────────

function classify(block) {
  const t = block.content.trim();
  if (!t) return 'empty';
  if (t.includes('"$schema"')) return 'schema-def';
  if (t.split('\n').some(l => l.trim() === '...')) return 'pseudo';
  if (t.startsWith('"')) return 'fragment'; // "key": value — not a standalone JSON value
  if (t.startsWith('[')) return 'full-array';
  if (t.startsWith('{')) return 'full-object';
  return 'unknown';
}

// ── 3. Map a block to the schema type it should be validated against ──────────

function detectSchemaType(block) {
  const all = block.headingPath.join(' ').toLowerCase();
  const c = block.content;

  // Appendix D–J define the schemas — not examples, skip schema validation
  if (/appendix [d-j]:/.test(all)) return null;

  // Section-number based detection (checked first — more precise)
  if (all.includes('5.1.1')) return 'receipt';
  if (all.includes('5.1.2')) return 'error';
  if (all.includes('5.2.1')) return 'endpoint-descriptor';
  if (all.includes('5.2.2')) return 'auth-get';
  if (all.includes('appendix a')) return 'discovery';
  if (all.includes('appendix b')) return 'report';

  // Content-based detection (fallback — used for readme.md and other external files)
  if (c.includes('"data":') && c.includes('"version": "1.0"')
      && !c.includes('"reporting":') && !c.includes('"contact":')) {
    return 'report';
  }
  if (c.includes('"version": "1.0"')
      && (c.includes('"reporting":') || c.includes('"contact":'))) {
    return 'discovery';
  }
  if (c.includes('"id":')
      && (c.includes('"status": "received"') || c.includes('"status": "pending-review"'))) {
    return 'receipt';
  }
  if (c.includes('"error":') && c.includes('"message":')
      && !c.includes('"version": "1.0"')) {
    return 'error';
  }
  if (c.includes('"schema":') && c.includes('"methods":') && c.includes('"authentication":')) {
    return 'endpoint-descriptor';
  }
  if (c.includes('"id":')
      && (c.includes('"status": "open"') || c.includes('"status": "wont-fix"')
          || c.includes('"status": "in-progress"') || c.includes('"status": "resolved"'))) {
    return 'auth-get';
  }

  return null; // no schema determinable — syntax-only check
}

// ── 4. Compile schemas from spec.md blocks ────────────────────────────────────

function compileSchemas(specBlocks, ajv) {
  const TITLE_TO_TYPE = {
    'Accessibility Reporting Discovery Document': 'discovery',
    'Accessibility Issue Report': 'report',
    'Endpoint Descriptor': 'endpoint-descriptor',
    'Report Status Object': 'report-status',
    'Authenticated GET Response': 'auth-get',
    'Report Receipt': 'receipt',
    'Error Response': 'error',
  };

  const validators = {}; // schemaType → compiled AJV validator

  for (const block of specBlocks) {
    if (classify(block) !== 'schema-def') continue;
    let schema;
    try {
      schema = JSON.parse(block.content);
    } catch {
      continue; // syntax errors in schemas are caught in the second pass
    }
    if (ajv && schema.title && TITLE_TO_TYPE[schema.title]) {
      const type = TITLE_TO_TYPE[schema.title];
      try {
        validators[type] = ajv.compile(schema);
      } catch (e) {
        process.stderr.write(`⚠  Could not compile "${schema.title}" schema: ${e.message}\n`);
      }
    }
  }

  return validators;
}

// ── 5. Validate all blocks in a single file ───────────────────────────────────

function validateFile(label, blocks, validators, ajv) {
  let passed = 0, skipped = 0, syntaxErrors = 0, schemaErrors = 0;
  const SEP = '─'.repeat(60);

  console.log(`\n${label}\n${SEP}`);

  for (const block of blocks) {
    const kind = classify(block);
    if (kind === 'empty') continue;

    const loc = `line ${String(block.startLine).padStart(4)}`;
    const sec = block.headingPath[block.headingPath.length - 1] ?? '(top)';

    // ── Schema definitions: syntax-check only ──────────────────────────────
    if (kind === 'schema-def') {
      try {
        const schema = JSON.parse(block.content);
        passed++;
        console.log(`  ✓ ${loc}  schema-def: ${schema.title ?? sec}`);
      } catch (e) {
        syntaxErrors++;
        console.log(`  ✗ ${loc}  SYNTAX ERROR in schema definition`);
        console.log(`         Section : ${sec}`);
        console.log(`         Error   : ${e.message}`);
        console.log(`         Snippet : ${block.content.trim().slice(0, 120)}`);
      }
      continue;
    }

    // ── Pseudo-JSON: skip ───────────────────────────────────────────────────
    if (kind === 'pseudo') {
      skipped++;
      console.log(`  ·  ${loc}  skipped (pseudo-JSON with ...): ${sec}`);
      continue;
    }

    // ── Parse (wrap fragments in {} for syntax checking) ───────────────────
    const raw = block.content.trim();
    const toParse = kind === 'fragment' ? `{${raw}}` : raw;

    let parsed;
    try {
      parsed = JSON.parse(toParse);
    } catch (e) {
      syntaxErrors++;
      console.log(`  ✗ ${loc}  SYNTAX ERROR`);
      console.log(`         Section : ${sec}`);
      console.log(`         Error   : ${e.message}`);
      console.log(`         Kind    : ${kind}`);
      console.log(`         Snippet : ${raw.slice(0, 120)}`);
      continue;
    }

    // ── Fragments: syntax ok, no schema ────────────────────────────────────
    if (kind === 'fragment' || kind === 'unknown') {
      passed++;
      console.log(`  ✓ ${loc}  syntax ok (fragment): ${sec}`);
      continue;
    }

    // ── Full objects/arrays: schema validation ─────────────────────────────
    const schemaType = detectSchemaType(block);

    if (!schemaType) {
      passed++;
      console.log(`  ✓ ${loc}  syntax ok (no schema): ${sec}`);
      continue;
    }

    if (!ajv) {
      passed++;
      console.log(`  ✓ ${loc}  syntax ok [schema check needs npm install]: ${sec}`);
      continue;
    }

    if (!validators[schemaType]) {
      passed++;
      console.log(`  ✓ ${loc}  syntax ok (${schemaType} validator unavailable): ${sec}`);
      continue;
    }

    const valid = validators[schemaType](parsed);

    if (valid) {
      passed++;
      console.log(`  ✓ ${loc}  valid (${schemaType}): ${sec}`);
    } else {
      schemaErrors++;
      console.log(`  ✗ ${loc}  SCHEMA ERROR (${schemaType}): ${sec}`);
      for (const err of validators[schemaType].errors ?? []) {
        const p = err.instancePath || '/';
        console.log(`         • ${p}: ${err.message}`);
        if (err.params?.allowedValues) {
          console.log(`           allowed: ${JSON.stringify(err.params.allowedValues)}`);
        }
      }
    }
  }

  const total = blocks.filter(b => classify(b) !== 'empty').length;
  console.log(`${SEP}`);
  console.log(`  Blocks: ${total}  |  ✓ ${passed} passed  |  · ${skipped} skipped  |  ✗ ${syntaxErrors + schemaErrors} errors`);

  return { passed, skipped, syntaxErrors, schemaErrors };
}

// ── 6. Main ───────────────────────────────────────────────────────────────────

async function main() {
  // Extra markdown files can be appended as CLI args
  const extraPaths = process.argv.slice(2).map(f => path.resolve(f));
  const filePaths = [
    ...DEFAULT_PATHS,
    ...extraPaths.filter(f => !DEFAULT_PATHS.includes(f)),
  ];

  // Try to load AJV (requires `npm install`)
  let ajv = null;
  try {
    const { default: Ajv } = await import('ajv/dist/2020.js');
    // strict:false  — allows $ref alongside sibling keywords (used in Appendix E)
    // logger.warn   — silences "unknown format ignored" noise; formats are intentionally
    //                 not validated to avoid false positives with tel: URIs and # IRIs
    ajv = new Ajv({
      allErrors: true,
      strict: false,
      logger: { log: console.log, warn: () => {}, error: console.error },
    });
  } catch {
    /* AJV unavailable — schema validation will be skipped */
  }

  // Compile validators from the inline schemas in spec.md (Appendices D–J)
  const specBlocks = extractBlocks(readFileSync(SPEC_PATH, 'utf8'));
  const validators = compileSchemas(specBlocks, ajv);

  // Validate each file
  const SEP = '═'.repeat(60);
  console.log(`\nValidating JSON blocks\n${SEP}`);

  let totalPassed = 0, totalSkipped = 0, totalErrors = 0;

  for (const filePath of filePaths) {
    let markdown;
    try {
      markdown = readFileSync(filePath, 'utf8');
    } catch (e) {
      console.error(`\n⚠  Could not read ${filePath}: ${e.message}`);
      totalErrors++;
      continue;
    }
    const blocks = extractBlocks(markdown);
    const label = path.relative(ROOT, filePath);
    const result = validateFile(label, blocks, validators, ajv);
    totalPassed  += result.passed;
    totalSkipped += result.skipped;
    totalErrors  += result.syntaxErrors + result.schemaErrors;
  }

  // Grand total
  console.log(`\n${SEP}`);
  console.log(`Total: ✓ ${totalPassed} passed  |  · ${totalSkipped} skipped  |  ✗ ${totalErrors} errors`);

  if (!ajv) {
    console.log('\n⚠  AJV not installed — schema validation skipped. Run `npm install` to enable it.');
  }

  if (totalErrors === 0) {
    console.log('\n✅  All JSON is valid!\n');
  } else {
    console.log(`\n❌  ${totalErrors} error(s) found\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
