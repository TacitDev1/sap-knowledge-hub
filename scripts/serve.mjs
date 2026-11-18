#!/usr/bin/env node
// Tiny zero-dependency static server that mimics GitHub Pages for this repo:
// the app is served under /sap-knowledge-hub/, exactly like a project Pages site.
// Run: node scripts/serve.mjs [port]   then open http://localhost:5178/sap-knowledge-hub/
// You do not need it: index.html also works straight from disk (file://).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const BASE = '/sap-knowledge-hub/';
const PORT = Number(process.argv[2] || process.env.PORT || 5178);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8' };

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/' || url === BASE.slice(0, -1)) { res.writeHead(302, { Location: BASE }); return res.end(); }
  if (!url.startsWith(BASE)) { res.writeHead(404); return res.end('Not found (the app lives under ' + BASE + ')'); }
  let file = normalize(join(ROOT, url.slice(BASE.length)));
  if (!file.startsWith(normalize(ROOT + sep)) && file !== normalize(ROOT)) { res.writeHead(403); return res.end(); }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(PORT, () => console.log(`Serving on http://localhost:${PORT}${BASE}`));
