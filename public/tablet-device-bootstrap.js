(function () {
  var K = "tabletDeviceToken";
  var L = "tabletLastLaunchUrl";
  var MIN = 8;
  function ok(t) {
    return t && String(t).trim().length >= MIN;
  }
  function cookieTok() {
    try {
      var m = document.cookie.match(/(?:^|; )tabletDeviceToken=([^;]*)/);
      return m ? decodeURIComponent(m[1].trim()) : null;
    } catch (e) {
      return null;
    }
  }
  function setTok(t) {
    t = String(t).trim();
    if (!ok(t)) return;
    try {
      localStorage.setItem(K, t);
      localStorage.setItem(L, location.origin + "/tablet?token=" + encodeURIComponent(t));
    } catch (e) {}
    try {
      document.cookie =
        K +
        "=" +
        encodeURIComponent(t) +
        ";path=/;max-age=31536000;SameSite=Lax";
    } catch (e) {}
  }
  try {
    var sp = new URLSearchParams(location.search);
    if (sp.get("choose") === "1") return;
    var q = sp.get("token");
    if (ok(q)) {
      setTok(q);
      return;
    }
    var raw = location.pathname || "";
    var path = raw.replace(/\/+$/, "") || "/";
    var cap = typeof window.Capacitor !== "undefined" && window.Capacitor !== null;
    var tabletPath =
      path === "/tablet" ||
      path === "/tablet/connect" ||
      /^\/tablet\/\d+$/.test(path);
    var homePath = path === "/" || path === "";
    var shouldRestore = (tabletPath || (cap && homePath)) && !ok(sp.get("token"));
    if (!shouldRestore) return;
    var s = null;
    try {
      s = localStorage.getItem(K);
    } catch (e) {}
    if (!ok(s)) s = cookieTok();
    if (ok(s)) {
      location.replace(
        location.origin + "/tablet?token=" + encodeURIComponent(String(s).trim())
      );
    }
  } catch (e) {}
})();
