import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { MicroFrontendRegistry } from "./micro-frontend-registry.js";
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

export const UsingMF = () => {
  return getRenderString(html`
    <h1>Using supported Micro-frontends</h1>
    <p>
      All microservices used to support our front end assets are free to use and exposed as part
      of our larger web components library. If available, they'll show up for usage in <code>h-a-x</code> and other
      elements we support.
    </p>
    <p>
      This element is a singleton and is not to be used directly. Invoking it is mearly to
      estable that there CAN be microservices in the application / page in question. This
      is to be used behind the scenes to ensure things like the tags shown are available.
    </p>
  `) + utils.makeElementFromClass(MicroFrontendRegistry).outerHTML;
};
// via https://stackoverflow.com/questions/70657298/render-lit-lit-html-templateresult-as-string
const getRenderString = (data) => {
  const {strings, values} = data;
  const v = [...values, ''].map(e => typeof e === 'object' ? getRenderString(e) : e )      
  return strings.reduce((acc,s, i) => acc + s + v[i], '')
}