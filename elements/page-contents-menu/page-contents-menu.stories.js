import { PageContentsMenu } from "./page-contents-menu.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Page contents menu",
  component: PageContentsMenu.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HeadersBelowTag = () => {
  const contents = document.createElement("div");
  contents.innerHTML = `<page-contents-menu relationship="parent"></page-contents-menu>
  <h1>This is a menu position to a heading</h1>
  <p>Stuff and things</p>
  <h2>Something else</h2>
  <p>Stuff and things</p>
  <h2 id="whatever">Something 2</h2>
  <p>Stuff and things</p>
  <p>Stuff and thingsStuff and thingsStuff and thingsStuff and thingsStuff and thingsStuff and thingsStuff and thingsStuff and things
    Stuff and thingsStuff and thingsStuff and thingsStuff and thingsStuff and things
    Stuff and thingsStuff and thingsStuff and thingsStuff and things
    Stuff and thingsStuff and thingsStuff and things
  </p>
  <video-player></video-player>
  <p>Stuff and things</p>
  <p>Stuff and things</p>
  <h3 id="cool">Something deeper</h3>
  <p>Stuff and things</p>
  <p>Stuff and things</p>
  <p>Stuff and things</p>
  <h2>Something else 2</h2>`;
  return utils.makeUsageDocs(PageContentsMenu, import.meta.url, contents);
};
