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
import "./hax-body-behaviors";
const stories = storiesOf("Body", module);
stories.addDecorator(withKnobs);
stories.add("hax-body-behaviors", () => {
  return `
  <hax-body-behaviors >
    Body
  </hax-body-behaviors>
  `;
});
