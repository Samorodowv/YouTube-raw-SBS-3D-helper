(function () {
  "use strict";

  const DEBUG = false;
  const STATE_KEY = "enabled";
  const PLAYER_SELECTOR = "#movie_player.html5-video-player";
  const BUTTON_ID = "yt-sbs-force-button";
  const observerConfig = { childList: true, subtree: true };

  let desiredEnabled = true;
  let currentVideoId = "";
  let mutationObserver = null;
  let routeObserver = null;
  let refreshTimer = null;

  function log(...args) {
    if (DEBUG) {
      console.log("[yt-sbs-force]", ...args);
    }
  }

  function extApi() {
    if (typeof browser !== "undefined" && browser.storage && browser.runtime) {
      return {
        storage: browser.storage.local,
        runtime: browser.runtime,
        promiseBased: true
      };
    }

    if (typeof chrome !== "undefined" && chrome.storage && chrome.runtime) {
      return {
        storage: chrome.storage.local,
        runtime: chrome.runtime,
        promiseBased: false
      };
    }

    return null;
  }

  function storageGet(key) {
    const api = extApi();
    if (!api) {
      return Promise.resolve(undefined);
    }

    if (api.promiseBased) {
      return api.storage.get(key).then((value) => value[key]);
    }

    return new Promise((resolve) => {
      api.storage.get(key, (value) => {
        const error = api.runtime && api.runtime.lastError;
        if (error) {
          log("storage get failed", error.message);
          resolve(undefined);
          return;
        }

        resolve(value ? value[key] : undefined);
      });
    });
  }

  function storageSet(values) {
    const api = extApi();
    if (!api) {
      return Promise.resolve();
    }

    if (api.promiseBased) {
      return api.storage.set(values);
    }

    return new Promise((resolve) => {
      api.storage.set(values, () => {
        const error = api.runtime && api.runtime.lastError;
        if (error) {
          log("storage set failed", error.message);
        }
        resolve();
      });
    });
  }

  function getPageVideoId() {
    try {
      return new URL(window.location.href).searchParams.get("v") || "";
    } catch (error) {
      log("failed to parse URL", error);
      return "";
    }
  }

  function isWatchPage() {
    return window.location.pathname === "/watch" && Boolean(getPageVideoId());
  }

  function getPlayer() {
    const player = document.querySelector(PLAYER_SELECTOR) || document.getElementById("movie_player");
    if (!player || !(player instanceof HTMLElement)) {
      return null;
    }

    return player;
  }

  function getVideoContainer(player) {
    const container = player.querySelector(".html5-video-container");
    return container instanceof HTMLElement ? container : null;
  }

  function getActiveVideo(player) {
    const candidates = Array.from(player.querySelectorAll("video.video-stream, video.html5-main-video, .html5-video-container video"));
    const playable = candidates.find((video) => {
      if (!(video instanceof HTMLVideoElement)) {
        return false;
      }

      return Boolean(video.currentSrc || video.src || video.videoWidth || video.readyState > 0);
    });

    return playable || candidates.find((video) => video instanceof HTMLVideoElement) || null;
  }

  function getCanvasCandidates(player) {
    return Array.from(player.querySelectorAll(".html5-video-container canvas"));
  }

  function isCandidate3DPlayer(player) {
    const video = getActiveVideo(player);
    const canvases = getCanvasCandidates(player);

    if (!video) {
      return false;
    }

    if (canvases.length === 0) {
      return false;
    }

    const hasVideoDimensions = video.videoWidth > 0 && video.videoHeight > 0;
    const videoRect = video.getBoundingClientRect();
    const hasVideoRect = videoRect.width > 0 && videoRect.height > 0;

    if (!hasVideoDimensions && !hasVideoRect) {
      return false;
    }

    return canvases.some((canvas) => {
      if (!(canvas instanceof HTMLCanvasElement)) {
        return false;
      }

      const rect = canvas.getBoundingClientRect();
      const hasRect = rect.width > 0 && rect.height > 0;
      const hasIntrinsicSize = canvas.width > 0 && canvas.height > 0;
      return hasRect || hasIntrinsicSize;
    });
  }

  function getButtonContainer(player) {
    const containers = [
      ".ytp-right-controls",
      ".ytp-chrome-controls .ytp-right-controls",
      ".ytp-chrome-bottom .ytp-right-controls"
    ];

    for (const selector of containers) {
      const match = player.querySelector(selector);
      if (match instanceof HTMLElement) {
        return match;
      }
    }

    return null;
  }

  function getButton(player) {
    const button = player.querySelector(`#${BUTTON_ID}`);
    return button instanceof HTMLButtonElement ? button : null;
  }

  function buttonLabel(enabled) {
    return enabled ? "SBS ON" : "SBS OFF";
  }

  function updateButton(player, supported, enabled) {
    const button = getButton(player);
    if (!button) {
      return;
    }

    button.textContent = supported ? buttonLabel(enabled) : "SBS N/A";
    button.title = supported
      ? `Raw SBS ${enabled ? "enabled" : "disabled"}`
      : "No raw-video canvas pair detected on this page";
    button.setAttribute("aria-pressed", supported && enabled ? "true" : "false");
    button.disabled = !supported;
    button.classList.toggle("yt-sbs-force-button-active", supported && enabled);
    button.classList.toggle("yt-sbs-force-button-disabled", !supported);
  }

  function injectButton(player) {
    const existing = getButton(player);
    if (existing) {
      return existing;
    }

    const container = getButtonContainer(player);
    if (!container) {
      return null;
    }

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.className = "ytp-button yt-sbs-force-button";
    button.type = "button";
    button.textContent = buttonLabel(desiredEnabled);
    button.title = "Toggle raw SBS mode";
    button.setAttribute("aria-label", "Toggle raw SBS mode");
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      desiredEnabled = !desiredEnabled;
      await storageSet({ [STATE_KEY]: desiredEnabled });
      applyState(player);
    });

    container.prepend(button);
    return button;
  }

  function applyPlayerClass(player, supported) {
    const shouldEnable = supported && desiredEnabled;
    player.classList.toggle("yt-sbs-force-enabled", shouldEnable);
    player.dataset.ytSbsForceSupported = supported ? "true" : "false";
    player.dataset.ytSbsForceEnabled = shouldEnable ? "true" : "false";
  }

  function applyState(player) {
    const supported = isWatchPage() && isCandidate3DPlayer(player);
    injectButton(player);
    applyPlayerClass(player, supported);
    updateButton(player, supported, desiredEnabled);
    log("apply state", {
      supported,
      enabled: desiredEnabled,
      videoId: getPageVideoId(),
      canvasCount: getCanvasCandidates(player).length
    });
  }

  function refresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      const player = getPlayer();
      if (!player) {
        return;
      }

      applyState(player);
    }, 50);
  }

  function startMutationObserver() {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }

    mutationObserver = new MutationObserver(() => {
      refresh();
    });

    mutationObserver.observe(document.documentElement, observerConfig);
  }

  function startRouteObserver() {
    if (routeObserver) {
      routeObserver.disconnect();
    }

    routeObserver = new MutationObserver(() => {
      const nextVideoId = getPageVideoId();
      if (nextVideoId !== currentVideoId) {
        currentVideoId = nextVideoId;
        log("route change detected", currentVideoId);
        refresh();
      }
    });

    routeObserver.observe(document.body, { childList: true, subtree: true });

    const events = ["yt-navigate-finish", "yt-page-data-updated", "spfdone"];
    for (const name of events) {
      window.addEventListener(name, refresh, true);
    }

    document.addEventListener("fullscreenchange", refresh, true);
    window.addEventListener("resize", refresh, { passive: true });
  }

  async function init() {
    desiredEnabled = (await storageGet(STATE_KEY)) ?? true;
    currentVideoId = getPageVideoId();

    refresh();
    startMutationObserver();
    startRouteObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
