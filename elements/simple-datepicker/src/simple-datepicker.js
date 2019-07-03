/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
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
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      SimpleDatepicker.haxProperties,
      SimpleDatepicker.tag,
      this
    );
  }
  nextMonth() {
    if (this.currentMonth < 12) {
      this.currentMonth++;
    } else {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.updateCalendar();
  }
  prevMonth() {
    if (this.currentMonth > 1) {
      this.currentMonth--;
    } else {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.updateCalendar();
  }
  nextYear() {
    this.currentYear++;
    this.updateCalendar();
  }
  prevYear() {
    this.currentYear--;
    this.updateCalendar();
  }
  updateCalendar() {
    let label = this.shadowRoot.querySelector("#calendarlabel");
    console.log(`${this.currentMonthName} ${this.currentYear}`);
    if (label) label.innerHTML = `${this.currentMonthName} ${this.currentYear}`;
  }
  _getMonthName(currentMonth, monthNames) {
    console.log(
      "_getMonthName",
      monthNames,
      currentMonth,
      monthNames[currentMonth - 1]
    );
    return monthNames[currentMonth - 1];
  }
  _getCurrentDays(currentMonth, currentYear, weekdays) {
    let week = [],
      totalDays = [1, 3, 5, 7, 8, 10, 12].includes(currentMonth)
        ? 31
        : currentMonth !== 2
        ? 30
        : currentYear % 4 === 0 &&
          (currentYear % 100 !== 0 || currentYear % 400 === 0)
        ? 29
        : 28;

    for (let i = 1; i <= totalDays / 7; i++) {
      let days = [];
      for (let j = 1; j <= 7; j++) {
        console.log(i, j);
        days.push({
          date: `${currentMonth}/${j * i}/${currentYear}`,
          dd: j * i
        });
      }
      week.push(days);
    }
    return week;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleDatepicker.tag, SimpleDatepicker);
export { SimpleDatepicker };
