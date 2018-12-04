define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@polymer/polymer/lib/mixins/element-mixin.js",
  "../../node_modules/@polymer/iron-icons/iron-icons.js",
  "../../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../../node_modules/@polymer/paper-styles/color.js",
  "../../node_modules/@lrnwebcomponents/paper-search/lib/paper-search-bar.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@polymer/paper-slider/paper-slider.js",
  "../../node_modules/@polymer/app-layout/app-layout.js",
  "../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "../../node_modules/@polymer/app-layout/app-header/app-header.js",
  "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../../node_modules/@lrnwebcomponents/page-scroll-position/page-scroll-position.js",
  "../../node_modules/@lrnwebcomponents/hax-body/hax-body.js",
  "../../node_modules/@lrnwebcomponents/material-progress/material-progress.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-mapmenu/lrndesign-mapmenu.js",
  "./lrnapp-book-progress-dashboard.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _elementMixin,
  _ironIcons,
  _hardwareIcons,
  _ironAjax,
  _paperIconButton,
  _color,
  _paperSearchBar,
  _paperTooltip,
  _paperSlider,
  _appLayout,
  _appDrawer,
  _appHeader,
  _appToolbar,
  _appScrollEffects,
  _appLocation,
  _appRoute,
  _materializecssStyles,
  _lrndesignStepper,
  _lrnsysProgress,
  _elmslnLoading,
  _pageScrollPosition,
  _haxBody,
  _materialProgress,
  _lrndesignMapmenu,
  _lrnappBookProgressDashboard
) {
  "use strict";
  function _templateObject_50484690f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <custom-style>\n      <style is="custom-style" include="materializecss-styles">\n        :host {\n          display: block;\n          font-size: 16px;\n          box-sizing: content-box;\n        }\n        #toolbar {\n          color: gray;\n          background-color: white;\n          padding: 0 8px;\n          margin: 0;\n          height: auto;\n          box-sizing: content-box;\n          transition: all 0.4s ease;\n        }\n        paper-button {\n          padding: 0;\n          margin: 0;\n          min-width: 16px;\n        }\n        app-drawer {\n          padding: 0;\n          top: 0;\n          bottom: 0;\n          z-index: 1;\n          position: absolute;\n          box-sizing: content-box;\n          --app-drawer-content-container: {\n            background-color: #fafafa;\n            padding: 0;\n            border-right: 1px solid #c8c8c8;\n            overflow-y: scroll;\n            width: 300px !important;\n            box-shadow: 0 76px 8px 0 rgba(0, 0, 0, 0.4);\n            height: 100vh;\n            top: 0;\n            position: sticky;\n          }\n        }\n        lrndesign-stepper-button {\n          --lrndesign-stepper-btn-active: #f6f7f7;\n        }\n        lrndesign-stepper-button ::slotted(paper-button) {\n          margin: 0;\n          height: 48px;\n        }\n        lrndesign-stepper-button ::slotted(.title-container) {\n          padding: 0;\n          width: 100%;\n          right: unset;\n        }\n        lrndesign-stepper-button ::slotted(.node-title) {\n          font-size: 15px;\n          line-height: 24px;\n        }\n\n        .loading {\n          width: 100%;\n          z-index: 1000;\n          opacity: 0.9;\n          text-align: center;\n          align-content: space-around;\n          justify-content: center;\n          position: absolute;\n          background-color: white;\n          padding: 0;\n          margin: 0;\n          display: flex;\n          margin: 0 auto;\n          visibility: visible;\n          transition: visibility 1s, opacity 1s ease;\n        }\n        .loading elmsln-loading {\n          margin: 0 5em;\n          display: inline-flex;\n        }\n        #bodyloading {\n          height: 100%;\n          display: flex;\n          justify-content: center;\n        }\n        #bodyloading .loading,\n        #bodyloading elmsln-loading {\n          display: block;\n          height: 5em;\n        }\n        .outline-title {\n          margin-left: 0.5em;\n          max-width: 50%;\n        }\n        .content-nav-buttons {\n          top: 60%;\n          position: fixed;\n          opacity: 0.8;\n          padding: 0 0.25em;\n          height: 40%;\n          padding-top: 15%;\n          margin-top: -15%;\n        }\n        .content-nav-buttons:hover {\n          opacity: 1;\n        }\n        .prev {\n          left: 0;\n          order: 1;\n        }\n        .next {\n          right: 0;\n          transition: right 0.2s ease;\n          order: 2;\n        }\n        app-header {\n          width: 100%;\n          left: 0 !important;\n          z-index: 2 !important;\n          position: sticky !important;\n        }\n        app-header-layout {\n          margin: 0;\n          padding: 0;\n          width: 100%;\n        }\n        .content-body {\n          position: relative;\n          padding: 0;\n          margin: -3em 4em 5em 4em;\n          font-size: 1.1em;\n          transition: margin 0.4s ease, width 0.4s ease;\n        }\n\n        .content-nav-buttons paper-icon-button {\n          width: 4em;\n          height: 4em;\n          opacity: 0.4;\n          display: block;\n          visibility: visible;\n          transition: opacity 0.4s linear, visibility 1s linear,\n            height 0.4s ease, width 0.4s ease;\n        }\n        .content-nav-buttons paper-icon-button:hover {\n          opacity: 1;\n        }\n        paper-tooltip {\n          --paper-tooltip-opacity: 0.96;\n        }\n        :host([drawer-opened]) .content-nav-buttons paper-icon-button {\n          width: 2.5em;\n          height: 2.5em;\n        }\n        :host([edit-mode]) .content-nav-buttons {\n          opacity: 0;\n          pointer-events: none;\n          visibility: hidden;\n        }\n        .content-title {\n          font-size: 1.4em;\n          margin: 0;\n          padding: 0.25em 0;\n          background-color: white;\n          top: 70px;\n          position: sticky;\n        }\n        .content-current {\n          min-height: 100vh;\n        }\n        .content-next {\n          background-color: grey;\n          opacity: 0.8;\n        }\n        #header {\n          position: sticky;\n          top: 0;\n          left: 0;\n          width: 100%;\n          color: black;\n          background-color: white;\n          z-index: 2;\n          padding: 0;\n          margin: 0;\n          opacity: 1;\n          box-sizing: content-box;\n          transition: all 0.4s ease;\n        }\n        app-drawer-layout {\n          font-family: sans-serif;\n        }\n        :host {\n          --app-drawer-width: 300px;\n        }\n        :host([full-width]) {\n          --app-drawer-width: 0px;\n        }\n        :host([drawer-opened]) .prev,\n        :host([edit-mode]) .prev {\n          left: 17em;\n        }\n        .progress-container {\n          width: 90%;\n          padding: 0;\n          margin: 0 0 0 1em;\n          overflow: visible;\n        }\n\n        [main-title] {\n          font-weight: lighter;\n          padding: 0.6em 0 0 0;\n          margin: 0;\n          height: 3em;\n          overflow-y: scroll;\n        }\n        [hidden] {\n          visibility: hidden !important;\n          opacity: 0 !important;\n          display: block !important;\n        }\n        paper-search-bar[hidden] {\n          display: none !important;\n        }\n        lrnsys-progress {\n          margin-top: 0.5em;\n          padding: 0.2em 0 0 0;\n          box-sizing: content-box;\n        }\n        lrnsys-progress lrnsys-progress-circle {\n          list-style-type: none;\n          box-sizing: content-box;\n        }\n\n        #bookdrawercontent {\n          overflow: scroll;\n          visibility: visible;\n          display: block;\n          opacity: 1;\n          transition: visibility 1s linear, opacity 1s linear;\n        }\n        @media (max-width: 1200px) {\n          :host .content-body {\n            font-size: 0.94em;\n          }\n        }\n        @media (max-width: 960px) {\n          :host .content-body {\n            font-size: 0.92em;\n          }\n        }\n        @media (max-width: 820px) {\n          :host .content-body {\n            font-size: 0.9em;\n          }\n        }\n        @media (max-width: 700px) {\n          :host .content-body {\n            font-size: 0.9em;\n          }\n        }\n        @media (max-width: 639px) {\n          app-drawer-layout {\n            top: 0;\n          }\n          [main-title] {\n            font-size: 0.8em;\n          }\n          .content-title {\n            font-size: 1.1em;\n          }\n          .outline-title {\n            position: absolute !important;\n            clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n            clip: rect(1px, 1px, 1px, 1px);\n            overflow: hidden;\n            height: 1px;\n          }\n          :host .content-body {\n            margin: 0 0.5em;\n            font-size: 0.9em;\n            width: 85%;\n          }\n          .content-nav-buttons {\n            position: relative;\n            display: flex;\n            top: unset;\n            padding: 0;\n            opacity: 0.8;\n            height: unset;\n            margin: 0;\n          }\n          .content-nav {\n            width: 100%;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            vertical-align: middle;\n          }\n          .next {\n            right: unset;\n          }\n        }\n        @media (max-width: 500px) {\n          [main-title] {\n            font-size: 0.7em;\n          }\n        }\n        /**\n       * Authoring section\n       */\n        #editbutton {\n          position: fixed;\n          bottom: 0;\n          right: 0;\n          margin: 2em;\n          padding: 0.5em;\n          width: 1.6em;\n          height: 1.6em;\n          visibility: visible;\n          opacity: 1;\n          transition: all 0.4s ease;\n        }\n        :host([edit-mode]) #editbutton {\n          width: 100%;\n          z-index: 100;\n          right: 0;\n          bottom: 0;\n          border-radius: 0;\n          margin: 0;\n          padding: 1em;\n          background-color: var(--paper-blue-500) !important;\n        }\n        :host([edit-mode]) #header {\n          background-color: var(--paper-grey-500);\n        }\n        :host([edit-mode]) #toolbar {\n          opacity: 0.5;\n        }\n        .your-progress-button {\n          padding-right: 1em;\n        }\n        #mapmenu {\n          padding: 1em 0;\n          overflow-x: hidden;\n        }\n        .course-title-drawer {\n          font-size: 1.2em;\n        }\n        hax-autoloader {\n          display: none;\n        }\n      </style>\n    </custom-style>\n    <page-scroll-position value="{{scrollPosition}}"></page-scroll-position>\n    <div id="anchor"></div>\n    <iron-ajax\n      id="outlineajax"\n      params="[[requestParams]]"\n      url="[[outlinePath]]"\n      handle-as="json"\n      on-response="handleOutlineResponse"\n      last-response="{{outlineData}}"\n    ></iron-ajax>\n    <iron-ajax\n      id="bookajax"\n      params="[[requestParams]]"\n      url="[[bookPath]]"\n      handle-as="json"\n      on-response="handleBookResponse"\n      last-response="{{bookData}}"\n    ></iron-ajax>\n    <iron-ajax\n      id="pageajax"\n      url="[[pagePath]]"\n      params="[[pageParams]]"\n      handle-as="json"\n      on-response="handlePageResponse"\n      last-response="{{pageData}}"\n    ></iron-ajax>\n    <iron-ajax\n      id="pageupdateajax"\n      url="[[pageUpdatePath]]"\n      params="[[pageParams]]"\n      method="PUT"\n      body="[[updatePageData]]"\n      content-type="application/json"\n      handle-as="json"\n      on-response="_handleUpdateResponse"\n    ></iron-ajax>\n    <iron-ajax\n      id="pagedeleteajax"\n      url="[[pageDeletePath]]"\n      params="[[pageParams]]"\n      method="DELETE"\n      content-type="application/json"\n      handle-as="json"\n      on-response="_handleDeleteResponse"\n    ></iron-ajax>\n    <iron-ajax\n      id="pagecreateajax"\n      url="[[pageCreatePath]]"\n      method="POST"\n      body="[[createRequestBody]]"\n      handle-as="json"\n      on-response="_ajaxCreateStubHandler"\n    ></iron-ajax>\n\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:type/:id"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n    <hax-store app-store="[[appStoreConnection]]"></hax-store>\n    <hax-panel\n      id="haxpanel"\n      hide-panel-ops=""\n      hide-export-button=""\n    ></hax-panel>\n    <hax-app-picker></hax-app-picker>\n    <hax-export-dialog></hax-export-dialog>\n    <!-- body where most of the heavy lifting happens -->\n    <app-drawer-layout>\n      <!-- LRNApp book we expect to navigate -->\n      <app-drawer\n        slot="drawer"\n        id="bookdrawer"\n        opened="{{drawerOpened}}"\n        swipe-open=""\n        transition-duration="300"\n      >\n        <div\n          id="bookdrawercontent"\n          style="height: 100%; overflow: auto;"\n          hidden$="[[!bookItems]]"\n        >\n          <paper-search-bar\n            hide-filter-button=""\n            hidden$="[[!showSearch]]"\n          ></paper-search-bar>\n          <lrndesign-mapmenu id="mapmenu" on-tap="_bookOutlineTap">\n            <!-- Server response will populate this -->\n          </lrndesign-mapmenu>\n        </div>\n      </app-drawer>\n      <app-header-layout>\n        <app-header slot="header" id="header" shadow="" fixed="">\n          <div id="outlineloading" class="loading">\n            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>\n            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>\n            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>\n          </div>\n          <app-toolbar id="toolbar" sticky="" class="tall">\n            <div style="pointer-events: auto;" class="menu-btn-wrap">\n              <paper-icon-button\n                style="pointer-events: auto;"\n                title="Content outline"\n                id="menubutton"\n                icon="menu"\n                on-tap="toggleBook"\n              ></paper-icon-button>\n            </div>\n            <div spacer="" class="outline-title">[[outlineTitle]]</div>\n            <div spacer="" main-title="" style="pointer-events: auto;">\n              <div class="progress-container">\n                <lrnsys-progress\n                  sound-finish="[[soundFinish]]"\n                  sound="[[sound]]"\n                  complete-sound="[[completeSound]]"\n                  finished-sound="[[finishedSound]]"\n                  title="The steps to complete this lesson"\n                  id="progress"\n                  active="{{activePage}}"\n                  items="{{outlineItems}}"\n                  progressive-unlock=""\n                  size="small"\n                ></lrnsys-progress>\n              </div>\n            </div>\n            <!-- <div class="your-progress-button">\n              <lrnsys-dialog body-append modal on-tap="progressdashboardopen" header="Your progress" alt="Your progress">\n                <span slot="button"><iron-icon icon="av:equalizer"></iron-icon></span>\n                <div>\n                  <lrnapp-book-progress-dashboard id="progressdashboard" source-path="[[progressDashboardPath]]" route-data="[[data]]"></lrnapp-book-progress-dashboard>\n                </div>\n              </lrnsys-dialog>\n            </div> -->\n          </app-toolbar>\n        </app-header>\n        <div class="content-body">\n          <div id="current" class="content-current">\n            <h2 id="currenttitle" class="content-title">[[currentTitle]]</h2>\n            <div id="bodyloading" class="loading">\n              <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n              <h3 class="loading-text">Loading content..</h3>\n            </div>\n            <div>\n              <hax-body id="haxbody"> <slot id="slottedarea"></slot> </hax-body>\n            </div>\n          </div>\n        </div>\n        <div class="content-nav">\n          <div class="content-nav-buttons next">\n            <paper-icon-button\n              id="next"\n              title="[[nextLabel]]"\n              on-tap="_nextBtn"\n              icon="hardware:keyboard-arrow-right"\n              data-voicecommand="next page"\n              hidden$="[[!hasNextPage]]"\n            ></paper-icon-button>\n            <paper-tooltip\n              for="next"\n              position="left"\n              offset="0"\n              animation-delay="100"\n            >\n              [[nextLabel]]\n            </paper-tooltip>\n          </div>\n          <div class="content-nav-buttons prev">\n            <paper-icon-button\n              id="prev"\n              title="[[prevLabel]]"\n              on-tap="_prevBtn"\n              icon="hardware:keyboard-arrow-left"\n              data-voicecommand="previous page"\n              hidden$="[[!hasPrevPage]]"\n            ></paper-icon-button>\n            <paper-tooltip\n              for="prev"\n              position="right"\n              offset="0"\n              animation-delay="100"\n            >\n              [[prevLabel]]\n            </paper-tooltip>\n          </div>\n        </div>\n      </app-header-layout>\n    </app-drawer-layout>\n    <hax-manager></hax-manager>\n    <!-- edit mode if they have permissions -->\n    <paper-fab\n      id="editbutton"\n      icon="editor:mode-edit"\n      class="red white-text"\n      hidden$="[[!currentPageData.page.meta.canUpdate]]"\n      data-voicecommand="Edit content"\n      on-tap="_toggleEditMode"\n      title="Tap to place content in edit mode."\n    ></paper-fab>\n    <paper-tooltip\n      for="editbutton"\n      position="bottom"\n      offset="8"\n      animation-delay="100"\n    >\n      <span id="fablabel">edit mode</span>\n    </paper-tooltip>\n    <paper-toast id="toast" horizontal-align="left"></paper-toast>\n    <hax-autoloader>\n      <magazine-cover></magazine-cover>\n      <video-player></video-player>\n      <lrn-table></lrn-table>\n      <media-image></media-image>\n      <lrndesign-blockquote></lrndesign-blockquote>\n      <meme-maker></meme-maker>\n      <a11y-gif-player></a11y-gif-player>\n      <paper-audio-player></paper-audio-player>\n      <wikipedia-query></wikipedia-query>\n      <wave-player></wave-player>\n      <pdf-element></pdf-element>\n      <place-holder></place-holder>\n      <lrn-vocab></lrn-vocab>\n      <code-editor></code-editor>\n      <lrn-math></lrn-math>\n      <citation-element></citation-element>\n    </hax-autoloader>\n  '
      ],
      [
        '\n    <custom-style>\n      <style is="custom-style" include="materializecss-styles">\n        :host {\n          display: block;\n          font-size: 16px;\n          box-sizing: content-box;\n        }\n        #toolbar {\n          color: gray;\n          background-color: white;\n          padding: 0 8px;\n          margin: 0;\n          height: auto;\n          box-sizing: content-box;\n          transition: all 0.4s ease;\n        }\n        paper-button {\n          padding: 0;\n          margin: 0;\n          min-width: 16px;\n        }\n        app-drawer {\n          padding: 0;\n          top: 0;\n          bottom: 0;\n          z-index: 1;\n          position: absolute;\n          box-sizing: content-box;\n          --app-drawer-content-container: {\n            background-color: #fafafa;\n            padding: 0;\n            border-right: 1px solid #c8c8c8;\n            overflow-y: scroll;\n            width: 300px !important;\n            box-shadow: 0 76px 8px 0 rgba(0, 0, 0, 0.4);\n            height: 100vh;\n            top: 0;\n            position: sticky;\n          }\n        }\n        lrndesign-stepper-button {\n          --lrndesign-stepper-btn-active: #f6f7f7;\n        }\n        lrndesign-stepper-button ::slotted(paper-button) {\n          margin: 0;\n          height: 48px;\n        }\n        lrndesign-stepper-button ::slotted(.title-container) {\n          padding: 0;\n          width: 100%;\n          right: unset;\n        }\n        lrndesign-stepper-button ::slotted(.node-title) {\n          font-size: 15px;\n          line-height: 24px;\n        }\n\n        .loading {\n          width: 100%;\n          z-index: 1000;\n          opacity: 0.9;\n          text-align: center;\n          align-content: space-around;\n          justify-content: center;\n          position: absolute;\n          background-color: white;\n          padding: 0;\n          margin: 0;\n          display: flex;\n          margin: 0 auto;\n          visibility: visible;\n          transition: visibility 1s, opacity 1s ease;\n        }\n        .loading elmsln-loading {\n          margin: 0 5em;\n          display: inline-flex;\n        }\n        #bodyloading {\n          height: 100%;\n          display: flex;\n          justify-content: center;\n        }\n        #bodyloading .loading,\n        #bodyloading elmsln-loading {\n          display: block;\n          height: 5em;\n        }\n        .outline-title {\n          margin-left: 0.5em;\n          max-width: 50%;\n        }\n        .content-nav-buttons {\n          top: 60%;\n          position: fixed;\n          opacity: 0.8;\n          padding: 0 0.25em;\n          height: 40%;\n          padding-top: 15%;\n          margin-top: -15%;\n        }\n        .content-nav-buttons:hover {\n          opacity: 1;\n        }\n        .prev {\n          left: 0;\n          order: 1;\n        }\n        .next {\n          right: 0;\n          transition: right 0.2s ease;\n          order: 2;\n        }\n        app-header {\n          width: 100%;\n          left: 0 !important;\n          z-index: 2 !important;\n          position: sticky !important;\n        }\n        app-header-layout {\n          margin: 0;\n          padding: 0;\n          width: 100%;\n        }\n        .content-body {\n          position: relative;\n          padding: 0;\n          margin: -3em 4em 5em 4em;\n          font-size: 1.1em;\n          transition: margin 0.4s ease, width 0.4s ease;\n        }\n\n        .content-nav-buttons paper-icon-button {\n          width: 4em;\n          height: 4em;\n          opacity: 0.4;\n          display: block;\n          visibility: visible;\n          transition: opacity 0.4s linear, visibility 1s linear,\n            height 0.4s ease, width 0.4s ease;\n        }\n        .content-nav-buttons paper-icon-button:hover {\n          opacity: 1;\n        }\n        paper-tooltip {\n          --paper-tooltip-opacity: 0.96;\n        }\n        :host([drawer-opened]) .content-nav-buttons paper-icon-button {\n          width: 2.5em;\n          height: 2.5em;\n        }\n        :host([edit-mode]) .content-nav-buttons {\n          opacity: 0;\n          pointer-events: none;\n          visibility: hidden;\n        }\n        .content-title {\n          font-size: 1.4em;\n          margin: 0;\n          padding: 0.25em 0;\n          background-color: white;\n          top: 70px;\n          position: sticky;\n        }\n        .content-current {\n          min-height: 100vh;\n        }\n        .content-next {\n          background-color: grey;\n          opacity: 0.8;\n        }\n        #header {\n          position: sticky;\n          top: 0;\n          left: 0;\n          width: 100%;\n          color: black;\n          background-color: white;\n          z-index: 2;\n          padding: 0;\n          margin: 0;\n          opacity: 1;\n          box-sizing: content-box;\n          transition: all 0.4s ease;\n        }\n        app-drawer-layout {\n          font-family: sans-serif;\n        }\n        :host {\n          --app-drawer-width: 300px;\n        }\n        :host([full-width]) {\n          --app-drawer-width: 0px;\n        }\n        :host([drawer-opened]) .prev,\n        :host([edit-mode]) .prev {\n          left: 17em;\n        }\n        .progress-container {\n          width: 90%;\n          padding: 0;\n          margin: 0 0 0 1em;\n          overflow: visible;\n        }\n\n        [main-title] {\n          font-weight: lighter;\n          padding: 0.6em 0 0 0;\n          margin: 0;\n          height: 3em;\n          overflow-y: scroll;\n        }\n        [hidden] {\n          visibility: hidden !important;\n          opacity: 0 !important;\n          display: block !important;\n        }\n        paper-search-bar[hidden] {\n          display: none !important;\n        }\n        lrnsys-progress {\n          margin-top: 0.5em;\n          padding: 0.2em 0 0 0;\n          box-sizing: content-box;\n        }\n        lrnsys-progress lrnsys-progress-circle {\n          list-style-type: none;\n          box-sizing: content-box;\n        }\n\n        #bookdrawercontent {\n          overflow: scroll;\n          visibility: visible;\n          display: block;\n          opacity: 1;\n          transition: visibility 1s linear, opacity 1s linear;\n        }\n        @media (max-width: 1200px) {\n          :host .content-body {\n            font-size: 0.94em;\n          }\n        }\n        @media (max-width: 960px) {\n          :host .content-body {\n            font-size: 0.92em;\n          }\n        }\n        @media (max-width: 820px) {\n          :host .content-body {\n            font-size: 0.9em;\n          }\n        }\n        @media (max-width: 700px) {\n          :host .content-body {\n            font-size: 0.9em;\n          }\n        }\n        @media (max-width: 639px) {\n          app-drawer-layout {\n            top: 0;\n          }\n          [main-title] {\n            font-size: 0.8em;\n          }\n          .content-title {\n            font-size: 1.1em;\n          }\n          .outline-title {\n            position: absolute !important;\n            clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n            clip: rect(1px, 1px, 1px, 1px);\n            overflow: hidden;\n            height: 1px;\n          }\n          :host .content-body {\n            margin: 0 0.5em;\n            font-size: 0.9em;\n            width: 85%;\n          }\n          .content-nav-buttons {\n            position: relative;\n            display: flex;\n            top: unset;\n            padding: 0;\n            opacity: 0.8;\n            height: unset;\n            margin: 0;\n          }\n          .content-nav {\n            width: 100%;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            vertical-align: middle;\n          }\n          .next {\n            right: unset;\n          }\n        }\n        @media (max-width: 500px) {\n          [main-title] {\n            font-size: 0.7em;\n          }\n        }\n        /**\n       * Authoring section\n       */\n        #editbutton {\n          position: fixed;\n          bottom: 0;\n          right: 0;\n          margin: 2em;\n          padding: 0.5em;\n          width: 1.6em;\n          height: 1.6em;\n          visibility: visible;\n          opacity: 1;\n          transition: all 0.4s ease;\n        }\n        :host([edit-mode]) #editbutton {\n          width: 100%;\n          z-index: 100;\n          right: 0;\n          bottom: 0;\n          border-radius: 0;\n          margin: 0;\n          padding: 1em;\n          background-color: var(--paper-blue-500) !important;\n        }\n        :host([edit-mode]) #header {\n          background-color: var(--paper-grey-500);\n        }\n        :host([edit-mode]) #toolbar {\n          opacity: 0.5;\n        }\n        .your-progress-button {\n          padding-right: 1em;\n        }\n        #mapmenu {\n          padding: 1em 0;\n          overflow-x: hidden;\n        }\n        .course-title-drawer {\n          font-size: 1.2em;\n        }\n        hax-autoloader {\n          display: none;\n        }\n      </style>\n    </custom-style>\n    <page-scroll-position value="{{scrollPosition}}"></page-scroll-position>\n    <div id="anchor"></div>\n    <iron-ajax\n      id="outlineajax"\n      params="[[requestParams]]"\n      url="[[outlinePath]]"\n      handle-as="json"\n      on-response="handleOutlineResponse"\n      last-response="{{outlineData}}"\n    ></iron-ajax>\n    <iron-ajax\n      id="bookajax"\n      params="[[requestParams]]"\n      url="[[bookPath]]"\n      handle-as="json"\n      on-response="handleBookResponse"\n      last-response="{{bookData}}"\n    ></iron-ajax>\n    <iron-ajax\n      id="pageajax"\n      url="[[pagePath]]"\n      params="[[pageParams]]"\n      handle-as="json"\n      on-response="handlePageResponse"\n      last-response="{{pageData}}"\n    ></iron-ajax>\n    <iron-ajax\n      id="pageupdateajax"\n      url="[[pageUpdatePath]]"\n      params="[[pageParams]]"\n      method="PUT"\n      body="[[updatePageData]]"\n      content-type="application/json"\n      handle-as="json"\n      on-response="_handleUpdateResponse"\n    ></iron-ajax>\n    <iron-ajax\n      id="pagedeleteajax"\n      url="[[pageDeletePath]]"\n      params="[[pageParams]]"\n      method="DELETE"\n      content-type="application/json"\n      handle-as="json"\n      on-response="_handleDeleteResponse"\n    ></iron-ajax>\n    <iron-ajax\n      id="pagecreateajax"\n      url="[[pageCreatePath]]"\n      method="POST"\n      body="[[createRequestBody]]"\n      handle-as="json"\n      on-response="_ajaxCreateStubHandler"\n    ></iron-ajax>\n\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:type/:id"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n    <hax-store app-store="[[appStoreConnection]]"></hax-store>\n    <hax-panel\n      id="haxpanel"\n      hide-panel-ops=""\n      hide-export-button=""\n    ></hax-panel>\n    <hax-app-picker></hax-app-picker>\n    <hax-export-dialog></hax-export-dialog>\n    <!-- body where most of the heavy lifting happens -->\n    <app-drawer-layout>\n      <!-- LRNApp book we expect to navigate -->\n      <app-drawer\n        slot="drawer"\n        id="bookdrawer"\n        opened="{{drawerOpened}}"\n        swipe-open=""\n        transition-duration="300"\n      >\n        <div\n          id="bookdrawercontent"\n          style="height: 100%; overflow: auto;"\n          hidden\\$="[[!bookItems]]"\n        >\n          <paper-search-bar\n            hide-filter-button=""\n            hidden\\$="[[!showSearch]]"\n          ></paper-search-bar>\n          <lrndesign-mapmenu id="mapmenu" on-tap="_bookOutlineTap">\n            <!-- Server response will populate this -->\n          </lrndesign-mapmenu>\n        </div>\n      </app-drawer>\n      <app-header-layout>\n        <app-header slot="header" id="header" shadow="" fixed="">\n          <div id="outlineloading" class="loading">\n            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>\n            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>\n            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>\n          </div>\n          <app-toolbar id="toolbar" sticky="" class="tall">\n            <div style="pointer-events: auto;" class="menu-btn-wrap">\n              <paper-icon-button\n                style="pointer-events: auto;"\n                title="Content outline"\n                id="menubutton"\n                icon="menu"\n                on-tap="toggleBook"\n              ></paper-icon-button>\n            </div>\n            <div spacer="" class="outline-title">[[outlineTitle]]</div>\n            <div spacer="" main-title="" style="pointer-events: auto;">\n              <div class="progress-container">\n                <lrnsys-progress\n                  sound-finish="[[soundFinish]]"\n                  sound="[[sound]]"\n                  complete-sound="[[completeSound]]"\n                  finished-sound="[[finishedSound]]"\n                  title="The steps to complete this lesson"\n                  id="progress"\n                  active="{{activePage}}"\n                  items="{{outlineItems}}"\n                  progressive-unlock=""\n                  size="small"\n                ></lrnsys-progress>\n              </div>\n            </div>\n            <!-- <div class="your-progress-button">\n              <lrnsys-dialog body-append modal on-tap="progressdashboardopen" header="Your progress" alt="Your progress">\n                <span slot="button"><iron-icon icon="av:equalizer"></iron-icon></span>\n                <div>\n                  <lrnapp-book-progress-dashboard id="progressdashboard" source-path="[[progressDashboardPath]]" route-data="[[data]]"></lrnapp-book-progress-dashboard>\n                </div>\n              </lrnsys-dialog>\n            </div> -->\n          </app-toolbar>\n        </app-header>\n        <div class="content-body">\n          <div id="current" class="content-current">\n            <h2 id="currenttitle" class="content-title">[[currentTitle]]</h2>\n            <div id="bodyloading" class="loading">\n              <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n              <h3 class="loading-text">Loading content..</h3>\n            </div>\n            <div>\n              <hax-body id="haxbody"> <slot id="slottedarea"></slot> </hax-body>\n            </div>\n          </div>\n        </div>\n        <div class="content-nav">\n          <div class="content-nav-buttons next">\n            <paper-icon-button\n              id="next"\n              title="[[nextLabel]]"\n              on-tap="_nextBtn"\n              icon="hardware:keyboard-arrow-right"\n              data-voicecommand="next page"\n              hidden\\$="[[!hasNextPage]]"\n            ></paper-icon-button>\n            <paper-tooltip\n              for="next"\n              position="left"\n              offset="0"\n              animation-delay="100"\n            >\n              [[nextLabel]]\n            </paper-tooltip>\n          </div>\n          <div class="content-nav-buttons prev">\n            <paper-icon-button\n              id="prev"\n              title="[[prevLabel]]"\n              on-tap="_prevBtn"\n              icon="hardware:keyboard-arrow-left"\n              data-voicecommand="previous page"\n              hidden\\$="[[!hasPrevPage]]"\n            ></paper-icon-button>\n            <paper-tooltip\n              for="prev"\n              position="right"\n              offset="0"\n              animation-delay="100"\n            >\n              [[prevLabel]]\n            </paper-tooltip>\n          </div>\n        </div>\n      </app-header-layout>\n    </app-drawer-layout>\n    <hax-manager></hax-manager>\n    <!-- edit mode if they have permissions -->\n    <paper-fab\n      id="editbutton"\n      icon="editor:mode-edit"\n      class="red white-text"\n      hidden\\$="[[!currentPageData.page.meta.canUpdate]]"\n      data-voicecommand="Edit content"\n      on-tap="_toggleEditMode"\n      title="Tap to place content in edit mode."\n    ></paper-fab>\n    <paper-tooltip\n      for="editbutton"\n      position="bottom"\n      offset="8"\n      animation-delay="100"\n    >\n      <span id="fablabel">edit mode</span>\n    </paper-tooltip>\n    <paper-toast id="toast" horizontal-align="left"></paper-toast>\n    <hax-autoloader>\n      <magazine-cover></magazine-cover>\n      <video-player></video-player>\n      <lrn-table></lrn-table>\n      <media-image></media-image>\n      <lrndesign-blockquote></lrndesign-blockquote>\n      <meme-maker></meme-maker>\n      <a11y-gif-player></a11y-gif-player>\n      <paper-audio-player></paper-audio-player>\n      <wikipedia-query></wikipedia-query>\n      <wave-player></wave-player>\n      <pdf-element></pdf-element>\n      <place-holder></place-holder>\n      <lrn-vocab></lrn-vocab>\n      <code-editor></code-editor>\n      <lrn-math></lrn-math>\n      <citation-element></citation-element>\n    </hax-autoloader>\n  '
      ]
    );
    _templateObject_50484690f76d11e89310d7f0fbc64afe = function _templateObject_50484690f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_50484690f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-book",
    observers: ["_routeChanged(data, route, endPoint)"],
    properties: {
      appStoreConnection: {
        type: Object,
        value: {
          url:
            "/sing100/sites/all/libraries/webcomponents/polymer/apps-src/lrnapp-book/appstore.json"
        }
      },
      progressDashboardPath: { type: String },
      showSearch: { type: Boolean, reflectToAttribute: !0, value: !1 },
      createRequestBody: {
        type: Object,
        computed: "_computeCreateRequestBody(currentPageData)"
      },
      updatePageData: {
        type: Object,
        value: { id: null, type: null, attributes: {} }
      },
      pageUpdatePath: {
        type: String,
        computed: "_computePageUpdatePath(data, sourcePath)"
      },
      sourcePath: { type: String },
      editMode: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        observer: "_editModeChanged"
      },
      drawerOpened: { type: Boolean, value: !0, reflectToAttribute: !0 },
      route: { type: Object, notify: !0 },
      currentTitle: { type: String },
      outlineTitle: { type: String },
      bookTitle: { type: String, value: "Course outline" },
      soundFinish: { type: Boolean, value: !0 },
      sound: { type: Boolean, value: !0 },
      completeSound: { type: String, value: "" },
      finishedSound: { type: String, value: "" },
      scrollPosition: { type: Number, value: 0, observer: "_scrollChanged" },
      activePage: { type: Number, value: 0, observer: "_activePageChanged" },
      activeOutline: {
        type: Number,
        value: 0,
        observer: "_activeOutlineChanged"
      },
      outlineItems: {
        type: Array,
        value: [],
        notify: !0,
        observer: "_outlineItemsChanged"
      },
      bookItems: { type: Array, value: [], notify: !0 },
      itemResponses: { type: Array, value: [] },
      requestParams: { type: Object, notify: !0, value: { node: null } },
      pageParams: { type: Object, notify: !0, value: { load: !1 } },
      outlineData: { type: Object, notify: !0 },
      bookData: { type: Object, notify: !0 },
      pageData: { type: Object, notify: !0 },
      outlinePath: { type: String },
      bookPath: { type: String },
      pagePath: { type: String },
      hasPrevPage: { type: Boolean, notify: !0 },
      prevLabel: { type: String },
      hasNextPage: { type: Boolean, notify: !0 },
      nextLabel: { type: String },
      resetScroll: { type: Boolean, value: !1 },
      currentPageData: {
        type: Object,
        value: {},
        observer: "_currentPageDataUpdated"
      },
      responseData: { type: Object, value: {} },
      rebuildOutline: { type: Boolean, value: !1 },
      fullWidth: {
        type: Boolean,
        reflectToAttribute: !0,
        value: !1,
        observer: "_fullWidthChanged"
      }
    },
    ready: function ready(e) {
      var _this = this;
      this.$.bodyloading.hidden = !0;
      this.$.outlineajax.generateRequest();
      setTimeout(function() {
        _this._resetScroll();
      }, 500);
    },
    attached: function attached() {
      this.$.progress.addEventListener(
        "node-percent-milestone",
        this.testMilestone.bind(this)
      );
      this.$.haxpanel.addEventListener(
        "hax-content-insert",
        this._haxContentInsert.bind(this)
      );
      this.addEventListener("route-change", this._routeChange.bind(this));
    },
    detached: function detached() {
      this.$.progress.removeEventListener(
        "node-percent-milestone",
        this.testMilestone.bind(this)
      );
      this.$.haxpanel.removeEventListener(
        "hax-content-insert",
        this._haxContentInsert.bind(this)
      );
      this.removeEventListener("route-change", this._routeChange.bind(this));
    },
    _fullWidthChanged: function _fullWidthChanged(newValue, oldValue) {
      this.updateStyles();
    },
    progressdashboardopen: function progressdashboardopen(e) {
      this.$.progressdashboard.showProgress = !0;
    },
    _computePageUpdatePath: function _computePageUpdatePath(data, sourcePath) {
      return sourcePath.replace("%", data.id);
    },
    _haxContentInsert: function _haxContentInsert(e) {
      var properties = {};
      if (
        babelHelpers.typeof(e.detail.properties) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        properties = e.detail.properties;
      }
      this.$.haxbody.haxInsert(e.detail.tag, e.detail.content, properties);
    },
    _computeCreateRequestBody: function _computeCreateRequestBody(
      currentPageData
    ) {
      if (
        babelHelpers.typeof(currentPageData.page) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        return {
          bid: currentPageData.page.relationships.book.id,
          pid: currentPageData.page.relationships.parent.id
        };
      }
    },
    _toggleEditMode: function _toggleEditMode(e) {
      this.editMode = !this.editMode;
    },
    _editModeChanged: function _editModeChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if (!0 === newValue) {
          this.$.editbutton.icon = "save";
          this.$.editbutton.title = "Tap to save content and exit edit mode";
          this.$.fablabel = "save changes";
          window.HaxStore.write("editMode", this.editMode, this);
          this.$.currenttitle.contentEditable = !0;
          this.resetScroll = !0;
          this.$.toast.show("Authoring mode active");
        } else {
          this.$.editbutton.icon = "editor:mode-edit";
          this.$.editbutton.title = "Tap to place content in edit mode.";
          this.$.fablabel = "edit mode";
          window.HaxStore.write("editMode", this.editMode, this);
          this.$.currenttitle.contentEditable = !1;
          this.resetScroll = !1;
          if (!0 === oldValue) {
            var updated = !1,
              haxcontent = this.$.haxbody.haxToContent();
            if (this.$.currenttitle.innerHTML !== this.currentPageData.title) {
              this.currentPageData.title = this.$.currenttitle.innerHTML;
              this.updatePageData.attributes.title = this.currentPageData.title;
            }
            if (this.currentPageData.content !== haxcontent) {
              this.currentPageData.content = haxcontent;
              this.updatePageData.attributes.body = this.currentPageData.content;
              updated = !0;
            }
            if (updated) {
              this.updatePageData.type = this.data.type;
              this.updatePageData.id = this.data.id;
              this.$.toast.show("Saving...");
              this.$.pageupdateajax.generateRequest();
            }
          }
        }
      }
    },
    _handleUpdateResponse: function _handleUpdateResponse(e) {
      this.$.toast.show("Saved!");
    },
    _bookOutlineTap: function _bookOutlineTap(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      if (
        babelHelpers.typeof(local.getAttribute("data-book-parent")) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.activeOutline = local.getAttribute("data-book-parent");
      }
    },
    _activeOutlineChanged: function _activeOutlineChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(oldValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        this.rebuildOutline = !0;
      }
    },
    _routeChanged: function _routeChanged(data, route, endPoint) {
      if ("string" === typeof route.path) {
        if ("string" === typeof endPoint) {
          if (route.path.startsWith(endPoint)) {
            if (
              !1 != this.pageParams.load &&
              babelHelpers.typeof(data.type) !==
                ("undefined" === typeof void 0
                  ? "undefined"
                  : babelHelpers.typeof(void 0)) &&
              babelHelpers.typeof(data.id) !==
                ("undefined" === typeof void 0
                  ? "undefined"
                  : babelHelpers.typeof(void 0))
            ) {
              this.pageParams[data.type] = data.id;
              if (
                babelHelpers.typeof(this.responseData[data.type + data.id]) !==
                ("undefined" === typeof void 0
                  ? "undefined"
                  : babelHelpers.typeof(void 0))
              ) {
                this.set(
                  "currentPageData",
                  this.responseData[data.type + data.id]
                );
              } else {
                this.$.bodyloading.hidden = !1;
                this.$.pageajax.generateRequest();
              }
              if (this.rebuildOutline) {
                this.set("requestParams", []);
                this.set("requestParams", this.pageParams);
                if (
                  babelHelpers.typeof(
                    this.responseData[data.type + "." + data.id + ".outline"]
                  ) !==
                  ("undefined" === typeof void 0
                    ? "undefined"
                    : babelHelpers.typeof(void 0))
                ) {
                  this.activePage = 0;
                  this.set("outlineItems", []);
                  this.set(
                    "outlineItems",
                    this._toArray(
                      this.responseData[data.type + "." + data.id + ".outline"]
                        .items
                    )
                  );
                  this.set(
                    "outlineTitle",
                    this.responseData[data.type + "." + data.id + ".outline"]
                      .items.outlineTitle
                  );
                } else {
                  this.$.outlineloading.hidden = !1;
                  this.pageParams.load = !1;
                  this.$.outlineajax.generateRequest();
                }
                this.rebuildOutline = !1;
              }
            }
            return;
          }
        }
        window.location.reload();
      }
    },
    _resetScroll: function _resetScroll() {
      this.resetScroll = !0;
      this.scrollPosition = 0;
      this.$.anchor.scrollIntoView({
        block: "start",
        behavior: "smooth",
        inline: "nearest"
      });
    },
    _activePageChanged: function _activePageChanged(newValue, oldValue) {
      var _this2 = this;
      if (
        babelHelpers.typeof(newValue) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if (
          babelHelpers.typeof(this.outlineItems) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          this.set("route.path", this.outlineItems[newValue].url);
          this.updatePageData.attributes = {};
          this.updatePageData.id = null;
          this.updatePageData.type = null;
        }
        if (
          babelHelpers.typeof(oldValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
        }
        setTimeout(function() {
          _this2.resetScroll = !1;
        }, 1e3);
        if (0 == newValue) {
          this.hasPrevPage = !1;
        } else {
          this.hasPrevPage = !0;
          if (
            babelHelpers.typeof(this.outlineItems) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            this.prevLabel = this.outlineItems[newValue - 1].title;
          }
        }
        if (
          babelHelpers.typeof(this.outlineItems) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          newValue + 1 == this.outlineItems.length
        ) {
          this.hasNextPage = !1;
        } else {
          this.hasNextPage = !0;
          if (
            babelHelpers.typeof(this.outlineItems) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            this.nextLabel = this.outlineItems[newValue + 1].title;
          }
        }
      }
    },
    _outlineItemsChanged: function _outlineItemsChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        0 != newValue.length
      ) {
        if (0 != this.activePage) {
          this.prevLabel = newValue[this.activePage - 1].title;
        }
        if (this.activePage + 1 != newValue.length) {
          this.nextLabel = newValue[this.activePage + 1].title;
        }
      }
    },
    testMilestone: function testMilestone(e) {
      if (75 == e.detail.percentage) {
        console.log(
          "@todo preload the next page and present grayed out right of UI."
        );
      }
    },
    _scrollChanged: function _scrollChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(this.outlineItems) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(this.outlineItems[this.activePage]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        newValue > this.outlineItems[this.activePage].value &&
        !this.resetScroll
      ) {
        if (75 <= newValue) {
          this.outlineItems[this.activePage].value = this.outlineItems[
            this.activePage
          ].max;
          this.set(
            "outlineItems." + this.activePage + ".value",
            this.outlineItems[this.activePage].max
          );
        } else {
          this.outlineItems[this.activePage].value = newValue;
          this.set("outlineItems." + this.activePage + ".value", newValue);
        }
      }
    },
    _nextBtn: function _nextBtn(e) {
      if (this.activePage < this.outlineItems.length - 1) {
        this.set(
          "outlineItems." + this.activePage + ".value",
          this.outlineItems[this.activePage].max
        );
        this.activePage = this.activePage + 1;
      }
    },
    _prevBtn: function _prevBtn(e) {
      if (0 < this.activePage) {
        this.activePage = this.activePage - 1;
      }
    },
    toggleBook: function toggleBook(e) {
      this.$.bookdrawer.toggle();
      this.fullWidth = !this.$.bookdrawer.opened;
    },
    handleOutlineResponse: function handleOutlineResponse(obj) {
      if (
        babelHelpers.typeof(obj) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var response = obj.detail.response.data,
          items = this._toArray(obj.detail.response.data.items),
          outlineTitle = obj.detail.response.data.outlineTitle;
        if (0 !== this.activePage) {
          this.activePage = 0;
        }
        this.set(
          "responseData." + this.data.type + "." + this.data.id + ".outline",
          response
        );
        this.set("outlineItems", []);
        this.set("outlineItems", items);
        this.set("outlineTitle", outlineTitle);
        var activePage = 0;
        for (var i in items) {
          if (
            this.data.type === items[i].type &&
            this.data.id === items[i].id &&
            0 !== i
          ) {
            activePage = parseInt(i);
          }
        }
        if (0 !== activePage) {
          this.activePage = activePage;
        }
        this.$.outlineloading.hidden = !0;
        this.pageParams.load = !0;
        if (0 === this.bookItems.length) {
          this.$.bookajax.generateRequest();
          this.pageParams = this.requestParams;
          this.$.pageajax.generateRequest();
        }
      }
    },
    handleBookResponse: function handleBookResponse(obj) {
      var response = obj.detail.response.data;
      this.set("bookItems", this._toArray(response.items));
      this.$.mapmenu.innerHTML = response.render;
    },
    handlePageResponse: function handlePageResponse(obj) {
      if (
        babelHelpers.typeof(obj) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var response = obj.detail.response.data;
        this.set("responseData." + this.data.type + this.data.id, response);
        this.set("currentPageData", response);
      }
    },
    _currentPageDataUpdated: function _currentPageDataUpdated(
      newValue,
      oldValue
    ) {
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(newValue.content) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        this.set("currentTitle", newValue.title);
        var slot = (0, _polymerDom.dom)(this.$.haxbody);
        while (null !== slot.firstChild) {
          slot.removeChild(slot.firstChild);
        }
        var tmp = document.createElement("div"),
          frag = document
            .createRange()
            .createContextualFragment(newValue.content);
        tmp.appendChild(frag);
        if (null == tmp.firstChild) {
          var tmp2 = document.createElement("p");
          tmp2.innerHTML = tmp.innerHTML;
          tmp = document.createElement("div");
          tmp.innerHTML = tmp2.outerHTML;
        } else if (
          babelHelpers.typeof(tmp.firstChild.length) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          var tmp2 = document.createElement("p");
          tmp2.innerHTML = tmp.innerHTML;
          tmp = document.createElement("div");
          tmp.innerHTML = tmp2.outerHTML;
        }
        while (tmp.firstChild) {
          (0, _polymerDom.dom)(this.$.haxbody).appendChild(tmp.firstChild);
        }
        this._resetScroll();
        this.$.bodyloading.hidden = !0;
        if (this.editMode && !newValue.page.meta.canUpdate) {
          this.editMode = !1;
        }
      }
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
