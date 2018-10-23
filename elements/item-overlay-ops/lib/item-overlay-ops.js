import "@polymer/polymer/polymer.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
/**
`item-overlay-ops`
Overlayed editing ops on whatever the current item slotted in is

@demo demo/index.html

@microcopy - the mental model for this element

*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        outline: none;
      }
      #container {
        display: none;
        opacity: 0;
        background-color: transparent;
        transition: background-color .6s linear, visibility .6s linear, opacity .6s linear;
        visibility: hidden;
      }
      :host[edit-mode] #container {
        display: block;
        opacity: .4;
        visibility: visible;
        background-color: var(--item-overlay-ops, #999999);
        position: absolute;
        z-index: 1;
      }
      :host[edit-mode] #container:hover,
      :host[edit-mode] #container:focus,
      :host[focused] #container {
        opacity: .8;
        background-color: var(--item-overlay-ops, #ffffff);
      }
      .ops {
        width: 100%;
        height: 39px;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid rgba(100, 100, 100, .4);
        text-align: center;
      }
      .ops paper-icon-button {
        display: inline-flex;
        width: 30px;
        height: 30px;
        padding: 2px;
        margin: 5px 8px;
        color: #999999;
      }
      .ops paper-icon-button.active {
        color: #000000;
        background-color: rgba(255, 255, 255, .6);
        border-radius: 50%;
      }
      .active-op {
        text-transform:capitalize;
        margin: 0;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        text-align: center;
      }
      #workingarea {
        width: 100%;
        padding: 0;
        margin: 0 auto;
        align-content: center;
      }
      #workingarea paper-icon-button {
        width: 50%;
        height: 100%;
        display: inline-flex;
        min-width: unset;
        padding: 16px;
        margin: 0;
        border: none;
        border-radius: 0;
      }
      #workingarea #option1 {
        background-color: rgba(100, 255, 100, .6);
      }
      #workingarea #option2 {
        background-color: rgba(255, 100, 100, .6);
      }
      #workingarea #option1:hover,
      #workingarea #option1:focus {
        background-color: rgba(100, 255, 100, 1);
      }
      #workingarea #option2:hover,
      #workingarea #option2:focus {
        background-color: rgba(255, 100, 100, 1);
      }
      #workingarea {
        display: none;
      }
      #workingarea.move {
        display: flex;
      }
      #workingarea.move #option1,
      #workingarea.move #option2 {
        background-color: rgba(200, 200, 200, .5);
      }
      #workingarea.move #option1:hover,
      #workingarea.move #option1:focus,
      #workingarea.move #option2:hover,
      #workingarea.move #option2:focus {
        background-color: rgba(200, 200, 200, 1);
      }
      #workingarea.remove {
        display: flex;
      }
      #workingarea.duplicate {
        display: flex;
      }
    </style>
    <div id="container">
      <div class="ops">
        <paper-icon-button icon="icons:add" id="add" hidden\$="[[!add]]" title="Add to this"></paper-icon-button>
        <paper-icon-button icon="icons:create" id="edit" hidden\$="[[!edit]]" title="Edit this"></paper-icon-button>
        <paper-icon-button icon="icons:swap-horiz" id="move" hidden\$="[[!move]]" title="Move this"></paper-icon-button>
        <paper-icon-button icon="icons:delete" id="remove" hidden\$="[[!remove]]" title="Delete this"></paper-icon-button>
        <paper-icon-button icon="icons:content-copy" id="duplicate" hidden\$="[[!duplicate]]" title="Duplicate this"></paper-icon-button>
      </div>
      <div class="active-op">[[activeTitle]]</div>
      <div id="workingarea" class\$="[[activeOp]]">
        <paper-icon-button id="option1" title="[[__option1Text]]" icon="[[__option1Icon]]"></paper-icon-button>
        <paper-icon-button id="option2" title="[[__option2Text]]" icon="[[__option2Icon]]"></paper-icon-button>
      </div>
    </div>
    <slot></slot>
`,

  is: "item-overlay-ops",

  listeners: {
    "add.tap": "_opTap",
    "edit.tap": "_opTap",
    "move.tap": "_opTap",
    focusin: "_inFocus",
    focusout: "_outFocus",
    "remove.tap": "_opTap",
    "duplicate.tap": "_opTap",
    "option1.tap": "_optionSelected",
    "option2.tap": "_optionSelected"
  },

  hostAttributes: {
    tabindex: "0"
  },

  properties: {
    /**
     * Edit mode whether it is shown or not
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Edit mode whether it is shown or not
     */
    focused: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Title to present of active option
     */
    activeTitle: {
      type: String
    },
    /**
     * Active operation
     */
    activeOp: {
      type: String
    },
    /**
     * Add opertaions
     */
    add: {
      type: Boolean,
      value: false
    },
    /**
     * Edit opertaions
     */
    edit: {
      type: Boolean,
      value: false
    },
    /**
     * Move opertaions
     */
    move: {
      type: Boolean,
      value: false
    },
    /**
     * Remove opertaions
     */
    remove: {
      type: Boolean,
      value: false
    },
    /**
     * Duplicate opertaions
     */
    duplicate: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    // delay is enough to get the height correct
    setTimeout(() => {
      let rect = this.getBoundingClientRect();
      this.$.container.style.width = rect.width + "px";
      this.$.container.style.height = rect.height + "px";
      this.$.workingarea.style.height = rect.height - 80 + "px";
    }, 1);
    window.addEventListener("resize", this._windowResize.bind(this));
  },

  _windowResize: function(e) {
    let rect = this.getBoundingClientRect();
    this.$.container.style.width = rect.width + "px";
    this.$.container.style.height = rect.height + "px";
    this.$.workingarea.style.height = rect.height - 80 + "px";
  },

  /**
   * Support tapping the buttons in the top
   */
  _opTap: function(e) {
    let normalizedEvent = Polymer.dom(e);
    let local = normalizedEvent.localTarget;
    this.activeTitle = local.getAttribute("id");
    this.activeOp = local.getAttribute("id");
    this._resetActive();
    local.classList.add("active");
    // we switch icons for these
    switch (this.activeOp) {
      case "remove":
        this.__option1Icon = "icons:check";
        this.__option1Text = "Confirm deleting this";
        this.__option2Icon = "icons:clear";
        this.__option2Text = "Cancel";
        break;
      case "duplicate":
        this.__option1Icon = "icons:check";
        this.__option1Text = "Confirm duplicating this";
        this.__option2Icon = "icons:clear";
        this.__option2Text = "Cancel";
        break;
      case "move":
        this.__option1Icon = "icons:arrow-back";
        this.__option1Text = "Move item left";
        this.__option2Icon = "icons:arrow-forward";
        this.__option2Text = "Move item right";
        break;
    }
    // let others know there's an event here
    let op = {
      element: this,
      operation: this.activeOp
    };
    this.fire("item-overlay-op-changed", op);
  },

  /**
   * Set element reflected focus so we can get the whole thing
   */
  _inFocus: function(e) {
    if (this.editMode) {
      this.focused = true;
    }
  },

  /**
   * Drop element reflection when all focus offs are fired
   */
  _outFocus: function(e) {
    if (this.editMode) {
      this.focused = false;
    }
  },

  /**
   * fire event because an option was selected.
   */
  _optionSelected: function(e) {
    let normalizedEvent = Polymer.dom(e);
    let local = normalizedEvent.localTarget;
    // fire that an option was selected and about what operation
    let ops = {
      element: this,
      operation: this.activeOp,
      option: local.getAttribute("id")
    };
    this.fire("item-overlay-option-selected", ops);
    // don't reset for movement, just confirm / reject actions
    if (this.activeOp != "move") {
      this._resetActive();
      this.activeOp = null;
    }
  },

  /**
   * Reset the active selections
   */
  _resetActive: function() {
    this.$.add.classList.remove("active");
    this.$.edit.classList.remove("active");
    this.$.move.classList.remove("active");
    this.$.remove.classList.remove("active");
    this.$.duplicate.classList.remove("active");
  }
});
