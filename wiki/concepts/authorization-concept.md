---
type: concept
updated: 2026-11-12
---
# The authorization concept in five layers

Every "no authorization" message comes down to the same chain. Knowing the layers makes it obvious where to look.

## The layers
1. **Authorization object.** A named check with up to ten fields, for example [[S_TCODE]] (one field: the transaction) or `M_MSEG_WWA` (activity and plant). The code decides which object to check and with which values.
2. **Field values.** The values a user is allowed: plant `2100`, activity `01` (create), `03` (display). Wildcards and ranges are allowed, which is where most over-granting hides.
3. **Authorization.** One set of values for one object. A user can hold several for the same object; the check passes if any one of them fits.
4. **Profile.** The generated container of authorizations. You almost never touch it directly: PFCG generates it from the role.
5. **Role.** What you actually design and assign. The menu, the authorizations and the users live here. See [[pfcg-role-design]].

## How a check runs
The program asks: does this user hold object X with these values? The kernel looks in the **user buffer**, the user's authorizations loaded at logon, and answers with `sy-subrc`: 0 for yes, 4 when the user has the object but not these values, 12 when the user has nothing for the object at all.

That buffer is why a fixed role sometimes "doesn't work yet". SU56 shows what the buffer holds right now.

## Where checks come from
- **The start of a transaction:** [[S_TCODE]], plus the extra object maintained in SE93.
- **Inside the application:** explicit `AUTHORITY-CHECK` statements.
- **Remote calls:** [[S_RFC]] for function modules, [[S_SERVICE]] for OData and web services.
- **CDS views:** access controls filter rows instead of refusing the call. See [[gateway-odata-security]].

When something fails, follow [[auth-troubleshooting]].
