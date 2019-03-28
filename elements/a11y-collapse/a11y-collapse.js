import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "./lib/a11y-collapse-accordion-button.js";
import "./lib/a11y-collapse-icon-button.js";
/**
 * `a11y-collapse`
 * An accessible expand collapse.
 * 
 * @microcopy - the mental model for this element```
  <a11y-collapse 
    accordion 
    disabled
    icon=""                         //The expand/collapse icon. Default is "icons:expand-more"
    icon-expanded=""                //The expand/collapse icon when expanded. Default is the same as when collapsed.
    label=""                        //The expand/collapse label. Default is "expand/collapse"
    label-expanded=""               //The expand/collapse label when expanded. Default is the same as when collapsed.
    tooltip=""                      //The expand/collapse tooltip. Default is "toggle expand/collapse"
    tooltip-expanded=""             //The expand/collapse tooltip when expanded. Default is the same as when collapsed.
    <p slot="heading">...</p>       //Named slot for a heading.
    ...                             //Unnamed slot for a collapsible content.
  </a11y-collapse>

  CSS Variables: 
  --a11y-collapse-horizontal-padding               //sets the horizontal padding (left and right) inside the a11y-collapse
  --a11y-collapse-vertical-padding                 //sets the horizontal padding (top and bottom) inside the a11y-collapse
  --a11y-collapse-border                           //sets the border style. Default is 0px solid black

  CSS Mixins: 
  --a11y-collapse: { ... };                        //sets CSS for the a11y-collapse container
  --a11y-collapse-disabled: { ... };               //sets CSS for the a11y-collapse container when disabled
  --a11y-collapse-expanded: { ... };               //sets CSS for the a11y-collapse container when expanded
  --a11y-collapse-heading: { ... };                //sets CSS for the a11y-collapse heading
  --a11y-collapse-heading-expanded: { ... };       //sets CSS for the a11y-collapse heading when expanded
  --a11y-collapse-heading-focus: { ... };          //sets CSS for the a11y-collapse heading when focused or hovered
  --a11y-collapse-heading-text: { ... };           //sets CSS for the a11y-collapse heading text
  --a11y-collapse-heading-text-expanded: { ... };  //sets CSS for the a11y-collapse heading text when expanded
  --a11y-collapse-heading-text-focus: { ... };     //sets CSS for the a11y-collapse heading text when heading is focused or hovered
  --a11y-collapse-icon: { ... };                   //sets CSS for the a11y-collapse icon
  --a11y-collapse-icon-expanded: { ... };          //sets CSS for the a11y-collapse icon when expanded
  --a11y-collapse-icon-focus: { ... };             //sets CSS for the a11y-collapse icon when button is focused or hovered
  --a11y-collapse-icon-rotated: { ... };           //sets CSS for the a11y-collapse icon when rotated
  --a11y-collapse-content: { ... };                //sets CSS for the a11y-collapse expanded/collapsed content
  --a11y-collapse-content-expanded: { ... };       //sets CSS for the a11y-collapse expanded/collapsed content when expanded
```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 */
let A11yCollapse = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        margin: var(--a11y-collapse-margin, 15px 0);
        border: var(--a11y-collapse-border, 1px solid);
        transition: all 0.5s;
        @apply --a11y-collapse;
      }
      :host #content {
        max-height: 0;
        overflow: hidden;
        padding: 0 var(--a11y-collapse-horizontal-padding, 16px);
        border-top: 0px solid rgba(255, 255, 255, 0);
        transition: all 0.5s ease-in-out;
        @apply --a11y-collapse-content;
      }
      :host(:not(:first-of-type)) {
        border-top: var(
          --a11y-collapse-border-between,
          var(--a11y-collapse-border, 1px solid)
        );
      }
      :host([disabled]) {
        opacity: 0.5;
        @apply --a11y-collapse-disabled;
      }
      :host([disabled]:not([accordion])) #expand,
      :host([disabled][accordion]) #heading {
        cursor: not-allowed;
      }
      :host([expanded]) {
        @apply --a11y-collapse-expanded;
      }
      :host([expanded]) #content {
        max-height: unset;
        overflow: hidden;
        padding: var(--a11y-collapse-vertical-padding, 16px)
          var(--a11y-collapse-horizontal-padding, 16px);
        border-top: var(--a11y-collapse-border, 1px solid);
        @apply --a11y-collapse-content-expanded;
      }
      :host(:not([expanded])) #content-inner {
        overflow: hidden;
      }
    </style>
    <template is="dom-if" if="[[!accordion]]">
      <a11y-collapse-icon-button
        id="iconbutton"
        disabled$="[[disabled]]"
        expanded$="[[_setAriaExpanded(expanded)]]"
        label$="[[_getExpandCollapse(expanded,label,labelExpanded)]]"
        icon$="[[_getExpandCollapse(expanded,icon,iconExpanded)]]"
        rotated$="[[__rotateIcon]]"
        tooltip$="[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]"
      >
        <slot name="heading"></slot>
      </a11y-collapse-icon-button>
    </template>
    <template is="dom-if" if="[[accordion]]">
      <a11y-collapse-accordion-button
        id="accordionbutton"
        disabled$="[[disabled]]"
        expanded$="[[_setAriaExpanded(expanded)]]"
        label$="[[_getExpandCollapse(expanded,label,labelExpanded)]]"
        icon$="[[_getExpandCollapse(expanded,icon,iconExpanded)]]"
        rotated$="[[__rotateIcon]]"
        tooltip$="[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]"
      >
        <slot name="heading"></slot>
      </a11y-collapse-accordion-button>
    </template>
    <div
      id="content"
      aria-hidden\$="{{!expanded}}"
      aria-labelledby="heading"
      aria-live="polite"
    >
      <div id="content-inner"><slot name="content"></slot><slot></slot></div>
    </div>
  `,

  is: "a11y-collapse",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  listeners: { "a11y-collapse-tap": "_onTap" },

  properties: {
    /**
     * accordion-style: whole header acts as button? default is just icon.
     */
    accordion: {
      name: "accordion",
      type: Boolean,
      value: false,
      observer: "flush",
      reflectToAttribute: true
    },
    /**
     * is disabled?
     */
    disabled: {
      name: "disabled",
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * icon when expanded
     */
    expanded: {
      name: "expanded",
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: "_fireToggleEvents"
    },
    /**
     * icon for the button
     */
    icon: {
      name: "icon",
      type: String,
      value: "expand-more"
    },
    /**
     * icon when expanded
     */
    iconExpanded: {
      name: "iconExpanded",
      type: String,
      value: null
    },
    /**
     * label for the button
     */
    label: {
      name: "label",
      type: String,
      value: "expand/collapse"
    },
    /**
     * optional label for the button when expanded
     */
    labelExpanded: {
      name: "labelExpanded",
      type: String,
      value: null
    },
    /**
     * tooltip for the button
     */
    tooltip: {
      name: "tooltip",
      type: String,
      value: "toggle expand/collapse"
    },
    /**
     * optional tooltip for the button when expanded
     */
    tooltipExpanded: {
      name: "tooltipExpanded",
      type: String,
      value: null
    },
    /**
     * If no expanded icon is set, the default icon will rotate when expanded
     */
    __rotateIcon: {
      name: "__rotateIcon",
      type: Boolean,
      computed: "_isRotated(expanded,iconExpanded)"
    }
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    this.fire("a11y-collapse-attached", this);
    // Establish hax property binding
    let props = {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Single Expand Collapse",
        description: "A single instance of an expand collapse.",
        icon: "view-day",
        color: "grey",
        groups: ["Text"],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "expanded",
            title: "Expanded",
            description: "Expand by default",
            inputMethod: "boolean"
          },
          {
            property: "label",
            title: "Label",
            description: "The label of the toggle expand/collapse button",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "tooltip",
            title: "Tooltip",
            description: "The tooltip for the toggle expand/collapse button",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "icon",
            title: "Icon",
            description: "The icon for the toggle expand/collapse button",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "iconExpanded",
            title: "Expanded Icon",
            description:
              "Optional: The icon for the toggle expand/collapse button when expanded",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Collapses the content
   */
  collapse: function() {
    this.toggle(false);
  },

  /**
   * Let the group know that this is gone.
   */
  detached: function() {
    this.fire("a11y-collapse-detached", this);
  },

  /**
   * Expands the content
   */
  expand: function() {
    this.toggle(true);
  },

  /**
   * Toggles based on mode
   */
  toggle: function(mode) {
    this.expanded = mode !== undefined ? mode : !this.expanded;
  },

  /**
   * Fires toggling events
   */
  _fireToggleEvents: function() {
    this.fire("toggle", this);
    this.fire("a11y-collapse-toggle", this); //supports legacy version
    if (this.expanded) {
      this.fire("expand", this);
    } else {
      this.fire("collapse", this);
    }
  },

  /**
   * If no expanded value is set, the default will be same as collapsed
   */
  _overrideProp: function(prop, val) {
    this[prop] = val;
  },

  /**
   * If no expanded value is set, the default will be same as collapsed
   */
  _getExpandCollapse: function(expanded, ifFalse, ifTrue) {
    return expanded && ifTrue !== null ? ifTrue : ifFalse;
  },

  /**
   * If no expanded icon is set, the default icon will rotate when expanded
   */
  _isRotated: function(expanded, iconExpanded) {
    return !expanded && iconExpanded === null;
  },

  /**
   * Handle tap
   */
  _onTap: function(e) {
    if (!this.disabled) {
      this.toggle();
      this.fire("a11y-collapse-click", this);
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  _setAriaExpanded: function(expanded) {
    return "" + expanded;
  }
});
export { A11yCollapse };
