import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `threaded-discussion`
 * a threaded discussions component
 * 
### Styling

`<threaded-discussion>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--threaded-discussion-FontSize` | default font-size | 14px
`--threaded-discussion-LineHeight` | default line-height | 160%
`--threaded-discussion-Color` | default text color | #95989a
`--threaded-discussion-threads-BackgroundColor` | default thread backbround-color | #eaeaea
`--threaded-discussion-threads-Margin` | default thread margin | 0
`--threaded-discussion-new-thread-BackgroundColor` | overrides default thread backbround-color for new thread | var(--threaded-discussion-threads-BackgroundColor, #eaeaea)
`--threaded-discussion-new-thread-Margin` | overrides default thread margin for new thread | var(--threaded-discussion-threads-Margin, 0))
`--threaded-discussion-comment-BackgroundColor` | comment bacground color | #fff
`--threaded-discussion-comment-Padding` | comment padding | 10px
`--threaded-discussion-reply-indent` | left-indent for thread replies | calc(2 * var(--threaded-discussion-comment-Padding,10px))));
`--threaded-discussion-name-FontSize` | comment author name font-size | calc(1.1 * var(--threaded-discussion-FontSize, 14px)));
`--threaded-discussion-name-FontWeight` | comment author name font-weight | bold;
`--threaded-discussion-name-FontFamily` | overrides default font-family for comment author name | 
`--threaded-discussion-name-Color` | comment author name text color | #4b4b4b);
`--threaded-discussion-date-FontSize` | comment author name font-size | calc(0.8 * var(--threaded-discussion-FontSize, 14px)));
`--threaded-discussion-date-FontWeight` | comment author name font-weight | normal
`--threaded-discussion-date-FontFamily` | overrides default font-family for comment date | 
`--threaded-discussion-date-Color` | comment date text color | #95989a));
 *
 * @element threaded-discussion
 * @demo ./demo/index.html demo
 */
class ThreadedDiscussion extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: var(--threaded-discussion-FontSize, 14px);
          line-height: var(--threaded-discussion-LineHeight, 160%);
          color: var(--threaded-discussion-Color, #95989a);
        }
        :host([hidden]) {
          display: none;
        }
        #threads {
          background-color: var(
            --threaded-discussion-threads-BackgroundColor,
            #eaeaea
          );
          padding: 1px;
          width: calc(100% - 2px);
          margin: var(--threaded-discussion-threads-Margin, 0);
        }
        #new-thread {
          background-color: var(
            --threaded-discussion-new-thread-BackgroundColor,
            var(--threaded-discussion-threads-BackgroundColor, #eaeaea)
          );
          padding: 2px 1px;
          width: calc(100% - 2px);
          margin: var(
            --threaded-discussion-new-thread-Margin,
            var(--threaded-discussion-threads-Margin, 0)
          );
        }
        .thread > *,
        #new-thread > * {
          background-color: var(
            --threaded-discussion-comment-BackgroundColor,
            #fff
          );
        }
        .comment {
          margin: 1px 1px 0;
          padding: var(--threaded-discussion-comment-Padding, 10px) 0;
        }
        .reply-form {
          margin: 0;
          width: calc(
            100% -
              var(
                --threaded-discussion-reply-indent,
                calc(2 * var(--threaded-discussion-comment-Padding, 10px))
              )
          );
        }
        .reply-form,
        .comment-reply {
          margin-left: var(
            --threaded-discussion-reply-indent,
            calc(2 * var(--threaded-discussion-comment-Padding, 10px))
          );
        }
        .comment-header {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          margin-bottom: var(--threaded-discussion-comment-Padding, 10px);
        }
        .comment-header,
        .comment-body {
          padding: 0 var(--threaded-discussion-comment-Padding, 10px);
        }
        lrndesign-avatar {
          margin-right: var(--threaded-discussion-comment-Padding, 10px);
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
            --threaded-discussion-name-FontSize,
            calc(1.1 * var(--threaded-discussion-FontSize, 14px))
          );
          font-weight: var(--threaded-discussion-name-FontWeight, bold);
          font-family: var(--threaded-discussion-name-FontFamily);
          color: var(--threaded-discussion-name-Color, #4b4b4b);
        }
        .comment-date {
          margin: 0;
          font-size: var(
            --threaded-discussion-date-FontSize,
            calc(0.8 * var(--threaded-discussion-FontSize, 14px))
          );
          font-weight: var(--threaded-discussion-date-FontWeight, normal);
          font-family: var(--threaded-discussion-date-FontFamily);
          color: var(
            --threaded-discussion-date-Color,
            var(--threaded-discussion-Color, #95989a)
          );
        }
        .comment-body {
          font-size: var(--threaded-discussion-FontSize, 14px);
        }
      `
    ];
  }
  render() {
    return html`
      <slot name="before-discussion"></slot>
      ${this.ascending ? `` : this.threads}
      <div id="new-thread">
        <slot name="before-new-thread"></slot>
        <threaded-discussion-form 
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
          textarea-label="${this.commentTextareaLabel || "Enter comment"}">
        </threaded-discussion-form>
        <slot name="after-new-thread"></slot>
      </div>
      ${!this.ascending ? `` : this.threads}
      <slot name="after-discussion"></slot>
    `;
  }
  get threads() {
    return html`
      <div id="threads">
        ${(this.sortedData || []).map(
          thread => html`
            <div class="thread">
              ${this.getComment(thread)}
              ${(thread.replies || []).map(reply =>
                this.getComment(reply, thread.id)
              )}
              <threaded-discussion-form
                button-label="${this.replyButtonLabel || "Reply"}"
                class="reply-form"
                @comment-demo="${this._handleDemo}"
                @comment-submitted="${this._handleSubmit}"
                ?demo="${this.demo}"
                field="${this.map.replyBody || this.map.body || "body"}"
                ?disabled="${this.disabled}"
                ?hidden="${this.hidden}"
                .icon="${this.replyIcon}"
                .submit="${this._getPath(this.submit, this.params)}"
                textarea-label="${this.replyTextareaLabel || "Enter reply"}"
                .thread="${thread.id}"
              >
              </threaded-discussion-form>
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
          ${!comment.body ? `` : comment.body.split(/[\r\n]+/).map(p=>html`<p>${p}</p>`)}
        </div>
      </div>
    `;
  }

  static get tag() {
    return "threaded-discussion";
  }

  static get properties() {
    return {
      ascending: {
        type: Boolean,
        attribute: "ascending",
        reflect: true
      },
      commentButtonLabel: {
        type: String,
        attribute: "comment-button-label",
        reflect: true
      },
      commentTextareaLabel: {
        type: String,
        attribute: "comment-textarea-label",
        reflect: true
      },
      commentIcon: {
        type: String,
        attribute: "comment-icon",
        reflect: true
      },
      data: {
        type: Array
      },
      dateLocale: {
        type: String
      },
      dateFormat: {
        type: Object
      },
      map: {
        type: Object
      },
      demo: {
        type: Boolean
      },
      params: {
        type: Object
      },
      replyButtonLabel: {
        type: String,
        attribute: "reply-button-label",
        reflect: true
      },
      replyTextareaLabel: {
        type: String,
        attribute: "reply-textarea-label",
        reflect: true
      },
      replyIcon: {
        type: String,
        attribute: "reply-icon",
        reflect: true
      },
      source: {
        type: String
      },
      submit: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.ascending = false;
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
    import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("./lib/threaded-discussion-form.js");
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["params", "source"].includes(propName) && this.source)
        this.fetchDiscussion();
    });
  }
  /**
   * gets sorted data from mapped data
   *
   * @readonly
   * @memberof ThreadedDiscussion
   */
  get sortedData() {
    return this.mappedData.sort((a, b) => {
      return this.ascending ? a.date - b.date : b.date - a.date;
    });
  }
  /**
   * gets data that is structured according to a map object
   *
   * @readonly
   * @memberof ThreadedDiscussion
   */
  get mappedData() {
    let data = this._getArray(this.data || []);
    return (data || []).filter(comment => !this._getMap(comment,"thread","replyThread")).map(thread => {
      let params = this.params,
        id = this._getMap(thread,"id"),
        replies = this._getMap(thread,"replies") ||
          (data || []).filter(comment => this._getMap(comment,"thread","replyThread") === id);
      params[this._mapProp("thread")] = id;
      return {
        //gets all threads and comments if they are not mapped as nested array of thread
        id: id,
        firstName: this._getMap(thread,"firstName"),
        lastName: this._getMap(thread,"lastName"),
        avatar: this._getMap(thread,"avatar"),
        body: this._getMap(thread,"body"),
        color: this._getMap(thread,"color"),
        date: this._getMap(thread,"date"),
        submit: this._getPath(this.submit, params),
        replies: this._getArray(replies).map(reply => {
          //gets all comments if they are mapped as nested array of thread
          return {
            id: this._getMap(reply,"id","replyId"),
            thread: this._getMap(reply,"thread","replyThread"),
            firstName: this._getMap(reply,"firstName","replyFirstName"),
            lastName: this._getMap(reply,"lastName","replyLastName"),
            avatar: this._getMap(reply,"avatar","replyAvatar"),
            body: this._getMap(reply,"body","replyBody"),
            color: this._getMap(reply,"color","replyColor"),
            date: this._getMap(reply,"date","replyDate")
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
   * @memberof ThreadedDiscussion
   */
  _getMap(obj,prop,map1,map2){
    return obj[this._mapProp(prop,map1,map2)];
  }
  /**
   * gets a mapped property based on a conversion map
   *
   * @param {object} obj item to check
   * @param {string} prop default property name
   * @param {string} map1 second mapped property to check
   * @param {string} map2 first mapped property to check
   * @returns {*} property
   * @memberof ThreadedDiscussion
   */
  _mapProp(prop,map1,map2){
    let map = this.map || {};
    map1 = map1 || prop;
    map2 = map2 || map1;
    return map[map2] || map[map1] || prop;
  }
  /**
   * refreshes comments
   *
   * @param {event} e
   * @memberof ThreadedDiscussion
   */
  _handleSubmit(e) {
    this.fetchDiscussion();
  }
  /**
   * demonstrates how data will appear when a comment is submitted
   *
   * @param {event} e
   * @memberof ThreadedDiscussion
   */
  _handleDemo(e) {
    if(e.detail && e.detail.textarea) {
      let newComment = {}, data = this.data;
      newComment[this._mapProp("id")] = `comment-${Date.now()}`;
      newComment[this._mapProp("firstName")] = "DEMO";
      newComment[this._mapProp("lastName")] = "USER";
      newComment[this._mapProp("date")] = this._getDate(new Date());
      newComment[this._mapProp("body")] = e.detail.textarea.value;
      if(e.detail.thread){
        let filter = data.filter(thread =>thread[this._mapProp("id")] === e.detail.thread),
          thread = filter ? filter[0] : undefined;
          newComment[this._mapProp("thread","replyThread")] = e.detail.thread;
        if(thread){
          thread[this._mapProp("replies")] = [...thread[this._mapProp("replies")],newComment];
        } else {
          data.push(newComment);
        }
      } else {
        newComment[this._mapProp("replies")] = [];
        data.push(newComment);
      }
      this.data = data;
      this.mappedData;
      e.detail.textarea.value = '';
    }
  }

  /**
   * fetches data from discussion
   *
   * @memberof ThreadedDiscussion
   */
  fetchDiscussion() {
    fetch(this._getPath(this.source, this.params))
      .then(response => response.json())
      .then(data => (this.data = data));
  }
  /**
   * converts object to array
   *
   * @param {object} obj
   * @returns array
   * @memberof ThreadedDiscussion
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
   * @memberof ThreadedDiscussion
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
   * gets full path with encoded params
   *
   * @param {string} path
   * @param {object} params
   * @returns string
   * @memberof ThreadedDiscussion
   */
  _getPath(path, params) {
    let query = Object.keys(params || {})
      .map(p => `${encodeURI(p)}=${encodeURI(params[p])}`)
      .join("&");
    return query ? `${path}?${query}` : path;
  }
}
window.customElements.define(ThreadedDiscussion.tag, ThreadedDiscussion);
export { ThreadedDiscussion };
