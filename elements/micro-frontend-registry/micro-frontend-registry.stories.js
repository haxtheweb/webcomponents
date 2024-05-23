import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { MicroFrontendRegistry } from "./micro-frontend-registry.js";
import "./demo/mf-htmlmd-example.js";
import "./demo/docx-example.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Microservices|Core services",
  component: "micro-frontend-registry",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

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
export const mdToHtml = () => {
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
      <mf-htmlmd-example mdhtml></mf-htmlmd-example>
  `);
};

export const duckDuckGo = () => {
  return getRenderString(html`
    <h3>Duck duck go search</h3>
    <p>Check console after search</p>
    <mf-htmlmd-example ddg></mf-htmlmd-example>
  `);
};

export const haxcmsFullSite = () => {
  return getRenderString(html`
    <h3>Enter a HAXcms site URL</h3>
    <p>You'll be given the full HTML source of the entire site</p>
    <mf-htmlmd-example haxcms></mf-htmlmd-example>
  `);
};

export const simpleImgRemixer = () => {
  return getRenderString(html`
    <h3>Tweak values and live update an image</h3>
    <p>
      This also has its own story but this is some specific operations in real
      time
    </p>
    <mf-htmlmd-example img></mf-htmlmd-example>
  `);
};

export const imageToAscii = () => {
  return getRenderString(html`<docx-example ascii></docx-example>`);
};

export const screenshotUrl = () => {
  return getRenderString(html`<docx-example screenshot></docx-example>`);
};

export const docxToPdf = () => {
  return getRenderString(html`<docx-example pdf></docx-example>`);
};

export const docxToHtml = () => {
  return getRenderString(html`<docx-example html></docx-example>`);
};

export const secureFeedback = () => {
  return getRenderString(html`
    <textarea id="data" cols="80" rows="20">Data to encrypt</textarea>
    <div>
      <p>
        Anything you put in the above will be encrypted and you will be sent to
        a URL which includes the encrypted message in the URL which can be sent
        around securely. The messages don't go away as it's just hashed data. It
        assumes HTML but works with text as well.
      </p>
      <button id="securefeedbackbtn">Encrypt data</button>
    </div>
  `);
};

setTimeout(() => {
  if (document.querySelector("#securefeedbackbtn")) {
    document
      .querySelector("#securefeedbackbtn")
      .addEventListener("click", async (e) => {
        const response = await MicroFrontendRegistry.call("@core/crypto", {
          op: "hash",
          data: document.querySelector("#data").value,
        });
        if (response.status == 200 && response.data) {
          window.open(
            `https://secure-feedback.vercel.app/?message=${response.data}`,
            "_blank",
          );
        }
      });
  }
}, 1000);

// via https://stackoverflow.com/questions/70657298/render-lit-lit-html-templateresult-as-string
const getRenderString = (data) => {
  const { strings, values } = data;
  const v = [...values, ""].map((e) =>
    typeof e === "object" ? getRenderString(e) : e,
  );
  return strings.reduce((acc, s, i) => acc + s + v[i], "");
};
