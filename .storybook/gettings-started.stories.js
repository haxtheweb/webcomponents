import { html } from "lit-element/lit-element.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "About|Getting Started"
};
const utils = new StorybookUtilities(),
  demostyle = "margin:0 -8px 40px;padding:0;box-shadow:none;border-bottom:1px solid #e0e0e0;",
  demohtml = html`
    <demo-snippet style="${demostyle}">
      <p>Add the web component HTML to your page where you want it to appear. For example:</p>
      <style>relative-heading { display: none}</style>
      <template>
        <relative-heading id="lorem">
          <h1>Lorem ipsum dolor</h1>
        </relative-heading>
      </template>
    </demo-snippet>
  `,
  scriptstep = `Include the script.`,
  htmlstep = `Add the HTML.`;
export const UsingPennStateCdn = () => {
  return html`
    <h1>Using the Penn State CDN</h1>
    <h2>Step 1: ${scriptstep}</h2>
    <demo-snippet style="${demostyle}">
      <p>Add the following to the <tt>&lt;head&gt;</tt> of your page:</p>
      <template id="template1">
        <script>
          window.__appCDN="https://cdn.webcomponents.psu.edu/cdn/";
          window.__appForceUpgrade=false;
        </script>
      </template>
    </demo-snippet>

    <h2>Step 2: ${htmlstep}</h2>
    ${demohtml}
  `;
};
export const UsingYourOwnCopy = () => {
  return html`
    <h1>Using Your Own Location</h1>
    <h2>Step 1: Make your own.</h2>
    <div style="border-bottom:1px solid #e0e0e0;background-color:white;padding:20px;margin:0 -8px 40px;}">
      <p>
        Use the <a href="https://github.com/elmsln/unbundled-webcomponents">unbundled-webcomponents repository</a> 
        to create your own custom collection of components.
      </p>
    </div>
    
    <h2>Step 2: ${scriptstep}</h2>
    <demo-snippet style="${demostyle}">
      <p>Add the following to the <tt>&lt;head&gt;</tt> of your page using the path where your copy the unbundled script:</p>
      <template id="template1">
        <script>
          window.__appCDN="https://path.to.your/unbundled-webcomponents";
          window.__appForceUpgrade=false;
        </script>
      </template>
    </demo-snippet>

    <h2>Step 3: ${htmlstep}</h2>
    ${demohtml}
  `;
};