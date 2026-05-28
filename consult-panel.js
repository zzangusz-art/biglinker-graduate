(function () {
  'use strict';

  // ── CUSTOMIZE ────────────────────────────────────────────────────────────
  var NOTIFY_URL = '/api/notify'; // Vercel 서버리스 함수 (env: SLACK_WEBHOOK)
  var PAGE_TITLE  = document.title || location.pathname;
  var PAGE_DOMAIN = location.hostname;
  // ─────────────────────────────────────────────────────────────────────────

  var PANEL_HTML = '\
<style>\
/* ── 전체 레이아웃 ── */\
.cp__bd{padding:16px 16px 20px;}\
.cp__form{display:flex;flex-direction:column;gap:13px;}\
.cp__field{display:flex;flex-direction:column;gap:5px;}\
.cp__lbl{font-size:11px;font-weight:700;color:#9aa3b5;letter-spacing:.01em;}\
.cp__lbl em{color:#4a68ff;font-style:normal;}\
/* ── 칩 기본 ── */\
.cp__chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:2px;}\
.cp__chip{display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:999px;\
border:1.5px solid #dde2ff;background:#f8f9fc;color:#6e7687;\
font-size:12px;font-weight:700;cursor:pointer;line-height:1.2;text-align:center;\
transition:background .15s,border-color .15s,color .15s;font-family:inherit;}\
.cp__chip.is-on{background:#eef0ff;border-color:#4a68ff;color:#4a68ff;}\
.cp__chip:hover:not(.is-on){border-color:#b8c0ff;color:#4a68ff;}\
/* ── 날짜·시간 피커 ── */\
.cp__dt-row{display:none;}\
.cp__dt-seg{display:flex;margin-top:2px;}\
.cp__dt-sub{font-size:10.5px;font-weight:700;color:#b0b8cc;margin:9px 0 4px;letter-spacing:.03em;text-transform:uppercase;}\
.cp__dt-picker{margin-top:6px;padding:12px 12px 10px;background:#f8f9fc;border-radius:10px;border:1.5px solid #dde2ff;}\
.cp__dt-confirm{margin-top:12px;width:100%;padding:8px;background:#4a68ff;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;letter-spacing:.02em;transition:background .15s;}\
.cp__dt-confirm:hover{background:#3a58ef;}\
.cp__dt-summary{display:none;font-size:11.5px;color:#4a68ff;font-weight:700;margin-top:6px;padding:7px 12px;background:#eef0ff;border:1.5px solid #c7d0ff;border-radius:8px;word-break:keep-all;line-height:1.4;cursor:pointer;align-items:center;gap:6px;}\
.cp__dt-summary:hover{background:#e4e8ff;}\
.cp__dt-summary::after{content:"✎";margin-left:auto;opacity:.5;font-size:11px;padding-left:6px;}\
/* ── 요일 칩 ── */\
#cp-days{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;gap:4px;}\
#cp-days::-webkit-scrollbar{display:none;}\
#cp-days .cp__chip{flex-shrink:0;padding:5px 9px;font-size:11.5px;}\
/* ── 시간 칩 ── */\
#cp-hours .cp__chip{padding:5px 0;font-size:11px;justify-content:center;border-radius:7px;}\
/* ── 분야 칩: 3+2 균등 레이아웃 ── */\
#cp-chips{flex-wrap:wrap;gap:5px;margin-top:2px;}\
#cp-chips .cp__chip{flex:1 1 28%;justify-content:center;padding:7px 4px;font-size:11.5px;word-break:keep-all;border-radius:10px;}\
/* ── 세그먼트 ── */\
.cp__seg{display:flex;width:100%;border-radius:9px;border:1.5px solid #dde2ff;overflow:hidden;background:#f8f9fc;}\
.cp__seg-btn{flex:1;padding:8px 0;border:none;background:transparent;font-size:13px;font-weight:700;color:#8892a8;cursor:pointer;font-family:inherit;transition:background .18s,color .18s;}\
.cp__seg-btn+.cp__seg-btn{border-left:1.5px solid #dde2ff;}\
.cp__seg-btn.is-on{background:#4a68ff;color:#fff;}\
#cp-dt-picker.is-float{display:block;position:fixed;width:268px;background:#fff;border-radius:16px;border:1.5px solid #e5e8ef;box-shadow:0 12px 52px rgba(0,0,0,0.16),0 2px 12px rgba(0,0,0,0.07);padding:18px;z-index:10001;animation:cp-float-in .22s cubic-bezier(0.16,1,0.3,1) both;}\
@keyframes cp-float-in{from{opacity:0;transform:translateX(14px);}to{opacity:1;transform:translateX(0);}}\
#cp-dt-picker.is-float::after{content:"";position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:0;height:0;border:8px solid transparent;border-left-color:#e5e8ef;border-right:none;}\
#cp-dt-picker.is-float::before{content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:0;height:0;border:7px solid transparent;border-left-color:#fff;border-right:none;z-index:1;}\
</style>\
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
      <a class="cp__qbtn cp__qbtn--kakao" id="cp-kakao-quick" href="https://pf.kakao.com/_wzmxdn/chat" rel="noopener noreferrer">\
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.72 2 11.25c0 2.84 1.6 5.34 4.05 6.88l-.73 2.72a.5.5 0 0 0 .72.57l3.22-1.86c.55.08 1.12.13 1.74.13 5.52 0 10-3.72 10-8.25S17.52 3 12 3z"/></svg>\
        카카오톡 상담\
      </a>\
    </div>\
    <button class="cp__qbtn cp__qbtn--channel" id="cp-channeltalk" type="button">\
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>\
      채널톡 1:1 상담\
    </button>\
    <div class="cp__sep">또는 신청서 작성</div>\
    <form class="cp__form" id="cp-form" novalidate>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-name">이름 <em>*</em></label>\
        <input class="cp__inp" id="cp-name" name="name" type="text" placeholder="홍길동" autocomplete="name" />\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-phone">연락처 <em>*</em></label>\
        <input class="cp__inp" id="cp-phone" name="phone" type="tel" placeholder="010-0000-0000" autocomplete="tel" />\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl">상담 희망일 및 연락 가능 시간</label>\
        <div class="cp__seg cp__dt-seg" id="cp-dt-seg">\
          <button type="button" class="cp__seg-btn is-on" data-dt="any">상관없음</button>\
          <button type="button" class="cp__seg-btn" data-dt="pick">직접 선택</button>\
        </div>\
        <div class="cp__dt-summary" id="cp-dt-summary"></div>\
        <div class="cp__dt-row">\
          <span class="cp__dt-val" id="cp-dt-val">상관없음</span>\
          <button type="button" class="cp__dt-btn" id="cp-dt-pick">직접 선택할게요</button>\
        </div>\
        <div class="cp__dt-picker" id="cp-dt-picker" style="display:none">\
          <div class="cp__dt-sub">요일</div>\
          <div class="cp__chips" id="cp-days">\
            <button type="button" class="cp__chip" data-value="월">월</button>\
            <button type="button" class="cp__chip" data-value="화">화</button>\
            <button type="button" class="cp__chip" data-value="수">수</button>\
            <button type="button" class="cp__chip" data-value="목">목</button>\
            <button type="button" class="cp__chip" data-value="금">금</button>\
            <button type="button" class="cp__chip" data-value="토">토</button>\
            <button type="button" class="cp__chip" data-value="일">일</button>\
          </div>\
          <div class="cp__dt-sub">시간대 <span style="font-size:10px;font-weight:400;color:#c0c8d8">(평일 9–22시)</span></div>\
          <div class="cp__seg" id="cp-ampm">\
            <button type="button" class="cp__seg-btn" data-ampm="am">오전</button>\
            <button type="button" class="cp__seg-btn" data-ampm="pm">오후</button>\
          </div>\
          <div class="cp__chips" id="cp-hours" style="display:none;margin-top:6px;flex-wrap:wrap;gap:4px;"></div>\
          <button type="button" class="cp__dt-confirm" id="cp-dt-confirm">확인</button>\
        </div>\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl">상담 희망 분야</label>\
        <div class="cp__chips" id="cp-chips">\
          <button type="button" class="cp__chip" data-value="대학">대학</button>\
          <button type="button" class="cp__chip" data-value="편입">편입</button>\
          <button type="button" class="cp__chip" data-value="대학원&amp;논문">대학원&amp;논문</button>\
          <button type="button" class="cp__chip" data-value="취업">취업</button>\
          <button type="button" class="cp__chip" data-value="기업교육">기업교육</button>\
        </div>\
      </div>\
      <div class="cp__field">\
        <label class="cp__lbl" for="cp-msg">문의사항</label>\
        <textarea class="cp__ta" id="cp-msg" name="message" placeholder="궁금하신 점을 자유롭게 적어주세요." rows="3"></textarea>\
      </div>\
      <label class="cp__consent">\
        <input id="cp-agree" name="agree" type="checkbox" checked />\
        <span><strong>개인정보 수집 및 이용 동의 (필수)</strong>수집 항목: 이름, 연락처 · 목적: 상담 안내</span>\
      </label>\
      <div id="cp-err" style="display:none;font-size:11px;color:#e05252;padding:2px 0 0;"></div>\
      <button class="cp__sub" id="cp-submit" type="submit">상담 신청하기</button>\
      <p class="cp__note">평일 09:00 – 22:00 · 주말 10:00 – 18:00</p>\
    </form>\
    <div class="cp__done" id="cp-done">\
      <div class="cp__done-ico">&#10003;</div>\
      <strong>신청이 완료됐어요!</strong>\
      <p>빠른 시간 내에 연락드리겠습니다.</p>\
      <a class="cp__qbtn cp__qbtn--kakao" id="cp-kakao-done" href="https://pf.kakao.com/_wzmxdn/chat" rel="noopener noreferrer" style="margin-top:4px;">\
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
  var panel       = document.getElementById('cp');
  var tab         = document.getElementById('cp-tab');
  var closeBtn    = document.getElementById('cp-close');
  var overlay     = document.getElementById('cp-overlay');
  var form        = document.getElementById('cp-form');
  var doneEl      = document.getElementById('cp-done');
  var errEl       = document.getElementById('cp-err');
  var submitBtn   = document.getElementById('cp-submit');
  var hintToast   = document.getElementById('cp-hint-toast');
  var channelBtn  = document.getElementById('cp-channeltalk');
  var chipsEl     = document.getElementById('cp-chips');

  var isOpen    = false;
  var hintTimer = null;
  var daysEl    = document.getElementById('cp-days');
  var ampmEl    = document.getElementById('cp-ampm');
  var hoursEl   = document.getElementById('cp-hours');
  var dtPickBtn = document.getElementById('cp-dt-pick');
  var dtPicker  = document.getElementById('cp-dt-picker');
  var dtValEl   = document.getElementById('cp-dt-val');
  var dtConfBtn          = document.getElementById('cp-dt-confirm');
  var dtSegEl            = document.getElementById('cp-dt-seg');
  var dtSummaryEl        = document.getElementById('cp-dt-summary');
  var dtPickerOrigParent = dtPicker.parentElement;

  var AM_HOURS = ['9시','10시','11시'];
  var PM_HOURS = ['12시','13시','14시','15시','16시','17시','18시','19시','20시','21시','22시'];
  var selectedAmPm = null;

  // ── Chips 선택 토글 ───────────────────────────────────────────────────────
  function toggleChip(container) {
    container.addEventListener('click', function (e) {
      var chip = e.target.closest('.cp__chip');
      if (!chip) return;
      chip.classList.toggle('is-on');
    });
  }
  toggleChip(chipsEl);
  toggleChip(daysEl);

  // AM/PM 선택 → 1시간 단위 슬롯 표시
  toggleChip(hoursEl);

  function renderHours(ampm) {
    var hours = ampm === 'am' ? AM_HOURS : PM_HOURS;
    var cols  = ampm === 'am' ? AM_HOURS.length : 6;
    hoursEl.innerHTML = hours.map(function (h) {
      return '<button type="button" class="cp__chip" data-value="' + h + '">' + h + '</button>';
    }).join('');
    hoursEl.style.display = 'grid';
    hoursEl.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
  }

  ampmEl.addEventListener('click', function (e) {
    var chip = e.target.closest('.cp__seg-btn');
    if (!chip || !chip.dataset.ampm) return;
    var ampm = chip.dataset.ampm;
    if (selectedAmPm === ampm) return;
    ampmEl.querySelectorAll('.cp__seg-btn').forEach(function (c) { c.classList.remove('is-on'); });
    chip.classList.add('is-on');
    selectedAmPm = ampm;
    renderHours(ampm);
  });


  // ── 날짜/시간 픽커 ────────────────────────────────────────────────────────
  dtConfBtn.addEventListener('click', function () {
    var summary = getDatetime();
    if (summary !== '(미선택)') {
      dtSummaryEl.textContent = summary;
      dtSummaryEl.style.display = 'flex';
    }
    if (isMobile()) {
      dtPicker.style.display = 'none';
    } else {
      hideFloatPicker();
    }
  });

  // ── 날짜 세그먼트 / 플로팅 피커 ─────────────────────────────────────────
  function resetDatetime() {
    daysEl.querySelectorAll('.cp__chip.is-on').forEach(function (c) { c.classList.remove('is-on'); });
    ampmEl.querySelectorAll('.cp__seg-btn').forEach(function (c) { c.classList.remove('is-on'); });
    selectedAmPm = null;
    hoursEl.innerHTML = '';
    hoursEl.style.display = 'none';
    dtSummaryEl.style.display = 'none';
    dtSummaryEl.textContent = '';
  }

  function showFloatPicker() {
    if (dtPicker.classList.contains('is-float')) return;
    document.body.appendChild(dtPicker);
    var rect = dtSegEl.getBoundingClientRect();
    var pickerW = 268;
    var gap = 12;
    var left = rect.left - pickerW - gap;
    var top = rect.top;
    top = Math.max(8, Math.min(top, window.innerHeight - 420));
    if (left < 8) left = rect.right + gap;
    dtPicker.style.left = left + 'px';
    dtPicker.style.top = top + 'px';
    dtPicker.style.display = '';
    dtPicker.classList.add('is-float');
  }

  function hideFloatPicker() {
    dtPicker.classList.remove('is-float');
    dtPickerOrigParent.appendChild(dtPicker);
    dtPicker.style.display = 'none';
  }

  dtSegEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.cp__seg-btn');
    if (!btn || !btn.dataset.dt) return;
    dtSegEl.querySelectorAll('.cp__seg-btn').forEach(function (b) { b.classList.remove('is-on'); });
    btn.classList.add('is-on');
    if (btn.dataset.dt === 'pick') {
      if (isMobile()) {
        dtPicker.style.display = dtPicker.style.display === 'none' ? 'block' : 'none';
      } else {
        showFloatPicker();
      }
    } else {
      if (isMobile()) {
        dtPicker.style.display = 'none';
      } else {
        if (dtPicker.classList.contains('is-float')) hideFloatPicker();
      }
      resetDatetime();
    }
  });

  dtSummaryEl.addEventListener('click', function () {
    if (isMobile()) {
      dtPicker.style.display = 'block';
    } else {
      showFloatPicker();
    }
  });

  // PC: 플로팅 외부 클릭 시 닫기
  document.addEventListener('click', function (e) {
    if (isMobile()) return;
    if (!dtPicker.classList.contains('is-float')) return;
    if (dtPicker.contains(e.target) || dtSegEl.contains(e.target)) return;
    hideFloatPicker();
  }, true);

  function getSelectedFields() {
    var selected = [];
    chipsEl.querySelectorAll('.cp__chip.is-on').forEach(function (c) {
      selected.push(c.dataset.value);
    });
    return selected.join(', ') || '(미선택)';
  }

  function getDatetime() {
    var days = [], times = [];
    daysEl.querySelectorAll('.cp__chip.is-on').forEach(function (c) { days.push(c.dataset.value); });
    hoursEl.querySelectorAll('.cp__chip.is-on').forEach(function (c) { times.push(c.dataset.value); });
    var parts = [];
    if (days.length) parts.push(days.join('·'));
    if (selectedAmPm) {
      var ampmLabel = selectedAmPm === 'am' ? '오전' : '오후';
      if (times.length) parts.push(ampmLabel + ' ' + times.join(', '));
      else parts.push(ampmLabel);
    }
    return parts.join(' / ') || '(미선택)';
  }

  // ── isConsultTarget ───────────────────────────────────────────────────────
  function isConsultTarget(el) {
    if (!el || !el.tagName) { return false; }

    var cls  = el.classList;
    var href = (el.getAttribute && el.getAttribute('href')) || '';
    var text = (el.textContent || '').trim();

    if (cls) {
      if (cls.contains('cta-btn'))             { return true; }
      if (cls.contains('urgency-band__cta'))   { return true; }
      if (cls.contains('mobile-floating-cta')) { return true; }
    }

    if (el.tagName !== 'A') { return false; }

    var consultAnchors = ['#cta', '#consult', '#cta-title', '#contact'];
    for (var i = 0; i < consultAnchors.length; i++) {
      if (href === consultAnchors[i]) { return true; }
    }

    if (href.indexOf('mailto:') === 0) { return true; }

    if (href === '#' && /상담|문의|신청/.test(text)) { return true; }

    return false;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function isMobile() { return window.innerWidth <= 760; }

  function preventScroll(e) {
    if (panel.contains(e.target)) return;
    e.preventDefault();
  }

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventScroll, { passive: false });
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', preventScroll);
  }

  function openPanel() {
    isOpen = true;
    panel.classList.add('cp--open');
    tab.classList.add('cp-tab--hidden');
    document.body.classList.add('cp-is-open');
    if (isMobile()) {
      overlay.classList.add('cp-ov--show');
      lockScroll();
    }
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('cp--open');
    overlay.classList.remove('cp-ov--show');
    document.body.classList.remove('cp-is-open');
    unlockScroll();
    if (dtPicker.classList.contains('is-float')) hideFloatPicker();
    if (!isMobile()) {
      tab.classList.remove('cp-tab--hidden');
    }
  }

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

  // ── 탭 버튼 ───────────────────────────────────────────────────────────────
  tab.addEventListener('click', function () { openPanel(); });

  // ── 닫기 버튼 ─────────────────────────────────────────────────────────────
  closeBtn.addEventListener('click', function () { closePanel(); });
  closeBtn.addEventListener('touchend', function (e) { e.preventDefault(); closePanel(); });

  // ── 오버레이 (모바일) ─────────────────────────────────────────────────────
  overlay.addEventListener('click', function () { closePanel(); });
  overlay.addEventListener('touchend', function (e) { e.preventDefault(); closePanel(); });

  // ── 상담 버튼 인터셉트 ────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
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

  // ── 전화번호 자동 하이픈 ──────────────────────────────────────────────────
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

    var name     = document.getElementById('cp-name').value.trim();
    var phone    = document.getElementById('cp-phone').value.trim();
    var dtRaw = getDatetime();
    var datetime = dtRaw === '(미선택)' ? '상관없음' : dtRaw;
    var fields   = getSelectedFields();
    var message  = document.getElementById('cp-msg').value.trim();
    var agreed   = document.getElementById('cp-agree').checked;

    if (!name)   { errEl.textContent = '이름을 입력해주세요.'; errEl.style.display = 'block'; return; }
    if (!phone)  { errEl.textContent = '연락처를 입력해주세요.'; errEl.style.display = 'block'; return; }
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
                  '\n*도메인:* ' + PAGE_DOMAIN +
                  '\n*페이지:* ' + PAGE_TITLE +
                  '\n*이름:* ' + name +
                  '\n*연락처:* ' + phone +
                  '\n*상담 희망일시:* ' + datetime +
                  '\n*희망 분야:* ' + fields +
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

  // ── 카카오톡 팝업 ─────────────────────────────────────────────────────────
  function openKakaoPopup(e) {
    e.preventDefault();
    window.open('https://pf.kakao.com/_wzmxdn/chat', 'kakao',
      'width=480,height=680,scrollbars=yes,resizable=yes');
  }
  document.getElementById('cp-kakao-quick').addEventListener('click', openKakaoPopup);
  document.getElementById('cp-kakao-done').addEventListener('click', openKakaoPopup);

  // ── 채널톡 버튼 ───────────────────────────────────────────────────────────
  channelBtn.addEventListener('click', function () {
    if (window.ChannelIO) { ChannelIO('showMessenger'); }
  });

  // ── 화면 회전/리사이즈 대응 ───────────────────────────────────────────────
  window.addEventListener('resize', function () {
    if (!isMobile()) {
      overlay.classList.remove('cp-ov--show');
      document.body.style.overflow = '';
    }
  });

})();
