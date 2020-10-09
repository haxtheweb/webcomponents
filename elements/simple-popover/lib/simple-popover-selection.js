import { html, LitElement } from "lit-element/lit-element.js";
import { render } from "lit-html/lib/render.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import "./simple-popover-manager.js";

class SimplePopoverSelection extends LitElement {
  constructor() {
    super();
    this.opened = false;
    this.position = "top";
  }

  openedToggle(e) {
    this.opened = !this.opened;
  }

  openedChanged(state) {
    if (state) {
      let div = document.createElement("div");
      render(div, window.SimplePopoverManager.requestAvailability());
      let slot = this.querySelectorAll('[slot="options"]');
      for (var i in slot) {
        if (slot[i].cloneNode) {
          let clone = slot[i].cloneNode(true);
          clone.removeAttribute("slot");
          div.appendChild(clone);
        }
      }
      let content;
      // support for slot injected styles
      // this allows you to inject a style local to the manager's pop up
      // which means you can style things that otherwise would be impossible
      // due to how shadowDOM + things at the app level / singleton would allow
      if (this.querySelector('[slot="style"]')) {
        let style = this.querySelector('[slot="style"]').cloneNode(true);
        style.removeAttribute("slot");
        content = html`${unsafeHTML(div.innerHTML)}${unsafeHTML(
          style.outerHTML
        )}`;
      } else {
        content = html`${unsafeHTML(div.innerHTML)}`;
      }
      render(content, window.SimplePopoverManager.requestAvailability());
      // delay for render
      setTimeout(() => {
        // walk kids in the element and apply event listeners back to here
        let children = window.SimplePopoverManager.requestAvailability().querySelectorAll(
          "*"
        );
        for (var i in children) {
          if (children[i].addEventListener) {
            children[i].addEventListener("click", this.itemSelect.bind(this));
          }
        }
        // select the item we were told to activate OR just the 1st element
        if (
          window.SimplePopoverManager.requestAvailability().querySelector(
            "[data-simple-popover-selection-active]"
          )
        ) {
          window.SimplePopoverManager.requestAvailability()
            .querySelector("[data-simple-popover-selection-active]")
            .focus();
        } else {
          window.SimplePopoverManager.requestAvailability()
            .querySelector(":first-child")
            .focus();
        }
      }, 0);
    }
    window.SimplePopoverManager.requestAvailability().setPopover(
      this,
      this.querySelector('[slot="button"]'),
      state,
      this.position
    );
  }
  /**
   * The manager called and its time to pack it up. We got a better offer from someone else
   * to maintain the state of the singleton and thus, you no longer matter. Please pack up
   * your bags and don't let the door hit ya.
   */
  managerReset() {
    this.opened = false;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        this.openedChanged(this[propName]);
      }
    });
  }
  itemSelect(e) {
    // allow someone else deal with the item changing
    this.dispatchEvent(
      new CustomEvent("simple-popover-selection-changed", {
        bubbles: true,
        detail: e.target,
      })
    );
    // close after an item is selected
    this.opened = false;
    setTimeout(() => {
      window.SimplePopoverManager.requestAvailability().setPopover(
        this,
        this.querySelector('[slot="button"]'),
        false
      );
      this.querySelector('[slot="button"]').focus();
    }, 0);
  }
  static get properties() {
    return {
      position: {
        type: String,
      },
      opened: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  firstUpdated() {
    this.shadowRoot
      .querySelector("slot")
      .addEventListener("click", this.openedToggle.bind(this));
  }
  render() {
    return html`<slot name="button"></slot>`;
  }
}

customElements.define("simple-popover-selection", SimplePopoverSelection);
export { SimplePopoverSelection };
