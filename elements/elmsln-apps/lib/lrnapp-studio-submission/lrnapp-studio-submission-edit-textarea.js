Polymer({
  _template: `
    <style>
       :host {
        display: block;
      }
    </style>

    <lrn-markdown-editor content="{{content}}"></lrn-markdown-editor>
`,

  is: 'lrnapp-studio-submission-edit-textarea',

  properties: {
    content: {
      type: String,
      notify: true
    }
  }
});
