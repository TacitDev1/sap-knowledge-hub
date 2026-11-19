/* Transaction codes for security, authorization and Fiori work, grouped by area. Shape: { generatedAt, items:[{ code, title, module, note? }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_TCODES = {
  "generatedAt": "2026-11-19",
  "items": [
    {
      "code": "SU01",
      "title": "User maintenance",
      "module": "Users & roles",
      "note": "create, lock, reset password, assign roles"
    },
    {
      "code": "SU01D",
      "title": "Display users",
      "module": "Users & roles",
      "note": "read-only, safe to hand out"
    },
    {
      "code": "SU10",
      "title": "Mass user changes",
      "module": "Users & roles",
      "note": "lock, unlock or add roles for many users"
    },
    {
      "code": "SU3",
      "title": "Own user data",
      "module": "Users & roles",
      "note": "defaults, parameters, date format"
    },
    {
      "code": "PFCG",
      "title": "Role maintenance",
      "module": "Users & roles",
      "note": "menu, authorizations, users, profile generation"
    },
    {
      "code": "PFUD",
      "title": "User master comparison",
      "module": "Users & roles",
      "note": "for many roles at once"
    },
    {
      "code": "SUGR",
      "title": "User groups",
      "module": "Users & roles",
      "note": "groups for S_USER_GRP"
    },
    {
      "code": "SUPC",
      "title": "Mass profile generation",
      "module": "Users & roles",
      "note": "after a big SU24 change"
    },
    {
      "code": "SU56",
      "title": "User buffer",
      "module": "Users & roles",
      "note": "what the system thinks the user holds right now"
    },
    {
      "code": "SU02",
      "title": "Profiles (manual)",
      "module": "Users & roles",
      "note": "legacy; avoid new manual profiles"
    },
    {
      "code": "SU53",
      "title": "Last failed authorization check",
      "module": "Authorization analysis",
      "note": "first stop for \"no authorization\""
    },
    {
      "code": "STAUTHTRACE",
      "title": "Authorization trace",
      "module": "Authorization analysis",
      "note": "traces every check, across servers"
    },
    {
      "code": "ST01",
      "title": "System trace",
      "module": "Authorization analysis",
      "note": "authorization, RFC and kernel traces"
    },
    {
      "code": "SUIM",
      "title": "User information system",
      "module": "Authorization analysis",
      "note": "who has what, where used, change documents"
    },
    {
      "code": "SU24",
      "title": "Proposals and check indicators",
      "module": "Authorization analysis",
      "note": "default values PFCG proposes"
    },
    {
      "code": "SU25",
      "title": "Upgrade SU24 data",
      "module": "Authorization analysis",
      "note": "compare after an upgrade or support pack"
    },
    {
      "code": "SU22",
      "title": "SAP proposals (SAP data)",
      "module": "Authorization analysis",
      "note": "read it, maintain SU24 instead"
    },
    {
      "code": "SU21",
      "title": "Authorization objects",
      "module": "Authorization analysis",
      "note": "object classes, fields, documentation"
    },
    {
      "code": "SU20",
      "title": "Authorization fields",
      "module": "Authorization analysis"
    },
    {
      "code": "SACF",
      "title": "Switchable authorization checks",
      "module": "Authorization analysis",
      "note": "checks SAP ships switched off"
    },
    {
      "code": "RSAU_CONFIG",
      "title": "Security audit log configuration",
      "module": "Security & audit",
      "note": "filters and settings"
    },
    {
      "code": "RSAU_READ_LOG",
      "title": "Read the security audit log",
      "module": "Security & audit"
    },
    {
      "code": "SM19",
      "title": "Audit log configuration (older)",
      "module": "Security & audit",
      "note": "replaced by RSAU_CONFIG"
    },
    {
      "code": "SM20",
      "title": "Audit log analysis (older)",
      "module": "Security & audit",
      "note": "replaced by RSAU_READ_LOG"
    },
    {
      "code": "SECPOL",
      "title": "Security policies",
      "module": "Security & audit",
      "note": "password and logon rules per group of users"
    },
    {
      "code": "RZ10",
      "title": "Profile parameters",
      "module": "Security & audit",
      "note": "permanent, needs a restart for static ones"
    },
    {
      "code": "RZ11",
      "title": "Display or change a parameter",
      "module": "Security & audit",
      "note": "dynamic parameters take effect at once"
    },
    {
      "code": "SM01_DEV",
      "title": "Lock transactions (system-wide)",
      "module": "Security & audit",
      "note": "for everyone, in every client"
    },
    {
      "code": "SM01_CUS",
      "title": "Lock transactions (client)",
      "module": "Security & audit",
      "note": "client-specific lock"
    },
    {
      "code": "SCC4",
      "title": "Client settings",
      "module": "Security & audit",
      "note": "changes and transports allowed?"
    },
    {
      "code": "SE06",
      "title": "System change option",
      "module": "Security & audit",
      "note": "is the system open for repairs?"
    },
    {
      "code": "/UI2/FLP",
      "title": "Open the launchpad",
      "module": "Fiori launchpad",
      "note": "from the GUI, in the browser"
    },
    {
      "code": "/UI2/FLPD_CUST",
      "title": "Launchpad designer (client)",
      "module": "Fiori launchpad",
      "note": "catalogs and groups, this client"
    },
    {
      "code": "/UI2/FLPD_CONF",
      "title": "Launchpad designer (all clients)",
      "module": "Fiori launchpad",
      "note": "cross-client content"
    },
    {
      "code": "/UI2/FLPCM_CUST",
      "title": "Launchpad content manager (client)",
      "module": "Fiori launchpad",
      "note": "catalogs, tiles, target mappings"
    },
    {
      "code": "/UI2/FLPCM_CONF",
      "title": "Launchpad content manager (all clients)",
      "module": "Fiori launchpad"
    },
    {
      "code": "/UI2/FLIA",
      "title": "Launchpad intent analysis",
      "module": "Fiori launchpad",
      "note": "why an intent does or does not resolve"
    },
    {
      "code": "/UI2/FLC",
      "title": "Launchpad checks",
      "module": "Fiori launchpad",
      "note": "consistency of catalogs and mappings"
    },
    {
      "code": "/UI2/SEMOBJ",
      "title": "Semantic objects",
      "module": "Fiori launchpad",
      "note": "the first half of every intent"
    },
    {
      "code": "/UI2/INVALIDATE_CLIENT_CACHES",
      "title": "Clear launchpad caches (client)",
      "module": "Fiori launchpad",
      "note": "report, run in SE38"
    },
    {
      "code": "/UI2/INVALIDATE_GLOBAL_CACHES",
      "title": "Clear launchpad caches (all clients)",
      "module": "Fiori launchpad",
      "note": "report, run in SE38"
    },
    {
      "code": "/UI5/APP_INDEX_CALCULATE",
      "title": "Recalculate the UI5 app index",
      "module": "Fiori launchpad",
      "note": "report, after deploying an app"
    },
    {
      "code": "/IWFND/MAINT_SERVICE",
      "title": "Activate and maintain services",
      "module": "Gateway & OData",
      "note": "also shows the ICF node"
    },
    {
      "code": "/IWFND/ERROR_LOG",
      "title": "Gateway error log (front end)",
      "module": "Gateway & OData",
      "note": "start here for a failing call"
    },
    {
      "code": "/IWBEP/ERROR_LOG",
      "title": "Gateway error log (back end)",
      "module": "Gateway & OData",
      "note": "the business error behind a 500"
    },
    {
      "code": "/IWFND/GW_CLIENT",
      "title": "Gateway client",
      "module": "Gateway & OData",
      "note": "replay a call as yourself"
    },
    {
      "code": "/IWFND/TRACES",
      "title": "Gateway traces",
      "module": "Gateway & OData",
      "note": "payloads and performance per user"
    },
    {
      "code": "/IWFND/CACHE_CLEANUP",
      "title": "Metadata cache (front end)",
      "module": "Gateway & OData",
      "note": "after a model change"
    },
    {
      "code": "/IWBEP/CACHE_CLEANUP",
      "title": "Metadata cache (back end)",
      "module": "Gateway & OData"
    },
    {
      "code": "SICF",
      "title": "HTTP services (ICF)",
      "module": "Gateway & OData",
      "note": "activate nodes, logon settings"
    },
    {
      "code": "SM59",
      "title": "RFC destinations",
      "module": "Connectivity & certificates",
      "note": "connection and authorization tests"
    },
    {
      "code": "SMT1",
      "title": "Trusted-trusting systems",
      "module": "Connectivity & certificates",
      "note": "set up trusted RFC"
    },
    {
      "code": "STRUST",
      "title": "Trust manager",
      "module": "Connectivity & certificates",
      "note": "certificates and PSEs, check expiry dates"
    },
    {
      "code": "SAML2",
      "title": "SAML 2.0 configuration",
      "module": "Connectivity & certificates",
      "note": "single sign-on in the browser"
    },
    {
      "code": "SNC0",
      "title": "SNC access control list",
      "module": "Connectivity & certificates",
      "note": "which systems may connect with SNC"
    },
    {
      "code": "SMICM",
      "title": "ICM monitor",
      "module": "Connectivity & certificates",
      "note": "HTTP ports, certificates in use, traces"
    },
    {
      "code": "SOAMANAGER",
      "title": "Web service configuration",
      "module": "Connectivity & certificates"
    },
    {
      "code": "AL08",
      "title": "Users logged on (all servers)",
      "module": "Basis & monitoring"
    },
    {
      "code": "SM04",
      "title": "User sessions (this server)",
      "module": "Basis & monitoring"
    },
    {
      "code": "SM21",
      "title": "System log",
      "module": "Basis & monitoring"
    },
    {
      "code": "ST22",
      "title": "Short dumps",
      "module": "Basis & monitoring",
      "note": "incl. dumps from failed checks in code"
    },
    {
      "code": "SM12",
      "title": "Lock entries",
      "module": "Basis & monitoring",
      "note": "locked roles in PFCG show here"
    },
    {
      "code": "SM37",
      "title": "Job overview",
      "module": "Basis & monitoring",
      "note": "is PFCG_TIME_DEPENDENCY running?"
    },
    {
      "code": "SM36",
      "title": "Schedule a job",
      "module": "Basis & monitoring"
    },
    {
      "code": "SLG1",
      "title": "Application log",
      "module": "Basis & monitoring"
    },
    {
      "code": "STMS",
      "title": "Transport management",
      "module": "Basis & monitoring",
      "note": "role transports to QA and production"
    },
    {
      "code": "SE01",
      "title": "Transport organizer (extended)",
      "module": "Basis & monitoring"
    },
    {
      "code": "SE16N",
      "title": "Table display",
      "module": "Development (still handy)",
      "note": "AGR_USERS, AGR_1251, USR02"
    },
    {
      "code": "SE11",
      "title": "Data dictionary",
      "module": "Development (still handy)"
    },
    {
      "code": "SE38",
      "title": "ABAP editor",
      "module": "Development (still handy)",
      "note": "run RSUSR reports here"
    },
    {
      "code": "SE80",
      "title": "Object navigator",
      "module": "Development (still handy)",
      "note": "UI5 apps in the BSP repository"
    },
    {
      "code": "SE93",
      "title": "Transactions",
      "module": "Development (still handy)",
      "note": "which object a transaction checks at start"
    },
    {
      "code": "SE37",
      "title": "Function builder",
      "module": "Development (still handy)"
    }
  ]
};
