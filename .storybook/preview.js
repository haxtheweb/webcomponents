import {
  addParameters,
  addDecorator,
  setCustomElements,
  withA11y,
} from "@open-wc/demoing-storybook";

addDecorator(withA11y);

addParameters({
  options: {
    panelPosition: "right",
    sortStoriesByKind: true,
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, { numeric: true }),
    theme: {
      base: "light",

      colorPrimary: "hotpink",
      colorSecondary: "deepskyblue",

      /* UI*/
      appBg: "rgb(246, 249, 252)",
      appContentBg: "white",
      appBorderColor: "grey",
      appBorderRadius: 4,

      // Typography
      fontBase: '"Open Sans", sans-serif',
      fontCode: "monospace",

      // Text colors
      textColor: "rgb(51, 51, 51)",
      textInverseColor: "rgba(255,255,255,0.9)",

      // Toolbar default and active colors
      barTextColor: "rgb(153, 153, 153)",
      barSelectedColor: "deepskyblue",
      barBg: "white",

      // Form colors
      inputBg: "white",
      inputBorder: "rgb(153, 153, 153)",
      inputTextColor: "rgb(51, 51, 51)",
      inputBorderRadius: 4,

      brandTitle: "ELMS:LN lrnwebcompomnents",
      brandUrl: "https://github.com/elmsln/lrnwebcomponents",
    },
  },
  a11y: {
    config: {},
    options: {
      checks: { "color-contrast": { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  docs: {
    iframeHeight: "200px",
  },
  backgrounds: [
    {
      name: "light",
      value: "#fff",
      default: true,
    },
    {
      name: "dark",
      value: "#252525",
    },
    {
      name: "saturated",
      value: "#007a87",
    },
  ],
});

async function run() {
  const customElements = await (
    await fetch(new URL("../custom-elements.json", import.meta.url))
  ).json();

  setCustomElements(customElements);
}

run();
// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
