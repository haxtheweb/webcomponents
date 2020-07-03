/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/nav-card/nav-card.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";

const ElmslnStudioUtilities = function(SuperClass) {
  return class extends SuperClass {
    /**
     * sorts array by most recent (or by oldest)
     * @param {array} arr array
     * @param {boolean} sort by most recent? (default is true)
     * @returns {arr} sorted array
     */
    sortDates(arr, recent = true) {
      return arr.sort((a, b) => (recent ? b.date - a.date : a.date - b.date));
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
      if (path && path.length > 0) {
        let foreignkey = path[0][1],
          parent = path[0][0],
          key = child[foreignkey];
        return getAncestors(parent[key], path.slice(1));
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
      return format === "long"
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
     * load more items for truncated array
     * @param {array} truncated
     * @param {array} full
     * @param {number} increment
     * @returns {array}
     */

    loadMore(truncated, full, increment) {
      truncated = full.slice(0, truncated.length + increment);
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
     * gets title of a given submission
     * @param {object} submission object
     * @returns {string} title
     */
    submissionTitle(submission) {
      let u = this.user(submission.userId);
      return html`
        ${u.firstName} submitted
        ${this.assignment(activity.assignmentId).assignment}
      `;
    }

    /**
     * gets title of given feedback
     * @param {object} feedback object
     * @returns {string} title
     */
    feedbackTitle(feedback) {
      let details = this._getFeedBackDetails(feedback),
        submission = this.submission(feedback.submissionId),
        u = this.user(submission.userId),
        f = this.user(feedback.userId),
        a = this.assignment(submission.assignmentId);
      return html`
        ${f.firstName} left feedback on ${u.firstName}'s ${a.assignment}
      `;
    }

    /**
     * gets title of a given reply
     * @param {object} reply object
     * @returns {string} title
     */
    replyTitle(reply) {
      let f = this.feedback(reply.feedbackId),
        r = this.user(reply.userId),
        u = this.user(f.userId);
      return html`
        ${r.firstName} replied to ${u.firstName}'s feedback
      `;
    }
  };
};
export { ElmslnStudioUtilities };
