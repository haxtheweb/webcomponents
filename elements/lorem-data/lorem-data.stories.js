import { html } from "lit-element/lit-element.js";
import { LoremData } from "@lrnwebcomponents/lorem-data/lorem-data.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Data",
  component: "lorem-data",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const LoremDataStory = () => {
  let schemas = {
    "users.json": {
      type: "array",
      children: {
        type: "object",
        schema: {
          id: { type: "letter" },
          user: { type: "word" },
          icon: { type: "icon" },
          link: { type: "link" },
          avatar: { type: "image", topic: "person" },
          image: { type: "imageData", topic: "tech" },
          color: { type: "color" },
          number: { type: "number", min: 0, max: 9 },
          hex: { type: "hex" },
          undergrad: { type: "boolean" },
          campus: {
            type: "option",
            options: ["WC", "Altoona", "Bubois"]
          },
          instructor: {
            type: "option",
            weightedOptions: [
              { value: true, weight: 1 },
              { value: false, weight: 15 }
            ]
          }
        }
      },
      min: 15,
      max: 30
    },
    "projects.json": {
      type: "array",
      children: {
        type: "object",
        schema: {
          project: { type: "word" },
          body: { type: "paragraph" },
          date: { type: "date" },
          assignments: {
            type: "array",
            children: {
              type: "object",
              schema: {
                assignment: { type: "word" },
                instructions: { type: "paragraph" },
                date: { type: "date" },
                feedback: {
                  type: "array",
                  children: {
                    type: "object",
                    schema: {
                      date: { type: "date" },
                      title: { type: "sentence" },
                      body: { type: "paragraph" }
                    }
                  }
                }
              }
            },
            min: 4,
            max: 8
          }
        }
      },
      min: 3,
      max: 5
    }
  };
  return utils.makeElementFromClass(LoremData, {
    schemas: schemas
  });
};
