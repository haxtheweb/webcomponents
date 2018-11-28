import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "./node_modules/@polymer/polymer/lib/utils/async.js";
import "./node_modules/@polymer/paper-dialog/paper-dialog.js";
import "./node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@polymer/neon-animation/animations/scale-up-animation.js";
import "./node_modules/@polymer/neon-animation/animations/fade-out-animation.js";
window.simpleModal = window.simpleModal || {};
window.simpleModal.requestAvailability = () => {
  if (!window.simpleModal.instance) {
    window.simpleModal.instance = document.createElement("simple-modal");
    document.body.appendChild(window.simpleModal.instance);
  }
  return window.simpleModal.instance;
};
class SimpleModal extends PolymerElement {
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
:host ::slotted(*) {
  font-size: 14px;
  @apply --simple-modal-content;
}

paper-dialog-scrollable {
  padding: 8px 24px;
  @apply --simple-modal-content-container;
}
#dialog {
  display: block;
  margin: auto;
  width: auto;
  height: auto;
  z-index: 1000;
  min-width: 50vw;
  min-height: 50vh;
  @apply --simple-modal-dialog;
}
.buttons {
  padding: 8px 24px;
  @apply --simple-modal-buttons;
}

#close {
  top: 0;
  font-size: 14px;
  text-transform: none;
  right: 0;
  position: absolute;
  padding: 4px;
  margin: 4px;
  color: var(--simple-modal-text, #ffffff);
  background-color: transparent;
  min-width: unset;
  line-height: 32px;
  @apply --simple-modal-close;
}

#close iron-icon {
  display: inline-block;
  color: var(--simple-modal-text, #ffffff);
  width: 16px;
  height: 16px;
  margin-right: 4px;
  @apply --simple-modal-close-icon;
}

.top {
  display: flex;
  margin-top: 0;
  justify-content: space-between;
  background-color: var(--simple-modal-background, #20427b);
  color: var(--simple-modal-text, #ffffff);
  padding: 8px 16px;
  @apply --simple-modal-top;
}
.top h2 {
  flex: auto;
  color: var(--simple-modal-text, #ffffff);
  font-size: 32px;
  text-transform: capitalize;
  padding: 0;
  line-height: 32px;
  margin: 8px;
  @apply --simple-modal-heading;
}</style>
<paper-dialog id="dialog" entry-animation="scale-up-animation"
exit-animation="fade-out-animation" opened="{{opened}}" with-backdrop always-on-top>
  <div class="top">
    <slot name="header"></slot>
    <h2 hidden$="[[!title]]">[[title]]</h2>
    <paper-button id="close" dialog-dismiss hidden$="[[!opened]]">
      <iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]
    </paper-button>
  </div>
  <paper-dialog-scrollable>
    <slot name="content"></slot>
  </paper-dialog-scrollable>
  <div class="buttons">
    <slot name="buttons"></slot>
  </div>
</paper-dialog>`;
  }
  static get properties() {
    return {
      title: { name: "title", type: String, value: "" },
      opened: {
        name: "opened",
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        observer: "_openedChanged"
      },
      closeLabel: { name: "closeLabel", type: String, value: "Close" },
      closeIcon: { name: "closeIcon", type: String, value: "cancel" },
      invokedBy: { name: "invokedBy", type: Object }
    };
  }
  static get tag() {
    return "simple-modal";
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("simple-modal-show", this.showEvent.bind(this));
    this.$.dialog.addEventListener(
      "iron-overlay-opened",
      this._resizeContent.bind(this)
    );
  }
  _resizeContent(e) {
    async.microTask.run(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }
  showEvent(e) {
    if (this.opened) {
      while (null !== dom(this).firstChild) {
        dom(this).removeChild(dom(this).firstChild);
      }
      setTimeout(() => {
        this.show(
          e.detail.title,
          e.detail.elements,
          e.detail.invokedBy,
          e.detail.clone
        );
      }, 100);
    } else {
      this.show(
        e.detail.title,
        e.detail.elements,
        e.detail.invokedBy,
        e.detail.clone
      );
    }
  }
  show(title, elements, invokedBy, clone = !1) {
    this.set("invokedBy", invokedBy);
    this.title = title;
    let element,
      slots = ["header", "content", "buttons"];
    for (var i in slots) {
      if (elements[slots[i]]) {
        if (clone) {
          element = elements[slots[i]].cloneNode(!0);
        } else {
          element = elements[slots[i]];
        }
        element.setAttribute("slot", slots[i]);
        dom(this).appendChild(element);
      }
    }
    setTimeout(() => {
      this.opened = !0;
    }, 100);
  }
  animationEnded(e) {
    if (this.invokedBy) {
      this.title = "";
      while (null !== dom(this).firstChild) {
        dom(this).removeChild(dom(this).firstChild);
      }
      async.microTask.run(() => {
        setTimeout(() => {
          this.invokedBy.focus();
        }, 500);
      });
    }
  }
  close() {
    this.$.dialog.close();
  }
  _openedChanged(newValue, oldValue) {
    if (typeof newValue !== typeof void 0 && !newValue) {
      this.animationEnded();
      const evt = new CustomEvent("simple-modal-closed", {
        bubbles: !0,
        cancelable: !0,
        detail: { opened: !1, invokedBy: this.invokedBy }
      });
      this.dispatchEvent(evt);
    } else if (newValue) {
      const evt = new CustomEvent("simple-modal-opened", {
        bubbles: !0,
        cancelable: !0,
        detail: { opened: !0, invokedBy: this.invokedBy }
      });
      this.dispatchEvent(evt);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("simple-modal-show", this.showEvent.bind(this));
    this.$.dialog.removeEventListener(
      "iron-overlay-opened",
      this._resizeContent.bind(this)
    );
  }
}
window.customElements.define(SimpleModal.tag, SimpleModal);
export { SimpleModal };
