#!/usr/bin/env node
/* build_scores.js — metrics.json + overlays.json → 점수 계산 → 비교 리포트
 * 사용: node build_scores.js
 * 1단계에선 stocks.js를 덮어쓰지 않고 '비교표'만 출력한다(검증 후 확장).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { computeScore } = require('./score.js');

const dir = __dirname;
const metrics = JSON.parse(fs.readFileSync(path.join(dir, 'data/metrics.json'), 'utf8'));
const overlays = JSON.parse(fs.readFileSync(path.join(dir, 'data/overlays.json'), 'utf8'));

// stocks.js에서 기존 하드코딩 score 추출 (ticker → score)
const stocksSrc = fs.readFileSync(path.join(dir, 'stocks.js'), 'utf8');
const oldScore = {};
const re = /ticker:\s*"([^"]+)"[\s\S]*?score:\s*([0-9.]+)/g;
let mm;
while ((mm = re.exec(stocksSrc)) !== null) oldScore[mm[1]] = parseFloat(mm[2]);

const rows = [];
for (const ticker of Object.keys(metrics)) {
  if (ticker.startsWith('_')) continue;
  const m = Object.assign({ sector: metrics[ticker].sector }, metrics[ticker]);
  const r = computeScore(m, overlays[ticker]);
  rows.push({ ticker, old: oldScore[ticker], r, conf: m.confidence });
}
rows.sort((a, b) => b.r.total - a.r.total);

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
console.log('\n  종목별 점수 비교 (새 엔진 v0.1)  — 정렬: 새 점수 내림차순\n');
console.log('  ' + pad('TKR', 6) + padL('old', 5) + padL('new', 6) + padL('Δ', 7) +
  '   ' + pad('성장', 5) + pad('수익', 5) + pad('밸류', 5) + pad('컨센', 5) + pad('촉매', 5) +
  pad('리스크', 7) + pad('과열', 6) + ' conf');
console.log('  ' + '-'.repeat(86));
for (const x of rows) {
  const c = x.r.components, p = x.r.penalties;
  const d = x.old != null ? (x.r.total - x.old).toFixed(1) : '  -';
  const dStr = (x.old != null && x.r.total - x.old >= 0 ? '+' : '') + d;
  console.log('  ' + pad(x.ticker, 6) + padL(x.old != null ? x.old.toFixed(1) : '-', 5) +
    padL(x.r.total.toFixed(1), 6) + padL(dStr, 7) + '   ' +
    pad(c.growth, 5) + pad(c.profitability, 5) + pad(c.valuation, 5) +
    pad(c.consensus, 5) + pad(c.catalyst, 5) +
    pad(p.risk ? '-' + p.risk : '0', 7) + pad(p.overheat ? '-' + p.overheat : '0', 6) +
    ' ' + (x.conf || ''));
}
console.log('\n  가중치:', JSON.stringify(require('./score.js').CONFIG.weights), '\n');
