// HAXcms specific clean up and platforn integration
// this ties in custom theme files as well as removes DOM nodes related
// to serving a legacy audience in the event this is evergreen (most times)
if (/^h/.test(document.location)) {
  try {
    var def = document.getElementsByTagName("script")[0];
    // if a dynamic import fails, we bail over to the compiled version
    new Function('import("");');
    // remove fallback cause if we passed dynamic import then we are evergreen
    if (document.getElementById("haxcmsoutdatedfallback")) {
      document.body.removeChild(
        document.getElementById("haxcmsoutdatedfallback"),
      );
    }
    if (!window.__appCustomEnv) {
      var build2 = document.createElement("script");
      build2.src = "./custom/build/custom.es6.js";
      build2.type = "module";
      def.parentNode.insertBefore(build2, def);
    }
  } catch (err) {
    var ancient = false;
    try {
      if (typeof Symbol == "undefined") {
        // IE 11, at least try to serve a watered down site
        ancient = true;
      }
      new Function("let a;"); // bizarre but needed for Safari 9 bc of when it was made
    } catch (err) {
      ancient = true;
    }
    if (!ancient) {
      // remove fallback cause if we passed dynamic import then we are evergreen
      if (document.getElementById("haxcmsoutdatedfallback")) {
        document.body.removeChild(
          document.getElementById("haxcmsoutdatedfallback"),
        );
      }
    } else {
      // we bombed somewhere above, this implies that it's some odd between version
      // most likely Safari 9ish, IE pre 11 and anything uber old. Serve no JS variation
      if (document.getElementById("site")) {
        document.getElementById("site").style.display = "none";
        document.getElementById(
          "haxcmsoutdatedfallbacksuperold",
        ).style.display = "block";
      }
    }
  }
} else {
  // this implies we are offline, viewing the files locally
  // so let's show the simplistic site viewer / iframe theme
  if (document.getElementById("site")) {
    document.getElementById("site").style.display = "none";
    document.getElementById("haxcmsoutdatedfallbacksuperold").style.display =
      "block";
  }
}
var cdn = "./";
if (window.__appCDN) {
  cdn = window.__appCDN;
}
// css files load faster when implemented this way
var link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  cdn + "build/es6/node_modules/@haxtheweb/haxcms-elements/lib/base.css";
link.type = "text/css";
def.parentNode.insertBefore(link, def);
if (!window.__appCustomEnv) {
  var link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href = "./theme/theme.css";
  link2.type = "text/css";
  def.parentNode.insertBefore(link2, def);
}
