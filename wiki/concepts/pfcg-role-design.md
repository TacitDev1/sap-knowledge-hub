---
type: concept
updated: 2026-11-14
---
# PFCG role design

Roles are the only part of the [[authorization-concept]] you design by hand. A few habits keep them small, reviewable and cheap to change.

## Three kinds of role
- **Single role.** A menu, its authorizations and a generated profile. The building block.
- **Composite role.** A bundle of single roles for one job. It has no authorizations of its own; assign composites to people, single roles to composites.
- **Derived role.** A copy of a parent single role that differs only in its **organisational levels** (company code, plant, sales organisation). The parent holds the menu and every other value; changes are pushed down with "Generate derived roles".

## Organisational levels
Fields like `BUKRS` or `WERKS` that appear in many objects are maintained once per role, on the Org levels screen, and PFCG fills them into every object. That is what makes derived roles work: one parent, one child per plant, as planned for the depots in BRW-121.

## SU24 drives the proposals
When a transaction or service goes into the menu, PFCG proposes the objects and values maintained for it in SU24. Good SU24 data means a role build is mostly "generate". Poor SU24 data means hand-filled fields that the next merge can lose.

## Fiori in the role menu
The same role carries the launchpad content: catalogs and spaces (or groups) in the menu, and the OData services as "Authorization Default" entries so [[S_SERVICE]] is generated. See [[fiori-launchpad-content]].

## Naming
`Z_<client>_<area>_<job>`, for example `Z_BRW_WB_CLERK`. A strict prefix lets you hand a team rights over its own roles only, through `S_USER_AGR`.

## Before a role goes to production
- No `*` in object, activity or org level fields unless written down why.
- No manual authorizations that duplicate a proposal.
- Profile generated, user comparison planned, transport attached.
