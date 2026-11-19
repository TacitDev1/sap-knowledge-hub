/* From Claude: write-ups, code and walkthroughs handed over from chat. Shape: { generatedAt, items:[{ title, note, code }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_INBOX = {
  "generatedAt": "2026-11-19",
  "items": [
    {
      "title": "Who can run the admin transactions? (BRW-127)",
      "note": "First pass for the quarterly access review. Reads S_TCODE values straight from the roles, so it also catches a full wildcard. It does not expand ranges like SU*: SUIM (RSUSR002) stays the authority, this is only the quick list.",
      "code": "REPORT zbrw_critical_tcodes.\n\nTYPES ty_tcodes TYPE RANGE OF agr_1251-low.\nDATA(lt_critical) = VALUE ty_tcodes( sign = 'I' option = 'EQ'\n  ( low = 'SU01' ) ( low = 'PFCG' ) ( low = 'SE16N' ) ( low = 'SM59' ) ( low = 'STMS' ) ).\n\nSELECT DISTINCT u~uname, a~agr_name, a~low\n  FROM agr_1251 AS a\n  INNER JOIN agr_users AS u ON u~agr_name = a~agr_name\n  WHERE a~object  = 'S_TCODE'\n    AND a~field   = 'TCD'\n    AND a~deleted = @space\n    AND ( a~low IN @lt_critical OR a~low = '*' )\n    AND u~from_dat <= @sy-datum\n    AND u~to_dat   >= @sy-datum\n  ORDER BY u~uname\n  INTO TABLE @DATA(lt_hits).\n\ncl_salv_table=>factory( IMPORTING r_salv_table = DATA(lo_alv)\n                        CHANGING  t_table      = lt_hits ).\nlo_alv->display( )."
    },
    {
      "title": "Access control for the driver app view (BRW-124)",
      "note": "Drivers saw every depot. The view now filters on plant through the same authorization object the goods receipt checks use, so one role grants both. Activate it with the view; nothing else to configure.",
      "code": "@EndUserText.label: 'Drivers see their own depot only'\n@MappingRole: true\ndefine role ZI_BRW_DRIVERSTOP_DCL {\n  grant select on ZI_BRW_DriverStop\n    where ( Plant ) = aspect pfcg_auth( M_MSEG_WWA, WERKS, ACTVT = '03' );\n}"
    },
    {
      "title": "Depot roles as derived roles (BRW-121)",
      "note": "Walkthrough agreed with Tobias. One parent role holds the menu and every authorization; each depot gets a derived role that only differs in its organisational levels.",
      "code": "1. PFCG: create parent role ZBRW_DEPOT_CLERK (menu + authorizations, org levels left open)\n2. Authorizations tab: maintain every field except the org levels, generate the profile\n3. For each depot: create ZBRW_DEPOT_CLERK_D1, _D2, ... with \"Derive from role\" = ZBRW_DEPOT_CLERK\n4. In each child: Org levels -> plant (WERKS) and storage locations, generate\n5. Back in the parent: Authorizations -> \"Generate derived roles\" after every parent change\n6. Assign users to the child roles only, never to the parent\n7. User comparison (PFUD) once the transport lands in BP1"
    },
    {
      "title": "Launchpad tile checklist (BRW-112)",
      "note": "The checks that found the empty launchpad, in the order that finds the cause fastest. Kept for the next upgrade.",
      "code": "1. Which mode? Spaces and pages, or classic groups. An upgrade can switch it.\n2. Role menu (PFCG): does the business role carry the catalog AND a space (or group)?\n3. Target mapping: open /UI2/FLIA for the user and the intent (e.g. #SalesOrder-manage)\n4. Backend service: /IWFND/MAINT_SERVICE active, ICF node active, S_SERVICE in a role\n5. Caches: run /UI2/INVALIDATE_CLIENT_CACHES, then clear the browser cache\n6. Still empty? Open the launchpad with sap-ui-debug=true and read the console"
    },
    {
      "title": "What we set for the new password rules (OSU-207)",
      "note": "Values agreed with the Osterby security officer, set in RZ10 for BP1 and moved to BQ1 first. The lockouts afterwards came from tablets retrying a cached password, not from the rules themselves.",
      "code": "login/min_password_lng                  = 12\nlogin/min_password_digits               = 1\nlogin/min_password_specials             = 1\nlogin/fails_to_user_lock                = 5\nlogin/failed_user_auto_unlock           = 0\nlogin/password_compliance_to_current_policy = 1\n\nMorning check while the tablets are re-enrolled:\n  SE38 -> RSUSR006 (users locked by failed logons)"
    }
  ]
};
