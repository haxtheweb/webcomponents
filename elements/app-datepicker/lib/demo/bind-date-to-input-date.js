import "../app-datepicker-dialog.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="bind-date-to-input-date">
  <template strip-whitspace="">
    <style>
      :host {
        display: block;
        box-sizing: border-box;
      }

      * {
        box-sizing: border-box;
      }

      .container {
        position: relative;
      }

      paper-button {
        background-color: #4285f4;
        color: #fff;
        margin: 24px;
      }
    </style>

    <div class="container">
      <paper-button raised="" on-tap="openStartDate">[[planDate.startDate]]</paper-button>
      <div>Selected date: [[planDate.startDate]]</div>

      <app-datepicker-dialog id="startDatePicker" date="{{planDate.startDate}}" input-date="[[planDate.startDate]]" with-backdrop=""></app-datepicker-dialog>
    </div>
  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: "bind-date-to-input-date",

  properties: {
    planDate: {
      type: Object,
      value: function() {
        return {
          startDate: "2016/12/01",
          endDate: "2016/12/31"
        };
      },
      observer: "_planDateChanged"
    }
  },

  openStartDate: function() {
    this.$.startDatePicker.open();
  },

  _planDateChanged: function(_newv, _oldv) {
    console.log("plan-date-changed:", _newv, _oldv);
  }
});
