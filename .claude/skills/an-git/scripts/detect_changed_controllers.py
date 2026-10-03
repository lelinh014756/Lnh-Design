#!/usr/bin/env python3
"""
Detect changed controllers from git diff output and map to docs/api paths.

Input: Controller file paths from stdin (one per line) or as args
Output: JSON with controller-to-doc mappings

Usage:
  echo "src/ApiHost/Controllers/Investors/InvestorController.cs" | python detect_changed_controllers.py
  python detect_changed_controllers.py src/ApiHost/Controllers/Investors/InvestorController.cs
  git diff ... -- src/ApiHost/Controllers/ | grep "\.cs$" | python detect_changed_controllers.py
"""

import json
import sys
from pathlib import Path

# Irregular singular mappings
IRREGULAR_SINGULAR = {
    "staffs": "staff",
    "projects": "projects",  # stays same
    "customers": "customer",
    "investors": "investor",
    "transactions": "transaction",
    "notifications": "notification",
    "organizations": "organization",
    "permissions": "permission",
    "categories": "categories",
    "properties": "property",
    "sales": "sales",
    "bankaccounts": "bank-accounts",
    "accountingaccounts": "accounting-accounts",
    "sales": "sales",
    "sales-events": "sales-events",
    "doc": "doc",
    "audit": "audit-log",
}

DOCS_API_DIR = Path("docs/api")


def to_singular(folder_name: str) -> str:
    """Convert folder name to singular form for doc naming."""
    lower = folder_name.lower()
    if lower in IRREGULAR_SINGULAR:
        return IRREGULAR_SINGULAR[lower]
    # Default: remove trailing 's' if present (but not 'ss')
    if lower.endswith("s") and not lower.endswith("ss"):
        return lower[:-1]
    return lower


def controller_to_doc(controller_path: str) -> str | None:
    """
    Convert controller path to doc path.

    Example:
      'src/ApiHost/Controllers/Investors/InvestorController.cs'
      → 'docs/api/api-investor.md'
    """
    path = Path(controller_path)
    parts = path.parts

    try:
        controllers_idx = parts.index("Controllers")
        folder = parts[controllers_idx + 1]
        class_name = parts[controllers_idx + 2]
    except (ValueError, IndexError):
        return None

    # Skip non-controller files
    if not class_name.endswith("Controller.cs"):
        return None

    # Use folder name for singular form
    singular = to_singular(folder)
    doc_name = f"api-{singular}.md"
    doc_path = DOCS_API_DIR / doc_name

    return str(doc_path)


def main() -> None:
    # Read controller paths from stdin or args
    if len(sys.argv) > 1:
        controller_paths = [arg for arg in sys.argv[1:] if arg.endswith(".cs")]
    else:
        controller_paths = [line.strip() for line in sys.stdin if line.strip().endswith(".cs")]

    if not controller_paths:
        print(json.dumps({"changed_controllers": [], "total": 0}))
        return

    changed_controllers = []

    for cp in controller_paths:
        doc_path = controller_to_doc(cp)
        if doc_path:
            doc_exists = Path(doc_path).exists()
            # Extract feature name from doc path
            feature_name = Path(doc_path).stem.replace("api-", "")
            changed_controllers.append({
                "controller_path": cp,
                "doc_path": doc_path,
                "doc_exists": doc_exists,
                "feature_name": feature_name
            })

    result = {
        "changed_controllers": changed_controllers,
        "total": len(changed_controllers)
    }

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
