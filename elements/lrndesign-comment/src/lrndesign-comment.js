import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@github/time-elements";
/**
 * `lrndesign-comment`
 * @element lrndesign-comment
 * A LRN element
 *
 * @demo demo/index.html
 */
class LrndesignComment extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .comment-left {
          float: left;
          display: inline-block;
        }
        .comment-right {
          display: inline-block;
        }
      </style>
      <div class="comment-container">
        <div class="comment-left"><lrndesign-avatar></lrndesign-avatar></div>
        <div class="comment-right">
          <div class="row-1">
            <span>{{name}}</span>
            <relative-time datetime$="{{date}}"> </relative-time>
          </div>
          <div class="row-2"><slot></slot></div>
          <div class="row-3">{{links}}</div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "lrndesign-comment";
  }
  static get properties() {
    return {
      avatar: {
        type: Object,
        reflectToAttribute: true,
        notify: true,
      },
      name: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },
      date: {
        type: String,
        value: "2014-04-01T00:00:00.000Z",
        reflectToAttribute: true,
        notify: true,
      },
      links: {
        type: Object,
        notify: true,
      },
    };
  }
}
window.customElements.define(LrndesignComment.tag, LrndesignComment);
export { LrndesignComment };
