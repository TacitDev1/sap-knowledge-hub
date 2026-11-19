---
type: object
updated: 2026-11-16
---
# S_RFCACL

The authorization behind **trusted RFC**: a user in a trusted system logs on to this system without a password. Powerful, so it is worth getting exactly right.

## Where it lives
In the **target** (trusting) system, in a role of the user that the call arrives as. The trust itself is set up in SMT1 and used by an RFC destination in SM59 with "Trust relationship" switched on.

## Fields
| Field | Meaning |
|---|---|
| `RFC_SYSID` | System ID of the calling system |
| `RFC_CLIENT` | Calling client |
| `RFC_USER` | Calling user (leave empty when RFC_EQUSER is Y) |
| `RFC_EQUSER` | Y: the calling user must have the same name here |
| `RFC_TCODE` | Calling transaction, `*` in most setups |
| `RFC_INFO` | Extra information, usually `*` |
| `ACTVT` | `16` |

## Habits
- Prefer `RFC_EQUSER = Y`. A wildcard `RFC_USER` with `N` lets any user of the calling system act as this one.
- Never in a role that everyone has. Give it to the specific users or interface users that need it.
- After a role clean-up, test every trusted destination. A removed `S_RFCACL` fails with a generic "no RFC authorization" that hides the cause, as in OSU-212.

Then [[S_RFC]] still decides which modules the user may call.

Related: [[authorization-concept]].
