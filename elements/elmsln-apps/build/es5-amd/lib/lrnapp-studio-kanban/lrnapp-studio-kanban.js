define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/iron-icon/iron-icon.js",
  "../../node_modules/@polymer/paper-badge/paper-badge.js",
  "../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js",
  "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../../node_modules/@polymer/paper-card/paper-card.js",
  "../../node_modules/@polymer/iron-list/iron-list.js",
  "../../node_modules/@polymer/paper-toast/paper-toast.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-render-html/lrnsys-render-html.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./lrnapp-studio-project-button.js",
  "./lrnapp-studio-assignment-button.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _ironAjax,
  _appLocation,
  _appRoute,
  _ironIcon,
  _paperBadge,
  _paperToggleButton,
  _appToolbar,
  _paperCard,
  _ironList,
  _paperToast,
  _paperButton,
  _paperDialog,
  _lrnsysRenderHtml,
  _lrnsysDialog,
  _lrnsysButton,
  _elmslnLoading,
  _materializecssStyles,
  _lrnappStudioProjectButton,
  _lrnappStudioAssignmentButton
) {
  "use strict";
  function _templateObject_511c3860f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n      }\n\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: 0.8;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n\n      .projects-container {\n        -webkit-box-pack: start;\n        -ms-flex-pack: start;\n        justify-content: flex-start;\n        -webkit-box-align: start;\n        -ms-flex-align: start;\n        align-items: flex-start;\n        min-height: 30em;\n        width: 150vw;\n        padding-top: 1em;\n      }\n\n      .projects-window {\n        width: 100vw;\n        overflow-x: scroll;\n        overflow-y: hidden;\n        scrollbar-face-color: #833900;\n        scrollbar-shadow-color: #ffc107;\n        scrollbar-highlight-color: #ffc107;\n        scrollbar-3dlight-color: #ffc107;\n        scrollbar-darkshadow-color: #ffc107;\n        scrollbar-track-color: #ffc107;\n        scrollbar-arrow-color: #ffc107;\n      }\n\n      .projects-window::-webkit-scrollbar-track {\n        background-color: #833900;\n      }\n      /* the new scrollbar will have a flat appearance with the set background color */\n\n      .projects-window::-webkit-scrollbar-thumb {\n        background-color: #ffc107;\n      }\n      /* this will style the thumb, ignoring the track */\n\n      .projects-window::-webkit-scrollbar-button {\n        background-color: #833900;\n      }\n      /* optionally, you can style the top and the bottom buttons (left and right for horizontal bars) */\n\n      .projects-window::-webkit-scrollbar-corner {\n        background-color: #833900;\n      }\n      /* if both the vertical and the horizontal bars appear, then perhaps the right bottom corner*/\n\n      .projects-window::-webkit-scrollbar {\n        width: 1rem;\n        height: 1rem;\n      }\n      /* this targets the default scrollbar (compulsory) */\n\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 1rem;\n      }\n\n      .project-card {\n        width: 100%;\n        min-width: 20em;\n        max-width: 20em;\n        margin: 0;\n        height: 100%;\n        min-height: 10em;\n      }\n      .project-container {\n        padding: 1em;\n      }\n      .project-card .card-content {\n        height: 100%;\n        min-height: 8em;\n        max-height: 10em;\n        overflow: scroll;\n      }\n\n      .project-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 1em;\n      }\n\n      .project-operations .operation {\n        display: inline-flex;\n        height: 2.5em;\n        width: 2.5em;\n      }\n      .project-operations .operation[hidden] {\n        display: none;\n      }\n\n      .assignment-row {\n        border: 1px solid #000000;\n        background-color: #ffffff;\n      }\n\n      .assignment-row .assignment-row-button.active {\n        background-color: var(--paper-amber-50);\n        font-weight: bold;\n      }\n\n      .assignment-row:hover .assignment-operations {\n        display: block;\n        overflow: visible;\n        margin: 0.2em;\n      }\n\n      .assignment-row-button {\n        width: 100%;\n        justify-content: flex-start;\n        height: 3em;\n        text-transform: none;\n      }\n\n      .status-indicator {\n        border-right: 1px solid grey;\n        padding: 0.5em;\n        margin: 0 0.5em 0 0;\n        display: inline-flex;\n        line-height: 2em;\n        height: 2em;\n        justify-content: center;\n        align-items: center;\n      }\n\n      .button-contents {\n        display: flex;\n        align-content: center;\n      }\n\n      .assignment-title {\n        display: inline-flex;\n        align-items: center;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        line-height: 1em;\n      }\n\n      .assignment-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 0;\n        display: none;\n      }\n\n      .assignment-operations.show {\n        display: block;\n        overflow: visible;\n      }\n\n      .assignment-operations .operation {\n        display: inline-flex;\n        width: 2.5em;\n        height: 2.5em;\n      }\n      .assignment-operations .operation[hidden] {\n        display: none;\n      }\n\n      lrnapp-studio-project-button {\n        margin: 0em auto 1em;\n        max-width: 20em;\n      }\n    </style>\n    <iron-ajax\n      auto=""\n      id="projectbackend"\n      url="[[sourcePath]]"\n      handle-as="json"\n      last-response="{{projectResponse}}"\n      on-response="_handleProjectResponse"\n    >\n    </iron-ajax>\n    <iron-ajax\n      id="backend"\n      url="[[sourcePath]]"\n      params=""\n      handle-as="json"\n      last-response="{{backendResponse}}"\n      on-response="_handleUpdateResponse"\n    >\n    </iron-ajax>\n\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n    <div id="loading">\n      <h3>Loading..</h3>\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n    </div>\n    <lrnapp-studio-project-button\n      hidden$="[[!projectResponse.data.canCreateProjects]]"\n      classes="amber darken-3 white-text"\n      end-point="[[endPoint]]"\n      csrf-token="[[csrfToken]]"\n      icon="add"\n    ></lrnapp-studio-project-button>\n    <div class="projects-window">\n      <iron-list\n        items="[[_toArray(projectResponse.data.projects)]]"\n        as="project"\n        class="projects-container"\n        grid=""\n      >\n        <template class="projects-container-items">\n          <div class="project-container">\n            <paper-card\n              id$="project-[[project.id]]"\n              class="project-card grey lighten-3"\n              heading="{{project.attributes.title}}"\n              elevation="2"\n            >\n              <div class="project-operations">\n                <lrnsys-button\n                  icon-class="no-margin"\n                  id$="project-[[project.id]]-edit"\n                  alt="Edit project"\n                  class="circle operation"\n                  hover-class="amber lighten-2"\n                  hidden="[[!project.meta.canUpdate]]"\n                  icon="create"\n                  on-tap="_makeProjectEditLink"\n                >\n                </lrnsys-button>\n                <lrnapp-studio-assignment-button\n                  project-id="[[project.id]]"\n                  icon-class="no-margin"\n                  id$="project-[[project.id]]-add"\n                  alt="Add assignment"\n                  class="circle operation"\n                  hover-class="amber lighten-2"\n                  hidden="[[!project.meta.canUpdate]]"\n                  icon="add"\n                  end-point="[[endPoint]]"\n                  csrf-token="[[csrfToken]]"\n                >\n                </lrnapp-studio-assignment-button>\n                <lrnsys-button\n                  id$="project-[[project.id]]-delete"\n                  alt="Delete project!"\n                  class="circle operation"\n                  hover-class="red darken-2 white-text"\n                  header="Delete project!"\n                  hidden="[[!project.meta.canDelete]]"\n                  icon="delete-forever"\n                  on-tap="_deleteProjectDialog"\n                  icon-class="no-margin"\n                >\n                </lrnsys-button>\n              </div>\n              <div class="card-content">\n                <iron-list\n                  items="[[_toArray(project.relationships.assignments)]]"\n                  as="assignment"\n                >\n                  <template>\n                    <div class="assignment-row" id="assignment">\n                      <lrnsys-dialog\n                        body-append=""\n                        on-focusin="assignmentFocusIn"\n                        class="assignment-row-button"\n                        id$="assignment-[[project.id]]-[[assignment.id]]"\n                        header="[[assignment.attributes.title]]"\n                        hover-class="amber lighten-5"\n                      >\n                        <span slot="button" class="button-contents">\n                          <div\n                            class$="status-indicator [[assignment.meta.relatedSubmissions.complete.color]]"\n                          >\n                            <iron-icon\n                              icon="[[assignment.meta.relatedSubmissions.complete.icon]]"\n                              disabled$="[[!assignment.meta.relatedSubmissions.canCreate]]"\n                            ></iron-icon>\n                          </div>\n                          <div class="assignment-title">\n                            [[assignment.attributes.title]]\n                          </div>\n                        </span>\n                        <div slot="content">\n                          <app-toolbar\n                            class$="[[assignment.meta.relatedSubmissions.complete.color]]"\n                          >\n                            <div>\n                              <iron-icon\n                                icon="[[assignment.meta.relatedSubmissions.complete.icon]]"\n                                disabled$="[[!assignment.meta.relatedSubmissions.canCreate]]"\n                              ></iron-icon>\n                              [[assignment.meta.relatedSubmissions.complete.submission.title]]\n                            </div>\n                            <div\n                              spacer=""\n                              class="comment-box"\n                              hidden$="[[!assignment.meta.relatedSubmissions.complete.submission.id]]"\n                            >\n                              <paper-button\n                                id$="assignment-[[project.id]]-[[assignment.id]]-comments"\n                                style="margin:0;padding:.25em;text-transform:none;"\n                              >\n                                <iron-icon\n                                  icon="communication:forum"\n                                ></iron-icon>\n                                [[assignment.meta.relatedSubmissions.complete.submission.meta.comments.count]]\n                                Comments\n                              </paper-button>\n                              <paper-badge\n                                hidden$="[[displayNewBadge(assignment.meta.relatedSubmissions.complete.submission.meta.new)]]"\n                                for$="assignment-[[project.id]]-[[assignment.id]]-comments"\n                                label$="[[assignment.meta.relatedSubmissions.complete.submission.meta.comments.new]]"\n                              ></paper-badge>\n                            </div>\n\n                            <lrnapp-studio-submission-button\n                              spacer=""\n                              auto=""\n                              assignment-id="[[assignment.id]]"\n                              submission="{{submission}}"\n                              end-point="[[buildSubmissionPath(basePath)]]"\n                              csrf-token="[[csrfToken]]"\n                              submission-id="[[assignment.meta.relatedSubmissions.complete.submission.id]]"\n                            ></lrnapp-studio-submission-button>\n                            <div main-title=""></div>\n                            <paper-toggle-button\n                              id$="assignment-[[project.id]]-[[assignment.id]]-toggle"\n                              on-tap="statusToggle"\n                            ></paper-toggle-button>\n                            <span\n                              id$="assignment-[[project.id]]-[[assignment.id]]-toggle-text"\n                            ></span>\n                            <div bottom-item="" class="status-rationale">\n                              [[assignment.meta.relatedSubmissions.complete.rationale.text]]\n                            </div>\n                          </app-toolbar>\n                          <lrnsys-render-html\n                            style="padding:2em;"\n                            html="[[assignment.attributes.body]]"\n                          ></lrnsys-render-html>\n                        </div>\n                      </lrnsys-dialog>\n                      <span class="assignment-operations">\n                        <lrnsys-button\n                          id$="assignment-[[project.id]]-[[assignment.id]]-add-critique"\n                          icon="editor:insert-comment"\n                          alt="Add critique"\n                          class="circle operation"\n                          hover-class="green lighten-2"\n                          hidden="[[!assignment.meta.canCritique]]"\n                          href$="[[assignment.meta.critiqueLink]]"\n                          icon-class="no-margin"\n                        ></lrnsys-button>\n                        <lrnsys-button\n                          id$="assignment-[[project.id]]-[[assignment.id]]-edit"\n                          icon="editor:mode-edit"\n                          alt="Edit"\n                          class="circle operation"\n                          hover-class="amber lighten-4"\n                          hidden="[[!assignment.meta.canUpdate]]"\n                          on-tap="_makeAssignmentEditLink"\n                          icon-class="no-margin green-text text-darken-4"\n                        ></lrnsys-button>\n                        <lrnsys-button\n                          id$="assignment-[[project.id]]-[[assignment.id]]-delete"\n                          icon="delete"\n                          alt="Delete"\n                          class="circle operation"\n                          hover-class="amber lighten-4"\n                          hidden="[[!assignment.meta.canDelete]]"\n                          on-tap="_deleteAssignmentDialog"\n                          icon-class="no-margin red-text text-darken-4"\n                        ></lrnsys-button>\n                      </span>\n                    </div>\n                  </template>\n                </iron-list>\n              </div>\n            </paper-card>\n          </div>\n        </template>\n      </iron-list>\n    </div>\n    <paper-toast text="Updated" id="toast"></paper-toast>\n    <paper-dialog id="delete" modal="">\n      <h3>[[_deleteTitle]]</h3>\n      <p>[[_deleteText]]</p>\n      <div class="buttons">\n        <paper-button dialog-dismiss="">Decline</paper-button>\n        <paper-button\n          id="deleteaccept"\n          on-tap="_handleDelete"\n          dialog-confirm=""\n          autofocus=""\n          >Accept</paper-button\n        >\n      </div>\n    </paper-dialog>\n  '
      ],
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n      }\n\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: 0.8;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n\n      .projects-container {\n        -webkit-box-pack: start;\n        -ms-flex-pack: start;\n        justify-content: flex-start;\n        -webkit-box-align: start;\n        -ms-flex-align: start;\n        align-items: flex-start;\n        min-height: 30em;\n        width: 150vw;\n        padding-top: 1em;\n      }\n\n      .projects-window {\n        width: 100vw;\n        overflow-x: scroll;\n        overflow-y: hidden;\n        scrollbar-face-color: #833900;\n        scrollbar-shadow-color: #ffc107;\n        scrollbar-highlight-color: #ffc107;\n        scrollbar-3dlight-color: #ffc107;\n        scrollbar-darkshadow-color: #ffc107;\n        scrollbar-track-color: #ffc107;\n        scrollbar-arrow-color: #ffc107;\n      }\n\n      .projects-window::-webkit-scrollbar-track {\n        background-color: #833900;\n      }\n      /* the new scrollbar will have a flat appearance with the set background color */\n\n      .projects-window::-webkit-scrollbar-thumb {\n        background-color: #ffc107;\n      }\n      /* this will style the thumb, ignoring the track */\n\n      .projects-window::-webkit-scrollbar-button {\n        background-color: #833900;\n      }\n      /* optionally, you can style the top and the bottom buttons (left and right for horizontal bars) */\n\n      .projects-window::-webkit-scrollbar-corner {\n        background-color: #833900;\n      }\n      /* if both the vertical and the horizontal bars appear, then perhaps the right bottom corner*/\n\n      .projects-window::-webkit-scrollbar {\n        width: 1rem;\n        height: 1rem;\n      }\n      /* this targets the default scrollbar (compulsory) */\n\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 1rem;\n      }\n\n      .project-card {\n        width: 100%;\n        min-width: 20em;\n        max-width: 20em;\n        margin: 0;\n        height: 100%;\n        min-height: 10em;\n      }\n      .project-container {\n        padding: 1em;\n      }\n      .project-card .card-content {\n        height: 100%;\n        min-height: 8em;\n        max-height: 10em;\n        overflow: scroll;\n      }\n\n      .project-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 1em;\n      }\n\n      .project-operations .operation {\n        display: inline-flex;\n        height: 2.5em;\n        width: 2.5em;\n      }\n      .project-operations .operation[hidden] {\n        display: none;\n      }\n\n      .assignment-row {\n        border: 1px solid #000000;\n        background-color: #ffffff;\n      }\n\n      .assignment-row .assignment-row-button.active {\n        background-color: var(--paper-amber-50);\n        font-weight: bold;\n      }\n\n      .assignment-row:hover .assignment-operations {\n        display: block;\n        overflow: visible;\n        margin: 0.2em;\n      }\n\n      .assignment-row-button {\n        width: 100%;\n        justify-content: flex-start;\n        height: 3em;\n        text-transform: none;\n      }\n\n      .status-indicator {\n        border-right: 1px solid grey;\n        padding: 0.5em;\n        margin: 0 0.5em 0 0;\n        display: inline-flex;\n        line-height: 2em;\n        height: 2em;\n        justify-content: center;\n        align-items: center;\n      }\n\n      .button-contents {\n        display: flex;\n        align-content: center;\n      }\n\n      .assignment-title {\n        display: inline-flex;\n        align-items: center;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        line-height: 1em;\n      }\n\n      .assignment-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 0;\n        display: none;\n      }\n\n      .assignment-operations.show {\n        display: block;\n        overflow: visible;\n      }\n\n      .assignment-operations .operation {\n        display: inline-flex;\n        width: 2.5em;\n        height: 2.5em;\n      }\n      .assignment-operations .operation[hidden] {\n        display: none;\n      }\n\n      lrnapp-studio-project-button {\n        margin: 0em auto 1em;\n        max-width: 20em;\n      }\n    </style>\n    <iron-ajax\n      auto=""\n      id="projectbackend"\n      url="[[sourcePath]]"\n      handle-as="json"\n      last-response="{{projectResponse}}"\n      on-response="_handleProjectResponse"\n    >\n    </iron-ajax>\n    <iron-ajax\n      id="backend"\n      url="[[sourcePath]]"\n      params=""\n      handle-as="json"\n      last-response="{{backendResponse}}"\n      on-response="_handleUpdateResponse"\n    >\n    </iron-ajax>\n\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n    <div id="loading">\n      <h3>Loading..</h3>\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n    </div>\n    <lrnapp-studio-project-button\n      hidden\\$="[[!projectResponse.data.canCreateProjects]]"\n      classes="amber darken-3 white-text"\n      end-point="[[endPoint]]"\n      csrf-token="[[csrfToken]]"\n      icon="add"\n    ></lrnapp-studio-project-button>\n    <div class="projects-window">\n      <iron-list\n        items="[[_toArray(projectResponse.data.projects)]]"\n        as="project"\n        class="projects-container"\n        grid=""\n      >\n        <template class="projects-container-items">\n          <div class="project-container">\n            <paper-card\n              id\\$="project-[[project.id]]"\n              class="project-card grey lighten-3"\n              heading="{{project.attributes.title}}"\n              elevation="2"\n            >\n              <div class="project-operations">\n                <lrnsys-button\n                  icon-class="no-margin"\n                  id\\$="project-[[project.id]]-edit"\n                  alt="Edit project"\n                  class="circle operation"\n                  hover-class="amber lighten-2"\n                  hidden="[[!project.meta.canUpdate]]"\n                  icon="create"\n                  on-tap="_makeProjectEditLink"\n                >\n                </lrnsys-button>\n                <lrnapp-studio-assignment-button\n                  project-id="[[project.id]]"\n                  icon-class="no-margin"\n                  id\\$="project-[[project.id]]-add"\n                  alt="Add assignment"\n                  class="circle operation"\n                  hover-class="amber lighten-2"\n                  hidden="[[!project.meta.canUpdate]]"\n                  icon="add"\n                  end-point="[[endPoint]]"\n                  csrf-token="[[csrfToken]]"\n                >\n                </lrnapp-studio-assignment-button>\n                <lrnsys-button\n                  id\\$="project-[[project.id]]-delete"\n                  alt="Delete project!"\n                  class="circle operation"\n                  hover-class="red darken-2 white-text"\n                  header="Delete project!"\n                  hidden="[[!project.meta.canDelete]]"\n                  icon="delete-forever"\n                  on-tap="_deleteProjectDialog"\n                  icon-class="no-margin"\n                >\n                </lrnsys-button>\n              </div>\n              <div class="card-content">\n                <iron-list\n                  items="[[_toArray(project.relationships.assignments)]]"\n                  as="assignment"\n                >\n                  <template>\n                    <div class="assignment-row" id="assignment">\n                      <lrnsys-dialog\n                        body-append=""\n                        on-focusin="assignmentFocusIn"\n                        class="assignment-row-button"\n                        id\\$="assignment-[[project.id]]-[[assignment.id]]"\n                        header="[[assignment.attributes.title]]"\n                        hover-class="amber lighten-5"\n                      >\n                        <span slot="button" class="button-contents">\n                          <div\n                            class\\$="status-indicator [[assignment.meta.relatedSubmissions.complete.color]]"\n                          >\n                            <iron-icon\n                              icon="[[assignment.meta.relatedSubmissions.complete.icon]]"\n                              disabled\\$="[[!assignment.meta.relatedSubmissions.canCreate]]"\n                            ></iron-icon>\n                          </div>\n                          <div class="assignment-title">\n                            [[assignment.attributes.title]]\n                          </div>\n                        </span>\n                        <div slot="content">\n                          <app-toolbar\n                            class\\$="[[assignment.meta.relatedSubmissions.complete.color]]"\n                          >\n                            <div>\n                              <iron-icon\n                                icon="[[assignment.meta.relatedSubmissions.complete.icon]]"\n                                disabled\\$="[[!assignment.meta.relatedSubmissions.canCreate]]"\n                              ></iron-icon>\n                              [[assignment.meta.relatedSubmissions.complete.submission.title]]\n                            </div>\n                            <div\n                              spacer=""\n                              class="comment-box"\n                              hidden\\$="[[!assignment.meta.relatedSubmissions.complete.submission.id]]"\n                            >\n                              <paper-button\n                                id\\$="assignment-[[project.id]]-[[assignment.id]]-comments"\n                                style="margin:0;padding:.25em;text-transform:none;"\n                              >\n                                <iron-icon\n                                  icon="communication:forum"\n                                ></iron-icon>\n                                [[assignment.meta.relatedSubmissions.complete.submission.meta.comments.count]]\n                                Comments\n                              </paper-button>\n                              <paper-badge\n                                hidden\\$="[[displayNewBadge(assignment.meta.relatedSubmissions.complete.submission.meta.new)]]"\n                                for\\$="assignment-[[project.id]]-[[assignment.id]]-comments"\n                                label\\$="[[assignment.meta.relatedSubmissions.complete.submission.meta.comments.new]]"\n                              ></paper-badge>\n                            </div>\n\n                            <lrnapp-studio-submission-button\n                              spacer=""\n                              auto=""\n                              assignment-id="[[assignment.id]]"\n                              submission="{{submission}}"\n                              end-point="[[buildSubmissionPath(basePath)]]"\n                              csrf-token="[[csrfToken]]"\n                              submission-id="[[assignment.meta.relatedSubmissions.complete.submission.id]]"\n                            ></lrnapp-studio-submission-button>\n                            <div main-title=""></div>\n                            <paper-toggle-button\n                              id\\$="assignment-[[project.id]]-[[assignment.id]]-toggle"\n                              on-tap="statusToggle"\n                            ></paper-toggle-button>\n                            <span\n                              id\\$="assignment-[[project.id]]-[[assignment.id]]-toggle-text"\n                            ></span>\n                            <div bottom-item="" class="status-rationale">\n                              [[assignment.meta.relatedSubmissions.complete.rationale.text]]\n                            </div>\n                          </app-toolbar>\n                          <lrnsys-render-html\n                            style="padding:2em;"\n                            html="[[assignment.attributes.body]]"\n                          ></lrnsys-render-html>\n                        </div>\n                      </lrnsys-dialog>\n                      <span class="assignment-operations">\n                        <lrnsys-button\n                          id\\$="assignment-[[project.id]]-[[assignment.id]]-add-critique"\n                          icon="editor:insert-comment"\n                          alt="Add critique"\n                          class="circle operation"\n                          hover-class="green lighten-2"\n                          hidden="[[!assignment.meta.canCritique]]"\n                          href\\$="[[assignment.meta.critiqueLink]]"\n                          icon-class="no-margin"\n                        ></lrnsys-button>\n                        <lrnsys-button\n                          id\\$="assignment-[[project.id]]-[[assignment.id]]-edit"\n                          icon="editor:mode-edit"\n                          alt="Edit"\n                          class="circle operation"\n                          hover-class="amber lighten-4"\n                          hidden="[[!assignment.meta.canUpdate]]"\n                          on-tap="_makeAssignmentEditLink"\n                          icon-class="no-margin green-text text-darken-4"\n                        ></lrnsys-button>\n                        <lrnsys-button\n                          id\\$="assignment-[[project.id]]-[[assignment.id]]-delete"\n                          icon="delete"\n                          alt="Delete"\n                          class="circle operation"\n                          hover-class="amber lighten-4"\n                          hidden="[[!assignment.meta.canDelete]]"\n                          on-tap="_deleteAssignmentDialog"\n                          icon-class="no-margin red-text text-darken-4"\n                        ></lrnsys-button>\n                      </span>\n                    </div>\n                  </template>\n                </iron-list>\n              </div>\n            </paper-card>\n          </div>\n        </template>\n      </iron-list>\n    </div>\n    <paper-toast text="Updated" id="toast"></paper-toast>\n    <paper-dialog id="delete" modal="">\n      <h3>[[_deleteTitle]]</h3>\n      <p>[[_deleteText]]</p>\n      <div class="buttons">\n        <paper-button dialog-dismiss="">Decline</paper-button>\n        <paper-button\n          id="deleteaccept"\n          on-tap="_handleDelete"\n          dialog-confirm=""\n          autofocus=""\n          >Accept</paper-button\n        >\n      </div>\n    </paper-dialog>\n  '
      ]
    );
    _templateObject_511c3860f76d11e89310d7f0fbc64afe = function _templateObject_511c3860f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_511c3860f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-studio-kanban",
    properties: {
      activeAssignment: { type: String, value: null, notify: !0 },
      projectToDelete: { type: String, value: null, notify: !0 },
      assignmentToDelete: { type: String, value: null, notify: !0 },
      sourcePath: { type: String, notify: !0 },
      submission: { type: Object, notify: !0 },
      projectResponse: { type: Object, notify: !0 },
      backendResponse: { type: Object, notify: !0 }
    },
    listeners: {
      "project-created": "_handleProjectCreated",
      "assignment-created": "_handleAssignmentCreated"
    },
    observers: [
      "_routeChanged(route, endPoint)",
      "_deleteToast(queryParams.deletetoast)"
    ],
    _routeChanged: function _routeChanged(route, endPoint) {
      if ("string" === typeof route.path) {
        if ("string" === typeof endPoint) {
          if (route.path.startsWith(endPoint)) {
            return;
          }
        }
        window.location = route.path;
      }
    },
    _deleteToast: function _deleteToast(deletetoast, old) {
      if (
        babelHelpers.typeof(deletetoast) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if ("error" == deletetoast) {
          this.$.toast.show("That submission on longer exists!");
        } else {
          this.$.toast.show("Submission deleted successfully!");
        }
        this.set("queryParams.deletetoast", void 0);
        this.notifyPath("queryParams.deletetoast");
      }
    },
    _makeProjectEditLink: function _makeProjectEditLink(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        parts = local.id.split("-");
      window.location.href =
        this.basePath +
        "../node/" +
        parts[1] +
        "/edit?destination=apps/lrnapp-studio-kanban";
    },
    _makeAssignmentEditLink: function _makeAssignmentEditLink(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        parts = local.id.split("-");
      window.location.href =
        this.basePath +
        "../node/" +
        parts[2] +
        "/edit?destination=apps/lrnapp-studio-kanban";
    },
    _deleteProjectDialog: function _deleteProjectDialog(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        parts = local.id.split("-");
      this.projectToDelete = parts[1];
      this._deleteTitle = "Delete project";
      this._deleteText =
        "Are you sure you want to delete this project and all related assignments!?";
      this._deleteType = "project";
      this.$.delete.open();
    },
    _handleDelete: function _handleDelete() {
      if ("project" == this._deleteType) {
        this.$.backend.method = "DELETE";
        this.$.backend.body = this.projectToDelete;
        this.$.backend.url =
          this.endPoint +
          "/api/projects/" +
          this.projectToDelete +
          "?token=" +
          this.csrfToken;
        this.$.backend.generateRequest();
      } else if ("assignment" == this._deleteType) {
        this.$.backend.method = "DELETE";
        this.$.backend.body = this.assignmentToDelete;
        this.$.backend.url =
          this.endPoint +
          "/api/assignments/" +
          this.assignmentToDelete +
          "?token=" +
          this.csrfToken;
        this.$.backend.generateRequest();
      }
    },
    _deleteAssignmentDialog: function _deleteAssignmentDialog(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        parts = local.id.split("-");
      this.assignmentToDelete = parts[2];
      this._deleteTitle = "Delete assignment";
      this._deleteText = "Are you sure you want to delete this assignment?";
      this._deleteType = "assignment";
      this.$.delete.open();
    },
    displayNewBadge: function displayNewBadge(count) {
      if (0 == count) {
        return !0;
      }
      return !1;
    },
    statusToggle: function statusToggle(e) {
      var xhr = this.$.backend,
        parts = this.activeAssignment.split("-"),
        submission = this.projectResponse.data.projects["project-" + parts[1]]
          .relationships.assignments["assignment-" + parts[2]].meta
          .relatedSubmissions.complete;
      if (
        !this.shadowRoot.querySelector("#" + this.activeAssignment + "-toggle")
          .disabled
      ) {
        this.$.loading.hidden = !1;
        xhr.params = {
          submissionid: submission.submission.id,
          status: this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked
        };
        xhr.generateRequest();
      }
    },
    assignmentFocusIn: function assignmentFocusIn(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      if (null != this.activeAssignment && this.activeAssignment != local.id) {
        this.shadowRoot
          .querySelector("#" + this.activeAssignment)
          .nextElementSibling.classList.remove("show");
        this.shadowRoot
          .querySelector("#" + this.activeAssignment)
          .classList.remove("active");
      }
      this.activeAssignment = local.id;
      this._setToggle(!1);
      local.nextElementSibling.classList.add("show");
      local.classList.add("active");
    },
    _handleProjectResponse: function _handleProjectResponse(event) {
      this.$.loading.hidden = !0;
      this._setToggle(!0);
    },
    buildSubmissionPath: function buildSubmissionPath(path) {
      return path + "lrnapp-studio-submission";
    },
    _handleUpdateResponse: function _handleUpdateResponse(event) {
      if (200 == this.backendResponse.status) {
        this.$.toast.text = "Updated successfully";
        this.$.toast.toggle();
        this.$.projectbackend.generateRequest();
      } else {
        this.$.loading.hidden = !0;
      }
    },
    _setToggle: function _setToggle(update) {
      if (null != this.activeAssignment) {
        var parts = this.activeAssignment.split("-"),
          submission = this.projectResponse.data.projects["project-" + parts[1]]
            .relationships.assignments["assignment-" + parts[2]].meta
            .relatedSubmissions.complete;
        if (0 == submission.status && 0 == submission.submission.length) {
          if (!update) {
            this.shadowRoot.querySelector(
              "#" + this.activeAssignment + "-toggle"
            ).disabled = !0;
            this.shadowRoot.querySelector(
              "#" + this.activeAssignment + "-toggle"
            ).checked = !1;
          }
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).title = "Submission not started";
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle-text"
          ).textContent = "Submission not started";
        } else if (0 == submission.status) {
          if (!update) {
            this.shadowRoot.querySelector(
              "#" + this.activeAssignment + "-toggle"
            ).disabled = !1;
            this.shadowRoot.querySelector(
              "#" + this.activeAssignment + "-toggle"
            ).checked = !1;
          }
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).title = "Submission started";
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle-text"
          ).textContent = "Submission in progress";
        } else {
          if (!update) {
            this.shadowRoot.querySelector(
              "#" + this.activeAssignment + "-toggle"
            ).disabled = !1;
            this.shadowRoot.querySelector(
              "#" + this.activeAssignment + "-toggle"
            ).checked = !0;
          }
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).title = "Submission ready";
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle-text"
          ).textContent = "Submission ready";
        }
      }
    },
    _handleProjectCreated: function _handleProjectCreated(e) {
      this.$.toast.text = "Project added";
      this.$.toast.toggle();
      this.$.projectbackend.generateRequest();
    },
    _handleAssignmentCreated: function _handleAssignmentCreated(e) {
      this.$.toast.text = "Assignment added";
      this.$.toast.toggle();
      this.$.projectbackend.generateRequest();
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
