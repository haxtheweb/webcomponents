import { html } from "lit-element/lit-element.js";
import { NavCard } from "@lrnwebcomponents/nav-card/nav-card.js";
import { NavCardItem } from "@lrnwebcomponents/nav-card/lib/nav-card-item.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Navigation Card",
  component: "nav-card",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};
const utils = new StorybookUtilities();
const NavItem = index => {
  let nav = utils.getRandomOption(["button", "a"]),
    tag = utils.getRandomOption(["span", "div", false]),
    type = utils.getRandomOption(["label", "img", "icon"]),
    id = `nav-card-item-${index}`,
    descBy = tag ? `nav-card-item-desc-${index}` : undefined,
    labelHTML = `Link Item ${index}`,
    href = nav === "a" ? `href="#"` : `onclick="alert('clicked ${labelHTML} (${id})')"`;
  return {
    accentColor: utils.getRandomColor(),
    dark: utils.getRandomOption('dark',''),
    icon: "chevron-right",
    avatar: type === "label" ? undefined : type === "img" ? utils.getRandomImage() : utils.getRandomIcon(),
    initials: type === "label" ? utils.getRandomOption("",label.innerHTML,utils.getRandomText()) : undefined,
    description: tag ? `<${tag} id="${descBy}" slot="description">${utils.getRandomText()}</${tag}>` : undefined,
    label: `<${nav} id ="${id}" slot="label" ${tag ? `aria-describedby="${descBy}"` : ""} ${href}>${labelHTML}</${nav}>`
  };
};

const MakeNavItem = index => {
  let item = NavItem(index);
  return `
    <nav-card-item 
      accent-color="${item.accentColor}"
      ${item.dark ? 'dark' : ''} 
      ${item.icon ? `icon="${item.icon}"` : ''} 
      ${item.avatar ? `avatar="${item.avatar}"` : ''} 
      ${item.initials ? `avatar="${item.initials}"` : ''}>
      ${item.label}
      ${item.description}
    </nav-card-item>`;
};
export const NavCardItemStory = () => {
  let defaults = NavItem('demo');
  defaults.avatar = undefined;
  return utils.makeElementFromClass(NavCardItem, defaults, [
    { css: "--nav-card-item-label-color", title: "item's default text color" },
    { css: "--nav-card-item-label-background-color", title: "item's default background-color" },
    { css: "--nav-card-item-label-font-size", title: "item's default font-size" },
    { css: "--nav-card-item-label-font-weight", title: "item's default font-weight" },
    { css: "--nav-card-item-label-font-size", title: "item description's default font-weight" },
    { css: "--nav-card-item-label-font-weight", title: "item description's default font-wight" },
    { css: "--nav-card-item-avatar-size", title: "default size for item's avatar" },
    { css: "--nav-card-item-avatar-width", title: "default width for item's avatar" },
    { css: "--nav-card-item-avatar-height", title: "efault height for item's avatar" },
    { css: "--nav-card-item-icon-size", title: "default size for item's icon" },
    { css: "--nav-card-item-icon-width", title: "default width for item's icon" },
    { css: "--nav-card-item-icon-height", title: "default height for item's icon" },
  ]);
};
export const NavCardStory = () => {
  return utils.makeElementFromClass(
    NavCard,
    {
      heading: utils.getRandomText(),
      subheading: utils.getRandomBool() ? utils.getRandomText() : undefined,
      content: utils.getRandomTextarea(),
      footer: utils.getRandomBool() ? `<p style="font-size:80%;padding-bottom: 10px;text-align:center;">${utils.getRandomText()}</p>` : undefined,
      color: utils.getRandomColor(),
      imageSrc: utils.getRandomImage(),
      linklist: `<div>${[1, 2, 3, 4, 5].map(i => MakeNavItem(i)).join('')}</div>`,
      maxWidth: "600px"
    },
    [
      { css: "--nav-card-image-width", title: "Width of horizontal image" },
      { css: "--nav-card-image-height", title: "Height of vertical image" },
      { css: "--nav-card-padding", title: "Default padding unit" },
      { css: "--nav-card-footer-border-color", title: "Footer border color" },
      { css: "--nav-card-box-shadow", title: "Card box-shadow" },
      { css: "--nav-card-padding-top", title: "Card padding-top " },
      { css: "--nav-card-padding-left", title: "Card padding-left" },
      { css: "--nav-card-padding-right", title: "Card padding-right" },
      { css: "--nav-card-padding-bottom", title: "Card padding-bottom" },
      { css: "--nav-card-heading-padding-top", title: "Heading padding-top" },
      { css: "--nav-card-heading-padding-left", title: "Heading padding-left" },
      { css: "--nav-card-heading-padding-right", title: "Heading padding-right" },
      { css: "--nav-card-heading-padding-bottom", title: "Heading padding-bottom" },
      { css: "--nav-card-subheading-padding-top", title: "Subeading padding-top" },
      { css: "--nav-card-subheading-padding-left", title: "Subeading padding-left" },
      { css: "--nav-card-subheading-padding-right", title: "Subeading padding-right" },
      { css: "--nav-card-subheading-padding-bottom", title: "Subeading padding-bottom" },
      { css: "--nav-card-content-padding-top", title: "Content padding-top" },
      { css: "--nav-card-content-padding-left", title: "Content padding-left" },
      { css: "--nav-card-content-padding-right", title: "Content padding-right" },
      { css: "--nav-card-content-padding-bottom", title: "Content padding-bottom" },
      { css: "--nav-card-linklist-border-bottom", title: "item's border-bottom" },
      { css: "--nav-card-footer-padding-top", title: "Footer padding-top" },
      { css: "--nav-card-footer-padding-left", title: "Footer padding-left" },
      { css: "--nav-card-footer-padding-right", title: "Footer padding-right" },
      { css: "--nav-card-footer-padding-bottom", title: "Footer padding-bottom" },
      { css: "--nav-card-color", title: "Card text color" },
      { css: "--nav-card-background-color", title: "Card background color" },
      { css: "--nav-card-border-color", title: "Card background color" },
      { css: "--nav-card-border-color", title: "Card heading text color" },
      { css: "width" },
      { css: "maxWidth"}
    ]
  );
};
