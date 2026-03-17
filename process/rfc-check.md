# Validation: spec.md against RFC 8615 Registration Requirements

Checked against RFC 8615 Section 3 and the IANA Well-Known URIs registry format.

## Registration Template Fields

| Field | RFC 8615 Requirement | spec.md Status | Notes |
|-------|---------------------|----------------|-------|
| URI Suffix | Must conform to `segment-nz` (RFC 3986) | PASS | `accessibility-reporting` — lowercase + hyphen, valid segment-nz |
| Change Controller | Required; "IETF" for Standards Track, else name + contact | FAIL | Currently "TBD" in §12 |
| Specification Document | Must be a retrievable reference with URI | FAIL | Currently "This document" — no stable URL |
| Status | "permanent" or "provisional" | FAIL | Field missing from IANA table in §12 |
| Related Information | Optional | PASS | Listed as "None" (acceptable) |

## Naming Constraints

| Criterion | Status | Notes |
|-----------|--------|-------|
| Not a single generic word | PASS | `accessibility-reporting` is application-specific |
| No `/` characters | PASS | Uses hyphen only |
| Demonstrates precision per RFC 8615 naming guidance | PASS | Clearly describes purpose |

## Required Spec Content

| Requirement | Status | Notes |
|-------------|--------|-------|
| Explicitly defines the well-known URI | PASS | §3.1 defines `/.well-known/accessibility-reporting` |
| Security considerations | PASS | §11 covers transport security, sanitization, SSRF, executable attachments, document integrity, rate limiting |
| Specification stable enough for expert review | TBD | Spec is a local draft; not yet published at a stable URL |

## Link Relation Registration (RFC 8288)

The spec also defines a link relation `accessibility-reporting` (§3.4, §12). This requires a separate registration with the IANA Link Relations registry. The registration table in §12 covers this but also has "TBD" for Change Controller.

## Summary

3 FAIL, 1 TBD, rest PASS. The failures are all addressable before submission — they require decisions (change controller, hosting) rather than spec changes.
