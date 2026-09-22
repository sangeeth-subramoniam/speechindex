/* Speech Cards — all the behaviour. Plain script, no build step, no dependencies. */
(function () {
  "use strict";

  var data = window.CARDS;
  if (!data || !data.pages) { return; }

  var pagesEl   = document.getElementById("pages");
  var dotsEl    = document.getElementById("dots");
  var overlay   = document.getElementById("overlay");
  var bigCard   = document.getElementById("big-card");
  var bigIcon   = document.getElementById("big-icon");
  var bigEn     = document.getElementById("big-en");
  var bigTa     = document.getElementById("big-ta");
  var btnClose  = document.getElementById("btn-close");
  var btnYes    = document.getElementById("btn-yes");
  var btnNo     = document.getElementById("btn-no");

  /* ---------- speech ---------- */

  var voices = [];

  function loadVoices() {
    try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
  }

  function pickVoice() {
    var prefs = ["en-in", "en-gb", "en-us"], i, j;
    for (i = 0; i < prefs.length; i++) {
      for (j = 0; j < voices.length; j++) {
        if ((voices[j].lang || "").toLowerCase().replace("_", "-") === prefs[i]) { return voices[j]; }
      }
    }
    for (j = 0; j < voices.length; j++) {
      if ((voices[j].lang || "").toLowerCase().indexOf("en") === 0) { return voices[j]; }
    }
    return null;
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !text) { return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.lang = "en-IN";
      var v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      window.speechSynthesis.speak(u);
    } catch (e) { /* speech is a bonus; the big card is the point */ }
  }

  function stopSpeech() {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  function buzz() {
    try { if (navigator.vibrate) { navigator.vibrate(30); } } catch (e) {}
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.addEventListener
      ? window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
      : (window.speechSynthesis.onvoiceschanged = loadVoices);
  }

  /* ---------- build the pages ---------- */

  function makeCard(card, category) {
    var el = document.createElement("button");
    el.type = "button";
    el.className = "card";
    el.setAttribute("data-category", category);

    var icon = document.createElement("span");
    icon.className = "card-icon";
    icon.textContent = card.icon || "";

    var en = document.createElement("span");
    en.className = "card-en";
    en.textContent = card.en || "";

    var ta = document.createElement("span");
    ta.className = "card-ta";
    ta.textContent = card.ta || "";

    el.appendChild(icon);
    el.appendChild(en);
    el.appendChild(ta);
    el._card = card;
    el._category = category;
    return el;
  }

  data.pages.forEach(function (page, i) {
    var count = page.cards ? page.cards.length : 0;
    if (count < 1 || count > 4) {
      console.warn("Page " + (i + 1) + " (" + page.category + ") has " + count +
                   " cards; a page holds 1 to 4.");
    }
    var pageEl = document.createElement("section");
    pageEl.className = "page";
    pageEl.setAttribute("data-count", String(Math.min(Math.max(count, 1), 4)));
    (page.cards || []).forEach(function (card) {
      pageEl.appendChild(makeCard(card, page.category));
    });
    pagesEl.appendChild(pageEl);

    var dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " on" : "");
    dotsEl.appendChild(dot);
  });

  var dots = dotsEl.querySelectorAll(".dot");

  /* ---------- dots follow the scroll ---------- */

  var current = 0;
  var settlingUntil = 0;

  function syncDots() {
    var w = pagesEl.clientWidth || 1;
    var i = Math.round(pagesEl.scrollLeft / w);
    if (i !== current && dots[i]) {
      if (dots[current]) { dots[current].classList.remove("on"); }
      dots[i].classList.add("on");
      current = i;
    }
  }

  pagesEl.addEventListener("scroll", function () {
    settlingUntil = Date.now() + 180;   // a tap during a scroll is not a tap
    syncDots();
  }, { passive: true });

  /* ---------- tap a card (but never mistake a swipe for a tap) ---------- */

  var downX = 0, downY = 0, moved = false;

  pagesEl.addEventListener("pointerdown", function (e) {
    downX = e.clientX; downY = e.clientY; moved = false;
  }, { passive: true });

  pagesEl.addEventListener("pointermove", function (e) {
    if (Math.abs(e.clientX - downX) > 10 || Math.abs(e.clientY - downY) > 10) { moved = true; }
  }, { passive: true });

  pagesEl.addEventListener("click", function (e) {
    if (moved || Date.now() < settlingUntil) { return; }
    var el = e.target.closest ? e.target.closest(".card") : null;
    if (el) { openCard(el._card, el._category); }
  });

  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  /* ---------- the enlarged card ---------- */

  var isOpen = false;
  var openWord = "";

  function openCard(card, category) {
    openWord = card.speak || card.en;
    overlay.setAttribute("data-category", category);
    bigIcon.textContent = card.icon || "";
    bigEn.textContent = card.en || "";
    bigTa.textContent = card.ta || "";
    overlay.hidden = false;
    isOpen = true;
    try { history.pushState({ overlay: true }, ""); } catch (e) {}
    buzz();
    speak(openWord);
  }

  function closeCard(fromBackButton) {
    if (!isOpen) { return; }
    isOpen = false;
    overlay.hidden = true;
    stopSpeech();
    if (!fromBackButton) { try { history.back(); } catch (e) {} }
  }

  bigCard.addEventListener("click", function () { buzz(); speak(openWord); });
  btnClose.addEventListener("click", function () { closeCard(false); });
  window.addEventListener("popstate", function () { closeCard(true); });

  /* ---------- Yes / No ---------- */

  function wireYesNo(btn, word) {
    btn.addEventListener("click", function () {
      buzz();
      speak(word);
      btn.classList.add("flash");
      setTimeout(function () { btn.classList.remove("flash"); }, 220);
    });
  }

  if (data.yesNo) {
    wireYesNo(btnYes, (data.yesNo.yes && data.yesNo.yes.en) || "Yes");
    wireYesNo(btnNo, (data.yesNo.no && data.yesNo.no.en) || "No");
  }

  /* ---------- offline ---------- */

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
}());
