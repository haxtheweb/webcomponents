import "hax-editbar/hax-editbar.js";
import "hax-editable/hax-editable.js";
import "hax-ajax/hax-ajax.js";
// ensure HAXBehaviors exists globally before acting on them
window.HAXBehaviors = window.HAXBehaviors || {};
// create a behavior for elements that have a 'hax' edit state connotation
window.HAXBehaviors.EditBehaviors = {
  properties: {
    /**
     * edit state
     */
    edit: {
      type: Boolean,
      value: false,
      reflectAttribute: true,
      readOnly: false,
      notify: true,
      observer: "_editChanged"
    },
    showHax: {
      type: Boolean,
      value: false,
      reflectAttribute: true,
      notify: true
    }
  },
  /**
   * Ready state to ensure we are listening for actions to take place from hax
   */
  ready: function() {
    let root = this;
    this.$$("hax-editbar").addEventListener("haxAction", function(e) {
      let action = e.detail.action;
      switch (action) {
        case "edit":
          root.edit = true;
          break;
        case "save":
          root.edit = false;
          break;
        case "cancel":
          root.edit = false;
          break;
      }
    });
  },
  /**
   * Listener for edit state changing.
   */
  _editChanged: function(edit) {
    if (edit === false) {
    }
  }
};
