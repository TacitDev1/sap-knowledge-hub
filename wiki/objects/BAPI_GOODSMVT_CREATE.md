---
type: object
updated: 2026-10-21
---
# BAPI_GOODSMVT_CREATE

Posts a goods movement and returns the material document. It is the programmatic version of MIGO.

## Choosing the scenario
`GOODSMVT_CODE-GM_CODE` tells the BAPI what kind of movement this is:

| GM_CODE | Scenario |
|---|---|
| 01 | goods receipt for a purchase order |
| 02 | goods receipt for a production order |
| 03 | goods issue |
| 04 | transfer posting |
| 05 | other goods receipt |
| 06 | reversal |

The movement type on each item (for example `201`, issue to a cost centre) must fit the code.

## Tips
- Fill only the fields the movement type needs. Extra account assignment fields can cause odd errors.
- The material document number comes back in `MATERIALDOCUMENT` with the year in `MATDOCUMENTYEAR`.
- Commit with [[BAPI_TRANSACTION_COMMIT]] as described in [[bapi-luw]].
- Follow-on logic after the posting belongs in `MB_DOCUMENT_BADI`, see [[enhancement-framework]].

The inbox note *Goods issue to a cost centre in one call* has a working example.
