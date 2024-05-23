import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
[
  "courseicons",
  "hax",
  "lrn",
  "mdextra",
  "mdi-social",
  "editable-table",
  "drawing",
  "paper-audio-icons",
].forEach((i) => {
  SimpleIconsetStore.registerIconset(
    i,
    `${new URL("./simple-hax-iconset.js", import.meta.url).href}/../svgs/${i}/`,
  );
});
