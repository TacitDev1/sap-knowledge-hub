---
type: concept
updated: 2026-11-04
---
# BAPIs and the logical unit of work

A BAPI call on its own does not save anything. It checks the input, builds the document in memory and registers the database changes to run later. Those changes only reach the database when the program ends the **logical unit of work** (LUW) with a commit.

## The rule
1. Call the BAPI.
2. Read the `RETURN` table. Any row with type `E` (error) or `A` (abort) means the document is not valid.
3. If it is clean, call [[BAPI_TRANSACTION_COMMIT]]. If not, call `BAPI_TRANSACTION_ROLLBACK`.

Skipping step 3 is the classic "the BAPI said success but nothing was created" bug.

## Why WAIT matters
The commit hands the changes to the update task, which runs asynchronously. If your next statement reads the new document (for example to post a follow-on document), pass `WAIT = abap_true` so the commit blocks until the update has finished.

## Several BAPIs in one LUW
You can call more than one BAPI and commit once at the end. Then they succeed or fail together, which is usually what the business wants. Do not mix in an explicit `COMMIT WORK` in the middle, and be careful with code that commits on its own, such as some dialog modules.

## Where this shows up
- [[BAPI_SALESORDER_CREATEFROMDAT2]] and [[BAPI_GOODSMVT_CREATE]] both follow this pattern.
- [[BRW-112]] uses it with a test-run switch.
- Failed updates after a commit end up in SM13, not in `RETURN`. See [[number-ranges]] for one way that happens.
