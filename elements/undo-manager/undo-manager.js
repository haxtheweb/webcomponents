/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
/**
 * `undo-manager`
 * `an undo history manager element`
 *  This brings ideas from https://addyosmani.com/blog/mutation-observers/
 *  back to life and this time as LitElement + with the web drastically
 *  moved forward vs when this was originally published (2014).
 *
 * @element undo-manager
 * @demo demo/index.html
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
         * Properties for the mutation observer
         */
        undoStackObserverProps: {
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
      this.__StackDebounce;
      this.undoStackLimit = 20;
      this.undoStackTimer = 300;
      this.undoStackIgnore = false;
      this.undoStackObserver = null;
      // this is aggressive but it should capture everything
      this.undoStackObserverProps = {
        attributes: true,
        attributeOldValue: true,
        childList: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true,
      };
      // set beginning value
      this.undoStackInitialValue = this.innerHTML;
      // set previous value, to start
      this.undoStackPrevValue = this.undoStackInitialValue;
    }
    /**
     * HTMLElement
     */
    connectedCallback() {
      // watch for changes to the element itself
      this.undoStackObserver = new MutationObserver((mutations) => {
        clearTimeout(this.__StackDebounce);
        this.__StackDebounce = setTimeout(() => {
          // ensure this was not a change record to perform undo/redo itself!
          if (this.undoStackIgnore) {
            this.undoStackIgnore = false;
            return;
          }
          // run the stack logic
          this.undoManagerStackLogic(mutations);
        }, this.undoStackTimer);
      });
      // watch attributes, children and the subtree for changes
      this.undoStackObserver.observe(this, this.undoStackObserverProps);
      this.undoManagerStackLogic({});
      super.connectedCallback();
    }
    /**
     * While a mutation observer, we only respond to there being ANY change
     * not the specfic record. This lets the developer select granularity
     * in what to notice (lots of stuff) yet only push state change
     * if it matches what they care to monitor as far as detail.
     * Default is to monitor every possible useful detail
     */
    undoManagerStackLogic(mutations) {
      // compare light dom children to previous value
      const newValue = this.innerHTML;
      if (
        this.undoStack &&
        newValue != "" &&
        newValue != this.undoStackPrevValue &&
        this.undoStackInitialValue != newValue
      ) {
        this.undoStack.execute(
          new UndoManagerCommand(this, this.undoStackPrevValue, newValue),
        );
        this.undoStackPrevValue = newValue;
        // we only notify there WAS a change
        this.dispatchEvent(
          new CustomEvent("stack-changed", {
            detail: {
              value: this.undoStack,
            },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
    /**
     * HTMLElement
     */
    disconnectedCallback() {
      if (this.undoStackObserver) {
        this.undoStackObserver.disconnect();
      }
      super.disconnectedCallback();
    }
    /**
     * LitElement ready
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.undoStack = new Undo();
      this.undoStack.undoStackLimit = this.undoStackLimit;
      this.undoStack.undoStackPosition = -1;
      this.undoStack.commands = [];
      // simple hook into being notified of changes to the object
      this.undoStack.changed = (e) => {
        this.canRedo = this.undoStack.canRedo();
        this.canUndo = this.undoStack.canUndo();
      };
      // execute once just to get these values
      this.undoStack.changed();
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
            }),
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
            }),
          );
        }
      });
    }
    // execute an undo
    undo() {
      return this.undoStack.undo();
    }
    // execute a redo
    redo() {
      return this.undoStack.redo();
    }
    // return a list of the command stack
    commands() {
      return this.undoStack.commands;
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
 * Fork of Undo.js - A undo/redo framework for JavaScript
 *
 * http://jzaefferer.github.com/undo
 *
 * Copyright (c) 2011 Jörn Zaefferer
 *
 * MIT licensed.
 */

class Undo {
  constructor() {
    this.commands = [];
    this.undoStackPosition = -1;
    this.undoStackLimit = 20;
  }
  execute(command) {
    // clear out the redo queue
    this._clearRedo();
    // run the command (inner for inner)
    command.execute();
    // if we're at our limit, start forgetting about past history but not all of it
    if (this.undoStackLimit == this.commands.length) {
      this.commands.splice(Math.round(this.commands.length / 3), 1);
    } else {
      // move the position forward
      this.undoStackPosition++;
    }
    // push the command into the stack
    this.commands.push(command);
    this.changed();
  }
  undo() {
    // sanity check
    if (this.commands[this.undoStackPosition]) {
      this.commands[this.undoStackPosition].undo();
      this.undoStackPosition--;
      this.changed();
    }
  }
  canUndo() {
    return this.undoStackPosition >= 0;
  }
  redo() {
    if (this.commands[this.undoStackPosition + 1]) {
      this.undoStackPosition++;
      this.commands[this.undoStackPosition].redo();
      this.changed();
    }
  }
  canRedo() {
    return this.undoStackPosition < this.commands.length - 1;
  }
  // remove right above where we are
  _clearRedo() {
    this.commands = this.commands.slice(0, this.undoStackPosition + 1);
  }
  changed() {
    // do nothing, override
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
    this.el.undoStackIgnore = true;
    // execute the change in value from what it was to what it is now
    if (
      this.el.undoStack.commands &&
      this.el.undoStack.commands[this.el.undoStack.undoStackPosition - 1]
    ) {
      this.el.innerHTML =
        this.el.undoStack.commands[
          this.el.undoStack.undoStackPosition - 1
        ].newValue;
    } else if (
      this.el.undoStack.commands &&
      this.el.undoStack.undoStackPosition === 0
    ) {
      this.el.innerHTML = this.el.undoStackInitialValue;
    } else {
      this.el.innerHTML = this.oldValue;
    }
  }
  // perform a "redo"
  redo() {
    this.el.undoStackIgnore = true;
    this.el.innerHTML = this.newValue;
  }
}
export { UndoManager, Undo, UndoManagerCommand, UndoManagerBehaviors };
