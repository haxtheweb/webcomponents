import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lorem-data`
 * a threaded discussions component
 * 
### Styling

`<lorem-data>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lorem-data-FontSize` | default font-size | 14px
`--lorem-data-LineHeight` | default line-height | 160%
`--lorem-data-Color` | default text color | #95989a
`--lorem-data-threads-BackgroundColor` | default thread backbround-color | #eaeaea
`--lorem-data-threads-Margin` | default thread margin | 0
`--lorem-data-thread-focus-BorderLeft` | default thread border left color when commenting | 4px solid blue
`--lorem-data-new-thread-BackgroundColor` | overrides default thread backbround-color for new thread | var(--lorem-data-threads-BackgroundColor, #eaeaea)
`--lorem-data-new-thread-Margin` | overrides default thread margin for new thread | var(--lorem-data-threads-Margin, 0))
`--lorem-data-new-thread-focus-BorderLeft` | overrides default border left color when posting a new thread | 
`--lorem-data-comment-BackgroundColor` | comment bacground color | #fff
`--lorem-data-comment-Padding` | comment padding | 10px
`--lorem-data-reply-indent` | left-indent for thread replies | calc(2 * var(--lorem-data-comment-Padding,10px))));
`--lorem-data-name-FontSize` | comment author name font-size | calc(1.1 * var(--lorem-data-FontSize, 14px)));
`--lorem-data-name-FontWeight` | comment author name font-weight | bold;
`--lorem-data-name-FontFamily` | overrides default font-family for comment author name | 
`--lorem-data-name-Color` | comment author name text color | #4b4b4b);
`--lorem-data-date-FontSize` | comment author name font-size | calc(0.8 * var(--lorem-data-FontSize, 14px)));
`--lorem-data-date-FontWeight` | comment author name font-weight | normal
`--lorem-data-date-FontFamily` | overrides default font-family for comment date | 
`--lorem-data-date-Color` | comment date text color | #95989a));
 *
 * @element lorem-data
 * @demo ./demo/index.html demo
 */
class LoremData extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: var(--lorem-data-FontSize, 14px);
          line-height: var(--lorem-data-LineHeight, 160%);
          color: var(--lorem-data-Color, #95989a);
        }
        :host([hidden]) {
          display: none;
        }
        #threads {
          background-color: var(--lorem-data-threads-BackgroundColor, #eaeaea);
          padding: 1px;
          width: calc(100% - 2px);
          margin: var(--lorem-data-threads-Margin, 0);
        }
        #new-thread {
          background-color: var(
            --lorem-data-new-thread-BackgroundColor,
            var(--lorem-data-threads-BackgroundColor, #eaeaea)
          );
          padding: 2px 1px;
          width: calc(100% - 2px);
          margin: var(
            --lorem-data-new-thread-Margin,
            var(--lorem-data-threads-Margin, 0)
          );
        }
        .thread:focus-within,
        #new-thread:focus-within {
          border-left: var(
            --lorem-data-thread-focus-BorderLeft,
            4px solid blue
          );
        }
        #new-thread:focus-within {
          border-left: var(--lorem-data-new-thread-focus-BorderLeft);
        }
        .thread > *,
        #new-thread > * {
          background-color: var(--lorem-data-comment-BackgroundColor, #fff);
        }
        .comment {
          margin: 1px 1px 0;
          padding: var(--lorem-data-comment-Padding, 10px) 0;
        }
        .reply-form {
          margin: 0;
          width: calc(
            100% -
              var(
                --lorem-data-reply-indent,
                calc(2 * var(--lorem-data-comment-Padding, 10px))
              )
          );
        }
        .reply-form,
        .comment-reply {
          margin-left: var(
            --lorem-data-reply-indent,
            calc(2 * var(--lorem-data-comment-Padding, 10px))
          );
        }
        .comment-header {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          margin-bottom: var(--lorem-data-comment-Padding, 10px);
        }
        .comment-header,
        .comment-body {
          padding: 0 var(--lorem-data-comment-Padding, 10px);
        }
        lrndesign-avatar {
          margin-right: var(--lorem-data-comment-Padding, 10px);
        }
        .comment-header > div {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          flex: 1 1 auto;
        }
        .comment-name {
          margin: 0;
          font-size: var(
            --lorem-data-name-FontSize,
            calc(1.1 * var(--lorem-data-FontSize, 14px))
          );
          font-weight: var(--lorem-data-name-FontWeight, bold);
          font-family: var(--lorem-data-name-FontFamily);
          color: var(--lorem-data-name-Color, #4b4b4b);
        }
        .comment-date {
          margin: 0;
          font-size: var(
            --lorem-data-date-FontSize,
            calc(0.8 * var(--lorem-data-FontSize, 14px))
          );
          font-weight: var(--lorem-data-date-FontWeight, normal);
          font-family: var(--lorem-data-date-FontFamily);
          color: var(--lorem-data-date-Color, var(--lorem-data-Color, #95989a));
        }
        .comment-body {
          font-size: var(--lorem-data-FontSize, 14px);
        }
      `
    ];
  }
  render() {
    return html`
      <slot name="before-discussion"></slot>
      ${this.latest ? `` : this.threads}
      <div id="new-thread">
        <slot name="before-new-thread"></slot>
        <lorem-data-form
          button-label="${this.commentButtonLabel || "Submit"}"
          class="comment-form"
          @comment-demo="${this._handleDemo}"
          @comment-submitted="${this._handleSubmit}"
          ?demo="${this.demo}"
          field="${this.map.body || "body"}"
          .icon="${this.commentIcon}"
          ?hidden="${this.hidden}"
          ?disabled="${this.disabled}"
          .submit="${this._getPath(this.submit, this.params)}"
          textarea-label="${this.commentTextareaLabel || "Enter comment"}"
        >
        </lorem-data-form>
        <slot name="after-new-thread"></slot>
      </div>
      ${!this.latest ? `` : this.threads}
      <slot name="after-discussion"></slot>
    `;
  }
  get threads() {
    return html`
      <div id="threads">
        <div class="thread" ?hidden="${!this.__loading}">
          ${this.loadingText}
        </div>
        ${this.sortData(this.__data).map(
          thread => html`
            <div class="thread">
              ${this.getComment(thread)}
              ${(thread.replies || []).map(reply =>
                this.getComment(reply, thread.id)
              )}
              <lorem-data-form
                button-label="${this.replyButtonLabel || "Reply"}"
                class="reply-form"
                @comment-demo="${this._handleDemo}"
                @comment-submitted="${this._handleSubmit}"
                ?demo="${this.demo}"
                field="${this.map.replyBody || this.map.body || "body"}"
                ?disabled="${this.disabled}"
                ?hidden="${this.hidden}"
                .icon="${this.replyIcon}"
                .submit="${this._getPath(
                  this.submit,
                  this._getThreadParams(thread.id)
                )}"
                textarea-label="${this.replyTextareaLabel || "Enter reply"}"
                .thread="${thread.id}"
              >
              </lorem-data-form>
            </div>
          `
        )}
      </div>
    `;
  }

  getComment(comment, thread) {
    return html`
      <div
        aria-describedby="${thread || ""}"
        class="comment ${thread ? "comment-reply" : ""}"
        id="comment-${comment.id}"
      >
        <div class="comment-header">
          <lrndesign-avatar
            .accent-color="${comment.color}"
            .label="${comment.firstName} ${comment.lastName}"
            .src="${comment.avatar}"
            two-chars
          >
          </lrndesign-avatar>
          <div>
            <p class="comment-name">${comment.firstName} ${comment.lastName}</p>
            <p class="comment-date">${this._getDate(comment.date)}</p>
          </div>
        </div>
        <div class="comment-body">
          ${(comment.body || "").split(/[\r\n]+/).map(
            p =>
              html`
                <p>${p}</p>
              `
          )}
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lorem-data";
  }

  static get properties() {
    return {
      /**
       * sort comments latest-first
       */
      latest: {
        type: Boolean,
        attribute: "latest",
        reflect: true
      },
      /**
       * label for comment submit button
       */
      commentButtonLabel: {
        type: String,
        attribute: "comment-button-label"
      },
      /**
       * label for comment textarea
       */
      commentTextareaLabel: {
        type: String,
        attribute: "comment-textarea-label"
      },
      /**
       * optional icon for comment button
       */
      commentIcon: {
        type: String,
        attribute: "comment-icon"
      },
      /**
       * raw data, can be Object or Array
       */
      data: {
        type: Object
      },
      /**
       * locale for date formatting
       */
      dateLocale: {
        type: String
      },
      /**
       * JS format object for dates
       */
      dateFormat: {
        type: Object
      },
      /**
       * discussion in demo mode?
       * Instead of submitting,
       * submission is temporarily inserted into data.
       */
      demo: {
        type: Boolean
      },
      /**
       * text that displays while discussion data loads
       */
      loadingText: {
        type: String,
        attribute: "loading-text"
      },
      /**
       * object that will reformat data,
       * where key is final formatted property,
       * and value is raw data property to map.
       * Example: {avatar: "image"}
       * would use raw data's image property as a avatar
       */
      map: {
        type: Object
      },
      /**
       * query paramerters for getting and sending data
       */
      params: {
        type: Object
      },
      /**
       * label for reply submit button
       */
      replyButtonLabel: {
        type: String,
        attribute: "reply-button-label",
        reflect: true
      },
      /**
       * label for reply textarea
       */
      replyTextareaLabel: {
        type: String,
        attribute: "reply-textarea-label",
        reflect: true
      },
      /**
       * icon for reply submit button
       */
      replyIcon: {
        type: String,
        attribute: "reply-icon",
        reflect: true
      },
      /**
       * path (without parameters) for fetching data
       */
      source: {
        type: String
      },
      /**
       * path (without parameters) for sending data
       */
      submit: {
        type: String
      },
      /**
       * formatted data
       */
      __data: {
        type: Array
      },
      /**
       * whether data is still loading
       */
      __loading: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.latest = false;
    this.data = [];
    this.dateLocale = "en-US";
    this.dateFormat = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    };
    this.demo = false;
    this.map = {};
    this.params = {};
    this.submit = window.location.href;
    this.__data = [];
    this.__loading = false;
    import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("./lib/lorem-data-form.js");
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["params", "source"].includes(propName) && this.source) {
        this.__loading = true;
        this.fetchDiscussion();
      }
    });
  }
  /**
   * gets sorted data from mapped data
   *
   * @readonly
   * @memberof LoremData
   */
  sortData(data) {
    return data.sort((a, b) => {
      return this.latest ? a.date - b.date : b.date - a.date;
    });
  }
  /**
   * gets data that is structured according to a map object
   *
   * @readonly
   * @memberof LoremData
   */
  _handleRawData(data) {
    this.__loading = false;
    return this._getArray(data || [])
      .filter(comment => !this._getMap(comment, "thread", "replyThread"))
      .map(thread => {
        let id = this._getMap(thread, "id"),
          replies =
            this._getMap(thread, "replies") ||
            (data || []).filter(
              comment => this._getMap(comment, "thread", "replyThread") === id
            );
        return {
          //gets all threads and comments if they are not mapped as nested array of thread
          id: id,
          firstName: this._getMap(thread, "firstName"),
          lastName: this._getMap(thread, "lastName"),
          avatar: this._getMap(thread, "avatar"),
          body: this._getMap(thread, "body"),
          color: this._getMap(thread, "color"),
          date: this._getMap(thread, "date"),
          replies: this._getArray(replies).map(reply => {
            //gets all comments if they are mapped as nested array of thread
            return {
              id: this._getMap(reply, "id", "replyId"),
              thread: this._getMap(reply, "thread", "replyThread") || id,
              firstName: this._getMap(reply, "firstName", "replyFirstName"),
              lastName: this._getMap(reply, "lastName", "replyLastName"),
              avatar: this._getMap(reply, "avatar", "replyAvatar"),
              body: this._getMap(reply, "body", "replyBody"),
              color: this._getMap(reply, "color", "replyColor"),
              date: this._getMap(reply, "date", "replyDate")
            };
          })
        };
      });
  }
  /**
   * gets a property value based on a conversion map
   *
   * @param {object} obj item to check
   * @param {string} prop default property name
   * @param {string} map1 second mapped property to check
   * @param {string} map2 first mapped property to check
   * @returns {*} property value
   * @memberof LoremData
   */
  _getMap(obj, prop, map1, map2) {
    return obj[this._mapProp(prop, map1, map2)];
  }
  /**
   * gets a mapped property based on a conversion map
   *
   * @param {object} obj item to check
   * @param {string} prop default property name
   * @param {string} map1 second mapped property to check
   * @param {string} map2 first mapped property to check
   * @returns {*} property
   * @memberof LoremData
   */
  _mapProp(prop, map1, map2) {
    let map = this.map || {};
    map1 = map1 || prop;
    map2 = map2 || map1;
    return map[map2] || map[map1] || prop;
  }
  /**
   * refreshes comments
   *
   * @param {event} e
   * @memberof LoremData
   */
  _handleSubmit(e) {
    this.fetchDiscussion();
  }
  /**
   * demonstrates how data will appear when a comment is submitted
   *
   * @param {event} e
   * @memberof LoremData
   */
  _handleDemo(e) {
    if (e.detail && e.detail.textarea) {
      let newComment = {},
        data = this.__data;
      newComment.id = `comment-${Date.now()}`;
      newComment.firstName = "DEMO";
      newComment.lastName = "USER";
      newComment.date = this._getDate(new Date());
      newComment.body = e.detail.textarea.value;
      if (e.detail.thread) {
        let filter = data.filter(thread => thread.id === e.detail.thread),
          thread = filter ? filter[0] : undefined;
        newComment.thread = e.detail.thread;
        if (thread) {
          thread.replies = [...thread.replies, newComment];
        } else {
          data.push(newComment);
        }
      } else {
        newComment.replies = [];
        data.push(newComment);
      }
      this.__data = [];
      this.__data = data;
      e.detail.textarea.value = "";
    }
  }

  /**
   * fetches data from discussion
   *
   * @memberof LoremData
   */
  fetchDiscussion() {
    fetch(this._getPath(this.source, this.params))
      .then(response => response.json())
      .then(data => (this.__data = this._handleRawData(data)));
  }
  /**
   * converts object to array
   *
   * @param {object} obj
   * @returns array
   * @memberof LoremData
   */
  _getArray(obj) {
    return typeof obj === "array"
      ? obj
      : Object.keys(obj || {}).map(key => {
          let item = obj[key];
          item.id = key;
          return item;
        });
  }
  /**
   * gets formated date from date string
   *
   * @param {string} d
   * @returns string
   * @memberof LoremData
   */
  _getDate(d) {
    let format =
      typeof this.dateFormat === "string"
        ? JSON.parse(this.dateFormat)
        : this.dateFormat;
    return d && new Date(d)
      ? new Date(d).toLocaleString(this.dateLocale, format)
      : "";
  }
  /**
   * adds thread id to parameters
   *
   * @param {*} id
   * @returns
   * @memberof LoremData
   */
  _getThreadParams(id) {
    let params = this.params;
    params[this._mapProp("id")] = id;
    return params;
  }
  /**
   * gets full path with encoded params
   *
   * @param {string} path
   * @param {object} params
   * @returns string
   * @memberof LoremData
   */
  _getPath(path, params) {
    let query = Object.keys(params || {})
      .map(p => `${encodeURI(p)}=${encodeURI(params[p])}`)
      .join("&");
    return query ? `${path}?${query}` : path;
  }
}
window.customElements.define(LoremData.tag, LoremData);
export { LoremData };
