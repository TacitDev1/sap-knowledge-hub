/* Offline service-desk mirror. Shape: { generatedAt, items:[{ key, url, status, type, priority, project, updated, summary, note? }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_TICKETS = {
  "generatedAt": "2026-11-16",
  "items": [
    {
      "key": "BRW-112",
      "url": "https://larkwell-desk.example/browse/BRW-112",
      "status": "In Progress",
      "type": "Change",
      "priority": "High",
      "project": "Brackenfield Waste",
      "updated": "2026-11-13",
      "summary": "Upload customer bin orders from the route-planning spreadsheet",
      "note": "BAPI_SALESORDER_CREATEFROMDAT2 with test mode. Partner role mix-up fixed; waiting on the last file from Jonas."
    },
    {
      "key": "BRW-118",
      "url": "https://larkwell-desk.example/browse/BRW-118",
      "status": "Waiting for customer",
      "type": "Incident",
      "priority": "Medium",
      "project": "Brackenfield Waste",
      "updated": "2026-11-12",
      "summary": "Weighbridge tickets get duplicate numbers when two lanes post at once",
      "note": "Root cause: SELECT MAX( ) + 1. Proposed a number range object; needs sign-off."
    },
    {
      "key": "BRW-121",
      "url": "https://larkwell-desk.example/browse/BRW-121",
      "status": "Open",
      "type": "Service request",
      "priority": "Low",
      "project": "Brackenfield Waste",
      "updated": "2026-11-10",
      "summary": "New SALV report: open bin repair orders by depot"
    },
    {
      "key": "BRW-124",
      "url": "https://larkwell-desk.example/browse/BRW-124",
      "status": "In Progress",
      "type": "Incident",
      "priority": "Highest",
      "project": "Brackenfield Waste",
      "updated": "2026-11-16",
      "summary": "Inbound ORDERS IDocs stuck in status 51 since the weekend",
      "note": "Partner profile for the new route system points at the old process code. Reprocessing in BQ1 first."
    },
    {
      "key": "BRW-127",
      "url": "https://larkwell-desk.example/browse/BRW-127",
      "status": "Open",
      "type": "Change",
      "priority": "Medium",
      "project": "Brackenfield Waste",
      "updated": "2026-11-14",
      "summary": "Default storage location on goods issues for repair kits"
    },
    {
      "key": "OSU-201",
      "url": "https://larkwell-desk.example/browse/OSU-201",
      "status": "Pending",
      "type": "Change",
      "priority": "Medium",
      "project": "Osterby Utilities",
      "updated": "2026-11-05",
      "summary": "Meter replacement orders: add the old meter number to the order print"
    },
    {
      "key": "OSU-207",
      "url": "https://larkwell-desk.example/browse/OSU-207",
      "status": "In Progress",
      "type": "Change",
      "priority": "High",
      "project": "Osterby Utilities",
      "updated": "2026-11-13",
      "summary": "Block purchase orders without a cost centre for the ZNB order type",
      "note": "ME_PROCESS_PO_CUST CHECK method; unit-tested in BD1, transport to BQ1 ready."
    },
    {
      "key": "OSU-212",
      "url": "https://larkwell-desk.example/browse/OSU-212",
      "status": "Waiting for support",
      "type": "Incident",
      "priority": "High",
      "project": "Osterby Utilities",
      "updated": "2026-11-11",
      "summary": "Payment run F110 skips vendors with a new bank account",
      "note": "Looks like config, not code. Asked Anouk to check the house bank ranking."
    },
    {
      "key": "OSU-215",
      "url": "https://larkwell-desk.example/browse/OSU-215",
      "status": "Open",
      "type": "Service request",
      "priority": "Low",
      "project": "Osterby Utilities",
      "updated": "2026-11-09",
      "summary": "Explain why SM13 shows failed updates after the tariff upload"
    },
    {
      "key": "OSU-219",
      "url": "https://larkwell-desk.example/browse/OSU-219",
      "status": "Pending",
      "type": "Incident",
      "priority": "Medium",
      "project": "Osterby Utilities",
      "updated": "2026-11-12",
      "summary": "Short dump TSV_TNEW_PAGE_ALLOC_FAILED in the monthly consumption report",
      "note": "Report loads every reading into memory. Plan: package the SELECT and aggregate as we go."
    }
  ]
};
