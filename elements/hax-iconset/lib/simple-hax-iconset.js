/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
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
