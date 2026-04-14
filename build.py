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
    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
{fonts_link}
  <link rel="stylesheet" href="./style.css">
  <style>
{page_css}
{header_css}
  </style>
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
