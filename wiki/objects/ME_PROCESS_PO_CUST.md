---
type: object
updated: 2026-11-13
---
# ME_PROCESS_PO_CUST

The main BAdI for purchase orders. It runs in ME21N, ME22N and ME23N, and also when a PO is created through `BAPI_PO_CREATE1`, so one implementation covers both screens and interfaces.

## Methods you will use most
| Method | Use it to |
|---|---|
| `PROCESS_HEADER` | default or adjust header fields |
| `PROCESS_ITEM` | default or adjust item fields |
| `PROCESS_ACCOUNT` | work on account assignment lines |
| `CHECK` | validate the whole document before save; set `CH_FAILED` to block it |
| `POST` | last chance before the database update; no messages to the user here |

## Patterns
- Read data through the object references (`im_header->get_items( )`, `get_accountings( )`), not from global memory.
- Filter first. In [[OSU-207]] the check returns at once unless the order type is `ZNB`.
- Raise messages from a message class, so they can be translated and found in the PO's message log.
- Do not commit inside the BAdI. See [[BAPI_TRANSACTION_COMMIT]].

Background: [[enhancement-framework]].
