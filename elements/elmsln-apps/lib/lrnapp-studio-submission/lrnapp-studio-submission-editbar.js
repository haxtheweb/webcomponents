<link rel="import" href="../../bower_components/paper-tooltip/paper-tooltip.html">
<script type="module" src="./lrnapp-studio-submission-editbar-message.js"></script>

<dom-module id="lrnapp-studio-submission-editbar">
  <template>
    <style>
       :host {
        display: block;
      }
    </style>

    <paper-tooltip position="top" animation-delay="0" offset="-20">
      <slot name="lrnapp-studio-submission-editbar-message"></slot>
    </paper-tooltip>
    <slot></slot>

  </template>
  <script type="module">
import './lrnapp-studio-submission-editbar-message.js';
Polymer({
  is: 'lrnapp-studio-submission-editbar'
});
</script>
</dom-module>