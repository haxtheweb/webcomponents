/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
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
          font-family: var(--elmsln-studio-FontFamily, sans-serif);
          font-size: 13px;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          width: 0;
          overflow: hidden;
        }
        h1,
        h2,
        h3 {
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          color: var(--simple-colors-default-theme-grey-7, #666);
        }
        h2,
        #secondary [slot="heading"] {
          font-size: 18px;
        }
        #cards {
          margin: var(--elmsln-studio-margin, 20px) calc(-0.5 * var(--elmsln-studio-margin, 20px));
        }
        .card {
          --accent-card-padding: 10px;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px))
          calc(0.5 * var(--elmsln-studio-margin, 20px))
            calc(2 * var(--elmsln-studio-margin, 20px));
          flex: 0 0 calc(33.33333333% - var(--elmsln-studio-margin, 20px));
        }
        #secondary {
          margin-top: 0;
          --accent-card-heading-padding-top: 0;
          --nav-card-linklist-margin-top: 0;
          --nav-card-linklist-left-size: 36px;
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
        }
        accent-card {
          --accent-card-heading-padding-top: 0;
        }
        accent-card button {
          border: none;
          padding: 0;
          text-align: left;
          font-size: inherit;
          font-weight: inherit;
        }
        @media screen and (min-width: 600px) {
          progress-donut {
            max-width: 150px;
          }
          :host {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
          }
          #primary {
            flex: 0 0 calc(50%);
          }
          #secondary {
            flex: 0 0 calc(50%);
          }
          h1,
          h2 {
            flex: 0 0 calc(100% - var(--elmsln-studio-margin, 20px));
            padding: 0 var(--elmsln-studio-margin, 20px);
          }
        }
        @media screen and (min-width: 900px) {
          #primary {
            flex: 0 0 calc(66.66666667%);
          }
          #secondary {
            flex: 0 0 calc(33.33333333%);
          }
          #cards {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            flex-wrap: wrap;
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
      <h1 class="sr-only">Overview</h1>
      <div id="primary">
        <lrndesign-gallery .sources="${this.featured}"></lrndesign-gallery>
        <div id="cards">
        ${this.submissions.map(s => html`
        <accent-card no-border class="card">
          <div slot="content">
            <img src="${s.src}" alt="preview of ${s.student}'s ${s.assignment} submission" slot="image" width="100%"/>
            <h2 id="student-${s.id}" class="submission-card-student">${s.student}</h2>
            <p id="date-${s.id}" class="submission-card-date">${s.date}</p>
            <p id="assignment-${s.id}}" class="submission-card-assignment">${s.assignment}</p>
            <p id="project-${s.id}" class="submission-card-project">${s.project}</p>
          </div>
          <div slot="footer">
            <button id="discussion" 
              aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}">
              <iron-icon icon="" class="sr-only"></iron-icon>
              Discussion
            </button>
            <button id="view" 
              aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}">
              <iron-icon icon="" class="sr-only"></iron-icon>
              View
            </button>
          </div>
        </accent-card>
        `)}
        </div>
      </div>
      <nav-card
        id="secondary"
        flat
        no-border
        class="card"
        link-icon="chevron-right"
      >
        <span slot="heading">Comments</span>
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
        <button class="linklist-footer" slot="footer">Load More</button>
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
  get submissions(){
    return [
      {
        id: "e865ade8-a8e9-4e35-8fda-54aa86e57ab3",
        student: "Havana Brown",
        date: "2020-07-30T13:15:56-04:00",
        assignment: "Discover: Interview",
        project: "Ritual Project",
        alt: `preview of Tortie Manx's submission for Discover: Interview`,
        src: "//placekitten.com/400/400",
        large: "//placekitten.com/800/800",
        thumb: "//placekitten.com/200/200",
        viewLink: "#",
        discussLink: "#",
        feature: `Ptracy give me some of your food give me some of your food give me some of your food meh, i don't want it. Cough skid on floor, crash into wall . Knock over christmas tree intrigued by the shower spread kitty litter all over house. So you're just gonna scroll by without saying meowdy? put toy mouse in food bowl run out of litter box at full speed and cat jumps and falls onto the couch purrs and wakes up in a new dimension filled with kitty litter meow meow yummy there is a bunch of cats hanging around eating catnip meow meow mama cat is love, cat is life or grass smells good. Meow all night meow meow. Fooled again thinking the dog likes me warm up laptop with butt lick butt fart rainbows until owner yells pee in litter box hiss at cats for scratch at the door then walk away. Poop on floor and watch human clean up see owner, run in terror play with twist ties meow meow cats go for world domination. Sniff catnip and act crazy flee in terror at cucumber discovered on floor put butt in owner's face, carefully drink from water glass and then spill it everywhere and proceed to lick the puddle claws in the eye of the beholder. Pretend you want to go out but then don't sniff other cat's butt and hang jaw half open thereafter, for kitty power. `
      },
      {
        id: "e865ade8-a8e9-4e35-9fda-54aa86e57ab3",
        student: "Tabby Nebelung",
        date: "2020-05-09T10:43:56-04:00",
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
        date: "2020-10-21T14:05:58-04:00",
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
        date: "2020-02-05T18:22:47-05:00",
        assignment: "Discover: Interview",
        project: "Ritual Project",
        alt: `preview of Tortie Manx's submission for Discover: Interview`,
        src: "//placekitten.com/600/400",
        large: "//placekitten.com/900/600",
        thumb: "//placekitten.com/300/200",
        viewLink: "#",
        discussLink: "#",
        feature: `Paw at beetle and eat it before it gets away cat sit like bread stuff and things cry louder at reflection. Push your water glass on the floor bleghbleghvomit my furball really tie the room together but pose purrfectly to show my beauty. Cat milk copy park pee walk owner escape bored tired cage droppings sick vet vomit bird bird bird bird bird bird human why take bird out i could have eaten that spend six hours per day washing, but still have a crusty butthole, yet meow. As lick i the shoes damn that dog . Man running from cops stops to pet cats, goes to jail plan your travel. Sniff all the things cats making all the muffins but russian blue. Human give me attention meow chase imaginary bugs, or when owners are asleep, cry for no apparent reason need to chase tail bury the poop bury it deep or catch mouse and gave it as a present meeeeouw. Put toy mouse in food bowl run out of litter box at full speed ask to go outside and ask to come inside and ask to go outside and ask to come inside or have a lot of grump in yourself because you can't forget to be grumpy and not be like king grumpy cat but miaow then turn around and show you my bum cat sit like bread.`
      }
    ];
  }
  get featured(){
    console.log('submissions',this.submissions,this.submissions.filter(s=>s.feature),this.submissions.filter(s=>s.feature).map(s=>{
      s.title = "Featured Work";
      s.detail = s.feature;
      return s;
    }));
    return this.submissions.filter(s=>s.feature).map(s=>{
      s.title = "Featured Work";
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
