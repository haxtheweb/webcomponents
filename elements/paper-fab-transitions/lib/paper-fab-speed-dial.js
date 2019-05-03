import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-dropdown/iron-dropdown.js";
import "@polymer/neon-animation/neon-animations.js";
import "./paper-square-grow-animation.js";
/**
`paper-fab-speed-dial` builds on `iron-dropdown` to allow showing a list of
speed dial actions when tapping on a floating action button.

This element expects its content to contain two children: one with the class
`dropdown-trigger` , which is initially visible and acts as the trigger, and
another one with the class `dropdown-content` , which will be hidden until the
trigger is tapped, and will contain the speed dial option elements.

Example:

    <paper-fab-speed-dial>
      <paper-fab icon="add" class="dropdown-trigger"></paper-fab>
      <div class="dropdown-content">
        <paper-fab mini icon="star-border"></paper-fab>
        <paper-fab mini icon="star-half"></paper-fab>
        <paper-fab mini icon="star"></paper-fab>
      </div>
    </paper-fab-speed-dial>

The `direction` property can be set to `top`, `bottom`, `left` or `right` to
control the direction in which the options dropdown is expanded.

### Styling

The following custom properties and mixins are also available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-fab-speed-dial-option` | Mixin applied to each option element | `{}`

@hero hero.svg
* @demo demo/index.html
*/
class PaperFabSpeedDial extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style>
          :host .vertical ::content .dropdown-content {
            @apply --layout-vertical;
          }
          :host .horizontal ::content .dropdown-content {
            @apply --layout-horizontal;
          }
          :host ::content .dropdown-content > * {
            margin: 8px;
            @apply --paper-fab-speed-dial-option;
          }
        </style>
      </custom-style>
      <slot id="fabContainer" name="dropdown-trigger"></slot>
      <iron-dropdown
        id="dropdown"
        open-animation-config="[[openAnimationConfig]]"
        close-animation-config="[[closeAnimationConfig]]"
      >
        <slot id="contentContainer" name="dropdown-content"></slot>
      </iron-dropdown>
    `;
  }

  static get tag() {
    return "paper-fab-speed-dial";
  }

  static get properties() {
    return {
      /**
       * The direction in which to expand the options. One of `top`, `bottom`
       * `left` and `right`.
       */
      direction: {
        type: String,
        value: "bottom"
      },
      /**
       * A pixel value for the distance of the first option fron the trigger
       * button.
       */
      offset: {
        type: Number,
        value: 66
      },
      /**
       * An animation config. If provided, this will be used to animate the
       * opening of the options dropdown.
       */
      openAnimationConfig: {
        type: Array,
        value() {
          return [
            {
              name: "fade-in-animation",
              timing: {
                delay: 150,
                duration: 50
              }
            },
            {
              name: "paper-square-grow-animation",
              startSize: 56,
              timing: {
                delay: 150,
                duration: 200
              }
            }
          ];
        }
      },
      /**
       * An animation config. If provided, this will be used to animate the
       * closing of the options dropdown.
       */
      closeAnimationConfig: {
        type: Array,
        value() {
          return [
            {
              name: "fade-out-animation",
              timing: {
                duration: 200
              }
            }
          ];
        }
      }
    };
  }

  static get observers() {
    return ["_updateDropdown(direction, offset)"];
  }

  ready() {
    super.ready();

    var fab = dom(this.$.fabContainer).getDistributedNodes()[0];
    fab.addEventListener(
      "tap",
      function() {
        this.$.dropdown.open();
      }.bind(this)
    );

    var content = dom(this.$.contentContainer).getDistributedNodes()[0];
    content.addEventListener(
      "tap",
      function() {
        this.$.dropdown.close();
      }.bind(this)
    );
  }

  /**
   * Show the speed dial options.
   */
  open() {
    this.$.dropdown.open();
  }

  /**
   * Hide the speed dial options.
   */
  close() {
    this.$.dropdown.close();
  }

  _updateDropdown(direction, offset) {
    var d = this.$.dropdown;
    switch (direction) {
      case "bottom":
        d.verticalAlign = "top";
        d.horizontalOffset = 0;
        d.verticalOffset = offset;
        d.classList.add("vertical");
        d.classList.remove("horizontal");
        break;
      case "top":
        d.verticalAlign = "bottom";
        d.horizontalOffset = 0;
        d.verticalOffset = offset;
        d.classList.add("vertical");
        d.classList.remove("horizontal");
        break;
      case "right":
        d.horizontalAlign = "left";
        d.horizontalOffset = offset;
        d.verticalOffset = 0;
        d.classList.add("horizontal");
        d.classList.remove("vertical");
        break;
      case "left":
        d.horizontalAlign = "right";
        d.horizontalOffset = offset;
        d.verticalOffset = 0;
        d.classList.add("horizontal");
        d.classList.remove("vertical");
        break;
      default:
        throw "Invalid direction. Must be one of [top, bottom, left, right].";
    }
  }
}
window.customElements.define(PaperFabSpeedDial.tag, PaperFabSpeedDial);
export { PaperFabSpeedDial };
