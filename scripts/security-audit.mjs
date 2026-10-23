import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const html=read('index.html'), app=read('assets/app.js'), vendor=read('vendor/cvnss4.min.js');
const data=JSON.parse(read('data/fixtures-100.json'));
const tagScripts=[...html.matchAll(/<script\b[^>]*>/gi)].map(x=>x[0]);
assert.equal(tagScripts.length,2,'Exactly two first-party scripts');
for(const tag of tagScripts) assert.match(tag,/src="\.\/(assets\/app\.js|vendor\/cvnss4\.min\.js)"/);
assert.doesNotMatch(html,/\bon(?:click|input|change|submit|load|error)\s*=/i,'No inline JavaScript handlers');
assert.doesNotMatch(html,/<script\s*>([\s\S]*?)<\/script>/i,'No inline scripts');
assert.match(html,/script-src 'self'/);
assert.match(html,/connect-src 'none'/);
assert.doesNotMatch(html,/https?:\/\/[\w.-]+\/(?:[^"']*\.js)/,'No remote JavaScript');
assert.doesNotMatch(app,/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/,'Demo app should not make network requests');
assert.doesNotMatch(app,/\b(?:eval|Function)\s*\(/,'No dynamic code evaluation');
assert.doesNotMatch(html,/<input\b[^>]*\btype\s*=\s*["']?password/i,'No password fields');
for(const [name,source] of [['app',app],['vendor',vendor]]) {
  assert.doesNotMatch(source,/\b(?:localStorage|sessionStorage|document\.cookie)\b/i,name+' must not read persistent browser secrets');
  assert.doesNotMatch(source,/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/,name+' must not send network requests');
}
assert.equal(data.simulated,true);
assert.equal(data.wallets.length,16);
assert.equal(data.programs.length,4);
assert.equal(data.transactions.length,100);
const blob=Buffer.from(vendor,'utf8');
const sha=createHash('sha1').update('blob '+blob.length+'\0').update(blob).digest('hex');
assert.equal(sha,'87fdb2e5ec4b86b36d180cf88b11ad84ffd52db1','Vendored CVNSS4.0 must match upstream pinned Git blob');
console.log('BilaScan static security checks OK: first-party scripts; no outbound RPC; 100 demo transactions; pinned CVNSS4.0.');
