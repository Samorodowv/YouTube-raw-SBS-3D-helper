param(
  [string]$OutDir = "dist"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$version = (Get-Content (Join-Path $root "manifest.json") | ConvertFrom-Json).version
$stageDir = Join-Path $root "$OutDir\chrome"
$zipPath = Join-Path $root "$OutDir\youtube-raw-sbs-3d-helper-$version-chrome.zip"

if (Test-Path $stageDir) {
  Remove-Item $stageDir -Recurse -Force
}

if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

New-Item -ItemType Directory -Path $stageDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stageDir "icons") | Out-Null

$files = @(
  "manifest.json",
  "content.js",
  "content.css",
  "README.md",
  "LICENSE",
  "PRIVACY.md",
  "SUPPORT.md"
)

foreach ($file in $files) {
  Copy-Item (Join-Path $root $file) -Destination (Join-Path $stageDir $file)
}

Copy-Item (Join-Path $root "icons\*") -Destination (Join-Path $stageDir "icons") -Recurse

Compress-Archive -Path (Join-Path $stageDir "*") -DestinationPath $zipPath

Write-Host "Built $zipPath"
