/* Roos-widget. Plak op de website:
   <script src="https://JOUW-ADRES/widget.js" async></script>
   Eerst een klein kaartje onderaan; na de klik alleen nog de bal rechtsonder. */
(function () {
  if (window.__roosWidget) return;
  // Tijdelijk uit (Tom, 23 nov 2026): alleen op de eigen computer actief.
  if (location.hostname !== "localhost") return;
  window.__roosWidget = true;
  var script = document.currentScript;
  var base = new URL(script.src).origin;
  // De widget komt van de offerte-app zelf; daar gaat het gesprek ook verder.
  var app = base;

  var maat = { w: 360, h: 178 };
  var frame = document.createElement("iframe");
  frame.src = base + "/widget";
  frame.allow = "microphone; autoplay";
  frame.title = "Roos, assistent";
  frame.setAttribute("allowtransparency", "true");

  function pas() {
    var kaart = maat.w > 200;
    var mobiel = window.innerWidth < 520;
    // Op een telefoon: het kaartje als smalle strook onderaan, de bal rechtsonder. Nooit over het hele scherm.
    var w = kaart && mobiel ? window.innerWidth - 16 : maat.w;
    frame.style.cssText =
      "position:fixed;bottom:" + (mobiel ? 8 : 16) + "px;right:" + (mobiel ? 8 : 16) + "px;" +
      "width:" + w + "px;height:" + maat.h + "px;border:0;background:transparent;color-scheme:normal;" +
      "z-index:2147483647;transition:width .25s ease,height .25s ease;";
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== base || !e.data) return;
    if (e.data.soort === "roos-maat") {
      maat = { w: e.data.w, h: e.data.h };
      pas();
    }
    if (e.data.soort === "roos-ga")
      location.href = app + "/?roos=" + encodeURIComponent(String(e.data.samenvatting || "").slice(0, 1500));
  });
  window.addEventListener("resize", pas);

  function zet() {
    pas();
    document.body.appendChild(frame);
  }
  // Even wachten, zodat de bezoeker eerst de pagina ziet.
  setTimeout(function () {
    if (document.body) zet();
    else document.addEventListener("DOMContentLoaded", zet);
  }, 1200);
})();
