/* Regenerates data/wiki.js from wiki/ (all .md files). Zero dependencies: node build-wiki.js
   Page = { name, title, type, folder, updated, body }.
   - name   = filename without .md
   - folder = immediate subfolder under wiki/, or "root" for top-level files
   - type   = "meta" for root files, else frontmatter `type`
   - title  = first "# H1" line in the body
   - updated= frontmatter `updated` (or "")
   - body   = full raw file content
   Order: CLAUDE, index, log, then concepts/objects/tickets, each name-sorted. */
const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, 'wiki');
const GENERATED_AT = new Date().toISOString().slice(0, 10);

function fm(body) {
  const out = {};
  if (body.startsWith('---')) {
    const end = body.indexOf('\n---', 3);
    if (end !== -1) {
      body.slice(3, end).split('\n').forEach(line => {
        const m = line.match(/^(\w+):\s*(.*)$/);
        if (m) out[m[1]] = m[2].trim();
      });
    }
  }
  return out;
}
function h1(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}
function read(folder, file) {
  const full = folder === 'root' ? path.join(WIKI, file) : path.join(WIKI, folder, file);
  const body = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '');
  const f = fm(body);
  return {
    name: file.replace(/\.md$/, ''),
    title: h1(body),
    type: folder === 'root' ? 'meta' : (f.type || ''),
    folder,
    updated: f.updated || '',
    body,
  };
}

const pages = [];
// root files in their canonical order
['CLAUDE.md', 'index.md', 'log.md'].forEach(f => {
  if (fs.existsSync(path.join(WIKI, f))) pages.push(read('root', f));
});
// subfolders, name-sorted within each
['concepts', 'objects', 'tickets'].forEach(sub => {
  const dir = path.join(WIKI, sub);
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()
    .forEach(f => pages.push(read(sub, f)));
});

let out = '/* AUTO-GENERATED from the wiki/ folder by build-wiki.js - do not hand-edit. */\n';
out += `window.CLAUDE_WIKI = { generatedAt: ${JSON.stringify(GENERATED_AT)}, pages: [\n`;
out += pages.map(p => '  ' + JSON.stringify(p)).join(',\n');
out += '\n] };\n';

fs.writeFileSync(path.join(__dirname, 'data', 'wiki.js'), out);
console.log(`Wrote data/wiki.js: ${pages.length} pages.`);
