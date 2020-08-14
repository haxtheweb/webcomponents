/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@lrnwebcomponents/simple-datetime/simple-datetime.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import { SimpleColorsPolymer } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
import "../haxcms-site-store.js";
import {
  HaxSchematizer,
  HaxElementizer
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
/**
 * `haxcms-site-listing`
 * `A listing of all sites being managed by this instance.`
 */

class HAXCMSSiteListing extends PolymerElement {
  /**
   * created life cycle
   */
  constructor() {
    super();
    this.SimpleColors = new SimpleColorsPolymer();
    setPassiveTouchGestures(true);
    this.HaxSchematizer = HaxSchematizer;
    this.HaxElementizer = HaxElementizer;
    import("@lrnwebcomponents/haxcms-elements/lib/core/site-list/haxcms-site-listing-deps.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */

  static get tag() {
    return "haxcms-site-listing";
  } // render function

  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
        paper-icon-button {
          --paper-icon-button-ink-color: var(--haxcms-system-action-color);
        }
        .toolbar div.main-title {
          margin-left: 50px;
          font-size: 24px;
        }
        .toolbar {
          display: flex;
          padding: 8px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          color: var(--simple-colors-default-theme-accent-11, #111111);
          background-color: var(
            --simple-colors-default-theme-accent-2,
            #eeeeee
          );
          z-index: 1;
          line-height: 120%;
          align-items: center;
        }
        a11y-collapse-group {
          margin-top: 64px;
        }
        a11y-collapse div[slot="heading"] {
          height: 64px;
          line-height: 64px;
          font-size: 30px;
          cursor: pointer;
        }
        jos-render {
          --jos-render-margin: 0px;
          --jos-render-padding: 8px;
        }
        course-card {
          height: 350px;
          width: 150px;
          overflow: hidden;
          --course-card-filter: grayscale(80%);
        }
        course-card:active,
        course-card:hover {
          --course-card-filter-hover: grayscale(0%);
        }
        vaadin-grid {
          margin-top: 24px;
          height: calc(100vh - 64px);
        }
        simple-datetime {
          color: black;
        }
        vaadin-checkbox {
          border: 1px solid black;
          background-color: var(--simple-colors-default-theme-blue-1);
        }
        .login-prompt {
          margin: 80px auto 0;
          display: flex;
          justify-content: center;
        }
        .login-prompt[hidden] {
          display: none;
        }
        .login-prompt div#selfie {
          position: absolute;
          margin: 0;
        }
        .has-snap {
          z-index: 3;
        }
        .hide-camera {
          display: none;
        }
        .login-prompt div#selfie img {
          z-index: 2;
          position: absolute;
          margin: 0 0 0 -78px;
          width: 355px;
          height: 200px;
          display: block;
        }
        simple-login {
          background: #eeeeee;
          color: var(--haxcms-system-bg);
          --primary-color: var(--haxcms-system-bg);
          --primary-text-color: var(--haxcms-system-bg);
          --simple-fields-accent-color: var(--haxcms-system-action-color);
          --login-btn-background-color: var(--haxcms-system-bg);
          --login-btn-raised-background-color: var(
            --haxcms-system-action-color
          );
          --login-form-color: var(--haxcms-system-bg);
          --login-btn-width: 80%;
          --login-btn-display: flex;
        }
        .forgot {
          margin: 32px 0 -16px 0;
          padding: 0;
          font-size: 12px;
          text-align: center;
        }
        hax-logo {
          margin-top: -50px;
          margin-bottom: 16px;
          text-align: center;
          --hax-logo-font-size: 24px;
          --hax-logo-letter-spacing: 0px;
        }
        .camera-buttons {
          width: 100%;
          justify-content: center;
          display: flex;
        }
        simple-modal-template[modal-id="help"] {
          --simple-modal-width: 60vw;
        }
        paper-dialog {
          width: 60vw;
        }
        paper-dialog-scrollable {
          overflow: scroll;
          height: 40vh;
        }
        h2.dialog-header {
          background-color: var(--haxcms-site-listing-color-dark);
          margin: 0;
          padding: 28px;
          color: var(--haxcms-site-listing-color-light);
        }
        .buttons {
          text-align: center;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          margin-top: 2em;
          color: var(--haxcms-site-listing-color-dark);
          font-weight: 500;
        }
        .action-button {
          width: 50%;
          height: 64px;
          background-color: var(--haxcms-site-listing-color-dark);
          color: var(--haxcms-site-listing-color-light);
          margin-right: 48px;
        }
        .action-button:hover,
        .action-button:active,
        .action-button:focus {
          background-color: var(--haxcms-site-listing-color-hover);
        }
        .action-button iron-icon {
          margin-right: 8px;
        }
        simple-fields-field {
          --simple-fields-accent-color: var(--haxcms-site-listing-color-hover);
        }
        .small-location {
          font-size: 11px;
          font-style: italic;
        }
        #grid {
          font-size: 13px;
        }
        #loading {
          z-index: 1000;
          opacity: 1;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0%;
          padding: 50vh calc(50% - 127.5px);
          transition: all linear 1s;
          visibility: visible;
          background-color: rgba(250, 250, 250, 0.8);
        }
        #loading[data-loading] {
          opacity: 0;
          visibility: hidden;
          --hexagon-color: var(--simple-colors-default-theme-light-blue-7, #007ffc);
        }
        a {
          text-decoration: none;
          color: black;
        }
        .site-title {
          display: block;
          font-size: 20px;
          width: 100%;
          min-width: unset;
          text-decoration: underline;
        }
        .site-title:hover,
        .site-title:active,
        .site-title:focus {
          text-decoration: none;
        }
        .operations paper-button {
          font-weight: 500;
          font-size: 18px;
          color: black;
          background-color: var(--haxcms-site-listing-color-light);
          margin: 0;
          padding: 8px;
          width: auto;
          display: inline-flex;
          height: 48px;
        }
        .operations paper-button:hover,
        .operations paper-button:active,
        .operations paper-button:focus {
          background-color: var(--haxcms-site-listing-color-light);
          color: var(--haxcms-site-listing-color-hover);
        }
        .operations.right {
          right: 0;
          position: absolute;
          display: inline-flex;
        }
        #add {
          background-color: var(--haxcms-site-listing-color-hover);
          color: var(--haxcms-site-listing-color-light);
          transition: 0.2s all linear;
        }
        #add:hover,
        #add:active,
        #add:focus {
          background-color: var(--haxcms-site-listing-color-light);
          color: var(--haxcms-site-listing-color-hover);
        }
        .selected-operations {
          margin: 0 16px;
          transition: 0.3s linear all;
          display: inline-flex;
          visibility: visible;
          opacity: 1;
          align-content: center;
          justify-content: space-evenly;
          width: 100%;
        }
        *[hidden] {
          visibility: hidden;
          opacity: 0;
          display: none;
        }
        .selected-operations paper-button {
          background-color: var(--haxcms-site-listing-color-light);
          font-weight: 500;
          font-size: 16px;
          color: var(--haxcms-site-listing-color-dark);
          margin: 0;
          min-width: unset;
          margin: 8px;
          height: 48px;
        }
        .selected-operations paper-button:active,
        .selected-operations paper-button:hover,
        .selected-operations paper-button:focus {
          background-color: var(--haxcms-site-listing-color-hover);
          color: var(--haxcms-site-listing-color-light) !important;
        }
        .danger {
          color: var(--simple-colors-default-theme-red-7) !important;
        }
        .danger:hover {
          color: var(--haxcms-site-listing-color-light) !important;
        }
        #userphoto {
          width: 40px;
          height: 40px;
          margin-right: 4px;
          border-radius: 50%;
        }
        @media screen and (max-width: 1080px) {
          .selected-operations .small-hide {
            display: none;
          }
        }
        @media screen and (max-width: 800px) {
          .main-title {
            display: none;
          }
        }
        @media screen and (max-width: 700px) {
          .small-hide {
            display: none;
          }
        }
      </style>
      <jwt-login
        id="jwt"
        method="[[method]]"
        url="[[__loginPath]]"
        refresh-url="[[__refreshPath]]"
        logout-url="[[__logoutPath]]"
        jwt="{{jwt}}"
      ></jwt-login>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="loaddata"
        auto=""
        loading="{{__loading}}"
        url="[[dataSource]]"
        handle-as="json"
        debounce-duration="250"
        last-response="{{sitesResponse}}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="createrequest"
        method="[[method]]"
        body="[[createParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__createNewSitePath]]"
        handle-as="json"
        on-response="handleCreateResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="gitimportrequest"
        method="[[method]]"
        body="[[gitImportParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__gitImportSitePath]]"
        handle-as="json"
        on-response="handleGitImportResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="downloadrequest"
        method="[[method]]"
        body="[[downloadParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__downloadSitePath]]"
        handle-as="json"
        on-response="handleDownloadResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="archiverequest"
        method="[[method]]"
        body="[[archiveParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__archiveSitePath]]"
        handle-as="json"
        on-response="handleArchiveResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="deleterequest"
        method="[[method]]"
        body="[[deleteParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__deleteSitePath]]"
        handle-as="json"
        on-response="handleDeleteResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="clonerequest"
        method="[[method]]"
        body="[[cloneParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__cloneSitePath]]"
        handle-as="json"
        on-response="handleCloneResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="publishrequest"
        method="[[method]]"
        body="[[publishParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__publishSitePath]]"
        handle-as="json"
        on-response="handlePublishResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="syncrequest"
        method="[[method]]"
        body="[[syncParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__syncSitePath]]"
        handle-as="json"
        on-response="handleSyncResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="getconfigrequest"
        method="[[method]]"
        body="[[configParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__getConfigPath]]"
        handle-as="json"
        on-response="handleConfigResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="setconfigrequest"
        method="[[method]]"
        body="[[setConfigParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__setConfigPath]]"
        handle-as="json"
        on-response="handleSetConfigResponse"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        on-last-error-changed="lastErrorChanged"
        id="getuserdatarequest"
        method="[[method]]"
        body="[[getUserDataParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__getUserDataPath]]"
        handle-as="json"
        on-response="handleGetUserDataResponse"
      ></iron-ajax>
      <div id="loading" data-loading\$="[[!__loading]]">
        <hexagon-loader
          item-count="4"
          loading
          size="large"
        ></hexagon-loader>
      </div>
      <div class="toolbar">
        <slot name="app-header-pre"></slot>
        <div class="operations">
          <paper-button
            on-click="_addTap"
            id="add"
            raised
            hidden$="[[!loggedIn]]"
            title="Create new site"
          >
            <iron-icon icon="icons:add"></iron-icon>
            <span class="small-hide">New site</span>
          </paper-button>
          <paper-button
            on-click="_importTap"
            id="import"
            raised
            hidden$="[[!loggedIn]]"
            title="Import site"
          >
            <iron-icon icon="icons:cloud-download"></iron-icon>
            <span class="small-hide">Import</span>
          </paper-button>
        </div>
        <div class="main-title" hidden$="[[!loggedIn]]">[[title]]</div>
        <div class="operations right">
          <paper-button
            on-click="_helpTap"
            id="help"
            raised
            title="Help"
            hidden$="[[!showSpecialButtons(hideGlobalSettings,loggedIn)]]"
          >
            <iron-icon icon="icons:help"></iron-icon>
            <span class="small-hide">Help</span>
          </paper-button>
          <paper-button
            on-click="_settingsTap"
            id="settings"
            raised
            title="Settings"
            hidden$="[[!showSpecialButtons(hideGlobalSettings,loggedIn)]]"
          >
            <iron-icon icon="icons:settings"></iron-icon>
            <span class="small-hide">Settings</span>
          </paper-button>
          <paper-button
            hidden$="[[!showSpecialButtons(hideLogin,loggedIn)]]"
            id="login"
            on-click="_logoutUserRoutine"
            title="Logout"
          >
            <template is="dom-if" if="[[!logoutPhoto]]">
              <iron-icon icon="[[__loginIcon]]" class="small-hide"></iron-icon>
            </template>
            <template is="dom-if" if="[[logoutPhoto]]">
              <img id="userphoto" src="[[logoutPhoto]]" class="small-hide" />
            </template>
            [[__loginText]]</paper-button
          >
        </div>
      </div>
      <a11y-collapse-group heading-button expanded hidden$="[[!loggedIn]]">
        <a11y-collapse>
          <div slot="heading">Card view</div>
          <jos-render slot="content"></jos-render>
        </a11y-collapse>
        <a11y-collapse>
          <div slot="heading">Table view / bulk operations</div>
          <div slot="content">
            <div class="selected-operations" id="ops">
              <paper-button
                title="Publish"
                on-click="_bulkSitesConfirm"
                id="publish"
                raised
              >
                <iron-icon icon="editor:publish"></iron-icon>
                <span class="small-hide">Publish site</span>
              </paper-button>
              <paper-button
                title="Sync git"
                on-click="_bulkSitesConfirm"
                id="sync"
                raised
              >
                <iron-icon icon="notification:sync"></iron-icon>
                <span class="small-hide">Sync git</span>
              </paper-button>
              <paper-button
                title="Copy site"
                on-click="_bulkSitesConfirm"
                id="clone"
                raised
              >
                <iron-icon icon="icons:content-copy"></iron-icon>
                <span class="small-hide">Copy site</span>
              </paper-button>
              <paper-button
                title="Download zip"
                on-click="_bulkSitesConfirm"
                id="download"
                raised
              >
                <iron-icon icon="icons:file-download"></iron-icon>
                <span class="small-hide">Download zip</span>
              </paper-button>
              <paper-button
                title="Archive"
                on-click="_bulkSitesConfirm"
                id="archive"
                raised
              >
                <iron-icon icon="icons:archive"></iron-icon>
                <span class="small-hide">Archive site</span>
              </paper-button>
              <paper-button
                on-click="_bulkSitesConfirm"
                id="delete"
                raised
                class="danger"
                title="Delete forever"
              >
                <iron-icon icon="icons:delete-forever"></iron-icon>
                <span class="small-hide">Delete forever</span>
              </paper-button>
            </div>
            <vaadin-grid
              id="grid"
              items="[[sites]]"
              theme="row-dividers"
              column-reordering-allowed
              multi-sort
            >
              <vaadin-grid-selection-column
                width="5em"
                auto-select
                frozen
              ></vaadin-grid-selection-column>
              <vaadin-grid-filter-column
                header="Site name"
                width="240px"
                path="title"
              >
                <template>
                  <portal-launcher>
                    <a class="site-title" href$="[[item.slug]]">
                      <div>[[item.title]]</div>
                      <div class="small-location">
                        [[cleanLocation(item.slug)]]
                      </div>
                    </a>
                  </portal-launcher>
                </template>
              </vaadin-grid-filter-column>
              <vaadin-grid-filter-column
                path="metadata.theme.name"
                header="Theme"
                width="80px"
              ></vaadin-grid-filter-column>
              <vaadin-grid-sort-column header="Updated" path="metadata.updated">
                <template>
                  <template is="dom-if" if="[[item.metadata.site.updated]]">
                    <simple-datetime
                      format="M jS, Y"
                      timestamp="[[item.metadata.site.updated]]"
                      unix
                    ></simple-datetime>
                  </template>
                </template>
              </vaadin-grid-sort-column>
              <vaadin-grid-sort-column header="Created" path="metadata.created">
                <template>
                  <template is="dom-if" if="[[item.metadata.site.created]]">
                    <simple-datetime
                      format="M jS, Y"
                      timestamp="[[item.metadata.site.created]]"
                      unix
                    ></simple-datetime>
                  </template>
                </template>
              </vaadin-grid-sort-column>
              <vaadin-grid-column header="Icon">
                <template
                  ><iron-icon
                    icon="[[item.metadata.theme.variables.icon]]"
                  ></iron-icon
                ></template>
              </vaadin-grid-column>
              <vaadin-grid-sort-column
                header="Last published"
                path="metadata.lastPublished"
              >
                <template>
                  <template
                    is="dom-if"
                    if="[[item.metadata.site.static.lastPublished]]"
                  >
                    <simple-datetime
                      format="M jS, Y"
                      timestamp="[[item.metadata.site.static.lastPublished]]"
                      unix
                    ></simple-datetime>
                  </template>
                </template>
              </vaadin-grid-sort-column>
              <vaadin-grid-sort-column
                path="metadata.pageCount"
                header="Pages"
              ></vaadin-grid-sort-column>
              <vaadin-grid-column header="Color">
                <template>
                  <div
                    style$="border:1px solid black;width:64px;height:48px;background-color:[[item.metadata.theme.variables.hexCode]];"
                  ></div>
                </template>
              </vaadin-grid-column>
              <vaadin-grid-column header="Logo" width="64px">
                <template
                  ><iron-image
                    sizing="contain"
                    preload
                    src$="[[item.slug]][[item.metadata.site.logo]]"
                    style="width:64px; height:64px;"
                  ></iron-image
                ></template>
              </vaadin-grid-column>
            </vaadin-grid>
          </div>
        </a11y-collapse>
      </a11y-collapse-group>
      <div class="login-prompt" hidden$="[[loggedIn]]">
        <simple-login>
          <hax-logo size="mini" hide-hax><span>HAXcms login</span></hax-logo>
          <div class="camera-buttons">
            <paper-icon-button
              id="snap"
              icon="image:camera-alt"
              title="Snap photo"
            ></paper-icon-button>
            <paper-icon-button
              id="newsnap"
              icon="icons:cancel"
              title="Clear photo"
            ></paper-icon-button>
          </div>
          <simple-login-avatar>
            <div id="selfie"></div>
            <simple-login-camera id="camera" autoplay></simple-login-camera>
          </simple-login-avatar>
          <p class="forgot" slot="buttons">
            Forget your login? Check <strong>_config/config.php</strong>
          </p>
        </simple-login>
        <vaadin-upload
          capture
          headers='{"Authorization": "Bearer [[jwt]]"}'
          method="[[method]]"
          form-data-name="file-upload"
          hidden
          id="fileupload"
        ></vaadin-upload>
      </div>
      <simple-modal-template modal-id="help" title="Help">
        <div slot="header">Help directions</div>
        <p slot="content">
          <md-block
            source="https://raw.githubusercontent.com/elmsln/HAXcms/master/HAXDocs.md"
          ></md-block>
        </p>
        <div slot="buttons"><mwc-button dialog-dismiss>Close</mwc-button></div>
      </simple-modal-template>
      <paper-dialog id="confirm">
        <h2 class="dialog-header">
          [[activeOpertion]] these [[selectedItems.length]] sites
        </h2>
        <paper-dialog-scrollable>
          <ul>
            <dom-repeat items="[[selectedItems]]" as="site">
              <template>
                <li>[[site.title]]</li>
              </template>
            </dom-repeat>
          </ul>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button
            on-click="_confirmBulkOperation"
            dialog-confirm
            id="bulksites"
            class="action-button"
            raised
            ><iron-icon icon="icons:thumb-up"></iron-icon> Yes,
            [[activeOpertion]]</paper-button
          >
          <paper-button class="action-button" dialog-dismiss
            ><iron-icon icon="icons:thumb-down"></iron-icon>
            Cancel</paper-button
          >
        </div>
      </paper-dialog>
      <paper-dialog id="createsite">
        <h2 class="dialog-header">Create new site</h2>
        <paper-dialog-scrollable>
          <form>
            <simple-fields
              id="createsitefields"
              autofocus
              schematizer="[[HaxSchematizer]]"
              elementizer="[[HaxElementizer]]"
            >
            </simple-fields>
          </form>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button
            on-click="_createSite"
            class="action-button"
            dialog-confirm
            id="create"
            raised
            ><iron-icon icon="icons:home"></iron-icon> Create your new
            site!</paper-button
          >
          <paper-button class="action-button" dialog-dismiss
            ><iron-icon icon="icons:thumb-down"></iron-icon>
            Cancel</paper-button
          >
        </div>
      </paper-dialog>
      <paper-dialog id="importsite">
        <h2 class="dialog-header">Import site from git repo</h2>
        <simple-fields-field
          id="importurl"
          label="Git url"
          type="text"
        ></simple-fields-field>
        <div class="buttons">
          <paper-button
            on-click="_gitImportSite"
            class="action-button"
            dialog-confirm
            id="importsite"
            raised
            ><iron-icon icon="icons:home"></iron-icon> Import</paper-button
          >
          <paper-button class="action-button" dialog-dismiss
            ><iron-icon icon="icons:thumb-down"></iron-icon>
            Cancel</paper-button
          >
        </div>
      </paper-dialog>
      <paper-dialog id="settingsdialog">
        <h2 class="dialog-header">Edit HAXCMS configuration</h2>
        <paper-dialog-scrollable>
          <simple-fields
            id="settingsform"
            schematizer="[[HaxSchematizer]]"
            elementizer="[[HaxElementizer]]"
          >
          </simple-fields>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button
            on-click="_saveConfig"
            dialog-confirm
            id="saveconfig"
            class="action-button"
            raised
            ><iron-icon icon="icons:save"></iron-icon> Save</paper-button
          >
          <paper-button class="action-button" dialog-dismiss
            ><iron-icon icon="icons:thumb-down"></iron-icon>
            Cancel</paper-button
          >
        </div>
      </paper-dialog>
    `;
  }
  /**
   * Parse JSON Outline Schema for the items and bind that to sites
   */

  _sitesResponseChanged(newValue, oldValue) {
    if (newValue) {
      if (typeof newValue.items !== typeof undefined) {
        this.title = newValue.title;
        this.set("sites", []);
        this.set("sites", newValue.items);
        this.shadowRoot.querySelector("jos-render").items = newValue.items;
        this.notifyPath("sites.*");
      }
    }
  }

  cleanLocation(location) {
    if (location) {
      return location
        .replace("/_sites/", "")
        .replace("/sites/", "")
        .replace("/", "");
    }
    return location;
  }

  static get properties() {
    return {
      __loading: {
        type: Boolean
      },
      /**
       * Object, JSON Outline Schema format
       */
      sitesResponse: {
        type: Object,
        notify: true,
        observer: "_sitesResponseChanged"
      },
      method: {
        type: String,
        value: "POST"
      },

      /**
       * Title
       */
      title: {
        type: String,
        value: "My sites"
      },
      sites: {
        type: Array,
        notify: true
      },

      /**
       * Base path of where this is located.
       */
      basePath: {
        type: String
      },

      /**
       * If we should hide the login button all the time or not
       */
      hideLogin: {
        type: Boolean,
        value: false
      },

      /**
       * If we should hide the login button all the time or not
       */
      hideGlobalSettings: {
        type: Boolean,
        value: false
      },

      /**
       * Data Source to power the loading of sites in JSON Outline Schema format.
       */
      dataSource: {
        type: String,
        observer: "_dataSourceChanged"
      },

      /**
       * JSON Web token
       */
      jwt: {
        type: String,
        notify: true,
        observer: "_jwtChanged"
      },
      userData: {
        type: Object,
        value: {},
        observer: "_userDataChanged"
      },

      /**
       * Request params for creating a new site
       */
      createParams: {
        type: Object,
        value: {}
      },
      downloadParams: {
        type: Object,
        value: {}
      },
      deleteParams: {
        type: Object,
        value: {}
      },
      cloneParams: {
        type: Object,
        value: {}
      },
      publishParams: {
        type: Object,
        value: {}
      },
      syncParams: {
        type: Object,
        value: {}
      },
      archiveParams: {
        type: Object,
        value: {}
      },
      configParams: {
        type: Object,
        value: {}
      },
      setConfigParams: {
        type: Object,
        value: {}
      },
      getUserDataParams: {
        type: Object,
        value: {}
      },
      activeOpertion: {
        type: String
      },
      HaxSchematizer: {
        type: Object
      },
      HaxElementizer: {
        type: Object
      },
      selectedItems: {
        type: Array,
        value: [],
        observer: "_selectedItemsChanged"
      },

      /**
       * Active item that's being reviewed / has bubbled up.
       */
      activeItem: {
        type: Object,
        notify: true
      },

      /**
       * Logged in state
       */
      loggedIn: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
        observer: "_loggedInChanged"
      },

      /**
       * Edit mode
       */
      editMode: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        value: false,
        observer: "_editModeChanged"
      },
      hideCamera: {
        type: Boolean,
        value: false
      },
      logoutPhoto: {
        type: String,
        value: false
      }
    };
  }

  _userDataChanged(newValue) {
    if (newValue.userName) {
      this.title = newValue.userName + " sites";
    }
    if (newValue.userPicture) {
      this.logoutPhoto = newValue.userPicture;
    }
  }
  /**
   * Show the login button if we have cause
   */

  showSpecialButtons(hideButton, loggedIn) {
    if (hideButton) {
      return false;
    }

    if (!loggedIn) {
      return false;
    }

    return true;
  }

  _selectedItemsChanged(newValue) {
    if (newValue && newValue.length > 0) {
      this.shadowRoot.querySelector("#ops").removeAttribute("hidden");
    } else {
      this.shadowRoot.querySelector("#ops").setAttribute("hidden", "hidden");
    }
  }

  _dataSourceChanged(newValue) {
    if (newValue) {
      this._dataSource = newValue + "?" + Math.floor(Date.now() / 1000);
    }
  }
  /**
   * Request a user login if we need one or log out
   */

  _jwtLoggedIn(e) {
    if (e.detail) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
  /**
   * A token refresh just failed so force to login prompt / state
   */
  _tokenRefreshFailed(e) {
    if (e.detail.value.status == 401) {
      this.jwt = null;
      this.loggedIn = false;
    }
  }
  /**
   * Request a user login if we need one or log out
   */

  _editModeChanged(newValue) {
    if (newValue) {
      this.__editIcon = "icons:check";
    } else {
      this.__editIcon = "icons:create";
    }
  }
  /**
   * Open the new dialog when tapped
   */

  _addTap() {
    this._resetNewSiteForm();

    this.shadowRoot.querySelector("#createsite").opened = true;
  }
  /**
   * Open the import dialog when tapped
   */

  _importTap() {
    this.shadowRoot.querySelector("#importurl").value = "";
    this.shadowRoot.querySelector("#importsite").opened = true;
  }
  /**
   * Login state changed
   */

  _loggedInChanged(newValue, oldValue) {
    if (typeof oldValue !== typeof undefined) {
      if (newValue) {
        document.body.setAttribute("data-logged-in", "data-logged-in");
        this.__loginText = "Log out";
        this.__loginIcon = "icons:account-circle";
        this.standardResponse("Welcome, log in successful!");
        this.shadowRoot.querySelector("#add").hidden = false;
      } else {
        document.body.removeAttribute("data-logged-in");
        this.__loginText = "Log in";
        this.__loginIcon = "icons:power-settings-new";
        this.standardResponse("You logged out");
        this.shadowRoot.querySelector("#add").hidden = true;
      }
    }
  }
  /**
   * Request a user login if we need one or log out
   */

  _jwtChanged(newValue) {
    if (newValue) {
      this.__loginText = "Log out";
      this.__loginIcon = "icons:account-circle"; // see if we should update the photo from the webcam
      // this value is available if we hit camera snap earlier in the operation

      if (this.__cameraBlob) {
        let file = new File(
          [this.__cameraBlob],
          "userPhoto" + Date.now() + ".jpg"
        );
        this.shadowRoot.querySelector("#fileupload").target =
          this.__setUserPhotoPath + "&jwt=" + newValue;
        this.shadowRoot.querySelector("#fileupload")._addFile(file);
        this.shadowRoot.querySelector("#fileupload").uploadFiles();
      } // refresh user data request, delay this in case we uploaded a photo
      // @todo this is a lazy way of doing this

      setTimeout(() => {
        this.set("getUserDataParams", {});
        this.set("getUserDataParams", {
          jwt: newValue
        });
        this.notifyPath("getUserDataParams.*");
        this.shadowRoot.querySelector("#getuserdatarequest").generateRequest();
      }, 500);
    } else {
      this.__loginText = "Log in";
      this.__loginIcon = "icons:power-settings-new";
    }
  }
  /**
   * Toggle edit state
   */

  _editTap(e) {
    this.editMode = !this.editMode;
  }
  /**
   * _settingsTap
   */
  _settingsTap(e) {
    this._loadConfig();

    this.shadowRoot.querySelector("#settingsdialog").opened = true;
  }
  /**
   * force the request to regenerate
   */

  refreshData(e) {
    this.shadowRoot.querySelector("#loaddata").generateRequest();
  }

  _gridSelectedItemsChanged(e) {
    // skip splicing, just rebuild whole object
    this.set("selectedItems", []);
    this.set(
      "selectedItems",
      this.shadowRoot.querySelector("#grid").selectedItems
    );
  }
  /**
   * Attached life cycle
   */

  connectedCallback() {
    super.connectedCallback(); // if we're on an insecure environment, hide the buttons for camera
    window.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this)
    );
    window.addEventListener("jwt-token", this.updateJwt.bind(this));
    if (!navigator.mediaDevices) {
      this.shadowRoot.querySelector("#snap").style.display = "none";
      this.shadowRoot.querySelector("#newsnap").style.display = "none";
    }
    // detect upload utilized
    this.shadowRoot
      .querySelector("#fileupload")
      .addEventListener(
        "upload-response",
        this.handleSetUserPhotoResponse.bind(this)
      );

    if (this.jwt) {
      this.loggedIn = true;
    }

    window.addEventListener(
      "sites-listing-refresh-data",
      this.refreshData.bind(this)
    );
    setTimeout(() => {
      /**
       * These are our bad actors in polyfill'ed browsers.
       * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
       * explains things but basically if shadow-dom is polyfilled
       * then we can't safely execute a DOM manipulating execCommand.
       * This
       */
      if (document.head.createShadowRoot || document.head.attachShadow) {
      } else {
        console.warn("Shadow DOM missing, ALL YOUR IE R BELONG TO US");
        console.warn(
          "HAXCMS DOES NOT LOVE YOUR OLD BROWSER FOR EDITING JUST VIEWING"
        );
        console.warn("You get no authoring experience. Good day to you!");
        const evt = new CustomEvent("simple-toast-show", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            text:
              "WARNING: You are using a polyfilled browser. HAXcms requires modern browsers, please upgrade or switch to a modern browser to edit in HAXcms!",
            duration: 10000
          }
        });
        this.dispatchEvent(evt);
      }

      if (this.hideCamera) {
        this.shadowRoot.querySelector("#newsnap").classList.add("hide-camera");
        this.shadowRoot.querySelector("#snap").classList.add("hide-camera");
        this.shadowRoot.querySelector("#camera").classList.add("hide-camera");
      } else {
        import("@lrnwebcomponents/simple-login/lib/simple-login-camera.js");
      }

      this.addEventListener(
        "simple-login-login",
        this.loginPromptEvent.bind(this)
      );
      this.shadowRoot
        .querySelector("#grid")
        .addEventListener(
          "selected-items-changed",
          this._gridSelectedItemsChanged.bind(this)
        );
      this.__loginPath = window.appSettings.login;
      this.__refreshPath = window.appSettings.refreshUrl;
      this.__logoutPath = window.appSettings.logout;
      this.__setConfigPath = window.appSettings.setConfigPath;
      this.__getUserDataPath = window.appSettings.getUserDataPath;
      this.__setUserPhotoPath = window.appSettings.setUserPhotoPath;
      this.__getConfigPath = window.appSettings.getConfigPath;
      this.__createNewSitePath = window.appSettings.createNewSitePath;
      this.__gitImportSitePath = window.appSettings.gitImportSitePath;
      this.__downloadSitePath = window.appSettings.downloadSitePath;
      this.__archiveSitePath = window.appSettings.archiveSitePath;
      this.__cloneSitePath = window.appSettings.cloneSitePath;
      this.__publishSitePath = window.appSettings.publishSitePath;
      this.__syncSitePath = window.appSettings.syncSitePath;
      this.__revertSitePath = window.appSettings.revertSitePath;
      this.__deleteSitePath = window.appSettings.deleteSitePath; // case where backend has set the JWT ahead of time
      // useful for systems that are managing login above HAXcms

      if (window.appSettings.jwt) {
        this.set("jwt", window.appSettings.jwt);
      }

      document.body.addEventListener(
        "haxcms-load-site",
        this.loadActiveSite.bind(this)
      );
      this.shadowRoot
        .querySelector("#snap")
        .addEventListener("click", this.snapPhoto.bind(this));
      this.shadowRoot
        .querySelector("#newsnap")
        .addEventListener("click", this.clearPhoto.bind(this));
    }, 0);
  }

  async snapPhoto(e) {
    const camera = this.shadowRoot.querySelector("#camera"); // snap the photo to a blob

    this.__cameraBlob = await camera.takeASnap().then(camera.imageBlob); // make an img to show on screen

    let img = document.createElement("img"); // turn blob into a url to visualize locally

    img.src = URL.createObjectURL(this.__cameraBlob);
    camera.removeAttribute("autoplay");
    const selfie = this.shadowRoot.querySelector("#selfie");
    selfie.innerHTML = ""; // append to dom so they see the photo

    selfie.appendChild(img);
    selfie.classList.add("has-snap");
  }

  clearPhoto(e) {
    const camera = this.shadowRoot.querySelector("#camera");
    camera.setAttribute("autoplay", "autoplay");
    const selfie = this.shadowRoot.querySelector("#selfie");
    selfie.innerHTML = "";
    selfie.classList.remove("has-snap");
  }

  /**
   * User login brokering event to sent off to jwt-login events
   */
  loginPromptEvent(e) {
    this._loginUserRoutine({
      u: e.detail.u,
      p: e.detail.p
    });
  }
  _logoutUserRoutine() {
    this.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: {}
      })
    );
  }
  _loginUserRoutine(detail) {
    this.dispatchEvent(
      new CustomEvent("jwt-login-login", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: detail
      })
    );
  }
  /**
   * queue up the site creation form
   */

  _resetNewSiteForm() {
    // establish the theme options based on globals that were set
    let themeOptions = [];
    let firstTheme = null;

    for (var theme in window.appSettings.themes) {
      themeOptions[theme] = window.appSettings.themes[theme].name;

      if (!firstTheme) {
        firstTheme = theme;
      }
    }

    const fields = this.shadowRoot.querySelector("#createsitefields");
    fields.fields = [
      {
        property: "id",
        title: "id",
        description: "",
        inputMethod: "boolean",
        hidden: true
      },
      {
        property: "manifest",
        inputMethod: "tabs",
        properties: [
          {
            property: "site",
            title: "Site details",
            properties: [
              {
                property: "name",
                title: "Site name",
                description:
                  "This forms the folder name and metadata title for the site",
                inputMethod: "textfield",
                required: true
              },
              {
                property: "theme",
                title: "Theme",
                description: "Design for presenting your new site",
                inputMethod: "select",
                allowNull: false,
                options: themeOptions,
                required: true
              },
              {
                property: "description",
                title: "Description (optional)",
                description:
                  "Addition detail, for personal use as well as search engine optimization",
                inputMethod: "textfield"
              } /*,
              {
                property: "domain",
                title: "URL (optional)",
                description: "Optional domain name",
                inputMethod: "textfield"
              }*/
            ]
          },
          {
            property: "theme",
            title: "Theme settings",
            properties: [
              /*              {
                property: "image",
                title: "Image",
                description:
                  "The image is typically used as the banner in themes",
                inputMethod: "fileupload",
                validationType: "url",
                disabled: true
              },*/
              {
                property: "icon",
                title: "Pick an icon.",
                description:
                  "The icon is used in some designs areas to help you know what site your on",
                inputMethod: "iconpicker"
              },
              {
                property: "color",
                title: "Color",
                description:
                  "Choose a primary color to tint the UI or be used in the theme",
                inputMethod: "colorpicker"
              }
            ]
          }
        ]
      }
    ];
    fields.value = {
      id: false,
      manifest: {
        site: {
          name: "",
          description: "",
          //domain: "",
          theme: firstTheme
        },
        theme: {
          //image: "assets/banner.jpg",
          color: "blue",
          icon: "icons:add-circle-outline"
        }
      }
    };
  }
  /**
   * detached life cycle
   */

  disconnectedCallback() {
    window.removeEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this)
    );
    window.removeEventListener("jwt-token", this.updateJwt.bind(this));
    window.removeEventListener(
      "sites-listing-refresh-data",
      this.refreshData.bind(this)
    );
    document.body.removeEventListener(
      "haxcms-load-site",
      this.loadActiveSite.bind(this)
    );
    this.removeEventListener(
      "simple-login-login",
      this.loginPromptEvent.bind(this)
    );
    this.shadowRoot
      .querySelector("#snap")
      .removeEventListener("click", this.snapPhoto.bind(this));
    this.shadowRoot
      .querySelector("#newsnap")
      .removeEventListener("click", this.clearPhoto.bind(this));
    this.shadowRoot
      .querySelector("#grid")
      .removeEventListener(
        "selected-items-changed",
        this._gridSelectedItemsChanged.bind(this)
      );
    this.shadowRoot
      .querySelector("#jwt")
      .removeEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Ready life cycle
   */

  ready() {
    super.ready();
    this.shadowRoot
      .querySelector("#jwt")
      .addEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this));
    setTimeout(() => {
      this.shadowRoot
        .querySelector('[modal-id="help"]')
        .associateEvents(this.shadowRoot.querySelector("#help"));
    }, 0);
    window.JSONOutlineSchema.requestAvailability();
    window.SimpleModal.requestAvailability();
    window.SimpleToast.requestAvailability();
    const jos = this.shadowRoot.querySelector("jos-render");
    jos.map = {
      tag: "course-card",
      path: "@lrnwebcomponents/product-card/lib/course-card.js",
      properties: {
        number: "title",
        name: function(item) {
          return item.slug
            ? item.slug
                .replace("/_sites/", "")
                .replace("/sites/", "")
                .replace("/", "")
            : "";
        },
        zoom: true,
        url: "location",
        image: function(item) {
          if (item.metadata.site && item.metadata.site.logo) {
            return item.slug + item.metadata.site.logo.replace(" ", "%20");
          }
          return item.slug + "assets/banner.jpg";
        },
        icon: function(item) {
          if (
            item.metadata.theme &&
            item.metadata.theme.variables &&
            item.metadata.theme.variables.icon
          ) {
            return item.metadata.theme.variables.icon;
          }
          return "icons:android";
        },
        author: function(item) {
          if (item.metadata.author && item.metadata.author.name) {
            return item.metadata.author.name;
          }
          return "";
        },
        accentColor: function(item) {
          if (
            item.metadata.theme &&
            item.metadata.theme.variables &&
            item.metadata.theme.variables.cssVariable
          ) {
            return item.metadata.theme.variables.cssVariable
              .replace("--simple-colors-default-theme-", "")
              .replace("-7", "");
          }
          return "";
        },
        size: "small",
        dark: true,
        alt: function(item) {
          return "Select to access " + item.title;
        }
      }
    };
  }
  /**
   * Simple method of loading whatever's been dictated as active.
   */

  loadActiveSite(e) {
    let findSite = this.sites.filter(site => {
      if (site.id !== e.detail.id) {
        return false;
      }

      return true;
    });
    let item = findSite.pop(); // if location isn't there, push out to it

    if (item.slug) {
      window.open(item.slug);
    } else {
      window.open(this.basePath + "_sites/" + item.metadata.site.name + "/");
    }
  }
  /**
   * Import a site from a git repo
   */

  _gitImportSite(e) {
    let values = Object.assign({
      jwt: this.jwt,
      site: {
        git: {
          url: this.shadowRoot.querySelector("#importurl").value
        }
      }
    });
    this.set("gitImportParams", {});
    this.set("gitImportParams", values);
    this.notifyPath("gitImportParams.*");
    this.shadowRoot.querySelector("#gitimportrequest").generateRequest();
  }
  /**
   * Create a new site button was clicked
   */

  _createSite(e) {
    let values = Object.assign(
      {
        jwt: this.jwt
      },
      this.shadowRoot.querySelector("#createsitefields").value.manifest
    );
    this.set("createParams", {});
    this.set("createParams", values);
    this.notifyPath("createParams.*");
    this.shadowRoot.querySelector("#createrequest").generateRequest();
  }
  /**
   * Download site button was hit, package and send a zip
   */

  async _downloadSites(e) {
    this.set("downloadParams", {});
    this.set("downloadParams", {
      jwt: this.jwt,
      site: {}
    });
    this.notifyPath("downloadParams.*");

    for (var i in this.selectedItems) {
      this.set("activeItem", {});
      this.set("activeItem", this.selectedItems[i]);
      this.set(
        "downloadParams.site.name",
        this.selectedItems[i].metadata.site.name
      );
      this.notifyPath("downloadParams.site.name");
      await this.shadowRoot.querySelector("#downloadrequest").generateRequest();
    }
  }
  /**
   * Archive sites
   */

  async _archiveSites(e) {
    this.set("archiveParams", {});
    this.set("archiveParams", {
      jwt: this.jwt,
      site: {}
    });
    this.notifyPath("archiveParams.*");

    for (var i in this.selectedItems) {
      this.set("activeItem", {});
      this.set("activeItem", this.selectedItems[i]);
      this.set(
        "archiveParams.site.name",
        this.selectedItems[i].metadata.site.name
      );
      this.notifyPath("archiveParams.site.name");
      await this.shadowRoot.querySelector("#archiverequest").generateRequest();
    }
  }
  /**
   * Confirm delete
   */

  _bulkSitesConfirm(e) {
    let target = false;
    // resolve what got clicked on
    if (e.target.id) {
      target = e.target.id;
    } else if (!e.path && e.originalTarget) {
      if (e.originalTarget.id) {
        target = e.originalTarget.id;
      } else {
        target = e.originalTarget.parentElement.id;
      }
    } else {
      let path = e.path;
      while (!target && path && path.length > 0) {
        if (path[0].id) {
          target = path[0].id;
        }
        path.shift();
      }
    }
    this.activeOpertion = target;
    this.shadowRoot.querySelector("#confirm").opened = true;
  }

  async _confirmBulkOperation(e) {
    await this["_" + this.activeOpertion + "Sites"]();
    this.activeOpertion = "";
    this.shadowRoot.querySelector("#grid").set("selectedItems", []);
  }
  /**
   * Delete sites
   */

  async _deleteSites(e) {
    this.set("deleteParams", {});
    this.set("deleteParams", {
      jwt: this.jwt,
      site: {}
    });
    this.notifyPath("deleteParams.*");

    for (var i in this.selectedItems) {
      this.set("activeItem", {});
      this.set("activeItem", this.selectedItems[i]);
      this.set(
        "deleteParams.site.name",
        this.selectedItems[i].metadata.site.name
      );
      this.notifyPath("deleteParams.site.name");
      await this.shadowRoot.querySelector("#deleterequest").generateRequest();
    }
  }
  /**
   * Clone sites
   */

  async _cloneSites(e) {
    this.set("cloneParams", {});
    this.set("cloneParams", {
      jwt: this.jwt,
      site: {}
    });
    this.notifyPath("cloneParams.*");

    for (var i in this.selectedItems) {
      this.set("activeItem", {});
      this.set("activeItem", this.selectedItems[i]);
      this.set(
        "cloneParams.site.name",
        this.selectedItems[i].metadata.site.name
      );
      this.notifyPath("cloneParams.site.name");
      await this.shadowRoot.querySelector("#clonerequest").generateRequest();
    }
  }
  /**
   * Clone sites
   */

  async _publishSites(e) {
    this.set("publishParams", {});
    this.set("publishParams", {
      jwt: this.jwt,
      site: {}
    });
    this.notifyPath("publishParams.*");

    for (var i in this.selectedItems) {
      this.set("activeItem", {});
      this.set("activeItem", this.selectedItems[i]);
      this.set(
        "publishParams.site.name",
        this.selectedItems[i].metadata.site.name
      );
      this.notifyPath("publishParams.site.name");
      await this.shadowRoot.querySelector("#publishrequest").generateRequest();
    }
  }
  /**
   * sync sites
   */

  async _syncSites(e) {
    this.set("syncParams", {});
    this.set("syncParams", {
      jwt: this.jwt,
      site: {}
    });
    this.notifyPath("syncParams.*");

    for (var i in this.selectedItems) {
      this.set("activeItem", {});
      this.set("activeItem", this.selectedItems[i]);
      this.set(
        "syncParams.site.name",
        this.selectedItems[i].metadata.site.name
      );
      this.notifyPath("syncParams.site.name");
      await this.shadowRoot.querySelector("#syncrequest").generateRequest();
    }
  }
  /**
   * Load configuration
   */

  _loadConfig() {
    // pass along the jwt for user "session" purposes
    this.set("configParams", {});
    this.set("configParams", {
      jwt: this.jwt,
      token: this.createParams.token
    });
    this.notifyPath("configParams.*");
    this.shadowRoot.querySelector("#getconfigrequest").generateRequest();
  }
  /**
   * Save configuration
   */

  _saveConfig(e) {
    window.HAXCMS.config.values = this.shadowRoot.querySelector(
      "#settingsform"
    ).value;
    this.set("setConfigParams", {});
    this.set("setConfigParams", {
      jwt: this.jwt,
      token: this.createParams.token,
      values: window.HAXCMS.config.values
    });
    this.notifyPath("setConfigParams.*");
    this.shadowRoot.querySelector("#setconfigrequest").generateRequest();
  }
  /**
   * Standard response that refreshes the listing too
   */

  standardResponse(toast, refresh = true) {
    if (refresh) {
      this.dispatchEvent(
        new CustomEvent("sites-listing-refresh-data", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true
        })
      );
    }

    this.dispatchEvent(
      new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: toast,
          duration: 2000
        }
      })
    );
  }
  /**
   * Create a new site button was clicked
   */

  handleCreateResponse(e) {
    // update the listing data
    this._dataSource = this.dataSource + "?" + Math.floor(Date.now() / 1000);
    this.standardResponse(e.detail.response.title + " created!");
  }
  /**
   * Git import site response
   */

  handleGitImportResponse(e) {
    // update the listing data
    this._dataSource = this.dataSource + "?" + Math.floor(Date.now() / 1000);
    this.standardResponse(e.detail.response.title + " imported!");
  }

  handleConfigResponse(e) {
    window.HAXCMS.config = e.detail.response;
    this.shadowRoot.querySelector("#settingsform").schema = {};
    this.shadowRoot.querySelector("#settingsform").schema =
      window.HAXCMS.config.schema;
    this.shadowRoot.querySelector("#settingsform").value = {};
    this.shadowRoot.querySelector("#settingsform").value =
      window.HAXCMS.config.values;
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  }

  handleSetConfigResponse(e) {
    this.shadowRoot.querySelector("#settingsdialog").opened = false;
    this.standardResponse("HAXCMS configuration updated!");
  }
  /**
   * Load user data up from the backend
   */

  handleGetUserDataResponse(e) {
    this.userData = e.detail.response.data;
  }
  /**
   * Callback after saving a photo to the backend
   */

  handleSetUserPhotoResponse(e) {
    // remove this once we've saved it
    delete this.__cameraBlob;
    this.standardResponse("User photo saved!", false);
  }
  /**
   * Download a site
   */

  handleDownloadResponse(e) {
    let element = document.createElement("a");
    element.setAttribute("href", e.detail.response.link);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.standardResponse(this.activeItem.title + " downloaded!");
  }

  handleArchiveResponse(e) {
    this.standardResponse(this.activeItem.title + " archived!");
  }

  handleDeleteResponse(e) {
    this.standardResponse(this.activeItem.title + " deleted!");
  }

  handleCloneResponse(e) {
    this.standardResponse(this.activeItem.title + " cloned!");
  }

  handlePublishResponse(e) {
    this.standardResponse(this.activeItem.title + " published!");
  }

  handleSyncResponse(e) {
    this.standardResponse(this.activeItem.title + " published!");
  }

  /**
   * Handle the last error rolling in
   */
  lastErrorChanged(e) {
    if (e.detail.value) {
      let target = null;
      if (e.path && e.path[0]) {
        target = e.path[0];
      } else if (e.originalTarget) {
        target = e.originalTarget;
      } else {
        target = e.target;
      }
      // check for JWT needing refreshed vs busted but must be 403
      switch (parseInt(e.detail.value.status)) {
        // cookie data not found, need to go get it
        case 401:
          this.dispatchEvent(
            new CustomEvent("jwt-login-logout", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                redirect: true
              }
            })
          );
          break;
        case 403:
          // if this was a 403 it should be because of a bad jwt
          // or out of date one. let's kick off a call to get a new one
          // hopefully from the timing token, knowing this ALSO could kick
          // over here.
          this.dispatchEvent(
            new CustomEvent("jwt-login-refresh-token", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                element: {
                  obj: this,
                  callback: "refreshRequest",
                  params: [target]
                }
              }
            })
          );
          break;
        default:
          console.error(e);
          const evt = new CustomEvent("simple-toast-show", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              text: e.detail.value.status + " " + e.detail.value.statusText
            }
          });
          window.dispatchEvent(evt);
          break;
      }
    }
  }
  updateJwt(e) {
    this.jwt = e.detail;
  }
  /**
   * Attempt to salvage the request that was kicked off
   * when our JWT needed refreshed
   */
  refreshRequest(jwt, element) {
    // force the jwt to be the updated jwt
    // this helps avoid any possible event timing issue
    this.jwt = jwt;
    element.body.jwt = jwt;
    setTimeout(() => {
      element.generateRequest();
    }, 0);
  }
}

window.customElements.define(HAXCMSSiteListing.tag, HAXCMSSiteListing);
export { HAXCMSSiteListing };
