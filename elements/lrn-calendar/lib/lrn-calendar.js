import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/materializecss-styles/colors.js";
import "@polymer/paper-card/paper-card.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "lrnsys-layout/lrnsys-layout.js";
import "lrnsys-layout/lrnsys-drawer.js";
import "lrnsys-layout/lrnsys-dialog.js";
import "lrnsys-layout/lrnsys-collapselist.js";
import "lrnsys-layout/lrnsys-collapselist-item.js";
import "web-animations-js/web-animations-next.min.js";
import "./lrn-calendar-date.js";
import "./i-cal-js.js";
/**
`lrn-calendar`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      lrn-calendar-date {
        display: inline-table;
        top: 0px;
      }
      paper-card {
        width: 14%;
        height: 20px;
        display: inline-table;
        padding: 0;
        margin: 0;
      }
      .calendar {
        color: var(--my-toolbar-title-color);
      }
      .header{
        padding-bottom: 15px;
      }
    </style>

    <div class="calendar">
      <div class="header">
        <div style="float: left">
          <paper-button raised="" type="button" on-tap="monthView">Month</paper-button>
          <paper-button raised="" type="button" on-tap="weekView">Week</paper-button>
        </div>
        <div style="float: right">
          <paper-button raised="" type="button" on-tap="showDate">Today</paper-button>
          <paper-icon-button icon="arrow-back" on-tap="showPrev"></paper-icon-button>
          <paper-icon-button icon="arrow-forward" on-tap="showNext"></paper-icon-button>
        </div>
        <div style="margin: 0 auto; width: 200px; text-align: center">
          <h2>[[getDisplayDate(date)]]</h2>
        </div>
      </div>

      <div class="calendarView" id="calView">
      </div>
    </div>
`,

  is: "lrn-calendar",

  behaviors: [HAXBehaviors.PropertiesBehaviors],

  properties: {
    /**
     * An array of events for display
     */
    listOfEvents: {
      type: Array,
      value: []
    },
    /**
     * Date to start from
     */
    dateString: {
      type: String,
      observer: "_dateStringChanged"
    },
    /**
     * Date to start from
     */
    date: {
      type: Date,
      value: new Date(),
      observer: "_dateChanged"
    },
    /**
     * Type of display, possible values, month, day, week
     */
    view: {
      type: String,
      value: "month",
      observer: "_viewTypeChanged"
    },
    /**
     * ical file to reference to pull in dates.
     */
    file: {
      type: String,
      reflectToAttribute: true,
      observer: "_fileChanged"
    }
  },

  /**
   * Notice the file has changed and attempt to rebind.
   */
  _fileChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.loadFile();
      this.getDateInfo();
      this.createCalendar();
    }
  },

  /**
   * Notice the file has changed and attempt to rebind.
   */
  _viewTypeChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof this.file !== typeof undefined
    ) {
      this.getDateInfo();
      this.createCalendar();
    }
  },

  /**
   * Notice the file has changed and attempt to rebind.
   */
  _dateChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof this.file !== typeof undefined
    ) {
      this.getDateInfo();
      this.createCalendar();
    }
  },

  /**
   * Notice the String of the date has changed and reset the actual date to it
   */
  _dateStringChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue != "") {
      this.date = new Date(newValue);
    }
  },

  /**
   * Attached lifecycle.
   */
  attached: function() {
    // Establish hax properties if they exist
    //this._initializeReader();
    let props = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Calendar",
        description: "Present dates.",
        icon: "icons:today",
        color: "grey",
        groups: ["Date"],
        handles: [
          {
            type: "ical",
            source: "file",
            date: "date"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "file",
            title: "iCal feed",
            description: "Calendar feed to display",
            inputMethod: "textfield",
            icon: "link",
            required: true
          }
        ],
        configure: [
          {
            property: "file",
            title: "iCal feed",
            description: "Calendar feed to display",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "view",
            title: "View calendar in week or month format",
            description: "week or month view",
            inputMethod: "select",
            options: {
              week: "Week",
              month: "Month"
            }
          },
          {
            property: "dateString",
            title: "Date: yyyy/mm/dd",
            description: "Date to display calendar",
            inputMethod: "datepicker"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Load the ical file.
   */
  loadFile: function() {
    this.startIndex = 0;
    this.calendarText = this.readTextFile(this.file);
    this.listOfEvents = this.getEvents(this.date, this.calendarText);
    this.listOfEvents = this.sortByTime(this.listOfEvents);
  },

  /*
  * Is called to show the previous month/week depending on option selected
  */
  showPrev: function() {
    var current;
    this.startIndex = 0;
    if (this.view == "month") {
      if (this.date.getMonth() == 2) {
        if (this.date.getDate() > 28) {
          current = new Date(
            this.date.getFullYear(),
            this.date.getMonth() - 1,
            28
          );
        } else {
          current = new Date(
            this.date.getFullYear(),
            this.date.getMonth() - 1,
            this.date.getDate()
          );
        }
      } else {
        current = new Date(
          this.date.getFullYear(),
          this.date.getMonth() - 1,
          this.date.getDate()
        );
      }
      this.date = current;
    } else {
      var current = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() - 7
      );
      this.date = current;
    }

    this.startMonth = this.date.getMonth() + 1;

    this.getDateInfo();
    this.createCalendar();
  },

  /*
  * Is called to show the next month/week
  */
  showNext: function() {
    var current;
    if (this.view == "month") {
      if (this.date.getMonth() == 11) {
        current = new Date(this.date.getFullYear() + 1, 0, this.date.getDate());
      } else if (this.date.getMonth() == 0) {
        if (this.date.getDate() > 28) {
          current = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            28
          );
        } else {
          current = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            this.date.getDate()
          );
        }
      } else {
        current = new Date(
          this.date.getFullYear(),
          this.date.getMonth() + 1,
          this.date.getDate()
        );
      }
      this.date = current;
    } else {
      var current = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() + 7
      );
      this.date = current;
    }

    this.getDateInfo();
    this.createCalendar();
  },

  /**
   * Is called to show the next month/week
   */
  showDate: function() {
    this.startIndex = 0;
    this.date = new Date();
    this.getDateInfo();
    this.createCalendar();
  },

  //Set the view to month
  monthView: function() {
    this.view = "month";
    this.startIndex = 0;
    this.createCalendar();
  },

  //Set the view to weekly
  weekView: function() {
    this.view = "week";
    this.startIndex = 0;
    this.createCalendar();
  },

  readTextFile: function(file) {
    this.fileNotFound = false;
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          allText = rawFile.responseText;
        } else {
          allText = "Not Found";
        }
      }
    };

    rawFile.send(null);
    this.calendarText = allText;
    return allText;
  },

  /*
  * Determines the view and then calls lrn-calendar-date to 
  * create the individual date blocks
  * Does the math required to get all the days correct. Ex: Oct 31 -> Nov 1
  */
  createCalendar: function() {
    if (this.view != "month") {
      if (this.view != "week") {
        this.view = "month";
      }
    }
    if (!this.date.getFullYear()) {
      this.date = new Date();
    }

    this.getDateInfo();

    this.totalDays = this.numweeks * 7;
    this.calendarText = this.readTextFile(this.file);
    this.calendarView = this.querySelector(".calendarView");

    var days = 1;
    var pastDate = 0;

    //Remove past calendar blocks ************************************
    var elem = Polymer.dom(this.$.calView).node;
    var elemChildren = elem.childNodes;

    while (elemChildren[1]) {
      elem.removeChild(elem.childNodes[1]);
    }
    //*******************************************************************

    //Setup for calendar*******************************************************************

    var initialDayofWeek = this.currentDayofWeek;

    //Determine how many days until the end of the week
    if (this.view == "week") {
      var dayCount = 0;
      while (this.currentDayofWeek + dayCount < 6) {
        dayCount = dayCount + 1;
      }
      this.totalDays = dayCount;
    }
    //Month view Setup
    if (this.view == "month") {
      if (
        this.currentMonth == 1 ||
        this.currentMonth == 3 ||
        this.currentMonth == 5 ||
        this.currentMonth == 7 ||
        this.currentMonth == 8 ||
        this.currentMonth == 10 ||
        this.currentMonth == 12
      ) {
        this.totalDays = 31;
        this.totalDays = this.totalDays - this.startDay + 1;
      } else if (
        this.currentMonth == 4 ||
        this.currentMonth == 6 ||
        this.currentMonth == 9 ||
        this.currentMonth == 11
      ) {
        this.totalDays = 30;
        this.totalDays = this.totalDays - this.startDay + 1;
      } else {
        this.totalDays = 29;
        this.totalDays = this.totalDays - this.startDay;
      }
    }
    //Sets up days before the actual day to display on calendar
    this.newDate = new Date(
      this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
    );
    if (this.view == "month") {
      while (this.currentDate != 1) {
        days = days - 1;

        if (this.currentMonth == 1 && this.currentDate == 1) {
          this.currentYear = this.currentYear - 1;
          this.currentMonth = 12;
          this.currentDate = 31;
          this.newDate = new Date(
            this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
          );
        } else {
          this.currentDate = this.currentDate - 1;

          this.newDate = new Date(
            this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
          );

          if (this.newDate.getDate() != this.currentDate) {
            //31 day months
            if (
              this.currentDate == 0 &&
              (this.currentMonth == 2 ||
                this.currentMonth == 4 ||
                this.currentMonth == 6 ||
                this.currentMonth == 8 ||
                this.currentMonth == 9 ||
                this.currentMonth == 11 ||
                this.currentMonth == 1)
            ) {
              this.newDate = new Date(
                this.currentYear + "/" + (this.currentMonth - 1) + "/" + 31
              );
              this.currentDate = 31;
            }
            //30 day months
            if (
              this.currentDate == 0 &&
              (this.currentMonth == 5 ||
                this.currentMonth == 7 ||
                this.currentMonth == 10 ||
                this.currentMonth == 12)
            ) {
              this.newDate = new Date(
                this.currentYear + "/" + (this.currentMonth - 1) + "/" + 30
              );
              this.currentDate = 30;
            }
            //February
            if (this.currentDate == 0 && this.currentMonth == 3) {
              this.newDate = new Date(this.currentYear + "/" + 2 + "/" + 29);
              this.currentDate = 29;

              if (this.newDate.getMonth() == 2) {
                this.newDate = new Date(this.currentYear + "/" + 2 + "/" + 28);
                this.currentDate = 28;
              }
            }
            this.currentMonth = this.currentMonth - 1;
          }
        }
        if (this.currentDayofWeek == 0 || initialDayofWeek == 0) {
          this.currentDayofWeek = 7;
          initialDayofWeek = -1;
        }
        this.currentDayofWeek = this.currentDayofWeek - 1;
      }
      if (this.currentDayofWeek == 7) {
        this.currentDayofWeek = 0;
      }
    }

    while (this.currentDayofWeek != 0) {
      days = days - 1;

      if (this.currentMonth == 1 && this.currentDate == 1) {
        this.currentYear = this.currentYear - 1;
        this.currentMonth = 12;
        this.currentDate = 31;
        this.newDate = new Date(
          this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
        );
      } else {
        this.currentDate = this.currentDate - 1;
        this.newDate = new Date(
          this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
        );

        if (this.newDate.getDate() != this.currentDate) {
          //31 day months
          if (
            this.currentDate == 0 &&
            (this.currentMonth == 2 ||
              this.currentMonth == 4 ||
              this.currentMonth == 6 ||
              this.currentMonth == 8 ||
              this.currentMonth == 9 ||
              this.currentMonth == 11 ||
              this.currentMonth == 1)
          ) {
            this.newDate = new Date(
              this.currentYear + "/" + (this.currentMonth - 1) + "/" + 31
            );
            this.currentDate = 31;
          }
          //30 day months
          if (
            this.currentDate == 0 &&
            (this.currentMonth == 5 ||
              this.currentMonth == 7 ||
              this.currentMonth == 10 ||
              this.currentMonth == 12)
          ) {
            this.newDate = new Date(
              this.currentYear + "/" + (this.currentMonth - 1) + "/" + 30
            );
            this.currentDate = 30;
          }
          //February
          if (this.currentDate == 0 && this.currentMonth == 3) {
            this.newDate = new Date(this.currentYear + "/" + 2 + "/" + 29);
            this.currentDate = 29;
            if (this.newDate.getMonth() == 2) {
              this.newDate = new Date(this.currentYear + "/" + 2 + "/" + 28);
              this.currentDate = 28;
            }
          }
          this.currentMonth = this.currentMonth - 1;
        }
      }

      this.currentDayofWeek = this.currentDayofWeek - 1;
    }

    //Creates first date element
    var dynamicEl = document.createElement("lrn-calendar-date");
    dynamicEl.date = this.newDate;
    dynamicEl.firstWeek = true;
    dynamicEl.style.width = "14.25%";
    dynamicEl.style.display = "inline-block";
    dynamicEl.id = "date";
    dynamicEl.view = this.view;
    if (
      this.date.getFullYear() === this.newDate.getFullYear() &&
      this.date.getMonth() === this.newDate.getMonth() &&
      this.date.getDate() === this.newDate.getDate()
    ) {
      dynamicEl.loadeddate = true;
    }

    //var eventList = this.getEvents(this.newDate, this.calendarText);

    var eventsOnDay = this.eventCheck(this.listOfEvents, this.newDate);
    var sendEvent = this.createReturn(eventsOnDay);
    dynamicEl.events = sendEvent;

    dynamicEl.valid = true;
    Polymer.dom(this.calendarView).appendChild(dynamicEl);

    var firstWeekCount = 1;
    while (days < this.totalDays) {
      //If 12/31
      if (this.currentMonth == 12 && this.currentDate == 31) {
        this.currentYear = this.currentYear + 1;
        this.currentMonth = 1;
        this.currentDate = 1;
        this.newDay = new Date(
          this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
        );
      } else {
        this.currentDate = this.currentDate + 1;
        this.newDay = new Date(
          this.currentYear + "/" + this.currentMonth + "/" + this.currentDate
        );

        if (this.newDay.getDate() != this.currentDate) {
          if (
            this.currentMonth == 1 ||
            this.currentMonth == 3 ||
            this.currentMonth == 5 ||
            this.currentMonth == 7 ||
            this.currentMonth == 8 ||
            this.currentMonth == 10 ||
            this.currentMonth == 12
          ) {
            this.newDay = new Date(
              this.currentYear + "/" + (this.currentMonth + 1) + "/" + 1
            );
          }
          this.currentDate = 1;
          this.currentMonth = this.currentMonth + 1;
        }
      }
      var dynamicEl = document.createElement("lrn-calendar-date");
      dynamicEl.valid = true;
      dynamicEl.id = "date";
      dynamicEl.date = this.newDay;
      dynamicEl.style.width = "14.25%";
      dynamicEl.style.display = "inline-block";
      dynamicEl.view = this.view;

      if (
        this.date.getFullYear() === this.newDay.getFullYear() &&
        this.date.getMonth() === this.newDay.getMonth() &&
        this.date.getDate() === this.newDay.getDate()
      ) {
        dynamicEl.loadeddate = true;
      }
      var eventsOnDayMain = this.eventCheck(this.listOfEvents, this.newDay);
      var sendEventMain = this.createReturn(eventsOnDayMain);
      dynamicEl.events = sendEventMain;

      if (firstWeekCount < 7) {
        dynamicEl.firstWeek = true;
      }
      firstWeekCount = firstWeekCount + 1;
      dynamicEl.valid = true;

      Polymer.dom(this.calendarView).appendChild(dynamicEl);

      days = days + 1;
      if (days == this.totalDays && this.newDay.getDay() != 6) {
        days = days - 1;
        pastDate = 1;
      }
    }
  },

  /*
  * Get events gets the events that are within the calendar corresponding to the specific event
  * 
  */
  getEvents: function(date, text) {
    if (text == "Not Found") {
      return "";
    }
    var iCalendarData = text;
    var jcalData = ICAL.parse(iCalendarData);
    var vcalendar = new ICAL.Component(jcalData);
    var vevent = vcalendar.getFirstSubcomponent("vevent");
    var vevents = vcalendar.getAllSubcomponents("vevent");

    var displayEvents = vevents.map(vevent => {
      event = new ICAL.Event(vevent);
      return event;
    });
    this.eventArray = [];
    for (var i = 0; i < displayEvents.length; i++) {
      var startDay = this.createDate(displayEvents[i]);
      if (displayEvents[i].isRecurring()) {
        this.createRecurrence(displayEvents[i]);
      }
      this.eventArray.push(displayEvents[i]);
    }

    return this.eventArray;
  },

  /*
  * Determines what type of recurrence is occuring and calls createRepeatedEvent
  * The int in the function call is the max number of recurrences
  */
  createRecurrence: function(events) {
    if (events.getRecurrenceTypes().WEEKLY) {
      this.createRepeatedEvent(events, 156);
    } else if (events.getRecurrenceTypes().DAILY) {
      this.createRepeatedEvent(events, 720);
    } else if (events.getRecurrenceTypes().MONTHLY) {
      this.createRepeatedEvent(events, 36);
    } else if (events.getRecurrenceTypes().YEARLY) {
      this.createRepeatedEvent(events, 10);
    }
  },

  /*
  * Iterates through the recurring event.  Each time it creates a new event.  
  * Currently it sets the summary and description the same since that will not change
  * That will need to be adjusted, only info in new Event is start time, end time, summary, and description
  * The new event is loaded into the array of all the events
  */
  createRepeatedEvent: function(events, maxRepeat) {
    var iter = events.iterator(events.startDate);

    let next;
    let num = 0;
    while ((next = iter.next()) && num++ < maxRepeat) {
      var newTest = new ICAL.Event();

      newTest.summary = events.summary;
      newTest.description = events.description;
      newTest.startDate = events.getOccurrenceDetails(next).startDate;
      newTest.endDate = events.getOccurrenceDetails(next).endDate;
      var locationString = String(events.location);
      newTest.location = locationString;
      if (
        newTest.startDate._time.day != events.startDate._time.day ||
        newTest.startDate._time.month != events.startDate._time.month ||
        newTest.startDate._time.year != events.startDate._time.year
      ) {
        this.eventArray.push(newTest);
      }
    }
    return;
  },

  /*
  * Called from eventCheck, gets the start time of an event and returns it
  */
  createDate: function(event) {
    var year = event.startDate._time.year;
    var month = event.startDate._time.month;
    var day = event.startDate._time.day;
    var eventDate = new Date(year + "/" + month + "/" + day);
    return eventDate;
  },

  /*
  * Check if the event occurs on this date and then includes it in the event array that is returned
  * this.startIndex determines the index of the event array that it should start looking for the events that occur
  * on that day.  This is to increase efficiency to not keep scrolling through the list
  * Once an event is found after the date, it exits the for loop
  * This is all because the event array is sorted by date
  */
  eventCheck: function(events, date) {
    var eventsOnDay = [];
    var end = events.length;
    for (var i = this.startIndex; i < end; i++) {
      var startDay = this.createDate(events[i]);
      if (startDay.getTime() > date.getTime()) {
        end = i;
        if (i != 0) {
          this.startIndex = i - 1;
        }
      }
      if (startDay.getTime() == date.getTime()) {
        eventsOnDay.push(events[i]);
      }
    }
    return eventsOnDay;
  },

  /*
  * Organizes the events on a certain day in order based on start time
  */
  sortByTime: function(eventList) {
    var swapped;
    do {
      swapped = false;
      for (var i = 0; i < eventList.length - 1; i++) {
        if (eventList[i].startDate > eventList[i + 1].startDate) {
          var temp = eventList[i];
          eventList[i] = eventList[i + 1];
          eventList[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
    return eventList;
  },

  getDateInfo: function() {
    this.startMonth = this.date.getMonth() + 1;
    this.startYear = this.date.getFullYear();
    this.startDay = this.date.getDate();
    this.startDayOfWeek = this.date.getDay();
    this.currentDate = this.startDay;
    this.currentMonth = this.startMonth;
    this.currentYear = this.startYear;
    this.currentDayofWeek = this.startDayOfWeek;
    return;
  },

  /*
  * Creates an event array that gets all of the events for that certain day
  */
  createReturn: function(event) {
    var EventArray = [];

    for (var i = 0; i < event.length; i++) {
      EventArray.push({ event: event[i] });
    }
    return EventArray;
  },

  /*
  * Gets the date to display on the header, currently the month and year. Returns it as a String
  */
  getDisplayDate: function(date) {
    if (typeof date.getMonth === "function") {
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
      monthstring = monthsArray[monthInt] + " " + date.getFullYear();
      return monthstring;
    }
    return "";
  }
});
