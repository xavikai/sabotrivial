// Valida js/news.js: format, 4 opcions diferents, sense duplicats. Ús: node test/check-news.js
const NEWS = require('../js/news.js');
let bad = 0, n = 0; const seen = new Set();
for (const m of Object.keys(NEWS)) {
  if (!/^\d{4}-\d{2}$/.test(m)) { console.log('Clau de mes incorrecta:', m); bad++; }
  for (const lvl of [1, 2, 3]) {
    const lines = String(NEWS[m][lvl] || '').split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 4) { console.log(`${m} nivell ${lvl}: calen 4 preguntes o més`); bad++; }
    for (const l of lines) {
      n++;
      const p = l.split('|').map(s => s.trim());
      if (p.length !== 5 || p.some(x => !x) || new Set(p.slice(1)).size !== 4) { console.log('Línia incorrecta:', l); bad++; }
      if (seen.has(p[0])) { console.log('Pregunta repetida:', p[0]); bad++; }
      seen.add(p[0]);
    }
  }
}
require('../js/engine.js');
console.log(bad ? `ERRORS: ${bad}` : `OK: ${n} preguntes d'actualitat`);
process.exit(bad ? 1 : 0);
