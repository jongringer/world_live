/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — PWA 설치 지원 + 인앱 브라우저 → 크롬 연결 (pwa.js)
   ─ 크롬에서 '앱 설치 / 홈 화면에 추가' 가 가능한 앱으로 만들어 줍니다.
   ─ 상단 바의 [앱 설치] 버튼 한 번으로 설치 창(beforeinstallprompt)을 띄웁니다.
   ─ 카카오톡·네이버·인스타그램 등 '앱 안의 브라우저'로 링크를 열면
     앱 설치가 막히므로, ① 안드로이드: intent:// 로 크롬 자동 전환 1회 시도
     ② 안내 배너(크롬으로 열어서 앱 설치하기 / 닫기)를 함께 띄웁니다.
   ─ 크롬에서 from=kakao 로 열리면 [앱 설치] 버튼을 강조합니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.WorldLivePWA && window.WorldLivePWA.version >= 3) return;   // 중복 실행 방지

  const btn = document.getElementById('btn-install');
  const tip = document.getElementById('install-tip');
  let deferredPrompt = null;
  let tipTimer = null;

  /* ── 0. 환경 ─────────────────────────────────────────────── */
  const qs = new URLSearchParams(location.search);
  const fromKakao = qs.get('from') === 'kakao';

  // 실제 기기에서는 navigator.userAgent. QA(시뮬레이션)에서는 __WL_FORCE_UA 로 대체합니다.
  const uaStr = () => (typeof window.__WL_FORCE_UA === 'string' && window.__WL_FORCE_UA)
    ? window.__WL_FORCE_UA
    : (navigator.userAgent || '');

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* 사생활 보호 모드 */ } }
  };
  const K_TRIED = 'wl.escape.tried';     // 자동 크롬 전환은 탭마다 1회만
  const K_CLOSED = 'wl.bridge.closed';   // 배너를 닫으면 이번 탭에서는 다시 띄우지 않음
  const K_HINT = 'wl.chrome.hinted';     // 크롬 도착 안내도 1회만

  const isIOS = () => /iphone|ipad|ipod/i.test(uaStr());
  const isMobile = () => /android|iphone|ipad|ipod|mobile/i.test(uaStr());

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    navigator.standalone === true ||
    (typeof window.Capacitor !== 'undefined');   // Capacitor APK 안에서는 설치 버튼이 필요 없음

  /* ── 1. 인앱 브라우저 판별 (카카오톡 우선) ───────────────── */
  const IN_APP = [
    { key: 'kakao',     name: '카카오톡',      test: /KAKAOTALK/i },
    { key: 'naver',     name: '네이버 앱',     test: /NAVER\(inapp/i },
    { key: 'instagram', name: '인스타그램',    test: /Instagram/i },
    { key: 'facebook',  name: '페이스북',      test: /FBAN\/|FBAV\//i },
    { key: 'threads',   name: '스레드',        test: /Barcelona/i },
    { key: 'line',      name: '라인',          test: /\bLine\/\d/i },
    { key: 'band',      name: '밴드',          test: /\bBand\/\d/i },
    { key: 'daum',      name: '다음 앱',       test: /DaumApps|\bDaum\/\d/i },
    { key: 'tiktok',    name: '틱톡',          test: /musical_ly|BytedanceWebview|TikTok/i },
    { key: 'webview',   name: '앱 내 브라우저', test: /;\s*wv\)/i }
  ];

  function detectInApp(ua) {
    const u = ua || uaStr();
    const android = /Android/i.test(u);
    const ios = /iPhone|iPad|iPod/i.test(u);
    // 네이티브 앱(Capacitor)·이미 설치된 앱(PWA)은 해당 없음
    if (typeof window.Capacitor !== 'undefined' || location.protocol === 'capacitor:') {
      return { inApp: false, key: '', name: '', android, ios, ua: u };
    }
    const hit = IN_APP.filter(a => a.test.test(u))[0] || null;
    return { inApp: !!hit, key: hit ? hit.key : '', name: hit ? hit.name : '', android, ios, ua: u };
  }

  /* ── 2. 크롬으로 넘기는 링크 ────────────────────────────── */
  // 같은 페이지를 크롬에서 열되, '어디서 왔는지'를 ?from=kakao 로 남깁니다.
  function handoffUrl(href) {
    try {
      const u = new URL(href || location.href);
      if (!u.searchParams.has('from')) u.searchParams.set('from', 'kakao');
      return u.href;
    } catch (e) { return href || location.href; }
  }

  // intent://{host}{pathname}{search}#Intent;scheme=https;package=com.android.chrome;…;end
  // · 크롬이 없거나 인텐트가 취소되면 S.browser_fallback_url 로 원래 주소를 다시 엽니다.
  function chromeIntent(href) {
    const target = handoffUrl(href);
    let u;
    try { u = new URL(target); } catch (e) { return ''; }
    const scheme = (u.protocol || 'https:').replace(':', '') || 'https';
    return 'intent://' + u.host + u.pathname + (u.search || '')
      + '#Intent;scheme=' + scheme
      + ';package=com.android.chrome'
      + ';S.browser_fallback_url=' + encodeURIComponent(target)
      + ';end';
  }

  // iOS 카카오톡: 공식 외부 브라우저 열기 스킴 (실패하면 안내 단계를 그대로 보여 줌)
  function kakaoExternal(href) {
    return 'kakaotalk://web/openExternal?url=' + encodeURIComponent(handoffUrl(href));
  }

  /* ── 3. 자동 크롬 전환 (탭마다 1회) ──────────────────────── */
  function autoEscape(info) {
    if (!info || !info.inApp || !info.android) return false;
    if (isStandalone()) return false;
    if (store.get(K_TRIED) === '1') return false;    // 무한 루프 방지
    const url = chromeIntent(location.href);
    if (!url) return false;
    store.set(K_TRIED, '1');
    try { window.location.href = url; } catch (e) { /* 웹뷰가 막으면 배너로 안내 */ }
    return true;
  }

  /* ── 4. 안내 배너 ────────────────────────────────────────── */
  function removeBanner() {
    const old = document.getElementById('wl-bridge');
    if (old) old.remove();
  }

  function buildBanner(info) {
    removeBanner();
    const isKakao = info.key === 'kakao';
    const appName = info.name || '앱';
    const intent = info.android ? chromeIntent(location.href) : '';
    const ext = (!info.android && info.ios && isKakao) ? kakaoExternal(location.href) : '';
    const primaryHref = intent || ext;

    const btnLabel = info.ios ? 'Safari로 열어서 앱 설치하기' : '크롬으로 열어서 앱 설치하기';
    const browserName = info.ios ? 'Safari' : '크롬';

    let steps = '';
    if (info.ios) {
      steps = '<ol class="wl-b-steps">'
        + '<li><b>' + (isKakao ? '오른쪽 위 ⋯' : '오른쪽 위 ⋯') + '</b> → <b>Safari로 열기</b></li>'
        + '<li>Safari 아래 <b>공유</b> → <b>홈 화면에 추가</b></li>'
        + '</ol>';
    } else {
      steps = '<p class="wl-b-hint">버튼이 안 열리면 오른쪽 위 <b>⋮</b> → <b>다른 브라우저로 열기</b> → <b>Chrome</b></p>';
    }

    const el = document.createElement('div');
    el.id = 'wl-bridge';
    el.className = 'wl-bridge' + (info.ios ? ' is-ios' : '');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'wl-bridge-title');
    el.innerHTML =
        '<div class="wl-b-scrim" data-wl-bridge-close="1"></div>'
      + '<div class="wl-b-card">'
      +   '<div class="wl-b-tag"><span class="wl-b-dot"></span>' + appName + ' 안에서 열렸습니다</div>'
      +   '<h2 class="wl-b-title" id="wl-bridge-title">' + appName + '에서는<br>앱 설치가 제한됩니다</h2>'
      +   '<p class="wl-b-desc">아래 버튼을 누르면 <b>' + browserName + '</b>에서 열리고, 한 번만 설치하면<br>홈 화면 아이콘으로 앱처럼 바로 쓸 수 있습니다.</p>'
      +   (primaryHref
            ? '<a class="wl-b-primary" id="wl-b-open" href="' + primaryHref + '"'
              + ' data-intent="' + (intent || '') + '" rel="noopener">'
              + '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
              + '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/></svg>'
              + '<span>' + btnLabel + '</span></a>'
            : '')
      +   (steps || '')
      +   '<button type="button" class="wl-b-ghost" data-wl-bridge-close="1">닫기 (그냥 웹으로 보기)</button>'
      + '</div>';
    document.body.appendChild(el);
    document.body.classList.add('has-bridge');

    el.addEventListener('click', function (e) {
      const a = e.target.closest && e.target.closest('#wl-b-open');
      if (a) { store.set(K_CLOSED, '1'); return; }             // 버튼을 눌렀으면 배너는 역할을 다함
      if (e.target.closest && e.target.closest('[data-wl-bridge-close]')) closeBanner();
    });
    return el;
  }

  function closeBanner() {
    store.set(K_CLOSED, '1');
    document.body.classList.remove('has-bridge');
    removeBanner();
  }

  /* ── 5. 크롬에서 from=kakao 로 도착했을 때 설치 버튼 강조 ── */
  function markChromeArrival() {
    if (!fromKakao) return;
    document.body.classList.add('from-kakao');
    if (!isStandalone()) showBtn();          // 안내한 대로 바로 누를 수 있게 버튼을 먼저 보여 줍니다
    if (btn) btn.classList.add('install-cta');
    if (store.get(K_HINT) === '1') return;
    store.set(K_HINT, '1');
    setTimeout(showHandoffHint, 700);
  }

  function showHandoffHint() {
    if (document.getElementById('wl-chrome-hint') || isStandalone()) return;
    const el = document.createElement('div');
    el.id = 'wl-chrome-hint';
    el.className = 'wl-chrome-hint';
    el.innerHTML = '<b>크롬에서 열렸습니다</b>'
      + '<span>위쪽 <b>앱 설치</b>를 누르면 홈 화면에 앱으로 설치됩니다.</span>'
      + '<button type="button" aria-label="닫기">×</button>';
    document.body.appendChild(el);
    el.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON' || e.target === el) el.remove();
    });
    setTimeout(() => { if (el.parentNode) el.remove(); }, 15000);
  }

  /* ── 6. 설치 버튼 · 툴팁 ────────────────────────────────── */
  function showBtn() {
    if (!btn || isStandalone()) return;
    btn.hidden = false;
    document.body.classList.add('has-install-btn');
  }
  function hideBtn() {
    if (!btn) return;
    btn.hidden = true;
    document.body.classList.remove('has-install-btn');
    hideTip();
  }

  function tipText() {
    if (isIOS()) {
      return 'Safari 아래 <b>공유</b> 버튼 → <b>홈 화면에 추가</b> 를 누르면 앱처럼 설치됩니다.';
    }
    if (isMobile()) {
      return '크롬 오른쪽 위 <b>⋮</b> 메뉴 → <b>앱 설치</b>(또는 <b>홈 화면에 추가</b>)를 누르면 앱처럼 설치됩니다.';
    }
    return '크롬 주소창 오른쪽의 <b>설치 아이콘</b> 또는 메뉴 <b>⋮ → 앱 설치</b> 를 누르면 앱처럼 설치됩니다.';
  }

  function showTip() {
    if (!tip) return;
    const extra = isMobile()
      ? '설치하면 홈 화면 아이콘으로 열리고, 새 버전은 자동으로 반영됩니다.'
      : '설치하면 창이 하나의 앱처럼 열리고, 새 버전은 열 때마다 자동 반영됩니다.';
    tip.innerHTML = '<div class="it-head">WORLD LIVE 앱으로 설치</div>'
      + '<div class="it-body">' + tipText() + '</div>'
      + '<div class="it-sub">' + extra + '</div>'
      + '<button type="button" class="it-close" data-install-tip-close="1">확인</button>';
    tip.hidden = false;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(hideTip, 12000);
  }
  function hideTip() {
    clearTimeout(tipTimer);
    if (tip) tip.hidden = true;
  }

  /* ── 7. 시작 ─────────────────────────────────────────────── */
  const info = detectInApp();

  // (a) 인앱 브라우저: 배너를 먼저 띄우고 → 안드로이드면 크롬 전환을 1회 시도
  function bootBridge(forceUa, opts) {
    const o = opts || {};
    const detected = detectInApp(forceUa);
    if (!detected.inApp) { removeBanner(); document.body.classList.remove('has-bridge'); return detected; }
    if (store.get(K_CLOSED) === '1') return detected;
    buildBanner(detected);
    hideBtn();                                  // 인앱 브라우저에서는 설치 버튼 대신 배너
    if (o.auto !== false) setTimeout(() => autoEscape(detected), 30);
    return detected;
  }

  if (info.inApp) bootBridge(null, { auto: true });
  else markChromeArrival();

  /* ── 서비스 워커 등록 ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' })
        .then(reg => { reg.update().catch(() => {}); })
        .catch(() => { /* file://, 사생활 보호 모드 등에서는 조용히 넘어감 */ });
    });
  }

  /* ── 설치 프롬프트 ── */
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showBtn();
    if (fromKakao && btn) btn.classList.add('install-cta');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBtn();
    document.body.classList.remove('from-kakao');
    if (btn) btn.classList.remove('install-cta');
    const h = document.getElementById('wl-chrome-hint');
    if (h) h.remove();
    if (typeof window.toast === 'function') window.toast('홈 화면에 앱이 설치되었습니다');
  });

  if (btn) {
    btn.addEventListener('click', async () => {
      if (deferredPrompt) {
        try {
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          deferredPrompt = null;
          if (choice && choice.outcome === 'accepted') hideBtn();
          else if (!isStandalone()) showBtn();
        } catch (err) {
          showTip();
        }
        return;
      }
      showTip();       // beforeinstallprompt 미지원 → 크롬 메뉴 안내
    });
  }

  if (tip) {
    tip.addEventListener('click', e => {
      if (e.target.closest('[data-install-tip-close]')) hideTip();
    });
    document.addEventListener('click', e => {
      if (tip.hidden) return;
      if (e.target.closest('#install-tip') || e.target.closest('#btn-install')) return;
      hideTip();
    }, true);
  }

  /* ── 상태에 따른 버튼 노출 ──
     · 이미 설치(standalone) → 숨김
     · 인앱 브라우저(카카오톡 등) → 숨김(배너가 안내)
     · 안드로이드·iOS 모바일 브라우저(미설치) → 안내용 버튼 노출
     · 데스크톱 → beforeinstallprompt 가 잡히면 노출, 아니면 조용히 대기 */
  function sync() {
    if (isStandalone() || detectInApp().inApp) { hideBtn(); return; }
    if (deferredPrompt) { showBtn(); return; }
    if (isMobile()) showBtn();
  }

  sync();
  setTimeout(sync, 1200);
  const mqStandalone = window.matchMedia('(display-mode: standalone)');
  if (mqStandalone.addEventListener) mqStandalone.addEventListener('change', sync);
  else if (mqStandalone.addListener) mqStandalone.addListener(sync);
  window.addEventListener('focus', sync);

  // 다른 스크립트·검증에서 상태를 확인할 수 있게 노출
  window.WorldLivePWA = {
    version: 3,
    isStandalone,
    isInstallable: () => !!deferredPrompt,
    showTip,
    hideTip,
    inApp: {
      detect: detectInApp,
      intent: chromeIntent,
      handoff: handoffUrl,
      external: kakaoExternal,
      keyTried: K_TRIED,
      show(ua, opts) {                 // 배너만 띄워 확인(자동 전환은 opts.auto)
        store.set(K_CLOSED, '0');
        return bootBridge(ua || null, opts || { auto: false });
      },
      close: closeBanner,
      tryAuto(ua) {                    // 자동 크롬 전환 1회 시도(가드 확인용)
        store.set(K_TRIED, '0');
        return autoEscape(detectInApp(ua || null));
      },
      tried: () => store.get(K_TRIED)
    }
  };
})();
