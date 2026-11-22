/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — CHANNEL CATALOG
   2026-11-22 (KST) 실제 브라우저 재생 검증 결과를 그대로 반영.
   kind: 'youtube'       = 채널 ID → embed/live_stream (현재 라이브 자동 추적)
         'youtube-video' = 영상 ID 고정 (24/7 고정 라이브)
         'hls'           = .m3u8 (hls.js)
         'web'           = 외부 웹 플레이어 — 임베드/지역 제한으로 새 창 재생
   status: 'live' = 페이지 내 즉시 재생 확인
           'event' = 속보·행사 라이브 위주 (방송 없으면 OFFLINE)
           'external' = 방송사 정책상 iframe 재생 불가 → 공식 새 창
   ═══════════════════════════════════════════════════════════════ */

const CHANNELS = [
  /* ── ASIA / PACIFIC ─────────────────────────────── */
  { id:'nhk', name:'NHK WORLD-JAPAN', short:'NHK', country:'JAPAN', cc:'JP', zone:'ASIA',
    kind:'youtube', src:'UCSPEjw8F2nQDtmUKPFNF7_A', status:'live' },

  { id:'cna', name:'CNA', short:'CNA', country:'SINGAPORE', cc:'SG', zone:'ASIA',
    kind:'youtube', src:'UC83jt4dlz1Gjl58fzQrrKZg', status:'live' },

  { id:'abcau', name:'ABC NEWS AUSTRALIA', short:'ABC', country:'AUSTRALIA', cc:'AU', zone:'ASIA',
    kind:'youtube', src:'UCVgO39Bk5sMo66-6o6Spn6Q', status:'live' },

  { id:'cctv13', name:'CCTV-13 뉴스', short:'C13', country:'CHINA', cc:'CN', zone:'ASIA',
    kind:'web', src:'https://tv.cctv.com/live/cctv13/', status:'external',
    note:'CCTV-13은 중국 공식 웹 플레이어에서만 제공되며 외부 페이지 삽입이 차단되어 있습니다.' },

  { id:'cgtn', name:'CGTN', short:'CGTN', country:'CHINA', cc:'CN', zone:'ASIA',
    kind:'web', src:'https://www.cgtn.com/live', status:'external',
    note:'CGTN 라이브는 YouTube 임베드가 막혀 있어(오류 150) 공식 사이트에서 재생해야 합니다.' },

  /* ── AMERICAS ───────────────────────────────────── */
  { id:'cnn', name:'CNN HEADLINES', short:'CNN', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'youtube-video', src:'GotlA1KKWoo', status:'live' },

  { id:'abc', name:'ABC NEWS LIVE', short:'ABC', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCBi2mrWuNuyYy4gbM6fU18Q', status:'live' },

  { id:'nbc', name:'NBC NEWS NOW', short:'NBC', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCeY0bbntWzzVIaj2z3QigXg', status:'live' },

  { id:'bloomberg', name:'BLOOMBERG TV', short:'BBG', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCIALMKvObZNtJ6AmdCLP7Lg', status:'live' },

  { id:'cnbc', name:'CNBC', short:'CNBC', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCvJJ_dzjViJCoLf5uKUTwoA', status:'live' },

  { id:'fox', name:'FOX NEWS', short:'FOX', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'youtube', src:'UCXIJgqnII2ZOINSWNOGFThA', status:'event' },

  { id:'cbs', name:'CBS NEWS 24/7', short:'CBS', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'web', src:'https://www.cbsnews.com/live/', status:'external',
    note:'CBS News 라이브는 자사 사이트에서만 재생됩니다(YouTube 임베드 차단).' },

  { id:'ap', name:'ASSOCIATED PRESS', short:'AP', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'web', src:'https://apnews.com/live', status:'external',
    note:'AP는 상시 채널이 아니라 속보 라이브만 송출하며, YouTube 임베드가 차단되어 있습니다.' },

  { id:'livenow', name:'LIVENOW FROM FOX', short:'LN', country:'UNITED STATES', cc:'US', zone:'AMERICAS',
    kind:'web', src:'https://www.livenowfox.com/', status:'external',
    note:'LiveNOW는 자사 사이트에서 24시간 재생되며 YouTube 임베드는 차단되어 있습니다.' },

  /* ── EUROPE ─────────────────────────────────────── */
  { id:'dw', name:'DW NEWS', short:'DW', country:'GERMANY', cc:'DE', zone:'EUROPE',
    kind:'youtube', src:'UCknLrEdhRCp1aegoMqRaCZg', status:'live' },

  { id:'france24', name:'FRANCE 24 ENGLISH', short:'F24', country:'FRANCE', cc:'FR', zone:'EUROPE',
    kind:'youtube', src:'UCQfwfsi5VrQ8yKZ-UWmAEFg', status:'live' },

  { id:'euronews', name:'EURONEWS ENGLISH', short:'EN', country:'EUROPE', cc:'EU', zone:'EUROPE',
    kind:'youtube', src:'UCSrZ3UV4jOidv8ppoVuvW9Q', status:'live' },

  { id:'trt', name:'TRT WORLD', short:'TRT', country:'TÜRKİYE', cc:'TR', zone:'EUROPE',
    kind:'youtube', src:'UC7fWeaHhqgM4Ry-RMpM2YYw', status:'live' },

  { id:'bbc', name:'BBC NEWS', short:'BBC', country:'UNITED KINGDOM', cc:'UK', zone:'EUROPE',
    kind:'web', src:'https://www.bbc.com/news', status:'external',
    note:'BBC News 라이브는 영국 외 지역에서 시청이 제한됩니다(방송사 지역 제한).' },

  { id:'sky', name:'SKY NEWS', short:'SKY', country:'UNITED KINGDOM', cc:'UK', zone:'EUROPE',
    kind:'web', src:'https://news.sky.com/watch-live', status:'external',
    note:'Sky News 라이브는 YouTube 임베드가 차단되어 있어(오류 150) 자사 페이지에서 재생해야 합니다.' },

  /* ── MIDDLE EAST ────────────────────────────────── */
  { id:'aj', name:'AL JAZEERA ENGLISH', short:'AJ', country:'QATAR', cc:'QA', zone:'MIDEAST',
    kind:'youtube', src:'UCNye-wNBqNL5ZzHSJj3l8Bg', status:'live' },

  { id:'ajhls', name:'AL JAZEERA ENGLISH · HLS', short:'AJ', country:'QATAR', cc:'QA', zone:'MIDEAST',
    kind:'hls', src:'https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8', status:'live' },

  { id:'ajarab', name:'AL JAZEERA ARABIC', short:'AJأ', country:'QATAR', cc:'QA', zone:'MIDEAST',
    kind:'hls', src:'https://live-hls-apps-aja-fa.getaj.net/AJA/01.m3u8', status:'live' },

  { id:'skyarabia', name:'SKY NEWS ARABIA', short:'SKY', country:'UAE', cc:'AE', zone:'MIDEAST',
    kind:'youtube', src:'UCIJXOvggjKtCagMfxvcCzAA', status:'live' },

  { id:'skyarabia_hls', name:'SKY NEWS ARABIA · HLS', short:'SKY', country:'UAE', cc:'AE', zone:'MIDEAST',
    kind:'hls', src:'https://live-stream.skynewsarabia.com/c-horizontal-channel/horizontal-stream/index.m3u8', status:'live' }
];

/* 기본 9분할 — 전 채널 페이지 내 동시 재생 검증 완료 */
const DEFAULT_SLOTS = ['nhk', 'cnn', 'abc', 'aj', 'nbc', 'dw', 'france24', 'euronews', 'trt'];

const KIND_LABEL = { youtube:'YT·LIVE', 'youtube-video':'YT·LIVE', hls:'HLS', web:'WEB' };

const CHANNEL_BY_ID = CHANNELS.reduce((m, c) => (m[c.id] = c, m), {});
