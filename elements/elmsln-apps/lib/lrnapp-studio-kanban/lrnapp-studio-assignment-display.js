<link rel="import" href="../../bower_components/polymer/polymer.html">
<link rel="import" href="../../bower_components/marked-element/marked-element.html">
<dom-module id="lrnapp-studio-assignment-display">
  <template>
    <style>
      :host {
        display: block;
        padding: 1em;
      }

      #assignment-body {
        font-size: 1.3em;
      }
    </style>
    <h1>[[assignment.attributes.title]]</h1>
    <marked-element id="assignment-body" markdown="[[assignment.attributes.body]]"></marked-element>
  </template>
  <script>
    Polymer({
      is: 'lrnapp-studio-assignment-display',
      properties: {
        assignment: {
          type: Object
        }
      }
    });
  </script>
</dom-module>
