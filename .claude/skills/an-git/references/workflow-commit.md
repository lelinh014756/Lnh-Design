# Commit Workflow

Execute via `git-manager` subagent.

> **Path Convention:** Always use forward slash `/` in bash commands on Windows  
> ❌ `.claude\skills\scripts\xxx.py` → ✅ `.claude/skills/scripts/xxx.py`

## CRITICAL: Detection Order

**ALWAYS run split analysis BEFORE scope detection.** Why?
- If all files are `generated`/`whitespace_only` → scope detection is wasted
- If mix of categories → scope ONLY for substantive files

## Tool 1: Stage + Security + Split Analysis

```bash
rtk git add -A && \
echo "=== STAGED ===" && rtk git diff --cached --stat && \
echo "=== SECURITY ===" && \
SECRET_CHECK=$(rtk git diff --cached --unified=0 --no-color | grep -E '^\+.*(AKIA[0-9A-Z]{16}|api[_-]?key|secret_|password|credential|private[_-]?key|mongodb://|postgres://|mysql://|redis://)' | head -5 || echo "CLEAN") && \
if [[ "$SECRET_CHECK" != "CLEAN" ]]; then echo "SECRETS_DETECTED"; echo "$SECRET_CHECK"; exit 1; fi && \
echo "SECRETS:0" && \
echo "=== SPLIT ANALYSIS ===" && \
.claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_split.py && \
HAS_SUBSTANTIVE=$(.claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_split.py --has-substantive && echo "yes" || echo "no") && \
echo "HAS_SUBSTANTIVE: $HAS_SUBSTANTIVE"
```

**Note:** All Python paths use forward slashes for bash compatibility: `.claude/skills/.venv/Scripts/python.exe`

**If secrets are detected:** STOP, block commit, show filenames + matched added lines only.

**Output:**
```
=== STAGED ===
31 files changed, 945 insertions(+), 367 deletions(-)
=== SECURITY ===
SECRETS:0
=== SPLIT ANALYSIS ===
[generated]
  file1.g.cs
[substantive]
  ProjectService.cs
  ProjectController.cs
HAS_SUBSTANTIVE: yes
```

## Tool 2: Scope Detection (ONLY if substantive exists)

```bash
# ONLY run if HAS_SUBSTANTIVE=yes
if [[ "$HAS_SUBSTANTIVE" == "yes" ]]; then
  # Get ONLY substantive files for scope detection
  SUBSTANTIVE_FILES=$(.claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_split.py --json | grep -A1000 '"substantive"' | grep '^\s*"' | grep -v 'substantive' | sed 's/.*"\(.*\)".*/\1/')
  if [[ -n "$SUBSTANTIVE_FILES" ]]; then
    SCOPE=$(echo "$SUBSTANTIVE_FILES" | .claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_scope.py)
    echo "DETECTED_SCOPE: $SCOPE"
  fi
fi
```

**Why this order:**
1. Split first → know which category each file belongs to
2. Filter substantive files → pass ONLY those to scope detection
3. More accurate scope (generated files won't pollute result)

**Note:** The Python path `.claude/skills/.venv/Scripts/python.exe` uses forward slashes for bash compatibility on Windows.

## Tool 3: Auto-Commit Decision

Based on split analysis output:

| Split Result | Action | Commit Pattern |
|-------------|--------|----------------|
| `ONLY generated` | Auto-commit | `chore(config/deps): ...` |
| `ONLY whitespace_only` | Auto-commit | `style(scope): format ...` |
| `ONLY rename_only` | Auto-commit | `refactor(scope): rename ...` |
| `mixed substantive + generated` | 2 commits | `chore(...)` → `feat/fix(scope)` |
| `ONLY substantive` | Detect scope → commit | Normal flow |
| `mixed categories` | Ask user | Manual decision |

**Auto-commit examples:**
```bash
# If only generated files
if [[ "$HAS_SUBSTANTIVE" == "no" ]]; then
  # Check what category exists
  CATEGORY=$(.claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_split.py --json | jq -r 'keys[]' | grep -v '^\[\]' | head -1)
  rtk git commit -m "chore(config): auto-generated files"
fi
```

**Note:** All Python paths use forward slashes for bash compatibility: `.claude/skills/.venv/Scripts/python.exe`

## Tool 4: Interactive Commit (for substantive)

If HAS_SUBSTANTIVE=yes AND mixed with other categories:

```bash
# 1. Reset to split by category
rtk git reset HEAD

# 2. Commit non-substantive first (auto)
GENERATED_FILES=$(.claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_split.py --json | jq -r '.generated[]' | tr '\n' ' ')
if [[ -n "$GENERATED_FILES" ]]; then
  rtk git add $GENERATED_FILES && rtk git commit -m "chore(config): auto-generated files"
fi

# 3. Commit substantive with detected scope
SUBSTANTIVE_FILES=$(.claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_split.py --json | jq -r '.substantive[]' | tr '\n' ' ')
SCOPE=$(echo "$SUBSTANTIVE_FILES" | .claude/skills/.venv/Scripts/python.exe .claude/skills/an-git/scripts/detect_scope.py)
rtk git add $SUBSTANTIVE_FILES && rtk git commit -m "feat($SCOPE): description"
```

## Tool 5: Push (if requested)

Read `workflow-push.md`. TL;DR:
```bash
rtk git push && echo "✓ pushed: yes" || rtk git push -u origin HEAD
```

Only push when the user explicitly requests it ("push", "cp", "commit and push").

## Dry-run Mode

When `--dry-run` is present:
- Run Tool 1 + 2 (analyze + detect) but **skip Tool 3 + 4 + 5**
- Output the planned commits + suggested messages
- Trailer: `DRY-RUN: no changes made`
