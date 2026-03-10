param(
  [string]$OutDir = "icons"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root $OutDir
$storeDir = Join-Path $root "store"

if (!(Test-Path $iconsDir)) {
  New-Item -ItemType Directory -Path $iconsDir | Out-Null
}

if (!(Test-Path $storeDir)) {
  New-Item -ItemType Directory -Path $storeDir | Out-Null
}

function New-Brush([string]$hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Save-Png($bitmap, $path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function New-Icon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $background = New-Object System.Drawing.Rectangle 0, 0, $size, $size
  $g.FillRectangle((New-Brush "#071A26"), $background)

  $stripeWidth = [int]([Math]::Max(2, $size * 0.08))
  $g.FillRectangle((New-Brush "#11A7B8"), 0, 0, $stripeWidth, $size)
  $g.FillRectangle((New-Brush "#11A7B8"), $size - $stripeWidth, 0, $stripeWidth, $size)

  $panelMargin = [int]($size * 0.16)
  $panelGap = [int]([Math]::Max(2, $size * 0.06))
  $panelWidth = [int](($size - ($panelMargin * 2) - $panelGap) / 2)
  $panelHeight = [int]($size * 0.52)
  $panelY = [int]($size * 0.18)

  $leftPanel = New-Object System.Drawing.Rectangle $panelMargin, $panelY, $panelWidth, $panelHeight
  $rightPanel = New-Object System.Drawing.Rectangle ($panelMargin + $panelWidth + $panelGap), $panelY, $panelWidth, $panelHeight

  $g.FillRectangle((New-Brush "#16465A"), $leftPanel)
  $g.FillRectangle((New-Brush "#16465A"), $rightPanel)
  $g.DrawRectangle((New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#9AE7FF"), [Math]::Max(1, $size * 0.02))), $leftPanel)
  $g.DrawRectangle((New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#9AE7FF"), [Math]::Max(1, $size * 0.02))), $rightPanel)

  $fontSize = [int]([Math]::Max(6, $size * 0.17))
  $font = [System.Drawing.Font]::new("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $textRect = New-Object System.Drawing.RectangleF 0, ($size * 0.72), $size, ($size * 0.2)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString("SBS", $font, (New-Brush "#E8FBFF"), $textRect, $format)

  $font.Dispose()
  $g.Dispose()
  Save-Png $bmp $path
}

function New-PromoTile([string]$path) {
  $width = 440
  $height = 280
  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $g.FillRectangle((New-Brush "#071A26"), 0, 0, $width, $height)
  $g.FillRectangle((New-Brush "#0E3144"), 16, 16, $width - 32, $height - 32)
  $g.FillRectangle((New-Brush "#11A7B8"), 0, 0, 18, $height)

  $left = New-Object System.Drawing.Rectangle 48, 46, 112, 112
  $right = New-Object System.Drawing.Rectangle 176, 46, 112, 112
  $g.FillRectangle((New-Brush "#16465A"), $left)
  $g.FillRectangle((New-Brush "#16465A"), $right)
  $g.DrawRectangle((New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#9AE7FF"), 4)), $left)
  $g.DrawRectangle((New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#9AE7FF"), 4)), $right)

  $titleFont = [System.Drawing.Font]::new("Segoe UI", 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $subtitleFont = [System.Drawing.Font]::new("Segoe UI", 15, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $accentFont = [System.Drawing.Font]::new("Segoe UI", 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

  $g.DrawString("YouTube raw SBS/3D helper", $titleFont, (New-Brush "#E8FBFF"), 48, 176)
  $g.DrawString("Reveal the raw 3D stream on supported watch pages", $subtitleFont, (New-Brush "#9AE7FF"), 50, 216)
  $g.DrawString("SBS", $accentFont, (New-Brush "#E8FBFF"), 320, 70)
  $g.DrawString("Chrome extension", $subtitleFont, (New-Brush "#9AE7FF"), 320, 106)

  $titleFont.Dispose()
  $subtitleFont.Dispose()
  $accentFont.Dispose()
  $g.Dispose()
  Save-Png $bmp $path
}

$sizes = 16, 32, 48, 128
foreach ($size in $sizes) {
  New-Icon -size $size -path (Join-Path $iconsDir "icon$size.png")
}

New-PromoTile -path (Join-Path $storeDir "promo-440x280.png")

Write-Host "Generated icons in $iconsDir and promo tile in $storeDir"
