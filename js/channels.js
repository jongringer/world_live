/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — CHANNEL CATALOG  (v3 · 2026-11-22 KST)
   모든 소스는 이 페이지(https://jongringer.github.io/world_live/)에서
   실제로 iframe/HLS 재생이 되는지 브라우저로 확인한 것만 수록했습니다.
   kind: 'hls'      = .m3u8 (hls.js · CORS 확인) — 클릭 없이 즉시 재생
         'youtube'  = 채널 ID → embed/live_stream (현재 라이브 자동 추적)
         'youtube-video' = 영상 ID 고정
         'kbs'      = KBS 공식 온에어 API가 내려주는 서명 .m3u8 (매일 바뀌지 않음)
         'mbn'      = MBN 공식 온에어 서명 .m3u8 — mbn.co.kr 인증 API가 매번 새 서명을 내려줌
         'web'      = 방송사 정책상 삽입 불가 → 공식 페이지 새 창
   status: 'live'     = 24시간 상시 송출 (검증)
           'event'    = 뉴스 편성·속보 때만 라이브 (평소 OFFLINE)
           'external' = 페이지 내 재생 불가 → 공식 링크
   backup: .m3u8 백업 주소 — 1차 주소가 치명적 오류를 내면 자동 전환
   alt: true  = 같은 채널의 대체 소스(소스 선택 목록에만 표시)

   지역 순서(지역·국가순 정렬 기준) =
     ASIA(일본·중국 먼저) → AMERICAS → EUROPE → MIDDLE EAST → OCEANIA → AFRICA → KOREA(맨 뒤) → EXTERNAL
   ※ ‘한국 우선’ 정렬을 고르면 KBS·YTN·연합뉴스TV가 맨 앞으로 옵니다.
   ═══════════════════════════════════════════════════════════════ */

const CHANNELS = [
  /* ── ASIA / PACIFIC (일본·중국 먼저) ────────────────────────── */
  { id:'nhk', name:'NHK WORLD-JAPAN', short:'NHK', country:'일본', cc:'JP', zone:'ASIA',
    kind:'hls', src:'https://masterpl.hls.nhkworld.jp/hls/w/live/master.m3u8', status:'live' },

  { id:'nhk_yt', name:'NHK WORLD-JAPAN · YouTube', short:'NHK', country:'일본', cc:'JP', zone:'ASIA',
    kind:'youtube', src:'UCSPEjw8F2nQDtmUKPFNF7_A', status:'live', alt:true },

  { id:'cgtn', name:'CGTN ENGLISH', short:'CGTN', country:'중국', cc:'CN', zone:'ASIA',
    kind:'hls',
    src:'https://english-livebkali.cgtn.com/live/encgtn.m3u8',
    backup:'https://amg00405-rakutentv-cgtn-rakuten-i9tar.amagi.tv/master.m3u8',
    status:'live' },

  { id:'ndtv', name:'NDTV 24x7', short:'NDTV', country:'인도', cc:'IN', zone:'ASIA',
    kind:'hls',
    src:'https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8',
    backup:'https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/ndtv24x7master.m3u8',
    status:'live' },

  { id:'cna', name:'CNA', short:'CNA', country:'싱가포르', cc:'SG', zone:'ASIA',
    kind:'hls', src:'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8', status:'live' },

  { id:'cna_yt', name:'CNA · YouTube', short:'CNA', country:'싱가포르', cc:'SG', zone:'ASIA',
    kind:'youtube', src:'UC83jt4dlz1Gjl58fzQrrKZg', status:'live', alt:true },

  { id:'indiatoday', name:'INDIA TODAY', short:'IT', country:'인도', cc:'IN', zone:'ASIA',
    kind:'hls', src:'https://d2lk5u59tns74c.cloudfront.net/out/v1/d4435039c7d1433d9b9d0b6cdc9dd4ff/index.m3u8', status:'live' },

  { id:'abp', name:'ABP NEWS', short:'ABP', country:'인도', cc:'IN', zone:'ASIA',
    kind:'hls', src:'https://abpmitv.akamaized.net/hls/live/2042842/abpnews/master.m3u8', status:'live' },

  { id:'aajtak', name:'AAJ TAK', short:'AT', country:'인도', cc:'IN', zone:'ASIA',
    kind:'hls', src:'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8', status:'live' },

  { id:'ddnews', name:'DD NEWS', short:'DD', country:'인도', cc:'IN', zone:'ASIA',
    kind:'hls', src:'https://mumbai-edge.smartplaytv.in/DDNews/index.m3u8', status:'live' },

  { id:'metrotv', name:'METRO TV', short:'METRO', country:'인도네시아', cc:'ID', zone:'ASIA',
    kind:'hls', src:'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', status:'live' },

  { id:'nationtv', name:'NATION TV', short:'NATION', country:'태국', cc:'TH', zone:'ASIA',
    kind:'hls', src:'https://live-us1.thaimomo.com/live-as/chNation-3/playlist.m3u8', status:'live' },

  /* ── AMERICAS (미국 등 미주) ───────────────────────────────── */
  { id:'cnn_fast', name:'CNN FAST', short:'CNN', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls',
    src:'https://d3hnx79nr9mhdw.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-1u2levt4fksmr/CNNFAST_GB.m3u8',
    backup:'https://d2sybdl23b9psq.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-bocx3i7bjz0dg/CNNFAST_GB.m3u8',
    status:'live' },

  { id:'abc', name:'ABC NEWS LIVE', short:'ABC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls',
    src:'https://abc-news-dmd-streams-1.akamaized.net/out/v1/701126012d044971b3fa89406a440133/index_6.m3u8',
    backup:'https://abc-news-dmd-streams-1.akamaized.net/out/v1/701126012d044971b3fa89406a440133/index.m3u8',
    status:'live' },

  { id:'abc_yt', name:'ABC NEWS LIVE · YouTube', short:'ABC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCBi2mrWuNuyYy4gbM6fU18Q', status:'live', alt:true },

  { id:'cnn', name:'CNN INTERNATIONAL', short:'CNN', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://d3bp6dwmpbdajl.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-ury0meh5m4nzm/index.m3u8', status:'live' },

  /* NBC News NOW — 2026-11-25 소스 교체.
     채널 라이브(embed/live_stream?channel=UCeY0bbntWzzVIaj2z3QigXg)는 NBC News가 막아
     "이 동영상은 볼 수 없습니다"가 뜬다(oEmbed·브라우저 실측). NBC News는 24시간 라이브를
     'LIVE: NBC News NOW - Nov. 24'처럼 **매일 새 영상으로 갈아 끼우므로** 현재 라이브 영상 ID를
     고정하고, 채널 ID는 끊겼을 때의 자동 전환용으로 함께 적어 둔다. ID가 오래되면 이 칸은
     OFFLINE이 되므로 주기적으로 갱신해야 한다(하단 ytChannel·web 참고). */
  { id:'nbc', name:'NBC NEWS NOW', short:'NBC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube-video', src:'dlQf_B0OGrA', ytChannel:'UCeY0bbntWzzVIaj2z3QigXg', status:'live',
    web:'https://www.youtube.com/@NBCNews/live',
    note:'NBC News 공식 유튜브의 24시간 라이브 — NBC News는 하루에 한 번 새 라이브 영상으로 갈아 끼우기 때문에 고정 영상 ID(dlQf_B0OGrA = 2026-11-27 06시 기준 라이브, \'LIVE: NBC News NOW - Nov. 26\')로 붙여 두었습니다. 방송일이 바뀌면 이 칸이 OFFLINE이 되므로 그때는 소스 변경에서 그날 라이브 ID를 넣거나 @NBCNews/live를 새 창으로 여세요.' },

  { id:'ap', name:'AP (ASSOCIATED PRESS)', short:'AP', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UC52X5wxOL_s5yw0dQk7NtgA', fallbackVideo:'aR9ZWFNQjCE', status:'live',
    web:'https://www.youtube.com/@AssociatedPress/streams',
    note:'AP 통신 공식 라이브(@AssociatedPress) — 현장 생중계가 열리면 실시간으로 자동 연결하고, 현장 중계 사이 공백 시간에는 가장 최근 AP 현장 라이브 브리핑을 재생합니다.' },

  { id:'cbs', name:'CBS NEWS 24/7', short:'CBS', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8', status:'live',
    web:'https://www.cbsnews.com/live/',
    note:'CBS News 24/7 공식 실시간 HLS 스트림을 페이지 안에서 바로 재생합니다.' },

  { id:'bloomberg', name:'BLOOMBERG TV', short:'BBG', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls',
    src:'https://www.bloomberg.com/media-manifest/streams/us.m3u8',
    backup:'https://www.bloomberg.com/media-manifest/streams/asia.m3u8',
    status:'live',
    web:'https://www.bloomberg.com/live' },

  { id:'bloomberg_yt', name:'BLOOMBERG TV · YouTube', short:'BBG', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCIALMKvObZNtJ6AmdCLP7Lg', status:'live', alt:true },

  { id:'cnbc', name:'CNBC', short:'CNBC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCvJJ_dzjViJCoLf5uKUTwoA', status:'live' },

  /* 경제뉴스 9분할 — 미국 경제 채널 */
  { id:'yahoo_fin', name:'YAHOO FINANCE', short:'YHOO', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://d1ewctnvcwvvvu.cloudfront.net/playlist.m3u8', status:'live',
    web:'https://www.youtube.com/@YahooFinance/live',
    note:'Yahoo Finance 24시간 공식 HLS 스트림을 페이지 안에서 바로 재생합니다.' },

  { id:'yahoo_fin_yt', name:'YAHOO FINANCE · YouTube', short:'YHOO', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube-video', src:'KQp-e_XQnDE', ytChannel:'UCEAZeUIeJs0IjQiqTCdVSIg', status:'live', alt:true },

  { id:'fox_biz', name:'FOX BUSINESS', short:'FBN', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube-video', src:'P-SvyILdsYc', ytChannel:'UCCXoCcu9Rp7NPbTzIvogpZg', status:'live',
    web:'https://www.youtube.com/@FoxBusiness/live',
    note:'FOX Business 라이브(공식 유튜브 @FoxBusiness) — 미국 장 시간 중심으로 송출됩니다. 방송사가 새 라이브로 갈아 끼우면 채널 라이브로 자동 전환됩니다.' },

  { id:'scripps', name:'SCRIPPS NEWS', short:'SCR', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://aka-live1050.delivery.roku.com/a48b72c9-5755-4ede-9dac-9e51e4ca5cc8/t2-origin/out/v1/live.m3u8', status:'live' },

  { id:'cbc', name:'CBC NEWS NETWORK', short:'CBC', country:'캐나다', cc:'CA', zone:'AMERICAS',
    kind:'hls', src:'https://aka-live1050.delivery.roku.com/0c24a9ef-e9c3-485c-bf68-3f1ae5ef3e85/t2-origin/out/v1/live.m3u8', status:'live' },

  { id:'ntn24', name:'NTN24', short:'NTN', country:'콜롬비아', cc:'CO', zone:'AMERICAS',
    kind:'hls', src:'https://stream1.bitred.cl/ntn24/index.m3u8', status:'live' },

  /* ── EUROPE (영국·유럽) ─────────────────────────────────────── */
  { id:'bbc', name:'BBC NEWS', short:'BBC', country:'영국', cc:'GB', zone:'EUROPE',
    kind:'hls',
    src:'https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv10/b=1604032/main.m3u8',
    backup:'https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8',
    status:'live',
    note:'BBC 뉴스 채널 HLS — 영국 외 지역에서 차단되면 백업 주소로, 그래도 실패하면 공식 페이지로 연결됩니다.' },

  { id:'sky', name:'SKY NEWS', short:'SKY', country:'영국', cc:'GB', zone:'EUROPE',
    kind:'hls', src:'https://linear901-oo-hls0-prd-gtm.delivery.skycdp.com/17501/sde-fast-skynews/master.m3u8', status:'live',
    web:'https://news.sky.com/watch-live',
    note:'Sky News 실시간 HLS 스트림을 페이지 안에서 바로 재생합니다.' },

  { id:'f24', name:'FRANCE 24 ENGLISH', short:'F24', country:'프랑스', cc:'FR', zone:'EUROPE',
    kind:'hls', src:'https://live.france24.com/hls/live/2037218/F24_EN_HI_HLS/master_5000.m3u8', status:'live' },

  { id:'f24_yt', name:'FRANCE 24 ENGLISH · YouTube', short:'F24', country:'프랑스', cc:'FR', zone:'EUROPE',
    kind:'youtube', src:'UCQfwfsi5VrQ8yKZ-UWmAEFg', status:'live', alt:true },

  { id:'dw', name:'DW NEWS', short:'DW', country:'독일', cc:'DE', zone:'EUROPE',
    kind:'hls', src:'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8', status:'live' },

  { id:'dw_yt', name:'DW NEWS · YouTube', short:'DW', country:'독일', cc:'DE', zone:'EUROPE',
    kind:'youtube', src:'UCknLrEdhRCp1aegoMqRaCZg', status:'live', alt:true },

  { id:'dwar', name:'DW عربية', short:'DW', country:'독일', cc:'DE', zone:'EUROPE',
    kind:'hls', src:'https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/master.m3u8', status:'live' },

  { id:'euronews', name:'EURONEWS ENGLISH', short:'EN', country:'유럽', cc:'EU', zone:'EUROPE',
    kind:'youtube', src:'UCSrZ3UV4jOidv8ppoVuvW9Q', status:'live' },

  /* 경제뉴스 9분할 — 유럽 경제 채널 (2026-11-25 03:40 실측: 유튜브 임베드 재생 확인) */
  { id:'euronewsbiz', name:'EURONEWS BUSINESS', short:'EN·BIZ', country:'유럽', cc:'EU', zone:'EUROPE',
    kind:'youtube-video', src:'P9RhDCtXuww', ytChannel:'UCB8qu8bhAiV8BOJK9ERzZ3Q', status:'live',
    web:'https://www.youtube.com/@euronewsbusiness/live',
    note:'유로뉴스 비즈니스 라이브(공식 유튜브 @euronewsbusiness) — 유럽 경제·시장 소식 중심. 방송사가 새 라이브로 갈아 끼우면 채널 라이브로 자동 전환됩니다.' },

  { id:'reuters', name:'REUTERS TV', short:'RTR', country:'영국', cc:'GB', zone:'EUROPE',
    kind:'hls', src:'https://amg00453-reuters-amg00453c1-rakuten-uk-2110.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-rakutenuk/playlist.m3u8', status:'live' },

  { id:'gbnews', name:'GB NEWS', short:'GB', country:'영국', cc:'GB', zone:'EUROPE',
    kind:'hls', src:'https://amg01076-lightningintern-gbnewsau-samsungau-et7fz.amagi.tv/playlist/amg01076-lightningintern-gbnewsau-samsungau/playlist.m3u8', status:'live' },

  { id:'rtve', name:'RTVE 24H', short:'RTVE', country:'스페인', cc:'ES', zone:'EUROPE',
    kind:'hls', src:'https://rtvelivestream.rtve.es/rtvesec/24h/24h_main_dvr.m3u8', status:'live' },

  { id:'ert', name:'ERT NEWS', short:'ERT', country:'그리스', cc:'GR', zone:'EUROPE',
    kind:'hls', src:'https://ert-ucdn.broadpeak-aas.com/bpk-tv/ERTNews/default/index.m3u8', status:'live' },

  /* ── MIDDLE EAST (알자지라 등) ──────────────────────────────── */
  { id:'aj', name:'AL JAZEERA ENGLISH', short:'AJ', country:'카타르', cc:'QA', zone:'MIDEAST',
    kind:'hls',
    src:'https://live-hls-apps-aje-fa.getaj.net/AJE/03.m3u8',
    backup:'https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8',
    status:'live' },

  { id:'aj_yt', name:'AL JAZEERA ENGLISH · YouTube', short:'AJ', country:'카타르', cc:'QA', zone:'MIDEAST',
    kind:'youtube', src:'UCNye-wNBqNL5ZzHSJj3l8Bg', status:'live', alt:true },

  { id:'aja', name:'AL JAZEERA ARABIC', short:'AJ', country:'카타르', cc:'QA', zone:'MIDEAST',
    kind:'hls', src:'https://live-hls-apps-aja-fa.getaj.net/AJA/01.m3u8', status:'live' },

  { id:'ajm24', name:'AL JAZEERA MUBASHER', short:'AJM', country:'카타르', cc:'QA', zone:'MIDEAST',
    kind:'hls', src:'https://live-hls-apps-ajm24-fa.getaj.net/AJM24/index.m3u8', status:'live' },

  { id:'skyarabia', name:'SKY NEWS ARABIA', short:'SKY', country:'아랍에미리트', cc:'AE', zone:'MIDEAST',
    kind:'hls', src:'https://live-stream.skynewsarabia.com/c-horizontal-channel/horizontal-stream/index.m3u8', status:'live' },

  { id:'alarabiya', name:'AL ARABIYA', short:'AR', country:'사우디아라비아', cc:'SA', zone:'MIDEAST',
    kind:'hls', src:'https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8', status:'live' },

  { id:'asharq', name:'ASHARQ NEWS', short:'ASQ', country:'사우디아라비아', cc:'SA', zone:'MIDEAST',
    kind:'hls', src:'https://live-news.asharq.com/asharq.m3u8', status:'live' },

  { id:'trt', name:'TRT WORLD', short:'TRT', country:'튀르키예', cc:'TR', zone:'MIDEAST',
    kind:'hls', src:'https://tv-trtworld.medya.trt.com.tr/master.m3u8', status:'live' },

  { id:'trt_yt', name:'TRT WORLD · YouTube', short:'TRT', country:'튀르키예', cc:'TR', zone:'MIDEAST',
    kind:'youtube', src:'UC7fWeaHhqgM4Ry-RMpM2YYw', status:'live', alt:true },

  { id:'i24', name:'i24NEWS ENGLISH', short:'i24', country:'이스라엘', cc:'IL', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/i24_ENGLISH/HLS/i24_ENGLISH.m3u8', status:'live' },

  { id:'iranintl', name:'IRAN INTERNATIONAL', short:'IRAN', country:'이란', cc:'IR', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/IRAN_INTERNATIONAL/HLS/IRAN_INTERNATIONAL.m3u8', status:'live' },

  { id:'k24', name:'KURDISTAN 24', short:'K24', country:'이라크', cc:'IQ', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/K24/HLS/K24.m3u8', status:'live' },

  { id:'rudaw', name:'RUDAW TV', short:'RUDAW', country:'이라크', cc:'IQ', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/RUDAW/HLS/RUDAW.m3u8', status:'live' },

  /* ── OCEANIA (아시아·태평양 권역으로 통합) ───────────────────── */
  { id:'abcau', name:'ABC NEWS (AUSTRALIA)', short:'ABC', country:'호주', cc:'AU', zone:'ASIA',
    kind:'youtube', src:'UCVgO39Bk5sMo66-6o6Spn6Q', status:'live' },

  { id:'skyau', name:'SKY NEWS AUSTRALIA', short:'SKY', country:'호주', cc:'AU', zone:'ASIA',
    kind:'hls', src:'https://skynewsau-live.akamaized.net/hls/live/2002691/skynewsau-extra3/master.m3u8', status:'live' },

  /* ── AFRICA (중동·아프리카 권역으로 통합) ────────────────────── */
  { id:'africanews', name:'AFRICANEWS', short:'AF', country:'아프리카', cc:'AF', zone:'MIDEAST',
    kind:'youtube', src:'UC1_E8NeF5QHY2dtdLRBCCLA', status:'live' },

  { id:'sabc', name:'SABC NEWS', short:'SABC', country:'남아공', cc:'ZA', zone:'MIDEAST',
    kind:'hls', src:'https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/master.m3u8', status:'live' },

  /* ── KOREA (국내 뉴스 · 지역순에서는 맨 뒤, ‘한국 우선’ 정렬에서 맨 앞) ── */
  /* KBS NEWS 24 — KBS 공식 온에어 실시간 스트림 (onair.kbs.co.kr · 채널코드 81)
     유튜브 24시간 라이브는 방송사가 매일 새 영상으로 갈아 끼워 주소가 바뀌므로,
     공식 온에어 API가 내려주는 서명된 .m3u8 주소를 화면에서 받아 hls.js로 직접 재생한다.
     (서명 유효 48시간 · 열 때마다 새로 받음 · 대한민국 IP에서만 주소가 내려옴) */
  { id:'kbs24', name:'KBS NEWS 24', short:'KBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'kbs', src:'81', status:'live',
    api:'https://cfpwwwapi.kbs.co.kr/api/v1/landing/live/channel_code/81',
    web:'https://onair.kbs.co.kr/index.html?sname=onair&stype=live&ch_code=81&ch_type=globalList',
    note:'KBS 공식 온에어(onair.kbs.co.kr)의 KBS NEWS 24 실시간 주소를 그때그때 받아 재생합니다. 해외 IP에서는 KBS가 주소를 주지 않아 공식 페이지로 안내합니다.' },

  /* YTN — YTN 공식 온에어(www.ytn.co.kr 라이브 플레이어)가 쓰는 실시간 HLS
     (flowplayer + hls.js · 1920×1080 30fps 단일 화질 · CORS `*` · 토큰·Referer 없음 · 2026-11-24 실측)
     유튜브 라이브(aZyD6EPl6KU)는 재생 버튼을 눌러야 할 때가 있어 공식 HLS로 바꿨다.
     HLS가 막히면 소스 라이브러리의 'YTN · YouTube'(ytn_yt)로 바꿔 볼 수 있다. */
  { id:'ytn24', name:'YTN 24시간 라이브', short:'YTN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'hls', src:'https://ylive.ytn.co.kr/live/20221013_ytnlive/playlist.m3u8', status:'live',
    web:'https://www.ytn.co.kr/_hd/hd_live.html',
    note:'YTN 공식 온에어의 1080p 실시간 스트림을 클릭 없이 바로 재생합니다.' },

  { id:'ytn_yt', name:'YTN · YouTube', short:'YTN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'aZyD6EPl6KU', status:'live', alt:true },

  /* 연합뉴스TV — 공식 홈페이지(www.yonhapnewstv.co.kr/live · m.yonhapnewstv.co.kr/live)가
     자사 HLS 없이 YouTube(6QZ_qc75ihU)만 삽입하고 있어 유튜브 소스를 그대로 쓴다.
     (2026-11-24 실측: 사이트·모바일 페이지·JS 어디에도 .m3u8 없음 · KakaoTV livelink는 서비스 종료로 죽음) */
  { id:'yonhap24', name:'연합뉴스TV 라이브', short:'YTV', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'6QZ_qc75ihU', status:'live' },

  /* ── 국내뉴스 9분할 전용 — 각 방송사 공식 뉴스 채널 (2026-11-24 실측)
     MBC·SBS·JTBC·TV조선·채널A의 '방송 채널 자체' 온에어는 다음 이유로
     페이지 안(hls.js)에서 돌릴 수 없어, 각 사가 공식 뉴스 채널로 운영하는
     유튜브 라이브를 채널 ID(kind:'youtube')로 연결했다. 채널 ID 방식이라
     방송사가 라이브 영상을 새로 열어도 자동으로 따라간다.
       · MBC  : 온에어 API(mediaapi.imbc.com)가 CORS를 onair.imbc.com 으로 고정 → 외부 페이지 호출 차단
       · SBS  : apis.sbs.co.kr 는 열려 있으나 실시간 스트림이 60초 미리보기 후 로그인 요구
       · JTBC : onair API(api.jtbc.co.kr)가 'Invalid CORS request'로 외부 출처 거부
       · TV조선: 온에어 CDN이 http 전용·인증서 불일치, 공식 페이지는 X-Frame-Options: SAMEORIGIN
       · 채널A : 온에어 페이지가 유튜브 iframe 플레이어라 결국 유튜브 라이브가 원천
     OBS는 2026-11-25 사용자 요청으로 국내뉴스 9분할에서 빼고 MBN으로 교체했다
     (OBS는 유튜브 라이브 편성이 없어 상시 OFFLINE이었고, 온에어는 vod.obs.co.kr:444 접속 불가 +
      공식 페이지 X-Frame-Options: SAMEORIGIN). */

  { id:'mbcnews', name:'MBC 뉴스', short:'MBC', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'q9bM12ucTIY', status:'live',
    web:'https://onair.imbc.com/',
    note:'MBCNEWS가 24시간 내보내는 생방송([ON AIR] 24시간 최신 MBC뉴스)을 고정 영상으로 연결합니다 — 2026-11-24 23:2x 실측 재생·임베드 허용 확인. 방송사가 이 스트림을 새로 열면 소스 라이브러리의 ‘MBC 뉴스 · 자동’으로 바꿔 주세요.' },

  { id:'mbcnews_auto', name:'MBC 뉴스 · 자동', short:'MBC', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCF4Wxdo3inmxP-Y59wXDsFw', status:'live', alt:true,
    note:'MBCNEWS 채널의 그때그때 라이브를 따라갑니다(채널 ID 방식). 고정 스트림이 끊겼을 때 대체 소스로 쓰세요.' },

  { id:'sbsnews', name:'SBS 뉴스', short:'SBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'PdveEbAsXDQ', status:'live', ytChannel:'UCkinYTS9IHqOEwR1Sze2JTw',
    web:'https://www.sbs.co.kr/live/S01',
    note:'SBS 뉴스가 내보내는 \'SBS 실시간 라이브\'를 고정 영상으로 연결합니다(2026-11-27 06시 교체 — 이전 ID fPR37xbV1Fc는 다시보기로 끝남, 현 라이브는 \'[LIVE] SBS 모닝와이드/ 11/27(금)\'). SBS는 실시간 라이브를 수시로 새 영상으로 갈아 끼우므로, 끊기면 소스 라이브러리에서\nSBS 실시간 라이브의 새 주소로 바꿔 주세요. SBS play 온에어 페이지는 60초 미리보기 뒤 로그인을 요구해 쓸 수 없습니다.' },

  { id:'sbsnews_auto', name:'SBS 뉴스 · 자동', short:'SBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCkinYTS9IHqOEwR1Sze2JTw', status:'live', alt:true,
    note:'SBS 뉴스 채널의 그때그때 라이브를 따라갑니다(채널 ID 방식). SBS는 이 방식의 임베드가 막히는 경우가 많아 대체 소스로만 둡니다.' },

  { id:'sbsbiz', name:'SBS Biz 뉴스 · YouTube', short:'SBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCbMjg2EvXs_RUGW-KrdM3pw', status:'live', alt:true,
    note:'SBS 계열 24시간 경제뉴스 채널(SBS Biz) 유튜브 라이브 — SBS 뉴스가 비어 있을 때 대체 소스' },

  /* MBN — 공식 온에어(mbn.co.kr/vod/onair)의 HLS를 그대로 쓴다.
     · 인증 API  https://www.mbn.co.kr/player/mbnStreamAuth_new_live.mbn?vod_url=<원본 m3u8>
       → CloudFront 서명이 붙은 .m3u8 주소를 text/plain으로 돌려준다(CORS `*` · 서명 만료 후 재요청)
     · 원본 1000k(1280×720) / 600k 두 화질 — 1000k가 1차, 600k가 백업
     · 실제 방송 채널(MBN 종합편성)의 24시간 온에어라 뉴스 편성 여부와 상관없이 계속 나온다
     · 2026-11-25 실측: 인증 API 200 + 서명 주소로 playlist.m3u8 200(m3u8·세그먼트 CORS `*`) */
  { id:'mbnnews', name:'MBN 뉴스', short:'MBN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'mbn', src:'https://hls-live.mbn.co.kr/mbn-on-air/1000k/playlist.m3u8', status:'live',
    api:'https://www.mbn.co.kr/player/mbnStreamAuth_new_live.mbn',
    backup:'https://hls-live.mbn.co.kr/mbn-on-air/600k/playlist.m3u8',
    web:'https://www.mbn.co.kr/vod/onair',
    note:'MBN 공식 온에어(1280×720 HLS)를 그때그때 받은 서명 주소로 재생합니다. 서명이 만료되거나 끊기면 자동으로 새 주소를 받아 다시 붙습니다.' },

  { id:'mbnnews_yt', name:'MBN 뉴스 · YouTube', short:'MBN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCG9aFJTZ-lMCHAiO1KJsirg', status:'live', alt:true,
    note:'MBN News 공식 유튜브 채널의 그때그때 라이브(채널 ID 방식). 온에어 HLS가 막힐 때 대체 소스로 쓰세요.' },

  { id:'jtbcnews', name:'JTBC 뉴스', short:'JTBC', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'T766fBH1uAw', status:'live', ytChannel:'UCsU-I-vHLiaMfV_ceaYz5rQ',
    web:'https://onair.jtbc.co.kr/',
    note:'JTBC 뉴스가 내보내는 실시간 라이브를 고정 영상으로 연결합니다(2026-11-27 06시 교체 — 이전 ID jS9Lmur6uj4는 이슈PLAY 다시보기로 끝남, 현 라이브는 이진우 리트 관련 단독 보도). JTBC 온에어 API는 외부 출처(CORS)를 거부해 페이지 안 재생이 불가합니다. 방송사가 새 라이브로 갈아 끼우면 소스 라이브러리에서 새 주소로 바꿔 주세요.' },

  { id:'tvchosun_news', name:'TV조선 뉴스', short:'TV조선', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'BfDQWinXFAg', status:'live', ytChannel:'UCWlV3Lz_55UaX4JsMj-z__Q',
    web:'https://broadcast.tvchosun.com/onair/on.cstv',
    note:'뉴스TVCHOSUN이 내보내는 이슈PLAY 실시간 라이브를 고정 영상으로 연결합니다(2026-11-27 06시 교체 — 이전 ID kNjmaq4AqGQ는 다시보기로 끝남, 현 라이브는 국힘 의총·조작 징계 의혹 논의 속보). TV조선 온에어 스트림은 http 전용·인증서 불일치로 https 화면에서 재생되지 않습니다. 방송사가 새 라이브로 갈아 끼우면 새 주소로 바꿔 주세요.' },

  { id:'channela_news', name:'채널A 뉴스', short:'채널A', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'bjsFfNb7Q6w', status:'live', ytChannel:'UCfq4V1DAuaojnr2ryvWNysw',
    web:'https://www.ichannela.com/com/cmm/onair.do',
    note:'채널A 뉴스가 내보내는 이슈를 켜라 실시간 라이브를 고정 영상으로 연결합니다(2026-11-27 06시 교체 — 이전 ID nb89DLTtYCw는 남동공단 화재 속보로 끝남, 현 라이브는 국힘 최고위 아수라장 속보). 방송사가 새 라이브로 갈아 끼우면 새 주소로 바꿔 주세요.' },

  /* ── 경제뉴스 9분할 전용 — 한국 경제 채널 (2026-11-25 실측)
     사용자 지시(2026-11-25 03:33): "한국은 한국경제 매일경제 삼프로 같은 유튜브 매체부터 라이브하는
     전세계 경제뉴스채널만 모아줘. 야간에는 오선의 미증시 활성화해주고."
     · 한국경제TV / 매일경제TV / 삼프로TV : 공식 유튜브의 24시간·장중 라이브
     · 오선의 미증시(@futuresnow) : 평일 밤 21:00~05:00(미국 장 시간)에만 라이브가 열린다
       → 채널 ID(live_stream)로 걸어 두면 밤에 라이브가 열릴 때 자동으로 따라간다(낮에는 대기).
     · 고정 영상(youtube-video)은 방송사가 새 라이브로 갈아 끼우면 끊기므로,
       ytChannel(채널 ID)을 함께 적어 두어 끊긴 뒤에는 채널 라이브로 한 번 자동 전환된다. */
  { id:'hktv', name:'한국경제TV', short:'한경', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'VlaCnp1fxI8', ytChannel:'UCF8AeLlUbEpKju6v1H6p8Eg', status:'live',
    web:'https://www.wowtv.co.kr/LiveCenter/Live/',
    note:'한국경제TV 라이브(공식 유튜브)를 고정 영상으로 연결합니다 — 2026-11-25 15시 교체(이전 ID jYCUaFdAGUw는 당잠사 다시보기로 끝남, 현 라이브는 24시간 [한국경제TV LIVE]). 채널이 아침·장중마다 새 라이브로 갈아 끼우므로 끊기면 새 주소로 바꿔 주세요.' },

  { id:'mktv', name:'매일경제TV', short:'매경', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'s9xL1DpBsfQ', ytChannel:'UCnfwIKyFYRuqZzzKBDt6JOA', status:'live',
    web:'https://mbnmoney.mbn.co.kr/',
    note:'매일경제TV 24시간 라이브(공식 유튜브 @mkeconomy_tv)를 고정 영상으로 연결합니다 — 2026-11-25 06:10 교체(이전 ID _as5avhckoM은 다시보기로 끝남).' },

  { id:'sampro', name:'삼프로TV', short:'삼프로', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'eXAueXZo6dM', ytChannel:'UChlv4GSd7OQl3js-jkLOnFA', status:'live',
    web:'https://www.youtube.com/@3protv/live',
    note:'삼프로TV(경제의 신과 함께) 라이브를 고정 영상으로 연결합니다 — 2026-11-27 06시 교체(이전 ID VzvtFMbVxi4는 26일 오후 방송 전체보기 다시보기, 현 라이브는 월스트리트 모닝브리핑 26.11.27). 장 마감 뒤에도 편성 라이브가 이어지고, 방송사가 새 라이브로 갈아 끼우면 채널 라이브로 자동 전환됩니다.' },

  { id:'osun', name:'오선의 미증시', short:'오선', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UC_JJ_NhRqPKcIOj5Ko3W_3w', status:'live',
    /* 시간대 자동 전환 (2026-11-25 사용자 요청): 한국 시각 21:00~06:30 은 오선의 미증시,
       그 외 시간은 이 칸이 서울경제TV(24시간 경제 라이브)로 자동 교체된다. */
    timeSlot: { from:'21:00', to:'06:30', alt:'seoulecon' },
    web:'https://www.youtube.com/@futuresnow/live',
    note:'오선의 미증시(@futuresnow) — 평일 밤 21:00~06:30 미국 장 라이브를 채널 그대로 띄웁니다. 그 외 시간에는 이 칸이 서울경제TV로 자동 전환됩니다(사용자가 바꾼 배치는 그대로 유지).' },

  /* 서울경제TV — 오선의 미증시가 없는 낮 시간(06:30~21:00)을 채우는 24시간 경제 라이브.
     채널이 24시간 트레이딩 라이브를 운영하지만 방송사가 가끔 새 영상으로 갈아 끼운다
     (2026-11-25 06:10 실측: 이전 ID 0k8ekcI7MJE는 라이브가 아니었고 채널의 현재 라이브는 ciA-0rInLwQ). */
  { id:'seoulecon', name:'서울경제TV', short:'서울경제', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'ciA-0rInLwQ', ytChannel:'UC3p-0EWA8OXko2EUDUXAy5w', status:'live',
    web:'https://www.youtube.com/@seouleconomytv/live',
    note:'서울경제TV 24시간 트레이딩 라이브(공식 유튜브) — 임베드·재생 확인(2026-11-25 06:10 교체). 오선의 미증시가 쉬는 낮 시간대에 그 칸을 채우며, 방송사가 새 라이브로 갈아 끼우면 채널 라이브로 자동 전환됩니다.' },

  /* ── 외부 공식 링크 (페이지 내 재생 불가) ────────────────────── */
  { id:'bbc_web', name:'BBC NEWS · WATCH LIVE', short:'BBC', country:'영국', cc:'GB', zone:'EXTERNAL',
    kind:'web', src:'https://www.bbc.com/watch-live-news', status:'external',
    note:'BBC 뉴스 채널 공식 LIVE 페이지입니다. 내장 BBC HLS가 지역 제한으로 막힐 때 여기서 시청하세요.' },

  { id:'cctv13', name:'CCTV-13 新闻', short:'C13', country:'중국', cc:'CN', zone:'EXTERNAL',
    kind:'web', src:'https://tv.cctv.com/live/cctv13/', status:'external',
    note:'CCTV-13은 자사 플레이어(HTML5 CDN LIVE DRM) 전용이라 페이지 안에서는 재생되지 않습니다. 새 창의 공식 페이지에서는 재생됩니다(2026-11-22 확인).' },

  { id:'livenow', name:'LIVENOW FROM FOX', short:'LN', country:'미국', cc:'US', zone:'EXTERNAL',
    kind:'web', src:'https://www.livenowfox.com/', status:'external',
    note:'LiveNOW는 자사 사이트에서 24시간 재생되며 YouTube 임베드는 차단되어 있습니다.' },

  { id:'tvbs', name:'TVBS NEWS', short:'TVBS', country:'대만', cc:'TW', zone:'EXTERNAL',
    kind:'web', src:'https://news.tvbs.com.tw/live', status:'external',
    note:'TVBS는 대만 지역 한정으로 YouTube 라이브가 잠겨 있어 공식 사이트에서 재생합니다.' }
];

/* 로컬스토리지에 남아 있던, 더 이상 쓰지 않는 채널 ID — 불러올 때 걸러집니다 */
const RETIRED_IDS = [
  'ytn', 'yonhap', 'mbc', 'sbs', 'jtbc', 'mbn', 'channela', 'tvchosun', 'arirang', 'tbs', 'nhk_hls',
  'obsnews', 'obstv'   // 2026-11-25 OBS 삭제(사용자 요청) — 국내뉴스 4번 칸은 MBN으로 교체
];

/* 저장된 배치에 남아 있는 옛 채널을 같은 자리의 새 채널로 바꿔 준다.
   (OBS를 빼고 MBN을 넣을 때 4번 칸이 밀리지 않고 그대로 MBN이 되도록) */
const SLOT_REPLACE = { obsnews: 'mbnnews', obstv: 'mbnnews', cna_hls: 'cna', trt_hls: 'trt' };

/* 레이아웃별 기본 배치 — 4분할과 9분할은 서로 독립적으로 저장됩니다
   ※ 2026-11-24 사용자가 확정한 기본 순서(DEFAULT_SETS) — 모든 분할에서 YTN → 연합뉴스TV → KBS 순
      4분할 = YTN · 연합뉴스TV · KBS NEWS 24 · CNN INTERNATIONAL
      9분할 = YTN · 연합뉴스TV · KBS · CNN INTERNATIONAL · BBC · ABC · 알자지라 · 이란(IRAN INTERNATIONAL) · 프랑스(FRANCE 24) */
const DEFAULT_SETS = {
  '9': ['ytn24', 'yonhap24', 'kbs24', 'cnn', 'bbc', 'abc', 'aj', 'iranintl', 'f24'],
  '4': ['ytn24', 'yonhap24', 'kbs24', 'cnn'],
  '6': ['ytn24', 'yonhap24', 'kbs24', 'cnn', 'bbc', 'abc'],
  '1': ['ytn24'],
  /* 국내뉴스 9분할 — 사용자가 정한 순서 그대로 (2026-11-25 03:40 변경):
     YTN → 연합뉴스TV → KBS → MBC → SBS → JTBC → TV조선 → MBN → 채널A
     (PC 3×3·스마트폰 1열 모두 이 순서 · 4번 칸 OBS는 MBN으로 교체됨) */
  'kr': ['ytn24', 'yonhap24', 'kbs24', 'mbcnews', 'sbsnews', 'jtbcnews', 'tvchosun_news', 'mbnnews', 'channela_news'],
  /* 경제뉴스 9분할 — 2026-11-25 사용자 지시 순서 그대로:
     한국 경제(한국경제TV → 매일경제TV → 삼프로TV → 오선의 미증시) → 미국 경제(Bloomberg → CNBC → Yahoo Finance → Fox Business) → 유럽(Euronews Business) */
  'econ': ['hktv', 'mktv', 'sampro', 'osun', 'bloomberg', 'cnbc', 'yahoo_fin', 'fox_biz', 'euronewsbiz']
};

const KIND_LABEL = { youtube:'YT·LIVE', 'youtube-video':'YT·LIVE', hls:'HLS', kbs:'KBS·ONAIR', mbn:'MBN·ONAIR', iframe:'PAGE', web:'WEB' };
const ZONE_LABEL = {
  KOREA:'한국 · KOREA',
  AMERICAS:'미주 · AMERICAS',
  EUROPE:'유럽 · EUROPE',
  ASIA:'아시아 · 태평양 · ASIA-PACIFIC',
  MIDEAST:'중동 · 아프리카 · MIDDLE EAST & AFRICA',
  CUSTOM:'커스텀 소스 · CUSTOM',
  EXTERNAL:'외부 공식 링크 · EXTERNAL'
};
/* 대륙순 정렬 기준 — 한국 → 미주 → 유럽 → 아시아·태평양 → 중동·아프리카 */
const ZONE_ORDER = ['KOREA', 'AMERICAS', 'EUROPE', 'ASIA', 'MIDEAST', 'CUSTOM', 'EXTERNAL'];

const CHANNEL_BY_ID = CHANNELS.reduce((m, c) => (m[c.id] = c, m), {});

/* 이 카탈로그의 빌드 표식 — 화면 하단 신호 스트립에 표시됩니다.
   휴대폰이 옛 파일(브라우저 캐시)을 불러왔는지 이 한 줄로 확인할 수 있고,
   채널·소스를 고칠 때마다 이 값과 index.html의 ?v= 를 함께 올려 주세요. */
const CHANNELS_BUILD = 'SRC 11-27a';
const CHANNELS_BUILD_DETAIL = '2026-11-27 06시 라이브 점검(끊긴 고정 영상 6개 교체 — NBC·SBS·JTBC·TV조선·채널A·삼프로TV / Fox Business·Euronews Business는 라이브 없어 유지)';

/* 다시 재생되지 않는 예전 소스 ID → 지금 쓰는 소스로 자동 교체
   (브라우저에 저장된 커스텀 소스에 옛 ID가 남아 있어도 되살아나지 않게) */
const RETIRED_SOURCES = {
  'zGFBJL_fhUU': 'nfnWxzTVJA4',
  /* 2026-11-25 15시 라이브 점검 — 끝난 고정 영상 → 그 채널의 현 라이브 */
  '13rFWn3k36s': '-LSuaW99Bn0',   // NBC NEWS NOW (Nov. 24 → 26일 라이브로 이어짐)
  'P_vVzEcKnWU': 'KQp-e_XQnDE',   // YAHOO FINANCE · YouTube
  'OcND87a_81M': 'tfkVdYyfRKA',   // SBS 뉴스
  'cHX4x5a3KTI': '0RFcERYa4Rc',   // JTBC 뉴스
  'b8k7ZZvUAac': 'uT2gq5O1XVI',   // TV조선 뉴스
  's20KqsSKv3g': 'DIET0hTJkHk',   // 채널A 뉴스
  'jYCUaFdAGUw': 'VlaCnp1fxI8',   // 한국경제TV
  'lH9LC1sf2Ps': 'KtnvpzjdIjg',   // 삼프로TV
  /* 2026-11-26 06시 라이브 점검 — 끝난 고정 영상 → 그 채널의 현 라이브 */
  '8igLkrFYQ8k': '-LSuaW99Bn0',   // NBC NEWS NOW (Nov. 25 라이브)
  'DVd9L41SiNY': 'tfkVdYyfRKA',   // SBS 뉴스
  'sAPSbaHz1l0': '0RFcERYa4Rc',   // JTBC 뉴스
  'f-vK8xAidcw': 'uT2gq5O1XVI',   // TV조선 뉴스
  'xwivjKVQ89k': 'DIET0hTJkHk',   // 채널A 뉴스
  'p7VzsJTeqmw': 'KtnvpzjdIjg',   // 삼프로TV
  /* 2026-11-26 15시 라이브 점검 — 끝난 고정 영상 → 그 채널의 현 라이브 */
  '-LSuaW99Bn0': '9ERRSqJNoSQ',   // NBC NEWS NOW (Nov. 25 → Nov. 26 라이브)
  'tfkVdYyfRKA': 'fPR37xbV1Fc',   // SBS 뉴스
  '0RFcERYa4Rc': 'jS9Lmur6uj4',   // JTBC 뉴스
  'uT2gq5O1XVI': 'kNjmaq4AqGQ',   // TV조선 뉴스
  'DIET0hTJkHk': 'nb89DLTtYCw',   // 채널A 뉴스
  'KtnvpzjdIjg': 'VzvtFMbVxi4',   // 삼프로TV
  /* 2026-11-27 06시 라이브 점검 — 끝난 고정 영상 → 그 채널의 현 라이브 */
  '9ERRSqJNoSQ': 'dlQf_B0OGrA',   // NBC NEWS NOW (Nov. 26 라이브)
  'fPR37xbV1Fc': 'PdveEbAsXDQ',   // SBS 뉴스
  'jS9Lmur6uj4': 'T766fBH1uAw',   // JTBC 뉴스
  'kNjmaq4AqGQ': 'BfDQWinXFAg',   // TV조선 뉴스
  'nb89DLTtYCw': 'bjsFfNb7Q6w',   // 채널A 뉴스
  'VzvtFMbVxi4': 'eXAueXZo6dM'    // 삼프로TV
};
/* 유튜브 KBS NEWS 24 라이브 ID(nfnWxzTVJA4)는 2026-11-24 방송 종료로 재생 불가 —
   내장 채널은 공식 온에어(kind:'kbs')로 교체했고, 저장된 커스텀 소스에 남은 ID는
   아래 목록에서 걸러 낸다(치환할 새 ID가 없으므로 제거). */
const DEAD_SOURCES = ['nfnWxzTVJA4'];
/* ALL LIVE 스크롤에 나오는 채널 = 페이지 내 재생이 검증된 상시 채널 */
/* 전체 스크롤(ALL LIVE)에 나오는 채널 = 페이지 안에서 라이브 신호가 들어오는 채널만
   (외부 공식 링크·미송출/점검 채널은 소스 라이브러리에만 남기고 전체 스크롤에서는 뺌)
   — 2026-11-22 브라우저 실측: 아래 HLS 35개 + YouTube 15개 모두 재생 확인 */
const ALL_LIVE_IDS = CHANNELS.filter(c => !c.alt && c.kind !== 'web' && c.status === 'live').map(c => c.id);
