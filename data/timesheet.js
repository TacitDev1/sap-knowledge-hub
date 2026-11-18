/* Reconstructed working week. The last week in the list is shown. Hours typed in the page stay in localStorage. Shape: { generatedAt, secondClient, weeks:[{ label, days:[{ dow, date, note?, entries:[{ id, ref, refUrl, client, source, title, what }] }] }] }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_TIMESHEET = {
  "generatedAt": "2026-11-16",
  "secondClient": "Osterby",
  "weeks": [
    {
      "label": "Week of 9 November 2026",
      "days": [
        {
          "dow": "Mon",
          "date": "2026-11-09",
          "entries": [
            {
              "id": "w46-01",
              "ref": "BRW-112",
              "refUrl": "https://larkwell-desk.example/browse/BRW-112",
              "client": "Brackenfield Waste",
              "source": "ticket",
              "title": "Sales order upload: build and first test run",
              "what": "Wrote the upload report around BAPI_SALESORDER_CREATEFROMDAT2 with a test-run switch. First run in BQ1 against the sample file."
            },
            {
              "id": "w46-02",
              "ref": "OSU-215",
              "refUrl": "https://larkwell-desk.example/browse/OSU-215",
              "client": "Osterby Utilities",
              "source": "ticket",
              "title": "Failed updates after the tariff upload",
              "what": "Read the SM13 entries with the customer and explained why a failed V1 update leaves the upload half done."
            }
          ]
        },
        {
          "dow": "Tue",
          "date": "2026-11-10",
          "entries": [
            {
              "id": "w46-03",
              "ref": "OSU-207",
              "refUrl": "https://larkwell-desk.example/browse/OSU-207",
              "client": "Osterby Utilities",
              "source": "ticket",
              "title": "Cost centre check on purchase orders",
              "what": "Implemented ME_PROCESS_PO_CUST~CHECK for order type ZNB and wrote the test cases."
            },
            {
              "id": "w46-04",
              "ref": "Release plan",
              "refUrl": "",
              "client": "Brackenfield Waste",
              "source": "project plan",
              "title": "Quarterly release planning",
              "what": "Went through the BQ1 transport queue with Lena and agreed the cut-off for the December release."
            }
          ]
        },
        {
          "dow": "Wed",
          "date": "2026-11-11",
          "entries": [
            {
              "id": "w46-05",
              "ref": "BRW-112",
              "refUrl": "https://larkwell-desk.example/browse/BRW-112",
              "client": "Brackenfield Waste",
              "source": "ticket",
              "title": "Partner role fix",
              "what": "Traced the \"sold-to party not maintained\" errors to the partner role codes. Switched to AG/WE and re-ran."
            },
            {
              "id": "w46-06",
              "ref": "OSU-212",
              "refUrl": "https://larkwell-desk.example/browse/OSU-212",
              "client": "Osterby Utilities",
              "source": "ticket",
              "title": "Payment run skipping vendors",
              "what": "Ruled out custom code, handed over to finance config with the evidence."
            }
          ]
        },
        {
          "dow": "Thu",
          "date": "2026-11-12",
          "note": "Internal training day at Larkwell. Nothing logged against either client.",
          "entries": []
        },
        {
          "dow": "Fri",
          "date": "2026-11-13",
          "entries": [
            {
              "id": "w46-07",
              "ref": "OSU-207",
              "refUrl": "https://larkwell-desk.example/browse/OSU-207",
              "client": "Osterby Utilities",
              "source": "ticket",
              "title": "Test sign-off and transport",
              "what": "Walked Tobias through the BD1 tests and released the transport to BQ1."
            },
            {
              "id": "w46-08",
              "ref": "BRW-118",
              "refUrl": "https://larkwell-desk.example/browse/BRW-118",
              "client": "Brackenfield Waste",
              "source": "ticket",
              "title": "Duplicate weighbridge numbers",
              "what": "Reproduced the duplicate with two parallel sessions. Wrote up the number range proposal."
            }
          ]
        }
      ]
    }
  ]
};
