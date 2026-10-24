#!/usr/bin/env node
/**
 * Cloudflare Pages build: no npm dependencies, network calls or credentials.
 * Whitelist only static files required by the read-only simulation.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const sources = [
  ['index.html','index.html'],
  ['assets/app.js','assets/app.js'],
  ['vendor/cvnss4.min.js','vendor/cvnss4.min.js'],
  ['vendor/CVNSS4-LICENSE.txt','licenses/CVNSS4-LICENSE.txt']
];
rmSync(dist, { recursive:true, force:true });
mkdirSync(dist, { recursive:true });
for (const [from,to] of sources) {
  const input = resolve(root,from), target = resolve(dist,to);
  assert.ok(existsSync(input),'Required file not found: '+from);
  mkdirSync(dirname(target), {recursive:true});
  copyFileSync(input,target);
}
const html=readFileSync(resolve(dist,'index.html'),'utf8');
assert.match(html,/BilaScan/);
assert.match(html,/\.\/assets\/app\.js/);
assert.match(html,/\.\/vendor\/cvnss4\.min\.js/);
assert.doesNotMatch(html,/<script[^>]+src="https?:\/\//);
assert.doesNotMatch(html,/\bonclick=|\bonchange=|\boninput=/);
const headers = [
 '/*',
 "  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; worker-src 'none'; frame-ancestors 'none'",
 '  X-Content-Type-Options: nosniff',
 '  Referrer-Policy: no-referrer',
 '  X-Frame-Options: DENY',
 '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()',
 '  Cache-Control: public, max-age=0, must-revalidate',
 ''
].join('\n');
writeFileSync(resolve(dist,'_headers'),headers,'utf8');
writeFileSync(resolve(dist,'404.html'),'<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Không tìm thấy trang · BilaScan</title><body style="background:#08111e;color:#ecf6ff;font:16px system-ui;padding:5vw"><h1>404 — Không tìm thấy trang</h1><p>BilaScan B1 là mô phỏng blockchain cục bộ, không có dữ liệu giao dịch thật.</p><a style="color:#30e4cb" href="/">Về trang chủ BilaScan</a></body></html>');
writeFileSync(resolve(dist,'robots.txt'),'User-agent: *\nAllow: /\n');
const fixtures = JSON.parse(readFileSync(resolve(root,'data/fixtures-100.json'),'utf8'));
assert.equal(fixtures.transactions.length,100);
assert.equal(fixtures.wallets.length,16);
assert.equal(fixtures.simulated,true);
console.log('BilaScan Cloudflare Pages build OK');
console.log('Static files: '+sources.length+'; 100 transaction fixtures checked, read-only CSP applied');
