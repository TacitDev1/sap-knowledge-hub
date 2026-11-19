# SAP Knowledge Hub — Design System

**Direction:** Grid Console + Signal Rain (V2 base, V3 rain layered in).
Minimalist terminal aesthetic. Near-black canvas, one accent (classic SAP blue
`#008FD3`), monospace-led type, a visible-but-faint recoloured Matrix code rain
behind a structural blueprint grid. Calm, instrument-panel, never neon or busy.

Hard rule: this is a self-contained **offline** static app (`index.html` + `css/` + `js/` +
`data/`). No CDNs, no web fonts, no build step. All fonts must be system fonts. Nothing here
may change the JS data contract (`CLAUDE_INBOX/REFS/WIKI/TICKETS/TCODES/COMMENTS`) or
any DOM id / class / onclick the script depends on.

---

## 1. Color tokens

One hue only. Everything else is a cool near-black ramp.

```
--bg:        #06080b   /* canvas — cool near-black */
--bg-2:      #080b0f   /* card hover / recessed */
--panel:     #0a0e13   /* module fills, sidebar (over rain) */
--panel-2:   #0d1218   /* inputs, code surfaces */
--line:      #1b232c   /* hairline (inner module dividers) */
--line-2:    #283441   /* structural border (module outlines, focus track) */
--ink:       #e3e8ed   /* primary text  (~13:1 on --bg) */
--muted:     #8b95a0   /* secondary text (~4.8:1 — AA pass) */
--dim:       #5d6772   /* labels/meta on large/decorative text ONLY, never body */
--blue:      #008FD3   /* THE accent — SAP logo blue (~5.4:1 on --bg, AA pass) */
--blue-br:   #33a9e0   /* brighter blue — numbers, hover emphasis */
--blue-soft: rgba(0,143,211,.12)   /* active-nav wash, button hover */
--blue-line: rgba(0,143,211,.32)   /* lit keyline / hover border */
--glow:      rgba(0,143,211,.40)   /* restrained shadow/glow, used sparingly */
/* semantic (ABAP highlight + ticket states) — all within the one-hue discipline */
--kw:  #008FD3   /* keywords = SAP blue */
--str: #5fb98f   /* strings = muted green (only non-blue, low-sat) */
--com: #5d6772   /* comments = dim */
--num: #33a9e0   /* numbers = bright blue */
--good:#5fb98f --warn:#d9a441 --bad:#e06a5a   /* status only; desaturated */
```

Older token names (`--accent`, `--accent2`, `--card`, `--card2`, etc.) are
**re-pointed** to these values rather than renamed, so existing CSS selectors and the
JS keep working.

**Contrast law:** body text ≥ 4.5:1. `--dim` is decorative/large only. Placeholder
text uses `--muted`, not `--dim`.

---

## 2. Type

System fonts only. On Windows the stack lands on Consolas and Bahnschrift; it upgrades
silently to Cascadia where installed, and falls back to the platform monospace elsewhere.

```
--mono: "Cascadia Code","Cascadia Mono",Consolas,"Courier New",monospace;
--disp: "Bahnschrift","DIN Alternate","Segoe UI Semibold",sans-serif;
```

- **Body / data / nav / code:** `--mono`. This is the default everywhere.
- **Display only:** `--disp` for the page `<h2>` headers, the logo wordmark, stat
  numerals, and card `<h3>` titles. Uppercase with `letter-spacing:.02–.06em`.
- Cap families at 2 (mono + display). No third face.

Type scale (mono unless noted):

| Role | Size | Weight | Tracking | Case |
|---|---|---|---|---|
| Page title `.head h2` (disp) | 30px | 600 | +.01em | UPPER |
| Stat numeral `.stat .n` (disp) | 38px | 600 | 0 | — |
| Card title `.card h3` (disp) | 14px | 600 | +.02em | UPPER |
| Body / desc | 12.5px | 400 | 0 | sentence |
| Nav item | 11.5px | 400 | +.08em | UPPER |
| Section label `.lbl` | 10.5px | 400 | +.16em | UPPER |
| Status bar / meta | 10.5px | 400 | +.08em | UPPER |

`font-variant-numeric: tabular-nums` on all figures, keys, dates, code.
`text-wrap: balance` on h2/h3; `pretty` on `.desc` and wiki prose.

---

## 3. Spacing & layout

- Base unit 4px. Rhythm: 8 / 12 / 18 / 22 / 30 / 38 / 54.
- Sidebar fixed **236px**, full-height, `border-right:1px solid --line-2`, sits over
  the rain at ~60% panel opacity.
- Main content padding `30px 36px`; a terminal **status bar** spans the top
  (`● OFFLINE · LOCAL ONLY · CTRL+R REFRESH`).
- **Modules are bordered, not shadowed.** Stats, card grid, and recent boxes are
  single bordered blocks subdivided by 1px `--line` dividers (no gaps, no rounded
  corners) — the "console panel" look. Inner radius 0; this is intentional rigor.
- Page `<h2>` gets a bottom hairline rule (no side-stripe).
- Section labels (`.lbl`) are uppercase + a trailing hairline that fills the row.
- Grids stay fluid where they already are (`repeat(auto-fill,minmax(...))`); the
  dashboard workspace grid is a fixed 3-col bordered lattice.

---

## 4. The motif — blueprint grid + code rain

Two fixed, `pointer-events:none`, behind all content (`z-index:0`; content at `≥2`).

**Blueprint grid** (`body::before`): two superimposed line grids —
- fine: 32px, `rgba(120,140,160,.04)`
- major keyline: 160px, `rgba(0,143,211,.055)` (the blue lattice)

**Code rain** (`.rain` element): vertical columns of recoloured-Matrix glyphs
(katakana + digits) in `--blue`, `writing-mode:vertical-rl`, masked with
`radial-gradient(...at 70% 0%)` so it concentrates top/right and fades out — **never**
behind dense reading text. Per-column opacity 0.07–0.18. Columns drift downward on a
slow loop (see motion). Keep total ink low: it should read as ambience, not wallpaper.

Rules: rain opacity ceiling 0.18; it must be invisible enough that body text never
drops below AA. The grain SVG overlay stays at opacity .02 on top.

---

## 5. Motion

Calm, mechanical, GPU-only (`transform`/`opacity`). Ease-out, no bounce.

- **Rain fall:** each column `transform: translateY` loop, 14–26s linear, staggered
  per column. The single ambient animation.
- **View change:** 200ms opacity + 4px rise (keep existing `.view` fade).
- **Nav / button / card hover:** 150ms; border lights to `--blue-line`, optional
  `--blue-soft` wash. Active state: left keyline bar (2px) + soft inset.
- **Caret:** the active nav item and the dashboard title carry a 7px blinking blue
  block caret (1s step). Decorative; suppressed under reduced-motion.
- **Stat top edge:** a 1px `linear-gradient(90deg,--blue,transparent)` accent line
  (static; the "signal" cue without glow spam).
- `prefers-reduced-motion: reduce` → **freeze rain, stop caret blink, drop the rise**;
  all functionality and legibility unchanged.

---

## 6. Component rules (map to existing classes — do not rename)

- `.btn` — bordered, transparent fill; hover = `--blue-soft` wash + `--blue` text.
  `.primary` = solid `--blue`, ink `#04121b`. No gradients, no glow by default.
- `.card` / `.tc-card` / `.tk-card` — `--panel` fill, 1px `--line` border, radius 0–6px
  (flat in dashboard lattice; 6px allowed for free-floating ref/snippet cards). Hover:
  border → `--blue-line`. No lift transform in the console; subtle is fine elsewhere.
- `.tag` / `.tk-badge` — square (radius 3px), uppercase, low-sat tints of the one hue
  or the status colors. No pill shape.
- `.seg`, `.nav button` — active = `--blue-soft` + 2px left `--blue` keyline.
- Graph (`GCOL`): recolour node types within the blue ramp + neutrals —
  `ticket:#33a9e0 · concept:#008FD3 · object:#6f8a9c · meta:#5d6772`. Update the inline
  legend swatches to match. The stage background goes near-black with the same grid.
- ABAP highlighter tokens use the `--kw/--str/--com/--num` above.
- Focus-visible ring: `2px solid --blue`, offset 2px (keep, recolour).

## 7. Bans (must not reappear)

No glassmorphism/`backdrop-filter` as default · no gradient text (`background-clip`) ·
no dual accent · no `border-left` colored side-stripes · no neon glow on every element ·
no cut-corner clip-path chrome · no aurora gradient · no emoji as primary iconography
(use mono glyphs `▸ · // [ ]`; existing nav emoji may stay only if muted/aria-hidden).
