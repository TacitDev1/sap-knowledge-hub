/* ---------- storage: none ---------- */
/* Nothing is written to the browser. No localStorage, sessionStorage, cookies or IndexedDB.
   Everything the user types lives in the variables below and is gone when the tab is closed or reloaded. */
(function expungeOldVersions(){
  /* Earlier versions kept edits in localStorage under these prefixes. Delete whatever they left behind. */
  const OLD = ["sapKnowledgeHub.", "abapHub."];
  ["localStorage", "sessionStorage"].forEach(name => {
    try {
      const store = window[name]; /* reading the property itself throws when storage is blocked */
      for (let i = store.length - 1; i >= 0; i--){
        const k = store.key(i);
        if (k && OLD.some(p => k.indexOf(p) === 0)) store.removeItem(k);
      }
    } catch(e){ /* storage blocked or unavailable: nothing to delete */ }
  });
})();
const MEM = { code: "" };
/* Seed content for the session. Edits change these arrays only, never the browser. */
const DB = {};
DB.snips = [
  {
    "id": 1,
    "name": "AUTHORITY-CHECK with a clear message",
    "note": "plant check before a posting",
    "code": "AUTHORITY-CHECK OBJECT 'M_MSEG_WWA'\n  ID 'ACTVT' FIELD '01'\n  ID 'WERKS' FIELD lv_plant.\nIF sy-subrc <> 0.\n  MESSAGE |No authorization to post goods movements in plant { lv_plant }| TYPE 'E'.\nENDIF."
  },
  {
    "id": 2,
    "name": "CDS access control on company code",
    "note": "DCL, pfcg_auth",
    "code": "@EndUserText.label: 'Company code access'\n@MappingRole: true\ndefine role ZI_INVOICE_DCL {\n  grant select on ZI_Invoice\n    where ( CompanyCode ) = aspect pfcg_auth( F_BKPF_BUK, BUKRS, ACTVT = '03' );\n}"
  },
  {
    "id": 3,
    "name": "Missing authorization: triage order",
    "note": "SU53, trace, SU24, PFCG",
    "code": "1. SU53 (or SU53 -> other user): which object, which value?\n2. Not clear? STAUTHTRACE for the user, reproduce, evaluate\n3. Value should come by default? Fix it in SU24, not in the role\n4. PFCG: expert mode, merge new data, generate\n5. User comparison, then retest. SU56 shows what the user holds now"
  },
  {
    "id": 4,
    "name": "Fiori tile missing: five checks",
    "note": "launchpad, catalog, target mapping",
    "code": "1. Spaces mode or classic groups?\n2. Catalog and space in the role menu (PFCG)\n3. /UI2/FLIA: does the intent resolve for this user?\n4. OData service active and S_SERVICE in a role\n5. /UI2/INVALIDATE_CLIENT_CACHES, then browser cache"
  },
  {
    "id": 5,
    "name": "A user's active roles",
    "note": "AGR_USERS with validity",
    "code": "SELECT agr_name, from_dat, to_dat\n  FROM agr_users\n  WHERE uname    = @lv_user\n    AND from_dat <= @sy-datum\n    AND to_dat   >= @sy-datum\n  ORDER BY agr_name\n  INTO TABLE @DATA(lt_roles)."
  },
  {
    "id": 6,
    "name": "Locked users and why",
    "note": "USR02-UFLAG",
    "code": "SELECT bname, uflag, trdat\n  FROM usr02\n  WHERE uflag <> 0\n  INTO TABLE @DATA(lt_locked).\n\" 32 = global lock (CUA), 64 = admin lock, 128 = failed logons"
  }
];
DB.refs = [
  {
    "id": 1,
    "type": "AUTH",
    "name": "S_TABU_DIS",
    "desc": "Table access by authorization group (SE16, SM30). Broad: one group can hold hundreds of tables. Prefer S_TABU_NAM for single tables.",
    "code": "S_TABU_DIS\n  DICBERCLS = <authorization group>\n  ACTVT     = 03"
  },
  {
    "id": 2,
    "type": "AUTH",
    "name": "S_USER_GRP",
    "desc": "Who may maintain users in which user group. Split admin rights by group so a helpdesk can reset passwords without touching admin users.",
    "code": "S_USER_GRP\n  CLASS = HELPDESK\n  ACTVT = 03, 05 (lock/unlock), 02"
  },
  {
    "id": 3,
    "type": "TABLE",
    "name": "AGR_TCODES",
    "desc": "Transactions in a role menu. Not the same as authorization: a menu entry without S_TCODE still fails, and S_TCODE without a menu entry still works.",
    "code": "SE16N -> AGR_TCODES\n  AGR_NAME = Z_BRW_*"
  },
  {
    "id": 4,
    "type": "FM",
    "name": "BAPI_USER_GET_DETAIL",
    "desc": "Reads a user: logon data, address, roles, profiles, lock state. Read-only, safe for reports.",
    "code": "CALL FUNCTION 'BAPI_USER_GET_DETAIL'\n  EXPORTING username       = lv_user\n  IMPORTING islocked       = ls_lock\n  TABLES    activitygroups = lt_roles\n            return         = lt_return."
  },
  {
    "id": 5,
    "type": "REPORT",
    "name": "RSUSR200",
    "desc": "Users by last logon and password change. The quick way to find accounts nobody has used for months.",
    "code": "SUIM -> User -> By Logon Date and Password Change\n  (or SE38 -> RSUSR200)"
  }
];
/* Keeps the editor buffer in memory only. Snippets and references already live in DB. */
function save(){
  MEM.code = document.getElementById("code").value;
}

/* ---------- nav ---------- */
function go(v){
  document.querySelectorAll(".view").forEach(x => x.classList.remove("active"));
  document.getElementById("view-" + v).classList.add("active");
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  /* keep the view in the URL so a link can open the hub on a given view (#wiki, #search, ...) */
  try { history.replaceState(null, "", "#" + v); } catch(e){}
}
document.querySelectorAll(".nav button").forEach(b => b.onclick = () => go(b.dataset.view));

/* ---------- toast + copy ---------- */
let toastTimer;
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
}
function copy(txt){
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(() => toast("Copied to clipboard ✓")).catch(() => fallbackCopy(txt));
  } else { fallbackCopy(txt); }
}
function fallbackCopy(txt){
  const t = document.createElement("textarea");
  t.value = txt; t.style.position = "fixed"; t.style.opacity = "0";
  document.body.appendChild(t); t.focus(); t.select();
  try { document.execCommand("copy"); toast("Copied to clipboard ✓"); }
  catch(e) { toast("Press Ctrl+C to copy"); }
  document.body.removeChild(t);
}
/* copy straight from the rendered card — no quote-escaping issues */
function copyCode(el){ const p = el.closest(".card").querySelector("pre"); if (p) copy(p.textContent); }
function copyName(el){ const h = el.closest(".card").querySelector("h3"); if (h) copy(h.textContent.trim()); }

/* ---------- syntax highlight (single-pass tokenizer) ---------- */
const KW = ("abap_true abap_false add and append assign assigning at begin between by call case catch changing check class clear close collect commit concatenate condense constants continue convert corresponding create data delete describe display do else elseif end endcase endclass enddo endform endfunction endif endloop endmethod endmodule endselect endtry endwhile exit exporting fetch field-symbols for form free from function if implementation import importing in include initial initialization inner insert interface into is join leave left like load local loop me method methods modify module move new not of on or others outer parameters perform private protected public raise raising read receiving ref refresh reject report return returning rollback select select-options set single sort split structure sum table tables then time to translate try type types up update using value when where while with work write authority-check object id field dummy define role grant aspect pfcg_auth inheriting").split(/\s+/);
const KWSET = new Set(KW);
function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function hl(){
  const src = document.getElementById("code").value;
  const re = /(^\*.*$)|("[^\n]*$)|('[^']*')|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_\-]*)/gm;
  let out = "", last = 0, m;
  while ((m = re.exec(src))){
    out += esc(src.slice(last, m.index));
    if (m[1] || m[2])      out += '<span class="tok-com">' + esc(m[0]) + "</span>";
    else if (m[3])         out += '<span class="tok-str">' + esc(m[0]) + "</span>";
    else if (m[4])         out += '<span class="tok-num">' + esc(m[0]) + "</span>";
    else if (m[5])         out += KWSET.has(m[0].toLowerCase()) ? '<span class="tok-kw">' + esc(m[0]) + "</span>" : esc(m[0]);
    last = re.lastIndex;
  }
  out += esc(src.slice(last));
  document.getElementById("hlcode").innerHTML = out + "\n";
}
const ta = document.getElementById("code");
ta.value = MEM.code;
ta.addEventListener("input", () => { hl(); save(); });
ta.addEventListener("scroll", () => {
  const p = document.getElementById("hlcode");
  p.scrollTop = ta.scrollTop; p.scrollLeft = ta.scrollLeft;
});
ta.addEventListener("keydown", e => {
  if (e.key === "Tab"){
    e.preventDefault();
    const s = ta.selectionStart, en = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
    ta.selectionStart = ta.selectionEnd = s + 2;
    hl();
  }
});
hl();
function clearEditor(){ document.getElementById("code").value = ""; hl(); save(); }
function copyEditor(){ const v = document.getElementById("code").value; if (!v.trim()) return toast("Nothing to copy"); copy(v); }

/* ---------- templates ---------- */
const TPL = {
  "authcheck": "AUTHORITY-CHECK OBJECT 'Z_OBJECT'\n  ID 'ACTVT' FIELD '03'\n  ID 'FIELD1' FIELD lv_value.\nCASE sy-subrc.\n  WHEN 0.  \" allowed\n  WHEN 4.  \" has the object, not this value\n  WHEN 12. \" no authorization for the object at all\nENDCASE.",
  "authdummy": "\" Only care about plant: skip the activity with DUMMY\nAUTHORITY-CHECK OBJECT 'M_MSEG_WWA'\n  ID 'ACTVT' DUMMY\n  ID 'WERKS' FIELD lv_plant.",
  "tcode": "CALL FUNCTION 'AUTHORITY_CHECK_TCODE'\n  EXPORTING  tcode  = 'ZBRW_UPLOAD'\n  EXCEPTIONS ok     = 0\n             not_ok = 1\n             OTHERS = 2.\nIF sy-subrc <> 0.\n  MESSAGE 'You are not allowed to start this upload' TYPE 'E'.\nENDIF.",
  "dcl": "@EndUserText.label: 'Access control'\n@MappingRole: true\ndefine role ZI_MY_VIEW_DCL {\n  grant select on ZI_MyView\n    where ( CompanyCode ) = aspect pfcg_auth( F_BKPF_BUK, BUKRS, ACTVT = '03' );\n}",
  "dcl2": "@EndUserText.label: 'Access control, two conditions'\n@MappingRole: true\ndefine role ZI_MY_VIEW_DCL {\n  grant select on ZI_MyView\n    where ( Plant ) = aspect pfcg_auth( M_MSEG_WWA, WERKS, ACTVT = '03' )\n      and Status <> 'X';\n}",
  "annot": `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Stops for the driver app'
define view entity ZI_MyView
  as select from ztable
{
  key id    as Id,
      werks as Plant
}`,
  "roles": "REPORT zuser_roles.\nPARAMETERS p_user TYPE xubname OBLIGATORY.\n\nSELECT agr_name, from_dat, to_dat\n  FROM agr_users\n  WHERE uname = @p_user\n  ORDER BY agr_name\n  INTO TABLE @DATA(lt_roles).\n\ncl_salv_table=>factory( IMPORTING r_salv_table = DATA(lo)\n                        CHANGING  t_table      = lt_roles ).\nlo->display( ).",
  "authget": "DATA lt_values TYPE STANDARD TABLE OF usvalues.\nCALL FUNCTION 'SUSR_USER_AUTH_FOR_OBJ_GET'\n  EXPORTING  user_name  = lv_user\n             sel_object = 'S_TCODE'\n  TABLES     values     = lt_values\n  EXCEPTIONS OTHERS     = 1.",
  "report": "REPORT zmy_report.\n\nPARAMETERS p_test AS CHECKBOX DEFAULT 'X'.\n\nSTART-OF-SELECTION.\n  \" read, check, then change only when p_test is off",
  "try": "TRY.\n    \" risky code\n  CATCH cx_root INTO DATA(lx_err).\n    MESSAGE lx_err->get_text( ) TYPE 'I'.\nENDTRY."
};
function loadTpl(){
  const k = document.getElementById("tpl").value;
  if (!k) return;
  const t = document.getElementById("code");
  t.value += (t.value && !t.value.endsWith("\n") ? "\n\n" : "") + TPL[k];
  document.getElementById("tpl").value = "";
  hl(); save(); toast("Template added");
}

/* ---------- snippets ---------- */
let editSnipId = null;
function openSnip(id){
  editSnipId = id || null;
  const s = id ? DB.snips.find(x => x.id === id) : { name:"", note:"", code:"" };
  document.getElementById("snipTitle").textContent = id ? "Edit snippet" : "New snippet";
  snipName.value = s.name; snipNote.value = s.note || ""; snipCode.value = s.code;
  document.getElementById("snipModal").classList.add("show");
}
function saveCurrentAsSnippet(){
  const c = document.getElementById("code").value;
  if (!c.trim()) return toast("Editor is empty");
  editSnipId = null;
  document.getElementById("snipTitle").textContent = "New snippet";
  snipName.value = ""; snipNote.value = ""; snipCode.value = c;
  document.getElementById("snipModal").classList.add("show");
}
function saveSnip(){
  if (!snipName.value.trim() || !snipCode.value.trim()) return toast("Need a title and code");
  if (editSnipId){
    const s = DB.snips.find(x => x.id === editSnipId);
    s.name = snipName.value; s.note = snipNote.value; s.code = snipCode.value;
  } else {
    DB.snips.unshift({ id: Date.now(), name: snipName.value, note: snipNote.value, code: snipCode.value });
  }
  save(); renderSnips(); renderStats(); closeM("snipModal"); toast("Added for this session ✓");
}
function delSnip(id){ if (!confirm("Delete this snippet?")) return; DB.snips = DB.snips.filter(x => x.id !== id); save(); renderSnips(); renderStats(); }
function renderSnips(){
  const q = (document.getElementById("snipSearch").value || "").toLowerCase();
  const list = DB.snips.filter(s => (s.name + s.note + s.code).toLowerCase().includes(q));
  const g = document.getElementById("snipGrid");
  if (!list.length){ g.innerHTML = '<div class="empty"><div class="big">❖</div>No snippets yet. Build one in the editor and hit “Add as snippet”.</div>'; return; }
  g.innerHTML = list.map(s => `<div class="card">
    <span class="tag SNIPPET">snippet</span>
    <h3 style="margin-top:8px">${escH(s.name)}</h3>
    ${s.note ? `<div class="desc">${escH(s.note)}</div>` : ""}
    <pre>${escH(s.code)}</pre>
    <div class="row">
      <button class="btn sm primary" onclick="copyCode(this)">⧉ Copy</button>
      <button class="btn sm" onclick="loadToEditor(${s.id})">→ Editor</button>
      <button class="btn sm" onclick="openSnip(${s.id})">Edit</button>
      <button class="btn sm danger" onclick="delSnip(${s.id})">Delete</button>
    </div></div>`).join("");
}
function loadToEditor(id){
  const s = DB.snips.find(x => x.id === id);
  const t = document.getElementById("code");
  t.value += (t.value && !t.value.endsWith("\n") ? "\n\n" : "") + s.code;
  hl(); save(); go("work"); toast("Loaded into editor");
}

/* ---------- references ---------- */
let editRefId = null, refFilterT = "ALL";
document.querySelectorAll("#refFilter button").forEach(b => b.onclick = () => {
  document.querySelectorAll("#refFilter button").forEach(x => x.classList.remove("active"));
  b.classList.add("active"); refFilterT = b.dataset.t; renderRefs();
});
function openRef(id){
  editRefId = id || null;
  const r = id ? DB.refs.find(x => x.id === id) : { type:"AUTH", name:"", desc:"", code:"" };
  document.getElementById("refTitle").textContent = id ? "Edit entry" : "New entry";
  refType.value = r.type; refName.value = r.name; refDesc.value = r.desc; refCode.value = r.code || "";
  document.getElementById("refModal").classList.add("show");
}
function saveRef(){
  if (!refName.value.trim()) return toast("Name is required");
  if (editRefId){
    const r = DB.refs.find(x => x.id === editRefId);
    r.type = refType.value; r.name = refName.value; r.desc = refDesc.value; r.code = refCode.value;
  } else {
    DB.refs.unshift({ id: Date.now(), type: refType.value, name: refName.value, desc: refDesc.value, code: refCode.value });
  }
  save(); renderRefs(); renderStats(); closeM("refModal"); toast("Added for this session ✓");
}
function delRef(id){ if (!confirm("Delete this entry?")) return; DB.refs = DB.refs.filter(x => x.id !== id); save(); renderRefs(); renderStats(); }
function renderRefs(){
  renderClaudeRefs();
  const q = (document.getElementById("refSearch").value || "").toLowerCase();
  const list = DB.refs.filter(r => (refFilterT === "ALL" || r.type === refFilterT) && (r.name + r.desc).toLowerCase().includes(q));
  const g = document.getElementById("refGrid");
  if (!list.length){ g.innerHTML = '<div class="empty"><div class="big">⌕</div>No entries here yet. Add the authorization objects, tables and reports you look up so you never lose them.</div>'; return; }
  g.innerHTML = list.map(r => `<div class="card">
    <span class="tag ${r.type}">${r.type}</span>
    <h3 style="margin-top:8px;font-family:monospace">${escH(r.name)}</h3>
    ${r.desc ? `<div class="desc">${escH(r.desc)}</div>` : ""}
    ${r.code ? `<pre>${escH(r.code)}</pre>` : ""}
    <div class="row">
      ${r.code ? `<button class="btn sm primary" onclick="copyCode(this)">⧉ Copy</button>` : ""}
      <button class="btn sm" onclick="copyName(this)">Copy name</button>
      <button class="btn sm" onclick="openRef(${r.id})">Edit</button>
      <button class="btn sm danger" onclick="delRef(${r.id})">Delete</button>
    </div></div>`).join("");
}

/* ---------- references researched by Claude (refs.js) ---------- */
function refCardClaude(r){
  return `<div class="card">
    <span class="tag ${r.type}">${r.type}</span>
    <h3 style="margin-top:8px;font-family:monospace">${escH(r.name)}</h3>
    ${r.desc ? `<div class="desc">${escH(r.desc)}</div>` : ""}
    ${r.code ? `<pre>${escH(r.code)}</pre>` : ""}
    <div class="row">
      <button class="btn sm primary" onclick="claudeRefAdd(this)">+ Add to notebook</button>
      ${r.code ? `<button class="btn sm" onclick="copyCode(this)">⧉ Copy</button>` : ""}
      <button class="btn sm" onclick="copyName(this)">Copy name</button>
    </div></div>`;
}
function renderClaudeRefs(){
  const box = window.CLAUDE_REFS || { items: [] };
  let items = Array.isArray(box.items) ? box.items : [];
  const q = (document.getElementById("refSearch").value || "").toLowerCase();
  items = items.filter(r => (refFilterT === "ALL" || r.type === refFilterT) &&
                            ((r.name || "") + (r.desc || "")).toLowerCase().includes(q));
  const wrap = document.getElementById("claudeRefWrap");
  if (!items.length){ wrap.innerHTML = ""; return; }
  wrap.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin:0 0 12px">
      <h3 style="font-size:14px;color:var(--accent2)">📥 Researched by Claude${box.generatedAt ? " · " + box.generatedAt : ""}</h3>
      <button class="btn sm" onclick="claudeRefAddAll()">+ Add all to notebook</button>
    </div>
    <div class="grid" style="margin-bottom:26px">${items.map(refCardClaude).join("")}</div>
    <h3 style="font-size:14px;color:var(--muted);margin-bottom:12px">Your notebook</h3>`;
}
function addRefObj(o){
  if (!o.name) return false;
  if (DB.refs.some(r => r.name.toLowerCase() === o.name.toLowerCase())) return false;
  DB.refs.unshift({ id: Date.now() + Math.floor(Math.random() * 100000),
                    type: o.type || "FM", name: o.name, desc: o.desc || "", code: o.code || "" });
  return true;
}
function claudeRefAdd(btn){
  const c = btn.closest(".card");
  const ok = addRefObj({
    type: c.querySelector(".tag").textContent.trim(),
    name: c.querySelector("h3").textContent.trim(),
    desc: c.querySelector(".desc") ? c.querySelector(".desc").textContent : "",
    code: c.querySelector("pre") ? c.querySelector("pre").textContent : ""
  });
  if (ok){ save(); renderRefs(); renderStats(); toast("Added to your notebook ✓"); }
  else toast("Already in your notebook");
}
function claudeRefAddAll(){
  const items = (window.CLAUDE_REFS && window.CLAUDE_REFS.items) || [];
  let n = 0;
  items.forEach(o => { if (addRefObj(o)) n++; });
  save(); renderRefs(); renderStats();
  toast(n ? ("Added " + n + " to your notebook ✓") : "All already in your notebook");
}

/* ---------- from claude inbox ---------- */
function renderInbox(){
  const box = window.CLAUDE_INBOX || { items: [] };
  const items = Array.isArray(box.items) ? box.items : [];
  document.getElementById("inboxStamp").textContent = box.generatedAt ? ("updated " + box.generatedAt) : "";
  const badge = document.getElementById("inboxBadge");
  if (items.length){ badge.style.display = "inline-block"; badge.textContent = items.length; }
  else { badge.style.display = "none"; }
  const g = document.getElementById("inboxGrid");
  if (!items.length){ g.innerHTML = '<div class="empty"><div class="big">📥</div>Nothing here yet. Ask Claude in chat for a trace analysis, a role design or a check, then press Ctrl+R. It shows up here.</div>'; return; }
  g.innerHTML = items.map((it, i) => `<div class="card">
    <span class="tag SNIPPET">from claude</span>
    <h3 style="margin-top:8px">${escH(it.title || ("Snippet " + (i + 1)))}</h3>
    ${it.note ? `<div class="desc">${escH(it.note)}</div>` : ""}
    <pre>${escH(it.code || "")}</pre>
    <div class="row">
      <button class="btn sm primary" onclick="copyCode(this)">⧉ Copy</button>
      <button class="btn sm" onclick="inboxToEditor(${i})">→ Editor</button>
      <button class="btn sm" onclick="inboxSave(${i})">❖ Save snippet</button>
    </div></div>`).join("");
}
function inboxToEditor(i){
  const it = (window.CLAUDE_INBOX.items || [])[i];
  const t = document.getElementById("code");
  t.value += (t.value && !t.value.endsWith("\n") ? "\n\n" : "") + (it.code || "");
  hl(); save(); go("work"); toast("Loaded into editor");
}
function inboxSave(i){
  const it = (window.CLAUDE_INBOX.items || [])[i];
  DB.snips.unshift({ id: Date.now(), name: it.title || "From Claude", note: it.note || "", code: it.code || "" });
  save(); renderSnips(); renderStats(); toast("Added to snippets for this session ✓");
}

/* ---------- cheat sheet ---------- */
const CHEAT = [
  {
    "h": "Missing authorization: the order that works",
    "items": [
      [
        "1. Last failed check",
        "SU53\n(for someone else: SU53 -> Display for other user)"
      ],
      [
        "2. Not conclusive? Trace it",
        "STAUTHTRACE -> user -> activate\nreproduce the error -> evaluate"
      ],
      [
        "3. Fix the default, not the role",
        "SU24 -> transaction or service\n-> object -> proposal / check indicator"
      ],
      [
        "4. Pull it into the role",
        "PFCG -> Authorizations -> Expert mode\n-> Read old data and merge with new"
      ],
      [
        "5. Make it effective",
        "PFCG -> User tab -> User comparison\n(or PFUD for many roles)"
      ],
      [
        "6. What does the user hold now?",
        "SU56 -> Authorization values"
      ]
    ]
  },
  {
    "h": "AUTHORITY-CHECK in code",
    "items": [
      [
        "Basic check",
        "AUTHORITY-CHECK OBJECT 'S_TCODE'\n  ID 'TCD' FIELD 'SU01'."
      ],
      [
        "Ignore one field",
        "AUTHORITY-CHECK OBJECT 'M_MSEG_WWA'\n  ID 'ACTVT' DUMMY\n  ID 'WERKS' FIELD lv_plant."
      ],
      [
        "What sy-subrc means",
        "0  = authorized\n4  = has the object, not these values\n12 = no authorization for the object"
      ],
      [
        "Transaction check",
        "CALL FUNCTION 'AUTHORITY_CHECK_TCODE'\n  EXPORTING tcode = 'SU01'\n  EXCEPTIONS ok = 0 not_ok = 1 OTHERS = 2."
      ]
    ]
  },
  {
    "h": "CDS access control (DCL)",
    "items": [
      [
        "Switch the check on",
        "@AccessControl.authorizationCheck: #CHECK"
      ],
      [
        "Filter by a PFCG object",
        "grant select on ZI_View\n  where ( CompanyCode ) = aspect pfcg_auth( F_BKPF_BUK, BUKRS, ACTVT = '03' );"
      ],
      [
        "Full access (on purpose)",
        "grant select on ZI_View;"
      ],
      [
        "Test as the user",
        "Data preview in ADT, logged on as a test user\n(your own access hides the problem)"
      ]
    ]
  },
  {
    "h": "Fiori launchpad",
    "items": [
      [
        "Tile missing",
        "Role menu: catalog + space (or group)\n/UI2/FLIA: does the intent resolve?"
      ],
      [
        "App opens, then fails",
        "/IWFND/ERROR_LOG for the user and time"
      ],
      [
        "Clear caches",
        "SE38 -> /UI2/INVALIDATE_CLIENT_CACHES\nthen clear the browser cache"
      ],
      [
        "Readable errors",
        "&sap-ui-debug=true"
      ],
      [
        "After deploying an app",
        "SE38 -> /UI5/APP_INDEX_CALCULATE"
      ]
    ]
  },
  {
    "h": "Gateway and OData",
    "items": [
      [
        "403 on a GET",
        "S_SERVICE missing: add the service to the role\nPFCG -> Menu -> Authorization Default -> TADIR Service -> R3TR IWSG <SERVICE>_0001"
      ],
      [
        "403 on a POST only",
        "CSRF token: fetch with x-csrf-token: Fetch,\nsend it back with the same session cookie"
      ],
      [
        "404 or \"service not found\"",
        "/IWFND/MAINT_SERVICE: service and ICF node active?"
      ],
      [
        "500",
        "/IWBEP/ERROR_LOG: the business error behind it"
      ],
      [
        "Replay a call",
        "/IWFND/GW_CLIENT -> GET /sap/opu/odata/sap/<SERVICE>/$metadata"
      ]
    ]
  },
  {
    "h": "Users and passwords",
    "items": [
      [
        "Password rules",
        "login/min_password_lng\nlogin/fails_to_user_lock\nlogin/password_expiration_time"
      ],
      [
        "Rules for some users only",
        "SECPOL -> security policy -> SU01 Logon data"
      ],
      [
        "Why is this user locked?",
        "USR02-UFLAG: 32 global, 64 admin, 128 failed logons"
      ],
      [
        "Many users at once",
        "SU10 -> lock / unlock / add role"
      ]
    ]
  },
  {
    "h": "Security transactions (your toolkit)",
    "items": [
      [
        "SU01 — users",
        "SU01"
      ],
      [
        "PFCG — roles",
        "PFCG"
      ],
      [
        "SUIM — who has what",
        "SUIM"
      ],
      [
        "SU53 — last failed check",
        "SU53"
      ],
      [
        "STAUTHTRACE — authorization trace",
        "STAUTHTRACE"
      ],
      [
        "SU24 — proposals",
        "SU24"
      ],
      [
        "RSAU_READ_LOG — security audit log",
        "RSAU_READ_LOG"
      ],
      [
        "STRUST — certificates",
        "STRUST"
      ],
      [
        "/IWFND/MAINT_SERVICE — OData services",
        "/IWFND/MAINT_SERVICE"
      ],
      [
        "/UI2/FLIA — launchpad intent analysis",
        "/UI2/FLIA"
      ]
    ]
  }
];
function renderCheat(){
  document.getElementById("cheat").innerHTML = CHEAT.map(b => `<div class="cheat-block"><h3>${b.h}</h3><div class="grid">${
    b.items.map(it => `<div class="card" style="cursor:pointer" onclick="copyCode(this)" title="Click to copy">
      <h3 style="font-size:13px;color:var(--accent2)">${escH(it[0])}</h3>
      <pre style="margin:0">${escH(it[1])}</pre></div>`).join("")
  }</div></div>`).join("");
}

/* ---------- misc ---------- */
function escH(s){ return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function closeM(id){ document.getElementById(id).classList.remove("show"); }
document.querySelectorAll(".modal-bg").forEach(mm => mm.addEventListener("click", e => { if (e.target === mm) mm.classList.remove("show"); }));
function renderStats(){
  document.getElementById("stat-snip").textContent = DB.snips.length;
  document.getElementById("stat-ref").textContent  = DB.refs.length;
  document.getElementById("stat-fm").textContent   = DB.refs.filter(r => r.type === "AUTH").length;
  document.getElementById("stat-bapi").textContent = DB.refs.filter(r => r.type === "TABLE").length;
}

/* ---------- second brain / wiki ---------- */
let WIKI = { pages: [] }, WIKI_BY = {}, WIKI_ACTIVE = null, wikiGraphOn = false;
function escAttr(s){ return (s || "").replace(/\\/g,"\\\\").replace(/'/g,"\\'"); }
function wikiLinks(md){
  const out = [], re = /\[\[([^\]]+)\]\]/g; let m;
  while ((m = re.exec(md || ""))){ const t = m[1].split("|")[0].trim(); if (t && !out.includes(t)) out.push(t); }
  return out;
}
function wikiInline(s){
  s = escH(s);
  s = s.replace(/`([^`]+)`/g, (m,c) => "<code>" + c + "</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\[\[([^\]]+)\]\]/g, (m, inner) => {
    const parts = inner.split("|"), name = parts[0].trim(), label = (parts[1] || parts[0]).trim();
    const exists = !!WIKI_BY[name.toLowerCase()];
    return `<a class="wikilink${exists ? "" : " missing"}" onclick="openWiki('${escAttr(name)}')">${label}</a>`;
  });
  return s;
}
function wikiTable(rows){
  const cells = r => r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(c => wikiInline(c.trim()));
  const head = cells(rows[0]), body = rows.slice(2).map(cells);
  return '<table class="wiki-tbl"><thead><tr>' + head.map(c => "<th>" + c + "</th>").join("") +
    "</tr></thead><tbody>" + body.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
}
function mdToHtml(md){
  md = (md || "").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const lines = md.split(/\r?\n/);
  let html = "", inCode = false, codeBuf = [], listType = null;
  const closeList = () => { if (listType){ html += "</" + listType + ">"; listType = null; } };
  for (let i = 0; i < lines.length; i++){
    let ln = lines[i];
    if (/^```/.test(ln)){
      if (!inCode){ inCode = true; codeBuf = []; }
      else { inCode = false; html += '<pre class="wiki-pre">' + escH(codeBuf.join("\n")) + "</pre>"; }
      continue;
    }
    if (inCode){ codeBuf.push(ln); continue; }
    if (/^\s*\|.*\|/.test(ln)){
      const tbl = [ln];
      while (i + 1 < lines.length && /^\s*\|/.test(lines[i + 1])) tbl.push(lines[++i]);
      closeList(); html += wikiTable(tbl); continue;
    }
    if (/^\s*---\s*$/.test(ln)){ closeList(); html += "<hr>"; continue; }
    const h = ln.match(/^(#{1,6})\s+(.*)$/);
    if (h){ closeList(); const lv = h[1].length; html += "<h" + lv + ">" + wikiInline(h[2]) + "</h" + lv + ">"; continue; }
    if (/^\s*>\s?/.test(ln)){ closeList(); html += "<blockquote>" + wikiInline(ln.replace(/^\s*>\s?/, "")) + "</blockquote>"; continue; }
    const ul = ln.match(/^\s*[-*]\s+(.*)$/), ol = ln.match(/^\s*\d+\.\s+(.*)$/);
    if (ul){ if (listType !== "ul"){ closeList(); html += "<ul>"; listType = "ul"; } html += "<li>" + wikiInline(ul[1]) + "</li>"; continue; }
    if (ol){ if (listType !== "ol"){ closeList(); html += "<ol>"; listType = "ol"; } html += "<li>" + wikiInline(ol[1]) + "</li>"; continue; }
    if (/^\s*$/.test(ln)){ closeList(); continue; }
    closeList(); html += "<p>" + wikiInline(ln) + "</p>";
  }
  if (inCode) html += '<pre class="wiki-pre">' + escH(codeBuf.join("\n")) + "</pre>";
  closeList();
  return html;
}
function wikiInit(){
  const box = window.CLAUDE_WIKI || { pages: [] };
  WIKI = box; WIKI.pages = Array.isArray(box.pages) ? box.pages : [];
  WIKI_BY = {};
  WIKI.pages.forEach(p => { WIKI_BY[p.name.toLowerCase()] = p; p._links = wikiLinks(p.body); p._back = []; });
  WIKI.pages.forEach(p => p._links.forEach(t => {
    const tp = WIKI_BY[t.toLowerCase()];
    if (tp && tp !== p && !tp._back.includes(p.name)) tp._back.push(p.name);
  }));
  const stamp = document.getElementById("wikiStamp");
  if (stamp) stamp.textContent = WIKI.pages.length ? (WIKI.pages.length + " pages" + (box.generatedAt ? " · " + box.generatedAt : "")) : "";
  buildWikiGraph();
}

/* ---------- force-directed graph ---------- */
let G = { nodes:[], edges:[], adj:{}, svg:null, W:900, H:520, raf:0, alpha:0, dragging:null, didDrag:false, active:null, _fitted:false, lineEls:[], nodeEls:{}, k:1, panX:0, panY:0, panning:false, panStart:null, pressed:null };
const GCOL = { ticket:"#33a9e0", object:"#6f8a9c", concept:"#008FD3", meta:"#5d6772" };

function buildWikiGraph(){
  const svg = document.getElementById("wikiSvg"); if (!svg) return;
  G.svg = svg;
  const r = svg.getBoundingClientRect();
  G.W = (r.width  > 10 ? r.width  : 900);
  G.H = (r.height > 10 ? r.height : 520);
  const pages = WIKI.pages, N = Math.max(1, pages.length), deg = {};
  pages.forEach(p => deg[p.name.toLowerCase()] = (p._links||[]).length + (p._back||[]).length);
  G.nodes = pages.map((p, i) => {
    const a = (i / N) * 2 * Math.PI;
    const d = deg[p.name.toLowerCase()] || 0;
    return { id:p.name.toLowerCase(), page:p, deg:d,
      short:p.name, full:(p.title || p.name),     /* short key label vs full title */
      x:G.W/2 + Math.cos(a)*Math.min(180,G.W/4), y:G.H/2 + Math.sin(a)*Math.min(150,G.H/4),
      vx:0, vy:0, r:7 + Math.min(9, d * 1.7) };
  });
  const byId = {}; G.nodes.forEach(n => byId[n.id] = n);
  const seen = {}; G.edges = [];
  pages.forEach(p => (p._links||[]).forEach(t => {
    const a = p.name.toLowerCase(), b = t.toLowerCase();
    if (!byId[b] || a === b) return;
    const k = [a,b].sort().join("|"); if (seen[k]) return; seen[k] = 1;
    G.edges.push({ a:byId[a], b:byId[b] });
  }));
  G.adj = {}; G.nodes.forEach(n => G.adj[n.id] = new Set([n.id]));
  G.edges.forEach(e => { G.adj[e.a.id].add(e.b.id); G.adj[e.b.id].add(e.a.id); });

  const defs = '<defs><filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  const eHtml = G.edges.map(() => '<line class="gedge"></line>').join("");
  const nHtml = G.nodes.map(n => {
    const c = GCOL[n.page.type] || "#8b97b3";
    const hub = n.deg >= 3 ? " lbl" : "";   /* only well-connected hubs label by default */
    return `<g class="gnode${hub}" data-id="${escAttr(n.id)}" onpointerdown="gDown(event,'${escAttr(n.id)}')" onpointerenter="gHover('${escAttr(n.id)}')" onpointerleave="gHover(null)">`
      + `<circle class="dot" r="${n.r.toFixed(1)}" fill="${c}" stroke="${c}" stroke-opacity="0"></circle>`
      + `<text text-anchor="middle" dy="${(-n.r - 7).toFixed(0)}">${escH(n.short)}</text></g>`;
  }).join("");
  svg.setAttribute("viewBox", "0 0 " + G.W.toFixed(0) + " " + G.H.toFixed(0));
  svg.innerHTML = defs + '<g id="gWorld"><g>' + eHtml + "</g><g>" + nHtml + "</g></g>";
  G.lineEls = Array.prototype.slice.call(svg.querySelectorAll(".gedge"));
  G.nodeEls = {};
  Array.prototype.slice.call(svg.querySelectorAll(".gnode")).forEach(el => G.nodeEls[el.getAttribute("data-id")] = el);
  svg.onpointerdown = gBgDown; svg.onpointermove = gMove; svg.onpointerup = gUp;
  svg.onwheel = gWheel;
  G.active = null; G.k = 1; G.panX = 0; G.panY = 0;
  applyZoomTransform();
  gReheat();
}

function gReheat(){ G.alpha = 1; if (!G.raf) G.raf = requestAnimationFrame(gTick); }
function wikiReheat(){ G.nodes.forEach(n => { n.x += (Math.random()-0.5)*60; n.y += (Math.random()-0.5)*60; }); gReheat(); }

function gTick(){
  const nodes = G.nodes, cx = G.W/2, cy = G.H/2;
  for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++){
    const a=nodes[i], b=nodes[j]; let dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy; if(d2<1)d2=1;
    const d=Math.sqrt(d2), f=15000/d2, fx=(dx/d)*f, fy=(dy/d)*f;
    a.vx+=fx; a.vy+=fy; b.vx-=fx; b.vy-=fy;
  }
  G.edges.forEach(e => {
    let dx=e.b.x-e.a.x, dy=e.b.y-e.a.y, d=Math.sqrt(dx*dx+dy*dy); if(d<1)d=1;
    const f=(d-155)*0.02, fx=(dx/d)*f, fy=(dy/d)*f;
    e.a.vx+=fx; e.a.vy+=fy; e.b.vx-=fx; e.b.vy-=fy;
  });
  nodes.forEach(n => {
    n.vx += (cx-n.x)*0.004; n.vy += (cy-n.y)*0.004;
    if (n === G.dragging){ n.vx=0; n.vy=0; }
    else { n.vx*=0.86; n.vy*=0.86; n.x += n.vx*G.alpha; n.y += n.vy*G.alpha; }
    n.x = Math.max(n.r+16, Math.min(G.W-n.r-16, n.x));
    n.y = Math.max(n.r+22, Math.min(G.H-n.r-12, n.y));
  });
  G.edges.forEach((e,i) => { const l=G.lineEls[i]; if(!l)return;
    l.setAttribute("x1",e.a.x.toFixed(1)); l.setAttribute("y1",e.a.y.toFixed(1));
    l.setAttribute("x2",e.b.x.toFixed(1)); l.setAttribute("y2",e.b.y.toFixed(1)); });
  G.nodes.forEach(n => { const el=G.nodeEls[n.id]; if(el) el.setAttribute("transform", "translate(" + n.x.toFixed(1) + " " + n.y.toFixed(1) + ")"); });
  G.alpha *= 0.985;
  if (G.alpha > 0.02 || G.dragging) G.raf = requestAnimationFrame(gTick); else G.raf = 0;
}

function gSvgCoord(e){ const r=G.svg.getBoundingClientRect(); return { x:(e.clientX-r.left)*(G.W/r.width), y:(e.clientY-r.top)*(G.H/r.height) }; }
function gPt(e){ const s=gSvgCoord(e); return { x:(s.x-G.panX)/G.k, y:(s.y-G.panY)/G.k }; }
function applyZoomTransform(){ const w=document.getElementById("gWorld"); if(w) w.setAttribute("transform","translate("+G.panX.toFixed(1)+" "+G.panY.toFixed(1)+") scale("+G.k.toFixed(3)+")"); }
function gZoomAt(factor, sx, sy){ const nk=Math.max(0.3, Math.min(4, G.k*factor)), f=nk/G.k; G.panX = sx - (sx - G.panX)*f; G.panY = sy - (sy - G.panY)*f; G.k = nk; applyZoomTransform(); }
function gZoomBtn(factor){ gZoomAt(factor, G.W/2, G.H/2); }
function gZoomReset(){ G.k=1; G.panX=0; G.panY=0; applyZoomTransform(); }
function gWheel(e){ e.preventDefault(); const s=gSvgCoord(e); gZoomAt(e.deltaY<0?1.12:0.89, s.x, s.y); }
function gBgDown(e){ if(e.target && e.target.closest && e.target.closest(".gnode")) return; G.pressed=null; const s=gSvgCoord(e); G.panning=true; G.panStart={ x:s.x, y:s.y, panX:G.panX, panY:G.panY }; if(G.svg.setPointerCapture){ try{ G.svg.setPointerCapture(e.pointerId); }catch(_){} } }
function gDown(e, id){ e.preventDefault(); G.dragging = G.nodes.find(n=>n.id===id) || null; G.pressed = G.dragging; G.didDrag=false; if(G.svg.setPointerCapture){ try{ G.svg.setPointerCapture(e.pointerId); }catch(_){} } }
function gMove(e){
  if(G.dragging){ const p=gPt(e); if(Math.abs(p.x-G.dragging.x)+Math.abs(p.y-G.dragging.y)>3)G.didDrag=true; G.dragging.x=p.x; G.dragging.y=p.y; gReheat(); return; }
  if(G.panning){ const s=gSvgCoord(e); G.panX=G.panStart.panX+(s.x-G.panStart.x); G.panY=G.panStart.panY+(s.y-G.panStart.y); applyZoomTransform(); }
}
function gUp(){ if(G.pressed && !G.didDrag) openWiki(G.pressed.page.name); G.dragging=null; G.panning=false; G.pressed=null; }

function gApplyFocus(id){
  const set = id ? G.adj[id] : null;
  G.nodes.forEach(n => { const el=G.nodeEls[n.id]; if(!el)return;
    el.classList.remove("dim");                       /* keep every node's info visible */
    el.classList.toggle("hot", !!set && set.has(n.id));
    const t = el.querySelector("text");               /* full title only on the focused node */
    if (t) t.textContent = (id && n.id === id) ? n.full : n.short;
  });
  G.edges.forEach((e,i) => { const l=G.lineEls[i]; if(!l)return;
    const on = set && set.has(e.a.id) && set.has(e.b.id) && (e.a.id===id || e.b.id===id);
    l.classList.toggle("hot", !!on);
    l.classList.toggle("dim", !!set && !on);
  });
}
function gHover(id){ if(G.dragging)return; gApplyFocus(id || G.active); }

function openWiki(name){
  const p = WIKI_BY[(name || "").toLowerCase()];
  if (!p){ toast("No page “" + name + "” yet"); return; }
  go("wiki");
  G.active = p.name.toLowerCase();
  gApplyFocus(G.active); gPulse(G.active);
  const doc = document.getElementById("wikiDoc");
  let html = `<div class="wiki-meta"><span>📄 ${escH(p.folder)}/${escH(p.name)}</span>${p.updated ? "<span>updated " + escH(p.updated) + "</span>" : ""}</div>`;
  html += mdToHtml(p.body);
  html += '<div class="wiki-backlinks"><h4>🔗 Linked from</h4>';
  html += (p._back && p._back.length)
    ? p._back.map(nm => `<span class="wiki-chip" onclick="openWiki('${escAttr(nm)}')">${escH((WIKI_BY[nm.toLowerCase()] || {}).title || nm)}</span>`).join("")
    : '<span style="color:var(--com);font-size:12px">Nothing links here yet.</span>';
  html += "</div>";
  doc.innerHTML = html; doc.scrollTop = 0;
  var _heads = Array.prototype.slice.call(doc.querySelectorAll("h2, h3"));
  if (_heads.length >= 2){
    _heads.forEach(function(h,i){ h.id = "wkh" + i; });
    doc.insertAdjacentHTML("afterbegin",
      '<div class="wiki-toc"><b>On this page</b>' +
      _heads.map(function(h,i){ return '<a class="' + h.tagName.toLowerCase() + '" onclick="wikiScrollTo(' + i + ')">' + escH(h.textContent) + '</a>'; }).join("") +
      '</div>');
  }
  document.getElementById("wikiReader").classList.add("open");
  if (!G._fitted) setTimeout(wikiShown, 40);
}
function closeWikiReader(){ document.getElementById("wikiReader").classList.remove("open"); G.active=null; gApplyFocus(null); gPulse(null); }
function gPulse(id){
  Object.keys(G.nodeEls).forEach(k => { const ring=G.nodeEls[k].querySelector(".gpulse"); if(ring) ring.remove(); });
  if(!id) return;
  const el=G.nodeEls[id], n=G.nodes.find(x=>x.id===id); if(!el||!n)return;
  const c = GCOL[n.page.type] || "#8b97b3";
  const ring = document.createElementNS("http://www.w3.org/2000/svg","circle");
  ring.setAttribute("class","gpulse"); ring.setAttribute("r", n.r.toFixed(1));
  ring.setAttribute("fill","none"); ring.setAttribute("stroke", c); ring.setAttribute("stroke-width","2");
  el.insertBefore(ring, el.firstChild);
}
function wikiFilter(){
  const q = (document.getElementById("wikiSearch").value || "").toLowerCase();
  if (!q){ gApplyFocus(G.active); return; }
  G.nodes.forEach(n => { const el=G.nodeEls[n.id]; if(!el)return;
    const hit = (n.page.name + n.page.title + n.page.body).toLowerCase().includes(q);
    el.classList.toggle("dim", !hit); el.classList.toggle("hot", hit);
  });
  G.edges.forEach((e,i) => { const l=G.lineEls[i]; if(l){ l.classList.add("dim"); l.classList.remove("hot"); } });
}
function wikiShown(){ if (!G._fitted){ G._fitted = true; buildWikiGraph(); } else { gReheat(); } }
var _wikiNav = document.querySelector('.nav button[data-view="wiki"]');
if (_wikiNav) _wikiNav.addEventListener("click", () => setTimeout(wikiShown, 40));
window.addEventListener("resize", () => { const v=document.getElementById("view-wiki"); if (v && v.classList.contains("active")){ G._fitted=false; wikiShown(); } });

/* ---------- wiki extras: heading scroll + type filter ---------- */
function wikiScrollTo(i){ const e = document.getElementById("wkh" + i); if (e) e.scrollIntoView({ behavior:"smooth", block:"start" }); }
function wikiTypeFilter(type, btn){
  document.querySelectorAll("#wkChips button").forEach(b => b.classList.toggle("active", b === btn));
  G.nodes.forEach(n => { const el=G.nodeEls[n.id]; if(!el)return;
    const onType = type === "ALL" || n.page.type === type;
    el.classList.toggle("dim", !onType);
    el.classList.toggle("typeshow", type !== "ALL" && onType);   /* reveal labels for the chosen type */
  });
  G.edges.forEach((e,i) => { const l=G.lineEls[i]; if(!l)return;
    const on = type === "ALL" || (e.a.page.type === type && e.b.page.type === type);
    l.classList.toggle("dim", !on); l.classList.remove("hot");
  });
}

/* ---------- my tickets (offline service-desk mirror) ---------- */
function renderTickets(){
  const box = window.CLAUDE_TICKETS || { items: [] };
  const items = Array.isArray(box.items) ? box.items : [];
  const stamp = document.getElementById("ticketsStamp");
  if (stamp) stamp.textContent = box.generatedAt ? ("snapshot " + box.generatedAt) : "";
  const el = document.getElementById("ticketsList"); if (!el) return;
  if (!items.length){ el.innerHTML = '<div class="empty"><div class="big">🎫</div>No tickets in the snapshot. They refresh with the morning sync.</div>'; return; }
  const threads = (window.CLAUDE_COMMENTS && window.CLAUDE_COMMENTS.threads) || {};
  el.innerHTML = items.map(t => {
    const cls = /progress/i.test(t.status) ? "tk-prog" : /wait|process|active/i.test(t.status) ? "tk-wait" : "tk-pend";
    const meta = [t.type, t.priority, t.project, t.updated ? ("upd " + t.updated) : ""].filter(Boolean).join(" · ");
    const cm = threads[t.key] || [];
    const thread = cm.length
      ? '<button class="tk-cmt-toggle" onclick="toggleCmt(this)">💬 ' + cm.length + ' comment' + (cm.length>1?'s':'') + '</button>'
        + '<div class="tk-thread" hidden>'
        + cm.map(c => '<div class="tk-cmt"><div class="tk-cmt-h"><span class="tk-cmt-a">' + escH(c.a) + '</span><span class="tk-cmt-d">' + escH(c.d) + '</span></div><div class="tk-cmt-t">' + escH(c.t) + '</div></div>').join("")
        + '</div>'
      : '';
    return '<div class="tk-card"><div class="tk-top">'
      + (t.url
          ? '<a class="tk-key" href="' + escH(t.url) + '" target="_blank" rel="noopener">' + escH(t.key) + '</a>'
          : '<span class="tk-key">' + escH(t.key) + '</span>')
      + '<span class="tk-badge ' + cls + '">' + escH(t.status) + '</span>'
      + '<span class="tk-meta">' + escH(meta) + '</span>'
      + '</div><div class="tk-sum">' + escH(t.summary || "") + '</div>'
      + (t.note ? '<div class="tk-note">' + escH(t.note) + '</div>' : '')
      + thread
      + '</div>';
  }).join("");
}
function toggleCmt(btn){
  const th = btn.nextElementSibling; if(!th) return;
  if(th.hasAttribute("hidden")){ th.removeAttribute("hidden"); btn.classList.add("open"); }
  else { th.setAttribute("hidden",""); btn.classList.remove("open"); }
}

/* ---------- t-codes ---------- */
function tcodeModules(){
  const items = (window.CLAUDE_TCODES && window.CLAUDE_TCODES.items) || [];
  const seen = []; items.forEach(t => { if (seen.indexOf(t.module) < 0) seen.push(t.module); });
  return seen;
}
function tcodeInit(){
  const sel = document.getElementById("tcodeModule"); if (!sel) return;
  const items = (window.CLAUDE_TCODES && window.CLAUDE_TCODES.items) || [];
  sel.innerHTML = '<option value="ALL">All areas (' + items.length + ')</option>'
    + tcodeModules().map(m => '<option value="' + escAttr(m) + '">' + escH(m) + '</option>').join("");
  renderTcodes();
}
function renderTcodes(){
  const box = window.CLAUDE_TCODES || { items: [] };
  const items = Array.isArray(box.items) ? box.items : [];
  const stamp = document.getElementById("tcodeStamp");
  if (stamp) stamp.textContent = box.generatedAt ? (items.length + " codes · " + box.generatedAt) : "";
  const el = document.getElementById("tcodeList"); if (!el) return;
  const q = (document.getElementById("tcodeSearch").value || "").toLowerCase();
  const mod = (document.getElementById("tcodeModule") || {}).value || "ALL";
  const list = items.filter(t => (mod === "ALL" || t.module === mod) &&
    ((t.code||"") + " " + (t.title||"") + " " + (t.module||"") + " " + (t.note||"")).toLowerCase().includes(q));
  if (!list.length){ el.innerHTML = '<div class="empty"><div class="big">⌗</div>No T-codes match. Try another word, or ask Claude to add it.</div>'; return; }
  const groups = {};
  list.forEach(t => { (groups[t.module] = groups[t.module] || []).push(t); });
  el.innerHTML = tcodeModules().filter(m => groups[m]).map(m =>
    '<div class="tc-block"><h3>' + escH(m) + ' · ' + groups[m].length + '</h3><div class="tc-grid">'
    + groups[m].map(t => '<div class="tc-card" data-code="' + escAttr(t.code) + '" onclick="copy(this.dataset.code)" title="Click to copy ' + escAttr(t.code) + '">'
        + '<span class="tc-code">' + escH(t.code) + '</span>'
        + '<span class="tc-title">' + escH(t.title || "") + '</span>'
        + (t.note ? '<span class="tc-note2">' + escH(t.note) + '</span>' : '')
        + '</div>').join("")
    + '</div></div>').join("");
}

/* ---------- dashboard recent activity ---------- */
function renderRecent(){
  const inbox = (window.CLAUDE_INBOX && window.CLAUDE_INBOX.items) || [];
  const bi = document.getElementById("recentInbox");
  if (bi) bi.innerHTML = "<h3>Latest from Claude</h3>" + (inbox.length
    ? inbox.slice(-5).reverse().map(it => '<a onclick="go(\'inbox\')">' + escH(it.title || "Item") + '</a>').join("")
    : '<div class="muted">Nothing yet.</div>');
  const pages = (window.CLAUDE_WIKI && window.CLAUDE_WIKI.pages) || [];
  const bw = document.getElementById("recentWiki");
  if (bw){
    const sorted = pages.slice().sort((a,b) => (b.updated||"").localeCompare(a.updated||""));
    bw.innerHTML = "<h3>Recently changed wiki</h3>" + (sorted.length
      ? sorted.slice(0,6).map(p => '<a onclick="openWiki(\'' + escAttr(p.name) + '\')">' + escH(p.title||p.name) + ' <span class="muted">' + escH(p.updated||"") + '</span></a>').join("")
      : '<div class="muted">No pages.</div>');
  }
}

/* ---------- global search ---------- */
function searchHit(q, text){ return (text||"").toLowerCase().indexOf(q) >= 0; }
function searchSnippet(q, text){
  text = (text||"").replace(/\s+/g," ").trim();
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return escH(text.slice(0,140));
  const start = Math.max(0, i-40);
  return (start>0?"…":"") + escH(text.slice(start,i)) + "<mark>" + escH(text.slice(i,i+q.length)) + "</mark>" + escH(text.slice(i+q.length,i+q.length+90)) + "…";
}
function srchRow(onclk, title, snip){
  return '<div class="srch-row" onclick="' + onclk + '"><div class="t">' + title + '</div>' + (snip ? '<div class="s">' + snip + '</div>' : '') + '</div>';
}
function renderSearch(){
  const q = (document.getElementById("globalSearch").value || "").trim().toLowerCase();
  const out = document.getElementById("searchResults"); if (!out) return;
  if (!q){
    const pages = ((window.CLAUDE_WIKI && window.CLAUDE_WIKI.pages) || []).slice().sort((a,b)=>(b.updated||"").localeCompare(a.updated||"")).slice(0,6);
    const inbox = ((window.CLAUDE_INBOX && window.CLAUDE_INBOX.items) || []).slice(-5).reverse();
    out.innerHTML = '<div class="srch-grp">Recently changed wiki</div>'
      + pages.map(p => srchRow("openWiki('" + escAttr(p.name) + "')", "🧠 " + escH(p.title||p.name), escH(p.updated||""))).join("")
      + '<div class="srch-grp">Latest from Claude</div>'
      + inbox.map(it => srchRow("go('inbox')", "📥 " + escH(it.title||""), "")).join("");
    return;
  }
  let html = "";
  const wikiHits = ((window.CLAUDE_WIKI && window.CLAUDE_WIKI.pages) || []).filter(p => searchHit(q, p.name+p.title+p.body));
  if (wikiHits.length) html += '<div class="srch-grp">Second Brain · ' + wikiHits.length + '</div>' + wikiHits.map(p => srchRow("openWiki('" + escAttr(p.name) + "')", "🧠 " + escH(p.title||p.name), searchSnippet(q,p.body))).join("");
  const _cth = (window.CLAUDE_COMMENTS && window.CLAUDE_COMMENTS.threads) || {};
  const tk = ((window.CLAUDE_TICKETS && window.CLAUDE_TICKETS.items) || []).filter(t => searchHit(q, t.key+t.summary+(t.note||"")+(t.status||"")+" "+((_cth[t.key]||[]).map(c=>c.t).join(" "))));
  if (tk.length) html += '<div class="srch-grp">Tickets · ' + tk.length + '</div>' + tk.map(t => srchRow("go('tickets')", "🎫 " + escH(t.key) + " — " + escH(t.summary), escH(t.status))).join("");
  const tc = ((window.CLAUDE_TCODES && window.CLAUDE_TCODES.items) || []).filter(t => searchHit(q, (t.code||"")+" "+(t.title||"")+" "+(t.module||"")+" "+(t.note||"")));
  if (tc.length) html += '<div class="srch-grp">T-Codes · ' + tc.length + '</div>' + tc.slice(0,50).map(t => srchRow("go('tcode')", "⌗ " + escH(t.code) + " — " + escH(t.title||""), escH(t.module||""))).join("");
  const ib = ((window.CLAUDE_INBOX && window.CLAUDE_INBOX.items) || []).filter(it => searchHit(q, (it.title||"")+(it.note||"")+(it.code||"")));
  if (ib.length) html += '<div class="srch-grp">From Claude (inbox) · ' + ib.length + '</div>' + ib.map(it => srchRow("go('inbox')", "📥 " + escH(it.title||""), searchSnippet(q,(it.note||"")+" "+(it.code||"")))).join("");
  const refs = ((window.CLAUDE_REFS && window.CLAUDE_REFS.items) || []).filter(r => searchHit(q,(r.name||"")+(r.desc||"")+(r.code||""))).concat((DB.refs||[]).filter(r => searchHit(q,(r.name||"")+(r.desc||"")+(r.code||""))));
  if (refs.length) html += '<div class="srch-grp">References · ' + refs.length + '</div>' + refs.map(r => srchRow("go('ref')", escH((r.type||"") + " " + (r.name||"")), searchSnippet(q,r.desc||""))).join("");
  const sn = (DB.snips||[]).filter(s => searchHit(q,(s.name||"")+(s.note||"")+(s.code||"")));
  if (sn.length) html += '<div class="srch-grp">Snippets · ' + sn.length + '</div>' + sn.map(s => srchRow("go('snip')", "❖ " + escH(s.name||""), searchSnippet(q,(s.note||"")+" "+(s.code||"")))).join("");
  out.innerHTML = html || '<div class="empty"><div class="big">🔍</div>No matches.</div>';
}

/* ---------- code rain (recoloured Matrix, offline, CSS-animated) ---------- */
function buildRain(){
  const host = document.querySelector(".rain"); if (!host) return;
  const glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓ0123456789".split("");
  const cols = 14; let html = "";
  for (let c = 0; c < cols; c++){
    const left = (c / cols) * 100 + Math.random() * 3;
    const dur  = 15 + Math.random() * 13;
    const delay= -Math.random() * dur;
    const op   = (0.07 + Math.random() * 0.11).toFixed(2);
    const size = 12 + Math.floor(Math.random() * 4);
    const len  = 26 + Math.floor(Math.random() * 14);
    let s = "";
    for (let i = 0; i < len; i++){
      const g = glyphs[Math.floor(Math.random() * glyphs.length)];
      s += (Math.random() < 0.18 ? "<b>" + g + "</b>" : g) + "\n";
    }
    html += '<div class="col" style="left:' + left.toFixed(2) + '%;opacity:' + op +
            ';font-size:' + size + 'px;animation-duration:' + dur.toFixed(1) +
            's;animation-delay:' + delay.toFixed(1) + 's">' + s + s + '</div>';
  }
  host.innerHTML = html;
}
buildRain();
renderSnips(); renderRefs(); renderCheat(); renderStats(); renderInbox(); wikiInit(); renderTickets(); tcodeInit(); renderRecent(); renderSearch();

/* ---------- open on the view named in the URL hash (works on file:// and on a sub-path) ---------- */
/*   #wiki, #search ... open a view; #search?q=S_SERVICE pre-fills the search; #wiki?page=BRW-112 opens a page */
(function(){
  const raw = decodeURIComponent((location.hash || "").slice(1));
  const v = raw.split("?")[0];
  if (!v || !document.getElementById("view-" + v)) return;
  const arg = new URLSearchParams(raw.split("?")[1] || "");
  go(v);
  if (v === "search" && arg.get("q")){ document.getElementById("globalSearch").value = arg.get("q"); renderSearch(); }
  if (v === "wiki") setTimeout(() => { wikiShown(); if (arg.get("page")) setTimeout(() => openWiki(arg.get("page")), 900); }, 40);
})();
