const e = globalThis.customElements.define;
globalThis.customElements.define = (t, s, o) => {
  globalThis.customElements.get(t)
    ? console.warn(t + " has been defined twice")
    : e.call(globalThis.customElements, t, s, o);
};
var t = document.currentScript || document.getElementsByTagName("script")[0];
if (/^h/.test(document.location))
  if ("noModule" in HTMLScriptElement.prototype) {
    if (!globalThis.__appCustomEnv) {
      var s = document.createElement("script");
      (s.src = "./custom/build/custom.es6.js"),
        (s.type = "module"),
        t.parentNode.insertBefore(s, t);
    }
  } else
    console.error(
      "ES modules not supported by this browser. HAXcms requires a modern browser.",
    );
else console.error("HAXcms requires a web server.");
var o = "./";
globalThis.__appCDN && (o = globalThis.__appCDN);
var r = "build/es6/node_modules/@haxtheweb/haxcms-elements/lib/base.css",
  l = document.createElement("link");
(l.rel = "stylesheet"),
  (l.href = o + r),
  (l.type = "text/css"),
  (l.onerror = (e) => {
    !(function haxcmsFallbackStylesError(e) {
      var t = c;
      if (!globalThis.__appCDNBlockFallback) {
        var s = document.createElement("link");
        (s.rel = "stylesheet"),
          (s.type = "text/css"),
          (s.onerror = (e) => {
            haxcmsFallbackStylesError(e);
          }),
          "./" === t
            ? ((c = "https://cdn.hax.cloud/cdn/"),
              (s.href = c + r),
              n.parentNode.insertBefore(s, n),
              console.warn(
                t + " failed to respond, styles back to alternative: " + c,
              ))
            : "https://cdn.hax.cloud/cdn/" === t
              ? ((c = "https://cdn.webcomponents.psu.edu/cdn/"),
                (s.href = c + r),
                n.parentNode.insertBefore(s, n),
                console.warn(
                  t + " failed to respond, styles back to alternative: " + c,
                ))
              : ((c = "./"),
                console.error(
                  "Styles Local delivery failed and all alternative CDNs failed to load. You might be offline, in a secure environment or doing testing intentionally to generate this *shrug*",
                ));
      }
    })();
  });
var n = document.getElementsByTagName("link")[0];
if ((n.parentNode.insertBefore(l, n), !globalThis.__appCustomEnv)) {
  var a = document.createElement("link");
  (a.rel = "stylesheet"),
    (a.href = "./theme/theme.css"),
    (a.type = "text/css"),
    n.parentNode.insertBefore(a, n);
}
var c = o;
