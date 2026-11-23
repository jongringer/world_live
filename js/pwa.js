/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — PWA 설치 지원 (pwa.js)
   ─ 크롬에서 '앱 설치 / 홈 화면에 추가' 가 가능한 앱으로 만들어 줍니다.
   ─ 상단 바의 [앱 설치] 버튼 한 번으로 설치 창(beforeinstallprompt)을 띄웁니다.
   ─ 이미 앱(standalone)으로 실행 중이면 버튼은 자동으로 숨습니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const btn = document.getElementById('btn-install');
  const tip = document.getElementById('install-tip');
  let deferredPrompt = null;
  let tipTimer = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    navigator.standalone === true ||
    (typeof window.Capacitor !== 'undefined');   // Capacitor APK 안에서는 설치 버튼이 필요 없음

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = () => /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);

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
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBtn();
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
     · 안드로이드·iOS 모바일 브라우저(미설치) → 안내용 버튼 노출
     · 데스크톱 → beforeinstallprompt 가 잡히면 노출, 아니면 조용히 대기 */
  function sync() {
    if (isStandalone()) { hideBtn(); return; }
    if (deferredPrompt) { showBtn(); return; }
    if (isMobile()) showBtn();
  }

  sync();
  setTimeout(sync, 1200);
  const mqStandalone = window.matchMedia('(display-mode: standalone)');
  if (mqStandalone.addEventListener) mqStandalone.addEventListener('change', sync);
  else if (mqStandalone.addListener) mqStandalone.addListener(sync);
  window.addEventListener('focus', sync);

  // 다른 스크립트에서 상태를 확인할 수 있게 노출
  window.WorldLivePWA = {
    isStandalone,
    isInstallable: () => !!deferredPrompt,
    showTip
  };
})();
