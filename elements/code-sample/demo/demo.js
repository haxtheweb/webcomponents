import { oneDark } from "../lib/themes/one-dark.js";
import { oneLight } from "../lib/themes/one-light.js";
import { defaultTheme } from "../lib/themes/default.js";
import { github } from "../lib/themes/github.js";
import { solarizedLight } from "../lib/themes/solarized-light.js";
import { solarizedDark } from "../lib/themes/solarized-dark.js";
import { kustomLight } from "../lib/themes/kustom-light.js";
import { kustomDark } from "../lib/themes/kustom-dark.js";

const themes = {
  oneDark,
  oneLight,
  defaultTheme,
  github,
  solarizedLight,
  solarizedDark,
  kustomLight,
  kustomDark,
};

const changeTheme = (e) => {
  const theme = e.target.value;
  const demo = document.querySelector(e.target.dataset.target);
  demo.theme = themes[theme];
};

const selects = document.querySelectorAll("select");
[].forEach.call(selects, (select) => {
  select.addEventListener("change", changeTheme);
});
