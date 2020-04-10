/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from 'lit-element';
import "./lrnapp-studio-dashboard-profile.js";
import "./lrnapp-studio-dashboard-widget.js";
import "./lrnapp-studio-dashboard-keywords.js";

/**
 * `elmsln-studio-dashboard`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudioDashboard extends LitElement {
  
  static get styles(){
    return [
      css`
        :host {
          display: block;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 100;
          color: var(--simple-colors-foreground5, #666);
          --lrnapp-studio-dashboard-color: var(--simple-colors-foreground5, #666);
          --lrnapp-studio-dashboard-focus-color: var(--simple-colors-foreground1, #000);
          --lrnapp-studio-dashboard-border: 1px solid var(--simple-colors-background3, #ddd);
          --accent-card-heading: {
            color: var(--simple-colors-foreground5, #666);
            font-size: 125%;
            font-weight: 100;
          };
        }
        :host:first-of-type {
          --accent-card: {
            margin-top: 0;
          };
        }
        :host .section {
          display: block;
        }
        @media screen and (min-width: 300px){
          :host .centered {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }
        }
        @media screen and (min-width: 600px){
          :host .centered {
            max-width: 800px;
            display: grid;
            grid-template-rows: 1fr;
            align-items: start;
            justify-items: stretch;
            grid-column-gap: 20px;	
            grid-template-columns: 1fr 1fr;
          }
        }
        @media screen and (min-width: 1000px){
          :host .centered.grid {
            max-width: 1200px;
            grid-column-gap: 40px;	
            grid-template-columns: 2fr 1fr;
          }
          :host .grid {
            display: grid;
            grid-template-rows: 1fr;
            align-items: start;
            justify-items: stretch;
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 20px;	
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
    <iron-ajax auto
      url="../data/profile.json"
      last-response="{{profile}}">
    </iron-ajax>
    <!--TODO: Next up should be Current Project and checkmarkon completed assigment, Assignments Submitted Assignment to Deliverable. -->
    <!--TODO: Tooltips. -->
    <!--TODO: Instructor evaluation, conversations. -->
    <div class="centered grid">
      <div>
        <article>
          <h1>${this.profile.display_name}</h1>
          <div class="grid">
            <div>
                <lrnapp-studio-dashboard-profile class="section" profile="${this.profile}"></lrnapp-studio-dashboard-profile>
            </div>
            <div>
              <lrnapp-studio-dashboard-widget 
                class="section"
                accent-color="blue" 
                data-url="src/data/upcoming-assignments.json"
                heading="Assignments Due"
                item-detail="dueDate"
                item-link="links.self"
                item-title="title" 
                no-avatar>
              </lrnapp-studio-dashboard-widget>
              <lrnapp-studio-dashboard-widget 
                class="section"
                accent-color="green" 
                data-url="src/data/recent-submissions.json"
                heading="Feedback Due"
                item-detail="meta.humandate"
                item-link="links.self"
                item-title="attributes.title" 
                no-avatar>
              </lrnapp-studio-dashboard-widget>
            </div>
          </div>
        </article>
        <article>
          <h1>Recent Work</h1>
          <div class="grid">
            <div>   
              <lrnapp-studio-dashboard-widget 
                class="section"
                accent-color="yellow" 
                data-url="src/data/favorites.json"
                heading="My Pins"
                item-link="links.self"
                item-title="attributes.title" 
                no-avatar
                viewall-link="#todo" 
                viewall-text="View all pins">
              </lrnapp-studio-dashboard-widget>
              <lrnapp-studio-dashboard-widget 
                class="section"
                accent-color="amber" 
                data-url="src/data/recent-submissions.json"
                heading="My Submissions"
                item-detail="meta.humandate"
                item-link="links.self"
                item-title="attributes.title" 
                no-avatar
                viewall-link="#todo" 
                viewall-text="View all my submissions">
              </lrnapp-studio-dashboard-widget>
            </div>
            <div>
              <lrnapp-studio-dashboard-widget 
                class="section"
                accent-color="purple" 
                data-url="src/data/peer-feedback.json"
                heading="Feedback for Me"
                item-detail="attributes.humandate"
                item-link="#todo"
                item-body="attributes.body"
                item-title="attributes.subject" 
                no-avatar
                viewall-link="#todo" 
                viewall-text="View all feedback">
              </lrnapp-studio-dashboard-widget>
            </div>
          </div>
        </article>
      </div>
      <!-- add last 7 days on what submission? -->
      <article>
        <h1>Activity Feed</h1>
        <lrnapp-studio-dashboard-widget 
          class="section"
          accent-color="orange" 
          data-url="src/data/notifications.json"
          heading="Notifications"
          item-detail="attributes.humandate"
          item-link="#todo"
          item-avatar="relationships.author.data.avatar"
          item-title="attributes.title" 
          viewall-link="#todo" 
          viewall-text="View all my notifications">
        </lrnapp-studio-dashboard-widget>
        <lrnapp-studio-dashboard-widget 
          class="section"
          accent-color="deep-purple" 
          data-url="src/data/recent-activity.json"
          heading="All Activity"
          item-detail="attributes.humandate"
          item-link="#todo"
          item-avatar="relationships.author.data.avatar"
          item-title="attributes.title" 
          viewall-link="#todo" 
          viewall-text="Load more">
        </lrnapp-studio-dashboard-widget>
        <lrnapp-studio-dashboard-keywords></lrnapp-studio-dashboard-keywords>
      </article>
    </div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      profile: {
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "elmsln-studio-dashboard";
  }

  // life cycle
  constructor() {
    super();
    
    this.tag = ElmslnStudioDashboard.tag;
    this.title = "Project 1 Title";
    this.author = 'Bill Billerson';
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/elmsln-studio-dashboard-properties.json
    let obj = ElmslnStudioDashboard.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        }
        else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }
  /**
   * Simple way to convert from object to array.
   * @param {object} obj object to convert
   * @returns {array}
   */
  _toArray(obj) {
    return Object.keys(obj).map(key=>obj[key]);
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
customElements.define("elmsln-studio-dashboard", ElmslnStudioDashboard);
export { ElmslnStudioDashboard };