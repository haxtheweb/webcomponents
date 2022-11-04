import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
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

        button {
          background-color: #eeeeee;
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

        .card-actions button {
          display: block;
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

        button {
          width: 100%;
          display: flex;
        }

        .hidden {
          display: none;
        }
        .linkbtn,
        .linkbtn button {
          text-decoration: none;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
        }
        .linkbtn {
          display: flex;
          width: 100%;
        }
        .linkbtn button:hover,
        .linkbtn button:active,
        .linkbtn button:focus,
        .linkbtn:hover,
        .linkbtn:active,
        .linkbtn:focus {
          background-color: #eeeeee;
        }
      </style>
      <div class="card flex-wrap">
        <a href$="[[actionView]]" tabindex="-1" class="linkbtn">
          <button id="view">
            <div class="card-content">
              <lrndesign-avatar
                label="[[commentUser.name]]"
                src="[[commentUser.avatar]]"
              ></lrndesign-avatar>
              <h3>[[commentUser.display_name]]</h3>
              <div id="wrapper" class="button-wrapper">
                <div id="comment" class="inactive"><slot></slot></div>
              </div>
            </div>
          </button>
        </a>
      </div>
    `;
  }

  static get tag() {
    return "lrnapp-block-recent-comments-comment";
  }

  onHeightChange() {
    var height = this.$.comment.offsetHeight;
    if (height > 80) {
      this.$.btn.classList.toggle("hidden", this.hidden);
    }
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
      },
      elmslnSection: {
        type: String,
      },
      basePath: {
        type: String,
      },
      csrfToken: {
        type: String,
      },
      endPoint: {
        type: String,
      },
      commentTitle: {
        type: String,
        value: "Comment title",
        reflectToAttribute: true,
        notify: true,
      },
      actionView: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },
      dateUpdated: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },
      commentUser: {
        type: Object,
        value: {},
        reflectToAttribute: true,
        notify: true,
      },
    };
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.wrapper.addEventListener("click", function (e) {
      this.$.comment.classList.toggle("inactive", this.inactive);
    });
    this.addEventListener("iron-resize", this.onHeightChange.bind(this));
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.$.wrapper.removeEventListener("click", function (e) {
      this.$.comment.classList.toggle("inactive", this.inactive);
    });
    this.removeEventListener("iron-resize", this.onHeightChange.bind(this));
    super.disconnectedCallback();
  }
}
customElements.define(
  LrnappBlockRecentCommentsComment.tag,
  LrnappBlockRecentCommentsComment
);
export { LrnappBlockRecentCommentsComment };
