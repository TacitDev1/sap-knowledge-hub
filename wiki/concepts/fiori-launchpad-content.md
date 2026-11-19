---
type: concept
updated: 2026-11-18
---
# Fiori launchpad content

What a user sees on the launchpad is decided by their roles, but through several pieces that all have to line up. When a tile is missing, one of these links is broken.

## The pieces
- **Catalog.** The set of apps a role may launch: tiles plus target mappings. A catalog grants nothing on its own; it has to be in a role.
- **Target mapping.** Turns an intent such as `#SalesOrder-manage` (semantic object plus action) into the actual app: a UI5 component, a GUI transaction or a Web Dynpro application.
- **Tile.** The visible entry that fires the intent.
- **Space and page** (newer releases) or **group** (classic home page). The layout a user sees. A catalog without a space or group means the apps are allowed but not shown, which is exactly what happened in [[BRW-112]].
- **Business role.** The PFCG role that carries catalogs, spaces and the backend authorizations together. See [[pfcg-role-design]].

## The backend half
A tile that opens and then fails is usually not launchpad content at all. The app's OData service must be active and its [[S_SERVICE]] authorization must be in a role, as described in [[gateway-odata-security]]. GUI transactions behind tiles still check [[S_TCODE]].

## Tools
- `/UI2/FLPD_CUST` and `/UI2/FLPCM_CUST`: maintain catalogs, tiles and target mappings for this client (the `_CONF` versions work across clients).
- `/UI2/FLIA`: enter a user and an intent and it explains whether and why the intent resolves.
- `/UI2/FLC`: consistency checks across the content.
- Reports `/UI2/INVALIDATE_CLIENT_CACHES` and `/UI2/INVALIDATE_GLOBAL_CACHES` after content or role changes.

## Debugging in the browser
Add `sap-ui-debug=true` to the launchpad URL to load readable sources. The console then shows the real error, for example a failed `$metadata` call with its HTTP status.
