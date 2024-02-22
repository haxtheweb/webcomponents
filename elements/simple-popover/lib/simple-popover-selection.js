import { html, LitElement, render } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "./simple-popover-manager.js";

class SimplePopoverSelection extends LitElement {
  constructor() {
    super();
    this.opened = false;
    this.disabled = false;
    this.event = "click";
  }

  openedToggle(e) {
    if (!this.disabled) {
      this.opened = !this.opened;
    }
  }

  openedChanged(state) {
    if (state) {
      let popover = globalThis.SimplePopoverManager.requestAvailability();
      render(globalThis.document.createElement("div"), popover);
      let div = globalThis.document.createElement("div");
      let slot = this.querySelectorAll('[slot="options"]');
      // account for nesting in a single option area
      if (
        slot.length === 1 &&
        slot[0].children &&
        slot[0].children.length === 1 &&
        slot[0].children[0].tagName === "SLOT"
      ) {
        slot = slot[0].children[0].assignedNodes({ flatten: true });
      }
      for (var i in slot) {
        if (slot[i].cloneNode && slot[i].tagName) {
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
        let styleData = this.querySelector('[slot="style"]').cloneNode(true);
        let style = globalThis.document.createElement("style");
        style.innerHTML = styleData.innerHTML;
        content = html`${unsafeHTML(div.innerHTML)}${unsafeHTML(
          style.outerHTML,
        )}`;
      } else {
        content = html`${unsafeHTML(div.innerHTML)}`;
      }
      let wrap = globalThis.document.createElement("div");
      wrap.setAttribute("slot", "body");
      popover.appendChild(wrap);
      render(content, wrap);
      // delay for render
      setTimeout(() => {
        // walk kids in the element and apply event listeners back to here
        let children =
          globalThis.SimplePopoverManager.requestAvailability().querySelectorAll(
            "*",
          );
        for (var i in children) {
          if (children[i].addEventListener) {
            children[i].addEventListener("click", this.itemSelect.bind(this));
          }
        }
        // select the item we were told to activate OR just the 1st element
        if (
          globalThis.SimplePopoverManager.requestAvailability().querySelector(
            "[data-simple-popover-selection-active]",
          )
        ) {
          globalThis.SimplePopoverManager.requestAvailability()
            .querySelector("[data-simple-popover-selection-active]")
            .focus();
        } else if (
          globalThis.SimplePopoverManager.requestAvailability() &&
          globalThis.SimplePopoverManager.requestAvailability().querySelector(
            ":first-child",
          )
        ) {
          globalThis.SimplePopoverManager.requestAvailability()
            .querySelector(":first-child")
            .focus();
        }
      }, 0);
    }
    globalThis.SimplePopoverManager.requestAvailability().setPopover(
      this,
      this.querySelector('[slot="button"]'),
      state,
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
      if (propName == "opened" && this.shadowRoot) {
        if (oldValue !== undefined) {
          this.openedChanged(this[propName]);
          this.dispatchEvent(
            new CustomEvent(`${propName}-changed`, {
              detail: this,
            }),
          );
        }
      }
    });
  }
  itemSelect(e) {
    // allow someone else deal with the item changing
    this.dispatchEvent(
      new CustomEvent("simple-popover-selection-changed", {
        bubbles: true,
        detail: e.target,
      }),
    );
    // close after an item is selected
    this.opened = false;
    setTimeout(() => {
      globalThis.SimplePopoverManager.requestAvailability().setPopover(
        this,
        this.querySelector('[slot="button"]'),
        false,
      );
      this.querySelector('[slot="button"]').focus();
    }, 0);
  }
  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true,
      },
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * event activation type
       */
      event: {
        type: String,
      },
    };
  }
  firstUpdated() {
    if (this.event === "click") {
      this.addEventListener("click", this.openedToggle.bind(this));
    } else if (this.event === "hover") {
      this.addEventListener("mouseenter", this.openPopover.bind(this));
      this.addEventListener("focusin", this.openPopover.bind(this));
      this.addEventListener("focusout", this.closePopover.bind(this));
      this.addEventListener("mouseleave", this.closePopover.bind(this));
      this.addEventListener("mouseout", this.closePopover.bind(this));
    }
  }
  openPopover() {
    if (!this.disabled) {
      setTimeout(() => {
        this.opened = true;
      }, 0);
    }
  }
  closePopover() {
    setTimeout(() => {
      this.opened = false;
    }, 0);
  }
  render() {
    return html`<slot name="button"></slot>`;
  }
}

customElements.define("simple-popover-selection", SimplePopoverSelection);
export { SimplePopoverSelection };
