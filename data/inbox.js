/* From Claude: code and walkthroughs handed over from chat. Shape: { generatedAt, items:[{ title, note, code }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_INBOX = {
  "generatedAt": "2026-11-16",
  "items": [
    {
      "title": "Sales order from a flat file (BRW-112)",
      "note": "Reads a tab-separated upload, builds header, items and partners, calls BAPI_SALESORDER_CREATEFROMDAT2 and only commits when RETURN is clean. Test mode is on by default.",
      "code": "REPORT zbrw_so_upload.\n\nPARAMETERS: p_file TYPE string LOWER CASE OBLIGATORY,\n            p_test AS CHECKBOX DEFAULT abap_true.\n\nDATA: ls_head  TYPE bapisdhd1,\n      ls_headx TYPE bapisdhd1x,\n      lt_items TYPE STANDARD TABLE OF bapisditm,\n      lt_itemx TYPE STANDARD TABLE OF bapisditmx,\n      lt_part  TYPE STANDARD TABLE OF bapiparnr,\n      lt_ret   TYPE STANDARD TABLE OF bapiret2,\n      lv_vbeln TYPE vbeln_va.\n\nSTART-OF-SELECTION.\n  ls_head  = VALUE #( doc_type = 'ZOR' sales_org = '1000' distr_chan = '10' division = '00' ).\n  ls_headx = VALUE #( updateflag = 'I' doc_type = 'X' sales_org = 'X' distr_chan = 'X' division = 'X' ).\n  lt_part  = VALUE #( ( partn_role = 'AG' partn_numb = '0000100042' )\n                      ( partn_role = 'WE' partn_numb = '0000100042' ) ).\n  \" ... fill lt_items / lt_itemx from the file, item numbers 10, 20, 30 ...\n\n  CALL FUNCTION 'BAPI_SALESORDER_CREATEFROMDAT2'\n    EXPORTING order_header_in  = ls_head\n              order_header_inx = ls_headx\n              testrun          = p_test\n    IMPORTING salesdocument    = lv_vbeln\n    TABLES    return           = lt_ret\n              order_items_in   = lt_items\n              order_items_inx  = lt_itemx\n              order_partners   = lt_part.\n\n  IF line_exists( lt_ret[ type = 'E' ] ) OR line_exists( lt_ret[ type = 'A' ] ).\n    CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.\n  ELSEIF p_test = abap_false.\n    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT' EXPORTING wait = abap_true.\n  ENDIF."
    },
    {
      "title": "Block PO save when the cost centre is missing (OSU-207)",
      "note": "Implementation of ME_PROCESS_PO_CUST, method CHECK. Only runs for document type ZNB so standard POs are untouched.",
      "code": "METHOD if_ex_me_process_po_cust~check.\n  DATA(ls_header) = im_header->get_data( ).\n  CHECK ls_header-bsart = 'ZNB'.\n\n  LOOP AT im_header->get_items( ) INTO DATA(ls_item_ref).\n    DATA(lo_item) = ls_item_ref-item.\n    LOOP AT lo_item->get_accountings( ) INTO DATA(ls_acc_ref).\n      DATA(ls_acc) = ls_acc_ref-accounting->get_data( ).\n      IF ls_acc-kostl IS INITIAL.\n        MESSAGE e001(zosu_mm) WITH lo_item->get_data( )-ebelp.\n        ch_failed = abap_true.\n      ENDIF.\n    ENDLOOP.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "title": "Goods issue to a cost centre in one call",
      "note": "GM_CODE 03 is goods issue; movement type 201 posts to a cost centre. Reuse for the bin-repair materials job.",
      "code": "DATA(ls_head) = VALUE bapi2017_gm_head_01( pstng_date = sy-datum doc_date = sy-datum\n                                           header_txt = 'Bin repair kit' ).\nDATA(lt_item) = VALUE tab_bapi_goodsmvt_item(\n  ( material = 'BIN-LID-240' plant = '1000' stge_loc = '0001'\n    move_type = '201' entry_qnt = 4 entry_uom = 'ST' costcenter = '0000041100' ) ).\nDATA lt_ret TYPE STANDARD TABLE OF bapiret2.\n\nCALL FUNCTION 'BAPI_GOODSMVT_CREATE'\n  EXPORTING goodsmvt_header  = ls_head\n            goodsmvt_code    = VALUE bapi2017_gm_code( gm_code = '03' )\n  IMPORTING materialdocument = DATA(lv_mblnr)\n  TABLES    goodsmvt_item    = lt_item\n            return           = lt_ret."
    },
    {
      "title": "Find stuck IDocs from the last 24 hours",
      "note": "Quick read of EDIDC for inbound IDocs in error status 51. Paste the result into a ticket or reprocess in BD87.",
      "code": "DATA(lv_from) = sy-datum - 1.\n\nSELECT docnum, mestyp, status, credat, cretim, sndprn\n  FROM edidc\n  WHERE direct = '2'\n    AND status = '51'\n    AND credat >= @lv_from\n  ORDER BY credat DESCENDING, cretim DESCENDING\n  INTO TABLE @DATA(lt_stuck).\n\ncl_demo_output=>display( lt_stuck )."
    },
    {
      "title": "Config walkthrough: new number range for weighbridge tickets",
      "note": "No code, just the steps agreed with Lena for BQ1 first, then transport to BP1.",
      "code": "* 1. SNRO   -> create object ZWEIGHTKT, length 10, warning at 90 %\n* 2. SNRO   -> intervals: 01 = 7000000000 - 7999999999 (internal)\n* 3. SE38   -> ZBRW_WEIGH_POST: replace the MAX( ) + 1 lookup with\n*             NUMBER_GET_NEXT (nr_range_nr = '01', object = 'ZWEIGHTKT')\n* 4. Transport the object and the report; intervals are maintained per\n*    system (do NOT transport them), then set the BP1 interval by hand."
    }
  ]
};
