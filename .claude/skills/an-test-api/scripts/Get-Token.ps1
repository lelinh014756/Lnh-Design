#Requires -Version 7
<#
.SYNOPSIS
  Ad-hoc API test auth layer (PowerShell) — mirror của get-token.sh.
  Đọc user-secrets (cache credentials) → check token cache → refresh/login → output token.

.DESCRIPTION
  Resolution order:
    1. $env:AUTH_TOKEN          → return luôn
    2. Cache hit (.auth/adhoc-token.json, còn hạn) → return cache.token
    3. Cache hết hạn + refreshToken → refresh → update cache → return
    4. Full login qua credentials cache → POST /api/v1/auth/login → cache → return

  Cache/config files (gitignored):
    .auth/config.json        — baseUrl (server endpoint, do user sở hữu)
    .auth/adhoc-token.json   — token + refreshToken + expiresAt + baseUrl
    .auth/credentials.json   — username + password (cache user-secrets, lần đầu)

  Base URL resolution: -BaseUrl param > $env:BASE_URL > .auth/config.json > default

.PARAMETER BaseUrl
  API base URL. Optional — nếu bỏ trống, resolve từ $env:BASE_URL → .auth/config.json → default https://localhost:5005.

.OUTPUTS
  Token string ra stdout (chuỗi, không newline thừa). Exit 0 khi OK.

.EXAMPLE
  $token = pwsh -File Get-Token.ps1                              # baseUrl từ .auth/config.json
  $token = pwsh -File Get-Token.ps1 -BaseUrl https://staging.xxx # override bằng param
#>
[CmdletBinding()]
param(
  [string]$BaseUrl = ''
)
$ErrorActionPreference = 'Stop'

$UserSecretsId    = 'landsoft-apihost-scenariotests'
$ScriptDir        = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot         = (Resolve-Path (Join-Path $ScriptDir '../../../..')).Path
$AuthDir          = Join-Path $RepoRoot '.auth'
$ConfigFile       = Join-Path $AuthDir 'config.json'
$TokenCache       = Join-Path $AuthDir 'adhoc-token.json'
$CredCache        = Join-Path $AuthDir 'credentials.json'
$DefaultBaseUrl   = 'https://localhost:5005'
$SafeMarginMin    = 5   # trừ 5 phút safety (mirror LoginTokenProvider.cs:96)

function Die([string]$msg) { Write-Error "[Get-Token] $msg"; exit 1 }

# Base URL resolution: param > env > .auth/config.json > default
if (-not $BaseUrl) {
  if ($env:BASE_URL) {
    $BaseUrl = $env:BASE_URL
  } elseif (Test-Path $ConfigFile) {
    try {
      $cfg = Get-Content $ConfigFile -Raw | ConvertFrom-Json
      if ($cfg.baseUrl) { $BaseUrl = $cfg.baseUrl }
    } catch { }
  }
  if (-not $BaseUrl) { $BaseUrl = $DefaultBaseUrl }
}

# Bỏ SSL verify cho dev cert self-signed (localhost). PS 7+ hỗ trợ -SkipCertificateCheck trên IRM.
# Dùng session option thay vì global để không ảnh hưởng caller.
$SkipCert = [System.Net.Http.HttpClientHandler]::new()
$SkipCert.ServerCertificateCustomValidationCallback = [System.Net.Http.HttpClientHandler]::DangerousAcceptAnyServerCertificateValidator

# 1. AUTH_TOKEN env
if ($env:AUTH_TOKEN) { Write-Output -NoEnumerate $env:AUTH_TOKEN; exit 0 }

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
  Die "dotnet CLI không tìm thấy. Set user-secrets trước hoặc set `$env:AUTH_TOKEN."
}

New-Item -ItemType Directory -Force -Path $AuthDir | Out-Null

function Resolve-Credentials {
  if (Test-Path $CredCache) {
    try {
      $c = Get-Content $CredCache -Raw | ConvertFrom-Json
      if ($c.username -and $c.password) { return $c.username, $c.password }
    } catch { }
  }
  # Lần đầu: đọc user-secrets qua CLI (--id → chạy từ bất kỳ cwd)
  $secrets = & dotnet user-secrets list --id $UserSecretsId 2>$null
  if (-not $secrets) { Die "Không đọc được user-secrets id=$UserSecretsId. Chạy: dotnet user-secrets set TestCredentials:AdminUsername <u> --id $UserSecretsId" }
  $u = ($secrets | Where-Object { $_ -match '^TestCredentials:AdminUsername' }) -replace '^[^=]*=\s*', ''
  $p = ($secrets | Where-Object { $_ -match '^TestCredentials:Password' })     -replace '^[^=]*=\s*', ''
  if (-not $u -or -not $p) { Die "Thiếu TestCredentials:AdminUsername hoặc :Password trong user-secrets." }
  @{ username = $u; password = $p } | ConvertTo-Json -Compress | Set-Content $CredCache -NoNewline
  return $u.Trim(), $p.Trim()
}

function Test-CacheValid {
  if (-not (Test-Path $TokenCache)) { return $false }
  try {
    $c = Get-Content $TokenCache -Raw | ConvertFrom-Json
    if ($c.baseUrl -ne $BaseUrl) { return $false }
    $exp = [DateTimeOffset]::Parse($c.expiresAt)
    return ([DateTimeOffset]::UtcNow.AddSeconds(30) -lt $exp) -and $c.token
  } catch { return $false }
}

function Write-TokenCache([string]$Token, [string]$Refresh, [double]$ExpiresInMin) {
  $exp = [DateTimeOffset]::UtcNow.AddMinutes($ExpiresInMin - $SafeMarginMin).ToString('yyyy-MM-ddTHH:mm:ssZ')
  $now = [DateTimeOffset]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
  @{ token = $Token; refreshToken = $Refresh; expiresAt = $exp; baseUrl = $BaseUrl; issuedAt = $now } |
    ConvertTo-Json -Compress | Set-Content $TokenCache -NoNewline
}

# Helper: POST JSON, return parsed ApiResponse (hashtable)
function Invoke-Post([string]$Path, [object]$BodyObj) {
  $json = $BodyObj | ConvertTo-Json -Compress
  $client = [System.Net.Http.HttpClient]::new($SkipCert)
  try {
    $content = [System.Net.Http.StringContent]::new($json, [System.Text.Encoding]::UTF8, 'application/json')
    $resp = $client.PostAsync("$BaseUrl$Path", $content).GetAwaiter().GetResult()
    $text = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
    return $text | ConvertFrom-Json
  } finally { $client.Dispose() }
}

# 2. Cache hit
if (Test-CacheValid) {
  $c = Get-Content $TokenCache -Raw | ConvertFrom-Json
  Write-Output -NoEnumerate $c.token
  exit 0
}

# 3. Refresh nếu có refreshToken
if (Test-Path $TokenCache) {
  $cached = Get-Content $TokenCache -Raw | ConvertFrom-Json
  if ($cached.refreshToken) {
    try {
      $r = Invoke-Post '/api/v1/auth/refresh-token' @{ token = $cached.refreshToken }
      if ($r.success -eq $true -and $r.data) {
        Write-TokenCache $r.data.token $r.data.refreshToken $r.data.expiresIn
        Write-Output -NoEnumerate $r.data.token
        exit 0
      }
    } catch { }
    Remove-Item $TokenCache -Force -ErrorAction SilentlyContinue
  }
}

# 4. Full login
$u, $p = Resolve-Credentials
try {
  $resp = Invoke-Post '/api/v1/auth/login' @{
    username    = $u
    password    = $p
    rememberMe  = $true
    deviceName  = 'AdhocTest'
  }
} catch {
  Die "Login: HTTP transport error. API đang chạy tại $BaseUrl? $($_.Exception.Message)"
}

if ($resp.success -ne $true) {
  $code = if ($resp.errors) { $resp.errors[0].code } else { '' }
  Die "Login thất bại ($($resp.message)$(if ($code) { ", code=$code" })). Kiểm tra credentials hoặc account bị lockout sau 5 fail."
}

Write-TokenCache $resp.data.token $resp.data.refreshToken $resp.data.expiresIn
Write-Output -NoEnumerate $resp.data.token
