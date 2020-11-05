/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

/**
 * `elmsln-studio-assignment`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-assignment
 * @lit-html
 * @lit-element
 * @demo demo/portfolio.html
 */
class ElmslnStudioAssignment extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          flex-wrap: wrap;
        }
        h1 {
          text-align: center;
          margin-bottom: calc(0.25 * var(--elmsln-studio-margin, 20px));
        }
        #breadcrumb {
          margin: 0 0 var(--elmsln-studio-margin, 20px);
          flex: 1 0 100%;
          --elmsln-studio-link-Color: var(
            --simple-colors-fixed-theme-light-blue-8
          );
          --elmsln-studio-link-focus-Color: var(
            --simple-colors-fixed-theme-light-blue-9
          );
        }
        #breadcrumb > * {
          display: inline;
        }
        #alert {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          font-size: calc(0.8 * var(--elmsln-studio-FontSize, 16px));
          --lrndesign-avatar-width: calc(
            1.5 * var(--elmsln-studio-FontSize, 16px)
          );
        }
        #alert > * {
          margin: 0 0.25em;
        }
        .assignment-name,
        .assignment-name,
        .assignment-date {
          font-weight: normal;
          display: block;
        }
        .assignment-name {
          font-size: calc(1.75 * var(--elmsln-studio-FontSize, 16px));
          color: #95989a;
        }
        #project-buttons,
        .submission-header {
          position: relative;
          height: 40px;
          margin-top: -40px;
        }
        section {
          border-top: 2px solid #eaeaea;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0
            var(--elmsln-studio-margin, 20px);
        }
        h2 {
          margin: calc(2 * var(--elmsln-studio-margin, 20px)) auto;
          text-align: center;
        }
        .assignment-name {
          font-size: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
          color: #555555;
        }
        .assignment-date {
          margin: 0 0 calc(1 * var(--elmsln-studio-margin, 20px));
          text-align: center;
          font-size: var(--elmsln-studio-FontSize, 16px);
          color: #95989a;
        }
        .assignment-body {
          color: #95989a;
          line-height: 160%;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px)) auto
            var(--elmsln-studio-margin, 20px);
        }
        ul {
          list-style-type: none;
          padding-left: 0;
        }
        #uploadlist {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        #uploadlist li {
          flex: 0 0 150px;
          height: 150px;
          background-position: center;
          background-size: cover;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        #uploadlist li:last-child {
          display: flex;
          flex: 1 0 auto;
        }
        #uploadlist button {
          width: 150px;
          height: 150px;
          border: 1px solid #eaeaea;
          transition: all 0.5s ease-in-out;
        }
        #uploadlist button.delete-upload {
          background-color: rgba(255, 255, 255, 0.6);
          opacity: 0;
        }
        #uploadlist button:focus,
        #uploadlist button:hover {
          opacity: 1;
          border: 1px solid blue;
        }
        vaadin-upload {
          flex: 0 1 auto;
        }
        #linklist li {
          display: flex;
          align-items: center;
          padding-left: -1em;
          justify-content: space-between;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0;
        }
        #linklist .link,
        #linkurl {
          flex: 1 1 auto;
        }
        #linklist button {
          flex: 0 1 auto;
        }
        #linklist input {
          line-height: 2em;
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px)) 0 0;
          font-size: calc(1 * var(--elmsln-studio-FontSize, 16px));
        }
        #editor {
          border: 1px solid #eaeaea;
        }
        #actions {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
        }
        .submit {
          flex: 0 0 auto;
          text-align: right;
          --elmsln-studio-button-icon-color: var(
            --simple-colors-default-theme-green-7
          );
        }
        .save {
          flex: 0 0 auto;
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .delete {
          flex: 0 0 auto;
          --elmsln-studio-button-icon-color: var(
            --simple-colors-default-theme-red-7
          );
        }
        .spacer {
          flex: 1 1 auto;
        }
        #actions elmsln-studio-button:hover,
        #actions elmsln-studio-button:focus-within {
          text-decoration: underline;
        }
        @media screen and (min-width: 600px) {
          #primary:not(.view-discussion) {
            max-width: calc(1000px - 2 * var(--elmsln-studio-margin, 20px));
            margin: 0 auto;
            border: 1px solid #eaeaea;
            padding: var(--elmsln-studio-margin, 20px);
          }
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      ${this.breadcrumb} ${this.alert}
      <div id="primary" class="view-assignment">
        <article id="assignment">
          <h1>
            <span class="lesson-name">
              ${!this.assignment
                ? html`<em>Lesson</em>`
                : this.assignment.lesson}
            </span>
            <span class="assignment-name">
              ${!this.assignment
                ? html`<em>Assignment</em>`
                : this.assignment.assignment}
            </span>
          </h1>
          ${!(this.assignment || {}).date
            ? ""
            : html`
                <p class="assignment-date">
                  Due
                  <local-time
                    month="long"
                    day="numeric"
                    year="numeric"
                    hour="2-digit"
                    minute="2-digit"
                    second="2-digit"
                    time-zone-name="short"
                    datetime="${this.assignment.date}"
                    >${this.dateFormat(this.assignment.date)}
                  </local-time>
                </p>
              `}
          <p class="assignment-body">
            ${!this.assignment ? this.loading("grey") : this.assignment.body}
          </p>
          ${!(this.assignment || {}).rubric
            ? ""
            : this.rubricTable(this.assignment.rubric)}
          ${this.sources} ${this.links} ${this.bodytext} ${this.actions}
        </article>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      assignment: {
        type: Object,
      },
      submission: {
        type: Object,
      },
      __sources: {
        type: Array,
      },
      __links: {
        type: Array,
      },
      __newLinkUrl: {
        type: String,
      },
      __newLinkText: {
        type: String,
      },
      __editorConfig: {
        type: Array,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-assignment";
  }

  // life cycle
  constructor() {
    super();
    this.__sources = [];
    this.__links = [];
    this.__editorConfig = [
      {
        label: "Basic Inline Operations",
        type: "button-group",
        buttons: [
          {
            command: "bold",
            icon: "editor:format-bold",
            label: "Bold",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "italic",
            icon: "editor:format-italic",
            label: "Italics",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "removeFormat",
            icon: "editor:format-clear",
            label: "Erase Format",
            type: "rich-text-editor-button",
          },
        ],
      },
      {
        collapsedUntil: "lg",
        label: "Lists and Indents",
        type: "button-group",
        buttons: [
          {
            command: "insertOrderedList",
            icon: "editor:format-list-numbered",
            label: "Ordered List",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "insertUnorderedList",
            icon: "editor:format-list-bulleted",
            label: "Unordered List",
            toggles: true,
            type: "rich-text-editor-button",
          },
        ],
      },
    ];
    this.tag = ElmslnStudioAssignment.tag;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    import("@vaadin/vaadin-upload/vaadin-upload.js");
    import("@lrnwebcomponents/rich-text-editor/rich-text-editor.js");
    import(
      "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-full.js"
    );
    this.fetchData("profile");
    this.fetchData("assignments");
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "submission") {
        this.__links =
          this.submission && this.submission.links ? this.submission.links : [];
        this.__sources =
          this.submission && this.submission.sources
            ? this.submission.sources
            : [];
      }
    });
    console.log(
      "editable",
      this.assignment,
      this.submission,
      !this.assignment ||
        this.getStatus(
          this.submission,
          this.assignment,
          "overdue",
          "late",
          "submitted",
          "else"
        ),
      !this.assignment || this.getStatusColor(this.submission, this.assignment),
      !this.assignment || this.getStatusIcon(this.submission, this.assignment)
    );
  }
  get actions() {
    return !this.editable
      ? html``
      : html`
          <section id="actions">
            <elmsln-studio-button class="delete" icon="delete" path=""
              >Delete</elmsln-studio-button
            >
            <span class="spacer"></span>
            <elmsln-studio-button class="save" path=""
              >Save Draft</elmsln-studio-button
            >
            <elmsln-studio-button class="submit" icon="done" path=""
              ><span slot="before">Submit Assignment</span>
            </elmsln-studio-button>
          </section>
        `;
  }
  get alert() {
    let getAlert = (message, date, icon = true) => {
        return html` <p id="alert">
          ${!icon
            ? ""
            : html`
                <lrndesign-avatar
                  allow-grey
                  invert
                  accent-color="${this.getStatusColor(
                    this.submission,
                    this.assignment || {}
                  )}"
                  icon="${this.getStatusIcon(
                    this.submission,
                    this.assignment || {}
                  )}"
                >
                </lrndesign-avatar>
              `}
          ${message}
          ${date
            ? html`
                <local-time
                  month="long"
                  day="numeric"
                  year="numeric"
                  hour="2-digit"
                  minute="2-digit"
                  second="2-digit"
                  time-zone-name="short"
                  datetime="${date}"
                >
                  ${this.dateFormat(date)}
                </local-time>
              `
            : ""}
        </p>`;
      },
      alertMessage = this.getStatus(
        this.submission,
        this.assignment || {},
        this.tooLate
          ? getAlert(
              "Assignment closed for submission on ",
              this.assignment.hideDate
            )
          : getAlert("Assignment is overdue!"),
        getAlert("Assignment submitted late on ", (this.submission || {}).date),
        getAlert("Assignment submitted on ", (this.submission || {}).date),
        this.tooEarly
          ? getAlert(
              "Assignment will open for submission on",
              this.assignment.showDate,
              false
            )
          : ""
      );
    return alertMessage;
  }
  get bodytext() {
    let body = !(this.submission || {}).body ? "" : this.submission.body.trim(),
      bodyEmpty = body == "" && !this.editable;
    return !this.assignment || bodyEmpty
      ? ""
      : html`
          <section id="text">
            <h2 class="sr-only">Text</h2>
            ${!this.editable
              ? body
              : html`
                  <rich-text-editor-toolbar-full
                    id="toolbar"
                    controls="editor"
                    .config="${this.__editorConfig}"
                    sticky
                  >
                  </rich-text-editor-toolbar-full>
                  <rich-text-editor
                    id="editor"
                    toolbar="toolbar"
                    type="rich-text-editor-toolbar-full"
                  >
                    ${body || html`<p>Add text</p>`}
                  </rich-text-editor>
                `}
          </section>
        `;
  }
  get breadcrumb() {
    return html`
      <div id="breadcrumb">
        <elmsln-studio-link href="/assignments">Assignments</elmsln-studio-link>
        <span> > </span>
        <span>
          ${!this.assignment
            ? html`<em>Assignment</em>`
            : this.assignment.assignment}
        </span>
      </div>
    `;
  }
  get editable() {
    return !(this.submission || {}).date && !this.tooEarly && !this.tooLate;
  }
  get links() {
    let linksEmpty = (this.__links || []).length < 1 && !this.editable;
    return !this.assignment || linksEmpty
      ? ""
      : html`
          <section id="links">
            <h2 class="sr-only">Links</h2>
            <ul id="linklist">
              ${(this.__links || []).map(
                (link, i) => html`
                  <li>
                    <a id="link-${i}" href="link.url" class="link ${link.type}">
                      ${link.text} (${link.url})
                    </a>
                    ${!this.editable
                      ? ""
                      : html`
                          <button
                            aria-controls="source-${i}"
                            @click="${(e) => this._removeLink(i)}"
                          >
                            <span class="sr-only">delete link</span>
                            <iron-icon icon="delete"></iron-icon>
                          </button>
                        `}
                  </li>
                `
              )}
              ${!this.editable
                ? ``
                : html`
                    <li>
                      <label for="linktext" class="sr-only">Text</label>
                      <input
                        id="linktext"
                        @change="${(e) =>
                          (this.__newLinkText = this._getFieldVal("linktext"))}"
                        placeholder="link text"
                        type="text"
                      />
                      <label for="linkurl" class="sr-only">URL</label>
                      <input
                        id="linkurl"
                        @change="${(e) =>
                          (this.__newLinkUrl = this._getFieldVal("linkurl"))}"
                        placeholder="url"
                        required
                        type="url"
                      />
                      <button
                        aria-controls="linklist"
                        aria-describedby="linktext linkurl"
                        @click="${this._addLink}"
                        ?disabled="${!this.__newLinkUrl}"
                      >
                        <span class="sr-only">add link</span>
                        <iron-icon icon="add"></iron-icon>
                      </button>
                    </li>
                  `}
            </ul>
          </section>
        `;
  }
  get newLinkType() {
    return this._getLinkType(this.__newLinkUrl);
  }
  get sources() {
    let sourcesEmpty = (this.__sources || []).length < 1 && !this.editable;
    return !this.assignment || sourcesEmpty
      ? ""
      : html`
          <section id="uploads">
            <h2 class="sr-only">Uploads</h2>
            <ul id="uploadlist">
              ${(this.__sources || []).map(
                (source, i) => html`
                  <li
                    id="source-${i}"
                    style="background-image: url(${source.src})"
                  >
                    ${!this.editable
                      ? ``
                      : html` <button
                          aria-controls="source-${i}"
                          class="delete-upload"
                          @click="${(e) => this._removeUpload(i)}"
                        >
                          <span class="sr-only"
                            >delete ${source.alt || source.src}</span
                          >
                          <iron-icon icon="delete"></iron-icon>
                        </button>`}
                  </li>
                `
              )}
              ${!this.editable
                ? html`<div></div>`
                : html`
                    <li>
                      <vaadin-upload
                        id="add-upload"
                        @upload-before="${this._addUpload}"
                      ></vaadin-upload>
                      <span class="spacer"></span>
                    </li>
                  `}
            </ul>
          </section>
        `;
  }
  get tooEarly() {
    return (
      this.assignment &&
      this.assignment.showDate &&
      this.isEarly(this.assignment.showDate)
    );
  }
  get submittedLate() {
    return (
      (this.submission || {}).date &&
      this.assignment &&
      this.isLate(this.assignment.date, this.submission.date)
    );
  }
  get tooLate() {
    return (
      this.assignment &&
      this.assignment.hideDate &&
      this.isLate(this.assignment.hideDate)
    );
  }
  _addLink(i) {
    if (this.__newLinkUrl) {
      let links = this.__links.slice(0);
      links.push({
        text: this.__newLinkText,
        url: this.__newLinkUrl,
        type: this.newLinkType,
      });
      this.__links = links;
      this._setFieldVal("linkurl");
      this._setFieldVal("linktext");
    }
  }
  _addUpload(e) {
    console.log("_addUpload", e);
    /*let source = {}, 
      sources = this.__sources.slice(0);
    sources.splice(i,0,source);
    this.__sources = sources;*/
  }
  _getFieldVal(id) {
    return this.shadowRoot && this.shadowRoot.querySelector(`#${id}`)
      ? this.shadowRoot.querySelector(`#${id}`).value
      : undefined;
  }
  _getLinkType(url = "") {
    let ext = url.match(/\.\w+$/);
    return ext && ext[0] ? ext[0].toLowerCase().replace(/\./, "") : undefined;
  }
  _removeLink(i) {
    let links = this.__links.slice(0);
    links.splice(i, 1);
    this.__links = links;
  }
  _removeUpload(i) {
    let sources = this.__sources.slice(0);
    sources.splice(i, 1);
    this.__sources = sources;
  }
  _setFieldVal(id, val) {
    if (this.shadowRoot && this.shadowRoot.querySelector(`#${id}`))
      this.shadowRoot.querySelector(`#${id}`).value = "";
  }
}
customElements.define("elmsln-studio-assignment", ElmslnStudioAssignment);
export { ElmslnStudioAssignment };
