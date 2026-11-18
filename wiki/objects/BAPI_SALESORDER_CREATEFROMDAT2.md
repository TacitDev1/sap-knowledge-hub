---
type: object
updated: 2026-11-11
---
# BAPI_SALESORDER_CREATEFROMDAT2

Creates a sales order from header, item, partner and schedule line tables. Used for uploads and interfaces when VA01 by hand is not an option.

## Main parameters
| Parameter | Structure | What goes in |
|---|---|---|
| `ORDER_HEADER_IN` | `BAPISDHD1` | order type, sales area, dates |
| `ORDER_HEADER_INX` | `BAPISDHD1X` | an `X` for every header field you filled |
| `ORDER_ITEMS_IN` | `BAPISDITM` | item number, material, quantity |
| `ORDER_ITEMS_INX` | `BAPISDITMX` | the matching `X` flags per item |
| `ORDER_PARTNERS` | `BAPIPARNR` | partner role and number |
| `ORDER_SCHEDULES_IN` | `BAPISCHDL` | requested quantities and dates |
| `RETURN` | `BAPIRET2` | messages |
| `SALESDOCUMENT` | export | the new order number |

## Gotchas
- **Partner roles use the internal codes.** Sold-to is `AG` and ship-to is `WE`, whatever your logon language shows on screen. Sending the translated codes gives "sold-to party not maintained". See [[BRW-112]].
- **Customer numbers need leading zeros.** Run them through the ALPHA conversion first.
- **Nothing is saved without a commit.** Follow [[bapi-luw]] and call [[BAPI_TRANSACTION_COMMIT]].
- `TESTRUN = X` runs every check without creating anything. Handy as a "test mode" switch for uploads.

## Related
- Inbound sales order IDocs end up creating the same document: [[idoc-basics]].
- The SD save can be extended through BADI_SD_SALES: [[enhancement-framework]].
