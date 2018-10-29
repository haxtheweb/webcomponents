import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-card/paper-card.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@lrnwebcomponents/paper-contact/paper-contact.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-card image="[[image]]">
  <div class="card-content">
    <div class="cafe-header">[[instructorName]]
    </div>
    <p>Contact Me:<br>
 <paper-contact-list>    
    <paper-contact-address latitude="51.5287718" longitude="-0.2416798">[[address]]</paper-contact-address>
    <paper-contact-email>[[email]]</paper-contact-email>
    <paper-contact-phone>[[phone]]</paper-contact-phone>
    <paper-contact-mobile>[[phone]]</paper-contact-mobile>
</paper-contact-list>
    </p><p><slot></slot></p>
      <p><iron-icon icon="icons:query-builder"></iron-icon> Office Hours: </p>
      [[officeHours]]
      <p><a href="mailto:[[email]]">
  <paper-button raised=""><iron-icon icon="icons:today"></iron-icon> Schedule Appointment</paper-button>
</a></p>
<p>Social
<paper-contact-list style="width: 300px;">
    <paper-contact-linkedin>[[linkedin]]</paper-contact-linkedin>
    <paper-contact-twitter>[[twitter]]</paper-contact-twitter>
    <paper-contact-skype>[[videoConf]]</paper-contact-skype>
</paper-contact-list>
</p>
</div>
</paper-card>
`,
  is: "lrndesign-biocard",
  properties: {
    title: { type: String, value: "lrndesign-biocard" },
    image: { type: String, value: "" },
    instructorName: { type: String, value: "" },
    address: { type: String, value: "" },
    phone: { type: String, value: "" },
    email: { type: String, value: "" },
    officeHours: { type: String, value: "" },
    linkedin: { type: String, value: "" },
    twitter: { type: String, value: "" },
    videoConf: { type: String, value: "" }
  }
});
