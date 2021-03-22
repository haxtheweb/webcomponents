import { css } from "lit-element/lit-element.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

export const HaxLayoutBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get styles() {
      return [
        css`
          :host {
            display: block;
          }
          :host([ready]) .container {
            transition: var(
              --hax-layout-container-transition,
              0.5s width ease-in-out,
              0.5s padding ease-in-out,
              0.5s margin ease-in-out
            );
          }
          .container.active {
            outline: var(--hax-layout-active-outline-width, 2px)
              var(--hax-layout-active-outline-style, solid)
              var(
                --hax-layout-active-outline-color,
                var(--hax-layout-accent-color, #009dc7)
              ) !important;
            outline-offset: var(--hax-layout-active-outline-offset, -2px);
          }
          .container.not-shown {
            display: none;
            outline: none;
          }
          :host([data-hax-ray]) .container.not-shown {
            display: block;
            opacity: 0.4;
            width: 0;
          }
          :host([data-hax-ray]) .container.not-shown.has-nodes {
            width: 100%;
            transition: none;
          }
          :host([data-hax-ray]) .not-shown:hover {
            opacity: 1;
          }
          :host([data-hax-ray]) .not-shown:hover::before {
            content: "Hidden by layout";
            position: sticky;
            display: inline-flex;
            background-color: black;
            color: white;
            padding: 0px 8px;
            font-size: 12px;
            line-height: 16px;
            margin: 12px 13px;
            float: right;
            width: 124px;
          }
          /** this implies hax editing state is available **/
          :host([data-hax-ray]) ::slotted(*) {
            outline: var(--hax-layout-slotted-outline-width, 1px)
              var(--hax-layout-slotted-outline-style, solid)
              var(
                --hax-layout-slotted-outline-color,
                var(--hax-layout-slotted-faded-color, #eeeeee)
              );
            outline-offset: var(--hax-layout-slotted-outline-offset, -2px);
          }
          :host([data-hax-ray])
            ::slotted([contenteditable][data-hax-ray]:empty)::before {
            content: attr(data-hax-ray);
            opacity: 0.2;
            transition: 0.2s all ease-in-out;
          }
          :host([data-hax-ray]) ::slotted(*:hover) {
            outline: var(--hax-layout-slotted-hover-outline-width, 1px)
              var(--hax-layout-slotted-hover-outline-style, solid)
              var(
                --hax-layout-slotted-hover-outline-color,
                var(--hax-layout-slotted-faded-color, #eeeeee)
              );
          }
          :host([data-hax-ray]) .container {
            outline: var(--hax-layout-container-outline-width, 1px)
              var(--hax-layout-container-outline-style, solid)
              var(
                --hax-layout-container-outline-color,
                var(--hax-layout-slotted-faded-color, #eeeeee)
              );
            outline-offset: var(--hax-layout-container-outline-offset, -2px);
          }
          :host([data-hax-ray]) .container:hover {
            outline: var(--hax-layout-container-hover-outline-width, 1px)
              var(--hax-layout-container-hover-outline-style, solid)
              var(
                --hax-layout-container-hover-outline-color,
                var(--hax-layout-slotted-faded-color, #eeeeee)
              );
          }
          :host([data-hax-ray]) ::slotted(*.active)::before {
            outline: var(--hax-layout-slotted-active-outline-width, 1px)
              var(--hax-layout-slotted-active-outline-style, solid)
              var(
                --hax-layout-slotted-active-outline-color,
                var(--hax-layout-slotted-faded-color, #eeeeee)
              );
            background-color: inherit;
            content: " ";
            width: 100%;
            display: block;
            position: relative;
            margin: -10px 0 0 0;
            z-index: 2;
            height: 10px;
          }
          :host([data-hax-ray]) ::slotted(img.active),
          :host([data-hax-ray]) ::slotted(*.active)::before {
            background-color: var(
              --hax-layout-slotted-active-outline-color,
              var(--hax-layout-accent-color, #009dc7)
            ) !important;
            outline: var(--hax-layout-slotted-active-outline-width, 1px)
              var(--hax-layout-slotted-active-outline-style, solid)
              var(
                --hax-layout-slotted-active-outline-color,
                var(--hax-layout-accent-color, #009dc7)
              );
          }

          @media screen and (min-color-index: 0) and(-webkit-min-device-pixel-ratio:0) {
            :host([data-hax-ray]) ::slotted(*.active) {
              background-color: var(
                --hax-layout-slotted-active-outline-color,
                var(--hax-layout-accent-color, #009dc7)
              ) !important;
              outline: var(--hax-layout-slotted-active-outline-width, 1px)
                var(--hax-layout-slotted-active-outline-style, solid)
                var(
                  --hax-layout-slotted-active-outline-color,
                  var(--hax-layout-accent-color, #009dc7)
                );
            }
          }
        `,
      ];
    }
    constructor() {
      super();
      this.ready = false;
      this.haxLayoutContainer = true;
    }
    /**
     * life cycle
     */
    firstUpdated(changedProperties) {
      setTimeout(() => {
        this.ready = true;
      }, 100);
    }
    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "dataHaxRay" && this.shadowRoot) {
          if (this[propName]) {
            // apply handlers to the columns themselves
            this.addEventListener("drop", this._dropEvent.bind(this));
            let containers = [
                ...this.shadowRoot.querySelectorAll("drag-enabled"),
              ],
              slots = [...this.shadowRoot.querySelectorAll("slot")];
            containers.forEach((container) => {
              container.addEventListener(
                "dragenter",
                this._dragEnter.bind(this)
              );
              container.addEventListener(
                "dragleave",
                this._dragLeave.bind(this)
              );
            });
            slots.forEach((slot) =>
              slot.addEventListener("slotchange", this._slotMonitor.bind(this))
            );
            this.observer = new MutationObserver((mutations) => {
              if (!this.__sorting) {
                mutations.forEach((mutation) => {
                  // this implies something was added dynamically or drag and drop
                  // from outside this element or dragging between grid plates
                  // so we need to disconnect the handlers from here and pick them
                  // up in the new plate
                  mutation.addedNodes.forEach((node) => {
                    if (node.tagName && node !== this) {
                      // verify this has a slot set otherwise we need to set one on the fly
                      // otherwise this won't show up. This could be incorrectly formed HTML
                      // DOM that was pushed in via an outside system or edge cases of things
                      // dropping in without a slot set in anyway
                      // validate slot name, otherwise force it to col-1
                      if (
                        node.parentElement &&
                        node.parentElement.tagName !== "HAX-BODY" &&
                        !this.validateElementSlot(node) &&
                        this.validElementSlots().length > 0
                      ) {
                        node.setAttribute("slot", this.validElementSlots()[0]);
                      }
                    }
                  });
                });
                this.__sortChildren();
              }
            });
            this.observer.observe(this, {
              childList: true,
            });
          } else {
            if (this.observer) {
              this.observer.disconnect();
            }
            this.removeEventListener("drop", this._dropEvent.bind(this));

            let containers = [
                ...this.shadowRoot.querySelectorAll("drag-enabled"),
              ],
              slots = [...this.shadowRoot.querySelectorAll("slot")];
            containers.forEach((container) => {
              container.removeEventListener(
                "dragenter",
                this._dragEnter.bind(this)
              );
              container.removeEventListener(
                "dragleave",
                this._dragLeave.bind(this)
              );
            });
            slots.forEach((slot) =>
              slot.removeEventListener(
                "slotchange",
                this._slotMonitor.bind(this)
              )
            );
          }
        }
        // if any of these changed, update col widths
        if (
          ["responsiveSize", "layout", "layouts", "disableResponsive"].includes(
            propName
          )
        ) {
          clearTimeout(this.__calcWidthLock);
          this.__calcWidthLock = setTimeout(() => {
            this.__columnWidths = this._getColumnWidths(
              this.responsiveSize,
              this.layout,
              this.layouts,
              this.disableResponsive
            );
          }, 0);
        }
        switch (propName) {
          // observer, ensure we are sized correctly after widths change
          case "__columnWidths":
            // widths changed because of layout somehow, wait for the resize transition
            // to have processed, then fire a resize event which we are listening
            this.resize();
            break;
          case "disableResponsive":
            // fire an event that this is a core piece of the system
            this.dispatchEvent(
              new CustomEvent("disable-responsive-changed", {
                detail: this[propName],
              })
            );
            break;
        }
      });
    }
    static get properties() {
      return {
        ready: {
          type: Boolean,
          reflect: true,
        },
        dataHaxRay: {
          type: String,
          reflect: true,
          attribute: "data-hax-ray",
        },
        haxLayoutContainer: {
          type: Boolean,
          reflect: true,
          attribute: "hax-layout-container",
        },
      };
    }
    _dragEnter(e) {
      console.log(e.target);
      e.target.classList.add("active");
    }
    _dragLeave(e) {
      e.target.classList.remove("active");
    }
    _dropEvent(e) {
      this.querySelectorAll(".active").forEach((el) => {
        el.classList.remove("active");
      });
      this.shadowRoot.querySelectorAll(".active").forEach((el) => {
        el.classList.remove("active");
      });
    }
    _getSlotOrder(item) {
      let slot = item.getAttribute("slot"),
        container = this.shadowRoot.querySelector(`[slot=${slot}]`),
        order = parseInt(container.getAttribute("data-move-order") || -1);
      return order;
    }
    /**
     * Use slot events to track which slots have nodes and apply to the shadowRoot
     * column wrappers. This helps with trasitions and animations
     */
    _slotMonitor(e) {
      // sanity, we have a local slot
      var eventPath = normalizeEventPath(e);

      if (
        eventPath[0] &&
        eventPath[0].assignedNodes &&
        eventPath[0].assignedNodes().length
      ) {
        // has nodes so we can make sure to track this elsewhere
        eventPath[0].parentNode.classList.add("has-nodes");
      } else {
        eventPath[0].parentNode.classList.remove("has-nodes");
      }
    }
    /**
     * Determines if the item can move a set number of slots.
     *
     * @param {object} the item
     * @param {number} -1 for left or +1 for right
     * @returns {boolean} if the item can move a set number of slots
     */
    canMoveSlot(item, before) {
      let dir = before ? -1 : 1,
        order = this.this._getSlotOrder(item),
        containers = [...this.shadowRoot.querySelectorAll(".container")]
          .map((container) =>
            parseInt(container.getAttribute("data-move-order") || -1)
          )
          .sort((a, b) => a - b),
        dest = order[1] + dir;
      return dest >= containers[0] && dest <= containers[containers.length - 1];
    }
    /**
     * Moves an item a set number of slots.
     *
     * @param {object} the item
     * @param {number} -1 for left or +1 for right
     */
    moveSlot(item, before) {
      let dir = before ? -1 : 1,
        order = this.this._getSlotOrder(item),
        dest = order[1] + dir,
        container = this.shadowRoot.querySelector(`[data-move-order=${dest}]`),
        slot = container.getAttribute("data-slot-name");
      item.setAttribute("slot", slot);
    }
    /**
     * Validate the slot name
     */
    validateElementSlot(node) {
      return this.validElementSlots().includes(node.getAttribute("slot"));
    }

    validElementSlots() {
      return this.shadowRoot
        ? [...this.shadowRoot.querySelectorAll(".container")].map((container) =>
            container.getAttribute("data-slot-name")
          )
        : [];
    }
    /**
     * Sort children based on slot order
     */
    async __sortChildren() {
      this.__sorting = true;
      try {
        // select all direct children w/ a slot attribute and convert to an Array
        let children = Array.prototype.reduce.call(
          this.querySelectorAll("[slot]"),
          function (acc, e) {
            return acc;
          },
          []
        );
        // sort the children by slot id being low to high
        children = children.sort(function (a, b) {
          if (this._getSlotOrder(a) < this._getSlotOrder(b)) {
            return -1;
          }
          return 1;
        });
        // loop through and append these back into the grid plate.
        // which will put them in the right order
        await children.forEach((el) => {
          // sanity check that we only move things that are a direct child
          if (el.parentNode === this) {
            this.appendChild(el);
          }
        });
      } catch (error) {
        console.warn(error);
      }
      this.__sorting = false;
    }
  };
};
