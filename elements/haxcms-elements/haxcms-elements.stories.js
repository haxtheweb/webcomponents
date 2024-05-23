import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-insights.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
// need to account for polymer goofiness when webpack rolls this up
const base = "https://haxtheweb.org/";
setTimeout(async () => {
  window.localStorage.setItem(
    `haxcms-demo-manifest`,
    JSON.stringify(await fetch(`${base}site.json`).then((e) => e.json())),
  );
}, 0);

export default {
  title: "HAX|HAXcms",
  component: "micro-frontend-registry",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

export const Codepen = () => {
  return getRenderString(html`
    <h1>Codepen of haxcms</h1>
    <p>
      Unfortunately due to limitations of how storybook does bundling, haxcms is
      difficult to load into the context of it. Here's an iframe to
      <a href="https://codepen.io/btopro/pen/NWyQGaM"
        >https://codepen.io/btopro/pen/NWyQGaM</a
      >
      which is not the latest but at least something.
    </p>
    <iframe
      src="https://codepen.io/btopro/embed/NWyQGaM"
      width="100%"
      height="600px"
    ></iframe>
  `);
};

// via https://stackoverflow.com/questions/70657298/render-lit-lit-html-templateresult-as-string
const getRenderString = (data) => {
  const { strings, values } = data;
  const v = [...values, ""].map((e) =>
    typeof e === "object" ? getRenderString(e) : e,
  );
  return strings.reduce((acc, s, i) => acc + s + v[i], "");
};
// site insights
export const SiteInsights = () => {
  // tee up a demo
  if (JSON.parse(window.localStorage.getItem(`haxcms-demo-manifest`))) {
    const manifest = JSON.parse(
      window.localStorage.getItem(`haxcms-demo-manifest`),
    );
    store.loadManifest(manifest);
    // sets to UX concepts as default so that we get a faster initial render
    store.activeId = "item-06233713-d866-3351-81da-841d3931144c";
    return getRenderString(
      html`<haxcms-site-insights base="${base}"></haxcms-site-insights> `,
    );
  } else {
    return getRenderString(
      html`<p>
        This element requires a manifest to be loaded, if this is blank, wait a
        second and hit refresh
      </p>`,
    );
  }
};
