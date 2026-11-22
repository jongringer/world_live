/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE // GLOBAL NEWSROOM MONITOR — app.js
   16:9 broadcast multiview · YouTube live / HLS / web sources
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ── constants ─────────────────────────────────────────────── */
const LS_KEY = 'worldlive.v1';
const LAYOUTS = {
  '9': { cols: 3, rows: 3, count: 9 },
  '4': { cols: 2, rows: 2, count: 4 },
  '6': { cols: 3, rows: 2, count: 6 },
  '1': { cols: 1, rows: 1, count: 1 }
};
const GAP = 6;
const ZONES = { ASIA:'ASIA · PACIFIC', AMERICAS:'AMERICAS', EUROPE:'EUROPE', MIDEast:'MIDDLE EAST' };

/* ── state ─────────────────────────────────────────────────── */
const state = {
  layout: '9',
  slots: DEFAULT_SLOTS.slice(),
  custom: [],
  focused: 0,
  audio: null,
  muted: true,
  startedAt: Date.now()
};
const live = {};           // slot -> { node, media, iframe, player, video, hls, ch, state }
let ytApi = null, ytApiLoading = false, ytApiQueue = [];

/* ── dom ───────────────────────────────────────────────────── */
const $ = (s, r) => (r || document).querySelector(s);
const grid = $('#grid');
const stage = $('#stage');
const modalRoot = $('#modal-root');
const srcGrid = $('#src-grid');
const srcSearch = $('#src-search');
let modalSlot = null;      // null = manage-only

/* ── persistence ───────────────────────────────────────────── */
function save() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      layout: state.layout, slots: state.slots, custom: state.custom,
      focused: state.focused, muted: state.muted
    }));
  } catch (e) {}
}
function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d && typeof d === 'object') {
      if (LAYOUTS[d.layout]) state.layout = d.layout;
      if (Array.isArray(d.slots) && d.slots.length === 9) state.slots = d.slots;
      if (Array.isArray(d.custom)) state.custom = d.custom.filter(c => c && c.id && c.kind && c.src);
      if (typeof d.focused === 'number' && d.focused >= 0 && d.focused < 9) state.focused = d.focused;
      if (typeof d.muted === 'boolean') state.muted = d.muted;
    }
  } catch (e) {}
}

/* ── channel helpers ───────────────────────────────────────── */
function allChannels() { return CHANNELS.concat(state.custom); }
function byId(id) {
  return CHANNEL_BY_ID[id] || state.custom.find(c => c.id === id) || null;
}
function slotChannel(i) {
  return byId(state.slots[i]) || CHANNELS[0];
}
function visibleCount() { return LAYOUTS[state.layout].count; }
function visibleSlots() {
  if (state.layout === '1') return [state.focused];
  return Array.from({ length: LAYOUTS[state.layout].count }, (_, i) => i);
}

/* ── clocks ────────────────────────────────────────────────── */
const CLOCKS = [
  { tz:'Asia/Seoul',    label:'SEOUL',  suf:'KST', local:true  },
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

/* ── YouTube iframe API / postMessage bridge ───────────────── */
function ensureYT() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  return new Promise(resolve => {
    ytApiQueue.push(resolve);
    if (ytApiLoading) return;
    ytApiLoading = true;
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prev === 'function') prev();
      ytApiQueue.forEach(fn => fn(window.YT));
      ytApiQueue = [];
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.head.appendChild(s);
  });
}
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
    L.ytConfirmed = true;
    const tEl = live[slot] && live[slot].node;
    if (tEl) tEl.classList.remove('pass');
    if (typeof info.playerState === 'number') {
      L.stateSrc = 'api';
      if (info.playerState === 1) setTileState(slot, 'live');
      else if (info.playerState === 3) setTileState(slot, 'sync');
      else if (info.playerState === 0 || info.playerState === 2) setTileState(slot, 'offline');
    }
    if (typeof info.muted === 'number' || typeof info.muted === 'boolean') L.ytMuted = !!info.muted;
  }
  if (d.event === 'onReady') { ytCmd(slot, state.muted || state.audio !== slot ? 'mute' : 'unMute'); }
  if (d.event === 'onError') {
    const code = (d.info && d.info.data) || '?';
    L.err = code;
    setTileState(slot, 'error');
    showVeil(slot, 'YouTube 임베드 거부 (오류 ' + code + ')',
      '방송사가 이 라이브의 외부 페이지 삽입을 제한했습니다. 새 창에서 공식 라이브를 열 수 있습니다.',
      '새 창에서 열기', 'open');
  }
  if (d.event === 'initialDelivery') { L.stateSrc = 'api'; setTileState(slot, 'live'); }
});

/* ── tile build ────────────────────────────────────────────── */
const ICONS = {
  src:'<svg viewBox="0 0 16 16"><g stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><path d="M2.5 4.4h11M2.5 8h11M2.5 11.6h11"/><circle cx="5.6" cy="4.4" r="1.5" fill="#0B1017"/><circle cx="10.4" cy="8" r="1.5" fill="#0B1017"/><circle cx="6.8" cy="11.6" r="1.5" fill="#0B1017"/></g></svg>',
  spk:'<svg viewBox="0 0 16 16"><path d="M2.6 6h2.2L7.6 3.6v8.8L4.8 10H2.6z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M9.6 6a2.9 2.9 0 0 1 0 4M11.6 4.2a5.4 5.4 0 0 1 0 7.6" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
  spkOff:'<svg viewBox="0 0 16 16"><path d="M2.6 6h2.2L7.6 3.6v8.8L4.8 10H2.6z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><g stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M10.2 6.2l3.4 3.6M13.6 6.2l-3.4 3.6"/></g></svg>',
  max:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"><path d="M6 2.4H2.4V6M10 2.4h3.6V6M6 13.6H2.4V10M10 13.6h3.6V10"/></g></svg>',
  min:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"><path d="M2.6 6H6V2.6M13.4 6H10V2.6M2.6 10H6v3.4M13.4 10H10v3.4"/></g></svg>',
  pop:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M9.4 2.6h4v4M13.4 2.6L8.6 7.4"/><path d="M12 9.8v3.2a.8.8 0 0 1-.8.8H2.8a.8.8 0 0 1-.8-.8V5.4a.8.8 0 0 1 .8-.8h3.2"/></g></svg>',
  re:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M13.2 6.7A5.3 5.3 0 1 0 13.7 9"/><path d="M13.9 2.9v3.8H10"/></g></svg>',
  warn:'<svg viewBox="0 0 24 24"><path d="M12 3.4L21.2 19.6H2.8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 9v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16.8" r=".9" fill="currentColor"/></svg>',
  link:'<svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M6.6 9.4l2.8-2.8"/><path d="M9.2 4.6l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7l-1.2 1.2"/><path d="M6.8 11.4l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7l1.2-1.2"/></g></svg>'
};

function buildTile(i) {
  const ch = slotChannel(i);
  const el = document.createElement('article');
  el.className = 'tile';
  el.dataset.slot = String(i);
  el.dataset.kind = ch.kind;
  el.dataset.state = 'loading';
  el.innerHTML = `
    <div class="tile-media"></div>
    <div class="tile-hit"></div>
    <div class="tlay-top">
      <div class="chan-tag">
        <span class="live-badge"><span class="live-dot"></span><span class="live-txt">LIVE</span></span>
        <span class="chan-name">${esc(ch.name)}</span>
        <span class="chan-cc">${esc(ch.cc || '')}</span>
      </div>
      <span class="tile-index">${String(i + 1).padStart(2, '0')}</span>
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
        <button class="tbtn" data-act="src" title="소스 변경">${ICONS.src}</button>
        <button class="tbtn" data-act="max" title="1×1 전체화면">${ICONS.max}</button>
        <button class="tbtn" data-act="pop" title="새 창에서 열기">${ICONS.pop}</button>
        <button class="tbtn" data-act="reload" title="이 피드 새로고침">${ICONS.re}</button>
      </div>
    </div>`;
  if (i === state.focused) el.classList.add('is-focus');
  return el;
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

/* ── mounting sources ──────────────────────────────────────── */
function mountSlot(i) {
  const el = grid.querySelector('.tile[data-slot="' + i + '"]');
  if (!el) return;
  const ch = slotChannel(i);
  const media = el.querySelector('.tile-media');
  media.innerHTML = '';
  live[i] = { node: el, media: media, ch: ch, state: 'loading', iframe: null, video: null, hls: null };
  el.dataset.kind = ch.kind;
  el.dataset.state = 'loading';
  hideVeil(i);

  const muted = state.muted || state.audio !== i;

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
    iframe.src = 'https://www.youtube.com/' + path + '&' + params.toString();
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'origin';
    iframe.title = ch.name + ' live';
    media.appendChild(iframe);
    live[i].iframe = iframe;
    const handshake = () => { ytListen(i); ytCmd(i, muted ? 'mute' : 'unMute'); };
    iframe.addEventListener('load', () => { setTimeout(handshake, 350); setTimeout(handshake, 1400); });
    setTimeout(handshake, 1600);
    setTimeout(() => {
      if (!live[i]) return;
      ytCmd(i, 'addEventListener', ['onStateChange']);
      if (live[i].state !== 'live') ytCmd(i, 'playVideo');
    }, 6500);
    setTimeout(() => { if (live[i] && live[i].state === 'loading') setTileState(i, 'live'); }, 9000);

  } else if (ch.kind === 'hls') {
    const v = document.createElement('video');
    v.muted = muted; v.autoplay = true; v.playsInline = true; v.controls = false;
    v.setAttribute('playsinline', '');
    v.title = ch.name + ' live';
    media.appendChild(v);
    live[i].video = v;
    v.addEventListener('playing', () => setTileState(i, 'live'));
    v.addEventListener('waiting', () => setTileState(i, 'sync'));
    v.addEventListener('error', () => failHls(i, '재생 오류'));
    attachHls(i, v, ch.src);

  } else if (ch.kind === 'web') {
    showVeil(i, '외부 공식 플레이어', ch.note || (ch.name + '은(는) 공식 사이트에서만 재생되며 외부 페이지 삽입이 차단되어 있습니다.'), '새 창에서 열기', 'open');
    setTileState(i, 'external');
  }
}

function attachHls(i, v, url) {
  const nativeHls = v.canPlayType('application/vnd.apple.mpegurl');
  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({
      lowLatencyMode: false,
      liveSyncDurationCount: 4,
      maxBufferLength: 24,
      manifestLoadingMaxRetry: 4,
      levelLoadingMaxRetry: 4,
      fragLoadingMaxRetry: 4
    });
    live[i].hls = hls;
    hls.loadSource(url);
    hls.attachMedia(v);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
    });
    hls.on(window.Hls.Events.ERROR, (evt, data) => {
      if (!data) return;
      if (data.fatal) {
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          setTileState(i, 'sync');
          setTimeout(() => { try { hls.startLoad(); } catch (e) {} }, 1800);
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          try { hls.recoverMediaError(); } catch (e) {}
        } else {
          failHls(i, 'HLS 스트림 연결 실패');
        }
      }
    });
  } else if (nativeHls) {
    v.src = url;
    v.play().catch(() => {});
  } else {
    failHls(i, '이 브라우저는 HLS를 지원하지 않습니다');
  }
}

function failHls(i, msg) {
  const ch = slotChannel(i);
  setTileState(i, 'error');
  showVeil(i, '스트림 연결 실패', msg + ' — ' + ch.name + '. 잠시 후 다시 시도하거나 다른 소스를 선택하세요.', '다시 시도', 'retry');
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
function setTileState(i, st, detail) {
  const el = grid.querySelector('.tile[data-slot="' + i + '"]');
  if (!el || !live[i]) return;
  live[i].state = st;
  el.dataset.state = st;
  const txt = el.querySelector('.live-txt');
  if (txt) txt.textContent = st === 'error' ? 'ERROR' : st === 'offline' ? 'OFFLINE' : st === 'sync' ? 'SYNC' : st === 'external' ? 'EXT' : 'LIVE';
  if (st === 'live') hideVeil(i);
  if (st === 'offline' && !el.querySelector('.tile-veil.is-shown')) {
    showVeil(i, '라이브 신호 없음', (live[i].ch.name) + ' 채널이 지금 YouTube 라이브를 송출하지 않습니다. 다른 소스를 선택하거나 잠시 후 다시 시도하세요.', '소스 변경', 'src');
  }
  updateStrip();
}

/* ── grid layout ───────────────────────────────────────────── */
function applyLayout(layout, rebuild) {
  if (!LAYOUTS[layout]) layout = '9';
  state.layout = layout;
  grid.dataset.layout = layout;
  document.querySelectorAll('.layout-btn').forEach(b => b.classList.toggle('is-active', b.dataset.layout === layout));
  if (rebuild !== false) rebuildGrid();
  else sizeGrid();
  save();
}
function sizeGrid() {
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
function rebuildGrid() {
  destroyAll();
  gen++;
  const myGen = gen;
  grid.innerHTML = '';
  const slots = visibleSlots();
  slots.forEach(s => grid.appendChild(buildTile(s)));
  sizeGrid();
  ensureHls().then(() => {
    if (myGen !== gen) return;
    slots.forEach((s, idx) => setTimeout(() => { if (myGen === gen) mountSlot(s); }, idx * 110));
  });
  syncAudioButtons();
  updateStrip();
}
function destroyAll() {
  Object.keys(live).forEach(k => {
    const L = live[k];
    try { if (L.hls) L.hls.destroy(); } catch (e) {}
    try { if (L.video) { L.video.pause(); L.video.removeAttribute('src'); L.video.load(); } } catch (e) {}
    try { if (L.iframe) { L.iframe.src = 'about:blank'; } } catch (e) {}
    delete live[k];
  });
}
var gen = 0;
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

/* ── audio ─────────────────────────────────────────────────── */
function setAudio(i) {
  if (state.audio === i) { state.audio = null; state.muted = true; }
  else if (i == null) { state.audio = null; state.muted = true; }
  else { state.audio = i; state.muted = false; }
  applyAudio();
  save();
}
function applyAudio() {
  Object.keys(live).forEach(k => {
    const i = parseInt(k, 10), L = live[k];
    const muted = state.muted || state.audio !== i;
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
    const on = !state.muted && state.audio === i;
    const btn = el.querySelector('[data-act="audio"]');
    if (!btn) return;
    btn.classList.toggle('is-on', on);
    btn.innerHTML = on ? '<span class="eq"><i></i><i></i><i></i></span>' : ICONS.spkOff;
    btn.title = on ? '음성 켜짐 — 누르면 음소거' : '이 채널 단독 청취';
  });
  const mb = $('#btn-mute');
  const anyOn = !state.muted && state.audio != null;
  mb.classList.toggle('is-muted', !anyOn);
  mb.title = anyOn ? '전체 음소거' : '음성 켜기 (첫 채널)';
}
function updateStrip() {
  const slots = visibleSlots();
  const count = slots.length;
  let ok = 0, warn = 0;
  for (let n = 0; n < slots.length; n++) {
    const i = slots[n];
    const s = live[i] ? live[i].state : 'loading';
    if (s === 'live') ok++;
    else if (s === 'error' || s === 'offline') warn++;
  }
  const led = $('#ss-led');
  led.classList.toggle('is-warn', warn > 0);
  $('#ss-status').textContent = 'MASTER CONTROL — ' + ok + '/' + count + ' FEEDS NOMINAL' + (warn ? ' · ' + warn + ' CHECK' : '');
  const ch = state.audio != null ? slotChannel(state.audio) : null;
  $('#ss-audio').innerHTML = (state.muted || !ch) ? 'AUDIO — ALL MUTED' : 'AUDIO — <b>' + esc(ch.name) + '</b>';
}

/* ── focus ─────────────────────────────────────────────────── */
function setFocus(i) {
  state.focused = i;
  grid.querySelectorAll('.tile').forEach(el => el.classList.toggle('is-focus', parseInt(el.dataset.slot, 10) === i));
  save();
}

/* ── modal ─────────────────────────────────────────────────── */
function openModal(slot) {
  modalSlot = (typeof slot === 'number') ? slot : null;
  $('#modal-kicker').textContent = modalSlot == null ? 'SOURCE LIBRARY' : 'SOURCE PATCH BAY — SLOT ' + String(modalSlot + 1).padStart(2, '0');
  $('#modal-title').textContent = modalSlot == null ? '소스 라이브러리 · 커스텀 소스' : '소스 선택 — ' + slotChannel(modalSlot).name;
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
    return (c.name + ' ' + (c.country || '') + ' ' + (c.cc || '') + ' ' + (c.zone || '')).toLowerCase().indexOf(query) >= 0;
  });
  const current = modalSlot != null ? state.slots[modalSlot] : null;
  srcGrid.innerHTML = '';
  if (!list.length) { srcGrid.innerHTML = '<div class="empty-note">검색 결과가 없습니다.</div>'; return; }

  const groups = {};
  list.forEach(c => { const z = c.zone || 'ASIA'; (groups[z] = groups[z] || []).push(c); });
  const order = ['ASIA', 'AMERICAS', 'EUROPE', 'MIDEast'];
  order.forEach(z => {
    const arr = groups[z];
    if (!arr) return;
    if (!query) {
      const lab = document.createElement('div');
      lab.className = 'src-group-label';
      lab.textContent = ZONES[z] || z;
      srcGrid.appendChild(lab);
      const sub = document.createElement('div');
      sub.className = 'src-grid';
      sub.style.gridColumn = '1 / -1';
      arr.forEach(c => sub.appendChild(srcCard(c, current)));
      srcGrid.appendChild(sub);
    } else {
      arr.forEach(c => srcGrid.appendChild(srcCard(c, current)));
    }
  });
  if (!query) srcGrid.style.gridTemplateColumns = '1fr';
  else srcGrid.style.gridTemplateColumns = '';
}
function srcCard(c, current) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'src-card' + (current === c.id ? ' is-current' : '');
  b.dataset.kind = c.kind;
  b.dataset.id = c.id;
  const isCustom = !!c.custom;
  b.innerHTML = `
    <span class="src-logo">${esc(c.short || c.name.slice(0, 3))}</span>
    <span class="src-info">
      <span class="src-name">${esc(c.name)}</span>
      <span class="src-meta">
        <span class="dot${c.status === 'event' || c.status === 'external' ? ' warn' : ''}"></span>
        ${esc(c.cc || '')} · ${KIND_LABEL[c.kind] || ''}${c.status === 'event' ? ' · EVENT' : c.status === 'external' ? ' · 외부' : ''}
      </span>
    </span>
    ${isCustom ? '<span class="src-del" data-del="' + esc(c.id) + '" title="삭제"><svg viewBox="0 0 16 16"><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></g></svg></span>' : ''}`;
  b.addEventListener('click', ev => {
    const del = ev.target.closest('[data-del]');
    if (del) {
      ev.stopPropagation();
      state.custom = state.custom.filter(x => x.id !== del.dataset.del);
      state.slots = state.slots.map(s => s === del.dataset.del ? 'nhk' : s);
      save(); renderSources(srcSearch.value); rebuildGrid();
      toast('커스텀 소스를 삭제했습니다');
      return;
    }
    if (modalSlot == null) { toast('타일의 소스 변경 버튼에서 슬롯을 지정할 수 있습니다'); return; }
    assignSource(modalSlot, c.id);
  });
  return b;
}
function assignSource(slot, id) {
  state.slots[slot] = id;
  save();
  closeModal();
  const ch = byId(id);
  toast('SLOT ' + String(slot + 1).padStart(2, '0') + ' — ' + (ch ? ch.name : id));
  const el = grid.querySelector('.tile[data-slot="' + slot + '"]');
  if (el) {
    const fresh = buildTile(slot);
    el.replaceWith(fresh);
    if (state.layout === '1') fresh.classList.add('is-focus');
  }
  mountSlot(slot);
  applyAudio();
}

/* ── custom source parsing ─────────────────────────────────── */
function parseCustom(raw, name) {
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

/* ── events ────────────────────────────────────────────────── */
function bindEvents() {
  document.querySelectorAll('.layout-btn').forEach(b => {
    b.addEventListener('click', () => applyLayout(b.dataset.layout));
  });
  $('#btn-fullscreen').addEventListener('click', toggleFullscreen);
  $('#btn-mute').addEventListener('click', () => {
    if (!state.muted && state.audio != null) { state.audio = null; state.muted = true; applyAudio(); save(); }
    else { setAudio(state.layout === '1' ? state.focused : state.focused || 0); }
  });
  $('#btn-reload').addEventListener('click', () => { rebuildGrid(); toast('모든 피드를 다시 연결합니다'); });
  $('#btn-sources').addEventListener('click', () => openModal(null));

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
    if (act === 'audio') { setAudio(i); setFocus(i); return; }
    if (act === 'max') { toggleFocusLayout(i); return; }
    if (act === 'pop') { openExternal(i); return; }
    if (act === 'reload') { mountSlot(i); toast(slotChannel(i).name + ' — 재연결'); return; }
    if (act === 'open') { openExternal(i); return; }
    if (act === 'retry') { mountSlot(i); return; }
    const L = live[i];
    const kd = slotChannel(i).kind;
    if (L && (kd === 'youtube' || kd === 'youtube-video') && L.ytConfirmed !== true) {
      t.classList.add('pass');
      if (t.dataset.passTip !== '1') {
        toast(slotChannel(i).name + ' — 영상의 재생 버튼을 눌러 주세요');
        t.dataset.passTip = '1';
      }
    }
    setFocus(i);
  });
  grid.addEventListener('dblclick', e => {
    const t = e.target.closest('.tile'); if (!t) return;
    toggleFocusLayout(parseInt(t.dataset.slot, 10));
  });

  // modal
  modalRoot.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
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
    if (k === 'escape') { if (!modalRoot.hidden) closeModal(); return; }
    if (k === '1') applyLayout('9');
    else if (k === '2') applyLayout('4');
    else if (k === '3') applyLayout('6');
    else if (k === '4') applyLayout('1');
    else if (k === 'f') toggleFullscreen();
    else if (k === 'm') $('#btn-mute').click();
    else if (k === 'r') rebuildGrid();
    else if (k === 's') openModal(null);
  });

  window.addEventListener('resize', () => sizeGrid());
  document.addEventListener('fullscreenchange', () => {
    $('#btn-fullscreen').classList.toggle('is-active', !!document.fullscreenElement);
    setTimeout(sizeGrid, 60);
  });
}

function toggleFocusLayout(i) {
  if (state.layout === '1' && state.focused === i) { applyLayout('9'); return; }
  state.focused = i;
  applyLayout('1');
  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}
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

/* ── debug hook (검증용) ───────────────────────────────────── */
window.WORLD_LIVE = {
  state: () => ({
    layout: state.layout, muted: state.muted, audio: state.audio, focused: state.focused,
    slots: state.slots.slice(),
    tiles: Object.keys(live).map(k => ({ slot: +k, name: live[k].ch.name, kind: live[k].ch.kind, state: live[k].state, src: live[k].stateSrc || null, err: live[k].err || null }))
  }),
  setLayout: l => applyLayout(l),
  setAudio: i => setAudio(i)
};

/* ── boot ──────────────────────────────────────────────────── */
function boot() {
  const qs = new URLSearchParams(location.search);
  if (qs.has('reset')) { try { localStorage.removeItem(LS_KEY); } catch (e) {} }
  else load();
  if (qs.get('layout') && LAYOUTS[qs.get('layout')]) state.layout = qs.get('layout');
  buildClocks();
  bindEvents();
  applyLayout(state.layout, false);
  rebuildGrid();
  applyAudio();
  tickClocks();
  setInterval(tickClocks, 1000);
  const first = CHANNELS[0];
  $('#ss-status').textContent = 'MASTER CONTROL — ' + visibleCount() + ' FEEDS INITIALISING';
}
boot();

})();
