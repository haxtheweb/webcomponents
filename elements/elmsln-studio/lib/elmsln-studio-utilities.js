/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/nav-card/nav-card.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";

const ElmslnStudioUtilities = function(SuperClass) {
  return class extends SuperClass {

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        demoMode: {
          type: Boolean,
          attribute: "demo-mode", 
          reflect: true
        }
      };
    }
    constructor() {
      super();
      this.demoMode = false;
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
      return Object.keys(obj || {}).map(i => {
        let item = obj[i];
        item.id = i;
        Object.keys(props || {}).forEach(j => (item[j] = props[j]));
        return item;
      });
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
            day: "numeric"
          })
        : format === "short"
        ? d.toLocaleDateString(undefined, { month: "long", day: "numeric" })
        : d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
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
      return `/portfolios/${submission.userId}-${
        submission.projectId
      }?submission=${submission.id}`;
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
      return `/portfolios/${feedback.creator}-${
        feedback.projectId
      }?submission=${feedback.submissionId}&comment=${feedback.id}`;
    }

    /**
     * gets title of given feedback
     * @param {object} feedback object
     * @returns {string} title
     */
    feedbackTitle(feedback) {
      return `${feedback.firstName} left feedback on ${
        feedback.creatorFirstName
      }'s
        ${feedback.assignment}`;
    }

    /**
     * gets link to given reply
     * @param {object} reply object
     * @returns {string} link
     */
    replyLink(reply) {
      return `/portfolios/${reply.creator}-${reply.projectId}?submission=${
        reply.submissionId
      }&comment=${reply.id}`;
    }

    /**
     * gets title of a given reply
     * @param {object} reply object
     * @returns {string} title
     */
    replyTitle(reply) {
      return `${reply.firstName} replied to ${
        reply.feedbackFirstName
      }'s feedback`;
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
          detail: path
        })
      );
    }
  };
};
export { ElmslnStudioUtilities };
