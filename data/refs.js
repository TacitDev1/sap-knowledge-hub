/* Researched references: FMs, BAPIs, BAdIs and classes. Shape: { generatedAt, items:[{ type: FM|BAPI|BADI|CLASS, name, desc, code }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_REFS = {
  "generatedAt": "2026-11-16",
  "items": [
    {
      "type": "BAPI",
      "name": "BAPI_SALESORDER_CREATEFROMDAT2",
      "desc": "Creates a sales order. Header, items, partners and schedule lines go in as tables; the order number comes back in SALESDOCUMENT. Does not commit on its own. Partner roles use the internal codes (AG sold-to, WE ship-to).",
      "code": "CALL FUNCTION 'BAPI_SALESORDER_CREATEFROMDAT2'\n  EXPORTING order_header_in  = ls_head\n            order_header_inx = ls_headx\n  IMPORTING salesdocument    = lv_vbeln\n  TABLES    return           = lt_return\n            order_items_in   = lt_items\n            order_items_inx  = lt_itemx\n            order_partners   = lt_partners."
    },
    {
      "type": "BAPI",
      "name": "BAPI_TRANSACTION_COMMIT",
      "desc": "Commits what a BAPI has queued. Pass WAIT = X when you read the result back straight away, so the update task has finished first.",
      "code": "CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'\n  EXPORTING wait   = abap_true\n  IMPORTING return = ls_return."
    },
    {
      "type": "BAPI",
      "name": "BAPI_TRANSACTION_ROLLBACK",
      "desc": "Throws away everything queued in the current LUW. Call it whenever RETURN holds an E or A message.",
      "code": "CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'."
    },
    {
      "type": "BAPI",
      "name": "BAPI_GOODSMVT_CREATE",
      "desc": "Posts a goods movement (the MIGO equivalent). GM_CODE picks the scenario: 01 GR for PO, 03 goods issue, 04 transfer posting, 05 other receipt. Returns the material document and year.",
      "code": "CALL FUNCTION 'BAPI_GOODSMVT_CREATE'\n  EXPORTING goodsmvt_header  = ls_head\n            goodsmvt_code    = ls_code\n  IMPORTING materialdocument = lv_mblnr\n            matdocumentyear  = lv_mjahr\n  TABLES    goodsmvt_item    = lt_items\n            return           = lt_return."
    },
    {
      "type": "BAPI",
      "name": "BAPI_PO_CREATE1",
      "desc": "Creates a purchase order with the same checks as ME21N, so ME_PROCESS_PO_CUST runs too. Every field you fill in POITEM needs its X flag in POITEMX.",
      "code": "CALL FUNCTION 'BAPI_PO_CREATE1'\n  EXPORTING poheader         = ls_head\n            poheaderx        = ls_headx\n  IMPORTING exppurchaseorder = lv_ebeln\n  TABLES    return           = lt_return\n            poitem           = lt_item\n            poitemx          = lt_itemx."
    },
    {
      "type": "BAPI",
      "name": "BAPI_MATERIAL_GET_DETAIL",
      "desc": "Reads general, plant and valuation data for one material without touching MARA/MARC directly.",
      "code": "CALL FUNCTION 'BAPI_MATERIAL_GET_DETAIL'\n  EXPORTING material              = lv_matnr\n            plant                 = '1000'\n  IMPORTING material_general_data = ls_general\n            return                = ls_return."
    },
    {
      "type": "BAPI",
      "name": "BAPI_ALM_ORDER_MAINTAIN",
      "desc": "Creates or changes plant maintenance orders. Driven by a METHODS table (CREATE, CHANGE, SAVE...) that refers to rows in the header and operation tables.",
      "code": "CALL FUNCTION 'BAPI_ALM_ORDER_MAINTAIN'\n  TABLES it_methods   = lt_methods\n         it_header    = lt_header\n         it_operation = lt_oper\n         return       = lt_return."
    },
    {
      "type": "FM",
      "name": "CONVERSION_EXIT_ALPHA_OUTPUT",
      "desc": "Strips leading zeros for display. In new code the string template option ALPHA = OUT does the same.",
      "code": "CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'\n  EXPORTING input  = lv_kunnr\n  IMPORTING output = lv_show."
    },
    {
      "type": "FM",
      "name": "NUMBER_GET_NEXT",
      "desc": "Draws the next number from a number range object (SNRO). Safe under parallel load, unlike SELECT MAX( ) + 1.",
      "code": "CALL FUNCTION 'NUMBER_GET_NEXT'\n  EXPORTING nr_range_nr = '01'\n            object      = 'ZWEIGHTKT'\n  IMPORTING number      = lv_number\n  EXCEPTIONS OTHERS     = 1."
    },
    {
      "type": "FM",
      "name": "GUI_UPLOAD",
      "desc": "Reads a file from the user's PC into an internal table. Foreground only; in background jobs read from the application server instead.",
      "code": "CALL FUNCTION 'GUI_UPLOAD'\n  EXPORTING filename            = lv_file\n            filetype            = 'ASC'\n            has_field_separator = abap_true\n  TABLES    data_tab            = lt_raw."
    },
    {
      "type": "FM",
      "name": "BAL_LOG_CREATE",
      "desc": "Opens an application log. Add messages with BAL_LOG_MSG_ADD, save with BAL_DB_SAVE, read them in SLG1.",
      "code": "CALL FUNCTION 'BAL_LOG_CREATE'\n  EXPORTING i_s_log      = ls_log\n  IMPORTING e_log_handle = lv_handle."
    },
    {
      "type": "FM",
      "name": "ENQUEUE_EZ_EXAMPLE",
      "desc": "Pattern for a lock module generated from a lock object (SE11, name starts with EZ). Always pair with the DEQUEUE_ module.",
      "code": "CALL FUNCTION 'ENQUEUE_EZ_EXAMPLE'\n  EXPORTING mode_ztable = 'E'\n            key_field   = lv_key\n  EXCEPTIONS foreign_lock = 1\n             OTHERS       = 2."
    },
    {
      "type": "FM",
      "name": "IDOC_INBOUND_WRITE_TO_DB",
      "desc": "Writes an inbound IDoc to the database from your own code, for example when a file arrives outside the usual port. Processing then follows the partner profile.",
      "code": "CALL FUNCTION 'IDOC_INBOUND_WRITE_TO_DB'\n  EXPORTING pi_status_message = ls_status\n  IMPORTING pe_idoc_number    = lv_docnum\n  TABLES    t_data_records    = lt_edidd\n  CHANGING  pc_control_record = ls_edidc."
    },
    {
      "type": "BADI",
      "name": "ME_PROCESS_PO_CUST",
      "desc": "The main enhancement point for purchase orders in ME21N/ME22N and BAPI_PO_CREATE1. CHECK can block the save (set CH_FAILED), PROCESS_ITEM can default fields.",
      "code": "METHOD if_ex_me_process_po_cust~process_item.\n  DATA(ls_item) = im_item->get_data( ).\n  \" default or validate fields here\nENDMETHOD."
    },
    {
      "type": "BADI",
      "name": "BADI_SD_SALES",
      "desc": "Kernel BAdI for sales documents. Lets you check or fill fields on header and item save without touching user exits in MV45AFZZ.",
      "code": "\" implement in SE19 as a new BAdI implementation\n\" filter by sales document type where possible"
    },
    {
      "type": "BADI",
      "name": "MB_DOCUMENT_BADI",
      "desc": "Runs when a material document is posted. MB_DOCUMENT_BEFORE_UPDATE sees the final document and is a good place for follow-on logging.",
      "code": "METHOD if_ex_mb_document_badi~mb_document_before_update.\n  \" xmkpf / xmseg hold the new document\nENDMETHOD."
    },
    {
      "type": "CLASS",
      "name": "CL_SALV_TABLE",
      "desc": "Shows an internal table as an ALV grid with sorting, filters and export, in four lines. Display only: use CL_GUI_ALV_GRID if users must edit.",
      "code": "cl_salv_table=>factory(\n  IMPORTING r_salv_table = DATA(lo_alv)\n  CHANGING  t_table      = lt_output ).\nlo_alv->display( )."
    },
    {
      "type": "CLASS",
      "name": "CL_ABAP_TYPEDESCR",
      "desc": "Runtime type information (RTTI). DESCRIBE_BY_DATA tells you the type of any variable, which helps when building generic tools.",
      "code": "DATA(lo_type) = cl_abap_typedescr=>describe_by_data( lv_any ).\nWRITE lo_type->absolute_name."
    },
    {
      "type": "CLASS",
      "name": "CL_BCS",
      "desc": "Business Communication Services. Builds and sends mail with attachments; the mail goes out on COMMIT WORK.",
      "code": "DATA(lo_send) = cl_bcs=>create_persistent( ).\n\" set_document, add_recipient, send( ), then COMMIT WORK"
    }
  ]
};
