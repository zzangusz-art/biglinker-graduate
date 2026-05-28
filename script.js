/* ======================================================
   BigLinker Graduate — Shared JS
   Modules: SocialProofToasts · ScrollReveal · FloatingCTA · UrgencyCounter
====================================================== */

/* ── 1. Social Proof Toast System ─────────────────── */
class SocialProofToasts {
  constructor() {
    this.visitorEl  = document.getElementById('sp-visitor');
    this.successEl  = document.getElementById('sp-success');
    this.countEl    = document.getElementById('sp-visitor-count');
    this.VISITOR_BASE = 18;

    this.SUCCESS_POOL = [
      { name: '김○○ 학생', action: '페이퍼 코칭 신청', time: '방금 전' },
      { name: '이○○ 학생', action: '대학원 면접 코칭 신청', time: '6분 전' },
      { name: '박○○ 학생', action: '논문 코칭 신청', time: '13분 전' },
      { name: '최○○ 학생', action: '포트폴리오 코칭 신청', time: '22분 전' },
      { name: '정○○ 학생', action: '학업계획서 코칭 신청', time: '31분 전' },
      { name: '강○○ 학생', action: '연구계획서 코칭 신청', time: '41분 전' },
      { name: '윤○○ 학생', action: '대학원 입시 상담 신청', time: '54분 전' },
      { name: '조○○ 학생', action: '대면 상담 신청', time: '1시간 전' },
    ];

    this._shuffle(this.SUCCESS_POOL);
    this.poolIndex = 0;
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  init() {
    if (!this.visitorEl || !this.successEl) return;
    setTimeout(() => this._showVisitor(), 1500);
    setTimeout(() => this._cycleSuccess(), 6000);
  }

  _showVisitor() {
    const count = this.VISITOR_BASE + Math.floor(Math.random() * 7) - 3;
    this.countEl.textContent = count;
    this.visitorEl.classList.remove('is-hidden');
    this.visitorEl.classList.add('is-visible');

    setInterval(() => {
      const cur   = parseInt(this.countEl.textContent, 10);
      const delta = Math.random() > 0.5 ? 1 : -1;
      this.countEl.textContent = Math.max(10, Math.min(30, cur + delta));
    }, 28000 + Math.random() * 12000);
  }

  _cycleSuccess() {
    const data = this.SUCCESS_POOL[this.poolIndex % this.SUCCESS_POOL.length];
    this.poolIndex++;

    this.successEl.querySelector('.sp-toast__name').textContent   = data.name;
    this.successEl.querySelector('.sp-toast__action').textContent = data.action;
    this.successEl.querySelector('.sp-toast__time').textContent   = data.time;
    this.successEl.querySelector('.sp-toast__avatar').textContent = data.name[0];

    this.successEl.classList.remove('is-hidden');
    this.successEl.classList.add('is-visible');

    setTimeout(() => {
      this.successEl.classList.remove('is-visible');
      this.successEl.classList.add('is-hidden');
    }, 6000);

    const nextDelay = 18000 + Math.random() * 16000;
    setTimeout(() => this._cycleSuccess(), nextDelay + 6500);
  }
}


/* ── 2. Scroll Reveal ──────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  items.forEach((el) => observer.observe(el));
}


/* ── 3. Floating CTA ───────────────────────────────── */
function initFloatingCTA() {
  const heroActions = document.querySelector('.hero-actions, .hero .btn-primary');
  const floatingCta = document.querySelector('.mobile-floating-cta');
  if (!heroActions || !floatingCta) return;

  const observer = new IntersectionObserver(([entry]) => {
    floatingCta.classList.toggle('is-floating-active', !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(heroActions);
}


/* ── 4. Urgency Counter ────────────────────────────── */
function initUrgencyCounter() {
  const el = document.getElementById('urgency-spots');
  if (!el) return;

  const MAP = {
    'paper-coaching':     { spots: 4, month: '5월' },
    'interview-coaching': { spots: 3, month: '5월' },
    'portfolio-coaching': { spots: 5, month: '5월' },
    'thesis-coaching':    { spots: 2, month: '5월' },
  };

  const path = window.location.pathname;
  const key  = Object.keys(MAP).find((k) => path.includes(k));
  if (!key) return;

  const { spots, month } = MAP[key];
  el.textContent = `이번 달 잔여 ${spots}자리`;

  const bandText = el.closest('.urgency-band__text');
  if (bandText) {
    const suffix = bandText.querySelector('.urgency-month');
    if (suffix) suffix.textContent = `${month} 신청 마감 임박`;
  }
}


/* ── Init ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new SocialProofToasts().init();
  initScrollReveal();
  initFloatingCTA();
  initUrgencyCounter();
});
