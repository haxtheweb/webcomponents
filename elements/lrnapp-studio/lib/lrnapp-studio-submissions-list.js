import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "../lrnapp-studio-submission/lrnapp-studio-submission.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <template is="dom-repeat" items="[[submissions]]" as="submission">
      <lrnapp-studio-submission title="[[submission.title]]" author="[[submission.author]]" images="[[submission.images]]" links="[[submission.links]]" text="[[submission.text]]" attachments="[[submission.attachments]]" post_date="[[submission.post_date]]"></lrnapp-studio-submission>
    </template>
`,

  is: "lrnapp-studio-submissions-list",

  properties: {
    submissions: {
      type: Object,
      value: [
        {
          title: "Discover: Photos",
          images: [
            "https://unsplash.it/400x600",
            "https://unsplash.it/700x200",
            "https://unsplash.it/700x300",
            "https://unsplash.it/500x200",
            "https://unsplash.it/700x200"
          ],
          links: "",
          author: "Bill Billerson",
          post_date: "1/20/2020",
          attachments: "",
          text:
            "Emmentaler or Emmental is a yellow, medium-hard cheese that originated in the area around Emmental, Switzerland. It is one of the cheeses of Switzerland, and is sometimes known as Swiss cheese.",
          assignment: 1,
          project: 1
        },
        {
          title: "Define: How might we...",
          images: [""],
          links: ["google.com", "cnn.com"],
          author: "Bill Billerson",
          post_date: "4/20/2020",
          attachments: ["some-file.pdf", "yee_old_project_file.zip"],
          text:
            "How might we make really cool web components so that we can teach courses?",
          assignment: 1,
          project: 1
        },
        {
          title: "Develop: Prototype",
          images: [
            "https://unsplash.it/900x600",
            "https://unsplash.it/780x200"
          ],
          links: ["google.com", "cnn.com"],
          author: "Bill Billerson",
          post_date: "5/10/2020",
          attachments: ["some-file.pdf", "yee_old_project_file.zip"],
          text:
            "Emmentaler or Emmental is a yellow, medium-hard cheese that originated in the area around Emmental, Switzerland. It is one of the cheeses of Switzerland, and is sometimes known as Swiss cheese.",
          assignment: 1,
          project: 1
        },
        {
          title: "Deliver: Polymer App",
          images: [
            "https://unsplash.it/500x600",
            "https://unsplash.it/800x500"
          ],
          links: ["google.com", "cnn.com"],
          author: "Bill Billerson",
          post_date: "7/04/2020",
          attachments: ["some-file.pdf", "yee_old_project_file.zip"],
          text:
            "Emmentaler or Emmental is a yellow, medium-hard cheese that originated in the area around Emmental, Switzerland. It is one of the cheeses of Switzerland, and is sometimes known as Swiss cheese.",
          assignment: 1,
          project: 1
        }
      ]
    }
  }
});
