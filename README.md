# WORLD LIVE // GLOBAL NEWSROOM MONITOR

해외 주요 외신의 **24시간 라이브 피드**를 16:9 데스크톱 모니터 한 화면에서 동시에 모니터링하는 방송국 주조정실 스타일 멀티뷰입니다.

- 운영 페이지: **https://jongringer.github.io/world_live/**
- 정적 단일 페이지 (HTML/CSS/JS) · GitHub Pages 배포 · 설치·로그인·서버 없음

---

## 레이아웃

| 버튼 | 구성 | 단축키 |
|---|---|---|
| 9분할 | 3×3 — 기본값, 모든 타일 16:9 즉시 동시 재생 | `1` |
| 4분할 | 2×2 | `2` |
| 6분할 | 3×2 | `3` |
| 전체 1×1 | 선택한 채널 한 화면 + 브라우저 Fullscreen | `4` |
| FULL | 브라우저 전체화면 토글 | `F` |

그 밖에 `M` 전체 음소거, `R` 전체 피드 재연결, `S` 소스 관리.

- 타일 더블클릭 = 그 채널만 1×1 전체화면
- 타일 호버 시 하단에 소스 변경 · 단독 청취 · 1×1 · 새 창 · 새로고침 버튼이 나타납니다.
- 한 채널의 음성을 켜면 나머지 채널은 자동으로 음소거됩니다(단독 청취).

## 채널 (기본 24개 슬롯 소스)

기본 9분할: **NHK WORLD-JAPAN · CGTN · CNN Headlines · ABC News Live · BBC News · Al Jazeera English · Sky News · DW News · France 24 English**

소스 교체 목록에는 NBC News NOW, CBS News, LiveNOW from FOX, Fox News, AP, Bloomberg TV Asia, CNBC, Reuters TV, ABC News(호주), Euronews, TRT World, Sky News Arabia, France 24(프랑스어), Al Jazeera Arabic, CCTV-13 등이 포함되어 있습니다.

### 소스 유형

- **YT · LIVE** — 채널 ID로 `youtube.com/embed/live_stream?channel=…` 을 사용합니다. 방송사가 라이브를 끊고 새 라이브를 시작해도 **항상 채널의 현재 라이브를 자동으로 따라갑니다**(영상 ID 고정 방식과 달리 하루 만에 죽지 않음).
- **HLS** — `.m3u8` 을 hls.js로 직접 재생합니다(CNN Headlines·Bloomberg Asia·CNA·Reuters TV·Al Jazeera Arabic). YouTube에 24시간 뉴스 피드가 없는 채널을 채우기 위한 경로입니다.
- **WEB · 외부** — 방송사가 iframe 삽입을 차단한 경우. 가짜 재생 화면을 만들지 않고, 타일에 이유를 표시하고 **공식 라이브 새 창** 버튼을 제공합니다(CCTV-13).

## 커스텀 소스

`SOURCES`(≡) → 아래 **CUSTOM SOURCE** 입력란에서 아래 형식을 모두 받습니다.

- YouTube 채널 ID — `UC…` (24자)
- YouTube 채널 주소 — `https://www.youtube.com/channel/UC…`
- YouTube 영상 — `https://www.youtube.com/watch?v=…`, `youtu.be/…`, 영상 ID 11자
- HLS — `https://…/index.m3u8`
- 일반 웹 주소 — `https://…` (외부 임베드 시도 + 새 창 열기)

> YouTube `@핸들` 주소는 브라우저에서 채널 ID로 바꿀 수 없어 지원하지 않습니다. 채널 페이지 → 정보 → **채널 ID 공유**의 `UC…` 값을 넣어 주세요.

## 저장

레이아웃 · 슬롯별 소스 · 커스텀 소스 · 포커스 · 음소거 상태가 `localStorage`(`worldlive.v1`)에 자동 저장되어, 다음 방문 때 그대로 복원됩니다.

## 검증 결과 (2026-11-22 KST 기준)

| 채널 | 소스 | 확인 내용 |
|---|---|---|
| NHK WORLD-JAPAN | YT 채널 | 라이브 송출 중, 임베드 허용 |
| CGTN | YT 채널 | 24/7 라이브, 임베드 허용 |
| CNN Headlines | HLS (Amagi 공식 FAST) | 매니페스트·세그먼트 200, CORS 허용 |
| ABC News Live | YT 채널 | 24/7 라이브 |
| BBC News | YT 채널 | 라이브 송출 중, 임베드 허용 |
| Al Jazeera English | YT 채널 | 24/7 라이브 (HLS `getaj.net` 도 검증) |
| Sky News | YT 채널 | 24/7 라이브 |
| DW News | YT 채널 | 24/7 라이브 (HLS `dwamdstream102` 도 검증) |
| France 24 English | YT 채널 | 24/7 라이브 |
| CNA | HLS (CloudFront) | 200, CORS 허용 |
| Bloomberg TV Asia | HLS (bloomberg.com) | 200, CORS `*` |
| Reuters TV | HLS (Amagi FAST) | 200, CORS 허용 |
| CCTV-13 | WEB | 공식 웹 플레이어만 제공 → 새 창 |
| CBS·Fox·AP·LiveNOW | YT 채널 | 24/7 고정이 아니라 **속보/행사 라이브 위주** (방송이 없을 때 타일에 OFFLINE 표시) |

## 구조

```
index.html          마크업 · 컨트롤 바 · 소스 모달
css/style.css       딥네이비 주조정실 테마 (골드/시안/에메랄드)
js/channels.js      채널 카탈로그 (검증된 소스 목록)
js/app.js           레이아웃 엔진 · 플레이어 마운트 · 저장 · 소스 관리
```

YouTube 임베드는 `enablejsapi=1` + postMessage로 제어(음소거·상태 확인)하며, iframe을 직접 만들어 9개를 동시에 띄웁니다. 타일 비율은 뷰포트에 맞춰 JS가 정확히 16:9로 계산해 여백만 남기고 꽉 채웁니다.
