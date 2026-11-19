/* Researched references. Shape: { generatedAt, items:[{ type: AUTH|TABLE|FM|REPORT|FIORI, name, desc, code }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_REFS = {
  "generatedAt": "2026-11-19",
  "items": [
    {
      "type": "AUTH",
      "name": "S_TCODE",
      "desc": "Checked when a transaction starts. One field, TCD. A user without the code in a role gets \"You are not authorized to use transaction ...\". Wildcards (SU*) count, so review them.",
      "code": "AUTHORITY-CHECK OBJECT 'S_TCODE'\n  ID 'TCD' FIELD 'SU01'.\n\" or the FM: AUTHORITY_CHECK_TCODE"
    },
    {
      "type": "AUTH",
      "name": "S_SERVICE",
      "desc": "Checked when a user calls an OData or other external service. Fields SRV_NAME (a generated hash) and SRV_TYPE (HT for Gateway services). Never typed by hand: add the service to the role menu and PFCG fills it in.",
      "code": "PFCG -> Menu -> Authorization Default\n  -> TADIR Service\n  -> R3TR IWSG ZBRW_DRIVER_SRV_0001"
    },
    {
      "type": "AUTH",
      "name": "S_RFC",
      "desc": "Checked when a function module is called remotely. RFC_TYPE is FUGR or FUNC, RFC_NAME the group or module, ACTVT 16. Prefer single modules over whole groups for technical users.",
      "code": "S_RFC\n  RFC_TYPE = FUNC\n  RFC_NAME = BAPI_USER_GET_DETAIL\n  ACTVT    = 16"
    },
    {
      "type": "AUTH",
      "name": "S_RFCACL",
      "desc": "Trusted RFC. Lets a user in a trusted system log on here without a password. Lives in the role of the user in the trusting (target) system. Keep RFC_EQUSER = Y and avoid a wildcard RFC_USER.",
      "code": "RFC_SYSID  = <calling system ID>\nRFC_CLIENT = 100\nRFC_USER   = (blank when RFC_EQUSER = Y)\nRFC_EQUSER = Y\nACTVT      = 16"
    },
    {
      "type": "AUTH",
      "name": "S_TABU_NAM",
      "desc": "Table access by table name, for SE16, SM30 and the generic table tools. Use it instead of S_TABU_DIS when you want to grant one table rather than a whole authorization group.",
      "code": "AUTHORITY-CHECK OBJECT 'S_TABU_NAM'\n  ID 'ACTVT'     FIELD '03'\n  ID 'TABLE'     FIELD 'AGR_USERS'."
    },
    {
      "type": "AUTH",
      "name": "S_USER_AGR",
      "desc": "Who may maintain or assign roles. Field ACT_GROUP is the role name, so a naming convention (Z_BRW_*) lets you hand a team its own roles only.",
      "code": "S_USER_AGR\n  ACT_GROUP = Z_BRW_*\n  ACTVT     = 01, 02, 03, 22"
    },
    {
      "type": "AUTH",
      "name": "M_MSEG_WWA",
      "desc": "Goods movements by plant. The plant check the weighbridge clerks failed in BRW-118. Its siblings are M_MSEG_BWA (movement type) and M_MSEG_LGO (storage location).",
      "code": "AUTHORITY-CHECK OBJECT 'M_MSEG_WWA'\n  ID 'ACTVT' FIELD '01'\n  ID 'WERKS' FIELD lv_plant."
    },
    {
      "type": "TABLE",
      "name": "AGR_USERS",
      "desc": "Which user has which role, with validity dates. The first table to look at in an access review.",
      "code": "SELECT agr_name, from_dat, to_dat\n  FROM agr_users\n  WHERE uname = @lv_user\n  INTO TABLE @DATA(lt_roles)."
    },
    {
      "type": "TABLE",
      "name": "AGR_1251",
      "desc": "The authorization values inside each role: object, field, low and high. Filter DELETED = space, or you will read values that were removed from the role.",
      "code": "SE16N -> AGR_1251\n  AGR_NAME = Z_BRW_*\n  OBJECT   = S_TCODE\n  DELETED  = (blank)"
    },
    {
      "type": "TABLE",
      "name": "USR02",
      "desc": "Logon data: user type, validity, last logon and lock status. UFLAG 64 is an admin lock, 128 a lock from failed logons.",
      "code": "SELECT bname, uflag, trdat\n  FROM usr02\n  WHERE uflag <> 0\n  INTO TABLE @DATA(lt_locked)."
    },
    {
      "type": "TABLE",
      "name": "USOBT_C",
      "desc": "Your SU24 proposals: which authorization values PFCG should propose for a transaction or service. Fix missing defaults here, not by hand in every role.",
      "code": "SU24 -> Transaction or TADIR service\n  -> Object: check indicator + proposal\n  -> Save to a transport"
    },
    {
      "type": "FM",
      "name": "AUTHORITY_CHECK_TCODE",
      "desc": "Checks S_TCODE for a transaction from your own code, the same way the system does when the transaction starts.",
      "code": "CALL FUNCTION 'AUTHORITY_CHECK_TCODE'\n  EXPORTING  tcode  = 'SU01'\n  EXCEPTIONS ok     = 0\n             not_ok = 1\n             OTHERS = 2."
    },
    {
      "type": "FM",
      "name": "SUSR_USER_AUTH_FOR_OBJ_GET",
      "desc": "Reads the values a user holds for one authorization object, from the user buffer. Useful to explain why a check passes or fails.",
      "code": "CALL FUNCTION 'SUSR_USER_AUTH_FOR_OBJ_GET'\n  EXPORTING user_name = lv_user\n            sel_object = 'M_MSEG_WWA'\n  TABLES    values     = lt_values."
    },
    {
      "type": "FM",
      "name": "BAPI_USER_ACTGROUPS_ASSIGN",
      "desc": "Assigns roles to a user. Careful: it replaces the full list, so read the current roles first and send them back with the new one.",
      "code": "CALL FUNCTION 'BAPI_USER_ACTGROUPS_ASSIGN'\n  EXPORTING username       = lv_user\n  TABLES    activitygroups = lt_all_roles\n            return         = lt_return."
    },
    {
      "type": "REPORT",
      "name": "RSUSR002",
      "desc": "Users by complex selection criteria: who holds a given object with given values, across all their roles. The authority behind every access review question.",
      "code": "SUIM -> User -> Users by Complex Selection Criteria\n  (or SE38 -> RSUSR002)"
    },
    {
      "type": "REPORT",
      "name": "PFCG_TIME_DEPENDENCY",
      "desc": "User master comparison as a job. Removes profiles from expired role assignments and adds them for assignments that start today. Schedule it daily, shortly after midnight.",
      "code": "SM36 -> step: ABAP program PFCG_TIME_DEPENDENCY\n  -> periodic, daily"
    },
    {
      "type": "REPORT",
      "name": "/UI2/INVALIDATE_CLIENT_CACHES",
      "desc": "Clears the launchpad caches for the client after catalog, space or role changes. Its global sibling /UI2/INVALIDATE_GLOBAL_CACHES clears every client.",
      "code": "SE38 -> /UI2/INVALIDATE_CLIENT_CACHES\n  -> for all users, then ask the user to clear the browser cache"
    },
    {
      "type": "FIORI",
      "name": "/sap/bc/ui2/flp",
      "desc": "The ICF path of the launchpad. If SICF shows it inactive, nobody gets a launchpad at all.",
      "code": "https://<host>:<port>/sap/bc/ui2/flp?sap-client=100"
    },
    {
      "type": "FIORI",
      "name": "/sap/opu/odata/sap/",
      "desc": "Where Gateway OData services live. Call the $metadata of a service here to check activation and authorization in one go.",
      "code": "/sap/opu/odata/sap/ZBRW_DRIVER_SRV/$metadata"
    },
    {
      "type": "FIORI",
      "name": "sap-ui-debug=true",
      "desc": "URL parameter that loads the readable UI5 sources, so the browser console shows real error text instead of minified noise. Slow; use it for one session only.",
      "code": "/sap/bc/ui2/flp?sap-client=100&sap-ui-debug=true"
    }
  ]
};
