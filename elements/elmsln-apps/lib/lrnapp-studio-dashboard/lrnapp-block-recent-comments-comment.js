import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrn-icon/lrn-icon.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
class LrnappBlockRecentCommentsComment extends mixinBehaviors(
  [IronResizableBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        paper-card {
          padding: 2em 2em 0 2em;
          clear: right;
        }

        paper-button {
          background-color: var(--paper-grey-100);
          margin: 1em;
        }

        .card-content {
          padding-left: 2em;
          padding-right: 2em;
          width: 100%;
        }

        .card-actions {
          width: 100%;
        }

        .card-actions paper-button {
          display: flex;
        }

        lrndesign-avatar {
          float: left;
          margin-right: 1em;
        }

        .flex-wrap {
          @apply --layout-horizontal;
          @apply --layout-wrap;
        }

        .inactive {
          max-height: 4.6em;
          overflow: hidden;
        }

        paper-button {
          background: white;
          width: 100%;
          display: flex;
        }

        lrn-icon {
          color: black;
          width: 100%;
        }

        .hidden {
          display: none;
        }
      </style>
      <paper-card elevation="3" class="flex-wrap">
        <div class="card-content">
          <lrndesign-avatar
            label="[[commentUser.name]]"
            src="[[commentUser.avatar]]"
          ></lrndesign-avatar>
          <h3>[[commentUser.display_name]]</h3>
          <div id="wrapper" class="button-wrapper">
            <div id="comment" class="inactive"><slot></slot></div>
            <paper-button id="btn" class="hidden">
              <lrn-icon icon="chevron-down" id="icon"></lrn-icon>
            </paper-button>
          </div>
        </div>
        <div class="card-actions">
          <template is="dom-if" if="[[actionView]]">
            <a href$="[[actionView]]" tabindex="-1">
              <paper-button raised="" id="view">View thread</paper-button>
            </a>
          </template>
        </div>
      </paper-card>
    `;
  }

  static get tag() {
    return "lrnapp-block-recent-comments-comment";
  }

  onHeightChange() {
    var height = this.shadowRoot.querySelector("#comment").offsetHeight;
    if (height > 80) {
      this.shadowRoot
        .querySelector("#btn")
        .classList.toggle("hidden", this.hidden);
    }
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String
      },
      elmslnSection: {
        type: String
      },
      basePath: {
        type: String
      },
      csrfToken: {
        type: String
      },
      endPoint: {
        type: String
      },
      commentTitle: {
        type: String,
        value: "Comment title",
        reflectToAttribute: true,
        notify: true
      },
      actionView: {
        type: String,
        reflectToAttribute: true,
        notify: true
      },
      dateUpdated: {
        type: String,
        reflectToAttribute: true,
        notify: true
      },
      commentUser: {
        type: Object,
        value: {},
        reflectToAttribute: true,
        notify: true
      }
    };
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.shadowRoot
        .querySelector("#wrapper")
        .addEventListener("click", function(e) {
          this.shadowRoot
            .querySelector("#comment")
            .classList.toggle("inactive", this.inactive);
        });
      this.addEventListener("iron-resize", this.onHeightChange.bind(this));
    });
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#wrapper")
      .removeEventListener("click", function(e) {
        this.shadowRoot
          .querySelector("#comment")
          .classList.toggle("inactive", this.inactive);
      });
    this.removeEventListener("iron-resize", this.onHeightChange.bind(this));
    super.disconnectedCallback();
  }
}
window.customElements.define(
  LrnappBlockRecentCommentsComment.tag,
  LrnappBlockRecentCommentsComment
);
export { LrnappBlockRecentCommentsComment };
