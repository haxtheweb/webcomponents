/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { GestureEventListeners } from "@polymer/polymer/lib/mixins/gesture-event-listeners.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import * as Gestures from "@polymer/polymer/lib/utils/gestures.js";
/**
 * `outline-designer`
 * @element outline-designer
 * `tools to modify and visualize JSON Outline Schema for editing`
 *
 * @microcopy - language worth noting:
 *

 * @polymer
 * @demo demo/index.html
 */
class SortableList extends GestureEventListeners(PolymerElement) {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }
        #items ::slotted(*) {
          user-drag: none;
          user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        }
        #items ::slotted(.item--transform) {
          left: 0;
          margin: 0 !important;
          position: fixed !important;
          top: 0;
          transition: transform 0.2s cubic-bezier(0.333, 0, 0, 1);
          will-change: transform;
          z-index: 1;
        }
        #items ::slotted(.item--pressed) {
          transition: none !important;
        }
        #items ::slotted(.item--dragged) {
          -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          filter: brightness(1.1);
          z-index: 2;
        }
      </style>
      <div id="items"><slot id="slot"></slot></div>
    `;
  }
  static get is() {
    return "sortable-list";
  }
  static get properties() {
    return {
      /**
       * This is a CSS selector string. If this is set, only items that
       * match the CSS selector are sortable.
       */
      sortable: String,
      /**
       * The list of sortable items.
       */
      items: {
        type: Array,
        notify: true,
        readOnly: true,
      },
      /**
       * Returns true when an item is being drag.
       */
      dragging: {
        type: Boolean,
        notify: true,
        readOnly: true,
        reflectToAttribute: true,
        value: false,
      },
      /**
       * Disables the draggable if set to true.
       */
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },
    };
  }
  constructor() {
    super();
    this._observer = null;
    this._target = null;
    this._targetRect = null;
    this._rects = null;
    this._onTrack = this._onTrack.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    async.microTask.run(() => {
      this._observeItems();
      this._updateItems();
      this._toggleListeners({ enable: true });
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unobserveItems();
    this._toggleListeners({ enable: false });
  }
  _toggleListeners({ enable }) {
    const m = enable ? "addEventListener" : "removeEventListener";
    this.shadowRoot.querySelector("#items")[m]("dragstart", this._onDragStart);
    this.shadowRoot
      .querySelector("#items")
      [m]("transitionend", this._onTransitionEnd);
    this.shadowRoot
      .querySelector("#items")
      [m]("contextmenu", this._onContextMenu);
    this.shadowRoot.querySelector("#items")[m]("touchmove", this._onTouchMove);
    if (enable) {
      Gestures.addListener(this, "track", this._onTrack);
    } else {
      Gestures.removeListener(this, "track", this._onTrack);
    }
  }
  _onTrack(event) {
    switch (event.detail.state) {
      case "start":
        this._trackStart(event);
        break;
      case "track":
        this._track(event);
        break;
      case "end":
        this._trackEnd(event);
        break;
    }
  }
  _trackStart(event) {
    if (this.disabled) {
      return;
    }
    this._target = this._itemFromEvent(event);
    if (!this._target) {
      return;
    }
    event.stopPropagation();
    this._rects = this._getItemsRects();
    this._targetRect = this._rects[this.items.indexOf(this._target)];
    this._target.classList.add("item--dragged", "item--pressed");
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
    const rect = this.getBoundingClientRect();
    this.style.height = rect.height + "px";
    this.style.width = rect.width + "px";
    this.items.forEach((item, idx) => {
      const rect = this._rects[idx];
      item.classList.add("item--transform");
      item.style.transition = "none";
      item.__originalWidth = item.style.width;
      item.__originalHeight = item.style.height;
      item.style.width = rect.width + "px";
      item.style.height = rect.height + "px";
      this._translate3d(rect.left, rect.top, 1, item);
      setTimeout((_) => {
        item.style.transition = null;
      }, 20);
    });
    this._setDragging(true);
  }
  _track(event) {
    if (!this.dragging) {
      return;
    }
    const left = this._targetRect.left + event.detail.dx;
    const top = this._targetRect.top + event.detail.dy;
    this._translate3d(left, top, 1, this._target);
    const overItem = this._itemFromCoords(event.detail);
    if (overItem && overItem !== this._target) {
      const overItemIndex = this.items.indexOf(overItem);
      const targetIndex = this.items.indexOf(this._target);
      this._moveItemArray(this.items, targetIndex, overItemIndex);
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i] !== this._target) {
          const rect = this._rects[i];
          requestAnimationFrame((_) => {
            this._translate3d(rect.left, rect.top, 1, this.items[i]);
          });
        }
      }
    }
  }
  // The track really ends
  _trackEnd(event) {
    if (!this.dragging) {
      return;
    }
    const rect = this._rects[this.items.indexOf(this._target)];
    this._target.classList.remove("item--pressed");
    this._setDragging(false);
    this._translate3d(rect.left, rect.top, 1, this._target);
  }
  _onTransitionEnd() {
    if (this.dragging || !this._target) {
      return;
    }
    const fragment = document.createDocumentFragment();
    this.items.forEach((item) => {
      item.style.transform = "";
      item.style.width = item.__originalWidth;
      item.style.height = item.__originalHeight;
      item.classList.remove("item--transform");
      fragment.appendChild(item);
    });
    if (this.children[0]) {
      this.insertBefore(fragment, this.children[0]);
    } else {
      this.appendChild(fragment);
    }
    this.style.height = "";
    this._target.classList.remove("item--dragged");
    this._rects = null;
    this._targetRect = null;
    this._updateItems();
    this.dispatchEvent(
      new CustomEvent("sort-finish", {
        composed: true,
        detail: {
          target: this._target,
        },
      })
    );
    this._target = null;
  }
  _onDragStart(event) {
    event.preventDefault();
  }
  _onContextMenu(event) {
    if (this.dragging) {
      event.preventDefault();
      this._trackEnd();
    }
  }
  _onTouchMove(event) {
    event.preventDefault();
  }
  _updateItems() {
    if (this.dragging) {
      return;
    }
    const items = this.shadowRoot
      .querySelector("#slot")
      .assignedNodes()
      .filter((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (!this.sortable || node.matches(this.sortable))
        ) {
          return true;
        }
      });
    this._setItems(items);
  }
  _itemFromCoords({ x, y }) {
    if (!this._rects) {
      return;
    }
    let match = null;
    this._rects.forEach((rect, i) => {
      if (
        x >= rect.left &&
        x <= rect.left + rect.width &&
        y >= rect.top &&
        y <= rect.top + rect.height
      ) {
        match = this.items[i];
      }
    });
    return match;
  }
  _itemFromEvent(event) {
    const path = event.composedPath();
    for (var i = 0; i < path.length; i++) {
      if (this.items.indexOf(path[i]) > -1) {
        return path[i];
      }
    }
  }
  _getItemsRects() {
    return this.items.map((item) => {
      return item.getBoundingClientRect();
    });
  }
  _observeItems() {
    if (!this._observer) {
      this._observer = new MutationObserver((_) => {
        this._updateItems();
      });
      this._observer.observe(this, { childList: true });
    }
  }
  _unobserveItems() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
  /**
   * Move an array item from one position to another.
   * Source: http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
   */
  _moveItemArray(array, oldIndex, newIndex) {
    if (newIndex >= array.length) {
      var k = newIndex - array.length;
      while (k-- + 1) {
        array.push(undefined);
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  }
  _translate3d(x, y, z, el) {
    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  }
}
window.customElements.define("sortable-list", SortableList);
export { SortableList };
