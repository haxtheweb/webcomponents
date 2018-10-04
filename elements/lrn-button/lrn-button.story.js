import { storiesOf } from "@storybook/polymer";
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  object,
  array,
  date,
  select
} from "@storybook/addon-knobs/polymer";
import "./lrn-button";
const stories = storiesOf("Atoms", module);
stories.addDecorator(withKnobs);
stories.add("lrn-button", () => {
  const label = text("label", "");

  return `
  <lrn-button label="${label}"; ></lrn-button>
  `;
});
