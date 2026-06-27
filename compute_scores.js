#!/usr/bin/env node
/* compute_scores.js — 각 deck의 deck-data 블록을 모아 score.js로 실제 점수 계산.
 * 안전하게 data/scores.json 으로만 출력(스ocks.js 직접 수정 안 함).
 * 사용: node compute_scores.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { computeScore } = require('./score.js');

const dir = __dirname;
const overlays = JSON.parse(fs.readFileSync(path.join(dir, 'data/overlays.json'), 'utf8'));

const files = fs.readdirSync(dir).filter(f => f.endsWith('_deck.html'));
const scores = {};
let noData = [];
let sanitized = [];
const RE = /id="deck-data"[^>]*>([\s\S]*?)<\/script>/;

// 물리적으로 불가능한 deck-data 값은 null로(점수엔진이 중립 처리). 한 칸의 오류가
// 점수를 오염시키지 않게 방어. (근본 수정은 codex 큐 — flags 출력 참조)
const BOUNDS = {
  fcfMargin: [-60, 60], epsGrowthYoY: [-400, 400],
  revenueGrowthYoY: [-100, 150], peRatio: [-1e9, 2000], psRatio: [0, 200]
};
function sanitize(d) {
  const hit = [];
  for (const k in BOUNDS) {
    const v = d[k], [lo, hi] = BOUNDS[k];
    if (typeof v === 'number' && (v < lo || v > hi)) { d[k] = null; hit.push(k); }
  }
  if (hit.length) sanitized.push(`${d.ticker}:${hit.join(',')}`);
  return d;
}

for (const f of files) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = html.match(RE);
  if (!m) { noData.push(f.replace('_deck.html', '').toUpperCase()); continue; }
  let d;
  try { d = JSON.parse(m[1]); } catch (e) { noData.push(f + '(JSON err)'); continue; }
  d = sanitize(d);
  const tkr = (d.ticker || f.replace('_deck.html', '')).toUpperCase();
  const r = computeScore(d, overlays[tkr]);
  scores[tkr] = {
    total: r.total, components: r.components, penalties: r.penalties,
    confidence: d.confidence || null
  };
}

fs.writeFileSync(path.join(dir, 'data/scores.json'),
  JSON.stringify({ asOf: new Date().toISOString().slice(0, 10), scores }, null, 0));

// ---- 요약 리포트 ----
const arr = Object.entries(scores).map(([t, s]) => ({ t, ...s }));
arr.sort((a, b) => b.total - a.total);
const vals = arr.map(a => a.total);
const mean = (vals.reduce((x, y) => x + y, 0) / vals.length).toFixed(2);
console.log(`\n점수 계산: ${arr.length}종목 (deck-data 없음 ${noData.length}, 불가능값 정화 ${sanitized.length})`);
console.log(`평균 ${mean} | 최고 ${vals[0]} | 최저 ${vals[vals.length - 1]}`);
const show = a => `${a.t.padEnd(6)} ${a.total.toFixed(1).padStart(4)}  [성장 ${a.components.growth} 수익 ${a.components.profitability} 밸류 ${a.components.valuation} 컨센 ${a.components.consensus}]`;
console.log('\n── 상위 12 ──'); arr.slice(0, 12).forEach(a => console.log('  ' + show(a)));
console.log('\n── 하위 12 ──'); arr.slice(-12).forEach(a => console.log('  ' + show(a)));
console.log(`\nscores.json 저장 완료 (${arr.length}종목).`);
