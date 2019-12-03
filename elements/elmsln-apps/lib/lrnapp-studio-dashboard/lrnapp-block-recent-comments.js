import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-item/paper-item.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lrnapp-block-recent-comments-comment.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
class LrnappBlockRecentComments extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  render() {
    return html`
      <custom-style>
        <style include="paper-item-styles">
          :host {
            display: block;
          }
        </style>
      </custom-style>
      <div id="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      <iron-ajax
        auto=""
        url="${this.sourcePath}"
        handle-as="json"
        @last-response-changed="${this.responseChangedEvent}"
        @response="${this.handleResponse}"
      ></iron-ajax>
      ${this._toArray(this.response.data).map(
        comment => html`
          <lrnapp-block-recent-comments-comment
            .comment-user="${comment.relationships.author.data}"
            comment-title="${comment.attributes.subject}"
            action-view="${this._getViewLink(
              comment.relationships.node.data.id
            )}"
            date-updated="${comment.attributes.changed}"
            class="ferpa-protect"
          >
            ${comment.attributes.body}
          </lrnapp-block-recent-comments-comment>
        `
      )}
    `;
  }
  responseChangedEvent(e) {
    this.response = e.detail.value;
  }
  static get tag() {
    return "lrnapp-block-recent-comments";
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
      sourcePath: {
        type: String,
        attribute: "source-path"
      },
      response: {
        type: Array
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "response") {
        // notify
        this.dispatchEvent(
          new CustomEvent("response-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "sourcePath") {
        // notify
        this.dispatchEvent(
          new CustomEvent("source-path-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  handleResponse(e) {
    this.shadowRoot.querySelector("#loading").hidden = true;
  }
  _getViewLink(nid) {
    return this.basePath + "lrnapp-studio-submission/submissions/" + nid;
  }
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(
  LrnappBlockRecentComments.tag,
  LrnappBlockRecentComments
);
export { LrnappBlockRecentComments };
