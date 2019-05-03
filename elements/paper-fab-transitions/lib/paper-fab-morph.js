import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-dropdown/iron-dropdown.js";
/**
`paper-fab-morph` can be used to wrap a floating action button and another
element which is initially hidden, and when tapping the button, it will appear
as if the button is morphing into the other element, which appears in its place.

This element expects its content to contain two children: one with the class
`dropdown-trigger` , which is initially visible and acts as the trigger, and
another one with the class `dropdown-content` , which will be hidden until the
trigger is tapped.

Example:

    <paper-fab-morph>
      <paper-fab icon="menu" class="dropdown-trigger">
      <paper-material class="dropdown-content">
        <paper-menu>
          <paper-item>One</paper-item>
          <paper-item>Two</paper-item>
        </paper-menu>
      </paper-mterial>
    </paper-fab-morph>

In the example above, the menu will be wrapped by an `iron-dropdown` element
and will be positioned relative to the button. Positioning can be modified by
setting the `horizontalAlign`, `verticalAlign`, `horizontalOffset` and
`verticalOffset` properties.

Alternatively, it's possible to set content element with fixed position, which
nullifies the dropdown positioning. This is useful for morphing into toolbars
and full screen elements for example.

It is also possible to use an element which implements overlay behavior as the
content, instead of having it wrapped with an `iron-dropdown`. In this case, the
`isOverlayContent` property should be set to true.

Example:

    <paper-fab-morph is-overlay-content>
      <paper-fab icon="create" class="dropdown-trigger">
      <paper-dialog class="dropdown-content">
        <div>Dialog</div>
      <paper-dialog>
    </paper-fab-morph>

### Styling

The following custom properties and mixins are also available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-morph-background` | Background color of the morphing element | `#fff`
`--paper-morph-dropdown` | Mixin applied to the `iron-dropdown` | `{}`
`--paper-morph-content` | Mixin applied to the dropdown's content | `{}`

@hero hero.svg
* @demo demo/index.html
*/
class PaperFabMorph extends PolymerElement {
  static get template() {
    return html`
      <style>
        iron-dropdown {
          @apply --paper-morph-dropdown;
        }
        .dropdown-content {
          @apply --paper-morph-content;
        }
        #morpher {
          position: fixed;
          display: none;
          background-color: var(--paper-morph-background, #fff);
        }
      </style>
      <span id="fabContainer" class="dropdown-trigger"
        ><slot name="dropdown-trigger"></slot
      ></span>
      <span id="contentContainer" class="dropdown-content"
        ><slot name="dropdown-content"></slot
      ></span>
      <paper-material id="morpher"></paper-material>
    `;
  }

  static get tag() {
    return "paper-fab-morph";
  }

  static get properties() {
    return {
      /**
       * Whether the content already has overlay behavior.
       * If false, it will be wrapped by an iron-dropdown element, which can be
       * configured with `horizontalAlign`, `verticalAlign`, `horizontalOffset`
       * and `verticalOffset` properties.
       */
      isOverlayContent: {
        type: Boolean,
        value: false
      },
      /**
       * The transition duration in milliseconds.
       */
      duration: {
        type: Number,
        value: 200
      },
      /**
       * The orientation against which to align the dropdown
       * horizontally relative to the trigger button.
       */
      horizontalAlign: {
        type: String,
        value: "left",
        reflectToAttribute: true
      },

      /**
       * The orientation against which to align the dropdown
       * vertically relative to the trigger button.
       */
      verticalAlign: {
        type: String,
        value: "top",
        reflectToAttribute: true
      },

      /**
       * A pixel value that will be added to the position calculated for the
       * given `horizontalAlign`. Use a negative value to offset to the
       * left, or a positive value to offset to the right.
       */
      horizontalOffset: {
        type: Number,
        value: 0,
        notify: true
      },

      /**
       * A pixel value that will be added to the position calculated for the
       * given `verticalAlign`. Use a negative value to offset towards the
       * top, or a positive value to offset towards the bottom.
       */
      verticalOffset: {
        type: Number,
        value: 0,
        notify: true
      }
    };
  }

  static get observers() {
    return [
      "_updateOverlayPosition(verticalAlign, horizontalAlign, verticalOffset, horizontalOffset)"
    ];
  }

  ready() {
    super.ready();
    this._fab = this.$.fabContainer;
    this._content = this.$.contentContainer;

    if (this.isOverlayContent) {
      this._fab.addEventListener(
        "tap",
        function() {
          this._content.open();
        }.bind(this)
      );

      this._overlay = this._content;
    } else {
      var dropdown = document.createElement("iron-dropdown");

      dom(dropdown).appendChild(this._content);
      dom(this.root).appendChild(dropdown);

      this._overlay = dropdown;
      this._dropdown = dropdown;

      this._fab.addEventListener(
        "tap",
        function() {
          this._dropdown.open();
        }.bind(this)
      );

      this._updateOverlayPosition(
        this.verticalAlign,
        this.horizontalAlign,
        this.verticalOffset,
        this.horizontalOffset
      );
    }

    this._overlay.addEventListener(
      "iron-overlay-opened",
      function() {
        this._morphOpen();
      }.bind(this)
    );

    this._overlay.addEventListener(
      "iron-overlay-closed",
      function() {
        this._morphClose();
      }.bind(this)
    );
  }

  /**
   * Show the content.
   */
  open() {
    this._overlay.open();
  }

  /**
   * Hide the content.
   */
  close() {
    this._overlay.close();
  }

  _updateOverlayPosition(
    verticalAlign,
    horizontalAlign,
    verticalOffset,
    horizontalOffset
  ) {
    if (this._dropdown) {
      var d = this._dropdown;
      d.verticalAlign = verticalAlign;
      d.horizontalAlign = horizontalAlign;
      d.verticalOffset = verticalOffset;
      d.horizontalOffset = horizontalOffset;
    }
  }

  _morphOpen() {
    var fab = this._fab;
    var content = this._content;

    var fabRect = fab.getBoundingClientRect();
    var morpher = this.$.morpher;
    var ms = morpher.style;

    ms.display = "block";
    ms.top = fabRect.top + "px";
    ms.left = fabRect.left + "px";
    ms.width = fabRect.width + "px";
    ms.height = fabRect.height + "px";
    ms.borderRadius = "50%";
    ms.transitionDuration = this.duration + "ms";

    fab.style.visibility = "hidden";
    content.style.visibility = "hidden";

    var contentRect = content.getBoundingClientRect();

    ms.top = contentRect.top + "px";
    ms.left = contentRect.left + "px";
    ms.width = contentRect.width + "px";
    ms.height = contentRect.height + "px";
    ms.borderRadius = "";

    microTask.run(() => {
      morpher.style.display = "none";
      content.style.visibility = "visible";
    });
  }

  _morphClose() {
    var fab = this._fab;
    var content = this._content;

    var contentRect = fab.getBoundingClientRect();
    var morpher = this.$.morpher;
    var ms = morpher.style;

    morpher.style.display = "block";

    microTask.run(() => {
      var fabRect = fab.getBoundingClientRect();
      ms.top = fabRect.top + "px";
      ms.left = fabRect.left + "px";
      ms.width = fabRect.width + "px";
      ms.height = fabRect.height + "px";
      ms.borderRadius = "50%";

      microTask.run(() => {
        morpher.style.display = "none";
        fab.style.visibility = "visible";
      });
    });
  }
}
window.customElements.define(PaperFabMorph.tag, PaperFabMorph);
export { PaperFabMorph };
