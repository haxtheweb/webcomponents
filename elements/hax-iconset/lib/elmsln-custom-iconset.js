import("@lrnwebcomponents/simple-icon/lib/simple-iconset.js").then(() => {
  if (
    window.Drupal &&
    window.Drupal.settings &&
    window.Drupal.settings.basePath
  ) {
    window.SimpleIconset.requestAvailability().registerIconset(
      "elmsln-custom-icons",
      `${Drupal.settings.basePath}sites/all/libraries/_my_libraries/elmsln-custom-icons/`
    );
  }
});
