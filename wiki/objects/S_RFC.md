---
type: object
updated: 2026-11-08
---
# S_RFC

Checked when a function module is called remotely (RFC), before the module runs.

## Fields
- `RFC_TYPE`: `FUGR` (a whole function group) or `FUNC` (one function module).
- `RFC_NAME`: the group or module name.
- `ACTVT`: `16` (execute).

## Habits
- **Single modules over groups.** A function group often contains far more than the caller needs. Grant `FUNC` values for the modules the interface actually calls.
- **No wildcards for technical users.** An interface user with `RFC_NAME = *` can call any remote-enabled module in the system.
- **Find what is really used.** Trace the interface user with STAUTHTRACE for a full cycle (a day, a month-end) and build the role from the trace. The workload statistics also show RFC calls per user.

## Related objects
- [[S_RFCACL]] for trusted RFC, checked in the target system before any of this.
- [[S_TCODE]] does not apply to RFC calls; a technical user does not need transactions.

## Example
```
S_RFC
  RFC_TYPE = FUNC
  RFC_NAME = BAPI_USER_GET_DETAIL
  ACTVT    = 16
```

Related: [[authorization-concept]], [[auth-troubleshooting]].
