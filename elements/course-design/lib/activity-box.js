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
          position: relative;
        }
        simple-icon {
          --simple-icon-height: 80px;
          --simple-icon-width: 80px;
          --simple-icon-color: white;
          float: left;
          position: absolute;
          top: 0px;
          left: var(--activity-box-icon-left, 0px);
        }
        .tag {
          padding: var(--activity-box-content-padding, 0px 0px 0px 85px);
        }
        .tag > span {
          background-color: #fff;
          color: var(--elmsln-system-color-dark);
          padding: 3px 10px;
          line-height: 10px;
          font-weight: var(--activity-box-tag-font-weight, bold);
          font-size: var(--activity-box-tag-font-size, 16px);
        }
        .tag > span > simple-icon {
          display: inline;
          left: 0px !important;
          --simple-icon-height: 23px;
          --simple-icon-width: 23px;
          --simple-icon-color: var(--elmsln-system-color-dark);
          display: inline;
          position: inherit;
          float: none;
          line-height: 17px;
        }
        .pullout {
          padding-left: 48px;
          color: white;
          margin-top: 0;
          font-family: var(--activity-box-content-font-family, inherit);
          font-weight: 400;
          margin-bottom: 10px;
          font-size: 126%;
          line-height: 28px;
          padding: var(--activity-box-content-padding, 0px 0px 0px 85px);
          margin-bottom: 13px !important;
          max-width: 100%;
        }
        :host([icon="null"]) .pullout,
        :host([icon="null"]) .tag,
        :host([icon=""]) .pullout,
        :host([icon=""]) .tag {
          padding-left: 10px;
        }
      `,
    ];
  }
  static get tag() {
    return "activity-box";
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    let container = this.shadowRoot.querySelector(".tag");
    if (val) {
      container.setAttribute("contenteditable", true);
    } else {
      container.removeAttribute("contenteditable");
      this.tag = container.innerText;
    }
    return false;
  }
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      contentEditable: true,
      gizmo: {
        title: "Activity Box",
        description: "A small designed heading",
        icon: "editor:format-quote",
        color: "blue",
        groups: ["text", "education"],
        meta: {
          author: "Buttercups Training Ltd",
        },
      },
      settings: {
        configure: [
          {
            property: "icon",
            title: "Icon",
            description: "The icon to be displayed alongside the activity box",
            inputMethod: "textfield",
          },
          {
            property: "tag",
            title: "Activity box tag",
            description: "The tag to be displayed within the activity box",
            inputMethod: "textfield",
          },
          {
            property: "nocolourize",
            title: "No Colorize",
            description: "Check to stop any colors being applied to the icon",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "activity-box",
          properties: {
            icon: "settings",
          },
          content:
            "<p>Drag &amp; drop - drag the icons to the matching descriptions.</p>",
        },
      ],
    };
  }
  static get properties() {
    return {
      /* The icon to use for the activity box */
      icon: {
        type: String,
        reflect: true,
      },
      /* Tag to be shown above the slotted content */
      tag: {
        type: String,
        reflect: true,
      },
      /* Whether or not the icon should have color applied */
      nocolourize: {
        type: Boolean,
        reflect: false,
      },
    };
  }

  constructor() {
    super();
    this.icon = "";
    this.tag = "";
  }

  render() {
    return html`
      <div class="container">
        ${this.icon
          ? html`
              <simple-icon
                icon="${this.icon}"
                ?no-colorize=${this.nocolourize}
              ></simple-icon>
            `
          : html``}
        ${this.tag
          ? html`<div class="tag">
              <span
                ><simple-icon icon="check-circle"></simple-icon>${this
                  .tag}</span
              >
            </div>`
          : html``}
        <div class="pullout"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define(ActivityBox.tag, ActivityBox);
