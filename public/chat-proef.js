/* Proef: één AI-knop in de pagina (klas "bm-ai-knop") die de chat opent. */
(function () {
  var HOST = "https://offerte.bartmooi.nl";
  var css = document.createElement("style");
  css.textContent =
    ".bm-ai-wrap{display:block;margin:8px 0}" +
    ".bm-ai-knop{display:inline-flex;align-items:center;justify-content:center;gap:12px;border:0;border-radius:10px;background:#1E5079;color:#fff;cursor:pointer;padding:15px 44px;min-width:340px;font-family:inherit;line-height:1.2;animation:bmpuls 2s infinite;max-width:100%;box-sizing:border-box;font-size:15px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}" +
    ".bm-ai-knop svg{width:20px!important;height:20px!important;max-width:none!important;flex:none}" +
    ".bm-ai-wrap small{display:block;margin-top:8px;font-size:13px;color:#6b7280;font-family:inherit}" +
    "@keyframes bmpuls{0%{box-shadow:0 0 0 0 rgba(30,80,121,.55),0 6px 22px rgba(30,80,121,.35)}70%{box-shadow:0 0 0 14px rgba(30,80,121,0),0 6px 22px rgba(30,80,121,.35)}100%{box-shadow:0 0 0 0 rgba(30,80,121,0),0 6px 22px rgba(30,80,121,.35)}}" +
    "#bm-chat-venster{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:340px;height:min(520px,calc(100vh - 40px));border:0;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);background:#fff;display:none;overflow:hidden}" +
    "@media(max-width:600px){#bm-chat-venster{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0}.bm-ai-knop{width:100%;min-width:0;padding:16px 18px;font-size:14px;letter-spacing:.12em}}";
  document.head.appendChild(css);
  var venster = document.createElement("iframe");
  venster.id = "bm-chat-venster";
  venster.title = "Chat BartMooi";
  venster.allow = "microphone";
  document.body.appendChild(venster);
  var open = false;
  function wissel() {
    open = !open;
    if (open && !venster.src) venster.src = HOST + "/chat?ingebed=1";
    venster.style.display = open ? "block" : "none";
  }
  document.addEventListener("click", function (e) {
    var k = e.target && e.target.closest && e.target.closest(".bm-ai-knop");
    if (k) { e.preventDefault(); if (!open) wissel(); }
  });
  document.addEventListener("keydown", function (e) {
    var k = e.target && e.target.closest && e.target.closest(".bm-ai-knop");
    if (k && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (!open) wissel(); }
  });
  window.addEventListener("message", function (e) {
    if (e.origin === HOST && e.data && e.data.bmChat === "sluit" && open) wissel();
  });
})();
