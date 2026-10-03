#!/usr/bin/env python3
"""
scan_api_map.py — URL resolver cho API Map skill.

Chỉ làm: URL path → page.tsx → screen component path
Phần còn lại (hooks → endpoints) để agent tự trace bằng Grep/Read.

Usage:
    python scan_api_map.py <url-path>

Output:
    Ghi ra thông tin cơ bản về URL đó:
    - page file path
    - screen component name
    - screen file path
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REPO = Path(__file__).resolve().parents[4]


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, FileNotFoundError):
        return ""


def find_page_for_url(url_path: str) -> list[Path]:
    """Resolve URL path to page.tsx files."""
    url_path = url_path.strip().strip('"')
    parts = [p for p in url_path.split("/") if p]
    normalized = "/".join(parts)

    # Exact resolution: src/app/app/{normalized}/page.tsx
    candidates = [REPO / "src" / "app" / "app" / normalized / "page.tsx"]
    results = [p for p in candidates if p.is_file()]

    if not results:
        # Try glob: /projects/** → all pages under /projects/
        if "**" in normalized:
            prefix = normalized.split("**")[0].rstrip("/")
            results = list(_find_pages_glob(prefix))
        else:
            results = list(_find_catch_all_pages(parts))

    # Deduplicate
    seen = set()
    unique = []
    for p in results:
        rel = str(p.relative_to(REPO)).replace("\\", "/")
        if rel not in seen:
            seen.add(rel)
            unique.append(p)

    return [p.relative_to(REPO) for p in unique]


def _find_pages_glob(prefix: str) -> list[Path]:
    """Find pages under a prefix."""
    base = REPO / "src" / "app" / "app"
    prefix_parts = [p for p in prefix.split("/") if p]

    results = []
    for p in base.rglob("page.tsx"):
        rel_parts = p.relative_to(base).parts
        dir_parts = rel_parts[:-1] if rel_parts[-1] == "page.tsx" else rel_parts
        if len(dir_parts) < len(prefix_parts) + 1:
            continue
        match_parts = dir_parts[:len(prefix_parts) + 1]
        if "/".join(match_parts).startswith(prefix.rstrip("/")):
            results.append(p)

    return results


def _find_catch_all_pages(url_parts: list[str]) -> list[Path]:
    """Find pages matching URL with [...slug] catch-all."""
    base = REPO / "src" / "app" / "app"

    results = []
    for p in base.rglob("page.tsx"):
        rel_parts = p.relative_to(base).parts
        dir_parts = rel_parts[:-1] if rel_parts[-1] == "page.tsx" else rel_parts

        if len(dir_parts) < len(url_parts):
            continue

        match = True
        for i, part in enumerate(url_parts):
            if part.startswith("[") or (i < len(dir_parts) and dir_parts[i].startswith("[")):
                continue
            if i < len(dir_parts) and part != dir_parts[i]:
                match = False
                break
        if match:
            results.append(p)

    return results


def resolve_screen_from_page(page_path: Path) -> dict:
    """Parse page.tsx → screen component info."""
    text = read_text(page_path)

    # Find JSX return tag: return <ComponentName ... />
    jsx_match = re.search(r"return\s*<(\w+)[^>]*\/>", text)
    if not jsx_match:
        jsx_match = re.search(r"return\s*<(\w+)", text)

    screen_name = jsx_match.group(1) if jsx_match else None

    # Find import for this component
    import_path = None
    if screen_name:
        for pattern in [
            rf"import\s*\{{([^}}]+)}}\s*from\s*['\"]([^'\"]+)['\"]",
            rf"import\s+{screen_name}\s+from\s*['\"]([^'\"]+)['\"]",
        ]:
            match = re.search(pattern, text)
            if match:
                raw = match.group(2)
                if raw.startswith("@/"):
                    resolved = REPO / "src" / raw.replace("@/", "")
                    if not resolved.suffix:
                        resolved = resolved.with_suffix(".tsx")
                    if resolved.is_file():
                        import_path = str(resolved.relative_to(REPO)).replace("\\", "/")
                        break
                elif raw.startswith("."):
                    resolved = (page_path.parent / raw).resolve()
                    if not resolved.suffix:
                        resolved = resolved.with_suffix(".tsx")
                    if resolved.is_file():
                        import_path = str(resolved.relative_to(REPO)).replace("\\", "/")
                        break

    return {
        "page": str(page_path.relative_to(REPO)).replace("\\", "/"),
        "screen_name": screen_name,
        "screen_file": import_path,
    }


def resolve_url_slug(url_path: str) -> str:
    """Convert URL path to filename-safe slug."""
    slug = url_path.strip("/").replace("/", "-").replace("[", "").replace("]", "")
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python scan_api_map.py <url-path>", file=sys.stderr)
        print("Example: python scan_api_map.py /projects/zones", file=sys.stderr)
        return 1

    url_path = sys.argv[1]
    page_files = find_page_for_url(url_path)

    if not page_files:
        print(f"ERROR: No page found for URL '{url_path}'", file=sys.stderr)
        return 2

    slug = resolve_url_slug(url_path)

    print(f"# URL: {url_path}")
    print(f"# Pages matched: {len(page_files)}")
    print(f"# Output slug: {slug}")
    print()

    for page_file in page_files:
        page_path = REPO / page_file
        screen_info = resolve_screen_from_page(page_path)
        print(f"page_file: {screen_info['page']}")
        print(f"screen_name: {screen_info['screen_name']}")
        print(f"screen_file: {screen_info['screen_file']}")
        print()

    print("# Agent Instructions:")
    print("# 1. Read the screen file above")
    print("# 2. Grep for useQuery, useMutation, useInfiniteQuery in the screen")
    print("# 3. For each hook, read its definition to find the endpoint")
    print("# 4. Format as docs/api-map/api-map-{slug}.md")

    return 0


if __name__ == "__main__":
    sys.exit(main())
