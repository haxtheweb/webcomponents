const windowControllers = new AbortController();
// loader that uses a CSS selector and variables in order to auto generate outlines
var WCRegistryLoaderCSSDebounce;
export function WCRegistryLoaderCSS(
  auto = false,
  parent = "*",
  selectorBase = ":not(:defined)",
) {
  // debounce entire call automatically in case of spamming as new things get added to screen
  clearTimeout(WCRegistryLoaderCSSDebounce);
  WCRegistryLoaderCSSDebounce = setTimeout(() => {
    // default selector is anything that says to operate this way
    let selector = parent + "[laser-loader]" + selectorBase;
    // much more aggressive, apply loading to ANYTHING not defined
    // previously. This needs more testing but would assume everything
    // has its box model in shape at run time w/ css fallbacks which is
    // probably not a realistic assumption but worth trying in the end
    if (auto) {
      selector = parent + selectorBase;
    }
    // map all results of our selector
    [...document.body.querySelectorAll("replace-tag," + selector)].map((el) => {
      // automaticlaly set the laser loader flag if told
      if (auto) {
        el.setAttribute("laser-loader", "laser-loader");
      }
      // calc the box model's definition for height and width
      const d = el.getBoundingClientRect();
      el.style.setProperty("--laserEdgeAni-width", d.width + "px");
      el.style.setProperty("--laserEdgeAni-innerWidth", d.width - 2 + "px");
      el.style.setProperty("--laserEdgeAni-innerHeight", d.height - 2 + "px");
      el.style.setProperty("--laserEdgeAni-height", d.height + "px");
      customElements.whenDefined(el.localName).then((response) => {
        if (el.localName != "replace-tag") {
          // this would be a way of doing loading state on ANYTHING without definition
          el.setAttribute("loaded", "loaded");
          el.removeAttribute("laser-loader");
          el.style.setProperty("--laserEdgeAni-width", null);
          el.style.setProperty("--laserEdgeAni-innerWidth", null);
          el.style.setProperty("--laserEdgeAni-height", null);
          el.style.setProperty("--laserEdgeAni-innerHeight", null);
          // delay this bc if it has the pop up loader on it it needs to wait to finish the animation
          setTimeout(() => {
            el.removeAttribute("popup-loader");
            // clean up loaded state as if none of this ever happened
            setTimeout(() => {
              el.removeAttribute("loaded");
            }, 1000);
          }, 1000);
        }
      });
    });
  }, 10);
}
var WCRegistryLoaderCSSDebounce2;
const loadingStylesResizeEvent = function () {
  clearTimeout(WCRegistryLoaderCSSDebounce2);
  WCRegistryLoaderCSSDebounce2 = setTimeout(() => {
    // ensure we have something undefind
    if (
      globalThis.document.body.querySelectorAll("replace-tag,:not(:defined)")
        .length > 0
    ) {
      WCRegistryLoaderCSS();
    } else {
      // we no longer have anything defined so remove self listening
      windowControllers.abort();
    }
  }, 100);
};
// resize function incase the screen changes shape while still loading (like phone rotating)
globalThis.addEventListener("resize", loadingStylesResizeEvent, {
  signal: windowControllers.signal,
});
