import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js";
/**
 * `hax-ce-context`
 * `A context menu that provides common custom-element based authoring options. While
 * trying to call for haxProperties which can automatically generate the buttons
 * required for populating input.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
 * @customElement hax-ce-context
 */
class HaxCeContext extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host *[hidden] {
          display: none;
        }
        :host {
          display: block;
        }
        hax-context-item {
          margin: 0;
        }
        :host(.hax-context-pin-top) hax-toolbar {
          position: fixed;
          top: 64px;
          opacity: 0.9;
        }
        :host(.hax-context-pin-bottom) hax-toolbar {
          position: fixed;
          bottom: 0;
          opacity: 0.9;
        }
        :host(.hax-context-pin-top) hax-toolbar:hover,
        :host(.hax-context-pin-bottom) hax-toolbar:hover {
          opacity: 1;
        }
      `
    ];
  }
  constructor() {
    super();
    this.haxProperties = {};
    setTimeout(() => {
      import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
      import("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");
    }, 0);
  }
  render() {
    return html`
      <hax-toolbar id="toolbar" hide-more>
        <hax-context-item
          mini
          action
          slot="prefix"
          icon="hax:bricks"
          label="Change type"
          ?hidden="${this.hideTransform}"
          event-name="hax-plate-convert"
        ></hax-context-item>
        <slot slot="primary"></slot>
      </hax-toolbar>
    `;
  }
  static get tag() {
    return "hax-ce-context";
  }
  static get properties() {
    return {
      hideTransform: {
        type: Boolean,
        attribute: "hide-transform"
      },
      /**
       * Selected value to match ce direction currently.
       */
      haxProperties: {
        type: Object
      },
      __hasSettingsForm: {
        type: Boolean
      },
      __hasParentSettingsForm: {
        type: Boolean
      },
      __parentName: {
        type: String
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "haxProperties") {
        this.shadowRoot.querySelector("#toolbar").haxProperties = this[
          propName
        ];
        this._haxPropertiesChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * Set haxProperties.
   */
  setHaxProperties(props) {
    // be aggressive w/ reset
    this.haxProperties = props;
  }

  /**
   * HAX properties changed, update buttons available.
   */
  _haxPropertiesChanged(newValue, oldValue) {
    if (
      typeof oldValue !== typeof undefined &&
      typeof newValue.settings !== typeof undefined
    ) {
      if (
        window.HaxStore.instance.isTextElement(
          window.HaxStore.instance.activeNode
        ) ||
        window.HaxStore.instance.activeNode.tagName == "HR" ||
        window.HaxStore.instance.activeNode.tagName == "GRID-PLATE"
      ) {
        this.hideTransform = true;
      } else {
        this.hideTransform = false;
      }
      // clear current slot for the tag
      while (this.firstChild !== null) {
        this.removeChild(this.firstChild);
      }
      let settings = newValue.settings.quick;
      let configure = newValue.settings.configure;
      let advanced = newValue.settings.advanced;
      // support things that could technically have no configuration
      // or advanced form but have quick settings
      // This doesn't make a ton of sense but it is possible
      if (
        (configure.length || advanced.length) &&
        newValue.element.tagName !== "HR"
      ) {
        this.__hasSettingsForm = true;
      } else {
        this.__hasSettingsForm = false;
      }
      this.__hasParentSettingsForm = false;
      // test for parent being different from child
      if (
        window.HaxStore.instance.activeContainerNode !==
          window.HaxStore.instance.activeNode &&
        window.HaxStore.instance.activeContainerNode !== null
      ) {
        this.__hasParentSettingsForm = true;
        switch (window.HaxStore.instance.activeContainerNode.tagName) {
          case "P":
          case "UL":
          case "OL":
          case "DIV":
            this.__parentName = "Text block settings";
            break;
          case "GRID-PLATE":
            this.__parentName = "Layout settings";
            break;
          default:
            this.__parentName = window.HaxStore.instance.activeContainerNode.tagName
              .replace("-", " ")
              .toLowerCase();
            +" settings";
            break;
        }
      }
      var item;
      for (var i = 0; i < settings.length; i++) {
        let setting = settings[i];
        // create a new context item for the quick
        item = document.createElement("hax-context-item");
        item.eventName = "hax-edit-property";
        item.label = setting.title;
        item.options = setting.options;
        item.icon = setting.icon;
        item.action = true;
        item.mini = true;
        item.inputMethod = setting.inputMethod;
        item.required = setting.required;
        item.options = setting.options;
        item.validation = setting.validation;
        item.validationType = setting.validationType;
        item.description = setting.description;
        // property or slot if it doesn't exist
        if (typeof setting.property !== typeof undefined) {
          item.propertyToBind = setting.property;
        } else if (typeof setting.attribute !== typeof undefined) {
          item.propertyToBind = setting.attribute;
        } else {
          item.slotToBind = setting.slot;
        }
        this.appendChild(item);
      }
    }
  }
}
window.customElements.define(HaxCeContext.tag, HaxCeContext);
export { HaxCeContext };
