function createUnityInstance(e, t, n) {
  function r(e, t, n) {
    if (u.startupErrorHandler) return void u.startupErrorHandler(e, t, n);
    if (
      !(
        (u.errorHandler && u.errorHandler(e, t, n)) ||
        (console.log("Invoking error handler due to\n" + e),
        "function" == typeof dump &&
          dump("Invoking error handler due to\n" + e),
        e.indexOf("UnknownError") != -1 ||
          e.indexOf("Program terminated with exit(0)") != -1 ||
          r.didShowErrorMessage)
      )
    ) {
      var e =
        "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" +
        e;
      e.indexOf("DISABLE_EXCEPTION_CATCHING") != -1
        ? (e =
            "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.")
        : e.indexOf("Cannot enlarge memory arrays") != -1
        ? (e =
            "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.")
        : (e.indexOf("Invalid array buffer length") == -1 &&
            e.indexOf("Invalid typed array length") == -1 &&
            e.indexOf("out of memory") == -1 &&
            e.indexOf("could not allocate memory") == -1) ||
          (e =
            "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),
        alert(e),
        (r.didShowErrorMessage = !0);
    }
  }
  function a(e) {
    var t =
        "unhandledrejection" == e.type && "object" == typeof e.reason
          ? e.reason
          : "object" == typeof e.error
          ? e.error
          : null,
      n = t
        ? t.toString()
        : "string" == typeof e.message
        ? e.message
        : "string" == typeof e.reason
        ? e.reason
        : "";
    if (
      (t &&
        "string" == typeof t.stack &&
        (n +=
          "\n" +
          t.stack
            .substring(t.stack.lastIndexOf(n, 0) ? 0 : n.length)
            .replace(/(^\n*|\n*$)/g, "")),
      n && u.stackTraceRegExp && u.stackTraceRegExp.test(n))
    ) {
      var a =
          e instanceof ErrorEvent
            ? e.filename
            : t && "string" == typeof t.fileName
            ? t.fileName
            : t && "string" == typeof t.sourceURL
            ? t.sourceURL
            : "",
        i =
          e instanceof ErrorEvent
            ? e.lineno
            : t && "number" == typeof t.lineNumber
            ? t.lineNumber
            : t && "number" == typeof t.line
            ? t.line
            : 0;
      r(n, a, i);
    }
  }
  function i(e, t) {
    if ("symbolsUrl" != e) {
      var r = u.downloadProgress[e];
      r ||
        (r = u.downloadProgress[e] = {
          started: !1,
          finished: !1,
          lengthComputable: !1,
          total: 0,
          loaded: 0,
        }),
        "object" != typeof t ||
          ("progress" != t.type && "load" != t.type) ||
          (r.started ||
            ((r.started = !0),
            (r.lengthComputable = t.lengthComputable),
            (r.total = t.total)),
          (r.loaded = t.loaded),
          "load" == t.type && (r.finished = !0));
      var a = 0,
        i = 0,
        s = 0,
        o = 0,
        d = 0;
      for (var e in u.downloadProgress) {
        var r = u.downloadProgress[e];
        if (!r.started) return 0;
        s++,
          r.lengthComputable
            ? ((a += r.loaded), (i += r.total), o++)
            : r.finished || d++;
      }
      var l = s ? (s - d - (i ? (o * (i - a)) / i : 0)) / s : 0;
      n(0.9 * l);
    }
  }
  function s(e, t, n) {
    for (var r in h)
      if (h[r].hasUnityMarker(e)) {
        t &&
          console.log(
            'You can reduce startup time if you configure your web server to add "Content-Encoding: ' +
              r +
              '" response header when serving "' +
              t +
              '" file.'
          );
        var a = h[r];
        if (!a.worker) {
          var i = URL.createObjectURL(
            new Blob(
              [
                "this.require = ",
                a.require.toString(),
                "; this.decompress = ",
                a.decompress.toString(),
                "; this.onmessage = ",
                function (e) {
                  var t = {
                    id: e.data.id,
                    decompressed: this.decompress(e.data.compressed),
                  };
                  postMessage(t, t.decompressed ? [t.decompressed.buffer] : []);
                }.toString(),
                "; postMessage({ ready: true });",
              ],
              { type: "application/javascript" }
            )
          );
          (a.worker = new Worker(i)),
            (a.worker.onmessage = function (e) {
              return e.data.ready
                ? void URL.revokeObjectURL(i)
                : (this.callbacks[e.data.id](e.data.decompressed),
                  void delete this.callbacks[e.data.id]);
            }),
            (a.worker.callbacks = {}),
            (a.worker.nextCallbackId = 0);
        }
        var s = a.worker.nextCallbackId++;
        return (
          (a.worker.callbacks[s] = n),
          void a.worker.postMessage({ id: s, compressed: e }, [e.buffer])
        );
      }
    n(e);
  }
  function o(e) {
    return new Promise(function (t, n) {
      i(e);
      var r =
        u.companyName && u.productName
          ? new u.XMLHttpRequest({
              companyName: u.companyName,
              productName: u.productName,
              cacheControl: u.cacheControl(u[e]),
            })
          : new XMLHttpRequest();
      r.open("GET", u[e]),
        (r.responseType = "arraybuffer"),
        r.addEventListener("progress", function (t) {
          i(e, t);
        }),
        r.addEventListener("load", function (n) {
          i(e, n), s(new Uint8Array(r.response), u[e], t);
        }),
        r.send();
    });
  }
  function d() {
    return o("frameworkUrl").then(function (e) {
      var t = URL.createObjectURL(
        new Blob([e], { type: "application/javascript" })
      );
      return new Promise(function (e, n) {
        var r = document.createElement("script");
        (r.src = t),
          (r.onload = function () {
            delete r.onload, URL.revokeObjectURL(t), e(unityFramework);
          }),
          document.body.appendChild(r),
          u.deinitializers.push(function () {
            document.body.removeChild(r);
          });
      });
    });
  }
  function l() {
    Promise.all([d(), o("codeUrl")]).then(function (e) {
      (u.wasmBinary = e[1]), e[0](u);
    });
    var e = o("dataUrl");
    u.preRun.push(function () {
      u.addRunDependency("dataUrl"),
        e.then(function (e) {
          var t = new DataView(e.buffer, e.byteOffset, e.byteLength),
            n = 0,
            r = "UnityWebData1.0\0";
          if (
            !String.fromCharCode.apply(null, e.subarray(n, n + r.length)) == r
          )
            throw "unknown data format";
          n += r.length;
          var a = t.getUint32(n, !0);
          for (n += 4; n < a; ) {
            var i = t.getUint32(n, !0);
            n += 4;
            var s = t.getUint32(n, !0);
            n += 4;
            var o = t.getUint32(n, !0);
            n += 4;
            var d = String.fromCharCode.apply(null, e.subarray(n, n + o));
            n += o;
            for (
              var l = 0, c = d.indexOf("/", l) + 1;
              c > 0;
              l = c, c = d.indexOf("/", l) + 1
            )
              u.FS_createPath(d.substring(0, l), d.substring(l, c - 1), !0, !0);
            u.FS_createDataFile(d, null, e.subarray(i, i + s), !0, !0, !0);
          }
          u.removeRunDependency("dataUrl");
        });
    });
  }
  n = n || function () {};
  var u = {
    canvas: e,
    webglContextAttributes: { preserveDrawingBuffer: !1 },
    cacheControl: function (e) {
      return e == u.dataUrl ? "must-revalidate" : "no-store";
    },
    streamingAssetsUrl: "StreamingAssets",
    downloadProgress: {},
    deinitializers: [],
    intervals: {},
    setInterval: function (e, t) {
      var n = window.setInterval(e, t);
      return (this.intervals[n] = !0), n;
    },
    clearInterval: function (e) {
      delete this.intervals[e], window.clearInterval(e);
    },
    preRun: [],
    postRun: [],
    print: function (e) {
      console.log(e);
    },
    printErr: function (e) {
      console.error(e);
    },
    locateFile: function (e) {
      return e;
    },
    disabledCanvasEvents: ["contextmenu", "dragstart"],
  };
  for (var c in t) u[c] = t[c];
  (u.streamingAssetsUrl = new URL(u.streamingAssetsUrl, document.URL).href),
    u.disabledCanvasEvents.forEach(function (t) {
      e.addEventListener(t, function (e) {
        e.preventDefault();
      });
    });
  var f = {
    Module: u,
    SetFullscreen: function () {
      return u.SetFullscreen
        ? u.SetFullscreen.apply(u, arguments)
        : void u.print("Failed to set Fullscreen mode: Player not loaded yet.");
    },
    SendMessage: function () {
      return u.SendMessage
        ? u.SendMessage.apply(u, arguments)
        : void u.print("Failed to execute SendMessage: Player not loaded yet.");
    },
    Quit: function () {
      return new Promise(function (e, t) {
        (u.shouldQuit = !0), (u.onQuit = e);
      });
    },
  };
  (u.SystemInfo = (function () {
    var e,
      t,
      n,
      r = "-",
      a = navigator.appVersion,
      i = navigator.userAgent,
      s = navigator.appName,
      o = navigator.appVersion,
      d = parseInt(navigator.appVersion, 10);
    (t = i.indexOf("Opera")) != -1
      ? ((s = "Opera"),
        (o = i.substring(t + 6)),
        (t = i.indexOf("Version")) != -1 && (o = i.substring(t + 8)))
      : (t = i.indexOf("MSIE")) != -1
      ? ((s = "Microsoft Internet Explorer"), (o = i.substring(t + 5)))
      : (t = i.indexOf("Edge")) != -1
      ? ((s = "Edge"), (o = i.substring(t + 5)))
      : (t = i.indexOf("Chrome")) != -1
      ? ((s = "Chrome"), (o = i.substring(t + 7)))
      : (t = i.indexOf("Safari")) != -1
      ? ((s = "Safari"),
        (o = i.substring(t + 7)),
        (t = i.indexOf("Version")) != -1 && (o = i.substring(t + 8)))
      : (t = i.indexOf("Firefox")) != -1
      ? ((s = "Firefox"), (o = i.substring(t + 8)))
      : i.indexOf("Trident/") != -1
      ? ((s = "Microsoft Internet Explorer"),
        (o = i.substring(i.indexOf("rv:") + 3)))
      : (e = i.lastIndexOf(" ") + 1) < (t = i.lastIndexOf("/")) &&
        ((s = i.substring(e, t)),
        (o = i.substring(t + 1)),
        s.toLowerCase() == s.toUpperCase() && (s = navigator.appName)),
      (n = o.indexOf(";")) != -1 && (o = o.substring(0, n)),
      (n = o.indexOf(" ")) != -1 && (o = o.substring(0, n)),
      (n = o.indexOf(")")) != -1 && (o = o.substring(0, n)),
      (d = parseInt("" + o, 10)),
      isNaN(d)
        ? ((o = "" + parseFloat(navigator.appVersion)),
          (d = parseInt(navigator.appVersion, 10)))
        : (o = "" + parseFloat(o));
    var l = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(a),
      u = r,
      c = [
        { s: "Windows 3.11", r: /Win16/ },
        { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
        { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
        { s: "Windows 98", r: /(Windows 98|Win98)/ },
        { s: "Windows CE", r: /Windows CE/ },
        { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
        { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
        { s: "Windows Server 2003", r: /Windows NT 5.2/ },
        { s: "Windows Vista", r: /Windows NT 6.0/ },
        { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
        { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
        { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
        { s: "Windows 10", r: /(Windows 10|Windows NT 10.0)/ },
        {
          s: "Windows NT 4.0",
          r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
        },
        { s: "Windows ME", r: /Windows ME/ },
        { s: "Android", r: /Android/ },
        { s: "Open BSD", r: /OpenBSD/ },
        { s: "Sun OS", r: /SunOS/ },
        { s: "Linux", r: /(Linux|X11)/ },
        { s: "iOS", r: /(iPhone|iPad|iPod)/ },
        { s: "Mac OS X", r: /Mac OS X/ },
        { s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
        { s: "QNX", r: /QNX/ },
        { s: "UNIX", r: /UNIX/ },
        { s: "BeOS", r: /BeOS/ },
        { s: "OS/2", r: /OS\/2/ },
        {
          s: "Search Bot",
          r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
        },
      ];
    for (var f in c) {
      var h = c[f];
      if (h.r.test(i)) {
        u = h.s;
        break;
      }
    }
    var p = r;
    switch (
      (/Windows/.test(u) && ((p = /Windows (.*)/.exec(u)[1]), (u = "Windows")),
      u)
    ) {
      case "Mac OS X":
        p = /Mac OS X (10[\.\_\d]+)/.exec(i)[1];
        break;
      case "Android":
        p = /Android ([\.\_\d]+)/.exec(i)[1];
        break;
      case "iOS":
        (p = /OS (\d+)_(\d+)_?(\d+)?/.exec(a)),
          (p = p[1] + "." + p[2] + "." + (0 | p[3]));
    }
    return {
      width: screen.width ? screen.width : 0,
      height: screen.height ? screen.height : 0,
      browser: s,
      browserVersion: o,
      mobile: l,
      os: u,
      osVersion: p,
      gpu: (function () {
        var e = document.createElement("canvas"),
          t = e.getContext("experimental-webgl");
        if (t) {
          var n = t.getExtension("WEBGL_debug_renderer_info");
          if (n) return t.getParameter(n.UNMASKED_RENDERER_WEBGL);
        }
        return r;
      })(),
      language: window.navigator.userLanguage || window.navigator.language,
      hasWebGL: (function () {
        if (!window.WebGLRenderingContext) return 0;
        var e = document.createElement("canvas"),
          t = e.getContext("webgl2");
        return t
          ? 2
          : ((t = e.getContext("experimental-webgl2")),
            t
              ? 2
              : ((t = e.getContext("webgl")),
                t || (t = e.getContext("experimental-webgl")) ? 1 : 0));
      })(),
      hasCursorLock: (function () {
        var e = document.createElement("canvas");
        return e.requestPointerLock ||
          e.mozRequestPointerLock ||
          e.webkitRequestPointerLock ||
          e.msRequestPointerLock
          ? 1
          : 0;
      })(),
      hasFullscreen: (function () {
        var e = document.createElement("canvas");
        return (e.requestFullScreen ||
          e.mozRequestFullScreen ||
          e.msRequestFullscreen ||
          e.webkitRequestFullScreen) &&
          (s.indexOf("Safari") == -1 || o >= 10.1)
          ? 1
          : 0;
      })(),
      hasThreads: "undefined" != typeof SharedArrayBuffer,
      hasWasm:
        "object" == typeof WebAssembly &&
        "function" == typeof WebAssembly.validate &&
        "function" == typeof WebAssembly.compile,
      hasWasmThreads: (function () {
        if ("object" != typeof WebAssembly) return !1;
        if ("undefined" == typeof SharedArrayBuffer) return !1;
        var e = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: !0 }),
          t = e.buffer instanceof SharedArrayBuffer;
        return delete e, t;
      })(),
    };
  })()),
    (u.abortHandler = function (e) {
      return r(e, "", 0), !0;
    }),
    window.addEventListener("error", a),
    window.addEventListener("unhandledrejection", a),
    (Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50)),
    (u.XMLHttpRequest = (function () {
      function e(e) {
        console.log("[UnityCache] " + e);
      }
      function t(e) {
        return (
          (t.link = t.link || document.createElement("a")),
          (t.link.href = e),
          t.link.href
        );
      }
      function n(e) {
        var t = window.location.href.match(/^[a-z]+:\/\/[^\/]+/);
        return !t || e.lastIndexOf(t[0], 0);
      }
      function r() {
        function t(t) {
          if ("undefined" == typeof r.database)
            for (
              r.database = t,
                r.database || e("indexedDB database could not be opened");
              r.queue.length;

            ) {
              var n = r.queue.shift();
              r.database
                ? r.execute.apply(r, n)
                : "function" == typeof n.onerror &&
                  n.onerror(new Error("operation cancelled"));
            }
        }
        function n() {
          var e = a.open(s.name, s.version);
          (e.onupgradeneeded = function (e) {
            var t = e.target.result;
            t.objectStoreNames.contains(d.name) || t.createObjectStore(d.name);
          }),
            (e.onsuccess = function (e) {
              t(e.target.result);
            }),
            (e.onerror = function () {
              t(null);
            });
        }
        var r = this;
        r.queue = [];
        try {
          var a =
              window.indexedDB ||
              window.mozIndexedDB ||
              window.webkitIndexedDB ||
              window.msIndexedDB,
            i = a.open(s.name);
          (i.onupgradeneeded = function (e) {
            var t = e.target.result.createObjectStore(o.name, {
              keyPath: "url",
            });
            [
              "version",
              "company",
              "product",
              "updated",
              "revalidated",
              "accessed",
            ].forEach(function (e) {
              t.createIndex(e, e);
            });
          }),
            (i.onsuccess = function (e) {
              var r = e.target.result;
              r.version < s.version ? (r.close(), n()) : t(r);
            }),
            (i.onerror = function () {
              t(null);
            });
        } catch (e) {
          t(null);
        }
      }
      function a(e, t, n, r, a) {
        var i = {
          url: e,
          version: o.version,
          company: t,
          product: n,
          updated: r,
          revalidated: r,
          accessed: r,
          responseHeaders: {},
          xhr: {},
        };
        return (
          a &&
            (["Last-Modified", "ETag"].forEach(function (e) {
              i.responseHeaders[e] = a.getResponseHeader(e);
            }),
            ["responseURL", "status", "statusText", "response"].forEach(
              function (e) {
                i.xhr[e] = a[e];
              }
            )),
          i
        );
      }
      function i(t) {
        (this.cache = { enabled: !1 }),
          t &&
            ((this.cache.control = t.cacheControl),
            (this.cache.company = t.companyName),
            (this.cache.product = t.productName)),
          (this.xhr = new XMLHttpRequest(t)),
          this.xhr.addEventListener(
            "load",
            function () {
              var t = this.xhr,
                n = this.cache;
              n.enabled &&
                !n.revalidated &&
                (304 == t.status
                  ? ((n.result.revalidated = n.result.accessed),
                    (n.revalidated = !0),
                    l.execute(o.name, "put", [n.result]),
                    e(
                      "'" +
                        n.result.url +
                        "' successfully revalidated and served from the indexedDB cache"
                    ))
                  : 200 == t.status
                  ? ((n.result = a(
                      n.result.url,
                      n.company,
                      n.product,
                      n.result.accessed,
                      t
                    )),
                    (n.revalidated = !0),
                    l.execute(
                      o.name,
                      "put",
                      [n.result],
                      function (t) {
                        e(
                          "'" +
                            n.result.url +
                            "' successfully downloaded and stored in the indexedDB cache"
                        );
                      },
                      function (t) {
                        e(
                          "'" +
                            n.result.url +
                            "' successfully downloaded but not stored in the indexedDB cache due to the error: " +
                            t
                        );
                      }
                    ))
                  : e(
                      "'" +
                        n.result.url +
                        "' request failed with status: " +
                        t.status +
                        " " +
                        t.statusText
                    ));
            }.bind(this)
          );
      }
      var s = { name: "UnityCache", version: 2 },
        o = { name: "XMLHttpRequest", version: 1 },
        d = { name: "WebAssembly", version: 1 };
      r.prototype.execute = function (e, t, n, r, a) {
        if (this.database)
          try {
            var i = this.database
              .transaction(
                [e],
                ["put", "delete", "clear"].indexOf(t) != -1
                  ? "readwrite"
                  : "readonly"
              )
              .objectStore(e);
            "openKeyCursor" == t && ((i = i.index(n[0])), (n = n.slice(1)));
            var s = i[t].apply(i, n);
            "function" == typeof r &&
              (s.onsuccess = function (e) {
                r(e.target.result);
              }),
              (s.onerror = a);
          } catch (e) {
            "function" == typeof a && a(e);
          }
        else
          "undefined" == typeof this.database
            ? this.queue.push(arguments)
            : "function" == typeof a && a(new Error("indexedDB access denied"));
      };
      var l = new r();
      (i.prototype.send = function (t) {
        var r = this.xhr,
          a = this.cache,
          i = arguments;
        return (
          (a.enabled = a.enabled && "arraybuffer" == r.responseType && !t),
          a.enabled
            ? void l.execute(
                o.name,
                "get",
                [a.result.url],
                function (t) {
                  if (!t || t.version != o.version)
                    return void r.send.apply(r, i);
                  if (
                    ((a.result = t),
                    (a.result.accessed = Date.now()),
                    "immutable" == a.control)
                  )
                    (a.revalidated = !0),
                      l.execute(o.name, "put", [a.result]),
                      r.dispatchEvent(new Event("load")),
                      e(
                        "'" +
                          a.result.url +
                          "' served from the indexedDB cache without revalidation"
                      );
                  else if (
                    n(a.result.url) &&
                    (a.result.responseHeaders["Last-Modified"] ||
                      a.result.responseHeaders.ETag)
                  ) {
                    var s = new XMLHttpRequest();
                    s.open("HEAD", a.result.url),
                      (s.onload = function () {
                        (a.revalidated = ["Last-Modified", "ETag"].every(
                          function (e) {
                            return (
                              !a.result.responseHeaders[e] ||
                              a.result.responseHeaders[e] ==
                                s.getResponseHeader(e)
                            );
                          }
                        )),
                          a.revalidated
                            ? ((a.result.revalidated = a.result.accessed),
                              l.execute(o.name, "put", [a.result]),
                              r.dispatchEvent(new Event("load")),
                              e(
                                "'" +
                                  a.result.url +
                                  "' successfully revalidated and served from the indexedDB cache"
                              ))
                            : r.send.apply(r, i);
                      }),
                      s.send();
                  } else
                    a.result.responseHeaders["Last-Modified"]
                      ? (r.setRequestHeader(
                          "If-Modified-Since",
                          a.result.responseHeaders["Last-Modified"]
                        ),
                        r.setRequestHeader("Cache-Control", "no-cache"))
                      : a.result.responseHeaders.ETag &&
                        (r.setRequestHeader(
                          "If-None-Match",
                          a.result.responseHeaders.ETag
                        ),
                        r.setRequestHeader("Cache-Control", "no-cache")),
                      r.send.apply(r, i);
                },
                function (e) {
                  r.send.apply(r, i);
                }
              )
            : r.send.apply(r, i)
        );
      }),
        (i.prototype.open = function (e, n, r, i, s) {
          return (
            (this.cache.result = a(
              t(n),
              this.cache.company,
              this.cache.product,
              Date.now()
            )),
            (this.cache.enabled =
              ["must-revalidate", "immutable"].indexOf(this.cache.control) !=
                -1 &&
              "GET" == e &&
              this.cache.result.url.match("^https?://") &&
              ("undefined" == typeof r || r) &&
              "undefined" == typeof i &&
              "undefined" == typeof s),
            (this.cache.revalidated = !1),
            this.xhr.open.apply(this.xhr, arguments)
          );
        }),
        (i.prototype.setRequestHeader = function (e, t) {
          return (
            (this.cache.enabled = !1),
            this.xhr.setRequestHeader.apply(this.xhr, arguments)
          );
        });
      var u = new XMLHttpRequest();
      for (var c in u)
        i.prototype.hasOwnProperty(c) ||
          !(function (e) {
            Object.defineProperty(
              i.prototype,
              e,
              "function" == typeof u[e]
                ? {
                    value: function () {
                      return this.xhr[e].apply(this.xhr, arguments);
                    },
                  }
                : {
                    get: function () {
                      return this.cache.revalidated &&
                        this.cache.result.xhr.hasOwnProperty(e)
                        ? this.cache.result.xhr[e]
                        : this.xhr[e];
                    },
                    set: function (t) {
                      this.xhr[e] = t;
                    },
                  }
            );
          })(c);
      return i;
    })());
  var h = {
    gzip: {
      require: function (e) {
        var t = {
          "inflate.js": function (e, t, n) {
            "use strict";
            function r(e) {
              if (!(this instanceof r)) return new r(e);
              this.options = o.assign(
                { chunkSize: 16384, windowBits: 0, to: "" },
                e || {}
              );
              var t = this.options;
              t.raw &&
                t.windowBits >= 0 &&
                t.windowBits < 16 &&
                ((t.windowBits = -t.windowBits),
                0 === t.windowBits && (t.windowBits = -15)),
                !(t.windowBits >= 0 && t.windowBits < 16) ||
                  (e && e.windowBits) ||
                  (t.windowBits += 32),
                t.windowBits > 15 &&
                  t.windowBits < 48 &&
                  0 === (15 & t.windowBits) &&
                  (t.windowBits |= 15),
                (this.err = 0),
                (this.msg = ""),
                (this.ended = !1),
                (this.chunks = []),
                (this.strm = new c()),
                (this.strm.avail_out = 0);
              var n = s.inflateInit2(this.strm, t.windowBits);
              if (n !== l.Z_OK) throw new Error(u[n]);
              (this.header = new f()),
                s.inflateGetHeader(this.strm, this.header);
            }
            function a(e, t) {
              var n = new r(t);
              if ((n.push(e, !0), n.err)) throw n.msg || u[n.err];
              return n.result;
            }
            function i(e, t) {
              return (t = t || {}), (t.raw = !0), a(e, t);
            }
            var s = e("./zlib/inflate"),
              o = e("./utils/common"),
              d = e("./utils/strings"),
              l = e("./zlib/constants"),
              u = e("./zlib/messages"),
              c = e("./zlib/zstream"),
              f = e("./zlib/gzheader"),
              h = Object.prototype.toString;
            (r.prototype.push = function (e, t) {
              var n,
                r,
                a,
                i,
                u,
                c,
                f = this.strm,
                p = this.options.chunkSize,
                b = this.options.dictionary,
                m = !1;
              if (this.ended) return !1;
              (r = t === ~~t ? t : t === !0 ? l.Z_FINISH : l.Z_NO_FLUSH),
                "string" == typeof e
                  ? (f.input = d.binstring2buf(e))
                  : "[object ArrayBuffer]" === h.call(e)
                  ? (f.input = new Uint8Array(e))
                  : (f.input = e),
                (f.next_in = 0),
                (f.avail_in = f.input.length);
              do {
                if (
                  (0 === f.avail_out &&
                    ((f.output = new o.Buf8(p)),
                    (f.next_out = 0),
                    (f.avail_out = p)),
                  (n = s.inflate(f, l.Z_NO_FLUSH)),
                  n === l.Z_NEED_DICT &&
                    b &&
                    ((c =
                      "string" == typeof b
                        ? d.string2buf(b)
                        : "[object ArrayBuffer]" === h.call(b)
                        ? new Uint8Array(b)
                        : b),
                    (n = s.inflateSetDictionary(this.strm, c))),
                  n === l.Z_BUF_ERROR && m === !0 && ((n = l.Z_OK), (m = !1)),
                  n !== l.Z_STREAM_END && n !== l.Z_OK)
                )
                  return this.onEnd(n), (this.ended = !0), !1;
                f.next_out &&
                  ((0 !== f.avail_out &&
                    n !== l.Z_STREAM_END &&
                    (0 !== f.avail_in ||
                      (r !== l.Z_FINISH && r !== l.Z_SYNC_FLUSH))) ||
                    ("string" === this.options.to
                      ? ((a = d.utf8border(f.output, f.next_out)),
                        (i = f.next_out - a),
                        (u = d.buf2string(f.output, a)),
                        (f.next_out = i),
                        (f.avail_out = p - i),
                        i && o.arraySet(f.output, f.output, a, i, 0),
                        this.onData(u))
                      : this.onData(o.shrinkBuf(f.output, f.next_out)))),
                  0 === f.avail_in && 0 === f.avail_out && (m = !0);
              } while (
                (f.avail_in > 0 || 0 === f.avail_out) &&
                n !== l.Z_STREAM_END
              );
              return (
                n === l.Z_STREAM_END && (r = l.Z_FINISH),
                r === l.Z_FINISH
                  ? ((n = s.inflateEnd(this.strm)),
                    this.onEnd(n),
                    (this.ended = !0),
                    n === l.Z_OK)
                  : r !== l.Z_SYNC_FLUSH ||
                    (this.onEnd(l.Z_OK), (f.avail_out = 0), !0)
              );
            }),
              (r.prototype.onData = function (e) {
                this.chunks.push(e);
              }),
              (r.prototype.onEnd = function (e) {
                e === l.Z_OK &&
                  ("string" === this.options.to
                    ? (this.result = this.chunks.join(""))
                    : (this.result = o.flattenChunks(this.chunks))),
                  (this.chunks = []),
                  (this.err = e),
                  (this.msg = this.strm.msg);
              }),
              (n.Inflate = r),
              (n.inflate = a),
              (n.inflateRaw = i),
              (n.ungzip = a);
          },
          "utils/common.js": function (e, t, n) {
            "use strict";
            var r =
              "undefined" != typeof Uint8Array &&
              "undefined" != typeof Uint16Array &&
              "undefined" != typeof Int32Array;
            (n.assign = function (e) {
              for (
                var t = Array.prototype.slice.call(arguments, 1);
                t.length;

              ) {
                var n = t.shift();
                if (n) {
                  if ("object" != typeof n)
                    throw new TypeError(n + "must be non-object");
                  for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r]);
                }
              }
              return e;
            }),
              (n.shrinkBuf = function (e, t) {
                return e.length === t
                  ? e
                  : e.subarray
                  ? e.subarray(0, t)
                  : ((e.length = t), e);
              });
            var a = {
                arraySet: function (e, t, n, r, a) {
                  if (t.subarray && e.subarray)
                    return void e.set(t.subarray(n, n + r), a);
                  for (var i = 0; i < r; i++) e[a + i] = t[n + i];
                },
                flattenChunks: function (e) {
                  var t, n, r, a, i, s;
                  for (r = 0, t = 0, n = e.length; t < n; t++) r += e[t].length;
                  for (
                    s = new Uint8Array(r), a = 0, t = 0, n = e.length;
                    t < n;
                    t++
                  )
                    (i = e[t]), s.set(i, a), (a += i.length);
                  return s;
                },
              },
              i = {
                arraySet: function (e, t, n, r, a) {
                  for (var i = 0; i < r; i++) e[a + i] = t[n + i];
                },
                flattenChunks: function (e) {
                  return [].concat.apply([], e);
                },
              };
            (n.setTyped = function (e) {
              e
                ? ((n.Buf8 = Uint8Array),
                  (n.Buf16 = Uint16Array),
                  (n.Buf32 = Int32Array),
                  n.assign(n, a))
                : ((n.Buf8 = Array),
                  (n.Buf16 = Array),
                  (n.Buf32 = Array),
                  n.assign(n, i));
            }),
              n.setTyped(r);
          },
          "utils/strings.js": function (e, t, n) {
            "use strict";
            function r(e, t) {
              if (t < 65537 && ((e.subarray && s) || (!e.subarray && i)))
                return String.fromCharCode.apply(null, a.shrinkBuf(e, t));
              for (var n = "", r = 0; r < t; r++)
                n += String.fromCharCode(e[r]);
              return n;
            }
            var a = e("./common"),
              i = !0,
              s = !0;
            try {
              String.fromCharCode.apply(null, [0]);
            } catch (e) {
              i = !1;
            }
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (e) {
              s = !1;
            }
            for (var o = new a.Buf8(256), d = 0; d < 256; d++)
              o[d] =
                d >= 252
                  ? 6
                  : d >= 248
                  ? 5
                  : d >= 240
                  ? 4
                  : d >= 224
                  ? 3
                  : d >= 192
                  ? 2
                  : 1;
            (o[254] = o[254] = 1),
              (n.string2buf = function (e) {
                var t,
                  n,
                  r,
                  i,
                  s,
                  o = e.length,
                  d = 0;
                for (i = 0; i < o; i++)
                  (n = e.charCodeAt(i)),
                    55296 === (64512 & n) &&
                      i + 1 < o &&
                      ((r = e.charCodeAt(i + 1)),
                      56320 === (64512 & r) &&
                        ((n = 65536 + ((n - 55296) << 10) + (r - 56320)), i++)),
                    (d += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4);
                for (t = new a.Buf8(d), s = 0, i = 0; s < d; i++)
                  (n = e.charCodeAt(i)),
                    55296 === (64512 & n) &&
                      i + 1 < o &&
                      ((r = e.charCodeAt(i + 1)),
                      56320 === (64512 & r) &&
                        ((n = 65536 + ((n - 55296) << 10) + (r - 56320)), i++)),
                    n < 128
                      ? (t[s++] = n)
                      : n < 2048
                      ? ((t[s++] = 192 | (n >>> 6)), (t[s++] = 128 | (63 & n)))
                      : n < 65536
                      ? ((t[s++] = 224 | (n >>> 12)),
                        (t[s++] = 128 | ((n >>> 6) & 63)),
                        (t[s++] = 128 | (63 & n)))
                      : ((t[s++] = 240 | (n >>> 18)),
                        (t[s++] = 128 | ((n >>> 12) & 63)),
                        (t[s++] = 128 | ((n >>> 6) & 63)),
                        (t[s++] = 128 | (63 & n)));
                return t;
              }),
              (n.buf2binstring = function (e) {
                return r(e, e.length);
              }),
              (n.binstring2buf = function (e) {
                for (
                  var t = new a.Buf8(e.length), n = 0, r = t.length;
                  n < r;
                  n++
                )
                  t[n] = e.charCodeAt(n);
                return t;
              }),
              (n.buf2string = function (e, t) {
                var n,
                  a,
                  i,
                  s,
                  d = t || e.length,
                  l = new Array(2 * d);
                for (a = 0, n = 0; n < d; )
                  if (((i = e[n++]), i < 128)) l[a++] = i;
                  else if (((s = o[i]), s > 4)) (l[a++] = 65533), (n += s - 1);
                  else {
                    for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && n < d; )
                      (i = (i << 6) | (63 & e[n++])), s--;
                    s > 1
                      ? (l[a++] = 65533)
                      : i < 65536
                      ? (l[a++] = i)
                      : ((i -= 65536),
                        (l[a++] = 55296 | ((i >> 10) & 1023)),
                        (l[a++] = 56320 | (1023 & i)));
                  }
                return r(l, a);
              }),
              (n.utf8border = function (e, t) {
                var n;
                for (
                  t = t || e.length, t > e.length && (t = e.length), n = t - 1;
                  n >= 0 && 128 === (192 & e[n]);

                )
                  n--;
                return n < 0 ? t : 0 === n ? t : n + o[e[n]] > t ? n : t;
              });
          },
          "zlib/inflate.js": function (e, t, n) {
            "use strict";
            function r(e) {
              return (
                ((e >>> 24) & 255) +
                ((e >>> 8) & 65280) +
                ((65280 & e) << 8) +
                ((255 & e) << 24)
              );
            }
            function a() {
              (this.mode = 0),
                (this.last = !1),
                (this.wrap = 0),
                (this.havedict = !1),
                (this.flags = 0),
                (this.dmax = 0),
                (this.check = 0),
                (this.total = 0),
                (this.head = null),
                (this.wbits = 0),
                (this.wsize = 0),
                (this.whave = 0),
                (this.wnext = 0),
                (this.window = null),
                (this.hold = 0),
                (this.bits = 0),
                (this.length = 0),
                (this.offset = 0),
                (this.extra = 0),
                (this.lencode = null),
                (this.distcode = null),
                (this.lenbits = 0),
                (this.distbits = 0),
                (this.ncode = 0),
                (this.nlen = 0),
                (this.ndist = 0),
                (this.have = 0),
                (this.next = null),
                (this.lens = new g.Buf16(320)),
                (this.work = new g.Buf16(288)),
                (this.lendyn = null),
                (this.distdyn = null),
                (this.sane = 0),
                (this.back = 0),
                (this.was = 0);
            }
            function i(e) {
              var t;
              return e && e.state
                ? ((t = e.state),
                  (e.total_in = e.total_out = t.total = 0),
                  (e.msg = ""),
                  t.wrap && (e.adler = 1 & t.wrap),
                  (t.mode = M),
                  (t.last = 0),
                  (t.havedict = 0),
                  (t.dmax = 32768),
                  (t.head = null),
                  (t.hold = 0),
                  (t.bits = 0),
                  (t.lencode = t.lendyn = new g.Buf32(be)),
                  (t.distcode = t.distdyn = new g.Buf32(me)),
                  (t.sane = 1),
                  (t.back = -1),
                  L)
                : N;
            }
            function s(e) {
              var t;
              return e && e.state
                ? ((t = e.state),
                  (t.wsize = 0),
                  (t.whave = 0),
                  (t.wnext = 0),
                  i(e))
                : N;
            }
            function o(e, t) {
              var n, r;
              return e && e.state
                ? ((r = e.state),
                  t < 0
                    ? ((n = 0), (t = -t))
                    : ((n = (t >> 4) + 1), t < 48 && (t &= 15)),
                  t && (t < 8 || t > 15)
                    ? N
                    : (null !== r.window && r.wbits !== t && (r.window = null),
                      (r.wrap = n),
                      (r.wbits = t),
                      s(e)))
                : N;
            }
            function d(e, t) {
              var n, r;
              return e
                ? ((r = new a()),
                  (e.state = r),
                  (r.window = null),
                  (n = o(e, t)),
                  n !== L && (e.state = null),
                  n)
                : N;
            }
            function l(e) {
              return d(e, ge);
            }
            function u(e) {
              if (ve) {
                var t;
                for (
                  m = new g.Buf32(512), w = new g.Buf32(32), t = 0;
                  t < 144;

                )
                  e.lens[t++] = 8;
                for (; t < 256; ) e.lens[t++] = 9;
                for (; t < 280; ) e.lens[t++] = 7;
                for (; t < 288; ) e.lens[t++] = 8;
                for (
                  x(E, e.lens, 0, 288, m, 0, e.work, { bits: 9 }), t = 0;
                  t < 32;

                )
                  e.lens[t++] = 5;
                x(S, e.lens, 0, 32, w, 0, e.work, { bits: 5 }), (ve = !1);
              }
              (e.lencode = m),
                (e.lenbits = 9),
                (e.distcode = w),
                (e.distbits = 5);
            }
            function c(e, t, n, r) {
              var a,
                i = e.state;
              return (
                null === i.window &&
                  ((i.wsize = 1 << i.wbits),
                  (i.wnext = 0),
                  (i.whave = 0),
                  (i.window = new g.Buf8(i.wsize))),
                r >= i.wsize
                  ? (g.arraySet(i.window, t, n - i.wsize, i.wsize, 0),
                    (i.wnext = 0),
                    (i.whave = i.wsize))
                  : ((a = i.wsize - i.wnext),
                    a > r && (a = r),
                    g.arraySet(i.window, t, n - r, a, i.wnext),
                    (r -= a),
                    r
                      ? (g.arraySet(i.window, t, n - r, r, 0),
                        (i.wnext = r),
                        (i.whave = i.wsize))
                      : ((i.wnext += a),
                        i.wnext === i.wsize && (i.wnext = 0),
                        i.whave < i.wsize && (i.whave += a))),
                0
              );
            }
            function f(e, t) {
              var n,
                a,
                i,
                s,
                o,
                d,
                l,
                f,
                h,
                p,
                b,
                m,
                w,
                be,
                me,
                we,
                ge,
                ve,
                ye,
                ke,
                xe,
                _e,
                Ee,
                Se,
                Oe = 0,
                Ce = new g.Buf8(4),
                Re = [
                  16,
                  17,
                  18,
                  0,
                  8,
                  7,
                  9,
                  6,
                  10,
                  5,
                  11,
                  4,
                  12,
                  3,
                  13,
                  2,
                  14,
                  1,
                  15,
                ];
              if (!e || !e.state || !e.output || (!e.input && 0 !== e.avail_in))
                return N;
              (n = e.state),
                n.mode === K && (n.mode = V),
                (o = e.next_out),
                (i = e.output),
                (l = e.avail_out),
                (s = e.next_in),
                (a = e.input),
                (d = e.avail_in),
                (f = n.hold),
                (h = n.bits),
                (p = d),
                (b = l),
                (_e = L);
              e: for (;;)
                switch (n.mode) {
                  case M:
                    if (0 === n.wrap) {
                      n.mode = V;
                      break;
                    }
                    for (; h < 16; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    if (2 & n.wrap && 35615 === f) {
                      (n.check = 0),
                        (Ce[0] = 255 & f),
                        (Ce[1] = (f >>> 8) & 255),
                        (n.check = y(n.check, Ce, 2, 0)),
                        (f = 0),
                        (h = 0),
                        (n.mode = H);
                      break;
                    }
                    if (
                      ((n.flags = 0),
                      n.head && (n.head.done = !1),
                      !(1 & n.wrap) || (((255 & f) << 8) + (f >> 8)) % 31)
                    ) {
                      (e.msg = "incorrect header check"), (n.mode = fe);
                      break;
                    }
                    if ((15 & f) !== T) {
                      (e.msg = "unknown compression method"), (n.mode = fe);
                      break;
                    }
                    if (
                      ((f >>>= 4), (h -= 4), (xe = (15 & f) + 8), 0 === n.wbits)
                    )
                      n.wbits = xe;
                    else if (xe > n.wbits) {
                      (e.msg = "invalid window size"), (n.mode = fe);
                      break;
                    }
                    (n.dmax = 1 << xe),
                      (e.adler = n.check = 1),
                      (n.mode = 512 & f ? G : K),
                      (f = 0),
                      (h = 0);
                    break;
                  case H:
                    for (; h < 16; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    if (((n.flags = f), (255 & n.flags) !== T)) {
                      (e.msg = "unknown compression method"), (n.mode = fe);
                      break;
                    }
                    if (57344 & n.flags) {
                      (e.msg = "unknown header flags set"), (n.mode = fe);
                      break;
                    }
                    n.head && (n.head.text = (f >> 8) & 1),
                      512 & n.flags &&
                        ((Ce[0] = 255 & f),
                        (Ce[1] = (f >>> 8) & 255),
                        (n.check = y(n.check, Ce, 2, 0))),
                      (f = 0),
                      (h = 0),
                      (n.mode = D);
                  case D:
                    for (; h < 32; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    n.head && (n.head.time = f),
                      512 & n.flags &&
                        ((Ce[0] = 255 & f),
                        (Ce[1] = (f >>> 8) & 255),
                        (Ce[2] = (f >>> 16) & 255),
                        (Ce[3] = (f >>> 24) & 255),
                        (n.check = y(n.check, Ce, 4, 0))),
                      (f = 0),
                      (h = 0),
                      (n.mode = Z);
                  case Z:
                    for (; h < 16; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    n.head && ((n.head.xflags = 255 & f), (n.head.os = f >> 8)),
                      512 & n.flags &&
                        ((Ce[0] = 255 & f),
                        (Ce[1] = (f >>> 8) & 255),
                        (n.check = y(n.check, Ce, 2, 0))),
                      (f = 0),
                      (h = 0),
                      (n.mode = z);
                  case z:
                    if (1024 & n.flags) {
                      for (; h < 16; ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      (n.length = f),
                        n.head && (n.head.extra_len = f),
                        512 & n.flags &&
                          ((Ce[0] = 255 & f),
                          (Ce[1] = (f >>> 8) & 255),
                          (n.check = y(n.check, Ce, 2, 0))),
                        (f = 0),
                        (h = 0);
                    } else n.head && (n.head.extra = null);
                    n.mode = F;
                  case F:
                    if (
                      1024 & n.flags &&
                      ((m = n.length),
                      m > d && (m = d),
                      m &&
                        (n.head &&
                          ((xe = n.head.extra_len - n.length),
                          n.head.extra ||
                            (n.head.extra = new Array(n.head.extra_len)),
                          g.arraySet(n.head.extra, a, s, m, xe)),
                        512 & n.flags && (n.check = y(n.check, a, m, s)),
                        (d -= m),
                        (s += m),
                        (n.length -= m)),
                      n.length)
                    )
                      break e;
                    (n.length = 0), (n.mode = j);
                  case j:
                    if (2048 & n.flags) {
                      if (0 === d) break e;
                      m = 0;
                      do
                        (xe = a[s + m++]),
                          n.head &&
                            xe &&
                            n.length < 65536 &&
                            (n.head.name += String.fromCharCode(xe));
                      while (xe && m < d);
                      if (
                        (512 & n.flags && (n.check = y(n.check, a, m, s)),
                        (d -= m),
                        (s += m),
                        xe)
                      )
                        break e;
                    } else n.head && (n.head.name = null);
                    (n.length = 0), (n.mode = P);
                  case P:
                    if (4096 & n.flags) {
                      if (0 === d) break e;
                      m = 0;
                      do
                        (xe = a[s + m++]),
                          n.head &&
                            xe &&
                            n.length < 65536 &&
                            (n.head.comment += String.fromCharCode(xe));
                      while (xe && m < d);
                      if (
                        (512 & n.flags && (n.check = y(n.check, a, m, s)),
                        (d -= m),
                        (s += m),
                        xe)
                      )
                        break e;
                    } else n.head && (n.head.comment = null);
                    n.mode = q;
                  case q:
                    if (512 & n.flags) {
                      for (; h < 16; ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      if (f !== (65535 & n.check)) {
                        (e.msg = "header crc mismatch"), (n.mode = fe);
                        break;
                      }
                      (f = 0), (h = 0);
                    }
                    n.head &&
                      ((n.head.hcrc = (n.flags >> 9) & 1), (n.head.done = !0)),
                      (e.adler = n.check = 0),
                      (n.mode = K);
                    break;
                  case G:
                    for (; h < 32; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    (e.adler = n.check = r(f)), (f = 0), (h = 0), (n.mode = X);
                  case X:
                    if (0 === n.havedict)
                      return (
                        (e.next_out = o),
                        (e.avail_out = l),
                        (e.next_in = s),
                        (e.avail_in = d),
                        (n.hold = f),
                        (n.bits = h),
                        B
                      );
                    (e.adler = n.check = 1), (n.mode = K);
                  case K:
                    if (t === C || t === R) break e;
                  case V:
                    if (n.last) {
                      (f >>>= 7 & h), (h -= 7 & h), (n.mode = le);
                      break;
                    }
                    for (; h < 3; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    switch (((n.last = 1 & f), (f >>>= 1), (h -= 1), 3 & f)) {
                      case 0:
                        n.mode = Y;
                        break;
                      case 1:
                        if ((u(n), (n.mode = ne), t === R)) {
                          (f >>>= 2), (h -= 2);
                          break e;
                        }
                        break;
                      case 2:
                        n.mode = $;
                        break;
                      case 3:
                        (e.msg = "invalid block type"), (n.mode = fe);
                    }
                    (f >>>= 2), (h -= 2);
                    break;
                  case Y:
                    for (f >>>= 7 & h, h -= 7 & h; h < 32; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    if ((65535 & f) !== ((f >>> 16) ^ 65535)) {
                      (e.msg = "invalid stored block lengths"), (n.mode = fe);
                      break;
                    }
                    if (
                      ((n.length = 65535 & f),
                      (f = 0),
                      (h = 0),
                      (n.mode = Q),
                      t === R)
                    )
                      break e;
                  case Q:
                    n.mode = J;
                  case J:
                    if ((m = n.length)) {
                      if ((m > d && (m = d), m > l && (m = l), 0 === m))
                        break e;
                      g.arraySet(i, a, s, m, o),
                        (d -= m),
                        (s += m),
                        (l -= m),
                        (o += m),
                        (n.length -= m);
                      break;
                    }
                    n.mode = K;
                    break;
                  case $:
                    for (; h < 14; ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    if (
                      ((n.nlen = (31 & f) + 257),
                      (f >>>= 5),
                      (h -= 5),
                      (n.ndist = (31 & f) + 1),
                      (f >>>= 5),
                      (h -= 5),
                      (n.ncode = (15 & f) + 4),
                      (f >>>= 4),
                      (h -= 4),
                      n.nlen > 286 || n.ndist > 30)
                    ) {
                      (e.msg = "too many length or distance symbols"),
                        (n.mode = fe);
                      break;
                    }
                    (n.have = 0), (n.mode = ee);
                  case ee:
                    for (; n.have < n.ncode; ) {
                      for (; h < 3; ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      (n.lens[Re[n.have++]] = 7 & f), (f >>>= 3), (h -= 3);
                    }
                    for (; n.have < 19; ) n.lens[Re[n.have++]] = 0;
                    if (
                      ((n.lencode = n.lendyn),
                      (n.lenbits = 7),
                      (Ee = { bits: n.lenbits }),
                      (_e = x(_, n.lens, 0, 19, n.lencode, 0, n.work, Ee)),
                      (n.lenbits = Ee.bits),
                      _e)
                    ) {
                      (e.msg = "invalid code lengths set"), (n.mode = fe);
                      break;
                    }
                    (n.have = 0), (n.mode = te);
                  case te:
                    for (; n.have < n.nlen + n.ndist; ) {
                      for (
                        ;
                        (Oe = n.lencode[f & ((1 << n.lenbits) - 1)]),
                          (me = Oe >>> 24),
                          (we = (Oe >>> 16) & 255),
                          (ge = 65535 & Oe),
                          !(me <= h);

                      ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      if (ge < 16)
                        (f >>>= me), (h -= me), (n.lens[n.have++] = ge);
                      else {
                        if (16 === ge) {
                          for (Se = me + 2; h < Se; ) {
                            if (0 === d) break e;
                            d--, (f += a[s++] << h), (h += 8);
                          }
                          if (((f >>>= me), (h -= me), 0 === n.have)) {
                            (e.msg = "invalid bit length repeat"),
                              (n.mode = fe);
                            break;
                          }
                          (xe = n.lens[n.have - 1]),
                            (m = 3 + (3 & f)),
                            (f >>>= 2),
                            (h -= 2);
                        } else if (17 === ge) {
                          for (Se = me + 3; h < Se; ) {
                            if (0 === d) break e;
                            d--, (f += a[s++] << h), (h += 8);
                          }
                          (f >>>= me),
                            (h -= me),
                            (xe = 0),
                            (m = 3 + (7 & f)),
                            (f >>>= 3),
                            (h -= 3);
                        } else {
                          for (Se = me + 7; h < Se; ) {
                            if (0 === d) break e;
                            d--, (f += a[s++] << h), (h += 8);
                          }
                          (f >>>= me),
                            (h -= me),
                            (xe = 0),
                            (m = 11 + (127 & f)),
                            (f >>>= 7),
                            (h -= 7);
                        }
                        if (n.have + m > n.nlen + n.ndist) {
                          (e.msg = "invalid bit length repeat"), (n.mode = fe);
                          break;
                        }
                        for (; m--; ) n.lens[n.have++] = xe;
                      }
                    }
                    if (n.mode === fe) break;
                    if (0 === n.lens[256]) {
                      (e.msg = "invalid code -- missing end-of-block"),
                        (n.mode = fe);
                      break;
                    }
                    if (
                      ((n.lenbits = 9),
                      (Ee = { bits: n.lenbits }),
                      (_e = x(E, n.lens, 0, n.nlen, n.lencode, 0, n.work, Ee)),
                      (n.lenbits = Ee.bits),
                      _e)
                    ) {
                      (e.msg = "invalid literal/lengths set"), (n.mode = fe);
                      break;
                    }
                    if (
                      ((n.distbits = 6),
                      (n.distcode = n.distdyn),
                      (Ee = { bits: n.distbits }),
                      (_e = x(
                        S,
                        n.lens,
                        n.nlen,
                        n.ndist,
                        n.distcode,
                        0,
                        n.work,
                        Ee
                      )),
                      (n.distbits = Ee.bits),
                      _e)
                    ) {
                      (e.msg = "invalid distances set"), (n.mode = fe);
                      break;
                    }
                    if (((n.mode = ne), t === R)) break e;
                  case ne:
                    n.mode = re;
                  case re:
                    if (d >= 6 && l >= 258) {
                      (e.next_out = o),
                        (e.avail_out = l),
                        (e.next_in = s),
                        (e.avail_in = d),
                        (n.hold = f),
                        (n.bits = h),
                        k(e, b),
                        (o = e.next_out),
                        (i = e.output),
                        (l = e.avail_out),
                        (s = e.next_in),
                        (a = e.input),
                        (d = e.avail_in),
                        (f = n.hold),
                        (h = n.bits),
                        n.mode === K && (n.back = -1);
                      break;
                    }
                    for (
                      n.back = 0;
                      (Oe = n.lencode[f & ((1 << n.lenbits) - 1)]),
                        (me = Oe >>> 24),
                        (we = (Oe >>> 16) & 255),
                        (ge = 65535 & Oe),
                        !(me <= h);

                    ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    if (we && 0 === (240 & we)) {
                      for (
                        ve = me, ye = we, ke = ge;
                        (Oe =
                          n.lencode[ke + ((f & ((1 << (ve + ye)) - 1)) >> ve)]),
                          (me = Oe >>> 24),
                          (we = (Oe >>> 16) & 255),
                          (ge = 65535 & Oe),
                          !(ve + me <= h);

                      ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      (f >>>= ve), (h -= ve), (n.back += ve);
                    }
                    if (
                      ((f >>>= me),
                      (h -= me),
                      (n.back += me),
                      (n.length = ge),
                      0 === we)
                    ) {
                      n.mode = de;
                      break;
                    }
                    if (32 & we) {
                      (n.back = -1), (n.mode = K);
                      break;
                    }
                    if (64 & we) {
                      (e.msg = "invalid literal/length code"), (n.mode = fe);
                      break;
                    }
                    (n.extra = 15 & we), (n.mode = ae);
                  case ae:
                    if (n.extra) {
                      for (Se = n.extra; h < Se; ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      (n.length += f & ((1 << n.extra) - 1)),
                        (f >>>= n.extra),
                        (h -= n.extra),
                        (n.back += n.extra);
                    }
                    (n.was = n.length), (n.mode = ie);
                  case ie:
                    for (
                      ;
                      (Oe = n.distcode[f & ((1 << n.distbits) - 1)]),
                        (me = Oe >>> 24),
                        (we = (Oe >>> 16) & 255),
                        (ge = 65535 & Oe),
                        !(me <= h);

                    ) {
                      if (0 === d) break e;
                      d--, (f += a[s++] << h), (h += 8);
                    }
                    if (0 === (240 & we)) {
                      for (
                        ve = me, ye = we, ke = ge;
                        (Oe =
                          n.distcode[
                            ke + ((f & ((1 << (ve + ye)) - 1)) >> ve)
                          ]),
                          (me = Oe >>> 24),
                          (we = (Oe >>> 16) & 255),
                          (ge = 65535 & Oe),
                          !(ve + me <= h);

                      ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      (f >>>= ve), (h -= ve), (n.back += ve);
                    }
                    if (((f >>>= me), (h -= me), (n.back += me), 64 & we)) {
                      (e.msg = "invalid distance code"), (n.mode = fe);
                      break;
                    }
                    (n.offset = ge), (n.extra = 15 & we), (n.mode = se);
                  case se:
                    if (n.extra) {
                      for (Se = n.extra; h < Se; ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      (n.offset += f & ((1 << n.extra) - 1)),
                        (f >>>= n.extra),
                        (h -= n.extra),
                        (n.back += n.extra);
                    }
                    if (n.offset > n.dmax) {
                      (e.msg = "invalid distance too far back"), (n.mode = fe);
                      break;
                    }
                    n.mode = oe;
                  case oe:
                    if (0 === l) break e;
                    if (((m = b - l), n.offset > m)) {
                      if (((m = n.offset - m), m > n.whave && n.sane)) {
                        (e.msg = "invalid distance too far back"),
                          (n.mode = fe);
                        break;
                      }
                      m > n.wnext
                        ? ((m -= n.wnext), (w = n.wsize - m))
                        : (w = n.wnext - m),
                        m > n.length && (m = n.length),
                        (be = n.window);
                    } else (be = i), (w = o - n.offset), (m = n.length);
                    m > l && (m = l), (l -= m), (n.length -= m);
                    do i[o++] = be[w++];
                    while (--m);
                    0 === n.length && (n.mode = re);
                    break;
                  case de:
                    if (0 === l) break e;
                    (i[o++] = n.length), l--, (n.mode = re);
                    break;
                  case le:
                    if (n.wrap) {
                      for (; h < 32; ) {
                        if (0 === d) break e;
                        d--, (f |= a[s++] << h), (h += 8);
                      }
                      if (
                        ((b -= l),
                        (e.total_out += b),
                        (n.total += b),
                        b &&
                          (e.adler = n.check = n.flags
                            ? y(n.check, i, b, o - b)
                            : v(n.check, i, b, o - b)),
                        (b = l),
                        (n.flags ? f : r(f)) !== n.check)
                      ) {
                        (e.msg = "incorrect data check"), (n.mode = fe);
                        break;
                      }
                      (f = 0), (h = 0);
                    }
                    n.mode = ue;
                  case ue:
                    if (n.wrap && n.flags) {
                      for (; h < 32; ) {
                        if (0 === d) break e;
                        d--, (f += a[s++] << h), (h += 8);
                      }
                      if (f !== (4294967295 & n.total)) {
                        (e.msg = "incorrect length check"), (n.mode = fe);
                        break;
                      }
                      (f = 0), (h = 0);
                    }
                    n.mode = ce;
                  case ce:
                    _e = W;
                    break e;
                  case fe:
                    _e = A;
                    break e;
                  case he:
                    return I;
                  case pe:
                  default:
                    return N;
                }
              return (
                (e.next_out = o),
                (e.avail_out = l),
                (e.next_in = s),
                (e.avail_in = d),
                (n.hold = f),
                (n.bits = h),
                (n.wsize ||
                  (b !== e.avail_out &&
                    n.mode < fe &&
                    (n.mode < le || t !== O))) &&
                c(e, e.output, e.next_out, b - e.avail_out)
                  ? ((n.mode = he), I)
                  : ((p -= e.avail_in),
                    (b -= e.avail_out),
                    (e.total_in += p),
                    (e.total_out += b),
                    (n.total += b),
                    n.wrap &&
                      b &&
                      (e.adler = n.check = n.flags
                        ? y(n.check, i, b, e.next_out - b)
                        : v(n.check, i, b, e.next_out - b)),
                    (e.data_type =
                      n.bits +
                      (n.last ? 64 : 0) +
                      (n.mode === K ? 128 : 0) +
                      (n.mode === ne || n.mode === Q ? 256 : 0)),
                    ((0 === p && 0 === b) || t === O) && _e === L && (_e = U),
                    _e)
              );
            }
            function h(e) {
              if (!e || !e.state) return N;
              var t = e.state;
              return t.window && (t.window = null), (e.state = null), L;
            }
            function p(e, t) {
              var n;
              return e && e.state
                ? ((n = e.state),
                  0 === (2 & n.wrap) ? N : ((n.head = t), (t.done = !1), L))
                : N;
            }
            function b(e, t) {
              var n,
                r,
                a,
                i = t.length;
              return e && e.state
                ? ((n = e.state),
                  0 !== n.wrap && n.mode !== X
                    ? N
                    : n.mode === X &&
                      ((r = 1), (r = v(r, t, i, 0)), r !== n.check)
                    ? A
                    : (a = c(e, t, i, i))
                    ? ((n.mode = he), I)
                    : ((n.havedict = 1), L))
                : N;
            }
            var m,
              w,
              g = e("../utils/common"),
              v = e("./adler32"),
              y = e("./crc32"),
              k = e("./inffast"),
              x = e("./inftrees"),
              _ = 0,
              E = 1,
              S = 2,
              O = 4,
              C = 5,
              R = 6,
              L = 0,
              W = 1,
              B = 2,
              N = -2,
              A = -3,
              I = -4,
              U = -5,
              T = 8,
              M = 1,
              H = 2,
              D = 3,
              Z = 4,
              z = 5,
              F = 6,
              j = 7,
              P = 8,
              q = 9,
              G = 10,
              X = 11,
              K = 12,
              V = 13,
              Y = 14,
              Q = 15,
              J = 16,
              $ = 17,
              ee = 18,
              te = 19,
              ne = 20,
              re = 21,
              ae = 22,
              ie = 23,
              se = 24,
              oe = 25,
              de = 26,
              le = 27,
              ue = 28,
              ce = 29,
              fe = 30,
              he = 31,
              pe = 32,
              be = 852,
              me = 592,
              we = 15,
              ge = we,
              ve = !0;
            (n.inflateReset = s),
              (n.inflateReset2 = o),
              (n.inflateResetKeep = i),
              (n.inflateInit = l),
              (n.inflateInit2 = d),
              (n.inflate = f),
              (n.inflateEnd = h),
              (n.inflateGetHeader = p),
              (n.inflateSetDictionary = b),
              (n.inflateInfo = "pako inflate (from Nodeca project)");
          },
          "zlib/constants.js": function (e, t, n) {
            "use strict";
            t.exports = {
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_BUF_ERROR: -5,
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              Z_BINARY: 0,
              Z_TEXT: 1,
              Z_UNKNOWN: 2,
              Z_DEFLATED: 8,
            };
          },
          "zlib/messages.js": function (e, t, n) {
            "use strict";
            t.exports = {
              2: "need dictionary",
              1: "stream end",
              0: "",
              "-1": "file error",
              "-2": "stream error",
              "-3": "data error",
              "-4": "insufficient memory",
              "-5": "buffer error",
              "-6": "incompatible version",
            };
          },
          "zlib/zstream.js": function (e, t, n) {
            "use strict";
            function r() {
              (this.input = null),
                (this.next_in = 0),
                (this.avail_in = 0),
                (this.total_in = 0),
                (this.output = null),
                (this.next_out = 0),
                (this.avail_out = 0),
                (this.total_out = 0),
                (this.msg = ""),
                (this.state = null),
                (this.data_type = 2),
                (this.adler = 0);
            }
            t.exports = r;
          },
          "zlib/gzheader.js": function (e, t, n) {
            "use strict";
            function r() {
              (this.text = 0),
                (this.time = 0),
                (this.xflags = 0),
                (this.os = 0),
                (this.extra = null),
                (this.extra_len = 0),
                (this.name = ""),
                (this.comment = ""),
                (this.hcrc = 0),
                (this.done = !1);
            }
            t.exports = r;
          },
          "zlib/adler32.js": function (e, t, n) {
            "use strict";
            function r(e, t, n, r) {
              for (
                var a = (65535 & e) | 0, i = ((e >>> 16) & 65535) | 0, s = 0;
                0 !== n;

              ) {
                (s = n > 2e3 ? 2e3 : n), (n -= s);
                do (a = (a + t[r++]) | 0), (i = (i + a) | 0);
                while (--s);
                (a %= 65521), (i %= 65521);
              }
              return a | (i << 16) | 0;
            }
            t.exports = r;
          },
          "zlib/crc32.js": function (e, t, n) {
            "use strict";
            function r() {
              for (var e, t = [], n = 0; n < 256; n++) {
                e = n;
                for (var r = 0; r < 8; r++)
                  e = 1 & e ? 3988292384 ^ (e >>> 1) : e >>> 1;
                t[n] = e;
              }
              return t;
            }
            function a(e, t, n, r) {
              var a = i,
                s = r + n;
              e ^= -1;
              for (var o = r; o < s; o++) e = (e >>> 8) ^ a[255 & (e ^ t[o])];
              return e ^ -1;
            }
            var i = r();
            t.exports = a;
          },
          "zlib/inffast.js": function (e, t, n) {
            "use strict";
            var r = 30,
              a = 12;
            t.exports = function (e, t) {
              var n,
                i,
                s,
                o,
                d,
                l,
                u,
                c,
                f,
                h,
                p,
                b,
                m,
                w,
                g,
                v,
                y,
                k,
                x,
                _,
                E,
                S,
                O,
                C,
                R;
              (n = e.state),
                (i = e.next_in),
                (C = e.input),
                (s = i + (e.avail_in - 5)),
                (o = e.next_out),
                (R = e.output),
                (d = o - (t - e.avail_out)),
                (l = o + (e.avail_out - 257)),
                (u = n.dmax),
                (c = n.wsize),
                (f = n.whave),
                (h = n.wnext),
                (p = n.window),
                (b = n.hold),
                (m = n.bits),
                (w = n.lencode),
                (g = n.distcode),
                (v = (1 << n.lenbits) - 1),
                (y = (1 << n.distbits) - 1);
              e: do {
                m < 15 &&
                  ((b += C[i++] << m), (m += 8), (b += C[i++] << m), (m += 8)),
                  (k = w[b & v]);
                t: for (;;) {
                  if (
                    ((x = k >>> 24),
                    (b >>>= x),
                    (m -= x),
                    (x = (k >>> 16) & 255),
                    0 === x)
                  )
                    R[o++] = 65535 & k;
                  else {
                    if (!(16 & x)) {
                      if (0 === (64 & x)) {
                        k = w[(65535 & k) + (b & ((1 << x) - 1))];
                        continue t;
                      }
                      if (32 & x) {
                        n.mode = a;
                        break e;
                      }
                      (e.msg = "invalid literal/length code"), (n.mode = r);
                      break e;
                    }
                    (_ = 65535 & k),
                      (x &= 15),
                      x &&
                        (m < x && ((b += C[i++] << m), (m += 8)),
                        (_ += b & ((1 << x) - 1)),
                        (b >>>= x),
                        (m -= x)),
                      m < 15 &&
                        ((b += C[i++] << m),
                        (m += 8),
                        (b += C[i++] << m),
                        (m += 8)),
                      (k = g[b & y]);
                    n: for (;;) {
                      if (
                        ((x = k >>> 24),
                        (b >>>= x),
                        (m -= x),
                        (x = (k >>> 16) & 255),
                        !(16 & x))
                      ) {
                        if (0 === (64 & x)) {
                          k = g[(65535 & k) + (b & ((1 << x) - 1))];
                          continue n;
                        }
                        (e.msg = "invalid distance code"), (n.mode = r);
                        break e;
                      }
                      if (
                        ((E = 65535 & k),
                        (x &= 15),
                        m < x &&
                          ((b += C[i++] << m),
                          (m += 8),
                          m < x && ((b += C[i++] << m), (m += 8))),
                        (E += b & ((1 << x) - 1)),
                        E > u)
                      ) {
                        (e.msg = "invalid distance too far back"), (n.mode = r);
                        break e;
                      }
                      if (((b >>>= x), (m -= x), (x = o - d), E > x)) {
                        if (((x = E - x), x > f && n.sane)) {
                          (e.msg = "invalid distance too far back"),
                            (n.mode = r);
                          break e;
                        }
                        if (((S = 0), (O = p), 0 === h)) {
                          if (((S += c - x), x < _)) {
                            _ -= x;
                            do R[o++] = p[S++];
                            while (--x);
                            (S = o - E), (O = R);
                          }
                        } else if (h < x) {
                          if (((S += c + h - x), (x -= h), x < _)) {
                            _ -= x;
                            do R[o++] = p[S++];
                            while (--x);
                            if (((S = 0), h < _)) {
                              (x = h), (_ -= x);
                              do R[o++] = p[S++];
                              while (--x);
                              (S = o - E), (O = R);
                            }
                          }
                        } else if (((S += h - x), x < _)) {
                          _ -= x;
                          do R[o++] = p[S++];
                          while (--x);
                          (S = o - E), (O = R);
                        }
                        for (; _ > 2; )
                          (R[o++] = O[S++]),
                            (R[o++] = O[S++]),
                            (R[o++] = O[S++]),
                            (_ -= 3);
                        _ && ((R[o++] = O[S++]), _ > 1 && (R[o++] = O[S++]));
                      } else {
                        S = o - E;
                        do
                          (R[o++] = R[S++]),
                            (R[o++] = R[S++]),
                            (R[o++] = R[S++]),
                            (_ -= 3);
                        while (_ > 2);
                        _ && ((R[o++] = R[S++]), _ > 1 && (R[o++] = R[S++]));
                      }
                      break;
                    }
                  }
                  break;
                }
              } while (i < s && o < l);
              (_ = m >> 3),
                (i -= _),
                (m -= _ << 3),
                (b &= (1 << m) - 1),
                (e.next_in = i),
                (e.next_out = o),
                (e.avail_in = i < s ? 5 + (s - i) : 5 - (i - s)),
                (e.avail_out = o < l ? 257 + (l - o) : 257 - (o - l)),
                (n.hold = b),
                (n.bits = m);
            };
          },
          "zlib/inftrees.js": function (e, t, n) {
            "use strict";
            var r = e("../utils/common"),
              a = 15,
              i = 852,
              s = 592,
              o = 0,
              d = 1,
              l = 2,
              u = [
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                13,
                15,
                17,
                19,
                23,
                27,
                31,
                35,
                43,
                51,
                59,
                67,
                83,
                99,
                115,
                131,
                163,
                195,
                227,
                258,
                0,
                0,
              ],
              c = [
                16,
                16,
                16,
                16,
                16,
                16,
                16,
                16,
                17,
                17,
                17,
                17,
                18,
                18,
                18,
                18,
                19,
                19,
                19,
                19,
                20,
                20,
                20,
                20,
                21,
                21,
                21,
                21,
                16,
                72,
                78,
              ],
              f = [
                1,
                2,
                3,
                4,
                5,
                7,
                9,
                13,
                17,
                25,
                33,
                49,
                65,
                97,
                129,
                193,
                257,
                385,
                513,
                769,
                1025,
                1537,
                2049,
                3073,
                4097,
                6145,
                8193,
                12289,
                16385,
                24577,
                0,
                0,
              ],
              h = [
                16,
                16,
                16,
                16,
                17,
                17,
                18,
                18,
                19,
                19,
                20,
                20,
                21,
                21,
                22,
                22,
                23,
                23,
                24,
                24,
                25,
                25,
                26,
                26,
                27,
                27,
                28,
                28,
                29,
                29,
                64,
                64,
              ];
            t.exports = function (e, t, n, p, b, m, w, g) {
              var v,
                y,
                k,
                x,
                _,
                E,
                S,
                O,
                C,
                R = g.bits,
                L = 0,
                W = 0,
                B = 0,
                N = 0,
                A = 0,
                I = 0,
                U = 0,
                T = 0,
                M = 0,
                H = 0,
                D = null,
                Z = 0,
                z = new r.Buf16(a + 1),
                F = new r.Buf16(a + 1),
                j = null,
                P = 0;
              for (L = 0; L <= a; L++) z[L] = 0;
              for (W = 0; W < p; W++) z[t[n + W]]++;
              for (A = R, N = a; N >= 1 && 0 === z[N]; N--);
              if ((A > N && (A = N), 0 === N))
                return (
                  (b[m++] = 20971520), (b[m++] = 20971520), (g.bits = 1), 0
                );
              for (B = 1; B < N && 0 === z[B]; B++);
              for (A < B && (A = B), T = 1, L = 1; L <= a; L++)
                if (((T <<= 1), (T -= z[L]), T < 0)) return -1;
              if (T > 0 && (e === o || 1 !== N)) return -1;
              for (F[1] = 0, L = 1; L < a; L++) F[L + 1] = F[L] + z[L];
              for (W = 0; W < p; W++) 0 !== t[n + W] && (w[F[t[n + W]]++] = W);
              if (
                (e === o
                  ? ((D = j = w), (E = 19))
                  : e === d
                  ? ((D = u), (Z -= 257), (j = c), (P -= 257), (E = 256))
                  : ((D = f), (j = h), (E = -1)),
                (H = 0),
                (W = 0),
                (L = B),
                (_ = m),
                (I = A),
                (U = 0),
                (k = -1),
                (M = 1 << A),
                (x = M - 1),
                (e === d && M > i) || (e === l && M > s))
              )
                return 1;
              for (;;) {
                (S = L - U),
                  w[W] < E
                    ? ((O = 0), (C = w[W]))
                    : w[W] > E
                    ? ((O = j[P + w[W]]), (C = D[Z + w[W]]))
                    : ((O = 96), (C = 0)),
                  (v = 1 << (L - U)),
                  (y = 1 << I),
                  (B = y);
                do
                  (y -= v),
                    (b[_ + (H >> U) + y] = (S << 24) | (O << 16) | C | 0);
                while (0 !== y);
                for (v = 1 << (L - 1); H & v; ) v >>= 1;
                if (
                  (0 !== v ? ((H &= v - 1), (H += v)) : (H = 0),
                  W++,
                  0 === --z[L])
                ) {
                  if (L === N) break;
                  L = t[n + w[W]];
                }
                if (L > A && (H & x) !== k) {
                  for (
                    0 === U && (U = A), _ += B, I = L - U, T = 1 << I;
                    I + U < N && ((T -= z[I + U]), !(T <= 0));

                  )
                    I++, (T <<= 1);
                  if (((M += 1 << I), (e === d && M > i) || (e === l && M > s)))
                    return 1;
                  (k = H & x), (b[k] = (A << 24) | (I << 16) | (_ - m) | 0);
                }
              }
              return (
                0 !== H && (b[_ + H] = ((L - U) << 24) | (64 << 16) | 0),
                (g.bits = A),
                0
              );
            };
          },
        };
        for (var n in t) t[n].folder = n.substring(0, n.lastIndexOf("/") + 1);
        var r = function (e) {
            var n = [];
            return (
              (e = e.split("/").every(function (e) {
                return ".." == e ? n.pop() : "." == e || "" == e || n.push(e);
              })
                ? n.join("/")
                : null),
              e ? t[e] || t[e + ".js"] || t[e + "/index.js"] : null
            );
          },
          a = function (e, t) {
            return e
              ? r(e.folder + "node_modules/" + t) || a(e.parent, t)
              : null;
          },
          i = function (e, t) {
            var n = t.match(/^\//)
              ? null
              : e
              ? t.match(/^\.\.?\//)
                ? r(e.folder + t)
                : a(e, t)
              : r(t);
            if (!n) throw "module not found: " + t;
            return (
              n.exports ||
                ((n.parent = e), n(i.bind(null, n), n, (n.exports = {}))),
              n.exports
            );
          };
        return i(null, e);
      },
      decompress: function (e) {
        this.exports || (this.exports = this.require("inflate.js"));
        try {
          return this.exports.inflate(e);
        } catch (e) {}
      },
      hasUnityMarker: function (e) {
        var t = 10,
          n = "UnityWeb Compressed Content (gzip)";
        if (t > e.length || 31 != e[0] || 139 != e[1]) return !1;
        var r = e[3];
        if (4 & r) {
          if (t + 2 > e.length) return !1;
          if (((t += 2 + e[t] + (e[t + 1] << 8)), t > e.length)) return !1;
        }
        if (8 & r) {
          for (; t < e.length && e[t]; ) t++;
          if (t + 1 > e.length) return !1;
          t++;
        }
        return (
          16 & r &&
          String.fromCharCode.apply(null, e.subarray(t, t + n.length + 1)) ==
            n + "\0"
        );
      },
    },
  };
  return new Promise(function (e, t) {
    u.SystemInfo.hasWebGL
      ? u.SystemInfo.hasWasm
        ? (1 == u.SystemInfo.hasWebGL &&
            u.print(
              'Warning: Your browser does not support "WebGL 2.0" Graphics API, switching to "WebGL 1.0"'
            ),
          (u.startupErrorHandler = t),
          n(0),
          u.postRun.push(function () {
            n(1), delete u.startupErrorHandler, e(f);
          }),
          l())
        : t("Your browser does not support WebAssembly.")
      : t("Your browser does not support WebGL.");
  });
}
