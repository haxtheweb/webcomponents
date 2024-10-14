import { css, html, unsafeCSS } from "lit";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * @note Gut all design settings in HAX core. this allows for design systems to hook in
 * by overriding the way the designSystemHAXProperties returns property definitions
 *
 * under standardAdvancedProps
 * review what should be removed but just about everything
 * also many of these generate events which can be removed as well!!!
 * this is core gutting, but we'll have to implement them in a uniform way
 * so that if hideDefaultSettings is there we should still respect that
 * Possibly changing it hideDesignLayoutSettings: [] which is an array
 * of keys to hide from this specific element. If the entire thing is there
 * then it'll remove all of them
 */
if (globalThis && globalThis.addEventListener) {
  globalThis.addEventListener(
    "hax-store-ready",
    (e) => {
      if (globalThis.HaxStore) {
        const HAXStore = globalThis.HaxStore.requestAvailability();
        HAXStore.designSystemHAXProperties = (props, tag) => {
          // setup the props of the design system to populate based on matches below
          let spacingProps = [];
          let designTreatmentProps = [];
          let fontProps = [];
          let cardProps = [];
          let colorProps = [];
          // test if this element can be scaled
          // we generally don't want people doing it this way
          if (props.canScale) {
            spacingProps.push({
              attribute: "data-width",
              title: "Width",
              description: "Scaled relative to width of container",
              inputMethod: "slider",
              min: props.canScale.min ? props.canScale.min : 25,
              max: props.canScale.max ? props.canScale.max : 100,
              step: props.canScale.step ? props.canScale.step : 25,
            });
          }
          // will catch prims and MIGHT catch tag
          let inline = HAXStore.isInlineElement(tag);
          // test for inline bc we are so early in bootstrap we might miss it
          if (props.gizmo && props.gizmo.meta && props.gizmo.meta.inlineOnly) {
            inline = true;
          }
          // everything that allows for advanced should be able to apply spacing
          // this stuff floats to the top of those options
          if (
            !props.hideDefaultSettings &&
            !inline &&
            props.designSystem !== false
          ) {
            if (["media-image", "img"].includes(tag)) {
              spacingProps.push({
                attribute: "data-float-position",
                title: "Float Position",
                description:
                  "Alignment relative to other items on large screens",
                inputMethod: "select",
                options: {
                  "": "-- default --",
                  left: "Left",
                  center: "Center",
                  right: "Right",
                },
              });
            } else {
              spacingProps.push({
                attribute: "data-text-align",
                title: "Text align",
                description: "Horizontal alignment of text",
                inputMethod: "select",
                options: {
                  "": "-- default --",
                  left: "Left",
                  center: "Center",
                  right: "Right",
                  justify: "Justify",
                },
              });
            }
            spacingProps.push({
              attribute: "data-padding",
              title: "Padding",
              description: "Padding for added aesthetics",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("padding")],
            });
            spacingProps.push({
              attribute: "data-margin",
              title: "Margin",
              description: "Margin for added aesthetics",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("margin")],
            });
          }
          // design treatments are rather open ended but should be high up for things that have them
          if (
            props.designSystem === true ||
            props.designSystem.designTreatment === true
          ) {
            if (["p", "blockquote"].includes(tag)) {
              designTreatmentProps.push({
                attribute: "data-design-treatment",
                title: "Design treatment",
                description: "Minor aesthetic treatments for emphasis",
                inputMethod: "radio",
                itemsList: [
                  ...HAXOptionSampleFactory("design-treatment").filter(
                    (item) =>
                      item && item.value.startsWith("dropCap") ? true : false,
                  ),
                ],
              });
            } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
              // filter options to only NON-dropCap options
              designTreatmentProps.push({
                attribute: "data-design-treatment",
                title: "Design treatment",
                description: "Minor aesthetic treatments for emphasis",
                inputMethod: "radio",
                itemsList: [
                  ...HAXOptionSampleFactory("design-treatment").filter(
                    (item) =>
                      item && !item.value.startsWith("dropCap") ? true : false,
                  ),
                ],
              });
            }
          }
          // block elements can get accents which effectively implies that they
          // can get the other 'card' like configuration pieces
          if (
            props.designSystem === true ||
            props.designSystem.accent === true
          ) {
            colorProps.push({
              attribute: "data-accent",
              title: "Accent color",
              description: "Offset items visually for aesthetic purposes",
              inputMethod: "select",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("accent")],
            });
          }
          // things allowed to have primary
          /* if (
          [
            "p",
            "blockquote",
            "ol",
            "ul",
            "hr",
            "abbr",
            "mark",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
          ].includes(tag)
        ) {*/
          if (
            props.designSystem === true ||
            props.designSystem.primary === true
          ) {
            colorProps.push({
              attribute: "data-primary",
              title: "Primary color",
              description:
                "Primary color to apply color, often for meaning or aesthetic",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("primary")],
            });
          }
          // placing here ensures it loads below colors
          if (
            props.designSystem === true ||
            props.designSystem.designTreatment === true
          ) {
            if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
              // headings can pick up instructional meaning
              designTreatmentProps.push({
                attribute: "data-instructional-action",
                title: "Instructional Context",
                description: "Indicated to users visually",
                inputMethod: "radio",
                itemsList: [...HAXOptionSampleFactory("instructional-action")],
              });
            }
          }
          // textual controls
          if (props.designSystem === true || props.designSystem.text === true) {
            fontProps.push({
              attribute: "data-font-family",
              title: "Font family",
              inputMethod: "select",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("font-family")],
            });

            fontProps.push({
              attribute: "data-font-weight",
              title: "Font weight",
              description: "Ensure it is only for aesthetic purposes",
              inputMethod: "select",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("font-weight")],
            });

            fontProps.push({
              attribute: "data-font-size",
              title: "Font size",
              description: "Ensure sizing is only for aesthetic purposes",
              inputMethod: "select",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("font-size")],
            });
          }
          // things that would give a card appearance
          if (props.designSystem === true || props.designSystem.card === true) {
            cardProps = [
              {
                attribute: "data-border-radius",
                title: "Border radius",
                description: "Border radius to apply",
                inputMethod: "select",
                inputMethod: "radio",
                itemsList: [...HAXOptionSampleFactory("border-radius")],
              },
              {
                attribute: "data-border",
                title: "Border",
                description: "Thickness of the border",
                inputMethod: "select",
                inputMethod: "radio",
                itemsList: [...HAXOptionSampleFactory("border")],
              },
              {
                attribute: "data-box-shadow",
                title: "Box shadow",
                description: "Subtly raises off the page",
                inputMethod: "select",
                inputMethod: "radio",
                itemsList: [...HAXOptionSampleFactory("box-shadow")],
              },
            ];
          }
          // @todo make sure we push the text stuff on accurately. might need to build
          // this entire field as a composite object before pushing onto the stack
          props.settings.configure.push({
            inputMethod: "collapse",
            property: "ddd-styles",
            properties: [
              {
                title: "Design treatment",
                collapsed: true,
                accordion: true,
                property: "ddd-designtreatment",
                disabled: designTreatmentProps.length === 0,
                properties: designTreatmentProps,
              },
              {
                title: "Colors",
                collapsed: true,
                accordion: true,
                property: "ddd-card",
                disabled: colorProps.length === 0,
                properties: colorProps,
              },
              {
                title: "Font",
                collapsed: true,
                accordion: true,
                property: "ddd-font",
                disabled: fontProps.length === 0,
                properties: fontProps,
              },
              {
                title: "Spacing",
                collapsed: true,
                accordion: true,
                property: "ddd-spacing",
                disabled: spacingProps.length === 0,
                properties: spacingProps,
              },
              {
                title: "Box appearance",
                collapsed: true,
                accordion: true,
                property: "ddd-box",
                disabled: cardProps.length === 0,
                properties: cardProps,
              },
            ],
          });
          return props;
        };
      }
    },
    { once: true },
  );
}
/**
 * Instructional design meshing with styles. What we use to represent concepts
 */
export const learningComponentNouns = {
  content: "Content",
  assessment: "Assessment",
  quiz: "Quiz",
  submission: "Submission",
  lesson: "Lesson",
  module: "Module",
  task: "Task",
  activity: "Activity",
  project: "Project",
  practice: "Practice",
  unit: "Unit",
  objectives: "Learning Objectives",
};

export const learningComponentVerbs = {
  connection: "Connection",
  knowledge: "Did You Know?",
  strategy: "Learning Strategy",
  discuss: "Discuss",
  listen: "Listen",
  make: "Make",
  observe: "Observe",
  present: "Present",
  read: "Read",
  reflect: "Reflect",
  research: "Research",
  watch: "Watch",
  write: "Write",
};

export const learningComponentTypes = {
  ...learningComponentVerbs,
  ...learningComponentNouns,
};

export const learningComponentColors = {
  content: "blue-grey",
  assessment: "red",
  quiz: "blue",
  submission: "deep-purple",
  lesson: "purple",
  module: "red",
  task: "blue-grey",
  activity: "orange",
  project: "deep-orange",
  practice: "brown",
  unit: "light-green",
  objectives: "indigo",
  connection: "green",
  knowledge: "cyan",
  strategy: "teal",
  discuss: "blue",
  listen: "purple",
  make: "orange",
  observe: "yellow",
  present: "light-blue",
  read: "lime",
  reflect: "amber",
  research: "deep-orange",
  watch: "pink",
  write: "deep-purple",
};

export function iconFromPageType(type) {
  switch (type) {
    case "content":
      return "lrn:page";
    case "assessment":
      return "lrn:assessment";
    case "quiz":
      return "lrn:quiz";
    case "submission":
      return "icons:move-to-inbox";
    case "lesson":
      return "hax:lesson";
    case "module":
      return "hax:module";
    case "unit":
      return "hax:unit";
    case "task":
      return "hax:task";
    case "activity":
      return "hax:ticket";
    case "project":
      return "hax:bulletin-board";
    case "practice":
      return "hax:shovel";
    case "connection":
      return "courseicons:chem-connection";
      break;
    case "knowledge":
      return "courseicons:knowledge";
      break;
    case "strategy":
      return "courseicons:strategy";
      break;
    case "discuss":
      return "courseicons:strategy";
      break;
    case "listen":
      return "courseicons:listen";
      break;
    case "make":
      return "courseicons:strategy";
      break;
    case "observe":
      return "courseicons:strategy";
      break;
    case "present":
      return "courseicons:strategy";
      break;
    case "read":
      return "courseicons:strategy";
      break;
    case "reflect":
      return "courseicons:strategy";
      break;
    case "research":
      return "courseicons:strategy";
      break;
    case "watch":
      return "courseicons:strategy";
      break;
    case "write":
      return "lrn:write";
      break;
  }
  return "courseicons:learning-objectives";
}

export const ApplicationAttributeData = {
  primary: {
    0: "Pugh blue",
    1: "Beaver blue",
    2: "Nittany navy",
    3: "Potential midnight",
    4: "Coaly gray",
    5: "Limestone gray",
    6: "Slate gray",
    7: "Creek teal",
    8: "Sky blue",
    9: "Shrine tan",
    10: "Roar golden",
    11: "Original 87 pink",
    12: "Discovery coral",
    13: "Wonder purple",
    14: "Artherton violet",
    15: "Invent orange",
    16: "Keystone yellow",
    17: "Opportunity green",
    18: "Future lime",
    19: "Forest green",
    20: "Landgrant brown",
    21: "Global Neon",
    22: "Error",
    23: "Warning",
    24: "Info",
    25: "Success",
  },
  accent: {
    0: "Sky Max",
    1: "Slate Max",
    2: "Limestone Max",
    3: "Shrine Max",
    4: "Roar Max",
    5: "Creek Max",
    6: "White",
    7: "Error Light",
    8: "Warning Light",
    9: "Info Light",
    10: "Success Light",
    11: "Alert Immediate",
    12: "Alert Urgent",
    13: "Alert All Clear",
    14: "Alert Non Emergency",
  },
  margin: {
    center: "Center",
    xs: "X-Small",
    s: "Small",
    m: "Medium",
    l: "Large",
    xl: "X-Large",
  },
  padding: {
    xs: "X-Small",
    s: "Small",
    m: "Medium",
    l: "Large",
    xl: "X-Large",
  },
  border: {
    xs: "X-Small",
    sm: "Small",
    md: "Medium",
    lg: "Large",
  },
  "border-radius": {
    xs: "Rounded",
    md: "Rounder",
    xl: "Roundest",
  },
  "box-shadow": {
    sm: "Drop shadow",
  },
  "design-treatment": {
    // heading treatments
    vert: "Vertical line",
    "horz-10p": "Horizontal line 10%",
    "horz-25p": "Horizontal line 25%",
    "horz-50p": "Horizontal line 50%",
    "horz-full": "Horizontal line 100%",
    "horz-md": "Horizontal line Medium",
    "horz-lg": "Horizontal line Large",
    bg: "Background color",
    // text treatment
    "dropCap-sm": "Drop Cap - Small",
    "dropCap-md": "Drop Cap - Medium",
    "dropCap-lg": "Drop Cap - Large",
  },
  "font-family": {
    primary: "Roboto",
    secondary: "Roboto Slab",
    navigation: "Roboto Condensed",
  },
  "font-weight": {
    light: "Light",
    medium: "Medium",
    bold: "Bold",
  },
  "font-size": {
    "3xs": "Smaller",
    s: "Large",
    m: "Larger",
    l: "Largest",
  },
  "instructional-action": learningComponentTypes,
};

// ensure we get keys back in the right format
export function HAXOptionSampleFactory(type) {
  return Object.keys(ApplicationAttributeData[type]).map((key) => {
    return {
      value: key,
      html: ["primary", "accent"].includes(type)
        ? html`<d-d-d-sample
            @click="${updatePreviewColorVar}"
            type="${type}"
            option="${key}"
          ></d-d-d-sample>`
        : html`<d-d-d-sample type="${type}" option="${key}"></d-d-d-sample>`,
    };
  });
}

function updatePreviewColorVar(e) {
  let target = e.target;
  globalThis.document.body.style.setProperty(
    `--ddd-sample-theme-${target.type}`,
    `var(--ddd-${target.type}-${target.option})`,
  );
}

// attributes need to be driven from a cannonical list
// @note this may need ways of overriding it in the future but at least
// we've consolidated everything into one place for these small design mods
export const instructionalStyles = Object.keys(learningComponentColors).map(
  (item) => {
    let color = learningComponentColors[item];
    return css`
      [data-instructional-action="${unsafeCSS(item)}"] {
        --instructional-action-color: var(
          --simple-colors-default-theme-${unsafeCSS(color)}-8,
          ${unsafeCSS(color)}
        );
      }

      [data-instructional-action="${unsafeCSS(item)}"]::before {
        -webkit-mask-image: url("${unsafeCSS(
          SimpleIconsetStore.getIcon(iconFromPageType(item)),
        )}");
      }
    `;
  },
);

/* Logical Gaps:
  Heading colors; sizes; letter spacing; line height
  When to use chevron > with links?
  gradients need to be rotated (sometimes?)
  When to use // after headers?
*/
// fonts used
export const DDDFonts = [
  "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;500;700;900&display=swap",
];
// CSS variables which is most of the system needed
export const DDDVariables = css`
  :root {
    color-scheme: light dark;
  }
  :root,
  html,
  body,
  :host {
    /* base colors */
    --ddd-theme-default-beaverBlue: #1e407c;
    --ddd-theme-default-beaver70: rgba(30, 64, 124, 0.7);
    --ddd-theme-default-beaver80: rgba(30, 64, 124, 0.8);
    --ddd-theme-default-landgrantBrown: #6a3028;
    --ddd-theme-default-nittanyNavy: #001e44;
    --ddd-theme-default-navy40: rgba(0, 30, 68, 0.4);
    --ddd-theme-default-navy60: rgba(0, 30, 68, 0.6);
    --ddd-theme-default-navy65: rgba(0, 30, 68, 0.65);
    --ddd-theme-default-navy70: rgba(0, 30, 68, 0.7);
    --ddd-theme-default-navy80: rgba(0, 30, 68, 0.8);
    --ddd-theme-default-potentialMidnight: #000321;
    --ddd-theme-default-potential0: rgba(0, 3, 33, 0);
    --ddd-theme-default-potential50: rgba(0, 3, 33, 0.5);
    --ddd-theme-default-potential70: rgba(0, 3, 33, 0.7);
    --ddd-theme-default-potential75: rgba(0, 3, 33, 0.75);
    --ddd-theme-default-pughBlue: #96bee6;
    --ddd-theme-default-coalyGray: #262626;
    --ddd-theme-default-keystoneYellow: #ffd100;
    --ddd-theme-default-slateGray: #314d64;
    --ddd-theme-default-slateLight: #ccdae6;
    --ddd-theme-default-slateMaxLight: #eef3f7;
    --ddd-theme-default-skyBlue: #009cde;
    --ddd-theme-default-skyLight: #ccf0ff;
    --ddd-theme-default-skyMaxLight: #e6f7ff;
    --ddd-theme-default-limestoneGray: #a2aaad;
    --ddd-theme-default-limestoneLight: #e4e5e7;
    --ddd-theme-default-limestoneMaxLight: #f2f2f4;
    --ddd-theme-default-white: #ffffff;
    --ddd-theme-default-shrineLight: #f7f2ee;
    --ddd-theme-default-shrineMaxLight: #fdfbf5;
    --ddd-theme-default-creekTeal: #3ea39e;
    --ddd-theme-default-creekLight: #cfeceb;
    --ddd-theme-default-creekMaxLight: #edf8f7;
    --ddd-theme-default-shrineTan: #b88965;
    --ddd-theme-default-roarGolden: #bf8226;
    --ddd-theme-default-roarLight: #f9eddc;
    --ddd-theme-default-roarMaxlight: #fffaf2;
    --ddd-theme-default-forestGreen: #4a7729;
    --ddd-theme-default-athertonViolet: #ac8dce;
    --ddd-theme-default-original87Pink: #bc204b;
    --ddd-theme-default-discoveryCoral: #f2665e;
    --ddd-theme-default-futureLime: #99cc00;
    --ddd-theme-default-wonderPurple: #491d70;
    --ddd-theme-default-inventOrange: #e98300;
    --ddd-theme-default-opportunityGreen: #008755;
    --ddd-theme-default-globalNeon: #ebff00;
    --ddd-theme-default-accent: #96bee6;
    --ddd-theme-default-white85: rgba(255, 255, 255, 0.85);
    --ddd-theme-default-white65: rgba(255, 255, 255, 0.65);

    /* 
  base colors, cannot be modified by user; SimpleColors hijacks this
  
  Theme level color, components pick up hues of theme color
  
  User can override these colors with their own theme colors
  */

    /* functional colors */
    --ddd-theme-default-link: #005fa9;
    --ddd-theme-default-link80: rgba(0, 95, 169, 0.8);
    --ddd-theme-default-linkLight: #cce9ff;
    --ddd-theme-default-disabled: #f4f4f4;
    --ddd-theme-default-error: #5f2120;
    --ddd-theme-default-errorLight: #fdeded;
    --ddd-theme-default-warning: #663c00;
    --ddd-theme-default-warningLight: #fff4e5;
    --ddd-theme-default-info: #014361;
    --ddd-theme-default-infoLight: #e5f6fd;
    --ddd-theme-default-success: #1e4620;
    --ddd-theme-default-successLight: #edf7ed;
    --ddd-theme-default-alertImmediate: #f8d3de;
    --ddd-theme-default-alertUrgent: #fff6cc;
    --ddd-theme-default-alertAllClear: #f2ffcc;
    --ddd-theme-default-alertNonEmergency: #e6f7ff;
    --ddd-theme-default-background: #eff2f5;
    --ddd-theme-default-disabled: #f4f4f4;

    /* DDDSpecific: Define primary colors in RGB for use in rgba() */
    --ddd-primary-0-rgb: 150, 190, 230, 0.7; /* Pugh Blue */
    --ddd-primary-1-rgb: 30, 64, 124; /* Beaver Blue */
    --ddd-primary-2-rgb: 0, 30, 68; /* Nittany Navy */
    --ddd-primary-3-rgb: 0, 3, 33; /* Potential Midnight */
    --ddd-primary-4-rgb: 38, 38, 38; /* Coaly Gray */
    --ddd-primary-5-rgb: 162, 170, 173; /* Limestone Gray */
    --ddd-primary-6-rgb: 49, 77, 100; /* Slate Gray */
    --ddd-primary-7-rgb: 62, 163, 158; /* Creek Teal */
    --ddd-primary-8-rgb: 0, 156, 222; /* Sky Blue */
    --ddd-primary-9-rgb: 184, 137, 101; /* Shrine Tan */
    --ddd-primary-10-rgb: 191, 130, 38; /* Roar Golden */
    --ddd-primary-11-rgb: 188, 32, 75, 0.7; /* Original 87 Pink */
    --ddd-primary-12-rgb: 242, 102, 94; /* Discovery Coral */
    --ddd-primary-13-rgb: 73, 29, 112; /* Wonder Purple */
    --ddd-primary-14-rgb: 172, 141, 206; /* Atherton Violet */
    --ddd-primary-15-rgb: 233, 131, 0; /* Invent Orange */
    --ddd-primary-16-rgb: 255, 209, 0; /* Keystone Yellow */
    --ddd-primary-17-rgb: 0, 135, 85; /* Opportunity Green */
    --ddd-primary-18-rgb: 153, 204, 0; /* Future Lime */
    --ddd-primary-19-rgb: 74, 119, 41; /* Forest Green */
    --ddd-primary-20-rgb: 106, 48, 40; /* Landgrant Brown */
    --ddd-primary-21-rgb: 235, 255, 0; /* Global Neon */
    --ddd-primary-22-rgb: 95, 33, 32; /* Error */
    --ddd-primary-23-rgb: 102, 60, 0; /* Warning */
    --ddd-primary-24-rgb: 1, 67, 97; /* Info */
    --ddd-primary-25-rgb: 30, 70, 32; /* Success */

    /* primary colors */
    --ddd-primary-0: var(
      --ddd-theme-default-pughBlue
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-1: var(
      --ddd-theme-default-beaverBlue
    ); /* not enough contrast to black */
    --ddd-primary-2: var(
      --ddd-theme-default-nittanyNavy
    ); /* not enough contrast to black */
    --ddd-primary-3: var(
      --ddd-theme-default-potentialMidnight
    ); /* not enough contrast to black */
    --ddd-primary-4: var(
      --ddd-theme-default-coalyGray
    ); /* not enough contrast to black */
    --ddd-primary-5: var(
      --ddd-theme-default-limestoneGray
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-6: var(
      --ddd-theme-default-slateGray
    ); /* not enough contrast to black */
    --ddd-primary-7: var(
      --ddd-theme-default-creekTeal
    ); /* not enough contrast to accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-8: var(
      --ddd-theme-default-skyBlue
    ); /* not enough contrast to accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-9: var(
      --ddd-theme-default-shrineTan
    ); /* not enough contrast to accent-5 3, 1*/
    --ddd-primary-10: var(
      --ddd-theme-default-roarGolden
    ); /* not enough contrast to accent-0, accent-1, accent-2 */
    --ddd-primary-11: var(--ddd-theme-default-original87Pink);
    --ddd-primary-12: var(
      --ddd-theme-default-discoveryCoral
    ); /* not enough contrast to accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-13: var(
      --ddd-theme-default-wonderPurple
    ); /* not enough contrast to black */
    --ddd-primary-14: var(
      --ddd-theme-default-athertonViolet
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-15: var(
      --ddd-theme-default-inventOrange
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-16: var(
      --ddd-theme-default-keystoneYellow
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-17: var(--ddd-theme-default-opportunityGreen);
    --ddd-primary-18: var(
      --ddd-theme-default-futureLime
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-19: var(--ddd-theme-default-forestGreen);
    --ddd-primary-20: var(
      --ddd-theme-default-landgrantBrown
    ); /* not enough contrast to black */
    --ddd-primary-21: var(
      --ddd-theme-default-globalNeon
    ); /* not enough contrast to white, accent-0, accent-1, accent-2, accent-3, accent-4, accent-5 */
    --ddd-primary-22: var(--ddd-theme-default-error);
    --ddd-primary-23: var(--ddd-theme-default-warning);
    --ddd-primary-24: var(--ddd-theme-default-info);
    --ddd-primary-25: var(--ddd-theme-default-success);

    /* accent colors */

    --ddd-accent-0: var(--ddd-theme-default-skyMaxLight);
    --ddd-accent-1: var(--ddd-theme-default-slateMaxLight);
    --ddd-accent-2: var(--ddd-theme-default-limestoneMaxLight);
    --ddd-accent-3: var(--ddd-theme-default-shrineMaxLight);
    --ddd-accent-4: var(--ddd-theme-default-roarMaxlight);
    --ddd-accent-5: var(--ddd-theme-default-creekMaxLight);
    --ddd-accent-6: var(--ddd-theme-default-white);
    --ddd-accent-7: var(--ddd-theme-default-errorLight);
    --ddd-accent-8: var(--ddd-theme-default-warningLight);
    --ddd-accent-9: var(--ddd-theme-default-infoLight);
    --ddd-accent-10: var(--ddd-theme-default-successLight);
    --ddd-accent-11: var(--ddd-theme-default-alertImmediate);
    --ddd-accent-12: var(--ddd-theme-default-alertUrgent);
    --ddd-accent-13: var(--ddd-theme-default-alertAllClear);
    --ddd-accent-14: var(--ddd-theme-default-alertNonEmergency);

    /*fonts*/
    --ddd-font-primary: "Roboto", "Franklin Gothic Medium", Tahoma, sans-serif;
    --ddd-font-secondary: "Roboto Slab", serif;
    --ddd-font-navigation: "Roboto Condensed", sans-serif; /* navigation font */

    /* font weights - generalized */
    --ddd-font-weight-light: 300;
    --ddd-font-weight-regular: 400; /* default weight for body */
    --ddd-font-weight-medium: 500;
    --ddd-font-weight-bold: 700; /* default weight for headers */
    --ddd-font-weight-black: 900;

    /* font sizes */
    --ddd-font-size-4xs: 16px;
    --ddd-font-size-3xs: 18px; /* body default */
    --ddd-font-size-xxs: 20px; /* h6 */
    --ddd-font-size-xs: 22px; /* h5 */
    --ddd-font-size-s: 24px; /* h4 */
    --ddd-font-size-ms: 28px; /* h3 */
    --ddd-font-size-m: 32px; /* h2 */
    --ddd-font-size-ml: 36px;
    --ddd-font-size-l: 40px; /* h1 */
    --ddd-font-size-xl: 48px;
    --ddd-font-size-xxl: 56px;
    --ddd-font-size-3xl: 64px;
    --ddd-font-size-4xl: 72px;

    --ddd-font-size-type1-s: 80px;
    --ddd-font-size-type1-m: 150px;
    --ddd-font-size-type1-l: 200px;

    /* global override font styles for light-dom content */
    --ddd-theme-h1-font-size: var(--ddd-font-size-l);
    --ddd-theme-h2-font-size: var(--ddd-font-size-m);
    --ddd-theme-h3-font-size: var(--ddd-font-size-ms);
    --ddd-theme-h4-font-size: var(--ddd-font-size-s);
    --ddd-theme-h5-font-size: var(--ddd-font-size-xs);
    --ddd-theme-h6-font-size: var(--ddd-font-size-xxs);
    --ddd-theme-body-font-size: var(--ddd-font-size-xxs);

    /* letter spacing */
    --ddd-ls-16-sm: 0.08px;
    --ddd-ls-18-sm: 0.09px;
    --ddd-ls-20-sm: 0.1px;
    --ddd-ls-22-sm: 0.11px;
    --ddd-ls-24-sm: 0.12px;
    --ddd-ls-28-sm: 0.14px;
    --ddd-ls-32-sm: 0.16px;
    --ddd-ls-36-sm: 0.18px;
    --ddd-ls-40-sm: 0.2px;
    --ddd-ls-48-sm: 0.24px;
    --ddd-ls-56-sm: 0.28px;
    --ddd-ls-64-sm: 0.32px;
    --ddd-ls-72-sm: 0.36px;
    --ddd-ls-16-lg: 0.24px;
    --ddd-ls-18-lg: 0.27px;
    --ddd-ls-20-lg: 0.3px;
    --ddd-ls-22-lg: 0.33px;
    --ddd-ls-24-lg: 0.36px;
    --ddd-ls-28-lg: 0.42px;
    --ddd-ls-32-lg: 0.48px;
    --ddd-ls-36-lg: 0.54px;
    --ddd-ls-40-lg: 0.6px;
    --ddd-ls-48-lg: 0.72px;
    --ddd-ls-56-lg: 0.84px;
    --ddd-ls-64-lg: 0.96px;
    --ddd-ls-72-lg: 1.08px;

    /* line height */
    --ddd-lh-120: 120%;
    --ddd-lh-140: 140%;
    --ddd-lh-150: 150%;

    /* spacing */
    --ddd-spacing-0: 0px;
    --ddd-spacing-1: 4px; /*  body default */
    --ddd-spacing-2: 8px;
    --ddd-spacing-3: 12px; /* h6 */
    --ddd-spacing-4: 16px; /* h5 */
    --ddd-spacing-5: 20px; /* h4 */
    --ddd-spacing-6: 24px; /* h3 */
    --ddd-spacing-7: 28px; /* h2 */
    --ddd-spacing-8: 32px; /* h1 */
    --ddd-spacing-9: 36px;
    --ddd-spacing-10: 40px;
    --ddd-spacing-11: 44px;
    --ddd-spacing-12: 48px;
    --ddd-spacing-13: 52px;
    --ddd-spacing-14: 56px;
    --ddd-spacing-15: 60px;
    --ddd-spacing-16: 64px;
    --ddd-spacing-17: 68px;
    --ddd-spacing-18: 72px;
    --ddd-spacing-19: 76px;
    --ddd-spacing-20: 80px;
    --ddd-spacing-21: 84px;
    --ddd-spacing-22: 88px;
    --ddd-spacing-23: 92px;
    --ddd-spacing-24: 96px;
    --ddd-spacing-25: 100px;
    --ddd-spacing-26: 104px;
    --ddd-spacing-27: 108px;
    --ddd-spacing-28: 112px;
    --ddd-spacing-29: 116px;
    --ddd-spacing-30: 120px;

    /* borders */
    --ddd-border-xs: 1px solid var(--ddd-theme-default-limestoneLight);
    --ddd-border-sm: 2px solid var(--ddd-theme-default-limestoneLight);
    --ddd-border-md: 3px solid var(--ddd-theme-default-limestoneLight);
    --ddd-border-lg: 4px solid var(--ddd-theme-default-limestoneLight);

    --ddd-border-size-xs: 1px;
    --ddd-border-size-sm: 2px;
    --ddd-border-size-md: 3px;
    --ddd-border-size-lg: 4px;

    --ddd-theme-header-border-thickness-0: 0px;
    --ddd-theme-header-border-thickness-xs: 1px;
    --ddd-theme-header-border-thickness-sm: 2px;
    --ddd-theme-header-border-thickness-md: 3px;
    --ddd-theme-header-border-thickness-lg: 4px;

    --ddd-theme-header-border-treatment-0: 0px;
    --ddd-theme-header-border-treatment-10p: 10%; /* good */
    --ddd-theme-header-border-treatment-25p: 25%; /* good */
    --ddd-theme-header-border-treatment-50p: 50%; /* good */
    --ddd-theme-header-border-treatment-75p: 75%;
    --ddd-theme-header-border-treatment-full: 100%; /* good */
    --ddd-theme-header-border-treatment-sm: 28px;
    --ddd-theme-header-border-treatment-md: 56px; /* good */
    --ddd-theme-header-border-treatment-lg: 84px; /* good */

    --ddd-theme-header-border-thickness: var(
      --ddd-theme-header-border-thickness-lg
    );
    --ddd-theme-header-border-color: var(--ddd-theme-primary);
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-lg
    );

    /* shadows */
    --ddd-boxShadow-0: 0px 0px 0px 0px rgba(0, 0, 0, 0);
    --ddd-boxShadow-sm: rgba(0, 3, 33, 0.063) 0px 4px 8px 0px;
    --ddd-boxShadow-md: rgba(0, 3, 33, 0.063) 0px 8px 16px 0px;
    --ddd-boxShadow-lg: rgba(0, 3, 33, 0.063) 0px 12px 24px 0px;
    --ddd-boxShadow-xl: rgba(0, 3, 33, 0.063) 0px 16px 32px 0px;

    /* breakpoints */
    --ddd-breakpoint-sm: 360px;
    --ddd-breakpoint-md: 768px;
    --ddd-breakpoint-lg: 1080px;
    --ddd-breakpoint-xl: 1440px;

    /* Radius */
    --ddd-radius-0: 0px;
    --ddd-radius-xs: 4px;
    --ddd-radius-sm: 8px;
    --ddd-radius-md: 12px;
    --ddd-radius-lg: 16px;
    --ddd-radius-xl: 20px;
    --ddd-radius-rounded: 100px;
    --ddd-radius-circle: 100%;

    /* Gradients */
    --ddd-theme-default-gradient-navBar: linear-gradient(
      90deg,
      rgb(0, 30, 68) 0%,
      rgb(0, 30, 68) 31%,
      rgb(30, 64, 124) 76%,
      rgb(0, 3, 33) 100%
    );
    --ddd-theme-default-gradient-footer: linear-gradient(
      rgb(30, 64, 124) 0%,
      rgb(0, 30, 68) 65%,
      rgb(0, 30, 68) 100%
    );
    --ddd-theme-default-gradient-newsFeature: linear-gradient(
      360deg,
      rgb(30, 64, 124) 20%,
      rgb(0, 156, 222) 100%
    );
    --ddd-theme-default-gradient-buttons: linear-gradient(
      rgb(0, 156, 222) 0%,
      rgb(30, 64, 124) 85%
    );
    --ddd-theme-default-gradient-hero: linear-gradient(
      360deg,
      rgba(0, 30, 68, 0.8) 0%,
      rgba(0, 30, 68, 0.4) 50%,
      rgba(0, 3, 33, 0) 100%
    );
    --ddd-theme-default-gradient-hero2: linear-gradient(
      360deg,
      rgb(0, 30, 68) 0%,
      rgba(0, 30, 68, 0.4) 50%,
      rgba(0, 3, 33, 0) 100%
    );
    --ddd-theme-default-gradient-antihero: linear-gradient(
      180deg,
      rgba(0, 30, 68, 0.8) 0%,
      rgba(0, 30, 68, 0.4) 50%,
      rgba(0, 3, 33, 0) 100%
    );
    --ddd-theme-default-gradient-antihero2: linear-gradient(
      180deg,
      rgb(0, 30, 68) 0%,
      rgba(0, 30, 68, 0.4) 50%,
      rgba(0, 3, 33, 0) 100%
    );

    --ddd-icon-3xs: 20px;
    --ddd-icon-xxs: 24px;
    --ddd-icon-xs: 32px;
    --ddd-icon-sm: 40px;
    --ddd-icon-md: 48px;
    --ddd-icon-lg: 56px;
    --ddd-icon-xl: 64px;
    --ddd-icon-2xl: 72px;
    --ddd-icon-3xl: 84px;
    --ddd-icon-4xl: 96px;

    /* borrowed from base styling */

    scroll-behavior: smooth;
    font-family: var(--ddd-font-primary);
    font-size: var(--ddd-theme-body-font-size);
    font-weight: var(--ddd-font-weight-regular);
    letter-spacing: normal;
    --simple-modal-content-container-color: light-dark(
      var(--ddd-primary-4),
      var(--ddd-accent-6)
    );
    --simple-modal-content-container-background: light-dark(
      var(--ddd-accent-6),
      var(--ddd-primary-4)
    );
  }

  body.dark-mode {
    color-scheme: only dark;
  }
`;
/* Data Attributes used by HAX */
export const DDDDataAttributes = [
  css`
    /* basic width operation, not great but not terrible */
    @media (min-width: 600px) {
      [data-width="25"] {
        width: 25%;
      }
      [data-width="50"] {
        width: 50%;
      }
      [data-width="75"] {
        width: 75%;
      }
      [data-width="100"] {
        width: 100%;
      }
    }

    /* Float positioning for larger devices */
    @media (min-width: 1440px) {
      [data-float-position="left"] {
        float: left;
        margin: var(--ddd-spacing-8) var(--ddd-spacing-8) 0 var(--ddd-spacing-4);
      }
      [data-float-position="right"] {
        float: right;
        margin: var(--ddd-spacing-8) var(--ddd-spacing-4) 0 var(--ddd-spacing-8);
      }
      [data-hax-ray][data-float-position]:focus-within::after,
      [data-hax-ray][data-float-position]:hover::after {
        content: "Floating item";
        position: absolute;
        white-space: nowrap;
        font-style: normal;
        position: absolute;
        padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        color: var(
          --ddd-theme-font-color,
          var(--ddd-theme-default-white, #fff)
        );
        background-color: var(
          --ddd-theme-default-info,
          rgba(175, 184, 193, 0.2)
        );
        font-size: var(--ddd-theme-body-font-size);
        font-weight: var(--ddd-font-weight-regular);
        border-radius: var(--ddd-radius-xs);
        right: var(--ddd-spacing-4);
        left: unset;
        margin-top: -16px;
      }
      [data-hax-ray][data-float-position="left"]:focus-within::after,
      [data-hax-ray][data-float-position="left"]:hover::after {
        left: var(--ddd-spacing-4);
        right: unset;
      }
    }

    /* basic text operations, not DDD specific persay */
    [data-text-align="left"] {
      text-align: left;
    }
    [data-text-align="center"] {
      text-align: center;
    }
    [data-text-align="right"] {
      text-align: right;
    }
    [data-text-align="justify"] {
      text-align: justify;
    }

    /* primary color */
    [data-primary="0"] {
      --ddd-theme-primary: var(--ddd-primary-0);
      --lowContrast-override: black;
    }
    [data-primary="1"] {
      --ddd-theme-primary: var(--ddd-primary-1);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="2"] {
      --ddd-theme-primary: var(--ddd-primary-2);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="3"] {
      --ddd-theme-primary: var(--ddd-primary-3);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="4"] {
      --ddd-theme-primary: var(--ddd-primary-4);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="5"] {
      --ddd-theme-primary: var(--ddd-primary-5);
      --lowContrast-override: black;
    }
    [data-primary="6"] {
      --ddd-theme-primary: var(--ddd-primary-6);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="7"] {
      --ddd-theme-primary: var(--ddd-primary-7);
      --lowContrast-override: black;
    }
    [data-primary="8"] {
      --ddd-theme-primary: var(--ddd-primary-8);
      --lowContrast-override: black;
    }
    [data-primary="9"] {
      --ddd-theme-primary: var(--ddd-primary-9);
      --lowContrast-override: black;
    }
    [data-primary="10"] {
      --ddd-theme-primary: var(--ddd-primary-10);
      --lowContrast-override: black;
    }
    [data-primary="11"] {
      --ddd-theme-primary: var(--ddd-primary-11);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="12"] {
      --ddd-theme-primary: var(--ddd-primary-12);
      --lowContrast-override: black;
    }
    [data-primary="13"] {
      --ddd-theme-primary: var(--ddd-primary-13);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="14"] {
      --ddd-theme-primary: var(--ddd-primary-14);
      --lowContrast-override: black;
    }
    [data-primary="15"] {
      --ddd-theme-primary: var(--ddd-primary-15);
      --lowContrast-override: black;
    }
    [data-primary="16"] {
      --ddd-theme-primary: var(--ddd-primary-16);
      --lowContrast-override: black;
    }
    [data-primary="17"] {
      --ddd-theme-primary: var(--ddd-primary-17);
      --lowContrast-override: black;
    }
    [data-primary="18"] {
      --ddd-theme-primary: var(--ddd-primary-18);
      --lowContrast-override: black;
    }
    [data-primary="19"] {
      --ddd-theme-primary: var(--ddd-primary-19);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="20"] {
      --ddd-theme-primary: var(--ddd-primary-20);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="21"] {
      --ddd-theme-primary: var(--ddd-primary-21);
      --lowContrast-override: black;
    }
    [data-primary="22"] {
      --ddd-theme-primary: var(--ddd-primary-22);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="23"] {
      --ddd-theme-primary: var(--ddd-primary-23);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="24"] {
      --ddd-theme-primary: var(--ddd-primary-24);
      --ddd-theme-bgContrast: white;
    }
    [data-primary="25"] {
      --ddd-theme-primary: var(--ddd-primary-25);
      --ddd-theme-bgContrast: white;
    }

    /* accent color */
    [data-accent] {
      --ddd-theme-colorContrast: black;
    }
    [data-accent="0"] {
      --ddd-theme-accent: var(--ddd-accent-0);
    }
    [data-accent="1"] {
      --ddd-theme-accent: var(--ddd-accent-1);
    }
    [data-accent="2"] {
      --ddd-theme-accent: var(--ddd-accent-2);
    }
    [data-accent="3"] {
      --ddd-theme-accent: var(--ddd-accent-3);
    }
    [data-accent="4"] {
      --ddd-theme-accent: var(--ddd-accent-4);
    }
    [data-accent="5"] {
      --ddd-theme-accent: var(--ddd-accent-5);
    }
    [data-accent="6"] {
      --ddd-theme-accent: var(--ddd-accent-6);
    }
    [data-accent="7"] {
      --ddd-theme-accent: var(--ddd-accent-7);
    }
    [data-accent="8"] {
      --ddd-theme-accent: var(--ddd-accent-8);
    }
    [data-accent="9"] {
      --ddd-theme-accent: var(--ddd-accent-9);
    }
    [data-accent="10"] {
      --ddd-theme-accent: var(--ddd-accent-10);
    }
    [data-accent="11"] {
      --ddd-theme-accent: var(--ddd-accent-11);
    }
    [data-accent="12"] {
      --ddd-theme-accent: var(--ddd-accent-12);
    }
    [data-accent="13"] {
      --ddd-theme-accent: var(--ddd-accent-13);
    }
    [data-accent="14"] {
      --ddd-theme-accent: var(--ddd-accent-14);
    }

    [data-primary="19"][data-accent="11"],
    [data-primary="11"][data-accent="11"] {
      --lowContrast-override: black;
    }

    /* font family */

    [data-font-family="primary"] {
      font-family: var(--ddd-font-primary);
    }
    [data-font-family="secondary"] {
      font-family: var(--ddd-font-secondary);
    }
    [data-font-family="navigation"] {
      font-family: var(--ddd-font-navigation);
    }

    /* font weight */

    [data-font-weight="light"] {
      font-weight: var(--ddd-font-weight-light);
    }
    [data-font-weight="regular"] {
      font-weight: var(--ddd-font-weight-regular);
    }
    [data-font-weight="medium"] {
      font-weight: var(--ddd-font-weight-medium);
    }
    [data-font-weight="bold"] {
      font-weight: var(--ddd-font-weight-bold);
    }
    [data-font-weight="black"] {
      font-weight: var(--ddd-font-weight-black);
    }

    /* font size */
    /* normal line height if we are letting use mess w/ font size */
    [data-font-size] {
      line-height: normal;
    }
    [data-font-size="4xs"] {
      font-size: var(--ddd-font-size-4xs);
    }
    [data-font-size="3xs"] {
      font-size: var(--ddd-font-size-3xs);
    }
    [data-font-size="xxs"] {
      font-size: var(--ddd-font-size-xxs);
    }
    [data-font-size="xs"] {
      font-size: var(--ddd-font-size-xs);
    }
    [data-font-size="s"] {
      font-size: var(--ddd-font-size-s);
    }
    [data-font-size="ms"] {
      font-size: var(--ddd-font-size-ms);
    }
    [data-font-size="m"] {
      font-size: var(--ddd-font-size-m);
    }
    [data-font-size="ml"] {
      font-size: var(--ddd-font-size-ml);
    }
    [data-font-size="l"] {
      font-size: var(--ddd-font-size-l);
    }
    [data-font-size="xl"] {
      font-size: var(--ddd-font-size-xl);
    }
    [data-font-size="xxl"] {
      font-size: var(--ddd-font-size-xxl);
    }
    [data-font-size="3xl"] {
      font-size: var(--ddd-font-size-3xl);
    }
    [data-font-size="4xl"] {
      font-size: var(--ddd-font-size-4xl);
    }
    [data-font-size="type1-s"] {
      font-size: var(--ddd-font-size-type1-s);
    }
    [data-font-size="type1-m"] {
      font-size: var(--ddd-font-size-type1-m);
    }
    [data-font-size="type1-l"] {
      font-size: var(--ddd-font-size-type1-l);
    }
    /* padding spacing in content, only apply above small screens */
    @media (min-width: 600px) {
      [data-design-treatment="bg"][data-padding="xs"],
      [data-accent][data-padding="xs"],
      [data-padding="xs"] {
        padding: var(--ddd-spacing-2);
      }
      [data-design-treatment="bg"][data-padding="s"],
      [data-accent][data-padding="s"],
      [data-padding="s"] {
        padding: var(--ddd-spacing-4);
      }
      [data-design-treatment="bg"][data-padding="m"],
      [data-accent][data-padding="m"],
      [data-padding="m"] {
        padding: var(--ddd-spacing-8);
      }
      [data-design-treatment="bg"][data-padding="l"],
      [data-accent][data-padding="l"],
      [data-padding="l"] {
        padding: var(--ddd-spacing-12);
      }
      [data-design-treatment="bg"][data-padding="xl"],
      [data-accent][data-padding="xl"],
      [data-padding="xl"] {
        padding: var(--ddd-spacing-16);
      }
      /* margin spacing */
      [data-margin="center"] {
        margin-left: auto;
        margin-right: auto;
      }
      [data-margin="xs"] {
        margin: var(--ddd-spacing-2);
      }
      [data-margin="s"] {
        margin: var(--ddd-spacing-4);
      }
      [data-margin="m"] {
        margin: var(--ddd-spacing-8);
      }
      [data-margin="l"] {
        margin: var(--ddd-spacing-12);
      }
      [data-margin="xl"] {
        margin: var(--ddd-spacing-16);
      }
    }

    /* border width */
    p[data-border],
    blockquote[data-border],
    ol[data-border],
    ul[data-border],
    div[data-border] [data-border] {
      border-color: var(--ddd-theme-primary);
    }
    [data-border="xs"] {
      border: var(--ddd-border-xs);
      --ddd-theme-border-size: var(--ddd-border-size-xs);
    }
    [data-border="sm"] {
      border: var(--ddd-border-sm);
      --ddd-theme-border-size: var(--ddd-border-size-sm);
    }
    [data-border="md"] {
      border: var(--ddd-border-md);
      --ddd-theme-border-size: var(--ddd-border-size-md);
    }
    [data-border="lg"] {
      border: var(--ddd-border-lg);
      --ddd-theme-border-size: var(--ddd-border-size-lg);
    }

    /* border-radius */
    [data-border-radius="xs"] {
      border-radius: var(--ddd-radius-xs);
    }
    [data-border-radius="sm"] {
      border-radius: var(--ddd-radius-sm);
    }
    [data-border-radius="md"] {
      border-radius: var(--ddd-radius-md);
    }
    [data-border-radius="lg"] {
      border-radius: var(--ddd-radius-lg);
    }
    [data-border-radius="xl"] {
      border-radius: var(--ddd-radius-xl);
    }

    /* box-shadow */
    [data-box-shadow="sm"] {
      box-shadow: var(--ddd-boxShadow-sm);
    }
    [data-box-shadow="md"] {
      box-shadow: var(--ddd-boxShadow-md);
    }
    [data-box-shadow="lg"] {
      box-shadow: var(--ddd-boxShadow-lg);
    }
    [data-box-shadow="xl"] {
      box-shadow: var(--ddd-boxShadow-xl);
    }
  `,
  ...instructionalStyles,
];

/* Tag based application */
export const DDDReset = css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--ddd-font-primary);
    font-weight: var(--ddd-font-weight-bold);
    line-height: auto;
    letter-spacing: auto;
  }

  h1 {
    margin: var(--ddd-spacing-12) 0 var(--ddd-spacing-8);
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: var(--ddd-spacing-8) 0 var(--ddd-spacing-4);
    padding: 0;
  }
  h1 + h2,
  h1 + h3,
  h1 + h4,
  h1 + h5,
  h1 + h6,
  h2 + h3,
  h2 + h4,
  h2 + h5,
  h2 + h6,
  h3 + h4,
  h3 + h5,
  h3 + h6,
  h4 + h5,
  h4 + h6,
  h5 + h6 {
    margin-top: 0;
  }
  h1 {
    font-size: var(--ddd-theme-h1-font-size);
  }
  h2 {
    font-size: var(--ddd-theme-h2-font-size);
  }
  h3 {
    font-size: var(--ddd-theme-h3-font-size);
  }
  h4 {
    font-size: var(--ddd-theme-h4-font-size);
  }
  h5 {
    font-size: var(--ddd-theme-h5-font-size);
  }
  h6 {
    font-size: var(--ddd-theme-h6-font-size);
  }
  h1 + p,
  h2 + p,
  h3 + p,
  h4 + p,
  h5 + p,
  h6 + p {
    margin-top: 0;
  }
  p {
    margin: var(--ddd-spacing-6) 0;
  }
  dl {
    padding: var(--ddd-spacing-6);
    margin: 0;
    border: var(--ddd-border-sm);
  }
  dt {
    font-weight: var(--ddd-font-weight-bold);
    font-size: var(--ddd-theme-h6-font-size);
  }
  dd {
    margin-bottom: var(--ddd-spacing-4);
    margin-inline-start: var(--ddd-spacing-8);
  }

  p[data-accent],
  blockquote[data-accent],
  ol[data-accent],
  ul[data-accent],
  div[data-accent] {
    color: light-dark(currentcolor, var(--ddd-theme-colorContrast));
    border: var(--ddd-border-sm);
    border-color: var(--ddd-theme-primary);
    border-width: var(--ddd-theme-border-size);
    background-color: var(--ddd-theme-accent);
  }
  p[data-accent]:not([data-padding]),
  blockquote[data-accent]:not([data-padding]),
  ol[data-accent]:not([data-padding]),
  ul[data-accent]:not([data-padding]),
  div[data-accent]:not([data-padding]),
  p[data-border]:not([data-padding]),
  blockquote[data-border]:not([data-padding]),
  ol[data-border]:not([data-padding]),
  ul[data-border]:not([data-padding]),
  div[data-border]:not([data-padding]) {
    padding: var(--ddd-spacing-6);
  }
  ol[data-accent],
  ul[data-accent] {
    padding-left: var(--ddd-spacing-9);
  }
  /* p uniformity but ignore if either is in a slot */
  p:not([slot]) + p:not([slot]) {
    margin-top: 0;
  }

  /* heading presets */
  h1.type1 {
    font-size: var(--ddd-font-size-type1-s);
    font-weight: var(--ddd-font-weight-black);
    display: flex;
    text-align: center;
    justify-content: center;
    width: 100%;
    color: var(--ddd-theme-default-white);
    flex-wrap: nowrap;
    overflow-wrap: normal;
    text-wrap: wrap;
  }
  @media (min-width: 768px) {
    h1.type1 {
      font-size: var(--ddd-font-size-type1-m);
    }
  }
  @media (min-width: 1080px) {
    h1.type1 {
      font-size: var(--ddd-font-size-type1-l);
    }
  }

  h2.type2 {
    font-size: var(--ddd-font-size-4xl);
    color: var(--ddd-theme-default-beaverBlue);
  }
  .h2 > hr {
    width: 84px;
    border-width: 4px;
    margin-top: var(--ddd-spacing-6);
  }
  h2.type3 {
    font-size: var(--ddd-font-size-xxl);
    color: var(--ddd-theme-default-nittanyNavy);
  }

  a,
  a:any-link,
  a:-webkit-any-link {
    line-break: auto;
    color: var(--ddd-theme-default-link);
    font-weight: var(--ddd-font-weight-bold);
    text-decoration: none;
    background-color: var(--ddd-theme-accent);
  }
  a:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  thead,
  tbody,
  tfoot,
  tr,
  td,
  th {
    font-size: var(--ddd-theme-body-font-size);
    font-family: var(--ddd-font-primary);
  }
  ul,
  ol {
    font-size: var(--ddd-theme-body-font-size);
    display: flex;
    flex-flow: column;
    gap: var(--ddd-spacing-3);
    font-family: var(--ddd-font-primary);
    margin: 0 0 var(--ddd-spacing-6) 0;
  }
  ul.link-list {
    list-style: none;
  }
  ul.link-list li::after {
    content: url('data:image/svg+xml; utf8, <svg style="width:32px;height:32px;" fill="%23005fa9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="%23005fa9" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>');
    height: calc(var(--ddd-theme-body-font-size) + 2px);
    width: calc(var(--ddd-theme-body-font-size) + 2px);
    display: inline-block;
    position: relative;
    bottom: calc(-1 * var(--ddd-spacing-1));
    left: 0px;
  }
  ul li,
  ol li {
    font-size: var(--ddd-theme-body-font-size);
  }
  ul li::marker,
  ol li::marker {
    unicode-bidi: isolate;
    font-variant-numeric: tabular-nums;
    text-transform: none;
    text-indent: 0px;
    text-align: start;
    text-align-last: start;
  }
  ul {
    list-style: square;
  }
  ul li::marker {
    color: var(
      --lowContrast-override,
      var(--ddd-theme-primary, var(--ddd-theme-default-skyBlue))
    );
  }
  blockquote {
    font-family: var(--ddd-font-primary);
    font-size: var(--ddd-theme-body-font-size);
    font-style: italic;
    border-left: var(--ddd-spacing-1) solid var(--ddd-theme-primary);
    padding-left: var(--ddd-spacing-6);
    padding-bottom: var(--ddd-spacing-2);
    margin: var(--ddd-spacing-9) 0 var(--ddd-spacing-9) var(--ddd-spacing-10);
    line-height: var(--ddd-lh-150);
  }
  hr {
    display: block;
    border: none;
    border-color: var(--ddd-theme-primary);
    border-top-width: var(--ddd-theme-header-border-thickness);
    border-top-style: solid;
    margin: 0 auto;
    padding: 0;
  }

  .h-invert {
    background-color: var(--ddd-theme-primary);
    color: var(--ddd-theme-bgContrast);
  }

  /** smooth transitions in hax when applying these design system attributes */
  [data-hax-ray][data-design-treatment],
  [data-hax-ray][data-accent],
  [data-hax-ray][data-primary],
  [data-hax-ray][data-padding],
  [data-hax-ray][data-margin],
  [data-hax-ray][data-width] {
    transition:
      padding 0.3s ease-in-out,
      margin 0.3s ease-in-out,
      border 0.3s ease-in-out,
      color 0.3s ease-in-out,
      width 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out,
      border-radius 0.3s ease-in-out,
      background-color 0.3s ease-in-out;
  }

  [data-design-treatment="vert"] {
    border-bottom: none;
    border-left: var(--ddd-theme-header-border-thickness) solid
      var(--ddd-theme-primary, var(--ddd-primary-0));
    padding-left: var(--ddd-spacing-3);
  }

  [data-design-treatment="horz-10p"] {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-10p
    );
  }
  [data-design-treatment="horz-25p"] {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-25p
    );
  }
  [data-design-treatment="horz-50p"] {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-50p
    );
  }
  [data-design-treatment="horz-full"] {
    --ddd-theme-header-border-treatment: calc(
      var(--ddd-theme-header-border-treatment-full) - 32px
    );
  }
  [data-instructional-action][data-design-treatment="horz-full"] {
    --ddd-theme-header-border-treatment: calc(
      var(--ddd-theme-header-border-treatment-full) - 32px - 40px
    );
  }
  [data-design-treatment="horz-md"] {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-md
    );
  }
  [data-design-treatment="horz-lg"] {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-lg
    );
  }

  [data-design-treatment^="horz"]::after {
    content: "";
    transition: width 0.3s ease-in-out;
    width: var(--ddd-theme-header-border-treatment);
    border-bottom: var(--ddd-theme-header-border-thickness) solid
      var(--ddd-theme-primary, var(--ddd-primary-0));
    height: 0;
    display: block;
    padding-top: var(--ddd-spacing-2);
  }

  [data-instructional-action][data-design-treatment^="horz"]::after {
    content: "";
    width: var(--ddd-theme-header-border-treatment);
    border-bottom: var(--ddd-theme-header-border-thickness) solid
      var(--ddd-theme-primary, var(--ddd-primary-0));
    height: 0;
    display: block;
    position: relative;
    bottom: 12px;
    left: 32px;
    margin-left: var(--ddd-spacing-3);
  }

  [data-design-treatment="bg"] {
    background-color: var(--ddd-theme-primary, var(--ddd-primary-0));
    color: var(--ddd-theme-bgContrast);
    padding: var(--ddd-spacing-3);
  }

  [data-instructional-action][data-design-treatment="bg"] {
    padding: var(--ddd-spacing-2);
  }

  [data-instructional-action][data-design-treatment="bg"]::before {
    background-color: var(--ddd-theme-bgContrast, black);
    margin-right: var(--ddd-spacing-3);
    margin-left: var(--ddd-spacing-1);
  }

  [data-instructional-action]::before {
    content: "";
    display: inline-flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 0 0;
    margin: 8px 4px 0 0;
    z-index: 2;
    background-color: var(
      --lowContrast-override,
      var(--ddd-theme-primary, var(--instructional-action-color, blue))
    );
    mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    height: var(--ddd-icon-sm);
    width: var(--ddd-icon-sm);
  }

  [data-design-treatment] {
    transition:
      0.3s ease-in-out margin,
      0.3s ease-in-out background-color,
      0.3s ease-in-out padding,
      0.3s ease-in-out border;
  }

  [data-accent] [data-design-treatment^="dropCap"] {
    min-height: calc(
      (var(--initialLetter) * var(--ddd-theme-body-font-size) + 20px)
    );
  }

  [data-design-treatment^="dropCap"] {
    --initialLetter: 6;
    min-height: calc(
      (var(--initialLetter) * var(--ddd-theme-body-font-size) * 1.5) + 20px
    );
  }

  [data-design-treatment^="dropCap"]::first-letter {
    -webkit-initial-letter: var(--initialLetter);
    text-transform: uppercase;
    initial-letter: var(--initialLetter);
    color: var(--ddd-theme-primary);
    font-weight: var(--ddd-font-weight-bold);
    margin-right: var(--ddd-spacing-3);
    padding: 0 var(--ddd-spacing-1);
    text-shadow:
      -3px -3px 0 #000,
      3px -3px 0 #000,
      -3px 3px 0 #000,
      3px 3px 0 #000,
      -3px 0 0 #000,
      3px 0 0 #000,
      0 -3px 0 #000,
      0 3px 0 #000;
  }
  [data-design-treatment="dropCap-xs"] {
    --initialLetter: 2;
  }

  [data-design-treatment="dropCap-sm"] {
    --initialLetter: 4;
  }

  [data-design-treatment="dropCap-md"] {
    --initialLetter: 6;
  }

  [data-design-treatment="dropCap-lg"] {
    --initialLetter: 8;
  }

  [data-design-treatment="dropCap-xl"] {
    --initialLetter: 10;
  }

  [data-design-treatment="dropCap-xs"]::first-letter {
    margin-right: var(--ddd-spacing-1);
  }

  [data-design-treatment="dropCap-sm"]::first-letter {
    margin-right: var(--ddd-spacing-2);
  }

  [data-design-treatment="dropCap-md"]::first-letter {
    margin-right: var(--ddd-spacing-3);
  }

  [data-design-treatment="dropCap-lg"]::first-letter {
    margin-right: var(--ddd-spacing-4);
  }

  [data-design-treatment="dropCap-xl"]::first-letter {
    margin-right: var(--ddd-spacing-5);
  }

  /* dropCap outline for low contrasting colors 
  [data-design-treatment^="dropCap"][data-primary="0"]::first-letter,
  [data-design-treatment^="dropCap"][data-primary="5"]::first-letter,
  [data-design-treatment^="dropCap"][data-accent][data-primary="7"]::first-letter,
  [data-design-treatment^="dropCap"][data-accent][data-primary="8"]::first-letter,
  [data-design-treatment^="dropCap"][data-accent][data-primary="9"]::first-letter,
  [data-design-treatment^="dropCap"][data-accent][data-primary="10"]::first-letter,
  [data-design-treatment^="dropCap"][data-accent][data-primary="12"]::first-letter,
  [data-design-treatment^="dropCap"][data-primary="14"]::first-letter,
  [data-design-treatment^="dropCap"][data-primary="15"]::first-letter,
  [data-design-treatment^="dropCap"][data-primary="16"]::first-letter,
  [data-design-treatment^="dropCap"][data-primary="18"]::first-letter,
  [data-design-treatment^="dropCap"][data-primary="21"]::first-letter
  */

  /** These are for Firefox / browsers not supporting dropcap in order to fake support */

  .dropCap-noSupport [data-design-treatment^="dropCap"]::first-letter {
    font-size: 180px;
    float: left;
    padding: 8px 0px 0px 0px;
  }

  .dropCap-noSupport [data-design-treatment^="dropCap-xs"]::first-letter {
    font-size: 56px;
    float: left;
    padding: 4px 0px 0px 0px;
  }

  .dropCap-noSupport [data-design-treatment^="dropCap-sm"]::first-letter {
    font-size: 112px;
    float: left;
    padding: 4px 0px 0px 0px;
  }

  .dropCap-noSupport [data-design-treatment^="dropCap-md"]::first-letter {
    font-size: 168px;
    float: left;
    padding: 8px 0px 0px 0px;
  }

  .dropCap-noSupport [data-design-treatment^="dropCap-lg"]::first-letter {
    font-size: 230px;
    float: left;
    padding: 12px 0px 0px 0px;
  }

  .dropCap-noSupport [data-design-treatment^="dropCap-xl"]::first-letter {
    font-size: 300px;
    float: left;
    padding: 12px 0px 0px 0px;
  }

  h2 > hr {
    margin-top: var(--ddd-spacing-4);
  }

  .ddd-theme-header-border-thickness-0 {
    --ddd-theme-header-border-thickness: var(
      --ddd-theme-header-border-thickness-0
    );
  }
  .ddd-theme-header-border-thickness-xs {
    --ddd-theme-header-border-thickness: var(
      --ddd-theme-header-border-thickness-xs
    );
  }
  .ddd-theme-header-border-thickness-sm {
    --ddd-theme-header-border-thickness: var(
      --ddd-theme-header-border-thickness-sm
    );
  }
  .ddd-theme-header-border-thickness-md {
    --ddd-theme-header-border-thickness: var(
      --ddd-theme-header-border-thickness-md
    );
  }
  .ddd-theme-header-border-thickness-lg {
    --ddd-theme-header-border-thickness: var(
      --ddd-theme-header-border-thickness-lg
    );
  }

  .ddd-theme-header-border-treatment-0 {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-0
    );
  }
  .ddd-theme-header-border-treatment-sm {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-sm
    );
  }
  .ddd-theme-header-border-treatment-md {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-md
    );
  }
  .ddd-theme-header-border-treatment-lg {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-lg
    );
  }
  .ddd-theme-header-border-treatment-10p {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-10p
    );
  }
  .ddd-theme-header-border-treatment-25p {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-25p
    );
  }
  .ddd-theme-header-border-treatment-50p {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-50p
    );
  }
  .ddd-theme-header-border-treatment-75p {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-75p
    );
  }
  .ddd-theme-header-border-treatment-full {
    --ddd-theme-header-border-treatment: var(
      --ddd-theme-header-border-treatment-full
    );
  }
  summary {
    display: flex;
    font-size: var(--ddd-theme-h4-font-size);
    font-weight: var(--ddd-font-weight-bold);
    color: light-dark(
      var(
        --lowContrast-override,
        var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
      ),
      var(
        --lowContrast-override,
        var(--ddd-theme-primary, var(--ddd-theme-default-linkLight))
      )
    );
    cursor: pointer;
    text-wrap: wrap;
    align-items: center;
    padding: var(--ddd-spacing-5) var(--ddd-spacing-4);
    user-select: none;
    transition: all 0.3s ease-in-out;
  }
  summary::marker {
    content: "";
  }
  summary::after {
    content: "+";
    margin-left: auto;
    text-align: right;
    font-weight: var(--ddd-font-weight-regular);
    font-size: var(--ddd-font-size-m);
    line-height: 1;
  }
  details {
    overflow: hidden;
    display: flex;
    position: relative;
    max-width: 650px;
    padding: 0;
    margin: 0;
  }
  details[disabled] {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }
  details[open] > summary::after {
    content: "-";
  }
  details[open] > summary {
    color: light-dark(
      var(
        --lowContrast-override,
        var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
      ),
      var(
        --lowContrast-override,
        var(--ddd-theme-primary, var(--ddd-theme-default-linkLight))
      )
    );
    filter: saturate(1.5);
  }
  details[open] > summary {
    background-color: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-potentialMidnight)
    );
  }
  details summary:focus,
  details summary:hover {
    background-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-nittanyNavy)
    );
  }

  code {
    transition: all 0.3s ease 0s;
    display: inline-block;
    padding: 2px var(--ddd-spacing-1); /* breaking DDD spacing sys on purpose for code */
    margin: 0 var(--ddd-spacing-1);
    font-size: calc(var(--ddd-theme-body-font-size) - var(--ddd-spacing-1));
    background-color: var(
      --ddd-theme-code-background-color,
      light-dark(var(--ddd-theme-default-limestoneLight), black)
    );
    color: var(
      --ddd-theme-code-color,
      light-dark(black, var(--ddd-theme-default-limestoneLight))
    );
    line-height: 1;
    border-radius: var(--ddd-radius-xs);
    border: var(--ddd-border-md);
    border-style: groove;
    border-color: light-dark(var(--ddd-theme-default-limestoneMaxLight), black);
    font-family: monospace;
    letter-spacing: var(--ddd-ls-16-lg);
    pointer-events: auto;
  }
  code.block-code {
    padding: var(--ddd-spacing-2);
    margin: var(--ddd-spacing-5) 0;
  }
  code::-moz-selection {
    /* Code for Firefox */
    background: var(--ddd-theme-default-keystoneYellow);
  }
  code::selection {
    background: var(--ddd-theme-default-keystoneYellow);
  }

  pre {
    display: inline-block;
    padding: var(--ddd-spacing-4);
    overflow: auto;
    background-color: var(
      --ddd-theme-default-limestoneMaxLight,
      rgba(175, 184, 193, 0.2)
    );
    border-radius: var(--ddd-radius-sm);
    margin: var(--ddd-spacing-1) 0;
    word-break: normal;
    word-wrap: normal;
    font-size: var(--ddd-theme-body-font-size);
  }
  mark {
    font-weight: var(--ddd-font-weight-medium);
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    border-radius: var(--ddd-radius-xs);
    background-color: var(
      --ddd-theme-primary,
      var(--ddd-theme-default-keystoneYellow)
    );
    color: var(--ddd-theme-bgContrast, black);
  }
  abbr {
    background-color: var(
      --ddd-theme-primary,
      var(--ddd-theme-default-keystoneYellow)
    );
    transition: all 0.3s ease 0s;
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    font-style: italic;
    text-decoration: underline;
    pointer-events: auto;
    cursor: pointer;
    outline-color: var(
      --ddd-theme-primary,
      var(--ddd-theme-default-keystoneYellow)
    );
    color: var(--ddd-theme-bgContrast, black);
    position: relative;
  }
  abbr:focus,
  abbr:active,
  abbr:hover {
    text-decoration: none;
    background-color: var(
      --ddd-theme-primary,
      var(--ddd-theme-default-keystoneYellow)
    );
    outline-offset: 2px;
    outline-style: dotted;
    outline-width: 2px;
  }
  abbr:focus::after,
  abbr:active::after,
  abbr:hover::after {
    content: attr(title);
    position: absolute;
    white-space: nowrap;
    font-style: normal;
    position: absolute;
    bottom: 100%;
    left: 0;
    width: fit-content;
    height: fit-content;
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    color: var(--ddd-theme-font-color, var(--ddd-theme-default-white, #fff));
    background-color: var(--ddd-theme-default-info, rgba(175, 184, 193, 0.2));
    font-size: var(--ddd-theme-body-font-size);
    font-weight: var(--ddd-font-weight-regular);
    border-radius: var(--ddd-radius-xs);
  }
  div[slot="citation"] {
    font-size: var(--ddd-font-size-4xs);
  }
  *::selection {
    background-color: var(--ddd-theme-default-linkLight);
  }
  select {
    display: flex;
    box-sizing: border-box;
    transition: all 0.3s ease 0s;
    cursor: pointer;
    color: var(--ddd-theme-default-coalyGray);
    width: fit-content;
    border: var(--ddd-border-xs);
    background-color: var(--ddd-theme-default-white);
    font-family: var(--ddd-font-primary);
    font-weight: var(--ddd-font-weight-regular);
    font-size: var(--ddd-theme-body-font-size);
    line-height: 150%;
    letter-spacing: normal;
    padding: var(--ddd-spacing-2);
    border-radius: var(--ddd-radius-xs);
    border-color: var(--ddd-theme-default-potential50);
  }
  hax-body,
  .haxcms-theme-element {
    line-height: var(--ddd-lh-150);
    font-size: var(--ddd-theme-body-font-size);
    font-family: var(--ddd-font-primary);
    letter-spacing: normal;
    text-align: justify;
  }
`;
/* border & shadows */
export const DDDBorders = css`
  .b-0 {
    border: none;
  }
  .b-xs {
    border: var(--ddd-border-xs);
  }
  .b-sm {
    border: var(--ddd-border-sm);
  }
  .b-md {
    border: var(--ddd-border-md);
  }
  .b-lg {
    border: var(--ddd-border-lg);
  }
  .bt-0 {
    border-top: none;
  }
  .bt-xs {
    border-top: var(--ddd-border-xs);
  }
  .bt-sm {
    border-top: var(--ddd-border-sm);
  }
  .bt-md {
    border-top: 3px solid var(--ddd-theme-default-limestoneLight);
  }
  .bt-lg {
    border-top: 4px solid var(--ddd-theme-default-limestoneLight);
  }
  .br-0 {
    border-right: none;
  }
  .br-xs {
    border-right: var(--ddd-border-xs);
  }
  .br-sm {
    border-right: var(--ddd-border-sm);
  }
  .br-md {
    border-right: 3px solid var(--ddd-theme-default-limestoneLight);
  }
  .br-lg {
    border-right: 4px solid var(--ddd-theme-default-limestoneLight);
  }
  .bb-0 {
    border-bottom: none;
  }
  .bb-xs {
    border-bottom: var(--ddd-border-xs);
  }
  .bb-sm {
    border-bottom: var(--ddd-border-sm);
  }
  .bb-md {
    border-bottom: 3px solid var(--ddd-theme-default-limestoneLight);
  }
  .bb-lg {
    border-bottom: 4px solid var(--ddd-theme-default-limestoneLight);
  }
  .bl-0 {
    border-left: none;
  }
  .bl-xs {
    border-left: var(--ddd-border-xs);
  }
  .bl-sm {
    border-left: var(--ddd-border-sm);
  }
  .bl-md {
    border-left: 3px solid var(--ddd-theme-default-limestoneLight);
  }
  .bl-lg {
    border-left: 4px solid var(--ddd-theme-default-limestoneLight);
  }
`;
/* margin & padding */
export const DDDMarginPadding = css`
  .m-auto {
    margin: auto;
  }
  .m-0 {
    margin: var(--ddd-spacing-0);
  }
  .m-1 {
    margin: var(--ddd-spacing-1);
  }
  .m-2 {
    margin: var(--ddd-spacing-2);
  }
  .m-3 {
    margin: var(--ddd-spacing-3);
  }
  .m-4 {
    margin: var(--ddd-spacing-4);
  }
  .m-5 {
    margin: var(--ddd-spacing-5);
  }
  .m-6 {
    margin: var(--ddd-spacing-6);
  }
  .m-7 {
    margin: var(--ddd-spacing-7);
  }
  .m-8 {
    margin: var(--ddd-spacing-8);
  }
  .m-9 {
    margin: var(--ddd-spacing-9);
  }
  .m-10 {
    margin: var(--ddd-spacing-10);
  }
  .m-11 {
    margin: var(--ddd-spacing-11);
  }
  .m-12 {
    margin: var(--ddd-spacing-12);
  }
  .m-13 {
    margin: var(--ddd-spacing-13);
  }
  .m-14 {
    margin: var(--ddd-spacing-14);
  }
  .m-15 {
    margin: var(--ddd-spacing-15);
  }
  .m-16 {
    margin: var(--ddd-spacing-16);
  }
  .m-17 {
    margin: var(--ddd-spacing-17);
  }
  .m-18 {
    margin: var(--ddd-spacing-18);
  }
  .m-19 {
    margin: var(--ddd-spacing-19);
  }
  .m-20 {
    margin: var(--ddd-spacing-20);
  }
  .m-21 {
    margin: var(--ddd-spacing-21);
  }
  .m-22 {
    margin: var(--ddd-spacing-22);
  }
  .m-23 {
    margin: var(--ddd-spacing-23);
  }
  .m-24 {
    margin: var(--ddd-spacing-24);
  }
  .m-25 {
    margin: var(--ddd-spacing-25);
  }
  .m-26 {
    margin: var(--ddd-spacing-26);
  }
  .m-27 {
    margin: var(--ddd-spacing-27);
  }
  .m-28 {
    margin: var(--ddd-spacing-28);
  }
  .m-29 {
    margin: var(--ddd-spacing-29);
  }
  .m-30 {
    margin: var(--ddd-spacing-30);
  }
  .mt-auto {
    margin-top: auto;
  }
  .mt-0 {
    margin-top: var(--ddd-spacing-0);
  }
  .mt-1 {
    margin-top: var(--ddd-spacing-1);
  }
  .mt-2 {
    margin-top: var(--ddd-spacing-2);
  }
  .mt-3 {
    margin-top: var(--ddd-spacing-3);
  }
  .mt-4 {
    margin-top: var(--ddd-spacing-4);
  }
  .mt-5 {
    margin-top: var(--ddd-spacing-5);
  }
  .mt-6 {
    margin-top: var(--ddd-spacing-6);
  }
  .mt-7 {
    margin-top: var(--ddd-spacing-7);
  }
  .mt-8 {
    margin-top: var(--ddd-spacing-8);
  }
  .mt-9 {
    margin-top: var(--ddd-spacing-9);
  }
  .mt-10 {
    margin-top: var(--ddd-spacing-10);
  }
  .mt-11 {
    margin-top: var(--ddd-spacing-11);
  }
  .mt-12 {
    margin-top: var(--ddd-spacing-12);
  }
  .mt-13 {
    margin-top: var(--ddd-spacing-13);
  }
  .mt-14 {
    margin-top: var(--ddd-spacing-14);
  }
  .mt-15 {
    margin-top: var(--ddd-spacing-15);
  }
  .mt-16 {
    margin-top: var(--ddd-spacing-16);
  }
  .mt-17 {
    margin-top: var(--ddd-spacing-17);
  }
  .mt-18 {
    margin-top: var(--ddd-spacing-18);
  }
  .mt-19 {
    margin-top: var(--ddd-spacing-19);
  }
  .mt-20 {
    margin-top: var(--ddd-spacing-20);
  }
  .mt-21 {
    margin-top: var(--ddd-spacing-21);
  }
  .mt-22 {
    margin-top: var(--ddd-spacing-22);
  }
  .mt-23 {
    margin-top: var(--ddd-spacing-23);
  }
  .mt-24 {
    margin-top: var(--ddd-spacing-24);
  }
  .mt-25 {
    margin-top: var(--ddd-spacing-25);
  }
  .mt-26 {
    margin-top: var(--ddd-spacing-26);
  }
  .mt-27 {
    margin-top: var(--ddd-spacing-27);
  }
  .mt-28 {
    margin-top: var(--ddd-spacing-28);
  }
  .mt-29 {
    margin-top: var(--ddd-spacing-29);
  }
  .mt-30 {
    margin-top: var(--ddd-spacing-30);
  }
  .mb-auto {
    margin-bottom: auto;
  }
  .mb-0 {
    margin-bottom: var(--ddd-spacing-0);
  }
  .mb-1 {
    margin-bottom: var(--ddd-spacing-1);
  }
  .mb-2 {
    margin-bottom: var(--ddd-spacing-2);
  }
  .mb-3 {
    margin-bottom: var(--ddd-spacing-3);
  }
  .mb-4 {
    margin-bottom: var(--ddd-spacing-4);
  }
  .mb-5 {
    margin-bottom: var(--ddd-spacing-5);
  }
  .mb-6 {
    margin-bottom: var(--ddd-spacing-6);
  }
  .mb-7 {
    margin-bottom: var(--ddd-spacing-7);
  }
  .mb-8 {
    margin-bottom: var(--ddd-spacing-8);
  }
  .mb-9 {
    margin-bottom: var(--ddd-spacing-9);
  }
  .mb-10 {
    margin-bottom: var(--ddd-spacing-10);
  }
  .mb-11 {
    margin-bottom: var(--ddd-spacing-11);
  }
  .mb-12 {
    margin-bottom: var(--ddd-spacing-12);
  }
  .mb-13 {
    margin-bottom: var(--ddd-spacing-13);
  }
  .mb-14 {
    margin-bottom: var(--ddd-spacing-14);
  }
  .mb-15 {
    margin-bottom: var(--ddd-spacing-15);
  }
  .mb-16 {
    margin-bottom: var(--ddd-spacing-16);
  }
  .mb-17 {
    margin-bottom: var(--ddd-spacing-17);
  }
  .mb-18 {
    margin-bottom: var(--ddd-spacing-18);
  }
  .mb-19 {
    margin-bottom: var(--ddd-spacing-19);
  }
  .mb-20 {
    margin-bottom: var(--ddd-spacing-20);
  }
  .mb-21 {
    margin-bottom: var(--ddd-spacing-21);
  }
  .mb-22 {
    margin-bottom: var(--ddd-spacing-22);
  }
  .mb-23 {
    margin-bottom: var(--ddd-spacing-23);
  }
  .mb-24 {
    margin-bottom: var(--ddd-spacing-24);
  }
  .mb-25 {
    margin-bottom: var(--ddd-spacing-25);
  }
  .mb-26 {
    margin-bottom: var(--ddd-spacing-26);
  }
  .mb-27 {
    margin-bottom: var(--ddd-spacing-27);
  }
  .mb-28 {
    margin-bottom: var(--ddd-spacing-28);
  }
  .mb-29 {
    margin-bottom: var(--ddd-spacing-29);
  }
  .mb-30 {
    margin-bottom: var(--ddd-spacing-30);
  }
  .ml-auto {
    margin-left: auto;
  }
  .ml-0 {
    margin-left: var(--ddd-spacing-0);
  }
  .ml-1 {
    margin-left: var(--ddd-spacing-1);
  }
  .ml-2 {
    margin-left: var(--ddd-spacing-2);
  }
  .ml-3 {
    margin-left: var(--ddd-spacing-3);
  }
  .ml-4 {
    margin-left: var(--ddd-spacing-4);
  }
  .ml-5 {
    margin-left: var(--ddd-spacing-5);
  }
  .ml-6 {
    margin-left: var(--ddd-spacing-6);
  }
  .ml-7 {
    margin-left: var(--ddd-spacing-7);
  }
  .ml-8 {
    margin-left: var(--ddd-spacing-8);
  }
  .ml-9 {
    margin-left: var(--ddd-spacing-9);
  }
  .ml-10 {
    margin-left: var(--ddd-spacing-10);
  }
  .ml-11 {
    margin-left: var(--ddd-spacing-11);
  }
  .ml-12 {
    margin-left: var(--ddd-spacing-12);
  }
  .ml-13 {
    margin-left: var(--ddd-spacing-13);
  }
  .ml-14 {
    margin-left: var(--ddd-spacing-14);
  }
  .ml-15 {
    margin-left: var(--ddd-spacing-15);
  }
  .ml-16 {
    margin-left: var(--ddd-spacing-16);
  }
  .ml-17 {
    margin-left: var(--ddd-spacing-17);
  }
  .ml-18 {
    margin-left: var(--ddd-spacing-18);
  }
  .ml-19 {
    margin-left: var(--ddd-spacing-19);
  }
  .ml-20 {
    margin-left: var(--ddd-spacing-20);
  }
  .ml-21 {
    margin-left: var(--ddd-spacing-21);
  }
  .ml-22 {
    margin-left: var(--ddd-spacing-22);
  }
  .ml-23 {
    margin-left: var(--ddd-spacing-23);
  }
  .ml-24 {
    margin-left: var(--ddd-spacing-24);
  }
  .ml-25 {
    margin-left: var(--ddd-spacing-25);
  }
  .ml-26 {
    margin-left: var(--ddd-spacing-26);
  }
  .ml-27 {
    margin-left: var(--ddd-spacing-27);
  }
  .ml-28 {
    margin-left: var(--ddd-spacing-28);
  }
  .ml-29 {
    margin-left: var(--ddd-spacing-29);
  }
  .ml-30 {
    margin-left: var(--ddd-spacing-30);
  }
  .mr-auto {
    margin-right: auto;
  }
  .mr-0 {
    margin-right: var(--ddd-spacing-0);
  }
  .mr-1 {
    margin-right: var(--ddd-spacing-1);
  }
  .mr-2 {
    margin-right: var(--ddd-spacing-2);
  }
  .mr-3 {
    margin-right: var(--ddd-spacing-3);
  }
  .mr-4 {
    margin-right: var(--ddd-spacing-4);
  }
  .mr-5 {
    margin-right: var(--ddd-spacing-5);
  }
  .mr-6 {
    margin-right: var(--ddd-spacing-6);
  }
  .mr-7 {
    margin-right: var(--ddd-spacing-7);
  }
  .mr-8 {
    margin-right: var(--ddd-spacing-8);
  }
  .mr-9 {
    margin-right: var(--ddd-spacing-9);
  }
  .mr-10 {
    margin-right: var(--ddd-spacing-10);
  }
  .mr-11 {
    margin-right: var(--ddd-spacing-11);
  }
  .mr-12 {
    margin-right: var(--ddd-spacing-12);
  }
  .mr-13 {
    margin-right: var(--ddd-spacing-13);
  }
  .mr-14 {
    margin-right: var(--ddd-spacing-14);
  }
  .mr-15 {
    margin-right: var(--ddd-spacing-15);
  }
  .mr-16 {
    margin-right: var(--ddd-spacing-16);
  }
  .mr-17 {
    margin-right: var(--ddd-spacing-17);
  }
  .mr-18 {
    margin-right: var(--ddd-spacing-18);
  }
  .mr-19 {
    margin-right: var(--ddd-spacing-19);
  }
  .mr-20 {
    margin-right: var(--ddd-spacing-20);
  }
  .mr-21 {
    margin-right: var(--ddd-spacing-21);
  }
  .mr-22 {
    margin-right: var(--ddd-spacing-22);
  }
  .mr-23 {
    margin-right: var(--ddd-spacing-23);
  }
  .mr-24 {
    margin-right: var(--ddd-spacing-24);
  }
  .mr-25 {
    margin-right: var(--ddd-spacing-25);
  }
  .mr-26 {
    margin-right: var(--ddd-spacing-26);
  }
  .mr-27 {
    margin-right: var(--ddd-spacing-27);
  }
  .mr-28 {
    margin-right: var(--ddd-spacing-28);
  }
  .mr-29 {
    margin-right: var(--ddd-spacing-29);
  }
  .mr-30 {
    margin-right: var(--ddd-spacing-30);
  }
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  .mx-0 {
    margin-left: var(--ddd-spacing-0);
    margin-right: var(--ddd-spacing-0);
  }
  .mx-1 {
    margin-left: var(--ddd-spacing-1);
    margin-right: var(--ddd-spacing-1);
  }
  .mx-2 {
    margin-left: var(--ddd-spacing-2);
    margin-right: var(--ddd-spacing-2);
  }
  .mx-3 {
    margin-left: var(--ddd-spacing-3);
    margin-right: var(--ddd-spacing-3);
  }
  .mx-4 {
    margin-left: var(--ddd-spacing-4);
    margin-right: var(--ddd-spacing-4);
  }
  .mx-5 {
    margin-left: var(--ddd-spacing-5);
    margin-right: var(--ddd-spacing-5);
  }
  .mx-6 {
    margin-left: var(--ddd-spacing-6);
    margin-right: var(--ddd-spacing-6);
  }
  .mx-7 {
    margin-left: var(--ddd-spacing-7);
    margin-right: var(--ddd-spacing-7);
  }
  .mx-8 {
    margin-left: var(--ddd-spacing-8);
    margin-right: var(--ddd-spacing-8);
  }
  .mx-9 {
    margin-left: var(--ddd-spacing-9);
    margin-right: var(--ddd-spacing-9);
  }
  .mx-10 {
    margin-left: var(--ddd-spacing-10);
    margin-right: var(--ddd-spacing-10);
  }
  .mx-11 {
    margin-left: var(--ddd-spacing-11);
    margin-right: var(--ddd-spacing-11);
  }
  .mx-12 {
    margin-left: var(--ddd-spacing-12);
    margin-right: var(--ddd-spacing-12);
  }
  .mx-13 {
    margin-left: var(--ddd-spacing-13);
    margin-right: var(--ddd-spacing-13);
  }
  .mx-14 {
    margin-left: var(--ddd-spacing-14);
    margin-right: var(--ddd-spacing-14);
  }
  .mx-15 {
    margin-left: var(--ddd-spacing-15);
    margin-right: var(--ddd-spacing-15);
  }
  .mx-16 {
    margin-left: var(--ddd-spacing-16);
    margin-right: var(--ddd-spacing-16);
  }
  .mx-17 {
    margin-left: var(--ddd-spacing-17);
    margin-right: var(--ddd-spacing-17);
  }
  .mx-18 {
    margin-left: var(--ddd-spacing-18);
    margin-right: var(--ddd-spacing-18);
  }
  .mx-19 {
    margin-left: var(--ddd-spacing-19);
    margin-right: var(--ddd-spacing-19);
  }
  .mx-20 {
    margin-left: var(--ddd-spacing-20);
    margin-right: var(--ddd-spacing-20);
  }
  .mx-21 {
    margin-left: var(--ddd-spacing-21);
    margin-right: var(--ddd-spacing-21);
  }
  .mx-22 {
    margin-left: var(--ddd-spacing-22);
    margin-right: var(--ddd-spacing-22);
  }
  .mx-23 {
    margin-left: var(--ddd-spacing-23);
    margin-right: var(--ddd-spacing-23);
  }
  .mx-24 {
    margin-left: var(--ddd-spacing-24);
    margin-right: var(--ddd-spacing-24);
  }
  .mx-25 {
    margin-left: var(--ddd-spacing-25);
    margin-right: var(--ddd-spacing-25);
  }
  .mx-26 {
    margin-left: var(--ddd-spacing-26);
    margin-right: var(--ddd-spacing-26);
  }
  .mx-27 {
    margin-left: var(--ddd-spacing-27);
    margin-right: var(--ddd-spacing-27);
  }
  .mx-28 {
    margin-left: var(--ddd-spacing-28);
    margin-right: var(--ddd-spacing-28);
  }
  .mx-29 {
    margin-left: var(--ddd-spacing-29);
    margin-right: var(--ddd-spacing-29);
  }
  .mx-30 {
    margin-left: var(--ddd-spacing-30);
    margin-right: var(--ddd-spacing-30);
  }
  .my-auto {
    margin-top: auto;
    margin-bottom: auto;
  }
  .my-0 {
    margin-top: var(--ddd-spacing-0);
    margin-bottom: var(--ddd-spacing-0);
  }
  .my-1 {
    margin-top: var(--ddd-spacing-1);
    margin-bottom: var(--ddd-spacing-1);
  }
  .my-2 {
    margin-top: var(--ddd-spacing-2);
    margin-bottom: var(--ddd-spacing-2);
  }
  .my-3 {
    margin-top: var(--ddd-spacing-3);
    margin-bottom: var(--ddd-spacing-3);
  }
  .my-4 {
    margin-top: var(--ddd-spacing-4);
    margin-bottom: var(--ddd-spacing-4);
  }
  .my-5 {
    margin-top: var(--ddd-spacing-5);
    margin-bottom: var(--ddd-spacing-5);
  }
  .my-6 {
    margin-top: var(--ddd-spacing-6);
    margin-bottom: var(--ddd-spacing-6);
  }
  .my-7 {
    margin-top: var(--ddd-spacing-7);
    margin-bottom: var(--ddd-spacing-7);
  }
  .my-8 {
    margin-top: var(--ddd-spacing-8);
    margin-bottom: var(--ddd-spacing-8);
  }
  .my-9 {
    margin-top: var(--ddd-spacing-9);
    margin-bottom: var(--ddd-spacing-9);
  }
  .my-10 {
    margin-top: var(--ddd-spacing-10);
    margin-bottom: var(--ddd-spacing-10);
  }
  .my-11 {
    margin-top: var(--ddd-spacing-11);
    margin-bottom: var(--ddd-spacing-11);
  }
  .my-12 {
    margin-top: var(--ddd-spacing-12);
    margin-bottom: var(--ddd-spacing-12);
  }
  .my-13 {
    margin-top: var(--ddd-spacing-13);
    margin-bottom: var(--ddd-spacing-13);
  }
  .my-14 {
    margin-top: var(--ddd-spacing-14);
    margin-bottom: var(--ddd-spacing-14);
  }
  .my-15 {
    margin-top: var(--ddd-spacing-15);
    margin-bottom: var(--ddd-spacing-15);
  }
  .my-16 {
    margin-top: var(--ddd-spacing-16);
    margin-bottom: var(--ddd-spacing-16);
  }
  .my-17 {
    margin-top: var(--ddd-spacing-17);
    margin-bottom: var(--ddd-spacing-17);
  }
  .my-18 {
    margin-top: var(--ddd-spacing-18);
    margin-bottom: var(--ddd-spacing-18);
  }
  .my-19 {
    margin-top: var(--ddd-spacing-19);
    margin-bottom: var(--ddd-spacing-19);
  }
  .my-20 {
    margin-top: var(--ddd-spacing-20);
    margin-bottom: var(--ddd-spacing-20);
  }
  .my-21 {
    margin-top: var(--ddd-spacing-21);
    margin-bottom: var(--ddd-spacing-21);
  }
  .my-22 {
    margin-top: var(--ddd-spacing-22);
    margin-bottom: var(--ddd-spacing-22);
  }
  .my-23 {
    margin-top: var(--ddd-spacing-23);
    margin-bottom: var(--ddd-spacing-23);
  }
  .my-24 {
    margin-top: var(--ddd-spacing-24);
    margin-bottom: var(--ddd-spacing-24);
  }
  .my-25 {
    margin-top: var(--ddd-spacing-25);
    margin-bottom: var(--ddd-spacing-25);
  }
  .my-26 {
    margin-top: var(--ddd-spacing-26);
    margin-bottom: var(--ddd-spacing-26);
  }
  .my-27 {
    margin-top: var(--ddd-spacing-27);
    margin-bottom: var(--ddd-spacing-27);
  }
  .my-28 {
    margin-top: var(--ddd-spacing-28);
    margin-bottom: var(--ddd-spacing-28);
  }
  .my-29 {
    margin-top: var(--ddd-spacing-29);
    margin-bottom: var(--ddd-spacing-29);
  }
  .my-30 {
    margin-top: var(--ddd-spacing-30);
    margin-bottom: var(--ddd-spacing-30);
  }
  .p-auto {
    padding: auto;
  }
  .p-0 {
    padding: var(--ddd-spacing-0);
  }
  .p-1 {
    padding: var(--ddd-spacing-1);
  }
  .p-2 {
    padding: var(--ddd-spacing-2);
  }
  .p-3 {
    padding: var(--ddd-spacing-3);
  }
  .p-4 {
    padding: var(--ddd-spacing-4);
  }
  .p-5 {
    padding: var(--ddd-spacing-5);
  }
  .p-6 {
    padding: var(--ddd-spacing-6);
  }
  .p-7 {
    padding: var(--ddd-spacing-7);
  }
  .p-8 {
    padding: var(--ddd-spacing-8);
  }
  .p-9 {
    padding: var(--ddd-spacing-9);
  }
  .p-10 {
    padding: var(--ddd-spacing-10);
  }
  .p-11 {
    padding: var(--ddd-spacing-11);
  }
  .p-12 {
    padding: var(--ddd-spacing-12);
  }
  .p-13 {
    padding: var(--ddd-spacing-13);
  }
  .p-14 {
    padding: var(--ddd-spacing-14);
  }
  .p-15 {
    padding: var(--ddd-spacing-15);
  }
  .p-16 {
    padding: var(--ddd-spacing-16);
  }
  .p-17 {
    padding: var(--ddd-spacing-17);
  }
  .p-18 {
    padding: var(--ddd-spacing-18);
  }
  .p-19 {
    padding: var(--ddd-spacing-19);
  }
  .p-20 {
    padding: var(--ddd-spacing-20);
  }
  .p-21 {
    padding: var(--ddd-spacing-21);
  }
  .p-22 {
    padding: var(--ddd-spacing-22);
  }
  .p-23 {
    padding: var(--ddd-spacing-23);
  }
  .p-24 {
    padding: var(--ddd-spacing-24);
  }
  .p-25 {
    padding: var(--ddd-spacing-25);
  }
  .p-26 {
    padding: var(--ddd-spacing-26);
  }
  .p-27 {
    padding: var(--ddd-spacing-27);
  }
  .p-28 {
    padding: var(--ddd-spacing-28);
  }
  .p-29 {
    padding: var(--ddd-spacing-29);
  }
  .p-30 {
    padding: var(--ddd-spacing-30);
  }
  .pt-auto {
    padding-top: auto;
  }
  .pt-0 {
    padding-top: var(--ddd-spacing-0);
  }
  .pt-1 {
    padding-top: var(--ddd-spacing-1);
  }
  .pt-2 {
    padding-top: var(--ddd-spacing-2);
  }
  .pt-3 {
    padding-top: var(--ddd-spacing-3);
  }
  .pt-4 {
    padding-top: var(--ddd-spacing-4);
  }
  .pt-5 {
    padding-top: var(--ddd-spacing-5);
  }
  .pt-6 {
    padding-top: var(--ddd-spacing-6);
  }
  .pt-7 {
    padding-top: var(--ddd-spacing-7);
  }
  .pt-8 {
    padding-top: var(--ddd-spacing-8);
  }
  .pt-9 {
    padding-top: var(--ddd-spacing-9);
  }
  .pt-10 {
    padding-top: var(--ddd-spacing-10);
  }
  .pt-11 {
    padding-top: var(--ddd-spacing-11);
  }
  .pt-12 {
    padding-top: var(--ddd-spacing-12);
  }
  .pt-13 {
    padding-top: var(--ddd-spacing-13);
  }
  .pt-14 {
    padding-top: var(--ddd-spacing-14);
  }
  .pt-15 {
    padding-top: var(--ddd-spacing-15);
  }
  .pt-16 {
    padding-top: var(--ddd-spacing-16);
  }
  .pt-17 {
    padding-top: var(--ddd-spacing-17);
  }
  .pt-18 {
    padding-top: var(--ddd-spacing-18);
  }
  .pt-19 {
    padding-top: var(--ddd-spacing-19);
  }
  .pt-20 {
    padding-top: var(--ddd-spacing-20);
  }
  .pt-21 {
    padding-top: var(--ddd-spacing-21);
  }
  .pt-22 {
    padding-top: var(--ddd-spacing-22);
  }
  .pt-23 {
    padding-top: var(--ddd-spacing-23);
  }
  .pt-24 {
    padding-top: var(--ddd-spacing-24);
  }
  .pt-25 {
    padding-top: var(--ddd-spacing-25);
  }
  .pt-26 {
    padding-top: var(--ddd-spacing-26);
  }
  .pt-27 {
    padding-top: var(--ddd-spacing-27);
  }
  .pt-28 {
    padding-top: var(--ddd-spacing-28);
  }
  .pt-29 {
    padding-top: var(--ddd-spacing-29);
  }
  .pt-30 {
    padding-top: var(--ddd-spacing-30);
  }
  .pb-auto {
    padding-bottom: auto;
  }
  .pb-0 {
    padding-bottom: var(--ddd-spacing-0);
  }
  .pb-1 {
    padding-bottom: var(--ddd-spacing-1);
  }
  .pb-2 {
    padding-bottom: var(--ddd-spacing-2);
  }
  .pb-3 {
    padding-bottom: var(--ddd-spacing-3);
  }
  .pb-4 {
    padding-bottom: var(--ddd-spacing-4);
  }
  .pb-5 {
    padding-bottom: var(--ddd-spacing-5);
  }
  .pb-6 {
    padding-bottom: var(--ddd-spacing-6);
  }
  .pb-7 {
    padding-bottom: var(--ddd-spacing-7);
  }
  .pb-8 {
    padding-bottom: var(--ddd-spacing-8);
  }
  .pb-9 {
    padding-bottom: var(--ddd-spacing-9);
  }
  .pb-10 {
    padding-bottom: var(--ddd-spacing-10);
  }
  .pb-11 {
    padding-bottom: var(--ddd-spacing-11);
  }
  .pb-12 {
    padding-bottom: var(--ddd-spacing-12);
  }
  .pb-13 {
    padding-bottom: var(--ddd-spacing-13);
  }
  .pb-14 {
    padding-bottom: var(--ddd-spacing-14);
  }
  .pb-15 {
    padding-bottom: var(--ddd-spacing-15);
  }
  .pb-16 {
    padding-bottom: var(--ddd-spacing-16);
  }
  .pb-17 {
    padding-bottom: var(--ddd-spacing-17);
  }
  .pb-18 {
    padding-bottom: var(--ddd-spacing-18);
  }
  .pb-19 {
    padding-bottom: var(--ddd-spacing-19);
  }
  .pb-20 {
    padding-bottom: var(--ddd-spacing-20);
  }
  .pb-21 {
    padding-bottom: var(--ddd-spacing-21);
  }
  .pb-22 {
    padding-bottom: var(--ddd-spacing-22);
  }
  .pb-23 {
    padding-bottom: var(--ddd-spacing-23);
  }
  .pb-24 {
    padding-bottom: var(--ddd-spacing-24);
  }
  .pb-25 {
    padding-bottom: var(--ddd-spacing-25);
  }
  .pb-26 {
    padding-bottom: var(--ddd-spacing-26);
  }
  .pb-27 {
    padding-bottom: var(--ddd-spacing-27);
  }
  .pb-28 {
    padding-bottom: var(--ddd-spacing-28);
  }
  .pb-29 {
    padding-bottom: var(--ddd-spacing-29);
  }
  .pb-30 {
    padding-bottom: var(--ddd-spacing-30);
  }
  .pl-auto {
    padding-left: auto;
  }
  .pl-0 {
    padding-left: var(--ddd-spacing-0);
  }
  .pl-1 {
    padding-left: var(--ddd-spacing-1);
  }
  .pl-2 {
    padding-left: var(--ddd-spacing-2);
  }
  .pl-3 {
    padding-left: var(--ddd-spacing-3);
  }
  .pl-4 {
    padding-left: var(--ddd-spacing-4);
  }
  .pl-5 {
    padding-left: var(--ddd-spacing-5);
  }
  .pl-6 {
    padding-left: var(--ddd-spacing-6);
  }
  .pl-7 {
    padding-left: var(--ddd-spacing-7);
  }
  .pl-8 {
    padding-left: var(--ddd-spacing-8);
  }
  .pl-9 {
    padding-left: var(--ddd-spacing-9);
  }
  .pl-10 {
    padding-left: var(--ddd-spacing-10);
  }
  .pl-11 {
    padding-left: var(--ddd-spacing-11);
  }
  .pl-12 {
    padding-left: var(--ddd-spacing-12);
  }
  .pl-13 {
    padding-left: var(--ddd-spacing-13);
  }
  .pl-14 {
    padding-left: var(--ddd-spacing-14);
  }
  .pl-15 {
    padding-left: var(--ddd-spacing-15);
  }
  .pl-16 {
    padding-left: var(--ddd-spacing-16);
  }
  .pl-17 {
    padding-left: var(--ddd-spacing-17);
  }
  .pl-18 {
    padding-left: var(--ddd-spacing-18);
  }
  .pl-19 {
    padding-left: var(--ddd-spacing-19);
  }
  .pl-20 {
    padding-left: var(--ddd-spacing-20);
  }
  .pl-21 {
    padding-left: var(--ddd-spacing-21);
  }
  .pl-22 {
    padding-left: var(--ddd-spacing-22);
  }
  .pl-23 {
    padding-left: var(--ddd-spacing-23);
  }
  .pl-24 {
    padding-left: var(--ddd-spacing-24);
  }
  .pl-25 {
    padding-left: var(--ddd-spacing-25);
  }
  .pl-26 {
    padding-left: var(--ddd-spacing-26);
  }
  .pl-27 {
    padding-left: var(--ddd-spacing-27);
  }
  .pl-28 {
    padding-left: var(--ddd-spacing-28);
  }
  .pl-29 {
    padding-left: var(--ddd-spacing-29);
  }
  .pl-30 {
    padding-left: var(--ddd-spacing-30);
  }
  .pr-auto {
    padding-right: auto;
  }
  .pr-0 {
    padding-right: var(--ddd-spacing-0);
  }
  .pr-1 {
    padding-right: var(--ddd-spacing-1);
  }
  .pr-2 {
    padding-right: var(--ddd-spacing-2);
  }
  .pr-3 {
    padding-right: var(--ddd-spacing-3);
  }
  .pr-4 {
    padding-right: var(--ddd-spacing-4);
  }
  .pr-5 {
    padding-right: var(--ddd-spacing-5);
  }
  .pr-6 {
    padding-right: var(--ddd-spacing-6);
  }
  .pr-7 {
    padding-right: var(--ddd-spacing-7);
  }
  .pr-8 {
    padding-right: var(--ddd-spacing-8);
  }
  .pr-9 {
    padding-right: var(--ddd-spacing-9);
  }
  .pr-10 {
    padding-right: var(--ddd-spacing-10);
  }
  .pr-11 {
    padding-right: var(--ddd-spacing-11);
  }
  .pr-12 {
    padding-right: var(--ddd-spacing-12);
  }
  .pr-13 {
    padding-right: var(--ddd-spacing-13);
  }
  .pr-14 {
    padding-right: var(--ddd-spacing-14);
  }
  .pr-15 {
    padding-right: var(--ddd-spacing-15);
  }
  .pr-16 {
    padding-right: var(--ddd-spacing-16);
  }
  .pr-17 {
    padding-right: var(--ddd-spacing-17);
  }
  .pr-18 {
    padding-right: var(--ddd-spacing-18);
  }
  .pr-19 {
    padding-right: var(--ddd-spacing-19);
  }
  .pr-20 {
    padding-right: var(--ddd-spacing-20);
  }
  .pr-21 {
    padding-right: var(--ddd-spacing-21);
  }
  .pr-22 {
    padding-right: var(--ddd-spacing-22);
  }
  .pr-23 {
    padding-right: var(--ddd-spacing-23);
  }
  .pr-24 {
    padding-right: var(--ddd-spacing-24);
  }
  .pr-25 {
    padding-right: var(--ddd-spacing-25);
  }
  .pr-26 {
    padding-right: var(--ddd-spacing-26);
  }
  .pr-27 {
    padding-right: var(--ddd-spacing-27);
  }
  .pr-28 {
    padding-right: var(--ddd-spacing-28);
  }
  .pr-29 {
    padding-right: var(--ddd-spacing-29);
  }
  .pr-30 {
    padding-right: var(--ddd-spacing-30);
  }
  .px-auto {
    padding-left: auto;
    padding-right: auto;
  }
  .px-0 {
    padding-left: var(--ddd-spacing-0);
    padding-right: var(--ddd-spacing-0);
  }
  .px-1 {
    padding-left: var(--ddd-spacing-1);
    padding-right: var(--ddd-spacing-1);
  }
  .px-2 {
    padding-left: var(--ddd-spacing-2);
    padding-right: var(--ddd-spacing-2);
  }
  .px-3 {
    padding-left: var(--ddd-spacing-3);
    padding-right: var(--ddd-spacing-3);
  }
  .px-4 {
    padding-left: var(--ddd-spacing-4);
    padding-right: var(--ddd-spacing-4);
  }
  .px-5 {
    padding-left: var(--ddd-spacing-5);
    padding-right: var(--ddd-spacing-5);
  }
  .px-6 {
    padding-left: var(--ddd-spacing-6);
    padding-right: var(--ddd-spacing-6);
  }
  .px-7 {
    padding-left: var(--ddd-spacing-7);
    padding-right: var(--ddd-spacing-7);
  }
  .px-8 {
    padding-left: var(--ddd-spacing-8);
    padding-right: var(--ddd-spacing-8);
  }
  .px-9 {
    padding-left: var(--ddd-spacing-9);
    padding-right: var(--ddd-spacing-9);
  }
  .px-10 {
    padding-left: var(--ddd-spacing-10);
    padding-right: var(--ddd-spacing-10);
  }
  .px-11 {
    padding-left: var(--ddd-spacing-11);
    padding-right: var(--ddd-spacing-11);
  }
  .px-12 {
    padding-left: var(--ddd-spacing-12);
    padding-right: var(--ddd-spacing-12);
  }
  .px-13 {
    padding-left: var(--ddd-spacing-13);
    padding-right: var(--ddd-spacing-13);
  }
  .px-14 {
    padding-left: var(--ddd-spacing-14);
    padding-right: var(--ddd-spacing-14);
  }
  .px-15 {
    padding-left: var(--ddd-spacing-15);
    padding-right: var(--ddd-spacing-15);
  }
  .px-16 {
    padding-left: var(--ddd-spacing-16);
    padding-right: var(--ddd-spacing-16);
  }
  .px-17 {
    padding-left: var(--ddd-spacing-17);
    padding-right: var(--ddd-spacing-17);
  }
  .px-18 {
    padding-left: var(--ddd-spacing-18);
    padding-right: var(--ddd-spacing-18);
  }
  .px-19 {
    padding-left: var(--ddd-spacing-19);
    padding-right: var(--ddd-spacing-19);
  }
  .px-20 {
    padding-left: var(--ddd-spacing-20);
    padding-right: var(--ddd-spacing-20);
  }
  .px-21 {
    padding-left: var(--ddd-spacing-21);
    padding-right: var(--ddd-spacing-21);
  }
  .px-22 {
    padding-left: var(--ddd-spacing-22);
    padding-right: var(--ddd-spacing-22);
  }
  .px-23 {
    padding-left: var(--ddd-spacing-23);
    padding-right: var(--ddd-spacing-23);
  }
  .px-24 {
    padding-left: var(--ddd-spacing-24);
    padding-right: var(--ddd-spacing-24);
  }
  .px-25 {
    padding-left: var(--ddd-spacing-25);
    padding-right: var(--ddd-spacing-25);
  }
  .px-26 {
    padding-left: var(--ddd-spacing-26);
    padding-right: var(--ddd-spacing-26);
  }
  .px-27 {
    padding-left: var(--ddd-spacing-27);
    padding-right: var(--ddd-spacing-27);
  }
  .px-28 {
    padding-left: var(--ddd-spacing-28);
    padding-right: var(--ddd-spacing-28);
  }
  .px-29 {
    padding-left: var(--ddd-spacing-29);
    padding-right: var(--ddd-spacing-29);
  }
  .px-30 {
    padding-left: var(--ddd-spacing-30);
    padding-right: var(--ddd-spacing-30);
  }
  .py-auto {
    padding-top: auto;
    padding-bottom: auto;
  }
  .py-0 {
    padding-top: var(--ddd-spacing-0);
    padding-bottom: var(--ddd-spacing-0);
  }
  .py-1 {
    padding-top: var(--ddd-spacing-1);
    padding-bottom: var(--ddd-spacing-1);
  }
  .py-2 {
    padding-top: var(--ddd-spacing-2);
    padding-bottom: var(--ddd-spacing-2);
  }
  .py-3 {
    padding-top: var(--ddd-spacing-3);
    padding-bottom: var(--ddd-spacing-3);
  }
  .py-4 {
    padding-top: var(--ddd-spacing-4);
    padding-bottom: var(--ddd-spacing-4);
  }
  .py-5 {
    padding-top: var(--ddd-spacing-5);
    padding-bottom: var(--ddd-spacing-5);
  }
  .py-6 {
    padding-top: var(--ddd-spacing-6);
    padding-bottom: var(--ddd-spacing-6);
  }
  .py-7 {
    padding-top: var(--ddd-spacing-7);
    padding-bottom: var(--ddd-spacing-7);
  }
  .py-8 {
    padding-top: var(--ddd-spacing-8);
    padding-bottom: var(--ddd-spacing-8);
  }
  .py-9 {
    padding-top: var(--ddd-spacing-9);
    padding-bottom: var(--ddd-spacing-9);
  }
  .py-10 {
    padding-top: var(--ddd-spacing-10);
    padding-bottom: var(--ddd-spacing-10);
  }
  .py-11 {
    padding-top: var(--ddd-spacing-11);
    padding-bottom: var(--ddd-spacing-11);
  }
  .py-12 {
    padding-top: var(--ddd-spacing-12);
    padding-bottom: var(--ddd-spacing-12);
  }
  .py-13 {
    padding-top: var(--ddd-spacing-13);
    padding-bottom: var(--ddd-spacing-13);
  }
  .py-14 {
    padding-top: var(--ddd-spacing-14);
    padding-bottom: var(--ddd-spacing-14);
  }
  .py-15 {
    padding-top: var(--ddd-spacing-15);
    padding-bottom: var(--ddd-spacing-15);
  }
  .py-16 {
    padding-top: var(--ddd-spacing-16);
    padding-bottom: var(--ddd-spacing-16);
  }
  .py-17 {
    padding-top: var(--ddd-spacing-17);
    padding-bottom: var(--ddd-spacing-17);
  }
  .py-18 {
    padding-top: var(--ddd-spacing-18);
    padding-bottom: var(--ddd-spacing-18);
  }
  .py-19 {
    padding-top: var(--ddd-spacing-19);
    padding-bottom: var(--ddd-spacing-19);
  }
  .py-20 {
    padding-top: var(--ddd-spacing-20);
    padding-bottom: var(--ddd-spacing-20);
  }
  .py-21 {
    padding-top: var(--ddd-spacing-21);
    padding-bottom: var(--ddd-spacing-21);
  }
  .py-22 {
    padding-top: var(--ddd-spacing-22);
    padding-bottom: var(--ddd-spacing-22);
  }
  .py-23 {
    padding-top: var(--ddd-spacing-23);
    padding-bottom: var(--ddd-spacing-23);
  }
  .py-24 {
    padding-top: var(--ddd-spacing-24);
    padding-bottom: var(--ddd-spacing-24);
  }
  .py-25 {
    padding-top: var(--ddd-spacing-25);
    padding-bottom: var(--ddd-spacing-25);
  }
  .py-26 {
    padding-top: var(--ddd-spacing-26);
    padding-bottom: var(--ddd-spacing-26);
  }
  .py-27 {
    padding-top: var(--ddd-spacing-27);
    padding-bottom: var(--ddd-spacing-27);
  }
  .py-28 {
    padding-top: var(--ddd-spacing-28);
    padding-bottom: var(--ddd-spacing-28);
  }
  .py-29 {
    padding-top: var(--ddd-spacing-29);
    padding-bottom: var(--ddd-spacing-29);
  }
  .py-30 {
    padding-top: var(--ddd-spacing-30);
    padding-bottom: var(--ddd-spacing-30);
  }
  .gap-0 {
    gap: var(--ddd-spacing-0);
  }
  .gap-1 {
    gap: var(--ddd-spacing-1);
  }
  .gap-2 {
    gap: var(--ddd-spacing-2);
  }
  .gap-3 {
    gap: var(--ddd-spacing-3);
  }
  .gap-4 {
    gap: var(--ddd-spacing-4);
  }
  .gap-5 {
    gap: var(--ddd-spacing-5);
  }
  .gap-6 {
    gap: var(--ddd-spacing-6);
  }
  .gap-7 {
    gap: var(--ddd-spacing-7);
  }
  .gap-8 {
    gap: var(--ddd-spacing-8);
  }
  .gap-9 {
    gap: var(--ddd-spacing-9);
  }
  .gap-10 {
    gap: var(--ddd-spacing-10);
  }
  .gap-11 {
    gap: var(--ddd-spacing-11);
  }
  .gap-12 {
    gap: var(--ddd-spacing-12);
  }
  .gap-13 {
    gap: var(--ddd-spacing-13);
  }
  .gap-14 {
    gap: var(--ddd-spacing-14);
  }
  .gap-15 {
    gap: var(--ddd-spacing-15);
  }
  .gap-16 {
    gap: var(--ddd-spacing-16);
  }
  .gap-17 {
    gap: var(--ddd-spacing-17);
  }
  .gap-18 {
    gap: var(--ddd-spacing-18);
  }
  .gap-19 {
    gap: var(--ddd-spacing-19);
  }
  .gap-20 {
    gap: var(--ddd-spacing-20);
  }
  .gap-21 {
    gap: var(--ddd-spacing-21);
  }
  .gap-22 {
    gap: var(--ddd-spacing-22);
  }
  .gap-23 {
    gap: var(--ddd-spacing-23);
  }
  .gap-24 {
    gap: var(--ddd-spacing-24);
  }
  .gap-25 {
    gap: var(--ddd-spacing-25);
  }
  .gap-26 {
    gap: var(--ddd-spacing-26);
  }
  .gap-27 {
    gap: var(--ddd-spacing-27);
  }
  .gap-28 {
    gap: var(--ddd-spacing-28);
  }
  .gap-29 {
    gap: var(--ddd-spacing-29);
  }
  .gap-30 {
    gap: var(--ddd-spacing-30);
  }
`;
/* font sizing */
export const DDDFontSizing = css`
  .fs-4xs {
    font-size: var(--ddd-font-size-4xs);
  }
  .fs-3xs {
    font-size: var(--ddd-font-size-3xs);
  }
  .fs-xxs {
    font-size: var(--ddd-font-size-xxs);
  }
  .fs-xs {
    font-size: var(--ddd-font-size-xs);
  }
  .fs-s {
    font-size: var(--ddd-font-size-s);
  }
  .fs-ms {
    font-size: var(--ddd-font-size-ms);
  }
  .fs-m {
    font-size: var(--ddd-font-size-m);
  }
  .fs-ml {
    font-size: var(--ddd-font-size-ml);
  }
  .fs-l {
    font-size: var(--ddd-font-size-l);
  }
  .fs-xl {
    font-size: var(--ddd-font-size-xl);
  }
  .fs-xxl {
    font-size: var(--ddd-font-size-xxl);
  }
  .fs-3xl {
    font-size: var(--ddd-font-size-3xl);
  }
  .fs-4xl {
    font-size: var(--ddd-font-size-4xl);
  }
`;
/* font sizing */
export const DDDLetterSpacing = css`
  .ls-16-sm {
    letter-spacing: var(--ddd-ls-16-sm);
  }
  .ls-18-sm {
    letter-spacing: var(--ddd-ls-18-sm);
  }
  .ls-20-sm {
    letter-spacing: var(--ddd-ls-20-sm);
  }
  .ls-22-sm {
    letter-spacing: var(--ddd-ls-22-sm);
  }
  .ls-24-sm {
    letter-spacing: var(--ddd-ls-24-sm);
  }
  .ls-28-sm {
    letter-spacing: var(--ddd-ls-28-sm);
  }
  .ls-32-sm {
    letter-spacing: var(--ddd-ls-32-sm);
  }
  .ls-36-sm {
    letter-spacing: var(--ddd-ls-36-sm);
  }
  .ls-40-sm {
    letter-spacing: var(--ddd-ls-40-sm);
  }
  .ls-48-sm {
    letter-spacing: var(--ddd-ls-48-sm);
  }
  .ls-56-sm {
    letter-spacing: var(--ddd-ls-56-sm);
  }
  .ls-64-sm {
    letter-spacing: var(--ddd-ls-64-sm);
  }
  .ls-72-sm {
    letter-spacing: var(--ddd-ls-72-sm);
  }
  .ls-16-lg {
    letter-spacing: var(--ddd-ls-16-lg);
  }
  .ls-18-lg {
    letter-spacing: var(--ddd-ls-18-lg);
  }
  .ls-20-lg {
    letter-spacing: var(--ddd-ls-20-lg);
  }
  .ls-22-lg {
    letter-spacing: var(--ddd-ls-22-lg);
  }
  .ls-24-lg {
    letter-spacing: var(--ddd-ls-24-lg);
  }
  .ls-28-lg {
    letter-spacing: var(--ddd-ls-28-lg);
  }
  .ls-32-lg {
    letter-spacing: var(--ddd-ls-32-lg);
  }
  .ls-36-lg {
    letter-spacing: var(--ddd-ls-36-lg);
  }
  .ls-40-lg {
    letter-spacing: var(--ddd-ls-40-lg);
  }
  .ls-48-lg {
    letter-spacing: var(--ddd-ls-48-lg);
  }
  .ls-56-lg {
    letter-spacing: var(--ddd-ls-56-lg);
  }
  .ls-64-lg {
    letter-spacing: var(--ddd-ls-64-lg);
  }
  .ls-72-lg {
    letter-spacing: var(--ddd-ls-72-lg);
  }
`;
/* line height sizing */
export const DDDLineHeight = css`
  .lh-120 {
    line-height: var(--ddd-lh-120);
  }
  .lh-140 {
    line-height: var(--ddd-lh-140);
  }
  .lh-150 {
    line-height: var(--ddd-lh-150);
  }
  .lh-auto {
    line-height: normal;
  }
`;
/* Box shadows */
export const DDDBoxShadow = css`
  .bs-0 {
    box-shadow: none;
  }
  .bs-xs {
    box-shadow: var(--ddd-boxShadow-sm);
  }
  .bs-sm {
    box-shadow: var(--ddd-boxShadow-sm);
  }
  .bs-md {
    box-shadow: var(--ddd-boxShadow-md);
  }
  .bs-lg {
    box-shadow: var(--ddd-boxShadow-lg);
  }
  .bs-xl {
    box-shadow: var(--ddd-boxShadow-xl);
  }
`;
/* Border Radius */
export const DDDBorderRadius = css`
  .r-0 {
    border-radius: var(--ddd-radius-0);
  }
  .r-xs {
    border-radius: var(--ddd-radius-xs);
  }
  .r-sm {
    border-radius: var(--ddd-radius-sm);
  }
  .r-md {
    border-radius: var(--ddd-radius-md);
  }
  .r-lg {
    border-radius: var(--ddd-radius-lg);
  }
  .r-xl {
    border-radius: var(--ddd-radius-xl);
  }
  .r-rounded {
    border-radius: var(--ddd-radius-rounded);
  }
  .r-circle {
    border-radius: var(--ddd-radius-circle);
  }
`;
/* Background colors / gradients */
export const DDDBackground = css`
  .bg-transparent {
    background-color: transparent;
  }
  .bg-white {
    background-color: var(--ddd-theme-default-white);
  }
  .bg-gradient-navBar {
    background: var(--ddd-theme-default-gradient-navBar);
  }
  .bg-gradient-footer {
    background: var(--ddd-theme-default-gradient-footer);
  }
  .bg-gradient-newsFeature {
    background: var(--ddd-theme-default-gradient-newsFeature);
  }
  .bg-gradient-buttons {
    background: var(--ddd-theme-default-gradient-buttons);
  }
  .bg-gradient-hero {
    background: var(--ddd-theme-default-gradient-hero);
  }
  .bg-gradient-hero2 {
    background: var(--ddd-theme-default-gradient-hero2);
  }
`;
/* Font weight */
export const DDDFontWeight = css`
  .fw-0 {
    font-weight: var(--ddd-font-weight-regular); /* available for navigation */
  }
  .fw-1 {
    font-weight: var(--ddd-font-weight-medium); /* available for headers */
  }
  .fw-2 {
    font-weight: var(--ddd-font-weight-bold); /* available for headers */
  }
  .fw-3 {
    font-weight: var(
      --ddd-font-weight-black
    ); /* default for headers, body & navigation */
  }
`;
/* Font classes */
export const DDDFontClasses = css`
  .ddd-font-navigation {
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-theme-h4-font-size);
    font-weight: var(--ddd-font-weight-bold);
  }
  .ddd-font-primary {
    font-family: var(--ddd-font-primary);
  }
  .ddd-font-secondary {
    font-family: var(--ddd-font-secondary);
  }
`;

/* Breadcrumb */
export const DDDBreadcrumb = css`
  .breadcrumb {
    font-weight: var(--ddd-font-weight-light);
    margin: var(--ddd-spacing-6) 0;
    padding: 0;
    pointer-events: auto;
    list-style: "/";
    gap: var(--ddd-spacing-2);
    display: flex;
    flex-flow: row;
    color: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
    line-height: normal;
    text-align: start;
  }
  .breadcrumb li::marker {
    color: light-dark(black, white);
    font-weight: var(--ddd-font-weight-bold);
  }
  .breadcrumb li:first-child {
    list-style: none;
  }
  .breadcrumb li:last-child a {
    color: light-dark(black, white);
    pointer-events: none;
  }
  .breadcrumb li a {
    vertical-align: text-top;
    display: inline-block;
    padding: 0 var(--ddd-spacing-2);
    font-family: var(--ddd-font-navigation);
    font-weight: var(--ddd-font-weight-regular);
    text-decoration: none;
  }
  .breadcrumb li a:hover {
    text-decoration: underline;
    pointer-events: auto;
  }
`;
/* Extra things */
export const DDDExtra = css`
  /* helper class for accessibility of screen reader only content */
  .sr-only {
    position: absolute;
    left: -10000px;
    inset-inline-start: -10000px;
    inset-inline-end: initial;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
`;

export const DDDPulseEffect = css`
  /* Apply primary color as pulse effect using CSS variable */
  :host([data-primary="0"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-0-rgb);
  }
  :host([data-primary="1"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-1-rgb);
  }
  :host([data-primary="2"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-2-rgb);
  }
  :host([data-primary="3"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-3-rgb);
  }
  :host([data-primary="4"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-4-rgb);
  }
  :host([data-primary="5"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-5-rgb);
  }
  :host([data-primary="6"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-6-rgb);
  }
  :host([data-primary="7"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-7-rgb);
  }
  :host([data-primary="8"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-8-rgb);
  }
  :host([data-primary="9"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-9-rgb);
  }
  :host([data-primary="10"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-10-rgb);
  }
  :host([data-primary="11"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-11-rgb);
  }
  :host([data-primary="12"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-12-rgb);
  }
  :host([data-primary="13"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-13-rgb);
  }
  :host([data-primary="14"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-14-rgb);
  }
  :host([data-primary="15"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-15-rgb);
  }
  :host([data-primary="16"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-16-rgb);
  }
  :host([data-primary="17"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-17-rgb);
  }
  :host([data-primary="18"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-18-rgb);
  }
  :host([data-primary="19"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-19-rgb);
  }
  :host([data-primary="20"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-20-rgb);
  }
  :host([data-primary="21"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-21-rgb);
  }
  :host([data-primary="22"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-22-rgb);
  }
  :host([data-primary="23"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-23-rgb);
  }
  :host([data-primary="24"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-24-rgb);
  }
  :host([data-primary="25"]) {
    --ddd-animation-pulse-color: var(--ddd-primary-25-rgb);
  }

  :host([data-pulse]) {
    --ddd-animation-pulse-size: var(--ddd-spacing-4);
    animation-delay: 2.8s;
    animation-name: pulse;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    z-index: 10000;
  }
  :host([data-pulse="1"]) {
    --ddd-animation-pulse-size: var(--ddd-spacing-6);
  }
  :host([data-pulse="2"]) {
    --ddd-animation-pulse-size: var(--ddd-spacing-10);
  }
  :host([data-pulse]:not([data-primary])) {
    --ddd-animation-pulse-color: var(--ddd-primary-1-rgb);
  }
`;

export const DDDAnimations = css`
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(var(--ddd-animation-pulse-color));
    }
    70% {
      box-shadow: 0 0 0 var(--ddd-animation-pulse-size) rgba(0, 0, 0, 0); /* Use a transparent color derived from the original color */
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); /* Same here */
    }
  }
`;

// export that has all of them for easy stamping as a single sheet
export const DDDAllStyles = [
  DDDVariables,
  ...DDDDataAttributes,
  DDDReset,
  DDDBreadcrumb,
  DDDExtra,
  DDDBorders,
  DDDMarginPadding,
  DDDLetterSpacing,
  DDDLineHeight,
  DDDBoxShadow,
  DDDBorderRadius,
  DDDBackground,
  DDDFontClasses,
  DDDFontWeight,
  DDDFontSizing,
  DDDAnimations,
];
