---
type: concept
updated: 2026-11-16
---
# IDoc basics

An IDoc is SAP's envelope for exchanging business documents with other systems. Each one has a **control record** (who sent it, what type it is, which direction), any number of **data records** (segments holding the content) and a trail of **status records**.

## Statuses worth knowing
| Status | Direction | Meaning |
|---|---|---|
| 03 | outbound | handed to the port |
| 30 | outbound | ready, waiting for dispatch |
| 51 | inbound | application error, not posted |
| 53 | inbound | posted, application document created |
| 64 | inbound | ready to be processed |
| 68 | either | error, no further processing |

## How inbound processing is decided
The **partner profile** (WE20) links sender, message type and an inbound **process code**. The process code points at the function module that turns segments into a document, often by calling a BAPI. If a partner profile points at the wrong process code, every IDoc from that sender fails the same way. That is what happened in [[BRW-124]].

## Fixing a failed IDoc
1. Read the status text in WE02. It usually names the field or master data that is missing.
2. Fix the cause (master data, config, or code).
3. Replay one IDoc first. WE19 copies an IDoc so you can test without touching the original.
4. Reprocess the rest with BD87.

## Related
- The posting function usually ends in a BAPI commit, see [[bapi-luw]].
- Sales order IDocs create the same documents as [[BAPI_SALESORDER_CREATEFROMDAT2]].
- Inbox note: *Find stuck IDocs from the last 24 hours* has a query for status 51.
