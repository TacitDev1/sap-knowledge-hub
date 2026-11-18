---
type: concept
updated: 2026-11-12
---
# Open SQL performance habits

Most slow custom reports break one of a few rules. Check these before reaching for a trace.

## The rules
1. **Read only the columns you need.** `SELECT *` on a wide table moves a lot of data for nothing.
2. **No SELECT inside a LOOP.** Read everything you need once, then use a sorted or hashed internal table to look rows up.
3. **Guard FOR ALL ENTRIES.** If the driver table is empty, the WHERE clause is dropped and the whole table is read.
4. **Use the index.** Filter on the leading key fields. ST05 shows whether the database used an index.
5. **Aggregate in the database.** `SUM`, `COUNT` and `GROUP BY` beat reading every row into ABAP.
6. **Package huge reads.** `SELECT ... PACKAGE SIZE` or a cursor keeps memory flat. Ignoring this gives the memory dumps seen in OSU-219.

## Example: FOR ALL ENTRIES with the guard
```
IF lt_orders IS NOT INITIAL.
  SELECT vbeln, posnr, matnr
    FROM vbap
    FOR ALL ENTRIES IN @lt_orders
    WHERE vbeln = @lt_orders-vbeln
    INTO TABLE @DATA(lt_items).
ENDIF.
```

## Tools
- ST05 for the SQL trace, SAT for runtime analysis, SCI for static checks.
- Show the result with [[CL_SALV_TABLE]] rather than WRITE lists, so users can sort and export.

Related: [[number-ranges]] (another "it works until two people run it" problem).
