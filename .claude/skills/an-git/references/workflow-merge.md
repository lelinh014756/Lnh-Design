# Merge Workflow

## Variables
- `TO_BRANCH`: target (default: `main`)
- `FROM_BRANCH`: source (default: current branch)

## ⚠️ IMPORTANT: Không xóa branch sau merge

**Nghiêm cấm xóa branch nguồn sau khi merge.** Branch là artifact cộng tác, không phải rác — xóa branch sau merge khiến teammate mất context, không thể revert nhanh, và phá vỡ git history visibility.

## Steps

```bash
# 1. Sync
rtk git fetch origin
rtk git checkout {TO_BRANCH}
rtk git pull origin {TO_BRANCH}

# 2. Squash merge (recommended: clean history, 1 commit/PR)
rtk git merge --squash origin/{FROM_BRANCH}
rtk git commit -m "type(scope): mô tả tiếng Việt dựa trên branch name"

# 3. Push (KHÔNG xóa branch)
rtk git push origin {TO_BRANCH}
# ❌ DO NOT: git branch -d {FROM_BRANCH}
# ❌ DO NOT: git push origin --delete {FROM_BRANCH}
```

## Conflict Resolution
1. Resolve manually → `rtk git add .` → `rtk git commit` (continues squash)

## Pre-Merge Checklist
- [ ] FROM_BRANCH rebased from main (no conflicts)
- [ ] All tests pass
- [ ] PR approved (1 reviewer)

## Error Handling

| Error | Action |
|-------|--------|
| Merge conflicts | Resolve, `rtk git add .`, `rtk git commit` |
| Branch not found | Verify name, ensure pushed to remote |
| Push rejected | `rtk git pull --rebase`, retry |
