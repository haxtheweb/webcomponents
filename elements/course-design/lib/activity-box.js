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
        }
        :host([icon="settings"]) simple-icon {
          left: var(--activity-box-icon-settings-left, 0px);
        }
        :host([icon="bulb"]) simple-icon {
          left: var(--activity-box-icon-bulb-left, 0px);
        }
        :host([icon="pencil"]) simple-icon {
          left: var(--activity-box-icon-pencil-left, 0px);
        }
        :host([icon="sop"]) simple-icon {
          left: var(--activity-box-icon-sop-left, 0px);
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
          padding: var(--activity-box-content-padding, 0px 0px 0px 85px);
          margin-bottom: 13px !important;
          max-width: 100%;
        }
        :host([icon="none"]) .pullout {
          padding-left: 10px;
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
          author: "Buttercups Training Ltd",
        },
      },
      settings: {
        configure: [
          {
            property: "icon",
            title: "Icon",
            description: "The icon to be displayed alongside the activity box",
            inputMethod: "select",
            options: {
              none: "None",
              settings: "Settings",
              bulb: "Bulb",
              pencil: "Pencil",
              sop: "Standard Operating Procedure",
            },
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
      /* The variable used for passing the icon to the simple-icon component */
      _simpleIcon: {
        type: String,
        reflect: false,
      },
      /* The variable used for passing a source href to the simple-icon component */
      _simpleIconSource: {
        type: String,
        reflect: false,
      },
    };
  }

  constructor() {
    super();
    this.icon = "bulb";
    this._simpleIcon = this.icon;
    this._simpleIconSource = "";
  }

  updateIconSource(context, icon, source) {
    this._simpleIcon = icon;
    this._simpleIconSource = source;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "icon") {
        var customIcon = getComputedStyle(this)
          .getPropertyValue("--activity-box-icon-" + `${this[propName]}`)
          .slice(5, -1)
          .replace(/\\/g, "");
        if (customIcon) {
          this.updateIconSource(this, "", customIcon);
        } else {
          /* For certain icons, we need to switch from the friendly name to the actual name of the default icon */
          var icon = `${this[propName]}`;
          switch (this[propName]) {
            case "pencil":
              icon = "editor:mode-edit";
              break;
            case "sop":
              icon = "editor:format-list-bulleted";
              break;
            case "bulb":
              icon = "lightbulb-outline";
              break;
          }
          this.updateIconSource(this, icon, "");
        }
      }
    });
  }

  render() {
    return html`
      <div class="container">
        ${this._simpleIcon !== "none"
          ? html`
              <simple-icon
                icon="${this._simpleIcon}"
                src="${this._simpleIconSource}"
                ?no-colorize=${this._simpleIconSource}
              ></simple-icon>
            `
          : html``}
        <div class="pullout"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define(ActivityBox.tag, ActivityBox);
