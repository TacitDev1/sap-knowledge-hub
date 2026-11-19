---
type: concept
updated: 2026-11-17
---
# Troubleshooting a missing authorization

The order below finds the cause in minutes for most tickets. It also keeps fixes in the right place, so the next role build does not undo them.

## 1. Read the last failed check
**SU53**, right after the error. It shows the object, the field values that were checked and what the user holds for that object. For someone else's session use "Display for other user".

SU53 shows only the *last* failed check. If the application recovered from a failed check and failed on another one later, SU53 can point at the wrong object.

## 2. Trace when SU53 is not conclusive
**STAUTHTRACE** records every check for a user, on every application server, with the result of each. Switch it on, have the user reproduce the error, switch it off and evaluate. Filter on return code to see only the failures.

ST01 does the same on one server and can also trace RFC and kernel calls.

## 3. Fix the default, not just the role
If the value should always come with the transaction or service, maintain it in **SU24** (check indicator and proposal). Then every role that contains the transaction gets it, now and after the next rebuild.

## 4. Merge into the role
**PFCG**, Authorizations, Expert mode: "Read old data and merge with new data". Fill the open fields, generate.

## 5. Make it effective
Run the user comparison in PFCG (or **PFUD** for many roles). Most systems apply the change straight away; if the user still fails, check **SU56** and ask them to log on again.

## Mistakes worth avoiding
- Adding `*` to get a ticket closed. It always comes back in the access review: BRW-118 shows the slower, right answer.
- Fixing a value by hand in one role when it belongs in SU24.
- Testing with your own user. Your access hides the problem; use a test user with only the role.

Related: [[authorization-concept]], [[pfcg-role-design]].
