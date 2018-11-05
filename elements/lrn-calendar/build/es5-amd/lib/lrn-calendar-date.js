define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../lrn-calendar.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_d2201f80e11a11e894c671420db3b893() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: block;\n      }\n      ::-webkit-scrollbar {\n        width: 0px;  /* remove scrollbar space */\n        background: transparent;  /* optional: just make scrollbar invisible */\n      }\n\n\n      .month {\n        width: 100%;\n        height: 20vh;\n        vertical-align: top;\n        overflow: scroll;\n\n      }\n      .week{\n        width: 100%;\n        height: 40vh;\n        vertical-align: top;\n        overflow: scroll;\n      }\n      .card-content{\n        position: relative;\n        bottom: 10px;\n        white-space: nowrap;\n        font-size: 12px;\n        padding: 0px 5px;\n        line-height: 7px;\n      }\n      .label{\n        width: 100%\n      }\n\n\n    </style>\n    \n      <div id="test">\n        <div>\n          <template is="dom-if" if="[[firstWeek]]">\n            <paper-card class="label">\n            <h3>[[getWeek(date)]]</h3>\n            </paper-card>\n          </template>\n        </div>\n        <paper-card class$="{{view}}" id="dateHeader">\n          \n            <h5> [[getMonth(date)]] </h5>\n          \n          <template is="dom-repeat" items="{{events}}">\n              <div class="card-content">\n                <lrnsys-drawer text="[[timeString(item.event.startDate._time.hour, item.event.startDate._time.minute, item.event.endDate._time.hour,item.event.endDate._time.minute)]] {{item.event.summary}}" header="[[getDateString(date)]]" align="left" heading-class="orange lighten-3 blue-text text-darken-4" style="{{computeStyle(item)}};overflow:auto;">\n                [[displayActivity(item)]] <br><br>[[displayStart(item)]]<br><br>[[displayEnd(item)]]<br><br>[[displayDuration(item)]]<br><br>[[displayDescription(item)]]<br><br>[[displayLocation(item)]]\n                </lrnsys-drawer>\n              </div>\n          </template>\n        </paper-card>\n      </div>\n'
      ],
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: block;\n      }\n      ::-webkit-scrollbar {\n        width: 0px;  /* remove scrollbar space */\n        background: transparent;  /* optional: just make scrollbar invisible */\n      }\n\n\n      .month {\n        width: 100%;\n        height: 20vh;\n        vertical-align: top;\n        overflow: scroll;\n\n      }\n      .week{\n        width: 100%;\n        height: 40vh;\n        vertical-align: top;\n        overflow: scroll;\n      }\n      .card-content{\n        position: relative;\n        bottom: 10px;\n        white-space: nowrap;\n        font-size: 12px;\n        padding: 0px 5px;\n        line-height: 7px;\n      }\n      .label{\n        width: 100%\n      }\n\n\n    </style>\n    \n      <div id="test">\n        <div>\n          <template is="dom-if" if="[[firstWeek]]">\n            <paper-card class="label">\n            <h3>[[getWeek(date)]]</h3>\n            </paper-card>\n          </template>\n        </div>\n        <paper-card class\\$="{{view}}" id="dateHeader">\n          \n            <h5> [[getMonth(date)]] </h5>\n          \n          <template is="dom-repeat" items="{{events}}">\n              <div class="card-content">\n                <lrnsys-drawer text="[[timeString(item.event.startDate._time.hour, item.event.startDate._time.minute, item.event.endDate._time.hour,item.event.endDate._time.minute)]] {{item.event.summary}}" header="[[getDateString(date)]]" align="left" heading-class="orange lighten-3 blue-text text-darken-4" style="{{computeStyle(item)}};overflow:auto;">\n                [[displayActivity(item)]] <br><br>[[displayStart(item)]]<br><br>[[displayEnd(item)]]<br><br>[[displayDuration(item)]]<br><br>[[displayDescription(item)]]<br><br>[[displayLocation(item)]]\n                </lrnsys-drawer>\n              </div>\n          </template>\n        </paper-card>\n      </div>\n'
      ]
    );
    _templateObject_d2201f80e11a11e894c671420db3b893 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d2201f80e11a11e894c671420db3b893()
    ),
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
    getMonth: function getMonth(date) {
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
    getWeek: function getWeek(date) {
      var weekdays = date.getDay();
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekdays];
    },
    timeString: function timeString(
      startHour,
      startMinute,
      endHour,
      endMinute
    ) {
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
    computeStyle: function computeStyle(item) {
      if (0 == item.event.startDate._time.hour)
        var s = "background-color:" + " yellow";
      else var s = "background-color:" + " clear";
      return s;
    },
    getDateString: function getDateString(date) {
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
    displayActivity: function displayActivity(e) {
      var activity = e.event.summary;
      return "Activity: " + activity;
    },
    displayStart: function displayStart(e) {
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
    displayEnd: function displayEnd(e) {
      var endTime = this.timeString(
        e.event.endDate._time.hour,
        e.event.endDate._time.minute
      );
      return "End Time: " + endTime;
    },
    displayDuration: function displayDuration(e) {
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
          return (
            "Duration: " + days + "Days " + hours + "H " + minutes + "min "
          );
        }
      }
    },
    displayDescription: function displayDescription(e) {
      var description = e.event.description;
      if (!description) {
        return "Description: ";
      }
      return "Description: ";
    },
    displayLocation: function displayLocation(e) {
      var location = e.event.location;
      location = location + "";
      if (null == location || "null" == location) {
        return "Location: ";
      }
      return "Location: " + location;
    }
  });
});
