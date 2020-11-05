import {
  pathResolver,
  SimpleIconsetStore,
} from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
["courseicons", "hax", "lrn", "mdextra", "mdi-social"].forEach((i) => {
  SimpleIconsetStore.registerIconset(
    i,
    `${pathResolver(import.meta.url)}svgs/${i}/`
  );
});
