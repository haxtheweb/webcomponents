/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element/lit-element.js";
/**
 * `undo-manager`
 * `an undo history manager element`
 *  This brings ideas from https://addyosmani.com/blog/mutation-observers/
 *  back to life and this time as LitElement + with the web drastically
 *  moved forward vs when this was originally published (2014).
 *
 * @litelement
 * @demo demo/index.html
 * @element undo-manager
 */
const UndoManagerBehaviors = function (SuperClass) {
  return class extends SuperClass {
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
          attribute: "can-undo",
        },
        /**
         * If we can currently redo based on stack position
         */
        canRedo: {
          type: Boolean,
          attribute: "can-redo",
        },
        /**
         * If we're "dirty" meaning stackPosition and savePosition out of sync
         */
        isDirty: {
          type: Boolean,
          attribute: "is-dirty",
        },
        /**
         * Properties for the mutation observer
         */
        moProps: {
          type: Object,
        },
        /**
         * Allow for targetting OTHER elements w/ this behavior
         */
        target: {
          type: Object,
        },
        /**
         * The undo stack order
         */
        stack: {
          type: Object,
        },
      };
    }
    /**
     * HTMLElement
     */
    constructor() {
      super();
      this.__timer;
      this.undoTimer = 250;
      this.blocked = false;
      this.undoObserver = null;
      this.moProps = {
        attributes: true,
        childList: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true,
      };
      setTimeout(() => {
        this.startValue = this.innerHTML;
      }, 0);
    }
    /**
     * Simple path resolution from URL
     */
    pathFromUrl(url) {
      return url.substring(0, url.lastIndexOf("/") + 1);
    }
    /**
     * HTMLElement
     */
    connectedCallback() {
      // watch for changes to the element itself
      this.undoObserver = new MutationObserver((mutations) => {
        clearTimeout(this.__timer);
        this.__timer = setTimeout(() => {
          // ensure this was not a change record to perform undo/redo itself!
          if (this.blocked) {
            this.blocked = false;
            return;
          }
          // run the stack logic
          this.undoManagerStackLogic(mutations);
        }, this.undoTimer);
      });
      // watch attributes, children and the subtree for changes
      this.undoObserver.observe(this, this.moProps);
      super.connectedCallback();
    }
    undoManagerStackLogic(mutations) {
      // compare light dom children to previous value
      const newValue = this.innerHTML;
      if (this.stack && newValue != this.startValue) {
        // push an "edit comand"
        this.stack.execute(
          new UndoManagerCommand(this, this.startValue, newValue)
        );
        this.startValue = newValue;
        // we only notify there WAS a change
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("stack-changed", {
              detail: {
                value: true,
              },
              bubbles: true,
              composed: true,
            })
          );
        }, 0);
      }
    }
    /**
     * HTMLElement
     */
    disconnectedCallback() {
      this.undoObserver.disconnect();
      super.disconnectedCallback();
    }
    /**
     * LitElement ready
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.stack = new Undo();
      // simple hook into being notified of changes to the object
      this.stack.changed = (e) => {
        this.canRedo = this.stack.canRedo();
        this.canUndo = this.stack.canUndo();
        this.isDirty = this.stack.dirty();
      };
      // execute once just to get these values
      this.stack.changed();
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
                value: this[propName],
              },
              bubbles: true,
              composed: true,
            })
          );
        }
        if (propName == "canRedo") {
          // notify
          this.dispatchEvent(
            new CustomEvent("can-redo-changed", {
              detail: {
                value: this[propName],
              },
              bubbles: true,
              composed: true,
            })
          );
        }
        if (propName == "isDirty") {
          // notify
          this.dispatchEvent(
            new CustomEvent("is-dirty-changed", {
              detail: {
                value: this[propName],
              },
              bubbles: true,
              composed: true,
            })
          );
        }
      });
    }
    // execute an undo
    undo() {
      return this.stack.undo();
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
  };
};
class UndoManager extends UndoManagerBehaviors(LitElement) {
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
    return html`<slot></slot>`;
  }
}
customElements.define("undo-manager", UndoManager);

/*
 * Undo.js - A undo/redo framework for JavaScript
 *
 * http://jzaefferer.github.com/undo
 *
 * Copyright (c) 2011 Jörn Zaefferer
 *
 * MIT licensed.
 */

// based on Backbone.js' inherits
var ctor = function () {};
var inherits = function (parent, protoProps) {
  var child;

  if (protoProps && protoProps.hasOwnProperty("constructor")) {
    child = protoProps.constructor;
  } else {
    child = function () {
      return parent.apply(this, arguments);
    };
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();

  if (protoProps) extend(child.prototype, protoProps);

  child.prototype.constructor = child;
  child.__super__ = parent.prototype;
  return child;
};

function extend(target, ref) {
  var name, value;
  for (name in ref) {
    value = ref[name];
    if (value !== undefined) {
      target[name] = value;
    }
  }
  return target;
}

class Undo {
  constructor() {
    this.version = "0.1.15";
    this.commands = [];
    this.stackPosition = -1;
    this.savePosition = -1;
  }
  execute(command) {
    this._clearRedo();
    command.execute();
    this.commands.push(command);
    this.stackPosition++;
    this.changed();
  }
  undo() {
    this.commands[this.stackPosition].undo();
    this.stackPosition--;
    this.changed();
  }
  canUndo() {
    return this.stackPosition >= 0;
  }
  redo() {
    this.stackPosition++;
    this.commands[this.stackPosition].redo();
    this.changed();
  }
  canRedo() {
    return this.stackPosition < this.commands.length - 1;
  }
  save() {
    this.savePosition = this.stackPosition;
    this.changed();
  }
  dirty() {
    return this.stackPosition != this.savePosition;
  }
  _clearRedo() {
    // TODO there's probably a more efficient way for this
    this.commands = this.commands.slice(0, this.stackPosition + 1);
  }
  changed() {
    // do nothing, override
  }
}

class Command {
  constructor(name) {
    this.name = name;
  }
  execute() {
    throw up;
  }
  undo() {
    throw up;
  }
  redo() {
    this.execute();
  }
  extend(protoProps) {
    var child = inherits(this, protoProps);
    child.extend = Undo.Command.extend;
    return child;
  }
}
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
export { UndoManager, Undo, UndoManagerCommand, UndoManagerBehaviors };
