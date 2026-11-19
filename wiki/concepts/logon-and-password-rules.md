---
type: concept
updated: 2026-11-13
---
# Logon and password rules

Password and lock rules are profile parameters, set in RZ10 (permanent) or RZ11 (dynamic ones, at once). Security policies let you apply different rules to different groups of users.

## The parameters that matter most
| Parameter | What it sets |
|---|---|
| `login/min_password_lng` | Minimum length |
| `login/min_password_digits`, `login/min_password_specials` | Required digits and special characters |
| `login/password_expiration_time` | Days until a password must be changed (0 = never) |
| `login/fails_to_user_lock` | Failed attempts before the user is locked |
| `login/failed_user_auto_unlock` | Unlock failed-logon locks at midnight (0 = no) |
| `login/password_compliance_to_current_policy` | Force a change at next logon when the old password no longer meets the rules |

The last one is the one that surprises people: tightening the rules with it switched on sends every user with an old, short password into a change dialog.

## Security policies
`SECPOL` holds named sets of the same attributes. Assign one to a user in SU01 (Logon data) and it overrides the profile parameters for that user. Useful for technical users and for groups that need stricter rules than everyone else.

## Locks
`USR02-UFLAG` says why a user is locked: 32 locked globally (central user administration), 64 locked by an administrator, 128 locked after failed logons. Report `RSUSR006` lists users with failed logons; `SU10` locks or unlocks many users at once.

A burst of failed-logon locks right after a rule change is usually not people mistyping. It is a device or a job retrying a stored password, as in [[OSU-207]].

## Watch it
The security audit log (configure in `RSAU_CONFIG`, read in `RSAU_READ_LOG`) records failed logons with the terminal they came from, which is how you find the device.

Related: [[authorization-concept]].
