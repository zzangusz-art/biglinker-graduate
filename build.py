#!/usr/bin/env python3
"""
build.py — BigLinker Transfer 빌드 스크립트

사용법:
  python build.py            # 전체 빌드
  python build.py admissions # 특정 페이지만
"""

import re, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import _config as cfg

BASE     = os.path.dirname(__file__) + "/"
PARTIALS = BASE + "_partials/"
PAGES    = BASE + "_pages/"

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()

def write_out(path, content):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

def parse_meta(page_content):
    """<!-- META ... --> 블록에서 key:value 파싱"""
    m = re.search(r'<!-- META\n(.*?)\n-->', page_content, re.DOTALL)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ':' in line:
                k, _, v = line.partition(':')
                meta[k.strip()] = v.strip()
    return meta

def extract_section(content, tag):
    """<!-- TAG --> ... <!-- /TAG --> 사이 내용 추출"""
    pattern = rf'<!-- {tag} -->\n?(.*?)\n?<!-- /{tag} -->'
    m = re.search(pattern, content, re.DOTALL)
    return m.group(1).strip() if m else ''

def build_category_tabs(active_tab):
    """active_tab에 맞게 is-active 클래스 붙인 탭 HTML 생성"""
    tabs = []
    for slug, label in cfg.CATEGORY_TABS_ITEMS:
        active = ' is-active' if slug == active_tab else ''
        tabs.append(f'          <a class="category-tab{active}" href="./{slug}.html">{label}</a>')
    return '\n'.join(tabs)


def resolve_partials(content, partials_dir):
    """<!-- PARTIAL: filename.html --> 를 partial 내용으로 치환"""
    import re as _re
    def replacer(m):
        fname = m.group(1).strip()
        path = partials_dir + fname
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                return f.read()
        return ""
    return _re.sub(r"<!-- PARTIAL:\s*(.+?)\s*-->", replacer, content)


# ── SEO / AEO helpers ────────────────────────────────────────
import json as _json

_DIR_NAME  = "graduate"
_DOMAIN    = "https://gobiglinker.com"
_DIR_LABEL = "대학원 코칭"
_HOWTO = {'name': '대학원 입시 준비 방법', 'steps': ['목표 대학원·학과 및 지도교수 연구 분야 조사', '연구계획서·학업계획서 초안 작성', '서류 최적화 및 구술 면접 집중 준비', '포트폴리오·논문 기초 역량 강화']}


def _page_url(slug):
    subdomain = "https://" + _DIR_NAME + ".gobiglinker.com"
    if slug == "index":
        return subdomain + "/"
    return subdomain + "/" + slug + ".html"

def _strip_html(s):
    import re as _re
    return _re.sub(r'<[^>]+>', '', s).strip()

def _extract_faq(html):
    """Extract (q, a) pairs from <details>/<summary>/<p> FAQ structure."""
    import re as _re
    pairs = []
    faq_m = _re.search(r'class="faq-band"(.*?)(?:</section>|\Z)', html, _re.DOTALL)
    if not faq_m:
        return pairs
    block = faq_m.group(1)
    for det in _re.findall(r'<details[^>]*>(.*?)</details>', block, _re.DOTALL):
        q_m = _re.search(r'<summary>(.*?)<span', det, _re.DOTALL)
        p_m = _re.search(r'<p>(.*?)</p>', det, _re.DOTALL)
        if q_m and p_m:
            q = _strip_html(q_m.group(1)).strip()
            a = _strip_html(p_m.group(1)).strip()
            if q and a:
                pairs.append((q, a))
    return pairs

def build_seo_tags(title, description, slug):
    url = _page_url(slug)
    tags = []
    if description:
        tags.append(f'  <meta name="description" content="{description}">')
    tags.append(f'  <link rel="canonical" href="{url}">')
    tags.append(f'  <meta property="og:type"        content="website">')
    tags.append(f'  <meta property="og:title"       content="{title}">')
    if description:
        tags.append(f'  <meta property="og:description" content="{description}">')
    tags.append(f'  <meta property="og:url"         content="{url}">')
    tags.append('  <meta property="og:image"       content="' + _DOMAIN + '/assets/og-default.jpg">')
    tags.append(f'  <meta property="og:locale"      content="ko_KR">')
    tags.append(f'  <meta property="og:site_name"   content="빅링커">')
    tags.append('  <meta name="twitter:card"        content="summary_large_image">')
    tags.append(f'  <meta name="twitter:title"       content="{title}">')
    if description:
        tags.append(f'  <meta name="twitter:description"  content="{description}">')
    tags.append('  <meta name="twitter:image"       content="' + _DOMAIN + '/assets/og-default.jpg">')
    return "\n".join(tags)

def build_jsonld(title, description, slug, main_block):
    url = _page_url(slug)
    schemas = []

    # Organization
    org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "빅링커",
        "alternateName": "BigLinker",
        "url": _DOMAIN,
        "description": "기업교육·편입·대학원·취업 전문 교육 코칭 기관",
        "knowsAbout": ["기업교육","AI 활용 교육","리더십 교육","편입 컨설팅","대학원 입시","취업 코칭"],
        "areaServed": "KR",
        "inLanguage": "ko"
    }
    schemas.append(org)

    # BreadcrumbList
    crumbs = [
        {"@type":"ListItem","position":1,"name":"빅링커","item":_DOMAIN + "/"},
        {"@type":"ListItem","position":2,"name":_DIR_LABEL,"item":"https://" + _DIR_NAME + ".gobiglinker.com/"},
    ]
    if slug != "index":
        crumbs.append({"@type":"ListItem","position":3,"name":title,"item":url})
    schemas.append({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": crumbs
    })

    # Service (sub-pages only)
    if slug != "index" and description:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": title,
            "description": description,
            "provider": {"@type":"Organization","name":"빅링커","url":_DOMAIN},
            "areaServed": "KR",
            "inLanguage": "ko",
            "url": url
        })


    # HowTo (index only)
    if slug == "index" and _HOWTO:
        steps = [{"@type":"HowToStep","position":i+1,"text":s} for i,s in enumerate(_HOWTO["steps"])]
        schemas.append({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": _HOWTO["name"],
            "step": steps
        })
    # FAQPage
    faq_pairs = _extract_faq(main_block)
    if faq_pairs:
        entities = []
        for q, a in faq_pairs:
            entities.append({
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type":"Answer","text":a}
            })
        schemas.append({"@context":"https://schema.org","@type":"FAQPage","mainEntity":entities})

    blocks = []
    for s in schemas:
        blocks.append('  <script type="application/ld+json">')
        blocks.append('  ' + _json.dumps(s, ensure_ascii=False, separators=(',',':')))
        blocks.append('  </script>')
    return "\n".join(blocks)
# ── end SEO helpers ───────────────────────────────────────────

def build_page(fname):
    page_path = PAGES + f"{fname}.page.html"
    if not os.path.exists(page_path):
        print(f"  skip: {fname}.page.html not found")
        return

    page = read(page_path)
    meta = parse_meta(page)

    title        = meta.get('TITLE', 'BigLinker')
    header_promo = meta.get('HEADER_PROMO', '2026 합격전략 가이드 오픈')
    active_tab   = meta.get('ACTIVE_TAB', '')
    description  = meta.get('DESCRIPTION', '')

    page_css     = extract_section(page, 'PAGE_CSS')
    # PAGE_CSS 섹션 안에 <style> 태그가 포함된 경우 제거 (중첩 방지)
    page_css     = re.sub(r'^\s*<style>\s*', '', page_css)
    page_css     = re.sub(r'\s*</style>\s*$', '', page_css)
    mobile_cta   = extract_section(page, 'MOBILE_CTA')
    main_block   = extract_section(page, 'MAIN')
    main_block   = resolve_partials(main_block, PARTIALS)
    page_scripts = extract_section(page, 'PAGE_SCRIPTS')

    # Partials
    header_css   = read(PARTIALS + "header.css")
    header_html  = read(PARTIALS + "header.html")
    footer_html  = read(PARTIALS + "footer.html")
    sp_layer     = read(PARTIALS + "sp-layer.html")
    scripts_html = read(PARTIALS + "scripts.html")

    # Substitute header HTML variables
    vars_map = {
        **cfg.SITE_VARS,
        'HEADER_PROMO':   header_promo,
        'CATEGORY_TABS':  build_category_tabs(active_tab),
    }
    for k, v in vars_map.items():
        header_html = header_html.replace('{{' + k + '}}', v)

    # Google Fonts (include for all pages)
    fonts_link = (
        '  <link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        '  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap" rel="stylesheet">'
    )

    # Assemble final HTML
    seo_tags = build_seo_tags(title, description, fname)
    json_ld  = build_jsonld(title, description, fname, main_block)
    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
{seo_tags}
{fonts_link}
  <link rel="stylesheet" href="./style.css">
  <style>
{page_css}
{header_css}
  </style>
{json_ld}
</head>
<body>

{header_html}
{main_block}

{footer_html}

{mobile_cta}

{sp_layer}
{scripts_html}"""

    if page_scripts:
        html += f"\n{page_scripts}\n"

    html += "\n</body>\n</html>\n"

    out_path = BASE + f"{fname}.html"
    write_out(out_path, html)
    print(f"  ✅ {fname}.html")

# ── Run ───────────────────────────────────────────────────────
page_files = [f.replace('.page.html','') for f in os.listdir(PAGES) if f.endswith('.page.html')]

targets = sys.argv[1:] if len(sys.argv) > 1 else page_files

print(f"Building {len(targets)} page(s)...")
for t in targets:
    build_page(t)
print("Done.")
