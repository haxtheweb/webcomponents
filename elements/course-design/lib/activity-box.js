import { LitElement, html, css } from "lit-element/lit-element.js";

class ActivityBox extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .container {
          background: #54539c;
          background: -moz-linear-gradient(-45deg, #54539c 0%, #379ad2 99%);
          background: -webkit-linear-gradient(-45deg, #54539c 0%, #379ad2 99%);
          background: linear-gradient(135deg, #54539c 0%, #379ad2 99%);
          filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#54539c', endColorstr='#379ad2',GradientType=1 );
          padding: var(--activity-box-container-padding, 7px);
          padding-top: var(--activity-box-container-padding-top, 14px);
          margin-bottom: var(--activity-box-container-margin-bottom, 20px);
        }
        .icon {
          width: 80px;
          height: 80px;
          background-repeat: no-repeat;
          background-size: contain;
          float: left;
        }
        :host([icon="cog"]) .icon {
          background-image: url(https://media.buttercupstraining.co.uk/sites/media/bc/files/cog-icon.png);
          margin-left: -33px;
          margin-top: -24px;
        }

        :host([icon="bulb"]) .icon {
          background-image: url(https://media.buttercupstraining.co.uk/sites/media/bc/files/lightbulb-icon.png);
          margin-left: -39px;
          margin-top: -27px;
        }
        .pullout {
          padding-left: 48px;
          color: white;
          margin-top: 0;
          font-family: "Roboto Slab", Arial, Sans-Serif;
          font-weight: 400;
          margin-bottom: 10px;
          font-size: 126%;
          line-height: 28px;
          padding-left: 63px;
          margin-bottom: 13px !important;
          max-width: 100%;
        }
      `,
    ];
  }
  static get tag() {
    return "activity-box";
  }
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Activity Box",
        description: "A small designed heading",
        icon: "editor:format-quote",
        color: "blue",
        groups: ["text", "education"],
        meta: {
          author: "ButtercupsUK",
        },
      },
      settings: {
        configure: [
          {
            property: "icon",
            title: "Icon",
            description: "The citation of the element",
            inputMethod: "select",
            options: {
              cog: "Cog",
              bulb: "Bulb",
            },
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "activity-box",
          properties: {
            icon: "cog",
          },
          content:
            "<p>Drag &amp; drop - drag the icons to the matching descriptions.</p>",
        },
      ],
    };
  }
  static get properties() {
    return {
      icon: {
        type: String,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.icon = "bulb";
  }
  render() {
    return html`
      <div class="container">
        <div class="icon"></div>
        <div class="pullout"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define(ActivityBox.tag, ActivityBox);
