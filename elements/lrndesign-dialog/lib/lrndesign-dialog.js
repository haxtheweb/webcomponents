import "@polymer/polymer/polymer.js";
import "@polymer/paper-dialog-behavior/paper-dialog-behavior.js";
import "@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js";

Polymer({
  _template: `
    <style include="paper-dialog-shared-styles"></style>
    <content></content>
`,

  is: "lrndesign-dialog",

  behaviors: [Polymer.PaperDialogBehavior]
});
