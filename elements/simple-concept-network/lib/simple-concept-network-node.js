import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
/**
 * `simple-concept-network-node`
 * @element simple-concept-network-node
 * A small but effective little data visualizer for topics surrounding
 * a central concept, much like the ELMS:LN snowflake icon.
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - ELMS:LN - The ELMS: Learning Network "snowflake" is a network diagram
 */
class SimpleConceptNetworkNode extends PolymerElement {
  constructor() {
    super();
    setTimeout(() => {
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }, 0);
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
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
          --simple-concept-network-bg: var(
            --simple-colors-default-theme-grey-1
          );
          --simple-concept-network-color: var(
            --simple-colors-default-theme-accent-8
          );
        }
        button {
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
        :host([visualization="network"]) button:hover,
        :host([visualization="network"]) button:focus {
          opacity: 0.8;
        }
        :host([visualization="3d"]) button {
          -webkit-transform: perspective(600px) rotateX(60deg);
          -moz-transform: perspective(600px) rotateX(60deg);
          -ms-transform: perspective(600px) rotateX(60deg);
          -o-transform: perspective(600px) rotateX(60deg);
          transform: perspective(600px) rotateX(60deg);
        }
        :host([visualization="3d"]) button:hover,
        :host([visualization="3d"]) button:focus {
          transform: perspective(0px) rotateX(0deg);
        }
        simple-icon {
          --simple-icon-width: 50px;
          --simple-icon-height: 50px;
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
        <button disabled$="[[disabled]]" id="button">
          <div class="hexagon" style$="background-image: url([[image]]);">
            <div class="hexTop"></div>
            <div class="hexBottom"></div>
            <simple-icon icon="[[icon]]">&gt;</simple-icon>
          </div>
        </button>
      </a>
      <simple-tooltip for="button" position="bottom" offset="45">
        [[label]]
      </simple-tooltip>
    `;
  }
  static get properties() {
    return {
      /**
       * make the default theme dark?
       */
      coloredText: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * Visualization reflected to attribute for styling
       */
      visualization: {
        type: String,
        reflectToAttribute: true,
        value: "3d",
      },
      /**
       * Icon to present
       */
      icon: {
        type: String,
      },
      /**
       * image to present
       */
      image: {
        type: String,
      },
      /**
       * disabled status
       */
      disabled: {
        type: Boolean,
      },
      /**
       * title / label text
       */
      label: {
        type: String,
      },
      /**
       * Longer description used for more info
       */
      description: {
        type: String,
      },
      /**
       * source for a link
       */
      src: {
        type: String,
      },
    };
  }
  static get tag() {
    return "simple-concept-network-node";
  }
}
window.customElements.define(
  SimpleConceptNetworkNode.tag,
  SimpleConceptNetworkNode
);
export { SimpleConceptNetworkNode };
