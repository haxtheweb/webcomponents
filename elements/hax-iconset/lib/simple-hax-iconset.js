import "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";

const iconset = window.SimpleIconset.requestAvailability();
iconset.registerIconset('hax', {
    "code-json": pathFromUrl(decodeURIComponent(import.meta.url)) + "lib/svgs/code-json.svg"
});

function pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  