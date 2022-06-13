import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import "./micro-frontend-registry.js";
import "./demo/mf-htmlmd-example.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Micro-frontends|Registry",
  component: "micro-frontend-registry",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities(),
  demostyle =
    "margin:0 -8px 40px;padding:0;box-shadow:none;border-bottom:1px solid #e0e0e0;";

export const usage = () => {
  return getRenderString(html`
    <h1>Using supported Micro-frontends</h1>
    <p>
      All microservices used to support our front end assets are free to use and
      exposed as part of our larger web components library. If available,
      they'll show up for usage in <code>h-a-x</code> and other elements we
      support.
    </p>
    <p>
      This element is a singleton and is not to be used directly. Invoking it is
      mearly to estable that there CAN be microservices in the application /
      page in question. This is to be used behind the scenes to ensure things
      like the tags shown are available.
    </p>
  `);
};
export const example = () => {
  return getRenderString(html`
  <h3>Basic micro-frontend-registry demo</h3>
      <p>This is illustrating 2 services working together off of the vercel version of this monorepo.
        One converts HTML to MD and the toher converts MD to HTML. When clicking the arrow direction between fields
        you'll be witnessing this conversion back and forth. See console for additional log details / stats.
      </p>
      <p>
        Try any HTML or MD in either side OR try a link like:
        <ul>
          <li>https://oer.hax.psu.edu/bto108/sites/edtechjoker/pages/item-753c6f44-87f2-4a02-b145-b63cc592e3d5/index.html?1653328286</li>
          <li>https://raw.githubusercontent.com/elmsln/edtechjoker/master/draft-outline.md</li>
        </ul>
      </p>
      <mf-htmlmd-example></mf-htmlmd-example>
  `);
};
// via https://stackoverflow.com/questions/70657298/render-lit-lit-html-templateresult-as-string
const getRenderString = (data) => {
  const { strings, values } = data;
  const v = [...values, ""].map((e) =>
    typeof e === "object" ? getRenderString(e) : e
  );
  return strings.reduce((acc, s, i) => acc + s + v[i], "");
};
