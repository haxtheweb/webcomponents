import { pathResolver } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
window.SimpleIconset.requestAvailability().registerIconset(
  "hax",
  `${pathResolver(import.meta.url)}svgs/`
);
