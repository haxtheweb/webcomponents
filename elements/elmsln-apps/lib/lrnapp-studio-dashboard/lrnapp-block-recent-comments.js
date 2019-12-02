import { LitElement, html, css } from "lit-element/lit-element.js";

import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-item/paper-item.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lrnapp-block-recent-comments-comment.js";
class LrnappBlockRecentComments extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
      
      `
    ];
  }
  render() {
    return html`
      <style include="paper-item-styles">
        :host {
          display: block;
        }
      </style>
      <div id="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      <iron-ajax
        auto=""
        url="{{sourcePath}}"
        handle-as="json"
        last-response="{{response}}"
        @response="${this.handleResponse}"
      ></iron-ajax>
      <template
        is="dom-repeat"
        items="[[_toArray(response.data)]]"
        as="comment"
      >
        <lrnapp-block-recent-comments-comment
          comment-user="{{comment.relationships.author.data}}"
          comment-title="{{comment.attributes.subject}}"
          action-view="{{_getViewLink(comment.relationships.node.data.id)}}"
          date-updated="{{comment.attributes.changed}}"
          class="ferpa-protect"
        >
          [[comment.attributes.body]]
        </lrnapp-block-recent-comments-comment>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-block-recent-comments";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: 'elmsln-course',
      },
      elmslnSection: {
        type: String,
        attribute: 'elmsln-section',
      },
      basePath: {
        type: String,
        attribute: 'base-path',
      },
      csrfToken: {
        type: String,
        attribute: 'csrf-token',
      },
      endPoint: {
        type: String,
        attribute: 'end-point',
      },
      sourcePath: {
        type: String,
        notify: true
      },
      response: {
        type: Array,
        notify: true
      }
    };
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
