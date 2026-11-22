/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE // GLOBAL NEWSROOM MONITOR — app.js  (v2)
   16:9 broadcast multiview · 42 verified live feeds
   layouts 9 / 4 / 6 / 1 / ALL(스크롤·지연 마운트) · 독립 배치 저장
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ── constants ─────────────────────────────────────────────── */
const LS_KEY = 'worldlive.v3';
const LEGACY_LS_KEYS = ['worldlive.v2', 'worldlive.v1'];   // v3 마이그레이션 원본
const LAYOUTS = {
  '9':  { cols: 3, rows: 3, count: 9, label: '9분할' },
  '4':  { cols: 2, rows: 2, count: 4, label: '4분할' },
  '6':  { cols: 3, rows: 2, count: 6, label: '6분할' },
  '1':  { cols: 1, rows: 1, count: 1, label: '전체 1×1' },
  'all':{ scroll: true, count: 0, label: '전체 스크롤' }
};
const GAP = 6;
const IO_MARGIN = '90% 0px 90% 0px';

/* ── state ─────────────────────────────────────────────────── */
function freshSets() {
  return {
    '9': DEFAULT_SETS['9'].slice(),
    '4': DEFAULT_SETS['4'].slice(),
    '6': DEFAULT_SETS['6'].slice(),
    '1': DEFAULT_SETS['1'].slice()
  };
}
const state = {
  layout: '9',
  start: '9',
  sort: 'zone',
  sets: freshSets(),
  custom: [],
  audioId: null,
  muted: true,
  startedAt: Date.now()
};
const live = {};            // slot index -> { node, media, ch, state, iframe, video, hls, ps }
let gen = 0;
let io = null;

/* ── dom ───────────────────────────────────────────────────── */
const $ = (s, r) => (r || document).querySelector(s);
const grid = $('#grid');
const stage = $('#stage');
const modalRoot = $('#modal-root');
const srcGrid = $('#src-grid');
const srcSearch = $('#src-search');
let modalSlot = null;

/* ── persistence ───────────────────────────────────────────── */
function save() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      layout: state.layout, start: state.start, sort: state.sort, sets: state.sets,
      custom: state.custom, audioId: state.audioId, muted: state.muted
    }));
  } catch (e) {}
}
/* 저장된 배치를 검증한다. 사라진 채널 ID(예: 정리된 국내 채널)는 걸러내고
   그 자리는 그 레이아웃의 기본 채널로 채운다 — 화면이 비거나 깨지지 않도록. */
function normalizeSet(arr, key) {
  if (!Array.isArray(arr)) return null;
  const seeds = (DEFAULT_SETS[key] || DEFAULT_SETS['9']).slice();
  const n = seeds.length;
  const out = [];
  arr.slice(0, n).forEach(id => {
    if (typeof id !== 'string') return;
    if (RETIRED_IDS.indexOf(id) >= 0) return;
    if (!byId(id) || out.indexOf(id) >= 0) return;
    out.push(id);
  });
  for (let k = 0; out.length < n && k < seeds.length * 8; k++) {
    const id = seeds[k % seeds.length];
    if (byId(id) && out.indexOf(id) < 0) out.push(id);
  }
  return out;
}
function applyStored(d) {
  if (!d || typeof d !== 'object') return;
  if (Array.isArray(d.custom)) state.custom = d.custom.filter(c => c && c.id && c.kind && c.src);
  if (d.sets && typeof d.sets === 'object') {
    Object.keys(state.sets).forEach(k => {
      const s = normalizeSet(d.sets[k], k);
      if (s && s.length) state.sets[k] = s;
    });
  }
  if (LAYOUTS[d.layout]) state.layout = d.layout;
  if (LAYOUTS[d.start]) state.start = d.start;
  if (typeof d.sort === 'string' && SORT_MODES[d.sort]) state.sort = d.sort;
  if (typeof d.audioId === 'string' && byId(d.audioId)) { state.audioId = d.audioId; state.muted = false; }
  else if (typeof d.muted === 'boolean') state.muted = d.muted;
}
function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) { applyStored(JSON.parse(raw)); return; }
    // v2 / v1 → v3 마이그레이션 (제거된 채널 ID는 기본 채널로 폴백)
    for (let i = 0; i < LEGACY_LS_KEYS.length; i++) {
      const old = localStorage.getItem(LEGACY_LS_KEYS[i]);
      if (!old) continue;
      const o = JSON.parse(old);
      if (o && typeof o === 'object') {
        applyStored({
          layout: o.layout,
          start: o.start || o.layout,
          sort: o.sort,
          sets: o.sets || (Array.isArray(o.slots) ? { '9': o.slots } : null),
          custom: o.custom, audioId: o.audioId, muted: o.muted
        });
      }
      break;
    }
  } catch (e) {}
}

/* ── channel helpers ───────────────────────────────────────── */
function allChannels() { return CHANNELS.concat(state.custom); }
function byId(id) { return CHANNEL_BY_ID[id] || state.custom.find(c => c.id === id) || null; }
const SORT_MODES = {
  zone:  { label: '지역·국가순', sub: '한국 → 미국 → 유럽 → 중동 → 아시아' },
  name:  { label: '이름순 (A-Z)', sub: '채널명 가나다·알파벳' },
  kr:    { label: '한국 우선', sub: '국내 뉴스를 맨 앞으로' }
};
function zoneRank(c) {
  const i = ZONE_ORDER.indexOf((c && c.zone) || 'ASIA');
  return i < 0 ? ZONE_ORDER.length : i;
}
function sortedIds() {
  const ids = ALL_LIVE_IDS.slice();
  const kr = c => c.zone === 'KOREA' ? 0 : 1;
  if (state.sort === 'name') {
    ids.sort((a, b) => {
      const ca = byId(a) || {}, cb = byId(b) || {};
      return String(ca.name || '').localeCompare(String(cb.name || ''), 'ko');
    });
  } else if (state.sort === 'zone') {
    // 한국 → 미주 → 영국·유럽 → 중동 → 아시아 → 오세아니아 → 아프리카 (같은 지역은 카탈로그 순서)
    ids.sort((a, b) => {
      const ra = zoneRank(byId(a)), rb = zoneRank(byId(b));
      if (ra !== rb) return ra - rb;
      return ALL_LIVE_IDS.indexOf(a) - ALL_LIVE_IDS.indexOf(b);
    });
  } else if (state.sort === 'kr') {
    ids.sort((a, b) => {
      const ra = kr(byId(a) || {}), rb = kr(byId(b) || {});
      if (ra !== rb) return ra - rb;
      return ALL_LIVE_IDS.indexOf(a) - ALL_LIVE_IDS.indexOf(b);
    });
  }
  return ids;
}
function slotIds() {
  if (state.layout === 'all') return sortedIds();
  return state.sets[state.layout];
}
function slotChannel(i) {
  const ids = slotIds();
  return byId(ids[i]) || CHANNELS[0];
}
function chCount() { return slotIds().length; }

/* ── clocks ────────────────────────────────────────────────── */
const CLOCKS = [
  { tz:'Asia/Seoul',    label:'SEOUL',  suf:'KST', local:true },
  { tz:'Asia/Tokyo',    label:'TOKYO',  suf:'JST' },
  { tz:'Asia/Shanghai', label:'BEIJING',suf:'CST' },
  { tz:'Europe/London', label:'LONDON', suf:'GMT' },
  { tz:'America/New_York', label:'NEW YORK', suf:'EST' },
  { tz:'UTC',           label:'UTC',    suf:'UTC' }
];
function buildClocks() {
  const wrap = $('#clocks');
  wrap.innerHTML = '';
  CLOCKS.forEach(c => {
    const el = document.createElement('div');
    el.className = 'clock' + (c.local ? ' is-local' : '');
    el.innerHTML = `<span class="clock-c">${c.local ? '<span class="clock-dot"></span>' : ''}${c.label} ${c.suf}</span><span class="clock-t" data-tz="${c.tz}">--:--:--</span>`;
    wrap.appendChild(el);
  });
}
const fmtCache = {};
function clockFmt(tz) {
  if (!fmtCache[tz]) fmtCache[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
  return fmtCache[tz];
}
function tickClocks() {
  const now = new Date();
  document.querySelectorAll('.clock-t').forEach(el => {
    try { el.textContent = clockFmt(el.dataset.tz).format(now); } catch (e) {}
  });
  const kst = $('#ss-clock');
  if (kst) kst.textContent = clockFmt('Asia/Seoul').format(now) + ' KST';
  const up = $('#ss-uptime');
  if (up) {
    const s = Math.floor((Date.now() - state.startedAt) / 1000);
    up.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }
}

/* ── toast ─────────────────────────────────────────────────── */
function toast(msg) {
  const wrap = $('#toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ── hls.js loader ─────────────────────────────────────────── */
let hlsLoading = null;
function ensureHls() {
  if (window.Hls) return Promise.resolve();
  if (hlsLoading) return hlsLoading;
  hlsLoading = new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
  return hlsLoading;
}

/* ── YouTube bridge ────────────────────────────────────────── */
function ytCmd(slot, func, args) {
  const L = live[slot];
  if (!L || !L.iframe || !L.iframe.contentWindow) return;
  try {
    L.iframe.contentWindow.postMessage(JSON.stringify({ event:'command', func: func, args: args || [] }), '*');
  } catch (e) {}
}
function ytListen(slot) {
  const L = live[slot];
  if (!L || !L.iframe || !L.iframe.contentWindow) return;
  try {
    L.iframe.contentWindow.postMessage(JSON.stringify({ event:'listening', id:'wl-' + slot, channel:'widget' }), '*');
  } catch (e) {}
}
window.addEventListener('message', function (e) {
  if (typeof e.origin !== 'string' || !/youtube(-nocookie)?\.com$/.test(e.origin.replace(/^https?:\/\//, ''))) return;
  let d = e.data;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch (x) { return; } }
  if (!d || typeof d !== 'object' || !d.id || String(d.id).indexOf('wl-') !== 0) return;
  const slot = parseInt(String(d.id).slice(3), 10);
  const L = live[slot];
  if (!L) return;
  if (d.event === 'infoDelivery' && d.info) {
    const info = d.info;
    if (typeof info.playerState === 'number') {
      L.ps = info.playerState;
      if (info.playerState === 1) {
        setTileState(slot, 'live');
        if (L.node) L.node.classList.remove('pass');
      } else if (info.playerState === 3) setTileState(slot, 'sync');
      else if (info.playerState === 0 || info.playerState === 2) { /* paused — 광고/대기 */ }
    }
  }
  if (d.event === 'onReady') {
    const muted = state.muted || state.audioId !== L.ch.id;
    ytCmd(slot, muted ? 'mute' : 'unMute');
    setTimeout(() => ytCmd(slot, 'playVideo'), 300);
  }
  if (d.event === 'onError') {
    const code = (d.info && d.info.data) || '?';
    L.err = code;
    if (String(code) === '150' || String(code) === '101') {
      showVeil(slot, '임베드 제한 채널', L.ch.name + '은(는) 방송사가 외부 페이지 삽입을 막았습니다(오류 ' + code + '). 소스를 바꾸거나 새 창에서 재생하세요.', '새 창에서 열기', 'open');
      setTileState(slot, 'error');
      L.node.classList.add('pass');
    } else {
      setTileState(slot, 'offline');
    }
  }
});

/* ── icons ─────────────────────────────────────────────────── */
const ICONS = {
  src:'<svg viewBox="0 0 16 16"><g stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><path d="M2.5 4.4h11M2.5 8h11M2.5 11.6h11"/><circle cx="5.6" cy="4.4" r="1.5" fill="#0B1017"/><circle cx="10.4" cy="8" r="1.5" fill="#0B1017"/><circle cx="6.8" cy="11.6" r="1.5" fill="#0B1017"/></g></svg>',
  spk:'<svg viewBox="0 0 16 16"><path d="M2.6 6h2.2L7.6 3.6v8.8L4.8 10H2.6z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M9.6 6a2.9 2.9 0 0 1 0 4M11.6 4.2a5.4 5.4 0 0 1 0 7.6" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
  spkOff:'<svg viewBox="0 0 16 16"><path d="M2.6 6h2.2L7.6 3.6v8.8L4.8 10H2.6z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M10.2 6.2l3.4 3.6M13.6 6.2l-3.4 3.6"/></g></svg>',
  max:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"><path d="M6 2.4H2.4V6M10 2.4h3.6V6M6 13.6H2.4V10M10 13.6h3.6V10"/></g></svg>',
  pop:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M9.4 2.6h4v4M13.4 2.6L8.6 7.4"/><path d="M12 9.8v3.2a.8.8 0 0 1-.8.8H2.8a.8.8 0 0 1-.8-.8V5.4a.8.8 0 0 1 .8-.8h3.2"/></g></svg>',
  re:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M13.2 6.7A5.3 5.3 0 1 0 13.7 9"/><path d="M13.9 2.9v3.8H10"/></g></svg>',
  warn:'<svg viewBox="0 0 24 24"><path d="M12 3.4L21.2 19.6H2.8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 9v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16.8" r=".9" fill="currentColor"/></svg>',
  link:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M6.6 9.4l2.8-2.8"/><path d="M9.2 4.6l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7l-1.2 1.2"/><path d="M6.8 11.4l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7l1.2-1.2"/></g></svg>',
  caret:'<svg viewBox="0 0 12 12" width="10" height="10"><path d="M2.6 4.6L6 8l3.4-3.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
};
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

/* ── tile ──────────────────────────────────────────────────── */
function buildTile(i) {
  const ch = slotChannel(i);
  const isAll = state.layout === 'all';
  const el = document.createElement('article');
  el.className = 'tile';
  el.dataset.slot = String(i);
  el.dataset.kind = ch.kind;
  el.dataset.state = 'idle';
  el.innerHTML = `
    <div class="tile-media"></div>
    <div class="tile-hit"></div>
    <div class="tlay-top">
      <div class="chan-tag">
        <span class="live-badge"><span class="live-dot"></span><span class="live-txt">LIVE</span></span>
        <span class="chan-name">${esc(ch.name)}</span>
        <span class="chan-cc">${esc(ch.cc || '')}</span>
      </div>
      ${isAll
        ? `<button class="chan-switch is-view" data-act="max" title="이 채널 1×1로 크게 보기">${ICONS.max}<span>크게 보기</span></button>`
        : `<button class="chan-switch" data-act="src" title="이 칸의 채널 변경">${ICONS.src}<span>채널 변경</span>${ICONS.caret}</button>`}
    </div>
    <div class="tile-veil">
      <div class="veil-icon">${ICONS.warn}</div>
      <div class="veil-title">피드 없음</div>
      <div class="veil-desc"></div>
      <button class="veil-btn" data-act="src">${ICONS.link} 소스 변경</button>
    </div>
    <div class="tlay-ctrl">
      <div class="ctrl-meta">
        <div class="ctrl-country"><span class="kind-chip">${KIND_LABEL[ch.kind] || ''}</span><span class="cname">${esc(ch.country || '')}</span></div>
        <div class="ctrl-src" title="${esc(ch.name)}">${esc(ch.name)}</div>
      </div>
      <div class="ctrl-btns">
        <button class="tbtn" data-act="audio" title="단독 음성">${ICONS.spkOff}</button>
        ${isAll ? '' : `<button class="tbtn" data-act="src" title="채널 변경">${ICONS.src}</button>`}
        <button class="tbtn" data-act="max" title="1×1 전체화면">${ICONS.max}</button>
        <button class="tbtn" data-act="pop" title="새 창에서 열기">${ICONS.pop}</button>
        <button class="tbtn" data-act="reload" title="이 피드 새로고침">${ICONS.re}</button>
      </div>
    </div>`;
  return el;
}

/* ── mounting ──────────────────────────────────────────────── */
function idleFace(ch) {
  return '<div class="idle-face"><span class="idle-dot"></span><span class="idle-name">' + esc(ch.name) + '</span>'
       + '<small>SCROLL TO PLAY</small></div>';
}
function mountSlot(i) {
  const el = grid.querySelector('.tile[data-slot="' + i + '"]');
  if (!el) return;
  const ch = slotChannel(i);
  const media = el.querySelector('.tile-media');
  if (live[i]) {
    if (live[i].ch.id === ch.id && live[i].state !== 'error') return;
    unmountSlot(i);
  }
  media.innerHTML = '';
  live[i] = { node: el, media: media, ch: ch, state: 'loading', iframe: null, video: null, hls: null, src: null, backupUsed: false };
  el.dataset.kind = ch.kind;
  el.dataset.state = 'loading';
  el.classList.remove('is-idle', 'pass');
  hideVeil(i);

  const muted = state.muted || state.audioId !== ch.id;

  if (ch.kind === 'youtube' || ch.kind === 'youtube-video') {
    const params = new URLSearchParams({
      autoplay: '1', mute: muted ? '1' : '0', controls: '0', rel: '0',
      modestbranding: '1', playsinline: '1', disablekb: '1', fs: '0',
      iv_load_policy: '3', enablejsapi: '1', loop: '0'
    });
    if (location.origin && location.origin !== 'null') params.set('origin', location.origin);
    const path = ch.kind === 'youtube'
      ? 'embed/live_stream?channel=' + encodeURIComponent(ch.src)
      : 'embed/' + encodeURIComponent(ch.src);
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/' + path + (path.indexOf('?') >= 0 ? '&' : '?') + params.toString();
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'origin';
    iframe.title = ch.name + ' live';
    media.appendChild(iframe);
    live[i].iframe = iframe;
    const hs = () => { ytListen(i); ytCmd(i, muted ? 'mute' : 'unMute'); };
    iframe.addEventListener('load', () => { setTimeout(hs, 350); setTimeout(hs, 1500); });
    setTimeout(hs, 1800);
    setTimeout(() => {
      if (!live[i]) return;
      ytCmd(i, 'addEventListener', ['onStateChange']);
      if (live[i].ps !== 1) ytCmd(i, 'playVideo');
      ytCmd(i, muted ? 'mute' : 'unMute');
    }, 5000);
    setTimeout(() => {
      if (live[i] && live[i].state === 'loading' && !live[i].err) setTileState(i, live[i].ch.status === 'event' ? 'offline' : 'live');
    }, 11000);

  } else if (ch.kind === 'hls') {
    const v = document.createElement('video');
    v.muted = muted; v.autoplay = true; v.playsInline = true; v.controls = false;
    v.setAttribute('playsinline', '');
    v.title = ch.name + ' live';
    media.appendChild(v);
    live[i].video = v;
    v.addEventListener('playing', () => { setTileState(i, 'live'); v.dataset.ok = '1'; });
    v.addEventListener('waiting', () => { if (!v.dataset.ok) setTileState(i, 'sync'); });
    attachHls(i, v, ch.src, ch.backup);

  } else if (ch.kind === 'web') {
    showVeil(i, '외부 공식 플레이어', ch.note || (ch.name + '은(는) 공식 사이트에서만 재생됩니다.'), '새 창에서 열기', 'open');
    setTileState(i, 'external');
  }
}

function unmountSlot(i) {
  const L = live[i];
  if (!L) return;
  try { if (L.hls) L.hls.destroy(); } catch (e) {}
  try { if (L.video) { L.video.pause(); L.video.removeAttribute('src'); L.video.load(); } } catch (e) {}
  try { if (L.iframe) L.iframe.src = 'about:blank'; } catch (e) {}
  const el = L.node;
  if (el) {
    el.querySelector('.tile-media').innerHTML = idleFace(L.ch);
    el.classList.add('is-idle');
    el.dataset.state = 'idle';
  }
  delete live[i];
}

/* HLS 재생 — 1차 주소가 치명적 오류(매니페스트/세그먼트 실패)를 내면
   백업(backup) 주소로 한 번 자동 전환한 뒤, 그래도 안 되면 오류 안내 */
function attachHls(i, v, primary, backup) {
  const urls = [primary].concat(backup ? [backup] : []);
  let ui = 0;

  function next(reason) {
    const cur = live[i];
    if (!cur) return;
    try { if (cur.hls) { cur.hls.destroy(); cur.hls = null; } } catch (e) {}
    ui++;
    if (ui < urls.length) {
      cur.backupUsed = true;
      setTileState(i, 'sync');
      toast(cur.ch.name + ' — 백업 소스로 전환');
      start();
    } else {
      failHls(i, reason || 'HLS 스트림 연결 실패');
    }
  }

  function start() {
    const cur = live[i];
    if (!cur || !cur.video) return;
    const url = urls[ui];
    cur.src = url;
    const nativeHls = v.canPlayType('application/vnd.apple.mpegurl');
    if (window.Hls && window.Hls.isSupported()) {
      let netRetry = 0, netRetriedAll = false;
      let mediaRecovered = false;
      const hls = new window.Hls({
        lowLatencyMode: false,
        liveSyncDurationCount: 4,
        maxBufferLength: 24,
        manifestLoadingMaxRetry: 2,
        levelLoadingMaxRetry: 2,
        fragLoadingMaxRetry: 2
      });
      cur.hls = hls;
      hls.loadSource(url);
      hls.attachMedia(v);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
      });
      hls.on(window.Hls.Events.ERROR, (evt, data) => {
        if (!data || !data.fatal) return;
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR && netRetry < 2) {
          netRetry++;
          setTileState(i, 'sync');
          setTimeout(() => { try { hls.startLoad(); } catch (e) {} }, 1500);
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR && !netRetriedAll) {
          // 네트워크 재시도 소진 → 같은 주소를 처음부터 한 번 더
          netRetriedAll = true;
          setTileState(i, 'sync');
          setTimeout(() => {
            try { hls.destroy(); } catch (e) {}
            if (live[i]) { live[i].hls = null; start(); }
          }, 1200);
          return;
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR && !mediaRecovered) {
          mediaRecovered = true;
          try { hls.recoverMediaError(); return; } catch (e) {}
        }
        next('HLS 스트림 연결 실패');
      });
    } else if (nativeHls) {
      v.onerror = () => next('재생 오류');
      v.src = url;
      v.play().catch(() => {});
    } else {
      failHls(i, '이 브라우저는 HLS를 지원하지 않습니다');
    }
  }

  start();
}

function failHls(i, msg) {
  const ch = slotChannel(i);
  setTileState(i, 'error');
  const tail = ch.backup ? ' (백업 주소까지 실패)' : '';
  showVeil(i, '스트림 연결 실패', msg + tail + ' — ' + ch.name + '. 잠시 후 다시 시도하거나 다른 소스를 선택하세요.', '다시 시도', 'retry');
}

/* ── veil ──────────────────────────────────────────────────── */
function showVeil(i, title, desc, btnLabel, btnAction) {
  const el = grid.querySelector('.tile[data-slot="' + i + '"]');
  if (!el) return;
  const veil = el.querySelector('.tile-veil');
  veil.querySelector('.veil-title').textContent = title;
  veil.querySelector('.veil-desc').textContent = desc || '';
  const btn = veil.querySelector('.veil-btn');
  if (btnLabel) {
    btn.hidden = false;
    btn.dataset.act = btnAction || 'src';
    btn.innerHTML = ICONS.link + ' ' + esc(btnLabel);
  } else btn.hidden = true;
  veil.classList.add('is-shown');
}
function hideVeil(i) {
  const el = grid.querySelector('.tile[data-slot="' + i + '"]');
  if (el) el.querySelector('.tile-veil').classList.remove('is-shown');
}

/* ── tile state ────────────────────────────────────────────── */
function setTileState(i, st) {
  const el = grid.querySelector('.tile[data-slot="' + i + '"]');
  if (!el || !live[i]) return;
  live[i].state = st;
  el.dataset.state = st;
  const txt = el.querySelector('.live-txt');
  if (txt) txt.textContent = st === 'error' ? 'ERROR' : st === 'offline' ? 'OFFLINE' : st === 'sync' ? 'SYNC' : st === 'external' ? 'EXT' : 'LIVE';
  if (st === 'live') hideVeil(i);
  if (st === 'offline' && !el.querySelector('.tile-veil.is-shown')) {
    showVeil(i, '라이브 신호 없음', live[i].ch.name + ' — 지금은 라이브 송출이 없습니다. 소스를 바꾸거나 잠시 후 다시 시도하세요.', '소스 변경', 'src');
  }
  updateStrip();
}

/* ── layout / rendering ────────────────────────────────────── */
function applyLayout(layout, rebuild) {
  if (!LAYOUTS[layout]) layout = '9';
  const same = state.layout === layout;
  state.layout = layout;
  grid.dataset.layout = layout;
  document.querySelectorAll('.layout-btn').forEach(b => b.classList.toggle('is-active', b.dataset.layout === layout));
  stage.classList.toggle('is-scroll', layout === 'all');
  if (rebuild !== false || !same) rebuildGrid();
  save();
}

function sizeGrid() {
  if (state.layout === 'all') return sizeAll();
  const L = LAYOUTS[state.layout];
  const availW = stage.clientWidth - 18;
  const availH = stage.clientHeight - 18;
  const byW = (availW - GAP * (L.cols - 1)) / L.cols;
  const byH = ((availH - GAP * (L.rows - 1)) / L.rows) * (16 / 9);
  const w = Math.max(120, Math.min(byW, byH));
  const h = w * 9 / 16;
  grid.style.width = (w * L.cols + GAP * (L.cols - 1)) + 'px';
  grid.style.height = (h * L.rows + GAP * (L.rows - 1)) + 'px';
  grid.style.gridTemplateColumns = 'repeat(' + L.cols + ',' + w + 'px)';
  grid.style.gridTemplateRows = 'repeat(' + L.rows + ',' + h + 'px)';
  grid.style.gap = GAP + 'px';
}
function sizeAll() {
  const w = stage.clientWidth - 18;
  const cols = w >= 2100 ? 4 : w >= 1240 ? 3 : 2;
  grid.style.setProperty('--all-cols', cols);
  grid.style.width = '100%';
  grid.style.height = 'auto';
  grid.style.gridTemplateColumns = 'repeat(' + cols + ',minmax(0,1fr))';
  grid.style.gridTemplateRows = '';
  grid.style.gap = '8px';
}

function destroyAll() {
  if (io) { io.disconnect(); io = null; }
  Object.keys(live).forEach(k => {
    const L = live[k];
    try { if (L.hls) L.hls.destroy(); } catch (e) {}
    try { if (L.video) { L.video.pause(); L.video.removeAttribute('src'); L.video.load(); } } catch (e) {}
    try { if (L.iframe) L.iframe.src = 'about:blank'; } catch (e) {}
    delete live[k];
  });
}

function rebuildGrid() {
  destroyAll();
  gen++;
  const myGen = gen;
  grid.innerHTML = '';
  const n = chCount();
  for (let i = 0; i < n; i++) grid.appendChild(buildTile(i));
  sizeGrid();
  updateStrip();
  syncAudioButtons();

  if (state.layout === 'all') {
    observeAll(myGen);
  } else {
    ensureHls().then(() => {
      if (myGen !== gen) return;
      for (let i = 0; i < n; i++) {
        setTimeout(() => { if (myGen === gen) mountSlot(i); }, i * 90);
      }
    });
  }
}

/* 전체 스크롤 — 뷰포트 근처만 마운트, 멀어지면 해제 (가상화) */
function observeAll(myGen) {
  const tiles = Array.prototype.slice.call(grid.querySelectorAll('.tile'));
  if (!('IntersectionObserver' in window)) { ensureHls().then(() => tiles.forEach((t, i) => mountSlot(i))); return; }
  io = new IntersectionObserver(entries => {
    if (myGen !== gen) return;
    entries.forEach(en => {
      const i = parseInt(en.target.dataset.slot, 10);
      if (en.isIntersecting) {
        clearTimeout(en.target._unmountT);
        ensureHls().then(() => { if (myGen === gen && !live[i]) mountSlot(i); });
      } else if (live[i]) {
        clearTimeout(en.target._unmountT);
        en.target._unmountT = setTimeout(() => { if (myGen === gen) unmountSlot(i); }, 900);
      }
    });
  }, { root: stage, rootMargin: IO_MARGIN, threshold: 0.01 });
  tiles.forEach(t => { t.querySelector('.tile-media').innerHTML = idleFace(slotChannel(parseInt(t.dataset.slot, 10))); t.classList.add('is-idle'); io.observe(t); });
}

/* ── audio ─────────────────────────────────────────────────── */
function setAudio(chId) {
  if (state.audioId === chId || chId == null) { state.audioId = null; state.muted = true; }
  else { state.audioId = chId; state.muted = false; }
  applyAudio();
  save();
}
function applyAudio() {
  Object.keys(live).forEach(k => {
    const i = parseInt(k, 10), L = live[k];
    const muted = state.muted || state.audioId !== L.ch.id;
    if (L.iframe) ytCmd(i, muted ? 'mute' : 'unMute');
    if (L.video != null) {
      L.video.muted = muted;
      if (!muted) L.video.play().catch(() => {});
    }
  });
  syncAudioButtons();
  updateStrip();
}
function syncAudioButtons() {
  grid.querySelectorAll('.tile').forEach(el => {
    const i = parseInt(el.dataset.slot, 10);
    const ch = slotChannel(i);
    const on = !state.muted && state.audioId === ch.id;
    const btn = el.querySelector('[data-act="audio"]');
    if (!btn) return;
    btn.classList.toggle('is-on', on);
    btn.innerHTML = on ? '<span class="eq"><i></i><i></i><i></i></span>' : ICONS.spkOff;
    btn.title = on ? '음성 켜짐 — 누르면 음소거' : '이 채널 단독 청취';
  });
  const mb = $('#btn-mute');
  const anyOn = !state.muted && state.audioId != null;
  mb.classList.toggle('is-muted', !anyOn);
  mb.title = anyOn ? '전체 음소거' : '음성 켜기 (첫 채널)';
}
function updateStrip() {
  const ids = slotIds();
  let ok = 0, warn = 0, ready = 0;
  for (let i = 0; i < ids.length; i++) {
    if (!live[i]) continue;
    ready++;
    if (live[i].state === 'live') ok++;
    else if (live[i].state === 'error' || live[i].state === 'offline') warn++;
  }
  const led = $('#ss-led');
  led.classList.toggle('is-warn', warn > 0);
  const label = state.layout === 'all'
    ? 'MASTER CONTROL — ' + ok + ' LIVE · ' + ready + '/' + ids.length + ' MOUNTED'
    : 'MASTER CONTROL — ' + ok + '/' + ids.length + ' FEEDS NOMINAL' + (warn ? ' · ' + warn + ' CHECK' : '');
  $('#ss-status').textContent = label;
  const ch = state.audioId ? byId(state.audioId) : null;
  $('#ss-audio').innerHTML = (state.muted || !ch) ? 'AUDIO — ALL MUTED' : 'AUDIO — <b>' + esc(ch.name) + '</b>';
}

/* ── start layout menu ─────────────────────────────────────── */
const START_NAMES = { '9':'9분할', '4':'4분할', '6':'6분할', '1':'1×1', 'all':'전체 스크롤' };
function refreshStartUI() {
  $('#start-label').textContent = START_NAMES[state.start] || '9분할';
  document.querySelectorAll('#start-menu [data-start]').forEach(b => {
    b.classList.toggle('is-current', b.dataset.start === state.start);
  });
  document.querySelectorAll('.layout-btn').forEach(b => {
    b.classList.toggle('is-start', b.dataset.layout === state.start);
  });
}
function setStart(layout) {
  if (!LAYOUTS[layout]) return;
  state.start = layout;
  save();
  refreshStartUI();
  toast('첫 화면 — ' + (START_NAMES[layout] || layout) + ' 저장');
}

function refreshSortUI() {
  $('#sort-label').textContent = SORT_MODES[state.sort].label;
  document.querySelectorAll('#sort-menu [data-sort]').forEach(b => {
    b.classList.toggle('is-current', b.dataset.sort === state.sort);
  });
}

/* ── modal ─────────────────────────────────────────────────── */
function openModal(slot) {
  modalSlot = (typeof slot === 'number' && state.layout !== 'all') ? slot : null;
  const kicker = $('#modal-kicker'), title = $('#modal-title');
  if (modalSlot == null) {
    kicker.textContent = 'SOURCE LIBRARY · ' + (LAYOUTS[state.layout].label || '');
    title.textContent = '소스 라이브러리 · 커스텀 소스';
  } else {
    const L = LAYOUTS[state.layout];
    kicker.textContent = 'SOURCE PATCH BAY — ' + L.label + ' · SLOT ' + String(modalSlot + 1).padStart(2, '0');
    title.textContent = '채널 변경 — ' + slotChannel(modalSlot).name;
  }
  srcSearch.value = '';
  renderSources('');
  modalRoot.hidden = false;
  setTimeout(() => srcSearch.focus(), 40);
}
function closeModal() { modalRoot.hidden = true; modalSlot = null; $('#custom-error').hidden = true; }
function renderSources(q) {
  const query = (q || '').trim().toLowerCase();
  const list = allChannels().filter(c => {
    if (!query) return true;
    return (c.name + ' ' + (c.country || '') + ' ' + (c.cc || '') + ' ' + (c.short || '')).toLowerCase().indexOf(query) >= 0;
  });
  const current = (modalSlot != null) ? slotIds()[modalSlot] : null;
  srcGrid.innerHTML = '';
  if (!list.length) { srcGrid.innerHTML = '<div class="empty-note">검색 결과가 없습니다.</div>'; return; }

  const frag = document.createDocumentFragment();
  if (state.sort === 'name' && !query) {
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    list.forEach(c => frag.appendChild(srcCard(c, current)));
  } else {
    const groups = {};
    list.forEach(c => { const z = c.zone || 'ASIA'; (groups[z] = groups[z] || []).push(c); });
    const order = ZONE_ORDER;
    order.forEach(z => {
      const arr = groups[z];
      if (!arr) return;
      const lab = document.createElement('div');
      lab.className = 'src-group-label';
      lab.innerHTML = '<span>' + esc(ZONE_LABEL[z] || z) + '</span><span class="sgl-count">' + arr.length + '</span>';
      frag.appendChild(lab);
      arr.forEach(c => frag.appendChild(srcCard(c, current)));
    });
  }
  srcGrid.appendChild(frag);
}
function srcCard(c, current) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'src-card' + (current === c.id ? ' is-current' : '');
  b.dataset.kind = c.kind;
  b.dataset.id = c.id;
  const isCustom = !!c.custom;
  const stateTxt = c.status === 'event' ? ' · EVENT' : c.status === 'external' ? ' · 외부' : '';
  b.innerHTML = `
    <span class="src-logo">${esc(c.short || c.name.slice(0, 3))}</span>
    <span class="src-info">
      <span class="src-name">${esc(c.name)}${c.alt ? '<span class="alt-tag">대체</span>' : ''}</span>
      <span class="src-meta">
        <span class="dot${c.status === 'event' || c.status === 'external' ? ' warn' : ''}"></span>
        ${esc(c.cc || '')} · ${KIND_LABEL[c.kind] || ''}${stateTxt}
      </span>
    </span>
    ${isCustom ? '<span class="src-del" data-del="' + esc(c.id) + '" title="삭제"><svg viewBox="0 0 16 16"><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></g></svg></span>' : ''}`;
  b.addEventListener('click', ev => {
    const del = ev.target.closest('[data-del]');
    if (del) {
      ev.stopPropagation();
      state.custom = state.custom.filter(x => x.id !== del.dataset.del);
      Object.keys(state.sets).forEach(k => { state.sets[k] = state.sets[k].map(s => s === del.dataset.del ? 'nhk' : s); });
      save(); renderSources(srcSearch.value); rebuildGrid();
      toast('커스텀 소스를 삭제했습니다');
      return;
    }
    if (modalSlot == null) {
      if (state.layout === 'all') {
        state.sets['1'] = [c.id];
        applyLayout('1');
        closeModal();
        toast('1×1 — ' + c.name);
      } else {
        toast('타일의 ‘채널 변경’ 버튼에서 칸을 지정할 수 있습니다');
      }
      return;
    }
    assignSource(modalSlot, c.id);
  });
  return b;
}
function assignSource(slot, id) {
  state.sets[state.layout][slot] = id;
  save();
  closeModal();
  const ch = byId(id);
  toast(LAYOUTS[state.layout].label + ' SLOT ' + String(slot + 1).padStart(2, '0') + ' — ' + (ch ? ch.name : id));
  const el = grid.querySelector('.tile[data-slot="' + slot + '"]');
  if (el) el.replaceWith(buildTile(slot));
  delete live[slot];
  mountSlot(slot);
  applyAudio();
  refreshStartUI();
}

/* ── custom sources ────────────────────────────────────────── */
function parseCustom(raw) {
  const u = String(raw || '').trim();
  if (!u) throw new Error('주소를 입력해 주세요.');
  let m;
  if (/youtube\.com\/@|youtu\.be\/@/.test(u)) {
    throw new Error('YouTube 핸들(@) 주소는 채널 ID로 바꿔 주세요. 채널 페이지 → 정보 → 채널 ID 공유 (UC로 시작).');
  }
  if ((m = u.match(/youtube\.com\/channel\/(UC[\w-]{22})/))) return { kind:'youtube', src:m[1] };
  if ((m = u.match(/youtube\.com\/live\/([\w-]{11})/))) return { kind:'youtube-video', src:m[1] };
  if ((m = u.match(/[?&]v=([\w-]{11})/))) return { kind:'youtube-video', src:m[1] };
  if ((m = u.match(/youtu\.be\/([\w-]{11})/))) return { kind:'youtube-video', src:m[1] };
  if ((m = u.match(/youtube\.com\/embed\/([\w-]{11})/))) return { kind:'youtube-video', src:m[1] };
  if (/^UC[\w-]{22}$/.test(u)) return { kind:'youtube', src:u };
  if (/^[\w-]{11}$/.test(u)) return { kind:'youtube-video', src:u };
  if (/\.m3u8(\?.*)?$/i.test(u)) return { kind:'hls', src:u };
  if (/\.mpd(\?.*)?$/i.test(u)) throw new Error('MPD(DASH) 주소는 지원하지 않습니다. HLS(.m3u8) 주소를 넣어 주세요.');
  if (/^https?:\/\//i.test(u)) return { kind:'web', src:u };
  throw new Error('YouTube 링크·영상 ID·채널 ID(UC…)·.m3u8·웹 주소만 추가할 수 있습니다.');
}
function addCustom(raw, name) {
  const p = parseCustom(raw);
  let label = (name || '').trim();
  if (!label) {
    try {
      const h = new URL(p.src.startsWith('http') ? p.src : 'https://www.youtube.com/watch?v=' + p.src).hostname.replace(/^www\./, '');
      label = p.kind === 'web' ? h : p.kind === 'hls' ? ('HLS · ' + h) : (p.kind === 'youtube' ? 'YouTube 채널' : 'YouTube 영상');
    } catch (e) { label = '커스텀 소스'; }
  }
  const cc = p.kind === 'web' ? 'WEB' : p.kind === 'hls' ? 'HLS' : 'YT';
  const ch = {
    id: 'c_' + Date.now().toString(36),
    name: label, short: label.replace(/[^A-Za-z0-9가-힣]/g, '').slice(0, 4).toUpperCase() || 'NEW',
    country: 'CUSTOM', cc: cc, zone: 'CUSTOM', kind: p.kind, src: p.src,
    status: p.kind === 'web' ? 'external' : 'live', custom: true
  };
  state.custom.push(ch);
  save();
  return ch;
}

/* ── fullscreen HUD (FULL 모드) ────────────────────────────── */
let hudTimer = null;
function isFull() { return !!document.fullscreenElement; }
function showHud(autoHide) {
  if (!isFull()) return;
  document.body.classList.add('is-hud');
  clearTimeout(hudTimer);
  if (autoHide !== false) hudTimer = setTimeout(hideHud, 3600);
}
function hideHud() {
  document.body.classList.remove('is-hud');
  clearTimeout(hudTimer);
  hudTimer = null;
}
function toggleHud() {
  if (document.body.classList.contains('is-hud')) hideHud();
  else showHud();
}

/* ── fullscreen / external ─────────────────────────────────── */
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen().catch(() => toast('이 브라우저에서는 전체화면을 쓸 수 없습니다'));
}
function openExternal(i) {
  const ch = slotChannel(i);
  let url;
  if (ch.kind === 'youtube') url = 'https://www.youtube.com/channel/' + ch.src + '/live';
  else if (ch.kind === 'youtube-video') url = 'https://www.youtube.com/watch?v=' + ch.src;
  else url = ch.src;
  window.open(url, '_blank', 'noopener');
}
function showBig(i) {
  const ch = slotChannel(i);
  state.sets['1'] = [ch.id];
  save();
  applyLayout('1');
  toast('1×1 — ' + ch.name);
}

/* ── events ────────────────────────────────────────────────── */
function bindEvents() {
  document.querySelectorAll('.layout-btn').forEach(b => {
    b.addEventListener('click', () => applyLayout(b.dataset.layout));
  });
  $('#btn-fullscreen').addEventListener('click', toggleFullscreen);
  $('#btn-mute').addEventListener('click', () => {
    if (!state.muted && state.audioId) { state.audioId = null; state.muted = true; applyAudio(); save(); }
    else {
      const first = chCount() ? slotChannel(0) : null;
      if (first) setAudio(first.id);
    }
  });
  $('#btn-reload').addEventListener('click', () => { rebuildGrid(); toast('모든 피드를 다시 연결합니다'); });
  $('#btn-sources').addEventListener('click', () => openModal(null));
  $('#btn-find').addEventListener('click', () => { openModal(null); });

  // start layout menu
  $('#btn-start').addEventListener('click', e => {
    e.stopPropagation();
    const m = $('#start-menu');
    m.hidden = !m.hidden;
  });
  $('#start-menu').addEventListener('click', e => {
    const b = e.target.closest('[data-start]');
    if (!b) return;
    setStart(b.dataset.start);
    $('#start-menu').hidden = true;
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.start-wrap')) $('#start-menu').hidden = true;
    if (!e.target.closest('.sort-wrap')) $('#sort-menu').hidden = true;
  });

  // 채널 정렬 메뉴
  $('#btn-sort').addEventListener('click', e => {
    e.stopPropagation();
    const m = $('#sort-menu');
    m.hidden = !m.hidden;
  });
  $('#sort-menu').addEventListener('click', e => {
    const b = e.target.closest('[data-sort]');
    if (!b) return;
    state.sort = b.dataset.sort;
    save();
    refreshSortUI();
    $('#sort-menu').hidden = true;
    if (state.layout === 'all') applyLayout('all');
    else { renderSources(srcSearch.value); toast('소스 목록 정렬 — ' + SORT_MODES[state.sort].label); }
  });

  grid.addEventListener('mouseover', e => {
    const t = e.target.closest('.tile'); if (!t) return;
    t.classList.add('is-hover');
  });
  grid.addEventListener('mouseout', e => {
    const t = e.target.closest('.tile'); if (!t) return;
    if (!t.contains(e.relatedTarget)) t.classList.remove('is-hover');
  });
  grid.addEventListener('click', e => {
    const t = e.target.closest('.tile'); if (!t) return;
    const i = parseInt(t.dataset.slot, 10);
    const actBtn = e.target.closest('[data-act]');
    const act = actBtn ? actBtn.dataset.act : null;
    if (act === 'src') { openModal(i); return; }
    if (act === 'audio') { setAudio(slotChannel(i).id); return; }
    if (act === 'max') { showBig(i); return; }
    if (act === 'pop') { openExternal(i); return; }
    if (act === 'reload') { try { unmountSlot(i); } catch (x) {} mountSlot(i); toast(slotChannel(i).name + ' — 재연결'); return; }
    if (act === 'open') { openExternal(i); return; }
    if (act === 'retry') { try { unmountSlot(i); } catch (x) {} mountSlot(i); return; }
    const L = live[i];
    const kd = slotChannel(i).kind;
    if (L && (kd === 'youtube' || kd === 'youtube-video') && L.ps !== 1) {
      t.classList.add('pass');
      if (t.dataset.passTip !== '1') {
        toast(slotChannel(i).name + ' — 영상의 재생 버튼을 눌러 주세요');
        t.dataset.passTip = '1';
      }
    }
  });
  grid.addEventListener('dblclick', e => {
    const t = e.target.closest('.tile'); if (!t) return;
    showBig(parseInt(t.dataset.slot, 10));
  });

  // FULL 모드 HUD — 클릭 토글 + 상·하단 핫존 + 자동 숨김
  grid.addEventListener('mousemove', e => {
    if (!isFull()) return;
    if (e.target.closest('.tlay-ctrl, .chan-switch')) { clearTimeout(hudTimer); return; }
    const nearEdge = e.clientY <= 48 || e.clientY >= window.innerHeight - 44;
    if (nearEdge) showHud();
    else if (document.body.classList.contains('is-hud')) {
      clearTimeout(hudTimer);
      hudTimer = setTimeout(hideHud, 3600);
    }
  });
  grid.addEventListener('click', e => {
    if (!isFull()) return;
    if (e.target.closest('[data-act]')) return;                 // 타일 버튼은 기존 동작 유지
    if (e.target.closest('.tile') && !e.target.closest('.tile-hit')) return;
    toggleHud();                                                 // 화면·빈 영역 클릭 = HUD 토글
  });
  document.querySelectorAll('.topbar, .signal-strip').forEach(el => {
    el.addEventListener('mouseenter', () => clearTimeout(hudTimer));
    el.addEventListener('mouseleave', () => { if (isFull()) showHud(); });
  });

  // modal
  modalRoot.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeModal();
    const card = e.target.closest('.src-card');
    if (card && !e.target.closest('[data-del]')) { /* handled per-card */ }
  });
  srcSearch.addEventListener('input', () => renderSources(srcSearch.value));
  $('#custom-form').addEventListener('submit', e => {
    e.preventDefault();
    const url = $('#custom-url').value.trim();
    const nm = $('#custom-name').value.trim();
    const errBox = $('#custom-error');
    try {
      const ch = addCustom(url, nm);
      errBox.hidden = true;
      $('#custom-url').value = ''; $('#custom-name').value = '';
      if (modalSlot != null) { assignSource(modalSlot, ch.id); }
      else { renderSources(''); toast('커스텀 소스가 추가되었습니다'); }
    } catch (err) {
      errBox.hidden = false;
      errBox.textContent = err.message;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    const k = e.key.toLowerCase();
    if (k === 'escape') { if (!modalRoot.hidden) closeModal(); else $('#start-menu').hidden = true; return; }
    if (k === '1') applyLayout('9');
    else if (k === '2') applyLayout('4');
    else if (k === '3') applyLayout('6');
    else if (k === '4') applyLayout('1');
    else if (k === '5' || k === 'a') applyLayout('all');
    else if (k === 'f') toggleFullscreen();
    else if (k === 'h' && isFull()) toggleHud();
    else if (k === 'm') $('#btn-mute').click();
    else if (k === 'r') rebuildGrid();
    else if (k === 's') openModal(null);
  });

  window.addEventListener('resize', () => sizeGrid());
  document.addEventListener('fullscreenchange', () => {
    $('#btn-fullscreen').classList.toggle('is-active', !!document.fullscreenElement);
    if (document.fullscreenElement) { document.body.classList.add('is-full'); showHud(); }
    else { document.body.classList.remove('is-full'); hideHud(); }
    setTimeout(sizeGrid, 60);
  });
}

/* ── debug hook ────────────────────────────────────────────── */
window.WORLD_LIVE = {
  state: () => ({
    layout: state.layout, start: state.start, sort: state.sort, muted: state.muted, audio: state.audioId,
    sets: JSON.parse(JSON.stringify(state.sets)),
    count: chCount(),
    channels: CHANNELS.length,
    allIds: ALL_LIVE_IDS.slice(),
    tiles: Object.keys(live).map(k => ({ slot: +k, id: live[k].ch.id, name: live[k].ch.name, kind: live[k].ch.kind, state: live[k].state, backupUsed: !!live[k].backupUsed, src: live[k].src || null, ps: live[k].ps == null ? null : live[k].ps, err: live[k].err || null }))
  }),
  setLayout: l => applyLayout(l),
  setAudio: id => setAudio(id),
  mount: i => mountSlot(i),
  unmount: i => unmountSlot(i),
  hud: () => toggleHud(),
  full: () => toggleFullscreen()
};

/* ── boot ──────────────────────────────────────────────────── */
function boot() {
  const qs = new URLSearchParams(location.search);
  if (qs.has('reset')) { try { localStorage.removeItem(LS_KEY); LEGACY_LS_KEYS.forEach(k => localStorage.removeItem(k)); } catch (e) {} }
  else load();
  const ql = qs.get('layout');
  if (ql && LAYOUTS[ql]) state.layout = ql;
  else state.layout = state.start;
  buildClocks();
  bindEvents();
  refreshStartUI();
  refreshSortUI();
  applyLayout(state.layout, false);
  rebuildGrid();
  applyAudio();
  tickClocks();
  setInterval(tickClocks, 1000);
}
boot();

})();
