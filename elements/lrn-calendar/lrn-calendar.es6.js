import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import{pathFromUrl}from"./node_modules/@polymer/polymer/lib/utils/resolve-url.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";/**
 * `lrn-calendar`
 * @demo demo/index.html
 */class LrnCalendar extends PolymerElement{static get template(){return html`
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
      .header {
        padding-bottom: 15px;
      }
    </style>

    <div class="calendar">
      <div class="header">
        <div style="float: left">
          <paper-button raised type="button" on-tap="monthView"
            >Month</paper-button
          >
          <paper-button raised type="button" on-tap="weekView"
            >Week</paper-button
          >
        </div>
        <div style="float: right">
          <paper-button raised type="button" on-tap="showDate"
            >Today</paper-button
          >
          <paper-button on-tap="showPrev"
            ><iron-icon icon="arrow-back"></iron-icon
          ></paper-button>
          <paper-button on-tap="showNext"
            ><iron-icon icon="arrow-forward"></iron-icon
          ></paper-button>
        </div>
        <div style="margin: 0 auto; width: 200px; text-align: center">
          <h2>[[getDisplayDate(date)]]</h2>
        </div>
      </div>

      <div class="calendarView" id="calView"></div>
    </div>
  `}static get tag(){return"lrn-calendar"}static get properties(){return{/**
       * An array of events for display
       */listOfEvents:{type:Array,value:[]},/**
       * Date to start from
       */dateString:{type:String,observer:"_dateStringChanged"},/**
       * Date to start from
       */date:{type:Date,value:new Date,observer:"_dateChanged"},/**
       * Type of display, possible values, month, day, week
       */view:{type:String,value:"month",observer:"_viewTypeChanged"},/**
       * ical file to reference to pull in dates.
       */file:{type:String,reflectToAttribute:!0,observer:"_fileChanged"}}}/**
   * Notice the file has changed and attempt to rebind.
   */_fileChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&this.__icalLoaded){this.loadFile();this.getDateInfo();this.createCalendar()}}/**
   * Notice the file has changed and attempt to rebind.
   */_viewTypeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&typeof this.file!==typeof void 0&&this.__icalLoaded){this.getDateInfo();this.createCalendar()}}/**
   * Notice the file has changed and attempt to rebind.
   */_dateChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&typeof this.file!==typeof void 0&&this.__icalLoaded){this.getDateInfo();this.createCalendar()}}/**
   * Notice the String of the date has changed and reset the actual date to it
   */_dateStringChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&""!=newValue&&this.__icalLoaded){this.date=new Date(newValue)}}/**
   * created life cycle
   */constructor(){super();import("./node_modules/@polymer/paper-button/paper-button.js");import("./node_modules/@polymer/iron-icons/iron-icons.js");import("./node_modules/@polymer/iron-icon/iron-icon.js");import("./node_modules/@polymer/paper-card/paper-card.js");import("./node_modules/@polymer/paper-menu-button/paper-menu-button.js");import("./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js");import("./node_modules/@lrnwebcomponents/lrnsys-layout/lrnsys-layout.js");import("./node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-drawer.js");import("./node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js");import("./node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-collapselist.js");import("./node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-collapselist-item.js");import("./node_modules/@lrnwebcomponents/lrn-calendar/lib/lrn-calendar-date.js");afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(LrnCalendar.haxProperties,LrnCalendar.tag,this)});const basePath=pathFromUrl(decodeURIComponent(import.meta.url)),location=`${basePath}lib/ical.js/build/ical.js`;window.addEventListener("es-bridge-ical-loaded",this._icalLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("ical",location)}disconnectedCallback(){super.disconnectedCallback();window.removeEventListener("es-bridge-ical-loaded",this._icalLoaded.bind(this))}/**
   * ical loaded
   */_icalLoaded(){this.__icalLoaded=!0;if(typeof this.file!==typeof void 0){this.loadFile()}}/**
   * Attached lifecycle.
   */static get haxProperties(){return{canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Calendar",description:"Present dates.",icon:"icons:today",color:"grey",groups:["Date"],handles:[{type:"ical",source:"file",date:"date"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"file",title:"iCal feed",description:"Calendar feed to display",inputMethod:"textfield",icon:"link",required:!0}],configure:[{property:"file",title:"iCal feed",description:"Calendar feed to display",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"view",title:"View calendar in week or month format",description:"week or month view",inputMethod:"select",options:{week:"Week",month:"Month"}},{property:"dateString",title:"Date: yyyy/mm/dd",description:"Date to display calendar",inputMethod:"datepicker"}],advanced:[]}}}/**
   * Load the ical file.
   */loadFile(){this.startIndex=0;this.calendarText=this.readTextFile(this.file);this.listOfEvents=this.getEvents(this.date,this.calendarText);this.listOfEvents=this.sortByTime(this.listOfEvents)}/*
   * Is called to show the previous month/week depending on option selected
   */showPrev(){var current;this.startIndex=0;if("month"==this.view){if(2==this.date.getMonth()){if(28<this.date.getDate()){current=new Date(this.date.getFullYear(),this.date.getMonth()-1,28)}else{current=new Date(this.date.getFullYear(),this.date.getMonth()-1,this.date.getDate())}}else{current=new Date(this.date.getFullYear(),this.date.getMonth()-1,this.date.getDate())}this.date=current}else{var current=new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate()-7);this.date=current}this.startMonth=this.date.getMonth()+1;this.getDateInfo();this.createCalendar()}/*
   * Is called to show the next month/week
   */showNext(){var current;if("month"==this.view){if(11==this.date.getMonth()){current=new Date(this.date.getFullYear()+1,0,this.date.getDate())}else if(0==this.date.getMonth()){if(28<this.date.getDate()){current=new Date(this.date.getFullYear(),this.date.getMonth()+1,28)}else{current=new Date(this.date.getFullYear(),this.date.getMonth()+1,this.date.getDate())}}else{current=new Date(this.date.getFullYear(),this.date.getMonth()+1,this.date.getDate())}this.date=current}else{var current=new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate()+7);this.date=current}this.getDateInfo();this.createCalendar()}/**
   * Is called to show the next month/week
   */showDate(){this.startIndex=0;this.date=new Date;this.getDateInfo();this.createCalendar()}//Set the view to month
monthView(){this.view="month";this.startIndex=0;this.createCalendar()}//Set the view to weekly
weekView(){this.view="week";this.startIndex=0;this.createCalendar()}readTextFile(file){this.fileNotFound=!1;var rawFile=new XMLHttpRequest,allText="";rawFile.open("GET",file,!1);rawFile.onreadystatechange=function(){if(4===rawFile.readyState){if(200===rawFile.status||0==rawFile.status){allText=rawFile.responseText}else{allText="Not Found"}}};rawFile.send(null);this.calendarText=allText;return allText}/*
   * Determines the view and then calls lrn-calendar-date to
   * create the individual date blocks
   * Does the math required to get all the days correct. Ex: Oct 31 -> Nov 1
   */createCalendar(){if("month"!=this.view){if("week"!=this.view){this.view="month"}}if(!this.date.getFullYear()){this.date=new Date}this.getDateInfo();this.totalDays=7*this.numweeks;this.calendarText=this.readTextFile(this.file);this.calendarView=this.shadowRoot.querySelector("#calView");var days=1,pastDate=0,elem=dom(this.shadowRoot.querySelector("#calView")).node,elemChildren=elem.childNodes;while(elemChildren[1]){elem.removeChild(elem.childNodes[1])}//*******************************************************************
//Setup for calendar*******************************************************************
var initialDayofWeek=this.currentDayofWeek;//Determine how many days until the end of the week
if("week"==this.view){var dayCount=0;while(6>this.currentDayofWeek+dayCount){dayCount=dayCount+1}this.totalDays=dayCount}//Month view Setup
if("month"==this.view){if(1==this.currentMonth||3==this.currentMonth||5==this.currentMonth||7==this.currentMonth||8==this.currentMonth||10==this.currentMonth||12==this.currentMonth){this.totalDays=31;this.totalDays=this.totalDays-this.startDay+1}else if(4==this.currentMonth||6==this.currentMonth||9==this.currentMonth||11==this.currentMonth){this.totalDays=30;this.totalDays=this.totalDays-this.startDay+1}else{this.totalDays=29;this.totalDays=this.totalDays-this.startDay}}//Sets up days before the actual day to display on calendar
this.newDate=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate);if("month"==this.view){while(1!=this.currentDate){days=days-1;if(1==this.currentMonth&&1==this.currentDate){this.currentYear=this.currentYear-1;this.currentMonth=12;this.currentDate=31;this.newDate=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate)}else{this.currentDate=this.currentDate-1;this.newDate=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate);if(this.newDate.getDate()!=this.currentDate){//31 day months
if(0==this.currentDate&&(2==this.currentMonth||4==this.currentMonth||6==this.currentMonth||8==this.currentMonth||9==this.currentMonth||11==this.currentMonth||1==this.currentMonth)){this.newDate=new Date(this.currentYear+"/"+(this.currentMonth-1)+"/"+31);this.currentDate=31}//30 day months
if(0==this.currentDate&&(5==this.currentMonth||7==this.currentMonth||10==this.currentMonth||12==this.currentMonth)){this.newDate=new Date(this.currentYear+"/"+(this.currentMonth-1)+"/"+30);this.currentDate=30}//February
if(0==this.currentDate&&3==this.currentMonth){this.newDate=new Date(this.currentYear+"/"+2+"/"+29);this.currentDate=29;if(2==this.newDate.getMonth()){this.newDate=new Date(this.currentYear+"/"+2+"/"+28);this.currentDate=28}}this.currentMonth=this.currentMonth-1}}if(0==this.currentDayofWeek||0==initialDayofWeek){this.currentDayofWeek=7;initialDayofWeek=-1}this.currentDayofWeek=this.currentDayofWeek-1}if(7==this.currentDayofWeek){this.currentDayofWeek=0}}while(0!=this.currentDayofWeek){days=days-1;if(1==this.currentMonth&&1==this.currentDate){this.currentYear=this.currentYear-1;this.currentMonth=12;this.currentDate=31;this.newDate=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate)}else{this.currentDate=this.currentDate-1;this.newDate=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate);if(this.newDate.getDate()!=this.currentDate){//31 day months
if(0==this.currentDate&&(2==this.currentMonth||4==this.currentMonth||6==this.currentMonth||8==this.currentMonth||9==this.currentMonth||11==this.currentMonth||1==this.currentMonth)){this.newDate=new Date(this.currentYear+"/"+(this.currentMonth-1)+"/"+31);this.currentDate=31}//30 day months
if(0==this.currentDate&&(5==this.currentMonth||7==this.currentMonth||10==this.currentMonth||12==this.currentMonth)){this.newDate=new Date(this.currentYear+"/"+(this.currentMonth-1)+"/"+30);this.currentDate=30}//February
if(0==this.currentDate&&3==this.currentMonth){this.newDate=new Date(this.currentYear+"/"+2+"/"+29);this.currentDate=29;if(2==this.newDate.getMonth()){this.newDate=new Date(this.currentYear+"/"+2+"/"+28);this.currentDate=28}}this.currentMonth=this.currentMonth-1}}this.currentDayofWeek=this.currentDayofWeek-1}// Creates first date element
var dynamicEl=document.createElement("lrn-calendar-date");dynamicEl.date=this.newDate;dynamicEl.firstWeek=!0;dynamicEl.style.width="14.25%";dynamicEl.style.display="inline-block";dynamicEl.setAttribute("id","date");dynamicEl.view=this.view;if(this.date.getFullYear()===this.newDate.getFullYear()&&this.date.getMonth()===this.newDate.getMonth()&&this.date.getDate()===this.newDate.getDate()){dynamicEl.loadeddate=!0}//var eventList = this.getEvents(this.newDate, this.calendarText);
var eventsOnDay=this.eventCheck(this.listOfEvents,this.newDate),sendEvent=this.createReturn(eventsOnDay);dynamicEl.events=sendEvent;dynamicEl.valid=!0;dom(this.calendarView).appendChild(dynamicEl);var firstWeekCount=1;while(days<this.totalDays){//If 12/31
if(12==this.currentMonth&&31==this.currentDate){this.currentYear=this.currentYear+1;this.currentMonth=1;this.currentDate=1;this.newDay=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate)}else{this.currentDate=this.currentDate+1;this.newDay=new Date(this.currentYear+"/"+this.currentMonth+"/"+this.currentDate);if(this.newDay.getDate()!=this.currentDate){if(1==this.currentMonth||3==this.currentMonth||5==this.currentMonth||7==this.currentMonth||8==this.currentMonth||10==this.currentMonth||12==this.currentMonth){this.newDay=new Date(this.currentYear+"/"+(this.currentMonth+1)+"/"+1)}this.currentDate=1;this.currentMonth=this.currentMonth+1}}var dynamicEl=document.createElement("lrn-calendar-date");dynamicEl.valid=!0;dynamicEl.setAttribute("id","date");dynamicEl.date=this.newDay;dynamicEl.style.width="14.25%";dynamicEl.style.display="inline-block";dynamicEl.view=this.view;if(this.date.getFullYear()===this.newDay.getFullYear()&&this.date.getMonth()===this.newDay.getMonth()&&this.date.getDate()===this.newDay.getDate()){dynamicEl.loadeddate=!0}var eventsOnDayMain=this.eventCheck(this.listOfEvents,this.newDay),sendEventMain=this.createReturn(eventsOnDayMain);dynamicEl.events=sendEventMain;if(7>firstWeekCount){dynamicEl.firstWeek=!0}firstWeekCount=firstWeekCount+1;dynamicEl.valid=!0;dom(this.calendarView).appendChild(dynamicEl);days=days+1;if(days==this.totalDays&&6!=this.newDay.getDay()){days=days-1;pastDate=1}}}/*
   * Get events gets the events that are within the calendar corresponding to the specific event
   *
   */getEvents(date,text){if("Not Found"==text){return""}var iCalendarData=text,jcalData=ICAL.parse(iCalendarData),vcalendar=new ICAL.Component(jcalData),vevent=vcalendar.getFirstSubcomponent("vevent"),vevents=vcalendar.getAllSubcomponents("vevent"),displayEvents=vevents.map(vevent=>{event=new ICAL.Event(vevent);return event});this.eventArray=[];for(var i=0,startDay;i<displayEvents.length;i++){startDay=this.createDate(displayEvents[i]);if(displayEvents[i].isRecurring()){this.createRecurrence(displayEvents[i])}this.eventArray.push(displayEvents[i])}return this.eventArray}/*
   * Determines what type of recurrence is occuring and calls createRepeatedEvent
   * The int in the function call is the max number of recurrences
   */createRecurrence(events){if(events.getRecurrenceTypes().WEEKLY){this.createRepeatedEvent(events,156)}else if(events.getRecurrenceTypes().DAILY){this.createRepeatedEvent(events,720)}else if(events.getRecurrenceTypes().MONTHLY){this.createRepeatedEvent(events,36)}else if(events.getRecurrenceTypes().YEARLY){this.createRepeatedEvent(events,10)}}/*
   * Iterates through the recurring event.  Each time it creates a new event.
   * Currently it sets the summary and description the same since that will not change
   * That will need to be adjusted, only info in new Event is start time, end time, summary, and description
   * The new event is loaded into the array of all the events
   */createRepeatedEvent(events,maxRepeat){var iter=events.iterator(events.startDate);let next,num=0;while((next=iter.next())&&num++<maxRepeat){var newTest=new ICAL.Event;newTest.summary=events.summary;newTest.description=events.description;newTest.startDate=events.getOccurrenceDetails(next).startDate;newTest.endDate=events.getOccurrenceDetails(next).endDate;var locationString=events.location+"";newTest.location=locationString;if(newTest.startDate._time.day!=events.startDate._time.day||newTest.startDate._time.month!=events.startDate._time.month||newTest.startDate._time.year!=events.startDate._time.year){this.eventArray.push(newTest)}}return}/*
   * Called from eventCheck, gets the start time of an event and returns it
   */createDate(event){var year=event.startDate._time.year,month=event.startDate._time.month,day=event.startDate._time.day,eventDate=new Date(year+"/"+month+"/"+day);return eventDate}/*
   * Check if the event occurs on this date and then includes it in the event array that is returned
   * this.startIndex determines the index of the event array that it should start looking for the events that occur
   * on that day.  This is to increase efficiency to not keep scrolling through the list
   * Once an event is found after the date, it exits the for loop
   * This is all because the event array is sorted by date
   */eventCheck(events,date){for(var eventsOnDay=[],end=events.length,i=this.startIndex,startDay;i<end;i++){startDay=this.createDate(events[i]);if(startDay.getTime()>date.getTime()){end=i;if(0!=i){this.startIndex=i-1}}if(startDay.getTime()==date.getTime()){eventsOnDay.push(events[i])}}return eventsOnDay}/*
   * Organizes the events on a certain day in order based on start time
   */sortByTime(eventList){var swapped;do{swapped=!1;for(var i=0;i<eventList.length-1;i++){if(eventList[i].startDate>eventList[i+1].startDate){var temp=eventList[i];eventList[i]=eventList[i+1];eventList[i+1]=temp;swapped=!0}}}while(swapped);return eventList}getDateInfo(){this.startMonth=this.date.getMonth()+1;this.startYear=this.date.getFullYear();this.startDay=this.date.getDate();this.startDayOfWeek=this.date.getDay();this.currentDate=this.startDay;this.currentMonth=this.startMonth;this.currentYear=this.startYear;this.currentDayofWeek=this.startDayOfWeek;return}/*
   * Creates an event array that gets all of the events for that certain day
   */createReturn(event){for(var EventArray=[],i=0;i<event.length;i++){EventArray.push({event:event[i]})}return EventArray}/*
   * Gets the date to display on the header, currently the month and year. Returns it as a String
   */getDisplayDate(date){if("function"===typeof date.getMonth){var monthInt=date.getMonth(),day=date.getDate(),monthsArray=["January","February","March","April","May","June","July","August","September","October","November","December"];return monthsArray[monthInt]+" "+date.getFullYear()}return""}}window.customElements.define(LrnCalendar.tag,LrnCalendar);export{LrnCalendar};