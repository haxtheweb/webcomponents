var defs,
  ancient = !1,
  cdn = "./";
window.WCGlobalCDNPath && (cdn = window.WCGlobalCDNPath),
  window.__appCDN && (cdn = window.__appCDN);
try {
  "undefined" == typeof Symbol && (ancient = !0), new Function("let a;");
} catch (err) {
  ancient = !0;
}
(window.__appForceUpgrade || window.WCForceUpgrade) && ancient
  ? (window.location = "assets/upgrade-browser.html")
  : (!(function () {
      function a(a, b, c) {
        var d = a;
        if (
          ((d.state = b), (d.stateData = c), 0 < d.onNextStateChange.length)
        ) {
          var e = d.onNextStateChange.slice();
          d.onNextStateChange.length = 0;
          for (var g = 0, h = e; g < h.length; g++) (0, h[g])();
        }
        return d;
      }
      function b(b) {
        function d() {
          try {
            document.head.removeChild(f);
          } catch (a) {}
        }
        var e = a(b, "Loading", void 0),
          f = document.createElement("script");
        return (
          (f.src = b.url),
          null !== b.crossorigin &&
            f.setAttribute("crossorigin", b.crossorigin),
          (f.onload = function () {
            var a, b, f;
            void 0 === r
              ? ((b = []), (f = void 0))
              : ((b = (a = r())[0]), (f = a[1])),
              c(e, b, f),
              d();
          }),
          (f.onerror = function () {
            g(b, new TypeError("Failed to fetch " + b.url)), d();
          }),
          document.head.appendChild(f),
          e
        );
      }
      function c(b, c, e) {
        var f = d(b, c);
        return a(b, "WaitingForTurn", {
          args: f[0],
          deps: f[1],
          moduleBody: e,
        });
      }
      function d(a, c) {
        for (var e, f = [], g = [], i = 0, j = c; i < j.length; i++)
          if ("exports" !== (e = j[i]))
            if ("require" !== e)
              if ("meta" !== e) {
                var l = k(n(a.urlBase, e), a.crossorigin);
                f.push(l.exports), g.push(l), "Initialized" === l.state && b(l);
              } else
                f.push({
                  url:
                    !0 === a.isTopLevel
                      ? a.url.substring(0, a.url.lastIndexOf("#"))
                      : a.url,
                });
            else
              f.push(function (b, c, e) {
                var f = d(a, b),
                  g = f[0];
                h(
                  f[1],
                  function () {
                    c && c.apply(null, g);
                  },
                  e,
                );
              });
          else f.push(a.exports);
        return [f, g];
      }
      function e(b) {
        var c = a(b, "WaitingOnDeps", b.stateData);
        return (
          h(
            b.stateData.deps,
            function () {
              return (function f(b) {
                var c = b.stateData;
                if (null != c.moduleBody)
                  try {
                    c.moduleBody.apply(null, c.args);
                  } catch (a) {
                    return g(b, a);
                  }
                return a(b, "Executed", void 0);
              })(c);
            },
            function (a) {
              return g(c, a);
            },
          ),
          c
        );
      }
      function g(b, c) {
        return (
          !0 === b.isTopLevel &&
            setTimeout(function () {
              throw c;
            }),
          a(b, "Failed", c)
        );
      }
      function h(a, b, c) {
        var d = a.shift();
        return void 0 === d
          ? void (b && b())
          : "WaitingOnDeps" === d.state
            ? void h(a, b, c)
            : void (function i(a, b, c) {
                switch (a.state) {
                  case "WaitingForTurn":
                    return e(a), void i(a, b, c);
                  case "Failed":
                    return void (c && c(a.stateData));
                  case "Executed":
                    return void b();
                  case "Loading":
                  case "WaitingOnDeps":
                    return void a.onNextStateChange.push(function () {
                      return i(a, b, c);
                    });
                  case "Initialized":
                    throw new Error(
                      "All dependencies should be loading already before pressureDependencyToExecute is called.",
                    );
                  default:
                    throw new Error("Impossible module state: " + a.state);
                }
              })(
                d,
                function () {
                  h(a, b, c);
                },
                c,
              );
      }
      function k(a, b) {
        void 0 === b && (b = "anonymous");
        var c = q[a];
        return (
          void 0 === c &&
            (c = q[a] =
              {
                url: a,
                urlBase: m(a),
                exports: Object.create(null),
                state: "Initialized",
                stateData: void 0,
                isTopLevel: !1,
                crossorigin: b,
                onNextStateChange: [],
              }),
          c
        );
      }
      function m(a) {
        return (a = (a = a.split("?")[0]).split("#")[0]).substring(
          0,
          a.lastIndexOf("/") + 1,
        );
      }
      function n(a, b) {
        return -1 === b.indexOf("://")
          ? (function l(a) {
              return (v.href = a), v.href;
            })("/" === b[0] ? b : a + b)
          : b;
      }
      function o() {
        return (
          document.baseURI ||
          (document.querySelector("base") || window.location).href
        );
      }
      if (!window.define) {
        var q = Object.create(null),
          r = void 0,
          s = 0,
          t = void 0,
          u = o();
        (window.define = function (a, b) {
          var d = !1;
          r = function () {
            return (d = !0), (r = void 0), [a, b];
          };
          var f = (function p() {
              var b = document.currentScript;
              if (!b) return u;
              if (window.HTMLImports) {
                var c = window.HTMLImports.importForElement(b);
                return c ? c.href : u;
              }
              var d = b.ownerDocument.createElement("a");
              return (d.href = ""), d.href;
            })(),
            g =
              (document.currentScript &&
                document.currentScript.getAttribute("crossorigin")) ||
              "anonymous";
          setTimeout(function () {
            if (0 == d) {
              r = void 0;
              var h = f + "#" + s++,
                i = k(h, g);
              i.isTopLevel = !0;
              var l = c(i, a, b);
              void 0 === t
                ? e(l)
                : (function j(a, b) {
                    switch (a.state) {
                      case "Executed":
                      case "Failed":
                        return void b();
                      default:
                        a.onNextStateChange.push(function () {
                          return j(a, b);
                        });
                    }
                  })(k(t), function () {
                    e(l);
                  }),
                (t = h);
            }
          }, 0);
        }),
          (window.define._reset = function () {
            for (var a in q) delete q[a];
            (r = void 0), (s = 0), (t = void 0), (u = o());
          });
        var v = document.createElement("a");
      }
    })(),
    (defs = window.customElements
      ? [
          cdn + "assets/babel-top.js",
          cdn +
            "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
          cdn + "build/es5-amd/node_modules/lit/polyfill-support.js",
          cdn +
            "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js",
        ]
      : [
          cdn + "assets/babel-top.js",
          cdn +
            "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
          cdn + "build/es5-amd/node_modules/fetch-ie8/fetch.js",
          cdn + "build/es5-amd/node_modules/lit/polyfill-support.js",
          cdn +
            "build/es6/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",
          cdn +
            "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
        ]),
    (window.WCAutoloadPolyfillEntryPoint =
      cdn + "build/es5-amd/node_modules/@haxtheweb/wc-autoload/wc-autoload.js"),
    define(defs, function () {
      define([
        cdn +
          "build/es5-amd/node_modules/@haxtheweb/deduping-fix/deduping-fix.js",
        window.WCAutoloadPolyfillEntryPoint,
      ], function () {
        window.WCAutoload.process();
      });
    }));
