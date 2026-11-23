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
    "#bm-chat-ballon{position:fixed;right:90px;bottom:24px;z-index:2147483000;background:#fff;color:#13334D;font:600 15px/1.35 Arial,sans-serif;padding:14px 16px;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.22);cursor:pointer;max-width:250px;display:flex;gap:10px;align-items:flex-start}" +
    "#bm-chat-ballon b{display:block;font-size:13px;color:#1E5079;margin-bottom:2px}" +
    "@keyframes bmpuls{0%{box-shadow:0 0 0 0 rgba(30,80,121,.55)}70%{box-shadow:0 0 0 16px rgba(30,80,121,0)}100%{box-shadow:0 0 0 0 rgba(30,80,121,0)}}#bm-chat-knop.puls{animation:bmpuls 1.8s infinite}" +
    "#bm-chat-venster{position:fixed;right:20px;bottom:92px;z-index:2147483000;width:340px;height:min(480px,calc(100vh - 120px));border:0;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);background:#fff;display:none;overflow:hidden}" +
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
  ballon.innerHTML = "<span><b>De slimme assistent van BartMooi</b>Vraag me naar prijzen, glas of subsidie. Ik help u ook met de aanvraag.</span>";
  knop.className = "puls";
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
    knop.className = open ? "" : "puls";
  }
  knop.onclick = wissel;
  ballon.onclick = wissel;
  try { if (!sessionStorage.getItem("bm_chat_gezien") && window.innerWidth > 700) setTimeout(function () { if (!open) { sessionStorage.setItem("bm_chat_gezien", "1"); wissel(); } }, 3500); } catch (e) {}
  document.body.appendChild(venster);
  document.body.appendChild(ballon);
  document.body.appendChild(knop);
})();
