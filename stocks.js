/* ============================================================
   stocks.js  —  종목 데이터 (이 파일만 수정하면 메인에 자동 반영)
   ------------------------------------------------------------
   ▷ 새 종목 추가 방법:
     1) {ticker}_deck.html 파일을 같은 폴더에 생성
     2) 아래 STOCKS 배열 맨 끝에 객체 하나를 추가 (쉼표 주의)
   ▷ 필드 설명:
     ticker     : 티커 (대문자)            예: "NVDA"
     name       : 회사/상품 풀네임          예: "NVIDIA Corporation"
     sector     : 섹터 (아래 SECTORS 중)    예: "반도체"
     marketCap  : 시가총액 (숫자, 단위 = 십억달러 $B)  예: 2650  → $2.65조
     price      : 현재가 (숫자, USD)         예: 276.70
     score      : 투자 매력도 (0~10, 소수 가능)        예: 5.5
     asOf       : 분석 기준일 "YYYY-MM-DD"
     file       : deck 파일명               예: "nvda_deck.html"
     theme      : 카드 액센트 색 (아래 THEMES 키)  예: "fiber"
     tagline    : 한 줄 요약 (카드에 표시)
     flags      : 배지 배열(선택) 예: ["트럼프 픽","엔비디아 픽","레버리지"]
   ※ marketCap 단위는 "십억 달러($B)"로 통일. 예) 1조7500억달러 → 1750
   ============================================================ */

const SECTORS = ["우주항공", "하드웨어", "소프트웨어", "반도체", "ETF"];

const THEMES = {
  rocket: { primary: "#ff5a3c", secondary: "#3ce0ff" },
  steel:  { primary: "#4aa8ff", secondary: "#7cc4ff" },
  azure:  { primary: "#3a8dde", secondary: "#2fd4c4" },
  fiber:  { primary: "#00d9c0", secondary: "#7b6cff" },
  memory: { primary: "#7c5cff", secondary: "#2fd4c4" },
  gold:   { primary: "#e3b24a", secondary: "#ffd277" }
};

const STOCKS = [
  {
    ticker: "SPCX",
    name: "Space Exploration Technologies (SpaceX)",
    sector: "우주항공",
    marketCap: 2550,        // ~$2.55조 = 2550B
    price: 165.78,
    score: 4,
    asOf: "2026-06-24",
    file: "spcx_deck.html",
    theme: "rocket",
    tagline: "사상 최대 IPO 직후 — 사업보다 수급 캘린더가 지배하는 상장 초기 종목",
    flags: ["상장 직후", "오너 리스크"]
  },
  {
    ticker: "DELL",
    name: "Dell Technologies",
    sector: "하드웨어",
    marketCap: 265,         // ~$2,650억 = 265B
    price: 422.86,
    score: 6.5,
    asOf: "2026-06-23",
    file: "dell_deck.html",
    theme: "steel",
    tagline: "AI 데이터센터의 척추 — 실적 폭발 + 트럼프 픽이 겹친 종목",
    flags: ["트럼프 픽"]
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "소프트웨어",
    marketCap: 2700,        // ~$2.7조 = 2700B
    price: 365.43,
    score: 7,
    asOf: "2026-06-24",
    file: "msft_deck.html",
    theme: "azure",
    tagline: "검증된 거인의 역행 — $190B capex ROI를 시장이 의심하는 국면",
    flags: ["포트폴리오 보유"]
  },
  {
    ticker: "MRVL",
    name: "Marvell Technology",
    sector: "반도체",
    marketCap: 245,         // ~$2,450억 = 245B
    price: 276.70,
    score: 5.5,
    asOf: "2026-06-24",
    file: "mrvl_deck.html",
    theme: "fiber",
    tagline: "모멘텀 끝판왕 + 밸류 끝판왕 — 트럼프·엔비디아 이중 픽, P/E 91배",
    flags: ["트럼프 픽", "엔비디아 픽"]
  },
  {
    ticker: "DRAM",
    name: "Roundhill Memory ETF (+ 2X RAM)",
    sector: "ETF",
    marketCap: 17.46,       // ETF는 시총 아닌 운용자산(AUM) ~$174억. 정렬용 근사치
    price: 76.71,
    score: 6,
    asOf: "2026-06-24",
    file: "dram_ram_deck.html",
    theme: "memory",
    tagline: "AI 메모리 슈퍼사이클 — 역대 최고속 ETF, 한국 메모리 집중 + 2배 레버리지 RAM",
    flags: ["ETF", "레버리지", "환율노출"]
  }
];

/* marketCap 표기 헬퍼: 십억달러($B) → 사람이 읽는 문자열 */
function fmtMarketCap(b) {
  if (b == null || isNaN(b)) return "—";
  if (b >= 1000) return "$" + (b / 1000).toFixed(2).replace(/\.?0+$/, "") + "조";
  return "$" + b.toFixed(0) + "B";
}
