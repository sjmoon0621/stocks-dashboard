# 종목 분석 대시보드

## 사용법
1. 압축을 풀고, 폴더 안의 **index.html을 더블클릭**하면 대시보드가 열립니다.
2. 카드를 클릭하면 해당 종목의 상세 분석 페이지로 이동합니다.
3. 상단에서 섹터 필터 / 정렬(시총·매력도·현재가·분석일·티커) / 검색 / 보기모드(블럭·리스트)를 사용할 수 있습니다.

## 폴더 구조
- index.html          ← 메인 대시보드 (이걸 엽니다)
- stocks.js           ← 종목 데이터 (새 종목은 여기에 추가)
- *_deck.html         ← 각 종목 상세 분석 페이지

## 새 종목 추가 방법 (Codex에게 시킬 때)
1. {ticker}_deck.html 분석 페이지를 같은 폴더에 생성
2. stocks.js의 STOCKS 배열 맨 끝에 항목 1개 추가:

   {
     ticker: "NVDA",
     name: "NVIDIA Corporation",
     sector: "반도체",          // 우주항공/하드웨어/소프트웨어/반도체/ETF 중
     marketCap: 3500,           // 십억달러($B) 단위. 3.5조 → 3500
     price: 1234.56,
     score: 7.5,                // 0~10
     asOf: "2026-06-26",
     file: "nvda_deck.html",
     theme: "fiber",            // rocket/steel/azure/fiber/memory/gold
     tagline: "한 줄 요약",
     flags: ["트럼프 픽"]        // 선택
   }

   ※ 새 섹터가 필요하면 stocks.js 맨 위 SECTORS 배열에도 추가하세요.
