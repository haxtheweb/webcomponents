// Serialize the HAX_FUZZ_* variables from the test runner's environment into a
// JS object literal for the browser test page (web-test-runner.config.mjs puts
// it on window.process.env so scripts/test-setup/fuzz-config.mjs can read it).
// Only HAX_FUZZ_* keys are forwarded, and "<" is escaped so a value can never
// close the inline <script> it is written into.
export function fuzzEnvScript(env) {
  const source = env || {};
  const picked = {};
  Object.keys(source)
    .filter((key) => /^HAX_FUZZ_[A-Z]+$/.test(key))
    .sort()
    .forEach((key) => {
      picked[key] = String(source[key]);
    });
  // escape "<" (closing tags) and U+2028/U+2029 (line breaks in inline JS)
  return JSON.stringify(picked).replace(
    /[<\u2028\u2029]/g,
    (ch) => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}
