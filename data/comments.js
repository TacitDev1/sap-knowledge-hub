/* Ticket comment threads, keyed by ticket key. Shape: { generatedAt, threads:{ KEY:[{ a: author, d: date, t: text }] } }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_COMMENTS = {
  "generatedAt": "2026-11-16",
  "threads": {
    "BRW-112": [
      {
        "a": "Jonas",
        "d": "2026-11-09",
        "t": "Attached the first route file. About 400 orders, one row per bin."
      },
      {
        "a": "Mara",
        "d": "2026-11-11",
        "t": "Test run in BQ1 created nothing: every order came back with \"sold-to party not maintained\". The upload sent SP/SH as partner roles; the BAPI wants the internal codes AG/WE. Fixed."
      },
      {
        "a": "Mara",
        "d": "2026-11-13",
        "t": "Second test run clean, 398 of 400 orders. The two failures are customers blocked for sales, which is correct. Waiting on the final file."
      }
    ],
    "BRW-124": [
      {
        "a": "Priya",
        "d": "2026-11-16",
        "t": "Around 120 ORDERS IDocs in status 51 since Saturday. The new route system went live Friday evening."
      },
      {
        "a": "Mara",
        "d": "2026-11-16",
        "t": "WE20 for the new sender still uses the old inbound process code. Corrected in BQ1 and replayed three IDocs with WE19: all posted. Will raise the change for BP1 and then mass-reprocess with BD87."
      }
    ],
    "OSU-207": [
      {
        "a": "Tobias",
        "d": "2026-11-06",
        "t": "Finance wants hard stops, not warnings, for ZNB orders without a cost centre."
      },
      {
        "a": "Mara",
        "d": "2026-11-12",
        "t": "Done in ME_PROCESS_PO_CUST~CHECK with CH_FAILED. BAPI_PO_CREATE1 goes through the same BAdI, so interface-created POs are covered too."
      },
      {
        "a": "Tobias",
        "d": "2026-11-13",
        "t": "Tested in BD1 with the three scenarios from the spec. Happy for BQ1."
      }
    ],
    "OSU-212": [
      {
        "a": "Mara",
        "d": "2026-11-11",
        "t": "No custom code in the payment run path for this company code. The skipped vendors all have bank details added this month."
      }
    ]
  }
};
