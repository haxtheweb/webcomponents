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
const stories = storiesOf("Button", module);
stories.addDecorator(withKnobs);
stories.add("lrn-button", () => {
  const title = text("title", "");

  return `
  <lrn-button title="${title}"; >
    Button
  </lrn-button>
  `;
});
