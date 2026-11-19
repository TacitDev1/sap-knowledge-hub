---
type: concept
updated: 2026-11-19
---
# Gateway and OData security

Every Fiori app talks to the system through OData services. Each call passes three gates, and each gate fails with its own symptom.

## Gate 1: the service exists and is active
`/IWFND/MAINT_SERVICE` lists the registered services. The service needs to be active, and so does its ICF node under `/sap/opu/odata/sap/`. A missing or inactive one gives a 404 or "service not found".

## Gate 2: the user may call the service
The check is [[S_SERVICE]]. Its value is a generated hash, so you never type it: add the service to the role menu as an "Authorization Default", object type `IWSG` with the service name and version suffix (`ZBRW_DRIVER_SRV_0001`), and PFCG generates the right value. A missing one gives **403 Forbidden on every call**, even `$metadata`.

A 403 on **POST, PUT or DELETE only** is usually not authorization at all. Changing requests need a CSRF token fetched first (`x-csrf-token: Fetch`) and sent back in the same session. Proxies that drop the session cookie break this, as found in [[BRW-124]].

## Gate 3: the data the user may see
Inside the service, the usual checks apply: `AUTHORITY-CHECK` statements in the implementation, and **CDS access controls** on the views it reads. An access control does not refuse the call; it filters rows, typically with `aspect pfcg_auth( object, field, ... )` so the same PFCG values drive both the classic transaction and the app.

Forgetting this gate is how an app shows everyone's data while every authorization test passes.

## Where to look
- `/IWFND/ERROR_LOG`: front-end errors, by user and time. Start here.
- `/IWBEP/ERROR_LOG`: the business error behind a 500.
- `/IWFND/GW_CLIENT`: replay the call as yourself, or as a test user.
- `/IWFND/TRACES`: payloads and timing for one user.

Related: [[authorization-concept]], [[auth-troubleshooting]], [[fiori-launchpad-content]].
