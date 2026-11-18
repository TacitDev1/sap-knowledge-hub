---
type: concept
updated: 2026-11-10
---
# Number ranges

When custom code needs a unique document number, use a **number range object** and draw numbers with `NUMBER_GET_NEXT`. Do not compute the next number with `SELECT MAX( ) + 1`.

## Why MAX + 1 fails
Two sessions read the same maximum at the same moment, both add one, and both save the same key. One of them then fails in the update task (visible in SM13), or worse, both succeed in a table without a unique key. This is the weighbridge bug from BRW-118.

## Setting one up
1. SNRO: create the object, set the number length and a warning percentage.
2. Maintain the intervals. Internal intervals are drawn by the system; external ones are typed in by users.
3. Replace the lookup in the code with `NUMBER_GET_NEXT`.

## Transport gotcha
The object definition is transported, but the **intervals are not** something you should transport between systems with live data: importing them can reset the current number. Maintain intervals per system, or check the current level before and after.

## Related
- [[bapi-luw]]: numbers drawn in a rolled-back LUW are usually lost, so expect gaps.
- [[open-sql-performance]]: the same "fine for one user" trap in a different shape.
