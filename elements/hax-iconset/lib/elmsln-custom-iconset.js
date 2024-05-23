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
