# Reviewer Notes

## What The Extension Does

This extension runs only on YouTube pages and changes the local presentation of supported 3D watch pages. It checks the active YouTube player for an underlying HTML5 `<video>` element plus a processed `<canvas>` layer. When both are present, it hides the processed canvas layer and shows the underlying raw video element.

## User Interface

- Adds one small `SBS ON` / `SBS OFF` button to the standard YouTube player controls.
- Stores one local preference in extension storage to remember the toggle state.

## What The Extension Does Not Do

- No remote code
- No analytics
- No network requests
- No scraping beyond the active YouTube player DOM
- No data transmission off-device

## Requested Permission

- `storage`: remember whether the user wants SBS mode enabled by default
