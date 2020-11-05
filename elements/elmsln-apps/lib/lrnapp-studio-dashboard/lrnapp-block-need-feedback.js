import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/lrndesign-gallerycard/lrndesign-gallerycard.js";
class LrnappBlockNeedFeedback extends PolymerElement {
  static get template() {
    return html`
      <style include="paper-item-styles">
        :host {
          display: block;
        }
        button {
          width: 100%;
        }
      </style>
      <iron-ajax
        auto=""
        url="{{sourcePath}}"
        handle-as="json"
        last-response="{{response}}"
        on-response="handleResponse"
      ></iron-ajax>
      <div id="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      <iron-list items="[[_toArray(response.data)]]" as="item">
        <template>
          <button on-click="_loadSubmissionUrl">
            <lrndesign-gallerycard
              data-submission-id$="[[item.id]]"
              title="[[item.attributes.title]]"
              author="[[item.relationships.author.data]]"
              comments="[[item.meta.comment_count]]"
              image="[[item.display.image]]"
              icon="[[item.display.icon]]"
              class="ferpa-protect"
            >
            </lrndesign-gallerycard>
          </button>
        </template>
      </iron-list>
    `;
  }
  static get tag() {
    return "lrnapp-block-need-feedback";
  }
  static get properties() {
    return {
      sourcePath: {
        type: String,
        notify: true,
      },
      response: {
        type: Array,
        notify: true,
      },
    };
  }

  /**
   * Handle tap on button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  }
  handleResponse(e) {
    this.$.loading.hidden = true;
  }
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }
}
window.customElements.define(
  LrnappBlockNeedFeedback.tag,
  LrnappBlockNeedFeedback
);
export { LrnappBlockNeedFeedback };
