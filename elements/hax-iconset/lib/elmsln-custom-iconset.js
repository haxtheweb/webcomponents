/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import("@haxtheweb/simple-icon/lib/simple-iconset.js").then(() => {
  if (
    globalThis.Drupal &&
    globalThis.Drupal.settings &&
    globalThis.Drupal.settings.basePath
  ) {
    globalThis.SimpleIconset.requestAvailability().registerIconset(
      "elmsln-custom-icons",
      `${Drupal.settings.basePath}sites/all/libraries/_my_libraries/elmsln-custom-icons/`,
    );
  }
});
