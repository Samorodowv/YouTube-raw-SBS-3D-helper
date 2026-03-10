# Support

## Bug Reports

Open an issue here:

`https://github.com/Samorodowv/YouTube-raw-SBS-3D-helper/issues`

Include:

- The full YouTube URL
- Whether the video is expected to be SBS or top-bottom
- Chrome version
- Whether the issue happens on reload or after in-site navigation
- A console screenshot if there is an error

## Known Failure Modes

- YouTube changed player selectors or control markup.
- The current page does not expose a raw video plus processed canvas pair.
- Another extension modifies the YouTube player UI or DOM.

## Scope

This extension only changes YouTube player presentation locally in the browser. It does not fix missing 3D metadata in YouTube uploads and does not alter the video stream on the server.
