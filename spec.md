---
layout: default
title: Well-Known URI for Accessibility Issue Reporting
permalink: /spec
---

# Well-Known URI for Accessibility Issue Reporting <br>
**Status:** Draft — seeking feedback <br>
**URI Suffix:** `accessibility-reporting` <br>
**Well-Known URI:** `/.well-known/accessibility-reporting` <br>
**Related:** RFC 8288, RFC 8615, RFC 9110, RFC 9116, WCAG-EM 2.0, EARL 1.0, ACT Rules Format 1.1, WAI-Adapt: Discoverable Destinations, W3C Reporting API (reporting-1), COGA: Making Content Usable

---

## Abstract

This document defines a well-known URI (`/.well-known/accessibility-reporting`) where websites and web applications advertise how to report accessibility issues. It specifies a JSON discovery document, an HTTP reporting API, and a report payload schema. Humans, assistive technologies, browser agents, and AI-augmented browsing tools can all use the mechanism. Site operators control what they accept.

---

## Table of Contents

- [1.](#1-introduction) Introduction
  - [1.1.](#11-motivating-scenarios) Motivating Scenarios
- [2.](#2-terminology) Terminology
- [3.](#3-the-well-known-resource) The Well-Known Resource
  - [3.1.](#31-location) Location
  - [3.2.](#32-media-type) Media Type
  - [3.3.](#33-discovery) Discovery
  - [3.4.](#34-link-based-discovery) Link-Based Discovery
- [4.](#4-discovery-document-format) Discovery Document Format
  - [4.1.](#41-top-level-fields) Top-Level Fields
  - [4.2.](#42-the-reporting-object) The `reporting` Object
    - [4.2.1.](#421-cross-origin-endpoints) Cross-Origin Endpoints
  - [4.3.](#43-the-reportingaccepts-object) The `reporting.accepts` Object
    - [4.3.1.](#431-the-rulevocabularies-array) The `ruleVocabularies` Array
    - [4.3.2.](#432-the-attachments-array) The `attachments` Array
  - [4.4.](#44-the-contact-object) The `contact` Object
  - [4.5.](#45-example-discovery-documents) Example Discovery Documents
  - [4.6.](#46-extensibility-and-version-handling) Extensibility and Version Handling
- [5.](#5-reporting-api) Reporting API
  - [5.1.](#51-submitting-a-report-post--required) Submitting a Report (POST) — REQUIRED
    - [5.1.1.](#511-report-receipt) Report Receipt
    - [5.1.2.](#512-error-responses) Error Responses
  - [5.2.](#52-endpoint-discovery-and-status-get--optional) Endpoint Discovery and Status (GET) — OPTIONAL
    - [5.2.1.](#521-unauthenticated-get) Unauthenticated GET
    - [5.2.2.](#522-authenticated-get) Authenticated GET
  - [5.3.](#53-amending-a-report-put--optional) Amending a Report (PUT) — OPTIONAL
  - [5.4.](#54-retracting-a-report-delete--optional) Retracting a Report (DELETE) — OPTIONAL
- [6.](#6-report-schema) Report Schema
  - [6.1.](#61-top-level-report-fields) Top-Level Report Fields
    - [6.1.1.](#611-the-context-object) The `@context` Object
  - [6.2.](#62-the-reporter-object) The `reporter` Object
    - [6.2.1.](#621-the-reportercontact-object) The `reporter.contact` Object
  - [6.3.](#63-issue-object) Issue Object
    - [6.3.1.](#631-the-element-object) The `element` Object
    - [6.3.2.](#632-the-rules-array) The `rules` Array
    - [6.3.3.](#633-earl-assertions-as-attachments) EARL Assertions as Attachments
  - [6.4.](#64-attachments) Attachments
    - [6.4.1.](#641-large-attachments) Large Attachments
    - [6.4.2.](#642-browser-automation-recordings) Browser Automation Recordings
  - [6.5.](#65-example-report) Example Report
- [7.](#7-server-behavior) Server Behavior
  - [7.1.](#71-rate-limiting) Rate Limiting
  - [7.2.](#72-duplicate-and-retry-detection) Duplicate and Retry Detection
  - [7.3.](#73-report-rejection) Report Rejection
  - [7.4.](#74-authentication) Authentication
  - [7.5.](#75-cross-origin-requests) Cross-Origin Requests
  - [7.6.](#76-caching) Caching
- [8.](#8-client-behavior) Client Behavior
  - [8.1.](#81-automated-agents) Automated Agents
  - [8.2.](#82-human-reporters) Human Reporters
  - [8.3.](#83-locale-handling) Locale Handling
  - [8.4.](#84-user-agent-native-reporting) User Agent Native Reporting
    - [8.4.1.](#841-form-generation) Form Generation
    - [8.4.2.](#842-accessibility-of-the-form) Accessibility of the Form
    - [8.4.3.](#843-submission-behavior) Submission Behavior
- [9.](#9-relationship-to-existing-specifications) Relationship to Existing Specifications
  - [9.1.](#91-rfc-9116-securitytxt) RFC 9116 (security.txt)
  - [9.2.](#92-rfc-8288-web-linking) RFC 8288 (Web Linking)
  - [9.3.](#93-wcag-em-20) WCAG-EM 2.0
  - [9.4.](#94-earl-10) EARL 1.0
  - [9.5.](#95-act-rules-format-11) ACT Rules Format 1.1
  - [9.6.](#96-browser-native-tool-registration-informative) Browser-Native Tool Registration (Informative)
  - [9.7.](#97-accessibility-tree-snapshot-tools) Accessibility Tree Snapshot Tools
  - [9.8.](#98-scope-beyond-wcag) Scope Beyond WCAG
  - [9.9.](#99-multi-subdomain-deployments) Multi-Subdomain Deployments
  - [9.10.](#910-wai-adapt-discoverable-destinations-informative) WAI-Adapt: Discoverable Destinations (Informative)
  - [9.11.](#911-w3c-reporting-api-reporting-1) W3C Reporting API (reporting-1)
  - [9.12.](#912-cognitive-accessibility-coga-making-content-usable-informative) Cognitive Accessibility: COGA Making Content Usable (Informative)
  - [9.13.](#913-prior-art-jaws-connect-informative) Prior Art: JAWS Connect (Informative)
- [10.](#10-privacy-considerations) Privacy Considerations
- [11.](#11-security-considerations) Security Considerations
  - [11.1.](#111-transport-security) Transport Security
  - [11.2.](#112-text-field-sanitization) Text Field Sanitization
  - [11.3.](#113-url-referenced-attachments) URL-Referenced Attachments
  - [11.4.](#114-executable-attachments) Executable Attachments
  - [11.5.](#115-discovery-document-integrity) Discovery Document Integrity
  - [11.6.](#116-reporter-contact-data) Reporter Contact Data
  - [11.7.](#117-rate-limiting-and-abuse-prevention) Rate Limiting and Abuse Prevention
- [12.](#12-iana-considerations) IANA Considerations
- [Appendix A.](#appendix-a-minimal-conforming-discovery-documents) Minimal Conforming Discovery Documents
- [Appendix B.](#appendix-b-minimal-conforming-report) Minimal Conforming Report
- [Appendix C.](#appendix-c-open-questions-and-resolutions) Open Questions and Resolutions
- [Appendix D.](#appendix-d-discovery-document-json-schema) Discovery Document JSON Schema
- [Appendix E.](#appendix-e-report-json-schema) Report JSON Schema
- [Appendix F.](#appendix-f-endpoint-descriptor-json-schema) Endpoint Descriptor JSON Schema
- [Appendix G.](#appendix-g-report-status-object-json-schema) Report Status Object JSON Schema
- [Appendix H.](#appendix-h-authenticated-get-response-json-schema) Authenticated GET Response JSON Schema
- [Appendix I.](#appendix-i-report-receipt-json-schema) Report Receipt JSON Schema
- [Appendix J.](#appendix-j-error-response-json-schema) Error Response JSON Schema

---

## 1. Introduction

Accessibility issues on websites are often discovered by users relying on assistive technologies, by automated testing tools, or by AI agents acting on behalf of users. No standard mechanism exists for reporting these issues to site operators in a structured, machine-readable format.

This specification defines:

1. A **discovery document** at a well-known URI that describes how reports should be submitted.
2. A **reporting API** using standard HTTP methods.
3. A **report schema** that captures issues from humans, automated tools, AI agents, and assistive technologies, without requiring knowledge of specific WCAG success criteria.

This specification follows the `security.txt` (RFC 9116) model for vulnerability reporting and adopts conventions from W3C accessibility formats (EARL 1.0, WCAG-EM 2.0, ACT Rules Format 1.1) without being limited to them.

### 1.1 Motivating Scenarios

- A user's third-party voice control software cannot operate a custom widget. The software is aware of this specification and offers a "report a problem to this website" feature, submitting a structured report on the user's behalf.
- An AI agent browsing a site on behalf of a user notices that a button is missing an accessible name in the accessibility tree. The agent drafts a report; the user reviews and approves it before submission.
- An automated accessibility scanner runs a nightly audit and submits each EARL-formatted finding as an individual POST to the site's reporting endpoint, respecting any declared rate limits.
- A human user encounters a form that their screen reader cannot complete. They submit a report through the site's own reporting form, which uses this endpoint under the hood.
- A site implements WebMCP (see [§9.6](#96-browser-native-tool-registration-informative)), registering an accessibility reporting tool in the browser context. A user's AI agent discovers this tool alongside other site-provided tools during normal interaction. When the user encounters difficulty (for example, being unable to locate or operate a control), the agent surfaces a "report accessibility issue" option. The user reviews and approves the report, which the agent submits via the WebMCP-registered tool. The tool routes the report to the site's well-known endpoint with the user's session context intact. The reporter type is `"human-assisted"`.
- An autonomous agent uses a headless browser with accessibility tree snapshot support (see [§9.7](#97-accessibility-tree-snapshot-tools)) to inspect a page programmatically. The snapshot returns a structured representation of the accessibility tree with stable element references. The agent detects that a custom widget has the ARIA `role="button"` but exposes no accessible name through any naming technique. Without human involvement, the agent fetches the discovery document, constructs a report including the relevant portion of the accessibility tree as a `domSnapshot` attachment, and submits it via POST. The reporter type is `"automated"`.
- A QA engineer uses Chrome DevTools Recorder to capture the steps that trigger an accessibility barrier: navigating to a checkout page, tabbing through the form, and failing to activate a button via keyboard. The engineer exports the recording as a JSON file and attaches it to their report as an `"other"` attachment. The operator's accessibility team replays the recording in a sandboxed browser to reproduce the issue, identifies the root cause, applies a fix, and replays the recording again to verify the barrier is resolved.

---

## 2. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHOULD", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

**Reporter:** Any party submitting an accessibility report — a human user, an assistive technology, a browser extension, or an automated or AI-based agent.

**Operator:** The party responsible for the website or application receiving reports.

**Discovery document:** The JSON resource served at `/.well-known/accessibility-reporting`.

**Report:** A structured JSON payload describing exactly one accessibility issue.

**Human-assisted report:** A report drafted or reviewed by a human but submitted by an agent on their behalf.

**Distinguished subtree:** A pattern of accessibility-tree roles and names — constructed from an element and its ancestors — that uniquely identifies the element within the page.

---

## 3. The Well-Known Resource

The protocol consists of two steps: discovery and submission. A reporter first fetches the discovery document to learn whether reporting is supported and where to send reports, then submits a report to the declared endpoint.

Figure 1: ASCII diagram of successful flow.<br>
<a href="#skipfigure-1">Skip ASCII image</a>
```
Reporter                              Operator
   |                                     |
   |  GET /.well-known/accessibility-reporting
   |------------------------------------>|
   |                                     |
   |  200 OK (discovery document)        |
   |<------------------------------------|
   |                                     |
   |  POST <endpoint> (Report Object)    |
   |------------------------------------>|
   |                                     |
   |  201 Created (Report Receipt)       |
   |<------------------------------------|
```
<a name="skipfigure-1"></a> 

A 404 response to the GET indicates no support. See [§5.1.2](#512-error-responses) for non-2xx responses to POST.

### 3.1 Location

A site supporting this specification MUST serve a discovery document at:

```
/.well-known/accessibility-reporting
```

relative to the origin of the site (as defined in RFC 6454).

### 3.2 Media Type

The discovery document MUST be served with the media type:

```
Content-Type: application/json
```

### 3.3 Discovery

Reporters discover the endpoint by issuing a GET request to `/.well-known/accessibility-reporting`. A response with HTTP status 200 and a valid discovery document indicates support. A 404 response indicates no support. Reporters SHOULD NOT infer support from any other status code.

Operators MAY use HTTP redirects (301, 302, 307, 308) to serve the discovery document from a different location.

### 3.4 Link-Based Discovery

As an alternative to probing the well-known URI directly, operators MAY advertise the discovery document using the `accessibility-reporting` link relation.

**HTTP `Link` header:** Operators MAY include the following header in responses from any page on the site:

```
Link: </.well-known/accessibility-reporting>; rel="accessibility-reporting"
```

**HTML `<link>` element:** Operators MAY include the following element in the `<head>` of any HTML page:

```html
<link rel="accessibility-reporting" href="/.well-known/accessibility-reporting">
```

In both cases, the `href` value MUST resolve to a valid discovery document. It MAY be a relative or absolute URI, and MAY point to a different origin (see [§4.2.1](#421-cross-origin-endpoints)).

Reporters encountering the `accessibility-reporting` link relation SHOULD fetch the referenced URI and treat it as the discovery document. If a reporter discovers both a link relation and a well-known URI, the link relation takes precedence, as it may point to a more specific or up-to-date resource.

---

## 4. Discovery Document Format

The discovery document is a JSON object. All fields are OPTIONAL unless stated otherwise.

### 4.1 Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | REQUIRED | Schema version. MUST be `"1.0"` for this version of the spec. |
| `reporting` | object | OPTIONAL | Describes the HTTP reporting endpoint. |
| `contact` | object | OPTIONAL | Human contact information for report submission. |
| `statement` | string (URI) | OPTIONAL | URI of the operator's accessibility statement or conformity declaration. For EU operators, this is the document required by EAA Article 13(2) / Annex V or WAD Article 7. |
| `enforcementProcedure` | string (URI) | OPTIONAL | URI of the relevant national enforcement or complaint procedure. For EU operators, this is the mechanism required by EAA Article 29 or WAD Article 9. |

A valid discovery document MUST include at least one of `reporting` or `contact`. A document containing neither is invalid and reporters SHOULD treat it as equivalent to a 404 response.

### 4.2 The `reporting` Object

If present, the `reporting` object describes the operator's HTTP reporting endpoint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `endpoint` | string (URI) | REQUIRED | The absolute URI to which reports are submitted. MUST use HTTPS. MAY be on a different origin than the site serving the discovery document (see [§4.2.1](#421-cross-origin-endpoints)). |
| `methods` | array of strings | OPTIONAL | HTTP methods supported by the endpoint. MUST include `"POST"`. Valid values: `"POST"`, `"GET"`, `"PUT"`, `"DELETE"`. Defaults to `["POST"]`. |
| `accepts` | object | OPTIONAL | Declares what report content the operator is prepared to receive. See [§4.3](#43-the-reportingaccepts-object). |
| `preferredLocales` | array of strings | OPTIONAL | BCP 47 language tags indicating the operator's preferred language(s) for report content. Reporters SHOULD use one of these languages when able. If absent, no preference is stated. |
| `authentication` | string | OPTIONAL | One of `"none"`, `"optional"`, `"required"`. Indicates whether authentication is needed to submit a report. The mechanism is not specified here; operators SHOULD document it via `authDocumentation` or the `WWW-Authenticate` response header (RFC 9110 §11.6.1). Defaults to `"none"`. |
| `authDocumentation` | string (URI) | OPTIONAL | URI of a human- and machine-readable document that describes how reporters obtain credentials and authenticate with the endpoint. Operators SHOULD provide this field when `authentication` is not `"none"`. |
| `rateLimit` | boolean | OPTIONAL | Advisory. If `true`, the operator advertises that it may reject or throttle reports that exceed an unspecified rate. If `false` (the default), the operator makes no such advertisement — but MAY still impose rate limits (see [§7.1](#71-rate-limiting)). Reporters SHOULD always handle HTTP 429 regardless of this field's value. |
| `responseTime` | string | OPTIONAL | Advisory. The operator's expected time to acknowledge or act on a submitted report (e.g., `"5 business days"`, `"48 hours"`). This is not a binding SLA; operators SHOULD treat it as a public commitment. Relevant to regulatory frameworks that require decisions on complaints within a reasonable time (e.g., EAA Recital 95). |

#### 4.2.1 Cross-Origin Endpoints

The `endpoint` URI MAY point to a different origin than the site serving the discovery document. This supports organizations that operate a centralized accessibility reporting service receiving reports on behalf of multiple sites or properties.

For example, `shop.example.com` might serve a discovery document whose endpoint points to a shared reporting service:

```json
{
  "version": "1.0",
  "reporting": {
    "endpoint": "https://accessibility.example.com/api/reports"
  }
}
```

When the endpoint is on a different origin, the endpoint server MUST serve appropriate CORS headers (see [§7.5](#75-cross-origin-requests)) to allow cross-origin submissions from browser-based reporters. Reporters MUST NOT reject an endpoint solely because it differs from the discovery document's origin.

Operators running multiple subdomains under a common identity may use this pattern to consolidate reporting. See [§9.9](#99-multi-subdomain-deployments) for subdomain deployment strategies.

### 4.3 The `reporting.accepts` Object

All fields are OPTIONAL. If the `accepts` object is absent, the operator's capabilities are unknown and reporters SHOULD submit minimal reports.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ruleVocabularies` | array of objects | OPTIONAL | Rule vocabularies the operator recognizes for issue classification, for use in the `rules` field of Issue Objects. See [§4.3.1](#431-the-rulevocabularies-array). |
| `attachments` | array of objects | OPTIONAL | Attachment types the operator accepts, with per-type configuration. See [§4.3.2](#432-the-attachments-array). |
| `maxPayloadKB` | integer | OPTIONAL | Maximum accepted HTTP request body size in kilobytes. This applies to the total JSON body as transmitted, including inline `json` and base64-encoded `data` attachments. Reporters using `data` SHOULD account for the ~33% size inflation of base64 encoding when estimating whether attachments will fit. If absent, no limit is stated. |
| `reporterContact` | boolean | OPTIONAL | Whether the operator accepts reporter contact information for follow-up. If `true`, the reporter MAY include a `contact` object in the `reporter` field ([§6.2.1](#621-the-reportercontact-object)). If `false` or absent, reporters SHOULD NOT include contact information, and operators MAY discard it. See [§10](#10-privacy-considerations) and [§11.6](#116-reporter-contact-data) for privacy considerations. Defaults to `false`. |

#### 4.3.1 The `ruleVocabularies` Array

Each element in the `ruleVocabularies` array declares a rule vocabulary (a named set of accessibility test rules) that the operator recognizes for issue classification. This covers WCAG success criteria, W3C ACT rules, third-party rule sets like axe-core and Lighthouse, and organization-specific rules. All use the same structure; none are special-cased.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | REQUIRED | A human-readable identifier for the vocabulary (e.g., `"WCAG 2.2"`, `"axe-core"`). |
| `prefix` | string | REQUIRED | The compact IRI prefix reporters SHOULD use for this vocabulary in `@context` and `rules` references (e.g., `"WCAG22"`, `"axe"`). |
| `namespace` | string (URI) | REQUIRED | The IRI namespace the prefix expands to. Together with a rule's local name, this forms the rule's canonical URI (e.g., `"https://www.w3.org/TR/WCAG22/#"` + `"name-role-value"`, or `"https://dequeuniversity.com/rules/axe/4.10/"` + `"empty-heading"`). |
| `version` | string | OPTIONAL | The version of the vocabulary (e.g., `"2.2"`, `"4.10"`). |
| `reference` | string (URI) | OPTIONAL | A URI pointing to the vocabulary's documentation or rule listing. For WCAG, this SHOULD be the canonical W3C WCAG JSON definition (e.g., `"https://www.w3.org/WAI/WCAG22/wcag.json"`), which allows both parties to resolve full criterion metadata — including the success criterion number, conformance level, and human-readable title — from the canonical source. |

**Example:**

```json
"ruleVocabularies": [
  {
    "name": "WCAG 2.2",
    "prefix": "WCAG22",
    "namespace": "https://www.w3.org/TR/WCAG22/#",
    "version": "2.2",
    "reference": "https://www.w3.org/WAI/WCAG22/wcag.json"
  },
  {
    "name": "ACT Rules",
    "prefix": "act",
    "namespace": "https://www.w3.org/WAI/standards-guidelines/act/rules/",
    "reference": "https://www.w3.org/WAI/standards-guidelines/act/rules/"
  },
  {
    "name": "axe-core",
    "prefix": "axe",
    "namespace": "https://dequeuniversity.com/rules/axe/4.10/",
    "version": "4.10",
    "reference": "https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md"
  }
]
```

When a reporter encounters a `ruleVocabularies` entry, it SHOULD include the declared `prefix` and `namespace` in the report's `@context` ([§6.1.1](#611-the-context-object)), and reference rules from that vocabulary in the `rules` field of Issue Objects ([§6.3.2](#632-the-rules-array)) using the declared prefix.

If `ruleVocabularies` is absent or empty, the operator does not declare support for any rule vocabulary. Reporters MAY still include `rules` references using custom prefixes; operators without a declared vocabulary preference SHOULD treat these as informational.

#### 4.3.2 The `attachments` Array

Each element in the `attachments` array declares an attachment type the operator accepts, along with per-type configuration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | REQUIRED | The attachment type. Defined values: `"screenshot"`, `"domSnapshot"`, `"video"`, `"other"`. |
| `mimeTypes` | array of strings | OPTIONAL | MIME types accepted for this attachment type (e.g., `["image/png", "image/jpeg"]`). If absent, any MIME type is accepted. |
| `formats` | array of strings | OPTIONAL | Named sub-formats accepted for this type (e.g., `["accessibility-tree", "dom-fragment"]` for `domSnapshot`). If absent, any format is accepted. |
| `maxSizeKB` | integer | OPTIONAL | Maximum size in kilobytes for this individual attachment. If absent, the only limit is `maxPayloadKB` on the total request body. |
| `urlOnly` | boolean | OPTIONAL | If `true`, the operator only accepts URL references (`url` field) for this type, not inline content (`json` or `data`). Defaults to `false`. |
| `urlPolicy` | string | OPTIONAL | One of `"open"`, `"authenticated"`. If `"authenticated"`, URL-referenced attachments of this type require reporter authentication. If absent, URL references follow the endpoint's general `authentication` policy. See [§11.3](#113-url-referenced-attachments). |

**Example:**

```json
"attachments": [
  {
    "type": "screenshot",
    "mimeTypes": ["image/png", "image/jpeg"],
    "maxSizeKB": 256
  },
  {
    "type": "domSnapshot",
    "mimeTypes": ["text/html", "application/json"],
    "formats": ["accessibility-tree", "dom-fragment"],
    "maxSizeKB": 128
  },
  {
    "type": "video",
    "urlOnly": true,
    "urlPolicy": "authenticated"
  },
  {
    "type": "other",
    "maxSizeKB": 64
  }
]
```

The following `domSnapshot` format values are defined by this specification:

- `"accessibility-tree"`: A JSON representation of the page's accessibility tree, structured as a hierarchy of accessible objects with roles, names, states, and relationships. The exact schema is implementation-defined; common implementations follow browser accessibility APIs such as the Chrome DevTools Protocol AXNode structure (see [§9.7](#97-accessibility-tree-snapshot-tools)).
- `"dom-fragment"`: A serialized HTML fragment containing the relevant portion of the DOM, typically rooted at or near the affected element. Transmitted as a string via the `data` field (base64-encoded) with `mimeType` set to `"text/html"`.

Operators and reporters MAY use additional format values beyond those defined here. Operators that include a format string in their `domSnapshot` attachment declaration accept attachments using that format.

If `attachments` is absent or empty, the operator does not declare support for any attachment type. Reporters SHOULD NOT include attachments unless the operator has declared support for the relevant type.

The `"other"` type serves as a catch-all for attachment formats not separately specified, such as browser automation recordings (see [§6.4.2](#642-browser-automation-recordings)) or EARL assertion documents (see [§6.3.3](#633-earl-assertions-as-attachments)). Reporters using the `"other"` type SHOULD set the `mimeType` and `description` fields on the attachment to help operators identify the content.

### 4.4 The `contact` Object

Provides human contact information. This is the primary submission channel when `reporting` is absent, and a fallback when automated submission fails or is rejected. If present, the `contact` object MUST contain at least one field.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | OPTIONAL | Email address of the accessibility coordinator or team. SHOULD use `mailto:` URI format. |
| `phone` | string | OPTIONAL | Voice phone number for accessibility reporting. SHOULD use `tel:` URI format (e.g., `"tel:+1-555-0100"`). Required by some regulatory frameworks (e.g., the European Accessibility Act) as an alternative reporting channel. |
| `tty` | string | OPTIONAL | TTY/TDD phone number. SHOULD use `tel:` URI format. |
| `relay` | string | OPTIONAL | Telecommunications relay service number (e.g., `"tel:711"` in the US). SHOULD use `tel:` URI format. |
| `name` | string | OPTIONAL | Display name for the contact (e.g., `"Accessibility Team"`). |
| `contactType` | string | OPTIONAL | The purpose or role of this contact point (e.g., `"accessibility"`, `"technical support"`, `"customer service"`). Follows the schema.org `contactType` convention. |
| `url` | string (URI) | OPTIONAL | A human-accessible web page for reporting issues (e.g., a feedback form). |

### 4.5 Example Discovery Documents

**Full document with HTTP endpoint:**

```json
{
  "version": "1.0",
  "reporting": {
    "endpoint": "https://example.com/api/accessibility-reports",
    "methods": ["POST", "GET", "PUT"],
    "accepts": {
      "ruleVocabularies": [
        {
          "name": "WCAG 2.2",
          "prefix": "WCAG22",
          "namespace": "https://www.w3.org/TR/WCAG22/#",
          "version": "2.2",
          "reference": "https://www.w3.org/WAI/WCAG22/wcag.json"
        },
        {
          "name": "ACT Rules",
          "prefix": "act",
          "namespace": "https://www.w3.org/WAI/standards-guidelines/act/rules/"
        },
        {
          "name": "axe-core",
          "prefix": "axe",
          "namespace": "https://dequeuniversity.com/rules/axe/4.10/",
          "version": "4.10",
          "reference": "https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md"
        }
      ],
      "attachments": [
        {
          "type": "screenshot",
          "mimeTypes": ["image/png", "image/jpeg"],
          "maxSizeKB": 256
        },
        {
          "type": "domSnapshot",
          "mimeTypes": ["text/html", "application/json"],
          "formats": ["accessibility-tree", "dom-fragment"]
        },
        {
          "type": "video",
          "urlOnly": true,
          "urlPolicy": "authenticated"
        },
        {
          "type": "other",
          "maxSizeKB": 64
        }
      ],
      "maxPayloadKB": 512,
      "reporterContact": true
    },
    "preferredLocales": ["en", "fr"],
    "authentication": "optional",
    "authDocumentation": "https://example.com/api/accessibility-reports/auth",
    "rateLimit": true,
    "responseTime": "5 business days"
  },
  "contact": {
    "email": "mailto:accessibility@example.com",
    "phone": "tel:+1-555-0100",
    "tty": "tel:+1-555-0101",
    "relay": "tel:711",
    "name": "Accessibility Team",
    "contactType": "accessibility",
    "url": "https://example.com/accessibility/feedback"
  },
  "statement": "https://example.com/accessibility/statement",
  "enforcementProcedure": "https://example.com/accessibility/enforcement"
}
```

**Contact-only document (no HTTP endpoint):**

```json
{
  "version": "1.0",
  "contact": {
    "email": "mailto:accessibility@example.com",
    "phone": "tel:+1-555-0100",
    "tty": "tel:+1-555-0101",
    "name": "Accessibility Team",
    "contactType": "accessibility",
    "url": "https://example.com/accessibility/feedback"
  }
}
```

### 4.6 Extensibility and Version Handling

This specification uses a "must-ignore" extensibility model. Consumers of discovery documents and report payloads — both operators and reporters — MUST ignore any fields they do not recognize. This allows future minor versions (e.g., `"1.1"`) to add new fields without breaking existing implementations.

Operators MUST NOT reject a report solely because it contains unrecognized fields. Operators MAY reject a report whose `version` field indicates an incompatible major version (e.g., `"2.0"` when the operator only supports `"1.x"`).

Reporters SHOULD set `version` to the version of this specification they conform to. Reporters SHOULD NOT assume that an operator supports any fields beyond those defined in the version declared in the operator's discovery document.

Validators MAY issue warnings for unrecognized fields but MUST NOT reject documents or reports solely because they contain unknown fields.

---

## 5. Reporting API

### 5.1 Submitting a Report (POST) — REQUIRED

To submit a report, the reporter sends an HTTP POST request to the endpoint declared in the discovery document.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: A Report Object (see [§6](#6-report-schema))

**Response status codes:**

| Code | Meaning |
|------|---------|
| 201 Created | Report accepted. Response body SHOULD contain a Report Receipt ([§5.1.1](#511-report-receipt)). |
| 400 Bad Request | Report payload is malformed or missing required fields. |
| 401 Unauthorized | Authentication is required. The response MUST include a `WWW-Authenticate` header per RFC 9110 §15.5.2. The response body SHOULD be an error object ([§5.1.2](#512-error-responses)) with `error` set to `"unauthorized"`. |
| 403 Forbidden | Report rejected (e.g., blocked reporter, immutable field change). |
| 409 Conflict | An equivalent report already exists. Response body SHOULD reference the existing report. |
| 413 Payload Too Large | Report exceeds `maxPayloadKB`. |
| 422 Unprocessable Entity | Report is structurally valid but cannot be processed (e.g., unrecognized page URL). |
| 429 Too Many Requests | Rate limit exceeded. Response MAY include a `Retry-After` header. |

**Redirects:** The reporting endpoint MAY return redirect responses. Operators that need to redirect POST requests MUST use 307 (Temporary Redirect) or 308 (Permanent Redirect). Using 301 or 302 for POST endpoints will silently break reporters, as most HTTP clients convert these to GET, losing the report payload.

Reporters MUST follow 307 and 308 responses by reissuing the POST to the new URI. Reporters MUST NOT follow 301 or 302 redirects for POST requests. If a 301 or 302 is received in response to a POST, the reporter SHOULD treat it as an endpoint misconfiguration, surface a distinct error to the user (e.g., "the reporting endpoint appears misconfigured"), and present the operator's `contact` information ([§4.4](#44-the-contact-object)) as a fallback channel.

Reporters SHOULD follow no more than 5 redirects for any single request. If the limit is exceeded, the reporter SHOULD treat it as an error. See [§11.1](#111-transport-security) for security considerations related to redirect loops.

**Server errors:** When the endpoint returns a 5xx status code (500, 502, 503, 504), the reporter SHOULD treat the failure as transient and MAY retry the request. Reporters SHOULD use exponential backoff, starting with a delay of at least 1 second, and SHOULD NOT retry more than 3 times. If a `Retry-After` header is present, the reporter MUST respect it. After exhausting retries, the reporter SHOULD surface the failure to the user and present the operator's `contact` information ([§4.4](#44-the-contact-object)) as a fallback channel.

#### 5.1.1 Report Receipt

On success (201), the response body SHOULD be a JSON object (see [Appendix I](#appendix-i-report-receipt-json-schema) for the JSON Schema):

```json
{
  "id": "rpt-abc123",
  "status": "received",
  "message": "Thank you. Your report has been logged.",
  "url": "https://example.com/api/accessibility-reports/rpt-abc123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | REQUIRED | Operator-assigned report identifier. |
| `status` | string | OPTIONAL | Receipt status: one of `"received"`, `"pending-review"`. These values reflect initial processing only; once a report enters the operator's workflow, its status transitions to report lifecycle values (see [§5.2.2](#522-authenticated-get)). |
| `message` | string | OPTIONAL | Human-readable message, in a language from the operator's declared `preferredLocales`. |
| `url` | string (URI) | CONDITIONAL | Absolute URI where the reporter may retrieve report status (if GET is supported). MUST be an absolute URI (scheme + authority + path). REQUIRED if the operator declares `"PUT"` or `"DELETE"` in `reporting.methods`; OPTIONAL otherwise. |

#### 5.1.2 Error Responses

Actionable error responses help reporters resubmit successfully. A rejection that does not explain what went wrong costs the operator a valid report. Operators SHOULD design error responses that help both human reporters and automated agents understand what to change.

On failure (4xx), the response body SHOULD be a JSON object with the following structure (see [Appendix J](#appendix-j-error-response-json-schema) for the JSON Schema):

```json
{
  "error": "validation_failed",
  "message": "Report payload is invalid.",
  "details": [
    { "field": "data.rules[0]", "reason": "Must be an object with @type (earl:TestRequirement or earl:TestCase) and @id (compact IRI)" }
  ],
  "retryAfter": 60
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `error` | string | REQUIRED | A machine-readable error code (e.g., `"payload_too_large"`, `"validation_failed"`, `"rate_limited"`, `"duplicate"`, `"unauthorized"`). |
| `message` | string | REQUIRED | A human-readable description of the error, in a language from the operator's declared `preferredLocales`. SHOULD explain what went wrong and suggest how to fix it. |
| `details` | array | OPTIONAL | An array of objects describing field-level errors. Each object SHOULD contain `field` (a JSON path to the problematic field) and `reason` (a human-readable explanation). Operators MAY include additional properties on detail objects for machine-readable context (e.g., `limit`, `actual`); reporters SHOULD ignore unrecognized properties. The `details` array is optional but encouraged — it helps both agents and humans understand exactly what to fix and resubmit successfully. |
| `retryAfter` | integer | OPTIONAL | Seconds until the reporter may retry. Operators SHOULD include this for 429 responses. When present, the HTTP `Retry-After` header SHOULD carry the same value. |

**413 Payload Too Large:** When rejecting a report for exceeding size limits, operators SHOULD include a `message` that explains which limit was exceeded (total payload or a specific attachment) and suggests using URL-referenced attachments as an alternative to inline content. See [§6.4](#64-attachments) for guidance on URL-referenced attachments.

**Example 413 error response:**

```json
{
  "error": "payload_too_large",
  "message": "Report body exceeds the 512 KB limit. Consider hosting large attachments externally and using the 'url' field instead of inline 'data'.",
  "details": [
    {
      "field": "attachments[0].data",
      "reason": "Attachment exceeds limit. Use the 'url' field to reference externally hosted content.",
      "limit": "256 KB",
      "actual": "380 KB"
    }
  ]
}
```

### 5.2 Endpoint Discovery and Status (GET) — OPTIONAL

If the operator declares `"GET"` in `reporting.methods`, reporters MAY issue a GET request to the endpoint URI.

#### 5.2.1 Unauthenticated GET

A GET request without authentication MUST return an Endpoint Descriptor object describing the endpoint's capabilities and accepted report schema. This allows reporters — including agents encountering the endpoint for the first time — to understand what the endpoint accepts without attempting a submission.

The Endpoint Descriptor is the authoritative, runtime source of truth for the endpoint's capabilities. If values in the Endpoint Descriptor differ from those in the discovery document ([§4](#4-discovery-document-format)), the Endpoint Descriptor takes precedence. The discovery document is sufficient for initial discovery and simple reporters; the GET request provides the current state for reporters that need it.

Fields that appear inside the `reporting` object in the discovery document (e.g., `methods`, `accepts`, `preferredLocales`, `authentication`, `authDocumentation`) appear at the top level in the Endpoint Descriptor. The flattening is intentional: the discovery document nests these fields because it also contains the top-level `version`, `contact`, and other non-endpoint metadata, while the Endpoint Descriptor describes only the endpoint itself, so no wrapper is needed.

**Response body** (200 OK):

```json
{
  "version": "1.0",
  "description": "Accessibility issue reporting endpoint for Example Corp",
  "accepts": {
    "ruleVocabularies": [
      {
        "name": "WCAG 2.2",
        "prefix": "WCAG22",
        "namespace": "https://www.w3.org/TR/WCAG22/#",
        "version": "2.2",
        "reference": "https://www.w3.org/WAI/WCAG22/wcag.json"
      },
      {
        "name": "ACT Rules",
        "prefix": "act",
        "namespace": "https://www.w3.org/WAI/standards-guidelines/act/rules/"
      },
      {
        "name": "axe-core",
        "prefix": "axe",
        "namespace": "https://dequeuniversity.com/rules/axe/4.10/",
        "version": "4.10",
        "reference": "https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md"
      }
    ],
    "attachments": [
      {
        "type": "screenshot",
        "mimeTypes": ["image/png", "image/jpeg"],
        "maxSizeKB": 256
      },
      {
        "type": "domSnapshot",
        "mimeTypes": ["text/html", "application/json"],
        "formats": ["accessibility-tree", "dom-fragment"]
      },
      {
        "type": "video",
        "urlOnly": true,
        "urlPolicy": "authenticated"
      },
      {
        "type": "other",
        "maxSizeKB": 64
      }
    ],
    "maxPayloadKB": 512,
    "reporterContact": true
  },
  "methods": ["POST", "GET", "PUT"],
  "preferredLocales": ["en", "fr"],
  "authentication": "optional",
  "authDocumentation": "https://example.com/api/accessibility-reports/auth",
  "rateLimit": true,
  "responseTime": "5 business days",
  "schema": "https://example.com/api/accessibility-reports/schema.json",
  "mutableFields": ["data", "attachments"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | OPTIONAL | Schema version of this descriptor. |
| `description` | string | OPTIONAL | Human-readable description of the endpoint. |
| `accepts` | object | OPTIONAL | Same structure as `reporting.accepts` in the discovery document. |
| `methods` | array of strings | OPTIONAL | HTTP methods supported. |
| `preferredLocales` | array of strings | OPTIONAL | Operator's preferred report language(s). |
| `authentication` | string | OPTIONAL | Authentication requirement, as declared in the discovery document. |
| `authDocumentation` | string (URI) | OPTIONAL | Same semantics as `reporting.authDocumentation` in the discovery document ([§4.2](#42-the-reporting-object)). |
| `rateLimit` | boolean | OPTIONAL | Advisory. Same semantics as `reporting.rateLimit` in the discovery document ([§4.2](#42-the-reporting-object)). |
| `responseTime` | string | OPTIONAL | Advisory. Same semantics as `reporting.responseTime` in the discovery document ([§4.2](#42-the-reporting-object)). |
| `schema` | string (URI) | OPTIONAL | URI pointing to a machine-readable JSON Schema for the report payload. This MAY be the base schema defined in [Appendix E](#appendix-e-report-json-schema), or an operator-specific schema that extends or constrains it (e.g., requiring additional fields, restricting `impact` values, or limiting attachment types). |
| `mutableFields` | array of strings | OPTIONAL | Top-level report field names indicating which fields may be amended via PUT (see [§5.3](#53-amending-a-report-put--optional)). If absent and PUT is supported, the set of mutable fields is unspecified and reporters SHOULD consult operator documentation. |

#### 5.2.2 Authenticated GET

When authentication is provided, the endpoint MAY additionally return information associated with the authenticated reporter. The operator has full discretion over what is returned; possible responses include:

- Reports submitted by the authenticated reporter, with their current status
- A summary of all reports (e.g., aggregate counts, open issues across the site)
- Both of the above

This enables an AI agent to check whether a previously submitted issue has been resolved before re-reporting it during a future session.

**Response body** (200 OK, when report data is returned): An array of Report Status Objects:

```json
[
  {
    "id": "rpt-abc123",
    "status": "open",
    "url": "https://example.com/.well-known/accessibility-reporting/reports/rpt-abc123",
    "created": "2025-06-01T10:30:00Z",
    "updated": "2025-06-03T08:15:00Z",
    "page": "https://example.com/checkout",
    "summary": "Button missing accessible name"
  },
  {
    "id": "rpt-xyz789",
    "status": "wont-fix",
    "url": "https://example.com/.well-known/accessibility-reporting/reports/rpt-xyz789",
    "created": "2025-05-20T14:00:00Z",
    "updated": "2025-06-02T09:00:00Z",
    "page": "https://example.com/legacy-widget",
    "summary": "Legacy date picker not keyboard-accessible",
    "reason": "Disproportionate burden (EAA Article 14). Replacement planned for Q1."
  }
]
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | REQUIRED | The operator-assigned report identifier (same as the receipt `id`). |
| `status` | string | REQUIRED | Report lifecycle status: one of `"open"`, `"in-progress"`, `"resolved"`, `"closed"`, `"duplicate"`, `"wont-fix"`. |
| `url` | string (URI) | CONDITIONAL | Absolute URI that the reporter MAY use as the target for PUT ([§5.3](#53-amending-a-report-put--optional)) or DELETE ([§5.4](#54-retracting-a-report-delete--optional)) requests. REQUIRED when `reporting.methods` includes `"PUT"` or `"DELETE"`; OPTIONAL otherwise. |
| `created` | string (ISO 8601) | OPTIONAL | When the report was originally submitted. |
| `updated` | string (ISO 8601) | OPTIONAL | When the report status last changed. |
| `page` | string (URI) | OPTIONAL | The page URL from the original report. |
| `summary` | string | OPTIONAL | A short description of the reported issue. |
| `reason` | string | OPTIONAL | Human-readable explanation for the current status, especially when the status is `"wont-fix"` or `"closed"`. Operators MAY use this to cite regulatory defenses (e.g., disproportionate burden under EAA Article 14) or other justifications. |

Report lifecycle status values are distinct from the receipt status values returned at submission time ([§5.1.1](#511-report-receipt)); once the operator begins processing a report, its status transitions from the receipt set (`"received"`, `"pending-review"`) to the lifecycle set.

The operator MAY wrap the response in an object that includes the Endpoint Descriptor alongside the report data. When wrapping, the operator MUST use the field name `"reports"` for the Report Status Object array. For example: `{ "endpoint": { ... }, "reports": [ ... ] }`.

**Response shape detection.** An authenticated GET response is always a 200 OK with a JSON body. Reporters MUST determine the response shape using the following algorithm:

1. If the top-level JSON value is an **array**, the response contains Report Status Objects only.
2. If the top-level JSON value is an **object** with a `"reports"` key, the response is a wrapped object. The `"reports"` value is the array of Report Status Objects; other keys (e.g., `"endpoint"`) contain supplementary data such as the Endpoint Descriptor.
3. If the top-level JSON value is an **object** without a `"reports"` key, the response is an Endpoint Descriptor (same as the unauthenticated GET response in [§5.2.1](#521-unauthenticated-get)). No report data is included — for example, the reporter may not have any submitted reports.

Reporters MUST NOT assume the response shape in advance; it MAY vary between requests (e.g., an operator might return an Endpoint Descriptor when the reporter has no reports and a wrapped object once reports exist).

### 5.3 Amending a Report (PUT) — OPTIONAL

If the operator declares `"PUT"` in `reporting.methods`, an authenticated reporter MAY amend a previously submitted report by sending a PUT request to the report's URL (as returned in the receipt or GET response).

PUT is only available for authenticated flows. If `"PUT"` is included in `reporting.methods`, the `authentication` field MUST NOT be `"none"`. The operator MUST reject unauthenticated PUT requests with HTTP 401. The operator SHOULD verify that the authenticated reporter is the original submitter of the report before processing the amendment.

The PUT body follows the same schema as the POST body ([§6](#6-report-schema)) and represents a full replacement of the mutable portion of the report. Reporters MUST include all REQUIRED fields (`version`, `data`) and all mutable fields they wish to set. Immutable OPTIONAL fields (e.g., `reporter`, `page`) MAY be omitted; if included, their values MUST match the original submission — the operator MUST reject the request with 403 if any immutable field's value differs from the original. If `mutableFields` is declared ([§5.2.1](#521-unauthenticated-get)), only the listed fields may be changed. If `mutableFields` is not declared, the set of amendable fields is unspecified and reporters SHOULD consult operator documentation.

**Response status codes:**

| Code | Meaning |
|------|---------|
| 200 OK | Report successfully amended. Response body SHOULD contain a Report Status Object with the report's current lifecycle status (e.g., `"open"`, `"in-progress"`), not a receipt status. |
| 400 Bad Request | Report payload is malformed or missing required fields. |
| 401 Unauthorized | Authentication is required. The response MUST include a `WWW-Authenticate` header (see [§5.1](#51-submitting-a-report-post--required), [§7.4](#74-authentication)). |
| 403 Forbidden | The authenticated reporter is not the original submitter, or the request attempts to amend an immutable field. |
| 404 Not Found | No report exists at the given URL. |
| 413 Payload Too Large | Report exceeds `maxPayloadKB`. |
| 429 Too Many Requests | Rate limit exceeded. Response MAY include a `Retry-After` header. |

### 5.4 Retracting a Report (DELETE) — OPTIONAL

If the operator declares `"DELETE"` in `reporting.methods`, an authenticated reporter MAY retract a previously submitted report by sending a DELETE request to the report's URL (as returned in the receipt or GET response).

DELETE is only available for authenticated flows. If `"DELETE"` is included in `reporting.methods`, the `authentication` field MUST NOT be `"none"`. The operator MUST reject unauthenticated DELETE requests with HTTP 401. The operator SHOULD verify that the authenticated reporter is the original submitter of the report before processing the deletion.

**Response status codes:**

| Code | Meaning |
|------|---------|
| 204 No Content | Report successfully retracted. |
| 401 Unauthorized | Authentication is required. The response MUST include a `WWW-Authenticate` header (see [§5.1](#51-submitting-a-report-post--required), [§7.4](#74-authentication)). |
| 403 Forbidden | The authenticated reporter is not the original submitter, or retraction is not permitted for this report. |
| 404 Not Found | No report exists at the given URL. |
| 429 Too Many Requests | Rate limit exceeded. Response MAY include a `Retry-After` header. |

Operators MAY retain retracted reports internally for audit purposes but MUST NOT expose them via GET after deletion.

---

## 6. Report Schema

A report is a JSON document that uses JSON-LD conventions. All fields are OPTIONAL unless stated otherwise. Operators SHOULD accept reports that omit any optional field.

### 6.1 Top-Level Report Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `@context` | object or string | CONDITIONAL | JSON-LD context defining compact IRI prefixes used in the report. REQUIRED if the Issue Object contains a `rules` array; RECOMMENDED otherwise. See [§6.1.1](#611-the-context-object). |
| `version` | string | REQUIRED | Schema version. MUST be `"1.0"`. |
| `page` | string (URI) | RECOMMENDED | The URL of the page where the issue was observed. |
| `reporter` | object | OPTIONAL | Information about the reporter. See [§6.2](#62-the-reporter-object). |
| `data` | object | REQUIRED | The Issue Object. See [§6.3](#63-issue-object). |
| `attachments` | array | OPTIONAL | Attachments such as screenshots. See [§6.4](#64-attachments). |
| `timestamp` | string (ISO 8601) | OPTIONAL | When the issue was observed. |
| `locale` | string (BCP 47) | OPTIONAL | Language of the report content (descriptions, etc.). |

#### 6.1.1 The `@context` Object

Reports use JSON-LD compact IRIs to reference accessibility rules in the `rules` field of Issue Objects ([§6.3.2](#632-the-rules-array)), following ACT Rules Format 1.1 and EARL 1.0 conventions.

When the Issue Object contains a `rules` array, reporters MUST include an `@context` that defines every prefix used in `@type` and `@id` values within those rules, plus one entry for each rule vocabulary referenced. When no `rules` are present, reporters SHOULD still include `@context` if the report uses any compact IRIs. The prefixes and namespaces SHOULD match those declared in the operator's `reporting.accepts.ruleVocabularies` ([§4.3.1](#431-the-rulevocabularies-array)):

```json
"@context": {
  "earl": "http://www.w3.org/ns/earl#",
  "WCAG22": "https://www.w3.org/TR/WCAG22/#",
  "act": "https://www.w3.org/WAI/standards-guidelines/act/rules/",
  "axe": "https://dequeuniversity.com/rules/axe/4.10/"
}
```

The `earl` prefix is required when the report uses the RECOMMENDED EARL types (`earl:TestRequirement`, `earl:TestCase`) in rule references. Reports using only custom `@type` values from other vocabularies do not need the `earl` prefix. The remaining prefixes depend on which rule vocabularies the report references. Common examples:

| Prefix | IRI | Description |
|--------|-----|-------------|
| `earl` | `http://www.w3.org/ns/earl#` | EARL 1.0 vocabulary. Used for the RECOMMENDED `@type` values (`earl:TestRequirement`, `earl:TestCase`). Required when EARL types are used. |
| `WCAG22` | `https://www.w3.org/TR/WCAG22/#` | WCAG 2.2 success criteria. `WCAG22:name-role-value` expands to `https://www.w3.org/TR/WCAG22/#name-role-value`. |
| `WCAG21` | `https://www.w3.org/TR/WCAG21/#` | WCAG 2.1 success criteria. Include only if the report references WCAG 2.1 criteria. |
| `act` | `https://www.w3.org/WAI/standards-guidelines/act/rules/` | W3C ACT Rules. `act:23a2a8` expands to the canonical rule URL. |
| `axe` | `https://dequeuniversity.com/rules/axe/4.10/` | axe-core rules. `axe:empty-heading` expands to the Deque rule documentation URL. |

The `@context` MAY be provided as a string URI referencing an externally hosted context document rather than an inline object. The set of prefixes above is not closed; reporters MAY include additional prefixes for any vocabulary.

Operators MUST NOT reject a report solely because it includes an `@context` field. Operators that do not process JSON-LD MAY ignore `@context` and treat `@type`/`@id` objects as opaque structured data, extracting the `@id` value as a plain string identifier.

### 6.2 The `reporter` Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | OPTIONAL | One of `"human"`, `"automated"`, `"human-assisted"`. `"human-assisted"` indicates a report drafted or reviewed by a human but submitted by an agent. |
| `userAgent` | string | OPTIONAL | Browser or tool user agent string. |
| `assistiveTechnology` | string | OPTIONAL | Name and version of any assistive technology in use (e.g., `"JAWS 2024"`, `"Dragon NaturallySpeaking 15"`). |
| `locale` | string (BCP 47) | OPTIONAL | Reporter's locale (e.g., `"en-US"`, `"fr-FR"`). |
| `identity` | string | OPTIONAL | Opaque identifier for the reporter (e.g., a username, email, or token). Only included when authentication is in use and the reporter consents. |
| `contact` | object | OPTIONAL | Contact information for follow-up. Only included when the operator declares `reporterContact: true` in `accepts` ([§4.3](#43-the-reportingaccepts-object)) and the reporter consents to being contacted. See [§6.2.1](#621-the-reportercontact-object). |

#### 6.2.1 The `reporter.contact` Object

When the operator's discovery document sets `reporting.accepts.reporterContact` to `true`, reporters MAY include a `contact` object to allow the operator to follow up — for example, to request reproduction steps, clarify the report, or notify the reporter of a fix. All fields are OPTIONAL; the reporter decides what to share.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | OPTIONAL | Display name for the reporter (e.g., `"Jane Doe"`). |
| `email` | string | OPTIONAL | Email address. SHOULD use `mailto:` URI format (e.g., `"mailto:jane@example.com"`). |
| `url` | string (URI) | OPTIONAL | A URL where the reporter can be reached (e.g., a profile page or contact form). |

Reporters MUST NOT include `contact` when the operator has not declared `reporterContact: true`. Operators that receive a `contact` object when `reporterContact` is not enabled SHOULD ignore it and MUST NOT store or process the contact data. See [§10](#10-privacy-considerations) and [§11.6](#116-reporter-contact-data) for privacy considerations.

**Example:**

```json
"reporter": {
  "type": "human",
  "userAgent": "Mozilla/5.0 ...",
  "assistiveTechnology": "NVDA 2024.1",
  "contact": {
    "name": "Jane Doe",
    "email": "mailto:jane@example.com"
  }
}
```

### 6.3 Issue Object

The `data` field contains a single Issue Object.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | REQUIRED | Human-readable description of the issue. |
| `page` | string (URI) | OPTIONAL | The URL of the page where this specific issue was observed. When present, overrides the top-level `page` field ([§6.1](#61-top-level-report-fields)) for this issue. If absent, the issue inherits the top-level `page` value. |
| `impact` | string | OPTIONAL | Reporter's assessment of the severity of the barrier. This specification RECOMMENDS the following vocabulary: `"blocker"` (cannot complete the task at all), `"critical"` (severe barrier, workaround is unreasonably difficult), `"major"` (significant difficulty but a workaround exists), `"minor"` (some difficulty, low friction), `"cosmetic"` (noticeable but no functional barrier). These values are suggestions only; operators MAY document a different set of preferred values aligned with their issue tracking system, and reporters MAY use any string. |
| `rules` | array of objects | OPTIONAL | Accessibility rules implicated, as JSON-LD typed references. Covers all vocabularies — WCAG success criteria, W3C ACT rules, axe-core best practices, and any other vocabulary declared in `reporting.accepts.ruleVocabularies` ([§4.3.1](#431-the-rulevocabularies-array)). Each entry is an object with `@type` and `@id`. See [§6.3.2](#632-the-rules-array). |
| `element` | object | OPTIONAL | A description of the affected element. See [§6.3.1](#631-the-element-object). |
| `steps` | string | OPTIONAL | Steps to reproduce the issue. |
| `attachments` | array of objects | OPTIONAL | Attachments specific to this issue (e.g., a screenshot showing the affected element). Each entry follows the same schema as top-level attachments ([§6.4](#64-attachments)). Issue-level attachments associate evidence with the specific issue it documents. |

Top-level attachments ([§6.4](#64-attachments)) apply to the report as a whole or are not specific to any single issue. Reporters MAY use both: issue-level attachments for issue-specific evidence and top-level attachments for report-wide context (e.g., a full-page screenshot or a session recording).

#### 6.3.1 The `element` Object

The `element` object describes the affected element using three complementary mechanisms: locators (how to find the element), a snapshot (what the element's accessibility state looked like), and a human-readable label.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `locators` | array of objects | OPTIONAL | An ordered list of strategies for locating the element. See [§6.3.1.1](#6311-the-locators-array). |
| `snapshot` | object | OPTIONAL | The accessibility tree state of the element at the time the issue was observed. See [§6.3.1.2](#6312-the-snapshot-object). |
| `label` | string | OPTIONAL | A human-readable description (e.g., `"Submit button in checkout form"`). |

##### 6.3.1.1 The `locators` Array

Each element in the `locators` array is a typed locator identifying the affected element using a specific strategy.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | REQUIRED | The locator strategy. Defined values: `"css"`, `"aria"`, `"xpath"`, `"text"`, `"pierce"`, `"testid"`. Reporters MAY use other values. |
| `value` | string | REQUIRED | The locator value appropriate to the strategy. |

**Defined locator types:**

| Type | Description | Example value |
|------|-------------|---------------|
| `css` | CSS selector | `"#checkout-submit"` |
| `aria` | Accessible name match | `"Submit Order"` |
| `xpath` | XPath expression | `"/html/body/form/button[2]"` |
| `text` | Visible text content match | `"Place Order"` |
| `pierce` | Shadow DOM piercing selector | `"checkout-form >>> button.submit"` |
| `testid` | `data-testid` attribute match | `"checkout-submit-btn"` |

The array is ordered by reporter preference, with the first entry being the reporter's best or most reliable match. Reporters SHOULD prefer semantic locators (`aria`, `text`) over structural ones (`css`, `xpath`) when available, as semantic locators are more resilient to DOM changes.

Reporters SHOULD provide locators that uniquely identify the element on the page. If a locator matches multiple elements, the reporter SHOULD include additional locator types or provide a distinguishing `snapshot` subtree ([§6.3.1.2](#6312-the-snapshot-object)) with enough ancestor context to disambiguate.

##### 6.3.1.2 The `snapshot` Object

The `snapshot` object captures the accessibility tree state of the affected element at the time the issue was observed. It is modeled on the Chrome DevTools Protocol `AXNode` type, simplified for reporting. This is the *evidence* — it describes what the reporter observed, not how to find the element.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | OPTIONAL | The ARIA or implicit role of the element. |
| `name` | string | OPTIONAL | The computed accessible name. An empty string indicates the element has no accessible name. |
| `description` | string | OPTIONAL | The computed accessible description. |
| `value` | string or null | OPTIONAL | The current value of the element, if applicable (e.g., input value, slider position). |
| `states` | object | OPTIONAL | An object of boolean or null properties representing the element's accessibility states (e.g., `disabled`, `focused`, `expanded`, `checked`, `selected`, `pressed`). A `null` value indicates the state is not applicable to this element. |
| `ignored` | boolean | OPTIONAL | Whether the element is excluded from the accessibility tree. |
| `ignoredReasons` | array of strings | OPTIONAL | If `ignored` is `true`, the reason(s) why (e.g., `"aria-hidden"`, `"display: none"`, `"presentational role"`). |
| `parent` | object | OPTIONAL | A snapshot of the parent node, following the same structure recursively. Provides ancestor context. |
| `children` | array of objects | OPTIONAL | Simplified snapshots of child nodes. Useful when the issue concerns the element's contents (e.g., a list missing items, a table with unlabelled headers). |

Reporters SHOULD include enough ancestor context (via nested `parent` objects) to form a *distinguished subtree* — a pattern of roles and names that uniquely identifies the element within the page. This is especially important when locators may match multiple elements.

A future version of this specification MAY define a compact YAML-based representation of the snapshot, inspired by Playwright's ARIA snapshot format.

**Example:**

```json
"element": {
  "locators": [
    { "type": "text", "value": "\ud83d\uded2" },
    { "type": "css", "value": "#checkout-submit" }
  ],
  "snapshot": {
    "role": "button",
    "name": "",
    "description": "",
    "value": null,
    "states": {
      "disabled": false,
      "focused": false
    },
    "ignored": false,
    "parent": {
      "role": "form",
      "name": "Checkout",
      "parent": {
        "role": "main",
        "name": ""
      }
    }
  },
  "label": "Place Order button at bottom of checkout form"
}
```

#### 6.3.2 The `rules` Array

The `rules` array is the single field for referencing accessibility rules from any vocabulary — WCAG success criteria, W3C ACT rules, axe-core best practices, Lighthouse audits, or any other rule set. All vocabularies use the same `@type`/`@id` pattern; none are special-cased.

Each element in the `rules` array is a typed reference with a compact IRI identifier:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `@type` | string | REQUIRED | A compact IRI identifying the type of rule. Every prefix used in `@type` values MUST be defined in the report's `@context` ([§6.1.1](#611-the-context-object)). This specification RECOMMENDS the EARL 1.0 types `"earl:TestRequirement"` and `"earl:TestCase"` (see below), but reporters MAY use other types for domain-specific vocabularies (e.g., design system guidelines). |
| `@id` | string | REQUIRED | A compact IRI identifying the rule. The prefix MUST be defined in the report's `@context` ([§6.1.1](#611-the-context-object)) and SHOULD match a prefix declared in the operator's `reporting.accepts.ruleVocabularies` ([§4.3.1](#431-the-rulevocabularies-array)). |

**RECOMMENDED `@type` values (EARL 1.0):**

- **`earl:TestRequirement`** — A normative requirement that may be satisfied or violated. WCAG success criteria are test requirements (e.g., `WCAG22:name-role-value`).
- **`earl:TestCase`** — A concrete, typically automatable test. W3C ACT rules (e.g., `act:23a2a8`), axe-core rules (e.g., `axe:empty-heading`), and Lighthouse audits are test cases.

Reporters referencing W3C or industry-standard accessibility rules SHOULD use the EARL types above, as they are widely understood by EARL-aware processors. Reporters referencing organization-specific rules (e.g., design system component guidelines, internal audit checklists) MAY define custom `@type` values using their own vocabulary prefix.

A single issue MAY reference both a requirement and the test case(s) that detected the violation. The co-occurrence within the same `rules` array implies the relationship — the test cases are evidence for the requirement's failure.

**Example — WCAG success criterion:**

```json
"rules": [
  { "@type": "earl:TestRequirement", "@id": "WCAG22:name-role-value" }
]
```

The compact IRI `WCAG22:name-role-value` expands to `https://www.w3.org/TR/WCAG22/#name-role-value` via the `@context`. Full criterion metadata — including the success criterion number, conformance level, and human-readable title — can be resolved from the canonical W3C WCAG JSON source declared in the operator's `ruleVocabularies` `reference` field ([§4.3.1](#431-the-rulevocabularies-array)).

**Example — WCAG requirement with ACT rule evidence:**

```json
"rules": [
  { "@type": "earl:TestRequirement", "@id": "WCAG22:name-role-value" },
  { "@type": "earl:TestCase", "@id": "act:23a2a8" }
]
```

**Example — axe-core best-practice rule (no WCAG mapping):**

```json
"rules": [
  { "@type": "earl:TestCase", "@id": "axe:landmark-one-main" }
]
```

**Example — mixed vocabularies:**

```json
"@context": {
  "earl": "http://www.w3.org/ns/earl#",
  "WCAG22": "https://www.w3.org/TR/WCAG22/#",
  "act": "https://www.w3.org/WAI/standards-guidelines/act/rules/",
  "axe": "https://dequeuniversity.com/rules/axe/4.10/"
},
...
"rules": [
  { "@type": "earl:TestRequirement", "@id": "WCAG22:name-role-value" },
  { "@type": "earl:TestCase", "@id": "act:23a2a8" },
  { "@type": "earl:TestCase", "@id": "axe:empty-heading" }
]
```

**Example — domain-specific design system rule:**

An organization's design system requires that primary action buttons always follow secondary actions in DOM order. The operator declares the design system as a vocabulary:

```json
"ruleVocabularies": [
  {
    "name": "Example Design System",
    "prefix": "ds",
    "namespace": "https://design.example.com/rules/",
    "version": "3.0",
    "reference": "https://design.example.com/rules"
  }
]
```

A reporter references the rule using a custom `@type`:

```json
"@context": {
  "ds": "https://design.example.com/rules/"
},
...
"rules": [
  { "@type": "ds:ComponentGuideline", "@id": "ds:button-order-primary-after-secondary" }
]
```

No `earl` prefix is needed because the report does not use EARL types.

Reporters SHOULD use prefixes corresponding to vocabularies declared in the operator's `reporting.accepts.ruleVocabularies` array ([§4.3.1](#431-the-rulevocabularies-array)). If the operator does not declare any rule vocabularies, reporters MAY still include `rules` references using custom prefixes; operators SHOULD treat unrecognized rules as informational.

Reporters without knowledge of any applicable rule SHOULD omit the `rules` field entirely and rely on the `description` field to convey the issue. This is a reporting mechanism, not an audit tool — a human description of a barrier is always sufficient.

#### 6.3.3 EARL Assertions as Attachments

Reporters that produce complete EARL Assertion output (e.g., automated scanners with EARL toolchains) MAY include it as an attachment ([§6.4](#64-attachments)) with `type` set to `"other"` and the appropriate `mimeType`:

- JSON-LD EARL: `"application/ld+json"`
- Turtle: `"text/turtle"`
- RDF/XML: `"application/rdf+xml"`

This preserves full EARL fidelity — including `assertedBy`, `result.source` hierarchies, and other EARL-specific metadata — for operators with EARL processing capabilities. The `rules` field ([§6.3.2](#632-the-rules-array)) remains the primary, lightweight mechanism for rule references in the Issue Object itself.

### 6.4 Attachments

Reporters SHOULD prefer the `url` field over inline content for any attachment likely to approach the operator's declared size limits. URL-referenced attachments allow the operator to fetch content on demand. See [§11.3](#113-url-referenced-attachments) for security considerations related to URL-referenced attachments.

Each attachment is an object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | REQUIRED | One of `"screenshot"`, `"domSnapshot"`, `"video"`, `"other"`. |
| `json` | object | CONDITIONAL | Inline JSON content. Use for natively structured data such as browser automation recordings or serialized accessibility trees. Mutually exclusive with `data` and `url`. |
| `data` | string | CONDITIONAL | Base64-encoded content. Use for binary or text content that is not JSON (e.g., images, HTML fragments, video). Mutually exclusive with `json` and `url`. |
| `url` | string (URI) | CONDITIONAL | A URI where the attachment content can be retrieved. MUST use HTTPS. Use for large or externally hosted content. Mutually exclusive with `json` and `data`. Operators MAY require authentication for URL-referenced attachments (see `urlPolicy` in [§4.3.2](#432-the-attachments-array) and [§11.3](#113-url-referenced-attachments)). |
| `format` | string | OPTIONAL | Named sub-format of the attachment content. Corresponds to the `formats` values declared in the operator's attachment configuration ([§4.3.2](#432-the-attachments-array)). For example, a `domSnapshot` attachment uses `"accessibility-tree"` or `"dom-fragment"` to indicate which representation it contains. Reporters SHOULD include `format` when the operator declares `formats` for the attachment type, as `mimeType` alone may not distinguish between formats that share a MIME type. |
| `mimeType` | string | OPTIONAL | MIME type of the attached content (e.g., `"image/png"`, `"text/html"`, `"video/mp4"`, `"application/json"`). |
| `description` | string | OPTIONAL | Human-readable description of the attachment. |

An attachment MUST include exactly one of `json`, `data`, or `url`.

- **`json`**: Best for structured data that is natively JSON. The value MUST be a JSON object; JSON arrays are not permitted as the top-level value. Reporters needing to attach an array (e.g., a list of EARL assertions) SHOULD wrap it in an object (e.g., `{ "items": [...] }`). Avoids base64 overhead and keeps the content inspectable within the report. The `mimeType` SHOULD be `"application/json"` or a JSON-based type (e.g., `"application/ld+json"`).
- **`data`**: Best for binary content (images, video) or non-JSON text (HTML, Turtle). The content MUST be base64-encoded.
- **`url`**: Best for large attachments or content hosted externally. Avoids payload size limits entirely.

Reporters SHOULD NOT include attachments of a type the operator has not declared support for in the `attachments` array of the discovery document ([§4.3.2](#432-the-attachments-array)).

#### 6.4.1 Large Attachments

Some attachment types — videos, full-page screenshots, complex DOM snapshots, and browser automation recordings — can easily exceed the operator's declared size limits. For these, reporters SHOULD use the `url` field to reference externally hosted content rather than embedding it inline.

**Example (video):**

```json
{
  "type": "video",
  "url": "https://reporter-uploads.example.com/recordings/abc123.mp4",
  "mimeType": "video/mp4",
  "description": "Screen recording showing voice control failing to activate the Place Order button."
}
```

Operators declaring video support in `reporting.accepts.attachments` SHOULD be prepared to receive URL-referenced attachments. Operators MAY impose their own size or duration limits on referenced content.

If a report is rejected with 413 (Payload Too Large), the error response SHOULD suggest using URL references as an alternative (see [§5.1.2](#512-error-responses)).

#### 6.4.2 Browser Automation Recordings

Browser automation recordings — such as Chrome DevTools Recorder exports — are a valid use of the `"other"` attachment type. A recording captures the exact interaction sequence that triggered an accessibility barrier, allowing the operator to replay it, reproduce the issue, and verify that a fix resolves it.

Reporters attaching recordings SHOULD set `type` to `"other"`, `mimeType` to `"application/json"`, and provide a `description` identifying the recording format (e.g., `"Chrome DevTools Recorder export"`).

**Example:**

```json
{
  "type": "other",
  "json": {
    "title": "Checkout flow",
    "steps": [
      { "type": "navigate", "url": "https://example.com/checkout" },
      { "type": "keyDown", "key": "Tab" },
      { "type": "keyDown", "key": "Tab" },
      { "type": "keyDown", "key": "Enter" }
    ]
  },
  "mimeType": "application/json",
  "description": "Chrome DevTools Recorder export: checkout flow demonstrating keyboard trap at Place Order button."
}
```

Recordings are executable content. See [§11.4](#114-executable-attachments) for security considerations that apply to operators receiving and processing recordings.

### 6.5 Example Report

```json
{
  "@context": {
    "earl": "http://www.w3.org/ns/earl#",
    "WCAG22": "https://www.w3.org/TR/WCAG22/#",
    "act": "https://www.w3.org/WAI/standards-guidelines/act/rules/"
  },
  "version": "1.0",
  "page": "https://example.com/checkout",
  "timestamp": "2025-06-01T10:28:00Z",
  "locale": "en-US",
  "reporter": {
    "type": "human-assisted",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "assistiveTechnology": "VoiceControl 1.2",
    "locale": "en-US"
  },
  "data": {
    "description": "The 'Place Order' button cannot be activated using voice control. Saying 'click Place Order' has no effect.",
    "impact": "blocker",
    "element": {
      "locators": [
        { "type": "text", "value": "Place Order" },
        { "type": "css", "value": "#checkout-submit" }
      ],
      "snapshot": {
        "role": "button",
        "name": "",
        "states": {
          "disabled": false,
          "focused": false
        },
        "parent": {
          "role": "form",
          "name": "Checkout"
        }
      },
      "label": "Place Order button at bottom of checkout form"
    },
    "rules": [
      { "@type": "earl:TestRequirement", "@id": "WCAG22:name-role-value" }
    ],
    "steps": "1. Navigate to /checkout. 2. Fill in all fields. 3. Say 'click Place Order' using voice control software."
  }
}
```

**Example — automated scan report using axe-core best-practice rules:**

```json
{
  "@context": {
    "earl": "http://www.w3.org/ns/earl#",
    "axe": "https://dequeuniversity.com/rules/axe/4.10/"
  },
  "version": "1.0",
  "page": "https://example.com/products",
  "timestamp": "2025-06-02T03:00:00Z",
  "reporter": {
    "type": "automated"
  },
  "data": {
    "description": "Page has no main landmark. Screen reader users cannot skip directly to the primary content.",
    "impact": "major",
    "element": {
      "locators": [
        { "type": "css", "value": "body" }
      ],
      "snapshot": {
        "role": "generic",
        "name": ""
      },
      "label": "Document body (missing main landmark)"
    },
    "rules": [
      { "@type": "earl:TestCase", "@id": "axe:landmark-one-main" }
    ]
  }
}
```

---

## 7. Server Behavior

### 7.1 Rate Limiting

Operators MAY impose rate limits on report submission. When a rate limit is exceeded, the server MUST respond with HTTP 429. The response SHOULD include a `Retry-After` header indicating when the reporter may try again.

### 7.2 Duplicate and Retry Detection

Operators SHOULD detect both exact retries and semantically equivalent reports.

**Exact-match retry detection:** Operators SHOULD compute a hash (e.g., SHA-256) of the request body on receipt. If a byte-identical submission is received within a short time window, the operator SHOULD return the original report receipt (201 with the same `id`) rather than creating a duplicate or returning an error. This handles network-failure retries transparently without requiring any special headers or behavior from reporters.

**Semantic deduplication:** Operators MAY use heuristics to detect equivalent-but-not-identical reports — for example, matching on the combination of `page` URL, `data.element.locators`, and description similarity. When a semantic duplicate is detected, the server MUST respond with HTTP 409 and SHOULD include a reference to the existing report in the response body.

The criteria for semantic deduplication are at the operator's discretion. Operators SHOULD document their duplicate detection policy if it may affect reporter behavior.

Reporters that support GET ([§5.2.2](#522-authenticated-get)) SHOULD check the status of previously submitted reports before re-submitting an issue to the same endpoint, to avoid unnecessary 409 responses.

### 7.3 Report Rejection

Operators MAY reject reports for any reason (e.g., spam, abuse, unsupported page). The server SHOULD use the most appropriate 4xx status code and SHOULD include a human-readable explanation.

### 7.4 Authentication

If `authentication` is `"required"`, the operator MUST reject unauthenticated POST requests with HTTP 401. Per RFC 9110 §15.5.2, any 401 response MUST include a `WWW-Authenticate` header containing at least one challenge that indicates the authentication scheme(s) the endpoint accepts (e.g., `Bearer`, `Basic`). Reporters SHOULD use the `WWW-Authenticate` challenge to determine which scheme to use. Common schemes include Bearer tokens (RFC 6750) and Basic authentication (RFC 7617); OAuth 2.0 (RFC 6749) is a common framework for issuing Bearer tokens.

The specific authentication mechanism is not mandated by this specification. Operators SHOULD document how reporters obtain and present credentials. When `authentication` is not `"none"`, operators SHOULD populate the `authDocumentation` field ([§4.2](#42-the-reporting-object)) with a URI pointing to such documentation. If `authDocumentation` is absent, reporters MAY fall back to the `contact.url` field or attempt the challenge advertised in `WWW-Authenticate`.

### 7.5 Cross-Origin Requests

Reporters may include browser extensions, client-side JavaScript tools, and assistive technology interfaces that issue requests from a different origin than the operator's site. To support these use cases, operators SHOULD serve appropriate CORS headers on both the discovery document and the reporting endpoint.

For the discovery document (`/.well-known/accessibility-reporting`), the server SHOULD include:

```
Access-Control-Allow-Origin: *
```

For the reporting endpoint, the server SHOULD include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

The `Access-Control-Allow-Methods` value SHOULD be scoped to the methods declared in `reporting.methods` (plus `OPTIONS`). For example, an operator that supports GET and PUT would add those to the list.

The server MUST respond to preflight `OPTIONS` requests with HTTP 204 and the headers above. If the operator restricts access to specific origins, the server MAY use a more restrictive `Access-Control-Allow-Origin` value, but SHOULD document this restriction.

### 7.6 Caching

The discovery document changes infrequently. Operators SHOULD serve it with a `Cache-Control` header that permits caching for a reasonable duration. A value of `Cache-Control: public, max-age=86400` (24 hours) is RECOMMENDED as a balance between freshness and performance. Operators who update the discovery document frequently MAY use a shorter duration.

Reporters SHOULD respect standard HTTP caching headers when fetching the discovery document. Reporters MUST NOT cache the discovery document indefinitely; if no caching headers are present, reporters SHOULD re-fetch after no more than 24 hours.

The reporting endpoint responses (POST, GET, PUT) SHOULD NOT be cached by intermediaries. Operators SHOULD serve `Cache-Control: no-store` on these responses.

---

## 8. Client Behavior

### 8.1 Automated Agents

Automated agents (including AI-based browsing tools) SHOULD:

1. Fetch the discovery document before submitting a report.
2. If GET is supported, issue an unauthenticated GET to the endpoint to retrieve current capabilities before constructing a report.
3. Respect `accepts` declarations — do not include attachments unless the operator declares support for the relevant type in `reporting.accepts.attachments` ([§4.3.2](#432-the-attachments-array)). When referencing rules in the `rules` field ([§6.3.2](#632-the-rules-array)), check the operator's `reporting.accepts.ruleVocabularies` ([§4.3.1](#431-the-rulevocabularies-array)) for matching vocabularies and use the operator's declared `prefix` and `namespace` in the report's `@context`. If a vocabulary is not declared, the agent MAY still include `rules` references, but the operator may not process them.
4. Respect `preferredLocales` when constructing descriptions.
5. Set `reporter.type` to `"automated"`.
6. Store the report `id` from the receipt so that duplicate submissions can be avoided in future sessions.
7. If GET is supported and the agent has previously submitted reports to this endpoint, check report status before re-reporting a known issue.
8. If the agent has access to the browser's accessibility tree (e.g., via CDP or a browser automation framework), populate the `element.snapshot` field ([§6.3.1.2](#6312-the-snapshot-object)) with the accessibility tree state of the affected element. Include enough ancestor context via `parent` to form a distinguished subtree.
9. Prefer semantic locators (`aria`, `text`) over structural locators (`css`, `xpath`) in the `element.locators` array ([§6.3.1.1](#6311-the-locators-array)).

### 8.2 Human Reporters

Browser extensions, assistive technologies, and other tools submitting on behalf of a human SHOULD:

1. Present the report to the human for review before submitting.
2. Set `reporter.type` to `"human"` if the human authored the report directly, or `"human-assisted"` if the report was drafted by a tool and approved.
3. Surface the fallback `contact` information to the user if submission fails.

### 8.3 Locale Handling

If the reporter's locale does not match any of the operator's declared `preferredLocales`, the reporter SHOULD still submit the report in the reporter's locale, and SHOULD note this in the `locale` field of the report. Operators SHOULD NOT reject a report solely on the basis of language.

### 8.4 User Agent Native Reporting

User agents (browsers) that detect a valid discovery document at `/.well-known/accessibility-reporting` SHOULD offer a native accessibility issue reporting interface. This lets a person report an issue directly, without a browser extension or third-party tool.

#### 8.4.1 Form Generation

The user agent SHOULD generate a reporting form derived from the discovery document and the report schema defined in [§6](#6-report-schema). Specifically:

1. The form SHOULD include fields corresponding to the REQUIRED and RECOMMENDED report fields (`page`, `data.description`), pre-populating `page` with the current URL and `version` with `"1.0"`.
2. The form SHOULD reflect the operator's `accepts` declarations — for example, offering a screenshot attachment control only when `reporting.accepts.attachments` includes a `"screenshot"` type ([§4.3.2](#432-the-attachments-array)).
3. The form SHOULD expose the `impact` vocabulary ([§6.3](#63-issue-object)) as a selection control rather than requiring free text.
4. The form SHOULD omit fields intended for automated reporters (`rules`, `element.locators`, `element.snapshot`) unless the user explicitly requests an advanced view.
5. The form MUST constrain the user to a single issue per submission.

#### 8.4.2 Accessibility of the Form

Because this form exists specifically to report accessibility barriers, it MUST NOT introduce new ones. The user agent MUST render the form using only native HTML form elements (`<input>`, `<textarea>`, `<select>`, `<fieldset>`, `<legend>`, `<label>`, `<button>`, etc.). Custom components, shadow DOM widgets, and ARIA-heavy constructs MUST NOT be used.

Native HTML elements carry built-in semantics, keyboard behavior, and platform accessibility API mappings, making them accessible to the widest range of assistive technologies without extra work.

#### 8.4.3 Submission Behavior

1. The user agent MUST set `reporter.type` to `"human"`.
2. The user agent SHOULD auto-populate `reporter.userAgent` and `reporter.locale`.
3. If the operator declares `authentication` as `"required"`, the user agent SHOULD inform the user before presenting the form, SHOULD link to `authDocumentation` if provided, and SHOULD surface the `contact` fallback if the user cannot authenticate.
4. The user agent SHOULD display the receipt `id` ([§5.1.1](#511-report-receipt)) to the user on successful submission so that they can reference it in follow-up communication.
5. On failure, the user agent SHOULD surface the `contact` object ([§4.4](#44-the-contact-object)) as a fallback channel.

---

## 9. Relationship to Existing Specifications

### 9.1 RFC 9116 (security.txt)

Like `security.txt`, this specification uses a well-known location where operators declare a reporting channel without changing their site. Unlike `security.txt`, it uses structured JSON for discovery and defines an HTTP API for automated submission.

### 9.2 RFC 8288 (Web Linking)

RFC 8288 defines link relations and the HTTP `Link` header. This specification registers the `accessibility-reporting` link relation ([§3.4](#34-link-based-discovery)) so that operators can advertise the discovery document via HTTP headers or HTML `<link>` elements without relying solely on the well-known URI.

### 9.3 WCAG-EM 2.0

WCAG-EM (W3C Website Accessibility Conformance Evaluation Methodology) defines a process for evaluating full websites. The report format in this specification is not an evaluation report; it is an issue report for a specific observed problem. WCAG-EM outputs may be summarized or referenced in reports submitted under this specification.

### 9.4 EARL 1.0

The Evaluation and Report Language (EARL) is a W3C vocabulary for describing test results. This specification adopts EARL's JSON-LD conventions for typed references in the `rules` field of Issue Objects ([§6.3.2](#632-the-rules-array)):

- **`earl:TestRequirement`** is used as the `@type` for high-level requirements such as WCAG success criteria.
- **`earl:TestCase`** is used as the `@type` for concrete test rules such as W3C ACT rules, axe-core rules, and Lighthouse audits.

This alignment means that `rules` entries are valid JSON-LD that EARL-aware processors can interpret directly. Reporters without EARL tooling need only construct simple `@type`/`@id` objects.

Reporters that produce complete EARL Assertion output (e.g., automated scanners) MAY include it as an attachment ([§6.3.3](#633-earl-assertions-as-attachments)) for operators with EARL processing capabilities.

### 9.5 ACT Rules Format 1.1

The Accessibility Conformance Testing (ACT) Rules Format 1.1 defines machine-readable accessibility test rules and a JSON-LD structure for reporting test results. This specification aligns with the ACT Rules Format in two ways:

1. **Compact IRI identifiers.** The `rules` field ([§6.3.2](#632-the-rules-array)) references rules using compact IRIs — the same pattern used in ACT assertion output. For example, `act:23a2a8` references an ACT rule and `WCAG22:name-role-value` references a WCAG success criterion. Both expand to canonical W3C URIs via the report's `@context` ([§6.1.1](#611-the-context-object)).

2. **EARL type hierarchy.** The `@type` values used in this specification — `earl:TestRequirement` for requirements and `earl:TestCase` for concrete rules — follow the EARL vocabulary hierarchy as used in ACT Rules Format 1.1 examples.

### 9.6 Browser-Native Tool Registration (Informative)

*This section is informative. It describes a complementary discovery pattern that may become available as browser-native tool registration APIs emerge.*

Browser-native tool registration APIs — such as those being explored through the Model Context Protocol (MCP) ecosystem and W3C community groups like the Autonomous Agents on the Web Community Group — allow web pages to register named tools (functions with natural language descriptions and structured parameter schemas) that AI agents can discover and invoke within the same browsing context.

A site supporting this specification MAY register its accessibility reporting endpoint as a browser-native tool. This provides agents with a discovery path that is complementary to the well-known URI: rather than probing `/.well-known/accessibility-reporting` independently, an agent already interacting with a tool-enabled page can discover the reporting capability as part of normal tool enumeration.

Browser-native tool registration fits human-in-the-loop reporting workflows well because it operates within the app-controlled browser context, preserving the user's session state and visual interface. An agent can surface a report option when the user encounters difficulty, prepopulate it with page context (URL, active element, session state), and submit only after the user approves.

Implementors exposing a reporting tool via a browser-native tool registration API SHOULD ensure that the tool routes to the same endpoint declared in the well-known discovery document, so that reporters using either discovery mechanism reach the same destination.

### 9.7 Accessibility Tree Snapshot Tools

Headless browser tools designed for AI agents can expose the browser's accessibility tree as a structured snapshot. Unlike raw HTML or screenshots, accessibility tree snapshots present a page's semantic structure (roles, accessible names, states, and relationships) through stable element references that agents can act on reliably.

These snapshots support accessibility reporting in two ways:

1. **Issue detection:** An agent analyzing an accessibility tree snapshot can identify structural problems — missing accessible names, incorrect roles, broken focus order, unlabelled form controls — that may not be visible in screenshots or HTML source.

2. **Issue evidence:** A relevant portion of the accessibility tree snapshot works well as a `domSnapshot` attachment ([§6.4](#64-attachments)), giving the operator a precise, reproducible picture of the element's state when the issue was observed.

Operators declaring `domSnapshot` support in `reporting.accepts.attachments` ([§4.3.2](#432-the-attachments-array)) SHOULD be prepared to receive accessibility tree snapshots, not only serialized HTML DOM content. The `formats` field on a `domSnapshot` attachment declaration (e.g., `["accessibility-tree", "dom-fragment"]`) allows operators to specify which representations they accept.

### 9.8 Scope Beyond WCAG

This specification intentionally does not limit reports to WCAG success criteria. Accessibility barriers can be caused by:

- Missing or incorrect information in the accessibility tree (not always traceable to a specific SC)
- Incompatibilities with specific assistive technologies or their versions
- Interaction patterns that work for some users but not others
- Issues not yet addressed by any published standard

Reporters SHOULD describe the barrier they experienced, regardless of whether they can identify an applicable WCAG criterion. When the issue maps to a rule from a third-party vocabulary (e.g., an axe-core best-practice rule), reporters can use the `rules` field ([§6.3.2](#632-the-rules-array)) to reference it, and operators can declare support for that vocabulary via `ruleVocabularies` ([§4.3.1](#431-the-rulevocabularies-array)).

### 9.9 Multi-Subdomain Deployments

Well-known URIs are scoped to the origin (scheme + host + port, per RFC 6454). There is no inheritance between a subdomain and its parent domain: `https://www.example.com/.well-known/accessibility-reporting` and `https://api.example.com/.well-known/accessibility-reporting` are independent resources. Operators with multiple subdomains must explicitly handle discovery at each origin.

#### Shared-operator subdomains

When multiple subdomains belong to the same organization and should route reports to a single destination, operators have two options:

1. **HTTP redirect.** Each subdomain issues a `301` (permanent) or `302` (temporary) redirect from `/.well-known/accessibility-reporting` to the canonical domain's discovery document. Reporters MUST follow HTTP redirects when resolving the well-known URI and SHOULD follow no more than 5 redirects in a single resolution chain. This is the RECOMMENDED approach because it requires no duplication of configuration.

2. **Shared endpoint.** Each subdomain serves its own discovery document, but all documents declare the same `reporting.endpoint` value. Configuration is centralized at the endpoint level. See [§4.2.1](#421-cross-origin-endpoints) for cross-origin endpoint requirements.

Both approaches are valid and may be combined (e.g., secondary subdomains redirect to the primary, which declares a cross-origin endpoint).

#### Multi-tenant subdomains

Platforms that assign a subdomain to each tenant (e.g., `customer1.platform.com`, `customer2.platform.com`) SHOULD serve a per-tenant discovery document at each subdomain's well-known URI. A shared discovery document would cause reports to be routed to the wrong entity, defeating the purpose of per-tenant reporting. The `contact` object ([§4.4](#44-the-contact-object)) in each document SHOULD identify the specific tenant, not the platform operator, unless the platform operator is the responsible party for accessibility remediation.

Platforms that cannot serve per-tenant well-known resources SHOULD consider whether link-based discovery ([§3.4](#34-link-based-discovery)) via per-page `<link>` headers is a more appropriate deployment model for their architecture.

### 9.10 WAI-Adapt: Discoverable Destinations (Informative)

*This section is informative. It describes a complementary W3C specification that overlaps in conceptual territory.*

The [WAI-Adapt: Discoverable Destinations](https://github.com/w3c/adapt/blob/main/explainers/discoverable-destinations.md#the-discoverable-destinations-approach) explainer (W3C) defines a set of standardized `rel` attribute values for HTML `<link>` elements that allow user agents to discover common site destinations such as login, help, and accessibility statements. It is designed to help people with cognitive disabilities and automated agents navigate sites more reliably.

One of the registered destinations is `rel="accessibility-statement"`, which points to the operator's human-readable accessibility conformity declaration. This is distinct from the present specification: `rel="accessibility-statement"` links to an existing document; `/.well-known/accessibility-reporting` is a machine-readable API for submitting new issue reports. The two mechanisms address different needs and are not in conflict.

Operators supporting both specifications SHOULD include both `<link>` elements in their page `<head>`:

```html
<link rel="accessibility-statement" href="/accessibility/statement">
<link rel="accessibility-reporting" href="/.well-known/accessibility-reporting">
```

The `statement` field in the discovery document ([§4.1](#41-top-level-fields)) provides a machine-readable pointer to the same accessibility statement that `rel="accessibility-statement"` advertises in HTML, giving automated reporters a single place to find both the reporting endpoint and the operator's compliance context.

### 9.11 W3C Reporting API (reporting-1)

*This section is informative. It explains how the W3C Reporting API relates to this specification and why the two are not interchangeable.*

The [W3C Reporting API](https://www.w3.org/TR/reporting-1/) (reporting-1) defines a generic infrastructure for web browsers to deliver diagnostic reports — such as Content Security Policy violations, network errors, and certificate warnings — to operator-controlled endpoints. Operators configure reporting by returning a `Reporting-Endpoints` HTTP response header that names one or more collector URLs. The browser then queues, batches, and POSTs these reports automatically, with no user involvement.

Despite surface similarities (both involve POST to a declared endpoint), the two specifications differ in scope, direction, and purpose:

| Dimension | W3C Reporting API | This specification |
|-----------|-------------------|--------------------|
| **Who generates the report** | The browser (user agent) | A human, assistive technology, automated scanner, or AI agent |
| **What is being reported** | Browser-detected events (policy violations, network errors, deprecations) | Accessibility barriers experienced during use |
| **Report direction** | Browser → operator's backend | External party → operator |
| **How endpoints are declared** | `Reporting-Endpoints` HTTP response header | `/.well-known/accessibility-reporting` discovery document |
| **Subject domain** | Security, performance, browser internals | Accessibility of the site's user interface or semantic content |
| **Delivery guarantee** | Explicitly best-effort; reports may be dropped | Reporters expect standard HTTP POST semantics |
| **Reporter identity** | The browser/UA; no separate reporter concept | Reporters may be anonymous or identified |

The W3C Reporting API is designed for the operator to monitor their own site's technical behaviour. This specification is designed for third parties to report problems *to* the operator. A site may deploy both without conflict.

There is no technical integration between the two specifications. Operators implementing the W3C Reporting API to collect CSP reports are not required to, and SHOULD NOT, route those reports through the endpoint defined by this specification — the schemas, purposes, and audiences are different.

### 9.12 Cognitive Accessibility: COGA Making Content Usable (Informative)

*This section is informative. It describes how this specification aligns with the W3C Note on cognitive accessibility.*

[Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) (COGA) is a W3C Working Group Note that defines eight design objectives with associated patterns for supporting users with cognitive and learning disabilities. This specification directly supports **Objective 7: Provide Help and Support**, particularly:

- **Pattern 7.5 (Findable Support):** The well-known URI and link-based discovery ([§3.4](#34-link-based-discovery)) provide a standardized, predictable location for accessibility help — findable by users, assistive technologies, and agents without requiring the user to search the site.
- **Pattern 7.1 (Human Help):** The `contact` object ([§4.4](#44-the-contact-object)) exposes direct channels to a human accessibility team (email, phone, TTY, relay), and the contact-only discovery mode ([§4.1](#41-top-level-fields)) supports operators that provide human help without an HTTP endpoint.

Beyond Objective 7, this specification creates a **feedback loop** that helps operators learn when they are failing other COGA objectives — unclear language, cognitive overload, missing error recovery — through reports filed by users who experience those barriers. Because the report schema is not limited to WCAG success criteria ([§9.8](#98-scope-beyond-wcag)), reporters can describe any barrier in the free-text `description` field, including those that correspond to COGA design patterns.

No standardized rule vocabulary for COGA patterns currently exists. If one were published, operators could declare it in `ruleVocabularies` ([§4.3.1](#431-the-rulevocabularies-array)) and reporters could reference individual COGA patterns in the `rules` array ([§6.3.2](#632-the-rules-array)) using the same JSON-LD mechanism used for WCAG, ACT, and other vocabularies. The extensible vocabulary architecture requires no changes to this specification to support COGA rules when they become available.

### 9.13 Prior Art: JAWS Connect (Informative)

*This section is informative. It describes an existing proprietary implementation that addresses the same problem space as this specification.*

[JAWS Connect](https://www.tpgi.com/arc-platform/jaws-connect/) is a feature of TPGi's ARC Platform, developed in collaboration with Freedom Scientific (both Vispero brands), that enables JAWS screen reader users to submit accessibility feedback directly to website operators. Announced in late 2021, it is the earliest known production implementation of in-context accessibility issue reporting from an assistive technology client to a site operator's dashboard.

**How it works:** When a JAWS user (version 2021+) visits a participating site and opens the links list (Insert+F7), a "Provide feedback on the page using JAWS Connect" link appears at the top. Activating the link opens a TPGi-hosted feedback form that captures structured data: the task the user was attempting, what happened versus what was expected, whether the task was completed, an accessibility rating, and optional contact information. Submitted feedback appears in the operator's ARC Platform dashboard under a "Usability Feedback" tab.

**Key design differences from this specification:**

| Dimension | JAWS Connect | This specification |
|-----------|-------------|--------------------|
| **Discovery** | TPGi maintains a proprietary registry of participating domains; JAWS checks this registry client-side | Open well-known URI and link relation; any client can discover the endpoint |
| **Client support** | Requires JAWS (a commercial screen reader) | Any HTTP client: assistive technologies, browsers, automated scanners, AI agents |
| **Server support** | Requires an ARC Platform subscription from TPGi | Any HTTP server; no vendor dependency |
| **Report destination** | TPGi-hosted form and dashboard | Operator-controlled endpoint |
| **Report format** | Proprietary structured form fields | JSON-LD with typed rule references and extensible attachments |
| **Operator setup** | Contact TPGi to activate; no code changes | Serve a JSON discovery document at the well-known URI |

JAWS Connect validates the core premise of this specification — that assistive technology users encounter barriers that never reach the site operator, and that an in-context reporting channel between the user and the operator is valuable. This specification generalizes that concept into an open, vendor-neutral protocol that any client and any server can implement independently.

---

## 10. Privacy Considerations

- Reporters SHOULD be aware that submitted reports may include the page URL, user agent string, assistive technology details, and other information that may be linkable to an individual.
- Operators MUST NOT require reporter identity for anonymous report submission unless `authentication` is declared as `"required"`.
- Operators SHOULD document their data retention and privacy practices for submitted reports, ideally via the `contact.url` field.
- Agents submitting reports on behalf of users MUST obtain explicit user consent before including any personally identifiable information in a report.
- Operators SHOULD NOT log client IP addresses alongside report content in a way that could identify reporters.
- When `authentication` is `"optional"`, operators MUST NOT correlate the `reporter.identity` field of authenticated reports with metadata from unauthenticated reports (such as IP address, user agent, or submission patterns) in order to de-anonymize reporters who chose not to authenticate.

---

## 11. Security Considerations

### 11.1 Transport Security

- The endpoint declared in the discovery document MUST use HTTPS to protect report content in transit.
- Reporters SHOULD verify the discovery document is served from the expected origin before submitting reports. Reporters SHOULD reject discovery documents served over plain HTTP (without TLS).
- Reporters SHOULD validate that the `endpoint` URI in the discovery document uses HTTPS and SHOULD NOT submit reports to endpoints on private or internal network addresses unless explicitly configured to do so.
- Reporters SHOULD follow no more than 5 redirects for any single request (see [§5.1](#51-submitting-a-report-post--required)). Malicious or compromised discovery documents could point to endpoints that create redirect loops; redirect limits mitigate this.

### 11.2 Text Field Sanitization

- Operators SHOULD validate and sanitize all report fields before processing, as reports may contain arbitrary user-supplied strings.
- The reporting endpoint should be protected against common web vulnerabilities (e.g., injection attacks in description fields).
- Report fields such as `description`, `steps`, `element.label`, and `attachments[].description` contain arbitrary user-supplied text. If an operator renders reports in a web-based dashboard or other HTML context, these fields MUST be treated as untrusted plaintext and properly escaped to prevent cross-site scripting (XSS). Operators SHOULD NOT interpret any report field as HTML or executable content.

### 11.3 URL-Referenced Attachments

- Operators MUST treat attachment URLs (the `url` field in attachment objects, [§6.4](#64-attachments)) as untrusted input.
- **SSRF prevention:** Operators SHOULD NOT fetch attachment URLs that resolve to private or internal network addresses (RFC 1918 ranges, link-local addresses, loopback addresses). Operators SHOULD validate URL targets before initiating any fetch.
- Operators SHOULD validate: HTTPS scheme only, response `Content-Type` matches the declared `mimeType`, and response size is within acceptable bounds.
- Operators SHOULD apply a timeout and a follow-redirect limit (no more than 5 redirects) when fetching attachment URLs, to prevent slow-loris or redirect-chain attacks.
- Operators MAY choose not to fetch attachment URLs at all, instead storing the reference for manual review. This is a valid and safe approach.
- **Authentication as a trust signal:** Operators MAY restrict URL-referenced attachments to authenticated reporters only. This is a reasonable default — unauthenticated reporters can still submit inline `data` attachments, while URL references (which carry higher risk and require operator-side fetching) are gated behind identity. Operators MAY declare this policy per attachment type using the `urlPolicy` field ([§4.3.2](#432-the-attachments-array)) and SHOULD document it in the discovery document or endpoint descriptor.

### 11.4 Executable Attachments

- Browser automation recordings ([§6.4.2](#642-browser-automation-recordings)) and other JSON-based automation scripts are executable content even though they arrive as data. When replayed via tools such as Puppeteer or Chrome DevTools, they can navigate to arbitrary URLs, submit forms, and execute custom JavaScript expressions.
- Operators MUST NOT auto-execute or replay attached recordings in production environments without human review.
- Recordings may contain navigation to arbitrary URLs, form submissions with captured credentials or session tokens, or custom steps with embedded expressions.
- Operators SHOULD replay recordings only in sandboxed environments: isolated browser profiles with no access to internal systems, no stored credentials, and no persistent state.
- Reporters SHOULD review recordings before submission to ensure they do not contain captured credentials, tokens, or other sensitive data from the browsing session.
- Operators SHOULD strip or redact any credentials, tokens, or personally identifiable information found in stored recordings.

### 11.5 Discovery Document Integrity

- The discovery document itself does not need to be authenticated; however, operators SHOULD ensure it cannot be modified by unauthorized parties.
- Operators serving the discovery document through a CDN or reverse proxy SHOULD configure appropriate access controls to prevent unauthorized modification.
- Operators SHOULD also consider serving the discovery document with a `Content-Security-Policy: default-src 'none'` header to prevent unintended execution if the document is loaded in a browser context.

### 11.6 Reporter Contact Data

- Reporter contact information ([§6.2.1](#621-the-reportercontact-object)) is personally identifiable information (PII). Operators that declare `reporterContact: true` SHOULD publish a privacy notice explaining how contact data is stored, used, and retained.
- Operators MUST NOT use reporter contact data for purposes beyond follow-up on the submitted report (e.g., marketing, profiling, or sharing with third parties) unless the reporter has given separate, explicit consent.
- Operators SHOULD NOT require contact information as a condition of accepting a report. The `reporterContact` flag signals willingness to receive it, not a mandate.
- Reporters — especially automated agents acting on behalf of users — MUST obtain the user's consent before including contact information in a report. Agents SHOULD present a clear prompt explaining what data will be shared and with whom.
- Operators that receive a `contact` object when `reporterContact` is not enabled in their discovery document MUST NOT store or process the contact data.

### 11.7 Rate Limiting and Abuse Prevention

- Operators SHOULD implement rate limiting to prevent abuse of the reporting endpoint as a vector for spam or denial-of-service.
- See [§7.1](#71-rate-limiting) for rate limiting guidance and [§7.2](#72-duplicate-and-retry-detection) for duplicate detection.

---

## 12. IANA Considerations

This document requests registration of the following well-known URI in the IANA Well-Known URI Registry (as defined by RFC 8615):

| Field | Value |
|-------|-------|
| URI Suffix | `accessibility-reporting` |
| Change Controller | Paul Grenier &lt;pgrenier@gmail.com&gt; |
| Status | `provisional` |
| Specification Document | [This document](https://autosponge.github.io/well-known-accessibility-report/spec) |
| Related Information | None |

This document also requests registration of the following link relation type in the IANA Link Relation Type Registry (as defined by RFC 8288):

| Field | Value |
|-------|-------|
| Relation Name | `accessibility-reporting` |
| Description | Links to an accessibility issue reporting discovery document. |
| Change Controller | Paul Grenier &lt;pgrenier@gmail.com&gt; |
| Specification Document | [This document](https://autosponge.github.io/well-known-accessibility-report/spec) |

---

## Appendix A: Minimal Conforming Discovery Documents

**Contact-only (no HTTP endpoint):**

```json
{
  "version": "1.0",
  "contact": {
    "email": "mailto:accessibility@example.com"
  }
}
```

**HTTP endpoint only (no human contact):**

```json
{
  "version": "1.0",
  "reporting": {
    "endpoint": "https://example.com/accessibility/reports"
  }
}
```

## Appendix B: Minimal Conforming Report

```json
{
  "version": "1.0",
  "page": "https://example.com/products/widget",
  "data": {
    "description": "I cannot tab to the 'Add to cart' button using my keyboard."
  }
}
```

## Appendix C: Open Questions and Resolutions

1. **Should `/.well-known/accessibility-reporting` return the discovery document directly, or should it redirect to an operator-chosen URL?**
   *Resolved.* The discovery document is served directly at the well-known URI. Operators MAY use HTTP redirects (301, 302, 307, 308) to serve it from a different location ([§3.3](#33-discovery)). Link-based discovery ([§3.4](#34-link-based-discovery)) provides an additional mechanism for pointing to an alternative URL.

2. **Should there be a standard way to express that an operator does not currently accept automated reports (human-only)?**
   *Deferred.* This is not addressed in v1.0. Operators who wish to restrict to human reporters may use authentication or server-side filtering on `reporter.type`. A future version may add an `acceptedReporterTypes` field to the discovery document.

3. **Should the spec define a standard webhook/push mechanism so operators can notify reporters when an issue status changes?**
   *Deferred.* This is out of scope for v1.0. Reporters with authentication can poll via GET ([§5.2.2](#522-authenticated-get)) to check report status. A push notification mechanism may be defined in a future version.

4. **Should the spec address batch reporting scenarios (e.g., a weekly automated scan posting many issues at once) more explicitly?**
   *Resolved.* Each POST contains exactly one issue. Reporters performing batch submissions (e.g., automated scanners) submit multiple POSTs and should respect rate limits ([§7.1](#71-rate-limiting)) and payload size limits (`maxPayloadKB`). Operators manage scanner traffic through rate limiting and authentication ([§7.4](#74-authentication)). Further batch-specific guidance may be added in a future version.

5. **Is there value in a signed discovery document (analogous to DKIM or signed `security.txt`) to prevent spoofing?**
   *Deferred.* This is not addressed in v1.0. The security considerations ([§11](#11-security-considerations)) recommend that operators ensure the discovery document cannot be modified by unauthorized parties. Integrity mechanisms such as signed documents may be explored in a future version.

## Appendix D: Discovery Document JSON Schema

The following JSON Schema defines the structure of the discovery document served at `/.well-known/accessibility-reporting`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Accessibility Reporting Discovery Document",
  "description": "Discovery document for the /.well-known/accessibility-reporting endpoint, as defined by this specification.",
  "type": "object",
  "required": ["version"],
  "properties": {
    "version": {
      "type": "string",
      "const": "1.0",
      "description": "Schema version. MUST be \"1.0\" for this version of the spec."
    },
    "reporting": {
      "type": "object",
      "description": "Describes the HTTP reporting endpoint.",
      "required": ["endpoint"],
      "properties": {
        "endpoint": {
          "type": "string",
          "format": "uri",
          "pattern": "^https://",
          "description": "The absolute URI to which reports are submitted. MUST use HTTPS. MAY be on a different origin than the discovery document."
        },
        "methods": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["POST", "GET", "PUT", "DELETE"]
          },
          "contains": { "const": "POST" },
          "default": ["POST"],
          "description": "HTTP methods supported by the endpoint. MUST include \"POST\"."
        },
        "accepts": {
          "type": "object",
          "description": "Declares what report content the operator is prepared to receive.",
          "properties": {
            "ruleVocabularies": {
              "type": "array",
              "description": "Rule vocabularies the operator recognizes for issue classification.",
              "items": {
                "type": "object",
                "required": ["name", "prefix", "namespace"],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Human-readable identifier for the vocabulary (e.g., \"WCAG 2.2\", \"axe-core\")."
                  },
                  "prefix": {
                    "type": "string",
                    "description": "Compact IRI prefix for this vocabulary (e.g., \"WCAG22\", \"axe\")."
                  },
                  "namespace": {
                    "type": "string",
                    "format": "uri",
                    "description": "The IRI namespace the prefix expands to."
                  },
                  "version": {
                    "type": "string",
                    "description": "The version of the vocabulary."
                  },
                  "reference": {
                    "type": "string",
                    "format": "uri",
                    "description": "URI pointing to the vocabulary's documentation or rule listing."
                  }
                },
                "additionalProperties": true
              }
            },
            "attachments": {
              "type": "array",
              "description": "Attachment types the operator accepts, with per-type configuration.",
              "items": {
                "type": "object",
                "required": ["type"],
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": ["screenshot", "domSnapshot", "video", "other"],
                    "description": "The attachment type."
                  },
                  "mimeTypes": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "MIME types accepted for this attachment type."
                  },
                  "formats": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Named sub-formats accepted for this type."
                  },
                  "maxSizeKB": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Maximum size in kilobytes for this individual attachment."
                  },
                  "urlOnly": {
                    "type": "boolean",
                    "default": false,
                    "description": "If true, only URL references are accepted, not inline data."
                  },
                  "urlPolicy": {
                    "type": "string",
                    "enum": ["open", "authenticated"],
                    "description": "Whether URL-referenced attachments of this type require authentication."
                  }
                },
                "additionalProperties": true
              }
            },
            "maxPayloadKB": {
              "type": "integer",
              "minimum": 1,
              "description": "Maximum accepted HTTP request body size in kilobytes."
            },
            "reporterContact": {
              "type": "boolean",
              "default": false,
              "description": "Whether the operator accepts reporter contact information for follow-up (§6.2.1)."
            }
          },
          "additionalProperties": true
        },
        "preferredLocales": {
          "type": "array",
          "items": { "type": "string" },
          "description": "BCP 47 language tags indicating preferred report language(s)."
        },
        "authentication": {
          "type": "string",
          "enum": ["none", "optional", "required"],
          "default": "none",
          "description": "Whether authentication is needed to submit a report."
        },
        "authDocumentation": {
          "type": "string",
          "format": "uri",
          "description": "URI of a document describing how reporters obtain credentials and authenticate with the endpoint."
        },
        "rateLimit": {
          "type": "boolean",
          "default": false,
          "description": "Advisory. If true, the operator advertises that it may reject or throttle reports. If false, no advertisement is made — but operators MAY still impose rate limits."
        },
        "responseTime": {
          "type": "string",
          "description": "Advisory. The operator's expected time to acknowledge or act on a submitted report (e.g., \"5 business days\")."
        }
      },
      "additionalProperties": true
    },
    "contact": {
      "type": "object",
      "description": "Human contact information for report submission.",
      "minProperties": 1,
      "properties": {
        "email": {
          "type": "string",
          "description": "Email address of the accessibility coordinator or team. SHOULD use mailto: URI format."
        },
        "phone": {
          "type": "string",
          "description": "Voice phone number for accessibility reporting. SHOULD use tel: URI format."
        },
        "tty": {
          "type": "string",
          "description": "TTY/TDD phone number. SHOULD use tel: URI format."
        },
        "relay": {
          "type": "string",
          "description": "Telecommunications relay service number. SHOULD use tel: URI format."
        },
        "name": {
          "type": "string",
          "description": "Display name for the contact."
        },
        "contactType": {
          "type": "string",
          "description": "Purpose or role of this contact point (e.g., \"accessibility\", \"technical support\")."
        },
        "url": {
          "type": "string",
          "format": "uri",
          "description": "A human-accessible web page for reporting issues."
        }
      },
      "additionalProperties": true
    },
    "statement": {
      "type": "string",
      "format": "uri",
      "description": "URI of the operator's accessibility statement or conformity declaration."
    },
    "enforcementProcedure": {
      "type": "string",
      "format": "uri",
      "description": "URI of the relevant national enforcement or complaint procedure."
    }
  },
  "anyOf": [
    { "required": ["reporting"] },
    { "required": ["contact"] }
  ],
  "additionalProperties": true
}
```

## Appendix E: Report JSON Schema

The following JSON Schema defines the structure of a report payload submitted via POST to the reporting endpoint.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Accessibility Issue Report",
  "description": "A structured report describing exactly one accessibility issue, as defined by this specification.",
  "type": "object",
  "required": ["version", "data"],
  "properties": {
    "@context": {
      "oneOf": [
        {
          "type": "object",
          "description": "Inline JSON-LD context defining compact IRI prefixes.",
          "additionalProperties": { "type": "string", "format": "uri" }
        },
        {
          "type": "string",
          "format": "uri",
          "description": "URI referencing an externally hosted JSON-LD context document."
        }
      ],
      "description": "JSON-LD context. Defines prefixes used in @type/@id references (e.g., earl:, WCAG22:, act:). REQUIRED when the issue contains a rules array (see §6.1); not enforceable via static schema alone."
    },
    "version": {
      "type": "string",
      "const": "1.0",
      "description": "Schema version. MUST be \"1.0\"."
    },
    "page": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the page where the issue was observed."
    },
    "reporter": {
      "type": "object",
      "description": "Information about the reporter.",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["human", "automated", "human-assisted"],
          "description": "The type of reporter."
        },
        "userAgent": {
          "type": "string",
          "description": "Browser or tool user agent string."
        },
        "assistiveTechnology": {
          "type": "string",
          "description": "Name and version of any assistive technology in use."
        },
        "locale": {
          "type": "string",
          "description": "Reporter's BCP 47 locale."
        },
        "identity": {
          "type": "string",
          "description": "Opaque identifier for the reporter. Only included when authentication is in use and the reporter consents."
        },
        "contact": {
          "type": "object",
          "description": "Contact information for follow-up. Only included when the operator declares reporterContact: true (§4.3) and the reporter consents (§6.2.1).",
          "properties": {
            "name": {
              "type": "string",
              "description": "Display name for the reporter."
            },
            "email": {
              "type": "string",
              "description": "Email address. SHOULD use mailto: URI format."
            },
            "url": {
              "type": "string",
              "format": "uri",
              "description": "A URL where the reporter can be reached."
            }
          },
          "additionalProperties": true
        }
      },
      "additionalProperties": true
    },
    "data": {
      "type": "object",
      "description": "The Issue Object.",
      "required": ["description"],
      "properties": {
          "description": {
            "type": "string",
            "description": "Human-readable description of the issue."
          },
          "page": {
            "type": "string",
            "format": "uri",
            "description": "Page URL for this issue. Overrides the top-level page field when present."
          },
          "impact": {
            "type": "string",
            "description": "Reporter's assessment of the severity of the barrier."
          },
          "rules": {
            "type": "array",
            "description": "Accessibility rules implicated, as JSON-LD typed references. Covers all vocabularies.",
            "items": {
              "type": "object",
              "required": ["@type", "@id"],
              "properties": {
                "@type": {
                  "type": "string",
                  "description": "Compact IRI identifying the type of rule. RECOMMENDED values: \"earl:TestRequirement\" (high-level requirements), \"earl:TestCase\" (concrete rules). Custom types are permitted for domain-specific vocabularies."
                },
                "@id": {
                  "type": "string",
                  "description": "Compact IRI identifying the rule (e.g., \"WCAG22:name-role-value\", \"act:23a2a8\", \"axe:empty-heading\")."
                }
              },
              "additionalProperties": true
            }
          },
          "element": {
            "type": "object",
            "description": "A description of the affected element.",
            "properties": {
              "locators": {
                "type": "array",
                "description": "Ordered list of strategies for locating the element.",
                "items": {
                  "type": "object",
                  "required": ["type", "value"],
                  "properties": {
                    "type": {
                      "type": "string",
                      "description": "Locator strategy. Defined values: \"css\", \"aria\", \"xpath\", \"text\", \"pierce\", \"testid\"."
                    },
                    "value": {
                      "type": "string",
                      "description": "Locator value appropriate to the strategy."
                    }
                  },
                  "additionalProperties": true
                }
              },
              "snapshot": {
                "type": "object",
                "description": "Accessibility tree state of the element at the time of the issue.",
                "properties": {
                  "role": {
                    "type": "string",
                    "description": "The ARIA or implicit role of the element."
                  },
                  "name": {
                    "type": "string",
                    "description": "The computed accessible name."
                  },
                  "description": {
                    "type": "string",
                    "description": "The computed accessible description."
                  },
                  "value": {
                    "type": ["string", "null"],
                    "description": "The current value of the element, if applicable."
                  },
                  "states": {
                    "type": "object",
                    "description": "Accessibility states (e.g., disabled, focused, expanded, checked, selected, pressed).",
                    "additionalProperties": {
                      "type": ["boolean", "null"]
                    }
                  },
                  "ignored": {
                    "type": "boolean",
                    "description": "Whether the element is excluded from the accessibility tree."
                  },
                  "ignoredReasons": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Reasons why the element is excluded from the accessibility tree."
                  },
                  "parent": {
                    "type": "object",
                    "description": "Snapshot of the parent node, following the same structure recursively.",
                    "additionalProperties": true
                  },
                  "children": {
                    "type": "array",
                    "description": "Simplified snapshots of child nodes.",
                    "items": {
                      "type": "object",
                      "additionalProperties": true
                    }
                  }
                },
                "additionalProperties": true
              },
              "label": {
                "type": "string",
                "description": "A human-readable description of the element."
              }
            },
            "additionalProperties": true
          },
          "steps": {
            "type": "string",
            "description": "Steps to reproduce the issue."
          },
          "attachments": {
            "$ref": "#/properties/attachments",
            "description": "Attachments specific to this issue. Same schema as top-level attachments."
          }
        },
        "additionalProperties": true
    },
    "attachments": {
      "type": "array",
      "description": "Attachments such as screenshots or DOM snapshots.",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["screenshot", "domSnapshot", "video", "other"],
            "description": "The attachment type."
          },
          "json": {
            "type": "object",
            "description": "Inline JSON content for natively structured data."
          },
          "data": {
            "type": "string",
            "description": "Base64-encoded content for binary or non-JSON text."
          },
          "url": {
            "type": "string",
            "format": "uri",
            "description": "URI where the attachment content can be retrieved. MUST use HTTPS."
          },
          "format": {
            "type": "string",
            "description": "Named sub-format of the content, corresponding to the operator's declared formats (§4.3.2). E.g., \"accessibility-tree\" or \"dom-fragment\" for domSnapshot."
          },
          "mimeType": {
            "type": "string",
            "description": "MIME type of the attached content."
          },
          "description": {
            "type": "string",
            "description": "Human-readable description of the attachment."
          }
        },
        "oneOf": [
          { "required": ["type", "json"] },
          { "required": ["type", "data"] },
          { "required": ["type", "url"] }
        ],
        "additionalProperties": true
      }
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of when the issue was observed."
    },
    "locale": {
      "type": "string",
      "description": "BCP 47 language tag for the report content."
    }
  },
  "additionalProperties": true
}
```

## Appendix F: Endpoint Descriptor JSON Schema

The following JSON Schema defines the structure of the Endpoint Descriptor returned by an unauthenticated GET request ([§5.2.1](#521-unauthenticated-get)).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Endpoint Descriptor",
  "description": "Describes the capabilities of an accessibility reporting endpoint, returned by an unauthenticated GET request.",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "description": "Schema version of this descriptor."
    },
    "description": {
      "type": "string",
      "description": "Human-readable description of the endpoint."
    },
    "accepts": {
      "type": "object",
      "description": "Same structure as reporting.accepts in the discovery document (Appendix D)."
    },
    "methods": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["POST", "GET", "PUT", "DELETE"]
      },
      "description": "HTTP methods supported by the endpoint."
    },
    "preferredLocales": {
      "type": "array",
      "items": { "type": "string" },
      "description": "BCP 47 language tags indicating the operator's preferred language(s) for report content."
    },
    "authentication": {
      "type": "string",
      "enum": ["none", "optional", "required"],
      "description": "Authentication requirement."
    },
    "authDocumentation": {
      "type": "string",
      "format": "uri",
      "description": "URI of a document describing how reporters obtain credentials and authenticate with the endpoint."
    },
    "rateLimit": {
      "type": "boolean",
      "default": false,
      "description": "Advisory. If true, the operator advertises that it may reject or throttle reports."
    },
    "responseTime": {
      "type": "string",
      "description": "Advisory. The operator's expected time to acknowledge or act on a submitted report."
    },
    "schema": {
      "type": "string",
      "format": "uri",
      "description": "URI pointing to a machine-readable JSON Schema for the report payload."
    },
    "mutableFields": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Top-level report field names that may be amended via PUT (§5.3)."
    }
  },
  "additionalProperties": true
}
```

## Appendix G: Report Status Object JSON Schema

The following JSON Schema defines the structure of a Report Status Object returned by an authenticated GET request ([§5.2.2](#522-authenticated-get)) or a successful PUT request ([§5.3](#53-amending-a-report-put--optional)).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Report Status Object",
  "description": "Represents the current status of a previously submitted accessibility report.",
  "type": "object",
  "required": ["id", "status"],
  "properties": {
    "id": {
      "type": "string",
      "description": "The operator-assigned report identifier."
    },
    "status": {
      "type": "string",
      "enum": ["open", "in-progress", "resolved", "closed", "duplicate", "wont-fix"],
      "description": "Report lifecycle status."
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "Absolute URI for PUT/DELETE requests. REQUIRED when reporting.methods includes PUT or DELETE."
    },
    "created": {
      "type": "string",
      "format": "date-time",
      "description": "When the report was originally submitted."
    },
    "updated": {
      "type": "string",
      "format": "date-time",
      "description": "When the report status last changed."
    },
    "page": {
      "type": "string",
      "format": "uri",
      "description": "The page URL from the original report."
    },
    "summary": {
      "type": "string",
      "description": "A short description of the reported issue."
    },
    "reason": {
      "type": "string",
      "description": "Human-readable explanation for the current status (e.g., disproportionate burden, duplicate rationale)."
    }
  },
  "additionalProperties": true
}
```

## Appendix H: Authenticated GET Response JSON Schema

The following JSON Schema defines the structure of the response from an authenticated GET request ([§5.2.2](#522-authenticated-get)). The response is either an array of Report Status Objects or a wrapper object containing both an Endpoint Descriptor and the report data. Reporters detect the response shape by checking whether the top-level value is an array (unwrapped) or an object (wrapped, with a `"reports"` key).

> **Note:** [§5.2.2](#522-authenticated-get) defines a third response shape — an object without a `"reports"` key — which represents a plain Endpoint Descriptor with no report data. That shape is validated by the Endpoint Descriptor schema ([Appendix F](#appendix-f-endpoint-descriptor-json-schema)), not this schema. This schema covers only the two report-bearing response shapes.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Authenticated GET Response",
  "description": "Response from an authenticated GET request: either an array of Report Status Objects or a wrapper containing an Endpoint Descriptor and report data.",
  "oneOf": [
    {
      "type": "array",
      "description": "Unwrapped response: an array of Report Status Objects.",
      "items": { "$ref": "#/$defs/reportStatusObject" }
    },
    {
      "type": "object",
      "description": "Wrapped response: an Endpoint Descriptor alongside report data.",
      "required": ["reports"],
      "properties": {
        "endpoint": {
          "type": "object",
          "description": "Endpoint Descriptor (same structure as Appendix F)."
        },
        "reports": {
          "type": "array",
          "description": "Array of Report Status Objects.",
          "items": { "$ref": "#/$defs/reportStatusObject" }
        }
      },
      "additionalProperties": true
    }
  ],
  "$defs": {
    "reportStatusObject": {
      "type": "object",
      "required": ["id", "status"],
      "properties": {
        "id": {
          "type": "string",
          "description": "The operator-assigned report identifier."
        },
        "status": {
          "type": "string",
          "enum": ["open", "in-progress", "resolved", "closed", "duplicate", "wont-fix"],
          "description": "Report lifecycle status."
        },
        "url": {
          "type": "string",
          "format": "uri",
          "description": "Absolute URI for PUT/DELETE requests. REQUIRED when reporting.methods includes PUT or DELETE."
        },
        "created": {
          "type": "string",
          "format": "date-time",
          "description": "When the report was originally submitted."
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "description": "When the report status last changed."
        },
        "page": {
          "type": "string",
          "format": "uri",
          "description": "The page URL from the original report."
        },
        "summary": {
          "type": "string",
          "description": "A short description of the reported issue."
        },
        "reason": {
          "type": "string",
          "description": "Human-readable explanation for the current status."
        }
      },
      "additionalProperties": true
    }
  }
}
```

## Appendix I: Report Receipt JSON Schema

The following JSON Schema defines the structure of the Report Receipt returned as the 201 response body after a successful POST submission ([§5.1.1](#511-report-receipt)).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Report Receipt",
  "description": "Receipt returned after a successful report submission (201 Created).",
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Operator-assigned report identifier."
    },
    "status": {
      "type": "string",
      "enum": ["received", "pending-review"],
      "description": "Receipt status reflecting initial processing only. Transitions to report lifecycle statuses (§5.2.2) once the operator begins processing."
    },
    "message": {
      "type": "string",
      "description": "Human-readable message, in a language from the operator's declared preferredLocales."
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "Absolute URI where the reporter may retrieve report status. REQUIRED when the operator declares PUT or DELETE in reporting.methods; OPTIONAL otherwise. Not enforceable via static schema alone."
    }
  },
  "additionalProperties": true
}
```

## Appendix J: Error Response JSON Schema

The following JSON Schema defines the structure of error responses returned for failed submissions and other 4xx responses ([§5.1.2](#512-error-responses)).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Error Response",
  "description": "Error response returned for failed submissions and other 4xx responses.",
  "type": "object",
  "required": ["error", "message"],
  "properties": {
    "error": {
      "type": "string",
      "description": "Machine-readable error code (e.g., \"payload_too_large\", \"validation_failed\", \"rate_limited\", \"duplicate\", \"unauthorized\")."
    },
    "message": {
      "type": "string",
      "description": "Human-readable description of the error, in a language from the operator's declared preferredLocales."
    },
    "details": {
      "type": "array",
      "description": "Field-level error details. Each object SHOULD contain field and reason; additional properties are permitted.",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string",
            "description": "JSON path to the problematic field (e.g., \"data.rules[0]\", \"attachments[0].data\")."
          },
          "reason": {
            "type": "string",
            "description": "Human-readable explanation of the error for this field."
          }
        },
        "additionalProperties": true
      }
    },
    "retryAfter": {
      "type": "integer",
      "minimum": 0,
      "description": "Seconds until the reporter may retry. Operators SHOULD include this for 429 responses."
    }
  },
  "additionalProperties": true
}
```
