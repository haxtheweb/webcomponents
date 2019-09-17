/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/av-icons.js";
/**
 * `simple-datepicker`
 * `a simple datepicker field`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleDatepicker extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-datepicker";
  }
  nextMonth() {
    let date = new Date(this.__calendarDate),
      month = date.getMonth(),
      year = date.getFullYear();
    if (month < 11) {
      date.setMonth(month + 1);
    } else {
      date.setMonth(0);
      date.setYear(year + 1);
    }
    this.__calendarDate = date.toString();
  }
  prevMonth() {
    let date = new Date(this.__calendarDate),
      month = date.getMonth(),
      year = date.getFullYear();
    if (month > 0) {
      date.setMonth(month - 1);
    } else {
      date.setMonth(11);
      date.setYear(year - 1);
    }
    this.__calendarDate = date.toString();
  }
  nextYear() {
    let date = new Date(this.__calendarDate),
      year = date.getFullYear();
    date.setYear(year + 1);
    this.__calendarDate = date.toString();
  }
  prevYear() {
    let date = new Date(this.__calendarDate),
      year = date.getFullYear();
    date.setYear(year - 1);
    this.__calendarDate = date.toString();
  }
  updateCalendar(__calendarDate) {
    let label = this.shadowRoot
        ? this.shadowRoot.querySelector("#calendarlabel > p")
        : null,
      date = new Date(__calendarDate),
      month = this.monthNames[date.getMonth()],
      year = date.getFullYear();
    if (label) label.innerHTML = `${month} ${year}`;
    return `${month} ${year}`;
  }
  _getCalendarDate(value) {
    let date = value ? new Date(value) : new Date();
    this.updateCalendar(date);
    return date.toString();
  }
  _getCalendar(__calendarDate) {
    let first = new Date(__calendarDate),
      last = new Date(__calendarDate),
      weeks = [],
      start,
      end,
      cells,
      rows;
    first.setDate(1);
    last.setDate(0);
    start = first.getDay();
    end = 6 - last.getDay();
    cells = start + end + last.getDate();
    rows = cells / 7;
    for (let i = 0; i < rows - 1; i++) {
      weeks[i] = [];
      for (let j = 0; j < 7; j++) {
        let cell = j + i * 7,
          day = 1 + cell - start;
        weeks[i][j] = day < 0 || day > last.getDate() ? false : day;
      }
    }
    return weeks;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleDatepicker.tag, SimpleDatepicker);
export { SimpleDatepicker };
