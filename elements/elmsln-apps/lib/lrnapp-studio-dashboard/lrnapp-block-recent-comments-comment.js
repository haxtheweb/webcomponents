import { LitElement, html, css } from "lit-element/lit-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrn-icon/lrn-icon.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
class LrnappBlockRecentCommentsComment extends mixinBehaviors(
  [IronResizableBehavior],
  PolymerElement
) {
  render() {
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
            label="${this.commentUser.name}"
            src="${this.commentUser.avatar}"
          ></lrndesign-avatar>
          <h3>${this.commentUser.display_name}</h3>
          <div id="wrapper" class="button-wrapper">
            <div id="comment" class="inactive"><slot></slot></div>
            <paper-button id="btn" class="hidden">
              <lrn-icon icon="chevron-down" id="icon"></lrn-icon>
            </paper-button>
          </div>
        </div>
        <div class="card-actions">
          ${this.actionView
            ? html`
                <a href="${this.actionView}" tabindex="-1">
                  <paper-button raised="" id="view">View thread</paper-button>
                </a>
              `
            : ``}
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
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      commentTitle: {
        type: String,
        reflect: true
      },
      actionView: {
        type: String,
        reflect: true
      },
      dateUpdated: {
        type: String,
        reflect: true
      },
      commentUser: {
        type: Object,
        reflect: true
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = [
        "commentTitle",
        "actionView",
        "dateUpdated",
        "commentUser"
      ];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  /**
   * attached life cycle
   */
  constructor() {
    super();
    this.commentTitle = "Comment title";
    this.commentUser = {};
    setTimeout(() => {
      this.addEventListener("iron-resize", this.onHeightChange.bind(this));
    }, 0);
  }
  firstUpdated() {
    this.shadowRoot.querySelector("#wrapper").addEventListener("click", e => {
      this.shadowRoot
        .querySelector("#comment")
        .classList.toggle("inactive", this.inactive);
    });
  }
}
window.customElements.define(
  LrnappBlockRecentCommentsComment.tag,
  LrnappBlockRecentCommentsComment
);
export { LrnappBlockRecentCommentsComment };
