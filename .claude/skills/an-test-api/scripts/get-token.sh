#!/usr/bin/env bash
# get-token.sh — Ad-hoc API test auth layer (Bash).
#
# Đọc user-secrets (cache credentials) → check token cache → refresh/login → echo token ra stdout.
# Dùng cho mode `test` của skill an-test-api: AI gọi để lấy Bearer token trước khi curl.
#
# Resolution order:
#   1. $AUTH_TOKEN env → return luôn
#   2. Cache hit (.auth/adhoc-token.json, còn hạn) → return cache.token
#   3. Cache hết hạn + có refreshToken → refresh → update cache → return
#   4. Full login qua credentials cache → POST /api/v1/auth/login → cache → return
#
# Cache/config files (tất cả gitignored):
#   .auth/config.json        — baseUrl (server endpoint, do user sở hữu)
#   .auth/adhoc-token.json   — token + refreshToken + expiresAt + baseUrl
#   .auth/credentials.json   — username + password (cache user-secrets, lần đầu)
#
# Base URL resolution: CLI arg > $BASE_URL env > .auth/config.json > default
#
# Usage:
#   bash get-token.sh                     # baseUrl từ .auth/config.json (hoặc default)
#   bash get-token.sh https://prod.xxx     # override bằng CLI arg
#   BASE_URL=... bash get-token.sh        # override bằng env
#   AUTH_TOKEN="eyJ..." bash get-token.sh # bypass login
#
# Exit 0 + token trên stdout khi OK. Exit !=0 + message stderr khi fail.
set -euo pipefail

USER_SECRETS_ID="landsoft-apihost-scenariotests"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
AUTH_DIR="$REPO_ROOT/.auth"
CONFIG_FILE="$AUTH_DIR/config.json"
TOKEN_CACHE="$AUTH_DIR/adhoc-token.json"
CRED_CACHE="$AUTH_DIR/credentials.json"
DEFAULT_BASE_URL="https://localhost:5005"
SAFE_MARGIN_MIN=5   # trừ 5 phút safety (mirror LoginTokenProvider.cs:96)
LOGIN_DEVICE="AdhocTest"

die() { echo "[get-token] ERROR: $*" >&2; exit 1; }

# Base URL resolution: CLI arg > env > .auth/config.json > default
resolve_base_url() {
  local cli="${1:-}"
  [[ -n "$cli" ]] && { echo -n "$cli"; return; }
  [[ -n "${BASE_URL:-}" ]] && { echo -n "$BASE_URL"; return; }
  if [[ -f "$CONFIG_FILE" ]]; then
    local cfg
    cfg=$(jq -r '.baseUrl // empty' "$CONFIG_FILE" 2>/dev/null) || cfg=""
    [[ -n "$cfg" ]] && { echo -n "$cfg"; return; }
  fi
  echo -n "$DEFAULT_BASE_URL"
}

BASE_URL="$(resolve_base_url "${1:-}")"

# 1. AUTH_TOKEN env — dùng luôn, không động cache
if [[ -n "${AUTH_TOKEN:-}" ]]; then
  echo -n "$AUTH_TOKEN"
  exit 0
fi

command -v curl >/dev/null || die "curl không tìm thấy. Cài curl hoặc dùng Get-Token.ps1"
command -v jq   >/dev/null || die "jq không tìm thấy. Cài jq (scoop install jq) hoặc dùng Get-Token.ps1"

mkdir -p "$AUTH_DIR"

# Đọc credentials: cache trước, fallback user-secrets CLI
resolve_credentials() {
  if [[ -f "$CRED_CACHE" ]]; then
    local u p
    u=$(jq -r '.username // empty' "$CRED_CACHE") || true
    p=$(jq -r '.password // empty' "$CRED_CACHE") || true
    if [[ -n "$u" && -n "$p" ]]; then
      printf '%s\t%s' "$u" "$p"
      return 0
    fi
  fi
  # Lần đầu: đọc user-secrets qua CLI (chạy từ bất kỳ cwd nhờ --id)
  if ! command -v dotnet >/dev/null; then
    die "dotnet CLI không tìm thấy. Set user-secrets trước hoặc set AUTH_TOKEN env."
  fi
  local secrets
  secrets=$(dotnet user-secrets list --id "$USER_SECRETS_ID" 2>/dev/null) || die "Không đọc được user-secrets id=$USER_SECRETS_ID. Chạy: dotnet user-secrets set TestCredentials:AdminUsername <u> --id $USER_SECRETS_ID"
  local u p
  u=$(echo "$secrets" | grep -i '^TestCredentials:AdminUsername' | sed 's/^[^=]*= *//') || true
  p=$(echo "$secrets" | grep -i '^TestCredentials:Password' | sed 's/^[^=]*= *//') || true
  [[ -n "$u" && -n "$p" ]] || die "Thiếu TestCredentials:AdminUsername hoặc :Password trong user-secrets."
  # Cache credentials (atomic)
  local tmp="$CRED_CACHE.tmp"
  jq -n --arg u "$u" --arg p "$p" '{username:$u, password:$p}' > "$tmp"
  mv "$tmp" "$CRED_CACHE"
  printf '%s\t%s' "$u" "$p"
}

# Cache còn hạn? expiresAt > now + 30s, baseUrl match
cache_valid() {
  [[ -f "$TOKEN_CACHE" ]] || return 1
  local exp url
  exp=$(jq -r '.expiresAt // empty' "$TOKEN_CACHE") || return 1
  url=$(jq -r '.baseUrl // empty' "$TOKEN_CACHE") || return 1
  [[ "$url" == "$BASE_URL" ]] || return 1
  [[ -n "$exp" ]] || return 1
  local now threshold
  now=$(date -u +%s)
  # date -d trên Git Bash (GNU) hiểu ISO 8601
  threshold=$(date -u -d "$exp" +%s 2>/dev/null) || return 1
  [[ $((threshold - now)) -gt 30 ]]
}

write_token_cache() {
  # $1=token $2=refreshToken $3=expiresInMinutes
  local token="$1" refresh="$2" exp_min="$3"
  local exp_iso
  exp_iso=$(date -u -d "+$((exp_min - SAFE_MARGIN_MIN)) minutes" +%Y-%m-%dT%H:%M:%SZ)
  local tmp="$TOKEN_CACHE.tmp"
  jq -n \
    --arg t "$token" \
    --arg r "$refresh" \
    --arg e "$exp_iso" \
    --arg u "$BASE_URL" \
    --arg i "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    '{token:$t, refreshToken:$r, expiresAt:$e, baseUrl:$u, issuedAt:$i}' > "$tmp"
  mv "$tmp" "$TOKEN_CACHE"
}

# 2. Cache hit
if cache_valid; then
  jq -r '.token' "$TOKEN_CACHE"
  exit 0
fi

# 3. Refresh (nếu có refreshToken trong cache)
if [[ -f "$TOKEN_CACHE" ]]; then
  refresh=$(jq -r '.refreshToken // empty' "$TOKEN_CACHE") || refresh=""
  if [[ -n "$refresh" ]]; then
    resp=$(curl -k -s -X POST "$BASE_URL/api/v1/auth/refresh-token" \
      -H "Content-Type: application/json" \
      -d "{\"token\":\"$refresh\"}") || resp=""
    success=$(echo "$resp" | jq -r '.success // false' 2>/dev/null) || success="false"
    if [[ "$success" == "true" ]]; then
      t=$(echo "$resp" | jq -r '.data.token')
      r=$(echo "$resp" | jq -r '.data.refreshToken // empty')
      exp=$(echo "$resp" | jq -r '.data.expiresIn // 60')
      write_token_cache "$t" "$r" "$exp"
      echo -n "$t"
      exit 0
    fi
    # Refresh fail → invalidate, fall through to full login
    rm -f "$TOKEN_CACHE"
  fi
fi

# 4. Full login
creds=$(resolve_credentials) || exit 1
username="${creds%%$'\t'*}"
password="${creds#*$'\t'}"

resp=$(curl -k -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg u "$username" --arg p "$password" \
        '{username:$u, password:$p, rememberMe:true, deviceName:"AdhocTest"}')") \
  || die "Login: HTTP transport error. API đang chạy tại $BASE_URL?"

success=$(echo "$resp" | jq -r '.success // false')
if [[ "$success" != "true" ]]; then
  msg=$(echo "$resp" | jq -r '.message // "unknown"')
  code=$(echo "$resp" | jq -r '.errors[0].code // empty')
  die "Login thất bại ($msg${code:+, code=$code}). Kiểm tra credentials hoặc account bị lockout sau 5 fail."
fi

t=$(echo "$resp" | jq -r '.data.token')
r=$(echo "$resp" | jq -r '.data.refreshToken // empty')
exp=$(echo "$resp" | jq -r '.data.expiresIn // 60')
write_token_cache "$t" "$r" "$exp"
echo -n "$t"
