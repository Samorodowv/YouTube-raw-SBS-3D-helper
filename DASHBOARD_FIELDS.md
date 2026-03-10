# Chrome Web Store Dashboard Fields

Use these values in the Chrome Web Store Developer Dashboard for the first public submission.

## Package

- Upload file: `dist/youtube-raw-sbs-3d-helper-0.2.0-chrome.zip`
- Visibility target after approval: `Public`
- Category: `Accessibility`
- Language: `English`

## Store Listing

### Name

YouTube raw SBS/3D helper

### Summary

Restore the raw SBS or top-bottom 3D view on supported YouTube watch pages.

### Detailed description

YouTube raw SBS/3D helper is a focused utility for old YouTube 3D uploads that still contain a raw stereo stream inside the player.

When YouTube renders those videos through a processed canvas layer, this extension can hide that processed layer and reveal the original underlying video element instead. On supported pages, the extension enables SBS mode automatically and adds a small player button so you can turn the behavior on or off without leaving the video.

What it does:

- Works on YouTube watch pages
- Detects a supported raw-video plus canvas player structure
- Restores raw SBS or top-bottom 3D presentation when available
- Reapplies the setting across YouTube's in-page navigation

What it does not do:

- It does not download or re-encode video
- It does not modify videos on YouTube's servers
- It does not guarantee support for every historical 3D upload

### Homepage URL

`https://samorodowv.github.io/YouTube-raw-SBS-3D-helper/`

### Support URL

`https://samorodowv.github.io/YouTube-raw-SBS-3D-helper/support.html`

### Screenshots

- Upload at least one real screenshot at `1280x800` or `640x400`
- Recommended first screenshot: supported YouTube watch page with `SBS ON` visible
- Recommended second screenshot: same page with `SBS OFF`

### Promo image

- Upload `store/promo-440x280.png`
- Replace it later if you create a stronger text-light version

## Privacy Tab

### Single purpose

This extension restores the raw SBS or top-bottom 3D stream on supported YouTube watch pages by changing the local player presentation in the browser.

### Permission justification

- `storage`: Stores one local preference so the extension can remember whether SBS mode should be enabled by default.

### Remote code

No, I am not using remote code.

### Data collection

Select no collected data if the dashboard allows a no-data declaration.

If individual categories are shown, leave all collection categories unchecked and certify accordingly, because the extension does not collect, transmit, sell, or share user data.

### Privacy policy URL

`https://samorodowv.github.io/YouTube-raw-SBS-3D-helper/privacy.html`

## Distribution

- Pricing: `Free`
- Visibility: `Public`
- Regions: start with all supported regions unless you want a narrower release

## Reviewer Notes

This extension runs only on YouTube pages and changes the local presentation of supported 3D watch pages. It checks the active YouTube player for an underlying HTML5 video element plus a processed canvas layer. When both are present, it hides the processed canvas layer and shows the underlying raw video element. The extension adds one small `SBS ON` or `SBS OFF` button to the YouTube player controls and stores one local toggle preference with the `storage` permission. It does not execute remote code, send network requests, or transmit user data off-device.

## Pre-submit checks

- Confirm GitHub Pages is live before using the URLs above
- Confirm screenshots reflect the current extension UI
- Rebuild the ZIP after any code or manifest change
