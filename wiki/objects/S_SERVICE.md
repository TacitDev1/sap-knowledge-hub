---
type: object
updated: 2026-11-19
---
# S_SERVICE

The start check for external services: Gateway OData services, and web services called over HTTP.

## Fields
- `SRV_TYPE`: the kind of service. `HT` for Gateway services.
- `SRV_NAME`: a generated hash of the service name. Nobody can read or type it.

## Getting it into a role
Because the value is a hash, the only sensible way is through the role menu:

1. PFCG, Menu tab, "Authorization Default".
2. Object type `TADIR Service`, program ID `R3TR`, object type `IWSG`.
3. The service name with its version suffix, for example `ZBRW_DRIVER_SRV_0001`.
4. Authorizations tab: merge, generate. `S_SERVICE` now holds the hash.

In an embedded deployment the back-end service (`IWSV`) may need the same treatment. Apps from SAP usually bring both through their business role templates.

## Symptoms
A missing value gives **403 Forbidden** on every call to the service, including `$metadata`. `/IWFND/ERROR_LOG` shows the failed check with the user. A 403 on changing requests only points at the CSRF token instead: see [[gateway-odata-security]].

## Versions
A new service version or a renamed service has a different hash. Roles built for the old one silently stop working, which is how [[BRW-124]] started.

Related: [[authorization-concept]], [[fiori-launchpad-content]], [[pfcg-role-design]].
