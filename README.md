# WORLD LIVE // GLOBAL NEWSROOM MONITOR (v8.6.0)

전 세계 **검증된 라이브 뉴스 채널 50여 개**를 16:9 데스크톱 모니터에서 동시에 보는 방송국 주조정실 스타일 멀티뷰.

- 🌐 **웹 라이브 주소**: **https://jongringer.github.io/world_live/**
- 📱 **worldnews Android 모바일 앱 (v8.6.0)**: [worldnews.apk 직접 다운로드](https://jongringer.github.io/world_live/apk/worldnews.apk) | [GitHub 공식 릴리스 v8.6.0](https://github.com/jongringer/world_live/releases/tag/v8.6.0)

---

### 📱 worldnews 안드로이드 APK 다운로드 (QR 코드)

스마트폰 카메라로 아래 QR 코드를 비추면 **`worldnews` 전용 앱(APK)**을 즉시 다운로드하여 설치하실 수 있습니다.

<div align="center">
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https%3A%2F%2Fjongringer.github.io%2Fworld_live%2Fapk%2Fworldnews.apk" alt="worldnews APK 다운로드 QR 코드" width="220" height="220" />
  <br>
  <sub><b>스마트폰으로 스캔하여 worldnews APK 즉시 설치</b></sub>
</div>

---

## 레이아웃

| 버튼 | 구성 | 단축키 |
|---|---|---|
| 9분할 | 3×3 — 기본(KBS·YTN·연합 / NHK·CGTN·CNN FAST / BBC·ABC·Al Jazeera) | `1` |
| 6분할 | 3×2 | `2` |
| 4분할 | 2×2 — 기본(KBS·NHK·CNN FAST·BBC) | `3` |
| **전체화면** | 듣고 있는 채널(없으면 1번 칸)을 **1×1 + 브라우저 FULL = 클린 화면**(상하단 바·배지·버튼 없이 영상만), `ESC`로 직전 분할 화면 복귀 | `4` |
| **전체 스크롤** | 전 세계 채널 3열(넓으면 4열) 16:9 그리드, 스크롤로 훑어보기 | `5` / `A` |
| FULL (키만) | `F` — 지금 보고 있는 분할(9·6·4·스크롤)을 그대로 브라우저 전체화면으로 토글 (v6에서 상단 `FULL` 버튼은 제거) | `F` |

상단 바 버튼 순서는 **9분할 · 6분할 · 4분할 · 전체화면 · 전체 스크롤**(v7). `전체화면`은 클릭 즉시 HUD 없이 순수 영상으로 들어가고, `ESC`를 누르면 직전 분할 화면으로 돌아옵니다.

그 밖에 `M` 전체 음소거, `S` 소스 관리. **타일 클릭 = 그 채널 단독 청취 + 흰색 테두리**, **타일을 다른 칸으로 드래그 = 두 채널 자리 바꿈**, **타일 더블클릭 = 그 채널 1×1 + FULL**(ESC로 이전 화면 복귀). 상단 전체 새로고침(`↻`) 버튼과 `R` 단축키는 없앴습니다(실수로 전체 피드가 재로딩되는 일 방지) — 타일별 `↻` 재연결은 그대로 있습니다.

## FULL 모드 — 순수 영상 (v3)

- FULL에 들어가면 상·하단 바뿐 아니라 **타일 안의 모든 오버레이**(좌상단 `LIVE · 채널명`, 우상단 `채널 변경 ▾`, 하단 호버 컨트롤)가 사라져 **영상만** 남습니다.
- **여백·간격 0**: 상단 바·하단 바가 화면 밖으로 나가고 `stage` 패딩과 그리드 gap, 타일 테두리까지 0이 되어 16:9 화면을 꽉 채웁니다.
- **원본 화면비 유지**: 타일은 `aspect-ratio 16/9`, 영상은 `object-fit: contain` — 늘어남·잘림 없이 레터박스로 맞춥니다. 화면비가 16:9가 아닌 창에서는 남는 쪽에만 검은 여백이 생깁니다(비율 보존).
- 화면 클릭 또는 상·하단 가장자리로 마우스를 보내면 HUD(상하단 바 + 타일 컨트롤)가 나타나고 **3.6초 뒤 자동으로 사라집니다**(`H` 키 토글).

## 상단 바 · 시계 (v4)

- **한글 도시명**: `서울 KST · 뉴욕 EST · 파리 CET` — 도시명은 한글, 시각은 모노스페이스 `#F8FAFC`로 크게. 서울(현지)은 시안 글로우로 구분합니다.
- **초까지 잘리지 않는 폭 대응**: 시계는 `flex:0 0 auto` + `nowrap`으로 줄어들지 않고, 폭에 따라 글자 크기·간격만 단계적으로 줄입니다(18 → 16.5 → 16px). 1920·1440·1366·1280 모두에서 `서울 · 뉴욕 · 파리`의 시·분·초가 전부 보입니다(초는 64px 폭). 1150px 미만에서 파리, 900px 미만에서 뉴욕, 780px 미만에서 시계 전체를 숨깁니다. `전체 스크롤` 라벨은 폭과 관계없이 줄이지 않고 그대로 두며, 좁은 폭에서는 `ALL LIVE`·`KST/EST/CET` 같은 영문 서브라벨과 여백을 줄여 자리를 만든다. `채널 찾기`·`첫 화면`은 좁은 폭에서 아이콘만으로 간다.
- **Pretendard**: `Pretendard Variable` (jsDelivr dynamic subset) 웹폰트를 불러 한글 UI 전체에 적용. 로딩 실패 시 맑은 고딕·Apple SD Gothic Neo로 폴백.
- **밝은 슬레이트 글래스 톤**: 상단 바 배경을 `#2B3B59 → #22304A → #1A2438` 그라데이션 + 상단 골드 라이트 라인 + 유리 반사 레이어로 올려, 버튼·아이콘·라벨 색도 `#C4D0E0` 이상으로 밝혔습니다. 영상 그리드의 다크 프레임은 그대로라 몰입감은 유지됩니다.
- **WORLD LIVE 라이트닝**: 샴페인 골드·화이트가 흘러가는 빛 스윕(shimmer) + 주기적인 네온 글로우.
- **로고 타이포 (v5)**: `WORLD LIVE //` 를 자간 `.32em → .05em`, `17px/800 → 21px/900`(960px 이하 16px)으로 조여 크고 힘있게. 42px 지구본·8px 서브라인과 함께 상단바 66px 안에 들어가고, 폭 1920에서 브랜드 130×22px · 탑바 넘침 0 · 시계 우단 1290/1920.
- **입체 3D 지구본(42px)**: 바다 `radialGradient` 심도 명암 · 금빛 대륙(자전) · 극지 빙하 · 경선/위선 그리드 · 스페큘러 하이라이트 · 대기권 시안 림 글로우 · 기울어진 3D 궤도를 도는 위성과 지구↔위성 신호 펄스 빔.

## 상단 바 한글 타이포 (v7)

- **한글 라벨 한 단계 확대 · 자간 축소**: `9분할·6분할·4분할·전체화면·전체 스크롤` 13.5px `-.012em`(기존 11px `.05em`), `정렬·첫 화면` 13px, `채널 찾기` 13px, `지역·국가순` 11.5px, `마지막 화면` 12px, 도시명 `서울·뉴욕·파리` 13px `.005em`(기존 10.5px `.1em`). 글자는 커지고 자간은 조여 한글이 단단하게 읽힙니다.
- **`전체 스크롤` 표기 고정**: 5번째 레이아웃 버튼은 어떤 폭에서도 `전체 스크롤`(최소 폭에서 `스크롤`로 줄이던 규칙 제거). 첫 화면 메뉴 항목도 `전체 스크롤`로 통일.
- **폭 확보 순서**: 1700px 이하 `ALL LIVE`·`GLOBAL NEWSROOM MONITOR` 숨김 → 1460px 이하 여백 축소 → 1300px 이하 `KST/EST/CET` 태그 숨김 → 1150px 이하 여백 재조정. 1920·1600·1500·1440·1366·1280 모두 **상단 바 넘침 0**, `서울·뉴욕·파리` 시·분·초 그대로.

## 채널 찾기 = 먼저 크게 미리보고 추가 (v4)

- 타일의 `채널 변경 ▾` → 그 칸을 바로 교체(기존과 동일).
- 상단 `채널 찾기`(또는 `S` 키) → 채널을 누르면 **16:9 큰 미리보기**가 먼저 뜨고, 실제 라이브가 나오는지 확인한 뒤 결정합니다.
- 미리보기 하단: 현재 화면(9/4/6/1분할)의 **칸 번호 버튼**(그 칸의 현재 채널은 툴팁) · **전체 스크롤 맨 앞에 추가** · **닫기 · 목록으로**. 상단: 라이브 상태 배지(LIVE/CONNECTING/NO SIGNAL) · 소리 켜기 · 새 창에서 열기.
- 임베드가 막힌 채널(YouTube 오류 101/150)은 미리보기 안에 안내가 뜨고 새 창으로 확인합니다. HLS는 실패 시 백업 주소로 자동 전환합니다.

## 상단 시각 표시

- **서울 KST · 뉴욕 EST · 파리 CET** 3개만 표시합니다.

## 채널 정렬 (v3)

| 모드 | 순서 |
|---|---|
| **지역·국가순** (기본) | **아시아(일본·중국 먼저)** → 미주(미국) → 유럽(영국) → 중동(알자지라) → 오세아니아 → 아프리카 → **한국(맨 뒤)** |
| 내 순서 | 사용자가 직접 옮긴 순서. 전체 스크롤에서 타일의 `⤒ ◀ ▶` 로 이동하면 자동으로 이 모드로 전환·저장 |
| 이름순 | 채널명 가나다·알파벳 |
| 한국 우선 | KBS NEWS 24 · YTN · 연합뉴스TV를 맨 앞으로 |

- 지역·국가순의 순서는 소스 라이브러리 모달의 그룹과 전체 스크롤 화면에 동일하게 적용됩니다.
- **내 순서**: 전체 스크롤(ALL LIVE)에서 각 타일 우상단의 `⤒`(맨 앞으로) `◀`(앞으로) `▶`(뒤로)를 누르면 즉시 순서가 바뀌고 `localStorage`에 저장됩니다. 같은 자리의 작은 아이콘 버튼은 그 칸의 채널을 직접 바꾸는 ‘채널 변경’입니다(칸을 교체하면 자동으로 ‘내 순서’로 고정). FULL 모드에서는 다른 오버레이처럼 숨고 HUD가 켜졌을 때만 나타납니다.

## 전체 스크롤 = 라이브가 들어오는 채널만

- 전체 스크롤에는 페이지 안에서 **실제로 라이브 신호가 재생되는 채널만** 나옵니다(외부 공식 링크·미송출 채널 제외).
- 2026-11-22 브라우저 실측: HLS 35개 + YouTube 11개 = **46채널 전부 재생 확인**.
- 외부 공식 링크 6개(BBC 공식·CCTV-13·Sky News·CBS·LiveNOW·TVBS)는 소스 라이브러리의 ‘외부 공식 링크’ 영역에만 남습니다.

## 채널 직접 선택

- **모든 타일 우상단의 ‘채널 변경 ▾’ 버튼** — 클릭 한 번으로 그 칸의 채널을 교체합니다.
- **4분할·9분할·6분할·1×1(전체화면)의 배치는 각각 독립적으로 저장**됩니다.
- **첫 화면 설정**: 상단 ‘★ 첫 화면’ 메뉴에서 `마지막 화면 · 9분할 · 6분할 · 4분할 · 전체화면 · 스크롤` 중 하나를 고르면 다음에 열 때 그 화면으로 시작합니다.

## KOREA · 국내 뉴스 (3사만 유지)

- **KBS NEWS 24** (`nfnWxzTVJA4`, 2026-11-23 교체 · 이전 `zGFBJL_fhUU`는 재생 불가) · **YTN 24시간 라이브** (`aZyD6EPl6KU`) · **연합뉴스TV 라이브** (`6QZ_qc75ihU`) — 24시간 고정 라이브, 클릭 없이 즉시 자동재생.
- MBC·SBS·JTBC·MBN·채널A·TV조선·아리랑 TV·TBS는 카탈로그에서 제거했습니다. 저장된 옛 배치에 그 ID가 남아 있으면 불러올 때 걸러지고 기본 채널로 대체됩니다(`localStorage` `worldlive.v3` 마이그레이션).

## KBS NEWS 24 소스 교체 (2026-11-23 KST)

- **교체 내용**: `js/channels.js`의 `kbs24` 항목 `src` — `zGFBJL_fhUU` → **`nfnWxzTVJA4`** (`https://www.youtube.com/live/nfnWxzTVJA4`). 카탈로그·기본 배치(9·6·4·1분할)·소스 목록에서 쓰는 ID는 이 한 곳이라, 다른 파일에는 옛 ID가 남아 있지 않습니다.
- **교체 이유**: 옛 ID는 YouTube oEmbed가 `Forbidden`(영상 삭제·비공개)을 돌려주어 재생이 불가능한 상태였습니다.
- **캐시**: `index.html`의 `js/channels.js?v=30 → ?v=31`. 저장 배치(`localStorage` `worldlive.v3`)에는 **채널 ID(`kbs24`)만** 저장되고 영상 ID는 저장되지 않으므로, 기존 사용자도 새 `channels.js`를 받는 즉시 새 소스로 재생됩니다(별도 마이그레이션 불필요).
- **APK 자산 동기화**: `android/app/src/main/assets/public/`의 `index.html`·`js/channels.js`도 같은 내용으로 갱신했습니다(저장된 APK 바이너리 `apk/worldnews.apk`는 재빌드 전까지 이전 소스).
- **검증 (운영 페이지 `https://jongringer.github.io/world_live/`, 2026-11-23 06:56 KST)**: 1번 칸 iframe `src` = `https://www.youtube.com/embed/nfnWxzTVJA4?…&origin=https%3A%2F%2Fjongringer.github.io`, 타일 상태 `LIVE`, 화면에 KBS NEWS24 방송 영상이 실제로 재생됨(오류 150·153 없음). 같은 화면의 9개 타일 모두 LIVE.
- **주의**: `nfnWxzTVJA4`는 KBS News(`@newskbs`) 채널의 **프로그램 단위 라이브**(제목 ‘[🔴LIVE] 뉴스광장 … 11월 23일(월) / KBS’)라, 그 방송이 끝나면 다시 새 영상 ID로 바뀝니다. **채널 자동 추적은 KBS에서 불가**: 2026-11-23 07:05 KST 운영 페이지에서 `embed/live_stream?channel=UCcQTRi69dsVYHN3exePtZ1A`(`@newskbs` 채널 ID)를 직접 미리보기로 열어 보니 **“이 동영상은 볼 수 없습니다.”** — KBS News는 채널 라이브 삽입을 막고 있어 이 방식은 쓸 수 없습니다. 방송이 끝나면 새 `/live/` 주소로 `kbs24`의 `src`를 교체해야 합니다.

## 빌드 표식 (2026-11-23 추가)

- 하단 신호 스트립에 **`SRC 11-23a`** 처럼 현재 불러온 채널 목록의 빌드가 표시됩니다(`js/channels.js`의 `CHANNELS_BUILD`). 휴대폰이 옛 파일을 캐시해 쓰고 있으면 `SRC BUILD ? · 옛 파일(캐시)`로 주황색으로 표시되어, 화면이 안 바뀌었을 때 캐시 문제인지 바로 구분할 수 있습니다.
- 새 `app.js`가 옛 `channels.js`(캐시)와 함께 로드되면 **세션당 1회** `?r=<timestamp>`로 자동 새로고침해 최신 파일을 받아옵니다.
- 저장된 **커스텀 소스**에 죽은 옛 영상 ID가 남아 있으면 `RETIRED_SOURCES` 맵으로 현재 소스로 치환합니다.

## 📱 모바일 더블 터치 → 16:9 클린 풀화면 (2026-11-23 추가)

스마트폰 브라우저로 `https://jongringer.github.io/world_live/`를 열고 채널 타일을 **더블 터치(더블 탭)** 하면 상·하단 바·배지·버튼이 모두 사라진 **16:9 클린 풀화면**이 뜹니다. (APK 앱은 기존 네이티브 전체화면 경로 그대로.)

- **더블 터치 감지**: 터치 줌·브라우저 기본 동작 때문에 `dblclick`이 오지 않는 모바일을 위해 **`touchend` 기준**으로 판정합니다. 같은 타일에서 **320ms 이내** 두 번째 탭이고, 손을 뗀 지점이 시작점에서 **26px 이내**일 때만 더블 터치로 인정합니다 — 한 번 탭(오디오 선택), 롱프레스 자리 바꾸기(320ms), 핀치 줌과 서로 잡아먹지 않습니다. `.tile`·`.tile-hit`에 `touch-action: manipulation`을 줘서 **더블 탭 줌만** 끄고 페이지 스크롤·핀치 줌은 그대로 둡니다.
- **16:9 클린**: 레이아웃(`state.layout`)을 바꾸지 않고 **보던 타일만 확대**하므로 영상이 다시 로드되지 않고 이어서 재생됩니다(`<video> currentTime` 증가 확인). 세로 모드 = 가로 꽉 찬 16:9 + 상하 검은 레터박스, 가로 모드 = 높이 꽉 찬 16:9 + 좌우 레터박스(회전해도 16:9 유지).
- **Fullscreen API + CSS 폴백**: Chrome Android에서는 `requestFullscreen()`을 시도하고, iOS Safari처럼 API가 없거나 거부돼도 `100vw × 100dvh` 검은 배경 위 16:9 중앙 오버레이(`body.is-cinema`)로 똑같이 뜹니다.
- **복귀**: 풀화면에서 한 번 터치하면 채널명 + ✕ 버튼 HUD가 2.8초 나타났다 사라지고(진입 직후 2.4초 안내), **✕ 버튼 · ESC · 뒤로가기(`popstate`) · 다시 더블 터치** 중 무엇으로도 보던 분할 화면·스크롤 위치로 돌아옵니다.
- **검증 (Playwright 모바일 에뮬레이션, 2026-11-23 KST)**: 390×844 세로·844×390 가로, `hasTouch: true`, 실제 `touchscreen.tap()` 두 번 — 16:9 비율 1.7776~1.7778, 상·하단 바/배지 `display:none`, 영상 이어짐, HUD 자동 소멸, ✕·뒤로가기·더블 터치 복귀, 롱프레스 자리 바꾸기 유지, Fullscreen API 없는 iOS 폴백, 세로→가로 회전, 전체 스크롤 레이아웃까지 통과. 스크린샷: `downloads/world_live-screens/mobile-doubletap-full.png`.

## HLS 소스 + 백업 자동 전환 (v3)

| 채널 | 1차 HLS | 백업 HLS |
|---|---|---|
| NHK WORLD-JAPAN | `masterpl.hls.nhkworld.jp/hls/w/live/master.m3u8` | — (YouTube 대체 소스 별도 수록) |
| BBC NEWS | `vs-hls-push-ww-live.akamaized.net/…/v=pv10/b=1604032/main.m3u8` | `…/v=pv14/b=5070016/main.m3u8` |
| CNN FAST | `d3hnx79nr9mhdw.cloudfront.net/…/cc-1u2levt4fksmr/CNNFAST_GB.m3u8` | `d2sybdl23b9psq.cloudfront.net/…/cc-bocx3i7bjz0dg/CNNFAST_GB.m3u8` |
| CGTN ENGLISH | `english-livebkali.cgtn.com/live/encgtn.m3u8` | `amg00405-rakutentv-cgtn-rakuten-i9tar.amagi.tv/master.m3u8` |
| ABC NEWS LIVE | `abc-news-dmd-streams-1.akamaized.net/…/index_6.m3u8` | `…/index.m3u8` |
| NDTV 24x7 | `ndtv24x7elemarchana.akamaized.net/…/ndtv24x7/master.m3u8` | `…/ndtv24x7master.m3u8` |
| AL JAZEERA ENGLISH | `live-hls-apps-aje-fa.getaj.net/AJE/03.m3u8` | `…/AJE/index.m3u8` |
| FRANCE 24 ENGLISH | `live.france24.com/hls/live/2037218/F24_EN_HI_HLS/master_5000.m3u8` | — (YouTube 대체 소스) |
| DW NEWS | `dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8` | — (YouTube 대체 소스) |

- hls.js가 1차 주소에서 치명적 오류(매니페스트·세그먼트 실패)를 만나면 네트워크 재시도 후 **`backup` 주소로 자동 전환**하고 타일에 토스트로 알립니다. 백업까지 실패하면 공식 페이지 안내를 표시합니다.
- 프랑스 24·DW·ABC·Al Jazeera·NHK는 YouTube 소스를 ‘대체’ 태그로 함께 남겨 두어 HLS가 막힐 때 직접 고를 수 있습니다.

## 저장

레이아웃별 채널 배치(9/4/6/1) · **내 순서(전체 스크롤)** · 정렬 모드 · 마지막 레이아웃 · 첫 화면 고정 여부 · 커스텀 소스 · 선택 채널(음성) 상태가 모두 `localStorage`(`worldlive.v3`)에 즉시 저장됩니다 — 채널 변경·드래그 자리 바꾸기·미리보기에서 추가·순서 이동(`⤒◀▶`)·첫 화면 설정·정렬 변경·오디오 선택 중 어느 것을 하든 그 자리에서 `setItem` 합니다.

- **새로고침·재방문 시 복원**: `worldlive.v3` 키는 지우지 않으므로(코드 버전 `?v=`가 올라가도 그대로) 레이아웃별 배치·내 순서·정렬 모드·선택 채널이 마지막 상태로 돌아옵니다.
- **시작 화면**: 기본은 **마지막으로 보던 화면**으로 시작합니다. 상단 `★ 첫 화면`에서 특정 레이아웃을 고르면 그 화면으로 고정되고, `마지막 화면`을 고르면 다시 마지막 화면으로 돌아갑니다.
- 이전 `worldlive.v2`·`v1` 설정은 자동으로 마이그레이션되고, 없어진 채널 ID는 기본 채널로 대체됩니다. `?reset=1`로 초기화, `?layout=4|9|6|1|all`로 시작 레이아웃 지정도 가능합니다.

## CCTV-13 新闻 — 페이지 내 수신 조사 결과 (2026-11-22)

공개 HLS·삽입 경로를 모두 실측한 결과, **CCTV-13은 페이지 안에서 재생되지 않습니다**(외부 공식 링크로만 제공).

| 후보 | 결과 |
|---|---|
| iptv-org `cn.m3u` (2건) | `go.bkpcp.top` → Cloudflare 403 「Just a moment」, `74.91.26.218:82` → 접속 불가. 둘 다 HTTP라 HTTPS 페이지에선 혼합 콘텐츠 차단 |
| CCTV 공식 CDN cdrm HLS (`ldncctvwbcd…cnchw.v.cdn20.com`) | 매니페스트·세그먼트 200, **CORS 헤더 없음** |
| CCTV CDN 미러 (`ldncctvwbcdali.v.myalicdn.com`, `…ks.v.kcdnvip.com`, `…txy.liveplay.myqcloud.com`) | 매니페스트·변형·세그먼트 모두 200 + `Access-Control-Allow-Origin: *` (또는 origin 반사) → **CORS 통과** |
| 위 CDN을 hls.js로 재생 | 1.5.17·1.6.13 모두 **`mediaError/bufferAddCodecError`** — PMT는 존재(H.264 0x1B / AAC 0x0F)하지만 hls.js가 코덱을 얻지 못해 SourceBuffer 생성 실패 |
| 공식 페이지 iframe 삽입 (`tv.cctv.com/live/cctv13/`) | 페이지는 뜨지만 플레이어가 **「对不起，由于版权原因，视频无法播放」**(저작권 제한) |
| 공식 페이지 새 창 | **재생 확인** — 1280×720 영상, `currentTime` 진행 (DRM 플레이어 전용 경로) |
| VDN API (`vdnx.live.cntv.cn`) | 정상 세션 없이는 `status 20 · 抱歉，该视频暂时无法播放` |

→ CCTV-13은 `kind:'web'` 외부 링크로만 남겨 두었습니다.

## 검증 결과 (2026-11-22 KST, 운영 페이지 기준)

- **9분할 9/9 동시 재생**: KBS NEWS 24 · YTN · 연합뉴스TV(YouTube) + NHK WORLD-JAPAN · CGTN ENGLISH · CNN FAST · BBC NEWS · ABC NEWS LIVE · AL JAZEERA ENGLISH(HLS) 전부 LIVE, 클릭 없이 자동재생.
- **BBC HLS 신규 재생 확인** — 기존에는 DASH 전용으로 막혀 공식 링크로만 연결했으나, 이번 HLS 주소로 페이지 안에서 실제 방송(스포츠 중계)이 재생됨.
- HLS 6개 스트림 모두 `video.currentTime` 증가·`paused:false`, `object-fit:contain`, 타일 비율 정확히 16:9.
- **소스 라이브러리**: 아시아 → 미주 → 유럽 → 중동 → … → 한국 순서, KOREA 그룹은 3개(KBS·YTN·연합뉴스TV)만 표시.
- **내 순서**: 전체 스크롤에서 NHK 타일 `▶` 클릭 → CGTN·NHK 순으로 즉시 변경, 정렬 라벨이 ‘내 순서’로 전환되고 새로고침 후에도 유지.
- **한국 우선**: KBS·YTN·연합뉴스TV가 맨 앞에 나열.
- **FULL 모드**: 상하단 바·타일 오버레이 opacity 0, `stage` 패딩 0 / gap 0 / 테두리 0, HUD를 켜면 컨트롤이 다시 나타났다가 3.6초 뒤 사라짐. 9분할·ALL 모두 오버레이 없이 영상만 표시, 영상비 16:9 유지(`object-fit:contain`).
- **전체 스크롤 전수 검증**: HLS 35개·YouTube 11개 전부 재생(`video.currentTime` 진행/`playerState=1`) — 전체 스크롤에 뜨는 채널은 모두 살아 있는 라이브입니다.
- **전체 스크롤 순서/소스 직접 지정**: NHK 타일 `▶` → CGTN·NHK 순으로 즉시 변경·저장(정렬 라벨 ‘내 순서’), 같은 화면에서 1번 칸을 BBC로 교체 → 1번이 BBC로 바뀌고 정렬이 ‘내 순서’로 고정.
- **시각 표시**: 서울 KST · 뉴욕 EST · 파리 CET 3개 한글 라벨 확인.

## 검증 결과 (v4, 2026-11-22 KST)

- 상단 바 밝기·시계 가독성·라이트닝·3D 지구본을 1920×1080(브라우저 뷰포트 1920×993)에서 확인 — `downloads/world_live-screens/v4-topbar.png`, 확대본 `v4-topbar-zoom.png`, 지구본 8배 `v4-globe-8x.png`.
- **폭별 실측(iframe 렌더)**: 1920 / 1440 / 1366 / 1280에서 `topbar.scrollWidth == clientWidth`(넘침 0), 시계 3개 전부 표시·`clock.right <= topbar.right`. 화면 캡처: `v4-widths-1920-1440-1366-1280.png`.
- **Pretendard 로딩 확인**: `document.fonts.check('700 13px "Pretendard Variable"', '서울 뉴욕 파리 채널 찾기')` → true, 같은 문자열 폭이 폴백(Malgun Gothic) 421px 대비 386px.
- 채널 찾기 → 미리보기 → 칸 추가 / 전체 스크롤 맨 앞 추가 / 목록으로 복귀를 실제 클릭으로 검증(9분할 3번 칸 BBC, 전체 스크롤 DW 맨 앞).

## 선택 채널 흰색 테두리 · 원클릭 오디오 전환 (v5)

- 9분할·6분할·4분할·전체화면(1×1)·전체 스크롤(ALL LIVE) 어디서든 **영상 영역을 한 번 클릭**하면 그 채널만 청취합니다 — HLS는 `muted=false`·`volume=1`·`play()`, YouTube는 `unMute` + `setVolume(100)` + `playVideo()`.
- 선택한 타일 외곽에 **흰색 3px 테두리 + 은은한 화이트 글로우**(`.tally-ring`)가 표시되고, 직전에 듣던 채널은 자동으로 음소거되며 테두리가 사라집니다.
- YouTube iframe이 클릭을 삼키지 않도록 타일 전체를 덮는 투명 레이어(`.tile-hit`)가 클릭을 받고, `채널 변경 ▾`·`◀ ▶ ⤒`·`1×1`·`새 창`·`리로드` 버튼은 그보다 위(`z-index` 5·6)에 있어 충돌하지 않습니다.
- **클릭과 드래그 구분**: 누른 뒤 8px 이내로 움직이면 클릭(오디오 선택), 8px를 넘으면 드래그(자리 바꾸기)입니다.
- **더블클릭 = 그 채널 1×1 + 브라우저 FULL**(순수 영상 모드). 더블클릭 직전 레이아웃을 기억해 두었다가 **ESC(전체화면 종료)를 누르면 원래 보던 화면(9·6·4분할·스크롤)으로 자동 복귀**합니다. 타일 하단의 `1×1 전체화면` 버튼도 같은 동작입니다. 전체화면이 막힌 브라우저에서는 자동으로 원래 화면으로 되돌아옵니다.
- **상단 `전체화면` 버튼(키 `4`, v6)** = 듣고 있는 채널(없으면 1번 칸)을 **1×1 + FULL 클린 화면**으로 즉시 전환 — 클릭한 순간 HUD가 뜨지 않아 상하단 바·타일 배지·버튼 없이 영상만 남고, `ESC`를 누르면 직전 분할 화면으로 돌아옵니다. 오디오 선택이 없을 때만 1번 칸으로 들어가며, 이미 1×1이던 경우엔 ESC 후 1×1에 남습니다.
- **상단 전체 새로고침(`↻`) 버튼과 `R` 단축키 제거**: 모든 피드를 한 번에 다시 부르는 동작이 실수로 눌리면 복구에 오래 걸려 없앴습니다. 필요한 피드만 타일 하단 `↻` 로 재연결합니다.
- **FULL 순수 영상 모드**에서도 선택 채널의 흰색 테두리만은 남아 지금 듣는 채널을 알 수 있습니다(다른 배지·버튼은 그대로 숨김).
- 상단 `M` 전체 음소거 또는 그 타일의 스피커 버튼을 누르면 음소거와 함께 흰색 테두리도 해제됩니다.

## 드래그로 채널 자리 바꾸기 (v5)

- 타일 영상 위를 **8px 넘게 끌어 다른 칸에 놓으면** 두 칸의 채널(소스)이 맞바뀝니다. 끄는 동안 집어 든 타일은 골드 점선, 놓을 타일은 시안 점선으로 표시됩니다.
- HTML5 `draggable` 대신 투명 레이어 위 `pointerdown → pointermove → pointerup` + `document.elementFromPoint` 로 처리해 YouTube iframe·HLS 비디오 위에서도 동작합니다.
- 9·4·6분할은 그 레이아웃 배치(`state.sets`)에 즉시 저장되고, 전체 스크롤에서는 자동으로 **‘내 순서’** 로 고정·저장됩니다. 듣고 있던 채널은 자리 바꿈 후에도 테두리·음성과 함께 이동합니다.

## 검증 결과 (v5, 2026-11-22 KST · 운영 페이지 1920×1080, 뷰포트 1920×993)

- **원클릭 오디오 탤리**: 9분할 3번 칸 NHK 클릭 → 해당 타일 `border: 3px solid rgb(255,255,255)`·opacity 1, `video.muted === false`, 나머지 8개 `muted === true`, 스트립 `AUDIO — NHK WORLD-JAPAN`. 이어 5번 칸 CNN FAST 클릭 → NHK `muted === true`·테두리 해제, CNN FAST 테두리 + `muted === false`, 스트립 `AUDIO — CNN FAST`. 스크린샷 `downloads/world_live-screens/v5-audio-tally.png`.
- **M 음소거 연동**: 상단 M 클릭 → `audio=null`, `muted=true`, `is-tally` 0개, 스트립 `ALL MUTED`.
- **드래그 자리 바꾸기(9분할)**: CNN FAST 타일을 CGTN 타일로 드래그 → `sets['9']` 가 `[…nhk, cnn_fast, cgtn…]` → `[…nhk, cgtn, cnn_fast…]` 로 맞바뀜, 듣던 CNN FAST가 새 자리(4번 칸)로 테두리·음성과 함께 이동. 새로고침 후에도 유지.
- **드래그 자리 바꾸기(전체 스크롤)**: NHK를 CGTN 자리로 드래그 → 0번=CGTN, 1번=NHK, 정렬 라벨이 `내 순서`로 전환·저장. 새로고침 후에도 `내 순서`와 바뀐 순서 그대로.
- **FULL 진입·복귀**: 타일의 `1×1 전체화면` 클릭 → `document.fullscreenElement` 설정, `layout='1'`, `prevLayout='9'`, `body.is-full`, HUD 자동 숨김(순수 영상), 1×1 타일에도 흰색 테두리 유지(`v5-full-tally.png`). 이어 **ESC 키를 실제로 눌러** 전체화면 종료 → `fullscreenchange`에서 `layout='9'`로 자동 복귀, `prevLayout=null`, CNN FAST 선택·테두리 유지.
- **저장·복원**: 4분할에서 1번 칸을 DW NEWS로 교체 → 새로고침(`?cb=`) 후 **4분할 + 1번 칸 DW NEWS + 선택 채널 CNN FAST(2번 칸 테두리)** 그대로 복원. 이어 전체 스크롤로 전환·드래그 후 새로고침 → **전체 스크롤 + 내 순서 + CGTN·NHK 순서 + CNN FAST 음성 선택** 그대로 복원. `worldlive.v3` 키는 코드 버전(`?v=`)이 바뀌어도 초기화되지 않음.
- **상단 새로고침 제거**: `#btn-reload` 없음(`hasReloadBtn:false`), `R` 단축키 미동작. 타일별 `↻`는 유지.

## v6 변경 (2026-11-22)

- **상단 버튼 순서**: `9분할 · 6분할 · 4분할 · 전체화면 · 전체 스크롤` — 단축키도 순서대로 `1·2·3·4`, 스크롤은 `5`/`A`.
- **`전체화면` 버튼(키 `4`)**: 듣고 있는 채널(오디오 선택이 없으면 1번 칸)을 **1×1 + 브라우저 FULL = 클린 화면**으로 즉시 전환. 진입 순간 상·하단 바와 타일 배지·버튼이 나타나지 않고(전환 여파로 HUD가 켜지지 않도록 1.2초 유예) 영상만 남습니다. `ESC` → 직전 분할 화면 복귀.
- **정렬 옆 `FULL` 버튼 제거**: 상단 바에서 사라졌습니다. 현재 분할 화면을 그대로 전체화면으로 토글하는 동작은 `F` 키로 남아 있습니다.
- **채널 찾기(소스 라이브러리) 모달**: 지역 그룹 라벨(`ASIA · 일본·중국·아시아` 등)을 `13.5px / 700 / #F2D28B` 골드로 키우고 각 그룹 채널 수를 골드 알약 배지로 표시. 모달 배경은 `backdrop-filter` 블러를 없애 `rgba(10,15,24,.95)` 딥 다크로 바꿔 영상 9개 위에서도 렌더링을 가볍게 했습니다.
- **검색 즉시 반응**: 모달을 열 때 카드 DOM을 한 번만 만들고, 입력할 때는 카드·그룹의 `hidden`만 토글합니다(재렌더 없음 → 한글 IME 조합 중에도 입력이 끊기지 않음). 실측 한 번의 필터링 **0.035ms** vs 카드 전체 재생성 **6.34ms**(59장 기준).
- **로고**: 위성을 본체 4.8×2.7 + 양쪽 태양판(2.35×3.1)으로 약 2배(높이는 약 3.8배) 키우고, 위성에서 지구 쪽으로 **와이파이 원호 3겹이 0.8초 간격으로 퍼져 나가는** 애니메이션을 넣었습니다(궤도 진행 방향과 무관하게 항상 지구를 향함). 브랜드의 `//` 슬래시는 삭제해 `WORLD LIVE`만 표시합니다.

## 검증 결과 (v6, 2026-11-22 KST · 운영 페이지 1920×1080, 뷰포트 1920×993)

- **상단 버튼 순서**: `9분할 3×3 · 6분할 3×2 · 4분할 2×2 · 전체화면 1×1 · 전체 스크롤 ALL LIVE · 정렬` — `#btn-fullscreen`(FULL) 버튼 없음. 스크린샷 `downloads/world_live-screens/v6-topbar-order.png`, 버튼 확대 `v6-topbar-buttons-zoom.png`.
- **첫 화면 메뉴**: `마지막 화면 · 9분할 · 6분할 · 4분할 · 전체화면 · 전체 스크롤` 순서로 통일.
- **전체화면 버튼**: NHK를 청취 중인 9분할에서 클릭 → `document.fullscreenElement` 설정, `layout='1'`, `prevLayout='9'`, 타일 1개, `body.className='is-full'`(HUD 없음), 상단 바 `top=-67px`(화면 밖), 타일 오버레이 `opacity 0`, `stage padding 0`, `grid gap 0` → 순수 영상. 스크린샷 `v6-clean-full.png`. 이어 ESC → `layout='9'`·타일 9개·`prevLayout=null` 복귀 확인. 키 `4`로도 같은 동작.
- **모달 지역 라벨**: `font-size 13.5px, font-weight 700, color rgb(242,210,139)`, 그룹 수 배지 `rgb(255,239,205)` · `rgba(201,168,106,.16)` 배경 — 스크린샷 `v6-modal-regions.png`.
- **검색 반응**: `cnn` 입력 → AMERICAS 그룹만 표시(2장), `뉴스` 입력 → KOREA 그룹 1장(연합뉴스TV), 지우면 59장 복귀. 필터 비용 0.035ms/회(위 실측).
- **로고**: 8배 확대 `v6-globe-satellite-8x.png`(위성 2배·전파 3겹), 궤도 좌측 위치에서도 전파가 지구를 향함 `v6-globe-left-t5.png`. 브랜드 `//` 삭제 확인(상단 바 스크린샷).

## 구조

```
index.html          마크업 · 컨트롤 바(정렬·첫 화면 메뉴) · 소스 모달 · 채널 미리보기
css/style.css       딥네이비 주조정실 테마 + v4 상단 바/미리보기 + ALL 스크롤 그리드 + FULL 순수 영상 + v5 오디오 탤리/드래그 규칙
js/channels.js      채널 카탈로그(59개 항목) + 레이아웃별 기본 배치 + 지역 정렬 기준
js/app.js           레이아웃 엔진 · 지연 마운트 · 독립 배치 저장 · HLS 백업 폴백 · 내 순서
hls-multi.html      (개발용) HLS 다중 재생 프로브
yt-test.html        (개발용) YouTube 임베드 다채널 프로브
```
