---
type: object
updated: 2026-10-28
---
# CL_SALV_TABLE

The quickest way to show an internal table as an ALV grid: sorting, filtering, totals and export to a spreadsheet come for free.

```
TRY.
    cl_salv_table=>factory(
      IMPORTING r_salv_table = DATA(lo_alv)
      CHANGING  t_table      = lt_output ).
    lo_alv->get_functions( )->set_all( abap_true ).
    lo_alv->get_columns( )->set_optimize( abap_true ).
    lo_alv->display( ).
  CATCH cx_salv_msg INTO DATA(lx).
    MESSAGE lx->get_text( ) TYPE 'I'.
ENDTRY.
```

## Good to know
- It is display only. If users must edit cells, use `CL_GUI_ALV_GRID` instead.
- Column headings come from the data elements. A local type built from dictionary types gives proper headings without extra code.
- Works in background jobs too: the output goes to the spool.
- Keep the table lean: select only what you show (see [[open-sql-performance]]).

Used in the "guarded update" report pattern and planned for BRW-121. Ticket [[BRW-112]] shows the result of each upload this way.
