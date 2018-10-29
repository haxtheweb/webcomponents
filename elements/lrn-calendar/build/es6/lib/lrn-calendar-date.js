import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../lrn-calendar.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
      }
      ::-webkit-scrollbar {
        width: 0px;  /* remove scrollbar space */
        background: transparent;  /* optional: just make scrollbar invisible */
      }


      .month {
        width: 100%;
        height: 20vh;
        vertical-align: top;
        overflow: scroll;

      }
      .week{
        width: 100%;
        height: 40vh;
        vertical-align: top;
        overflow: scroll;
      }
      .card-content{
        position: relative;
        bottom: 10px;
        white-space: nowrap;
        font-size: 12px;
        padding: 0px 5px;
        line-height: 7px;
      }
      .label{
        width: 100%
      }


    </style>
    
      <div id="test">
        <div>
          <template is="dom-if" if="[[firstWeek]]">
            <paper-card class="label">
            <h3>[[getWeek(date)]]</h3>
            </paper-card>
          </template>
        </div>
        <paper-card class\$="{{view}}" id="dateHeader">
          
            <h5> [[getMonth(date)]] </h5>
          
          <template is="dom-repeat" items="{{events}}">
              <div class="card-content">
                <lrnsys-drawer text="[[timeString(item.event.startDate._time.hour, item.event.startDate._time.minute, item.event.endDate._time.hour,item.event.endDate._time.minute)]] {{item.event.summary}}" header="[[getDateString(date)]]" align="left" heading-class="orange lighten-3 blue-text text-darken-4" style="{{computeStyle(item)}};overflow:auto;">
                [[displayActivity(item)]] <br><br>[[displayStart(item)]]<br><br>[[displayEnd(item)]]<br><br>[[displayDuration(item)]]<br><br>[[displayDescription(item)]]<br><br>[[displayLocation(item)]]
                </lrnsys-drawer>
              </div>
          </template>
        </paper-card>
      </div>
`,
  is: "lrn-calendar-date",
  properties: {
    title: { type: String, value: "lrn-calendar-date" },
    name: { type: String },
    date: { type: Date },
    loadeddate: { type: Boolean },
    firstWeek: { type: Boolean },
    view: { type: String },
    valid: { type: Boolean, value: !1 }
  },
  getMonth: function(date) {
    var monthInt = date.getMonth(),
      day = date.getDate();
    if (1 == day) {
      monthstring =
        [
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
        ][monthInt] +
        " " +
        day;
    } else {
      monthstring = day;
    }
    return monthstring;
  },
  getWeek: function(date) {
    var weekdays = date.getDay();
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekdays];
  },
  timeString: function(startHour, startMinute, endHour, endMinute) {
    var amPM = 11 < startHour ? "pm" : "am";
    if (12 < startHour) {
      startHour -= 12;
    } else if (0 == startHour) {
      if (0 == startMinute && 0 == endHour && 0 == endMinute) {
        return "";
      } else {
        startHour = "12";
      }
    }
    if (10 > startMinute) {
      startMinute = "0" + startMinute;
    }
    if (0 == startMinute) {
      return startHour + amPM;
    }
    return startHour + ":" + startMinute + amPM;
  },
  computeStyle: function(item) {
    if (0 == item.event.startDate._time.hour)
      var s = "background-color:" + " yellow";
    else var s = "background-color:" + " clear";
    return s;
  },
  getDateString: function(date) {
    var monthInt = date.getMonth(),
      day = date.getDate();
    monthstring =
      [
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
      ][monthInt] +
      " " +
      date.getDate() +
      " " +
      date.getFullYear();
    return monthstring;
  },
  displayActivity: function(e) {
    var activity = e.event.summary;
    return "Activity: " + activity;
  },
  displayStart: function(e) {
    var startTime = this.timeString(
        e.event.startDate._time.hour,
        e.event.startDate._time.minute
      ),
      endTime = this.timeString(
        e.event.endDate._time.hour,
        e.event.endDate._time.minute
      );
    return "Start Time: " + startTime;
  },
  displayEnd: function(e) {
    var endTime = this.timeString(
      e.event.endDate._time.hour,
      e.event.endDate._time.minute
    );
    return "End Time: " + endTime;
  },
  displayDuration: function(e) {
    var duration = e.event.duration,
      days = duration.days,
      hours = duration.hours,
      minutes = duration.minutes,
      weeks = duration.weeks;
    if (0 == hours && 0 == minutes && 1 == days) {
      return "Duration: All Day";
    }
    if (0 == days) {
      if (0 == hours) {
        if (0 == minutes) {
          return "Duration: ";
        } else {
          return "Duration: " + minutes + "min";
        }
      } else {
        if (0 == minutes) {
          return "Duration: " + hours + "H ";
        } else {
          return "Duration: " + hours + "H " + minutes + "min ";
        }
      }
    } else {
      if (0 == hours && 0 == minutes) {
        return "Duration: " + days + "Days ";
      } else if (0 < hours && 0 == minutes) {
        return "Duration: " + days + "Days " + hours + "H ";
      } else {
        return "Duration: " + days + "Days " + hours + "H " + minutes + "min ";
      }
    }
  },
  displayDescription: function(e) {
    var description = e.event.description;
    if (!description) {
      return "Description: ";
    }
    return "Description: ";
  },
  displayLocation: function(e) {
    var location = e.event.location;
    location = location + "";
    if (null == location || "null" == location) {
      return "Location: ";
    }
    return "Location: " + location;
  }
});
