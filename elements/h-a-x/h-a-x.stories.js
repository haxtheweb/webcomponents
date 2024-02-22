import { html } from "lit-html";
import { withKnobs } from "@open-wc/demoing-storybook";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "HAX|h-a-x",
  component: "micro-frontend-registry",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

export const HAXCodePen = () => {
  return getRenderString(html`
    <h1>Codepen of haxcms</h1>
    <p>
      Unfortunately due to limitations of how storybook does bundling, HAX is
      difficult to load into the context of it. Here's an iframe to
      <a href="https://codepen.io/btopro/pen/rNdbRGp"
        >https://codepen.io/btopro/pen/rNdbRGp</a
      >
      which is not the latest but at least something.
    </p>
    <iframe
      src="https://codepen.io/btopro/embed/rNdbRGp"
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
