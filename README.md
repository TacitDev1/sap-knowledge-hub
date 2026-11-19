# SAP Knowledge Hub

An offline, zero-dependency workbench for SAP technical consultants working on authorizations, security and Fiori. It opens from a folder with a double-click: no server, no build step, no install, no network calls.

> **No customer data is saved in this SAP Knowledge Hub. Nothing is stored, and everything is always expunged.** See [Privacy](#privacy).

> **Sanitised template.** This is a public template of a tool I use day to day. All data in it is invented: the consultancy *Larkwell Consulting*, the clients *Brackenfield Waste* and *Osterby Utilities*, the systems BD1/BQ1/BP1, the tickets and the people. Any resemblance to real companies, people or tickets is coincidental. The SAP objects and transaction codes are standard, publicly documented SAP names; the explanations are written in my own words.

**Live demo:** [tacitdev1.github.io/sap-knowledge-hub](https://tacitdev1.github.io/sap-knowledge-hub/). Try [Search for "S_SERVICE"](https://tacitdev1.github.io/sap-knowledge-hub/#search?q=S_SERVICE), then open the [Second Brain graph](https://tacitdev1.github.io/sap-knowledge-hub/#wiki) and click a node.

**Code:** [github.com/TacitDev1/sap-knowledge-hub](https://github.com/TacitDev1/sap-knowledge-hub)

![Dashboard](docs/screenshots/dashboard.png)

## What it does

Ten views in one page:

| View | What it is |
|---|---|
| Dashboard | Counts, workspaces, recently changed wiki pages and inbox items |
| Code Builder | Editor with syntax colouring and templates for AUTHORITY-CHECKs, CDS access controls and quick role reports |
| From Claude | An inbox for code and walkthroughs handed over from an AI chat session |
| Snippets | Your own reusable code blocks, editable in the page |
| Reference | A notebook of authorization objects, role and user tables, user FMs, reports and Fiori paths, plus a researched list you can copy into it |
| Cheat Sheet | Click-to-copy troubleshooting steps: missing authorizations, launchpad tiles, OData errors, locked users |
| T-Codes | Security, authorization, Fiori and Gateway transaction codes, grouped by area |
| Second Brain | A Markdown wiki with `[[links]]`, backlinks and a force-directed link graph |
| My Tickets | An offline mirror of assigned service-desk tickets with comment threads |
| Search | One box across the wiki, tickets, T-codes, inbox, references and snippets |

| Second Brain graph | Search |
|---|---|
| ![Wiki graph](docs/screenshots/wiki-graph.png) | ![Search](docs/screenshots/search.png) |

## How it is built

```mermaid
flowchart LR
  subgraph repo["Static files (this repo)"]
    MD["wiki/**/*.md"] -- "node build-wiki.js" --> WJS["data/wiki.js"]
    D["data/inbox.js · refs.js · tcodes.js<br/>tickets.js · comments.js"]
  end
  subgraph browser["Browser"]
    G["window.CLAUDE_* globals"] --> APP["js/hub.js<br/>render 10 views"]
    APP <--> MEM[("in-memory state<br/>gone on close or reload")]
  end
  WJS -- "&lt;script&gt;" --> G
  D -- "&lt;script&gt;" --> G
  CSS["css/hub.css"] --> APP
```

- **Data as script tags.** Each data file sets one global (`window.CLAUDE_REFS = {...}`). Browsers load `<script src>` from `file://` without complaint, while `fetch()` of JSON would be blocked. That one choice is why the hub runs from a folder with no server.
- **Read-only data, throwaway edits.** The data files are the "published" content. Anything you create in the page (snippets, notebook entries, the editor buffer) lives in JavaScript variables only and is gone when you close or reload the tab.
- **No dependencies.** Plain HTML, CSS and one script. The wiki graph is a hand-written force simulation in SVG; the Markdown renderer is about 40 lines.
- **Relative paths only**, so the same files work from disk, from `localhost` and from a GitHub Pages sub-path.
- The `CLAUDE_*` names come from the original workflow, where an AI assistant refreshes the data files each morning. They are just global names; nothing here calls an AI service.

Design notes are in [DESIGN.md](DESIGN.md).

## Run it

Open `index.html` in a browser. That's it.

To check it the way GitHub Pages will serve it (under `/sap-knowledge-hub/`):

```bash
node scripts/serve.mjs
```

then open `http://localhost:5178/sap-knowledge-hub/`. Any view can be opened directly with a hash, for example `#wiki` or `#search`.

## Add your own content

| File | Global | Shape |
|---|---|---|
| `data/refs.js` | `CLAUDE_REFS` | `{ generatedAt, items: [{ type: "AUTH"\|"TABLE"\|"FM"\|"REPORT"\|"FIORI", name, desc, code }] }` |
| `data/tcodes.js` | `CLAUDE_TCODES` | `{ generatedAt, items: [{ code, title, module, note? }] }` |
| `data/inbox.js` | `CLAUDE_INBOX` | `{ generatedAt, items: [{ title, note, code }] }` |
| `data/tickets.js` | `CLAUDE_TICKETS` | `{ generatedAt, items: [{ key, url?, status, type, priority, project, updated, summary, note? }] }` |
| `data/comments.js` | `CLAUDE_COMMENTS` | `{ generatedAt, threads: { "KEY-1": [{ a: author, d: date, t: text }] } }` |
| `data/wiki.js` | `CLAUDE_WIKI` | generated, see below |

Edit any data file by hand (it is plain JavaScript) and reload the page.

**Wiki pages** live in `wiki/` as Markdown:

```
wiki/
  index.md, log.md        -> type "meta"
  concepts/*.md           -> type "concept"
  objects/*.md            -> type "object"
  tickets/*.md            -> type "ticket"
```

Each page starts with a small front matter block (`type`, `updated`) and a `# Title`. Link pages with `[[page-name]]` or `[[page-name|label]]`; the name is the file name without `.md`. Then rebuild the bundle:

```bash
node build-wiki.js
```

Links become edges in the graph, and every page gets a "Linked from" list automatically. The Pages workflow runs the same build on every push.

## Repository layout

```
index.html            the app shell (10 views)
css/hub.css           the theme
js/hub.js             all behaviour
data/*.js             content, loaded as globals
wiki/                 Markdown source for the Second Brain
build-wiki.js         wiki/ -> data/wiki.js
scripts/serve.mjs     optional local server that mimics the Pages sub-path
scripts/leak-scan.mjs check that nothing private slipped in
docs/screenshots/     images used by this README and the portfolio
```

## Leak scan

This repo was cut from a private tool, so every push runs `scripts/leak-scan.mjs` (IP addresses, email addresses, cloud and webhook hosts, key-like strings, plus a private denylist of names kept as a repository secret) and gitleaks. Run it locally with:

```bash
node scripts/leak-scan.mjs
```

## Privacy

No customer data is saved in this SAP Knowledge Hub. Nothing is stored, and everything is always expunged.

What it does:

- Reads its own files (`index.html`, `css/`, `js/`, `data/`) from the same place the page came from, and nothing else.
- Keeps anything you type (code, snippets, notebook entries) in memory while the tab is open. Closing or reloading the tab wipes it.
- On load, deletes the `sapKnowledgeHub.*` and `abapHub.*` keys that earlier versions of the hub left in the browser. It does not touch any other keys.

What it does not do:

- **No storage.** It never writes to `localStorage`, `sessionStorage`, IndexedDB or the Cache API, and registers no service worker. It offers no download or export of what you typed.
- **No cookies.** It neither sets nor reads any.
- **No tracking.** There is no analytics, telemetry, error reporting or fingerprinting.
- **No outside requests.** It loads no fonts, CDNs or third-party scripts, and it sends nothing anywhere. A Content-Security-Policy in `index.html` (`default-src 'self'`, `connect-src 'none'`, `form-action 'none'`) makes the browser refuse any other request even if one were added by mistake. The only outside addresses in the data are the demo ticket links, which open only when you click them.

The demo is hosted on GitHub Pages. GitHub may keep its own server logs for the pages it serves (see GitHub's privacy statement). The hub itself adds nothing to that.

## Licence

MIT, see [LICENSE](LICENSE). SAP, ABAP and the names of SAP objects and transactions are trademarks or product names of SAP SE, used here only to describe what the tool works with. This project is not affiliated with SAP.
