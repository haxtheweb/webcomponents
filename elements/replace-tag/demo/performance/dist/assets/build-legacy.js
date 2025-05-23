var defs,
  ancient = !1,
  cdn = "./";
globalThis.WCGlobalCDNPath && (cdn = globalThis.WCGlobalCDNPath),
  globalThis.__appCDN && (cdn = globalThis.__appCDN);
try {
  "undefined" == typeof Symbol && (ancient = !0), new Function("let a;");
} catch (e) {
  ancient = !0;
}
(globalThis.__appForceUpgrade || globalThis.WCForceUpgrade) && ancient
  ? (globalThis.location = "assets/upgrade-browser.html")
  : (!(function () {
      function e(e, n, t) {
        var o = e;
        if (
          ((o.state = n), (o.stateData = t), 0 < o.onNextStateChange.length)
        ) {
          var i = o.onNextStateChange.slice();
          o.onNextStateChange.length = 0;
          for (var r = 0, a = i; r < a.length; r++) (0, a[r])();
        }
        return o;
      }
      function n(n) {
        function o() {
          try {
            document.head.removeChild(a);
          } catch (e) {}
        }
        var i = e(n, "Loading", void 0),
          a = document.createElement("script");
        return (
          (a.src = n.url),
          null !== n.crossorigin &&
            a.setAttribute("crossorigin", n.crossorigin),
          (a.onload = function () {
            var e, n, r;
            void 0 === f
              ? ((n = []), (r = void 0))
              : ((n = (e = f())[0]), (r = e[1])),
              t(i, n, r),
              o();
          }),
          (a.onerror = function () {
            r(n, new TypeError("Failed to fetch " + n.url)), o();
          }),
          document.head.appendChild(a),
          i
        );
      }
      function t(n, t, i) {
        var r = o(n, t);
        return e(n, "WaitingForTurn", {
          args: r[0],
          deps: r[1],
          moduleBody: i,
        });
      }
      function o(e, t) {
        for (var i, r = [], d = [], c = 0, l = t; c < l.length; c++)
          if ("exports" !== (i = l[c]))
            if ("require" !== i)
              if ("meta" !== i) {
                var f = s(u(e.urlBase, i), e.crossorigin);
                r.push(f.exports), d.push(f), "Initialized" === f.state && n(f);
              } else
                r.push({
                  url:
                    !0 === e.isTopLevel
                      ? e.url.substring(0, e.url.lastIndexOf("#"))
                      : e.url,
                });
            else
              r.push(function (n, t, i) {
                var r = o(e, n),
                  s = r[0];
                a(
                  r[1],
                  function () {
                    t && t.apply(null, s);
                  },
                  i,
                );
              });
          else r.push(e.exports);
        return [r, d];
      }
      function i(n) {
        var t = e(n, "WaitingOnDeps", n.stateData);
        return (
          a(
            n.stateData.deps,
            function () {
              return (function (n) {
                var t = n.stateData;
                if (null != t.moduleBody)
                  try {
                    t.moduleBody.apply(null, t.args);
                  } catch (e) {
                    return r(n, e);
                  }
                return e(n, "Executed", void 0);
              })(t);
            },
            function (e) {
              return r(t, e);
            },
          ),
          t
        );
      }
      function r(n, t) {
        return (
          !0 === n.isTopLevel &&
            setTimeout(function () {
              throw t;
            }),
          e(n, "Failed", t)
        );
      }
      function a(e, n, t) {
        var o = e.shift();
        return void 0 === o
          ? void (n && n())
          : "WaitingOnDeps" === o.state
            ? void a(e, n, t)
            : void (function e(n, t, o) {
                switch (n.state) {
                  case "WaitingForTurn":
                    return i(n), void e(n, t, o);
                  case "Failed":
                    return void (o && o(n.stateData));
                  case "Executed":
                    return void t();
                  case "Loading":
                  case "WaitingOnDeps":
                    return void n.onNextStateChange.push(function () {
                      return e(n, t, o);
                    });
                  case "Initialized":
                    throw new Error(
                      "All dependencies should be loading already before pressureDependencyToExecute is called.",
                    );
                  default:
                    throw new Error("Impossible module state: " + n.state);
                }
              })(
                o,
                function () {
                  a(e, n, t);
                },
                t,
              );
      }
      function s(e, n) {
        void 0 === n && (n = "anonymous");
        var t = l[e];
        return (
          void 0 === t &&
            (t = l[e] =
              {
                url: e,
                urlBase: d(e),
                exports: Object.create(null),
                state: "Initialized",
                stateData: void 0,
                isTopLevel: !1,
                crossorigin: n,
                onNextStateChange: [],
              }),
          t
        );
      }
      function d(e) {
        return (e = (e = e.split("?")[0]).split("#")[0]).substring(
          0,
          e.lastIndexOf("/") + 1,
        );
      }
      function u(e, n) {
        return -1 === n.indexOf("://")
          ? (function (e) {
              return (v.href = e), v.href;
            })("/" === n[0] ? n : e + n)
          : n;
      }
      function c() {
        return (
          document.baseURI ||
          (document.querySelector("base") || globalThis.location).href
        );
      }
      if (!globalThis.define) {
        var l = Object.create(null),
          f = void 0,
          p = 0,
          m = void 0,
          w = c();
        (globalThis.define = function (e, n) {
          var o = !1;
          f = function () {
            return (o = !0), (f = void 0), [e, n];
          };
          var r = (function () {
              var e = document.currentScript;
              if (!e) return w;
              if (globalThis.HTMLImports) {
                var n = globalThis.HTMLImports.importForElement(e);
                return n ? n.href : w;
              }
              var t = e.ownerDocument.createElement("a");
              return (t.href = ""), t.href;
            })(),
            a =
              (document.currentScript &&
                document.currentScript.getAttribute("crossorigin")) ||
              "anonymous";
          setTimeout(function () {
            if (0 == o) {
              f = void 0;
              var d = r + "#" + p++,
                u = s(d, a);
              u.isTopLevel = !0;
              var c = t(u, e, n);
              void 0 === m
                ? i(c)
                : (function e(n, t) {
                    switch (n.state) {
                      case "Executed":
                      case "Failed":
                        return void t();
                      default:
                        n.onNextStateChange.push(function () {
                          return e(n, t);
                        });
                    }
                  })(s(m), function () {
                    i(c);
                  }),
                (m = d);
            }
          }, 0);
        }),
          (globalThis.define._reset = function () {
            for (var e in l) delete l[e];
            (f = void 0), (p = 0), (m = void 0), (w = c());
          });
        var v = document.createElement("a");
      }
    })(),
    (defs = globalThis.customElements
      ? [
          cdn + "assets/babel-top.js",
          cdn +
            "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
          cdn +
            "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js",
        ]
      : [
          cdn + "assets/babel-top.js",
          cdn +
            "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
          cdn +
            "build/es6/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",
          cdn +
            "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
        ]),
    (globalThis.WCAutoloadPolyfillEntryPoint =
      cdn + "build/es5-amd/node_modules/@haxtheweb/wc-autoload/wc-autoload.js"),
    define(defs, function () {
      "use strict";
      define([
        cdn +
          "build/es5-amd/node_modules/@haxtheweb/deduping-fix/deduping-fix.js",
        globalThis.WCAutoloadPolyfillEntryPoint,
      ], function () {
        globalThis.WCAutoload.process();
      });
    }));
