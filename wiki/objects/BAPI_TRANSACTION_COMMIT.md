---
type: object
updated: 2026-11-04
---
# BAPI_TRANSACTION_COMMIT

Ends the logical unit of work after one or more BAPI calls, so their changes are written. Its partner is `BAPI_TRANSACTION_ROLLBACK`.

```
CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
  EXPORTING wait   = abap_true
  IMPORTING return = ls_return.
```

## When to pass WAIT
Pass `WAIT = abap_true` when the next step reads what you just created, or posts a follow-on document. Without it the update may still be running.

## Checklist before calling it
- `RETURN` from the BAPI has no `E` or `A` rows.
- You are not inside a BAdI or user exit that runs during someone else's save. Committing there breaks their LUW. See [[enhancement-framework]].
- In a test mode, skip the commit and roll back instead.

The full reasoning is on [[bapi-luw]]. Used by [[BAPI_SALESORDER_CREATEFROMDAT2]], [[BAPI_GOODSMVT_CREATE]] and the upload in [[BRW-112]].
