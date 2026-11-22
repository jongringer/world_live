/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — CHANNEL CATALOG
   모든 소스는 2026-11-22 (KST) 실제 접속 검증 기준.
   kind: 'youtube' = 채널 ID → embed/live_stream (현재 라이브 자동 추적)
         'youtube-video' = 영상 ID 고정
         'hls'   = .m3u8 (hls.js)
         'web'   = 외부 웹 플레이어 (임베드 차단 → 새 창)
   ═══════════════════════════════════════════════════════════════ */

const CHANNELS = [
  /* ── ASIA / PACIFIC ─────────────────────────────── */
  { id:'nhk',       name:'NHK WORLD-JAPAN',      short:'NHK',  country:'JAPAN',        cc:'JP', zone:'ASIA', kind:'youtube', src:'UCSPEjw8F2nQDtmUKPFNF7_A', status:'live' },
  { id:'cgtn',      name:'CGTN',                 short:'CGTN', country:'CHINA',        cc:'CN', zone:'ASIA', kind:'youtube', src:'UCgrNz-aDmcr2uuto8_DL2jg', status:'live' },
  { id:'cctv13',    name:'CCTV-13 뉴스',          short:'C13',  country:'CHINA',        cc:'CN', zone:'ASIA', kind:'web',     src:'https://tv.cctv.com/live/cctv13/', status:'external' },
  { id:'cna',       name:'CNA',                  short:'CNA',  country:'SINGAPORE',    cc:'SG', zone:'ASIA', kind:'hls',     src:'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8', status:'live' },
  { id:'abcau',     name:'ABC NEWS AUSTRALIA',   short:'ABC',  country:'AUSTRALIA',    cc:'AU', zone:'ASIA', kind:'youtube', src:'UCVgO39Bk5sMo66-6o6Spn6Q', status:'live' },

  /* ── AMERICAS ───────────────────────────────────── */
  { id:'cnn',       name:'CNN Headlines',        short:'CNN',  country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'hls', src:'https://amg01918-cnnus-amg01918c1-vizio-us-1813.playouts.now.amagi.tv/playlist/amg01918-cnnus-cnnheadlines-vizious/playlist.m3u8', status:'live' },
  { id:'abc',       name:'ABC NEWS LIVE',        short:'ABC',  country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UCBi2mrWuNuyYy4gbM6fU18Q', status:'live' },
  { id:'nbc',       name:'NBC NEWS NOW',         short:'NBC',  country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UCeY0bbntWzzVIaj2z3QigXg', status:'live' },
  { id:'cbs',       name:'CBS NEWS',             short:'CBS',  country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UC8p1vwvWtl6T73JiExfWs1g', status:'event' },
  { id:'livenow',   name:'LIVENOW FROM FOX',     short:'LN',   country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UCyEUZXhmHr2rXGVHqX4gt7g', status:'event' },
  { id:'fox',       name:'FOX NEWS',             short:'FOX',  country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UCXIJgqnII2ZOINSWNOGFThA', status:'event' },
  { id:'ap',        name:'ASSOCIATED PRESS',     short:'AP',   country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UC52X5wxOL_s5yw0dQk7NtgA', status:'event' },
  { id:'bloomberg', name:'BLOOMBERG TV ASIA',    short:'BBG',  country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'hls', src:'https://bloomberg.com/media-manifest/streams/asia.m3u8', status:'live' },
  { id:'cnbc',      name:'CNBC',                 short:'CNBC', country:'UNITED STATES',cc:'US', zone:'AMERICAS', kind:'youtube', src:'UCvJJ_dzjViJCoLf5uKUTwoA', status:'live' },
  { id:'reuters',   name:'REUTERS TV',           short:'RTR',  country:'UNITED KINGDOM',cc:'UK', zone:'AMERICAS', kind:'hls', src:'https://amg00453-reuters-amg00453c1-rakuten-uk-2110.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-rakutenuk/playlist.m3u8', status:'live' },

  /* ── EUROPE ─────────────────────────────────────── */
  { id:'bbc',       name:'BBC NEWS',             short:'BBC',  country:'UNITED KINGDOM',cc:'UK', zone:'EUROPE', kind:'youtube', src:'UC16niRr50-MSBwiO3YDb3RA', status:'live' },
  { id:'sky',       name:'SKY NEWS',             short:'SKY',  country:'UNITED KINGDOM',cc:'UK', zone:'EUROPE', kind:'youtube', src:'UCoMdktPbSTixAyNGwb-UYkQ', status:'live' },
  { id:'france24',  name:'FRANCE 24 ENGLISH',    short:'F24',  country:'FRANCE',       cc:'FR', zone:'EUROPE', kind:'youtube', src:'UCQfwfsi5VrQ8yKZ-UWmAEFg', status:'live' },
  { id:'f24fr',     name:'FRANCE 24 (FR)',       short:'F24',  country:'FRANCE',       cc:'FR', zone:'EUROPE', kind:'youtube', src:'UCCCPCZNChQdGa9EkATeye4g', status:'live' },
  { id:'dw',        name:'DW NEWS',              short:'DW',   country:'GERMANY',      cc:'DE', zone:'EUROPE', kind:'youtube', src:'UCknLrEdhRCp1aegoMqRaCZg', status:'live' },
  { id:'euronews',  name:'EURONEWS ENGLISH',     short:'EN',   country:'EUROPE',       cc:'EU', zone:'EUROPE', kind:'youtube', src:'UCSrZ3UV4jOidv8ppoVuvW9Q', status:'live' },
  { id:'trt',       name:'TRT WORLD',            short:'TRT',  country:'TÜRKİYE',      cc:'TR', zone:'EUROPE', kind:'youtube', src:'UC7fWeaHhqgM4Ry-RMpM2YYw', status:'live' },

  /* ── MIDDLE EAST ────────────────────────────────── */
  { id:'aj',        name:'AL JAZEERA ENGLISH',   short:'AJ',   country:'QATAR',        cc:'QA', zone:'MIDEast', kind:'youtube', src:'UCNye-wNBqNL5ZzHSJj3l8Bg', status:'live' },
  { id:'ajarab',    name:'AL JAZEERA ARABIC',    short:'AJأ',  country:'QATAR',        cc:'QA', zone:'MIDEast', kind:'hls', src:'https://live-hls-apps-aja-fa.getaj.net/AJA/01.m3u8', status:'live' },
  { id:'skyarabia', name:'SKY NEWS ARABIA',      short:'SKY',  country:'UAE',          cc:'AE', zone:'MIDEast', kind:'youtube', src:'UCIJXOvggjKtCagMfxvcCzAA', status:'live' }
];

/* 기본 9분할 배치 — 전 채널 페이지 내 동시 재생 */
const DEFAULT_SLOTS = ['nhk','cgtn','cnn','abc','bbc','aj','sky','dw','france24'];

const KIND_LABEL = { youtube:'YT·LIVE', 'youtube-video':'YT·VIDEO', hls:'HLS', web:'WEB' };

const CHANNEL_BY_ID = CHANNELS.reduce((m,c)=>(m[c.id]=c,m),{});
