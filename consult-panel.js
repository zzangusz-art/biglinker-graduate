(function () {
  'use strict';

  // ── CUSTOMIZE ────────────────────────────────────────────────────────────
  var NOTIFY_URL = '/api/notify'; // Vercel 서버리스 함수 (env: SLACK_WEBHOOK)
  var PAGE_TITLE = document.title || location.pathname;
  // ─────────────────────────────────────────────────────────────────────────

  var PANEL_HTML = '\
<div class="cp" id="cp" role="dialog" aria-modal="true" aria-label="상담 신청">\
  <div class="cp__hd">\
    <span class="cp__hd-dot"></span>\
    <span class="cp__hd-title">BigLinker 상담 신청</span>\
    <button class="cp__hd-min" id="cp-close" aria-label="닫기" type="button">\
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>\
    </button>\
  </div>\
  <div class="cp__bd">\
    <div class="cp__quick">\
      <a class="cp__qbtn cp__qbtn--call" href="tel:02-2039-8584">\
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.93a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>\
        02-2039-8584\
      </a>\
      <a class="cp__qbtn cp__qbtn--kakao" href="https://pf.kakao.com/_wzmxdn/chat" target="_blank" rel="noopener noreferrer">\
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.72 2 11.25c0 2.84 1.6 5.34 4.05 6.88l-.73 2.72a.5.5 0 0 0 .72.57l3.22-1.86c.55.08 1.12.13 1.74.13 5.52 0 10-3.72 10-8.25S17.52 3 12 3z"/></svg>\
        카카오톡 상담\
      </a>\
    </div>\
    <div class="cp__sep">또는 신청서 작성</div>\
    <form class="cp__form" id="cp-form" novalidate>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-name">이름 <em>*</em></label>\
        <input class="cp__inp" id="cp-name" name="name" type="text" placeholder="홍길동" autocomplete="name" />\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-email">이메일</label>\
        <input class="cp__inp" id="cp-email" name="email" type="email" placeholder="example@email.com" autocomplete="email" />\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-phone">휴대폰 번호 <em>*</em></label>\
        <input class="cp__inp" id="cp-phone" name="phone" type="tel" placeholder="010-0000-0000" autocomplete="tel" />\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-msg">문의사항</label>\
        <textarea class="cp__ta" id="cp-msg" name="message" placeholder="궁금하신 점을 자유롭게 적어주세요." rows="3"></textarea>\
      </div>\
      <label class="cp__consent">\
        <input id="cp-agree" name="agree" type="checkbox" checked />\
        <span><strong>개인정보 수집 및 이용 동의 (필수)</strong>수집 항목: 이름, 연락처, 이메일 · 목적: 상담 안내</span>\
      </label>\
      <div id="cp-err" style="display:none;font-size:11px;color:#e05252;padding:2px 0 0;"></div>\
      <button class="cp__sub" id="cp-submit" type="submit">상담 신청하기</button>\
      <p class="cp__note">평일 09:00 – 22:00 · 주말 10:00 – 18:00</p>\
    </form>\
    <div class="cp__done" id="cp-done">\
      <div class="cp__done-ico">&#10003;</div>\
      <strong>신청이 완료됐어요!</strong>\
      <p>빠른 시간 내에 연락드리겠습니다.</p>\
      <a class="cp__qbtn cp__qbtn--kakao" href="https://pf.kakao.com/_wzmxdn/chat" target="_blank" rel="noopener noreferrer" style="margin-top:4px;">\
        카카오톡으로 먼저 연락하기\
      </a>\
    </div>\
  </div>\
</div>\
<button class="cp-tab" id="cp-tab" aria-label="상담 신청 열기" type="button">상담신청</button>\
<div class="cp-overlay" id="cp-overlay"></div>\
<div class="cp-hint-toast" id="cp-hint-toast">상담창이 열려 있어요.\n원하는 방식으로 문의해 주세요.</div>';

  // ── Inject ────────────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', PANEL_HTML);
  document.body.classList.add('has-consult-panel');

  // ── Element refs ─────────────────────────────────────────────────────────
  var panel     = document.getElementById('cp');
  var tab       = document.getElementById('cp-tab');
  var closeBtn  = document.getElementById('cp-close');
  var overlay   = document.getElementById('cp-overlay');
  var form      = document.getElementById('cp-form');
  var doneEl    = document.getElementById('cp-done');
  var errEl     = document.getElementById('cp-err');
  var submitBtn = document.getElementById('cp-submit');
  var hintToast = document.getElementById('cp-hint-toast');

  var isOpen    = false;
  var hintTimer = null;

  // ── isConsultTarget ───────────────────────────────────────────────────────
  // 상담/문의 관련 버튼인지 판별. 순위:
  //  1) 항상 상담인 클래스 (.cta-btn, .urgency-band__cta, .mobile-floating-cta)
  //  2) 명시적 상담 앵커 (#cta, #consult, #cta-title, #contact)
  //  3) mailto: 링크 (이메일 상담)
  //  4) href="#" 이면서 텍스트에 상담|문의|신청 포함
  // 섹션 이동 앵커(#process, #roadmap, #program 등)는 제외
  function isConsultTarget(el) {
    if (!el || !el.tagName) { return false; }

    var cls  = el.classList;
    var href = (el.getAttribute && el.getAttribute('href')) || '';
    var text = (el.textContent || '').trim();

    // 1) 클래스로 판별 (태그 무관)
    if (cls) {
      if (cls.contains('cta-btn'))             { return true; }
      if (cls.contains('urgency-band__cta'))   { return true; }
      if (cls.contains('mobile-floating-cta')) { return true; }
    }

    // 앵커 태그에만 적용
    if (el.tagName !== 'A') { return false; }

    // 2) 명시적 상담 앵커
    var consultAnchors = ['#cta', '#consult', '#cta-title', '#contact'];
    for (var i = 0; i < consultAnchors.length; i++) {
      if (href === consultAnchors[i]) { return true; }
    }

    // 3) mailto
    if (href.indexOf('mailto:') === 0) { return true; }

    // 4) href="#" + 상담/문의/신청 키워드
    if (href === '#' && /상담|문의|신청/.test(text)) { return true; }

    return false;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function isMobile() { return window.innerWidth <= 760; }

  function openPanel() {
    isOpen = true;
    panel.classList.add('cp--open');
    tab.classList.add('cp-tab--hidden');
    document.body.classList.add('cp-is-open');
    if (isMobile()) {
      overlay.classList.add('cp-ov--show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('cp--open');
    overlay.classList.remove('cp-ov--show');
    document.body.classList.remove('cp-is-open');
    document.body.style.overflow = '';
    if (!isMobile()) {
      tab.classList.remove('cp-tab--hidden');
    }
  }

  // 이미 열려있을 때: 힌트 토스트 + 패널 첫 입력 포커스
  function showAlreadyOpenHint() {
    clearTimeout(hintTimer);
    hintToast.classList.add('is-visible');
    hintTimer = setTimeout(function () {
      hintToast.classList.remove('is-visible');
    }, 3000);
    var firstInput = panel.querySelector('.cp__inp');
    if (firstInput) {
      firstInput.focus({ preventScroll: true });
      var bd = panel.querySelector('.cp__bd');
      if (bd) { bd.scrollTop = 0; }
    }
  }

  // ── PC: 기본 열림 ─────────────────────────────────────────────────────────
  if (!isMobile()) {
    openPanel();
  }

  // ── 탭 버튼 (PC 닫힘 → 재열기) ───────────────────────────────────────────
  tab.addEventListener('click', function () { openPanel(); });

  // ── 닫기 버튼 ─────────────────────────────────────────────────────────────
  closeBtn.addEventListener('click', function () { closePanel(); });

  // ── 오버레이 탭 (모바일) ──────────────────────────────────────────────────
  overlay.addEventListener('click', function () { closePanel(); });

  // ── 전체 상담/문의 버튼 인터셉트 ─────────────────────────────────────────
  // capture 단계에서 클릭 가로채기: 패널 내부 클릭은 통과시킴
  document.addEventListener('click', function (e) {
    // 패널 내부 클릭은 건드리지 않음
    if (panel.contains(e.target)) { return; }
    if (tab === e.target || tab.contains(e.target)) { return; }

    var el = e.target;
    while (el && el !== document.body) {
      if (isConsultTarget(el)) {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
          showAlreadyOpenHint();
        } else {
          openPanel();
        }
        return;
      }
      el = el.parentElement;
    }
  }, true);

  // ── 전화번호 자동 하이픈 ───────────────────────────────────────────────────
  var phoneInput = document.getElementById('cp-phone');
  phoneInput.addEventListener('input', function () {
    var d = this.value.replace(/[^0-9]/g, '');
    if (d.length >= 10) {
      this.value = d.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
    }
  });

  // ── 폼 제출 ───────────────────────────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errEl.style.display = 'none';

    var name    = document.getElementById('cp-name').value.trim();
    var email   = document.getElementById('cp-email').value.trim();
    var phone   = document.getElementById('cp-phone').value.trim();
    var message = document.getElementById('cp-msg').value.trim();
    var agreed  = document.getElementById('cp-agree').checked;

    if (!name)   { errEl.textContent = '이름을 입력해주세요.'; errEl.style.display = 'block'; return; }
    if (!phone)  { errEl.textContent = '휴대폰 번호를 입력해주세요.'; errEl.style.display = 'block'; return; }
    if (!agreed) { errEl.textContent = '개인정보 수집 동의가 필요합니다.'; errEl.style.display = 'block'; return; }

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';

    var payload = {
      text: '[BigLinker 상담 신청]',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*[BigLinker 상담 신청]*' +
                  '\n*페이지:* ' + PAGE_TITLE +
                  '\n*이름:* ' + name +
                  '\n*이메일:* ' + (email || '(미입력)') +
                  '\n*휴대폰:* ' + phone +
                  '\n*문의사항:* ' + (message || '(없음)')
          }
        }
      ]
    };

    fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function () {
      /* fire-and-forget */
    }).finally(function () {
      form.style.display = 'none';
      doneEl.style.display = 'flex';
    });
  });

  // ── 화면 회전/리사이즈 대응 ────────────────────────────────────────────────
  window.addEventListener('resize', function () {
    if (!isMobile()) {
      overlay.classList.remove('cp-ov--show');
      document.body.style.overflow = '';
    }
  });

})();
