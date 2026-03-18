# Issues and Gaps for IANA Registration

## Resolved

- ~~**Change Controller is TBD**~~ — Set to Paul Grenier <pgrenier@gmail.com>
- ~~**No Stable Specification URL**~~ — GitHub Pages at https://autosponge.github.io/well-known-accessibility-report/spec
- ~~**Missing "Status" Field in IANA Table**~~ — Set to `provisional`
- ~~**Not a Git Repository**~~ — Initialized with remote origin
- ~~**Hedging Language in §12**~~ — Changed to direct registration language
- ~~**Link Relation is a Separate Registration**~~ — Accounted for in plan.md steps 5 and 6; file both simultaneously
- ~~**Example report `aria` locator contradicts empty accessible name (§6.5)**~~ — Changed both examples to use `text` locator; inline example now uses 🛒 icon button
- ~~**"A report is a JSON-LD document" overstates it (§6)**~~ — Changed to "a JSON document that uses JSON-LD conventions"
- ~~**Receipt status `"duplicate"` has no trigger scenario (§5.1.1)**~~ — Removed `"duplicate"` from receipt status enum; still exists in report lifecycle statuses
- ~~**IANA specification URL likely wrong (§12)**~~ — Invalid; repo remote is `well-known-accessibility-report`, URL is correct
- ~~**DELETE with `authentication: "none"` is contradictory (§5.4 vs §4.2)**~~ — Added constraint: if DELETE is in `methods`, `authentication` MUST NOT be `"none"`
- ~~**`mutableFields` described as "JSON path strings" (§5.2.1)**~~ — Changed to "top-level report field names"
- ~~**Empty `contact` object validates but is useless**~~ — Added `minProperties: 1` to contact schema
- ~~**Empty issue objects are valid**~~ — Added `required: ["description"]` to issue items schema; updated prose to match
- ~~**Authenticated GET response format is ambiguous (§5.2.2)**~~ — Replaced "merged" language with concrete envelope pattern
- ~~**DELETE response codes omit 429 (§5.4)**~~ — Added 429 to DELETE status table
- ~~**CORS headers list all methods unconditionally (§7.5)**~~ — Example now shows minimum methods; added guidance to scope to declared methods
- ~~**PUT has no authentication mandate (§5.3 vs §5.4)**~~ — Mirrored DELETE's constraint: if PUT is in `methods`, `authentication` MUST NOT be `"none"`; added MUST reject unauthenticated PUT with 401
- ~~**`additionalProperties: false` on `rules` items breaks extensibility (Appendix E)**~~ — Changed to `additionalProperties: true` to match the must-ignore extensibility model used everywhere else
- ~~**Receipt status and report status are separate unnamed enums (§5.1.1 vs §5.2.2)**~~ — Named them "receipt status" and "report lifecycle status"; added transition explanation in both sections
- ~~**`rateLimit: false` semantics are unclear (§4.2 vs §7.1)**~~ — Clarified field is advisory; `false` means no advertisement, not a guarantee; reporters SHOULD always handle 429
- ~~**PUT depends on an optional receipt field (§5.3 + §5.1.1)**~~ — Receipt `url` is now REQUIRED when PUT or DELETE is in `methods`; OPTIONAL otherwise
- ~~**`@context` is RECOMMENDED but practically required when `rules` is present (§6.1.1)**~~ — Changed to CONDITIONAL: REQUIRED when any Issue Object contains `rules`; RECOMMENDED otherwise; updated §6.1.1 prose to use MUST
- ~~**Authenticated GET response shape is unpredictable (§5.2.2)**~~ — Mandated `"reports"` as the field name when wrapping in an object; reporters detect shape by checking if top-level value is array or object
- ~~**Discovery doc schema `rateLimit` description is stale (Appendix D)**~~ — Updated schema description to match advisory prose in §4.2
- ~~**Report schema doesn't note `@context` conditional requirement (Appendix E)**~~ — Added description noting REQUIRED when rules present; not enforceable via static schema alone
- ~~**PUT response says "Report Receipt" but receipt statuses are wrong post-transition (§5.3)**~~ — Changed to Report Status Object with lifecycle status; no longer references receipt
- ~~**§5.3 PUT lacks response status codes**~~ — Added full status code table (200, 401, 403, 404, 429) matching DELETE's coverage
- ~~**PUT body semantics unclear — full replacement or partial? (§5.3)**~~ — Clarified PUT is full replacement per HTTP semantics; immutable fields rejected with 403 if changed
- ~~**Receipt `id` not marked REQUIRED (§5.1.1)**~~ — Marked as REQUIRED; relied on by §8.1 for dedup
- ~~**Wrong cross-reference in §4.3.2**~~ — "EARL assertion documents (see §6.3.2)" changed to §6.3.3
- ~~**"Report Status Object" used but never formally defined (§5.2.2)**~~ — Added formal field table with types and required/optional markers after the §5.2.2 example
- ~~**`@type` enum hard-codes EARL types, blocking domain-specific rules (§6.3.2, Appendix E)**~~ — Removed enum; EARL types now RECOMMENDED, not required; custom `@type` values permitted for domain-specific vocabularies (e.g., design system guidelines)
- ~~**`earl` prefix described as "always required" (§6.1.1)**~~ — Changed: `earl` required only when EARL types are used; general rule is that `@context` must define every prefix used in `@type` and `@id` values
- ~~**§4.4 `contact` prose doesn't mention `minProperties` constraint**~~ — Added "If present, the `contact` object MUST contain at least one field." to §4.4 prose
- ~~**No 5xx guidance for reporters (§5.1)**~~ — Added server errors paragraph after redirect guidance: exponential backoff, max 3 retries, respect `Retry-After`, fallback to `contact`
- ~~**§5.1.1 receipt `url` not explicitly required to be absolute URI**~~ — Changed to "Absolute URI" with "MUST be an absolute URI (scheme + authority + path)"
- ~~**§5.2.1 Endpoint Descriptor structure differs from discovery document without explanation**~~ — Added paragraph explaining the intentional flattening: discovery doc nests under `reporting` because it also contains non-endpoint metadata; Endpoint Descriptor describes only the endpoint
- ~~**§5.2.1 `schema` field relationship to Appendix E unclear**~~ — Clarified: MAY be the Appendix E base schema or an operator-specific schema that extends or constrains it
- ~~**No JSON Schema for Endpoint Descriptor or Report Status Object**~~ — Added Appendix F (Endpoint Descriptor JSON Schema) and Appendix G (Report Status Object JSON Schema)
- ~~**Table formatting inconsistency across sections**~~ — Normalized all field tables to 4-column format (Field | Type | Required | Description); converted §4.3, §4.4, §5.1.1, §5.2.1, §6.2, §6.3, §6.3.1, §6.3.1.2, §6.4 from 2- or 3-column formats
- ~~**§6.4 `json` attachment field excludes JSON arrays (Appendix E)**~~ — Added: "The value MUST be a JSON object; JSON arrays are not permitted as the top-level value. Reporters needing to attach an array SHOULD wrap it in an object."
- ~~**§9.5 WebMCP community group attribution may be stale**~~ — Confirmed: "WebMCP" is not a real W3C specification and the "W3C WebML Community Group" attribution was incorrect. Rewrote §9.5 as "Browser-Native Tool Registration (Informative)" referencing the MCP ecosystem and W3C Autonomous Agents on the Web Community Group generically

## Outstanding

### EAA alignment (Directive 2019/882)

- ~~**Report Status Object lacks structured justification for rejection**~~ — Added optional `reason` field to Report Status Object (§5.2.2) and Appendix G; example shows disproportionate burden citation
- ~~**No accessibility statement linkage in discovery document**~~ — Added optional `statement` URI to §4.1 top-level fields and Appendix D schema; references EAA Article 13(2)/Annex V and WAD Article 7
- ~~**No enforcement procedure link**~~ — Added optional `enforcementProcedure` URI to §4.1 and Appendix D; references EAA Article 29 and WAD Article 9
- ~~**No response-time or SLA field**~~ — Added optional `responseTime` string to `reporting` object (§4.2) and Appendix D schema; advisory, not binding SLA; references EAA Recital 95
- ~~**`contact` object needs TTY and contactType support**~~ — Added `tty`, `relay`, and `contactType` flat fields to §4.4 table, examples, and Appendix D schema; flat-field approach chosen over typed contactPoints array for simplicity

### Schema omissions

- ~~**`reporterContact` missing from Appendix D schema**~~ — Added `reporterContact` boolean (default `false`) to `accepts` object in Appendix D schema
- ~~**`reporter.contact` object missing from Appendix E schema**~~ — Added `contact` sub-object with `name`, `email`, `url` fields to `reporter` object in Appendix E schema
- ~~**Authenticated GET wrapper has no schema**~~ — Added Appendix H: Authenticated GET Response JSON Schema; uses `oneOf` for array (unwrapped) vs object (wrapped with `"reports"` key); references `$defs/reportStatusObject`

### Cross-reference errors

- ~~**Wrong cross-reference in §6.2.1**~~ — Changed "See §11" to "See §10 and §11.6" in both §4.3 (`reporterContact` field description) and §6.2.1 (reporter contact prose)

### Spec gaps

- ~~**Endpoint Descriptor missing `rateLimit` and `responseTime`**~~ — Added both fields to §5.2.1 example JSON, §5.2.1 field table, and Appendix F schema; same semantics as `reporting` object in discovery document
- ~~**No per-issue `page` field for multi-issue reports**~~ — Added optional `page` (URI) to Issue Object (§6.3 table and Appendix E schema); overrides top-level `page` for that issue when present
- ~~**`domSnapshot` format values undefined**~~ — Added formal definitions for `"accessibility-tree"` and `"dom-fragment"` in §4.3.2; noted that additional format values are permitted
- ~~**No way to associate attachments with specific issues in multi-issue reports (§6.4 vs §6.3)**~~ — Added optional `attachments` array to Issue Object (§6.3) using same schema as top-level attachments (§6.4); issue-level for issue-specific evidence, top-level for report-wide context; Appendix E schema uses `$ref` to top-level definition
- ~~**No `format` field on report-side attachment objects (§6.4 vs §4.3.2)**~~ — Added optional `format` string to §6.4 attachment table and Appendix E schema; corresponds to operator's declared `formats` values; reporters SHOULD include when operator declares formats for the type
- ~~**Authenticated GET response shape detection algorithm not explicit (§5.2.2)**~~ — Added explicit three-step detection algorithm: array → report data only; object with `"reports"` key → wrapped; object without → Endpoint Descriptor only; noted response shape MAY vary between requests

### Schema omissions (new)

- ~~**No JSON Schema for Report Receipt (§5.1.1)**~~ — Added Appendix I with JSON Schema; `id` required, `status` enum, `url` conditional (noted not enforceable via static schema); referenced from §5.1.1 prose
- ~~**No JSON Schema for Error Response (§5.1.2)**~~ — Added Appendix J with JSON Schema; `error` and `message` required; `details` items define `field`/`reason` with `additionalProperties: true`; referenced from §5.1.2 prose

### Editorial

- ~~**Error response `details` example uses undeclared fields (§5.1.2)**~~ — Added extensibility note to `details` field description: operators MAY include additional properties (e.g., `limit`, `actual`); reporters SHOULD ignore unrecognized properties. Consistent with `additionalProperties: true` in Appendix J schema

### Inconsistencies

- ~~**§5.1 status code 403 lists "duplicate" but §7.2 assigns 409 to duplicates**~~ — Removed "duplicate" from 403 description; replaced with "blocked reporter, immutable field change". 409 Conflict remains the correct code for content-based duplicates.
- ~~**Appendix H schema doesn't cover case 3 of §5.2.2 response shape detection**~~ — Added explanatory note to Appendix H: case 3 (plain Endpoint Descriptor without report data) is validated by Appendix F, not this schema; Appendix H intentionally covers only the two report-bearing response shapes.
- ~~**Report Status Objects lack a `url` field, breaking PUT/DELETE via GET**~~ — Added `url` (absolute URI) to Report Status Object: CONDITIONAL field, REQUIRED when `reporting.methods` includes PUT or DELETE. Updated §5.2.2 field table, examples, Appendix G schema, and Appendix H `$defs/reportStatusObject`.

### Simplification

- ~~**Remove `multipleIssues` from the spec**~~ — Removed `multipleIssues` from §4.3 field table, both discovery doc examples, Appendix D schema, §6.1 `issues` description, §6.3 attachment prose, and §8.4.1 form guidance. Updated §6.1 to "MUST contain exactly one element". Added `maxItems: 1` to Appendix E schema. Updated FAQ Q4 from "Partially resolved" to "Resolved" with one-issue-per-POST guidance.

### Ambiguities

- ~~**§5.3 PUT "full replacement" semantics could be clearer**~~ — Clarified: PUT body MUST include all REQUIRED fields plus mutable fields being amended. Immutable OPTIONAL fields MAY be omitted; if included, values MUST match the original (403 if not).

### Editorial (new)

- ~~**"Distinguished subtree" introduced in §6.3.1.2 but not defined**~~ — Added formal definition to §2 Terminology: "A pattern of accessibility-tree roles and names — constructed from an element and its ancestors — that uniquely identifies the element within the page."

### Residual "one or more" language after `multipleIssues` removal

- ~~**§2 Terminology still says "one or more accessibility issues"**~~ — Changed to "exactly one accessibility issue" in §2 definition
- ~~**§6.1 `issues` field description contradicts itself**~~ — Changed to "Exactly one Issue Object" in §6.1 field table
- ~~**Appendix E schema title description says "one or more"**~~ — Changed to "exactly one accessibility issue" in Appendix E schema description

### Motivating scenarios

- ~~**§1.1 scenario 3 implies batch submission in a single POST**~~ — Reworded to "submits each EARL-formatted finding as an individual POST … respecting any declared rate limits"

### Missing status codes

- ~~**§5.3 PUT status codes omit 400 and 413**~~ — Added 400 Bad Request and 413 Payload Too Large to §5.3 PUT status code table, matching POST's coverage; inserted in numerical order

### Editorial (status code ordering)

- ~~**§5.1 POST status codes not in numerical order**~~ — Swapped 422 and 429 so POST status codes are in ascending numerical order

### Editorial (example indentation)

- ~~**§6.5 first example has misleading indentation** — In the voice-control example, `label` is indented 8 spaces instead of 6 (it appears to be inside `snapshot` rather than `element`), and `rules`/`steps` are indented 6 spaces instead of 4 (they appear to be inside `element` rather than `data`). The JSON is syntactically valid and parses correctly, but the visual structure is misleading. Correct the indentation to match the actual nesting.~~ — Fixed: `label` moved to 6-space indent, `element` closing brace to 4-space indent, `rules`/`steps` and their closing punctuation to 4-space indent to reflect actual nesting.

### Cross-reference errors

- ~~**Appendix G description scoped too narrowly** — Appendix G's intro says the schema is "returned by an authenticated GET request (§5.2.2)". However §5.3 specifies that a successful PUT also returns a Report Status Object (200 OK body). The intro should mention §5.3 as well so implementors know where the schema applies.~~ — Added "or a successful PUT request (§5.3)" to the Appendix G introductory sentence.

## Decisions

- **No custom media type registration.** The spec uses `application/json` for both discovery document and reports. A dedicated type like `application/accessibility-report+json` is not needed for v1.0. Can be revisited in a future version if content negotiation becomes a requirement.

- **WAI-Adapt: Discoverable Destinations relationship documented.** Added §9.9 (informative) clarifying that `rel="accessibility-statement"` (WAI-Adapt) and `/.well-known/accessibility-reporting` (this spec) are complementary, not conflicting: the former links to an existing human-readable statement; the latter is a submission API. Added WAI-Adapt to the **Related** header. The `statement` discovery document field already bridges the two.
