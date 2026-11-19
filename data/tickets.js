/* Offline service-desk mirror. Shape: { generatedAt, items:[{ key, url, status, type, priority, project, updated, summary, note? }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_TICKETS = {
  "generatedAt": "2026-11-19",
  "items": [
    {
      "key": "BRW-112",
      "url": "https://larkwell-desk.example/browse/BRW-112",
      "status": "In Progress",
      "type": "Incident",
      "priority": "High",
      "project": "Brackenfield Waste",
      "updated": "2026-11-18",
      "summary": "Dispatch team sees an empty launchpad after the upgrade",
      "note": "Upgrade switched the launchpad to spaces mode; roles only carried catalogs and groups. Spaces built for 3 of 5 roles."
    },
    {
      "key": "BRW-118",
      "url": "https://larkwell-desk.example/browse/BRW-118",
      "status": "Waiting for customer",
      "type": "Incident",
      "priority": "Medium",
      "project": "Brackenfield Waste",
      "updated": "2026-11-17",
      "summary": "Weighbridge clerks get \"no authorization\" posting goods receipts",
      "note": "SU53 shows M_MSEG_WWA for plant 2300. Waiting on Jonas to confirm the new depot belongs in their role."
    },
    {
      "key": "BRW-121",
      "url": "https://larkwell-desk.example/browse/BRW-121",
      "status": "Pending",
      "type": "Change",
      "priority": "Medium",
      "project": "Brackenfield Waste",
      "updated": "2026-11-14",
      "summary": "Depot roles: one parent role, derived roles per plant",
      "note": "Design agreed with Tobias. Build starts after BRW-112 is closed."
    },
    {
      "key": "BRW-124",
      "url": "https://larkwell-desk.example/browse/BRW-124",
      "status": "In Progress",
      "type": "Incident",
      "priority": "High",
      "project": "Brackenfield Waste",
      "updated": "2026-11-19",
      "summary": "Driver app: OData calls fail with 403, then show every depot",
      "note": "S_SERVICE fixed; CSRF issue sits with the proxy team; access control on the view in BQ1."
    },
    {
      "key": "BRW-127",
      "url": "https://larkwell-desk.example/browse/BRW-127",
      "status": "Pending",
      "type": "Task",
      "priority": "Low",
      "project": "Brackenfield Waste",
      "updated": "2026-11-12",
      "summary": "Quarterly access review: admin transactions and wildcard roles"
    },
    {
      "key": "OSU-201",
      "url": "https://larkwell-desk.example/browse/OSU-201",
      "status": "In Progress",
      "type": "Change",
      "priority": "Medium",
      "project": "Osterby Utilities",
      "updated": "2026-11-18",
      "summary": "Security audit log: filters for failed logons and RFC calls in BP1",
      "note": "Draft filters in BQ1 since Monday. Log volume about 40 MB a day."
    },
    {
      "key": "OSU-207",
      "url": "https://larkwell-desk.example/browse/OSU-207",
      "status": "Resolved",
      "type": "Incident",
      "priority": "High",
      "project": "Osterby Utilities",
      "updated": "2026-11-13",
      "summary": "Meter readers locked out after the password rule change",
      "note": "Cause: tablets retrying a cached password. Device team re-enrolling; RSUSR006 checked each morning."
    },
    {
      "key": "OSU-212",
      "url": "https://larkwell-desk.example/browse/OSU-212",
      "status": "Waiting for customer",
      "type": "Incident",
      "priority": "Medium",
      "project": "Osterby Utilities",
      "updated": "2026-11-16",
      "summary": "Trusted RFC from the reporting system fails with \"no RFC authorization\"",
      "note": "Missing S_RFCACL for the calling system ID. Role change ready; needs Anouk to approve."
    },
    {
      "key": "OSU-215",
      "url": "https://larkwell-desk.example/browse/OSU-215",
      "status": "Pending",
      "type": "Change",
      "priority": "Low",
      "project": "Osterby Utilities",
      "updated": "2026-11-10",
      "summary": "Add the purchase order approval tile to the buyer role"
    },
    {
      "key": "OSU-219",
      "url": "https://larkwell-desk.example/browse/OSU-219",
      "status": "In Progress",
      "type": "Task",
      "priority": "Medium",
      "project": "Osterby Utilities",
      "updated": "2026-11-19",
      "summary": "Renew the SSL server certificate before it expires on 4 December",
      "note": "CSR sent from STRUST to the Osterby PKI team on 18 Nov."
    }
  ]
};
