import {
  pathResolver,
  SimpleIconsetStore,
} from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
["hax", "lrn", "courseicons"].forEach((i) => {
  SimpleIconsetStore.registerIconset(
    i,
    `${pathResolver(import.meta.url)}svgs/${i}/`
  );
});
