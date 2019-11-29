import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@polymer/paper-card/paper-card.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-drawer.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `lrn-calendar-date`
 * @customElement lrn-calendar-date
 * `A LRN element`
 *
 * @demo demo/index.html
 *
 */
class LrnCalendarDate extends PolymerElement {
  static get template() {
    return html`
      <style include="materializecss-styles-colors">
        :host {
          display: block;
        }
        ::-webkit-scrollbar {
          width: 0px; /* remove scrollbar space */
          background: transparent; /* optional: just make scrollbar invisible */
        }

        .month {
          width: 100%;
          height: 20vh;
          vertical-align: top;
          overflow: scroll;
        }
        .week {
          width: 100%;
          height: 40vh;
          vertical-align: top;
          overflow: scroll;
        }
        .card-content {
          position: relative;
          bottom: 10px;
          white-space: nowrap;
          font-size: 12px;
          padding: 0px 5px;
          line-height: 7px;
        }
        .label {
          width: 100%;
        }
      </style>

      <div id="test">
        <div>
          <template is="dom-if" if="[[firstWeek]]">
            <paper-card class="label"> <h3>[[getWeek(date)]]</h3> </paper-card>
          </template>
        </div>
        <paper-card class$="[[view]]" id="dateHeader">
          <h5>[[getMonth(date)]]</h5>
          <template is="dom-repeat" items="{{events}}">
            <div class="card-content">
              <lrnsys-drawer
                text="[[timeString(item.event.startDate._time.hour, item.event.startDate._time.minute, item.event.endDate._time.hour,item.event.endDate._time.minute)]] {{item.event.summary}}"
                header="[[getDateString(date)]]"
                align="left"
                heading-class="orange lighten-3 blue-text text-darken-4"
                style$="[[computeStyle(item)]];overflow:auto;"
              >
                [[displayActivity(item)]]
                <br /><br />[[displayStart(item)]]<br /><br />[[displayEnd(item)]]<br /><br />[[displayDuration(item)]]<br /><br />[[displayDescription(item)]]<br /><br />[[displayLocation(item)]]
              </lrnsys-drawer>
            </div>
          </template>
        </paper-card>
      </div>
    `;
  }

  static get tag() {
    return "lrn-calendar-date";
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: "lrn-calendar-date"
      },
      name: {
        type: String
      },
      date: {
        type: Date
      },
      loadeddate: {
        type: Boolean
      },
      firstWeek: {
        type: Boolean
      },
      view: {
        type: String
      },
      valid: {
        type: Boolean,
        value: false
      }
    };
  }

  /*
   * Displays the month in the heading
   */

  getMonth(date) {
    var monthInt = date.getMonth();
    var day = date.getDate();
    var monthsArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    if (day == 1) {
      monthstring = monthsArray[monthInt] + " " + day;
    } else {
      monthstring = day;
    }

    return monthstring;
  }

  /*
   * Displays the weekday for in the column for the first week
   */
  getWeek(date) {
    var weekdays = date.getDay();
    var weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekArray[weekdays];
  }

  /*
   * Creates the string that displays the time of the event
   */
  timeString(startHour, startMinute, endHour, endMinute) {
    var amPM = startHour > 11 ? "pm" : "am";
    if (startHour > 12) {
      startHour -= 12;
    } else if (startHour == 0) {
      //If the start time and end time is 12AM
      if (startMinute == 0 && endHour == 0 && endMinute == 0) {
        var allDayText = "";
        return allDayText;
      } else {
        startHour = "12";
      }
    }
    if (startMinute < 10) {
      startMinute = "0" + startMinute;
    }
    if (startMinute == 0) {
      return startHour + amPM;
    }
    return startHour + ":" + startMinute + amPM;
  }

  /*
   * If an event occurs the whole day the background color is yellow
   */
  computeStyle(item) {
    if (item.event.startDate._time.hour == 0)
      var s = "background-color:" + " yellow";
    else var s = "background-color:" + " clear";
    return s;
  }

  /*
   * When click for more info, this gives the full date of the event
   */
  getDateString(date) {
    var monthInt = date.getMonth();
    var day = date.getDate();
    var monthsArray = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    monthstring =
      monthsArray[monthInt] + " " + date.getDate() + " " + date.getFullYear();

    return monthstring;
  }

  /*
   * Displayes the name of the activity in the more info slideout
   */
  displayActivity(e) {
    var activity = e.event.summary;
    return "Activity: " + activity;
  }

  /*
   * Displays the start time in the more info slideout
   */
  displayStart(e) {
    var startTime = this.timeString(
      e.event.startDate._time.hour,
      e.event.startDate._time.minute
    );
    var endTime = this.timeString(
      e.event.endDate._time.hour,
      e.event.endDate._time.minute
    );
    /*if(startTime == "12am" && endTime == "12"){
      return "";
    }*/
    return "Start Time: " + startTime;
  }

  /*
   * Displays the end time in the more info slideout
   */
  displayEnd(e) {
    var endTime = this.timeString(
      e.event.endDate._time.hour,
      e.event.endDate._time.minute
    );
    return "End Time: " + endTime;
  }

  /*
   * Displays the duration in the more info slideout
   */
  displayDuration(e) {
    var duration = e.event.duration;
    var days = duration.days;
    var hours = duration.hours;
    var minutes = duration.minutes;
    var weeks = duration.weeks;
    if (hours == 0 && minutes == 0 && days == 1) {
      return "Duration: All Day";
    }
    if (days == 0) {
      if (hours == 0) {
        if (minutes == 0) {
          return "Duration: ";
        } else {
          return "Duration: " + minutes + "min";
        }
      } else {
        if (minutes == 0) {
          return "Duration: " + hours + "H ";
        } else {
          return "Duration: " + hours + "H " + minutes + "min ";
        }
      }
    } else {
      if (hours == 0 && minutes == 0) {
        return "Duration: " + days + "Days ";
      } else if (hours > 0 && minutes == 0) {
        return "Duration: " + days + "Days " + hours + "H ";
      } else {
        return "Duration: " + days + "Days " + hours + "H " + minutes + "min ";
      }
    }
  }

  /*
   * Displays the description in the more info slideout
   */
  displayDescription(e) {
    var description = e.event.description;
    if (!description) {
      return "Description: ";
    }
    return "Description: ";
  }

  /*
   * Displays the location in the more info slideout
   */
  displayLocation(e) {
    var location = e.event.location;
    location = String(location);
    if (location == null || location == "null") {
      return "Location: ";
    }
    return "Location: " + location;
  }
}
window.customElements.define(LrnCalendarDate.tag, LrnCalendarDate);
export { LrnCalendarDate };
