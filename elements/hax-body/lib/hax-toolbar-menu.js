import { LitElement, html, css } from "lit";
import { SimpleToolbarMenuBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu.js";
import { HaxButton } from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
/**
 * `hax-toolbar-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * @extends SimpleToolbarMenuBehaviors
 * @element hax-toolbar-menu
 *
 */
class HaxToolbarMenu extends SimpleToolbarMenuBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [...super.styles];
  }
  constructor() {
    super();
    this._blockEvent = false;
  }

  static get simpleButtonThemeStyles() {
    return HaxButton;
  }

  static get simpleButtonCoreStyles() {
    return [
      ...super.simpleButtonCoreStyles,
      css`
        ::slotted([slot="menuitem"]) {
          --simple-toolbar-button-justify: flex-start;
          --simple-toolbar-button-label-white-space: nowrap;
        }
      `,
    ];
  }

  static get tag() {
    return "hax-toolbar-menu";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Internal flag to allow blocking the event firing if machine selects tag.
       */
      _blockEvent: {
        type: Boolean,
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        attribute: "event-name",
      },
    };
  }
}
customElements.define(HaxToolbarMenu.tag, HaxToolbarMenu);
export { HaxToolbarMenu };
