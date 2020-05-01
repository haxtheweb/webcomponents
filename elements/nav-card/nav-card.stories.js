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
const NavItemDesc = (index)=>{
  let tag = utils.getRandomOption(['span', 'p', 'div', false]);
  return tag 
    ? `<${tag} 
        id="nav-card-item-desc-${index}" 
        slot="description">
        ${utils.getRandomText()}
      </${tag}>` 
    : undefined;
};
const NavItemLabel = (index,desc)=>{
  let nav = utils.getRandomOption(['button', 'a']),
    label = document.createElement(nav);
    label.id = `nav-card-item-${index}`;
    label.slot = "label";
    label.innerHTML = `Link Item ${index}`;
  if(nav === "a") {
    label.href = "";
  } else {
    label.addEventListener('click',e=>console.log(`clicked ${label.innerHTML} (${label.id})`,e));
  }
  if(desc) label.setAttribute('aria-describedby',desc.id);
  return label;
};
const NavItem = (id) => {
let desc = NavItemDesc(id), 
  label = NavItemLabel(id,desc),
  type = utils.getRandomOption(['img', 'icon', 'label']),
  avatar, initials;

  if(type === "img") {
    avatar = utils.getRandomImage();
  } else if(avatar === "icon"){
    avatar = utils.getRandomIcon();
  } else {
    initials = utils.getRandomOption("",label.innerHTML,utils.getRandomText());
  }
  return {
    description: desc,
    label: label,
    accentColor: utils.getRandomColor(),
    dark: utils.getRandomBool(),
    avatar: avatar,
    initials: initials
  };
}
/*export const NavCardItemStory = () => {
  return utils.makeElementFromClass(NavCardItem, NavItem('demo'));
};*/
export const NavCardStory = () => {
  let list = `<div slot="linklist">
      ${[1,2,3,4,5].map((i)=>NavItem(i)).map(item=>html`
      <nav-card-item 
        .accent-color=${utils.getRandomColor()} 
        .avatar=${item.avatar || ''}
        ?dark="${utils.getRandomBool()}"
        .initials=${item.initials || ''}>
        ${item.label}
        ${item.desc}
      </nav-card-item>
      `)}
    </div>`;
  return utils.makeElementFromClass(NavCard, {
    heading: utils.getRandomText(),
    subheading: utils.getRandomBool() ? utils.getRandomText() : undefined,
    content: utils.getRandomTextarea(),
    footer: utils.getRandomBool() ? utils.getRandomText() : undefined,
    color: utils.getRandomColor(),
    imageSrc: utils.getRandomImage(),
    linklist: list,
    maxWidth: "600px"
  },[],[
    {
      css: "--nav-card-image-width",
      title: "Width of horizontal image",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-image-height",
      title: "Height of vertical image",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-padding",
      title: "Default padding unit",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-footer-border-color",
      title: "Footer border color",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-box-shadow",
      title: "Card box-shadow",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-padding-top",
      title: "Card padding-top ",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-padding-left",
      title: "Card padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-padding-right",
      title: "Card padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-padding-bottom",
      title: "Card padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-heading-padding-top",
      title: "Heading padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-heading-padding-left",
      title: "Heading padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-heading-padding-right",
      title: "Heading padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-heading-padding-bottom",
      title: "Heading padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-subheading-padding-top",
      title: "Subeading padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-subheading-padding-left",
      title: "Subeading padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-subheading-padding-right",
      title: "Subeading padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-subheading-padding-bottom",
      title: "Subeading padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-content-padding-top",
      title: "Content padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-content-padding-left",
      title: "Content padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-content-padding-right",
      title: "Content padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-content-padding-bottom",
      title: "Content padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-footer-padding-top",
      title: "Footer padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-footer-padding-left",
      title: "Footer padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-footer-padding-right",
      title: "Footer padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-footer-padding-bottom",
      title: "Footer padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-color",
      title: "Card text color",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-background-color",
      title: "Card background color",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-border-color",
      title: "Card background color",
      inputMethod: "textfield"
    },
    {
      css: "--nav-card-border-color",
      title: "Card heading text color",
      inputMethod: "textfield"
    },
    {
      css: "width",
      inputMethod: "textfield"
    },
    {
      css: "maxWidth",
      inputMethod: "textfield"
    }
  ]);
};
