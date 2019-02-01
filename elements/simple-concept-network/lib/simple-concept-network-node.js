import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
`simple-concept-network-node`
A small but effective little data visualizer for topics surrounding
a central concept, much like the ELMS:LN snowflake icon.

* @demo demo/index.html

@microcopy - the mental model for this element
 - ELMS:LN - The ELMS: Learning Network "snowflake" is a network diagram

*/
Polymer({
  _template: html`
    <style include="simple-colors">
      :host {
        display: inline-flex;
        --simple-concept-network-color: var(
          --simple-colors-default-theme-grey-12
        );
        --simple-concept-network-bg: var(
          --simple-colors-default-theme-accent-5
        );
      }
      :host([colored-text]) {
        --simple-concept-network-bg: var(--simple-colors-default-theme-grey-1);
        --simple-concept-network-color: var(
          --simple-colors-default-theme-accent-8
        );
      }
      paper-button {
        -webkit-transition: 0.6s transform ease-in-out;
        transition: 0.6s transform ease-in-out;
        -webkit-clip-path: polygon(
          50% 0%,
          100% 25%,
          100% 75%,
          50% 100%,
          0% 75%,
          0% 25%
        );
        clip-path: polygon(
          50% 0%,
          100% 25%,
          100% 75%,
          50% 100%,
          0% 75%,
          0% 25%
        );
        color: var(--simple-concept-network-color);
      }
      :host([visualization="network"]) paper-button:hover,
      :host([visualization="network"]) paper-button:focus {
        opacity: 0.8;
      }
      :host([visualization="3d"]) paper-button {
        -webkit-transform: perspective(600px) rotateX(60deg);
        -moz-transform: perspective(600px) rotateX(60deg);
        -ms-transform: perspective(600px) rotateX(60deg);
        -o-transform: perspective(600px) rotateX(60deg);
        transform: perspective(600px) rotateX(60deg);
      }
      :host([visualization="3d"]) paper-button:hover,
      :host([visualization="3d"]) paper-button:focus {
        transform: perspective(0px) rotateX(0deg);
      }
      iron-icon {
        width: 50px;
        height: 50px;
        margin: 1px 19px;
        z-index: 3;
        color: var(--simple-concept-network-color);
      }
      .hexagon {
        position: relative;
        width: 88px;
        height: 50.81px;
        margin: 25.4px 0;
        background-size: auto 101.6136px;
        background-position: center;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
        background-color: var(--simple-concept-network-bg);
      }

      .hexTop,
      .hexBottom {
        position: absolute;
        z-index: 1;
        width: 62.23px;
        height: 62.23px;
        overflow: hidden;
        -webkit-transform: scaleY(0.5774) rotate(-45deg);
        -ms-transform: scaleY(0.5774) rotate(-45deg);
        transform: scaleY(0.5774) rotate(-45deg);
        background: inherit;
        left: 12.89px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
      }

      /*counter transform the bg image on the caps*/
      .hexTop:after,
      .hexBottom:after {
        content: "";
        position: absolute;
        width: 88px;
        height: 50.80682368868707px;
        -webkit-transform: rotate(45deg) scaleY(1.7321) translateY(-25.4034px);
        -ms-transform: rotate(45deg) scaleY(1.7321) translateY(-25.4034px);
        transform: rotate(45deg) scaleY(1.7321) translateY(-25.4034px);
        -webkit-transform-origin: 0 0;
        -ms-transform-origin: 0 0;
        transform-origin: 0 0;
        background: inherit;
      }

      .hexTop {
        top: -31.1127px;
      }

      .hexTop:after {
        background-position: center top;
      }

      .hexBottom {
        bottom: -31.1127px;
      }

      .hexBottom:after {
        background-position: center bottom;
      }

      .hexagon:after {
        content: "";
        position: absolute;
        top: 0px;
        left: 0;
        width: 88px;
        height: 50.8068px;
        z-index: 2;
        background: inherit;
      }
    </style>
    <a tabindex="-1" href="[[src]]" disabled$="[[disabled]]">
      <paper-button disabled$="[[disabled]]" id="button">
        <div class="hexagon" style$="background-image: url([[image]]);">
          <div class="hexTop"></div>
          <div class="hexBottom"></div>
          <iron-icon icon="[[icon]]">&gt;</iron-icon>
        </div>
      </paper-button>
    </a>
    <paper-tooltip for="button" position="bottom" offset="45">
      [[label]]
    </paper-tooltip>
  `,

  is: "simple-concept-network-node",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    SimpleColors,
    A11yBehaviors.A11y
  ],

  properties: {
    /**
     * make the default theme dark?
     */
    coloredText: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      notify: true
    },
    /**
     * Visualization reflected to attribute for styling
     */
    visualization: {
      type: String,
      reflectToAttribute: true,
      value: "3d"
    },
    /**
     * Icon to present
     */
    icon: {
      type: String
    },
    /**
     * image to present
     */
    image: {
      type: String
    },
    /**
     * disabled status
     */
    disabled: {
      type: Boolean
    },
    /**
     * title / label text
     */
    label: {
      type: String
    },
    /**
     * Longer description used for more info
     */
    description: {
      type: String
    },
    /**
     * source for a link
     */
    src: {
      type: String
    }
  }
});
