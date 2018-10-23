import "@polymer/polymer/polymer.js";
import "@polymer/paper-button/paper-button.js";
import "./hax-manager.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        position: relative;
      }
      :host[active] {
      }
      :host ::shadow *[data-hax-content] {
        position: relative;
      }
      :host ::shadow #add-button {
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
        transition: all 1s ease;
        background-color: rgba(0.8);
        border-radius: 50%;
        background-color: rgba(200,200,200,1);
        box-shadow: 0 0 5px rgba(200,200,200, 0.8);
        @apply --hax-content-add-button;
      }
      :host ::shadow #add-button[visible] {
        opacity: 1;
      }
      :host ::shadow #add-button {
      }
    </style>
    <div id="content">
      <content></content>
    </div>
    <hax-manager opened="[[active]]" components="[&quot;lrndesign-card&quot;, &quot;lrndesign-blockquote&quot;, &quot;lrndesign-panelcard&quot;, &quot;lrndesign-drawer&quot;, &quot;lrndesign-avatar&quot;, &quot;lrndesign-contentblock&quot;]"></hax-manager>
    <paper-icon-button visible\$="[[addButtonVisible]]" id="add-button" icon="add" tabindex="0" on-tap="_clickedAddButton"></paper-icon-button>
`,

  is: "hax-content",

  properties: {
    active: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_changedActive"
    },
    activeId: {
      type: String,
      observer: "_changedActiveId"
    },
    addButtonVisible: {
      type: Boolean,
      observer: "_changedAddButtonVisible"
    }
  },

  listeners: {
    "hax-manager-component-selected": "_haxManagerComponentSelected",
    "iron-overlay-closed": "_dialogClosed"
  },

  ready: function() {
    const root = this;
    const content = this.$$("#content");
    const addButton = this.$$("#add-button");

    // Listen for when a user hovers over a hax element.
    content.addEventListener("mouseover", function(e) {
      // make sure it's a hax content element
      if (e.target.hasAttribute("data-hax-content")) {
        // get the id of the target
        let id = e.target.id;
        if (id) {
          // set the new active id of the hovered element
          root.activeId = id;
          // append the add button under the element
          root.addButtonVisible = false;
          e.target.appendChild(addButton);
          root.addButtonVisible = true;
        }
      }
    });
  },

  _changedActiveId: function(id, old) {},

  _changedActive: function(active, old) {},

  _changedAddButtonVisible: function(visible, old) {},

  _tapped: function(e) {},

  _haxManagerComponentSelected: function(e) {
    const root = this;
    // this is the new node that we are going to
    // insert
    let node = e.detail.node;
    // add a unique id to the node
    node.setAttribute("data-hax-content", true);
    // generate a random 8 digit number and add it as a unique id
    node.setAttribute("id", Math.floor(Math.random() * 90000000) + 10000000);
    // loop over the parent nodes and figure out where the active node
    // is in the list of child nodes. Find the index. Then use insertBefore
    // to place the new node in the list.
    let activeNode = document.getElementById(this.activeId);
    let parent = activeNode.parentNode;
    parent.childNodes.forEach(function(element, i) {
      if (element.id === root.activeId) {
        // increment the original index to place it below the active node.
        parent.insertBefore(node, parent.childNodes[++i]);
      }
    });
    // set the active back to false to indicate that we are done
    // adding media
    this.active = false;
  },

  _dialogClosed: function(e) {
    this.active = false;
  },

  _clickedAddButton: function(e) {
    this.active = true;
  }
});
