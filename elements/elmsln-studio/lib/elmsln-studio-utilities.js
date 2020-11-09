/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
import "@github/time-elements";
import "@lrnwebcomponents/nav-card/nav-card.js";
//import "@lrnwebcomponents/accent-card/lib/accent-card-clickable.js";
import "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import "./elmsln-studio-link.js";
import "./elmsln-studio-button.js";

const ElmslnStudioUtilities = function (SuperClass) {
  return class extends SuperClass {
    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        demoMode: {
          type: Boolean,
          attribute: "demo-mode",
          reflect: true,
        },
      };
    }
    constructor() {
      super();
      this.demoMode = false;
      import("@polymer/iron-ajax/iron-ajax.js");
      import("@polymer/iron-icon/iron-icon.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }
    /**
     * default toolbar config object,
     * where "top" contains config for toolbar above image(s),
     * and "bottom" contains config for toolbar above image(s)
     * @return {object} as { top: { id="top", contents:[]},  id="bottom", contents:[]}, }
     *
     * @readonly
     * @memberof imgViewViewer
     */
    get defaultModalToolbars() {
      return {
        bottom: {
          id: "bottom",
          type: "toolbar-group",
          contents: [
            "prevbutton",
            "homebutton",
            "rotategroup",
            "zoomgroup",
            "pageXofY",
            "pangroup",
            "fullscreenbutton",
            "nextbutton",
          ],
        },
      };
    }

    /**
     * sorts array by most recent (or by oldest)
     * @param {array} arr array
     * @param {boolean} sort by most recent? (default is true)
     * @returns {arr} sorted array
     */
    sortDates(arr, oldest = false) {
      return arr.sort((a, b) => {
        let aa = typeof a.date === "string" ? Date.parse(a.date) : a.date,
          bb = typeof b.date === "string" ? Date.parse(b.date) : b.date;
        return !oldest ? bb - aa : aa - bb;
      });
    }
    /**
     * gets date x days from start date
     * @param {date} start starting date
     * @param {number} days number of weeks
     * @returns {date}
     */
    addDays(start = new Date(), amt = 0) {
      return new Date(Date.parse(start) + amt * 86400000);
    }
    /**
     * gets date x weeks from start date
     * @param {date} start starting date
     * @param {number} weeks number of weeks
     * @returns {date}
     */
    addWeeks(start = new Date(), amt = 0) {
      return new Date(Date.parse(start) + amt * 604800000);
    }
    /**
     * convert object to array
     * @param {object} obj object to convert
     * @param {props} additional properties to set
     * @returns {array}
     */
    toArray(obj, props) {
      return Object.keys(obj || {}).map((i) => {
        let item = obj[i];
        item.id = i;
        Object.keys(props || {}).forEach((j) => (item[j] = props[j]));
        return item;
      });
    }
    isEarly(due, submitted) {
      return new Date(due) > (new Date(submitted) || new Date());
    }
    onTime(due, submitted) {
      return new Date(due) === (new Date(submitted) || new Date());
    }
    isLate(due, submitted) {
      return new Date(due) < (submitted ? new Date(submitted) : new Date());
    }

    getStatus(submission, assignment, ifOverdue, ifLate, ifSubmitted, ifElse) {
      let late =
          !!submission &&
          !!submission.date &&
          !!assignment.date &&
          submission.date > assignment.date,
        overdue =
          !submission && !!assignment.date && this.isLate(assignment.date);
      return overdue
        ? ifOverdue
        : late
        ? ifLate
        : submission
        ? ifSubmitted
        : ifElse;
    }
    getStatusIcon(submission, assignment) {
      return this.getStatus(
        submission,
        assignment,
        "report-problem",
        "assignment-late",
        "assignment-turned-in",
        "assignment"
      );
    }
    getStatusColor(submission, assignment) {
      return this.getStatus(
        submission,
        assignment,
        "red",
        "amber",
        "green",
        "grey"
      );
    }
    getStatusMessage(submission, assignment) {
      return this.getStatus(
        submission,
        assignment,
        "Overdue",
        "Submitted Late",
        "Submitted",
        "Not Submitted"
      );
    }
    /**
     * converts and sorts arrat
     * @param {object} obj object to convert
     * @returns {array}
     */
    _recentArray(arr) {
      return this.sortDates(this.toArray(arr));
    }
    //submission  assignmnent assignmentId
    getAncestor(child, path) {
      if (child && path && path.length > 0) {
        let foreignkey = path[0][1],
          parent = path[0][0],
          key = child[`${path[0][1]}`];
        return this.getAncestor(parent[key], path.slice(1));
      } else {
        return child;
      }
    }
    /**
     * gets figures for img-view-modal
     *
     * @param {array} sources
     * @returns
     */
    getFigures(
      sources,
      src = "src",
      alt = "alt",
      full = "full",
      longdesc = "longdesc"
    ) {
      //console.log('getFigures',sources);
      let images = (sources || []).map((source) => {
        return {
          src: source[full] || source[src],
          info:
            source[alt] && source[longdesc]
              ? html`
                  <p>${source[alt]}:</p>
                  <div>${source[longdesc]}</div>
                `
              : source[alt]
              ? html` ${source[alt]} `
              : html` ${source[longdesc]} `,
        };
      });
      return images.filter((s) => !!s.src);
    }
    getThumnailGrid(s) {
      return html`
        <div class="thumbnail-grid">
          ${(s.sources || []).map(
            (source, i) => html`
              <img-view-modal
                class="thumbnail"
                page="${i}"
                title="${s.assignment} by ${s.firstName} ${s.lastName}"
                .toolbars="${this.defaultModalToolbars}"
                .figures="${this.getFigures(s.sources)}"
              >
                <button
                  id="view-thumb-${s.id}"
                  .style="${this.getThumbailStyle(source.src)}"
                >
                  <span class="sr-only">${source.alt}</span>
                  <div class="zoombg"></div>
                  <iron-icon icon="zoom-in" class="zoomicon"></iron-icon>
                  <div class="imgbg"></div>
                </button>
                <simple-tooltip for="view-thumb-${s.id}"
                  >View Thumbnail</simple-tooltip
                >
              </img-view-modal>
            `
          )}
        </div>
      `;
    }
    getThumbailStyle(src) {
      return `--elmsln-studio-image-button-backgroundImage: url(${src});`;
    }
    /**
     * gets fullname from user data
     * @param {object} user data containing firstName and lastName
     * @param {boolean} sortable last name first
     * @returns {string} `Firstname Lastname` (or if sortable, `Lastname, Firstname`)
     */
    fullName(user, sortable = false) {
      return user && !sortable
        ? `${user.firstName} ${user.lastName}`
        : user
        ? `${user.lastName}, ${user.firstName}`
        : ``;
    }
    /**
     * gets formatted date
     * @param {object} date
     * @param {format} long (Weekday, Month, Day, Year), short (Month, Day), or default (Month, Day, Year)
     * @returns {string} date as string
     */
    dateFormat(d, format) {
      if (typeof d === "string") d = new Date(d);
      return !d
        ? ""
        : format === "long"
        ? d.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : format === "short"
        ? d.toLocaleDateString(undefined, { month: "long", day: "numeric" })
        : d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    }

    /**
     * gets a custom accent color based on a string
     * @param {string} string used to calculate accent color
     * @returns {string} accent color
     */
    accentColor(str) {
      let card = new AccentCard(),
        colors = !card || !card.colors ? [""] : Object.keys(card.colors),
        i =
          str && str.charCodeAt(0)
            ? str.charCodeAt(0)
            : Math.floor(Math.random() * 16);
      return colors[(i % 16) + 1]
        ? colors[(i % 16) + 1]
        : colors[Math.floor(Math.random() * colors.length)];
    }

    getActivityLink(activity, nocomment = false, sort = false) {
      return activity.activity === "submission"
        ? `/project/${activity.portfolioId || activity.id}${
            activity.portfolioId ? `?submission=${activity.id}` : ""
          }${
            nocomment
              ? ""
              : activity.portfolioId
              ? `&comment=true&sort-latest=${sort}`
              : `?comment=true&sort-latest=${sort}`
          }`
        : activity.activity === "discussion"
        ? `/project/${activity.projectId || activity.submissionId}${
            activity.portfolioId ? `?submission=${activity.submissionId}&` : "?"
          }comment=${activity.id}`
        : `/project/${activity.projectId || activity.submissionId}${
            activity.portfolioId ? `?submission=${activity.submissionId}&` : "?"
          }comment=${activity.feedbackId}`;
    }

    getActivityTitle(activity) {
      return html`
        ${activity.activity === "submission"
          ? `${[activity.firstName, activity.lastName].join(" ")} submitted ${
              activity.assignment
            }`
          : activity.activity === "discussion"
          ? `${[activity.firstName, activity.lastName].join(
              " "
            )}'s feedback on ${[
              activity.creatorFirstName,
              activity.creatorLastName,
            ].join(" ")}'s ${activity.assignment}`
          : `${[activity.firstName, activity.lastName].join(" ")} replied to ${[
              activity.reviewerFirstName,
              activity.reviewerLastName,
            ].join(" ")}`}
      `;
    }
    /**
     * gets link of a given activity
     * @param {object} activity object
     * @param {string} type of activtiy
     * @returns {string} link
     */
    activityLink(activity, type) {
      if (type === "submission") {
        return this.submissionLink(activity);
      } else if (activity.activity === "feedback") {
        return this.feedbackLink(activity);
      } else {
        return this.replyLink(activity);
      }
    }
    /**
     * gets title of a given activity
     * @param {object} activity object
     * @param {string} type of activtiy
     * @returns {string} title
     */
    activityTitle(activity, type) {
      if (type === "submission") {
        return this.submissionTitle(activity);
      } else if (activity.activity === "feedback") {
        return this.feedbackTitle(activity);
      } else {
        return this.replyTitle(activity);
      }
    }

    /**
     * gets link to given submission
     * @param {object} submission object
     * @returns {string} link
     */
    submissionLink(submission) {
      return `/project/${submission.userId}-${submission.projectId}?submission=${submission.id}`;
    }

    /**
     * gets title of a given submission
     * @param {object} submission object
     * @returns {string} title
     */
    submissionTitle(submission) {
      return `${submission.firstName} submitted ${submission.assignment}`;
    }

    /**
     * gets link to given feedback
     * @param {object} feedback object
     * @returns {string} link
     */
    feedbackLink(feedback) {
      return `/project/${feedback.creator}-${feedback.projectId}?submission=${feedback.submissionId}&comment=${feedback.id}`;
    }

    /**
     * gets title of given feedback
     * @param {object} feedback object
     * @returns {string} title
     */
    feedbackTitle(feedback) {
      return `${feedback.firstName} left feedback on ${feedback.creatorFirstName}'s
        ${feedback.assignment}`;
    }

    /**
     * gets link to given reply
     * @param {object} reply object
     * @returns {string} link
     */
    replyLink(reply) {
      return `/portfolios/${reply.creator}-${reply.projectId}?submission=${reply.submissionId}&comment=${reply.id}`;
    }

    /**
     * gets title of a given reply
     * @param {object} reply object
     * @returns {string} title
     */
    replyTitle(reply) {
      return `${reply.firstName} replied to ${reply.feedbackFirstName}'s feedback`;
    }
    getFeedbackIcon(comments) {
      if (comments === 0) {
        return "communication:comment";
      } else if (comments < 10) {
        return `hax:messages-${comments}`;
      }
      return "hax:messages-9-plus";
    }

    rubricTable(rubric) {
      return !rubric
        ? ""
        : html`
            <table class="rubric-table">
              <caption>
                Rubric
              </caption>
              ${!rubric.key || !rubric.key
                ? ``
                : html`
                    <thead>
                      <th scope="col">Criteria</th>
                      ${rubric.key.map(
                        (col) => html`<th scope="col">
                          ${col.description && (col.points || col.points > -1)
                            ? `${col.description} (${col.points})`
                            : col.description || col.points}
                        </th>`
                      )}
                    </thead>
                  `}
              <tbody>
                ${Object.keys(rubric.values || {}).map(
                  (key) =>
                    html`
                      <tr>
                        <th scope="row">${key}</th>
                        ${(rubric.values[key] || []).map(
                          (col) => html`<td>${col}</td>`
                        )}
                      </tr>
                    `
                )}
              </tbody>
            </table>
          `;
    }

    _getValign(gravity) {
      return gravity && gravity.indexOf("top") > -1
        ? "top"
        : gravity && gravity.indexOf("bottom") > -1
        ? "bottom"
        : "center";
    }

    _getAlign(gravity) {
      return gravity && gravity.indexOf("left") > -1
        ? "left"
        : gravity && gravity.indexOf("right") > -1
        ? "right"
        : "center";
    }
    message404(type, backLabel, backHref) {
      return html` <div id="primary" class="primary-404">
        <p id="message-404">
          ${type} with this URL does not exist. Return to
          <elmsln-studio-link href="${backHref}">
            ${backLabel}</elmsln-studio-link
          >
          to search for assignment.
        </p>
      </div>`;
    }
    prevNextNav(prevLabel, prevHref, nextLabel, nextHref) {
      return html`
        <div id="prev-next-nav">
          <elmsln-studio-link
            href="${prevHref}"
            ?disabled="${!prevHref}"
            icon="chevron-left"
          >
            <span class="prev-next-label">
              <span>Previous</span>
              <span>${prevLabel}</span>
            </span>
          </elmsln-studio-link>
          <elmsln-studio-link
            href="${nextHref}"
            ?disabled="${!nextHref}"
            icon="chevron-right"
          >
            <span slot="before" class="prev-next-label">
              <span>Next</span>
              <span>${nextLabel}</span>
            </span>
          </elmsln-studio-link>
        </div>
      `;
    }
    loading(color, slot, size = "small") {
      return !slot
        ? html`<hexagon-loader
            loading
            item-count="3"
            size="${size}"
            color="${color}"
          >
          </hexagon-loader>`
        : html`<hexagon-loader
            loading
            item-count="3"
            size="${size}"
            color="${color}"
            slot="${slot}"
          >
          </hexagon-loader>`;
    }
    /**
     * handles buttons that work like links
     *
     * @param {*} e event
     * @param {string} path
     */
    submitData(type, data) {
      /**
       * Fires when button is clicked
       *
       * @event submit-data
       */
      console.log("submitData", type, data);
      this.dispatchEvent(
        new CustomEvent("submit-data", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            type: type,
            data: data,
          },
        })
      );
    }
    /**
     * handles buttons that work like links
     *
     * @param {*} e event
     * @param {string} path
     */
    fetchData(type, refresh = false) {
      /**
       * Fires when button is clicked
       *
       * @event fetch-data
       */
      console.log("fetchData", type, refresh);
      this.dispatchEvent(
        new CustomEvent("fetch-data", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            type: type,
            refresh: refresh,
          },
        })
      );
    }
    /**
     * handles buttons that work like links
     *
     * @param {*} e event
     * @param {string} path
     */
    _handleLinkButton(e, path) {
      location.href = path;
      /**
       * Fires when button is clicked
       *
       * @event link-button-click
       */
      this.dispatchEvent(
        new CustomEvent("link-button-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: path,
        })
      );
    }
  };
};
export { ElmslnStudioUtilities };
