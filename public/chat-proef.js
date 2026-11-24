/* Proef: één AI-knop in de pagina (klas "bm-ai-knop") die de chat opent. */
(function () {
  var HOST = "https://offerte.bartmooi.nl";
  var css = document.createElement("style");
  css.textContent =
    ".bm-ai-knop{display:inline-flex;align-items:center;gap:14px;border:0;border-radius:0;background:#1E5079;color:#fff;cursor:pointer;padding:9px 28px 9px 12px;font-family:inherit;text-align:left;line-height:1.2;margin:8px 0;animation:bmpuls 2s infinite;max-width:100%;box-sizing:border-box}" +
    ".bm-ai-knop span{display:block}" +
    ".bm-ai-knop .bm-ic{width:34px;height:34px;border-radius:50%;background:#fff;color:#1E5079;display:flex;align-items:center;justify-content:center;flex:none}" +
    ".bm-ai-knop .bm-ic svg{width:19px!important;height:19px!important;max-width:none!important}" +
    ".bm-ai-knop b{display:block;font-size:14px;line-height:1.2;letter-spacing:.16em;text-transform:uppercase;font-weight:700;font-family:inherit}" +
    ".bm-ai-knop small{display:block;font-size:12px;opacity:.85;margin-top:3px;letter-spacing:normal;text-transform:none;font-weight:400;font-family:inherit}" +
    "@keyframes bmpuls{0%{box-shadow:0 0 0 0 rgba(30,80,121,.55),0 6px 22px rgba(30,80,121,.35)}70%{box-shadow:0 0 0 14px rgba(30,80,121,0),0 6px 22px rgba(30,80,121,.35)}100%{box-shadow:0 0 0 0 rgba(30,80,121,0),0 6px 22px rgba(30,80,121,.35)}}" +
    "#bm-chat-venster{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:340px;height:min(520px,calc(100vh - 40px));border:0;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);background:#fff;display:none;overflow:hidden}" +
    "@media(max-width:600px){#bm-chat-venster{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0}.bm-ai-knop{width:100%}}";
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
