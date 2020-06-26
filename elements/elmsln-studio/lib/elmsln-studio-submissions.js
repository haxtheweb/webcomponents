/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
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
          font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
          font-size: 13px;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          width: 0;
          overflow: hidden;
        }
        .filters {
          padding-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
          margin-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
          border-bottom: 1px solid #ddd;
          height: calc(2 * var(--elmsln-studio-FontSize, 13px));
        }
        .filters,
        #layout {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        #primary .filters > *,
        #layout > * {
          flex: 0 1 auto;
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        simple-fields-field {
          color: #95989a;
          --simple-fields-border-color: transparent;
          --simple-fields-font-size: calc(
            1.5 * var(--elmsln-studio-FontSize, 13px)
          );
          --simple-fields-detail-font-size: calc(
            1.5 * var(--elmsln-studio-FontSize, 13px)
          );
          --simple-fields-font-family: var(
            --elmsln-studio-FontFamily,
            "Roboto",
            sans-serif
          );
          --simple-fields-detail-font-family: var(
            --elmsln-studio-FontFamily,
            "Roboto",
            sans-serif
          );
        }
        #layout > button {
          background-color: transparent;
          border: 0px solid rgba(0, 0, 0, 0);
          opacity: 0.25;
          transform: opacity 0.5s ease-in-out;
          margin: 0 5px;
        }
        #layout button:focus,
        #layout button:hover {
          opacity: 0.75;
        }
        #layout button[aria-pressed="true"] {
          opacity: 1;
        }
        #cards {
          margin: var(--elmsln-studio-margin, 20px)
            calc(-0.5 * var(--elmsln-studio-margin, 20px));
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .no-submissions {
          font-weight: var(--elmsln-studio-FontWeightLight, 300);
          font-size: 22px;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px));
          padding: var(--elmsln-studio-margin, 20px);
          width: calc(100% - 2 * var(--elmsln-studio-margin, 20px));
          background-color: #e8e8e8;
          text-align: center;
        }
        accent-card {
          --accent-card-padding: 0;
          --accent-card-heading-padding-top: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-heading-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-heading-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-subheading-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-subheading-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-bottom: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-top: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-bottom: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-image-padding-bottom: 5px;
          --accent-card-image-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-image-width: 33.33333%;
          --accent-card-image-height: 200px;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px))
            calc(0.5 * var(--elmsln-studio-margin, 20px));
          flex: 0 0 calc(100% - var(--elmsln-studio-margin, 20px));
        }
        .grid accent-card {
          --accent-card-image-width: 50%;
        }
        .feature {
          margin-top: var(--elmsln-studio-margin, 20px);
          height: calc(
            var(--accent-card-image-height, 200px) -
              var(--elmsln-studio-margin, 20px)
          );
          overflow: auto;
        }
        accent-card [slot="image-corner"] {
          display: inline-flex;
          right: 5px;
          bottom: 10px;
          position: absolute;
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.25);
        }
        accent-card [slot="image-corner"]:focus-within,
        accent-card [slot="image-corner"]:hover {
          background-color: rgba(0, 0, 0, 0.5);
        }
        accent-card [slot="heading"] {
          font-weight: var(--elmsln-studio-FontWeightLight, 300);
          font-size: 22px;
        }
        accent-card [slot="corner"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
        }
        accent-card [slot="subheading"] {
          font-weight: var(--elmsln-studio-FontWeightBold, 500);
          font-size: 18px;
          font-style: normal;
          color: #5d5e5f;
        }
        accent-card [slot="content"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 14px;
          color: #7e7e7e;
        }
        accent-card [slot="footer"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
          text-transform: uppercase;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          color: #95989a;
        }
        accent-card button {
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
          background-color: transparent;
        }
        accent-card button:last-child {
          text-align: right;
        }
        #secondary {
          margin-top: 0;
          --nav-card-linklist-margin-top: 0;
          --nav-card-linklist-left-size: 36px;
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
        }
        #secondary .filters {
          flex-wrap: wrap;
          justify-content: flex-start;
          font-size: calc(1.5 * var(--elmsln-studio-FontSize, 13px));
        }
        .comments,
        .comments-by {
          color: #95989a;
        }
        .comments-by {
          font-style: italic;
        }
        nav-card {
          margin: calc(1.5 * var(--elmsln-studio-margin, 20px)) 0 0;
        }
        accent-card button {
          border: none;
          padding: 0;
          text-align: left;
          font-size: inherit;
          font-weight: inherit;
          flex: 1 1 auto;
        }
        @media screen and (min-width: 500px) {
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 900px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          #primary {
            flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
          }
          #secondary {
            flex: 0 0 calc(33.33333333% - var(--elmsln-studio-margin, 20px));
          }
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 1200px) {
          .grid accent-card[horizontal] {
            flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
          }
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(33.3333333333% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 1600px) {
          .grid accent-card[horizontal] {
            --accent-card-image-width: 33.33333%;
            flex: 0 0 calc(75% - var(--elmsln-studio-margin, 20px));
          }
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(25% - var(--elmsln-studio-margin, 20px));
          }
          .list accent-card {
            --accent-card-image-width: 50%;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div id="primary">
        <div class="filters">
          <simple-fields-field
            inline
            label="Assignment:"
            .options="${this.assignments}"
            @value-changed="${e => (this.assignment = e.detail.value)}"
          >
          </simple-fields-field>
          <simple-fields-field
            inline
            label="Student:"
            .options="${this.students}"
            @value-changed="${e => (this.student = e.detail.value)}"
          >
          </simple-fields-field>
          <div id="layout">
            <button
              aria-pressed="${this.grid ? "false" : "true"}"
              @click="${e => (this.grid = false)}"
            >
              <iron-icon icon="icons:view-list"></iron-icon>
              <span class="sr-only">display as list</span>
            </button>
            <button
              aria-pressed="${this.grid ? "true" : "false"}"
              @click="${e => (this.grid = true)}"
            >
              <iron-icon icon="icons:view-module"></iron-icon>
              <span class="sr-only">display as grid</span>
            </button>
          </div>
        </div>
        <div id="cards" class="${this.grid ? "grid" : "list"}">
          ${this.noSubmissions
            ? html`
                <div class="no-submissions">
                  No submissions for applied filters.
                </div>
              `
            : ``}
          ${this.submissions.map(s =>
            !this._isFiltered(s.studentId, s.assignmentId)
              ? ``
              : html`
                  <accent-card
                    no-border
                    image-src="${s.image}"
                    ?horizontal="${s.feature || !this.grid ? true : false}"
                    image-align="${this._getAlign(s.feature, s.gravity)}"
                  >
                    <div slot="image-corner" class="image-zoom">
                      <iron-icon icon="zoom-in"></iron-icon>
                    </div>
                    <div
                      slot="heading"
                      id="student-${s.id}"
                      class="card-student"
                    >
                      ${s.student}
                    </div>
                    <div slot="corner" id="date-${s.id}">
                      ${s.date}
                    </div>
                    <div slot="subheading" id="assignment-${s.id}">
                      ${s.assignment}
                    </div>
                    <div slot="content" id="project-${s.id}">
                      ${s.project}
                    </div>
                    <div slot="content" class="feature" ?hidden="${!s.feature}">
                      ${s.feature}
                    </div>
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
      <div id="secondary">
        <div class="filters">
          <span class="comments">Comments:&nbsp;</span>
          <span class="comments-filter"
            >${this.assignments[this.assignment]}&nbsp;</span
          >
          <span class="comments-by">by&nbsp;</span>
          <span class="comments-filter"
            >${this.students[this.student]}&nbsp;</span
          >
        </div>
        <nav-card flat no-border class="card" link-icon="chevron-right">
          <span slot="heading">Recent Comments</span>
          <div slot="linklist">
            ${this.comments.map(c =>
              !this._isFiltered(c.studentId, c.assignmentId)
                ? ``
                : html`
                    <nav-card-item
                      icon="chevron-right"
                      .avatar="${c.image}"
                      initials="${c.firstName} ${c.lastName}"
                    >
                      <button
                        id="comment-${c.id}"
                        aria-describedby="comment-desc-${c.id}"
                        slot="label"
                      >
                        ${c.firstName} commented on ${c.student}'s ${c.project}
                        ${c.assignment}
                      </button>
                      <span id="comment-desc-${c.id}" slot="description">
                        ${c.date}
                      </span>
                    </nav-card-item>
                  `
            )}
          </div>
        </nav-card>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      grid: {
        type: Boolean
      },
      student: {
        type: String
      },
      assignment: {
        type: String
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
    this.student = "";
    this.assignment = "";
    this.grid = false;
    this.__fakeData = this.fakeData;
    this.tag = ElmslnStudioSubmissions.tag;
  }
  get fakeData() {
    let submissions = [],
      comments = [],
      ctr = 0,
      students = [
        {
          id: "hxb5122",
          lastName: "Brown",
          firstName: "Havana"
        },
        {
          id: "tmn823",
          lastName: "Nebelung",
          firstName: "Tabby"
        },
        {
          id: "kmk5124",
          lastName: "Korat",
          firstName: "Kitty",
          image: `//placekitten.com/g/350/500`
        },
        {
          id: "tjm5488",
          lastName: "Manx",
          firstName: "Tortie",
          image: `//placekitten.com/350/500`
        },
        {
          id: "fms9811",
          lastName: "Sphinx",
          firstName: "Felix"
        },
        {
          id: "tjc5167",
          lastName: "Cat",
          firstName: "Tom",
          image: `//placekitten.com/g/400/400`
        },
        {
          id: "cac488",
          lastName: "Coe",
          firstName: "Callie"
        },
        {
          id: "srf325",
          lastName: "Fold",
          firstName: "Scott",
          image: `//placekitten.com/400/400`
        }
      ],
      assignments = [
        {
          id: "assignment-1",
          project: "Hypertext Narrative Project",
          assignment: "Develop: Test and Iterate"
        },
        {
          id: "assignment-2",
          project: "Ritual Project",
          assignment: "Define: Themes & Insights"
        },
        {
          id: "assignment-3",
          project: "Ritual Project",
          assignment: "Discover: Journey Map"
        }
      ],
      images = [
        { image: "400/300", gravity: "center" },
        { image: "200/300", gravity: "center" },
        { image: "300/400", gravity: "center" },
        { image: "200/400", gravity: "center" },
        { image: "100/300", gravity: "center" },
        { image: "300/100", gravity: "center" },
        { image: "150/300", gravity: "center" },
        { image: "300/150", gravity: "center" },
        { image: "100/350", gravity: "center" },
        { image: "350/100", gravity: "center" },
        { image: "400/500", gravity: "center" },
        { image: "500/400", gravity: "center" },
        { image: "300/500", gravity: "center" },
        { image: "500/300", gravity: "center" },
        { image: "500/350", gravity: "center" },
        { image: "300/550", gravity: "center" },
        { image: "550/300", gravity: "center" },
        { image: "g/400/300", gravity: "center" },
        { image: "g/200/300", gravity: "center" },
        { image: "g/300/400", gravity: "center" },
        { image: "g/200/400", gravity: "center" },
        { image: "g/100/300", gravity: "center" },
        { image: "g/300/100", gravity: "center" },
        { image: "g/150/300", gravity: "center" },
        { image: "g/300/150", gravity: "center" },
        { image: "g/100/350", gravity: "center" },
        { image: "g/350/100", gravity: "center" },
        { image: "g/400/500", gravity: "center" },
        { image: "g/500/400", gravity: "center" },
        { image: "g/300/500", gravity: "center" },
        { image: "g/500/300", gravity: "center" },
        { image: "g/500/350", gravity: "center" },
        { image: "g/300/550", gravity: "center" },
        { image: "g/550/300", gravity: "center" }
      ],
      randomDate = () => {
        return `${
          ["January", "February", "March", "April"][
            Math.floor(Math.random() * 4)
          ]
        } ${Math.floor(Math.random() * 28 + 1)}, 2020`;
      };

    assignments.forEach(a => {
      students.forEach(s => {
        submissions.push({
          id: `submission-${ctr}`,
          date: randomDate(),
          assignmentId: a.id,
          assignment: a.assignment,
          project: a.project,
          image: `//placekitten.com/${images[ctr].image}`,
          gravity: images[ctr].gravity,
          studentId: s.id,
          student: `${s.firstName} ${s.lastName}`
        });
        students.forEach(c => {
          if (c.id !== s.id)
            comments.push({
              id: `comment-${ctr}`,
              firstName: c.firstName,
              lastName: c.lastName,
              image: c.image,
              date: randomDate(),
              student: s.firstName,
              studentId: s.id,
              assignmentId: a.id,
              assignment: a.assignment,
              project: a.project
            });
        });
        ctr++;
      });
    });

    submissions[0].feature = `Lick arm hair make meme, make cute face. Making sure that fluff gets into the owner's eyes hey! you there, with the hands, side-eyes your \"jerk\" other hand while being petted loved it, hated it, loved it, hated it spill litter box, scratch at owner, destroy all furniture, especially couch groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked. Thanks!`;
    submissions[5].feature = `Cough hairball on conveniently placed pants mew drool bury the poop bury it deep lay on arms while you're using the keyboard for cat fur is the new black or attack the child. Decide to want nothing to do with my owner today pretend you want to go out but then don't yet meow to be let in swat turds around the house but leave hair on owner's clothes. Headbutt owner's knee stinky cat for hack, or that box? i can fit in that box stare at ceiling, for i shall purr myself to sleep thug cat . Eat all the power cords paw at your fat belly, for catch eat throw up catch eat throw up bad birds or cat walks in keyboard swipe at owner's legs and meeeeouw get my claw stuck in the dog's ear. Catasstrophe thug cat , and so you're just gonna scroll by without saying meowdy? or check cat door for ambush 10 times before coming in bathe private parts with tongue then lick owner's face jump launch to pounce upon little yarn mouse, bare fangs at toy run hide in litter box until treats are fed yet roll over and sun my belly.`;
    submissions[11].feature = `Havana, I fixed the link so this should allow you to see the following passages. Let me know if it still gives you any issues!`;

    return {
      students: students,
      comments: comments,
      assignments: assignments,
      submissions: submissions
    };
  }
  get comments() {
    return this.__fakeData.comments;
  }
  get submissions() {
    return this.__fakeData.submissions;
  }

  get students() {
    let students = { "": "All" };
    (this.__fakeData.students || []).forEach(
      s => (students[s.id] = `${s.lastName}, ${s.firstName}`)
    );
    return students;
  }
  get assignments() {
    let assignments = { "": "All" };
    (this.__fakeData.assignments || []).forEach(
      a => (assignments[a.id] = a.assignment)
    );
    return assignments;
  }
  get filteredSubmissions() {
    return (this.submissions || []).filter(
      a => !this._isFiltered(a.studentId, a.assignmentId)
    );
  }
  get noSubmissions() {
    return this.filteredSubmissions.length === this.submissions.length;
  }
  _getAlign(feature, gravity) {
    let horizontal = !this.grid || feature;
    return horizontal && gravity.indexOf("left") > -1
      ? "left"
      : horizontal && gravity.indexOf("right") > -1
      ? "right"
      : !horizontal && gravity.indexOf("top") > -1
      ? "top"
      : !horizontal && gravity.indexOf("bottom") > -1
      ? "bottom"
      : "center";
  }
  _isFiltered(student, assignment) {
    //console.log(student,assignment,this.student,this.assignment,(this.student === "" || student === this.student) && (this.assignment === "" || assignment === this.assignment))
    return (
      (this.student === "" || student === this.student) &&
      (this.assignment === "" || assignment === this.assignment)
    );
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
