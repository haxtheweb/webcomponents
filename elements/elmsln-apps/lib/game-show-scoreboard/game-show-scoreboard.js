import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@vaadin/vaadin-grid/vaadin-grid-filter.js";
import "@vaadin/vaadin-grid/vaadin-grid-sorter.js";
import "@vaadin/vaadin-grid/vaadin-grid-sort-column.js";
import "@vaadin/vaadin-grid/vaadin-grid-column-group.js";
import "@vaadin/vaadin-grid/vaadin-grid-selection-column.js";
import "@lrnwebcomponents/simple-datetime/simple-datetime.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

class GameShowScoreboard extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          align-content: center;
          padding: 0.8em;
        }
        vaadin-grid-table-body > vaadin-grid-cell-content {
          height: unset !important;
        }
        vaadin-grid {
          height: 75vh;
          font-family: Roboto, sans-serif;
          --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));
        }

        vaadin-grid .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 56px;
        }

        vaadin-grid .cell.last {
          padding-right: 24px;
        }

        vaadin-grid .cell.numeric {
          text-align: right;
        }

        vaadin-grid paper-checkbox {
          --primary-color: var(--paper-indigo-500);
          margin: 0 24px;
        }

        vaadin-grid vaadin-grid-sorter .cell {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        vaadin-grid vaadin-grid-sorter iron-icon {
          transform: scale(0.8);
        }

        vaadin-grid vaadin-grid-sorter:not([direction]) iron-icon {
          color: rgba(0, 0, 0, var(--dark-disabled-opacity));
        }

        vaadin-grid vaadin-grid-sorter[direction] {
          color: rgba(0, 0, 0, var(--dark-primary-opacity));
        }

        vaadin-grid vaadin-grid-sorter[direction="desc"] iron-icon {
          transform: scale(0.8) rotate(180deg);
        }
        vaadin-grid-sorter {
          text-align: center;
        }
        lrndesign-avatar {
          display: inline-block;
        }
        .avatar-label {
          display: inline-block;
          margin-left: 0.2em;
        }
        simple-datetime,
        .score {
          margin: 0;
          padding: 8px;
          line-height: 14px;
          font-size: 14px;
          color: black;
          text-align: center;
          border-bottom: 1px dashed black;
        }
        simple-datetime:hover,
        .score:hover {
          background-color: #dddddd;
        }
      `
    ];
  }
  render() {
    return html`
      <custom-style>
        <style>
          vaadin-grid {
            --vaadin-grid-cell: {
              padding: 0;
            }

            --vaadin-grid-header-cell: {
              height: 3.5em;
              color: rgba(0, 0, 0, var(--dark-secondary-opacity));
              font-size: 1em;
            }

            --vaadin-grid-body-cell: {
              height: 3em;
              color: rgba(0, 0, 0, var(--dark-primary-opacity));
              font-size: 0.8em;
            }

            --vaadin-grid-body-row-hover-cell: {
              background-color: var(--paper-grey-200);
            }

            --vaadin-grid-body-row-selected-cell: {
              background-color: var(--paper-grey-100);
            }

            --vaadin-grid-focused-cell: {
              box-shadow: none;
              font-weight: bold;
            }
          }
        </style>
      </custom-style>
      <app-location
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
      ></app-location>
      <app-route
        pattern="${this.endPoint}/submissions/:submission"
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        .data="${this.data}"
        @data-changed="${this.dataChangedEvent}"
        .tail="${this.tail}"
        @tail-changed="${this.tailChangedEvent}"
      >
      </app-route>
      <iron-ajax
        auto
        id="optionsrequest"
        url="${this.optionsPath}"
        handle-as="json"
        @last-response-changed="${this.optionsDataChangedEvent}"
      ></iron-ajax>
      <simple-picker
        id="section"
        label="Section"
        value="${this.section}"
        @value-changed="${this.sectionEvent}"
        .options="${this.sectionOptions}"
      ></simple-picker>
      <simple-picker
        id="game"
        label="Game"
        value="${this.game}"
        @value-changed="${this.gameEvent}"
        .options="${this.gameOptions}"
      ></simple-picker>
      <iron-ajax
        auto
        id="datarequest"
        url="${this.dataRequestUrl}"
        handle-as="json"
        @last-response-changed="${this.activeDataEvent}"
      ></iron-ajax>
      <vaadin-grid
        ?hidden="${!this.visibleData}"
        id="material"
        aria-label="Student project list"
        .items="${this._toArray(this.visibleData)}"
        theme="row-dividers"
        column-reordering-allowed
        multi-sort
      >
        <vaadin-grid-column resizable>
          <template class="header">
            <vaadin-grid-sorter id="sorter" path="sis.sortable_name"
              >Student</vaadin-grid-sorter
            >
          </template>
          <template>
            <lrndesign-avatar
              label="[[item.name]]"
              src="[[item.avatar]]"
            ></lrndesign-avatar>
            <span class="avatar-label">[[item.sis.sortable_name]]</span>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Student"
              path="sis.sortable_name"
              value="[[_filterName]]"
            >
              <paper-input
                slot="filter"
                label="Student"
                value="{{_filterName::input}}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">
            <vaadin-grid-sorter id="sorter" path="name"
              >Name</vaadin-grid-sorter
            >
          </template>
          <template>
            [[item.name]]
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Student"
              path="name"
              value="[[_filterUserName]]"
            >
              <paper-input
                slot="filter"
                label="Username"
                value="{{_filterUserName::input}}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-sort-column
          resizable
          width="1em"
          header="Game"
          path="game"
        >
          [[item.game]]
        </vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          resizable
          width="1em"
          header="Section"
          path="section"
        >
          [[item.section]]
        </vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          resizable
          width="1em"
          header="High score"
          path="high"
        >
          [[item.high]]
        </vaadin-grid-sort-column>
        <vaadin-grid-column
          resizable
          width="1em"
          header="All Scores"
          path="scores"
        >
          <template>
            <dom-repeat items="[[item.scores]]" as="score">
              <template>
                <div class="score">[[score]]</div>
              </template>
            </dom-repeat>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column
          resizable
          width="1em"
          header="Attempt Dates"
          path="dates"
        >
          <template>
            <dom-repeat items="[[item.dates]]" as="date" mutable-data>
              <template>
                <simple-datetime
                  format="M jS, Y h:i:s"
                  timestamp="[[date]]"
                  unix
                ></simple-datetime>
              </template>
            </dom-repeat>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  static get tag() {
    return "game-show-scoreboard";
  }
  /**
   * props
   */

  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      optionsPath: {
        type: String,
        attribute: "options-path"
      },
      dataPath: {
        type: String,
        attribute: "data-path"
      },
      section: {
        type: String
      },
      game: {
        type: String
      },
      dataRequestUrl: {
        type: String,
        attribute: "data-request-url"
      },

      /**
       * routing variable for url
       */
      route: {
        type: String
      },
      tail: {
        type: String
      },
      optionsData: {
        type: Object
      },
      sectionOptions: {
        type: Array
      },
      gameOptions: {
        type: Array
      },
      activeData: {
        type: Object
      },
      visibleData: {
        type: Array
      }
    };
  }
  constructor() {
    super();
    this.game = "";
    this.optionsData = {};
    this.sectionOptions = [];
    this.gameOptions = [];
    this.activeData = {};
    this.visibleData = [];
  }
  sectionEvent(e) {
    this.section = e.detail.value;
  }
  gameEvent(e) {
    this.game = e.detail.value;
  }
  activeDataEvent(e) {
    this.activeData = { ...e.detail.value };
  }
  optionsDataChangedEvent(e) {
    this.optionsData = { ...e.detail.value };
  }
  dataChangedEvent(e) {
    this.data = e.detail.value;
  }
  routeChangedEvent(e) {
    this.route = e.detail.value;
  }
  tailChangedEvent(e) {
    this.tail = e.detail.value;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["sourcePath", "response"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (["dataPath", "section", "game"].includes(propName)) {
        this.dataRequestUrl = this._computeDataRequestUrl(
          this.dataPath,
          this.section,
          this.game
        );
      }
      if (["route", "endPoint"].includes(propName)) {
        this._routeChanged(this.route, this.endPoint);
      }
      if (propName == "optionsData") {
        this._optionsDataChanged(propName);
      }
      if (propName == "activeData") {
        this._activeDataChanged(propName);
      }
    });
  }
  _computeDataRequestUrl(dataPath, section, game) {
    return `${dataPath}&section=${section}&game=${game}`;
  }

  _optionsDataChanged(newValue) {
    if (newValue && newValue.status) {
      var sections = [];

      for (var i in newValue.data.sections) {
        sections.push([
          {
            alt: newValue.data.sections[i],
            value: i
          }
        ]);
      }

      var games = [];

      for (var i in newValue.data.games) {
        games.push([
          {
            alt: newValue.data.games[i],
            value: i
          }
        ]);
      }

      this.sectionOptions = [...sections];
      this.gameOptions = [...games];
    }
  }

  _activeDataChanged(newValue) {
    this.visibleData = [...newValue.data];
  }
  /**
   * Route changed
   */

  _routeChanged(route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        // ignore "home page" as well since that's our path
        if (route.path.startsWith(endPoint) || route.path == "/") {
          return;
        }
      }

      window.location.reload();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (document.getElementById("block-mooc-nav-block-mooc-nav-nav")) {
      document.getElementById("block-mooc-nav-block-mooc-nav-nav").remove();
    }
  }

  _toArray(obj) {
    if (obj == null) {
      return [];
    }

    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}

window.customElements.define(GameShowScoreboard.tag, GameShowScoreboard);
export { GameShowScoreboard };
