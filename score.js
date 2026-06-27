/* =============================================================================
 * score.js — 투자 매력도 점수 엔진 (v0.1)
 * -----------------------------------------------------------------------------
 * 핵심 철학: "정답 점수"가 아니라 "고쳐가며 발전시키는 투명한 점수".
 *   - 입력(원재료)은 data/metrics.json + data/overlays.json 에 둔다.
 *   - 이 파일은 그 입력을 받아 점수를 '계산'만 한다 (데이터 보관 안 함).
 *   - 점수를 바꾸고 싶으면 아래 CONFIG 하나만 손대면 된다.
 *
 * 종합점수 = 가중합(성장성·수익성·밸류·컨센서스·촉매) − 리스크감점 − 과열감점
 *   각 컴포넌트는 0~10으로 정규화 → 가중 평균 → 페널티 차감 → 0~10 clamp.
 *   밸류는 '섹터 상대'로 평가한다(고성장 SW와 저PER 산업재를 같은 잣대로 안 본다).
 *
 * Node(빌드 스크립트)와 브라우저(index.html) 양쪽에서 쓰도록 UMD 형태로 노출.
 * ========================================================================== */
(function (root) {
  'use strict';

  // ---- CONFIG : 여기만 고치면 점수 체계가 바뀐다 -----------------------------
  var CONFIG = {
    // 컴포넌트 가중치 (합 = 1.0). 가점 컴포넌트만.
    // v0.4: 백테스트를 S&P500 전체(353종목)로 확장하니 v0.3(나스닥 79개)와 결과가 뒤집힘 —
    //   넓은 시장에선 valuation IC 0.068(최강) > growth 0.039(약) > profitability −0.018(없음).
    //   v0.3의 성장 0.40은 나스닥 성장주 강세장 과적합이었음. → 밸류 중심으로 전환.
    //   상대비 20/05/40(growth/prof/val) → 패널 IC ≈ 0.071 (밸류중심 최적군).
    weights: {
      growth: 0.20,        // 성장성 (매출 + EPS YoY) — 넓은 시장에선 예측력 약함
      profitability: 0.05, // 수익성 (FCF 마진) — IC≈0, 거의 제거
      valuation: 0.40,     // 밸류에이션 (섹터 상대 PER/PSR) — 넓은 시장 최강 예측력
      consensus: 0.20,     // 애널리스트 컨센서스 + 목표가 여력
      catalyst: 0.15       // 촉매 (overlays.json, 기본 5 중립)
    },

    // 사이클 업종은 매출 정점(고성장)에서 사면 평균회귀로 망함(백테스트: 사이클섹터 >100%성장
    // 구간 이후 12M +10% vs 역성장 구간 +30%). 정점 성장에 페널티(사이클섹터 내부 IC 0.095→0.102).
    cyclicalSectors: ['반도체', '에너지', '소재', '산업재'],
    cyclicalPeakGrowth: 80,   // 이 매출성장률(%) 초과부터 페널티 시작
    cyclicalPeakMax: 150,     // 여기서 페널티 포화
    cyclicalPenaltyMax: 2.0,  // 최대 감점

    // 섹터별 '정상' 멀티플 기준 (이 값보다 싸면 밸류 가점). 없으면 default.
    sectorBaseline: {
      '반도체':     { pe: 28, ps: 7 },
      '소프트웨어': { pe: 35, ps: 9 },
      '하드웨어':   { pe: 18, ps: 3 },
      '커뮤니케이션': { pe: 22, ps: 4 },
      '헬스케어':   { pe: 24, ps: 5 },
      '소비재':     { pe: 25, ps: 3 },
      '필수소비재': { pe: 22, ps: 2.5 },
      '유통':       { pe: 28, ps: 1.2 },
      '산업재':     { pe: 22, ps: 3 },
      '유틸리티':   { pe: 18, ps: 2.5 },
      '에너지':     { pe: 12, ps: 1.8 },
      '소재':       { pe: 18, ps: 3 },
      '금융':       { pe: 14, ps: 4 },
      '부동산':     { pe: 30, ps: 8 },
      '전기차':     { pe: 55, ps: 7 },
      '기타':       { pe: 20, ps: 3 }
    },
    defaultBaseline: { pe: 22, ps: 4 },

    base: 5.0,            // 정보 부족 시 컴포넌트 기본값(중립)
    clampMin: 0,
    clampMax: 10
  };

  // ---- 유틸 -------------------------------------------------------------------
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  // 포화(saturating) 척도: floor + span*(1-e^(-v/scale)). 상단이 완만히 차서
  // 큰 값들도 서로 구분된다(예: 매출 +35%와 +65%가 둘 다 10이 되지 않음).
  // 음수는 자연히 floor 아래로 내려가 감점된다.
  function sat(v, floor, span, scale) {
    return clamp(floor + span * (1 - Math.exp(-v / scale)), 0, 10);
  }

  // ---- 컴포넌트 산식 (각각 0~10) ----------------------------------------------

  // 성장성: 매출 YoY 가중 0.6 + EPS YoY 가중 0.4. EPS는 변동성 커서 더 완만하게.
  function scoreGrowth(m) {
    if (!isNum(m.revenueGrowthYoY) && !isNum(m.epsGrowthYoY)) return CONFIG.base;
    var rev = isNum(m.revenueGrowthYoY) ? sat(m.revenueGrowthYoY, 4, 7, 40) : CONFIG.base;
    var eps = isNum(m.epsGrowthYoY)     ? sat(m.epsGrowthYoY, 4, 6, 45) : CONFIG.base;
    return 0.6 * rev + 0.4 * eps;
  }

  // 수익성: FCF 마진(%). 0%→3, 15%→7.5, 25%→9, 55%→10, 적자→3 미만.
  function scoreProfitability(m) {
    if (!isNum(m.fcfMargin)) return CONFIG.base;
    return sat(m.fcfMargin, 3, 8, 18);
  }

  // 밸류: 섹터 기준 대비 PER/PSR. 기준과 같으면 5, 절반이면 10, 2배면 2.5.
  // 적자(PER<=0)면 PER 무시하고 PSR만. 둘 다 없으면 중립.
  // valuationValid:false(예: MSTR 비트코인 트레저리)면 일반 밸류 지표가 무의미하므로
  //   중립(base) 처리하고 overlay의 촉매/리스크에 판단을 맡긴다.
  function scoreValuation(m) {
    if (m.valuationValid === false) return CONFIG.base;
    var b = CONFIG.sectorBaseline[m.sector] || CONFIG.defaultBaseline;
    var parts = [];
    if (isNum(m.peRatio) && m.peRatio > 0) parts.push(clamp(5 * (b.pe / m.peRatio), 0, 10));
    if (isNum(m.psRatio) && m.psRatio > 0) parts.push(clamp(5 * (b.ps / m.psRatio), 0, 10));
    if (!parts.length) return CONFIG.base;
    // 적자라 PER이 빠졌으면 살짝 디스카운트(불확실성)
    var v = parts.reduce(function (a, c) { return a + c; }, 0) / parts.length;
    if (!(isNum(m.peRatio) && m.peRatio > 0)) v -= 1;
    return clamp(v, 0, 10);
  }

  // 컨센서스: 등급 기준점 + 목표가 여력(%) 반영.
  function scoreConsensus(m) {
    var ratingMap = {
      'Strong Buy': 9, 'Buy': 7, 'Moderate Buy': 7, 'Outperform': 7,
      'Hold': 5, 'Neutral': 5, 'Underperform': 3, 'Sell': 2, 'Strong Sell': 1
    };
    var hasRating = m.consensus && ratingMap[m.consensus] != null;
    var hasUpside = isNum(m.targetUpside);
    if (!hasRating && !hasUpside) return CONFIG.base;
    var base = hasRating ? ratingMap[m.consensus] : CONFIG.base;
    var adj = hasUpside ? clamp(m.targetUpside * 0.08, -2, 2) : 0;
    return clamp(base + adj, 0, 10);
  }

  // 과열 감점: YTD 과상승 시. >100%→-1.5, >60%→-0.8, >40%→-0.4.
  function overheatPenalty(m) {
    if (!isNum(m.ytd)) return 0;
    if (m.ytd > 100) return 1.5;
    if (m.ytd > 60) return 0.8;
    if (m.ytd > 40) return 0.4;
    return 0;
  }

  // 사이클 정점 감점: 사이클 업종이 매출 폭증(정점) 중이면 평균회귀 위험. 백테스트 검증.
  function cyclicalPenalty(m) {
    if (!isNum(m.revenueGrowthYoY)) return 0;
    if (CONFIG.cyclicalSectors.indexOf(m.sector) < 0) return 0;
    if (m.revenueGrowthYoY <= CONFIG.cyclicalPeakGrowth) return 0;
    var frac = (m.revenueGrowthYoY - CONFIG.cyclicalPeakGrowth) /
               (CONFIG.cyclicalPeakMax - CONFIG.cyclicalPeakGrowth);
    return clamp(frac, 0, 1) * CONFIG.cyclicalPenaltyMax;
  }

  // ---- 메인 -------------------------------------------------------------------
  // metrics: 한 종목의 입력값. overlay: { catalyst:0~10, riskPenalty:0~2, note }
  function computeScore(metrics, overlay) {
    overlay = overlay || {};
    var w = CONFIG.weights;

    var c = {
      growth: scoreGrowth(metrics),
      profitability: scoreProfitability(metrics),
      valuation: scoreValuation(metrics),
      consensus: scoreConsensus(metrics),
      catalyst: isNum(overlay.catalyst) ? overlay.catalyst : CONFIG.base
    };

    var weighted =
      c.growth * w.growth +
      c.profitability * w.profitability +
      c.valuation * w.valuation +
      c.consensus * w.consensus +
      c.catalyst * w.catalyst;

    var riskPen = isNum(overlay.riskPenalty) ? clamp(overlay.riskPenalty, 0, 3) : 0;
    var heatPen = overheatPenalty(metrics);
    var cycPen = cyclicalPenalty(metrics);

    var total = clamp(weighted - riskPen - heatPen - cycPen, CONFIG.clampMin, CONFIG.clampMax);

    return {
      total: Math.round(total * 10) / 10,
      components: {
        growth: round1(c.growth),
        profitability: round1(c.profitability),
        valuation: round1(c.valuation),
        consensus: round1(c.consensus),
        catalyst: round1(c.catalyst)
      },
      penalties: { risk: round1(riskPen), overheat: round1(heatPen), cyclical: round1(cycPen) },
      note: overlay.note || ''
    };
  }

  function round1(x) { return Math.round(x * 10) / 10; }

  var api = { computeScore: computeScore, CONFIG: CONFIG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ScoreEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
