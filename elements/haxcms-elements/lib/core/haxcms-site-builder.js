import { LitElement, html, css } from "lit";
import {
  encapScript,
  findTagsInHTML,
  wipeSlot,
  varExists,
  localStorageSet,
  validURL,
} from "@haxtheweb/utils/utils.js";
import { autorun, toJS } from "mobx";
import { store, HAXcmsStore } from "./haxcms-site-store.js";
import "./haxcms-site-router.js";
import "@haxtheweb/simple-progress/simple-progress.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import "@haxtheweb/replace-tag/replace-tag.js";
// toggle store darkmode
function darkToggle(e) {
  if (e.matches) {
    // dark mode
    store.darkMode = true;
  } else {
    // light mode
    store.darkMode = false;
  }
}
/**
 * `haxcms-site-builder`
 * `build the site and everything off of this`
 * @microcopy - the mental model for this element
 * - This is a factory element, it doesn't do much on its own visually
 * - it loads a site.json file and then utilizes this data in order to construct
 *   what theme it should load (element) in order to get everything off and running
 */
class HAXCMSSiteBuilder extends I18NMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
        }
        :host([is-logged-in]) {
          max-height: calc(100vh - 48px);
        }
        :host #slot {
          opacity: 0.2;
          visibility: hidden;
        }
        :host([theme-loaded]) #slot {
          opacity: 1;
          visibility: visible;
        }
        simple-progress {
          display: block;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: transparent;
          z-index: 1000;
          --simple-progress-active-color: var(
            --haxcms-color,
            rgba(255, 255, 255, 0.5)
          );
        }
        simple-progress[disabled] {
          display: none;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-builder";
  }
  // render function
  render() {
    return html`
      <site-ai-chat></site-ai-chat>
      <haxcms-site-router base-uri="${this.baseURI}"></haxcms-site-router>
      <simple-progress .disabled="${!this.loading}"></simple-progress>
      <div id="slot"><slot></slot></div>
      <slot name="haxcms-site-editor-ui-prefix-avatar"></slot>
      <slot name="haxcms-site-editor-ui-prefix-buttons"></slot>
      <slot name="haxcms-site-editor-ui-suffix-buttons"></slot>
      <slot name="haxcms-site-editor-ui-main-menu"></slot>
      <slot name="haxcms-site-editor-ui-topbar-character-button"></slot>
      <simple-colors-polymer></simple-colors-polymer>
    `;
  }
  /**
   * Simple "two way" data binding from the element below via events
   */
  _updateManifest(data) {
    this.manifest = { ...data };
  }
  _updateLoading(e) {
    this.loading = e.detail.value;
  }
  hashCode(s) {
    return s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
  // normalize the application of IDs so that we can target parts
  // of the page for scroll and referencing in general via URL hash
  nodeNormalizeIDs(node) {
    if (
      node.tagName &&
      node.getAttribute("id") == null &&
      ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName)
    ) {
      if (node.getAttribute("resource")) {
        node.setAttribute("id", node.getAttribute("resource"));
      } else {
        let id =
          node.tagName.toLowerCase() + "-" + this.hashCode(node.innerText);
        node.setAttribute("id", id);
      }
    }
  }
  _updateActiveItemContent(data) {
    if (data) {
      let tmp = globalThis.document.createElement("div");
      tmp.innerHTML = data;
      for (const node of tmp.childNodes) {
        this.nodeNormalizeIDs(node);
      }
      data = tmp.innerHTML;
      // cheat to ensure we get a rebuild of the content in case
      // they only modified page title / other page-break based details
      this.activeItemContent = "";
      setTimeout(() => {
        this.activeItemContent = data;
      }, 0);
    }
    // punt, we didn't find anything
    else if (
      store.cmsSiteEditorBackend.instance &&
      store.cmsSiteEditorBackend.instance.updateActiveItemContent
    ) {
      store.cmsSiteEditorBackend.instance.updateActiveItemContent();
    } else {
      this.activeItemContent = "";
    }
  }
  display404Error() {
    if (store.themeElement) {
      let frag = globalThis.document.createDocumentFragment();
      let p = globalThis.document.createElement("p");
      p.innerHTML = `<strong>${store.getInternalRoute()}</strong> ${
        this.t.couldNotBeLocated
      }. ${this.t.hereAreSomePossibleRemedies}
      <ul>
        <li><a href="x/search?search=${store.getInternalRoute()}">${
          this.t.useSearchToLocateTheContentYouAreLookingFor
        }</a></li>
        <li><a href="./">${this.t.goToTheHomePage}</a></li>
        <li>${this.t.navigateToAnotherPageInTheMenu}</li>
      </ul>`;
      frag.appendChild(p);
      wipeSlot(store.themeElement, "*");
      store.themeElement.appendChild(frag);
      setTimeout(() => {
        store.toast(this.t.pageNotFound, 4000, {
          fire: true,
          walking: true,
        });
      }, 1000);
    }
  }
  // interenal routes supply their own component which we render
  renderInternalRoute() {
    if (store.themeElement) {
      let frag = globalThis.document.createDocumentFragment();
      if (store.activeItem.component) {
        import(`../ui-components/routes/${store.activeItem.component}.js`).then(
          () => {
            let el = globalThis.document.createElement(
              store.activeItem.component,
            );
            frag.appendChild(el);
            wipeSlot(store.themeElement, "*");
            store.themeElement.appendChild(frag);
          },
        );
      }
    }
  }
  /**
   * Load Page data
   */
  async loadPageData() {
    // file required or we have nothing; other two mixed in for pathing
    if (this.activeItemLocation && !this.loading) {
      this.loading = true;
      let url = `${this.outlineLocation}${this.activeItemLocation}`;
      if (this._timeStamp) {
        if (url.indexOf("?") != -1) {
          url += `&${this._timeStamp}`;
        } else {
          url += `?${this._timeStamp}`;
        }
      }
      if (this.activeItemLocation === "hax-internal-route.html") {
        this.renderInternalRoute();
        this.loading = false;
      } else {
        await fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              this.display404Error();
            }
          })
          .then((data) => {
            this._updateActiveItemContent(data);
            this.loading = false;
          })
          .catch((err) => {
            this.lastErrorChanged(err);
          });
      }
    }
  }
  /**
   * Load JSON Outline Schema / site.json format
   */
  async loadJOSData() {
    // file required or we have nothing; other two mixed in for pathing
    if (this.file) {
      this.loading = true;
      let url = `${this.outlineLocation}${this.file}`;
      try {
        // if this is successful it means we were handed a JSON blob of the site itself
        let data = JSON.parse(this.file);
        this._updateManifest(data);
        this.loading = false;
      } catch (e) {
        // weird looking but this is the typical use-case in which
        // we got a file path and try to load it because the above silently failed
        if (this._timeStamp && this._timeStamp != "") {
          if (url.indexOf("?") != -1) {
            url += `&${this._timeStamp}`;
          } else {
            url += `?${this._timeStamp}`;
          }
        }
        var headers = { cache: "no-cache" };
        await fetch(url, headers)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            this._updateManifest(data);
            this.loading = false;
          })
          .catch((err) => {
            this.lastErrorChanged(err);
          });
      }
    }
  }
  /**
   * life cycle updated
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // track these so we can debounce if multiple values updated at once
    let loadOutline = false;
    let loadPage = false;
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["outlineLocation", "activeItemLocation"].includes(propName) &&
        this[propName] != ""
      ) {
        loadPage = true;
      }
      if (
        ["outlineLocation", "file"].includes(propName) &&
        this[propName] != ""
      ) {
        loadOutline = true;
      }
      if (propName == "_timeStamp" && this[propName]) {
        loadOutline = true;
        loadPage = true;
      }
      if (propName == "themeData") {
        this._themeChanged(this[propName], oldValue);
      } else if (propName == "themeName") {
        this._themeNameChanged(this[propName], oldValue);
      } else if (propName == "outlineLocation") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("outline-location-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
      } else if (propName == "manifest") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
        this._manifestChanged(this[propName], oldValue);
      } else if (propName == "activeItem") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("active-item-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
        this._activeItemChanged(this[propName], oldValue);
      } else if (propName == "activeItemContent") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("active-item-content-changed", {
            bubbles: true,
            detail: this[propName],
          }),
        );
        this._activeItemContentChanged(this[propName], oldValue);
      }
    });
    if (loadOutline && this.__ready) {
      this.loadJOSData();
    }
    if (loadPage && this.__ready) {
      this.loadPageData();
    }
  }
  static get properties() {
    return {
      ...super.properties,
      activeItemLocation: {
        type: String,
        attribute: "active-item-location",
      },
      disableFeatures: {
        type: String,
        reflect: true,
        attribute: "disable-features",
      },
      _timeStamp: {
        type: String,
      },
      isLoggedIn: {
        type: Boolean,
        reflect: true,
        attribute: "is-logged-in",
      },
      /**
       * queryParams
       */
      queryParams: {
        type: Object,
      },
      /**
       * Loading status of the page to render.
       */
      loading: {
        type: Boolean,
        reflect: true,
      },
      /**
       * support for alternate locations.
       */
      outlineLocation: {
        type: String,
        attribute: "outline-location",
      },
      /**
       * Manifest from file
       */
      manifest: {
        type: Object,
      },
      /**
       * Theme, used to boot a design element
       */
      themeData: {
        type: Object,
      },
      /**
       * Theme name, which we then use to setup the theme
       */
      themeName: {
        type: String,
      },
      /**
       * Imported items so we can allow theme flipping dynamically
       */
      __imported: {
        type: Object,
      },
      /**
       * theme loaded to indicate to the theme we have a theme ready to go
       */
      themeLoaded: {
        type: Boolean,
        reflect: true,
        attribute: "theme-loaded",
      },
      /**
       * Active item content
       */
      activeItemContent: {
        type: String,
      },
      /**
       * Location of the site.json file
       */
      file: {
        type: String,
      },
      /**
       * Injected by HAXcms
       */
      baseURI: {
        type: String,
        attribute: "base-uri",
      },
    };
  }
  _themeNameChanged(newValue) {
    if (newValue) {
      // drop old theme element if there is one
      if (store.themeElement) {
        store.themeElement.remove();
      }
      // wipe out what we got
      wipeSlot(this, "*");
      store.themeElement = globalThis.document.createElement(newValue);
      // apply a class so that we can write generic CSS selectors in integrations
      store.themeElement.classList.add("haxcms-theme-element");
      this.appendChild(store.themeElement);
    }
  }

  /**
   * Alert there was an internal error in getting the file
   */
  lastErrorChanged(e) {
    if (e) {
      console.error(e);
      // not every error has a value if it just failed
      if (e.detail && e.detail.value) {
        // if we force reloads then let's do it now
        if (
          window &&
          globalThis.location &&
          globalThis.appSettings &&
          globalThis.appSettings.reloadOnError
        ) {
          globalThis.location.reload();
        }
        store.toast(
          e.detail.value.status + " " + e.detail.value.statusText,
          5000,
          { fire: true },
        );
      } else {
        // no detail is bad, this implies a server level connection error
        // if we force reloads then let's do it now
        if (
          window &&
          globalThis.location &&
          globalThis.appSettings &&
          globalThis.appSettings.reloadOnError
        ) {
          globalThis.location.reload();
        }
      }
    }
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.t = {
      ...super.t,
      pageNotFound: "Page not found",
      navigateToAnotherPageInTheMenu: "Navigate to another page in the menu",
      couldNotBeLocated: "could not be located",
      hereAreSomePossibleRemedies: "Here are some possible remedies:",
      useSearchToLocateTheContentYouAreLookingFor:
        "Use Search to locate the content you are looking for",
      goToTheHomePage: "Go to the home page",
    };
    this.registerLocalization({
      context: this,
      namespace: "haxcms",
      localesPath: new URL(
        "../../locales/haxcms.es.json",
        import.meta.url,
      ).href.replace("/haxcms.es.json", "/"),
      locales: ["es"],
    });
    this._timeStamp = Math.floor(Date.now() / 1000);
    this.disableFeatures = "";
    this.isLoggedIn = false;
    this.__disposer = [];
    this.queryParams = {};
    this.loading = false;
    this.__imported = {};
    this.themeLoaded = false;
    this.outlineLocation = "";
    this.activeItemLocation = "";
    HAXcmsStore.storePieces.siteBuilder = this;
    // support initial setup stuff with slots
    for (var i in this.children) {
      if (this.children[i].tagName && this.children[i].getAttribute("slot")) {
        const item = this.children[i].cloneNode(true);
        let key = item.getAttribute("slot");
        switch (key) {
          case "haxcms-site-editor-ui-prefix-avatar":
          case "haxcms-site-editor-ui-prefix-buttons":
          case "haxcms-site-editor-ui-suffix-buttons":
          case "haxcms-site-editor-ui-main-menu":
          case "haxcms-site-editor-ui-topbar-character-button":
            store.setupSlots[key].push(item);
            break;
        }
      }
    }
    globalThis.addEventListener("hax-store-ready", this.storeReady.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-trigger-update-node",
      this._triggerUpdatedNode.bind(this),
      { signal: this.windowControllers.signal },
    );

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkToggle, {
        signal: this.windowControllers.signal,
      });

    autorun(() => {
      localStorageSet("app-hax-darkMode", toJS(store.darkMode));
      if (toJS(store.darkMode)) {
        globalThis.document.body.classList.add("dark-mode");
      } else {
        globalThis.document.body.classList.remove("dark-mode");
      }
    });
    autorun(() => {
      this.isLoggedIn = toJS(store.isLoggedIn);
      UserScaffoldInstance.writeMemory("isLoggedIn", this.isLoggedIn);
      const tstamp = Math.floor(Date.now() / 1000);
      if (this.isLoggedIn && !this.loggedInTime) {
        this.loggedInTime = tstamp;
        this._timeStamp = this.loggedInTime;
        var ll = UserScaffoldInstance.readMemory("recentLogins");
        if (!ll) {
          UserScaffoldInstance.writeMemory("recentLogins", [tstamp], "long");
        } else if (ll) {
          // cap at last 5 login times
          if (ll.length < 5) {
            ll.shift();
          }
          ll.push(tstamp);
          UserScaffoldInstance.writeMemory("recentLogins", ll, "long");
        }
      }
    });
    // user scaffolding wired up to superDaemon
    autorun(() => {
      const memory = toJS(UserScaffoldInstance.memory);
      const usAction = toJS(UserScaffoldInstance.action);
      // try to pulse edit / merlin if they are here and don't do anything...
      if (
        memory.editMode === false &&
        memory.interactionDelay >= 3600 &&
        usAction.type === null &&
        store.cmsSiteEditor.haxCmsSiteEditorUIElement &&
        store.cmsSiteEditor.haxCmsSiteEditorUIElement.shadowRoot
      ) {
        // delay since it slides in
        setTimeout(() => {
          const editbtn =
            store.cmsSiteEditor.haxCmsSiteEditorUIElement.shadowRoot.querySelector(
              "#editbutton",
            );
          editbtn.dataPulse = "1";
        }, 300);
      }
      // try to evaluate typing in merlin
      if (
        UserScaffoldInstance.active &&
        UserScaffoldInstance.memory.isLoggedIn &&
        UserScaffoldInstance.memory.recentTarget === SuperDaemonInstance &&
        SuperDaemonInstance.programName === null &&
        UserScaffoldInstance.memory.interactionDelay > 600 &&
        ["paste", "key"].includes(usAction.type)
      ) {
        if (validURL(SuperDaemonInstance.value)) {
          SuperDaemonInstance.waveWand(
            [SuperDaemonInstance.value, "/", {}, "hax-agent", "Agent"],
            null,
            "coin2",
          );
        }
      } else if (
        UserScaffoldInstance.active &&
        UserScaffoldInstance.memory.isLoggedIn &&
        SuperDaemonInstance.programName === null &&
        ["paste"].includes(usAction.type) &&
        UserScaffoldInstance.data.architype == "url"
      ) {
        SuperDaemonInstance.waveWand(
          [
            toJS(UserScaffoldInstance.data.value),
            "/",
            {},
            "hax-agent",
            "Agent",
          ],
          null,
          "coin2",
        );
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    this.__ready = true;
    store.appReady = true;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-ready", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
    // dyanmcially import the editor builder which figures out if we should have one
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/core/haxcms-editor-builder.js"
    )
      .then((response) => {
        import("./haxcms-toast.js");

        this.editorBuilder = globalThis.document.createElement("haxcms-editor-builder");
        // attach editor builder after we've appended to the screen
        if (this.parentNode) {
          this.parentNode.insertBefore(this.editorBuilder, this);
        }
        else {
          globalThis.document.body.appendChild(this.editorBuilder);
        }
        // get fresh data if not published / demo which is a form of published
        if (
          HAXcmsStore.getApplicationContext() !==
          "published"
        ) {
          this._timeStamp = Math.floor(Date.now() / 1000);
        } else {
          this._timeStamp = "";
        }
      })
      .catch((error) => {
        /* Error handling */
        console.warn(error);
      });
    globalThis.dispatchEvent(new Event("resize"));
    setTimeout(() => {
      autorun((reaction) => {
        this.themeData = toJS(store.themeData);
        if (this.themeData) {
          // special support for "format" in the URL dictating the possible output format
          // this is for a11y, mobile, print and other possible output modes
          const urlParams = new URLSearchParams(globalThis.location.search);
          const format = urlParams.get("format");
          if (format != null) {
            switch (format) {
              case "print-page":
                this.themeData.element = "haxcms-print-theme";
                break;
            }
          }
          const disableFeatures = urlParams.get("disable-features");
          if (disableFeatures != null) {
            this.disableFeatures = disableFeatures;
          }
        }
        if (this.themeData && this.themeData.element !== this.themeName) {
          this.themeName = this.themeData.element;
        }
        this.__disposer.push(reaction);
      });
      autorun((reaction) => {
        const activeItem = toJS(store.activeItem);
        if (activeItem && activeItem.location) {
          this.activeItemLocation = activeItem.location;
        }
        this.__disposer.push(reaction);
      });
    }, 0);
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  storeReady(e) {
    // append UI element to body to avoid stack order issues
    if (
      store.cmsSiteEditor &&
      store.cmsSiteEditor.instance &&
      globalThis.HaxStore.requestAvailability().activeHaxBody &&
      store.activeItemContent
    ) {
      globalThis.HaxStore.requestAvailability().activeHaxBody.importContent(
        store.activeItemContent,
      );
    }
  }
  /**
   * Find custom element tags and replace with replace-tag for performance gains based on device context
   */
  replaceTagReplacement(html) {
    // all closing tags
    var myRegexp = /\<(\w+?\-\w*.*)\s*?\>/gim;
    // execute 1st match
    var match = myRegexp.exec(html);
    while (match != null) {
      let tag = match[1].replace("<", "").replace(">", "");
      if (tag.indexOf(" ")) {
        tag = tag.split(" ")[0];
      }
      // replace the matching custom element tag name with replace-tag
      if (tag.indexOf("-") != -1) {
        // shift the replacement over to with; leave everything else the same
        html = html.replace("<" + tag, '<replace-tag with="' + tag + '" ');
        // ensure a matching closing tag is also updated
        html = html.replace("</" + tag + ">", "</replace-tag>");
      }
      // execute again, which processes the next tag
      match = myRegexp.exec(html);
    }
    return html;
  }
  /**
   * React to content being loaded from a page.
   */
  _activeItemContentChanged(newValue, oldValue) {
    if (newValue) {
      var html = newValue;
      // only append if not empty
      if (html !== null && store.activeItem && store.activeItem.metadata) {
        wipeSlot(store.themeElement, "*");
        // force a page break w/ the relevant details in code
        // this allows the UI to be modified
        // required fields followed by optional fields if defined
        newValue = `<page-break
        break-type="site"
        title="${store.activeItem.title}"
        parent="${store.activeItem.parent}"
        item-id="${store.activeItem.id}"
        slug="${store.activeItem.slug}"
        description="${store.activeItem.description}"
        order="${store.activeItem.order}"
        ${store.activeItem.metadata.pageType ? `page-type="${store.activeItem.metadata.pageType}"` : ``}
        ${store.activeItem.metadata.tags ? `tags="${store.activeItem.metadata.tags}"` : ``}
        ${store.activeItem.metadata.hideInMenu ? `hide-in-menu="hide-in-menu"` : ``}
        ${store.activeItem.metadata.relatedItems ? `related-items="${store.activeItem.metadata.relatedItems}"` : ``}
        ${store.activeItem.metadata.image ? `image="${store.activeItem.metadata.image}"` : ``}
        ${store.activeItem.metadata.icon ? `icon="${store.activeItem.metadata.icon}"` : ``}
        ${store.activeItem.metadata.accentColor ? `accent-color="${store.activeItem.metadata.accentColor}"` : ``}
        ${store.activeItem.metadata.theme && store.activeItem.metadata.theme.key ? `developer-theme="${store.activeItem.metadata.theme.key}"` : ``}
        ${store.activeItem.metadata.locked ? 'locked="locked"' : ""}
        ${store.activeItem.metadata.published === false ? "" : 'published="published"'} ></page-break>${newValue}`;
        html = encapScript(newValue);
        // set in the store
        store.activeItemContent = html;
        // insert the content as quickly as possible, then work on the dynamic imports
        setTimeout(() => {
          if (store.themeElement.childNodes.length === 0) {
            let frag = document
              .createRange()
              .createContextualFragment(this.replaceTagReplacement(html));
            store.themeElement.appendChild(frag);
            this.dispatchEvent(
              new CustomEvent("json-outline-schema-active-body-changed", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: html,
              }),
            );
          }
          // if there are, dynamically import them but only if we don't have a global manager
          if (
            !globalThis.WCAutoload &&
            varExists(this.manifest, "metadata.node.dynamicElementLoader")
          ) {
            let tagsFound = findTagsInHTML(html);
            const basePath =
              new URL("./locales/haxcms.es.json", import.meta.url).href +
              "/../";
            for (var i in tagsFound) {
              const tagName = tagsFound[i];
              if (
                this.manifest.metadata.node.dynamicElementLoader[tagName] &&
                !globalThis.customElements.get(tagName)
              ) {
                // prettier-ignore
                import(
                  `${basePath}../../../../${this.manifest.metadata.node.dynamicElementLoader[tagName]}`
                )
                  .then((response) => {
                    //console.warn(tagName + ' dynamic import');
                  })
                  .catch((error) => {
                    /* Error handling */
                    console.warn(error);
                  });
              }
            }
          } else if (globalThis.WCAutoload) {
            setTimeout(() => {
              globalThis.WCAutoload.process();
            }, 0);
          }
        }, 5);
      }
    }
  }
  /**
   * Active item updated, let's request the content from it
   */
  _activeItemChanged(newValue, oldValue) {
    if (
      this.shadowRoot &&
      newValue &&
      typeof newValue.id !== typeof undefined
    ) {
      this.queryParams.nodeId = newValue.id;
    }
    // we had something, now we don't. wipe out the content area of the theme
    else if (oldValue && !newValue) {
      // fire event w/ nothing, this is because there is no content
      this.dispatchEvent(
        new CustomEvent("json-outline-schema-active-body-changed", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: null,
        }),
      );
    }
  }

  /**
   * got a message that we need to update our json manifest data
   */
  _triggerUpdatedData(e) {
    // get fresh data if not published
    if (this.isLoggedIn) {
      this._timeStamp = Math.floor(Date.now() / 1000);
    } else {
      this._timeStamp = "";
    }
  }

  /**
   * got a message that we need to update our page content
   */
  _triggerUpdatedNode(e) {
    this.loadPageData();
  }
  /**
   * notice manifest changes and ensure slot is rebuilt.
   */
  _manifestChanged(newValue, oldValue) {
    if (newValue && newValue.metadata && newValue.items) {
      store.loadManifest(newValue, this);
    }
  }
  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeChanged(newValue, oldValue) {
    if (newValue) {
      this.themeLoaded = false;
      let theme = newValue;
      // create the 'theme' as a new element
      // weird but definition already here so we should be able
      // to just use this without an import, it's possible..
      if (typeof this.__imported[theme.element] !== typeof undefined) {
        this.themeLoaded = true;
      } else {
        // global will handle this
        if (globalThis.WCAutoload) {
          this.__imported[theme.element] = theme.element;
          this.themeLoaded = true;
          setTimeout(() => {
            globalThis.WCAutoload.process();
            globalThis.dispatchEvent(
              new CustomEvent("haxcms-theme-ready", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: this,
              }),
            );
          }, 5);
        } else {
          // import the reference to the item dynamically, if we can
          try {
            // prettier-ignore
            import(new URL("./../../../../../" + newValue.path, import.meta.url).href).then((e) => {
              // add it into ourselves so it unpacks and we kick this off!
              this.__imported[theme.element] = theme.element;
              this.themeLoaded = true;
            });
          } catch (err) {
            // error in the event this is a double registration
            // also strange to be able to reach this but technically possible
            this.themeLoaded = true;
          }
        }
      }
    }
  }
}
// this global allows a backdoor into activating the HAXcms editor UI
// this is only going to be visually enabled but it won't actually
// be able to talk to the backend correctly bc the JWT won't exist
// the endpoints are also fictional. also useful for testing purposes
globalThis.HAXme = function (context = null) {
  if (context == null) {
    // fake a demo
    context = "demo";
    // fake endpoints
    globalThis.appSettings = {
      login: "dist/dev/login.json",
      logout: "dist/dev/logout.json",
      saveNodePath: "dist/dev/saveNode.json",
      saveManifestPath: "dist/dev/saveManifestPath.json",
      createNodePath: "dist/dev/saveNode.json",
      deleteNodePath: "dist/dev/saveNode.json",
      saveOutlinePath: "dist/dev/saveNode.json",
      publishSitePath: "dist/dev/saveNode.json",
      syncSitePath: "dist/dev/saveNode.json",
      getSiteFieldsPath: "dist/dev/getSiteFieldsPath.json",
      revertSitePath: "dist/dev/saveNode.json",
      getFormToken: "adskjadshjudfu823u823u8fu8fij",
      appStore: {
        url: "dist/dev/appstore.json",
      },
      jwt: "made-up-thing",
      // add your custom theme here if testing locally and wanting to emulate the theme selector
      // this isn't really nessecary though
      themes: {
        "haxcms-dev-theme": {
          element: "haxcms-dev-theme",
          path: "@haxtheweb/haxcms-elements/lib/haxcms-dev-theme.js",
          name: "Developer theme",
        },
      },
    };
  }
  if (context == "demo") {
    globalThis.HAXCMSContext = "demo";
  }
  // apply context
  if (globalThis.document.body) {
    globalThis.document.body.querySelector(
      "haxcms-editor-builder",
    ).__appliedContext = false;
    globalThis.document.body
      .querySelector("haxcms-editor-builder")
      .applyContext(context);
  }
};

customElements.define(HAXCMSSiteBuilder.tag, HAXCMSSiteBuilder);
export { HAXCMSSiteBuilder };
