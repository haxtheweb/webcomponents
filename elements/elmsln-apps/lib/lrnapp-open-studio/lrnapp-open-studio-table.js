import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-input/paper-input.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@vaadin/vaadin-grid/vaadin-grid-column.js";
import "@vaadin/vaadin-grid/vaadin-grid-sorter.js";
import "@vaadin/vaadin-grid/vaadin-grid-filter.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-submission/lrnapp-studio-submission-display.js";
class LrnappOpenStudioTable extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style" include="materializecss-styles">
          :host {
            display: block;
            align-content: center;
            padding: 0.8em;
          }
          #loading {
            width: 100%;
            z-index: 1000;
            opacity: 0.8;
            text-align: center;
            align-content: center;
            justify-content: center;
            height: 100vh;
            position: absolute;
            background-color: white;
          }
          .center-data {
            text-align: center;
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

          vaadin-grid#material vaadin-grid-sorter {
            --vaadin-grid-sorter-arrow: {
              display: none !important;
            }
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
        </style>
      </custom-style>
      <vaadin-grid
        column-reordering-allowed=""
        id="material"
        aria-label="Course list"
        items="{{submissions}}"
      >
        <vaadin-grid-column resizable="">
          <template class="header">
            <vaadin-grid-sorter path="relationships.project.data.title"
              >Project</vaadin-grid-sorter
            >
          </template>
          <template>
            <paper-button
              on-click="_loadProjectRoute"
              data-project-id\$="{{item.relationships.project.data.id}}"
              data-author-id\$="{{item.relationships.author.data.id}}"
              >[[item.relationships.project.data.title]]</paper-button
            >
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="">
          <template class="header">
            <vaadin-grid-sorter path="relationships.assignment.data.title"
              >Assignment</vaadin-grid-sorter
            >
          </template>
          <template>
            [[item.relationships.assignment.data.title]]
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="" width="20em" flex-grow="0">
          <template class="header">
            <vaadin-grid-sorter path="attributes.title"
              >Title</vaadin-grid-sorter
            >
          </template>
          <template>
            <paper-button
              on-click="_loadSubmissionUrl"
              data-submission-id\$="{{item.id}}"
              >[[item.attributes.title]]</paper-button
            >
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Title"
              path="attributes.title"
              value="[[_filterTitle]]"
            >
              <paper-input
                slot="filter"
                label="Title"
                value="{{_filterTitle::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="">
          <template class="header">
            <vaadin-grid-sorter path="meta.changed"
              >Submitted</vaadin-grid-sorter
            >
          </template>
          <template>
            [[item.meta.humandate]]
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Submitted"
              path="meta.changed"
              value="[[_filterSubmitted]]"
            >
              <paper-input
                slot="filter"
                label="Submitted"
                value="{{_filterSubmitted::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="">
          <template class="header">
            <vaadin-grid-sorter path="relationships.author.data.display_name"
              >Author</vaadin-grid-sorter
            >
          </template>
          <template>
            [[item.relationships.author.data.display_name]]
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="" width="[[_numWidth]]">
          <template class="header">
            <vaadin-grid-sorter path="meta.comment_count"
              >Comments</vaadin-grid-sorter
            >
          </template>
          <template>
            <span class="center-data">[[item.meta.comment_count]]</span>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Comments"
              path="meta.comment_count"
              value="[[_filterCommentsCount]]"
            >
              <paper-input
                slot="filter"
                label="Comments"
                value="{{_filterCommentsCount::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="" width="[[_numWidth]]">
          <template class="header">
            <vaadin-grid-sorter path="attributes.images.length"
              >Images</vaadin-grid-sorter
            >
          </template>
          <template>
            <span class="center-data">[[item.attributes.images.length]]</span>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Images"
              path="attributes.images.length"
              value="[[_filterImageCount]]"
            >
              <paper-input
                slot="filter"
                label="Images"
                value="{{_filterImageCount::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="" width="[[_numWidth]]">
          <template class="header">
            <vaadin-grid-sorter path="attributes.video.length"
              >Video</vaadin-grid-sorter
            >
          </template>
          <template>
            <span class="center-data">[[item.attributes.video.length]]</span>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Video"
              path="attributes.video.length"
              value="[[_filterVideosCount]]"
            >
              <paper-input
                slot="filter"
                label="Video"
                value="{{_filterVideosCount::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="" width="[[_numWidth]]">
          <template class="header">
            <vaadin-grid-sorter path="attributes.links.length"
              >Links</vaadin-grid-sorter
            >
          </template>
          <template>
            <span class="center-data">[[item.attributes.links.length]]</span>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Links"
              path="attributes.links.length"
              value="[[_filterLinksCount]]"
            >
              <paper-input
                slot="filter"
                label="Links"
                value="{{_filterLinksCount::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable="" width="[[_numWidth]]">
          <template class="header">
            <vaadin-grid-sorter path="attributes.files.length"
              >Files</vaadin-grid-sorter
            >
          </template>
          <template>
            <span class="center-data">[[item.attributes.files.length]]</span>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Files"
              path="attributes.files.length"
              value="[[_filterFileCount]]"
            >
              <paper-input
                slot="filter"
                label="Files"
                value="{{_filterFileCount::input}}"
                focus-target=""
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }
  static get tag() {
    return "lrnapp-open-studio-table";
  }
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
      /**
       * The submissions to render
       */
      submissions: {
        type: Array,
        notify: true
      },
      _numWidth: {
        type: String,
        value: "2.25em"
      },
      /**
       * Endpoint for submission data.
       */
      sourcePath: {
        type: String,
        notify: true
      },
      /**
       * base path for the app
       */
      basePath: {
        type: String,
        notify: true
      },
      /**
       * Active / clicked submission.
       */
      activeSubmission: {
        type: String,
        value: null,
        notify: true
      }
    };
  }
  _loadProjectRoute(e) {
    var local = e.target;
    // this will have the id of the current submission
    var project = local.getAttribute("data-project-id");
    var author = local.getAttribute("data-author-id");
    // fire event w/ parts of the route to changes
    this.dispatchEvent(
      new CustomEvent("route-change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          data: { page: "projects" },
          queryParams: { author: author, project: project }
        }
      })
    );
  }
  /**
   * Handle tap on paper-button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl(e) {
    let root = this;
    var local = e.target;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  }

  /**
   * Handle response for the whole projects object.
   */
  _handleResponse(event) {
    this.shadowRoot.querySelector("#loading").hidden = true;
  }

  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnappOpenStudioTable.tag, LrnappOpenStudioTable);
export { LrnappOpenStudioTable };
