import { html } from "lit-element/lit-element.js";
import { SimpleFields } from "@lrnwebcomponents/simple-fields/simple-fields.js";
import { SimpleFieldsLite } from "@lrnwebcomponents/simple-fields/lib/simple-fields-lite.js";
import { SimpleFieldsForm } from "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";
import { SimpleFieldsFormLite } from "@lrnwebcomponents/simple-fields/lib/simple-fields-form-lite.js";
import { SimpleFieldsField } from "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import { SimpleFieldsContainer } from "@lrnwebcomponents/simple-fields/lib/simple-fields-container.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Fields",
  component: "simple-fields",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
const css = [
  { css: "--simple-fields-margin", title: "vertical margin around container" },
  {
    css: "--simple-fields-margin-small",
    title: "smaller vertical margin above field itself",
  },
  { css: "--simple-fields-border-radus", title: "default border-radius" },
  { css: "--simple-fields-color", title: "text color	black" },
  { css: "--simple-fields-error-color", title: "error text color" },
  { css: "--simple-fields-accent-color", title: "accent text/underline color" },
  { css: "--simple-fields-border-color", title: "border-/underline color" },
  { css: "--simple-fields-border-color-light", title: "used for range tracks" },
  { css: "--simple-fields-faded-error-color", title: "used for range tracks" },
  { css: "--simple-fields-font-size", title: "font-size of field" },
  { css: "--simple-fields-font-family", title: "font-size of field" },
  { css: "--simple-fields-line-height", title: "line-height of field" },
  {
    css: "--simple-fields-detail-font-size",
    title: "font-size of field details",
  },
  {
    css: "--simple-fields-detail-font-family",
    title: "font-size of field details",
  },
  {
    css: "--simple-fields-detail-line-height",
    title: "line-height of field details",
  },
  { css: "--simple-fields-disabled-color", title: "disabled text color" },
  {
    css: "--simple-fields-disabled-opacity",
    title: "opacity for disabled field",
  },
  {
    css: "--simple-fields-radio-option-display",
    title: "display label with field (flex) or above (block)",
  },
  {
    css: "--simple-fields-radio-option-flex-wrap",
    title: "allow radio options to wrap to next line",
  },
];
export const SimpleFieldsStory = () => {
  let fields = [
      {
        property: "name",
        title: "What is your name?",
        description: "Enter your real name or an alias.",
        inputMethod: "textfield",
        required: true,
      },
      {
        property: "alias",
        title: "This is an alias.",
        description: "",
        inputMethod: "boolean",
      },
      {
        property: "profileImage",
        title: "Profile Image",
        description: "Maximum size 400px X 400px.",
        inputMethod: "haxupload",
        validationType: "url",
      },
      {
        property: "biographical",
        title: "Bigraphical Information",
        inputMethod: "fieldset",
        properties: [
          {
            property: "icon",
            title: "Pick an icon.",
            inputMethod: "iconpicker",
          },
          {
            property: "color",
            title: "Your favorite  color.",
            inputMethod: "colorpicker",
          },
          {
            property: "sword",
            title: "Your sword's name.",
            inputMethod: "select",
            allowNull: false,
            options: {
              none: "None",
              blackfyre: "Blackfyre",
              brightroar: "Brightroar",
              darksister: "Dark Sister",
              dawn: "Dawn",
              hearteater: "Heart Eater",
              heartsbane: "Heartsbane",
              ice: "Ice",
              ladyforlorn: "Lady Horlorn",
              lightbringer: "Lightbringer",
              lionstooth: "Lion's Tooth",
              longclaw: "Longclaw",
              needle: "Needle",
              oathkeeper: "Oathkeeper",
              widowswail: "Widow's Wail",
            },
          },
          {
            property: "bio",
            title: "Bio",
            description: "Write a short bio.",
            inputMethod: "textarea",
          },
        ],
      },
      {
        property: "relationships",
        inputMethod: "tabs",
        properties: [
          {
            property: "siblings",
            title: "Siblings",
            properties: [
              {
                property: "siblingsList",
                title: "Enter the names of your siblings.",
                inputMethod: "array",
                itemLabel: "name",
                properties: [
                  {
                    property: "name",
                    title: "Sibling Name",
                    inputMethod: "textfield",
                  },
                  {
                    property: "dead",
                    title: "Is sibling dead?",
                    inputMethod: "boolean",
                  },
                ],
              },
            ],
          },
          {
            property: "allies",
            title: "Allies",
            properties: [
              {
                property: "alliesList",
                title: "List your allies.",
                inputMethod: "array",
                itemLabel: "name",
                properties: [
                  {
                    property: "name",
                    title: "Ally Name",
                    inputMethod: "textfield",
                  },
                  {
                    property: "dead",
                    title: "Is ally dead?",
                    inputMethod: "boolean",
                  },
                ],
              },
            ],
          },
          {
            property: "enemies",
            title: "Enemies",
            properties: [
              {
                property: "enemiesList",
                title: "List your enemies.",
                inputMethod: "array",
                itemLabel: "name",
                properties: [
                  {
                    property: "name",
                    title: "Enemy Name",
                    inputMethod: "textfield",
                  },
                  {
                    property: "dead",
                    title: "Is enemy dead?",
                    inputMethod: "boolean",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        property: "hiddenField",
        title: "Hidden",
        description: "I'm a hidden field. You can't see me.",
        inputMethod: "boolean",
        hidden: true,
      },
      {
        property: "winter",
        title: "When is winter coming?",
        inputMethod: "datepicker",
      },
      {
        property: "code",
        title: "This is your favorite code snippet.",
        inputMethod: "code-editor",
      },
      {
        property: "markup",
        title: "This is your favorite markup snippet.",
        inputMethod: "markup",
      },
    ],
    value = {
      name: "No One",
      alias: true,
      biographical: {
        bio: "Once upon a time...",
        sword: "needle",
        color: "red",
        icon: "icons:visibility-off",
      },
      relationships: {
        siblings: {
          siblingsList: [
            { name: "Rob Stark", dead: true },
            { name: "Jon Snow", dead: false },
            { name: "Sansa Stark", dead: false },
            { name: "Bran Stark", dead: false },
            { name: "Rickon Stark", dead: true },
          ],
        },
        allies: {
          alliesList: [
            { name: "Syrio Forel", dead: true },
            { name: "Gendry", dead: false },
            { name: "Jaquen Hagar", dead: false },
            { name: "Sandor Clegane", dead: true },
            { name: "Brienne of Tarth", dead: false },
          ],
        },
        enemies: {
          enemiesList: [
            { name: "Joffrey Baratheon", dead: true },
            { name: "Cersei Lannister", dead: true },
            { name: "Gregor Clegane", dead: true },
            { name: "Meryn Trant", dead: true },
            { name: "Ilyn Payne", dead: true },
            { name: "Sandor Clegane", dead: true },
          ],
        },
      },
      code: "<p>What do we say to Death?</p>\n<p>Not today.</p>",
      markup: "_What do we say to Death?_ *Not today.*",
      winter: "12/21/2019",
    };
  return utils.makeElementFromClass(
    SimpleFields,
    {
      fields: fields,
      value: value,
    },
    css
  );
};
export const SimpleFieldsFormStory = () => {
  return utils.makeElementFromClass(
    SimpleFieldsForm,
    {
      loadEndpoint: new URL(`demo/data/fields.json`, import.meta.url),
      method: "GET",
      autoload: true,
    },
    css
  );
};
export const SimpleFieldsLiteStory = () => {
  let schema = {
      $schema: "http://json-schema.org/schema#",
      title: "Store",
      type: "object",
      format: "tabs",
      required: ["name", "email"],
      properties: {
        settings: {
          title: "Settings",
          type: "object",
          format: "tabs",
          properties: {
            "basic-input": {
              title: "Basic input page",
              description: "Basic contact settings",
              type: "object",
              properties: {
                branch: {
                  title: "Branch",
                  type: "string",
                  description: "This is a description.",
                },
                name: {
                  title: "Name",
                  type: "string",
                },
                address: {
                  title: "Address",
                  type: "string",
                  minLength: 3,
                },
                city: {
                  title: "City",
                  type: "string",
                  minLength: 3,
                },
                province: {
                  title: "Province",
                  type: "string",
                  minLength: 2,
                },
                country: {
                  title: "Country",
                  type: "string",
                  minLength: 2,
                },
                postalCode: {
                  title: "Postal/Zip Code",
                  type: "string",
                  pattern:
                    "[a-zA-Z][0-9][a-zA-Z]\\s*[0-9][a-zA-Z][0-9]|[0-9]{5}(-[0-9]{4})?",
                },
                email: {
                  title: "Email",
                  type: "string",
                  pattern:
                    "(?:^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$)|(?:^$)",
                },
                website: {
                  title: "Website",
                  type: "string",
                  format: "uri",
                },
                besttime: {
                  title: "Best time to contact",
                  type: "string",
                  format: "radio",
                  options: {
                    day: "morning",
                    evening: "evening",
                  },
                },
                contact: {
                  title: "Contact by",
                  type: "string",
                  format: "select",
                  options: {
                    "": "-- Select a contact --",
                    email: "Email",
                    mail: "Mail",
                    phone: "Phone",
                    website: "Website",
                  },
                },
                establishedDate: {
                  title: "Established Date",
                  type: "string",
                  format: "date",
                },
                closed: {
                  title: "Closed",
                  type: "boolean",
                },
                closedDate: {
                  title: "Closed Date",
                  type: ["string", "null"],
                  format: "date",
                },
              },
            },
            arrays: {
              title: "Basic arrays page",
              description: "Demonstrates arrays",
              type: "object",
              properties: {
                phoneNumbers: {
                  title: "Phone numbers",
                  description: "List phone numbers and type of number.",
                  type: "array",
                  items: {
                    type: "object",
                    previewBy: ["phoneNumber"],
                    properties: {
                      type: {
                        title: "Type",
                        type: "string",
                        format: "radio",
                        options: {
                          home: "Home Phone",
                          cell: "Mobile Phone",
                          work: "Work Phone",
                        },
                      },
                      phoneNumber: {
                        title: "Phone Number",
                        type: "string",
                      },
                    },
                  },
                },
                positions: {
                  type: "array",
                  title: "Positions",
                  description: "List positions and salary.",
                  items: {
                    type: "object",
                    title: "Positions",
                    previewBy: ["title"],
                    properties: {
                      title: {
                        title: "Title",
                        type: "string",
                      },
                      salary: {
                        title: "Salary",
                        type: "number",
                        multipleOf: 1000,
                        minimum: 20000,
                        maximum: 50000,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    value = {
      settings: {
        "basic-input": {
          name: "NikkiMK",
          besttime: "evening",
          contact: "email",
          closed: true,
        },
        arrays: {
          phoneNumbers: [
            {
              type: "home",
              phoneNumber: "1-555-867-5309",
            },
            {
              type: "cell",
              phoneNumber: "1-555-555-5555",
            },
            {
              type: "work",
              phoneNumber: "1-800-888-8888",
            },
          ],
          positions: [
            {
              title: "cashier",
              salary: "20000",
            },
          ],
        },
      },
    };
  return utils.makeElementFromClass(
    SimpleFieldsLite,
    {
      schema: schema,
      value: value,
    },
    css
  );
};
export const SimpleFieldsFormLiteStory = () => {
  return utils.makeElementFromClass(
    SimpleFieldsFormLite,
    {
      loadEndpoint: new URL(`demo/data/schema.json`, import.meta.url),
      method: "GET",
      autoload: true,
    },
    css
  );
};
export const SimpleFieldsFieldStory = () => {
  let itemsList = [
      { value: "breakfast", text: "Breakfast" },
      { value: "brunch", text: "Brunch" },
      { value: "lunch", text: "Lunch" },
      { value: "snack", text: "Snack" },
      { value: "dinner", text: "Dinner" },
    ],
    options = {
      red: "Red",
      orange: "Orange",
      yellow: "Yellow",
      green: "Green",
      cyan: "Cyan",
      blue: "Blue",
      indigo: "Indigo",
      purple: "Purple",
      magenta: "Magenta",
    },
    types = [
      {
        type: "url",
        label: "Add via URL",
        autoValidate: true,
      },
      {
        type: "text",
        label: "First Name",
        autoValidate: true,
        autocapitalize: "words",
      },
      {
        type: "password",
        label: "Password",
      },
      {
        type: "file",
        label: "Profile Image",
        description: "Upload your photo.",
      },
      {
        type: "textarea",
        label: "Bio",
        description: "Write your bio.",
        placeholder: "Once...",
      },
      {
        type: "date",
        label: "Birth Date",
      },
      {
        type: "time",
        label: "Event Time",
      },
      {
        type: "month",
        label: "Vacation Month",
      },
      {
        type: "color",
        label: "Favorite Color",
        value: "#ff00ff",
      },
      {
        type: "range",
        label: "Satisfaction",
        min: 0,
        step: 10,
        max: 100,
        value: 50,
      },
      {
        type: "hidden",
        value: true,
      },
      {
        label: "Twitter Handle",
        type: "text",
        prefix: "@",
      },
      {
        label: "Estimated Cost",
        type: "number",
        prefix: "$",
        suffix: ".00",
      },
      {
        label: "Radio Options",
        description: "Check one",
        type: "radio",
        itemsList: itemsList,
      },
      {
        label: "Checkbox Options",
        description: "Check all",
        type: "checkbox",
        itemsList: itemsList,
      },
      {
        label: "Select Options",
        description: "Check one",
        type: "select",
        itemsList: itemsList,
      },
      {
        label: "Select Options",
        description: "Check all",
        type: "select",
        multiple: true,
        itemsList: itemsList,
      },
      {
        counter: "character",
        maxlength: 10,
        type: "text",
        label: "Nickname",
        value: "Rumplestiltskin",
      },
      {
        counter: "word",
        maxlength: 6,
        type: "textarea",
        label: "Six word bio.",
        value: "Once upon a time...",
      },
      {
        label: "Name",
        autovalidate: true,
        required: true,
        requiredMessage: "A name is required.",
      },
      {
        label: "Email",
        autovalidate: true,
        patternMessage: "Invalid format.",
        pattern: "^([a-zA-Z0-9_-.]+)@([a-zA-Z0-9_-.]+).([a-zA-Z]{2,5})$",
        placeholder: "username@domain.com",
        type: "email",
      },
      {
        label: "I agree to the terms",
        autovalidate: true,
        requiredMessage: "You must agree to the terms.",
        type: "checkbox",
      },
      {
        label: "Checkbox Options",
        description: "Pick 2-4",
        options: options,
        autovalidate: true,
        min: 2,
        max: 4,
        type: "checkbox",
      },
    ],
    type = utils.randomOption(types);
  type.disabled = false;
  type.hidden = false;
  type.required = type.required || utils.randomBool();
  type.inline = utils.randomBool();
  return utils.makeElementFromClass(SimpleFieldsField, type, css);
};
export const SimpleFieldsContainerStory = () => {
  let types = [
      {
        label: "Name",
        field: `<input autocapitalize="words" required>`,
      },
      {
        label: "Password",
        field: `<input type="password">`,
      },
      {
        label: "Profile Image",
        field: `<input type="file">`,
      },
      {
        label: "Bio",
        description: "Write your bio.",
        field: `<textarea placeholder="Once..."></textarea>`,
      },
      {
        label: "Birth Date",
        field: `<input type="date">`,
      },
      {
        label: "Favorite Color",
        field: `<input type="color" value="#ff00ff">`,
      },
      {
        label: "Satisfaction",
        field: `<input type="range" min="0" step="10" max="100" value="50">`,
      },
      {
        label: "Select Option",
        description: "Select one",
        field: `<select><option value="breakfast">Breakfast</option><option value="brunch">Brunch</option><option value="lunch">Lunch</option><option value="snack">Snack</option><option value="dinner">Dinner</option></select>`,
      },
      {
        label: "Select Options",
        description: "Select all",
        field: `<select multiple><option value="breakfast">Breakfast</option><option value="brunch">Brunch</option><option value="lunch">Lunch</option><option value="snack">Snack</option><option value="dinner">Dinner</option></select>`,
      },
      {
        label: "Select Option",
        description: "Select one",
        field: `<fieldset><legend>Radio Options</legend><label>Breakfast <input name="checkone" type="radio" value="breakfast"></label><label>Brunch <input name="checkone" type="radio" value="brunch"></label><label>Lunch <input name="checkone" type="radio" value="lunch"></label><label>Snack <input name="checkone" type="radio" value="snack"></label><label>Dinner <input name="checkone" type="radio" value="dinner"></label></fieldset>`,
      },
      {
        label: "Nickname",
        counter: true,
        type: "text",
        field: `<input type="text" maxlength="10">`,
        fieldMeta: `<span>maximum length: 10</span>`,
      },
      {
        label: "Short Bio",
        counter: "word",
        maxwords: 6,
        type: "textarea",
        field: `<textarea></textarea>`,
        fieldMeta: `<span>maximum length: 6 words or less</span>`,
      },
      {
        label: "Name",
        autovalidate: true,
        field: `<input type="name" required>`,
        requiredMessage: "A name is required.",
      },
      {
        label: "Email",
        autovalidate: true,
        field: `<input type="email" placeholder="username@domain.com">`,
        patternMessage: "Invalid format.",
        pattern: "^([a-zA-Z0-9_-.]+)@([a-zA-Z0-9_-.]+).([a-zA-Z]{2,5})$",
      },
      {
        autovalidate: true,
        field: `<fieldset><legend>Checkbox Options</legend><label>Red <input name="check" type="checkbox" value="red"></label><label>Orange <input name="check" type="checkbox" value="orange"></label><label>Yellow <input name="check" type="checkbox" value="yellow"></label><label>Green <input name="check" type="checkbox" value="green"></label><label>Cyan <input name="check" type="checkbox" value="cyan"></label><label>Blue <input name="check" type="checkbox" value="blue"></label><label>Indigo <input name="check" type="checkbox" value="indigo"></label><label>Purple <input name="check" type="checkbox" value="purple"></label><label>Magenta <input name="check" type="checkbox" value="magenta"></label></fieldset>`,
        minchecked: 2,
        maxchecked: 4,
        description: "Pick 2-4",
      },
      {
        label: "I agree to the terms",
        autovalidate: true,
        requiredMessage: "You must agree to the terms.",
        field: `<input type="checkbox" required>`,
      },
    ],
    type = utils.randomOption(types);
  type.inline = utils.randomBool();
  return utils.makeElementFromClass(SimpleFieldsContainer, type, [
    { slot: "field", title: "Field" },
    { slot: "fieldMeta", title: "Meta Information for Field" },
    { slot: "prefix", title: "Field Prefix" },
    { slot: "suffix", title: "Field Suffix" },
    ...css,
  ]);
};
