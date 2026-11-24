/* Chatknop voor bartmooi.nl: een kaartje rechtsonder dat de chat opent. */
(function () {
  if (window.__bartChat) return;
  window.__bartChat = true;
  var HOST = "https://offerte.bartmooi.nl";
  var css = document.createElement("style");
  css.textContent =
    "#bm-chat-knop{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:10px;border:0;border-radius:999px;background:#1E5079;color:#fff;cursor:pointer;padding:10px 18px 10px 10px;font:700 15px/1.2 Arial,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.3)}" +
    "#bm-chat-knop .bm-ic{width:38px;height:38px;border-radius:50%;background:#fff;color:#1E5079;display:flex;align-items:center;justify-content:center;flex:none}" +
    "#bm-chat-knop .bm-ic svg{width:20px;height:20px}" +
    "#bm-chat-knop small{display:block;font:600 11px/1.2 Arial,sans-serif;opacity:.85;margin-top:2px}" +
    "#bm-chat-knop .bm-ai{background:#4ade80;color:#0b3d1d;border-radius:6px;font:800 10px/1 Arial,sans-serif;padding:3px 5px;margin-left:6px;vertical-align:middle}" +
    "@keyframes bmpuls{0%{box-shadow:0 0 0 0 rgba(30,80,121,.55),0 6px 22px rgba(0,0,0,.3)}70%{box-shadow:0 0 0 14px rgba(30,80,121,0),0 6px 22px rgba(0,0,0,.3)}100%{box-shadow:0 0 0 0 rgba(30,80,121,0),0 6px 22px rgba(0,0,0,.3)}}#bm-chat-knop.puls{animation:bmpuls 2s infinite}" +
    "#bm-chat-knop.open{padding:0;width:56px;height:56px;justify-content:center;gap:0}" +
    "#bm-chat-knop.open .bm-tekst{display:none}" +
    "#bm-chat-venster{position:fixed;right:20px;bottom:88px;z-index:2147483000;width:340px;height:min(480px,calc(100vh - 120px));border:0;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);background:#fff;display:none;overflow:hidden}" +
    "@media(max-width:600px){#bm-chat-venster{right:12px;left:12px;bottom:12px;width:auto;height:min(540px,78dvh);border-radius:16px}#bm-chat-knop.open{display:none}}";
  document.head.appendChild(css);
  var sterren = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z"/></svg>';
  var kruis = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" style="width:24px;height:24px"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var knop = document.createElement("button");
  knop.id = "bm-chat-knop";
  knop.className = "puls";
  knop.setAttribute("aria-label", "Stel een vraag aan onze AI-assistent");
  function kaart() {
    knop.innerHTML = '<span class="bm-ic">' + sterren + '</span><span class="bm-tekst">Stel een vraag<span class="bm-ai">AI</span><small>Praat met de assistent van BartMooi</small></span>';
  }
  kaart();
  var venster = document.createElement("iframe");
  venster.id = "bm-chat-venster";
  venster.title = "Chat BartMooi";
  venster.allow = "microphone";
  var open = false;
  function wissel() {
    open = !open;
    if (open && !venster.src) venster.src = HOST + "/chat?ingebed=1";
    venster.style.display = open ? "block" : "none";
    knop.className = open ? "open" : "puls";
    if (open) knop.innerHTML = kruis; else kaart();
  }
  knop.onclick = wissel;
  window.addEventListener("message", function (e) {
    if (e.origin === HOST && e.data && e.data.bmChat === "sluit" && open) wissel();
  });
  try { if (!sessionStorage.getItem("bm_chat_gezien") && window.innerWidth > 700) setTimeout(function () { if (!open) { sessionStorage.setItem("bm_chat_gezien", "1"); wissel(); } }, 3500); } catch (e) {}
  document.body.appendChild(venster);
  document.body.appendChild(knop);
})();
