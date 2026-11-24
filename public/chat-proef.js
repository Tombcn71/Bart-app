/* Proef: één AI-knop in de pagina (klas "bm-ai-knop") die de chat opent. */
(function () {
  var HOST = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? location.origin : "https://offerte.bartmooi.nl";
  var css = document.createElement("style");
  css.textContent =
    ".bm-ai-wrap{display:block;margin:8px 0}" +
    ".bm-ai-knop{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:flex-start;gap:16px;border:0;border-radius:10px;background:#1E5079;color:#fff;cursor:pointer;padding:12px 36px 12px 14px;min-width:420px;font-family:inherit;line-height:1.2;animation:bmpuls 2s infinite;max-width:100%;box-sizing:border-box}" +
    ".bm-ai-knop::after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-20deg);animation:bmglans 3.2s ease-in-out infinite}" +
    "@keyframes bmglans{0%{left:-60%}55%,100%{left:140%}}" +
    ".bm-ai-knop .bm-ic{position:relative;z-index:1;width:42px;height:42px;border-radius:50%;background:#fff;color:#1E5079;display:flex;align-items:center;justify-content:center;flex:none}" +
    ".bm-ai-knop .bm-ic svg{width:24px!important;height:24px!important;max-width:none!important}" +
    ".bm-ai-knop .bm-tx{position:relative;z-index:1;display:block;text-align:left}" +
    ".bm-ai-knop b{display:block;font-size:16px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;font-family:inherit}" +
    ".bm-ai-knop small{display:block;font-size:13px;opacity:.92;margin-top:4px;letter-spacing:.02em;text-transform:none;font-weight:400;font-family:inherit}" +
    "@keyframes bmpuls{0%{box-shadow:0 0 0 0 rgba(30,80,121,.55),0 6px 22px rgba(30,80,121,.35)}70%{box-shadow:0 0 0 14px rgba(30,80,121,0),0 6px 22px rgba(30,80,121,.35)}100%{box-shadow:0 0 0 0 rgba(30,80,121,0),0 6px 22px rgba(30,80,121,.35)}}" +
    "#bm-chat-venster{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:340px;height:min(520px,calc(100vh - 40px));border:0;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);background:#fff;display:none;overflow:hidden}" +
    "@media(max-width:600px){#bm-chat-venster{right:10px;left:10px;top:70px;bottom:10px;width:calc(100% - 20px);height:calc(100% - 80px);max-height:none;border-radius:16px}.bm-ai-knop{width:auto;min-width:0;max-width:100%;padding:10px 24px 10px 10px;gap:12px}.bm-ai-knop .bm-ic{width:38px;height:38px}.bm-ai-knop b{font-size:14px}.bm-ai-knop small{font-size:12px}.bm-ai-knop b{letter-spacing:.1em}}";
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
