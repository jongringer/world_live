/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — CHANNEL CATALOG  (v3 · 2026-11-22 KST)
   모든 소스는 이 페이지(https://jongringer.github.io/world_live/)에서
   실제로 iframe/HLS 재생이 되는지 브라우저로 확인한 것만 수록했습니다.
   kind: 'hls'      = .m3u8 (hls.js · CORS 확인) — 클릭 없이 즉시 재생
         'youtube'  = 채널 ID → embed/live_stream (현재 라이브 자동 추적)
         'youtube-video' = 영상 ID 고정
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
    kind:'youtube', src:'UC83jt4dlz1Gjl58fzQrrKZg', status:'live' },

  { id:'cna_hls', name:'CNA · HLS', short:'CNA', country:'싱가포르', cc:'SG', zone:'ASIA',
    kind:'hls', src:'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8', status:'live', alt:true },

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

  { id:'nbc', name:'NBC NEWS NOW', short:'NBC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCeY0bbntWzzVIaj2z3QigXg', status:'live' },

  { id:'bloomberg', name:'BLOOMBERG TV', short:'BBG', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCIALMKvObZNtJ6AmdCLP7Lg', status:'live' },

  { id:'cnbc', name:'CNBC', short:'CNBC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCvJJ_dzjViJCoLf5uKUTwoA', status:'live' },

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
    kind:'youtube', src:'UC7fWeaHhqgM4Ry-RMpM2YYw', status:'live' },

  { id:'trt_hls', name:'TRT WORLD · HLS', short:'TRT', country:'튀르키예', cc:'TR', zone:'MIDEAST',
    kind:'hls', src:'https://tv-trtworld.medya.trt.com.tr/master.m3u8', status:'live', alt:true },

  { id:'i24', name:'i24NEWS ENGLISH', short:'i24', country:'이스라엘', cc:'IL', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/i24_ENGLISH/HLS/i24_ENGLISH.m3u8', status:'live' },

  { id:'iranintl', name:'IRAN INTERNATIONAL', short:'IRAN', country:'이란', cc:'IR', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/IRAN_INTERNATIONAL/HLS/IRAN_INTERNATIONAL.m3u8', status:'live' },

  { id:'k24', name:'KURDISTAN 24', short:'K24', country:'이라크', cc:'IQ', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/K24/HLS/K24.m3u8', status:'live' },

  { id:'rudaw', name:'RUDAW TV', short:'RUDAW', country:'이라크', cc:'IQ', zone:'MIDEAST',
    kind:'hls', src:'https://hlspackager.akamaized.net/live/DB/RUDAW/HLS/RUDAW.m3u8', status:'live' },

  /* ── OCEANIA ────────────────────────────────────────────────── */
  { id:'abcau', name:'ABC NEWS (AUSTRALIA)', short:'ABC', country:'호주', cc:'AU', zone:'OCEANIA',
    kind:'youtube', src:'UCVgO39Bk5sMo66-6o6Spn6Q', status:'live' },

  { id:'skyau', name:'SKY NEWS AUSTRALIA', short:'SKY', country:'호주', cc:'AU', zone:'OCEANIA',
    kind:'hls', src:'https://skynewsau-live.akamaized.net/hls/live/2002691/skynewsau-extra3/master.m3u8', status:'live' },

  /* ── AFRICA ─────────────────────────────────────────────────── */
  { id:'africanews', name:'AFRICANEWS', short:'AF', country:'아프리카', cc:'AF', zone:'AFRICA',
    kind:'youtube', src:'UC1_E8NeF5QHY2dtdLRBCCLA', status:'live' },

  { id:'sabc', name:'SABC NEWS', short:'SABC', country:'남아공', cc:'ZA', zone:'AFRICA',
    kind:'hls', src:'https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/master.m3u8', status:'live' },

  /* ── KOREA (국내 뉴스 · 지역순에서는 맨 뒤, ‘한국 우선’ 정렬에서 맨 앞) ── */
  { id:'kbs24', name:'KBS NEWS 24', short:'KBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'zGFBJL_fhUU', status:'live' },

  { id:'ytn24', name:'YTN 24시간 라이브', short:'YTN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'aZyD6EPl6KU', status:'live' },

  { id:'yonhap24', name:'연합뉴스TV 라이브', short:'YTV', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'6QZ_qc75ihU', status:'live' },

  /* ── 외부 공식 링크 (페이지 내 재생 불가) ────────────────────── */
  { id:'bbc_web', name:'BBC NEWS · WATCH LIVE', short:'BBC', country:'영국', cc:'GB', zone:'EXTERNAL',
    kind:'web', src:'https://www.bbc.com/watch-live-news', status:'external',
    note:'BBC 뉴스 채널 공식 LIVE 페이지입니다. 내장 BBC HLS가 지역 제한으로 막힐 때 여기서 시청하세요.' },

  { id:'cctv13', name:'CCTV-13 新闻', short:'C13', country:'중국', cc:'CN', zone:'EXTERNAL',
    kind:'web', src:'https://tv.cctv.com/live/cctv13/', status:'external',
    note:'CCTV-13은 자사 플레이어(HTML5 CDN LIVE DRM) 전용이라 페이지 안에서는 재생되지 않습니다. 새 창의 공식 페이지에서는 재생됩니다(2026-11-22 확인).' },

  { id:'sky', name:'SKY NEWS', short:'SKY', country:'영국', cc:'GB', zone:'EXTERNAL',
    kind:'web', src:'https://news.sky.com/watch-live', status:'external',
    note:'Sky News는 YouTube 임베드가 차단되어(오류 150) 공식 페이지에서만 재생됩니다.' },

  { id:'cbs', name:'CBS NEWS 24/7', short:'CBS', country:'미국', cc:'US', zone:'EXTERNAL',
    kind:'web', src:'https://www.cbsnews.com/live/', status:'external',
    note:'CBS News 24/7은 자사 사이트 전용 플레이어입니다(YouTube 임베드 차단).' },

  { id:'livenow', name:'LIVENOW FROM FOX', short:'LN', country:'미국', cc:'US', zone:'EXTERNAL',
    kind:'web', src:'https://www.livenowfox.com/', status:'external',
    note:'LiveNOW는 자사 사이트에서 24시간 재생되며 YouTube 임베드는 차단되어 있습니다.' },

  { id:'tvbs', name:'TVBS NEWS', short:'TVBS', country:'대만', cc:'TW', zone:'EXTERNAL',
    kind:'web', src:'https://news.tvbs.com.tw/live', status:'external',
    note:'TVBS는 대만 지역 한정으로 YouTube 라이브가 잠겨 있어 공식 사이트에서 재생합니다.' }
];

/* 로컬스토리지에 남아 있던, 더 이상 쓰지 않는 채널 ID — 불러올 때 걸러집니다 */
const RETIRED_IDS = [
  'ytn', 'yonhap', 'mbc', 'sbs', 'jtbc', 'mbn', 'channela', 'tvchosun', 'arirang', 'tbs', 'nhk_hls'
];

/* 레이아웃별 기본 배치 — 4분할과 9분할은 서로 독립적으로 저장됩니다 */
const DEFAULT_SETS = {
  '9': ['kbs24', 'ytn24', 'yonhap24', 'nhk', 'cgtn', 'cnn_fast', 'bbc', 'abc', 'aj'],
  '4': ['kbs24', 'nhk', 'cnn_fast', 'bbc'],
  '6': ['kbs24', 'ytn24', 'yonhap24', 'nhk', 'cgtn', 'cnn_fast'],
  '1': ['kbs24']
};

const KIND_LABEL = { youtube:'YT·LIVE', 'youtube-video':'YT·LIVE', hls:'HLS', iframe:'PAGE', web:'WEB' };
const ZONE_LABEL = {
  KOREA:'KOREA · 국내 뉴스',
  ASIA:'ASIA · 일본·중국·아시아', AMERICAS:'AMERICAS · 미주',
  EUROPE:'EUROPE · 영국·유럽', MIDEAST:'MIDDLE EAST · 중동',
  OCEANIA:'OCEANIA · 오세아니아', AFRICA:'AFRICA · 아프리카',
  EXTERNAL:'외부 공식 링크 (새 창)', CUSTOM:'CUSTOM SOURCES'
};
/* 지역·국가순 정렬 기준 — 일본·중국(아시아) → 미국(미주) → 영국·유럽 → 중동 → 나머지 → 한국(맨 뒤) */
const ZONE_ORDER = ['ASIA', 'AMERICAS', 'EUROPE', 'MIDEAST', 'OCEANIA', 'AFRICA', 'KOREA', 'EXTERNAL', 'CUSTOM'];

const CHANNEL_BY_ID = CHANNELS.reduce((m, c) => (m[c.id] = c, m), {});
/* ALL LIVE 스크롤에 나오는 채널 = 페이지 내 재생이 검증된 상시 채널 */
/* 전체 스크롤(ALL LIVE)에 나오는 채널 = 페이지 안에서 라이브 신호가 들어오는 채널만
   (외부 공식 링크·미송출/점검 채널은 소스 라이브러리에만 남기고 전체 스크롤에서는 뺌)
   — 2026-11-22 브라우저 실측: 아래 HLS 35개 + YouTube 15개 모두 재생 확인 */
const ALL_LIVE_IDS = CHANNELS.filter(c => !c.alt && c.kind !== 'web' && c.status === 'live').map(c => c.id);
