# BigLinker Design System

`self-introduction.html` 기준으로 추출한 디자인 시스템 문서.
모든 서비스 페이지(대입코칭, 페이퍼코칭, 면접코칭, 논문코칭, EC코칭, 디자인코칭)는 이 규칙을 따른다.

---

## 1. Design Tokens

### 1-1. Color

```css
/* Dark (body/content background) */
--bg:           #0b0e13
--bg-soft:      #121722
--bg-dark:      #090c11

/* Content */
--text:         #f6f7fb
--muted:        rgba(255,255,255,0.66)
--muted-dark:   #5d6473
--panel-line:   rgba(255,255,255,0.08)

/* Brand */
--brand:        #4a68ff   /* primary action, active states */
--brand-2:      #7f92ff   /* lighter accent, labels, eyebrow */
--brand-soft:   #eef0ff   /* light bg badge, hover tint */

/* Light (header / panel / footer) */
--panel:        #f5f6fb
--header-bg:    #f6f7fb
--header-surface: #ffffff
--header-line:  #e5e8ef
--header-line-strong: #d7dbe5
--header-text:  #17191f
--header-muted: #6e7687

/* Semantic accents */
purple: #a78bfa
green:  #34d399
red:    #d14b4b
```

**규칙**
- dark 섹션 카드 배경: `rgba(255,255,255,0.04)`, 테두리: `rgba(255,255,255,0.08)`
- light 섹션 카드 배경: `#ffffff`, 테두리: `#e7ebf3`
- brand 컬러는 interactive 요소(버튼, 탭 active, 체크아이콘)에만 사용
- 텍스트에 컬러를 쓸 때는 `--brand-2(#7f92ff)`를 사용 (가독성 확보)

---

### 1-2. Border Radius

| Token | Value | 사용 |
|---|---|---|
| `--radius-xl` | 28px | 섹션 카드, compare-box, portfolio-tile, cta-band |
| `--radius-lg` | 22px | visual-card, testimonial-card, section-card |
| `--radius-md` | 18px | side-card, hero stat row, review-mini |
| `--radius-sm` | 12px | cta-btn, diff-card, utility-link |
| `--radius-xs` | 8px | tag, chat-tag, small button |
| pill | 999px | badge, bubble, family-wrap, hero-kicker |

---

### 1-3. Shadow

```css
--shadow:       0 24px 60px rgba(0,0,0,0.28)   /* section-level card */
--shadow-card:  0 18px 36px rgba(36,46,78,0.08) /* light bg card */
--shadow-float: 0 16px 40px rgba(0,0,0,0.22)    /* floating element */
```

---

### 1-4. Layout

```css
--max: 1320px       /* 최대 컨테이너 너비 */
padding: 0 28px     /* wrap (메인 콘텐츠) */
padding: 0 20px     /* inner (헤더/카테고리 바) */
```

섹션 패딩 규칙:
- Large section: `padding: 120px 0`
- Medium section: `padding: 100px 0`
- Small section: `padding: 80px 0`

---

## 2. Typography

**폰트**: Pretendard → Noto Sans KR → sans-serif

| 역할 | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero H1 | `clamp(28px, 4.1vw, 52px)` | 500 | -0.05em | 1.2 |
| Section H2 | `clamp(24px, 3vw, 40px)` | 700 | -0.045em | 1.24 |
| Card H3 | 20–22px | 700 | — | 1.3–1.4 |
| Body | 15px | 400 | — | 1.8 |
| Caption / Sub | 13px | 500–600 | — | 1.65–1.75 |
| Eyebrow | 11px | 800 | 0.1em | — |

**텍스트 강조 패턴** — `.em` 클래스로 SVG 밑줄 장식:
```html
<span class="em">강조 텍스트
  <svg><!-- 핸드드로운 곡선 --></svg>
</span>
```
- dark 배경: stroke `#4a68ff` / `#7f92ff`
- light 배경: stroke `#4a68ff`

---

## 3. Page Structure

모든 페이지는 아래 구조를 공유한다:

```
<body>
  <!-- 공통 Header (sticky) -->
  <div class="top-shell">
    .family-bar          ← 브랜드 패밀리 스위처
    <header class="main-header">  ← 로고 + 프로모 + CTA
  </div>
  <div class="sticky-category-shell">  ← 서비스 탭 + utility
  </div>

  <!-- 페이지별 콘텐츠 -->
  <main class="page">
    ...
  </main>

  <!-- 공통 Footer -->
  <footer class="site-footer">
    .footer-top    ← brand + nav grid
    .footer-bottom ← legal + policy links
  </footer>
</body>
```

### Header 컴포넌트

#### Family Bar (최상단)
- `pill` 형태 컨테이너, `box-shadow: 0 4px 16px rgba(32,43,73,0.08)`
- active 탭: `background: var(--brand-soft)`, `color: var(--brand)`

#### Main Header
- 3-column grid: `[promo] [logo] [actions]`
- 프로모 배너: 좌측 하단 pill 배지, `border-radius: 0 0 14px 14px`
- 로고 서브카피: `color: var(--header-muted)`, `font-size: 12px`
- CTA 버튼: `background: var(--brand)`, `border-radius: 12px`

#### Category Bar
- 3-column grid: `[balance] [tabs] [utility]`
- active tab: `color: var(--brand)` + 하단 3px bar
- utility 버튼: pill, hover 시 brand-soft tint

### Footer 컴포넌트

- 배경: `#090c11`, 상단 border: `rgba(255,255,255,0.06)`
- 구성: brand area (280px) + nav grid (3열)
- SNS 버튼: 34px 정사각, `border-radius: 8px`
- 법적 정보: `font-size: 12px`, `color: rgba(255,255,255,0.28)`

---

## 4. Components Reference

### Buttons

```
크기: btn-lg(54px) / btn-md(44px) / btn-sm(34px) / btn-xs(28px)
radius: btn-lg(13px) / btn-md(12px) / btn-sm(9px) / btn-xs(8px)
```

| Variant | 사용 배경 | Style |
|---|---|---|
| `btn-primary-dark` | dark | white bg, dark text |
| `btn-secondary-dark` | dark | transparent + white border |
| `btn-brand` | both | `--brand` bg, white text |
| `btn-brand-soft` | light | `--brand-soft` bg, brand text |
| `btn-outline-light` | light | white bg, `--header-line-strong` border |
| `btn-ghost-light` | light | transparent, hover: brand-soft |
| `.cta-btn` | header | brand bg, 38px height, radius 12px |

모든 버튼: `transition: transform 0.2s ease`, hover: `translateY(-2px)`

---

### Badges & Tags

**Badge** (pill, `border-radius: 999px`):

| Class | 사용 |
|---|---|
| `badge-brand` | 신규/추천 (dark bg) |
| `badge-green` | 합격/성공 상태 |
| `badge-red` | 일반/비교 대상 (bad) |
| `badge-blue-light` | 빅링커/추천 (light bg) |
| `badge-neutral` | 기본 상태 레이블 |

**Tag** (rect, `border-radius: 4px`):

| Class | 사용 |
|---|---|
| `tag-brand` | 카테고리명, 코칭 타입 |
| `tag-after` | 수정 후 / 합격 후 표시 |
| `tag-neutral` | 초안 / 수정 전 표시 |

---

### Section Eyebrow Patterns

1. **Hero Kicker**: gradient animation, pill 형태
   ```html
   <span class="hero-kicker">BIGLINKER PAPER COACHING</span>
   ```

2. **Section Eyebrow**: uppercase + 앞에 22px 선
   ```html
   <div class="section-eyebrow">WHY BIGLINKER</div>
   ```

---

### Cards

#### Dark Background Cards

| Component | 용도 |
|---|---|
| `.section-card` | 기능/특징 나열, 3열 그리드 |
| `.diff-card` | 차별점 3열, `.diff-icon` (단색 SVG, brand-2 색상) |
| `.timeline-item` | 프로세스 단계, conic-gradient 테두리 |
| `.review-mini` | 후기 masonry, accent 변형 있음 |
| `.testimonial-card` | 합격 사례, photo + copy 2열 |
| `.visual-card` | showcase 이미지 카드 |
| `.chat` | 코칭 피드백 before/after |

#### Light Background Cards

| Component | 용도 |
|---|---|
| `.side-card` | hero window 내 정보 카드, accent border |
| `.compare-box` | before/after 비교, `.bad`/`.good` variant |
| `.overlay-card` | visual-card 위에 float |
| `.paper-content` | 서류 미리보기 창 내부 |

**Side card accent border 색상:**
- `.side-blue`: `border-left: 3px solid var(--brand)` → 자기소개서
- `.side-purple`: `border-left: 3px solid #a78bfa` → 학업계획서
- `.side-green`: `border-left: 3px solid #34d399` → 코칭 프로세스

---

### Section Layout Patterns

#### Showcase (2열 좌우 분할)
```css
.showcase {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 56px;
  align-items: center;
}
.showcase.reverse { grid-template-columns: 1.05fr 0.95fr; }
```
- 왼쪽: `.copy-block` (eyebrow + h2 + p + checklist or diff-grid)
- 오른쪽: `.visual-card` (image or light card with overlay)

#### Dark Section (`section-dark`)
- background: dark bg (`--bg` 계열)
- 색상: `var(--text)`, `var(--muted)`

#### Light Section (`section-light`)
- background: `var(--panel)` `#f5f6fb`
- 색상: `#11161e`, `var(--muted-dark)`

#### White Section (FAQ, footer 상단)
- background: `#ffffff`
- 색상: `#17191f`

---

### Process Section

```html
<section class="section-dark" id="process">
  <div class="wrap">
    <div class="process-head">
      <div class="section-eyebrow" style="justify-content:center;">COACHING PROCESS</div>
      <h2><span class="em">기본 3회 코칭<svg>…</svg></span>으로 …</h2>
      <p>…</p>
    </div>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-step">
          <span class="step-num">01</span>
          <svg class="step-star">…</svg>
        </div>
        <div class="timeline-body">
          <div class="timeline-meta">1회차 · 방향 설계</div>
          <h3>…</h3>
          <p>…</p>
        </div>
      </div>
      <!-- 2, 3번 반복 -->
    </div>
  </div>
</section>
```

**conic-gradient 테두리 애니메이션 규칙:**
- `.timeline-item::before`에 `conic-gradient` + 회전 애니메이션 적용
- 1번 아이템: `border-spin-1` (0~4.5s 첫 구간 점등)
- 2번 아이템: `border-spin-2` (두 번째 구간)
- 3번 아이템: `border-spin-3` (세 번째 구간)
- 4개 이상으로 확장 시 새 `border-spin-N` keyframe 추가

**`.process-head`:** max-width 720px, margin 0 auto, text-align center  
**`.timeline-meta`:** `font-size: 11px`, `font-weight: 700`, `letter-spacing: 0.06em`, `color: var(--brand-2)`  
**`.step-star`:** 우상단 20×20 별 장식 SVG (position absolute, top -10px, right -10px)

---

### Text Emphasis (.em)

헤딩 내 핵심 단어에 SVG 손그림 밑줄을 얹는 강조 패턴.

```html
<span class="em">강조 텍스트
  <svg viewBox="0 0 {width} 14" fill="none" preserveAspectRatio="none">
    <!-- 굵은선 -->
    <path d="…" stroke="#4a68ff" stroke-width="2.8" stroke-linecap="round" fill="none" opacity="0.85"/>
    <!-- 얇은선 (이중선일 때만) -->
    <path d="…" stroke="#4a68ff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.45"/>
  </svg>
</span>
```

| 변형 | 선 수 | stroke-width | 사용 배경 | 색상 |
|---|---|---|---|---|
| 단일선 | 1개 | 2.4 | dark | `#7f92ff` |
| 이중선 | 2개 | 2.8 + 1.4 | dark | `#4a68ff` |
| 이중선 강조 | 2개 | 3.0 + 1.4 | light (텍스트 컬러 변경 포함) | `#4a68ff` |

**viewBox width 가이드:**
- 짧은 단어 (3~5자): 100~130
- 중간 구절 (7~10자): 160~200
- 긴 구절 (12자+): 240~300
- height는 항상 `14` 고정

**적용 규칙:**
- h1, h2에만 사용. 본문(p)에는 사용하지 않는다.
- 한 헤딩에 강조 구간은 1개만.
- light 배경에서 강조 단어 자체에 `color: #4a68ff` 병행 적용 가능.

---

### Chat / Before-After Pattern

코칭 효과 시각화에 사용:
```html
<div class="chat">
  <span class="chat-tag">초안</span>
  <strong>제목</strong>
  <p>내용</p>
</div>
<div class="chat">
  <span class="chat-tag feedback">코칭 피드백</span>
  ...
</div>
<div class="chat">
  <span class="chat-tag after">수정 후</span>
  ...
</div>
```

---

### Hero Stage Pattern

```html
<div class="hero-stage">        <!-- image background -->
  <div class="paper-window">   <!-- 문서 미리보기 창 -->
    <div class="paper-top">...</div>
    <div class="paper-body">
      <div class="paper-content">...</div>
      <div class="paper-side">...</div>
    </div>
  </div>
  <div class="bubble one">...</div>
  <div class="bubble two">...</div>
  <div class="bubble three">...</div>
</div>
```

각 서비스 페이지에서 paper-window 내부를 해당 서비스 내용으로 교체.

---

## 5. Animation Tokens

| 이름 | 효과 | 사용 |
|---|---|---|
| `gradientShift` | background-position 200% 이동 | hero-kicker |
| `stat-glow` | 텍스트 glow + color shift | hero-stat-num |
| `conic-rotate` | conic-gradient 회전 테두리 | timeline-item |
| `border-spin-1/2/3` | opacity staggered | timeline-item (순서별) |
| hover translateY(-2px) | lift 효과 | 모든 버튼, portfolio-tile |
| hover translateX shine | shine sweep | portfolio-tile |

---

## 6. Responsive Breakpoints

| Breakpoint | 변경 사항 |
|---|---|
| `≤ 1100px` | showcase, paper-body, testimonial-card → 1열; compare-wrap → 1열 |
| `≤ 860px` | hero-stat-row flex-wrap (2×2) |
| `≤ 760px` | header-promo, header-actions 숨김; category-tabs 왼쪽 정렬; wrap padding 16px |
| `≤ 600px` | hero-stage 높이 축소; paper-window 상단 이동 |

---

## 7. Page-by-Page Component Checklist

새 서비스 페이지 제작 시 아래 체크리스트를 따른다:

### 공통 (모든 페이지)
- [ ] Header (`top-shell` + `sticky-category-shell`) import
- [ ] Footer (`site-footer`) import
- [ ] `category-tab.is-active` 해당 탭으로 설정
- [ ] `family-link.is-active` 해당 브랜드로 설정
- [ ] `<title>` 및 hero kicker 텍스트 페이지별 변경

### 콘텐츠 섹션 순서 (권장)
1. **Hero** — eyebrow + h1 + stats-row + actions + hero-stage
2. **Why / Overview** — showcase (copy + visual-card)
3. **Process** — timeline 3단계
4. **Differentiator** — showcase.reverse (visual + copy + diff-grid)
5. **Compare** — section-light + compare-box ×2
6. **Portfolio / Cases** — portfolio-band + portfolio-grid
7. **Reviews** — review masonry
8. **Testimonial** — testimonial-card
9. **FAQ** — faq-band + details
10. **CTA Band** — cta-band + trust signals

### 면접 코칭 페이지 섹션 순서
1. **Hero** — light bg, diff-cards 3열
2. **면접이란** — section-light + showcase (설명 + Competency Wheel SVG)
3. **평가 기준** — section-panel + Radial Eval Grid
4. **답변 전략** — section-light + Answer Category Block
5. **핵심 원칙** — section-panel + Principles Grid + checklist-2col + side-card
6. **코칭 프로세스** — section-light + Phase Timeline (Phase 01 + 02)
7. **후기** — dark bg + Floating Review Wall
8. **FAQ** — faq-band
9. **CTA Band** — cta-band

### 페이지별 추가 가능 컴포넌트
- 가격표: 별도 pricing-card 컴포넌트 추가 예정
- 코치 소개: coach-card 컴포넌트 추가 예정
- 신청 폼: form 컴포넌트 추가 예정

---

## 9. 신규 컴포넌트 (면접 코칭 페이지 추가)

### 9-1. Competency Wheel (역량 원형 다이어그램)

SVG 기반 가로 배열 원형 노드 다이어그램. dark bg 패널 내부 전용.

**HTML 패턴:**
```html
<div style="background:var(--bg-soft); border-radius:var(--radius-lg); padding:32px 24px; border:1px solid rgba(255,255,255,0.06);">
  <svg viewBox="0 0 520 120" fill="none" style="width:100%;height:auto;">
    <!-- 연결선 -->
    <line x1="60" y1="60" x2="460" y2="60"
          stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <!-- 일반 노드 -->
    <circle cx="60" cy="60" r="50" fill="rgba(74,104,255,0.08)" stroke="rgba(74,104,255,0.25)" stroke-width="1.5"/>
    <text x="60" y="56" text-anchor="middle" fill="#f6f7fb" font-size="11" font-weight="700">항목명</text>
    <text x="60" y="70" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9">Label</text>
    <!-- 강조 노드 (중앙): r+5, stroke 2px -->
    <circle cx="260" cy="60" r="55" fill="rgba(74,104,255,0.15)" stroke="#4a68ff" stroke-width="2"/>
    <text x="260" y="67" text-anchor="middle" fill="#f6f7fb" font-size="12" font-weight="800">핵심 역량</text>
    <text x="260" y="83" text-anchor="middle" fill="var(--brand-2)" font-size="9">Core Label</text>
  </svg>
</div>
```

**규칙:**
- 노드 수: 4–6개. 항상 홀수 기준으로 중앙 노드 강조
- 배경: `bg-soft` 컨테이너 필수. light bg에 단독 배치 금지
- 연결선: `stroke-dasharray="4 4"`, opacity 0.08

---

### 9-2. Radial Eval Grid (방사형 평가 그리드)

중앙 원 + 상하좌우 4개 카드. light bg 전용.

**HTML 패턴:**
```html
<div style="display:grid;
            grid-template-columns:1fr auto 1fr;
            grid-template-rows:1fr auto 1fr;
            gap:24px; align-items:center; justify-items:center;">
  <!-- 상좌 카드 -->
  <div class="eval-card">아이콘 + 제목 + 설명</div>
  <div></div><!-- 상중 비움 -->
  <!-- 상우 카드 -->
  <div class="eval-card">아이콘 + 제목 + 설명</div>

  <div></div><!-- 중좌 비움 -->
  <!-- 중앙 원 -->
  <div style="width:140px; height:140px; border-radius:999px;
              border:2px dashed var(--brand); background:var(--brand-soft);
              display:flex; flex-direction:column; align-items:center; justify-content:center;">
    <strong style="color:var(--brand);">종합 평가</strong>
    <span style="font-size:10px; color:rgba(74,104,255,0.6);">EVALUATION</span>
  </div>
  <div></div><!-- 중우 비움 -->

  <!-- 하좌 카드 -->
  <div class="eval-card">아이콘 + 제목 + 설명</div>
  <!-- 하중 주석 pill -->
  <div style="background:var(--brand-soft); padding:8px 18px; border-radius:999px;
              font-size:13px; font-weight:700; color:var(--brand); white-space:nowrap;">
    핵심 포인트 문구
  </div>
  <!-- 하우 카드 -->
  <div class="eval-card">아이콘 + 제목 + 설명</div>
</div>
```

**규칙:**
- 항상 light bg에서 사용. 카드는 `background:#fff; border:1px solid #e7ebf3`
- 중앙 원: `border:2px dashed var(--brand)`, `background:var(--brand-soft)`
- 하단 중앙 pill: grid-column:2 위치에 배치

---

### 9-3. Answer Category Block (답변 카테고리)

GOOD/BAD 비교를 category 단위로 반복 나열. light bg 전용.

**구조:**
```
answer-cat-label (CATEGORY 01: 항목명)
answer-cat-grid (2열)
  └ answer-card.good  → answer-badge.good + blockquote.good-quote + answer-tip.good
  └ answer-card.bad   → answer-badge.bad  + blockquote.bad-quote  + answer-tip.bad
answer-strategy-bar (전략 해설)
```

**규칙:**
- 카테고리는 2개 이상 반복 가능
- strategy-bar는 전체 카테고리 아래 1번만 배치
- blockquote border: good → `#34d399`, bad → `#f87171`
- badge/tip: good → `#edfaf3 / #15803d`, bad → `#fef2f2 / #b91c1c`
- strategy-bar 배경: `var(--bg-soft)` (dark 패널)

---

### 9-4. Phase Timeline (단계별 코칭 프로세스)

PHASE 01 (준비) + PHASE 02 (회차별 코칭) 구조.

**Phase 01 패턴 — light bg 3-step:**
```html
<div class="phase-label">PHASE 01: 준비 단계</div>
<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
  <div class="phase-step">
    <div class="step-badge">STEP 1</div>
    <strong>단계명</strong>
    <p>설명</p>
  </div>
  <!-- STEP 2, 3 반복 -->
</div>
```

**Phase 02 패턴 — dark 세션 카드:**
```html
<div class="phase-label">PHASE 02: 회차별 코칭</div>
<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
  <div class="session-card">1회차</div>
  <div class="session-card highlighted">2회차 (강조)</div> <!-- background:var(--brand) -->
  <div class="session-card">3회차</div>
</div>
<!-- 하단 안내 -->
<div class="phase-info-bar">
  <span class="info-label">PROGRAM INFO</span>
  <span class="info-dot"></span>
  <p>운영 안내 텍스트</p>
</div>
```

**규칙:**
- 강조 회차는 1개만. `background:var(--brand)`, 텍스트 색상 전부 흰색 계열로
- phase-info-bar는 Phase 02 바로 아래에만 배치
- 저작권 안내 등 보조 주석은 `font-size:12px; color:rgba(255,100,100,0.7)` 텍스트로

---

### 9-5. Floating Review Wall (분산 배치 후기)

4열 masonry. 열마다 margin-top 오프셋으로 자연스러운 시차 효과.

**열별 오프셋:**
| 열 | margin-top |
|---|---|
| 1열 | 0 |
| 2열 | 32px |
| 3열 | -16px (trophy 중심) |
| 4열 | 48px |

**카드 변형:**
| 클래스 | 스타일 | 용도 |
|---|---|---|
| 기본 | `rgba(255,255,255,0.06)` bg, `0.1` border | 일반 후기 |
| `.featured` | `rgba(255,255,255,0.1)` bg, `0.18` border | 강조 후기 (인용 크기 16px) |

**규칙:**
- 3열 중앙에는 Trophy 아이콘 + CTA 문구 배치
- 후기자 아이디: `abc****` 형식으로 익명 처리
- 별점: `★★★☆☆` Unicode 별 사용, `color:#f59e0b`
- 항상 dark bg 섹션 안에서만 사용

---

## 11. Naming Conventions

| 패턴 | 예시 | 의미 |
|---|---|---|
| `section-*` | `section-dark`, `section-light` | 섹션 배경 |
| `*-band` | `portfolio-band`, `testimonial-band` | 풀너비 독립 섹션 |
| `*-shell` | `top-shell`, `sticky-category-shell` | 레이아웃 껍데기 |
| `*-wrap` | `family-wrap`, `faq-wrap` | 내부 정렬 컨테이너 |
| `*-inner` | `footer-inner` | max-width 제한 컨테이너 |
| `is-*` | `is-active`, `is-collapsed` | JS 상태 클래스 |
| `accent-*` | `accent-blue`, `accent-purple` | 색상 변형 |
| `.em` | `.em` | 텍스트 SVG 강조 장식 |
