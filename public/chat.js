/* Chatknop voor bartmooi.nl: een rond knopje rechtsonder dat de chat opent. */
(function () {
  if (window.__bartChat) return;
  window.__bartChat = true;
  var HOST = "https://offerte.bartmooi.nl";
  try { if (localStorage.getItem("niet_tellen") === "x") return; } catch (e) {}
  var css = document.createElement("style");
  css.textContent =
    "#bm-chat-knop{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:60px;height:60px;border-radius:50%;border:0;background:#1E5079;color:#fff;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center}" +
    "#bm-chat-knop svg{width:28px;height:28px}" +
    "#bm-chat-ballon{position:fixed;right:90px;bottom:30px;z-index:2147483000;background:#fff;color:#13334D;font:600 14px/1.3 Arial,sans-serif;padding:10px 14px;border-radius:14px;box-shadow:0 4px 16px rgba(0,0,0,.18);cursor:pointer;max-width:200px}" +
    "#bm-chat-venster{position:fixed;right:20px;bottom:92px;z-index:2147483000;width:380px;height:min(600px,calc(100vh - 120px));border:0;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);background:#fff;display:none;overflow:hidden}" +
    "@media(max-width:600px){#bm-chat-venster{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0}#bm-chat-ballon{display:none}}";
  document.head.appendChild(css);
  var knop = document.createElement("button");
  knop.id = "bm-chat-knop";
  knop.setAttribute("aria-label", "Chat openen");
  var chatIcoon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var kruis = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  knop.innerHTML = chatIcoon;
  var ballon = document.createElement("div");
  ballon.id = "bm-chat-ballon";
  ballon.textContent = "Vragen over kozijnen of subsidie?";
  var venster = document.createElement("iframe");
  venster.id = "bm-chat-venster";
  venster.title = "Chat BartMooi";
  venster.allow = "microphone";
  var open = false;
  function wissel() {
    open = !open;
    if (open && !venster.src) venster.src = HOST + "/chat?ingebed=1";
    venster.style.display = open ? "block" : "none";
    ballon.style.display = "none";
    knop.innerHTML = open ? kruis : chatIcoon;
  }
  knop.onclick = wissel;
  ballon.onclick = wissel;
  document.body.appendChild(venster);
  document.body.appendChild(ballon);
  document.body.appendChild(knop);
})();
