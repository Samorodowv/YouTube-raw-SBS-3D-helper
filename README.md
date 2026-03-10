# YouTube raw SBS/3D helper

Chrome extension that restores the raw uploaded SBS or top-bottom 3D stream on supported YouTube watch pages by hiding YouTube's processed canvas layer and surfacing the underlying video element.

## Status

- Chrome-first release target.
- Defaults to SBS mode enabled when a supported player structure is detected.
- Current test fixture: `https://www.youtube.com/watch?v=tbouGUCUZGo`

## Load Unpacked In Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder.
5. Open a supported YouTube watch page.

## Build A Release ZIP

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-chrome.ps1
```

This creates a Chrome-only package in `dist/`.

## Files

- `manifest.json`: Chrome publishable manifest.
- `content.js`: YouTube player detection and SBS toggle logic.
- `content.css`: Canvas/video visibility overrides and button styling.
- `scripts/build-chrome.ps1`: Deterministic ZIP build for Chrome Web Store uploads.
- `STORE_LISTING.md`: Draft store copy and required metadata.
- `REVIEWER_NOTES.md`: Reviewer-facing explanation of extension behavior.
- `PRIVACY.md`: Privacy policy.
- `SUPPORT.md`: Support and bug-reporting path.

## Limitations

- Works only on YouTube watch pages where the raw uploaded 3D stream is still present in the player DOM.
- Relies on YouTube's current player structure and may need selector updates if YouTube changes the player.
- Does not download, transmit, or convert video data.

## Support

Use the GitHub issue tracker for bug reports and reproducible YouTube URLs:

`https://github.com/Samorodowv/YouTube-raw-SBS-3D-helper/issues`
