---
type: concept
updated: 2026-11-13
---
# Enhancements: BAdIs, exits and implicit points

Standard SAP code must not be modified, but it offers places where your own logic can run. Choosing the right one keeps upgrades painless.

## The options, best first
| Option | Where you find it | Notes |
|---|---|---|
| New BAdI (kernel BAdI) | SE18 / SE19 | Filterable, fast, several implementations possible |
| Classic BAdI | SE18 / SE19 | Older style, still common in MM and SD |
| Customer exit | SMOD / CMOD | Function module exits; one project per exit |
| User exit (form routines) | e.g. `MV45AFZZ` in sales | Needs a modification key on older releases; avoid for new work |
| Implicit enhancement | start or end of any routine | Last resort; easy to forget it exists |

## How to find the right BAdI
- Put a breakpoint in `CL_EXITHANDLER=>GET_INSTANCE` (classic) or watch for `GET BADI` statements while running the transaction.
- Search the package of the transaction in SE80 for enhancement spots.
- Check the documentation of the spot in SE18 before writing code.

## Habits
- Filter by document type or organisational unit as early as possible, so the code does nothing for everyone else. [[ME_PROCESS_PO_CUST]] in [[OSU-207]] checks the order type in the first line.
- Keep the implementation thin and call a class that holds the real logic. That class can be unit-tested.
- An enhancement that runs inside a BAPI runs for interfaces too. That is usually good (see [[OSU-207]]) but can surprise you when a batch job suddenly fails.

Related: [[bapi-luw]] for what you may and may not do inside the save.
