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
import "./materializecss-styles";
const stories = storiesOf("Styles", module);
stories.addDecorator(withKnobs);
stories.add("materializecss-styles", () => {
  return `
  <materializecss-styles >
    Styles
  </materializecss-styles>
  `;
});
