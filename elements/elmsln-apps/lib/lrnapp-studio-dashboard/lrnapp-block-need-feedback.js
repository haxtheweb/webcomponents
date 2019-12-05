import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import "@lrnwebcomponents/lrndesign-gallerycard/lrndesign-gallerycard.js";
class LrnappBlockNeedFeedback extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        paper-button {
          width: 100%;
        }
      `
    ];
  }
  render() {
    return html`
      <iron-ajax
        auto=""
        url="${this.sourcePath}"
        handle-as="json"
        @last-response-changed="${this.responseEvent}"
        @response="${this.handleResponse}"
      ></iron-ajax>
      <hexagon-loader
        id="loader"
        item-count="4"
        ?loading=${this.loading}
        size="small"
      ></hexagon-loader>
      ${this._toArray(this.response.data).map(
        item => html`
          <paper-button @click="${this._loadSubmissionUrl}">
            <lrndesign-gallerycard
              data-submission-id="${item.id}"
              title="${item.attributes.title}"
              author="${item.relationships.author.data}"
              comments="${item.meta.comment_count}"
              image="${item.display.image}"
              icon="${item.display.icon}"
              class="ferpa-protect"
            >
            </lrndesign-gallerycard>
          </paper-button>
        `
      )}
    `;
  }
  responseEvent(e) {
    this.response = { ...e.detail.value };
  }
  static get tag() {
    return "lrnapp-block-need-feedback";
  }
  static get properties() {
    return {
      sourcePath: {
        type: String,
        attribute: "source-path"
      },
      response: {
        type: Array
      },
      loading: {
        type: Boolean
      }
    };
  }
  constructor() {
    super();
    this.loading = true;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["sourcePath", "response"];
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
   * Handle tap on paper-button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl(e) {
    var local = e.target;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  }
  handleResponse(e) {
    this.loading = false;
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
  LrnappBlockNeedFeedback.tag,
  LrnappBlockNeedFeedback
);
export { LrnappBlockNeedFeedback };
