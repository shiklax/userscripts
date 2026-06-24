// ==UserScript==
// @name         Youtube - Videoplayer Gnome-like
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom GNOME-like theme for YouTube player
// @author       shiklax
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        :root {
            /* --- Proggres bar colors --- */
            --progress-main-color: #3584e4;
            --progress-buffer-color: #5c5c5c;
            --progress-bg-color: #242424;
            --scrubber-color: #ff0033;

            /* --- Vertical sizes --- */
            --progress-bar-height: 12px;
            --scrubber-size: 16px;
            --scrubber-margin-top: calc((var(--progress-bar-height) - var(--scrubber-size)) / 2);

            /* --- Lower panel and buttons --- */
            --main-bg-transparency: rgba(0, 0, 0, 0);
            --button-bg-color: rgba(36, 39, 41, 1);
        }

        .ytp-chrome-controls {
            background: var(--main-bg-transparency) !important;
            text-shadow: none !important;
        }

        .ytp-play-button,
        .ytp-volume-area,
        .ytp-time-wrapper,
        .ytp-right-controls {
            background: var(--button-bg-color) !important;
            text-shadow: none !important;
            border-radius: 4px;
        }

        .ytp-progress-bar-container {
            height: var(--progress-bar-height) !important;
        }

        .ytp-progress-bar {
            height: 100% !important;
        }

        .ytp-progress-list {
            background: var(--progress-bg-color) !important;
        }

        .ytp-load-progress,
        .ytp-hover-progress,
        .ytp-load-progress-current {
            background: var(--progress-buffer-color) !important;
        }

        .ytp-play-progress {
            background: var(--progress-main-color) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .ytp-scrubber-button {
            background: var(--scrubber-color) !important;
            border: none !important;
            box-shadow: none !important;
            width: var(--scrubber-size) !important;
            height: var(--scrubber-size) !important;
            border-radius: 4px !important;
            margin-top: var(--scrubber-margin-top) !important;
        }

        .ytp-scrubber-container {
            top: 0px !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
})();
