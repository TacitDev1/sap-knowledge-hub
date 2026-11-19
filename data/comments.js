/* Ticket comment threads, keyed by ticket key. Shape: { generatedAt, threads:{ KEY:[{ a: author, d: date, t: text }] } }
   Invented demo data for the SAP Knowledge Hub template. Edit freely. */
window.CLAUDE_COMMENTS = {
  "generatedAt": "2026-11-19",
  "threads": {
    "BRW-112": [
      {
        "a": "Jonas",
        "d": "2026-11-16",
        "t": "Since the weekend the dispatch team opens the launchpad and sees nothing. Not even the search works for them."
      },
      {
        "a": "Mara",
        "d": "2026-11-17",
        "t": "The upgrade switched the launchpad to spaces and pages. Their role still has the catalogs, so the apps are allowed, but there is no space to show them on. Building one space per business role now."
      },
      {
        "a": "Mara",
        "d": "2026-11-18",
        "t": "Dispatch, weighbridge and depot clerk roles have spaces in BQ1. Jonas, can two of your team test there tomorrow morning?"
      }
    ],
    "BRW-118": [
      {
        "a": "Lena",
        "d": "2026-11-14",
        "t": "Clerks at the new Harrow Lane depot cannot post goods receipts. The other depots are fine."
      },
      {
        "a": "Mara",
        "d": "2026-11-15",
        "t": "SU53 for one of the clerks: M_MSEG_WWA with plant 2300 failed. Their role covers plants 2100 and 2200 only. Easy to add, but it is a decision for the business: is Harrow Lane part of the same team?"
      },
      {
        "a": "Jonas",
        "d": "2026-11-17",
        "t": "Checking with the depot manager. Back to you on Thursday."
      }
    ],
    "OSU-207": [
      {
        "a": "Sipho",
        "d": "2026-11-11",
        "t": "About 40 meter readers locked out since this morning. All of them on the field tablets."
      },
      {
        "a": "Mara",
        "d": "2026-11-11",
        "t": "Unlocked them with SU10. RSUSR006 shows five failed logons each within a minute of the first sync. The tablets keep the old password and retry it in the background."
      },
      {
        "a": "Ravi",
        "d": "2026-11-12",
        "t": "Device team will push a profile that clears the stored credentials. Rolling out depot by depot."
      },
      {
        "a": "Mara",
        "d": "2026-11-13",
        "t": "No new locks this morning after the first two depots. Leaving the morning RSUSR006 check in place until all tablets are done."
      }
    ],
    "OSU-212": [
      {
        "a": "Anouk",
        "d": "2026-11-14",
        "t": "The nightly extract from the reporting system stopped on Wednesday with \"no RFC authorization\"."
      },
      {
        "a": "Mara",
        "d": "2026-11-16",
        "t": "The trust itself is fine: SMT1 still lists the reporting system. The extract user lost S_RFCACL when its role was cleaned up last week. Change is in a transport; needs your approval before it goes to BP1."
      }
    ]
  }
};
