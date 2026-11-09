import { html, css } from "lit";
import { adminPrompt } from "./admin/haxcms-admin-confirm.js";
import { store } from "./haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import {
  localStorageSet,
  winEventsElement,
  validURL,
  removeBadJSEventAttributes,
  KeyboardShortcutManagerInstance,
} from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { HAXCMSThemeParts } from "./utils/HAXCMSThemeParts.js";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "./ui/app-hax-top-bar.js";
import "./ui/app-hax-user-menu.js";
import "./ui/app-hax-user-menu-button.js";
import { openCharacterBuilder } from "./ui/app-hax-user-menu-toggle.js";
import "./ui/hax-confirm-dialog.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import "@haxtheweb/super-daemon/lib/super-daemon-search.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { HAXCMSKeyboardShortcutsInstance } from "./utils/HAXCMSKeyboardShortcuts.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "./haxcms-site-insights.js"; // Legacy element tag name retained; it now renders Reports UI.
import "./haxcms-darkmode-toggle.js";
import "../ui-components/site/site-remote-content.js";
import "@haxtheweb/page-flag/page-flag.js";
import { SiteView } from "../ui-components/magic/site-view.js";
import { haxcmsApiMessage } from "./utils/HAXCMSApiMessages.js";
import { urlHostMatches } from "./utils/urlHost.js";
import { trimSlashes } from "@haxtheweb/utils/lib/safe-html.js";
import { settleOnce } from "@haxtheweb/utils/lib/events.js";
import {
  SITE_ADMIN_MODAL_STYLES,
  SITE_ADMIN_CONFIRM_STYLES,
  resolveSiteAdminRoute,
  siteAdminRouteCapability,
} from "./admin/site-admin-sections.js";

const ADMIN_ROUTE_QUERY_PATHS = {
  admin: "admin",
  about: "admin-about",
  appearance: "admin-appearance",
  "theme-preview": "admin-theme-preview",
  site: "admin-site",
  seo: "admin-seo",
  author: "admin-author",
  structure: "admin-structure",
  "structure-import": "admin-structure-import",
  content: "admin-content",
  files: "admin-files",
  views: "admin-views",
  transfer: "admin-transfer",
  reports: "admin-reports",
  "reports-accessibility": "admin-reports-accessibility",
  "reports-content": "admin-reports-content",
  "reports-links": "admin-reports-links",
  "reports-media": "admin-reports-media",
  "reports-instructional": "admin-reports-instructional",
  "reports-learning": "admin-reports-learning",
  "reports-cadence": "admin-reports-cadence",
  "reports-freshness": "admin-reports-freshness",
  "reports-metadata": "admin-reports-metadata",
  "reports-components": "admin-reports-components",
  blocks: "admin-blocks",
  editor: "admin-editor",
  features: "admin-features",
  revisions: "admin-content-revisions",
};

const ADMIN_QUERY_PATH_TO_ROUTE = {};
Object.keys(ADMIN_ROUTE_QUERY_PATHS).forEach((routePath) => {
  ADMIN_QUERY_PATH_TO_ROUTE[ADMIN_ROUTE_QUERY_PATHS[routePath]] = routePath;
});

const ADMIN_ROUTE_PATHS = new Set(Object.keys(ADMIN_ROUTE_QUERY_PATHS));

/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
// HAX UI dark, the same values hax-ui-styles uses for its dark theme. The
// top bar and the Merlin popover it opens wear it whatever theme is on, so
// nothing on the bar flips between light and dark.
const MERLIN_DARK = {
  "color-scheme": "dark",
  "--hax-ui-color-scheme": "dark",
  "--hax-ui-color": "#ffffff",
  "--hax-ui-color-focus": "#ffffff",
  "--hax-ui-color-faded": "#c5c3be",
  "--hax-ui-background-color": "var(--ddd-theme-default-coalyGray, #262626)",
  "--hax-ui-background-color-secondary": "#111",
  "--hax-ui-background-color-faded": "#222",
  "--hax-ui-color-accent": "#00c9ff",
  "--hax-ui-color-accent-secondary": "#00c9ff",
  "--hax-ui-background-color-accent": "#000",
  "--hax-ui-color-danger": "#ff8f8f",
  "--hax-ui-color-danger-secondary": "#ff2222",
  "--hax-ui-background-color-danger": "#000",
  "--hax-ui-border-color": "#000",
};

class HAXCMSSiteEditorUI extends HAXCMSThemeParts(
  HAXCMSI18NMixin(winEventsElement(ResponsiveUtilityBehaviors(DDD))),
) {
  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      css`
        :host *:not(:defined) {
          display: none;
        }
        :host {
          /* Merlin's field width; toasts line up with its start */
          --haxcms-editor-merlin-width: 360px;
          display: block;
          position: relative;
          height: 64px;
          left: 0;
          top: 0;
          right: 0;
          z-index: var(--ddd-z-modal, 10000);
          visibility: visible;
        }
        :host([edit-mode]) {
          z-index: 9999;
        }
        :host *[hidden] {
          display: none;
        }
        simple-tooltip:not(:defined) {
          display: none !important;
        }
        /* hidden only until the first render lands; no slide / fade in,
           the bar should just be there */
        :host([painting]) {
          visibility: hidden;
        }
        #editbutton {
          visibility: hidden;
          opacity: 0;
          /* the "start editing" pulse in the bar's own sky, not the page
             theme's primary, so it reads the same in light and dark */
          --ddd-animation-pulse-color: 204, 233, 255, 0.55;
        }

        :host([page-allowed]) #editbutton,
        :host([page-allowed]) #editdetails {
          visibility: visible;
          opacity: 1;
        }
        /* Ensure edit and save buttons are visible when in edit mode */
        :host([edit-mode]) #editbutton {
          visibility: visible;
          opacity: 1;
        }
        /* Edit (and Save in edit mode) is the one filled, primary action
           on the bar */
        #editbutton {
          --simple-toolbar-button-bg: var(--hax-ui-primary);
          --simple-toolbar-button-color: var(--hax-ui-on-primary);
          --simple-toolbar-button-hover-bg: var(--hax-ui-primary-hover);
          --simple-toolbar-button-hover-color: var(--hax-ui-on-primary);
          --simple-icon-color: var(--hax-ui-on-primary);
          background-color: var(--hax-ui-primary);
          color: var(--hax-ui-on-primary);
        }

        #merlin {
          color: var(--ddd-theme-default-wonderPurple);
        }

        /* Merlin's field draws its own HAX UI look and wand; this only
           places it, centered in the 64px bar */
        /* centered on the same line as the bar's 40px buttons; it sits
           16px after the hidden #merlin anchor, which is where the open
           popover draws its own field, so the two line up exactly */
        super-daemon-search.merlin {
          /* a darker well than the bar, so the field reads as a field */
          --hax-ui-background-color: #111;
          border: none;
          height: var(--ddd-control-height-sm, 40px);
          margin: 0 0 0 calc(var(--ddd-spacing-4, 16px) + 1px);
          --super-daemon-search-width: var(--haxcms-editor-merlin-width);
        }
        .toolbar-buttons.center-toolbar-buttons {
          gap: 0;
        }
        /* the way back out of Merlin when it fills a phone's bar */
        #merlinclose {
          display: none;
          margin-right: var(--hax-ui-gap-md, 8px);
        }

        :host([dark-mode]) #merlin {
          color: white; /* Ensure text is visible on blue background */
        }

        /* Save vs Cancel must read apart without color (greyscale screens,
           red/green color vision). skyBlue and discoveryCoral have the
           same luminance, so both turned the same grey. Save is now the
           filled, high-contrast primary and Cancel is an outlined, hatched
           danger button: fill weight says which is primary and the hatch
           (outline-designer's pending-delete pattern) says it throws work
           away. Checked by scripts/vision-pairs-check.mjs. */

        #cancelbutton {
          --haxcms-editor-cancel-color: var(--ddd-theme-default-original87Pink);
          --simple-toolbar-button-border-color: var(
            --haxcms-editor-cancel-color
          );
          color: var(--haxcms-editor-cancel-color);
          background-color: transparent;
          background-image: repeating-linear-gradient(
            -45deg,
            color-mix(
                in srgb,
                var(--haxcms-editor-cancel-color) 22%,
                transparent
              )
              0 4px,
            transparent 4px 8px
          );
        }
        :host([dark-mode]) #cancelbutton {
          --haxcms-editor-cancel-color: var(--ddd-theme-default-discoveryCoral);
        }

        #cancelbutton::part(button):hover,
        #cancelbutton::part(button):focus {
          border-color: var(--haxcms-editor-cancel-color);
        }

        :host([dark-mode]) #cancelbutton::part(button):hover,
        :host([dark-mode]) #cancelbutton::part(button):focus {
          --simple-toolbar-button-hover-bg: var(
            --simple-colors-default-theme-grey-3
          );
        }

        simple-toolbar-menu-item a {
          color: var(--simple-colors-default-theme-grey-12);
          text-decoration: none;
        }
        simple-toolbar-menu-item simple-toolbar-button {
          --simple-toolbar-button-min-width: 100%;
        }

        simple-toolbar-button.top-bar-button::part(button),
        haxcms-button-add::part(button) {
          --simple-toolbar-button-border-width: 1px;
        }

        simple-toolbar-button:not(#editbutton):not(.merlin):hover,
        simple-toolbar-button:not(#editbutton):not(.merlin):focus,
        simple-toolbar-button:not(#editbutton):not(.merlin):active,
        simple-toolbar-button:not(#editbutton):not(.merlin):focus-visible,
        simple-toolbar-menu:hover,
        simple-toolbar-menu:active,
        simple-toolbar-menu:focus,
        simple-toolbar-menu:focus-visible {
          color: var(--hax-ui-on-titlebar);
          --simple-toolbar-button-hover-bg: var(--hax-ui-hover);
          --simple-toolbar-button-hover-color: var(--hax-ui-on-titlebar);
          --simple-toolbar-button-hover-border-color: transparent;
        }

        #editbutton::part(button):hover,
        #editbutton::part(button):focus,
        #editbutton::part(button):active {
          border-color: transparent;
          background-color: var(--hax-ui-primary-hover);
          color: var(--hax-ui-on-primary);
        }
        haxcms-button-add::part(button):hover,
        haxcms-button-add::part(button):focus,
        haxcms-button-add::part(button):active {
          border-color: transparent;
          background-color: var(--hax-ui-hover);
          color: var(--hax-ui-on-titlebar);
        }

        simple-toolbar-button.top-bar-button::part(button):focus-visible,
        simple-toolbar-menu.top-bar-button::part(button):focus-visible,
        haxcms-button-add.top-bar-button::part(button):focus-visible,
        .mysiteslink:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        :host(:hover),
        :host(:active),
        :host(:focus) {
          opacity: 1;
        }
        /* the bar is HAX UI admin chrome: the titlebar surface in both
           schemes, so it reads the same as the admin dialog it opens.
           color-scheme dark makes every light-dark() token on it resolve
           to its dark half (light primary, yellow focus) */
        app-hax-top-bar {
          z-index: 1000;
          right: 0px;
          left: 0px;
          position: fixed;
          color-scheme: dark;
          /* Coaly gray in both schemes so the bar stands apart from light
             pages and from Potential midnight, the usual dark page ground */
          --bg-color: var(--ddd-theme-default-coalyGray);
          /* the bar and everything in it (menus, Merlin, the edit tools) is
             HAX UI dark whatever theme the page or the HAX UI uses, so
             nothing on it flips between light and dark */
          --hax-ui-color-scheme: dark;
          --hax-ui-color: var(--ddd-theme-default-white, #ffffff);
          --hax-ui-color-focus: var(--ddd-theme-default-white, #ffffff);
          --hax-ui-color-faded: #c5c3be;
          --hax-ui-background-color: var(--ddd-theme-default-coalyGray);
          --hax-ui-background-color-secondary: #111;
          --hax-ui-background-color-faded: #222;
          --hax-ui-color-accent: #00c9ff;
          --hax-ui-color-accent-secondary: #00c9ff;
          --hax-ui-background-color-accent: #000;
          --hax-ui-color-danger: #ff8f8f;
          --hax-ui-color-danger-secondary: #ff2222;
          --hax-ui-background-color-danger: #000;
          --hax-ui-border-color: #000;
          /* your character's frame: the same dark well as Merlin's field */
          --app-hax-user-menu-toggle-background: #111;
          --app-hax-user-menu-toggle-background-hover: #222;
          --app-hax-user-menu-toggle-border-color: var(--hax-ui-line-strong);
          --accent-color: var(--hax-ui-on-titlebar);
          color: var(--hax-ui-on-titlebar);
          font-family: var(--hax-ui-admin-font-family);
        }
        app-hax-top-bar::part(top-bar) {
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          overflow: visible;
          display: grid;
          border-bottom: 1px solid var(--hax-ui-line);
        }
        /* edit mode says so with a heavier accent rule under the bar */
        app-hax-top-bar[edit-mode]::part(top-bar) {
          border-bottom: var(--hax-ui-focus-width) solid
            var(--hax-ui-accent-strong);
        }
        .topbar-divider {
          display: inline-block;
          flex: none;
          align-self: center;
          width: 1px;
          height: var(--ddd-spacing-6, 24px);
          margin: 0 var(--hax-ui-gap, 4px);
          background-color: var(--hax-ui-line);
        }
        .topbar-divider[hidden] {
          display: none;
        }
        .topbar-left-group,
        .topbar-center-group,
        .topbar-right-group {
          align-items: center;
          display: flex;
          height: var(--top-bar-height, 64px);
        }
        .topbar-left-group {
          justify-content: flex-start;
          gap: var(--hax-ui-gap-md, 8px);
          padding-left: var(--hax-ui-gap-lg, 12px);
        }
        .topbar-right-group {
          gap: var(--hax-ui-gap-md, 8px);
          padding-right: var(--hax-ui-gap-lg, 12px);
        }
        .topbar-center-group {
          justify-content: center;
        }
        .topbar-right-group {
          justify-content: flex-end;
        }
        .home-btn {
          align-items: center;
          display: inline-flex;
          height: var(--top-bar-height, 64px);
        }
        /* the HAX mark: the World Traveler, decorative only */
        .haxLogo {
          display: inline-grid;
          place-items: center;
          width: var(--ddd-control-height-sm, 40px);
          height: var(--ddd-control-height-sm, 40px);
          --simple-icon-height: var(--ddd-icon-xs, 32px);
          --simple-icon-width: var(--ddd-icon-xs, 32px);
          pointer-events: none;
        }
        /* a HAX UI menu row with a switch, like the dark mode row */
        .soundToggle {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          width: 100%;
          border: none;
          margin: 0;
          min-height: var(--hax-ui-row-height-roomy, 40px);
          padding: 0 var(--hax-ui-gap-md, 8px);
          border-radius: var(--hax-ui-radius);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          text-align: left;
          color: var(--hax-ui-text);
          background: transparent;
          cursor: pointer;
          box-sizing: border-box;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        .soundToggle:hover,
        .soundToggle:focus-visible {
          background-color: var(--hax-ui-hover);
        }
        .soundToggle:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        .soundToggle simple-icon-lite {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .sound-label {
          flex: 1;
          text-align: left;
        }
        .hax-ui-switch {
          position: relative;
          flex: none;
          width: 36px;
          height: 20px;
          border-radius: var(--hax-ui-radius-pill);
          background-color: var(--hax-ui-line-strong);
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        .hax-ui-switch .knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--hax-ui-surface);
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .soundToggle[aria-pressed="true"] .hax-ui-switch {
          background-color: var(--hax-ui-primary);
        }
        .soundToggle[aria-pressed="true"] .hax-ui-switch .knob {
          transform: translateX(16px);
          background-color: var(--hax-ui-on-primary);
        }
        #site-menu {
          --app-hax-user-menu-width: 320px;
        }

        :host([edit-mode]) simple-toolbar simple-toolbar-button,
        :host([edit-mode]) simple-toolbar simple-toolbar-menu {
          --simple-toolbar-border-color: black;
        }

        simple-toolbar simple-toolbar-button,
        simple-toolbar simple-toolbar-menu {
          --simple-toolbar-border-radius: var(--ddd-radius-md);
          border-radius: var(--ddd-radius-md);
          background-color: var(--simple-colors-default-theme-grey-1);
        }

        app-hax-search-bar {
          vertical-align: middle;
          display: inline-flex;
        }
        .toolbar-buttons {
          display: flex;
          align-items: stretch;
          justify-content: center;
          height: var(--top-bar-height);
          gap: 0;
        }
        .left-toolbar-buttons {
          justify-content: flex-start;
        }
        .center-toolbar-buttons {
          justify-content: center;
        }
        .right-toolbar-buttons {
          justify-content: flex-end;
        }
        .merlin-anchor-button {
          opacity: 0;
          pointer-events: none;
          height: 1px !important;
          width: 1px !important;
          margin: 0 !important;
        }
        /* one button shape: 40px squares, no border at rest, the HAX UI
           hover wash; the name and shortcut live in the tooltip */
        .toolbar-buttons {
          gap: var(--hax-ui-gap-md, 8px);
          align-items: center;
        }
        .toolbar-buttons simple-toolbar-button,
        .toolbar-buttons simple-toolbar-menu,
        .toolbar-buttons haxcms-button-add {
          width: var(--ddd-control-height-sm, 40px);
          height: var(--ddd-control-height-sm, 40px);
          min-width: var(--ddd-control-height-sm, 40px);
          margin: 0;
          color: var(--hax-ui-on-titlebar);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
          --simple-toolbar-button-color: var(--hax-ui-on-titlebar);
          --simple-toolbar-button-bg: transparent;
          --simple-toolbar-button-hover-bg: var(--hax-ui-hover);
          --simple-toolbar-button-hover-border-color: transparent;
          --simple-toolbar-border-color: transparent;
          --simple-toolbar-button-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.38;
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-padding: 0;
          --simple-toolbar-border-radius: var(--hax-ui-radius-lg);
          --simple-toolbar-button-border-radius: var(--hax-ui-radius-lg);
          border-radius: var(--hax-ui-radius-lg);
        }
        /* Visually indicate which HAX content tab is active (config / blocks / map / source) */
        .toolbar-buttons simple-toolbar-button[active]::part(button),
        .toolbar-buttons simple-toolbar-button[active]:hover::part(button),
        .toolbar-buttons simple-toolbar-button[active]:focus::part(button),
        .toolbar-buttons
          simple-toolbar-button[active]:focus-visible::part(button),
        .toolbar-buttons simple-toolbar-button[active]:active::part(button) {
          background-color: var(--hax-ui-selected) !important;
          border-color: var(--hax-ui-accent-strong) !important;
        }
        .toolbar-buttons simple-toolbar-menu {
          --a11y-menu-button-bg-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --a11y-menu-button-list-bg-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --a11y-menu-button-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        simple-toolbar {
          align-items: stretch;
          justify-content: center;
          height: var(--top-bar-height);
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.3;
          --simple-toolbar-button-padding: 3px 6px;
        }

        simple-toolbar::part(buttons) {
          flex: 0 1 auto;
        }
        .ops-panel {
          display: flex;
          flex-direction: column;
          padding: 0;
          width: 100%;
        }

        .menu-toggle-wrapper {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          min-height: var(--top-bar-height, 64px);
        }

        .mysiteslink {
          display: block;
          text-decoration: none;
        }

        simple-toolbar-menu,
        simple-toolbar-button,
        haxcms-button-add {
          margin: 0;
        }
        /* the house and its quick links ride in the same menu element as
           the user menu */
        .site-menu {
          height: var(--top-bar-height, 64px);
        }
        /* the open quick links replace the house's tooltip */
        #manifestbtn[aria-expanded="true"]::part(tooltip) {
          display: none;
        }
        .site-menu::part(menuToggle),
        #user-menu::part(menuToggle) {
          display: flex;
          align-items: center;
        }
        .site-menu[hidden] {
          display: none;
        }
        simple-toolbar-menu-item.menu-item-delete simple-toolbar-button {
          border-top: var(--ddd-border-size-sm) solid;
          border-color: light-dark(black, white);
          margin-top: var(--ddd-spacing-1);
          padding-top: var(--ddd-spacing-2);
        }
        simple-toolbar-menu-item.menu-item-delete simple-toolbar-button:hover {
          color: var(--ddd-theme-default-error);
          background-color: var(--ddd-theme-default-errorLight);
        }

        @media screen and (max-width: 800px) {
          :host([edit-mode]) {
            bottom: unset;
          }
          #undo,
          #redo {
            display: none;
          }
          simple-toolbar {
            --simple-toolbar-button-padding: 3px 3px;
          }
          haxcms-button-add,
          simple-toolbar-menu,
          simple-toolbar-button {
            font-size: 10px;
          }
          simple-toolbar-menu {
            --icon-offset-right: 2px;
            --icon-offset-left: 2px;
          }
          simple-toolbar-menu::part(dropdown-icon) {
            right: 0;
            top: 10px;
          }
          :host([edit-mode]) #addmenubutton,
          :host([edit-mode]) #editdetails {
            display: none;
          }
        }
        @media (max-width: 600px) {
          /** hide buttons on a phone bc its too small */
          .haxLogo,
          #exportbtn,
          #content-map,
          #outlinebutton {
            display: none;
          }
          simple-toolbar {
            --simple-toolbar-button-padding: 0px;
            justify-content: space-between;
            background-color: white;
            height: auto;
          }

          /* you and the page tools on the left; Merlin folds to his
             button on the right and opens across the whole bar. The HAX
             mark is hidden: Merlin's Traveler is the one mark here */
          :host {
            --haxcms-editor-merlin-width: var(--ddd-control-height-sm, 40px);
          }
          app-hax-top-bar::part(top-bar) {
            grid-template-columns: minmax(0, 1fr) auto 0 !important;
          }
          .topbar-left-group {
            min-width: 0;
          }
          .topbar-center-group {
            padding: 0 var(--hax-ui-gap-md, 8px);
            min-width: 0;
            justify-content: flex-end;
          }
          super-daemon-search.merlin::part(filter) {
            display: none;
          }
          super-daemon-search.merlin::part(field) {
            justify-content: center;
            padding: 0;
            gap: 0;
            min-width: 0;
            cursor: pointer;
          }
          /* open: the search takes the bar, with a way back */
          :host([merlin-phone-open]) {
            --haxcms-editor-merlin-width: 100%;
          }
          :host([merlin-phone-open]) app-hax-top-bar::part(top-bar) {
            grid-template-columns: 0 minmax(0, 1fr) 0 !important;
          }
          :host([merlin-phone-open]) .topbar-left-group {
            visibility: hidden;
          }
          :host([merlin-phone-open]) .topbar-center-group {
            justify-content: flex-start;
          }
          :host([merlin-phone-open]) .center-toolbar-buttons {
            flex: 1 1 auto;
            min-width: 0;
          }
          :host([merlin-phone-open]) #merlinclose {
            display: inline-flex;
            margin-right: 0;
          }
          /* tuck the hidden popover anchor under the back button so the
             field (and the popover drawn over it) starts right after it */
          :host([merlin-phone-open]) #merlin {
            margin-left: calc(
              var(--hax-ui-gap-md, 8px) -
                (
                  var(--ddd-control-height-sm, 40px) +
                    var(--ddd-spacing-4, 16px) + 1px
                )
            ) !important;
          }
          :host([merlin-phone-open]) super-daemon-search.merlin {
            flex: 1 1 auto;
            min-width: 0;
          }
          :host([merlin-phone-open]) super-daemon-search.merlin::part(filter) {
            display: flex;
          }
          /* edit: the tools swipe sideways; Cancel and Save (and Merlin,
             in his own column) never move */
          .left-toolbar-buttons {
            min-width: 0;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            flex-wrap: nowrap;
          }
          .left-toolbar-buttons::-webkit-scrollbar {
            display: none;
          }
          .left-toolbar-buttons > * {
            flex: none;
          }
          :host([edit-mode]) #cancelbutton,
          :host([edit-mode]) #editbutton {
            position: sticky;
            z-index: 1;
            background-color: var(--ddd-theme-default-coalyGray);
            box-shadow: 0 0 0 4px var(--ddd-theme-default-coalyGray);
          }
          :host([edit-mode]) #editbutton {
            right: 0;
          }
          :host([edit-mode]) #cancelbutton {
            right: calc(
              var(--ddd-control-height-sm, 40px) + var(--hax-ui-gap-md, 8px)
            );
          }
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor-ui";
  }

  _expandSettingsPanel(_e) {
    this.shadowRoot.querySelector("#content-edit").click();
  }

  // a file needs to be selected via the program and then sub-program options presented
  selectFileToProcess() {
    import("@haxtheweb/file-system-broker/file-system-broker.js").then(
      async (_e) => {
        const broker = globalThis.FileSystemBroker.requestAvailability();
        const contents = await broker.getFileContents("*");
        const fileData = broker.fileHandler;
        let tmp = fileData.name.split(".");
        let type = "";
        // don't assume there is a file extension
        if (tmp.length > 1) {
          type = tmp.pop().toLowerCase();
        }
        // wand hands off for next part now that we've got a file selected
        SuperDaemonInstance.waveWand(
          [
            "",
            "/",
            {
              operation: "file-selected",
              contents: contents,
              data: fileData,
              type: type,
            },
            "hax-agent",
            this.t.uploadAFile,
          ],
          this.shadowRoot.querySelector("#merlin"),
          "coin2",
        );
      },
    );
  }

  // Process URL directly from Merlin search input
  processUrlFromInput(input) {
    const url = input.trim();
    if (this.isValidUrl(url)) {
      // wand hands off for next part now that we've got a URL entered
      SuperDaemonInstance.waveWand(
        [
          "",
          "/",
          {
            operation: "url-selected",
            url: url,
            data: url,
          },
          "hax-link-agent",
          this.t.createBlockFromLink,
        ],
        this.shadowRoot.querySelector("#merlin"),
        "coin2",
      );
    } else {
      store.toast(this.t.invalidUrlProvided, 3000, {
        hat: "construction",
        tone: "warning",
      });
    }
  }

  // URL validation helper
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  // URL type detection helper
  detectUrlType(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const search = urlObj.search.toLowerCase();

      // YouTube detection
      if (urlHostMatches(url, ["youtube.com", "youtu.be"])) {
        return "youtube";
      }

      // Kaltura MediaSpace detection
      // https://{tenant}.mediaspace.kaltura.com/media/t/{mediaId}
      if (
        urlHostMatches(url, ["mediaspace.kaltura.com"]) &&
        pathname.includes("/media/t/")
      ) {
        return "kaltura";
      }

      // Image detection (by extension)
      if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) {
        return "image";
      }

      // Video detection (by extension)
      if (pathname.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv)$/i)) {
        return "video";
      }

      // PDF detection
      if (pathname.match(/\.pdf$/i) || search.includes(".pdf")) {
        return "pdf";
      }

      // Audio detection
      if (pathname.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/i)) {
        return "audio";
      }

      return "generic";
    } catch {
      return "generic";
    }
  }

  // URL processing method similar to processFileContentsBasedOnUserDesire
  async processUrlContentsBasedOnUserDesire(values, mode) {
    const url = values.url;
    this.setProcessingVisual();

    // Ensure we're in edit mode
    if (store.editMode === false) {
      store.editMode = true;
    }

    setTimeout(() => {
      let elementToInsert = null;

      switch (mode) {
        case "embed-youtube": {
          // Extract YouTube video ID
          const videoId = this.extractYouTubeId(url);
          if (videoId) {
            elementToInsert = HAXStore.activeHaxBody.haxInsert(
              "video-player",
              "",
              {
                source: `https://www.youtube.com/watch?v=${videoId}`,
                "source-type": "youtube",
              },
            );
          }
          break;
        }

        case "embed-kaltura":
          // Insert the Kaltura MediaSpace share URL; video-player's
          // cleanVideoSource will transform it into the secure embed iframe URL.
          // https://{tenant}.mediaspace.kaltura.com/media/t/{mediaId}
          elementToInsert = HAXStore.activeHaxBody.haxInsert(
            "video-player",
            "",
            {
              source: url,
              "source-type": "kaltura",
            },
          );
          break;

        case "insert-image":
          elementToInsert = HAXStore.activeHaxBody.haxInsert("img", "", {
            src: url,
            alt: this.t.imageFromUrl,
            loading: "lazy",
          });
          break;

        case "embed-pdf":
          elementToInsert = HAXStore.activeHaxBody.haxInsert("iframe", "", {
            src: url,
            width: "100%",
            height: "500px",
            frameborder: "0",
          });
          break;

        case "embed-video":
          elementToInsert = HAXStore.activeHaxBody.haxInsert("video", "", {
            src: url,
            controls: true,
            width: "100%",
          });
          break;

        case "insert-rich-link":
          // Try to create a rich link with preview
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;

        case "hax-default": {
          // Use HAX's original insertLogicFromValues method for automatic detection
          const haxValues = {
            source: url,
            title: values.title || url,
          };
          if (
            HAXStore.insertLogicFromValues(haxValues, HAXStore, false, true)
          ) {
            return;
          }
          // Fallback to simple link if HAX logic doesn't handle it
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;
        }

        case "apply-to-selected-text": {
          // Apply URL as link to currently selected text
          const selection = globalThis.getSelection();
          if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString().trim();

            if (selectedText && range) {
              const linkElement = globalThis.document.createElement("a");
              linkElement.setAttribute("href", url);
              linkElement.setAttribute("target", "_blank");
              linkElement.setAttribute("rel", "noopener noreferrer");
              linkElement.textContent = selectedText;

              range.deleteContents();
              range.insertNode(linkElement);

              // Position cursor after the link
              setTimeout(() => {
                range.setStartAfter(linkElement);
                range.setEndAfter(linkElement);
                selection.removeAllRanges();
                selection.addRange(range);
              }, 0);

              store.toast(this.t.linkAppliedToSelectedText, 3000, {
                hat: "construction",
                walking: true,
                tone: "success",
              });
              return;
            }
          }
          // Fallback to simple link if no selection
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;
        }

        case "insert-simple-link":
        default:
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;
      }

      if (elementToInsert) {
        store.toast(this.t.urlProcessedSuccessfully, 3000, {
          hat: "construction",
          walking: true,
          tone: "success",
        });
      }
    }, 300);
  }

  // Helper to extract YouTube video ID from various YouTube URL formats
  extractYouTubeId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // processing visualization
  // duration defaults to 5s for short operations (page saves, deletes);
  // pass a larger value (e.g. 600000) for long-running import/export work
  // on very large sites so the indicator does not vanish mid-operation.
  // Always pair with clearProcessingVisual() once the work finishes.
  setProcessingVisual(duration = 5000) {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.marginLeft = "8px";
    store.toast(this.t.processing, duration, {
      tone: "working",
      hat: "construction",
      speed: 150,
      walking: true,
      slot: loadingIcon,
    });
  }

  // dismiss the processing toast. Call this before firing a result toast
  // (success or error) so the new toast gets a fresh auto-hide timer.
  clearProcessingVisual() {
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  // Convert CSV text to an HTML table element
  csvToHtmlTable(csvText) {
    try {
      const table = globalThis.document.createElement("table");
      const tbody = globalThis.document.createElement("tbody");
      table.appendChild(tbody);

      // Simple CSV parser that handles quoted fields with commas
      const rows = [];
      let i = 0;
      let field = "";
      let row = [];
      let inQuotes = false;

      const pushField = () => {
        // Unwrap quotes and unescape double quotes
        let val = field;
        if (val.length > 0 && val[0] === '"' && val[val.length - 1] === '"') {
          val = val.substring(1, val.length - 1).replace(/""/g, '"');
        }
        row.push(val);
        field = "";
      };

      while (i < csvText.length) {
        const char = csvText[i];
        if (inQuotes) {
          if (char === '"') {
            if (csvText[i + 1] === '"') {
              field += '"';
              i += 2;
              continue;
            } else {
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            field += char;
            i++;
            continue;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
            i++;
            continue;
          }
          if (char === ",") {
            pushField();
            i++;
            continue;
          }
          if (char === "\n" || char === "\r") {
            // handle CRLF and LF
            if (char === "\r" && csvText[i + 1] === "\n") {
              i += 2;
            } else {
              i++;
            }
            pushField();
            rows.push(row);
            row = [];
            continue;
          }
          field += char;
          i++;
        }
      }
      // push last field/row
      pushField();
      if (row.length > 0) {
        rows.push(row);
      }

      // build table body
      rows.forEach((cols, idx) => {
        if (cols.length === 1 && cols[0].trim() === "") return;
        const tr = globalThis.document.createElement("tr");
        cols.forEach((col) => {
          const cell =
            idx === 0
              ? globalThis.document.createElement("th")
              : globalThis.document.createElement("td");
          // escape
          const span = globalThis.document.createElement("span");
          span.textContent = col;
          cell.appendChild(span);
          tr.appendChild(cell);
        });
        tbody.appendChild(tr);
      });

      // basic styling hooks; DDD can style table generically
      table.setAttribute("border", "1");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      return table;
    } catch (e) {
      console.warn("CSV to table conversion failed:", e);
      return null;
    }
  }

  // upload file and do what the user asked contextually
  async processFileContentsBasedOnUserDesire(values, mode, operationType) {
    toJS(UserScaffoldInstance.data);
    this.setProcessingVisual();
    switch (mode) {
      // upload and possibly link/embed the item
      case "set-page-media":
        // Upload file first, then set as page media
        this.dispatchEvent(
          new CustomEvent("hax-file-upload", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              file: values.data,
              placeHolderElement: null,
              operationType: "upload-only",
              callback: (fileData) => {
                // After upload completes, set as page media
                const item = toJS(store.activeItem);
                if (item && item.id && fileData && fileData.file) {
                  globalThis.dispatchEvent(
                    new CustomEvent("haxcms-save-node-details", {
                      bubbles: true,
                      composed: true,
                      cancelable: true,
                      detail: {
                        id: item.id,
                        operation: "setMedia",
                        media: fileData.file,
                      },
                    }),
                  );
                  store.toast(this.t.pageMediaUpdatedSuccessfully, 3000, {
                    hat: "construction",
                    walking: true,
                    tone: "success",
                  });
                }
              },
            },
          }),
        );
        break;
      case "upload":
      case "link":
      case "insert-file":
        if (mode === "upload") {
          // do the uploading
          // confirm it went through
          // put link in the dialog confirmation if desired to open in new window
          // fire this specialized event up so things like HAX can intercept
          this.dispatchEvent(
            new CustomEvent("hax-file-upload", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                file: values.data,
                placeHolderElement: null,
                operationType: operationType,
              },
            }),
          );
        } else if (mode === "link") {
          if (store.editMode === false) {
            store.editMode = true;
          }
          // do the uploading
          // take resulting upload
          // put in editMode if we have to
          // insert link in bottom of page / below whatever is active
          setTimeout(() => {
            let p = HAXStore.activeHaxBody.haxInsert("p", "", {});
            // fire this specialized event up so things like HAX can intercept
            this.dispatchEvent(
              new CustomEvent("hax-file-upload", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  file: values.data,
                  placeHolderElement: p,
                  operationType: operationType,
                },
              }),
            );
          }, 300);
        } else {
          if (store.editMode === false) {
            store.editMode = true;
          }
          // upload
          // take resulting upload
          // put in editMode if we have to
          // insert result into bottom of page / active
          // allowing hax to evaluate what type should be inserted (gizmoGuess)
          setTimeout(() => {
            let p = HAXStore.activeHaxBody.haxInsert("p", "", {});
            // fire this specialized event up so things like HAX can intercept
            this.dispatchEvent(
              new CustomEvent("hax-file-upload", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  file: values.data,
                  placeHolderElement: p,
                  operationType: operationType,
                },
              }),
            );
          }, 300);
        }
        break;
      case "insert-table":
      case "insert-csv": {
        // Handle Excel file conversion to CSV and table
        let excelDataToPost = new FormData();
        excelDataToPost.append("upload", values.data); // Excel file

        if (store.editMode === false) {
          store.editMode = true;
        }

        try {
          const excelResponse = await MicroFrontendRegistry.call(
            "@system/xlsxToCsv",
            excelDataToPost,
          );

          if (excelResponse.status === 200) {
            const csvData = excelResponse.data.contents;

            setTimeout(() => {
              if (mode === "insert-table") {
                // Convert CSV to HTML table
                const tableElement = this.csvToHtmlTable(csvData);
                if (tableElement) {
                  HAXStore.activeHaxBody.haxInsert(
                    "table",
                    tableElement.innerHTML,
                    {},
                  );
                  store.toast(this.t.excelConvertedToTable, 3000, {
                    hat: "construction",
                    walking: true,
                    tone: "success",
                  });
                }
              } else {
                // Insert as formatted CSV text
                HAXStore.activeHaxBody.haxInsert("pre", csvData, {});
                store.toast(this.t.excelConvertedToCsv, 3000, {
                  hat: "construction",
                  walking: true,
                  tone: "success",
                });
              }
            }, 300);
          } else {
            store.toast(
              this.t.errorConvertingExcelFile.replace("{error}", () =>
                haxcmsApiMessage(excelResponse, this.t.unknownError),
              ),
              4000,
              {
                hat: "construction",
                tone: "danger",
              },
            );
          }
        } catch (error) {
          console.error("Excel conversion error:", error);
          store.toast(
            this.t.errorProcessingExcelFile.replace(
              "{error}",
              () => error.message,
            ),
            4000,
            {
              hat: "construction",
              tone: "danger",
            },
          );
        }
        break;
      }
      case "insert-html":
      case "create-sibling":
      case "create-child":
      case "create-branch": {
        let endpointCall = null;
        let dataToPost = new FormData();
        switch (values.type) {
          case "docx":
          case "doc":
            dataToPost.append("upload", values.data); // should contain our file
            // single file vs whole site processing
            endpointCall = "@system/docxToHtml";
            if (mode === "create-branch") {
              endpointCall = "@system/importDocx";
              dataToPost.append("method", "branch");
              dataToPost.append("type", "branch");
              // set parent to same as current page's parent
              const item = toJS(store.activeItem);
              dataToPost.append("parentId", item.parent);
            }
            break;
          case "pdf":
            dataToPost.append("upload", values.data);
            endpointCall = "@system/pdfToHtml";
            if (mode === "create-branch") {
              endpointCall = "@system/importPdf";
              dataToPost.append("method", "branch");
              dataToPost.append("type", "branch");
              // set parent to same as current page's parent
              const itemPdf = toJS(store.activeItem);
              dataToPost.append("parentId", itemPdf.parent);
            }
            break;
          case "pptx":
            dataToPost.append("upload", values.data);
            endpointCall = "@system/pptxToHtml";
            if (mode === "create-branch") {
              endpointCall = "@system/importPptx";
              dataToPost.append("method", "branch");
              dataToPost.append("type", "branch");
              // set parent to same as current page's parent
              const itemPptx = toJS(store.activeItem);
              dataToPost.append("parentId", itemPptx.parent);
            }
            break;
          case "md":
          case "txt":
            endpointCall = "@system/mdToHtml";
            dataToPost = {
              md: values.contents,
            };
            break;
          case "html":
          case "htm":
            if (
              ["insert-html", "create-sibling", "create-child"].includes(mode)
            ) {
              dataToPost.append("upload", values.data);
              endpointCall = "@system/htmlToSite";
              dataToPost.append("method", "page");
            } else if (mode === "create-branch") {
              dataToPost.append("upload", values.data);
              endpointCall = "@system/htmlToSite";
              dataToPost.append("method", "branch");
              dataToPost.append("type", "branch");
              // set parent to same as current page's parent
              const itemHtml = toJS(store.activeItem);
              dataToPost.append("parentId", itemHtml.parent);
            }
            break;
        }
        // put in editMode if we have to
        // insert result into bottom of page
        let response = {};

        if (endpointCall) {
          if (mode === "insert-html") {
            response = await MicroFrontendRegistry.call(
              endpointCall,
              dataToPost,
            );
            if (response.status == 200) {
              let insertHtml = null;
              if (
                response.data &&
                response.data.contents &&
                typeof response.data.contents === "string"
              ) {
                insertHtml = response.data.contents;
              } else if (
                response.data &&
                response.data.items &&
                response.data.items.length > 0 &&
                response.data.items[0].contents &&
                typeof response.data.items[0].contents === "string"
              ) {
                insertHtml = response.data.items[0].contents;
              } else if (typeof response.data === "string") {
                insertHtml = response.data;
              }
              if (insertHtml) {
                // fake file event from built in method for same ux
                this.insertElementsFromContentBlob(insertHtml);
              }
            }
          } else {
            response = await MicroFrontendRegistry.call(
              endpointCall,
              dataToPost,
            );
            if (response.status == 200) {
              if (["create-sibling", "create-child"].includes(mode)) {
                let convertedHtml = null;
                if (
                  response.data &&
                  response.data.contents &&
                  typeof response.data.contents === "string"
                ) {
                  convertedHtml = response.data.contents;
                } else if (
                  response.data &&
                  response.data.items &&
                  response.data.items.length > 0 &&
                  response.data.items[0].contents &&
                  typeof response.data.items[0].contents === "string"
                ) {
                  convertedHtml = response.data.items[0].contents;
                } else if (typeof response.data === "string") {
                  convertedHtml = response.data;
                }
                this.createNewNode(
                  mode.replace("create-", ""),
                  values.data.name,
                  convertedHtml || "<p></p>",
                  values && values.contextItemId ? values.contextItemId : null,
                  this._createOptionsFor(values),
                );
              } else {
                if (
                  response.data &&
                  response.data.items &&
                  response.data.items.length > 0
                ) {
                  this._openImportHierarchy(response.data.items, false, {});
                } else {
                  store.toast(this.t.noValidItemsFoundInImportResponse, 4000, {
                    hat: "construction",
                    tone: "danger",
                  });
                }
              }
            }
          }
        } else {
          // implies HTML so just use the file without processing
          // we don't support create-branch for this yet
          if (mode === "insert-html") {
            this.insertElementsFromContentBlob(values.contents);
          }
          // @todo we may support create-branch in the future for non-docx paths but just in case we goof up for now
          else if (mode !== "create-branch") {
            this.createNewNode(
              mode.replace("create-", ""),
              values.data.name,
              values.contents,
              values && values.contextItemId ? values.contextItemId : null,
              this._createOptionsFor(values),
            );
          }
        }
        break;
      }
    }
  }
  /**
   * An opt-in a caller other than Merlin's own menu can put on `values`
   * (Content's add area): `keepOpen` keeps the admin dialog open and stays
   * on the current page after the page is made. Merlin sets none, so its
   * behavior is unchanged.
   */
  _createOptionsFor(values) {
    return { keepOpen: !!(values && values.keepOpen) };
  }

  // create node w/ title and contents passed in
  async createNewNode(
    type,
    title = this.t.newPageDefaultTitle,
    contents = "<p></p>",
    contextItemId = null,
    options = {},
  ) {
    let order = null;
    let parent = null;
    let item = null;
    if (contextItemId) {
      item = toJS(await store.findItemAsObject(contextItemId));
    }
    if (!item) {
      item = toJS(store.activeItem);
    }
    if (item) {
      if (type === "sibling") {
        parent = item.parent;
        // same so its put right next to it
        order = parseInt(item.order);
      } else if (type === "child") {
        parent = item.id;
        // find last child, or just be the 1st one.
        const childItem = toJS(await store.getLastChildItem(item.id));
        let tmp = null;
        if (childItem && (childItem.order || childItem.order === 0)) {
          tmp = childItem.order;
        }
        order = 0;
        if (tmp || tmp === 0) {
          order = parseInt(tmp) + 1;
        }
      } else if (type === "branch") {
        parent = null;
        order = 0;
      } else {
        // API invoked incorrectly
        parent = null;
        order = 0;
      }
    }
    if (title == "") {
      title = this.t.newPageDefaultTitle;
    }
    let payload = {
      node: {
        title: title,
        location: "",
        contents: contents,
      },
      order: order,
      parent: parent,
    };
    // haxcms is in charge of making the node from here
    this.dispatchEvent(
      new CustomEvent("haxcms-create-node", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          originalTarget: this,
          values: payload,
          keepOpen: !!(options && options.keepOpen),
        },
      }),
    );
  }

  // insert content based on the contents we read from a file
  // this will be under the active node
  insertElementsFromContentBlob(content) {
    let addToEnd = false;
    let slot = false;
    // insert HTML needs to be editing the active page if its not in edit mode
    if (store.editMode === false) {
      store.editMode = true;
      addToEnd = true;
    } else if (this.activeNode && this.activeNode.hasAttribute("slot")) {
      // test for slot on insert attempt
      slot = this.activeNode.getAttribute("slot");
    }
    const div = globalThis.document.createElement("div");
    div.innerHTML = content;
    removeBadJSEventAttributes(div);
    const importedChildren = Array.from(div.children);

    // ensure we have a parent or we won't be able to insert beyond active and should just append to the bottom
    if (!addToEnd && this.activeNode && this.activeNode.parentNode) {
      for (let i = importedChildren.length - 1; i >= 0; i--) {
        if (slot) {
          importedChildren[i].setAttribute("slot", slot);
        }
        this.activeNode.parentNode.insertBefore(
          importedChildren[i],
          this.activeNode.nextSibling,
        );
      }
    } else {
      // give initial setup time to process since we forced it into edit mode to be here
      setTimeout(() => {
        for (let i = 0; i < importedChildren.length; i++) {
          HAXStore.activeHaxBody.appendChild(importedChildren[i]);
        }
        setTimeout(() => {
          HAXStore.activeHaxBody.scrollHere(this.activeNode);
          setTimeout(() => {
            HAXStore.activeHaxBody.scrollHere(this.activeNode);
          }, 500);
        }, 1000);
      }, 300);
    }
    HAXStore.toast(this.t.contentImported, 3000, { tone: "success" });
  }

  // insert URL w/ variations in method
  async insertUrl(input, mode) {
    if (store.editMode === false) {
      store.editMode = true;
    }
    if (mode) {
      const response = await MicroFrontendRegistry.call(
        "@core/websiteMetadata",
        {
          q: input,
        },
      );
      if (response.data && (response.data["og:title"] || response.data.title)) {
        let values = {
          title: response.data["og:title"] || response.data.title,
          source: input,
        };
        HAXStore.insertLogicFromValues(values, this);
      }
    }
  }

  // Generate a slug from title text
  generateSlugFromTitle(title) {
    return title
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^0-9\-/a-z]/gi, "");
  }

  // Get available page templates from style guide
  async getPageTemplates() {
    try {
      const siteBuilder = globalThis.document.querySelector(
        "haxcms-site-builder",
      );
      if (!siteBuilder) {
        console.warn("getPageTemplates: No haxcms-site-builder found");
        return [];
      }

      // Load style guide content
      const styleGuideContent = await store.loadStyleGuideContent();
      if (!styleGuideContent) {
        console.warn("getPageTemplates: No style guide content found");
        return [];
      }

      // Convert style guide content to HAX schema elements
      const styleGuideElements =
        await siteBuilder.htmlToHaxElements(styleGuideContent);
      const templates = [];

      for (const styleElement of styleGuideElements) {
        // Look for page-template elements with schema="page"
        if (styleElement && styleElement.tag === "page-template") {
          const schema =
            styleElement.properties && styleElement.properties.schema;
          const templateName =
            styleElement.properties && styleElement.properties.name;
          const templateId =
            styleElement.properties &&
            (styleElement.properties["data-haxsg-id"] ||
              styleElement.properties.id);

          if (schema === "page" && templateName && styleElement.content) {
            const template = {
              id: templateId || `template-${templates.length}`,
              name: templateName,
              content: styleElement.content,
            };
            templates.push(template);
          }
        }
      }

      return templates;
    } catch (error) {
      console.warn("Failed to get page templates:", error);
      return [];
    }
  }

  // Create page with title - method called by Merlin programs
  async createPageWithTitle(title, type, templateContent = null) {
    // When invoked from the create-page Merlin program, always prefer the
    // live Merlin input value so rapid typing + Enter uses the latest text.
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager &&
      globalThis.SuperDaemonManager.requestAvailability();
    if (
      SuperDaemonInstance &&
      SuperDaemonInstance.programName === "create-page" &&
      SuperDaemonInstance.value &&
      SuperDaemonInstance.value.trim() !== ""
    ) {
      title = SuperDaemonInstance.value.trim();
    }

    let order = null;
    let parent = null;
    const item = toJS(store.activeItem);

    if (item) {
      if (type === "sibling") {
        parent = item.parent;
        order = parseInt(item.order) + 1;
      } else if (type === "child") {
        parent = item.id;
        // see if we have a last child of the current item
        let item2 = toJS(await store.getLastChildItem(item.id));
        order = 0;
        if (item2.order) {
          order = parseInt(item2.order) + 1;
        }
      } else if (type === "duplicate") {
        parent = item.parent;
        order = parseInt(item.order) + 1;
      }
    }

    const payload = {
      node: {
        title: title,
      },
      order: order,
      parent: parent,
      // Mark this as created by a Merlin program for auto-edit enhancement
      merlinCreated: true,
    };

    // For duplicate, add the duplicate flag
    if (type === "duplicate" && item) {
      payload.node.duplicate = item.id;
    }

    // If template content is provided, add it to the payload
    if (templateContent) {
      payload.node.contents = templateContent;
    }

    // Create the page
    this.dispatchEvent(
      new CustomEvent("haxcms-create-node", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          originalTarget: this,
          values: payload,
        },
      }),
    );

    // Provide user feedback
    let message = this.t.pageCreatedSuccessfully.replace(
      "{title}",
      () => title,
    );
    if (type === "child") {
      message = this.t.childPageCreatedSuccessfully.replace(
        "{title}",
        () => title,
      );
    } else if (type === "duplicate") {
      message = this.t.pageDuplicatedSuccessfully.replace(
        "{title}",
        () => title,
      );
    }
    if (templateContent) {
      message += " " + this.t.templateApplied;
    }

    store.playSound("success");
    HAXStore.toast(message);

    // Close the daemon after successful creation
    SuperDaemonInstance.close();
  }

  // Move page under a new parent - method called by Move Page Merlin program
  async movePageUnderParent(pageId, newParentId) {
    if (!pageId) {
      store.toast(this.t.errorNoPageToMove, 3000, {
        fire: true,
        tone: "danger",
      });
      return;
    }

    // Get the page being moved
    const pageToMove = await store.findItem(pageId);
    if (!pageToMove) {
      store.toast(this.t.errorPageNotFound, 3000, {
        fire: true,
        tone: "danger",
      });
      return;
    }

    // Determine the new order (make it the last child of the new parent)
    let newOrder = 0;
    if (newParentId) {
      const lastChild = toJS(await store.getLastChildItem(newParentId));
      if (lastChild && (lastChild.order || lastChild.order === 0)) {
        newOrder = parseInt(lastChild.order) + 1;
      }
    } else {
      // Moving to root - find last root item
      const lastChild = toJS(await store.getLastChildItem(null));
      if (lastChild && (lastChild.order || lastChild.order === 0)) {
        newOrder = parseInt(lastChild.order) + 1;
      }
    }

    // Dispatch the save node details event with setParent operation
    // Match the structure used by other operations (moveUp, moveDown, indent, outdent)
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: pageId,
          operation: "setParent",
          parent: newParentId,
          order: newOrder,
        },
      }),
    );

    // Provide user feedback
    const parentTitle = newParentId
      ? (await store.findItem(newParentId)).title
      : this.t.rootLevel;
    store.toast(
      this.t.pageMovedUnder.replace("{parent}", () => parentTitle),
      3000,
      {
        hat: "construction",
        walking: true,
      },
    );

    // Close the daemon
    SuperDaemonInstance.close();
  }

  constructor() {
    super();
    this.__winEvents = {
      "can-redo-changed": "_redoChanged",
      "can-undo-changed": "_undoChanged",
      "haxcms-open-theme-preview-program": "_openThemePreviewFromProgram",
      "haxcms-open-page-revisions": "_openPageRevisionsFromEvent",
      "haxcms-docx-import-items": "_openImportHierarchyFromEvent",
      "haxcms-outline-import-request": "_selectFileForHierarchyImport",
      "hax-drop-focus-event": "_expandSettingsPanel",
      popstate: "_adminRoutePopState",
      "simple-modal-breadcrumb-click": "_simpleModalBreadcrumbClick",
      "simple-modal-closed": "_simpleModalClosed",
      "super-daemon-close": "sdCloseEvent",
      "super-daemon-konami-code": "_konamiCodeActivated",
    };
    this.rpgWalk = false;
    enableServices(["core", "haxcms"]);
    this.konamiCodeActivated = false; // Track if cheat codes are unlocked
    this.rpgHat = "none";
    this.userAvatarCode = "";
    this.darkMode = false;
    this.__editText = "Edit";
    this.userMenuOpen = false;
    this.siteMenuOpen = false;
    this.__menuHoverTimers = {};
    this.soundIcon = "";
    this.__disposer = this.__disposer || [];
    this.__currentAdminRoutePath = null;
    this.__themePreviewImporting = null;
    this.__appearancePreviewSelection = null;
    this.t = this.t || {};
    // defined up front since Merlin programs below read these while the
    // constructor is still running
    this.t = {
      ...this.t,
      uploadAFile: "Upload a file",
      createBlockFromLink: "Create block from Link",
      invalidUrlProvided: "Invalid URL provided",
      imageFromUrl: "Image from URL",
      linkAppliedToSelectedText: "Link applied to selected text!",
      urlProcessedSuccessfully: "URL processed successfully!",
      processing: "Processing",
      pageMediaUpdatedSuccessfully: "Page media updated successfully!",
      excelConvertedToTable: "Excel converted to table successfully!",
      excelConvertedToCsv: "Excel converted to CSV text!",
      errorConvertingExcelFile: "Error converting Excel file: {error}",
      unknownError: "Unknown error",
      errorProcessingExcelFile: "Error processing Excel file: {error}",
      noValidItemsFoundInImportResponse:
        "No valid items found in import response.",
      newPageDefaultTitle: "New page",
      pageCreatedSuccessfully: 'Page "{title}" created successfully!',
      childPageCreatedSuccessfully:
        'Child page "{title}" created successfully!',
      pageDuplicatedSuccessfully: 'Page "{title}" duplicated successfully!',
      templateApplied: "Template applied.",
      errorNoPageToMove: "Error: No page to move",
      errorPageNotFound: "Error: Page not found",
      rootLevel: "Root Level",
      pageMovedUnder: 'Page moved under "{parent}"',
      expectingToSeeAnOptionMerlinDidntProvide:
        "Expecting to see an option Merlin didn't provide?",
      makeASuggestionToImproveResults: "Make a suggestion to improve results",
      createAPage: "Create a page",
      typePageTitleToCreatePage: "Type page title to create page",
      createNewPage: "Create New Page",
      newPageCapitalized: "New Page",
      createTitleWithView: "Create {title} with view",
      createTitle: "Create {title}",
      createTemplateNamedTitle: "Create {template} named {title}",
      duplicateAsTitle: "Duplicate as {title}",
      errorMessage: "Error: {error}",
      movePage: "Move Page",
      typeToFilterPages: "Type to filter pages",
      errorNoPageSelectedToMove: "Error: No page selected to move",
      moveToRootLevel: "Move to Root Level",
      noMatchingPagesFound: "No matching pages found",
      newSiblingPageFromType: "New Sibling Page from {type}",
      newChildPageFromType: "New Child Page from {type}",
      createOutlineFromType: "Create outline from {type}",
      insertTypeContentsInPage: "Insert {type} contents in Page",
      embedTypeInPage: "Embed {type} in page",
      insertTypeInPage: "Insert {type} in page",
      insertTypeAsTable: "Insert {type} as table",
      insertTypeAsCsvText: "Insert {type} as CSV text",
      linkToTypeFile: "Link to {type} file",
      justUploadTypeFile: "Just Upload {type} file",
      embedSlideDeckInPage: "Embed slide deck in page",
      setAsTheMediaForTheActivePage: "Set as the media for the active page",
      pageCreatedNextToCurrent: "Page created next to current",
      pageCreatedUnderCurrent: "Page created under current",
      h1H2TagsCreateMenuPages: "H1,H2 tags create menu pages",
      contentConvertedToHtmlAndInserted:
        "Content converted to HTML and inserted",
      pdfEmbeddedInAFrameElement: "PDF embedded in a frame element",
      powerPointConvertedToSlideDeck:
        "PowerPoint converted to a slide-deck element",
      imageEmbeddedInPage: "Image embedded in page",
      imageSetAsPageMedia: "Image set as page media",
      videoEmbeddedInPage: "Video embedded in page",
      audioEmbeddedInPage: "Audio embedded in page",
      spreadsheetConvertedToHtmlTable: "Spreadsheet converted to HTML table",
      spreadsheetConvertedToCsvText: "Spreadsheet converted to CSV text",
      fileUploadedAndLinkedTo: "File uploaded and linked to",
      fileUploadedForLaterUse: "File uploaded for later use",
      watchMerlinWorkHisMagic: "Watch Merlin work his magic!",
      youtubeVideoEmbeddedInPage: "YouTube video embedded in page",
      kalturaMediaEmbeddedInPage: "Kaltura media embedded in page",
      imageFromUrlEmbeddedInPage: "Image from URL embedded in page",
      pdfDocumentEmbeddedInPage: "PDF document embedded in page",
      richLinkWithPreviewInserted: "Rich link with preview inserted",
      simpleHyperlinkInserted: "Simple hyperlink inserted",
      haxAutomaticallyDetectsBestElementType:
        "HAX automatically detects best element type",
      urlAppliedAsLinkToSelectedText: "URL applied as link to selected text",
      enterAnyUrlToSeeProcessingOptions:
        "Enter any URL to see processing options",
      embedYoutubeVideo: "Embed YouTube Video",
      embedKalturaMedia: "Embed Kaltura Media",
      insertImageFromUrl: "Insert Image from URL",
      embedPdfDocument: "Embed PDF Document",
      embedVideo: "Embed Video",
      insertAsRichLink: "Insert as Rich Link",
      insertAsSimpleLink: "Insert as Simple Link",
      useHaxDefaultProcessing: "Use HAX Default Processing",
      applyLinkToSelectedText: 'Apply Link to Selected Text: "{text}"',
      pasteUrlInSearchBoxAboveAndPressEnter:
        "Paste URL in search box above and press Enter",
      userMenuFor: "User menu for {name}",
      customizeCharacter: "Customize character",
      myLearning: "My learning",
      toggleSoundEffectsOff: "Toggle sound effects off",
      toggleSoundEffectsOn: "Toggle sound effects on",
      soundEffects: "Sound effects",
      soundOffToast: "Sound off.. hey.. HELLO!?!",
      soundOnToast: "Can you hear me now? Good.",
      adminSection: "Admin - {section}",
      appearance: "Appearance",
      themePreview: "Theme Preview",
      details: "Details",
      editor: "Editor",
      features: "Features",
      importExport: "Import / Export",
      darkModeToggle: "Dark Mode Toggle",
      soundToggle: "Sound Toggle",
      loadComponentSchema: "Load component schema",
      editThisPage: "Edit this page",
      createANewPage: "Create a new page",
      editSiteOutline: "Edit site outline",
      changeSiteSettings: "Change site settings",
      dontShowThisWelcomeAgain: "Don't show this welcome again",
      showGettingStartedTasks: "Show getting started tasks",
      previewAudienceMode: "Preview audience mode",
      changePlatformAudienceDescription:
        "Change platform audience just for the current browsing session",
      haxLabs: "HAX Labs",
      unlockAllThemes: "Unlock all themes",
      pageDataFormats: "Page data formats",
      switchToAnotherSite: "Switch to another site",
      printOptions: "Print options",
      exportThisPage: "Export this page",
      exportThisSite: "Export this site",
      viewOnlyMode: "View only mode",
      viewOnlyModeDescription:
        "Enable view only mode to hide all editing tools and experience the site as a visitor would see it",
      renameThisPage: "Rename this page",
      updatePageDescription: "Update page description",
      updatePageUrlSlug: "Update page URL (slug)",
      updatePageTags: "Update page tags",
      updatePageIcon: "Update page icon",
      viewPageRevisions: "View page revisions",
      openAPageInThisSite: "Open a page in this site",
      shareCurrentPageLink: "Share current page link",
      insertALinkToAPage: "Insert a link to a page",
      viewKeyboardShortcuts: "View keyboard shortcuts",
      enterNewTitle: "Enter new title",
      enterNewDescription: "Enter new description",
      enterNewSlug: "Enter new slug (URL path)",
      enterTagsSeparatedByCommas: "Enter tags separated by commas",
      typeToSearchIconsByName: "Type to search icons by name",
      openRevisionHistoryForCurrentPage:
        "Open revision history for the current page",
      noActivePageSelected: "No active page selected",
      noActivePage: "No active page",
      openRevisionsFor: "Open revisions for {title}",
      currentPageLower: "current page",
      allThemesUnlockedSpeech:
        "All terrible, hidden and legacy themes unlocked. You must choose, but choose wisely.",
      welcomeProgramDismissed:
        "Welcome program dismissed. You can always access Merlin by pressing Alt+Shift or clicking the search bar.",
      noActivePageFound: "No active page found",
      noActivePageFoundToShare: "No active page found to share",
      linkCopiedFor: "Link copied for {title}",
      unableToCopyAutomatically:
        "Unable to copy automatically. Open Merlin to view the share link.",
      shortcutSavePageAndExitEditMode: "Save page and exit edit mode",
      shortcutEnterEditMode: "Enter edit mode",
      shortcutCancelEditing: "Cancel editing",
      shortcutViewSourceOrEditPage: "View source (edit) / Edit page (view)",
      shortcutPageStructureOrPageActions:
        "Page structure (edit) / Page actions (view)",
      shortcutBlocksBrowserOrAddPage: "Blocks browser (edit) / Add page (view)",
      shortcutConfigurePanelOrOutlineActions:
        "Configure panel (edit) / Site outline actions (view)",
      shortcutOpenSiteOutlineDesigner: "Open site outline designer",
      shortcutOpenSiteSettingsMenu: "Open site settings menu",
      shortcutOpenUserMenu: "Open user menu",
      shortcutJumpBetweenTextAndTray:
        "Jump between text editing and tray options",
      pageLockedCannotEdit:
        "This page is locked. Click the lock button to unlock it before editing.",
      saveBeforeLeavingSourceEditor: "Save before leaving source editor?",
      admin: "Admin",
      revisions: "Revisions",
      pageRevisions: "Page revisions",
      pageRevisionsFor: "Page revisions — {title}",
      pageHistory: "Page history",
      ok: "OK",
      discardUnsavedChanges: "Discard unsaved changes?",
      thisPage: "This page",
      deletePageConfirmMessage:
        '"{title}" will be removed from the outline but its content stays on the file system.',
      permanentlyDeleteThisPage: "Permanently delete this page?",
      enterTitleForDuplicatedPage: "Enter title for duplicated page:",
      duplicatePageTitle: "Duplicate page",
      duplicateAction: "Duplicate",
      newPageTitle: "Title",
      importFromUrlTitle: "Import from a URL",
      urlLabel: "URL",
      titleCopy: "{title} (copy)",
      importLabel: "Import",
      pasteUrlToImport: "Paste URL to import:",
      cheatCodesUnlocked:
        "🎮 Cheat codes unlocked! Check Merlin for new programs.",
      failedToUnlockCheatCodes: "🎮 Failed to unlock cheat codes",
      platformSettings: "Platform settings",
      selectFileEllipsis: "Select file..",
    };
    this._configureWasFocused = false; // Track toggle state for Ctrl+Shift+4
    this.__themePreviewReady = false;
    this.themePreviewOpen = false;
    this.themePreviewCollapsed = false;

    // default sub-contexts for Merlin before platform filtering
    this.platformContexts = {
      cms: ["addPage", "admin"],
      global: ["uploadMedia", "community"],
    };
    // track if site editor is using the initial version of platformConfig
    this.__initialPlatformConfig = true;
    this.__dragCounter = 0;

    // allow commands to go through at any time
    // hax-store default is only when editor is open to avoid conflicts w/ other UX
    SuperDaemonInstance.allowedCallback = () => {
      return true;
    };
    SuperDaemonInstance.keyHandlerCallback = () => {
      const merlin = this.shadowRoot.querySelector("#merlin");
      store.playSound("click");
      // modal shouldn't be possible but just in-case
      if (merlin.getAttribute("data-event") === "super-daemon-modal") {
        HAXStore.haxTray.collapsed = false;
      } else {
        SuperDaemonInstance.mini = true;
        SuperDaemonInstance.wand = true;
        SuperDaemonInstance.activeNode =
          this.shadowRoot.querySelector("#merlin");
      }
      SuperDaemonInstance.runProgram("", "*");
      return true;
    };
    // nothing message so we can suggest a link to make a suggestion
    SuperDaemonInstance.noResultsSlot = () => {
      return html`<div class="no-results">
          ${this.t.expectingToSeeAnOptionMerlinDidntProvide}
        </div>
        <a
          @click="${(_e) => {
            HAXStore._haxStoreContribute(
              "merlin",
              "POP,enhancement",
              SuperDaemonInstance.commandContext +
                " " +
                SuperDaemonInstance.value,
            );
          }}"
          >${this.t.makeASuggestionToImproveResults}</a
        >`;
    };
    SuperDaemonInstance.appendContext("CMS");
    this.platformContexts.global.forEach((item) =>
      SuperDaemonInstance.appendContext(item),
    );
    // Unified page creation program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "createAPage",
        "value.placeholder": "typePageTitleToCreatePage",
      },
      title: this.t.createAPage,
      icon: "hax:add-page",
      priority: -2000,
      tags: ["page", "add", "create", "new", "CMS"],
      // Links this Merlin option to the Ctrl+Shift+3 (cms-add-page) binding
      // registered in _registerKeyboardShortcuts via the shared shortcut
      // registry so the row renders the shortcut chip.
      shortcut: "cms-add-page",
      eventName: "super-daemon-run-program",
      path: "CMS/action/add/page",
      context: "addPage",
      value: {
        name: "create-page",
        machineName: "create-page",
        placeholder: this.t.typePageTitleToCreatePage,
        program: async (input, values) => {
          // Get reference to site editor UI regardless of how program was accessed
          const siteEditorUI =
            globalThis.document.querySelector("haxcms-site-editor-ui") || this;
          const currentItem = toJS(store.activeItem);
          const createType = values && values.type ? values.type : "sibling";
          const templateContent =
            values && values.templateContent ? values.templateContent : null;

          // If no input provided, show default page creation option to match prior UX
          if (!input || input.trim() === "") {
            return [
              {
                title: this.t.createNewPage,
                icon: "hax:add-page",
                tags: ["page", "blank", "create"],
                value: {
                  target: siteEditorUI,
                  method: "createPageWithTitle",
                  args: [
                    this.t.newPageCapitalized,
                    createType,
                    templateContent,
                  ],
                },
                eventName: "super-daemon-element-method",
                path: "CMS/action/create/page",
              },
            ];
          }

          const title = input.trim();

          try {
            // Get available page templates
            const pageTemplates = await siteEditorUI.getPageTemplates();
            const results = [];

            // Add blank page option first
            results.push({
              title: templateContent
                ? this.t.createTitleWithView.replace("{title}", () => title)
                : this.t.createTitle.replace("{title}", () => title),
              icon: "hax:add-page",
              tags: ["page", "blank", "create"],
              value: {
                target: siteEditorUI,
                method: "createPageWithTitle",
                args: [title, createType, templateContent],
              },
              eventName: "super-daemon-element-method",
              path: "CMS/action/create/page/blank",
            });

            // Add template options if templates are available
            if (pageTemplates && pageTemplates.length > 0) {
              pageTemplates.forEach((template, _index) => {
                results.push({
                  title: this.t.createTemplateNamedTitle
                    .replace("{template}", () => template.name)
                    .replace("{title}", () => title),
                  icon: "hax:templates",
                  tags: ["template", "page", "create"],
                  value: {
                    target: siteEditorUI,
                    method: "createPageWithTitle",
                    args: [
                      title,
                      createType,
                      templateContent || template.content,
                    ],
                  },
                  eventName: "super-daemon-element-method",
                  path: `CMS/action/create/page/template/${template.id}`,
                });
              });
            }

            // Add duplicate current page option
            if (currentItem) {
              results.push({
                title: this.t.duplicateAsTitle.replace("{title}", () => title),
                icon: "hax:duplicate",
                tags: ["page", "duplicate", "create"],
                value: {
                  target: siteEditorUI,
                  method: "createPageWithTitle",
                  args: [title, "duplicate"],
                },
                eventName: "super-daemon-element-method",
                path: "CMS/action/create/page/duplicate",
              });
            }

            return results;
          } catch (error) {
            console.error("Error in create-page program:", error);
            return [
              {
                title: this.t.errorMessage.replace(
                  "{error}",
                  () => error.message,
                ),
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: "Error occurred",
              },
            ];
          }
        },
      },
    });

    // Move Page program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "movePage",
        "value.placeholder": "typeToFilterPages",
      },
      title: this.t.movePage,
      icon: "icons:open-with",
      priority: 0,
      tags: ["page", "move", "relocate", "parent", "CMS"],
      eventName: "super-daemon-run-program",
      path: "CMS/action/move/page",
      context: ["CMS"],
      value: {
        name: "move-page",
        machineName: "move-page",
        placeholder: this.t.typeToFilterPages,
        program: async (input, values) => {
          // Get pageId from values or fall back to active item
          const pageId =
            values.pageId || (store.activeItem ? store.activeItem.id : null);
          if (!pageId) {
            return [
              {
                title: this.t.errorNoPageSelectedToMove,
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: "Error occurred",
              },
            ];
          }

          // Get the page being moved
          const pageToMove = await store.findItem(pageId);
          if (!pageToMove) {
            return [
              {
                title: this.t.errorPageNotFound,
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: "Error occurred",
              },
            ];
          }

          // Get all pages in the site
          const itemManifest = store.getManifestItems(true);
          const results = [];

          // Filter search input
          const searchTerm = input ? input.toLowerCase().trim() : "";

          // Add option to move to root level
          if (
            !searchTerm ||
            searchTerm.includes("root") ||
            searchTerm.includes("top") ||
            searchTerm.includes("level")
          ) {
            results.push({
              title: this.t.moveToRootLevel,
              icon: "hax:site-map",
              tags: ["root", "top", "level"],
              value: {
                target: globalThis.document.querySelector(
                  "haxcms-site-editor-ui",
                ),
                method: "movePageUnderParent",
                args: [pageId, null],
              },
              eventName: "super-daemon-element-method",
              path: "CMS/action/move/page/root",
            });
          }

          // Filter and display pages as potential parents
          itemManifest.forEach((item) => {
            // Don't allow moving under itself or its children
            if (item.id === pageId) {
              return;
            }

            // Check if this item is a child of the page being moved
            let isChild = false;
            let checkItem = item;
            while (checkItem && checkItem.parent) {
              if (checkItem.parent === pageId) {
                isChild = true;
                break;
              }
              checkItem = itemManifest.find((i) => i.id === checkItem.parent);
            }
            if (isChild) {
              return;
            }

            // Apply search filter
            if (searchTerm && !item.title.toLowerCase().includes(searchTerm)) {
              return;
            }

            // Calculate indentation to show hierarchy
            let itemBuilder = item;
            let distance = "";
            while (itemBuilder && itemBuilder.parent != null) {
              itemBuilder = itemManifest.find(
                (i) => i.id === itemBuilder.parent,
              );
              if (itemBuilder) {
                distance = "--" + distance;
              }
            }

            results.push({
              title: `${distance}${distance ? " " : ""}${item.title}`,
              icon: "hax:add-child-page",
              tags: ["move", "parent"],
              value: {
                target: globalThis.document.querySelector(
                  "haxcms-site-editor-ui",
                ),
                method: "movePageUnderParent",
                args: [pageId, item.id],
              },
              eventName: "super-daemon-element-method",
              path: `CMS/action/move/page/${item.id}`,
            });
          });

          if (results.length === 0) {
            return [
              {
                title: this.t.noMatchingPagesFound,
                icon: "icons:search",
                tags: ["empty"],
                value: { disabled: true },
                eventName: "disabled",
                path: "No results",
              },
            ];
          }

          return results;
        },
      },
    });

    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "uploadAFile",
        "value.name": "uploadAFile",
      },
      title: this.t.uploadAFile,
      icon: "icons:file-upload",
      priority: -10000,
      tags: ["Agent", "help", "merlin"],
      eventName: "super-daemon-run-program",
      path: "HAX/agent",
      context: "uploadMedia",
      inline: true,
      value: {
        name: this.t.uploadAFile,
        machineName: "hax-agent",
        program: async (input, values) => {
          const usAction = toJS(UserScaffoldInstance.action);
          const usMemory = toJS(UserScaffoldInstance.memory);
          const usData = toJS(UserScaffoldInstance.data);
          let results = [];
          // file selected, so we are looping back around
          if (values.operation === "file-selected") {
            switch (values.type) {
              case "pdf":
              case "md":
              case "docx":
              case "doc":
              case "pptx":
              case "txt":
              case "html":
              case "htm":
                // only show options to make new content if we are NOT in edit mode
                if (!usMemory.editMode) {
                  results.push({
                    title: this.t.newSiblingPageFromType.replace(
                      "{type}",
                      () => values.type,
                    ),
                    icon: "hax:add-page",
                    tags: ["agent"],
                    value: {
                      target: this,
                      method: "processFileContentsBasedOnUserDesire",
                      args: [values, "create-sibling"],
                    },
                    eventName: "super-daemon-element-method",
                    path: this.t.pageCreatedNextToCurrent,
                  });
                  results.push({
                    title: this.t.newChildPageFromType.replace(
                      "{type}",
                      () => values.type,
                    ),
                    icon: "hax:add-child-page",
                    tags: ["agent"],
                    value: {
                      target: this,
                      method: "processFileContentsBasedOnUserDesire",
                      args: [values, "create-child"],
                    },
                    eventName: "super-daemon-element-method",
                    path: this.t.pageCreatedUnderCurrent,
                  });
                  if (
                    ["docx", "doc", "pdf", "pptx", "html", "htm"].includes(
                      values.type,
                    )
                  ) {
                    results.push({
                      title: this.t.createOutlineFromType.replace(
                        "{type}",
                        () => values.type,
                      ),
                      icon: "hax:site-map",
                      tags: ["agent"],
                      value: {
                        target: this,
                        method: "processFileContentsBasedOnUserDesire",
                        args: [values, "create-branch"],
                      },
                      eventName: "super-daemon-element-method",
                      path: this.t.h1H2TagsCreateMenuPages,
                    });
                  }
                }
                results.push({
                  title: this.t.insertTypeContentsInPage.replace(
                    "{type}",
                    () => values.type,
                  ),
                  icon: "hax:html-code",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-html"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.contentConvertedToHtmlAndInserted,
                });
                if (values.type === "pdf") {
                  results.push({
                    title: this.t.embedTypeInPage.replace(
                      "{type}",
                      () => values.type,
                    ),
                    icon: "hax:file-pdf",
                    tags: ["agent"],
                    value: {
                      target: this,
                      method: "processFileContentsBasedOnUserDesire",
                      args: [values, "insert-file", "pdf"],
                    },
                    eventName: "super-daemon-element-method",
                    path: this.t.pdfEmbeddedInAFrameElement,
                  });
                }
                if (values.type === "pptx") {
                  // surface this as the top option since it's the most
                  // common desire when uploading a pptx via Merlin
                  results.unshift({
                    title: this.t.embedSlideDeckInPage,
                    icon: "image:slideshow",
                    tags: ["agent"],
                    value: {
                      target: this,
                      method: "processFileContentsBasedOnUserDesire",
                      args: [values, "insert-file", "pptx"],
                    },
                    eventName: "super-daemon-element-method",
                    path: this.t.powerPointConvertedToSlideDeck,
                  });
                }
                break;
              case "png":
              case "jpeg":
              case "gif":
              case "jpg":
                results.push({
                  title: this.t.insertTypeInPage.replace(
                    "{type}",
                    () => values.type,
                  ),
                  icon: "editor:insert-photo",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "image"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.imageEmbeddedInPage,
                });
                results.push({
                  title: this.t.setAsTheMediaForTheActivePage,
                  icon: "image:photo-library",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "set-page-media", "image"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.imageSetAsPageMedia,
                });
                break;
              case "mp4":
                results.push({
                  title: this.t.insertTypeInPage.replace(
                    "{type}",
                    () => values.type,
                  ),
                  icon: "av:play-circle-filled",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "video"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.videoEmbeddedInPage,
                });
                break;
              case "midi":
              case "mid":
              case "mp3":
                results.push({
                  title: this.t.insertTypeInPage.replace(
                    "{type}",
                    () => values.type,
                  ),
                  icon: "av:volume-up",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "audio"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.audioEmbeddedInPage,
                });
                break;
              case "xlsx":
              case "xls":
              case "ods":
                results.push({
                  title: this.t.insertTypeAsTable.replace(
                    "{type}",
                    () => values.type,
                  ),
                  icon: "editor:border-all",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-table"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.spreadsheetConvertedToHtmlTable,
                });
                results.push({
                  title: this.t.insertTypeAsCsvText.replace(
                    "{type}",
                    () => values.type,
                  ),
                  icon: "hax:code",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-csv"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.spreadsheetConvertedToCsvText,
                });
                break;
              default:
                // go run the hax hooks to see if any web components supply
                // a way of handling material that is of that file type
                break;
            }
            results.push({
              title: this.t.linkToTypeFile.replace("{type}", () => values.type),
              icon: "editor:insert-link",
              tags: ["agent"],
              value: {
                target: this,
                method: "processFileContentsBasedOnUserDesire",
                args: [values, "link", "link"],
              },
              eventName: "super-daemon-element-method",
              path: this.t.fileUploadedAndLinkedTo,
            });
            results.push({
              title: this.t.justUploadTypeFile.replace(
                "{type}",
                () => values.type,
              ),
              icon: "file-upload",
              tags: ["agent"],
              value: {
                target: this,
                method: "processFileContentsBasedOnUserDesire",
                args: [values, "upload", "upload-only"],
              },
              eventName: "super-daemon-element-method",
              path: this.t.fileUploadedForLaterUse,
            });
          } else if (usAction.type === "drop" && values.type === "drop") {
            const file = usData.file;
            const contents = await file.text();
            let tmp = file.name.split(".");
            let type = "";
            // don't assume there is a file extension
            if (tmp.length > 1) {
              type = tmp.pop().toLowerCase();
            }
            // wand hands off for next part now that we've got a file selected
            SuperDaemonInstance.waveWand(
              [
                "",
                "/",
                {
                  operation: "file-selected",
                  contents: contents,
                  data: file,
                  type: type,
                },
                "hax-agent",
                this.t.uploadAFile,
              ],
              this.shadowRoot.querySelector("#merlin"),
              "coin2",
            );
          }
          // default actions when we have no context
          else {
            results = [
              {
                title: this.t.selectFileEllipsis,
                icon: "folder-open",
                tags: ["agent"],
                value: {
                  target: this,
                  method: "selectFileToProcess",
                  args: [],
                },
                eventName: "super-daemon-element-method",
                path: this.t.watchMerlinWorkHisMagic,
              },
            ];
            // this forces it to just happen
            // and can be disabled later if we obtain different magic file operations
            this.selectFileToProcess();
            /*
            results = [
              {
                title: "URL with page title",
                icon: "hax:hax2022",
                tags: ["agent"],
                value: {
                  target: this,
                  method: "insertUrl",
                  args: [input, true],
                },
                eventName: "super-daemon-element-method",
                path: "HAX/agent/insert",
              },
              {
                title: "Insert url alone",
                icon: "hax:hax2022",
                tags: ["agent"],
                value: {
                  target: this,
                  method: "insertUrl",
                  args: [input, false],
                },
                eventName: "super-daemon-element-method",
                path: "HAX/agent/insert",
              },
            ];
            */
          }
          return results;
        },
      },
    });

    // Add Magic Link Wand program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "createBlockFromLink",
        "value.name": "createBlockFromLink",
      },
      title: this.t.createBlockFromLink,
      icon: "editor:insert-link",
      priority: -9999,
      tags: ["Agent", "help", "merlin", "url", "link"],
      eventName: "super-daemon-run-program",
      path: "CMS/action/link-agent",
      context: ["CMS"],
      inline: true,
      value: {
        name: this.t.createBlockFromLink,
        machineName: "hax-link-agent",
        program: async (input, values) => {
          const usAction = toJS(UserScaffoldInstance.action);
          toJS(UserScaffoldInstance.memory);
          const usData = toJS(UserScaffoldInstance.data);
          let results = [];

          // URL selected/entered, so we are processing it
          if (values.operation === "url-selected") {
            const url = values.url;
            const urlType = this.detectUrlType(url);

            switch (urlType) {
              case "youtube":
                results.push({
                  title: this.t.embedYoutubeVideo,
                  icon: "av:play-circle-filled",
                  tags: ["agent", "video"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-youtube"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.youtubeVideoEmbeddedInPage,
                });
                break;

              case "kaltura":
                results.push({
                  title: this.t.embedKalturaMedia,
                  icon: "av:play-circle-filled",
                  tags: ["agent", "video", "kaltura", "mediaspace"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-kaltura"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.kalturaMediaEmbeddedInPage,
                });
                break;

              case "image":
                results.push({
                  title: this.t.insertImageFromUrl,
                  icon: "editor:insert-photo",
                  tags: ["agent", "image"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "insert-image"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.imageFromUrlEmbeddedInPage,
                });
                break;

              case "pdf":
                results.push({
                  title: this.t.embedPdfDocument,
                  icon: "hax:file-pdf",
                  tags: ["agent", "document"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-pdf"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.pdfDocumentEmbeddedInPage,
                });
                break;

              case "video":
                results.push({
                  title: this.t.embedVideo,
                  icon: "av:videocam",
                  tags: ["agent", "video"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-video"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.videoEmbeddedInPage,
                });
                break;

              default:
                // Generic URL handling
                results.push({
                  title: this.t.insertAsRichLink,
                  icon: "editor:insert-link",
                  tags: ["agent", "link"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "insert-rich-link"],
                  },
                  eventName: "super-daemon-element-method",
                  path: this.t.richLinkWithPreviewInserted,
                });
                break;
            }

            // Always provide option to insert as simple link
            results.push({
              title: this.t.insertAsSimpleLink,
              icon: "editor:insert-link",
              tags: ["agent", "link"],
              value: {
                target: this,
                method: "processUrlContentsBasedOnUserDesire",
                args: [values, "insert-simple-link"],
              },
              eventName: "super-daemon-element-method",
              path: this.t.simpleHyperlinkInserted,
            });

            // Add HAX default processing option for compatibility with existing behavior
            results.push({
              title: this.t.useHaxDefaultProcessing,
              icon: "hax:hax2022",
              tags: ["agent", "hax", "auto"],
              value: {
                target: this,
                method: "processUrlContentsBasedOnUserDesire",
                args: [values, "hax-default"],
              },
              eventName: "super-daemon-element-method",
              path: this.t.haxAutomaticallyDetectsBestElementType,
            });

            // Add option to apply link to selected text if there's a selection
            const sel = globalThis.getSelection && globalThis.getSelection();
            if (sel && !sel.isCollapsed && sel.toString().trim()) {
              results.push({
                title: this.t.applyLinkToSelectedText.replace(
                  "{text}",
                  () =>
                    `${sel.toString().trim().substring(0, 30)}${sel.toString().trim().length > 30 ? "..." : ""}`,
                ),
                icon: "editor:format-color-text",
                tags: ["agent", "link", "selection"],
                value: {
                  target: this,
                  method: "processUrlContentsBasedOnUserDesire",
                  args: [values, "apply-to-selected-text"],
                },
                eventName: "super-daemon-element-method",
                path: this.t.urlAppliedAsLinkToSelectedText,
              });
            }
          } else if (usAction.type === "paste" && values.type === "paste") {
            // Handle paste detection
            const pastedText = usData.text;
            if (this.isValidUrl(pastedText)) {
              // wand hands off for next part now that we've got a URL detected
              SuperDaemonInstance.waveWand(
                [
                  "",
                  "/",
                  {
                    operation: "url-selected",
                    url: pastedText.trim(),
                    data: pastedText,
                  },
                  "hax-link-agent",
                  this.t.createBlockFromLink,
                ],
                this.shadowRoot.querySelector("#merlin"),
                "coin2",
              );
            }
          } else {
            // Check if user entered a URL in the search input
            if (input && this.isValidUrl(input.trim())) {
              // Process the URL directly from input
              this.processUrlFromInput(input);
              return [];
            }
            // Default actions when we have no context - just show instructions
            results = [
              {
                title: this.t.pasteUrlInSearchBoxAboveAndPressEnter,
                icon: "editor:insert-link",
                tags: ["agent", "link", "instruction"],
                value: {},
                eventName: "super-daemon-noop",
                path: this.t.enterAnyUrlToSeeProcessingOptions,
              },
            ];
          }
          return results;
        },
      },
    });
    if (HAXStore.ready) {
      // links need to be given support for internal linkage updates on the form
      if (!HAXStore.primativeHooks.a) {
        HAXStore.primativeHooks.a = {};
      }
      HAXStore.primativeHooks.a.setupActiveElementForm = (_props) => {
        const itemManifest = store.getManifestItems(true);
        // default to null parent as the whole site
        let items = [
          {
            text: `-- ${this.t.selectPage} --`,
            value: null,
          },
        ];
        itemManifest.forEach((el) => {
          if (el.id != this.itemId) {
            // calculate -- depth so it looks like a tree
            let itemBuilder = el;
            // walk back through parent tree
            let distance = "- ";
            while (itemBuilder && itemBuilder.parent != null) {
              itemBuilder = itemManifest.find(
                (i) => i.id == itemBuilder.parent,
              );
              // double check structure is sound
              if (itemBuilder) {
                distance = "--" + distance;
              }
            }
            items.push({
              text: distance + el.title,
              value: el.id,
            });
          }
        });
      };
    }
    this.t = {
      ...this.t,
      selectPage: "Select page",
      siteDashboard: "Sites Dashboard",
      cancel: "Cancel",
      unsavedPageChangesWillBeLost:
        "Your unsaved changes to this page will be lost.",
      discardChanges: "Discard changes",
      keepEditing: "Keep editing",
      editDetails: "Page details",
      add: "Add",
      source: "Source",
      viewSource: "Source",
      confirmHtmlSourceExit:
        "HTML source changes will not be saved without pressing the `Update HTML` button. Save without HTML code editor changes?",
      findMedia: "Media",
      undo: "Undo",
      redo: "Redo",
      media: "Media",
      outline: "Outline",
      blocks: "Blocks",
      addBlock: "Blocks",
      addPage: "Add page",
      addChildPage: "Add child page",
      clonePage: "Clone page",
      delete: "Delete page",
      siteSettings: "Site Settings",
      siteMenu: "Site settings quick links",
      siteMenuDashboard: "Dashboard",
      siteMenuContent: "Content",
      siteMenuStructure: "Structure",
      siteMenuFiles: "Files",
      siteMenuAppearance: "Appearance",
      siteMenuDashboardDescription:
        "How this site is doing and what to fix next",
      siteMenuContentDescription: "Search, filter and replace across pages",
      siteMenuStructureDescription: "Add, reorder and nest pages",
      siteMenuFilesDescription: "Uploads and media",
      siteMenuAppearanceDescription: "Theme, colors and regions",
      about: "About",
      themeSettings: "Theme Settings",
      seoSettings: "SEO Settings",
      authorSettings: "Author Settings",
      styleGuide: "Style Guide",
      close: "Close",
      settings: "Settings",
      edit: "Edit",
      configureBlock: "Configure",
      configure: "Configure",
      save: "Save",
      saveAndEdit: "Save & Edit",
      unlockPage: "Unlock page",
      accountInfo: "Account Info",
      outlineDesigner: "Site Outline",
      pageOutline: "Structure",
      more: "More",
      pageActions: "Page actions",
      reports: "Reports",
      dashboard: "Dashboard",
      merlin: "Merlin",
      summonMerlin: "Summon Merlin",
      logOut: "Log out",
      menu: "Menu",
      showMore: "More",
      contentImported: "Content imported!",
      content: "Content",
      files: "Files",
      views: "Views",
    };
    // falls back to this.t.siteDashboard in render so it can be translated
    this.backText = null;
    this.merlinPhoneOpen = false;
    this.painting = true;
    this.pageAllowed = false;
    this.editMode = false;
    this.__editIcon = "icons:create";
    this.manifestEditMode = false;
    this.backLink = "../../";
    this.activeTagName = "";
    this.activeNode = null;
    this.activeDrag = false;
    this.activeType = null;
    this.__haxcmsButtonAddReady = false;
    this.__haxcmsButtonAddImporting = false;
    if (globalThis.appSettings && globalThis.appSettings.backLink) {
      this.backLink = globalThis.appSettings.backLink;
    }
    autorun(() => {
      const _mobx_val_0 = toJS(store.isLoggedIn);
      Promise.resolve().then(() => {
        const isLoggedIn = _mobx_val_0;
        if (isLoggedIn) {
          this._ensureHaxcmsButtonAddLoaded();
        }
        UserScaffoldInstance.writeMemory("isLoggedIn", this.isLoggedIn);
        const tstamp = Math.floor(Date.now() / 1000);

        if (isLoggedIn && !this.loggedInTime) {
          this.displayConsoleWarning();
          this.loggedInTime = tstamp;
          let ll = UserScaffoldInstance.readMemory("recentLogins");
          if (!ll) {
            UserScaffoldInstance.writeMemory("recentLogins", [tstamp], "long");
          } else if (ll) {
            // cap at last 5 login times
            if (ll.length < 5) {
              ll.shift();
            }
            ll.push(tstamp);
            UserScaffoldInstance.writeMemory("recentLogins", ll, "long");
          }
        }
      });
    });
    // user scaffolding to superDaemon
    autorun(() => {
      const _mobx_val_0 = toJS(UserScaffoldInstance.memory);
      const _mobx_val_1 = toJS(UserScaffoldInstance.action);
      const _mobx_val_2 = toJS(UserScaffoldInstance.data.value);
      Promise.resolve().then(() => {
        const memory = _mobx_val_0;
        const usAction = _mobx_val_1;
        // try to pulse edit / merlin if they are here and don't do anything...
        if (
          memory.editMode === false &&
          memory.interactionDelay >= 3600 &&
          usAction.type === null &&
          store.cmsSiteEditor.haxCmsSiteEditorUIElement &&
          store.cmsSiteEditor.haxCmsSiteEditorUIElement.shadowRoot
        ) {
          // small delay so the pulse is noticed after first paint
          setTimeout(() => {
            const editbtn =
              store.cmsSiteEditor.haxCmsSiteEditorUIElement.shadowRoot.querySelector(
                "#editbutton",
              );
            editbtn.dataPulse = "1";
          }, 300);
        }
        // try to evaluate typing in merlin
        if (
          UserScaffoldInstance.active &&
          UserScaffoldInstance.memory.isLoggedIn &&
          UserScaffoldInstance.memory.recentTarget === SuperDaemonInstance &&
          SuperDaemonInstance.programName === null &&
          UserScaffoldInstance.memory.interactionDelay > 600 &&
          ["paste", "key"].includes(usAction.type)
        ) {
          if (validURL(SuperDaemonInstance.value)) {
            SuperDaemonInstance.waveWand(
              [
                SuperDaemonInstance.value,
                "/",
                {},
                "hax-agent",
                this.t.uploadAFile,
              ],
              null,
              "coin2",
            );
          }
        } else if (
          UserScaffoldInstance.active &&
          UserScaffoldInstance.memory.isLoggedIn &&
          SuperDaemonInstance.programName === null &&
          ["paste"].includes(usAction.type) &&
          UserScaffoldInstance.data.architype == "url"
        ) {
          SuperDaemonInstance.waveWand(
            [_mobx_val_2, "/", {}, "hax-agent", this.t.uploadAFile],
            null,
            "coin2",
          );
        }
      });
    });
    // user scaffolding to superDaemon
    autorun(() => {
      const _mobx_val_0 = toJS(UserScaffoldInstance.action);
      const _mobx_val_1 = toJS(UserScaffoldInstance.data);
      Promise.resolve().then(() => {
        const usAction = _mobx_val_0;
        const usData = _mobx_val_1;
        // try to evaluate typing in merlin
        if (
          UserScaffoldInstance.active &&
          UserScaffoldInstance.memory.isLoggedIn &&
          SuperDaemonInstance.programName === null &&
          usAction.type === "drag" &&
          usData.architype === "file"
        ) {
          this.activeDrag = true;
          this.activeType = usData.value || usData.architype;
        } else if (
          UserScaffoldInstance.active &&
          UserScaffoldInstance.memory.isLoggedIn &&
          SuperDaemonInstance.programName === null &&
          usAction.type === "dragleave"
        ) {
          this.activeDrag = false;
          this.activeType = null;
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeGizmo);
      Promise.resolve().then(() => {
        const activeGizmo = _mobx_val_0;
        if (activeGizmo && activeGizmo.title) {
          this.activeTagName = activeGizmo.title;
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeNode);
      Promise.resolve().then(() => {
        this.activeNode = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.badDevice);
      Promise.resolve().then(() => {
        const badDevice = _mobx_val_0;
        // good device, we can inject font we use
        if (badDevice === true) {
          globalThis.document.body.classList.add("bad-device");
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.darkMode);
      const _mobx_val_1 = toJS(store.darkMode);
      Promise.resolve().then(() => {
        this.darkMode = _mobx_val_0;
        this.dark = this.darkMode;
        if (_mobx_val_1) {
          SuperDaemonInstance.dark = true;
          SuperDaemonInstance.toastInstance.darkMode = true;
          HAXStore.globalPreferences.haxUiTheme = "haxdark";
        } else {
          HAXStore.globalPreferences.haxUiTheme = "hax";
          SuperDaemonInstance.dark = false;
          SuperDaemonInstance.toastInstance.darkMode = false;
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.soundStatus);
      Promise.resolve().then(() => {
        this.soundIcon = _mobx_val_0
          ? new URL(
              "../../../app-hax/lib/assets/images/FullVolume.svg",
              import.meta.url,
            ).href
          : new URL(
              "../../../app-hax/lib/assets/images/Silence.svg",
              import.meta.url,
            ).href;
      });
    });
    setTimeout(() => {
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js"
      );
    }, 0);
  }
  displayConsoleWarning() {
    setTimeout(() => {
      const headStyle =
        "color: white; padding: 10px; font-weight: bold; font-size: 5em;font-family: arial; background-color: darkred; border: 5px solid white; border: 5px solid white;";
      const bodyStyle =
        "font-size: 1.5em; font-family: arial; color: white; background-color: darkred; padding: 10px";
      console.warn("%c⚠️STOP⚠️", headStyle);
      console.warn(
        "%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a hidden feature, it is likely a scam and could give them access to your account.",
        bodyStyle,
      );
    }, 3500);
  }
  soundToggle() {
    const status = !toJS(store.soundStatus);
    store.soundStatus = status;
    localStorageSet("app-hax-soundStatus", status);
    if (!status) {
      store.toast(this.t.soundOffToast, 2000, { fire: true });
    } else {
      store.toast(this.t.soundOnToast, 2000, { hat: "random" });
      store.playSound("click");
    }
  }

  closeMenu() {
    this.userMenuOpen = false;
  }
  _userMenuOpenChanged(e) {
    if (!e || !e.detail || typeof e.detail.value !== "boolean") {
      return;
    }
    if (this.userMenuOpen !== e.detail.value) {
      this.userMenuOpen = e.detail.value;
    }
  }

  toggleMenu() {
    // hover already opened it: the click that follows keeps it open
    if (this.userMenuOpen && this.__userMenuHoverOpened) {
      this.__userMenuHoverOpened = false;
      return;
    }
    this.__userMenuHoverOpened = false;
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.siteMenuOpen = false;
    }
    store.playSound("click");
  }
  /**
   * The site settings quick links under the house, in the order the admin
   * launcher shows its primary sections. Routes the person can't open
   * (platform capability) are left out.
   */
  get siteMenuItems() {
    return [
      {
        route: "reports",
        label: this.t.siteMenuDashboard,
        description: this.t.siteMenuDashboardDescription,
        icon: HaxUiAdminIcons.reports,
      },
      {
        route: "content",
        label: this.t.siteMenuContent,
        description: this.t.siteMenuContentDescription,
        icon: HaxUiAdminIcons.content,
      },
      {
        route: "structure",
        label: this.t.siteMenuStructure,
        description: this.t.siteMenuStructureDescription,
        shortcut: "Ctrl⇧5",
        icon: HaxUiAdminIcons.structure,
      },
      {
        route: "files",
        label: this.t.siteMenuFiles,
        description: this.t.siteMenuFilesDescription,
        icon: HaxUiAdminIcons.files,
      },
      {
        route: "appearance",
        label: this.t.siteMenuAppearance,
        description: this.t.siteMenuAppearanceDescription,
        icon: HaxUiAdminIcons.appearance,
      },
    ].filter((item) => this._adminRouteAllowed(item.route));
  }
  /**
   * The house goes straight to the site Dashboard; when that route is not
   * allowed it falls back to the settings launcher, as before.
   */
  _siteHomeTap(e) {
    this.siteMenuOpen = false;
    if (this._adminRouteAllowed("reports")) {
      store.playSound("click");
      this.setAdminPath("reports", "push", false);
    } else {
      this._manifestButtonTap(e);
    }
  }
  _siteMenuItemTap(e) {
    const route =
      e && e.currentTarget ? e.currentTarget.getAttribute("data-route") : null;
    this.siteMenuOpen = false;
    if (route && this._adminRouteAllowed(route)) {
      store.playSound("click");
      this.setAdminPath(route, "push", false);
    }
  }
  _siteMenuOpenChanged(e) {
    if (!e || !e.detail || typeof e.detail.value !== "boolean") {
      return;
    }
    if (this.siteMenuOpen !== e.detail.value) {
      this.siteMenuOpen = e.detail.value;
    }
  }
  /**
   * ArrowDown on the house opens the quick links for keyboard users
   * (Enter / Space keep going to the Dashboard).
   */
  _siteHomeKeydown(e) {
    if (e.key !== "ArrowDown" || this.siteMenuOpen) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.siteMenuOpen = true;
    this.userMenuOpen = false;
    this.updateComplete.then(() => {
      const menu = this.shadowRoot.querySelector("#site-menu");
      if (menu && menu.updateComplete) {
        menu.updateComplete.then(() => {
          menu._focusFirstItem(menu._getMenuItems());
        });
      }
    });
  }
  /**
   * Hover opens a top bar menu (house quick links, user menu) for mouse
   * pointers; leaving closes it after a short grace period so the pointer
   * can travel into the menu. Touch and pen keep using tap.
   */
  _menuPointerEnter(e) {
    if (!e || e.pointerType !== "mouse" || this.editMode) {
      return;
    }
    const which = e.currentTarget.getAttribute("data-menu");
    clearTimeout(this.__menuHoverTimers[which]);
    this.__menuHoverTimers[which] = setTimeout(() => {
      if (which === "site") {
        this.siteMenuOpen = true;
        this.userMenuOpen = false;
      } else {
        this.__userMenuHoverOpened = !this.userMenuOpen;
        this.userMenuOpen = true;
        this.siteMenuOpen = false;
      }
    }, 150);
  }
  _menuPointerLeave(e) {
    if (!e || e.pointerType !== "mouse") {
      return;
    }
    const menu = e.currentTarget;
    const which = menu.getAttribute("data-menu");
    clearTimeout(this.__menuHoverTimers[which]);
    this.__menuHoverTimers[which] = setTimeout(() => {
      // keyboard focus inside the menu keeps it open
      if (menu && menu.matches && menu.matches(":focus-within")) {
        return;
      }
      if (which === "site") {
        this.siteMenuOpen = false;
      } else {
        this.userMenuOpen = false;
        this.__userMenuHoverOpened = false;
      }
    }, 300);
  }
  shouldAutoOpenTrayOnEdit() {
    const responsiveWidth = parseInt(this.responsiveWidth);
    const mediumBreakpoint = parseInt(this.md) || 900;
    const isNarrowViewport =
      !Number.isNaN(responsiveWidth) && responsiveWidth < mediumBreakpoint;
    return !(["xs", "sm"].includes(this.responsiveSize) || isNarrowViewport);
  }
  getIconPosition(size) {
    return !["xl", "lg"].includes(size) ? "top" : "left";
  }
  async _ensureHaxcmsButtonAddLoaded() {
    if (this.__haxcmsButtonAddReady || this.__haxcmsButtonAddImporting) {
      return;
    }
    if (globalThis.customElements.get("haxcms-button-add")) {
      this.__haxcmsButtonAddReady = true;
      this.requestUpdate();
      return;
    }
    this.__haxcmsButtonAddImporting = true;
    await import("./micros/haxcms-button-add.js");
    this.__haxcmsButtonAddReady = true;
    this.__haxcmsButtonAddImporting = false;
    this.requestUpdate();
  }
  // render function
  render() {
    return html`
      <app-hax-top-bar part="top-bar" ?edit-mode="${this.editMode}">
        <div slot="left" class="topbar-left-group">
          <slot name="haxcms-site-editor-ui-prefix-avatar"></slot>
          <app-hax-user-menu
            id="user-menu"
            part="app-hax-user-menu"
            align="start"
            label="${this.userName}"
            shortcut="Ctrl⇧7"
            data-menu="user"
            ?is-open="${this.userMenuOpen}"
            @is-open-changed="${this._userMenuOpenChanged}"
            @pointerenter="${this._menuPointerEnter}"
            @pointerleave="${this._menuPointerLeave}"
          >
            <div
              class="menu-toggle-wrapper"
              slot="menuButton"
              id="menubtn"
              @click="${this.toggleMenu}"
            >
              <app-hax-user-menu-toggle
                seed="${this.userName}"
                avatar-code="${this.userAvatarCode}"
                width="68"
                height="68"
                hat="${this.rpgHat}"
                ?walking="${this.rpgWalk}"
                aria-label="${this.t.userMenuFor.replace(
                  "{name}",
                  () => this.userName,
                )}"
                aria-expanded="${this.userMenuOpen}"
                @mouseover="${this.rpgStartWalk}"
                @focusin="${this.rpgStartWalk}"
                @mouseout="${this.rpgStopWalk}"
                @focusout="${this.rpgStopWalk}"
              ></app-hax-user-menu-toggle>
              <slot name="haxcms-site-editor-ui-topbar-character-button"></slot>
            </div>
            <simple-tooltip
              for="menubtn"
              slot="menuButton"
              position="bottom"
              ?hidden="${this.editMode || !this.userName || this.userMenuOpen}"
              >${this.userName}</simple-tooltip
            >
            <div slot="pre-menu" class="ops-panel">
              <slot name="haxcms-site-editor-ui-pre-menu"></slot>
              <haxcms-darkmode-toggle></haxcms-darkmode-toggle>
              <button
                class="soundToggle"
                @click="${this.soundToggle}"
                aria-label="${
                  this.soundIcon && this.soundIcon.indexOf("Full") !== -1
                    ? this.t.toggleSoundEffectsOff
                    : this.t.toggleSoundEffectsOn
                }"
                aria-pressed="${
                  this.soundIcon && this.soundIcon.indexOf("Full") !== -1
                    ? "true"
                    : "false"
                }"
              >
                <simple-icon-lite
                  src="${this.soundIcon}"
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                ></simple-icon-lite>
                <span class="sound-label">${this.t.soundEffects}</span>
                <span class="hax-ui-switch" aria-hidden="true"
                  ><span class="knob"></span
                ></span>
              </button>
            </div>
            <slot
              slot="main-menu"
              name="haxcms-site-editor-ui-main-menu"
            ></slot>
            <a
              class="mysiteslink"
              href="${this.backLink}"
              slot="main-menu"
              part="mysiteslink"
            >
              <app-hax-user-menu-button
                icon="hax:world-traveler-plain"
                label="${this.backText || this.t.siteDashboard}"
                part="mysitesbtn"
              ></app-hax-user-menu-button>
            </a>
            <app-hax-user-menu-button
              slot="main-menu"
              icon="social:school"
              part="mylearningbtn"
              id="mylearningbtn"
              label="${this.t.myLearning}"
              @click="${this._openMyLearning}"
            ></app-hax-user-menu-button>
            <app-hax-user-menu-button
              slot="main-menu"
              icon="face"
              part="customizecharacterbtn"
              label="${this.t.customizeCharacter}"
              @click="${this._openCharacterBuilder}"
            ></app-hax-user-menu-button>
            <slot
              slot="post-menu"
              name="haxcms-site-editor-ui-post-menu"
            ></slot>
            <app-hax-user-menu-button
              slot="post-menu"
              part="logoutbtn"
              class="logout"
              icon="icons:exit-to-app"
              label="${this.t.logOut}"
              @click=${this._logout}
            ></app-hax-user-menu-button>
          </app-hax-user-menu>
          <span class="topbar-divider" aria-hidden="true"></span>
          <div class="toolbar-buttons left-toolbar-buttons" role="menubar">
            <slot name="haxcms-site-editor-ui-prefix-buttons"></slot>
            <app-hax-user-menu
              id="site-menu"
              class="site-menu"
              part="site-menu"
              align="start"
              label="${this.t.siteSettings}"
              shortcut="Ctrl⇧6"
              data-menu="site"
              ?hidden="${this.editMode}"
              ?is-open="${this.siteMenuOpen}"
              @is-open-changed="${this._siteMenuOpenChanged}"
              @pointerenter="${this._menuPointerEnter}"
              @pointerleave="${this._menuPointerLeave}"
            >
              <simple-toolbar-button
                slot="menuButton"
                @click="${this._siteHomeTap}"
                @keydown="${this._siteHomeKeydown}"
                icon="hax:home-edit"
                part="manifestbtn"
                class="top-bar-button"
                role="menuitem"
                id="manifestbtn"
                aria-haspopup="true"
                aria-expanded="${this.siteMenuOpen ? "true" : "false"}"
                ?disabled="${this.editMode}"
                label="${this.t.siteSettings} • Ctrl⇧6"
              ></simple-toolbar-button>
              ${this.siteMenuItems.map(
                (item) =>
                  html`<app-hax-user-menu-button
                    slot="main-menu"
                    data-route="${item.route}"
                    icon="${item.icon}"
                    label="${item.label}"
                    description="${item.description}"
                    shortcut="${item.shortcut || ""}"
                    @click="${this._siteMenuItemTap}"
                  ></app-hax-user-menu-button>`,
              )}
            </app-hax-user-menu>
            ${
              this.__haxcmsButtonAddReady
                ? html`<haxcms-button-add
                    ?hidden="${this.editMode || !store.platformAllows("addPage")}"
                    ?disabled="${this.editMode}"
                    id="addpagebutton"
                    class="top-bar-button"
                    align-horizontal="center"
                    icon="hax:add-page"
                    label="${this.t.addPage} • Ctrl⇧3"
                    merlin
                    role="menuitem"
                  ></haxcms-button-add>`
                : ``
            }
            <span
              class="topbar-divider"
              aria-hidden="true"
              ?hidden="${this.editMode}"
            ></span>
            <simple-toolbar-button
              id="exportbtn"
              role="menuitem"
              icon="hax:html-code"
              label="${this.t.viewSource} • Ctrl⇧1"
              data-event="view-source"
              class="top-bar-button"
              @click="${this.haxButtonOp}"
              voice-command="view (page) source"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
              ?hidden="${!this.editMode || !store.platformAllows("viewSource")}"
              ?disabled="${!this.editMode}"
              ?active="${this.trayDetail === "view-source"}"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              role="menuitem"
              ?hidden="${!this.editMode || !store.platformAllows("contentMap")}"
              ?disabled="${!this.editMode}"
              data-event="content-map"
              icon="editor:format-line-spacing"
              id="content-map"
              class="top-bar-button"
              label="${this.t.pageOutline} • Ctrl⇧2"
              voice-command="select content outline (menu)"
              @click="${this.haxButtonOp}"
              ?active="${this.trayDetail === "content-map"}"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              ?hidden="${!this.editMode || !store.platformAllows("addBlock")}"
              ?disabled="${!this.editMode}"
              role="menuitem"
              data-event="content-add"
              icon="hax:add-brick"
              id="content-add"
              class="top-bar-button"
              label="${this.t.addBlock} • Ctrl⇧3"
              voice-command="select blocks (menu)"
              ?active="${this.trayDetail === "content-add"}"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
              @click="${this.haxButtonOp}"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              data-event="content-edit"
              icon="image:tune"
              class="top-bar-button"
              @click="${this.haxButtonOp}"
              id="content-edit"
              label="${this.t.configureBlock} • Ctrl⇧4"
              ?hidden="${!this.editMode}"
              ?disabled="${
                !this.activeTagName ||
                this.activeTagName == "" ||
                !this.activeNode ||
                !this.activeNode.tagName
              }"
              voice-command="(modify)(configure)(edit) selected"
              role="menuitem"
              controls="tray-detail"
              tooltip="${this.t.configure} ${this.activeTagName}"
              ?active="${this.trayDetail === "content-edit"}"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
            >
            </simple-toolbar-button>
            <span
              class="topbar-divider"
              aria-hidden="true"
              ?hidden="${!this.editMode}"
            ></span>
            <simple-toolbar-button
              icon="icons:undo"
              class="top-bar-button"
              role="menuitem"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
              ?disabled="${!this.canUndo}"
              @click="${this.haxButtonOp}"
              label="${this.t.undo} • Ctrl Z"
              data-event="undo"
              id="undo"
              ?hidden="${!this.editMode}"
              voice-command="undo"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              icon="icons:redo"
              class="top-bar-button"
              role="menuitem"
              @click="${this.haxButtonOp}"
              ?disabled="${!this.canRedo}"
              ?hidden="${!this.editMode}"
              label="${this.t.redo} • Ctrl⇧Z"
              data-event="redo"
              id="redo"
              voice-command="redo"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
            >
            </simple-toolbar-button>
            <span
              class="topbar-divider"
              aria-hidden="true"
              ?hidden="${!this.editMode}"
            ></span>
            <simple-toolbar-button
              id="cancelbutton"
              class="top-bar-button"
              icon="icons:cancel"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
              @click="${this._cancelButtonTap}"
              ?hidden="${!this.editMode}"
              ?disabled="${!this.editMode}"
              role="menuitem"
              label="${this.t.cancel} • Ctrl⇧/"
              voice-command="cancel (editing)"
            ></simple-toolbar-button>
            <simple-toolbar-button
              ?hidden="${!this.pageAllowed}"
              ?disabled="${
                this.activeItem &&
                this.activeItem.metadata &&
                this.activeItem.metadata.locked &&
                !this.editMode
              }"
              class="top-bar-button"
              role="menuitem"
              id="editbutton"
              icon="${this.__editIcon}"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
              @click="${this._editButtonTap}"
              label="${this.__editText}"
              voice-command="edit (this) page"
            ></simple-toolbar-button>
            <simple-toolbar-button
              ?hidden="${
                !this.activeItem ||
                !this.activeItem.metadata ||
                !this.activeItem.metadata.locked ||
                this.editMode
              }"
              id="lockbutton"
              class="top-bar-button"
              icon="icons:lock"
              icon-position="${this.getIconPosition(this.responsiveSize)}"
              label="${this.t.unlockPage}"
              @click="${this._toggleLockedStatus}"
              role="menuitem"
            ></simple-toolbar-button>
          </div>
        </div>
        <div slot="center" class="topbar-center-group">
          <div class="toolbar-buttons center-toolbar-buttons" role="group">
            <simple-toolbar-button
              id="merlinclose"
              class="top-bar-button"
              icon="icons:arrow-back"
              label="${this.t.closeMerlin}"
              @click="${this._closeMerlin}"
            ></simple-toolbar-button>
            <simple-toolbar-button
              icon="hax:world-traveler-plain"
              label="${this.t.merlin}"
              class="merlin top-bar-button merlin-anchor-button"
              id="merlin"
              tabindex="-1"
              aria-hidden="true"
            ></simple-toolbar-button>
            <super-daemon-search
              @click="${this.haxButtonOp}"
              @value-changed="${this.haxButtonOp}"
              @drop="${this.dropEvent}"
              @dragenter="${this.dragenterEvent}"
              @dragleave="${this.dragleaveEvent}"
              @dragover="${this.dragoverEvent}"
              icon="hax:world-traveler-plain"
              id="search"
              class="merlin"
              data-event="super-daemon"
              mini
              wand
              droppable-type="${this.activeType}"
              ?droppable="${this.activeDrag}"
            >
            </super-daemon-search>
          </div>
        </div>
        <div slot="right" class="topbar-right-group">
          <div class="toolbar-buttons right-toolbar-buttons" role="menubar">
            <slot name="haxcms-site-editor-ui-suffix-buttons"></slot>
          </div>
          <span class="home-btn">
            <!-- the HAX mark: decorative, it says you are in HAX; the way
                 back to your sites is in the user menu -->
            <span
              class="haxLogo"
              id="backtosites"
              part="hax-logo"
              aria-hidden="true"
            >
              <simple-icon-lite
                icon="hax:world-traveler"
                no-colorize
              ></simple-icon-lite>
            </span>
          </span>
        </div>
      </app-hax-top-bar>
      ${
        this.themePreviewOpen && this.__themePreviewReady
          ? html`<haxcms-theme-preview-panel
              open
              @haxcms-theme-preview-collapsed-changed=${
                this._handleThemePreviewCollapsedChanged
              }
              @haxcms-theme-preview-cancel=${this._handleThemePreviewCancel}
              @haxcms-theme-preview-open-admin=${
                this._handleThemePreviewOpenAdmin
              }
            ></haxcms-theme-preview-panel>`
          : ``
      }
    `;
  }

  /**
   * Positions of the left group's buttons that are showing, by id.
   */
  _topbarButtonRects() {
    const rects = {};
    const group =
      this.shadowRoot && this.shadowRoot.querySelector(".left-toolbar-buttons");
    if (!group) {
      return rects;
    }
    Array.from(group.children).forEach((el) => {
      if (el.id && !el.hidden) {
        const r = el.getBoundingClientRect();
        if (r.width > 0) {
          rects[el.id] = r.left;
        }
      }
    });
    return rects;
  }
  /**
   * Switching between view and edit mode slides the bar over instead of
   * swapping it: buttons in both modes (Edit becoming Save) glide from
   * their old spot to the new one, and the ones that just appeared slide
   * in after them, one after another. Nothing moves with reduced motion.
   */
  _animateModeSwitch(before) {
    if (
      !globalThis.matchMedia ||
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const group = this.shadowRoot.querySelector(".left-toolbar-buttons");
    if (!group || !group.animate) {
      return;
    }
    const after = this._topbarButtonRects();
    let appeared = 0;
    Array.from(group.children).forEach((el) => {
      if (!el.id || after[el.id] === undefined || !el.animate) {
        return;
      }
      if (before[el.id] !== undefined) {
        const dx = before[el.id] - after[el.id];
        if (Math.abs(dx) > 1) {
          el.animate(
            [
              { transform: `translateX(${dx}px)` },
              { transform: "translateX(0)" },
            ],
            { duration: 300, easing: "cubic-bezier(0.2, 0, 0, 1)" },
          );
        }
      } else {
        el.animate(
          [
            { opacity: 0, transform: "translateX(-16px)" },
            { opacity: 1, transform: "translateX(0)" },
          ],
          {
            duration: 240,
            delay: 30 * appeared,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            fill: "backwards",
          },
        );
        appeared++;
      }
    });
  }
  /**
   * The open Merlin popover draws its own field: keep it the same width as
   * the top bar field so it covers it exactly instead of overhanging, and
   * HAX UI dark like the bar it opens from. Measured, so it follows Merlin
   * when the bar's groups change width (edit mode, smaller screens).
   */
  _syncMerlinPopover() {
    if (
      !this.shadowRoot ||
      !SuperDaemonInstance ||
      !SuperDaemonInstance.style
    ) {
      return;
    }
    const search = this.shadowRoot.querySelector("#search");
    const sdStyle = SuperDaemonInstance.style;
    const rect = search ? search.getBoundingClientRect() : null;
    Object.keys(MERLIN_DARK).forEach((name) => {
      sdStyle.setProperty(name, MERLIN_DARK[name]);
    });
    if (!rect || rect.width === 0) {
      sdStyle.removeProperty("--super-daemon-search-width");
      sdStyle.removeProperty("--super-daemon-width");
      return;
    }
    sdStyle.setProperty(
      "--super-daemon-search-width",
      `${Math.round(rect.width)}px`,
    );
    sdStyle.setProperty("--super-daemon-width", `${Math.round(rect.width)}px`);
  }

  rpgStartWalk() {
    if (!globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.rpgWalk = true;
    }
  }
  rpgStopWalk() {
    this.rpgWalk = false;
  }

  __isFileDrop(e) {
    return (
      e.dataTransfer &&
      e.dataTransfer.items &&
      e.dataTransfer.items.length > 0 &&
      e.dataTransfer.items[0].kind === "file"
    );
  }
  /**
   * Window-level drag enter: highlight Merlin whenever the user
   * drags a file onto the page (regardless of edit mode).
   */
  __windowDragEnter(e) {
    this.__dragCounter++;
    if (this.__isFileDrop(e) && this.__dragCounter === 1) {
      if (this.sdSearch) {
        this.sdSearch.classList.add("window-file-drag");
      }
    }
  }
  /**
   * Window-level drag leave: remove highlight once the drag truly leaves
   * the browser window (counter handles nested element churn).
   */
  __windowDragLeave(_e) {
    this.__dragCounter--;
    if (this.__dragCounter <= 0) {
      this.__dragCounter = 0;
      if (this.sdSearch) {
        this.sdSearch.classList.remove("window-file-drag");
      }
    }
  }
  /**
   * Window-level drag over: prevent default for file drops so the browser
   * allows a drop.
   */
  __windowDragOver(e) {
    if (this.__isFileDrop(e)) {
      e.preventDefault();
    }
  }
  /**
   * Window-level drop: if the user drops a file within the top bar (64px)
   * and it didn't originate from Merlin, process it via Merlin.
   */
  __windowDrop(e) {
    this.__dragCounter = 0;
    if (this.sdSearch) {
      this.sdSearch.classList.remove("window-file-drag");
    }
    if (!this.__isFileDrop(e)) {
      return;
    }
    // If the drop originated from the Merlin search box, let it handle it
    if (e.target && e.target.closest && e.target.closest("#search")) {
      return;
    }
    // Only process drops that actually land on the top bar area
    if (e.clientY <= 64) {
      e.preventDefault();
      e.stopPropagation();
      this.dropEvent(e);
    }
  }
  /**
   * Capture-phase drop listener to ensure the drag highlight is removed
   * even when nested components (e.g., hax-body) stop event propagation.
   */
  __windowDropCleanup(e) {
    if (!this.__isFileDrop(e)) {
      return;
    }
    this.__dragCounter = 0;
    if (this.sdSearch) {
      this.sdSearch.classList.remove("window-file-drag");
    }
  }
  /**
   * drag / drop event block
   */
  dropEvent(e) {
    e.preventDefault();
    this.activeDrag = false;
    this.activeType = null;
    SuperDaemonInstance.waveWand(
      ["", "/", e, "hax-agent", this.t.uploadAFile],
      this.shadowRoot.querySelector("#merlin"),
    );
  }
  dragenterEvent(e) {
    e.preventDefault();
    this.sdSearch.dragover = true;
  }
  dragoverEvent(e) {
    e.preventDefault();
    this.sdSearch.dragover = true;
  }
  dragleaveEvent(e) {
    e.preventDefault();
    this.sdSearch.dragover = false;
  }
  // daemon was told to close so enable the search bar again
  sdCloseEvent(_e) {
    this.merlinPhoneOpen = false;
    setTimeout(() => {
      // trap helps ensure user expectation of no input but without triggering
      // an input change event which activates things running
      this._ignoreReset = true;
      this.sdSearch.value = "";
    }, 0);
    this.sdSearch.disabled = false;
    this.sdSearch.dragover = false;
    this.sdSearch.droppable = false;
    this.sdSearch.droppableType = null;
  }

  /**
   * The way back out of Merlin when it fills a phone's bar.
   */
  _closeMerlin() {
    SuperDaemonInstance.close();
    this.merlinPhoneOpen = false;
  }

  haxButtonOp(e) {
    let exec = e.target.getAttribute("data-event");
    switch (exec) {
      case "super-daemon":
        // a phone's bar is too narrow for the field: Merlin is a button
        // that opens the search across the whole bar first
        if (
          this.responsiveSize === "xs" &&
          e.type === "click" &&
          !this.merlinPhoneOpen
        ) {
          this.merlinPhoneOpen = true;
          this.updateComplete.then(() => {
            this._syncMerlinPopover();
            SuperDaemonInstance.waveWand(
              ["", "*"],
              this.shadowRoot.querySelector("#merlin"),
              null,
            );
          });
          break;
        }
        if (!this._ignoreReset || e.type === "click") {
          const value = this.sdSearch.value;
          if (e.type === "value-changed") {
            if (value) {
              SuperDaemonInstance.waveWand(
                [value, "*"],
                this.shadowRoot.querySelector("#merlin"),
                null,
              );
            }
          } else {
            SuperDaemonInstance.waveWand(
              [value, "*"],
              this.shadowRoot.querySelector("#merlin"),
              null,
            );
          }
          // this will reset UX expectation but also trigger this to run again so need to
          // have weird loop above to ensure it's not going to affect it
          this.sdSearch.value = null;
          // this helps with accessibility
          this.sdSearch.disabled = false;
          this.sdSearch.dragover = false;
          this.sdSearch.droppable = false;
          this.sdSearch.droppableType = null;
        }
        this._ignoreReset = false;
        break;
      case "super-daemon-modal":
        if (!this._ignoreReset || e.type === "click") {
          store.playSound("click");
          SuperDaemonInstance.open();
          HAXStore.haxTray.collapsed = false;
        }
        break;
      case "media-program":
        store.playSound("click");
        SuperDaemonInstance.waveWand(
          ["", "/"],
          this.shadowRoot.querySelector("#merlin"),
          null,
        );
        break;
      case "content-edit":
      case "content-map":
      case "content-add":
        if (HAXStore.haxTray.trayDetail == exec) {
          HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
        } else {
          HAXStore.haxTray.collapsed = false;
        }
        //If HAXStore.haxTray.collapsed by doble click, clear active state
        if (HAXStore.haxTray.collapsed) {
          HAXStore.haxTray.trayDetail = "no-active-tray";
        } else {
          HAXStore.haxTray.trayDetail = exec;
        }
        break;
      case "undo":
        HAXStore.activeHaxBody.undo();
        break;
      case "redo":
        HAXStore.activeHaxBody.redo();
        break;
      case "view-source":
        HAXStore.haxTray.shadowRoot.querySelector("#view-source").openSource();
        if (HAXStore.haxTray.trayDetail == exec) {
          HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
        } else {
          HAXStore.haxTray.collapsed = false;
        }
        HAXStore.haxTray.trayDetail = exec;
        break;
    }
  }

  _openCharacterBuilder(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.closeMenu();
    openCharacterBuilder(this, {
      userName: this.userName,
      avatarCode: this.userAvatarCode,
      title: this.t.customizeCharacter,
      saveLabel: this.t.save,
      cancelLabel: this.t.cancel,
    });
  }

  /**
   * "My learning" in the user menu: the learner dashboard for the whole
   * site in a dialog (my-learning, loaded on first use)
   */
  async _openMyLearning(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.closeMenu();
    // the package path, like the wc-registry autoloader uses for the tag,
    // so a page that already shows my-learning shares one definition
    const { openMyLearning } =
      await import("@haxtheweb/haxcms-elements/lib/ui-components/progress/my-learning.js");
    return openMyLearning(this, { title: this.t.myLearning, scope: "site" });
  }

  /**
   * Log out from the editor menu, then reload once the server has answered
   * the logout. jwt-login clears the local token first, so reloading on
   * jwt-logged-in false (as this used to) could cut the logout request off
   * and leave the refresh cookie alive, logging the user straight back in
   * (haxtheweb/issues#3209 item 5, already fixed the same way in app-hax).
   * Falls back to a timed reload if no jwt-login-logout-complete arrives.
   */
  _logout() {
    if (this.__logoutReloadPending) {
      return;
    }
    this.__logoutReloadPending = true;
    settleOnce("jwt-login-logout-complete", 5000, () =>
      this._reloadAfterLogout(),
    );
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: { redirect: false },
      }),
    );
  }
  _reloadAfterLogout() {
    this.__logoutReloadPending = false;
    globalThis.location.reload();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
      .querySelectorAll("[data-super-daemon-path]")
      .forEach((item) => {
        SuperDaemonInstance.defineOption({
          title: item.getAttribute("data-super-daemon-label"),
          icon: item.getAttribute("data-super-daemon-icon"),
          tags: ["page", "operation", "command", "add", "create"],
          value: {
            target: item,
          },
          context: "CMS",
          eventName: "super-daemon-element-click",
          path: item.getAttribute("data-super-daemon-path"),
        });
      });
    this.sdSearch = this.shadowRoot.querySelector("super-daemon-search");
    SuperDaemonInstance.wandTarget = this.shadowRoot.querySelector("#merlin");
    // load up commands for daemon
    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "save" },
      title: this.t.save,
      icon: "icons:save",
      tags: ["CMS", "save", "page", "operation", "command"],
      // Links this Merlin option to the Ctrl+Shift+S binding registered in
      // _registerKeyboardShortcuts via the shared shortcut registry.
      shortcut: "cms-save",
      value: {
        target: this,
        method: "_editButtonTap",
      },
      context: "HAX",
      eventName: "super-daemon-element-method",
      path: "CMS/action/save",
    });
    if (store.platformAllows("insights")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace("{section}", () => this.t.reports),
        icon: "hax:graph",
        tags: ["CMS", "admin", "reports", "data", "operation"],
        value: {
          target: this,
          method: "_reportsButtonTap",
          args: [null, true],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/reports",
      });
    }
    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "edit" },
      title: this.t.edit,
      icon: "hax:page-edit",
      priority: -1500,
      tags: ["CMS", "edit", "page", "operation", "command"],
      // Links this Merlin option to the Ctrl+Shift+E binding registered in
      // _registerKeyboardShortcuts via the shared shortcut registry.
      shortcut: "cms-edit",
      value: {
        target: this,
        method: "_editButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/edit",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.adminSection.replace(
        "{section}",
        () => this.t.siteSettings,
      ),
      icon: "hax:site-settings",
      tags: ["CMS", "admin", "site", "settings", "operation", "command"],
      // Links this Merlin option to the Ctrl+Shift+6 binding registered in
      // _registerKeyboardShortcuts via the shared shortcut registry.
      shortcut: "cms-site-settings",
      value: {
        target: this,
        method: "_manifestButtonTap",
        args: [{ target: this.shadowRoot.querySelector("#manifestbtn") }],
      },
      context: "admin",
      eventName: "super-daemon-element-method",
      path: "CMS/admin/dashboard",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.adminSection.replace("{section}", () => this.t.about),
      icon: "help",
      tags: ["CMS", "admin", "about", "help", "tutorials", "community"],
      value: {
        target: this,
        method: "_openAboutAdmin",
        args: [true, this.t.about],
      },
      context: "admin",
      eventName: "super-daemon-element-method",
      path: "CMS/admin/about",
    });
    if (store.platformAllows("themeManifest")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace(
          "{section}",
          () => this.t.appearance,
        ),
        icon: "lrn:palette",
        tags: [
          "CMS",
          "admin",
          "appearance",
          "theme",
          "settings",
          "operation",
          "command",
        ],
        value: {
          target: this,
          method: "_openAppearanceSettings",
          args: [true, "Appearance"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/appearance",
      });
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace(
          "{section}",
          () => this.t.themePreview,
        ),
        icon: "image:style",
        tags: [
          "CMS",
          "admin",
          "theme",
          "palette",
          "preview",
          "off-canvas",
          "operation",
          "command",
        ],
        value: {
          target: this,
          method: "_openThemePreview",
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/theme-preview",
      });
    }
    if (store.platformAllows("seoManifest")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace(
          "{section}",
          () => this.t.seoSettings,
        ),
        icon: "icons:search",
        tags: [
          "CMS",
          "admin",
          "seo",
          "search",
          "engine",
          "settings",
          "operation",
          "command",
        ],
        value: {
          target: this,
          method: "_openSeoAdmin",
          args: [true, "seo"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/seo",
      });
    }
    if (store.platformAllows("authorManifest")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace(
          "{section}",
          () => this.t.authorSettings,
        ),
        icon: "account-circle",
        tags: ["CMS", "admin", "author", "settings", "site settings"],
        value: {
          target: this,
          method: "_openSeoAdmin",
          args: [true, "author"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/author",
      });
    }
    SuperDaemonInstance.defineOption({
      title: this.t.adminSection.replace("{section}", () => this.t.content),
      icon: "editor:insert-drive-file",
      tags: ["CMS", "admin", "content", "site settings", "operation"],
      value: {
        target: this,
        method: "_openContentAdmin",
        args: [true],
      },
      context: "admin",
      eventName: "super-daemon-element-method",
      path: "CMS/admin/content",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.adminSection.replace("{section}", () => this.t.views),
      icon: "hax:view-gallery",
      tags: ["CMS", "admin", "views", "display", "query", "site settings"],
      value: {
        target: this,
        method: "_openViewsAdmin",
        args: [true],
      },
      context: "admin",
      eventName: "super-daemon-element-method",
      path: "CMS/admin/views",
    });
    if (store.platformAllows("views")) {
      const evt = new CustomEvent("hax-register-properties", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          tag: "site-view",
          properties: SiteView.haxProperties,
        },
      });
      this.dispatchEvent(evt);
    }
    if (store.platformAllows("siteManifest")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace("{section}", () => this.t.details),
        icon: "settings",
        tags: ["CMS", "admin", "details", "site", "settings", "metadata"],
        value: {
          target: this,
          method: "_openDetailsAdmin",
          args: [true, "Details"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/details",
      });
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace("{section}", () => this.t.blocks),
        icon: "hax:blocks",
        tags: ["CMS", "admin", "blocks", "settings", "site settings"],
        value: {
          target: this,
          method: "_openAllowedBlocksSettings",
          args: [true, "Blocks"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/blocks",
      });
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace("{section}", () => this.t.editor),
        icon: "hax:page-edit",
        tags: ["CMS", "admin", "editor", "settings", "site settings"],
        value: {
          target: this,
          method: "_openEditorSettings",
          args: [true, "Editor"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/editor",
      });
    }
    SuperDaemonInstance.defineOption({
      title: this.t.adminSection.replace("{section}", () => this.t.features),
      icon: "hax:add-item",
      tags: ["CMS", "admin", "features", "platform", "settings"],
      value: {
        target: this,
        method: "_openPlatformSettings",
        args: [true, "Features"],
      },
      context: "admin",
      eventName: "super-daemon-element-method",
      path: "CMS/admin/features",
    });
    if (store.platformAllows("uploadMedia")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace("{section}", () => this.t.files),
        icon: "icons:folder",
        tags: ["CMS", "admin", "files", "media", "site settings"],
        value: {
          target: this,
          method: "_openFilesAdmin",
          args: [true],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/files",
      });
    }
    SuperDaemonInstance.defineOption({
      title: this.t.adminSection.replace(
        "{section}",
        () => this.t.importExport,
      ),
      icon: "icons:file-download",
      tags: ["CMS", "admin", "import", "export", "transfer", "site settings"],
      value: {
        target: this,
        method: "_openImportExportDashboard",
        args: [true, "Import / Export"],
      },
      context: "admin",
      eventName: "super-daemon-element-method",
      path: "CMS/admin/import-export",
    });
    if (store.platformAllows("styleGuide")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace(
          "{section}",
          () => this.t.styleGuide,
        ),
        icon: "lrn:palette",
        tags: ["CMS", "admin", "theme", "style guide", "design"],
        value: {
          target: this,
          method: "_styleGuideButtonTap",
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/style-guide",
      });
    }
    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "logOut" },
      title: this.t.logOut,
      icon: "add",
      tags: ["CMS", "user", "logout"],
      value: {
        target: this,
        method: "_logout",
      },
      context: ["logged-in", "CMS"],
      eventName: "super-daemon-element-method",
      path: "CMS/user/logout",
    });

    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "darkModeToggle" },
      title: this.t.darkModeToggle,
      icon: "device:brightness-medium",
      tags: ["CMS", "dark mode"],
      value: {
        target: this.shadowRoot.querySelector("haxcms-darkmode-toggle"),
        method: "toggle",
      },
      voice: "(toggle) dark mode",
      eventName: "super-daemon-element-method",
      path: "CMS/action/darkMode",
      context: ["CMS"],
    });

    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "soundToggle" },
      title: this.t.soundToggle,
      icon: "av:volume-up",
      tags: ["CMS", "sound"],
      value: {
        target: this.shadowRoot.querySelector(".soundToggle"),
      },
      eventName: "super-daemon-element-click",
      path: "CMS/action/sound",
      context: ["CMS"],
    });

    if (store.platformAllows("outlineDesigner")) {
      SuperDaemonInstance.defineOption({
        title: this.t.adminSection.replace(
          "{section}",
          () => this.t.pageOutline,
        ),
        icon: "hax:site-map",
        tags: [
          "CMS",
          "admin",
          "outline",
          "designer",
          "site outline",
          "operation",
          "command",
          "structure",
        ],
        // Links this Merlin option to the Ctrl+Shift+5 binding registered in
        // _registerKeyboardShortcuts via the shared shortcut registry.
        shortcut: "cms-outline",
        value: {
          target: this,
          method: "_outlineButtonTap",
          args: [null, true, "Structure"],
        },
        context: "admin",
        eventName: "super-daemon-element-method",
        path: "CMS/admin/structure",
      });
    }
    // force item to load schema
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "loadComponentSchema",
        "value.name": "loadComponentSchema",
      },
      title: this.t.loadComponentSchema,
      icon: "hax:hax2022",
      tags: ["Developer", "schema", "load", "demo", "testing"],
      eventName: "super-daemon-run-program",
      path: ">hax/loadElement",
      context: [">"],
      value: {
        name: this.t.loadComponentSchema,
        context: ">",
        program: async (input, _values) => {
          const reg = globalThis.WCAutoload.requestAvailability();
          let results = [];
          Object.keys(reg.registry.list).forEach(async (tag) => {
            let icon = "hax:hax2022";
            if (globalThis.customElements.get(tag)) {
              if (
                globalThis.customElements.get(tag).haxProperties &&
                globalThis.customElements.get(tag).haxProperties.gizmo
              ) {
                icon =
                  globalThis.customElements.get(tag).haxProperties.gizmo.icon;
              }
            }
            if (input == "" || tag.includes(input)) {
              let tmp = {};
              tmp[tag] = reg.registry.list[tag];
              results.push({
                title: tag,
                icon: icon,
                tags: ["schema"],
                value: {
                  target: globalThis.HaxStore.instance,
                  method: "_handleDynamicImports",
                  args: [tmp, globalThis.HaxStore.instance.haxAutoloader],
                },
                eventName: "super-daemon-element-method",
                context: [">", ">hax/loadElement/" + tag],
                path: ">hax/loadElement/" + tag,
              });
            }
          });
          return results;
        },
      },
    });
    // Welcome to HAX program - shows 5 most common operations for new users
    const welcomeOps = [
      {
        title: this.t.editThisPage,
        icon: "hax:page-edit",
        tags: ["welcome", "common", "operation"],
        shortcut: "cms-edit",
        value: {
          target: this,
          method: "executeWelcomeAction",
          args: ["edit-page"],
        },
        eventName: "super-daemon-element-method",
        context: "CMS",
        path: "CMS/welcome/edit-page",
      },
      {
        title: this.t.uploadAFile,
        icon: "file-upload",
        tags: ["welcome", "common", "operation"],
        value: {
          target: this,
          method: "executeWelcomeAction",
          args: ["upload-file"],
        },
        eventName: "super-daemon-element-method",
        context: "CMS",
        path: "CMS/welcome/upload-file",
      },
      {
        title: this.t.createANewPage,
        icon: "hax:add-page",
        tags: ["welcome", "common", "operation"],
        shortcut: "cms-add-page",
        value: {
          target: this,
          method: "executeWelcomeAction",
          args: ["create-page"],
        },
        eventName: "super-daemon-element-method",
        context: "addPage",
        path: "CMS/welcome/create-page",
      },
      {
        title: this.t.editSiteOutline,
        icon: "hax:site-map",
        tags: ["welcome", "common", "operation"],
        shortcut: "cms-outline",
        value: {
          target: this,
          method: "executeWelcomeAction",
          args: ["outline-designer"],
        },
        eventName: "super-daemon-element-method",
        context: "outlineDesigner",
        path: "CMS/welcome/outline-designer",
      },
      {
        title: this.t.changeSiteSettings,
        icon: "hax:site-settings",
        tags: ["welcome", "common", "operation"],
        shortcut: "cms-site-settings",
        value: {
          target: this,
          method: "executeWelcomeAction",
          args: ["site-settings"],
        },
        eventName: "super-daemon-element-method",
        context: "admin",
        path: "CMS/welcome/site-settings",
      },
      {
        title: this.t.dontShowThisWelcomeAgain,
        icon: "icons:visibility-off",
        tags: ["welcome", "dismiss", "settings"],
        value: {
          target: this,
          method: "dismissWelcomeProgram",
          args: [],
        },
        eventName: "super-daemon-element-method",
        context: "CMS",
        path: "CMS/welcome/dismiss",
      },
    ];
    // Resolve each welcome op's shortcut id into a display label so the
    // rows render a chip in the welcome program. Bindings are registered in
    // connectedCallback (_registerKeyboardShortcuts) which runs before this
    // firstUpdated hook, so the registry lookups succeed.
    welcomeOps.forEach((op) => {
      if (op.shortcut) {
        op.shortcutLabel = SuperDaemonInstance._resolveShortcutLabel(
          op.shortcut,
        );
      }
    });
    // The "Create a page" option is defined in the constructor, which runs
    // before _registerKeyboardShortcuts (connectedCallback) registers the
    // cms-add-page binding. Re-resolve its shortcut label now that the
    // binding is in the shared registry so the row renders the chip.
    const createPageOption = SuperDaemonInstance.allItems.find(
      (item) => item.path === "CMS/action/add/page",
    );
    if (createPageOption && createPageOption.shortcut) {
      createPageOption.shortcutLabel =
        SuperDaemonInstance._resolveShortcutLabel(createPageOption.shortcut);
    }
    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "showGettingStartedTasks" },
      title: this.t.showGettingStartedTasks,
      icon: "hax:hax2022",
      tags: [
        "welcome",
        "tutorial",
        "getting started",
        "onboarding",
        "help",
        "guide",
      ],
      eventName: "super-daemon-run-program",
      path: "CMS/welcome",
      context: ["CMS", "logged-in"],
      priority: 2000, // Low priority to appear at bottom
      value: {
        name: "Show getting started tasks",
        machineName: "welcome",
        context: "CMS",
        program: async (_input, _values) => {
          // Five most common operations for new users
          return welcomeOps.filter(
            (item) =>
              item.context === "CMS" ||
              item.context === "admin" ||
              store.platformAllows(item.context),
          );
        },
      },
    });
    // change platform audience, only load if the site supports platformConfigs
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "previewAudienceMode",
        "value.name": "previewAudienceMode",
      },
      title: this.t.previewAudienceMode,
      icon: "lrn:people",
      tags: ["Developer", "skeleton"],
      eventName: "super-daemon-run-program",
      path: ">settings/platformAudience",
      context: [">"],
      more: html`<span>${this.t.changePlatformAudienceDescription}</span>`,
      voice: "change audience (temporarily)",
      value: {
        name: this.t.previewAudienceMode,
        context: ">",
        program: async (input, _values) => {
          let results = [];
          // Load in the supported audiences in platformConfig
          const audienceOptions = {
            novice: "lrn:book",
            expert: "lrn:teacher",
          };

          Object.keys(audienceOptions).forEach((key) => {
            if (input == "" || key.includes(input.toLowerCase())) {
              results.push({
                title: key,
                icon: audienceOptions[key],
                tags: ["skeleton"],
                value: {
                  target: globalThis.HAXCMS,
                  method: "setPlatformAudience",
                  args: [key],
                },
                eventName: "super-daemon-element-method",
                context: [">", ">settings/platformAudience/" + key],
                path: ">settings/theme/" + key,
              });
            }
          });

          return results;
        },
      },
    });

    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "haxLabs" },
      title: this.t.haxLabs,
      icon: "hax:hax2022",
      tags: ["Developer", "labs", "experiments"],
      eventName: "super-daemon-element-method",
      path: ">hax/labs",
      context: [">"],
      value: {
        target: this,
        method: "enableLabExperiments",
        args: [],
      },
    });
    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "unlockAllThemes" },
      title: this.t.unlockAllThemes,
      icon: "image:style",
      tags: ["Developer", "theme", "hidden", "terrible", "legacy"],
      eventName: "super-daemon-element-method",
      path: ">developer/hax/unlockAllThemes",
      context: [">"],
      value: {
        target: this,
        method: "unlockAllThemes",
        args: [],
      },
    });
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "pageDataFormats",
        "value.name": "pageDataFormats",
      },
      title: this.t.pageDataFormats,
      icon: "hax:code-json",
      tags: [
        "Developer",
        "page",
        "data",
        "format",
        "json",
        "yaml",
        "md",
        "xml",
        "robot",
        "llm",
      ],
      eventName: "super-daemon-run-program",
      path: ">developer/page-as-data",
      context: [">"],
      voice: "page as data",
      value: {
        name: this.t.pageDataFormats,
        machineName: "page-as-data",
        context: ">",
        program: async (input, values) => {
          const { createPageAsDataProgram } =
            await import("./utils/PageAsDataProgram.js");
          const pageAsDataProgram = createPageAsDataProgram(this);
          return await pageAsDataProgram(input, values);
        },
      },
    });
    SuperDaemonInstance.defineOption({
      i18n: { context: this, title: "viewOnlyMode" },
      title: this.t.viewOnlyMode,
      icon: "visibility",
      tags: [
        "Developer",
        "view",
        "read-only",
        "preview",
        "anonymous",
        "logged out",
        "logged-out",
        "unauthenticated",
        "guest",
        "visitor",
      ],
      eventName: "super-daemon-element-method",
      path: ">settings/view-only",
      context: [">"],
      more: html`<span>${this.t.viewOnlyModeDescription}</span>`,
      voice: "view only mode",
      value: {
        target: this,
        method: "enableViewOnlyMode",
        args: [],
      },
    });
    // force item to load schema
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "switchToAnotherSite",
        "value.name": "switchToAnotherSite",
      },
      title: this.t.switchToAnotherSite,
      icon: "hax:hax2022",
      tags: ["Developer", "change", "sites", "administration"],
      eventName: "super-daemon-run-program",
      path: "/hax/changeSite",
      context: ["CMS"],
      value: {
        name: this.t.switchToAnotherSite,
        context: "CMS",
        program: async (input, _values) => {
          let results = [];
          // will work in a production haxiam environment to allow hopping between spaces
          await fetch("./../../system/api/v1/sites")
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              return [];
            })
            .then((manifest) => {
              if (manifest.data && manifest.data.items.length > 0) {
                manifest.data.items.forEach(async (site) => {
                  if (
                    input == "" ||
                    (site.metadata.site &&
                      site.metadata.site.name &&
                      site.metadata.site.name.includes(input) &&
                      store.manifest.metadata.site.name !=
                        site.metadata.site.name)
                  ) {
                    results.push({
                      title: site.title,
                      icon: site.metadata.theme.variables.icon,
                      tags: ["site", site.description],
                      value: {
                        target: this,
                        method: "goToLocation",
                        args: [site.slug],
                      },
                      eventName: "super-daemon-element-method",
                      context: [
                        "/",
                        "/hax/changeSite/" + site.metadata.site.name,
                      ],
                      path: "/hax/changeSite/" + site.metadata.site.name,
                    });
                  }
                });
              }
            });
          return results;
        },
      },
    });

    // Print Options Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "printOptions",
        "value.name": "printOptions",
      },
      title: this.t.printOptions,
      icon: "icons:print",
      tags: ["CMS", "print", "page", "site", "pdf"],
      eventName: "super-daemon-run-program",
      path: "CMS/action/print",
      context: ["CMS"],
      voice: "print (options)",
      value: {
        name: this.t.printOptions,
        machineName: "print-options",
        program: async (input, values) => {
          // Import the print program dynamically
          const { createPrintProgram } =
            await import("./utils/PrintProgram.js");
          const printProgram = createPrintProgram(this);
          return await printProgram(input, values);
        },
      },
    });

    // Export Page Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "exportThisPage",
        "value.name": "exportThisPage",
      },
      title: this.t.exportThisPage,
      icon: "icons:file-download",
      tags: ["CMS", "export", "page"],
      eventName: "super-daemon-run-program",
      path: "CMS/export/page",
      context: ["CMS", "HAX"],
      voice: "export page",
      value: {
        name: this.t.exportThisPage,
        machineName: "export-page",
        program: async (input, values) => {
          const { createExportPageProgram } =
            await import("./utils/ExportPageProgram.js");
          const exportPageProgram = createExportPageProgram(this);
          return await exportPageProgram(input, values);
        },
      },
    });

    // Export Site Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "exportThisSite",
        "value.name": "exportThisSite",
      },
      title: this.t.exportThisSite,
      icon: "icons:file-download",
      tags: ["CMS", "export", "site"],
      eventName: "super-daemon-run-program",
      path: "CMS/export/site",
      context: ["CMS"],
      voice: "export site",
      value: {
        name: this.t.exportThisSite,
        machineName: "export-site",
        program: async (input, values) => {
          const { createExportSiteProgram } =
            await import("./utils/ExportSiteProgram.js");
          const exportSiteProgram = createExportSiteProgram(this);
          return await exportSiteProgram(input, values);
        },
      },
    });

    // Edit Title Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "renameThisPage",
        "value.name": "renameThisPage",
        "value.placeholder": "enterNewTitle",
      },
      title: this.t.renameThisPage,
      icon: "editor:title",
      tags: ["CMS", "edit", "title", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/title",
      context: ["CMS"],
      voice: "edit title",
      value: {
        name: this.t.renameThisPage,
        machineName: "edit-title",
        placeholder: this.t.enterNewTitle,
        program: async (input, values) => {
          const { createEditTitleProgram } =
            await import("./utils/EditTitleProgram.js");
          const editTitleProgram = createEditTitleProgram(this);
          return await editTitleProgram(input, values);
        },
      },
    });

    // Edit Description Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "updatePageDescription",
        "value.name": "updatePageDescription",
        "value.placeholder": "enterNewDescription",
      },
      title: this.t.updatePageDescription,
      icon: "editor:format-quote",
      tags: ["CMS", "edit", "description", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/description",
      context: ["CMS"],
      voice: "edit description",
      value: {
        name: this.t.updatePageDescription,
        machineName: "edit-description",
        placeholder: this.t.enterNewDescription,
        program: async (input, values) => {
          const { createEditDescriptionProgram } =
            await import("./utils/EditDescriptionProgram.js");
          const editDescriptionProgram = createEditDescriptionProgram(this);
          return await editDescriptionProgram(input, values);
        },
      },
    });

    // Edit Slug Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "updatePageUrlSlug",
        "value.name": "updatePageUrlSlug",
        "value.placeholder": "enterNewSlug",
      },
      title: this.t.updatePageUrlSlug,
      icon: "editor:insert-link",
      tags: ["CMS", "edit", "slug", "url", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/slug",
      context: ["CMS"],
      voice: "edit slug",
      value: {
        name: this.t.updatePageUrlSlug,
        machineName: "edit-slug",
        placeholder: this.t.enterNewSlug,
        program: async (input, values) => {
          const { createEditSlugProgram } =
            await import("./utils/EditSlugProgram.js");
          const editSlugProgram = createEditSlugProgram(this);
          return await editSlugProgram(input, values);
        },
      },
    });

    // Edit Tags Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "updatePageTags",
        "value.name": "updatePageTags",
        "value.placeholder": "enterTagsSeparatedByCommas",
      },
      title: this.t.updatePageTags,
      icon: "icons:label",
      tags: ["CMS", "edit", "tags", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/tags",
      context: ["CMS"],
      voice: "edit tags",
      value: {
        name: this.t.updatePageTags,
        machineName: "edit-tags",
        placeholder: this.t.enterTagsSeparatedByCommas,
        // Pre-fill the input with the active page's current tags so the
        // user can edit them in place when launched from Merlin search.
        initialValue: (_values) => {
          const activeItem = toJS(store.activeItem);
          const tags =
            (activeItem && activeItem.metadata && activeItem.metadata.tags) ||
            "";
          return Array.isArray(tags) ? tags.join(", ") : tags;
        },
        program: async (input, values) => {
          const { createEditTagsProgram } =
            await import("./utils/EditTagsProgram.js");
          const editTagsProgram = createEditTagsProgram(this);
          return await editTagsProgram(input, values);
        },
      },
    });

    // Edit Icon Program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "updatePageIcon",
        "value.name": "updatePageIcon",
        "value.placeholder": "typeToSearchIconsByName",
      },
      title: this.t.updatePageIcon,
      icon: "hax:hax2022",
      tags: ["CMS", "edit", "icon", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/icon",
      context: ["CMS"],
      voice: "edit icon",
      value: {
        name: this.t.updatePageIcon,
        machineName: "edit-icon",
        placeholder: this.t.typeToSearchIconsByName,
        program: async (input, values) => {
          const { createEditIconProgram } =
            await import("./utils/EditIconProgram.js");
          const editIconProgram = createEditIconProgram(this);
          return await editIconProgram(input, values);
        },
      },
    });

    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "viewPageRevisions",
        "value.name": "viewPageRevisions",
        "value.placeholder": "openRevisionHistoryForCurrentPage",
      },
      title: this.t.viewPageRevisions,
      icon: "icons:history",
      tags: ["CMS", "edit", "revisions", "history", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/revisions",
      context: ["CMS"],
      voice: "page revisions",
      value: {
        name: this.t.viewPageRevisions,
        machineName: "page-revisions",
        placeholder: this.t.openRevisionHistoryForCurrentPage,
        program: async (_input, _values) => {
          const activeItem = toJS(store.activeItem);
          if (!activeItem || !activeItem.id) {
            return [
              {
                title: this.t.noActivePageSelected,
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: this.t.noActivePage,
              },
            ];
          }
          return [
            {
              title: this.t.openRevisionsFor.replace(
                "{title}",
                () => activeItem.title || this.t.currentPageLower,
              ),
              icon: "icons:history",
              tags: ["revisions", "history", "page"],
              value: {
                target: this,
                method: "_openPageRevisionsForActivePage",
                args: [],
              },
              eventName: "super-daemon-element-method",
              path: "CMS/edit/revisions/current",
            },
          ];
        },
      },
    });

    // Core site navigation programs - available regardless of theme
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "openAPageInThisSite",
        "value.name": "openAPageInThisSite",
      },
      title: this.t.openAPageInThisSite,
      icon: "link",
      tags: ["Site", "navigation"],
      eventName: "super-daemon-run-program",
      context: ["CMS"],
      path: "/site/navigation",
      value: {
        name: this.t.openAPageInThisSite,
        context: "CMS",
        program: async (input, _values) => {
          let results = [];
          const manifest = toJS(store.routerManifest) || toJS(store.manifest);
          if (manifest && manifest.items && manifest.items.length > 0) {
            manifest.items.forEach(async (item) => {
              if (
                item.title.toLowerCase().includes(input.toLowerCase()) ||
                input === ""
              ) {
                results.push({
                  title: item.title,
                  icon: "link",
                  tags: ["CMS", "page"],
                  value: {
                    target: globalThis.location,
                    method: "assign",
                    args: [item.slug],
                  },
                  context: ["CMS"],
                  eventName: "super-daemon-element-method",
                  path: "site/navigation/page",
                });
              }
            });
          }
          return results;
        },
      },
    });
    // Share current page program
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "shareCurrentPageLink",
        "value.name": "shareCurrentPageLink",
      },
      title: this.t.shareCurrentPageLink,
      icon: "editor:insert-link",
      tags: ["CMS", "share", "link", "copy", "url", "page"],
      eventName: "super-daemon-run-program",
      context: ["CMS", "HAX"],
      path: "CMS/action/share/page",
      voice: "share page",
      value: {
        name: this.t.shareCurrentPageLink,
        machineName: "share-page-link",
        program: async (input, values) => {
          const { createSharePageProgram } =
            await import("./utils/SharePageProgram.js");
          const sharePageProgram = createSharePageProgram(this);
          return await sharePageProgram(input, values);
        },
      },
    });

    // Core site page linking program - available in HAX editor for linking to pages
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "insertALinkToAPage",
        "value.name": "insertALinkToAPage",
      },
      title: this.t.insertALinkToAPage,
      icon: "hax:file-link-outline",
      tags: ["Search", "pages", "links"],
      eventName: "super-daemon-run-program",
      path: "/sources/site-pages",
      context: ["HAX", "/"],
      priority: -1,
      value: {
        name: this.t.insertALinkToAPage,
        context: "/",
        program: async (input, _values) => {
          let results = [];
          const manifest = toJS(store.routerManifest) || toJS(store.manifest);
          if (manifest && manifest.items && manifest.items.length > 0) {
            manifest.items.forEach(async (item) => {
              if (
                item.title.toLowerCase().includes(input.toLowerCase()) ||
                input === ""
              ) {
                results.push({
                  title: item.title,
                  icon: "link",
                  tags: ["CMS", "page"],
                  value: {
                    value: "a",
                    eventName: "insert-tag",
                    properties: {
                      href: item.slug,
                      "data-uuid": item.id,
                    },
                    content: item.title,
                  },
                  context: ["HAX", "/", "/sources/site-pages"],
                  eventName: "hax-super-daemon-insert-tag",
                  path: "/sources/site-pages",
                });
              }
            });
          }
          return results;
        },
      },
    });

    // Keyboard shortcuts program - displays all shortcuts (bindings +
    // markdown triggers) from the shared registry and executes the selected
    // one on click.
    SuperDaemonInstance.defineOption({
      i18n: {
        context: this,
        title: "viewKeyboardShortcuts",
        "value.name": "viewKeyboardShortcuts",
      },
      title: this.t.viewKeyboardShortcuts,
      icon: "hardware:keyboard",
      tags: ["help", "shortcuts", "keyboard", "reference"],
      eventName: "super-daemon-run-program",
      path: "CMS/help/keyboard-shortcuts",
      context: ["CMS"],
      value: {
        name: this.t.viewKeyboardShortcuts,
        context: "CMS",
        program: async (input) => {
          const shortcuts = KeyboardShortcutManagerInstance.getForDisplay();
          const results = [];

          shortcuts.forEach((shortcut) => {
            // Filter by search input against the description and label
            const haystack =
              `${shortcut.description || ""} ${shortcut.label || ""}`.toLowerCase();
            if (input === "" || haystack.includes(input.toLowerCase())) {
              results.push({
                title: `${shortcut.description} • ${shortcut.label}`,
                icon: "hardware:keyboard",
                tags: ["shortcut", "keyboard", shortcut.context],
                shortcutLabel: shortcut.label,
                value: {
                  shortcutId: shortcut.id,
                },
                context: ["CMS"],
                eventName: "execute-keyboard-shortcut",
                path: "CMS/help/keyboard-shortcuts",
              });
            }
          });

          return results;
        },
      },
    });

    // Keeps a list of disabled platform features, preventing them from re-enabling during menu switches
    if (store.platformConfig && store.platformConfig.features) {
      Object.keys(store.platformConfig.features).forEach((key) => {
        if (store.platformAllows(key)) return;
        // "insights" is the compatibility platform feature key for the Reports context.
        const contextKey = key === "insights" ? "reports" : key;
        // If an option isn't supported, add it to the array so we don't re-enable it
        Object.keys(this.platformContexts).forEach((type) => {
          if (this.platformContexts[type].includes(contextKey)) {
            this.platformContexts[type] = this.platformContexts[type].filter(
              (item) => item !== contextKey,
            );
            SuperDaemonInstance.removeContext(contextKey);
          }
        });
      });
    }

    // Listen for keyboard shortcut execution from Merlin. The row dispatches
    // its value object as the event detail, so e.detail is the { shortcutId }
    // value we pushed in the program above. Resolve the descriptor by id from
    // the shared registry and dispatch it: bindings run their callback when
    // the condition passes; markdown triggers insert their block in edit mode.
    this.addEventListener("execute-keyboard-shortcut", (e) => {
      if (store.adminMode) {
        return;
      }
      const shortcutId = e.detail && e.detail.shortcutId;
      if (!shortcutId) {
        return;
      }
      const descriptor = KeyboardShortcutManagerInstance.getById(shortcutId);
      if (!descriptor) {
        return;
      }
      if (descriptor.type === "markdown") {
        // Markdown triggers only apply in edit mode; insert the block. Skip
        // tagless markdown entries (e.g. inline-token programs like :::)
        // since they open a Merlin program rather than insert a block.
        if (this.editMode && HAXStore.activeHaxBody && descriptor.tag) {
          HAXStore.activeHaxBody.haxInsert(
            descriptor.tag,
            descriptor.content || "",
            {},
          );
        }
        return;
      }
      // Binding shortcut: run its callback when the condition passes.
      if (
        descriptor.callback &&
        descriptor.condition &&
        descriptor.condition()
      ) {
        const syntheticEvent = new KeyboardEvent("keydown", {
          key: descriptor.key,
          ctrlKey: descriptor.ctrl,
          shiftKey: descriptor.shift,
          altKey: descriptor.alt,
          metaKey: descriptor.meta,
          bubbles: true,
        });
        descriptor.callback(syntheticEvent);
      }
    });

    // load user data
    this.dispatchEvent(
      new CustomEvent("haxcms-load-user-data", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );

    // Auto-trigger welcome program for first-time users
    this.checkAndTriggerWelcomeProgram();
  }
  // enable lab experiments
  enableLabExperiments() {
    // lecture player
    import("@haxtheweb/video-player/lib/lecture-player.js");
    // AI chat bot
    import("@haxtheweb/haxcms-elements/lib/ui-components/magic/site-ai-chat.js");
  }

  unlockAllThemes() {
    store.showAllThemes = true;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-theme-picker-refresh", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    if (typeof store.playSound === "function") {
      store.playSound("coin");
      setTimeout(() => {
        store.playSound("coin2");
      }, 120);
      setTimeout(() => {
        store.playSound("success");
      }, 260);
    }
    if (
      SuperDaemonInstance &&
      typeof SuperDaemonInstance.merlinSpeak === "function"
    ) {
      SuperDaemonInstance.merlinSpeak(this.t.allThemesUnlockedSpeech);
    }
  }

  // Check if user should see welcome program and trigger it
  checkAndTriggerWelcomeProgram() {
    const isMobileWelcomeSuppressed = () => {
      if (globalThis.matchMedia) {
        return globalThis.matchMedia("(max-width: 600px)").matches;
      }
      return this.responsiveSize === "xs";
    };
    // Only trigger if user is logged in and hasn't seen the welcome before
    if (
      store.isLoggedIn &&
      !UserScaffoldInstance.readMemory("hasSeenHaxWelcome")
    ) {
      // Wait for the store and UI to be fully ready
      const triggerWelcome = () => {
        const merlinButton =
          this.shadowRoot && this.shadowRoot.querySelector("#merlin");
        if (store.appReady && merlinButton) {
          // Never auto-trigger welcome mini mode on mobile-sized viewports
          // and only evaluate this after app readiness to avoid startup false
          // positives from default responsive values.
          if (isMobileWelcomeSuppressed()) {
            return;
          }
          // Auto-trigger the welcome program using waveWand for mini mode
          SuperDaemonInstance.waveWand(
            [
              "", // empty search to show all results
              "CMS", // context
              { operation: "welcome" }, // values
              "welcome", // program machine name
              "Show getting started tasks", // display name
            ],
            merlinButton, // target for mini mode
            "coin2", // sound
          );
        } else {
          // Retry after a short delay if not ready yet
          setTimeout(triggerWelcome, 500);
        }
      };

      // Give some time for everything to initialize
      setTimeout(triggerWelcome, 2000);
    }
  }

  // Method to dismiss the welcome program permanently
  dismissWelcomeProgram() {
    // Mark that the user has seen and dismissed the welcome program
    UserScaffoldInstance.writeMemory("hasSeenHaxWelcome", true, "long");

    // Close Merlin
    SuperDaemonInstance.close();

    // Show confirmation toast
    store.toast(this.t.welcomeProgramDismissed, 5000, {
      hat: "good",
    });
  }

  // Method to execute welcome program actions
  executeWelcomeAction(actionType) {
    // Execute the appropriate action based on type
    switch (actionType) {
      case "create-page":
        // Trigger the add page button
        SuperDaemonInstance.close();
        setTimeout(() => {
          this.shadowRoot.querySelector("#addpagebutton").HAXCMSButtonClick();
        }, 100);
        break;
      case "edit-page":
        // Trigger the edit page button
        this._editButtonTap();
        break;

      case "upload-file":
        // Use waveWand to trigger the file upload program
        SuperDaemonInstance.waveWand(
          [
            "", // empty search to show all file options
            "/", // context for file operations
            { operation: "file-upload" },
            "hax-agent",
            this.t.uploadAFile,
          ],
          this.shadowRoot.querySelector("#merlin"),
          "coin2",
        );
        break;

      case "outline-designer":
        // Trigger the Site Outline
        this._outlineButtonTap();
        break;

      case "site-settings":
        // Trigger the site settings
        this._manifestButtonTap({
          target: this.shadowRoot.querySelector("#manifestbtn"),
        });
        break;

      default:
        console.warn("Unknown welcome action type:", actionType);
    }
  }

  // enable view only mode
  enableViewOnlyMode() {
    // Set ViewOnlyMode in UserContext as a session variable
    UserScaffoldInstance.writeMemory("ViewOnlyMode", true, "long");

    // Show toast notification with exit button
    store.showViewOnlyModeToast();

    // Refresh the page to apply view only mode
    setTimeout(() => {
      globalThis.location.reload();
    }, 600);
  }

  goToLocation(location) {
    globalThis.location = location;
  }
  openPageAsDataFormat(format) {
    const supportedFormats = ["json", "yaml", "md", "xml"];
    if (!format) {
      return;
    }
    const normalizedFormat = format.toLowerCase();
    if (supportedFormats.indexOf(normalizedFormat) === -1) {
      return;
    }
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) {
      HAXStore.toast(this.t.noActivePageFound, 3000, "fit-bottom");
      return;
    }
    const baseElement = globalThis.document.querySelector("base");
    const baseUrl =
      (baseElement && baseElement.href) || `${globalThis.location.origin}/`;
    try {
      const url = new URL(
        `x/api/v1/items/${encodeURIComponent(String(activeItem.id).trim())}`,
        baseUrl,
      );
      url.searchParams.set("format", normalizedFormat);
      globalThis.location.href = url.toString();
    } catch {
      // intentionally empty
    }
  }
  getCurrentPageShareLink(activeItem = null) {
    let item = activeItem;
    if (!item) {
      item = toJS(store.activeItem);
    }

    let baseHref = "";
    const baseElement = globalThis.document.querySelector("base");
    if (baseElement && baseElement.href) {
      baseHref = baseElement.href;
    } else {
      baseHref = `${globalThis.location.origin}/`;
    }

    let shareUrl = null;
    try {
      if (item && item.slug) {
        shareUrl = new URL(item.slug, baseHref);
      } else {
        shareUrl = new URL(globalThis.location.href);
      }
    } catch {
      return globalThis.location.href;
    }

    if (shareUrl.searchParams && shareUrl.searchParams.has("format")) {
      shareUrl.searchParams.delete("format");
    }
    shareUrl.hash = "";
    return shareUrl.toString();
  }
  async copyCurrentPageShareLink(link = null, pageTitle = null) {
    if (!pageTitle) {
      pageTitle = this.t.currentPageLower;
    }
    const shareLink = link || this.getCurrentPageShareLink();
    if (!shareLink) {
      HAXStore.toast(this.t.noActivePageFoundToShare, 3000, "fit-bottom");
      return;
    }

    let copied = false;
    try {
      if (
        globalThis.navigator &&
        globalThis.navigator.clipboard &&
        globalThis.navigator.clipboard.writeText
      ) {
        await globalThis.navigator.clipboard.writeText(shareLink);

        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textArea = globalThis.document.createElement("textarea");
        // textContent (not .value): a new textarea shows its text as its
        // value, and this keeps the link a plain string to static analysis
        textArea.textContent = shareLink;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        globalThis.document.body.appendChild(textArea);
        textArea.select();
        copied = globalThis.document.execCommand("copy");
        globalThis.document.body.removeChild(textArea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      HAXStore.toast(
        this.t.linkCopiedFor.replace("{title}", () => pageTitle),
        3000,
        "fit-bottom",
      );
    } else {
      HAXStore.toast(this.t.unableToCopyAutomatically, 4000, "fit-bottom");
    }
  }

  // Export methods from ExportPageProgram
  async exportPageAs(format) {
    const { exportPageAs } = await import("./utils/ExportPageProgram.js");
    return exportPageAs.call(this, format);
  }

  async _exportPageAsHTML(content, title) {
    const { _exportPageAsHTML } = await import("./utils/ExportPageProgram.js");
    return _exportPageAsHTML.call(this, content, title);
  }

  async _exportPageAsMarkdown(content, title) {
    const { _exportPageAsMarkdown } =
      await import("./utils/ExportPageProgram.js");
    return _exportPageAsMarkdown.call(this, content, title);
  }

  async _exportPageAsDOCX(content, title) {
    const { _exportPageAsDOCX } = await import("./utils/ExportPageProgram.js");
    return _exportPageAsDOCX.call(this, content, title);
  }

  async _exportPageAsPDF(content, title) {
    const { _exportPageAsPDF } = await import("./utils/ExportPageProgram.js");
    return _exportPageAsPDF.call(this, content, title);
  }

  async _exportPageAsHAXSchema() {
    const { _exportPageAsHAXSchema } =
      await import("./utils/ExportPageProgram.js");
    return _exportPageAsHAXSchema.call(this);
  }

  // Export methods from ExportSiteProgram
  async exportSiteAs(format, options = {}) {
    const { exportSiteAs } = await import("./utils/ExportSiteProgram.js");
    return exportSiteAs.call(this, format, options);
  }

  async _exportSiteAsHTML(manifest, title, baseUrl) {
    const { _exportSiteAsHTML } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsHTML.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsMarkdown(manifest, title, baseUrl) {
    const { _exportSiteAsMarkdown } =
      await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsMarkdown.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsDOCX(manifest, title, baseUrl) {
    const { _exportSiteAsDOCX } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsDOCX.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsPDF(manifest, title, baseUrl) {
    const { _exportSiteAsPDF } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsPDF.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsEPUB(manifest, title, baseUrl) {
    const { _exportSiteAsEPUB } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsEPUB.call(this, manifest, title, baseUrl);
  }

  async _downloadSiteArchive() {
    const { _downloadSiteArchive } =
      await import("./utils/ExportSiteProgram.js");
    return _downloadSiteArchive.call(this);
  }

  async _exportSiteAsSkeleton(manifest, title, baseUrl, options = {}) {
    const { _exportSiteAsSkeleton } =
      await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsSkeleton.call(this, manifest, title, baseUrl, options);
  }

  // Utility methods from both export programs
  _downloadFile(content, filename, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    this._downloadBlob(blob, filename);
  }

  _downloadBlob(blob, filename) {
    const link = globalThis.document.createElement("a");
    link.href = globalThis.URL.createObjectURL(blob);
    link.download = filename;
    link.target = "_blank";
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    globalThis.URL.revokeObjectURL(link.href);
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // remember where the bar's buttons sit before a mode switch so the
    // ones that stay can slide to their new place (see _animateModeSwitch)
    if (
      changedProperties.has("editMode") &&
      changedProperties.get("editMode") !== undefined &&
      this.shadowRoot
    ) {
      this.__modeSwitchRects = this._topbarButtonRects();
    }
    // Derive reactive display state in willUpdate so it batches into the
    // current update cycle. Setting rpgHat / __editIcon / __editText in
    // updated() scheduled a redundant second update (Lit change-in-update
    // warning). _editModeChanged (called from updated) still sets __editIcon
    // but that becomes a no-op since willUpdate already set it.
    if (
      changedProperties.has("userMenuOpen") &&
      changedProperties.get("userMenuOpen") !== undefined
    ) {
      this.rpgHat = this.userMenuOpen ? "edit" : "none";
    }
    if (changedProperties.has("editMode")) {
      if (this.editMode) {
        this.rpgHat = "construction";
        this.__editIcon = "icons:save";
      } else {
        this.rpgHat = "none";
        this.__editIcon = "icons:create";
      }
      // Update edit button label when mode changes
      this._updateEditButtonLabel();
    }
    if (changedProperties.has("responsiveSize")) {
      this._updateEditButtonLabel();
    }
    // Recompute __editText when the i18n t object loads/changes so the edit
    // button label reflects the active locale. Without this, __editText stays
    // stale (the initial English default) until the next editMode/responsiveSize
    // change, and _editModeChanged (in updated) re-setting __editText here
    // would schedule a redundant second update (Lit change-in-update warning).
    if (changedProperties.has("t")) {
      this._updateEditButtonLabel();
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("responsiveSize") &&
      this.responsiveSize !== "xs" &&
      this.merlinPhoneOpen
    ) {
      this.merlinPhoneOpen = false;
    }
    // the bar's groups change width with edit mode; keep Merlin's popover
    // the same width as its field
    if (
      changedProperties.has("editMode") ||
      changedProperties.has("responsiveSize")
    ) {
      this._syncMerlinPopover();
    }
    if (changedProperties.has("editMode") && this.__modeSwitchRects) {
      this._animateModeSwitch(this.__modeSwitchRects);
      this.__modeSwitchRects = null;
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        // Capture the user's scroll position BEFORE _editModeChanged writes
        // store.editMode. That store write triggers the theme + hax-body
        // autoruns to reflect the edit-mode change, which reflows the page
        // (hiding/showing #slot, mounting/unmounting the editor) and can
        // clamp or otherwise move scrollY. Capturing here (editor UI's own
        // update, before the store propagates) preserves the real position
        // for hax-body to restore on BOTH entering and exiting edit mode.
        if (oldValue !== undefined) {
          HAXStore.__editModeScrollY =
            globalThis.scrollY != null
              ? globalThis.scrollY
              : globalThis.pageYOffset;
        }
        if (oldValue !== undefined) {
          SuperDaemonInstance.close();
        }
        // observer (side effects: store.editMode, tray, daemon contexts;
        // __editIcon set inside is a no-op since willUpdate already set it)
        this._editModeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("edit-mode-changed", {
            detail: this[propName],
          }),
        );
      }
      if (propName == "manifestEditMode") {
        // observer
        this._manifestEditModeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("manifest-edit-mode-changed", {
            detail: this[propName],
          }),
        );
      }
    });
  }
  _redoChanged(e) {
    this.canRedo = e.detail.value;
  }
  _undoChanged(e) {
    this.canUndo = e.detail.value;
  }
  static get properties() {
    return {
      ...super.properties,
      t: {
        type: Object,
      },
      rpgWalk: { type: Boolean },
      userName: {
        type: String,
        attribute: "user-name",
      },
      activeDrag: {
        type: Boolean,
      },
      activeType: {
        type: String,
      },
      activeNode: {
        type: Object,
      },
      activeTagName: {
        type: String,
      },
      /**
       * If we can currently undo based on stack position
       */
      canUndo: {
        type: Boolean,
        attribute: "can-undo",
      },
      /**
       * If we can currently redo based on stack position
       */
      canRedo: {
        type: Boolean,
        attribute: "can-redo",
      },
      rpgHat: { type: String },
      userPicture: {
        type: String,
        attribute: "user-picture",
      },
      /** avatar code from the backend (userData.avatarCode), when it stores one */
      userAvatarCode: {
        type: String,
        attribute: "user-avatar-code",
      },
      userMenuOpen: {
        type: Boolean,
      },
      /** Site settings quick links (under the house) are open */
      siteMenuOpen: {
        type: Boolean,
      },
      soundIcon: { type: String },
      darkMode: { type: Boolean, reflect: true, attribute: "dark-mode" },
      backLink: {
        type: String,
      },
      /**
       * On a phone, Merlin is open across the whole bar
       */
      merlinPhoneOpen: {
        type: Boolean,
        reflect: true,
        attribute: "merlin-phone-open",
      },
      backText: {
        type: String,
      },
      __editIcon: {
        type: String,
      },
      __editText: {
        type: String,
      },
      /**
       * small visual lock that events break on initial paint
       */
      painting: {
        type: Boolean,
        reflect: true,
      },
      /**
       * page allowed
       */
      pageAllowed: {
        type: Boolean,
        attribute: "page-allowed",
        reflect: true,
      },
      /**
       * if the page is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * Manifest editing state
       */
      manifestEditMode: {
        type: Boolean,
        attribute: "manifest-edit-mode",
        reflect: true,
      },
      activeTitle: {
        type: String,
        attribute: "active-title",
      },
      activeItem: {
        type: Object,
      },
      manifest: {
        type: Object,
      },
      /**
       * Current active tray detail (content-edit, content-add, content-map, view-source)
       * mirrored from HAXStore.haxTray.trayDetail so the top bar can expose state
       */
      trayDetail: {
        type: String,
        attribute: "tray-detail",
        reflect: true,
      },
      themePreviewOpen: {
        type: Boolean,
        attribute: "theme-preview-open",
        reflect: true,
      },
      themePreviewCollapsed: {
        type: Boolean,
      },
      __themePreviewReady: {
        type: Boolean,
      },
      /**
       * Whether we're currently on an internal route
       */
      onInternalRoute: {
        type: Boolean,
      },
      /**
       * Fine-grained default contexts under Merlin (used with platformConfig)
       */
      platformContexts: {
        type: Array,
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // Merlin's popover covers its field exactly
    this.__boundSyncMerlinPopover = this._syncMerlinPopover.bind(this);
    globalThis.addEventListener("resize", this.__boundSyncMerlinPopover);
    this.updateComplete.then(() => this._syncMerlinPopover());

    // Register keyboard shortcuts
    this._registerKeyboardShortcuts();
    HAXCMSKeyboardShortcutsInstance.enable();

    // Window-level drag listeners so the top-bar drop zone is detectable
    // from anywhere on the screen when NOT in edit mode.
    this.__boundWindowDragEnter = this.__windowDragEnter.bind(this);
    this.__boundWindowDragLeave = this.__windowDragLeave.bind(this);
    this.__boundWindowDragOver = this.__windowDragOver.bind(this);
    this.__boundWindowDrop = this.__windowDrop.bind(this);
    this.__boundWindowDropCleanup = this.__windowDropCleanup.bind(this);
    globalThis.addEventListener("dragenter", this.__boundWindowDragEnter);
    globalThis.addEventListener("dragleave", this.__boundWindowDragLeave);
    globalThis.addEventListener("dragover", this.__boundWindowDragOver);
    globalThis.addEventListener("drop", this.__boundWindowDrop);
    globalThis.addEventListener("drop", this.__boundWindowDropCleanup, true);

    // Mirror HAX tray detail into this element so we can expose and style active state.
    // IMPORTANT: use the observable HAXStore.trayDetail, not haxTray.trayDetail,
    // so MobX actually tracks and updates this value.
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(HAXStore.trayDetail);
        Promise.resolve().then(() => {
          this.trayDetail = _mobx_val_0;
        });
      }),
    );

    // detect changes in platformConfig for internal testing with Merlin
    this.__disposer.push(
      autorun((_reaction) => {
        if (store.platformConfig) {
          // Don't redundantly reload the page on first boot
          if (!this.__initialPlatformConfig) {
            this.requestUpdate();
          } else {
            this.__initialPlatformConfig = false;
          }
        }
      }),
    );

    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.userData.userName);
        const _mobx_val_1 = toJS(store.userData.userPicture);
        const _mobx_val_2 = toJS(store.userData.avatarCode);
        Promise.resolve().then(() => {
          if (store.userData) {
            this.userName = _mobx_val_0;
            this.userPicture = _mobx_val_1;
            this.userAvatarCode = _mobx_val_2 || "";
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.editMode);
        Promise.resolve().then(() => {
          const previousEditMode = this.editMode;
          const newEditMode = _mobx_val_0;
          this.editMode = newEditMode;
          UserScaffoldInstance.writeMemory("editMode", this.editMode);
          const autoOpenTray = this.shouldAutoOpenTrayOnEdit();
          // When we first enter edit mode and there is an active node selected,
          // prefer the Configure tab over Blocks as the default tray panel.
          if (
            !previousEditMode &&
            newEditMode &&
            autoOpenTray &&
            HAXStore.activeNode &&
            HAXStore.activeNode.tagName
          ) {
            HAXStore.trayDetail = "content-edit";
            if (HAXStore.haxTray) {
              HAXStore.haxTray.trayDetail = "content-edit";
              HAXStore.haxTray.collapsed = !autoOpenTray;
            }
          } else if (!previousEditMode && newEditMode && !autoOpenTray) {
            HAXStore.trayDetail = "no-active-tray";
            if (HAXStore.haxTray) {
              HAXStore.haxTray.trayDetail = "no-active-tray";
              HAXStore.haxTray.collapsed = true;
            }
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.adminMode);
        Promise.resolve().then(() => {
          this.manifestEditMode = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.pageAllowed);
        Promise.resolve().then(() => {
          this.pageAllowed = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          const activeItem = _mobx_val_0;
          this.activeItem = activeItem;
          // update buttons to match since we got a state response
          setTimeout(() => {
            if (!this.shadowRoot) return;
            if (globalThis.appSettings && globalThis.appSettings.backText) {
              this.backText = globalThis.appSettings.backText;
            }
          }, 100);

          if (activeItem && activeItem.id) {
            this.activeTitle = activeItem.title;
            this.onInternalRoute = activeItem._internalRoute || false;
            // Use the store method to determine if editing is allowed
            const supportsEditor = store.currentRouteSupportsHaxEditor();
            // Show the button if editor is supported, regardless of lock status
            store.pageAllowed = supportsEditor;
          } else {
            this.onInternalRoute = false;
            store.pageAllowed = false;
          }
          if (
            this.themePreviewOpen &&
            this._getAdminRoutePathFromLocation() !== "theme-preview"
          ) {
            this.__currentAdminRoutePath = "theme-preview";
            store.adminMode = true;
            this._setAdminRoutePathOnLocation("theme-preview", "replace");
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.appReady);
        const _mobx_val_1 = toJS(store.isLoggedIn);
        Promise.resolve().then(() => {
          const appReady = _mobx_val_0;
          const isLoggedIn = _mobx_val_1;
          const routePath = this._getAdminRoutePathFromLocation();
          if (
            appReady &&
            isLoggedIn &&
            this.themePreviewOpen &&
            routePath !== "theme-preview"
          ) {
            this.__currentAdminRoutePath = "theme-preview";
            store.adminMode = true;
            this._setAdminRoutePathOnLocation("theme-preview", "replace");
          }
          if (
            appReady &&
            isLoggedIn &&
            routePath &&
            !this.__currentAdminRoutePath
          ) {
            this._applyAdminRoutePath(routePath, 0, true);
          }
        });
      }),
    );
  }
  disconnectedCallback() {
    // Unregister keyboard shortcuts
    HAXCMSKeyboardShortcutsInstance.disable();
    globalThis.removeEventListener("resize", this.__boundSyncMerlinPopover);
    if (SuperDaemonInstance && SuperDaemonInstance.style) {
      [
        ...Object.keys(MERLIN_DARK),
        "--super-daemon-search-width",
        "--super-daemon-width",
      ].forEach((name) => SuperDaemonInstance.style.removeProperty(name));
    }
    Object.keys(this.__menuHoverTimers || {}).forEach((key) => {
      clearTimeout(this.__menuHoverTimers[key]);
    });

    globalThis.removeEventListener("dragenter", this.__boundWindowDragEnter);
    globalThis.removeEventListener("dragleave", this.__boundWindowDragLeave);
    globalThis.removeEventListener("dragover", this.__boundWindowDragOver);
    globalThis.removeEventListener("drop", this.__boundWindowDrop);
    globalThis.removeEventListener("drop", this.__boundWindowDropCleanup, true);
    for (let i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }

  /**
   * Update edit button label with appropriate shortcut
   */
  _updateEditButtonLabel() {
    if (this.editMode) {
      this.__editText = `${this.t.save} • Ctrl⇧S`;
    } else {
      this.__editText = `${this.t.edit} • Ctrl⇧E`;
    }
  }
  _closeOpenContextMenus(excludeMenu = null, root = globalThis.document) {
    if (!root || !root.querySelectorAll) {
      return;
    }
    const menus = root.querySelectorAll("simple-context-menu");
    menus.forEach((menu) => {
      if (
        menu !== excludeMenu &&
        menu.open &&
        typeof menu.close === "function"
      ) {
        menu.close();
      }
    });
    const descendants = root.querySelectorAll("*");
    descendants.forEach((node) => {
      if (node.shadowRoot) {
        this._closeOpenContextMenus(excludeMenu, node.shadowRoot);
      }
    });
  }

  _openShortcutMenu(button, menu) {
    if (!button || !menu) {
      return false;
    }
    const rect = button.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }
    this._closeOpenContextMenus(menu);
    button.focus();
    if (menu.open) {
      menu.close();
    }
    if (typeof menu.openMenu === "function") {
      menu.openMenu(button);
    } else {
      button.click();
    }
    return true;
  }

  _triggerPageActionsShortcut() {
    const activeItem = toJS(store.activeItem);
    const activeId = activeItem && activeItem.id ? activeItem.id : null;
    let pageBreak = null;
    if (activeId) {
      pageBreak = globalThis.document.querySelector(
        `page-break[item-id="${activeId}"]`,
      );
    }
    if (!pageBreak) {
      pageBreak = globalThis.document.querySelector("page-break");
    }
    if (!pageBreak || !pageBreak.shadowRoot) {
      return false;
    }
    const button = pageBreak.shadowRoot.querySelector("#pageactionsbtn");
    const menu = pageBreak.shadowRoot.querySelector("#menu");
    return this._openShortcutMenu(button, menu);
  }

  _triggerOutlineActionsShortcut() {
    const operations = store.pageOperationsElement;
    if (!operations || !operations.isConnected || !operations.shadowRoot) {
      return false;
    }
    const button = operations.shadowRoot.querySelector("#outlineactionsbtn");
    const menu = operations.shadowRoot.querySelector("simple-context-menu");
    return this._openShortcutMenu(button, menu);
  }

  _getDeepActiveElement(root = globalThis.document) {
    if (!root || !root.activeElement) {
      return null;
    }
    let activeElement = root.activeElement;
    while (
      activeElement &&
      activeElement.shadowRoot &&
      activeElement.shadowRoot.activeElement
    ) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
  }

  _isElementInsideTag(element, tagName) {
    if (!element || !tagName) {
      return false;
    }
    const normalizedTag = tagName.toUpperCase();
    let current = element;
    while (current) {
      if (current.tagName === normalizedTag) {
        return true;
      }
      const root = current.getRootNode ? current.getRootNode() : null;
      if (root && root.host) {
        current = root.host;
      } else {
        current = current.parentNode;
      }
    }
    return false;
  }

  _focusFirstFocusableElement(root) {
    if (!root || !root.querySelectorAll) {
      return null;
    }
    const selector =
      'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
    const candidates = root.querySelectorAll(selector);
    for (const candidate of candidates) {
      if (
        candidate &&
        !candidate.hidden &&
        candidate.getAttribute("aria-hidden") !== "true" &&
        typeof candidate.focus === "function"
      ) {
        const style = globalThis.getComputedStyle(candidate);
        if (style.display !== "none" && style.visibility !== "hidden") {
          return candidate;
        }
      }
    }
    const descendants = root.querySelectorAll("*");
    for (const node of descendants) {
      if (node.shadowRoot) {
        const nestedTarget = this._focusFirstFocusableElement(node.shadowRoot);
        if (nestedTarget) {
          return nestedTarget;
        }
      }
    }
    return null;
  }

  _focusTrayForActiveNodeOptions() {
    if (!HAXStore.haxTray || !HAXStore.haxTray.shadowRoot) {
      return false;
    }
    HAXStore.haxTray.collapsed = false;
    HAXStore.haxTray.trayDetail = "content-edit";
    const tryFocusTray = () => {
      let target = this._focusFirstFocusableElement(
        HAXStore.haxTray.shadowRoot.querySelector("#settingsform"),
      );
      if (!target) {
        target = HAXStore.haxTray.shadowRoot.querySelector("#tray-detail");
      }
      if (target && typeof target.focus === "function") {
        target.focus();
        return true;
      }
      return false;
    };
    if (!tryFocusTray()) {
      setTimeout(() => {
        tryFocusTray();
      }, 50);
    }
    return true;
  }

  _focusCurrentActiveNode() {
    if (
      !HAXStore.activeNode ||
      typeof HAXStore.activeNode.focus !== "function"
    ) {
      return false;
    }
    HAXStore.activeNode.focus();
    if (
      HAXStore.isTextElement(HAXStore.activeNode) &&
      typeof HAXStore._positionCursorInNode === "function"
    ) {
      try {
        const range = globalThis.document.createRange();
        const selection = HAXStore.getSelection();
        range.selectNodeContents(HAXStore.activeNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch {
        HAXStore._positionCursorInNode(HAXStore.activeNode, 0);
      }
    }
    return true;
  }

  _triggerEditorTrayFocusShortcut() {
    if (!this.editMode || !HAXStore.haxTray) {
      return false;
    }
    const activeElement = this._getDeepActiveElement();
    const focusedInTray = this._isElementInsideTag(activeElement, "hax-tray");
    if (focusedInTray) {
      return this._focusCurrentActiveNode();
    }
    return this._focusTrayForActiveNodeOptions();
  }

  /**
   * Register all keyboard shortcuts for HAXcms
   */
  _registerKeyboardShortcuts() {
    // Ctrl+Shift+S - Save (only when in edit mode)
    HAXCMSKeyboardShortcutsInstance.register({
      id: "cms-save",
      key: "S",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._editButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.pageAllowed && this.editMode,
      description: this.t.shortcutSavePageAndExitEditMode,
      context: "edit",
    });

    // Ctrl+Shift+E - Edit (only when NOT in edit mode)
    HAXCMSKeyboardShortcutsInstance.register({
      id: "cms-edit",
      key: "E",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._editButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.pageAllowed && !this.editMode,
      description: this.t.shortcutEnterEditMode,
      context: "view",
    });

    // Ctrl+Shift+/ - Cancel editing (register as / not ?)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "/",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._cancelButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.editMode,
      description: this.t.shortcutCancelEditing,
      context: "edit",
    });

    // Numbered shortcuts - contextual based on edit mode
    // Ctrl+Shift+1 - View source (edit) OR Edit page (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "1",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (this.editMode) {
          // Edit mode: View source
          if (HAXStore.haxTray) {
            if (HAXStore.haxTray.trayDetail === "view-source") {
              HAXStore.haxTray.collapsed = true;
            } else {
              HAXStore.haxTray.trayDetail = "view-source";
              HAXStore.haxTray.shadowRoot
                .querySelector("#view-source")
                .openSource();
              HAXStore.haxTray.collapsed = false;
            }
          }
        } else {
          // Non-edit mode: Edit page
          this._editButtonTap(e);
        }
      },
      condition: () => store.isLoggedIn,
      description: this.t.shortcutViewSourceOrEditPage,
      context: "global",
    });

    // Ctrl+Shift+2 - Page structure (edit) OR Page actions (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "2",
      ctrl: true,
      shift: true,
      callback: (_e) => {
        if (this.editMode) {
          // Edit mode: Page structure
          if (HAXStore.haxTray) {
            if (HAXStore.haxTray.trayDetail === "content-map") {
              HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
            } else {
              HAXStore.haxTray.trayDetail = "content-map";
              HAXStore.haxTray.collapsed = false;
            }
          }
        } else {
          // Non-edit mode: Page actions
          if (store.platformAllows("pageBreak")) {
            this._triggerPageActionsShortcut();
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: this.t.shortcutPageStructureOrPageActions,
      context: "global",
    });

    // Ctrl+Shift+3 - Blocks browser (edit) OR Add page (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      id: "cms-add-page",
      key: "3",
      ctrl: true,
      shift: true,
      callback: (_e) => {
        if (this.editMode) {
          // Edit mode: Blocks browser
          if (HAXStore.haxTray) {
            if (HAXStore.haxTray.trayDetail === "content-add") {
              HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
            } else {
              HAXStore.haxTray.trayDetail = "content-add";
              HAXStore.haxTray.collapsed = false;
            }
          }
        } else {
          // Non-edit mode: Add page
          if (store.platformAllows("addPage")) {
            const addButton = this.shadowRoot.querySelector("#addpagebutton");
            if (addButton) {
              addButton.HAXCMSButtonClick();
            }
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: this.t.shortcutBlocksBrowserOrAddPage,
      context: "global",
    });
    // Ctrl+Shift+4 - Configure panel (edit) OR Site outline actions (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "4",
      ctrl: true,
      shift: true,
      callback: (_e) => {
        if (this.editMode) {
          // Edit mode: Open configure panel
          if (HAXStore.haxTray) {
            HAXStore.haxTray.trayDetail = "content-edit";
            HAXStore.haxTray.collapsed = false;
          }
        } else {
          // Non-edit mode: Site outline actions
          if (store.platformAllows("outlineDesigner")) {
            this._triggerOutlineActionsShortcut();
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: this.t.shortcutConfigurePanelOrOutlineActions,
      context: "global",
    });

    // Ctrl+Shift+5 - Outline designer (view mode)
    HAXCMSKeyboardShortcutsInstance.register({
      id: "cms-outline",
      key: "5",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._outlineButtonTap(e);
      },
      condition: () =>
        store.isLoggedIn &&
        !this.editMode &&
        store.platformAllows("outlineDesigner"),
      description: this.t.shortcutOpenSiteOutlineDesigner,
      context: "view",
    });

    // Ctrl+Shift+6 - Site settings (view mode)
    HAXCMSKeyboardShortcutsInstance.register({
      id: "cms-site-settings",
      key: "6",
      ctrl: true,
      shift: true,
      callback: () => {
        const siteSettingsButton =
          this.shadowRoot.querySelector("#manifestbtn");
        if (siteSettingsButton && !siteSettingsButton.disabled) {
          this._manifestButtonTap({ target: siteSettingsButton });
        }
      },
      condition: () => store.isLoggedIn && !this.editMode,
      description: this.t.shortcutOpenSiteSettingsMenu,
      context: "view",
    });

    // Ctrl+Shift+7 - User menu (view mode)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "7",
      ctrl: true,
      shift: true,
      callback: () => {
        const userMenuButton = this.shadowRoot.querySelector("#menubtn");
        if (userMenuButton) {
          this.toggleMenu();
        }
      },
      condition: () => store.isLoggedIn && !this.editMode,
      description: this.t.shortcutOpenUserMenu,
      context: "view",
    });

    // Ctrl+Shift+' - Jump between text editing and tray options
    HAXCMSKeyboardShortcutsInstance.register({
      key: "'",
      ctrl: true,
      shift: true,
      callback: () => {
        this._triggerEditorTrayFocusShortcut();
      },
      condition: () => store.isLoggedIn && this.editMode,
      description: this.t.shortcutJumpBetweenTextAndTray,
      context: "edit",
      allowInInput: true,
    });
  }

  /**
   * toggle state on button tap
   */
  _editButtonTap(e) {
    // Check if the active page is locked
    const activeItem = toJS(store.activeItem);
    if (
      activeItem &&
      activeItem.metadata &&
      activeItem.metadata.locked &&
      !this.editMode
    ) {
      store.toast(this.t.pageLockedCannotEdit, 3000, { hat: "error" });
      store.playSound("error");
      return false;
    }

    if (
      this.editMode &&
      HAXStore.haxTray &&
      HAXStore.haxTray.trayDetail === "view-source"
    ) {
      this._confirmHtmlSourceExit(e);
      return false;
    }
    this._toggleEditMode();
  }
  _confirmHtmlSourceExit(e) {
    let confirmDialog = globalThis.document.createElement("hax-confirm-dialog");
    confirmDialog.message = this.t.confirmHtmlSourceExit;
    confirmDialog.confirmLabel = this.t.save;
    confirmDialog.cancelLabel = this.t.cancel;
    confirmDialog.closeOnConfirm = false;
    confirmDialog.confirmCallback = this._toggleEditMode.bind(this);
    confirmDialog.cancelCallback = () => store.playSound("error");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.saveBeforeLeavingSourceEditor,
        styles: SITE_ADMIN_CONFIRM_STYLES,
        elements: { content: confirmDialog },
        invokedBy:
          (e && e.target) ||
          this.shadowRoot.querySelector("#editbutton") ||
          this,
        clone: false,
        modal: true,
        showClose: false,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  _toggleEditMode() {
    store.playSound("click");
    this.editMode = !this.editMode;
    // save button shifted to edit
    if (!this.editMode) {
      this.dispatchEvent(
        new CustomEvent("haxcms-save-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: store.activeItem,
        }),
      );
    }
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  _normalizeAdminRoutePath(path = "") {
    if (typeof path !== "string") {
      return null;
    }
    let normalized = path.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    normalized = trimSlashes(normalized);
    if (!normalized) {
      return null;
    }
    if (ADMIN_ROUTE_PATHS.has(normalized)) {
      return normalized;
    }
    return null;
  }
  _adminRoutePathFromQueryValue(path = "") {
    if (typeof path !== "string") {
      return null;
    }
    const normalized = trimSlashes(path.trim().toLowerCase());
    if (!normalized) {
      return null;
    }
    if (
      Object.prototype.hasOwnProperty.call(
        ADMIN_QUERY_PATH_TO_ROUTE,
        normalized,
      )
    ) {
      return ADMIN_QUERY_PATH_TO_ROUTE[normalized];
    }
    return null;
  }
  _adminRouteQueryValueFromPath(path = "") {
    const normalizedPath = this._normalizeAdminRoutePath(path);
    if (!normalizedPath) {
      return null;
    }
    if (
      Object.prototype.hasOwnProperty.call(
        ADMIN_ROUTE_QUERY_PATHS,
        normalizedPath,
      )
    ) {
      return ADMIN_ROUTE_QUERY_PATHS[normalizedPath];
    }
    return null;
  }
  _getAdminRoutePathFromLocation() {
    const params = new URLSearchParams(globalThis.location.search);
    return this._adminRoutePathFromQueryValue(params.get("admin"));
  }
  _normalizeAdminRouteNodeId(nodeId = "") {
    if (typeof nodeId === "number") {
      return `${nodeId}`;
    }
    if (typeof nodeId !== "string") {
      return null;
    }
    const normalized = nodeId.trim();
    if (!normalized) {
      return null;
    }
    return normalized;
  }
  _getAdminRouteNodeIdFromLocation() {
    const params = new URLSearchParams(globalThis.location.search);
    return this._normalizeAdminRouteNodeId(params.get("adminNode"));
  }
  _setAdminRoutePathOnLocation(
    path = null,
    historyMode = "push",
    routeContext = {},
  ) {
    const params = new URLSearchParams(globalThis.location.search);
    const normalizedPath = path ? this._normalizeAdminRoutePath(path) : null;
    const routeNodeId = this._normalizeAdminRouteNodeId(
      routeContext ? routeContext.nodeId : null,
    );
    if (normalizedPath) {
      params.set("admin", this._adminRouteQueryValueFromPath(normalizedPath));
    } else {
      params.delete("admin");
    }
    if (normalizedPath === "revisions" && routeNodeId) {
      params.set("adminNode", routeNodeId);
    } else {
      params.delete("adminNode");
    }
    const nextSearch = params.toString();
    const nextUrl = `${globalThis.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${globalThis.location.hash || ""}`;
    if (historyMode === "replace") {
      globalThis.history.replaceState(globalThis.history.state, "", nextUrl);
    } else {
      globalThis.history.pushState(globalThis.history.state, "", nextUrl);
    }
  }
  _clearAdminRoutePathFromLocation(historyMode = "replace") {
    this.__currentAdminRoutePath = null;
    store.adminMode = false;
    this._setAdminRoutePathOnLocation(null, historyMode);
  }
  _adminRouteCapability(path = "") {
    // route -> platform capability lives in the site admin section registry
    return siteAdminRouteCapability(path);
  }
  _adminRouteAllowed(path = "") {
    const normalizedPath = this._normalizeAdminRoutePath(path);
    if (!normalizedPath || !store.isLoggedIn) {
      return false;
    }
    const capability = this._adminRouteCapability(normalizedPath);
    if (!capability) {
      return true;
    }
    return store.platformAllows(capability);
  }
  _syncAdminRoutePath(path, routeOptions = {}) {
    const normalizedPath = this._normalizeAdminRoutePath(path);
    if (!normalizedPath) {
      return false;
    }
    if (!this._adminRouteAllowed(normalizedPath)) {
      return false;
    }
    this.__currentAdminRoutePath = normalizedPath;
    store.adminMode = true;
    if (routeOptions.skipUrlUpdate) {
      return true;
    }
    const currentPath = this._getAdminRoutePathFromLocation();
    const routeNodeId =
      normalizedPath === "revisions"
        ? this._normalizeAdminRouteNodeId(
            routeOptions ? routeOptions.nodeId : null,
          )
        : null;
    const currentNodeId =
      normalizedPath === "revisions"
        ? this._getAdminRouteNodeIdFromLocation()
        : null;
    if (
      currentPath === normalizedPath &&
      (normalizedPath !== "revisions" || currentNodeId === routeNodeId)
    ) {
      return true;
    }
    this._setAdminRoutePathOnLocation(
      normalizedPath,
      routeOptions.historyMode || "push",
      {
        nodeId: routeNodeId,
      },
    );
    return true;
  }
  setAdminPath(path, historyMode = "push", silent = false, routeContext = {}) {
    const syncOptions = {
      historyMode: historyMode,
    };
    if (
      routeContext &&
      typeof routeContext === "object" &&
      Object.prototype.hasOwnProperty.call(routeContext, "nodeId")
    ) {
      syncOptions.nodeId = routeContext.nodeId;
    }
    if (!this._syncAdminRoutePath(path, syncOptions)) {
      return false;
    }
    this._applyAdminRoutePath(
      this._getAdminRoutePathFromLocation(),
      0,
      false,
      silent,
    );
    return true;
  }
  _canApplyAdminRoutePath() {
    return (
      !!this.shadowRoot &&
      !!this.shadowRoot.querySelector("#manifestbtn") &&
      store.appReady &&
      !this.painting &&
      store.isLoggedIn
    );
  }
  _openAdminRouteFromPath(path, routeOptions = {}) {
    const normalizedPath = this._normalizeAdminRoutePath(path);
    if (!normalizedPath || !this._adminRouteAllowed(normalizedPath)) {
      return false;
    }
    if (normalizedPath !== "theme-preview" && this.themePreviewOpen) {
      this._closeThemePreview(false);
    }
    const invokedTarget =
      this.shadowRoot && this.shadowRoot.querySelector("#manifestbtn")
        ? this.shadowRoot.querySelector("#manifestbtn")
        : null;
    const routeNodeId =
      normalizedPath === "revisions"
        ? this._normalizeAdminRouteNodeId(
            routeOptions ? routeOptions.nodeId : null,
          ) || this._getAdminRouteNodeIdFromLocation()
        : null;
    switch (normalizedPath) {
      case "admin":
        // Site settings opens on Reports (the site's dashboard); the card
        // launcher is the fallback when Features turn Reports off
        if (this._adminRouteAllowed("reports")) {
          this.setAdminPath("reports", "replace", false);
          return true;
        }
        this._manifestButtonTap({ target: invokedTarget }, routeOptions);
        return true;
      case "structure":
        this._outlineButtonTap(null, true, "Structure", routeOptions);
        return true;
      case "structure-import":
        if (
          !this.__importHierarchyItems ||
          this.__importHierarchyItems.length === 0
        ) {
          this._outlineButtonTap(null, true, "Structure", {
            skipUrlUpdate: true,
          });
          return true;
        }
        this._openImportHierarchy(this.__importHierarchyItems, true, {
          skipUrlUpdate: true,
          silent: true,
        });
        return true;
      case "appearance":
        this._openAppearanceSettings(true, "Appearance", routeOptions);
        return true;
      case "theme-preview":
        globalThis.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
        this._openThemePreview(null, routeOptions);
        return true;
      case "site":
        this._openDetailsAdmin(true, "Details", routeOptions);
        return true;
      case "about":
        this._openAboutAdmin(true, this.t.about, routeOptions);
        return true;
      case "seo":
        this._openSeoAdmin(true, "seo", routeOptions);
        return true;
      case "author":
        this._openSeoAdmin(true, "author", routeOptions);
        return true;
      case "content":
        this._openContentAdmin(true, routeOptions);
        return true;
      case "views":
        this._openViewsAdmin(true, routeOptions);
        return true;
      case "revisions":
        this._openPageRevisions(routeNodeId, "", {
          skipUrlUpdate: true,
          silent: routeOptions && routeOptions.silent === true,
          nodeId: routeNodeId,
          invokedBy:
            routeOptions &&
            routeOptions.invokedBy &&
            routeOptions.invokedBy.nodeType === 1
              ? routeOptions.invokedBy
              : invokedTarget,
          fromContentAdmin: true,
        });
        return true;
      case "files":
        this._openFilesAdmin(true, routeOptions);
        return true;
      case "transfer":
        this._openImportExportDashboard(true, "Import / Export", routeOptions);
        return true;
      case "reports":
      case "reports-accessibility":
      case "reports-content":
      case "reports-links":
      case "reports-media":
      case "reports-instructional":
      case "reports-learning":
      case "reports-cadence":
      case "reports-freshness":
      case "reports-metadata":
      case "reports-components":
        this._reportsButtonTap(
          null,
          true,
          Object.assign({}, routeOptions, { reportsRoute: normalizedPath }),
        );
        return true;
      case "blocks":
        this._openAllowedBlocksSettings(true, "Blocks", routeOptions);
        return true;
      case "editor":
        this._openEditorSettings(true, "Editor", routeOptions);
        return true;
      case "features":
        this._openPlatformSettings(true, "Features", routeOptions);
        return true;
      default:
        return false;
    }
  }
  _applyAdminRoutePath(
    path,
    attempt = 0,
    fromInitialLoad = false,
    silent = true,
  ) {
    const normalizedPath = this._normalizeAdminRoutePath(path);
    if (!normalizedPath) {
      return;
    }
    if (!this._canApplyAdminRoutePath()) {
      if (attempt < 120) {
        setTimeout(() => {
          this._applyAdminRoutePath(
            normalizedPath,
            attempt + 1,
            fromInitialLoad,
            silent,
          );
        }, 100);
      }
      return;
    }
    const routeNodeId =
      normalizedPath === "revisions"
        ? this._getAdminRouteNodeIdFromLocation()
        : null;
    const opened = this._openAdminRouteFromPath(normalizedPath, {
      skipUrlUpdate: true,
      silent: silent,
      nodeId: routeNodeId,
    });
    if (!opened) {
      this._clearAdminRoutePathFromLocation("replace");
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        }),
      );
    }
  }
  _applyInitialAdminRoutePath() {
    const routePath = this._getAdminRoutePathFromLocation();
    if (routePath) {
      this._applyAdminRoutePath(routePath, 0, true);
    }
  }
  _adminRoutePopState(_e) {
    const routePath = this._getAdminRoutePathFromLocation();
    const shell = this.__siteAdminShell;
    if (
      shell &&
      shell.isConnected &&
      shell.needsLeaveCheck &&
      this.__currentAdminRoutePath &&
      routePath !== this.__currentAdminRoutePath
    ) {
      // put the section back in the address bar, then ask
      this._setAdminRoutePathOnLocation(this.__currentAdminRoutePath, "push");
      shell.requestLeave(() => {
        if (routePath) {
          this.setAdminPath(routePath, "push", false);
        } else {
          globalThis.dispatchEvent(
            new CustomEvent("simple-modal-hide", {
              bubbles: true,
              cancelable: true,
              detail: {},
            }),
          );
        }
      });
      return;
    }
    if (routePath) {
      store.adminMode = true;
      this._applyAdminRoutePath(routePath);
      return;
    }
    if (this.themePreviewOpen) {
      this.__currentAdminRoutePath = "theme-preview";
      store.adminMode = true;
      this._setAdminRoutePathOnLocation("theme-preview", "replace");
      return;
    }
    if (this.__currentAdminRoutePath) {
      if (this.__currentAdminRoutePath === "theme-preview") {
        this._closeThemePreview(false);
        this.__currentAdminRoutePath = null;
        store.adminMode = false;
        return;
      }
      this.__currentAdminRoutePath = null;
      store.adminMode = false;
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        }),
      );
    }
  }
  _simpleModalClosed(_e) {
    const initialRoutePath = this._getAdminRoutePathFromLocation();
    if (
      this.__currentAdminRoutePath === "theme-preview" ||
      initialRoutePath === "theme-preview"
    ) {
      return;
    }
    const hasAdminContext = this.__currentAdminRoutePath || initialRoutePath;
    if (!hasAdminContext) {
      return;
    }
    setTimeout(() => {
      const routePath = this._getAdminRoutePathFromLocation();
      if (
        this.__currentAdminRoutePath === "theme-preview" ||
        routePath === "theme-preview"
      ) {
        return;
      }
      let modalOpen = false;
      if (
        globalThis.SimpleModal &&
        globalThis.SimpleModal.requestAvailability
      ) {
        modalOpen = globalThis.SimpleModal.requestAvailability().opened;
      }
      if (modalOpen) {
        return;
      }
      if (routePath) {
        this._clearAdminRoutePathFromLocation("replace");
      } else {
        this.__currentAdminRoutePath = null;
        store.adminMode = false;
      }
    }, 40);
  }
  _reportsButtonTap(e, _fromSiteSettings = false, routeOptions = {}) {
    // a Reports screen route (reports-accessibility, ...) or the overview
    const route =
      routeOptions &&
      typeof routeOptions.reportsRoute === "string" &&
      routeOptions.reportsRoute.indexOf("reports") === 0
        ? routeOptions.reportsRoute
        : "reports";
    const hasReportContext =
      routeOptions &&
      (routeOptions.reportScope === "page" ||
        this._normalizeAdminRouteNodeId(
          routeOptions ? routeOptions.reportNodeId : null,
        ) ||
        this._normalizeAdminRouteNodeId(
          routeOptions ? routeOptions.nodeId : null,
        ));
    if (!routeOptions.skipUrlUpdate) {
      if (!hasReportContext) {
        this.setAdminPath(route, routeOptions.historyMode || "push", false);
        return;
      }
      if (
        !this._syncAdminRoutePath(route, {
          historyMode: routeOptions.historyMode || "push",
        })
      ) {
        return;
      }
    }
    if (
      routeOptions.skipUrlUpdate &&
      !this._syncAdminRoutePath(route, routeOptions)
    ) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell(route, routeOptions);
  }
  /**
   * Section titles are passed around in English because routing logic
   * compares them (see _platformSettingsRoute); translate only for display.
   */
  _sectionLabel(sectionTitle) {
    const sectionKeys = {
      Structure: "pageOutline",
      Appearance: "appearance",
      Details: "details",
      Blocks: "blocks",
      Editor: "editor",
      Features: "features",
      "Import / Export": "importExport",
      About: "about",
    };
    const key = sectionKeys[sectionTitle];
    return key && this.t[key] ? this.t[key] : sectionTitle;
  }
  _siteSettingsTrailTitle(sectionTitle) {
    return `${this.t.siteSettings} / ${this._sectionLabel(sectionTitle)}`;
  }
  _siteSettingsBreadcrumbMeta(
    sectionTitle,
    sectionIcon = HaxUiAdminIcons.home,
  ) {
    return {
      title: this._siteSettingsTrailTitle(sectionTitle),
      titleIcon: sectionIcon,
      breadcrumbs: [
        {
          label: this.t.siteSettings,
          icon: HaxUiAdminIcons.home,
          action: "site-settings-dashboard",
          clickable: true,
        },
        {
          label: this._sectionLabel(sectionTitle),
          icon: sectionIcon,
          clickable: false,
        },
      ],
    };
  }
  _platformSettingsIcon(sectionTitle = "") {
    const title = `${sectionTitle}`.toLowerCase();
    switch (title) {
      case "blocks":
        return HaxUiAdminIcons.blocks;
      case "editor":
        return HaxUiAdminIcons.editor;
      default:
        return HaxUiAdminIcons.features;
    }
  }
  _platformSettingsRoute(sectionTitle = "") {
    const title = `${sectionTitle}`.toLowerCase();
    switch (title) {
      case "blocks":
        return "blocks";
      case "editor":
        return "editor";
      default:
        return "features";
    }
  }
  _simpleModalBreadcrumbClick(e) {
    if (!e || !e.detail || !e.detail.breadcrumb) {
      return;
    }
    const breadcrumb = e.detail.breadcrumb;
    if (!breadcrumb.action) {
      return;
    }
    this._siteAdminGuard(() => {
      switch (breadcrumb.action) {
        case "site-settings-dashboard":
          this._manifestButtonTap({
            target: this.shadowRoot.querySelector("#manifestbtn"),
          });
          break;
        case "content-admin":
          this._openContentAdmin(true);
          break;
        case "structure":
          this._outlineButtonTap(null, true, "Structure", {
            skipUrlUpdate: true,
          });
          break;
        default:
          break;
      }
    });
  }
  /**
   * Navigate to style guide route
   */
  _styleGuideButtonTap(_e) {
    this._clearAdminRoutePathFromLocation("replace");
    store.playSound("click");
    globalThis.location.href = "x/displays/style-guide";
  }
  async _openThemePreviewFromProgram(e) {
    await this._openThemePreview(e);
  }
  _openPageRevisionsFromEvent(e) {
    const detail = e && e.detail ? e.detail : {};
    const nodeId =
      typeof detail.nodeId === "undefined" || detail.nodeId === null
        ? ""
        : `${detail.nodeId}`.trim();
    const nodeTitle =
      typeof detail.nodeTitle === "undefined" || detail.nodeTitle === null
        ? ""
        : `${detail.nodeTitle}`;
    const invokedBy =
      detail && detail.invokedBy && detail.invokedBy.nodeType === 1
        ? detail.invokedBy
        : e && e.target
          ? e.target
          : null;
    this._openPageRevisions(nodeId, nodeTitle, {
      invokedBy: invokedBy,
      silent: detail.silent === true,
      fromContentAdmin: detail.source === "content-admin-dialog",
    });
  }
  _openPageRevisionsForActivePage() {
    const activeItem = toJS(store.activeItem);
    const nodeId = activeItem && activeItem.id ? `${activeItem.id}`.trim() : "";
    const nodeTitle = activeItem && activeItem.title ? activeItem.title : "";
    this._openPageRevisions(nodeId, nodeTitle, {
      invokedBy: this.shadowRoot
        ? this.shadowRoot.querySelector("#merlin")
        : null,
      silent: false,
    });
  }
  _openPageRevisions(nodeId = "", nodeTitle = "", options = {}) {
    const activeItem = toJS(store.activeItem);
    let resolvedNodeId = "";
    if (typeof nodeId === "string") {
      resolvedNodeId = nodeId.trim();
    } else if (nodeId) {
      resolvedNodeId = String(nodeId);
    }
    if (!resolvedNodeId && activeItem && activeItem.id) {
      resolvedNodeId = String(activeItem.id);
    }
    if (!resolvedNodeId) {
      return;
    }
    if (
      !this._syncAdminRoutePath("revisions", {
        historyMode: options.historyMode || "push",
        skipUrlUpdate: options.skipUrlUpdate === true,
        nodeId: resolvedNodeId,
      })
    ) {
      return;
    }
    let resolvedNodeTitle = "";
    if (typeof nodeTitle === "string" && nodeTitle.trim() !== "") {
      resolvedNodeTitle = nodeTitle;
    } else if (activeItem && activeItem.title) {
      resolvedNodeTitle = activeItem.title;
    }
    if (!options.silent) {
      store.playSound("click");
    }
    // Page history is a part of Content in the one admin dialog
    this._showSiteAdminShell("revisions", {
      nodeId: resolvedNodeId,
      nodeTitle: resolvedNodeTitle,
      invokedBy:
        options && options.invokedBy
          ? options.invokedBy
          : this.shadowRoot.querySelector("#manifestbtn"),
    });
  }
  async _ensureThemePreviewLoaded() {
    if (
      this.__themePreviewReady ||
      globalThis.customElements.get("haxcms-theme-preview-panel")
    ) {
      this.__themePreviewReady = true;
      return;
    }
    if (this.__themePreviewImporting) {
      await this.__themePreviewImporting;
      return;
    }
    this.__themePreviewImporting = import("./ui/haxcms-theme-preview-panel.js")
      .then(() => {
        this.__themePreviewReady = true;
      })
      .finally(() => {
        this.__themePreviewImporting = null;
      });
    await this.__themePreviewImporting;
  }
  _setThemePreviewCanvasState(isOpen, isCollapsed = false) {
    if (!store.themeElement) {
      return;
    }
    if (isOpen) {
      const previewMargin = isCollapsed
        ? "0px"
        : "var(--haxcms-theme-preview-width, 420px)";
      store.themeElement.style.setProperty("margin-right", previewMargin);
      store.themeElement.style.setProperty(
        "transition",
        "margin-right 180ms ease-in-out",
      );
    } else {
      store.themeElement.style.removeProperty("margin-right");
      store.themeElement.style.removeProperty("transition");
    }
  }
  _closeThemePreview(clearRoute = true, historyMode = "replace") {
    this.themePreviewOpen = false;
    this.themePreviewCollapsed = false;
    this._setThemePreviewCanvasState(false);
    if (
      clearRoute &&
      (this.__currentAdminRoutePath === "theme-preview" ||
        this._getAdminRoutePathFromLocation() === "theme-preview")
    ) {
      this._clearAdminRoutePathFromLocation(historyMode);
    }
  }
  async _openThemePreview(e, routeOptions = {}) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath(
        "theme-preview",
        routeOptions.historyMode || "push",
        false,
      );
      return;
    }
    if (!this._syncAdminRoutePath("theme-preview", routeOptions)) {
      return;
    }
    if (!store.platformAllows("themeManifest")) {
      return;
    }
    if (this.themePreviewOpen) {
      return;
    }
    await this._ensureThemePreviewLoaded();
    this.themePreviewOpen = true;
    this.themePreviewCollapsed = false;
    this._setThemePreviewCanvasState(true, this.themePreviewCollapsed);
    if (!routeOptions.silent) {
      store.playSound("click");
    }
  }
  _handleThemePreviewCollapsedChanged(e) {
    if (!this.themePreviewOpen) {
      return;
    }
    const isCollapsed = !!(
      e &&
      e.detail &&
      typeof e.detail.value === "boolean" &&
      e.detail.value
    );
    this.themePreviewCollapsed = isCollapsed;
    this._setThemePreviewCanvasState(true, this.themePreviewCollapsed);
  }
  _handleThemePreviewCancel(_e) {
    this._closeThemePreview(true, "replace");
    store.playSound("error");
  }
  _handleThemePreviewOpenAdmin(e) {
    let previewSelection = null;
    if (e && e.detail) {
      const selectedTheme =
        typeof e.detail.theme === "undefined" || e.detail.theme === null
          ? ""
          : `${e.detail.theme}`.trim();
      const selectedPalette =
        typeof e.detail.palette === "undefined" || e.detail.palette === null
          ? ""
          : `${e.detail.palette}`.trim();
      if (selectedTheme !== "" || selectedPalette !== "") {
        previewSelection = {
          theme: selectedTheme,
          palette: selectedPalette,
        };
      }
    }
    this.__appearancePreviewSelection = previewSelection;
    this._closeThemePreview(false);
    this._openAppearanceSettings(true, "Appearance");
  }
  async _cancelButtonTap(e) {
    if (!HAXStore.activeHaxBody) {
      this._cancelEditing(e);
      return false;
    }
    const body = await HAXStore.activeHaxBody.haxToContent();
    if (body != this._originalContent) {
      this._confirmCancelEditing(e);
      return false;
    }
    this._cancelEditing(e);
  }
  _confirmCancelEditing(e) {
    let confirmDialog = globalThis.document.createElement("hax-confirm-dialog");
    confirmDialog.message = this.t.unsavedPageChangesWillBeLost;
    confirmDialog.confirmLabel = this.t.discardChanges;
    confirmDialog.cancelLabel = this.t.keepEditing;
    confirmDialog.destructive = true;
    confirmDialog.closeOnConfirm = false;
    confirmDialog.confirmCallback = () => this._cancelEditing(e);
    confirmDialog.cancelCallback = () => store.playSound("error");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.discardUnsavedChanges,
        styles: SITE_ADMIN_CONFIRM_STYLES,
        elements: { content: confirmDialog },
        invokedBy:
          (e && e.target) ||
          this.shadowRoot.querySelector("#cancelbutton") ||
          this,
        clone: false,
        modal: true,
        showClose: false,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  _cancelEditing(e) {
    this.editMode = false;
    store.playSound("error");
    this.dispatchEvent(
      new CustomEvent("hax-cancel", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e && e.detail ? e.detail : {},
      }),
    );
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  /**
   * Delete button hit, confirm they want to do this
   */
  _deleteButtonTap(e) {
    store.playSound("click");
    const activeTitle =
      store.activeItem && store.activeItem.title
        ? store.activeItem.title
        : this.t.thisPage;
    let confirmDialog = globalThis.document.createElement("hax-confirm-dialog");
    confirmDialog.message = this.t.deletePageConfirmMessage.replace(
      "{title}",
      () => activeTitle,
    );
    confirmDialog.confirmLabel = this.t.delete;
    confirmDialog.cancelLabel = this.t.cancel;
    confirmDialog.destructive = true;
    confirmDialog.confirmCallback = this._deleteActive.bind(this);
    confirmDialog.cancelCallback = () => store.playSound("error");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.permanentlyDeleteThisPage,
        styles: SITE_ADMIN_CONFIRM_STYLES,
        elements: { content: confirmDialog },
        invokedBy: e && e.target ? e.target : this,
        clone: false,
        modal: true,
        showClose: false,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  /**
   * delete active item
   */
  _deleteActive(_e) {
    store.playSound("click");
    const evt = new CustomEvent("haxcms-delete-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        item: store.activeItem,
      },
    });
    this.dispatchEvent(evt);
  }
  /**
   * Toggle lock status
   */
  _toggleLockStatus(_e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) return;

    const isLocked = activeItem.metadata && activeItem.metadata.locked;
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: activeItem.id,
          operation: "setLocked",
          locked: !isLocked,
        },
      }),
    );
  }
  /**
   * Duplicate page prompt
   */
  async _duplicatePagePrompt(_e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) return;

    const newTitle = await adminPrompt({
      title: this.t.duplicatePageTitle,
      message: this.t.enterTitleForDuplicatedPage,
      label: this.t.newPageTitle,
      value: this.t.titleCopy.replace("{title}", () => activeItem.title),
      required: true,
      confirmLabel: this.t.duplicateAction,
      cancelLabel: this.t.cancel,
    });
    if (newTitle && newTitle.trim() !== "") {
      store.playSound("click");
      const SuperDaemonInstance =
        globalThis.SuperDaemonManager.requestAvailability();
      // Use the create-page program with duplicate option
      SuperDaemonInstance.waveWand([
        newTitle,
        "/",
        {},
        "create-page",
        this.t.createAPage,
      ]);
    }
  }
  /**
   * Move page program from menu
   */
  _movePageProgramFromMenu(_e) {
    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      return;
    }
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");
    SuperDaemonInstance.waveWand([
      "",
      "/",
      { pageId: item.id },
      "move-page",
      this.t.movePage,
      "",
    ]);
  }
  /**
   * Toggle locked status
   */
  _toggleLockedStatus(_e) {
    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      return;
    }
    const currentStatus = item.metadata && item.metadata.locked ? true : false;
    const newStatus = !currentStatus;
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          operation: "setLocked",
          locked: newStatus,
        },
      }),
    );
  }
  /**
   * Toggle published status
   */
  _togglePublishedStatus(_e) {
    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      return;
    }
    const currentStatus = item.metadata && item.metadata.published !== false;
    const newStatus = !currentStatus;
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          operation: "setPublished",
          published: newStatus,
        },
      }),
    );
  }
  /**
   * toggle state on button tap
   */
  _outlineButtonTap(
    _e,
    _fromSiteSettings = false,
    _sectionTitle = null,
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("structure", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("structure", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    // Structure is a section of the one admin dialog, so the rail stays
    // beside outline-designer; the dialog keeps its own Save Outline flow
    this._showSiteAdminShell(
      "structure",
      Object.assign({}, routeOptions, {
        invokedBy:
          routeOptions && routeOptions.invokedBy
            ? routeOptions.invokedBy
            : this.shadowRoot.querySelector("#outlinebutton"),
      }),
    );
  }
  _openImportHierarchy(items, _fromSiteSettings = false, routeOptions = {}) {
    if (!routeOptions.skipUrlUpdate) {
      this.__importHierarchyItems = items;
      this.setAdminPath(
        "structure-import",
        routeOptions.historyMode || "push",
        false,
      );
      return;
    }
    if (!this._syncAdminRoutePath("structure-import", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    // Structure's import step is a screen of the one admin dialog: the rail
    // stays beside it and the shell's Save adds the pages (the same
    // haxcms-create-node request as before)
    this._showSiteAdminShell("structure-import", {
      invokedBy:
        routeOptions && routeOptions.invokedBy
          ? routeOptions.invokedBy
          : this.shadowRoot.querySelector("#outlinebutton"),
    });
  }
  _openImportHierarchyFromEvent(e) {
    const detail = e && e.detail ? e.detail : {};
    const items = detail.items || [];
    this._openImportHierarchy(items, false, {});
  }
  _selectFileForHierarchyImport(_e) {
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-create-node", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          originalTarget: this,
          values: {
            docximport: "branch",
            parent: null,
          },
        },
      }),
    );
  }
  /**
   * toggle state on button tap
   */
  _manifestButtonTap(e, routeOptions = {}) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("admin", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("admin", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("admin");
  }
  /**
   * The one admin dialog (haxtheweb/issues#3180). Created once and kept, so
   * moving between shell sections swaps the body instead of re-opening the
   * modal.
   */
  _getSiteAdminShell() {
    if (!this.__siteAdminShell) {
      const shell = globalThis.document.createElement("haxcms-site-admin");
      shell.addEventListener("haxcms-site-admin-navigate", (e) => {
        const route = e && e.detail ? e.detail.route : null;
        if (route) {
          this.setAdminPath(route, "push", false);
        }
      });
      shell.configureSection = (route, el) =>
        this._configureSiteAdminSection(route, el);
      this.__siteAdminShell = shell;
    }
    this.__siteAdminShell.allowRoute = (route) =>
      this._adminRouteAllowed(route);
    return this.__siteAdminShell;
  }
  /**
   * Show a shell route ("admin" for the launcher, or a section with
   * `shell: true` in the registry). Route syncing has already happened.
   */
  _showSiteAdminShell(route, routeOptions = {}) {
    return import("./admin/haxcms-site-admin.js").then(() => {
      const shell = this._getSiteAdminShell();
      const meta = this._siteAdminRouteMeta(route);
      this.__siteAdminRouteOptions = routeOptions || {};
      const modal =
        globalThis.SimpleModal && globalThis.SimpleModal.requestAvailability
          ? globalThis.SimpleModal.requestAvailability()
          : null;
      const showing = !!(modal && modal.opened && shell.parentNode === modal);
      if (shell.route === route && route !== "admin") {
        // same section asked for again: build it fresh so it gets this
        // open's values (a theme preview pick, a Reports scope). While it is
        // on screen, ask first if it holds unsaved edits.
        if (showing) {
          shell.requestLeave(() => shell.reload());
        } else {
          shell.reload();
        }
      }
      shell.route = route;
      shell.requestUpdate();
      if (showing) {
        modal.title = meta.title;
        modal.titleIcon = meta.titleIcon;
        modal.breadcrumbs = meta.breadcrumbs;
        return shell;
      }
      const invokedBy =
        routeOptions &&
        routeOptions.invokedBy &&
        routeOptions.invokedBy.nodeType === 1
          ? routeOptions.invokedBy
          : this.shadowRoot.querySelector("#manifestbtn");
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-show", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            title: meta.title,
            titleIcon: meta.titleIcon,
            breadcrumbs: meta.breadcrumbs,
            styles: Object.assign({}, SITE_ADMIN_MODAL_STYLES),
            elements: {
              content: shell,
            },
            invokedBy: invokedBy,
            clone: false,
            modal: true,
            showClose: true,
          },
        }),
      );
      return shell;
    });
  }
  /**
   * Titlebar title, icon and breadcrumb for a shell route, using the same
   * labels the old per-section dialogs showed.
   */
  _siteAdminRouteMeta(route) {
    if (route === "admin") {
      return {
        title: this.t.siteSettings,
        titleIcon: HaxUiAdminIcons.home,
        breadcrumbs: [],
      };
    }
    const resolved = resolveSiteAdminRoute(route);
    const icon = resolved ? resolved.icon : HaxUiAdminIcons.home;
    const labels = {
      appearance: "Appearance",
      site: "Details",
      blocks: "Blocks",
      editor: "Editor",
      features: "Features",
      transfer: "Import / Export",
      about: "About",
      content: this.t.content,
      revisions: `${this.t.content} › ${this.t.pageHistory || "Page history"}`,
      structure: "Structure",
      "structure-import": "Structure › Import pages",
      files: this.t.files,
      views: this.t.views || "Views",
      reports: this.t.dashboard,
      "reports-accessibility": `${this.t.dashboard} › Accessibility`,
      "reports-content": `${this.t.dashboard} › Content`,
      "reports-links": `${this.t.dashboard} › Links`,
      "reports-media": `${this.t.dashboard} › Media`,
      "reports-instructional": `${this.t.dashboard} › Instructional`,
      "reports-learning": `${this.t.dashboard} › Learning activity`,
      "reports-cadence": `${this.t.dashboard} › Cadence`,
      "reports-freshness": `${this.t.dashboard} › Freshness`,
      "reports-metadata": `${this.t.dashboard} › Metadata`,
      "reports-components": `${this.t.dashboard} › Components`,
      seo: this.t.seoSettings,
      author: this.t.authorSettings,
    };
    const label = Object.prototype.hasOwnProperty.call(labels, route)
      ? labels[route]
      : route;
    return this._siteSettingsBreadcrumbMeta(label, icon);
  }
  /**
   * Hand a section the per-open values and listeners its old opener set,
   * before it connects inside the one admin dialog.
   */
  _configureSiteAdminSection(route, el) {
    const routeOptions = this.__siteAdminRouteOptions || {};
    switch (route) {
      case "structure-import":
        el.items = Array.isArray(this.__importHierarchyItems)
          ? this.__importHierarchyItems
          : [];
        break;
      case "revisions": {
        const activeItem = toJS(store.activeItem);
        el.nodeId =
          routeOptions.nodeId ||
          (activeItem && activeItem.id ? String(activeItem.id) : "");
        el.nodeTitle =
          routeOptions.nodeTitle ||
          (activeItem && activeItem.title ? activeItem.title : "");
        break;
      }
      case "transfer":
        el.allowImportFiles = this._adminRouteAllowed("files");
        el.allowImportLinks = true;
        el.allowPageExport = true;
        el.allowSiteExport = true;
        el.addEventListener(
          "haxcms-site-import-export-action",
          this._importExportDashboardAction.bind(this),
        );
        break;
      case "content":
        el.addEventListener("haxcms-content-dashboard-operation", (e) => {
          if (e && typeof e.stopPropagation === "function") {
            e.stopPropagation();
          }
          globalThis.dispatchEvent(
            new CustomEvent("haxcms-content-dashboard-operation", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: e.detail,
            }),
          );
        });
        break;
      case "files": {
        const siteEditor = store.cmsSiteEditorAvailability();
        el.method =
          siteEditor && siteEditor.method ? siteEditor.method : "POST";
        if (
          store.manifest &&
          store.manifest.metadata &&
          store.manifest.metadata.site &&
          store.manifest.metadata.site.name
        ) {
          el.siteName = store.manifest.metadata.site.name;
        }
        if (store.activeItem && store.activeItem.id) {
          el.nodeId = store.activeItem.id;
        }
        el.addEventListener("haxcms-files-dashboard-operation", (e) => {
          globalThis.dispatchEvent(
            new CustomEvent("haxcms-files-dashboard-operation", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: e.detail,
            }),
          );
        });
        break;
      }
      case "appearance": {
        const previewSelection = this.__appearancePreviewSelection;
        this.__appearancePreviewSelection = null;
        el.refreshFromManifest();
        if (
          previewSelection &&
          typeof el.applyThemePreviewSelection === "function"
        ) {
          el.applyThemePreviewSelection(previewSelection);
        }
        break;
      }
      case "seo":
      case "author":
        el.activeGroup = route === "author" ? "author" : "seo";
        break;
      case "features":
        el.platformSettingsMode = true;
        break;
      case "reports":
      case "reports-accessibility":
      case "reports-content":
      case "reports-links":
      case "reports-media":
      case "reports-instructional":
      case "reports-learning":
      case "reports-cadence":
      case "reports-freshness":
      case "reports-metadata":
      case "reports-components": {
        el.section = route === "reports" ? "overview" : route.slice(8);
        const activeItem = toJS(store.activeItem);
        const reportNodeId = this._normalizeAdminRouteNodeId(
          routeOptions.reportNodeId,
        );
        const routeNodeId = this._normalizeAdminRouteNodeId(
          routeOptions.nodeId,
        );
        if (routeOptions.reportScope === "page") {
          if (reportNodeId) {
            el.selectedReportId = reportNodeId;
          } else if (routeNodeId) {
            el.selectedReportId = routeNodeId;
          } else if (activeItem && activeItem.id) {
            el.selectedReportId = `${activeItem.id}`;
          } else {
            el.selectedReportId = "";
          }
        } else {
          el.selectedReportId = "";
        }
        break;
      }
      default:
        break;
    }
  }
  /**
   * Run `proceed`, first asking the one admin dialog to confirm leaving
   * when its open section has unsaved changes.
   */
  _siteAdminGuard(proceed) {
    const shell = this.__siteAdminShell;
    if (shell && shell.isConnected && shell.needsLeaveCheck) {
      shell.requestLeave(proceed);
      return false;
    }
    proceed();
    return true;
  }
  _siteSettingsDashboardAction(e) {
    const action = e && e.detail ? e.detail.action : null;
    setTimeout(() => {
      switch (action) {
        case "style-guide":
          this._styleGuideButtonTap(e);
          break;
        case "reports":
          this._reportsButtonTap(e, true);
          break;
        case "outline":
          this._outlineButtonTap(e, true, "Structure");
          break;
        case "site-settings":
          this._openDetailsAdmin(true, "Details");
          break;
        case "theme-settings":
          this._openAppearanceSettings(true, "Appearance");
          break;
        case "seo-settings":
          this._openSeoAdmin(true, "seo");
          break;
        case "blocks":
          this._openAllowedBlocksSettings(true, "Blocks");
          break;
        case "editor":
          this._openEditorSettings(true, "Editor");
          break;
        case "about":
          this._openAboutAdmin(true, this.t.about);
          break;
        case "platform":
          this._openPlatformSettings(true, "Features");
          break;
        case "content-admin":
          this._openContentAdmin(true);
          break;
        case "files-admin":
          this._openFilesAdmin(true);
          break;
        case "views-admin":
          this._openViewsAdmin(true);
          break;
        case "import-export":
          this._openImportExportDashboard(true, "Import / Export");
          break;
      }
    }, 0);
  }
  _importExportDashboardAction(e) {
    const detail = e && e.detail ? e.detail : {};
    const action = detail && detail.action ? `${detail.action}` : "";
    const format = detail && detail.format ? `${detail.format}` : "";
    switch (action) {
      case "import-file":
        store.playSound("click");
        globalThis.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
        setTimeout(() => {
          this.selectFileToProcess();
        }, 0);
        break;
      case "import-link": {
        store.playSound("click");
        globalThis.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
        setTimeout(async () => {
          const urlInput = await adminPrompt({
            title: this.t.importFromUrlTitle,
            label: this.t.pasteUrlToImport,
            placeholder: "https://",
            required: true,
            confirmLabel: this.t.importLabel,
            cancelLabel: this.t.cancel,
          });
          if (typeof urlInput !== "string" || urlInput.trim() === "") {
            return;
          }
          const trimmedUrl = urlInput.trim();
          if (this.isValidUrl(trimmedUrl)) {
            this.processUrlFromInput(trimmedUrl);
          } else {
            store.toast(this.t.invalidUrlProvided, 3000, {
              hat: "construction",
              tone: "warning",
            });
          }
        }, 0);
        break;
      }
      case "export-page":
        if (format) {
          store.playSound("click");
          this.exportPageAs(format);
        }
        break;
      case "export-site":
        if (format) {
          store.playSound("click");
          this.exportSiteAs(format);
        }
        break;
    }
  }
  _openImportExportDashboard(
    _fromSiteSettings = false,
    _sectionTitle = "Import / Export",
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("transfer", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("transfer", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("transfer", routeOptions);
  }
  _openContentAdmin(_fromSiteSettings = false, routeOptions = {}) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("content", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("content", routeOptions)) {
      return;
    }
    this._showSiteAdminShell("content", routeOptions);
  }
  _openFilesAdmin(_fromSiteSettings = false, routeOptions = {}) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("files", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("files", routeOptions)) {
      return;
    }
    this._showSiteAdminShell("files", routeOptions);
  }
  _openViewsAdmin(_fromSiteSettings = false, routeOptions = {}) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("views", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("views", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("views", routeOptions);
  }
  _openAppearanceSettings(
    _fromSiteSettings = false,
    _sectionTitle = "Appearance",
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath(
        "appearance",
        routeOptions.historyMode || "push",
        false,
      );
      return;
    }
    if (!this._syncAdminRoutePath("appearance", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("appearance", routeOptions);
  }
  _openAllowedBlocksSettings(
    _fromSiteSettings = false,
    _sectionTitle = "Blocks",
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("blocks", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("blocks", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("blocks", routeOptions);
  }
  _openEditorSettings(
    _fromSiteSettings = false,
    _sectionTitle = "Editor",
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("editor", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("editor", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("editor", routeOptions);
  }
  _openAboutAdmin(
    _fromSiteSettings = false,
    _sectionTitle = "About",
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("about", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("about", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("about", routeOptions);
  }
  _openPlatformSettings(
    _fromSiteSettings = false,
    sectionTitle = "Features",
    routeOptions = {},
  ) {
    const routePath = this._platformSettingsRoute(sectionTitle);
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath(routePath, routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath(routePath, routeOptions)) {
      return;
    }
    this._showSiteAdminShell(routePath, routeOptions);
  }
  _openDetailsAdmin(
    _fromSiteSettings = false,
    _sectionTitle = "Details",
    routeOptions = {},
  ) {
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath("site", routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath("site", routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell("site", routeOptions);
  }
  _openSeoAdmin(_fromSiteSettings = false, section = "seo", routeOptions = {}) {
    if (section && typeof section === "object") {
      routeOptions = section;
      section = "seo";
    }
    const routePath = section === "author" ? "author" : "seo";
    if (!routeOptions.skipUrlUpdate) {
      this.setAdminPath(routePath, routeOptions.historyMode || "push", false);
      return;
    }
    if (!this._syncAdminRoutePath(routePath, routeOptions)) {
      return;
    }
    if (!routeOptions.silent) {
      store.playSound("click");
    }
    this._showSiteAdminShell(routePath, routeOptions);
  }
  /**
   * Edit state has changed.
   */
  _editModeChanged(newValue, oldValue) {
    // NOTE: __editIcon and __editText are derived in willUpdate (on editMode
    // / t / responsiveSize changes) so they batch into the current update
    // cycle. Do NOT re-set them here — doing so in updated() scheduled a
    // redundant second update (Lit change-in-update warning). This method
    // now only handles the store / daemon / tray side-effects.
    if (newValue) {
      // store a content copy of original state as text, waiting for a paint / full setup
      setTimeout(async () => {
        if (HAXStore.activeHaxBody) {
          this._originalContent = await HAXStore.activeHaxBody.haxToContent();
        }
      }, 100);
      SuperDaemonInstance.appendContext("HAX");
      SuperDaemonInstance.removeContext("CMS");
      // remove fine-grained CMS contexts that platformConfig doesn't disable
      this.platformContexts.cms.forEach((item) =>
        SuperDaemonInstance.removeContext(item),
      );
    } else {
      SuperDaemonInstance.appendContext("CMS");
      // Add fine-grained CMS contexts that platformConfig doesn't disable
      this.platformContexts.cms.forEach((item) =>
        SuperDaemonInstance.appendContext(item),
      );
      SuperDaemonInstance.removeContext("HAX");
    }
    if (typeof oldValue !== typeof undefined) {
      store.editMode = newValue;
      // force tray status to be the opposite of the editMode
      // to open when editing and close when not
      if (newValue && HAXStore.haxTray) {
        const autoOpenTray = this.shouldAutoOpenTrayOnEdit();
        if (!autoOpenTray) {
          HAXStore.trayDetail = "no-active-tray";
          HAXStore.haxTray.trayDetail = "no-active-tray";
        }
        HAXStore.haxTray.collapsed = !autoOpenTray;
      }
    }
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _outlineEditModeChanged(newValue, _oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-outline-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue,
      }),
    );
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _manifestEditModeChanged(newValue, _oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-manifest-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue,
      }),
    );
  }

  /**
   * Handle Konami Code activation - dynamically load cheat codes
   */
  async _konamiCodeActivated(_e) {
    if (!this.konamiCodeActivated) {
      this.konamiCodeActivated = true;

      try {
        // Dynamically import the cheat codes module for performance
        const cheatModule = await import("./haxcms-cheat-codes.js");

        // Add all cheat code methods to this instance
        cheatModule.addCheatCodeMethods(this, SuperDaemonInstance);

        // Define all cheat code programs in Merlin
        cheatModule.defineCheatCodes(this, SuperDaemonInstance);

        // Show notification that cheat codes are now available
        HAXStore.toast(this.t.cheatCodesUnlocked);

        // Close Merlin first to reset state, then reopen after delay
        SuperDaemonInstance.close();

        setTimeout(() => {
          SuperDaemonInstance.mini = true;
          SuperDaemonInstance.wand = true;
          SuperDaemonInstance.activeNode =
            this.shadowRoot.querySelector("#merlin");
          SuperDaemonInstance.open();
          // Force refresh of items to include new cheat codes
          SuperDaemonInstance.items = SuperDaemonInstance.filterItems(
            SuperDaemonInstance.allItems,
            SuperDaemonInstance.context,
          );
          SuperDaemonInstance.runProgram("", "*");
        }, 100);
      } catch (error) {
        console.error("🎮 Failed to load cheat codes:", error);
        HAXStore.toast(this.t.failedToUnlockCheatCodes);
      }
    }
  }
}
globalThis.customElements.define(HAXCMSSiteEditorUI.tag, HAXCMSSiteEditorUI);
export { HAXCMSSiteEditorUI };
