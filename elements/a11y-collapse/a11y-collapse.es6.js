import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { flush } from "@polymer/polymer/lib/utils/flush.js";
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
class A11yCollapse extends PolymerElement {
  static get template() {
    return html`
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
          padding: 0
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, 16px)
            )
            0
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, 16px)
            );
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
          padding: var(
              --a11y-collapse-padding-top,
              var(--a11y-collapse-vertical-padding, 16px)
            )
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, 16px)
            )
            var(
              --a11y-collapse-padding-bottom,
              var(--a11y-collapse-vertical-padding, 16px)
            )
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, 16px)
            );
          border-top: var(--a11y-collapse-border, 1px solid);
          @apply --a11y-collapse-content-expanded;
        }
        :host(:not([expanded])) #content-inner {
          overflow: hidden;
        }
      </style>
      <template is="dom-if" if="[[!accordion]]" restamp>
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
      <template is="dom-if" if="[[accordion]]" restamp>
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
    `;
  }
  static get tag() {
    return "a11y-collapse";
  }
  static get properties() {
    return {
      /**
       * accordion-style: whole header acts as button? default is just icon.
       */
      accordion: {
        name: "accordion",
        type: Boolean,
        value: false,
        observer: "_flush",
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
    };
  }
  _flush(newValue) {
    flush();
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-attached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    afterNextRender(this, function() {
      this.addEventListener("a11y-collapse-tap", this._onTap.bind(this));
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(A11yCollapse.haxProperties, A11yCollapse.tag, this);
    });
  }
  static get haxProperties() {
    return {
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
  }
  /**
   * Collapses the content
   */
  collapse() {
    this.toggle(false);
  }

  /**
   * Let the group know that this is gone.
   */
  disconnectedCallback() {
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-detached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    this.removeEventListener("a11y-collapse-tap", this._onTap.bind(this));
    super.disconnectedCallback();
  }

  /**
   * Expands the content
   */
  expand() {
    this.toggle(true);
  }

  /**
   * Toggles based on mode
   */
  toggle(mode) {
    this.expanded = mode !== undefined ? mode : !this.expanded;
  }

  /**
   * Fires toggling events
   */
  _fireToggleEvents() {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    //supports legacy version
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    if (this.expanded) {
      this.dispatchEvent(
        new CustomEvent("expand", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("collapse", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }

  /**
   * If no expanded value is set, the default will be same as collapsed
   */
  _overrideProp(prop, val) {
    this[prop] = val;
  }

  /**
   * If no expanded value is set, the default will be same as collapsed
   */
  _getExpandCollapse(expanded, ifFalse, ifTrue) {
    return expanded && ifTrue !== null ? ifTrue : ifFalse;
  }

  /**
   * If no expanded icon is set, the default icon will rotate when expanded
   */
  _isRotated(expanded, iconExpanded) {
    return !expanded && iconExpanded === null;
  }

  /**
   * Handle tap
   */
  _onTap(e) {
    if (!this.disabled) {
      this.toggle();
      this.dispatchEvent(
        new CustomEvent("a11y-collapse-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }

  /**
   * Attached to the DOM, now fire.
   */
  _setAriaExpanded(expanded) {
    return "" + expanded;
  }
}
window.customElements.define(A11yCollapse.tag, A11yCollapse);
export { A11yCollapse };
