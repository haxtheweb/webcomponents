import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icon/iron-icon.js";
import "../lrn-icons.js";
/**
 * `lrn-icons`
 *
 * @demo index.html
 */
Polymer({
  _template: html`
    <ul>
      <template is="dom-repeat" items="[[iconList]]">
        <li>
          <iron-icon icon\$="lrn:[[item.icon]]"></iron-icon>
          <strong>&lt;iron-icon icon="lrn:[[item.icon]]"&gt;</strong>
        </li>
      </template>
    </ul>
  `,

  is: "lrn-icons-demo",

  ready: function() {
    this.iconList = [
      { icon: "done" },
      { icon: "input" },
      { icon: "about" },
      { icon: "add" },
      { icon: "plus" },
      { icon: "apps" },
      { icon: "network" },
      { icon: "arrow-left" },
      { icon: "arrow-right" },
      { icon: "assignment" },
      { icon: "assignments" },
      { icon: "assessment" },
      { icon: "lab" },
      { icon: "labs" },
      { icon: "beaker" },
      { icon: "blog" },
      { icon: "blogs" },
      { icon: "editorial" },
      { icon: "write" },
      { icon: "bookmark" },
      { icon: "bookmark-outline" },
      { icon: "calendar" },
      { icon: "chevron-down" },
      { icon: "chevron-left" },
      { icon: "chevron-right" },
      { icon: "online" },
      { icon: "cis" },
      { icon: "studio" },
      { icon: "cle" },
      { icon: "close" },
      { icon: "collab" },
      { icon: "comment" },
      { icon: "comply" },
      { icon: "ecd" },
      { icon: "mooc" },
      { icon: "content-outline" },
      { icon: "book" },
      { icon: "courses" },
      { icon: "content" },
      { icon: "dino" },
      { icon: "discuss" },
      { icon: "speechballoons" },
      { icon: "dotgrid" },
      { icon: "download" },
      { icon: "file-download" },
      { icon: "edit" },
      { icon: "media" },
      { icon: "elmsmedia" },
      { icon: "play" },
      { icon: "replay" },
      { icon: "gear" },
      { icon: "settings" },
      { icon: "grades" },
      { icon: "help" },
      { icon: "tour" },
      { icon: "view" },
      { icon: "visible" },
      { icon: "hidden" },
      { icon: "view-off" },
      { icon: "interact" },
      { icon: "icor" },
      { icon: "inbox" },
      { icon: "letter" },
      { icon: "info" },
      { icon: "page" },
      { icon: "pdf" },
      { icon: "people" },
      { icon: "cpr" },
      { icon: "user" },
      { icon: "quiz" },
      { icon: "support" },
      { icon: "teacher" },
      { icon: "instructor" }
    ];
  }
});
