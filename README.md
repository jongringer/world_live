# WORLD LIVE // GLOBAL NEWSROOM MONITOR (v2.1)

전 세계 **50여 개 검증 라이브 뉴스 채널**(국내 뉴스 KOREA 그룹 포함)을 16:9 데스크톱 모니터에서 동시에 보는 방송국 주조정실 스타일 멀티뷰.

- 운영 페이지: **https://jongringer.github.io/world_live/**
- 정적 단일 페이지 (HTML/CSS/JS) · GitHub Pages 배포 · 설치·로그인·서버 없음

## 레이아웃 (v2)

| 버튼 | 구성 | 단축키 |
|---|---|---|
| 9분할 | 3×3 — 기본 | `1` |
| 4분할 | 2×2 | `2` |
| 6분할 | 3×2 | `3` |
| 전체 1×1 | 선택 채널 한 화면 | `4` |
| **전체 스크롤 ALL LIVE** | **전 세계 44채널 3열(넓으면 4열) 16:9 그리드, 스크롤로 훑어보기** | `5` / `A` |
| FULL | 브라우저 전체화면 | `F` |

그 밖에 `M` 전체 음소거, `R` 전체 재연결, `S` 소스 관리. 타일 더블클릭 = 그 채널 1×1.

### 전체 스크롤 (ALL LIVE)

- 모든 타일이 16:9 비율로 3열(뷰포트 2100px↑ 4열) 그리드에 나열되어 스크롤로 내려가며 모니터링합니다.
- **IntersectionObserver 지연 마운트**: 뷰포트 근처 타일만 재생하고, 멀어지면 자동 해제(SCROLL TO PLAY) — 44채널을 한 번에 로딩하지 않아 브라우저가 버벅이지 않고, 스크롤하면 즉시 재생됩니다.

## 상단 버튼 (v2.1)

- **🔍 채널 찾기** — 소스 라이브러리 모달을 바로 엽니다(단축키 `S`).
- **↕ 정렬** — 전체 스크롤 화면과 소스 목록 순서를 지역·국가순 / 이름순(A-Z·가나다) / 한국 우선으로 전환·저장.
- **★ 첫 화면** — 시작 레이아웃(9분할/4분할/6분할/전체 스크롤/1×1)을 고정·저장.

## FULL 모드 (브라우저 전체화면)

- `FULL` 버튼(또는 `F`)으로 진입하면 상단 컨트롤 바와 하단 상태 바가 완전히 숨겨져 **화면 전체가 뉴스 그리드로만** 채워집니다.
- 화면 클릭(빈 영역·타일) 또는 상·하단 가장자리 호버 시 상·하단 바가 오버레이로 나타나고, **3.6초 후 자동으로 사라집니다**. 다시 클릭하면 즉시 숨김(`H` 키로도 토글).
- 타일의 ‘채널 변경’·음성·1×1 등 버튼 클릭은 HUD 토글과 충돌하지 않습니다.

## 채널 직접 선택 (v2 핵심)

- **모든 타일 우상단에 항상 보이는 ‘채널 변경 ▾’ 버튼** — 호버를 찾을 필요 없이 클릭 한 번으로 그 칸의 채널을 교체합니다.
- **4분할과 9분할(및 6분할·1×1)의 배치는 각각 독립적으로 저장**됩니다. 4분할에서 고른 4채널과 9분할에서 고른 9채널이 서로 간섭하지 않습니다.
- **첫 화면 설정**: 상단 ‘★ 첫 화면’ 메뉴에서 시작 레이아웃(9분할/4분할/6분할/전체 스크롤/1×1)을 고르면 다음에 페이지를 열 때 그 화면으로 시작합니다. 활성 레이아웃 버튼에 금색 점이 표시됩니다.
- 소스 목록은 지역별(아시아·오세아니아·미주·유럽·중동·아프리카·외부)로 묶여 있고, 같은 채널의 대체 소스(HLS↔YouTube)는 ‘대체’ 태그로 표시됩니다.

## KOREA · 국내 뉴스 (최상단 그룹, 자동재생 검증 완료)

- **KBS NEWS 24** (`zGFBJL_fhUU`) · **YTN 24시간 라이브** (`aZyD6EPl6KU`) · **연합뉴스TV 라이브** (`6QZ_qc75ihU`) — 24시간 고정 라이브, 클릭 없이 즉시 자동재생(2026-11-22 검증).
- 아리랑 TV · TBS 서울 — 공식 HLS 24시간 자동재생.
- MBC · SBS · JTBC · MBN · 채널A · TV조선 — 채널 라이브 자동 추적. 뉴스 편성 시간대(아침 7시·저녁 9시 등)에 자동으로 재생되고 평소에는 OFFLINE 안내를 표시합니다.
- KBS 뉴스 채널(`live_stream`)·YTN·연합 채널 추적 소스도 ‘대체’ 태그로 함께 수록.

## 채널 (50개 수록 · 전부 이 페이지에서 실제 재생 검증)

- **CNN INTERNATIONAL / CNN FAST** — YouTube 재생버튼 문제를 HLS(CloudFront FAST)로 해결. 페이지 열면 클릭 없이 즉시 자동재생.
- **BBC NEWS** — DASH 전용 송출+영국 지역 제한으로 페이지 내 재생 불가. 외부 공식 링크(`https://www.bbc.com/watch-live-news`)로 정확히 연결.
- 아시아: NHK WORLD-JAPAN, CNA, CGTN, KBS NEWS·YTN·연합뉴스TV(편성 시간대), NDTV 24x7, INDIA TODAY, ABP NEWS, AAJ TAK, DD NEWS, METRO TV(인도네시아), NATION TV(태국)
- 오세아니아: ABC NEWS(AU), SKY NEWS AUSTRALIA
- 미주: ABC NEWS LIVE, NBC NEWS NOW, BLOOMBERG TV, CNBC, SCRIPPS NEWS, REUTERS TV, CBC NEWS NETWORK, NTN24(콜롬비아)
- 유럽: DW NEWS·DW عربية, FRANCE 24, EURONEWS, GB NEWS, RTVE 24H(스페인), ERT NEWS(그리스)
- 중동: AL JAZEERA ENGLISH·ARABIC·MUBASHER, SKY NEWS ARABIA, AL ARABIYA, ASHARQ NEWS, TRT WORLD, i24NEWS, IRAN INTERNATIONAL, KURDISTAN 24, RUDAW
- 아프리카: AFRICANEWS, SABC NEWS
- **외부 공식 링크(새 창)**: BBC NEWS, SKY NEWS, CBS NEWS 24/7, LIVENOW FROM FOX, CCTV-13, TVBS — 방송사가 삽입을 차단한 채널은 가짜 재생 대신 이유를 표시하고 공식 링크를 제공합니다.

### 소스 유형

- **HLS** — `.m3u8`을 hls.js로 직접 재생(CORS 확인됨). 자동재생 100% 보장 경로.
- **YT·LIVE** — 채널 ID `embed/live_stream`으로 방송사가 라이브를 끊고 새로 시작해도 자동 추적.
- **WEB** — 외부 공식 링크(새 창).

## 커스텀 소스

`≡ 소스 관리` → CUSTOM SOURCE에 YouTube 링크·채널 ID(`UC…`)·영상 ID·`.m3u8`·웹 주소를 넣으면 추가됩니다.

## 저장

레이아웃별 채널 배치(9/4/6/1) · 시작 화면 · 커스텀 소스 · 음성 상태가 `localStorage`(`worldlive.v2`)에 저장되며, 기존 `worldlive.v1` 설정은 자동 마이그레이션됩니다. `?reset=1`로 초기화, `?layout=4|9|6|1|all`로 시작 레이아웃 지정도 가능합니다.

## 검증 결과 (2026-11-22 KST, 이 페이지 기준)

- CNN INTERNATIONAL HLS — 9분할·4분할에서 클릭 없이 즉시 자동재생 확인 (CORS `*` / FAST GB 포함 3개 소스 확보)
- **KBS NEWS 24·YTN 24시간·연합뉴스TV 라이브** — 9분할에서 클릭 없이 즉시 자동재생 확인(임베드 URL `?` 누락 버그 수정 후)
- 아리랑 TV·TBS 서울 HLS — 페이지 내 자동재생 확인
- 9분할 9개 동시 자동재생 9/9, 4분할 4/4
- FULL 모드 — 상·하단 바 완전 숨김, 클릭 토글·3.6초 자동 숨김 확인
- 채널 정렬 — 전체 스크롤에서 ‘한국 우선’ 적용 시 국내 11채널이 맨 앞에 나열되는 것 확인
- 전체 스크롤 44채널 — 뷰포트 14~15개만 마운트·전부 LIVE, 스크롤 이동 시 해제/재마운트 확인
- 소스 교체(4분할 2번 칸 CNN→France 24)·첫 화면 설정(전체 스크롤 저장 후 재방문 복원) 확인
- KBS·YTN·연합뉴스TV는 편성 시간대에만 라이브라 현재 OFFLINE 표시(오류 아님)

## 구조

```
index.html          마크업 · 컨트롤 바(첫 화면 메뉴 포함) · 소스 모달
css/style.css       딥네이비 주조정실 테마 + ALL 스크롤 그리드 + chan-switch 칩
js/channels.js      채널 카탈로그 42개 + 레이아웃별 기본 배치
js/app.js           레이아웃 엔진 · 지연 마운트 · 독립 배치 저장 · 소스 관리
hls-multi.html      (개발용) HLS 다중 재생 프로브
yt-test.html        (개발용) YouTube 임베드 다채널 프로브
```
