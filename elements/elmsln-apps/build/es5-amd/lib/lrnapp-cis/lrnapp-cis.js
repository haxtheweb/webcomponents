define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/paper-item/paper-item.js",
  "../../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../../node_modules/@polymer/iron-list/iron-list.js",
  "../../node_modules/@polymer/iron-pages/iron-pages.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@polymer/paper-toast/paper-toast.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-course-banner/lrndesign-course-banner.js",
  "../../node_modules/@lrnwebcomponents/lrn-icon/lrn-icon.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js",
  "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js",
  "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./lrnapp-cis-course-card.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _ironAjax,
  _paperItem,
  _paperListbox,
  _paperDropdownMenu,
  _appToolbar,
  _ironList,
  _ironPages,
  _appLocation,
  _appRoute,
  _paperButton,
  _paperToast,
  _elmslnLoading,
  _lrndesignCourseBanner,
  _lrnIcon,
  _lrnsysButton,
  _lrndesignAvatar,
  _lrnsysDialog,
  _responsiveGridCol,
  _responsiveGridRow,
  _materializecssStyles,
  _lrnappCisCourseCard
) {
  "use strict";
  function _templateObject_5edc8bf0f77011e8b89b0519890f95da() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        align-content: center;\n      }\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: 0.9;\n        padding: 4em 0 0 0;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n      iron-selector {\n        line-height: 1em;\n      }\n      iron-selector lrnsys-button {\n        display: inline-flex;\n      }\n      paper-button.coursecard-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      paper-button.coursecard-wrapper:focus {\n        outline: blue solid 1px;\n      }\n      lrnapp-cis-course-card {\n        padding: 0;\n        margin: 1em;\n        height: 15em;\n        width: 14em;\n      }\n      .courses-grid {\n        margin: 0 auto;\n        width: 95%;\n      }\n      .iron-selected .display-mode {\n        background-color: #ff6f00;\n        color: white;\n      }\n      .iron-list-container {\n        display: flex;\n        flex-direction: column;\n        min-height: 50vh;\n      }\n      iron-list {\n        flex: 1 1 auto;\n      }\n      .dialog-header {\n        height: unset !important;\n        padding: 0 !important;\n      }\n      .course-dialog-heading.lrndesign-course-banner {\n        font-size: 1em;\n        height: 4em !important;\n      }\n      #coursedetails {\n        margin-top: 1em;\n      }\n      #confirm {\n        max-width: 400px;\n        max-height: 300px;\n      }\n      .buttons {\n        text-align: center;\n      }\n      .buttons paper-button {\n        width: 10em;\n        height: 4em;\n      }\n      .dialog-body {\n        padding: 1em;\n        font-size: 1.8em;\n        text-align: center;\n        margin: 0 auto;\n      }\n      .dialog-body lrn-icon.service-confirm-icon {\n        width: 5em;\n        height: 5em;\n      }\n      .dialog-body responsive-grid-col {\n        height: 4.5em;\n      }\n      .dialog-body lrndesign-avatar.service-confirm-icon {\n        display: inline-block;\n      }\n    </style>\n    <iron-ajax\n      auto=""\n      url="[[sourcePath]]"\n      params=""\n      handle-as="json"\n      last-response="{{_cisResponse}}"\n      on-response="_handleResponse"\n    ></iron-ajax>\n    <iron-ajax\n      url="[[courseDataPath]]"\n      params="[[_courseDataParams]]"\n      handle-as="json"\n      id="courserequest"\n      last-response="{{_courseResponse}}"\n      on-response="_handleCourseResponse"\n    ></iron-ajax>\n    <iron-ajax\n      url="[[makeServicePath]]"\n      params=""\n      handle-as="json"\n      id="makeservice"\n      last-response="{{_makeServiceResponse}}"\n      on-response="_handleMakeServiceResponse"\n    ></iron-ajax>\n    <div id="loading">\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n      <h3>Loading..</h3>\n    </div>\n    <app-toolbar class="">\n      <span main-title=""></span>\n      <span\n        top-item=""\n        style="text-align:right;font-size:.5em;padding-right:1em;"\n        >Displaying [[courses.length]] of [[originalCourses.length]]</span\n      >\n      <paper-dropdown-menu label="Course" hidden$="[[!courses]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.course}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item>-- Any --</paper-item>\n          <template\n            is="dom-repeat"\n            items="[[_toArray(originalCourses)]]"\n            as="course"\n          >\n            <paper-item item-id="[[course.id]]"\n              >[[course.attributes.name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Program" hidden$="[[!programs]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.program}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item>-- Any --</paper-item>\n          <template is="dom-repeat" items="[[_toArray(programs)]]" as="program">\n            <paper-item item-id="[[program.id]]"\n              >[[program.attributes.name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Academic home" hidden$="[[!academics]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.academic}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item>-- Any --</paper-item>\n          <template\n            is="dom-repeat"\n            items="[[_toArray(academics)]]"\n            as="academic"\n          >\n            <paper-item item-id="[[academic.id]]"\n              >[[academic.attributes.name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n    </app-toolbar>\n    <div class="courses-grid">\n      <iron-pages\n        selected="{{data.page}}"\n        attr-for-selected="name"\n        fallback-selection="courses"\n        role="main"\n      >\n        <div class="iron-list-container" name="courses">\n          <iron-list id="ironlist" items="[[courses]]" as="course" grid="">\n            <template>\n              <paper-button\n                data-course-id$="[[course.id]]"\n                class="coursecard-wrapper"\n                on-tap="_loadCourseUrl"\n              >\n                <lrnapp-cis-course-card\n                  elevation="2"\n                  data-course-id$="[[course.id]]"\n                  name="[[course.attributes.name]]"\n                  image="[[course.attributes.image]]"\n                  title="[[course.attributes.title]]"\n                  color="[[course.attributes.color]]"\n                >\n                </lrnapp-cis-course-card>\n              </paper-button>\n            </template>\n          </iron-list>\n        </div>\n      </iron-pages>\n    </div>\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n    <lrnsys-dialog tabindex="-1" id="dialog" disable-auto-focus="">\n      <div slot="content">\n        <div id="loadingCourse" class="loading">\n          <h3>Loading..</h3>\n          <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n        </div>\n      </div>\n      <div class="dialog-header" slot="header">\n        <lrndesign-course-banner\n          image="[[activeCourse.attributes.image]]"\n          name="[[activeCourse.attributes.name]]"\n          title="[[activeCourse.attributes.title]]"\n          color="[[activeCourse.attributes.color]] darken-4"\n        >\n        </lrndesign-course-banner>\n      </div>\n      <div id="coursedetails" slot="content">\n        <responsive-grid-row gutter="5">\n          <responsive-grid-col xl="6" lg="6" md="6" sm="12" xs="12">\n            <div class="column">\n              <h4>Details</h4>\n              <ul>\n                <li\n                  hidden$="[[!activeCourse.relationships.academic.attributes.name]]"\n                >\n                  Academic unit:\n                  [[activeCourse.relationships.academic.attributes.name]]\n                </li>\n                <li\n                  hidden$="[[!activeCourse.relationships.program.attributes.name]]"\n                >\n                  Program:\n                  [[activeCourse.relationships.program.attributes.name]]\n                </li>\n              </ul>\n              <h4>Learning Network</h4>\n              <template\n                is="dom-repeat"\n                items="[[activeCourse.topology.Network]]"\n                as="service"\n              >\n                <template is="dom-if" if="[[!service._exists]]">\n                  <lrnsys-button\n                    raised=""\n                    on-tap="_makeService"\n                    color="grey lighten-4"\n                    icon-class="grey lighten-5"\n                    data-machine-name$="[[service.machine_name]]"\n                  >\n                    <lrn-icon\n                      data-machine-name$="[[service.machine_name]]"\n                      icon="[[service.icon]]"\n                      class="elmsln-hover-icon"\n                    ></lrn-icon>\n                    <span data-machine-name$="[[service.machine_name]]"\n                      >Make the [[service.title]] service</span\n                    >\n                  </lrnsys-button>\n                </template>\n                <template is="dom-if" if="[[service._exists]]">\n                  <lrnsys-button\n                    raised=""\n                    href="[[service.url]]"\n                    hover-class="[[service.color]] lighten-4"\n                  >\n                    <lrn-icon\n                      icon="[[service.icon]]"\n                      class="elmsln-hover-icon"\n                    ></lrn-icon>\n                    <span>[[service.title]]</span>\n                  </lrnsys-button>\n                </template>\n              </template>\n            </div>\n          </responsive-grid-col>\n          <responsive-grid-col xl="6" lg="6" md="6" sm="12" xs="12">\n            <div class="column">\n              <h4>Operations</h4>\n              <template is="dom-if" if="[[activeCourse.meta.canUpdate]]">\n                <lrnsys-button\n                  raised=""\n                  href="[[activeCourse.uris.edit]]"\n                  label="Edit"\n                  hover-class="green lighten-4"\n                  icon="create"\n                ></lrnsys-button>\n                <lrnsys-button\n                  raised=""\n                  href="[[activeCourse.uris.addOffering]]"\n                  label="Add offering"\n                  hover-class="amber lighten-3"\n                  icon="icons:add"\n                ></lrnsys-button>\n              </template>\n              <lrnsys-button\n                raised=""\n                href="[[activeCourse.uris.offerings]]"\n                label="Offerings"\n                hover-class="amber lighten-4"\n                icon="social:people"\n              ></lrnsys-button>\n              <lrnsys-button\n                raised=""\n                href="[[activeCourse.uris.sync]]"\n                label="Sync Roster"\n                hover-class="amber lighten-4"\n                icon="notification:sync"\n              ></lrnsys-button>\n              <lrnsys-button\n                raised=""\n                href="[[activeCourse.uris.uri]]"\n                label="Course page (legacy)"\n                hover-class="brown lighten-4"\n                icon="delete"\n              ></lrnsys-button>\n              <template is="dom-if" if="[[activeCourse.meta.canDelete]]">\n                <div\n                  style="padding: 1em;width: 100%;margin: .5em 0;display: block;background-color:#FF2222;color:#ffffff;border: 1px solid #222222;"\n                >\n                  <h4>Danger zone</h4>\n                  <lrnsys-button\n                    raised=""\n                    href="[[activeCourse.uris.delete]]"\n                    label="Delete"\n                    hover-class="red lighten-1"\n                    color="red lighten-3"\n                    icon="delete"\n                  ></lrnsys-button>\n                </div>\n              </template>\n            </div>\n          </responsive-grid-col>\n        </responsive-grid-row>\n        <p>[[activeCourse.attributes.body]]</p>\n      </div>\n    </lrnsys-dialog>\n    <lrnsys-dialog id="confirm">\n      <div class="dialog-header" slot="header">\n        Add this to the\n        <strong>[[activeCourse.attributes.title]]</strong> network?\n      </div>\n      <div class="dialog-body">\n        <responsive-grid-row gutter="5">\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n          <responsive-grid-col xl="1" lg="1" md="1" sm="1" xs="1"\n            >Add</responsive-grid-col\n          >\n          <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2"\n            ><lrn-icon\n              icon="[[_activeService.icon]]"\n              class$="[[_activeService.color]]-text elmsln-hover-icon service-confirm-icon"\n            ></lrn-icon\n          ></responsive-grid-col>\n          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"\n            ><strong>[[_activeService.title]]</strong></responsive-grid-col\n          >\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n        </responsive-grid-row>\n        <responsive-grid-row gutter="5">\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n          <responsive-grid-col xl="1" lg="1" md="1" sm="1" xs="1"\n            >To</responsive-grid-col\n          >\n          <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2"\n            ><lrndesign-avatar\n              class="service-confirm-icon"\n              label="[[activeCourse.attributes.name]]"\n              jdenticon=""\n              color="[[activeCourse.attributes.color]] darken-4"\n            >\n            </lrndesign-avatar\n          ></responsive-grid-col>\n          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"\n            ><strong\n              >[[activeCourse.attributes.title]]</strong\n            ></responsive-grid-col\n          >\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n        </responsive-grid-row>\n        <div style="margin-top:1em;">This will take a few moments.</div>\n      </div>\n      <div class="buttons">\n        <paper-button\n          raised=""\n          dialog-confirm=""\n          autofocus=""\n          on-tap="_confirmBuild"\n          class="green"\n          >Let\'s do it!</paper-button\n        >\n        <paper-button dialog-dismiss="" class="red-text"\n          >Oops, go back.</paper-button\n        >\n      </div>\n    </lrnsys-dialog>\n    <paper-toast id="toast"></paper-toast>\n  '
      ],
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        align-content: center;\n      }\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: 0.9;\n        padding: 4em 0 0 0;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n      iron-selector {\n        line-height: 1em;\n      }\n      iron-selector lrnsys-button {\n        display: inline-flex;\n      }\n      paper-button.coursecard-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      paper-button.coursecard-wrapper:focus {\n        outline: blue solid 1px;\n      }\n      lrnapp-cis-course-card {\n        padding: 0;\n        margin: 1em;\n        height: 15em;\n        width: 14em;\n      }\n      .courses-grid {\n        margin: 0 auto;\n        width: 95%;\n      }\n      .iron-selected .display-mode {\n        background-color: #ff6f00;\n        color: white;\n      }\n      .iron-list-container {\n        display: flex;\n        flex-direction: column;\n        min-height: 50vh;\n      }\n      iron-list {\n        flex: 1 1 auto;\n      }\n      .dialog-header {\n        height: unset !important;\n        padding: 0 !important;\n      }\n      .course-dialog-heading.lrndesign-course-banner {\n        font-size: 1em;\n        height: 4em !important;\n      }\n      #coursedetails {\n        margin-top: 1em;\n      }\n      #confirm {\n        max-width: 400px;\n        max-height: 300px;\n      }\n      .buttons {\n        text-align: center;\n      }\n      .buttons paper-button {\n        width: 10em;\n        height: 4em;\n      }\n      .dialog-body {\n        padding: 1em;\n        font-size: 1.8em;\n        text-align: center;\n        margin: 0 auto;\n      }\n      .dialog-body lrn-icon.service-confirm-icon {\n        width: 5em;\n        height: 5em;\n      }\n      .dialog-body responsive-grid-col {\n        height: 4.5em;\n      }\n      .dialog-body lrndesign-avatar.service-confirm-icon {\n        display: inline-block;\n      }\n    </style>\n    <iron-ajax\n      auto=""\n      url="[[sourcePath]]"\n      params=""\n      handle-as="json"\n      last-response="{{_cisResponse}}"\n      on-response="_handleResponse"\n    ></iron-ajax>\n    <iron-ajax\n      url="[[courseDataPath]]"\n      params="[[_courseDataParams]]"\n      handle-as="json"\n      id="courserequest"\n      last-response="{{_courseResponse}}"\n      on-response="_handleCourseResponse"\n    ></iron-ajax>\n    <iron-ajax\n      url="[[makeServicePath]]"\n      params=""\n      handle-as="json"\n      id="makeservice"\n      last-response="{{_makeServiceResponse}}"\n      on-response="_handleMakeServiceResponse"\n    ></iron-ajax>\n    <div id="loading">\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n      <h3>Loading..</h3>\n    </div>\n    <app-toolbar class="">\n      <span main-title=""></span>\n      <span\n        top-item=""\n        style="text-align:right;font-size:.5em;padding-right:1em;"\n        >Displaying [[courses.length]] of [[originalCourses.length]]</span\n      >\n      <paper-dropdown-menu label="Course" hidden\\$="[[!courses]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.course}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item>-- Any --</paper-item>\n          <template\n            is="dom-repeat"\n            items="[[_toArray(originalCourses)]]"\n            as="course"\n          >\n            <paper-item item-id="[[course.id]]"\n              >[[course.attributes.name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Program" hidden\\$="[[!programs]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.program}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item>-- Any --</paper-item>\n          <template is="dom-repeat" items="[[_toArray(programs)]]" as="program">\n            <paper-item item-id="[[program.id]]"\n              >[[program.attributes.name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Academic home" hidden\\$="[[!academics]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.academic}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item>-- Any --</paper-item>\n          <template\n            is="dom-repeat"\n            items="[[_toArray(academics)]]"\n            as="academic"\n          >\n            <paper-item item-id="[[academic.id]]"\n              >[[academic.attributes.name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n    </app-toolbar>\n    <div class="courses-grid">\n      <iron-pages\n        selected="{{data.page}}"\n        attr-for-selected="name"\n        fallback-selection="courses"\n        role="main"\n      >\n        <div class="iron-list-container" name="courses">\n          <iron-list id="ironlist" items="[[courses]]" as="course" grid="">\n            <template>\n              <paper-button\n                data-course-id\\$="[[course.id]]"\n                class="coursecard-wrapper"\n                on-tap="_loadCourseUrl"\n              >\n                <lrnapp-cis-course-card\n                  elevation="2"\n                  data-course-id\\$="[[course.id]]"\n                  name="[[course.attributes.name]]"\n                  image="[[course.attributes.image]]"\n                  title="[[course.attributes.title]]"\n                  color="[[course.attributes.color]]"\n                >\n                </lrnapp-cis-course-card>\n              </paper-button>\n            </template>\n          </iron-list>\n        </div>\n      </iron-pages>\n    </div>\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n    <lrnsys-dialog tabindex="-1" id="dialog" disable-auto-focus="">\n      <div slot="content">\n        <div id="loadingCourse" class="loading">\n          <h3>Loading..</h3>\n          <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n        </div>\n      </div>\n      <div class="dialog-header" slot="header">\n        <lrndesign-course-banner\n          image="[[activeCourse.attributes.image]]"\n          name="[[activeCourse.attributes.name]]"\n          title="[[activeCourse.attributes.title]]"\n          color="[[activeCourse.attributes.color]] darken-4"\n        >\n        </lrndesign-course-banner>\n      </div>\n      <div id="coursedetails" slot="content">\n        <responsive-grid-row gutter="5">\n          <responsive-grid-col xl="6" lg="6" md="6" sm="12" xs="12">\n            <div class="column">\n              <h4>Details</h4>\n              <ul>\n                <li\n                  hidden\\$="[[!activeCourse.relationships.academic.attributes.name]]"\n                >\n                  Academic unit:\n                  [[activeCourse.relationships.academic.attributes.name]]\n                </li>\n                <li\n                  hidden\\$="[[!activeCourse.relationships.program.attributes.name]]"\n                >\n                  Program:\n                  [[activeCourse.relationships.program.attributes.name]]\n                </li>\n              </ul>\n              <h4>Learning Network</h4>\n              <template\n                is="dom-repeat"\n                items="[[activeCourse.topology.Network]]"\n                as="service"\n              >\n                <template is="dom-if" if="[[!service._exists]]">\n                  <lrnsys-button\n                    raised=""\n                    on-tap="_makeService"\n                    color="grey lighten-4"\n                    icon-class="grey lighten-5"\n                    data-machine-name\\$="[[service.machine_name]]"\n                  >\n                    <lrn-icon\n                      data-machine-name\\$="[[service.machine_name]]"\n                      icon="[[service.icon]]"\n                      class="elmsln-hover-icon"\n                    ></lrn-icon>\n                    <span data-machine-name\\$="[[service.machine_name]]"\n                      >Make the [[service.title]] service</span\n                    >\n                  </lrnsys-button>\n                </template>\n                <template is="dom-if" if="[[service._exists]]">\n                  <lrnsys-button\n                    raised=""\n                    href="[[service.url]]"\n                    hover-class="[[service.color]] lighten-4"\n                  >\n                    <lrn-icon\n                      icon="[[service.icon]]"\n                      class="elmsln-hover-icon"\n                    ></lrn-icon>\n                    <span>[[service.title]]</span>\n                  </lrnsys-button>\n                </template>\n              </template>\n            </div>\n          </responsive-grid-col>\n          <responsive-grid-col xl="6" lg="6" md="6" sm="12" xs="12">\n            <div class="column">\n              <h4>Operations</h4>\n              <template is="dom-if" if="[[activeCourse.meta.canUpdate]]">\n                <lrnsys-button\n                  raised=""\n                  href="[[activeCourse.uris.edit]]"\n                  label="Edit"\n                  hover-class="green lighten-4"\n                  icon="create"\n                ></lrnsys-button>\n                <lrnsys-button\n                  raised=""\n                  href="[[activeCourse.uris.addOffering]]"\n                  label="Add offering"\n                  hover-class="amber lighten-3"\n                  icon="icons:add"\n                ></lrnsys-button>\n              </template>\n              <lrnsys-button\n                raised=""\n                href="[[activeCourse.uris.offerings]]"\n                label="Offerings"\n                hover-class="amber lighten-4"\n                icon="social:people"\n              ></lrnsys-button>\n              <lrnsys-button\n                raised=""\n                href="[[activeCourse.uris.sync]]"\n                label="Sync Roster"\n                hover-class="amber lighten-4"\n                icon="notification:sync"\n              ></lrnsys-button>\n              <lrnsys-button\n                raised=""\n                href="[[activeCourse.uris.uri]]"\n                label="Course page (legacy)"\n                hover-class="brown lighten-4"\n                icon="delete"\n              ></lrnsys-button>\n              <template is="dom-if" if="[[activeCourse.meta.canDelete]]">\n                <div\n                  style="padding: 1em;width: 100%;margin: .5em 0;display: block;background-color:#FF2222;color:#ffffff;border: 1px solid #222222;"\n                >\n                  <h4>Danger zone</h4>\n                  <lrnsys-button\n                    raised=""\n                    href="[[activeCourse.uris.delete]]"\n                    label="Delete"\n                    hover-class="red lighten-1"\n                    color="red lighten-3"\n                    icon="delete"\n                  ></lrnsys-button>\n                </div>\n              </template>\n            </div>\n          </responsive-grid-col>\n        </responsive-grid-row>\n        <p>[[activeCourse.attributes.body]]</p>\n      </div>\n    </lrnsys-dialog>\n    <lrnsys-dialog id="confirm">\n      <div class="dialog-header" slot="header">\n        Add this to the\n        <strong>[[activeCourse.attributes.title]]</strong> network?\n      </div>\n      <div class="dialog-body">\n        <responsive-grid-row gutter="5">\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n          <responsive-grid-col xl="1" lg="1" md="1" sm="1" xs="1"\n            >Add</responsive-grid-col\n          >\n          <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2"\n            ><lrn-icon\n              icon="[[_activeService.icon]]"\n              class\\$="[[_activeService.color]]-text elmsln-hover-icon service-confirm-icon"\n            ></lrn-icon\n          ></responsive-grid-col>\n          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"\n            ><strong>[[_activeService.title]]</strong></responsive-grid-col\n          >\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n        </responsive-grid-row>\n        <responsive-grid-row gutter="5">\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n          <responsive-grid-col xl="1" lg="1" md="1" sm="1" xs="1"\n            >To</responsive-grid-col\n          >\n          <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2"\n            ><lrndesign-avatar\n              class="service-confirm-icon"\n              label="[[activeCourse.attributes.name]]"\n              jdenticon=""\n              color="[[activeCourse.attributes.color]] darken-4"\n            >\n            </lrndesign-avatar\n          ></responsive-grid-col>\n          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"\n            ><strong\n              >[[activeCourse.attributes.title]]</strong\n            ></responsive-grid-col\n          >\n          <responsive-grid-col\n            xl="3"\n            lg="3"\n            md="3"\n            sm="3"\n            xs="3"\n          ></responsive-grid-col>\n        </responsive-grid-row>\n        <div style="margin-top:1em;">This will take a few moments.</div>\n      </div>\n      <div class="buttons">\n        <paper-button\n          raised=""\n          dialog-confirm=""\n          autofocus=""\n          on-tap="_confirmBuild"\n          class="green"\n          >Let\'s do it!</paper-button\n        >\n        <paper-button dialog-dismiss="" class="red-text"\n          >Oops, go back.</paper-button\n        >\n      </div>\n    </lrnsys-dialog>\n    <paper-toast id="toast"></paper-toast>\n  '
      ]
    );
    _templateObject_5edc8bf0f77011e8b89b0519890f95da = function _templateObject_5edc8bf0f77011e8b89b0519890f95da() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5edc8bf0f77011e8b89b0519890f95da()
    ),
    is: "lrnapp-cis",
    properties: {
      _cisResponse: { type: Object },
      _courseResponse: { type: Object },
      _makeServiceResponse: { type: Object },
      courses: {
        type: Array,
        value: [],
        computed: "_coursesCompute(originalCourses, queryParams)"
      },
      originalCourses: { type: Array, value: [], notify: !0 },
      programs: { type: Array, value: [] },
      academics: { type: Array, value: [] },
      sourcePath: { type: String },
      courseDataPath: { type: String },
      makeServicePath: { type: String },
      endPoint: { type: String, value: "/" },
      basePath: { type: String, value: "/" },
      activeCourse: { type: Array, value: null },
      queryParams: { type: Object, notify: !0 }
    },
    listeners: { "route-change": "_routeChange" },
    observers: ["_routeChanged(route, endPoint)"],
    _routeChanged: function _routeChanged(route, endPoint) {
      if ("string" === typeof route.path) {
        if ("string" === typeof endPoint) {
          if (route.path.startsWith(endPoint) || "/" == route.path) {
            return;
          }
        }
        this.$.loading.hidden = !1;
        window.location.reload();
      }
    },
    _routeChange: function _routeChange(e) {
      var details = e.detail;
      if (
        babelHelpers.typeof(details.queryParams.course) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("queryParams.course", details.queryParams.course);
      }
      if (
        babelHelpers.typeof(details.queryParams.academic) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("queryParams.academic", details.queryParams.academic);
      }
      if (
        babelHelpers.typeof(details.queryParams.program) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("queryParams.program", details.queryParams.program);
      }
      if (
        babelHelpers.typeof(details.data.page) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("data.page", details.data.page);
      }
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    },
    _handleMakeServiceResponse: function _handleMakeServiceResponse(event) {
      var response = this._makeServiceResponse,
        activeCourse = this.__addServiceLinks(response.data.course);
      this.set("activeCourse", []);
      this.set("activeCourse", activeCourse);
      this.$.toast.show(response.message);
    },
    _handleCourseResponse: function _handleCourseResponse(event) {
      var activeCourse = this._courseResponse.data.course;
      this.__addServiceLinks(activeCourse);
      this.set("activeCourse", []);
      this.set("activeCourse", activeCourse);
      this.$.loadingCourse.hidden = !0;
    },
    __addServiceLinks: function __addServiceLinks(courseObject) {
      if (
        babelHelpers.typeof(courseObject.topology.Network) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        courseObject.topology.Network = {};
      }
      for (var key in this.services) {
        if (
          babelHelpers.typeof(
            courseObject.topology.Network[
              this.services[key].attributes.machine_name
            ]
          ) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          courseObject.topology.Network[
            this.services[key].attributes.machine_name
          ] = {
            color: this.services[key].attributes.color,
            distro: this.services[key].attributes.distro,
            icon: this.services[key].attributes.icon,
            machine_name: this.services[key].attributes.machine_name,
            title: this.services[key].attributes.title,
            url: this.services[key].attributes.url,
            weight: this.services[key].attributes.weight,
            _exists: !1
          };
        }
      }
      courseObject.topology.Network = this._toArray(
        courseObject.topology.Network
      );
      courseObject.topology.Network.sort(function(a, b) {
        return a.weight - b.weight;
      });
      return courseObject;
    },
    _handleResponse: function _handleResponse(event) {
      var course = {},
        program = {},
        academic = {},
        tmp = { courses: [], programs: [], academics: [] },
        programs = [],
        academics = [],
        courses = this._toArray(this._cisResponse.data.courses);
      this.set("services", this._toArray(this._cisResponse.data.services));
      this.set("originalCourses", courses);
      for (var index = 0; index < courses.length; index++) {
        course = courses[index];
        program = courses[index].relationships.program;
        academic = courses[index].relationships.academic;
        tmp.programs[program.id] = program;
        tmp.academics[academic.id] = academic;
        tmp.courses[course.id] = course;
      }
      tmp.programs.forEach(function(element) {
        programs.push(element);
      });
      tmp.academics.forEach(function(element) {
        academics.push(element);
      });
      this.$.loading.hidden = !0;
      this.set("academics", academics);
      this.set("programs", programs);
    },
    _makeService: function _makeService(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        active = normalizedEvent.localTarget.getAttribute("data-machine-name"),
        network = this.activeCourse.topology.Network,
        service = network.filter(function(service) {
          if (service.machine_name !== active) {
            return !1;
          }
          return !0;
        });
      if (0 < service.length) {
        service = service.pop();
        this.$.makeservice.params = {
          course: this.activeCourse.attributes.machine_name,
          service: service.machine_name
        };
        this._activeService = service;
        this.$.confirm.toggleDialog();
      } else {
        console.log("that was not a valid service..");
      }
    },
    _confirmBuild: function _confirmBuild(e) {
      this.$.makeservice.generateRequest();
    },
    attached: function attached() {
      document.body.addEventListener(
        "lrnsys-dialog-modal-closed",
        this._accessibleFocus.bind(this)
      );
    },
    _accessibleFocus: function _accessibleFocus(e) {
      this.__rememberClick.focus();
    },
    _loadCourseUrl: function _loadCourseUrl(e) {
      this.__rememberClick = e.target;
      this.$.loadingCourse.hidden = !1;
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        active = local.getAttribute("data-course-id"),
        findCourse = this.originalCourses.filter(function(course) {
          if (course.id !== active) {
            return !1;
          }
          return !0;
        });
      if (0 < findCourse.length) {
        findCourse = findCourse.pop();
      }
      this.activeCourse = findCourse;
      this._courseDataParams = { id: this.activeCourse.id };
      this.$.courserequest.generateRequest();
      this.$.dialog.toggleDialog();
    },
    _coursesCompute: function _coursesCompute(originalCourses, queryParams) {
      var _this = this;
      if ("undefined" === typeof originalCourses) {
        return [];
      }
      var root = this,
        filteredCourses = [];
      filteredCourses = originalCourses.filter(function(course) {
        if ("undefined" !== typeof root.queryParams.course) {
          if (course.id !== root.queryParams.course) {
            return !1;
          }
        }
        if ("undefined" !== typeof root.queryParams.program) {
          if (course.relationships.program.id !== root.queryParams.program) {
            return !1;
          }
        }
        if ("undefined" !== typeof root.queryParams.academic) {
          if (course.relationships.academic.id !== root.queryParams.academic) {
            return !1;
          }
        }
        return !0;
      });
      setTimeout(function() {
        _this.$.ironlist.fire("iron-resize");
      }, 200);
      return filteredCourses;
    }
  });
});
