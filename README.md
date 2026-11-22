# WORLD LIVE // GLOBAL NEWSROOM MONITOR (v3.1)

전 세계 **검증된 라이브 뉴스 채널 50여 개**를 16:9 데스크톱 모니터에서 동시에 보는 방송국 주조정실 스타일 멀티뷰.

- 운영 페이지: **https://jongringer.github.io/world_live/**
- 정적 단일 페이지 (HTML/CSS/JS) · GitHub Pages 배포 · 설치·로그인·서버 없음

## 레이아웃

| 버튼 | 구성 | 단축키 |
|---|---|---|
| 9분할 | 3×3 — 기본(KBS·YTN·연합 / NHK·CGTN·CNN FAST / BBC·ABC·Al Jazeera) | `1` |
| 4분할 | 2×2 — 기본(KBS·NHK·CNN FAST·BBC) | `2` |
| 6분할 | 3×2 | `3` |
| 전체 1×1 | 선택 채널 한 화면 | `4` |
| **전체 스크롤 ALL LIVE** | 전 세계 채널 3열(넓으면 4열) 16:9 그리드, 스크롤로 훑어보기 | `5` / `A` |
| FULL | 브라우저 전체화면 — **순수 영상만** | `F` |

그 밖에 `M` 전체 음소거, `R` 전체 재연결, `S` 소스 관리. 타일 더블클릭 = 그 채널 1×1.

## FULL 모드 — 순수 영상 (v3)

- FULL에 들어가면 상·하단 바뿐 아니라 **타일 안의 모든 오버레이**(좌상단 `LIVE · 채널명`, 우상단 `채널 변경 ▾`, 하단 호버 컨트롤)가 사라져 **영상만** 남습니다.
- **여백·간격 0**: 상단 바·하단 바가 화면 밖으로 나가고 `stage` 패딩과 그리드 gap, 타일 테두리까지 0이 되어 16:9 화면을 꽉 채웁니다.
- **원본 화면비 유지**: 타일은 `aspect-ratio 16/9`, 영상은 `object-fit: contain` — 늘어남·잘림 없이 레터박스로 맞춥니다. 화면비가 16:9가 아닌 창에서는 남는 쪽에만 검은 여백이 생깁니다(비율 보존).
- 화면 클릭 또는 상·하단 가장자리로 마우스를 보내면 HUD(상하단 바 + 타일 컨트롤)가 나타나고 **3.6초 뒤 자동으로 사라집니다**(`H` 키 토글).

## 상단 시각 표시

- **SEOUL KST · NEW YORK EST · PARIS CET** 3개만 표시합니다.

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
- **4분할·9분할·6분할·1×1의 배치는 각각 독립적으로 저장**됩니다.
- **첫 화면 설정**: 상단 ‘★ 첫 화면’ 메뉴에서 시작 레이아웃을 고르면 다음에 열 때 그 화면으로 시작합니다.

## KOREA · 국내 뉴스 (3사만 유지)

- **KBS NEWS 24** (`zGFBJL_fhUU`) · **YTN 24시간 라이브** (`aZyD6EPl6KU`) · **연합뉴스TV 라이브** (`6QZ_qc75ihU`) — 24시간 고정 라이브, 클릭 없이 즉시 자동재생.
- MBC·SBS·JTBC·MBN·채널A·TV조선·아리랑 TV·TBS는 카탈로그에서 제거했습니다. 저장된 옛 배치에 그 ID가 남아 있으면 불러올 때 걸러지고 기본 채널로 대체됩니다(`localStorage` `worldlive.v3` 마이그레이션).

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

레이아웃별 채널 배치(9/4/6/1) · 시작 화면 · 정렬 모드 · **내 순서** · 커스텀 소스 · 음성 상태가 `localStorage`(`worldlive.v3`)에 저장됩니다. 이전 `worldlive.v2`·`v1` 설정은 자동으로 마이그레이션되고, 없어진 채널 ID는 기본 채널로 대체됩니다. `?reset=1`로 초기화, `?layout=4|9|6|1|all`로 시작 레이아웃 지정도 가능합니다.

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
- **시각 표시**: SEOUL KST · NEW YORK EST · PARIS CET 3개 확인.

## 구조

```
index.html          마크업 · 컨트롤 바(정렬·첫 화면 메뉴) · 소스 모달
css/style.css       딥네이비 주조정실 테마 + ALL 스크롤 그리드 + FULL 순수 영상 규칙
js/channels.js      채널 카탈로그(59개 항목) + 레이아웃별 기본 배치 + 지역 정렬 기준
js/app.js           레이아웃 엔진 · 지연 마운트 · 독립 배치 저장 · HLS 백업 폴백 · 내 순서
hls-multi.html      (개발용) HLS 다중 재생 프로브
yt-test.html        (개발용) YouTube 임베드 다채널 프로브
```
