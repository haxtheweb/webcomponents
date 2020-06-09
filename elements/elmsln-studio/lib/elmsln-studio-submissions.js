/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

/**
 * `elmsln-studio-submissions`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-submissions
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudioSubmissions extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          font-family: var(--elmsln-studio-FontFamily, 'Roboto', sans-serif);
          font-size: 13px;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          width: 0;
          overflow: hidden;
        }
        lrndesign-gallery {
         --lrndesign-gallery-border-radius: 2px;
         --lrndesign-gallery-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        #cards {
          margin: var(--elmsln-studio-margin, 20px)
            calc(-0.5 * var(--elmsln-studio-margin, 20px));
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .card {
          --accent-card-padding: 0;
          --accent-card-heading-padding-top: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-heading-padding-left: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-heading-padding-right: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-subheading-padding-left: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-subheading-padding-right: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-content-padding-left: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-content-padding-right: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-content-padding-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --accent-card-image-height: 200px;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px))
            calc(0.5 * var(--elmsln-studio-margin, 20px));
          flex: 0 0 calc(100% - var(--elmsln-studio-margin, 20px));
        }
        .card [slot="heading"] {
          font-weight: var(--elmsln-studio-FontWeightLight, 300);
          font-size: 22px;
        }
        .card [slot="corner"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
          color: #AFAFAF;
        }
        .card [slot="subheading"] {
          font-weight: var(--elmsln-studio-FontWeightBold, 500);
          font-size: 18px;
          font-style: normal;
          color: #5D5E5F;
        }
        .card [slot="content"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 14px;
          color: #7E7E7E;
        }
        .card [slot="footer"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
          text-transform: uppercase;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          color: #95989A;
        }
        .card button {
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
          background-color: transparent;
        }
        #secondary {
          margin-top: 0;
          --nav-card-linklist-margin-top: 0;
          --nav-card-linklist-left-size: 36px;
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
        }
        nav-card {
          margin: 0;
        }
        accent-card button {
          border: none;
          padding: 0;
          text-align: left;
          font-size: inherit;
          font-weight: inherit;
          flex: 1 1 auto;
        }
        @media screen and (min-width: 600px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          #primary {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
          #secondary {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
          .card {
            flex: 0 0 calc(100% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 900px) {
          #primary {
            flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
          }
          #secondary {
            flex: 0 0 calc(33.33333333% - var(--elmsln-studio-margin, 20px));
          }
          .card {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 1200px) {
          .card {
            flex: 0 0 calc(33.3333333333% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 1600px) {
          #cards {
            justify-content: space-around;
          }
          .card {
            flex: 0 0 calc(400px - var(--elmsln-studio-margin, 20px));
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <iron-ajax
        auto
        url="${this.commentsSrc}"
        @response="${e => this._handleArrayData(e, "__comments")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.submissionsSrc}"
        @response="${e => this._handleObjectData(e, "__submissions")}"
      ></iron-ajax>
      <div id="primary">
        <lrndesign-gallery .sources="${this.featured}"></lrndesign-gallery>
        <div id="cards">
          ${this.submissions.map(
            s => html`
              <accent-card no-border class="card" image-src="${s.src}">
                <span slot="heading" id="student-${s.id}" class="card-student">
                  ${s.student}
                </span>
                <span slot="corner" id="date-${s.id}">
                  ${s.date}
                </span>
                <span slot="subheading"
                  id="assignment-${s.id}">
                  ${s.assignment}
                </span>
                <span slot="content" 
                  id="project-${s.id}">
                  ${s.project}
                </span>
                <div slot="footer">
                  <button
                    id="discussion"
                    aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}"
                  >
                    <iron-icon icon="communication:comment"></iron-icon>
                    Discussion
                  </button>
                  <button
                    id="view"
                    aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}"
                  >
                    <iron-icon icon="visibility"></iron-icon>
                    View
                  </button>
                </div>
              </accent-card>
            `
          )}
        </div>
      </div>
      <nav-card
        id="secondary"
        flat
        no-border
        class="card"
        link-icon="chevron-right"
      >
        <span slot="heading">Recent Comments</span>
        <div slot="linklist">
          ${this.__comments.map(
            (comment, i) => html`
              <nav-card-item
                icon="chevron-right"
                avatar="${comment.relationships.author.data.avatar || ""}"
                initials="${comment.relationships.author.data.display_name ||
                  ""}"
              >
                <button
                  id="comment-${i}"
                  aria-describedby="comment-desc-${i}"
                  slot="label"
                >
                  ${comment.relationships.author.data.sis.sortable_name.replace(
                    /.*,/,
                    ""
                  )}
                  ${comment.type === "comment" ? "commented" : "submitted"}
                  ${comment.type === "comment"
                    ? comment.attributes.subject
                    : comment.attributes.title}
                </button>
                <span id="comment-desc-${i}" slot="description">
                  ${this.date(
                    comment.type === "comment"
                      ? comment.attributes.changed
                      : comment.meta.changed
                  )}
                </span>
              </nav-card-item>
            `
          )}
        </div>
      </nav-card>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /*
       * source JSON for most recent comments in response to
       * student's comment or submission
       */
      commentsSrc: {
        type: String,
        attribute: "comments-src"
      },
      /*
       * source JSON for student's most recent submissions
       */
      submissionsSrc: {
        type: String,
        attribute: "submissions-src"
      },
      /*
       * most recent comments in response to
       * student's comment or submission
       */
      __comments: {
        type: Array
      },
      /*
       * student's submissions
       */
      __submissions: {
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-submissions";
  }

  // life cycle
  constructor() {
    super();
    this.__comments = [];
    this.__submissions = [];
    this.tag = ElmslnStudioSubmissions.tag;
  }
  get submissions() {
    return [
      {
        id: "e865ade8-a8e9-4e35-8fda-54aa86e57ab3",
        student: "Havana Brown",
        date: "March 30, 2020",
        assignment: "Discover: Interview",
        project: "Ritual Project",
        alt: `preview of Tortie Manx's submission for Discover: Interview`,
        src: "//placekitten.com/400/400",
        large: "//placekitten.com/800/800",
        thumb: "//placekitten.com/200/200",
        viewLink: "#",
        discussLink: "#",
        features: `Ptracy give me some of your food give me some of your food give me some of your food meh, i don't want it. Cough skid on floor, crash into wall . Knock over christmas tree intrigued by the shower spread kitty litter all over house.`
      },
      {
        id: "e865ade8-a8e9-4e35-9fda-54aa86e57ab3",
        student: "Tabby Nebelung",
        date: "April 22, 2020",
        assignment: "Discover: Interview",
        project: "Ritual Project",
        alt: `preview of Tortie Manx's submission for Discover: Interview`,
        src: "//placekitten.com/400/300",
        large: "//placekitten.com/800/600",
        thumb: "//placekitten.com/200/150",
        viewLink: "#",
        discussLink: "#"
      },
      {
        id: "e865ade8-a8e9-8e35-9fda-54aa86e57ab3",
        student: "Kitty Korat",
        date: "May 1, 2020",
        assignment: "Discover: Interview",
        project: "Ritual Project",
        alt: `preview of Tortie Manx's submission for Discover: Interview`,
        src: "//placekitten.com/400/200",
        large: "//placekitten.com/800/400",
        thumb: "//placekitten.com/200/100",
        viewLink: "#",
        discussLink: "#"
      },
      {
        id: "d865ade8-a8e9-8e35-9fda-54aa86e57ab3",
        student: "Tortie Manx",
        date: "March 5, 2020",
        assignment: "Discover: Interview",
        project: "Ritual Project",
        alt: `preview of Tortie Manx's submission for Discover: Interview`,
        src: "//placekitten.com/600/400",
        large: "//placekitten.com/900/600",
        thumb: "//placekitten.com/300/200",
        viewLink: "#",
        discussLink: "#",
        feature: `Paw at beetle and eat it before it gets away cat sit like bread stuff and things cry louder at reflection. Push your water glass on the floor bleghbleghvomit my furball really tie the room together but pose purrfectly to show my beauty.`
      }
    ];
  }
  get featured() {
    console.log(
      "submissions",
      this.submissions,
      this.submissions.filter(s => s.feature),
      this.submissions
        .filter(s => s.feature)
        .map(s => {
          s.title = "Featured Work";
          s.detail = s.feature;
          return s;
        })
    );
    return this.submissions
      .filter(s => s.feature)
      .map(s => {
        s.title = `Featured Work: ${s.student}`;
        s.details = s.feature;
        return s;
      });
  }
  _getDueDates(item) {
    return item.meta.rationale && item.meta.rationale.data
      ? item.meta.rationale.data
      : undefined;
  }
  _getDueDate(item) {
    //console.log('_getDueDate',item,this._getDueDates(item));
    return this._getDueDates(item)
      ? this._getDueDates(item)[1] || this._getDueDates(item)[0]
      : undefined;
  }
  _handleArrayData(e, propName) {
    this[propName] =
      e && e.detail && e.detail.response && e.detail.response.data
        ? e.detail.response.data
        : [];
    //console.log("_handleArrayData", e, propName, this[propName]);
  }
  _handleObjectData(e, propName) {
    this[propName] =
      e && e.detail && e.detail.response && e.detail.response.data
        ? e.detail.response.data
        : {};
    //console.log('_handleObjectData',e,propName,this[propName]);
  }

  date(time) {
    let date,
      options = {
        //weekday: 'long',
        year: "numeric",
        month: "long",
        day: "numeric"
      };
    if (time && isNaN(time)) {
      let parts = time.split(/\D+/);
      date = new Date(...parts);
      /*console.log('date',parts,
      '\ndate',date,
      '\ntoString',date.toString(),
      '\ntoLocaleString',date.toLocaleString(),
      '\ntoLocaleDateString',date.toLocaleDateString(undefined,options),
      '\ntoUTCString',date.toUTCString(),
      '\ntoTimeString',date.toTimeString(),
      '\ntoLocaleTimeString',date.toLocaleTimeString()
      );*/
    } else if (time) {
      date = new Date(parseInt(time));
    }
    return date.toLocaleDateString(undefined, options);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-submissions", ElmslnStudioSubmissions);
export { ElmslnStudioSubmissions };
