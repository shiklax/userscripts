// ==UserScript==
// @name         LeetCode to Anki
// @namespace    http://tampermonkey.net/
// @version      2026.06.15
// @description  Dodaje przycisk do Anki z precyzyjnym tytułem i kompletem tagów
// @author       You
// @match        https://leetcode.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    // GŁÓWNA FUNKCJA WYSYŁAJĄCA
    function sendToAnki(title, difficulty, url, tags, ytLink) {
        const payload = {
            "action": "addNote",
            "version": 6,
            "params": {
                "note": {
                    "deckName": "Leetcode", // 👈 ZMIEŃ NA NAZWĘ SWOJEJ TALII, JEŚLI JEST INNA
                    "modelName": "Leetcode", // 👈 ZMIEŃ NA NAZWĘ SWOJEGO TYPU NOTATKI
                    "fields": {
                        "Title": title,
                        "LeetCode-Link": url,
                        "Difficulty": difficulty,
                        "Explanation-Link": ytLink,
                        "Complexity": ""
                    },
                    "tags": tags
                }
            }
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:8765",
            data: JSON.stringify(payload),
            onload: function(response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.error) {
                        alert("Anki-Connect Error: " + res.error);
                    } else {
                        alert("🚀 Fiszka dodana pomyślnie!");
                    }
                } catch(e) {
                    alert("Błąd przetwarzania odpowiedzi z Anki.");
                }
            },
            onerror: function() {
                alert("Nie można połączyć się z Anki. Czy program jest uruchomiony w tle?");
            }
        });
    }

    // TWORZENIE I WSTRZYKIWANIE PRZYCISKU
    function injectButton() {
        if (!window.location.pathname.startsWith('/problems/')) return;
        if (document.getElementById('anki-btn')) return;

        // Szukamy kontenera z poziomem trudności
        const targetContainer = document.querySelector('div[class*="text-difficulty-"]')?.parentElement;
        if (!targetContainer) return;

        const btn = document.createElement('button');
        btn.id = 'anki-btn';

        // Klasy z LeetCode, aby przycisk wyglądał natywnie
        btn.className = 'relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary cursor-pointer transition-colors hover:bg-fill-primary text-sd-secondary-foreground hover:opacity-80';
        btn.style.cssText = 'border: 1px solid #2cbb5d66; font-family: inherit; font-size: 12px; margin-left: 4px; display: inline-flex !important; cursor: pointer;';

        btn.innerHTML = `
            <span style="color: #2cbb5d; font-weight: bold; margin-right: 2px;">★</span>
            <span style="color: #f4ecd8;">Anki</span>
        `;

        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            // 1. Pobieranie precyzyjnego tytułu z numerem (np. "1. Two Sum")
            const titleElem = document.querySelector('a[href^="/problems/"][class*="cursor-text"]');
            let title = titleElem ? titleElem.innerText.trim() : "";
            if (!title) {
                const backupTitle = document.querySelector('span.text-title-large, div[data-cy="question-title"]');
                title = backupTitle ? backupTitle.innerText.trim() : document.title.split('-')[0].trim();
            }

            // 2. Trudność zadania
            const diffElem = document.querySelector('div[class*="text-difficulty-"]');
            const difficulty = diffElem ? diffElem.innerText.trim() : "Medium";

            // 3. Link URL
            const url = window.location.href.split('?')[0];

            // 4. Pobieranie tagów ze wszystkich kontenerów (w tym nowego bloku z linkami /tag/)
            let tagsSet = new Set(['leetcode']); // używamy Set, żeby tagi się nie dublowały

            // Łapiemy linki do tagów (np. Array, Hash Table)
            const tagLinks = document.querySelectorAll('a[href^="/tag/"]');
            tagLinks.forEach(el => {
                const tagName = el.innerText.trim().toLowerCase().replace(/\s+/g, '-');
                if (tagName) tagsSet.add(tagName);
            });

            // Łapiemy zwykłe divy pełniące rolę badge-ów (np. "Junior") wewnątrz kontenera tematów
            const topicContainer = document.querySelector('.mt-2.flex.flex-wrap.gap-1.pl-7');
            if (topicContainer) {
                const innerBadges = topicContainer.querySelectorAll('div');
                innerBadges.forEach(el => {
                    const badgeName = el.innerText.trim().toLowerCase().replace(/\s+/g, '-');
                    if (badgeName && badgeName !== "") tagsSet.add(badgeName);
                });
            }

            // Konwersja unikalnych tagów na tablicę dla Anki
            const tags = Array.from(tagsSet);

            // 5. Pobieranie linku YT z dodatku LeetCode Night
            let ytLink = "";
            const ytElem = document.querySelector('a[data-leetcode_night_insert_youtube_link]');
            if (ytElem) {
                ytLink = ytElem.href;
            }

            // Wysłanie wszystkiego do Anki
            sendToAnki(title, difficulty, url, tags, ytLink);
        };

        targetContainer.appendChild(btn);
    }

    // OBSERWATOR SPA Z DEBOUNCINGIEM
    let timeoutId = null;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            injectButton();
        }, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Start na wypadek bezpośredniego wejścia
    setTimeout(injectButton, 1000);
})();