import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
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

class GameShowScoreboard extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          align-content: center;
          padding: 0.8em;
        }
        vaadin-grid-table-body > vaadin-grid-cell-content {
          height: unset !important;
        }
        vaadin-grid#material {
          height: 75vh;
          font-family: Roboto, sans-serif;
          --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

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

        vaadin-grid#material .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 56px;
        }

        vaadin-grid#material .cell.last {
          padding-right: 24px;
        }

        vaadin-grid#material .cell.numeric {
          text-align: right;
        }

        vaadin-grid#material paper-checkbox {
          --primary-color: var(--paper-indigo-500);
          margin: 0 24px;
        }

        vaadin-grid#material vaadin-grid-sorter .cell {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        vaadin-grid#material vaadin-grid-sorter iron-icon {
          transform: scale(0.8);
        }

        vaadin-grid#material vaadin-grid-sorter:not([direction]) iron-icon {
          color: rgba(0, 0, 0, var(--dark-disabled-opacity));
        }

        vaadin-grid#material vaadin-grid-sorter[direction] {
          color: rgba(0, 0, 0, var(--dark-primary-opacity));
        }

        vaadin-grid#material vaadin-grid-sorter[direction="desc"] iron-icon {
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
      </style>
      <app-location route="{{route}}"></app-location>
      <app-route
        route="{{route}}"
        pattern="[[endPoint]]/submissions/:submission"
        data="{{data}}"
        tail="{{tail}}"
      >
      </app-route>
      <iron-ajax
        auto
        id="optionsrequest"
        url="[[optionsPath]]"
        handle-as="json"
        last-response="{{optionsData}}"
      ></iron-ajax>
      <simple-picker
        id="section"
        label="Section"
        value="{{section}}"
        options="[[sectionOptions]]"
      ></simple-picker>
      <simple-picker
        id="game"
        label="Game"
        value="{{game}}"
        options="[[gameOptions]]"
      ></simple-picker>
      <iron-ajax
        auto
        id="datarequest"
        url="[[dataRequestUrl]]"
        handle-as="json"
        last-response="{{activeData}}"
      ></iron-ajax>
      <vaadin-grid
        hidden$="[[!visibleData]]"
        id="material"
        aria-label="Student project list"
        items="[[_toArray(visibleData)]]"
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

  static get observers() {
    return ["_routeChanged(route, endPoint)"];
  }
  /**
   * props
   */

  static get properties() {
    return {
      elmslnCourse: {
        type: String
      },
      elmslnSection: {
        type: String
      },
      basePath: {
        type: String
      },
      csrfToken: {
        type: String
      },
      endPoint: {
        type: String
      },
      optionsPath: {
        type: String
      },
      dataPath: {
        type: String
      },
      section: {
        type: String
      },
      game: {
        type: String,
        value: ""
      },
      dataRequestUrl: {
        type: String,
        computed: "_computeDataRequestUrl(dataPath, section, game)"
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
        type: Object,
        value: {},
        observer: "_optionsDataChanged"
      },
      sectionOptions: {
        type: Array,
        value: []
      },
      gameOptions: {
        type: Array,
        value: []
      },
      activeData: {
        type: Object,
        value: {},
        observer: "_activeDataChanged"
      },
      visibleData: {
        type: Array,
        value: []
      }
    };
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

      this.set("sectionOptions", sections);
      this.set("gameOptions", games);
    }
  }

  _activeDataChanged(newValue) {
    this.set("visibleData", newValue.data);
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
