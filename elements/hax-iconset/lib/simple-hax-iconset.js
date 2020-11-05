import {
  pathResolver,
  SimpleIconsetStore,
} from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
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
    `${pathResolver(import.meta.url)}svgs/${i}/`
  );
});
