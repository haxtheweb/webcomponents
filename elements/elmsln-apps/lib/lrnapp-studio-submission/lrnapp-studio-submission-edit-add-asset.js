Polymer({
  _template: html`
    <style>
      :host {
        cursor: pointer;
      }

      :host([display="box"]) {
        display: block;
        width: 200px;
        height: 200px;
        background: lightgray;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative
      }

      :host([display="pill"]) {
        display: block;
        background: lightgray;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      iron-icon {
        color: gray;
        --iron-icon-height: 50px;
        --iron-icon-width: 50px;
      }

      :host([display="pill"]) iron-icon {
        --iron-icon-height: 50px;
        --iron-icon-width: 50px;
      }
    </style>

    <paper-button>
      <iron-icon icon="[[icon]]"></iron-icon>
      <paper-ripple></paper-ripple>
    </paper-button>
`,

  is: 'lrnapp-studio-submission-edit-add-asset',

  properties: {
    icon: {
      type: String,
      value: 'add'
    },
    /**
     * Change the display of the add asset element
     *
     * @type String Options: 'box', 'pill'
     */
    display: {
      type: String,
      value: 'box',
      reflectToAttribute: true
    }
  }
});
