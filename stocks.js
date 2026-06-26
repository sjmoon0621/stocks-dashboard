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

const SECTORS = ["우주항공", "하드웨어", "소프트웨어", "반도체", "ETF", "전기차", "커뮤니케이션", "유통"];

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
    marketCap: 2620.0,
    price: 352.83,
    score: 7.4,
    asOf: "2026-06-26",
    file: "msft_deck.html",
    theme: "azure",
    tagline: "Azure·Copilot·Office가 묶인 기업 AI의 기본값",
    flags: ["Nasdaq 100 Top 20"]
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
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "반도체",
    marketCap: 4740.0,
    price: 195.74,
    score: 8.0,
    asOf: "2026-06-26",
    file: "nvda_deck.html",
    theme: "fiber",
    tagline: "AI 가속기의 표준 플랫폼 — 데이터센터 수요와 CUDA 해자가 동시에 작동",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    sector: "소프트웨어",
    marketCap: 4190.0,
    price: 343.71,
    score: 7.6,
    asOf: "2026-06-26",
    file: "googl_deck.html",
    theme: "azure",
    tagline: "검색·유튜브·클라우드·TPU를 묶은 AI 복합체",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "하드웨어",
    marketCap: 4040.0,
    price: 275.15,
    score: 6.5,
    asOf: "2026-06-26",
    file: "aapl_deck.html",
    theme: "steel",
    tagline: "프리미엄 디바이스와 서비스 락인의 현금창출 머신",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    sector: "소프트웨어",
    marketCap: 2440.0,
    price: 227.01,
    score: 7.2,
    asOf: "2026-06-26",
    file: "amzn_deck.html",
    theme: "azure",
    tagline: "AWS·광고·물류 효율화가 동시에 이익률을 밀어 올리는 플랫폼",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "AVGO",
    name: "Broadcom Inc.",
    sector: "반도체",
    marketCap: 1800.0,
    price: 378.91,
    score: 7.6,
    asOf: "2026-06-26",
    file: "avgo_deck.html",
    theme: "fiber",
    tagline: "AI 네트워킹·커스텀 ASIC·VMware 현금흐름의 조합",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sector: "전기차",
    marketCap: 1410.0,
    price: 375.12,
    score: 4.8,
    asOf: "2026-06-26",
    file: "tsla_deck.html",
    theme: "steel",
    tagline: "전기차보다 자율주행·로봇 기대가 더 비싸게 반영된 종목",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    sector: "커뮤니케이션",
    marketCap: 1380.0,
    price: 542.87,
    score: 7.5,
    asOf: "2026-06-26",
    file: "meta_deck.html",
    theme: "azure",
    tagline: "AI 추천·광고 효율·Llama 생태계가 수익성을 재가속",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "MU",
    name: "Micron Technology, Inc.",
    sector: "반도체",
    marketCap: 1370.0,
    price: 1213.56,
    score: 6.7,
    asOf: "2026-06-26",
    file: "mu_deck.html",
    theme: "memory",
    tagline: "HBM과 DRAM 업사이클이 만든 초고속 재평가",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "WMT",
    name: "Walmart Inc.",
    sector: "유통",
    marketCap: 921.39,
    price: 115.78,
    score: 5.9,
    asOf: "2026-06-26",
    file: "wmt_deck.html",
    theme: "gold",
    tagline: "방어적 소비와 광고·멤버십 옵션을 가진 초대형 리테일러",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices, Inc.",
    sector: "반도체",
    marketCap: 868.41,
    price: 532.57,
    score: 6.6,
    asOf: "2026-06-26",
    file: "amd_deck.html",
    theme: "fiber",
    tagline: "GPU 추격자이자 EPYC 서버 CPU의 점유율 확장 스토리",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "ASML",
    name: "ASML Holding N.V.",
    sector: "반도체",
    marketCap: 698.29,
    price: 1841.18,
    score: 5.8,
    asOf: "2026-06-26",
    file: "asml_deck.html",
    theme: "fiber",
    tagline: "EUV 독점력은 강하지만 중국·WFE 사이클 리스크가 따라붙는 장비 최상단",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "INTC",
    name: "Intel Corporation",
    sector: "반도체",
    marketCap: 667.8,
    price: 132.87,
    score: 4.2,
    asOf: "2026-06-26",
    file: "intc_deck.html",
    theme: "memory",
    tagline: "파운드리 턴어라운드 기대가 실적보다 먼저 오른 고위험 재건축",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "AMAT",
    name: "Applied Materials, Inc.",
    sector: "반도체",
    marketCap: 530.36,
    price: 668.0,
    score: 5.7,
    asOf: "2026-06-26",
    file: "amat_deck.html",
    theme: "fiber",
    tagline: "전공정 장비의 넓은 포트폴리오 — AI capex의 후방 수혜",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "LRCX",
    name: "Lam Research Corporation",
    sector: "반도체",
    marketCap: 502.5,
    price: 401.82,
    score: 5.4,
    asOf: "2026-06-26",
    file: "lrcx_deck.html",
    theme: "fiber",
    tagline: "메모리와 선단 공정 투자에 민감한 식각·증착 장비 강자",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "CSCO",
    name: "Cisco Systems, Inc.",
    sector: "하드웨어",
    marketCap: 468.91,
    price: 118.97,
    score: 6.2,
    asOf: "2026-06-26",
    file: "csco_deck.html",
    theme: "steel",
    tagline: "네트워크 장비에서 보안·관측성·AI 이더넷으로 재평가를 노리는 배당 성장주",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "COST",
    name: "Costco Wholesale Corporation",
    sector: "유통",
    marketCap: 417.9,
    price: 942.24,
    score: 6.4,
    asOf: "2026-06-26",
    file: "cost_deck.html",
    theme: "gold",
    tagline: "멤버십 락인과 고회전 식품 트래픽의 프리미엄 방어주",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "ARM",
    name: "Arm Holdings plc",
    sector: "반도체",
    marketCap: 371.38,
    price: 347.71,
    score: 5.0,
    asOf: "2026-06-26",
    file: "arm_deck.html",
    theme: "fiber",
    tagline: "AI 엣지의 설계 로열티 옵션 — 가격은 이미 먼 미래를 본다",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "KLAC",
    name: "KLA Corporation",
    sector: "반도체",
    marketCap: 338.06,
    price: 258.8,
    score: 4.9,
    asOf: "2026-06-26",
    file: "klac_deck.html",
    theme: "fiber",
    tagline: "수율 관리의 필수 장비지만 급등 후 안전마진은 얇아진 상태",
    flags: ["Nasdaq 100 Top 20"]
  },
  {
    ticker: "NFLX",
    name: "Netflix, Inc.",
    sector: "커뮤니케이션",
    marketCap: 298.55,
    price: 70.9,
    score: 6.1,
    asOf: "2026-06-26",
    file: "nflx_deck.html",
    theme: "gold",
    tagline: "글로벌 스트리밍 1위의 광고·라이브·게임 확장 실험",
    flags: ["Nasdaq 100 Top 20"]
  }

];

/* marketCap 표기 헬퍼: 십억달러($B) → 사람이 읽는 문자열 */
function fmtMarketCap(b) {
  if (b == null || isNaN(b)) return "—";
  if (b >= 1000) return "$" + (b / 1000).toFixed(2).replace(/\.?0+$/, "") + "조";
  return "$" + b.toFixed(0) + "B";
}
