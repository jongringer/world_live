/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — CHANNEL CATALOG  (v2 · 2026-11-22 KST)
   모든 소스는 이 페이지(https://jongringer.github.io/world_live/)에서
   실제로 iframe/HLS 재생이 되는지 브라우저로 확인한 것만 수록했습니다.
   kind: 'hls'      = .m3u8 (hls.js · CORS 확인) — 클릭 없이 즉시 재생
         'youtube'  = 채널 ID → embed/live_stream (현재 라이브 자동 추적)
         'youtube-video' = 영상 ID 고정
         'web'      = 방송사 정책상 삽입 불가 → 공식 페이지 새 창
   status: 'live'     = 24시간 상시 송출 (검증)
           'event'    = 뉴스 편성·속보 때만 라이브 (평소 OFFLINE)
           'external' = 페이지 내 재생 불가 → 공식 링크
   alt: true  = 같은 채널의 대체 소스(소스 선택 목록에만 표시)
   ═══════════════════════════════════════════════════════════════ */

const CHANNELS = [
  /* ── KOREA (국내 뉴스 · 최상단) ────────────────────────── */
  { id:'kbs24', name:'KBS NEWS 24', short:'KBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'zGFBJL_fhUU', status:'live' },

  { id:'ytn24', name:'YTN 24시간 라이브', short:'YTN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'aZyD6EPl6KU', status:'live' },

  { id:'yonhap24', name:'연합뉴스TV 라이브', short:'YTV', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube-video', src:'6QZ_qc75ihU', status:'live' },

  { id:'ytn', name:'YTN · 채널', short:'YTN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UChlgI3UHCOnwUGzWzbJ3H5w', status:'event', alt:true,
    note:'YTN 채널 라이브 자동 추적 — 속보·편성 시간대 송출(평소 OFFLINE).' },

  { id:'yonhap', name:'연합뉴스TV · 채널', short:'YTV', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCTHCOPwqNfZ0uiKOvFyhGwg', status:'event', alt:true,
    note:'연합뉴스TV 채널 라이브 자동 추적 — 편성 시간대 송출(평소 OFFLINE).' },

  { id:'mbc', name:'MBC NEWS', short:'MBC', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCF4Wxdo3inmxP-Y59wXDsFw', status:'event',
    note:'MBC 뉴스 — 뉴스 편성 시간대에 라이브 송출(현재 오프라인).' },

  { id:'sbs', name:'SBS 뉴스', short:'SBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCkinYTS9IHqOEwR1Sze2JTw', status:'event',
    note:'SBS 뉴스 — 뉴스 편성 시간대에 라이브 송출(현재 오프라인).' },

  { id:'jtbc', name:'JTBC NEWS', short:'JTBC', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCsU-I-vHLiaMfV_ceaYz5rQ', status:'event',
    note:'JTBC 뉴스룸 등 편성 시간대에 라이브 송출(현재 오프라인).' },

  { id:'mbn', name:'MBN News', short:'MBN', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCG9aFJTZ-lMCHAiO1KJsirg', status:'event',
    note:'MBN — 편성 시간대에 라이브 송출(현재 오프라인).' },

  { id:'channela', name:'채널A', short:'CHA', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCfq4V1DAuaojnr2ryvWNysw', status:'event',
    note:'채널A — 편성 시간대에 라이브 송출(현재 오프라인).' },

  { id:'tvchosun', name:'TV CHOSUN', short:'TVC', country:'한국', cc:'KR', zone:'KOREA',
    kind:'youtube', src:'UCuw1hxBo5mDVUhgMzRDk3aw', status:'event',
    note:'TV조선 — 편성 시간대에 라이브 송출(현재 오프라인).' },

  { id:'arirang', name:'아리랑 TV (ARIRANG)', short:'ARI', country:'한국', cc:'KR', zone:'KOREA',
    kind:'hls', src:'https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', status:'live' },

  { id:'tbs', name:'TBS 서울', short:'TBS', country:'한국', cc:'KR', zone:'KOREA',
    kind:'hls', src:'https://cdntv.tbs.seoul.kr/tbs/tbs_tv_web.smil/playlist.m3u8', status:'live' },

  /* ── ASIA / PACIFIC ─────────────────────────────────────────── */
  { id:'nhk', name:'NHK WORLD-JAPAN', short:'NHK', country:'일본', cc:'JP', zone:'ASIA',
    kind:'youtube', src:'UCSPEjw8F2nQDtmUKPFNF7_A', status:'live' },

  { id:'nhk_hls', name:'NHK WORLD-JAPAN · HLS', short:'NHK', country:'일본', cc:'JP', zone:'ASIA',
    kind:'hls', src:'https://cdn.pishow.tv/ott/live/455/master.m3u8', status:'live', alt:true },

  { id:'cna', name:'CNA', short:'CNA', country:'싱가포르', cc:'SG', zone:'ASIA',
    kind:'youtube', src:'UC83jt4dlz1Gjl58fzQrrKZg', status:'live' },

  { id:'cna_hls', name:'CNA · HLS', short:'CNA', country:'싱가포르', cc:'SG', zone:'ASIA',
    kind:'hls', src:'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8', status:'live', alt:true },

  { id:'cgtn', name:'CGTN', short:'CGTN', country:'중국', cc:'CN', zone:'ASIA',
    kind:'hls', src:'https://amg00405-rakutentv-cgtn-rakuten-i9tar.amagi.tv/master.m3u8', status:'live' },

  { id:'ndtv', name:'NDTV 24x7', short:'NDTV', country:'인도', cc:'IN', zone:'ASIA',
    kind:'hls', src:'https://web-ndtv24x7-uk.akamaized.net/hls/live/2109290/ndtv24x7uk/master.m3u8', status:'live' },

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

  /* ── OCEANIA ────────────────────────────────────────────────── */
  { id:'abcau', name:'ABC NEWS (AUSTRALIA)', short:'ABC', country:'호주', cc:'AU', zone:'OCEANIA',
    kind:'youtube', src:'UCVgO39Bk5sMo66-6o6Spn6Q', status:'live' },

  { id:'skyau', name:'SKY NEWS AUSTRALIA', short:'SKY', country:'호주', cc:'AU', zone:'OCEANIA',
    kind:'hls', src:'https://skynewsau-live.akamaized.net/hls/live/2002691/skynewsau-extra3/master.m3u8', status:'live' },

  /* ── AMERICAS ───────────────────────────────────────────────── */
  { id:'cnn', name:'CNN INTERNATIONAL', short:'CNN', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://d3bp6dwmpbdajl.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-ury0meh5m4nzm/index.m3u8', status:'live' },

  { id:'cnn_fast', name:'CNN FAST · GB', short:'CNN', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://d2sybdl23b9psq.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-bocx3i7bjz0dg/CNNFAST_GB.m3u8', status:'live', alt:true },

  { id:'abc', name:'ABC NEWS LIVE', short:'ABC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCBi2mrWuNuyYy4gbM6fU18Q', status:'live' },

  { id:'nbc', name:'NBC NEWS NOW', short:'NBC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCeY0bbntWzzVIaj2z3QigXg', status:'live' },

  { id:'bloomberg', name:'BLOOMBERG TV', short:'BBG', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCIALMKvObZNtJ6AmdCLP7Lg', status:'live' },

  { id:'cnbc', name:'CNBC', short:'CNBC', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCvJJ_dzjViJCoLf5uKUTwoA', status:'live' },

  { id:'scripps', name:'SCRIPPS NEWS', short:'SCR', country:'미국', cc:'US', zone:'AMERICAS',
    kind:'hls', src:'https://aka-live1050.delivery.roku.com/a48b72c9-5755-4ede-9dac-9e51e4ca5cc8/t2-origin/out/v1/live.m3u8', status:'live' },

  { id:'reuters', name:'REUTERS TV', short:'RTR', country:'영국', cc:'GB', zone:'AMERICAS',
    kind:'hls', src:'https://amg00453-reuters-amg00453c1-rakuten-uk-2110.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-rakutenuk/playlist.m3u8', status:'live' },

  { id:'cbc', name:'CBC NEWS NETWORK', short:'CBC', country:'캐나다', cc:'CA', zone:'AMERICAS',
    kind:'hls', src:'https://aka-live1050.delivery.roku.com/0c24a9ef-e9c3-485c-bf68-3f1ae5ef3e85/t2-origin/out/v1/live.m3u8', status:'live' },

  { id:'ntn24', name:'NTN24', short:'NTN', country:'콜롬비아', cc:'CO', zone:'AMERICAS',
    kind:'hls', src:'https://stream1.bitred.cl/ntn24/index.m3u8', status:'live' },

  /* ── EUROPE ─────────────────────────────────────────────────── */
  { id:'dw', name:'DW NEWS', short:'DW', country:'독일', cc:'DE', zone:'EUROPE',
    kind:'youtube', src:'UCknLrEdhRCp1aegoMqRaCZg', status:'live' },

  { id:'dwar', name:'DW عربية', short:'DW', country:'독일', cc:'DE', zone:'EUROPE',
    kind:'hls', src:'https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/master.m3u8', status:'live' },

  { id:'f24', name:'FRANCE 24 ENGLISH', short:'F24', country:'프랑스', cc:'FR', zone:'EUROPE',
    kind:'youtube', src:'UCQfwfsi5VrQ8yKZ-UWmAEFg', status:'live' },

  { id:'euronews', name:'EURONEWS ENGLISH', short:'EN', country:'유럽', cc:'EU', zone:'EUROPE',
    kind:'youtube', src:'UCSrZ3UV4jOidv8ppoVuvW9Q', status:'live' },

  { id:'gbnews', name:'GB NEWS', short:'GB', country:'영국', cc:'GB', zone:'EUROPE',
    kind:'hls', src:'https://amg01076-lightningintern-gbnewsau-samsungau-et7fz.amagi.tv/playlist/amg01076-lightningintern-gbnewsau-samsungau/playlist.m3u8', status:'live' },

  { id:'rtve', name:'RTVE 24H', short:'RTVE', country:'스페인', cc:'ES', zone:'EUROPE',
    kind:'hls', src:'https://rtvelivestream.rtve.es/rtvesec/24h/24h_main_dvr.m3u8', status:'live' },

  { id:'ert', name:'ERT NEWS', short:'ERT', country:'그리스', cc:'GR', zone:'EUROPE',
    kind:'hls', src:'https://ert-ucdn.broadpeak-aas.com/bpk-tv/ERTNews/default/index.m3u8', status:'live' },

  /* ── MIDDLE EAST ────────────────────────────────────────────── */
  { id:'aj', name:'AL JAZEERA ENGLISH', short:'AJ', country:'카타르', cc:'QA', zone:'MIDEAST',
    kind:'youtube', src:'UCNye-wNBqNL5ZzHSJj3l8Bg', status:'live' },

  { id:'aj_hls', name:'AL JAZEERA ENGLISH · HLS', short:'AJ', country:'카타르', cc:'QA', zone:'MIDEAST',
    kind:'hls', src:'https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8', status:'live', alt:true },

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

  /* ── AFRICA ─────────────────────────────────────────────────── */
  { id:'africanews', name:'AFRICANEWS', short:'AF', country:'아프리카', cc:'AF', zone:'AFRICA',
    kind:'youtube', src:'UC1_E8NeF5QHY2dtdLRBCCLA', status:'live' },

  { id:'sabc', name:'SABC NEWS', short:'SABC', country:'남아공', cc:'ZA', zone:'AFRICA',
    kind:'hls', src:'https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/master.m3u8', status:'live' },

  /* ── 외부 공식 링크 (페이지 내 재생 불가) ────────────────────── */
  { id:'bbc', name:'BBC NEWS · WATCH LIVE', short:'BBC', country:'영국', cc:'GB', zone:'EXTERNAL',
    kind:'web', src:'https://www.bbc.com/watch-live-news', status:'external',
    note:'BBC 뉴스 채널 라이브는 DASH 전용 송출+영국 지역 제한이라 페이지 내 삽입이 불가합니다. 새 창에서 공식 LIVE 페이지로 연결됩니다.' },

  { id:'sky', name:'SKY NEWS', short:'SKY', country:'영국', cc:'GB', zone:'EXTERNAL',
    kind:'web', src:'https://news.sky.com/watch-live', status:'external',
    note:'Sky News는 YouTube 임베드가 차단되어(오류 150) 공식 페이지에서만 재생됩니다.' },

  { id:'cbs', name:'CBS NEWS 24/7', short:'CBS', country:'미국', cc:'US', zone:'EXTERNAL',
    kind:'web', src:'https://www.cbsnews.com/live/', status:'external',
    note:'CBS News 24/7은 자사 사이트 전용 플레이어입니다(YouTube 임베드 차단).' },

  { id:'livenow', name:'LIVENOW FROM FOX', short:'LN', country:'미국', cc:'US', zone:'EXTERNAL',
    kind:'web', src:'https://www.livenowfox.com/', status:'external',
    note:'LiveNOW는 자사 사이트에서 24시간 재생되며 YouTube 임베드는 차단되어 있습니다.' },

  { id:'cctv13', name:'CCTV-13 뉴스', short:'C13', country:'중국', cc:'CN', zone:'EXTERNAL',
    kind:'web', src:'https://tv.cctv.com/live/cctv13/', status:'external',
    note:'CCTV-13은 중국 공식 웹 플레이어에서만 제공되며 외부 삽입이 차단되어 있습니다.' },

  { id:'tvbs', name:'TVBS NEWS', short:'TVBS', country:'대만', cc:'TW', zone:'EXTERNAL',
    kind:'web', src:'https://news.tvbs.com.tw/live', status:'external',
    note:'TVBS는 대만 지역 한정으로 YouTube 라이브가 잠겨 있어 공식 사이트에서 재생합니다.' }
];

/* 레이아웃별 기본 배치 — 4분할과 9분할은 서로 독립적으로 저장됩니다 */
const DEFAULT_SETS = {
  '9': ['cnn', 'kbs24', 'ytn24', 'nhk', 'aj', 'abc', 'dw', 'yonhap24', 'cna'],
  '4': ['kbs24', 'ytn24', 'yonhap24', 'cnn'],
  '6': ['cnn', 'kbs24', 'ytn24', 'yonhap24', 'nhk', 'aj'],
  '1': ['kbs24']
};

const KIND_LABEL = { youtube:'YT·LIVE', 'youtube-video':'YT·LIVE', hls:'HLS', web:'WEB' };
const ZONE_LABEL = {
  KOREA:'KOREA · 국내 뉴스',
  ASIA:'ASIA · PACIFIC', OCEANIA:'OCEANIA', AMERICAS:'AMERICAS', EUROPE:'EUROPE',
  MIDEAST:'MIDDLE EAST', AFRICA:'AFRICA', EXTERNAL:'외부 공식 링크 (새 창)', CUSTOM:'CUSTOM SOURCES'
};

const CHANNEL_BY_ID = CHANNELS.reduce((m, c) => (m[c.id] = c, m), {});
/* ALL LIVE 스크롤에 나오는 채널 = 페이지 내 재생이 검증된 상시 채널 */
const ALL_LIVE_IDS = CHANNELS.filter(c => !c.alt && c.kind !== 'web').map(c => c.id);
