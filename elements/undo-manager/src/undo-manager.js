/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `undo-manager`
 * `an undo history manager element`
 *  This brings ideas from https://addyosmani.com/blog/mutation-observers/
 *  back to life and this time as LitElement + with the web drastically
 *  moved forward vs when this was originally published (2014).
 *
 * @litelement
 * @demo demo/index.html
 * @customElement undo-manager
 */
class UndoManager extends LitElement {
  /**
   * Convention
   */
  static get tag() {
    return "undo-manager";
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <slot></slot>
    `;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * If we can currently undo based on stack position
       */
      canUndo: {
        type: Boolean,
        attribute: "can-undo"
      },
      /**
       * If we can currently redo based on stack position
       */
      canRedo: {
        type: Boolean,
        attribute: "can-redo"
      },
      /**
       * If we're "dirty" meaning stackPosition and savePosition out of sync
       */
      isDirty: {
        type: Boolean,
        attribute: "is-dirty"
      },
      /**
       * Allow for targetting OTHER elements w/ this behavior
       */
      target: {
        type: Object
      }
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.blocked = false;
    this.observer = null;
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}../../undo.js/undo.js`;
    window.addEventListener(
      "es-bridge-undojs-loaded",
      this._undoLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("undojs", location);
  }
  /**
   * Simple path resolution from URL
   */
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * undo.js has loaded, now add the stack in
   */
  _undoLoaded(e) {
    this.stack = new Undo.Stack();
    // simple hook into being notified of changes to the object
    this.stack.changed = e => {
      this.canRedo = this.stack.canRedo();
      this.canUndo = this.stack.canUndo();
      this.isDirty = this.stack.dirty();
    };
    // execute once just to get these values
    this.stack.changed();
    // remove listener, we're loaded
    window.removeEventListener("undo-js-loaded", this._undoLoaded.bind(this));
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    // watch for changes to the element itself
    this.observer = new MutationObserver(mutations => {
      // ensure this was not a change record to perform undo/redo itself!
      if (this.blocked) {
        this.blocked = false;
        return;
      }
      // compare light dom children to previous value
      const newValue = this.innerHTML;
      if (this.stack && newValue != this.startValue) {
        // push an "edit comand"
        this.stack.execute(
          new UndoManagerCommand(this, this.startValue, newValue)
        );
        this.startValue = newValue;
      }
    });
    // watch attributes, children and the subtree for changes
    this.observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // ready to go, take a snapshot of our light dom children as text
    this.startValue = this.innerHTML;
  }
  /**
   * updated / notice property changes
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "canUndo") {
        // notify
        this.dispatchEvent(
          new CustomEvent("can-undo-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "canRedo") {
        // notify
        this.dispatchEvent(
          new CustomEvent("can-redo-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "isDirty") {
        // notify
        this.dispatchEvent(
          new CustomEvent("is-dirty-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  // execute an undo
  undo() {
    this.stack.undo();
  }
  // execute a redo
  redo() {
    return this.stack.redo();
  }
  // return a list of the command stack
  commands() {
    return this.stack.commands;
  }
  // return current stackPosition index
  stackPosition() {
    return this.stack.stackPosition;
  }
  // return save index as a reference point
  savePosition() {
    return this.stack.savePosition;
  }
  /**
   * Set a save position to check against at a later point in time
   */
  save() {
    this.stack.save();
  }
}
customElements.define("undo-manager", UndoManager);

/**
 * UndoManagerCommand, simple command scaffold to bridge undo.js with element
 */
class UndoManagerCommand {
  constructor(el, oldValue, newValue) {
    // refernece to us
    this.el = el;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
  // required for undo.js though we don't use
  execute() {}
  // perform a "undo"
  undo() {
    this.el.blocked = true;
    this.el.innerHTML = this.oldValue;
  }
  // perform a "redo"
  redo() {
    this.el.blocked = true;
    this.el.innerHTML = this.newValue;
  }
}
export { UndoManager, UndoManagerCommand };
