import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/smooth-scroll/smooth-scroll.js";
import "./lib/map-menu-container.js";
import "./lib/map-menu-builder.js";
Polymer({
  _template: html`
    <style>
      :host {
        --map-menu-active-color: rgba(0,0,0, .1);
        display: block;
        overflow-y: scroll;
        position: relative;
        height: 100%;
      }

      #activeIndicator {
        background: var(--map-menu-active-color);
        transition: all .3s ease-in-out;
        position: absolute
      }

      map-menu-container {
        padding: 32px;
        @apply --map-menu-container;
      }

      /* turn default active color if indicator is on */
      :host([active-indicator]) map-menu-builder { 
        --map-menu-active-color: transparent;
      }
    </style>
    <div id="itemslist">
      <map-menu-container>
        <div id="activeIndicator"></div>
        <map-menu-builder id="builder" items="[[items]]"></map-menu-builder>
      </map-menu-container>
    </div>
    <smooth-scroll id="smoothScroll"></smooth-scroll>
`,
  is: "map-menu",
  properties: {
    title: { type: String, value: "Content Outline" },
    data: { type: Array, value: null },
    items: { type: Array, value: null, notify: !0 },
    selected: { type: String, notify: !0, observer: "__selectedChanged" },
    autoScroll: { type: Boolean, value: !1 },
    activeIndicator: { type: Boolean, value: !1 }
  },
  observers: ["_dataChanged(data)"],
  listeners: {
    "link-clicked": "__linkClickedHandler",
    "child-attached": "__childAttached",
    "toggle-updated": "__toggleUpdated"
  },
  __selectedChanged: function(newSelected, oldSelected) {
    if (newSelected !== oldSelected) {
      this.refreshActiveChildren(newSelected);
    }
  },
  refreshActiveChildren: function(activeItem, timeoutTime = 100) {
    const oldActiveItem = this.querySelector("[active]");
    if (activeItem && "" !== activeItem) {
      const newActiveItem = this.querySelector(`#${activeItem}`);
      if (newActiveItem) {
        newActiveItem.setAttribute("active", !0);
        if (this.activeIndicator) {
          this.__updateActiveIndicator(newActiveItem, timeoutTime);
        }
        if (this.autoScroll) {
          this.$.smoothScroll.scroll(newActiveItem, {
            duration: 300,
            scrollElement: this
          });
        }
      }
    }
    if (oldActiveItem) {
      oldActiveItem.removeAttribute("active");
    }
  },
  setData: function(data) {
    this.set("data", []);
    this.set("data", data);
  },
  _dataChanged: function(data) {
    const items = [];
    if (!data) return;
    data.forEach(element => {
      if (!element.parent) {
        items.push(element);
      }
    });
    items.forEach(item => {
      this._setChildren(item, data);
    });
    this.set("items", []);
    this.set("items", items);
  },
  _setChildren: function(item, data) {
    const children = data.filter(d => item.id === d.parent);
    item.children = children;
    if (0 < item.children.length) {
      item.children.forEach(child => {
        this._setChildren(child, data);
      });
    }
  },
  __hasChildren: function(item) {
    return 0 < item.children.length;
  },
  __linkClickedHandler: function(e) {
    this.selected = e.detail.id;
    this.fire("selected", e.detail.id);
  },
  __childAttached: function(e) {
    const childId = e.detail.id;
    if (childId === this.selected) {
      this.refreshActiveChildren(this.selected);
    }
  },
  __toggleUpdated: function() {
    this.refreshActiveChildren(this.selected, 300);
  },
  __isInViewport: function(element) {
    const scrollParent = this.__getScrollParent(element);
    if (!scrollParent) return !1;
    var elementTop = element.offsetTop,
      elementBottom = elementTop + element.offsetHeight,
      viewportTop = scrollParent.offsetTop,
      viewportBottom = viewportTop + scrollParent.offsetHeight;
    return elementBottom > viewportTop && elementTop < viewportBottom;
  },
  __getScrollParent: function(node) {
    if (null == node) {
      return null;
    }
    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.__getScrollParent(node.parentNode);
    }
  },
  __updateActiveIndicator: function(element, timeoutTime = 100) {
    setTimeout(() => {
      const activeIndicator = this.$.activeIndicator,
        elementIsHidden = this.__parentsHidden(element),
        left = element.offsetLeft,
        bottom = element.offsetBottom,
        top = element.offsetTop,
        width = element.offsetWidth,
        height = !elementIsHidden ? element.offsetHeight : 0;
      timeoutTime = 0 < height ? timeoutTime : 10;
      activeIndicator.setAttribute(
        "style",
        `width:${width}px;height:${height}px;top:${top}px;left:${left}px`
      );
    }, timeoutTime);
  },
  __parentsHidden: function(node) {
    const parent = node.parentNode;
    if (null == parent) return null;
    if ("MAP-MENU-SUBMENU" === parent.tagName) {
      if (!parent.opened) return !0;
    }
    if ("MAP-MENU" === parent.tagName) return !1;
    return this.__parentsHidden(parent);
  }
});
