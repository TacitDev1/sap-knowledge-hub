---
type: object
updated: 2026-11-12
---
# S_TCODE

The transaction start check. One field, `TCD`, holding the transaction code.

## When it runs
Every time a user starts a transaction: from the menu, the command field, or a launchpad tile that opens a GUI transaction. Fails with "You are not authorized to use transaction ...".

`CALL TRANSACTION` in custom code only checks it when written `WITH AUTHORITY-CHECK`. Code that skips it lets a user reach a transaction their role does not grant, so look for it in code reviews.

## Menu is not authorization
A transaction in the role menu normally brings its `S_TCODE` value with it, but the two are separate. A value maintained by hand grants the transaction without a menu entry, and an entry with its value removed shows in the menu and still fails. Access reviews should read the values (table `AGR_1251`), not the menu (`AGR_TCODES`).

## The second check
SE93 can name an extra object to check at start, for example a plant or company code object. If SU53 shows a different object right at transaction start, that is where it came from.

## In code
```
CALL FUNCTION 'AUTHORITY_CHECK_TCODE'
  EXPORTING  tcode  = 'SU01'
  EXCEPTIONS ok     = 0
             not_ok = 1
             OTHERS = 2.
```

## Review checklist
- Wildcards: `*` or ranges such as `SU*` grant more than anyone intended.
- Admin transactions (SU01, PFCG, SE16N, SM59, STMS) only in admin roles.

Related: [[authorization-concept]], [[auth-troubleshooting]], [[fiori-launchpad-content]].
