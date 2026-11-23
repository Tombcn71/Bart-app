/* Telt bezoekers op bartmooi.nl en klikken naar de offerte-site. Zonder cookies, zonder persoonsgegevens. */
(function () {
  var HOST = "https://offerte.bartmooi.nl";
  try {
    if (/[?&]niet-tellen=1/.test(location.search)) localStorage.setItem("niet_tellen", "1");
    if (/[?&]wel-tellen=1/.test(location.search)) localStorage.removeItem("niet_tellen");
    if (localStorage.getItem("niet_tellen")) return;
  } catch (e) {}
  function refHost() { try { return document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) { return ""; } }
  function stuur(soort, pad) {
    try {
      var d = JSON.stringify({ soort: soort, pad: pad || location.pathname, ref: soort === "wp_bezoek" ? refHost() : "" });
      if (navigator.sendBeacon) navigator.sendBeacon(HOST + "/api/tel", new Blob([d], { type: "text/plain" }));
      else fetch(HOST + "/api/tel", { method: "POST", body: d, keepalive: true });
    } catch (e) {}
  }
  stuur("wp_bezoek");
  function bewerk() {
    var a = document.querySelectorAll('a[href*="offerte.bartmooi.nl"]');
    for (var i = 0; i < a.length; i++) {
      if (a[i].href.indexOf("van=wordpress") < 0) a[i].href += (a[i].href.indexOf("?") < 0 ? "?" : "&") + "van=wordpress";
    }
  }
  bewerk();
  setTimeout(bewerk, 2000);
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a");
    if (a && a.href && a.href.indexOf("offerte.bartmooi.nl") > -1) stuur("wp_klik");
  }, true);
})();
