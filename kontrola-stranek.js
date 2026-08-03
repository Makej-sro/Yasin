#!/usr/bin/env node
/*
 * Kontrola konzistence stránek  —  spusť PŘED každým pushnutím:
 *
 *     node kontrola-stranek.js
 *
 * Proč to existuje: společné části (přihlašovací okno, bublina, souhlas, menu) jsou
 * zkopírované na každé stránce zvlášť. Když se něco změní jen na jedné a na ostatní se
 * zapomene, vznikne nesoulad (přesně tak zmizelo pole přístupového klíče z podstránek).
 * Tenhle skript takový nesoulad odhalí dřív, než se dostane na web.
 *
 * Když chceš přidat další povinný společný prvek → dopiš řádek do REQUIRED níže.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));

let problems = 0;

// ── 1) Marketingové stránky, které sdílejí přihlašování / bublinu / souhlas ──────────
const PAGES = [
  'index.html', 'pruvodce.html', 'pro-zamestnavatele.html',
  'hledam-si-praci.html', 'o-nas.html', 'podpora.html', 'recenze.html',
];

// Prvky, které MUSÍ být na každé z těch stránek  [hledaný text, lidský popis]
const REQUIRED = [
  ['id="login-key"',       'Pole přístupového klíče (zámek přihlášení)'],
  ['id="login-error"',     'Místo pro hlášku u přihlášení'],
  ['id="login-submit"',    'Tlačítko „Přihlásit se"'],
  ['id="register-submit"', 'Tlačítko „Vytvořit účet"'],
  ['id="reg-marketing"',   'Marketingový souhlas (zaškrtávátko)'],
  ['class="wl-fab"',       'Bublina „Startujeme"'],
];

console.log('\n=== 1) Marketingové stránky (společné prvky) ===\n');
for (const page of PAGES) {
  if (!exists(page)) { console.log(`❌ ${page} — soubor chybí!`); problems++; continue; }
  const html = read(page);
  const missing = REQUIRED.filter(([m]) => !html.includes(m)).map(([, label]) => label);
  if (missing.length === 0) console.log(`✅ ${page}`);
  else { console.log(`❌ ${page} — CHYBÍ: ${missing.join(', ')}`); problems += missing.length; }
}

// ── 2) Verze script.js (cache-buster) musí být všude stejná ───────────────────────────
console.log('\n=== 2) Verze script.js (musí být všude stejná) ===\n');
const versions = {};
for (const page of PAGES) {
  if (!exists(page)) continue;
  const m = read(page).match(/script\.js\?v=(\d+)/);
  versions[page] = m ? m[1] : 'CHYBÍ';
}
const uniq = [...new Set(Object.values(versions))];
if (uniq.length === 1 && uniq[0] !== 'CHYBÍ') {
  console.log(`✅ Všechny stránky mají script.js?v=${uniq[0]}`);
} else {
  console.log('❌ Verze se NESHODUJÍ — bumpni všude na stejné číslo:');
  for (const [p, v] of Object.entries(versions)) console.log(`     ${p} → v=${v}`);
  problems++;
}

// ── 3) Brána /worker/ (rozhraní brigádníka) — zámek rozhraní ──────────────────────────
console.log('\n=== 3) Brána /worker/ (rozhraní brigádníka) ===\n');
const WORKER_REQ = [
  ['const ACCESS_KEY',     'Přístupový klíč (konstanta)'],
  ['function accessKeyOk', 'Kontrola klíče'],
  ['function markGateOk',  'Zapamatování ověřené brány'],
  ['id="login-key"',       'Pole klíče v přihlášení'],
];
// Starý nechráněný vstup, který se sem NESMÍ vrátit (registrace pouštěla rovnou dovnitř):
const NEBEZPECNE = 'if (data.session) { hideGate(); return; }';

function zkontrolujBranu(relPath, popis) {
  if (!exists(relPath)) { console.log(`ℹ️  ${popis} (${relPath}) — nenalezeno, přeskočeno`); return; }
  const html = read(relPath);
  const missing = WORKER_REQ.filter(([m]) => !html.includes(m)).map(([, l]) => l);
  if (html.includes(NEBEZPECNE)) missing.push('registrace pouští rovnou dovnitř bez klíče!');
  if (missing.length === 0) console.log(`✅ ${popis} — zamčeno (${relPath})`);
  else { console.log(`❌ ${popis} — PROBLÉM: ${missing.join(', ')}`); problems += missing.length; }
}

zkontrolujBranu('worker/index.html', 'Web /worker/');
// Mobilní appka je v sousedním repu (../makej-aplikace) — zkontroluje se, jen když je po ruce:
zkontrolujBranu('../makej-aplikace/www/index.html', 'Mobilní appka');

// ── Info: stav přístupového klíče (před spuštěním zamčeno, naostro prázdné) ────────────
console.log('');
try {
  const km = read('script.js').match(/const ACCESS_KEY\s*=\s*'([^']*)'/);
  if (km) {
    if (km[1] === '') console.log('ℹ️  ACCESS_KEY je PRÁZDNÝ → web je OTEVŘENÝ všem (ostrý provoz).');
    else console.log(`ℹ️  ACCESS_KEY = '${km[1]}' → přihlášení zamčené klíčem (nezapomeň před startem na 3 místech vyprázdnit).`);
  }
} catch (e) {}

// ── Verdikt ───────────────────────────────────────────────────────────────────────────
console.log('\n' + (problems === 0
  ? '✅ VŠE V POŘÁDKU — můžeš pushnout.\n'
  : `❌ NALEZENO ${problems} ${problems === 1 ? 'problém' : 'problémů'} — oprav před pushnutím!\n`));
process.exit(problems === 0 ? 0 : 1);
