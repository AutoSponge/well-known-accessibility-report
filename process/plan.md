# Submission Plan

## Pre-Submission (do first)

### ~~1. Decide on Change Controller~~ ✅
~~Choose who will be listed as the responsible party for this registration. This determines who can request future changes to the entry.~~

**Done:** Paul Grenier &lt;pgrenier@gmail.com&gt; is set as Change Controller in §12.

### ~~2. Publish the Spec at a Stable URL~~ ✅
**Done:** Spec is live at https://autosponge.github.io/well-known-accessibility-report/spec (GitHub Pages). Repo: https://github.com/AutoSponge/well-known-accessibility-report

### ~~3. Fix §12 IANA Considerations~~ ✅
~~- Replace "TBD" with the chosen Change Controller~~
~~- Add the `Status` field with value `provisional`~~
~~- Change "Upon standardization, this document would request..." to "This document requests..."~~
~~- Ensure the Specification Document field points to the published URL~~

**Done:** §12 has Change Controller, `Status: provisional`, correct request language, and the GitHub Pages URL.

### ~~4. Initialize Git and Push~~ ✅
~~- `git init` and commit the spec~~
~~- Push to a public GitHub repository~~

**Done:** Repo committed and pushed to `AutoSponge/well-known-accessibility-report` (`origin/main` up to date). Note: uncommitted local changes exist (scripts/, package.json, process/rfc-check.md).

## Submission

### 5. File a GitHub Issue for the Well-Known URI
Go to: https://github.com/protocol-registries/well-known-uris/issues/new

Include:
- **URI Suffix:** `accessibility-reporting`
- **Change Controller:** Paul Grenier &lt;pgrenier@gmail.com&gt;
- **Specification Document:** https://autosponge.github.io/well-known-accessibility-report/spec
- **Status:** `provisional`
- **Related Information:** RFC 9116 (security.txt, design model), WCAG-EM 2.0, EARL 1.0

Reference RFC 8615 in the issue body. The Designated Expert (currently @mnot) will review.

### 6. File a Separate Request for the Link Relation Type
The `accessibility-reporting` link relation goes into the IANA Link Relations registry (per RFC 8288).

Registry: https://github.com/protocol-registries/link-relations (or via https://www.iana.org/assignments/link-relations/)

Include:
- **Relation Name:** `accessibility-reporting`
- **Description:** Links to an accessibility issue reporting discovery document.
- **Reference:** https://autosponge.github.io/well-known-accessibility-report/spec

### 7. Monitor Review
- Expert review has a 14-day window per RFC 8615
- If no response after 21 days, escalate to iesg@iesg.org
- Be prepared to answer questions or make spec adjustments based on expert feedback

## Post-Registration

### 8. Update Spec with Registration References
Once approved, update §12 to reference the actual IANA registry entries.

### 9. Consider Broader Review
Depending on adoption goals:
- **W3C Community Group** — for web standards community input
- **IETF Internet-Draft** — for eventual Standards Track RFC and "permanent" status
- **WAI Interest Group** — for accessibility community review

## Timeline Estimate

| Step | Dependency |
|------|-----------|
| 1-4 (pre-submission) | Can be done in parallel |
| 5-6 (submission) | Requires 1-4 complete |
| 7 (review) | 14-day expert review window |
| 8-9 (post) | After approval |
