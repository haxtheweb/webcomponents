import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./lib/a11y-collapse-accordion-button.js";
import "./lib/a11y-collapse-icon-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        border: var(--a11y-collapse-border, 1px solid);
        margin: 15px 0;
        transition: all 0.5s;
        @apply --a11y-collapse;
      }
      :host #content {
        max-height: 0;
        overflow: hidden;
        padding: 0 var(--a11y-collapse-horizontal-padding, 16px);
        border-top: 0px solid rgba(255,255,255,0);
        transition: all 0.5s ease-in-out;
        @apply --a11y-collapse-content;
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
        overflow: visibility: hidden;;
        padding: var(--a11y-collapse-vertical-padding, 16px) var(--a11y-collapse-horizontal-padding, 16px);
        border-top: var(--a11y-collapse-border, 0px solid);
        @apply --a11y-collapse-content-expanded;
      }
      :host(:not([expanded])) #content-inner {
        overflow: hidden;
      }
    </style>
    <template is="dom-if" if="[[!accordion]]">
      <a11y-collapse-icon-button id="iconbutton" disabled$="[[disabled]]" expanded$="[[_setAriaExpanded(expanded)]]" label$="[[_getExpandCollapse(expanded,label,labelExpanded)]]" icon$="[[_getExpandCollapse(expanded,icon,iconExpanded)]]" rotated$="[[__rotateIcon]]" tooltip$="[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]">
        <slot name="heading"></slot>
      </a11y-collapse-icon-button>
    </template>
    <template is="dom-if" if="[[accordion]]">
      <a11y-collapse-accordion-button id="accordionbutton" disabled$="[[disabled]]" expanded$="[[_setAriaExpanded(expanded)]]" label$="[[_getExpandCollapse(expanded,label,labelExpanded)]]" icon$="[[_getExpandCollapse(expanded,icon,iconExpanded)]]" rotated$="[[__rotateIcon]]" tooltip$="[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]">
        <slot name="heading"></slot>
      </a11y-collapse-accordion-button>
    </template>
    <div id="content" aria-hidden\$="{{!expanded}}" aria-labelledby="heading" aria-live="polite">
      <div id="content-inner"><slot name="content"></slot><slot></slot></div>
    </div>
`,
  is: "a11y-collapse",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  listeners: { "a11y-collapse-tap": "_onTap" },
  properties: {
    accordion: {
      type: Boolean,
      value: !1,
      observer: "flush",
      reflectToAttribute: !0
    },
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    expanded: { type: Boolean, value: !1, reflectToAttribute: !0 },
    icon: { type: String, value: "icons:expand-more" },
    iconExpanded: { type: String, value: null },
    label: { type: String, value: "expand/collapse" },
    labelExpanded: { type: String, value: null },
    tooltip: { type: String, value: "toggle expand/collapse" },
    tooltipExpanded: { type: String, value: null },
    __rotateIcon: {
      type: Boolean,
      computed: "_isRotated(expanded,iconExpanded)"
    }
  },
  attached: function() {
    this.fire("a11y-collapse-attached", this);
    this.setHaxProperties({
      canScale: !1,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Single Expand Collapse",
        description: "A single instance of an expand collapse.",
        icon: "view-day",
        color: "grey",
        groups: ["Text"],
        meta: { author: "Your organization on github" }
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
    });
  },
  detached: function() {
    this.fire("a11y-collapse-detached", this);
  },
  toggle: function(mode) {
    this.expanded = mode !== void 0 ? mode : !this.expanded;
    this.fire("a11y-collapse-toggle", this);
  },
  _overrideProp: function(prop, val) {
    this[prop] = val;
  },
  _getExpandCollapse: function(expanded, ifFalse, ifTrue) {
    return expanded && null !== ifTrue ? ifTrue : ifFalse;
  },
  _isRotated: function(expanded, iconExpanded) {
    return !expanded && null === iconExpanded;
  },
  _onTap: function(e) {
    console.log(e);
    if (!this.disabled) {
      this.toggle();
      this.fire("a11y-collapse-click", this);
    }
  },
  _setAriaExpanded: function(expanded) {
    return "" + expanded;
  }
});
