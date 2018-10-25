import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "./shared-style.js";
import "./step-style.js";
import "./syntax-style.js";
import "google-prettify/src/prettify.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="lrndesign-contentsequencer-step">
  <template strip-whitespace="">
    <style include="shared-style"></style>
    <style include="step-style"></style>
    <style include="syntax-style"></style>

    <div class="instructions">
      <div class="inner">
        <h2 id="title"><span>{{step}}</span>. <span>{{label}}</span></h2>
        <slot></slot>
      </div>
    </div>
  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);

function encodeHTMLEntities_(htmlStr) {
  return htmlStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Polymer({
  is: "lrndesign-contentsequencer-step",

  /**
   * Fired when user copies a snippet into the clipboard.
   * Not all browsers are supported. See http://caniuse.com/#feat=clipboard.
   * @event lrndesign-contentsequencer-snippet-copy
   * @detail {{snippet: String}}
   */

  properties: {
    /**
     * Step number, starting from 1.
     * Normally set by the parent `<lrndesign-contentsequencer>` element.
     */
    step: {
      type: Number,
      value: 1,
      notify: true
    },

    /**
     * Title of this step.
     */
    label: {
      type: String,
      value: ""
    },

    /**
     * How long, on average, it takes to complete the step.
     */
    duration: {
      type: Number,
      value: 0,
      notify: true
    },

    /**
     * Indicates whether this step is currently showing.
     * Normally set by the parent `<lrndesign-contentsequencer>` element.
     */
    active: {
      type: Boolean,
      value: false,
      observer: "_activeChanged"
    }
  },

  _isHighlighted: false,

  _activeChanged: function() {
    var contentsequencer = dom(this).parentNode;

    // Don't syntax highlight code if lrndesign-contentsequencer requests it.
    if (
      contentsequencer.localName === "lrndesign-contentsequencer" &&
      contentsequencer.noHighlight
    ) {
      return;
    }

    if (this.active && !this._isHighlighted) {
      // Minimize jank by waiting one click to do syntax highlighting.
      async.microTask.run(() => {
        var blocks = dom(this).querySelectorAll("pre > code");
        blocks.forEach(
          function(block) {
            // TODO: consider pre-escaping markup on server.
            dom(block).innerHTML = prettyPrintOne(
              encodeHTMLEntities_(block.textContent)
            );

            block.addEventListener(
              "copy",
              function() {
                this.fire("lrndesign-contentsequencer-snippet-copy", {
                  snippet: block.textContent
                });
              }.bind(this)
            );
          }.bind(this)
        );

        this._isHighlighted = true;
      });
    }
  }
});
