import { html, css, unsafeCSS } from "lit";
import { store } from "./haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import {
  localStorageSet,
  winEventsElement,
  validURL,
} from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { HAXCMSThemeParts } from "./utils/HAXCMSThemeParts.js";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "./ui/app-hax-top-bar.js";
import "./ui/app-hax-user-menu.js";
import "./ui/app-hax-user-menu-button.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import "@haxtheweb/super-daemon/lib/super-daemon-search.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { HAXCMSKeyboardShortcutsInstance } from "./utils/HAXCMSKeyboardShortcuts.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "./haxcms-site-insights.js";
import "@haxtheweb/simple-fields/lib/simple-fields-form.js";
import "./micros/haxcms-button-add.js";
import "./haxcms-darkmode-toggle.js";
import "../ui-components/site/site-remote-content.js";
import "@haxtheweb/page-flag/page-flag.js";
import "wired-elements/lib/wired-button.js";

const LogOut = new URL("../assets/images/Logout.svg", import.meta.url).href;
/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
class HAXCMSSiteEditorUI extends HAXCMSThemeParts(
  HAXCMSI18NMixin(winEventsElement(ResponsiveUtilityBehaviors(DDD))),
) {
  static get styles() {
    return [
      super.styles,
      css`
        :host *:not(:defined) {
          display: none;
        }
        :host {
          display: block;
          position: relative;
          height: 48px;
          left: 0;
          top: 0;
          right: 0;
          margin-top: 0;
          opacity: 1;
          transition: all 0.6s ease-in-out;
          z-index: 10000;
          visibility: visible;
        }
        :host([edit-mode]) {
          z-index: 9999;
        }
        :host *[hidden] {
          display: none;
        }
        simple-tooltip:not(:defined) {
          display: none !important;
        }
        :host([painting]) {
          opacity: 0;
          margin-top: -48px;
          visibility: hidden;
        }
        #editbutton {
          visibility: hidden;
          opacity: 0;
        }

        #saveandeditbutton {
          visibility: hidden;
          opacity: 0;
        }

        :host([page-allowed]) #editbutton,
        :host([page-allowed]) #saveandeditbutton,
        :host([page-allowed]) #editdetails {
          visibility: visible;
          opacity: 1;
        }
        /* Ensure edit and save buttons are visible when in edit mode */
        :host([edit-mode]) #editbutton,
        :host([edit-mode]) #saveandeditbutton {
          visibility: visible;
          opacity: 1;
        }
        #saveandeditbutton,
        #editbutton {
          background-color: var(--ddd-theme-default-skyBlue);
          color: white; /* Ensure text is visible on blue background */
        }

        #merlin,
        .merlin {
          color: var(--ddd-theme-default-wonderPurple);
        }

        super-daemon-search.merlin {
          border: var(--ddd-border-xs);
        }

        :host([dark-mode]) #merlin,
        :host([dark-mode]) .merlin {
          color: white; /* Ensure text is visible on blue background */
        }

        #cancelbutton {
          background-color: var(--ddd-theme-default-discoveryCoral);
          color: white; /* Ensure text is visible on blue background */
        }
        haxcms-button-add {
          color: inherit;
          background-color: var(--simple-colors-default-theme-grey-1);
          --simple-toolbar-border-color: var(--ddd-theme-default-limestoneGray);
        }
        haxcms-button-add::part(button) {
          --simple-toolbar-button-border-width: 1px;
          border-bottom: 0;
        }

        simple-toolbar-menu-item a {
          color: var(--simple-colors-default-theme-grey-12);
          text-decoration: none;
        }
        simple-toolbar-menu-item simple-toolbar-button {
          --simple-toolbar-button-min-width: 100%;
        }

        simple-toolbar-button.top-bar-button::part(button) {
          --simple-toolbar-button-border-width: 1px;
          border-bottom: 0;
        }
        simple-toolbar-button.merlin:hover,
        simple-toolbar-button.merlin:active,
        simple-toolbar-button.merlin:focus {
          background-color: var(--simple-colors-default-theme-purple-1);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        simple-toolbar-menu:hover,
        simple-toolbar-menu:active,
        simple-toolbar-menu:focus,
        simple-toolbar-button:not(.merlin):hover,
        simple-toolbar-button:not(.merlin):active,
        simple-toolbar-button:not(.merlin):focus,
        haxcms-button-add:hover,
        haxcms-button-add:active,
        haxcms-button-add:focus {
          color: var(--hax-ui-color);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus {
          --simple-toolbar-border-color: black;
        }
        :host(:hover),
        :host(:active),
        :host(:focus) {
          opacity: 1;
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 300ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
        }
        app-hax-top-bar {
          z-index: 1000;
          right: 8px;
          left: 8px;
          position: fixed;
          transition-delay: 0.9s;
          transition: all 0.9s ease-in-out;
        }
        app-hax-top-bar[edit-mode] {
          right: 0px;
          left: 0px;
        }
        :host([dark-mode]) app-hax-top-bar {
          --bg-color: #000;
          --accent-color: #fff;
        }
        app-hax-top-bar::part(top-bar) {
          grid-template-columns: 5% 85% 10%;
          overflow: visible;
        }
        .haxLogo {
          color: var(--simple-colors-default-theme-accent-11, black);
        }
        :host([dark-mode]) .haxLogo:hover,
        :host([dark-mode]) .haxLogo:focus,
        :host([dark-mode]) .haxLogo:active,
        .haxLogo:hover,
        .haxLogo:focus,
        .haxLogo:active {
          color: var(--haxcms-color);
        }
        .haxLogo simple-icon-lite {
          --simple-icon-height: 32px;
          --simple-icon-width: 32px;
          margin: 8px;
          transition: all 0.3s ease-in-out;
        }
        .soundToggle {
          position: relative;
          display: inline-flex;
          vertical-align: top;
        }

        .soundToggle img {
          width: 24px;
          height: 24px;
        }

        :host([edit-mode]) simple-toolbar simple-toolbar-button,
        :host([edit-mode]) simple-toolbar simple-toolbar-menu {
          --simple-toolbar-border-color: #dddddd;
        }

        simple-toolbar simple-toolbar-button,
        simple-toolbar simple-toolbar-menu {
          --simple-toolbar-border-radius: 0;
          background-color: var(--simple-colors-default-theme-grey-1);
        }

        app-hax-search-bar {
          vertical-align: middle;
          display: inline-flex;
        }
        .toolbar-buttons {
          display: flex;
          align-items: stretch;
          justify-content: center;
          height: var(--top-bar-height);
          gap: 0;
        }
        .toolbar-buttons simple-toolbar-button,
        .toolbar-buttons simple-toolbar-menu,
        .toolbar-buttons haxcms-button-add {
          min-width: 48px;
          --simple-toolbar-button-disabled-opacity: 0.3;
          --simple-toolbar-button-padding: 3px 6px;
          --simple-toolbar-border-radius: 0;
        }
        .toolbar-buttons simple-toolbar-menu {
          --a11y-menu-button-bg-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --a11y-menu-button-list-bg-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --a11y-menu-button-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        simple-toolbar {
          align-items: stretch;
          justify-content: center;
          height: var(--top-bar-height);
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.3;
          --simple-toolbar-button-padding: 3px 6px;
        }
        simple-toolbar[dark-mode] {
          --simple-toolbar-button-color: #e0e0e0;
          --simple-toolbar-button-hover-color: #fff;
          --simple-toolbar-button-bg: #222;
          --simple-toolbar-button-hover-bg: #000;
        }
        simple-toolbar::part(buttons) {
          flex: 0 1 auto;
        }
        .ops-panel {
          justify-content: space-around;
          display: flex;
          padding: 4px 0px;
        }

        .topbar-character {
          cursor: pointer;
          display: inline-block;
          border: none;
          border-radius: 0px;
          padding: 0 8px;
          margin: 0 0 0 16px;
          background-color: transparent;
          height: 48px;
          max-width: 160px;
          overflow: hidden;
          word-break: break-all;
          transition: all 0.6 ease-in-out;
          color: #222;
        }
        .characterbtn-name {
          margin-left: 8px;
          font-size: 12px;
          vertical-align: bottom;
          line-height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 48px;
          word-break: break-all;
        }
        :host([dark-mode]) .topbar-character,
        :host([dark-mode]) .topbar-character {
          color: #e0e0e0;
          background-color: #222;
        }
        .topbar-character rpg-character {
          margin: -4px -14px 0px -10px;
          height: 52px;
          width: 64px;
          display: inline-block;
          transform: scale(0.7);
          transition: all 0.5 ease-in-out;
        }
        .topbar-character:hover rpg-character,
        .topbar-character:focus rpg-character {
          transform: scale(0.9);
        }

        .mysiteslink {
          text-decoration: none;
        }

        .logout::part(menu-button) {
          background-image: url("${unsafeCSS(LogOut)}");
          background-repeat: no-repeat;
          background-position: center center;
          text-align: center;
          background-size: cover;
          border-top: 0px;
          border-bottom: 0px;
          padding: 10px;
        }
        app-hax-user-menu app-hax-user-menu-button::part(menu-button) {
          font-size: 12px;
        }
        simple-toolbar-menu,
        simple-toolbar-button {
          min-width: 48px;
          margin: 0;
          --simple-toolbar-border-color: var(--ddd-theme-default-limestoneGray);
        }
        simple-toolbar-menu-item.menu-item-delete simple-toolbar-button {
          border-top: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          margin-top: var(--ddd-spacing-1);
          padding-top: var(--ddd-spacing-2);
        }
        simple-toolbar-menu-item.menu-item-delete simple-toolbar-button:hover {
          color: var(--ddd-theme-default-error);
          background-color: var(--ddd-theme-default-errorLight);
        }

        @media screen and (max-width: 800px) {
          :host([edit-mode]) {
            bottom: unset;
          }
          app-hax-top-bar::part(top-bar) {
            display: grid;
          }
          #undo,
          #redo {
            display: none;
          }
          .topbar-character {
            padding: 0;
            margin: 0;
          }
          .characterbtn-name {
            padding: 0;
            margin: 0;
            width: 30px;
            display: inline-flex;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: -2px;
            margin-left: -6px;
          }
          simple-toolbar {
            --simple-toolbar-button-padding: 3px 3px;
          }
          .characterbtn-name,
          haxcms-button-add,
          simple-toolbar-menu,
          simple-toolbar-button {
            font-size: 10px;
          }
          simple-toolbar-menu {
            --icon-offset-right: 2px;
            --icon-offset-left: 2px;
          }
          simple-toolbar-menu::part(dropdown-icon) {
            right: 0;
            top: 10px;
          }
          :host([edit-mode]) #addmenubutton,
          :host([edit-mode]) #editdetails {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .haxLogo {
            display: none;
          }

          .topbar-character rpg-character {
            margin: 0 0 0px -8px;
            height: 10px;
            width: 48px;
          }
          simple-toolbar {
            --simple-toolbar-button-padding: 0px;
            justify-content: space-between;
            background-color: white;
            height: auto;
          }
          .characterbtn-name {
            padding: 0px;
            margin: -42px 8px 0px 0px;
            width: 40px;
            display: block;
            text-overflow: ellipsis;
            font-size: 12px;
            font-family: auto;
            letter-spacing: normal;
            font-weight: normal;
          }
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor-ui";
  }

  _expandSettingsPanel(e) {
    this.shadowRoot.querySelector("#content-edit").click();
  }

  // a file needs to be selected via the program and then sub-program options presented
  selectFileToProcess() {
    import("@haxtheweb/file-system-broker/file-system-broker.js").then(
      async (e) => {
        const broker = globalThis.FileSystemBroker.requestAvailability();
        const contents = await broker.getFileContents("*");
        const fileData = broker.fileHandler;
        let tmp = fileData.name.split(".");
        let type = "";
        // don't assume there is a file extension
        if (tmp.length > 1) {
          type = tmp.pop();
        }
        // wand hands off for next part now that we've got a file selected
        SuperDaemonInstance.waveWand(
          [
            "",
            "/",
            {
              operation: "file-selected",
              contents: contents,
              data: fileData,
              type: type,
            },
            "hax-agent",
            "Agent",
          ],
          this.shadowRoot.querySelector("#merlin"),
          "coin2",
        );
      },
    );
  }

  // Process URL directly from Merlin search input
  processUrlFromInput(input) {
    const url = input.trim();
    if (this.isValidUrl(url)) {
      // wand hands off for next part now that we've got a URL entered
      SuperDaemonInstance.waveWand(
        [
          "",
          "/",
          {
            operation: "url-selected",
            url: url,
            data: url,
          },
          "hax-link-agent",
          "Link Agent",
        ],
        this.shadowRoot.querySelector("#merlin"),
        "coin2",
      );
    } else {
      store.toast("Invalid URL provided", 3000, { hat: "construction" });
    }
  }

  // URL validation helper
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // URL type detection helper
  detectUrlType(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      const search = urlObj.search.toLowerCase();

      // YouTube detection
      if (
        hostname.includes("youtube.com") ||
        hostname.includes("youtu.be") ||
        hostname.includes("m.youtube.com")
      ) {
        return "youtube";
      }

      // Image detection (by extension)
      if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) {
        return "image";
      }

      // Video detection (by extension)
      if (pathname.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv)$/i)) {
        return "video";
      }

      // PDF detection
      if (pathname.match(/\.pdf$/i) || search.includes(".pdf")) {
        return "pdf";
      }

      // Audio detection
      if (pathname.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/i)) {
        return "audio";
      }

      return "generic";
    } catch (error) {
      return "generic";
    }
  }

  // URL processing method similar to processFileContentsBasedOnUserDesire
  async processUrlContentsBasedOnUserDesire(values, mode) {
    const url = values.url;
    this.setProcessingVisual();

    // Ensure we're in edit mode
    if (store.editMode === false) {
      store.editMode = true;
    }

    setTimeout(() => {
      let elementToInsert = null;

      switch (mode) {
        case "embed-youtube":
          // Extract YouTube video ID
          const videoId = this.extractYouTubeId(url);
          if (videoId) {
            elementToInsert = HAXStore.activeHaxBody.haxInsert(
              "video-player",
              "",
              {
                source: `https://www.youtube.com/watch?v=${videoId}`,
                "source-type": "youtube",
              },
            );
          }
          break;

        case "insert-image":
          elementToInsert = HAXStore.activeHaxBody.haxInsert("img", "", {
            src: url,
            alt: "Image from URL",
            loading: "lazy",
          });
          break;

        case "embed-pdf":
          elementToInsert = HAXStore.activeHaxBody.haxInsert("iframe", "", {
            src: url,
            width: "100%",
            height: "500px",
            frameborder: "0",
          });
          break;

        case "embed-video":
          elementToInsert = HAXStore.activeHaxBody.haxInsert("video", "", {
            src: url,
            controls: true,
            width: "100%",
          });
          break;

        case "insert-rich-link":
          // Try to create a rich link with preview
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;

        case "hax-default":
          // Use HAX's original insertLogicFromValues method for automatic detection
          const haxValues = {
            source: url,
            title: values.title || url,
          };
          if (
            HAXStore.insertLogicFromValues(haxValues, HAXStore, false, true)
          ) {
            return;
          }
          // Fallback to simple link if HAX logic doesn't handle it
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;

        case "apply-to-selected-text":
          // Apply URL as link to currently selected text
          const selection = globalThis.getSelection();
          if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString().trim();

            if (selectedText && range) {
              const linkElement = globalThis.document.createElement("a");
              linkElement.setAttribute("href", url);
              linkElement.setAttribute("target", "_blank");
              linkElement.setAttribute("rel", "noopener noreferrer");
              linkElement.textContent = selectedText;

              range.deleteContents();
              range.insertNode(linkElement);

              // Position cursor after the link
              setTimeout(() => {
                range.setStartAfter(linkElement);
                range.setEndAfter(linkElement);
                selection.removeAllRanges();
                selection.addRange(range);
              }, 0);

              store.toast("Link applied to selected text!", 3000, {
                hat: "construction",
                walking: true,
              });
              return;
            }
          }
          // Fallback to simple link if no selection
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;

        case "insert-simple-link":
        default:
          elementToInsert = HAXStore.activeHaxBody.haxInsert("a", url, {
            href: url,
            target: "_blank",
            rel: "noopener",
          });
          break;
      }

      if (elementToInsert) {
        store.toast("URL processed successfully!", 3000, {
          hat: "construction",
          walking: true,
        });
      }
    }, 300);
  }

  // Helper to extract YouTube video ID from various YouTube URL formats
  extractYouTubeId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // processing visualization
  setProcessingVisual() {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.marginLeft = "8px";
    store.toast(`Processing`, 5000, {
      hat: "construction",
      speed: 150,
      walking: true,
      slot: loadingIcon,
    });
  }

  // Convert CSV text to an HTML table element
  csvToHtmlTable(csvText) {
    try {
      const table = globalThis.document.createElement("table");
      const tbody = globalThis.document.createElement("tbody");
      table.appendChild(tbody);

      // Simple CSV parser that handles quoted fields with commas
      const rows = [];
      let i = 0;
      let field = "";
      let row = [];
      let inQuotes = false;

      const pushField = () => {
        // Unwrap quotes and unescape double quotes
        let val = field;
        if (val.length > 0 && val[0] === '"' && val[val.length - 1] === '"') {
          val = val.substring(1, val.length - 1).replace(/""/g, '"');
        }
        row.push(val);
        field = "";
      };

      while (i < csvText.length) {
        const char = csvText[i];
        if (inQuotes) {
          if (char === '"') {
            if (csvText[i + 1] === '"') {
              field += '"';
              i += 2;
              continue;
            } else {
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            field += char;
            i++;
            continue;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
            i++;
            continue;
          }
          if (char === ",") {
            pushField();
            i++;
            continue;
          }
          if (char === "\n" || char === "\r") {
            // handle CRLF and LF
            if (char === "\r" && csvText[i + 1] === "\n") {
              i += 2;
            } else {
              i++;
            }
            pushField();
            rows.push(row);
            row = [];
            continue;
          }
          field += char;
          i++;
        }
      }
      // push last field/row
      pushField();
      if (row.length > 0) {
        rows.push(row);
      }

      // build table body
      rows.forEach((cols, idx) => {
        if (cols.length === 1 && cols[0].trim() === "") return;
        const tr = globalThis.document.createElement("tr");
        cols.forEach((col) => {
          const cell =
            idx === 0
              ? globalThis.document.createElement("th")
              : globalThis.document.createElement("td");
          // escape
          const span = globalThis.document.createElement("span");
          span.textContent = col;
          cell.appendChild(span);
          tr.appendChild(cell);
        });
        tbody.appendChild(tr);
      });

      // basic styling hooks; DDD can style table generically
      table.setAttribute("border", "1");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      return table;
    } catch (e) {
      console.warn("CSV to table conversion failed:", e);
      return null;
    }
  }

  // upload file and do what the user asked contextually
  async processFileContentsBasedOnUserDesire(values, mode, operationType) {
    const usData = toJS(UserScaffoldInstance.data);
    const e = usData.event;
    this.setProcessingVisual();
    switch (mode) {
      // upload and possibly link/embed the item
      case "set-page-media":
        // Upload file first, then set as page media
        this.dispatchEvent(
          new CustomEvent("hax-file-upload", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              file: values.data,
              placeHolderElement: null,
              operationType: "upload-only",
              callback: (fileData) => {
                // After upload completes, set as page media
                const item = toJS(store.activeItem);
                if (item && item.id && fileData && fileData.file) {
                  globalThis.dispatchEvent(
                    new CustomEvent("haxcms-save-node-details", {
                      bubbles: true,
                      composed: true,
                      cancelable: true,
                      detail: {
                        id: item.id,
                        operation: "setMedia",
                        media: fileData.file,
                      },
                    }),
                  );
                  store.toast("Page media updated successfully!", 3000, {
                    hat: "construction",
                    walking: true,
                  });
                }
              },
            },
          }),
        );
        break;
      case "upload":
      case "link":
      case "insert-file":
        if (mode === "upload") {
          // do the uploading
          // confirm it went through
          // put link in the dialog confirmation if desired to open in new window
          // fire this specialized event up so things like HAX can intercept
          this.dispatchEvent(
            new CustomEvent("hax-file-upload", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                file: values.data,
                placeHolderElement: null,
                operationType: operationType,
              },
            }),
          );
        } else if (mode === "link") {
          if (store.editMode === false) {
            store.editMode = true;
          }
          // do the uploading
          // take resulting upload
          // put in editMode if we have to
          // insert link in bottom of page / below whatever is active
          setTimeout(() => {
            let p = HAXStore.activeHaxBody.haxInsert("p", "", {});
            // fire this specialized event up so things like HAX can intercept
            this.dispatchEvent(
              new CustomEvent("hax-file-upload", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  file: values.data,
                  placeHolderElement: p,
                  operationType: operationType,
                },
              }),
            );
          }, 300);
        } else {
          if (store.editMode === false) {
            store.editMode = true;
          }
          // upload
          // take resulting upload
          // put in editMode if we have to
          // insert result into bottom of page / active
          // allowing hax to evaluate what type should be inserted (gizmoGuess)
          setTimeout(() => {
            let p = HAXStore.activeHaxBody.haxInsert("p", "", {});
            // fire this specialized event up so things like HAX can intercept
            this.dispatchEvent(
              new CustomEvent("hax-file-upload", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  file: values.data,
                  placeHolderElement: p,
                  operationType: operationType,
                },
              }),
            );
          }, 300);
        }
        break;
      case "insert-table":
      case "insert-csv":
        // Handle Excel file conversion to CSV and table
        let excelDataToPost = new FormData();
        excelDataToPost.append("upload", values.data); // Excel file

        if (store.editMode === false) {
          store.editMode = true;
        }

        try {
          const excelResponse = await MicroFrontendRegistry.call(
            "@core/xlsxToCsv",
            excelDataToPost,
          );

          if (excelResponse.status === 200) {
            const csvData = excelResponse.data.contents;

            setTimeout(() => {
              if (mode === "insert-table") {
                // Convert CSV to HTML table
                const tableElement = this.csvToHtmlTable(csvData);
                if (tableElement) {
                  HAXStore.activeHaxBody.haxInsert(
                    "table",
                    tableElement.innerHTML,
                    {},
                  );
                  store.toast("Excel converted to table successfully!", 3000, {
                    hat: "construction",
                    walking: true,
                  });
                }
              } else {
                // Insert as formatted CSV text
                const preElement = HAXStore.activeHaxBody.haxInsert(
                  "pre",
                  csvData,
                  {},
                );
                store.toast("Excel converted to CSV text!", 3000, {
                  hat: "construction",
                  walking: true,
                });
              }
            }, 300);
          } else {
            store.toast(
              `Error converting Excel file: ${excelResponse.data.error || "Unknown error"}`,
              4000,
              {
                hat: "construction",
              },
            );
          }
        } catch (error) {
          console.error("Excel conversion error:", error);
          store.toast(`Error processing Excel file: ${error.message}`, 4000, {
            hat: "construction",
          });
        }
        break;
      case "insert-html":
      case "create-sibling":
      case "create-child":
      case "create-branch":
        let endpointCall = null;
        let dataToPost = new FormData();
        switch (values.type) {
          case "docx":
          case "doc":
            dataToPost.append("upload", values.data); // should contain our file
            // single file vs whole site processing
            endpointCall = "@core/docxToHtml";
            if (mode === "create-branch") {
              endpointCall = "@haxcms/docxToSite";
              dataToPost.append("method", "branch");
              dataToPost.append("type", "branch");
              // set parent to same as current page's parent
              const item = toJS(store.activeItem);
              dataToPost.append("parentId", item.parent);
            }
            break;
          case "md":
          case "txt":
            endpointCall = "@core/mdToHtml";
            dataToPost = {
              md: values.contents,
            };
            break;
          case "html":
          case "htm":
            // take content directly
            break;
        }
        // put in editMode if we have to
        // insert result into bottom of page
        let response = {};

        if (endpointCall) {
          if (mode === "insert-html") {
            response = await MicroFrontendRegistry.call(
              endpointCall,
              dataToPost,
            );
            if (response.status == 200) {
              // fake file event from built in method for same ux
              this.insertElementsFromContentBlob(
                response.data.contents || response.data,
              );
            }
          } else {
            response = await MicroFrontendRegistry.call(
              endpointCall,
              dataToPost,
            );
            if (response.status == 200) {
              if (["create-sibling", "create-child"].includes(mode)) {
                this.createNewNode(
                  mode.replace("create-", ""),
                  values.data.name,
                  response.data.contents || response.data,
                );
              } else {
                // must be a valid response and have at least SOME html to bother attempting
                if (response.data && response.data.contents != "") {
                  // right here is where we need to interject our confirmation dialog
                  // workflow. We can take the items that just came back and visualize them
                  // using our outline / hierarchy visualization
                  let reqBody = {};
                  reqBody.items = response.data.items;
                  await import(
                    "@haxtheweb/outline-designer/outline-designer.js"
                  ).then(async (e) => {
                    reqBody.jwt = toJS(store.jwt);
                    reqBody.site = {
                      name: toJS(store.manifest.metadata.site.name),
                    };
                    const outline =
                      globalThis.document.createElement("outline-designer");
                    outline.items = response.data.items;
                    outline.eventData = reqBody;
                    outline.storeTools = true;

                    const b1 = globalThis.document.createElement("button");
                    b1.innerText = "Confirm";
                    b1.classList.add("hax-modal-btn");
                    b1.addEventListener("click", async (e) => {
                      const data = await outline.getData();
                      let deleted = 0;
                      let modified = 0;
                      let added = 0;
                      data.items.map((item) => {
                        if (item.delete) {
                          deleted++;
                        } else if (item.new) {
                          added++;
                        } else if (item.modified) {
                          modified++;
                        }
                      });
                      let sumChanges = `${
                        added > 0
                          ? `‣ ${added} new pages will be created\n`
                          : ""
                      }${
                        modified > 0
                          ? `‣ ${modified} pages will be updated\n`
                          : ""
                      }${
                        deleted > 0
                          ? `‣ ${deleted} pages will be deleted\n`
                          : ""
                      }`;
                      let confirmation = false;
                      // no confirmation required if there are no tracked changes
                      if (sumChanges == "") {
                        confirmation = true;
                      } else {
                        confirmation = globalThis.confirm(
                          `Saving will commit the following actions:\n${sumChanges}\nAre you sure?`,
                        );
                      }
                      if (confirmation) {
                        // @todo absolutely hate this solution. when we clean out the rats nest
                        // that is iron-ajax calls in site-editor then we can simplify this action
                        store
                          .cmsSiteEditorAvailability()
                          .querySelector("#createajax").body = data;
                        this.setProcessingVisual();
                        // @todo absolutely hate this solution. when we clean out the rats nest
                        // that is iron-ajax calls in site-editor then we can simplify this action
                        store
                          .cmsSiteEditorAvailability()
                          .querySelector("#createajax")
                          .generateRequest();
                        const evt = new CustomEvent("simple-modal-hide", {
                          bubbles: true,
                          composed: true,
                          cancelable: true,
                          detail: {},
                        });
                        globalThis.dispatchEvent(evt);
                      }
                    });
                    const b2 = globalThis.document.createElement("button");
                    b2.innerText = "Cancel";
                    b2.classList.add("hax-modal-btn");
                    b2.classList.add("cancel");
                    b2.addEventListener("click", (e) => {
                      const evt = new CustomEvent("simple-modal-hide", {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        detail: {},
                      });
                      globalThis.dispatchEvent(evt);
                    });
                    // button container
                    const div = globalThis.document.createElement("div");
                    div.appendChild(b1);
                    div.appendChild(b2);

                    this.dispatchEvent(
                      new CustomEvent("simple-modal-show", {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        detail: {
                          title: "Confirm structure",
                          elements: { content: outline, buttons: div },
                          modal: true,
                          styles: {
                            "--simple-modal-titlebar-background": "transparent",
                            "--simple-modal-titlebar-color": "black",
                            "--simple-modal-width": "90vw",
                            "--simple-modal-min-width": "300px",
                            "--simple-modal-z-index": "100000000",
                            "--simple-modal-height": "90vh",
                            "--simple-modal-min-height": "400px",
                            "--simple-modal-titlebar-height": "80px",
                          },
                        },
                      }),
                    );
                  });
                }
              }
            }
          }
        } else {
          // implies HTML so just use the file without processing
          // we don't support create-branch for this yet
          if (mode === "insert-html") {
            this.insertElementsFromContentBlob(values.contents);
          }
          // @todo we may support create-branch in the future for non-docx paths but just in case we goof up for now
          else if (mode !== "create-branch") {
            this.createNewNode(
              mode.replace("create-", ""),
              values.data.name,
              values.contents,
            );
          }
        }
        break;
    }
  }
  // create node w/ title and contents passed in
  async createNewNode(type, title = "New page", contents = "<p></p>") {
    let order = null;
    let parent = null;
    const item = toJS(store.activeItem);
    if (item) {
      if (type === "sibling") {
        parent = item.parent;
        // same so its put right next to it
        order = parseInt(item.order);
      } else if (type === "child") {
        parent = item.id;
        // find last child, or just be the 1st one.
        let tmp = toJS(await store.getLastChildItem(item.id)).order;
        order = 0;
        if (tmp || tmp === 0) {
          order = tmp + 1;
        }
      } else if (type === "branch") {
        parent = null;
        order = 0;
      } else {
        // API invoked incorrectly
        parent = null;
        order = 0;
      }
    }
    if (title == "") {
      title = "New page";
    }
    var payload = {
      node: {
        title: title,
        location: "",
        contents: contents,
      },
      order: order,
      parent: parent,
    };
    // haxcms is in charge of making the node from here
    this.dispatchEvent(
      new CustomEvent("haxcms-create-node", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          originalTarget: this,
          values: payload,
        },
      }),
    );
  }

  // insert content based on the contents we read from a file
  // this will be under the active node
  insertElementsFromContentBlob(content) {
    let addToEnd = false;
    // insert HTML needs to be editing the active page if its not in edit mode
    if (store.editMode === false) {
      store.editMode = true;
      addToEnd = true;
    } else if (this.activeNode.hasAttribute("slot")) {
      // test for slot on insert attempt
      slot = this.activeNode.getAttribute("slot");
    }
    const div = globalThis.document.createElement("div");
    div.innerHTML = content;

    let slot = false;
    // ensure we have a parent or we won't be able to insert beyond active and should just append to the bottom
    if (!addToEnd && this.activeNode && this.activeNode.parentNode) {
      for (var i = div.children.length - 1; i > 0; i--) {
        if (slot) {
          div.children[i].setAttribute("slot", slot);
        }
        this.activeNode.parentNode.insertBefore(
          div.children[i],
          this.activeNode.nextSibling,
        );
      }
    } else {
      // give initial setup time to process since we forced it into edit mode to be here
      setTimeout(() => {
        for (var i = div.children.length - 1; i > 0; i--) {
          HAXStore.activeHaxBody.appendChild(div.children[i]);
        }
        setTimeout(() => {
          HAXStore.activeHaxBody.scrollHere(this.activeNode);
          setTimeout(() => {
            HAXStore.activeHaxBody.scrollHere(this.activeNode);
          }, 500);
        }, 1000);
      }, 300);
    }
    HAXStore.toast(this.t.contentImported);
  }

  // insert URL w/ variations in method
  async insertUrl(input, mode) {
    if (store.editMode === false) {
      store.editMode = true;
    }
    if (mode) {
      const response = await MicroFrontendRegistry.call(
        "@core/websiteMetadata",
        {
          q: input,
        },
      );
      if (response.data && (response.data["og:title"] || response.data.title)) {
        let values = {
          title: response.data["og:title"] || response.data.title,
          source: input,
        };
        HAXStore.insertLogicFromValues(values, this);
      }
    }
  }

  // Generate a slug from title text
  generateSlugFromTitle(title) {
    return title
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^0-9\-\/a-z]/gi, "");
  }

  // Get available page templates from style guide
  async getPageTemplates() {
    try {
      const siteBuilder = globalThis.document.querySelector(
        "haxcms-site-builder",
      );
      if (!siteBuilder) {
        console.warn("getPageTemplates: No haxcms-site-builder found");
        return [];
      }

      // Load style guide content
      const styleGuideContent = await store.loadStyleGuideContent();
      if (!styleGuideContent) {
        console.warn("getPageTemplates: No style guide content found");
        return [];
      }

      // Convert style guide content to HAXSchema elements
      const styleGuideElements =
        await siteBuilder.htmlToHaxElements(styleGuideContent);
      const templates = [];

      for (const styleElement of styleGuideElements) {
        // Look for page-template elements with schema="page"
        if (styleElement && styleElement.tag === "page-template") {
          const schema =
            styleElement.properties && styleElement.properties.schema;
          const templateName =
            styleElement.properties && styleElement.properties.name;
          const templateId =
            styleElement.properties &&
            (styleElement.properties["data-haxsg-id"] ||
              styleElement.properties.id);

          if (schema === "page" && templateName && styleElement.content) {
            const template = {
              id: templateId || `template-${templates.length}`,
              name: templateName,
              content: styleElement.content,
            };
            templates.push(template);
          }
        }
      }

      return templates;
    } catch (error) {
      console.warn("Failed to get page templates:", error);
      return [];
    }
  }

  // Create page with title - method called by Merlin programs
  async createPageWithTitle(title, type, templateContent = null) {
    let order = null;
    let parent = null;
    const item = toJS(store.activeItem);

    if (item) {
      if (type === "sibling") {
        parent = item.parent;
        order = parseInt(item.order) + 1;
      } else if (type === "child") {
        parent = item.id;
        // see if we have a last child of the current item
        let item2 = toJS(await store.getLastChildItem(item.id));
        order = 0;
        if (item2.order) {
          order = parseInt(item2.order) + 1;
        }
      } else if (type === "duplicate") {
        parent = item.parent;
        order = parseInt(item.order) + 1;
      }
    }

    // Generate initial slug from title
    const baseSlug = this.generateSlugFromTitle(title);
    // Get unique slug name to avoid conflicts
    const uniqueSlug = store.getUniqueSlugName(baseSlug);

    const payload = {
      node: {
        title: title,
        location: uniqueSlug,
      },
      order: order,
      parent: parent,
      // Mark this as created by a Merlin program for auto-edit enhancement
      merlinCreated: true,
    };

    // For duplicate, add the duplicate flag
    if (type === "duplicate" && item) {
      payload.node.duplicate = item.id;
    }

    // If template content is provided, add it to the payload
    if (templateContent) {
      payload.node.contents = templateContent;
    }

    // Create the page
    this.dispatchEvent(
      new CustomEvent("haxcms-create-node", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          originalTarget: this,
          values: payload,
        },
      }),
    );

    // Provide user feedback
    let message = `Page "${title}" created successfully!`;
    if (type === "child") {
      message = `Child page "${title}" created successfully!`;
    } else if (type === "duplicate") {
      message = `Page "${title}" duplicated successfully!`;
    }
    if (templateContent) {
      message += " Template applied.";
    }

    store.playSound("success");
    HAXStore.toast(message);

    // Close the daemon after successful creation
    SuperDaemonInstance.close();
  }

  // Move page under a new parent - method called by Move Page Merlin program
  async movePageUnderParent(pageId, newParentId) {
    if (!pageId) {
      store.toast("Error: No page to move", 3000, { fire: true });
      return;
    }

    // Get the page being moved
    const pageToMove = await store.findItem(pageId);
    if (!pageToMove) {
      store.toast("Error: Page not found", 3000, { fire: true });
      return;
    }

    // Determine the new order (make it the last child of the new parent)
    let newOrder = 0;
    if (newParentId) {
      const lastChild = toJS(await store.getLastChildItem(newParentId));
      if (lastChild && (lastChild.order || lastChild.order === 0)) {
        newOrder = parseInt(lastChild.order) + 1;
      }
    } else {
      // Moving to root - find last root item
      const lastChild = toJS(await store.getLastChildItem(null));
      if (lastChild && (lastChild.order || lastChild.order === 0)) {
        newOrder = parseInt(lastChild.order) + 1;
      }
    }

    // Dispatch the save node details event with setParent operation
    // Match the structure used by other operations (moveUp, moveDown, indent, outdent)
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: pageId,
          operation: "setParent",
          parent: newParentId,
          order: newOrder,
        },
      }),
    );

    // Provide user feedback
    const parentTitle = newParentId
      ? (await store.findItem(newParentId)).title
      : "Root Level";
    store.toast(`Page moved under "${parentTitle}"`, 3000, {
      hat: "construction",
      walking: true,
    });

    // Close the daemon
    SuperDaemonInstance.close();
  }

  constructor() {
    super();
    this.__winEvents = {
      "can-redo-changed": "_redoChanged",
      "can-undo-changed": "_undoChanged",
      "hax-drop-focus-event": "_expandSettingsPanel",
      "jwt-logged-in": "_jwtLoggedIn",
      "super-daemon-close": "sdCloseEvent",
      "super-daemon-konami-code": "_konamiCodeActivated",
    };
    enableServices(["core", "haxcms"]);
    this.konamiCodeActivated = false; // Track if cheat codes are unlocked
    this.rpgHat = "none";
    this.darkMode = false;
    this.__editText = "Edit";
    this.userMenuOpen = false;
    this.soundIcon = "";
    this.__disposer = this.__disposer || [];
    this.t = this.t || {};
    this._configureWasFocused = false; // Track toggle state for Ctrl+Shift+1
    // allow commands to go through at any time
    // hax-store default is only when editor is open to avoid conflicts w/ other UX
    SuperDaemonInstance.allowedCallback = () => {
      return true;
    };
    SuperDaemonInstance.keyHandlerCallback = () => {
      const merlin = this.shadowRoot.querySelector("#merlin");
      store.playSound("click");
      // modal shouldn't be possible but just in-case
      if (merlin.getAttribute("data-event") == "super-daemon-modal") {
        HAXStore.haxTray.collapsed = false;
      } else {
        SuperDaemonInstance.mini = true;
        SuperDaemonInstance.wand = true;
        SuperDaemonInstance.activeNode =
          this.shadowRoot.querySelector("#merlin");
      }
      SuperDaemonInstance.runProgram("", "*");
      return true;
    };
    // nothing message so we can suggest a link to make a suggestion
    SuperDaemonInstance.noResultsSlot = () => {
      return html`<div class="no-results">
          Expecting to see an option Merlin didn't provide?
        </div>
        <a
          @click="${(e) => {
            HAXStore._haxStoreContribute(
              "merlin",
              "POP,enhancement",
              SuperDaemonInstance.commandContext +
                " " +
                SuperDaemonInstance.value,
            );
          }}"
          >Make a suggestion to improve results</a
        >`;
    };
    SuperDaemonInstance.appendContext("CMS");
    // Unified page creation program
    SuperDaemonInstance.defineOption({
      title: "Add Page",
      icon: "hax:add-page",
      priority: -2000,
      tags: ["page", "add", "create", "new", "CMS"],
      eventName: "super-daemon-run-program",
      path: "CMS/action/add/page",
      value: {
        name: "create-page",
        machineName: "create-page",
        placeholder: "Type page title to create page",
        program: async (input, values) => {
          // Get reference to site editor UI regardless of how program was accessed
          const siteEditorUI =
            globalThis.document.querySelector("haxcms-site-editor-ui") || this;
          const currentItem = toJS(store.activeItem);

          // If no input provided, show default page creation option to match prior UX
          if (!input || input.trim() === "") {
            return [
              {
                title: "Create New Page",
                icon: "hax:add-page",
                tags: ["page", "blank", "create"],
                value: {
                  target: siteEditorUI,
                  method: "createPageWithTitle",
                  args: ["New Page", "sibling"],
                },
                eventName: "super-daemon-element-method",
                path: "CMS/action/create/page",
              },
            ];
          }

          const title = input.trim();

          try {
            // Get available page templates
            const pageTemplates = await siteEditorUI.getPageTemplates();
            const results = [];

            // Add blank page option first
            results.push({
              title: `Create ${title}`,
              icon: "hax:add-page",
              tags: ["page", "blank", "create"],
              value: {
                target: siteEditorUI,
                method: "createPageWithTitle",
                args: [title, "sibling"],
              },
              eventName: "super-daemon-element-method",
              path: "CMS/action/create/page/blank",
            });

            // Add template options if templates are available
            if (pageTemplates && pageTemplates.length > 0) {
              pageTemplates.forEach((template, index) => {
                results.push({
                  title: `Create ${template.name} named ${title}`,
                  icon: "hax:templates",
                  tags: ["template", "page", "create"],
                  value: {
                    target: siteEditorUI,
                    method: "createPageWithTitle",
                    args: [title, "sibling", template.content],
                  },
                  eventName: "super-daemon-element-method",
                  path: `CMS/action/create/page/template/${template.id}`,
                });
              });
            }

            // Add duplicate current page option
            if (currentItem) {
              results.push({
                title: `Duplicate as ${title}`,
                icon: "hax:duplicate",
                tags: ["page", "duplicate", "create"],
                value: {
                  target: siteEditorUI,
                  method: "createPageWithTitle",
                  args: [title, "duplicate"],
                },
                eventName: "super-daemon-element-method",
                path: "CMS/action/create/page/duplicate",
              });
            }

            return results;
          } catch (error) {
            console.error("Error in create-page program:", error);
            return [
              {
                title: `Error: ${error.message}`,
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: "Error occurred",
              },
            ];
          }
        },
      },
    });

    // Move Page program
    SuperDaemonInstance.defineOption({
      title: "Move Page",
      icon: "icons:open-with",
      priority: 0,
      tags: ["page", "move", "relocate", "parent", "CMS"],
      eventName: "super-daemon-run-program",
      path: "CMS/action/move/page",
      value: {
        name: "move-page",
        machineName: "move-page",
        placeholder: "Type to filter pages",
        program: async (input, values) => {
          const pageId = values.pageId;
          if (!pageId) {
            return [
              {
                title: "Error: No page selected to move",
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: "Error occurred",
              },
            ];
          }

          // Get the page being moved
          const pageToMove = await store.findItem(pageId);
          if (!pageToMove) {
            return [
              {
                title: "Error: Page not found",
                icon: "icons:error",
                tags: ["error"],
                value: { disabled: true },
                eventName: "disabled",
                path: "Error occurred",
              },
            ];
          }

          // Get all pages in the site
          const itemManifest = store.getManifestItems(true);
          const results = [];

          // Filter search input
          const searchTerm = input ? input.toLowerCase().trim() : "";

          // Add option to move to root level
          if (
            !searchTerm ||
            "root".includes(searchTerm) ||
            "top level".includes(searchTerm)
          ) {
            results.push({
              title: "Move to Root Level",
              icon: "hax:site-map",
              tags: ["root", "top", "level"],
              value: {
                target: globalThis.document.querySelector(
                  "haxcms-site-editor-ui",
                ),
                method: "movePageUnderParent",
                args: [pageId, null],
              },
              eventName: "super-daemon-element-method",
              path: "CMS/action/move/page/root",
            });
          }

          // Filter and display pages as potential parents
          itemManifest.forEach((item) => {
            // Don't allow moving under itself or its children
            if (item.id === pageId) {
              return;
            }

            // Check if this item is a child of the page being moved
            let isChild = false;
            let checkItem = item;
            while (checkItem && checkItem.parent) {
              if (checkItem.parent === pageId) {
                isChild = true;
                break;
              }
              checkItem = itemManifest.find((i) => i.id === checkItem.parent);
            }
            if (isChild) {
              return;
            }

            // Apply search filter
            if (searchTerm && !item.title.toLowerCase().includes(searchTerm)) {
              return;
            }

            // Calculate indentation to show hierarchy
            let itemBuilder = item;
            let distance = "";
            while (itemBuilder && itemBuilder.parent != null) {
              itemBuilder = itemManifest.find(
                (i) => i.id === itemBuilder.parent,
              );
              if (itemBuilder) {
                distance = "--" + distance;
              }
            }

            results.push({
              title: `${distance}${distance ? " " : ""}Move under "${item.title}"`,
              icon: "hax:add-child-page",
              tags: ["move", "parent"],
              value: {
                target: globalThis.document.querySelector(
                  "haxcms-site-editor-ui",
                ),
                method: "movePageUnderParent",
                args: [pageId, item.id],
              },
              eventName: "super-daemon-element-method",
              path: `CMS/action/move/page/${item.id}`,
            });
          });

          if (results.length === 0) {
            return [
              {
                title: "No matching pages found",
                icon: "icons:search",
                tags: ["empty"],
                value: { disabled: true },
                eventName: "disabled",
                path: "No results",
              },
            ];
          }

          return results;
        },
      },
    });

    SuperDaemonInstance.defineOption({
      title: "Magic File Wand",
      icon: "hax:hax2022",
      priority: -10000,
      tags: ["Agent", "help", "merlin"],
      eventName: "super-daemon-run-program",
      path: "HAX/agent",
      value: {
        name: "Agent",
        machineName: "hax-agent",
        program: async (input, values) => {
          const usAction = toJS(UserScaffoldInstance.action);
          const usMemory = toJS(UserScaffoldInstance.memory);
          const usData = toJS(UserScaffoldInstance.data);
          let results = [];
          // file selected, so we are looping back around
          if (values.operation === "file-selected") {
            switch (values.type) {
              case "md":
              case "docx":
              case "doc":
              case "txt":
              case "html":
              case "htm":
                // only show options to make new content if we are NOT in edit mode
                if (!usMemory.editMode) {
                  results.push({
                    title: `New Sibling Page from ${values.type}`,
                    icon: "hax:add-page",
                    tags: ["agent"],
                    value: {
                      target: this,
                      method: "processFileContentsBasedOnUserDesire",
                      args: [values, "create-sibling"],
                    },
                    eventName: "super-daemon-element-method",
                    path: "Page created next to current",
                  });
                  results.push({
                    title: `New Child Page from ${values.type}`,
                    icon: "hax:add-child-page",
                    tags: ["agent"],
                    value: {
                      target: this,
                      method: "processFileContentsBasedOnUserDesire",
                      args: [values, "create-child"],
                    },
                    eventName: "super-daemon-element-method",
                    path: "Page created under current",
                  });
                  // @todo only docx currently supports this though there's really no reason it can't
                  // happen in other HTML structured data
                  if (["docx", "doc"].includes(values.type)) {
                    results.push({
                      title: `Create outline from ${values.type}`,
                      icon: "hax:site-map",
                      tags: ["agent"],
                      value: {
                        target: this,
                        method: "processFileContentsBasedOnUserDesire",
                        args: [values, "create-branch"],
                      },
                      eventName: "super-daemon-element-method",
                      path: "H1,H2 tags create menu pages",
                    });
                  }
                }
                results.push({
                  title: `Insert ${values.type} contents in Page`,
                  icon: "hax:html-code",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-html"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Content converted to HTML and inserted",
                });
                break;
              case "png":
              case "jpeg":
              case "gif":
              case "jpg":
                results.push({
                  title: `Insert ${values.type} in page`,
                  icon: "editor:insert-photo",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "image"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Image embedded in page",
                });
                results.push({
                  title: `Set as the media for the active page`,
                  icon: "image:photo-library",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "set-page-media", "image"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Image set as page media",
                });
                break;
              case "mp4":
                results.push({
                  title: `Insert ${values.type} in page`,
                  icon: "av:play-circle-filled",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "video"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Video embedded in page",
                });
                break;
              case "midi":
              case "mid":
              case "mp3":
                results.push({
                  title: `Insert ${values.type} in page`,
                  icon: "av:volume-up",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "audio"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Audio embedded in page",
                });
                break;
              case "pdf":
                results.push({
                  title: `Embed ${values.type} in page`,
                  icon: "hax:file-pdf",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-file", "pdf"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "PDF embedded in a frame element",
                });
                break;
              case "xlsx":
              case "xls":
              case "ods":
                results.push({
                  title: `Insert ${values.type} as table`,
                  icon: "editor:border-all",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-table"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Spreadsheet converted to HTML table",
                });
                results.push({
                  title: `Insert ${values.type} as CSV text`,
                  icon: "hax:code",
                  tags: ["agent"],
                  value: {
                    target: this,
                    method: "processFileContentsBasedOnUserDesire",
                    args: [values, "insert-csv"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Spreadsheet converted to CSV text",
                });
                break;
              default:
                // go run the hax hooks to see if any web components supply
                // a way of handling material that is of that file type
                break;
            }
            results.push({
              title: `Link to ${values.type} file`,
              icon: "editor:insert-link",
              tags: ["agent"],
              value: {
                target: this,
                method: "processFileContentsBasedOnUserDesire",
                args: [values, "link", "link"],
              },
              eventName: "super-daemon-element-method",
              path: "File uploaded and linked to",
            });
            results.push({
              title: `Just Upload ${values.type} file`,
              icon: "file-upload",
              tags: ["agent"],
              value: {
                target: this,
                method: "processFileContentsBasedOnUserDesire",
                args: [values, "upload", "upload-only"],
              },
              eventName: "super-daemon-element-method",
              path: "File uploaded for later use",
            });
          } else if (usAction.type === "drop" && values.type === "drop") {
            const file = usData.file;
            const contents = await file.text();
            let tmp = file.name.split(".");
            let type = "";
            // don't assume there is a file extension
            if (tmp.length > 1) {
              type = tmp.pop();
            }
            // wand hands off for next part now that we've got a file selected
            SuperDaemonInstance.waveWand(
              [
                "",
                "/",
                {
                  operation: "file-selected",
                  contents: contents,
                  data: file,
                  type: type,
                },
                "hax-agent",
                "Agent",
              ],
              this.shadowRoot.querySelector("#merlin"),
              "coin2",
            );
          }
          // default actions when we have no context
          else {
            results = [
              {
                title: "Select file..",
                icon: "folder-open",
                tags: ["agent"],
                value: {
                  target: this,
                  method: "selectFileToProcess",
                  args: [],
                },
                eventName: "super-daemon-element-method",
                path: "Watch Merlin work his magic!",
              },
            ];
            // this forces it to just happen
            // and can be disabled later if we obtain different magic file operations
            this.selectFileToProcess();
            /*
            results = [
              {
                title: "URL with page title",
                icon: "hax:hax2022",
                tags: ["agent"],
                value: {
                  target: this,
                  method: "insertUrl",
                  args: [input, true],
                },
                eventName: "super-daemon-element-method",
                path: "HAX/agent/insert",
              },
              {
                title: "Insert url alone",
                icon: "hax:hax2022",
                tags: ["agent"],
                value: {
                  target: this,
                  method: "insertUrl",
                  args: [input, false],
                },
                eventName: "super-daemon-element-method",
                path: "HAX/agent/insert",
              },
            ];
            */
          }
          return results;
        },
      },
    });

    // Add Magic Link Wand program
    SuperDaemonInstance.defineOption({
      title: "Magic Link Wand",
      icon: "editor:insert-link",
      priority: -9999,
      tags: ["Agent", "help", "merlin", "url", "link"],
      eventName: "super-daemon-run-program",
      path: "HAX/link-agent",
      value: {
        name: "Link Agent",
        machineName: "hax-link-agent",
        program: async (input, values) => {
          const usAction = toJS(UserScaffoldInstance.action);
          const usMemory = toJS(UserScaffoldInstance.memory);
          const usData = toJS(UserScaffoldInstance.data);
          let results = [];

          // URL selected/entered, so we are processing it
          if (values.operation === "url-selected") {
            const url = values.url;
            const urlType = this.detectUrlType(url);

            switch (urlType) {
              case "youtube":
                results.push({
                  title: `Embed YouTube Video`,
                  icon: "av:play-circle-filled",
                  tags: ["agent", "video"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-youtube"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "YouTube video embedded in page",
                });
                break;

              case "image":
                results.push({
                  title: `Insert Image from URL`,
                  icon: "editor:insert-photo",
                  tags: ["agent", "image"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "insert-image"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Image from URL embedded in page",
                });
                break;

              case "pdf":
                results.push({
                  title: `Embed PDF Document`,
                  icon: "hax:file-pdf",
                  tags: ["agent", "document"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-pdf"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "PDF document embedded in page",
                });
                break;

              case "video":
                results.push({
                  title: `Embed Video`,
                  icon: "av:videocam",
                  tags: ["agent", "video"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "embed-video"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Video embedded in page",
                });
                break;

              default:
                // Generic URL handling
                results.push({
                  title: `Insert as Rich Link`,
                  icon: "editor:insert-link",
                  tags: ["agent", "link"],
                  value: {
                    target: this,
                    method: "processUrlContentsBasedOnUserDesire",
                    args: [values, "insert-rich-link"],
                  },
                  eventName: "super-daemon-element-method",
                  path: "Rich link with preview inserted",
                });
                break;
            }

            // Always provide option to insert as simple link
            results.push({
              title: `Insert as Simple Link`,
              icon: "editor:insert-link",
              tags: ["agent", "link"],
              value: {
                target: this,
                method: "processUrlContentsBasedOnUserDesire",
                args: [values, "insert-simple-link"],
              },
              eventName: "super-daemon-element-method",
              path: "Simple hyperlink inserted",
            });

            // Add HAX default processing option for compatibility with existing behavior
            results.push({
              title: `Use HAX Default Processing`,
              icon: "hax:hax2022",
              tags: ["agent", "hax", "auto"],
              value: {
                target: this,
                method: "processUrlContentsBasedOnUserDesire",
                args: [values, "hax-default"],
              },
              eventName: "super-daemon-element-method",
              path: "HAX automatically detects best element type",
            });

            // Add option to apply link to selected text if there's a selection
            const sel = globalThis.getSelection && globalThis.getSelection();
            if (sel && !sel.isCollapsed && sel.toString().trim()) {
              results.push({
                title: `Apply Link to Selected Text: "${sel.toString().trim().substring(0, 30)}${sel.toString().trim().length > 30 ? "..." : ""}"`,
                icon: "editor:format-color-text",
                tags: ["agent", "link", "selection"],
                value: {
                  target: this,
                  method: "processUrlContentsBasedOnUserDesire",
                  args: [values, "apply-to-selected-text"],
                },
                eventName: "super-daemon-element-method",
                path: "URL applied as link to selected text",
              });
            }
          } else if (usAction.type === "paste" && values.type === "paste") {
            // Handle paste detection
            const pastedText = usData.text;
            if (this.isValidUrl(pastedText)) {
              // wand hands off for next part now that we've got a URL detected
              SuperDaemonInstance.waveWand(
                [
                  "",
                  "/",
                  {
                    operation: "url-selected",
                    url: pastedText.trim(),
                    data: pastedText,
                  },
                  "hax-link-agent",
                  "Link Agent",
                ],
                this.shadowRoot.querySelector("#merlin"),
                "coin2",
              );
            }
          } else {
            // Check if user entered a URL in the search input
            if (input && this.isValidUrl(input.trim())) {
              // Process the URL directly from input
              this.processUrlFromInput(input);
              return [];
            }
            // Default actions when we have no context - just show instructions
            results = [
              {
                title: "Paste URL in search box above and press Enter",
                icon: "editor:insert-link",
                tags: ["agent", "link", "instruction"],
                value: {},
                eventName: "super-daemon-noop",
                path: "Enter any URL to see processing options",
              },
            ];
          }
          return results;
        },
      },
    });
    if (HAXStore.ready) {
      // elements that are in HAXcms that are injected regardless of what editor says
      // because the CMS controls certain internal connectors
      [
        "site-remote-content",
        "citation-element",
        "page-flag",
        "site-collection-list",
        "collection-list",
        "collection-item",
      ].map((name) => {
        let el = globalThis.document.createElement(name);
        HAXStore.haxAutoloader.appendChild(el);
      });

      // links need to be given support for internal linkage updates on the form
      if (!HAXStore.primativeHooks.a) {
        HAXStore.primativeHooks.a = {};
      }
      HAXStore.primativeHooks.a.setupActiveElementForm = (props) => {
        const itemManifest = store.getManifestItems(true);
        // default to null parent as the whole site
        var items = [
          {
            text: `-- ${this.t.selectPage} --`,
            value: null,
          },
        ];
        itemManifest.forEach((el) => {
          if (el.id != this.itemId) {
            // calculate -- depth so it looks like a tree
            let itemBuilder = el;
            // walk back through parent tree
            let distance = "- ";
            while (itemBuilder && itemBuilder.parent != null) {
              itemBuilder = itemManifest.find(
                (i) => i.id == itemBuilder.parent,
              );
              // double check structure is sound
              if (itemBuilder) {
                distance = "--" + distance;
              }
            }
            items.push({
              text: distance + el.title,
              value: el.id,
            });
          }
        });
      };
    }
    this.t = {
      ...this.t,
      selectPage: "Select page",
      backToSiteList: "Back to site list",
      mySites: "My sites",
      cancel: "Cancel",
      unsavedChangesWillBeLostIfSelectingOkAreYouSure:
        "Unsaved changes will be lost if selecting OK, are you sure?",
      editDetails: "Page details",
      add: "Add",
      source: "Source",
      viewSource: "Source",
      confirmHtmlSourceExit:
        "HTML Source changes will not be saved without pressing the `Update HTML` button, Save without HTML code editor changes?",
      findMedia: "Media",
      undo: "Undo",
      redo: "Redo",
      media: "Media",
      outline: "Outline",
      blocks: "Blocks",
      addBlock: "Blocks",
      addPage: "Add page",
      addChildPage: "Add child page",
      clonePage: "Clone page",
      delete: "Delete page",
      siteSettings: "Site settings",
      themeSettings: "Theme settings",
      seoSettings: "SEO settings",
      authorSettings: "Author settings",
      styleGuide: "Style Guide",
      close: "Close",
      settings: "Settings",
      edit: "Edit",
      configureBlock: "Configure",
      configure: "Configure",
      save: "Save",
      saveAndEdit: "Save & Edit",
      unlockPage: "Unlock page",
      newJourney: "New Journey",
      accountInfo: "Account Info",
      outlineDesigner: "Site Outline",
      outline: "Outline",
      pageOutline: "Structure",
      more: "More",
      pageActions: "Page actions",
      insights: "Insights dashboard",
      merlin: "Merlin",
      summonMerlin: "Summon Merlin",
      logOut: "Log out",
      menu: "Menu",
      showMore: "More",
      contentImported: "Content imported!",
    };
    this.backText = "Site list";
    this.painting = true;
    this.pageAllowed = false;
    this.editMode = false;
    this.__editIcon = "icons:create";
    this.manifestEditMode = false;
    this.backLink = "../../";
    this.activeTagName = "";
    this.activeNode = null;
    this.activeDrag = false;
    this.activeType = null;
    if (globalThis.appSettings && globalThis.appSettings.backLink) {
      this.backLink = globalThis.appSettings.backLink;
    }
    autorun(() => {
      const isLoggedIn = toJS(store.isLoggedIn);
      UserScaffoldInstance.writeMemory("isLoggedIn", this.isLoggedIn);
      const tstamp = Math.floor(Date.now() / 1000);

      if (isLoggedIn && !this.loggedInTime) {
        this.displayConsoleWarning();
        this.loggedInTime = tstamp;
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
    // user scaffolding wired up to superDaemon
    autorun(() => {
      const usAction = toJS(UserScaffoldInstance.action);
      const usData = toJS(UserScaffoldInstance.data);
      // try to evaluate typing in merlin
      if (
        UserScaffoldInstance.active &&
        UserScaffoldInstance.memory.isLoggedIn &&
        SuperDaemonInstance.programName === null &&
        usAction.type === "drag"
      ) {
        this.activeDrag = true;
        this.activeType = usData.value || usData.architype;
      } else if (
        UserScaffoldInstance.active &&
        UserScaffoldInstance.memory.isLoggedIn &&
        SuperDaemonInstance.programName === null &&
        usAction.type === "dragleave"
      ) {
        this.activeDrag = false;
        this.activeType = null;
      }
    });
    autorun(() => {
      const activeGizmo = toJS(HAXStore.activeGizmo);
      if (activeGizmo && activeGizmo.title) {
        this.activeTagName = activeGizmo.title;
      }
    });
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
    });
    autorun(() => {
      const badDevice = toJS(store.badDevice);
      // good device, we can inject font we use
      if (badDevice === false) {
        const link = globalThis.document.createElement("link");
        link.setAttribute(
          "href",
          "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
        );
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("fetchpriority", "low");
        globalThis.document.head.appendChild(link);
      } else if (badDevice === true) {
        globalThis.document.body.classList.add("bad-device");
      }
    });
    autorun(() => {
      this.darkMode = toJS(store.darkMode);
      this.dark = this.darkMode;
      if (toJS(store.darkMode)) {
        SuperDaemonInstance.dark = true;
        SuperDaemonInstance.toastInstance.darkMode = true;
        HAXStore.globalPreferences.haxUiTheme = "haxdark";
      } else {
        HAXStore.globalPreferences.haxUiTheme = "hax";
        SuperDaemonInstance.dark = false;
        SuperDaemonInstance.toastInstance.darkMode = false;
      }
    });
    autorun(() => {
      this.soundIcon = toJS(store.soundStatus)
        ? new URL(
            "../../../app-hax/lib/assets/images/FullVolume.svg",
            import.meta.url,
          ).href
        : new URL(
            "../../../app-hax/lib/assets/images/Silence.svg",
            import.meta.url,
          ).href;
    });
    setTimeout(() => {
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js"
      );
    }, 0);
  }
  displayConsoleWarning() {
    setTimeout(() => {
      const headStyle =
        "color: white; padding: 10px; font-weight: bold; font-size: 5em;font-family: arial; background-color: darkred; border: 5px solid white; border: 5px solid white;";
      const bodyStyle =
        "font-size: 1.5em; font-family: arial; color: white; background-color: darkred; padding: 10px";
      console.warn("%c⚠️STOP⚠️", headStyle);
      console.warn(
        "%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a hidden feature, it is likely a scam and could give them access to your account.",
        bodyStyle,
      );
    }, 3500);
  }
  soundToggle() {
    const status = !toJS(store.soundStatus);
    store.soundStatus = status;
    localStorageSet("app-hax-soundStatus", status);
    if (!status) {
      store.toast("Sound off.. hey.. HELLO!?!", 2000, { fire: true });
    } else {
      store.toast("Can you hear me now? Good.", 2000, { hat: "random" });
      store.playSound("click");
    }
  }

  /**
   * Check if a platform capability is allowed
   * Defaults to true if not explicitly set to false in platformConfig
   * @param {string} capability - Capability name (e.g., 'delete', 'addPage', 'outlineDesigner')
   * @returns {boolean} Whether the capability is allowed
   */
  platformAllows(capability) {
    if (!this.platformConfig || typeof this.platformConfig !== "object") {
      return true; // No restrictions if no platform config
    }
    // If the capability is not defined, default to true (allowed)
    // If it is defined, use its value
    return this.platformConfig[capability] !== false;
  }

  closeMenu() {
    this.userMenuOpen = false;
  }

  toggleMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    store.playSound("click");
  }
  getIconPosition(size) {
    return !["xl", "lg"].includes(size) ? "top" : "left";
  }
  // render function
  render() {
    return html`
      <app-hax-top-bar part="top-bar" ?edit-mode="${this.editMode}">
        <span slot="left" class="home-btn">
          <a
            href="${this.backLink}"
            class="haxLogo"
            id="backtosites"
            title="${this.backText}"
            part="hax-logo"
          >
            <simple-icon-lite icon="hax:hax2022"></simple-icon-lite>
          </a>
          <simple-tooltip for="backtosites" position="right"
            >${this.backText}</simple-tooltip
          >
          <slot name="haxcms-site-editor-ui-prefix-avatar"></slot>
        </span>
        <div slot="center" class="toolbar-buttons">
          <slot name="haxcms-site-editor-ui-prefix-buttons"></slot>
          <simple-toolbar-button
            ?hidden="${!this.activeItem ||
            !this.activeItem.metadata ||
            !this.activeItem.metadata.locked ||
            this.editMode}"
            id="lockbutton"
            class="top-bar-button"
            icon="icons:lock"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            label="${this.t.unlockPage}"
            @click="${this._toggleLockedStatus}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            ?hidden="${!this.pageAllowed}"
            ?disabled="${this.activeItem &&
            this.activeItem.metadata &&
            this.activeItem.metadata.locked &&
            !this.editMode}"
            class="top-bar-button"
            id="editbutton"
            icon="${this.__editIcon}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this._editButtonTap}"
            label="${this.__editText}"
            voice-command="edit (this) page"
          ></simple-toolbar-button>
          <simple-toolbar-button
            ?hidden="${!this.editMode}"
            class="top-bar-button"
            id="saveandeditbutton"
            icon="hax:page-edit"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this._saveAndEditButtonTap}"
            label="${this.t.saveAndEdit} • Ctrl⇧W"
            data-primary="4"
            voice-command="save and edit page"
          ></simple-toolbar-button>
          <haxcms-button-add
            ?hidden="${this.editMode || !this.platformAllows("addPage")}"
            id="addpagebutton"
            class="top-bar-button"
            align-horizontal="center"
            icon="hax:add-page"
            label="${this.t.addPage} • Ctrl⇧1"
            merlin
          ></haxcms-button-add>
          <simple-toolbar-button
            ?hidden="${this.editMode ||
            !this.platformAllows("outlineDesigner")}"
            id="outlinebutton"
            class="top-bar-button"
            icon="hax:site-map"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            label="${this.t.outline} • Ctrl⇧2"
            @click="${this._outlineButtonTap}"
          ></simple-toolbar-button>

          <simple-toolbar-button
            id="cancelbutton"
            class="top-bar-button"
            icon="icons:cancel"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this._cancelButtonTap}"
            ?hidden="${!this.editMode}"
            ?disabled="${!this.editMode}"
            tabindex="${this.editMode ? "0" : "-1"}"
            label="${this.t.cancel} • Ctrl⇧/"
            voice-command="cancel (editing)"
          ></simple-toolbar-button>
          <simple-toolbar-button
            icon="icons:undo"
            class="top-bar-button"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            ?disabled="${!this.canUndo}"
            @click="${this.haxButtonOp}"
            label="${this.t.undo} • Ctrl Z"
            data-event="undo"
            id="undo"
            ?hidden="${!this.editMode}"
            voice-command="undo"
          >
          </simple-toolbar-button>
          <simple-toolbar-button
            icon="icons:redo"
            class="top-bar-button"
            @click="${this.haxButtonOp}"
            ?disabled="${!this.canRedo}"
            ?hidden="${!this.editMode}"
            label="${this.t.redo} • Ctrl⇧Z"
            data-event="redo"
            id="redo"
            voice-command="redo"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
          >
          </simple-toolbar-button>

          <simple-toolbar-button
            data-event="content-edit"
            icon="settings"
            class="top-bar-button"
            @click="${this.haxButtonOp}"
            id="content-edit"
            label="${this.t.configureBlock} • Ctrl⇧1"
            ?hidden="${!this.editMode}"
            ?disabled="${!this.activeTagName ||
            this.activeTagName == "" ||
            !this.activeNode ||
            !this.activeNode.tagName}"
            voice-command="(modify)(configure)(edit) selected"
            controls="tray-detail"
            tooltip="${this.t.configure} ${this.activeTagName}"
            toggles
            ?toggled="${this.trayDetail === "content-edit"}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
          >
          </simple-toolbar-button>
          <simple-toolbar-button
            ?hidden="${!this.editMode}"
            ?disabled="${!this.editMode}"
            data-event="content-add"
            icon="hax:add-brick"
            id="content-add"
            class="top-bar-button"
            label="${this.t.addBlock} • Ctrl⇧2"
            voice-command="select blocks (menu)"
            toggles
            ?toggled="${this.trayDetail === "content-add"}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this.haxButtonOp}"
          >
          </simple-toolbar-button>
          <simple-toolbar-button
            ?hidden="${!this.editMode}"
            ?disabled="${!this.editMode}"
            data-event="content-map"
            icon="hax:newspaper"
            id="content-map"
            class="top-bar-button"
            label="${this.t.pageOutline} • Ctrl⇧3"
            voice-command="select content outline (menu)"
            toggles
            @click="${this.haxButtonOp}"
            ?toggled="${this.trayDetail === "content-map"}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
          >
          </simple-toolbar-button>

          <simple-toolbar-button
            id="exportbtn"
            icon="hax:html-code"
            label="${this.t.viewSource} • Ctrl⇧4"
            data-event="view-source"
            class="top-bar-button"
            @click="${this.haxButtonOp}"
            voice-command="view (page) source"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            ?hidden="${!this.editMode}"
            ?disabled="${!this.editMode}"
          >
          </simple-toolbar-button>

          <simple-toolbar-button
            ?hidden="${!this.editMode}"
            ?disabled="${!this.editMode}"
            icon="hax:multimedia"
            class="top-bar-button"
            label="${this.t.findMedia} • Ctrl⇧5"
            voice-command="select media (menu)"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            data-event="media-program"
            @click="${this.haxButtonOp}"
          >
          </simple-toolbar-button>

          <simple-toolbar-button
            ?hidden="${this.editMode || !this.platformAllows("styleGuide")}"
            ?disabled="${this.editMode}"
            id="styleguidebutton"
            @click="${this._styleGuideButtonTap}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            icon="lrn:palette"
            part="styleguidebtn"
            class="top-bar-button"
            label="${this.t.styleGuide} • Ctrl⇧3"
          ></simple-toolbar-button>

          <simple-toolbar-button
            ?hidden="${this.editMode || !this.platformAllows("insights")}"
            ?disabled="${this.editMode}"
            id="insightsbutton"
            icon="hax:clipboard-pulse"
            part="insightsbtn"
            class="top-bar-button"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this._insightsButtonTap}"
            label="${this.t.insights} • Ctrl⇧4"
            voice-command="insights"
          ></simple-toolbar-button>

          <simple-toolbar-button
            @click="${this._manifestButtonTap}"
            icon-position="left"
            icon="hax:home-edit"
            part="manifestbtn"
            class="top-bar-button"
            id="manifestbtn"
            ?disabled="${this.editMode}"
            ?hidden="${this.editMode || !this.platformAllows("manifest")}"
            label="${this.t.siteSettings} • Ctrl⇧5"
          ></simple-toolbar-button>
          <slot name="haxcms-site-editor-ui-suffix-buttons"></slot>
          <simple-toolbar-button
            icon="hax:wizard-hat"
            label="${this.t.merlin} • Alt⇧"
            voice-command="${this.t.merlin}"
            class="merlin top-bar-button"
            id="merlin"
            @click="${this.haxButtonOp}"
            data-event="${this.responsiveSize === "xs"
              ? "super-daemon-modal"
              : "super-daemon"}"
          ></simple-toolbar-button>
          <super-daemon-search
            @click="${this.haxButtonOp}"
            @value-changed="${this.haxButtonOp}"
            @drop="${this.dropEvent}"
            @dragenter="${this.dragenterEvent}"
            @dragleave="${this.dragleaveEvent}"
            @dragover="${this.dragoverEvent}"
            icon="hax:wizard-hat"
            id="search"
            voice-search
            class="merlin"
            data-event="${this.responsiveSize === "xs"
              ? "super-daemon-modal"
              : "super-daemon"}"
            ?hidden="${["xs"].includes(this.responsiveSize)}"
            mini
            wand
            droppable-type="${this.activeType}"
            ?droppable="${this.activeDrag}"
          >
          </super-daemon-search>
        </div>

        <app-hax-user-menu
          slot="right"
          id="user-menu"
          part="app-hax-user-menu"
          ?is-open="${this.userMenuOpen}"
        >
          <button
            class="topbar-character"
            slot="menuButton"
            @click="${this.toggleMenu}"
            aria-label="User menu for ${this.userName}"
            aria-expanded="${this.userMenuOpen}"
            aria-haspopup="menu"
          >
            <rpg-character
              seed="${this.userName}"
              width="68"
              height="68"
              part="rpgcharacter"
              role="img"
              alt="Avatar for ${this.userName}"
              hat="${this.rpgHat}"
            ></rpg-character>
            <span class="characterbtn-name" aria-hidden="true"
              >${this.userName}</span
            >
            <slot name="haxcms-site-editor-ui-topbar-character-button"></slot>
          </button>
          <div slot="pre-menu" class="ops-panel">
            <slot name="haxcms-site-editor-ui-pre-menu"></slot>
            <wired-button
              elevation="1"
              class="soundToggle"
              @click="${this.soundToggle}"
              aria-label="Toggle sound effects ${this.soundIcon &&
              this.soundIcon.indexOf("Full") !== -1
                ? "off"
                : "on"}"
              aria-pressed="${this.soundIcon &&
              this.soundIcon.indexOf("Full") !== -1
                ? "true"
                : "false"}"
            >
              <simple-icon-lite
                src="${this.soundIcon}"
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              ></simple-icon-lite>
            </wired-button>
            <haxcms-darkmode-toggle></haxcms-darkmode-toggle>
          </div>
          <!-- <app-hax-user-menu-button
          slot="main-menu"
          icon="face"
          label="${this.t.accountInfo}"
        ></app-hax-user-menu-button> -->
          <slot slot="main-menu" name="haxcms-site-editor-ui-main-menu"></slot>
          <a
            class="mysiteslink"
            href="${this.backLink}"
            slot="main-menu"
            part="mysiteslink"
            tabindex="-1"
          >
            <app-hax-user-menu-button
              icon="hax:hax2022"
              label="${this.t.mySites}"
              part="mysitesbtn"
            ></app-hax-user-menu-button>
          </a>
          <app-hax-user-menu-button
            slot="main-menu"
            icon="add"
            label="${this.t.newJourney}"
            part="newjourneybtn"
            @click="${this._addButtonTap}"
          ></app-hax-user-menu-button>
          <slot slot="post-menu" name="haxcms-site-editor-ui-post-menu"></slot>
          <app-hax-user-menu-button
            slot="post-menu"
            part="logoutbtn"
            class="logout"
            label="${this.t.logOut}"
            @click=${this._logout}
          ></app-hax-user-menu-button>
        </app-hax-user-menu>
      </app-hax-top-bar>
    `;
  }

  /**
   * drag / drop event block
   */
  dropEvent(e) {
    e.preventDefault();
    this.activeDrag = false;
    this.activeType = null;
    SuperDaemonInstance.waveWand(
      ["", "/", e, "hax-agent", "Agent"],
      this.shadowRoot.querySelector("#merlin"),
    );
  }
  dragenterEvent(e) {
    e.preventDefault();
    this.sdSearch.dragover = true;
  }
  dragoverEvent(e) {
    e.preventDefault();
    this.sdSearch.dragover = true;
  }
  dragleaveEvent(e) {
    e.preventDefault();
    this.sdSearch.dragover = false;
  }
  // daemon was told to close so enable the search bar again
  sdCloseEvent(e) {
    setTimeout(() => {
      // trap helps ensure user expectation of no input but without triggering
      // an input change event which activates things running
      this._ignoreReset = true;
      this.sdSearch.value = "";
    }, 0);
    this.sdSearch.disabled = false;
    this.sdSearch.dragover = false;
    this.sdSearch.droppable = false;
    this.sdSearch.droppableType = null;
  }

  haxButtonOp(e) {
    let exec = e.target.getAttribute("data-event");
    switch (exec) {
      case "super-daemon":
        if (!this._ignoreReset || e.type === "click") {
          const value = this.sdSearch.value;
          if (e.type === "value-changed") {
            if (value) {
              SuperDaemonInstance.waveWand(
                [value, "*"],
                this.shadowRoot.querySelector("#merlin"),
                null,
              );
            }
          } else {
            SuperDaemonInstance.waveWand(
              [value, "*"],
              this.shadowRoot.querySelector("#merlin"),
              null,
            );
          }
          // this will reset UX expectation but also trigger this to run again so need to
          // have weird loop above to ensure it's not going to affect it
          this.sdSearch.value = null;
          // this helps with accessibility
          this.sdSearch.disabled = false;
          this.sdSearch.dragover = false;
          this.sdSearch.droppable = false;
          this.sdSearch.droppableType = null;
        }
        this._ignoreReset = false;
        break;
      case "super-daemon-modal":
        if (!this._ignoreReset || e.type === "click") {
          store.playSound("click");
          SuperDaemonInstance.open();
          HAXStore.haxTray.collapsed = false;
        }
        break;
      case "media-program":
        store.playSound("click");
        SuperDaemonInstance.waveWand(
          ["sources", "/"],
          this.shadowRoot.querySelector("#merlin"),
          null,
        );
        break;
      case "content-edit":
      case "content-map":
      case "content-add":
        if (HAXStore.haxTray.trayDetail == exec) {
          HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
        } else {
          HAXStore.haxTray.collapsed = false;
        }
        HAXStore.haxTray.trayDetail = exec;
        break;
      case "undo":
        HAXStore.activeHaxBody.undo();
        break;
      case "redo":
        HAXStore.activeHaxBody.redo();
        break;
      case "view-source":
        HAXStore.haxTray.trayDetail = exec;
        HAXStore.haxTray.shadowRoot.querySelector("#view-source").openSource();
        HAXStore.haxTray.collapsed = false;
        break;
    }
  }

  _logout() {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
    );
    this.__logoutUserAction = true;
  }
  // only care about logouts
  _jwtLoggedIn(e) {
    if (e.detail === false && this.__logoutUserAction) {
      this.__logoutUserAction = false;
      setTimeout(() => {
        globalThis.location.reload();
      }, 100);
    }
  }

  /**
   * update buttons since these are triggered by a mix of
   * differnet backend types we can't leverage the store
   * since a CMS needs to just hardcode these at run time
   * for some environments
   */
  updateAvailableButtons() {
    if (this.shadowRoot) {
      setTimeout(() => {
        // backText
        if (globalThis.appSettings && globalThis.appSettings.backText) {
          this.backText = globalThis.appSettings.backText;
        }
        let ary = [
          {
            varPath: "saveNodePath",
            selector: "#editbutton",
          },
          {
            varPath: "createNodePath",
            selector: "#addpagebutton",
          },
        ];
        // see which features should be enabled
        ary.forEach((pair) => {
          if (
            globalThis.appSettings &&
            globalThis.appSettings[pair.varPath] &&
            globalThis.appSettings[pair.varPath] != null &&
            globalThis.appSettings[pair.varPath] != "" &&
            globalThis.appSettings[pair.varPath] != "null"
          ) {
            if (pair.dep) {
              if (
                globalThis.appSettings[pair.dep] != null &&
                globalThis.appSettings[pair.dep] != "" &&
                globalThis.appSettings[pair.dep] != "null"
              ) {
                this.shadowRoot
                  .querySelector(pair.selector)
                  .removeAttribute("hidden");
              } else {
                // a dependency didn't meet the requirement
              }
            } else {
              this.shadowRoot
                .querySelector(pair.selector)
                .removeAttribute("hidden");
            }
          }
        });
      }, 100);
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
      .querySelectorAll("[data-super-daemon-path]")
      .forEach((item) => {
        SuperDaemonInstance.defineOption({
          title: item.getAttribute("data-super-daemon-label"),
          icon: item.getAttribute("data-super-daemon-icon"),
          tags: ["page", "operation", "command", "add", "create"],
          value: {
            target: item,
          },
          context: "CMS",
          eventName: "super-daemon-element-click",
          path: item.getAttribute("data-super-daemon-path"),
        });
      });
    this.sdSearch = this.shadowRoot.querySelector("super-daemon-search");
    SuperDaemonInstance.wandTarget = this.shadowRoot.querySelector("#merlin");
    // load up commands for daemon
    SuperDaemonInstance.defineOption({
      title: this.t.save,
      icon: "icons:save",
      tags: ["CMS", "save", "page", "operation", "command"],
      value: {
        target: this,
        method: "_editButtonTap",
      },
      context: "HAX",
      eventName: "super-daemon-element-method",
      path: "CMS/action/save",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.insights,
      icon: "hax:clipboard-pulse",
      tags: ["CMS", "insights", "data", "operation"],
      value: {
        target: this,
        method: "_insightsButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/site/insights",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.edit,
      icon: "hax:page-edit",
      priority: -1500,
      tags: ["CMS", "edit", "page", "operation", "command"],
      value: {
        target: this,
        method: "_editButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/edit",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.siteSettings,
      icon: "hax:site-settings",
      tags: [
        "CMS",
        "site",
        "settings",
        "operation",
        "command",
        "theme",
        "seo",
        "author",
      ],
      value: {
        target: this,
        method: "_manifestButtonTap",
        args: [{ target: this.shadowRoot.querySelector("#manifestbtn") }],
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/site/settings",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.themeSettings,
      icon: "hax:site-settings",
      tags: [
        "CMS",
        "site",
        "settings",
        "operation",
        "command",
        "theme",
        "seo",
        "author",
      ],
      value: {
        target: this,
        method: "_manifestButtonTap",
        args: [{ target: this.shadowRoot.querySelector("#manifestbtn") }],
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/site/settings/theme",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.seoSettings,
      icon: "hax:site-settings",
      tags: [
        "CMS",
        "site",
        "settings",
        "operation",
        "command",
        "theme",
        "seo",
        "search",
        "engine",
      ],
      value: {
        target: this,
        method: "_manifestButtonTap",
        args: [{ target: this.shadowRoot.querySelector("#manifestbtn") }],
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/site/settings/seo",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.authorSettings,
      icon: "hax:site-settings",
      tags: [
        "CMS",
        "site",
        "settings",
        "operation",
        "command",
        "theme",
        "author",
      ],
      value: {
        target: this,
        method: "_manifestButtonTap",
        args: [{ target: this.shadowRoot.querySelector("#manifestbtn") }],
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/site/settings/author",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.styleGuide,
      icon: "lrn:palette",
      tags: ["CMS", "theme", "style guide", "design"],
      value: {
        target: this,
        method: "_styleGuideButtonTap",
      },
      context: ["logged-in", "CMS"],
      eventName: "super-daemon-element-method",
      path: "CMS/theme/style-guide",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.newJourney,
      icon: "add",
      tags: ["CMS", "create", "new site"],
      value: {
        target: this,
        method: "_addButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/create-site",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.logOut,
      icon: "add",
      tags: ["CMS", "user", "logout"],
      value: {
        target: this,
        method: "_logout",
      },
      context: ["logged-in", "CMS"],
      eventName: "super-daemon-element-method",
      path: "CMS/user/logout",
    });

    SuperDaemonInstance.defineOption({
      title: "Dark mode toggle",
      icon: "device:brightness-medium",
      tags: ["CMS", "dark mode"],
      value: {
        target: this.shadowRoot.querySelector("haxcms-darkmode-toggle"),
        method: "toggle",
      },
      voice: "(toggle) dark mode",
      eventName: "super-daemon-element-method",
      path: "CMS/action/darkMode",
    });

    SuperDaemonInstance.defineOption({
      title: "Sound toggle",
      icon: "av:volume-up",
      tags: ["CMS", "sound"],
      value: {
        target: this.shadowRoot.querySelector(".soundToggle"),
      },
      eventName: "super-daemon-element-click",
      path: "CMS/action/sound",
    });

    SuperDaemonInstance.defineOption({
      title: this.t.outlineDesigner,
      icon: "hax:site-map",
      tags: [
        "CMS",
        "outline",
        "designer",
        "site outline",
        "operation",
        "command",
      ],
      value: {
        target: this.shadowRoot.querySelector("#outlinebutton"),
      },
      context: ["CMS"],
      eventName: "super-daemon-element-click",
      path: "CMS/action/outline",
    });
    // force item to load schema
    SuperDaemonInstance.defineOption({
      title: "Load HAXSchema",
      icon: "hax:hax2022",
      tags: ["Developer", "schema", "load", "demo", "testing"],
      eventName: "super-daemon-run-program",
      path: ">hax/loadElement",
      context: [">"],
      value: {
        name: "Load HAXSchema",
        context: ">",
        program: async (input, values) => {
          const reg = globalThis.WCAutoload.requestAvailability();
          let results = [];
          Object.keys(reg.registry.list).forEach(async (tag) => {
            let icon = "hax:hax2022";
            if (globalThis.customElements.get(tag)) {
              if (
                globalThis.customElements.get(tag).haxProperties &&
                globalThis.customElements.get(tag).haxProperties.gizmo
              ) {
                icon =
                  globalThis.customElements.get(tag).haxProperties.gizmo.icon;
              }
            }
            if (input == "" || tag.includes(input)) {
              let tmp = {};
              tmp[tag] = reg.registry.list[tag];
              results.push({
                title: tag,
                icon: icon,
                tags: ["schema"],
                value: {
                  target: globalThis.HaxStore.instance,
                  method: "_handleDynamicImports",
                  args: [tmp, globalThis.HaxStore.instance.haxAutoloader],
                },
                eventName: "super-daemon-element-method",
                context: [">", ">hax/loadElement/" + tag],
                path: ">hax/loadElement/" + tag,
              });
            }
          });
          return results;
        },
      },
    });
    // change theme program
    // Welcome to HAX program - shows 5 most common operations for new users
    SuperDaemonInstance.defineOption({
      title: "Welcome to HAX",
      icon: "hax:hax2022",
      tags: [
        "welcome",
        "tutorial",
        "getting started",
        "onboarding",
        "help",
        "guide",
      ],
      eventName: "super-daemon-run-program",
      path: "CMS/welcome",
      context: ["CMS", "logged-in"],
      priority: 2000, // Low priority to appear at bottom
      value: {
        name: "Welcome to HAX",
        machineName: "welcome",
        context: "CMS",
        program: async (input, values) => {
          // Four most common operations for new users (removed create-page)
          return [
            {
              title: "Edit this page",
              icon: "hax:page-edit",
              tags: ["welcome", "common", "operation"],
              value: {
                target: this,
                method: "executeWelcomeAction",
                args: ["edit-page"],
              },
              eventName: "super-daemon-element-method",
              context: ["CMS"],
              path: "CMS/welcome/edit-page",
            },
            {
              title: "Create a new page",
              icon: "hax:add-page",
              tags: ["welcome", "common", "operation"],
              value: {
                target: this,
                method: "executeWelcomeAction",
                args: ["create-page"],
              },
              eventName: "super-daemon-element-method",
              context: ["CMS"],
              path: "CMS/welcome/create-page",
            },
            {
              title: "Upload a file",
              icon: "file-upload",
              tags: ["welcome", "common", "operation"],
              value: {
                target: this,
                method: "executeWelcomeAction",
                args: ["upload-file"],
              },
              eventName: "super-daemon-element-method",
              context: ["CMS"],
              path: "CMS/welcome/upload-file",
            },
            {
              title: "Edit site outline",
              icon: "hax:site-map",
              tags: ["welcome", "common", "operation"],
              value: {
                target: this,
                method: "executeWelcomeAction",
                args: ["outline-designer"],
              },
              eventName: "super-daemon-element-method",
              context: ["CMS"],
              path: "CMS/welcome/outline-designer",
            },
            {
              title: "Change site settings",
              icon: "hax:site-settings",
              tags: ["welcome", "common", "operation"],
              value: {
                target: this,
                method: "executeWelcomeAction",
                args: ["site-settings"],
              },
              eventName: "super-daemon-element-method",
              context: ["CMS"],
              path: "CMS/welcome/site-settings",
            },
            {
              title: "Don't show this welcome again",
              icon: "icons:visibility-off",
              tags: ["welcome", "dismiss", "settings"],
              value: {
                target: this,
                method: "dismissWelcomeProgram",
                args: [],
              },
              eventName: "super-daemon-element-method",
              context: ["CMS"],
              path: "CMS/welcome/dismiss",
            },
          ];
        },
      },
    });

    SuperDaemonInstance.defineOption({
      title: "Change theme temporarily",
      icon: "image:style",
      tags: ["Developer", "theme"],
      eventName: "super-daemon-run-program",
      path: ">settings/theme",
      context: [">"],
      more: html`<span
        >Change theme just for the current browsing session</span
      >`,
      voice: "change theme (temporarily)",
      value: {
        name: "Change theme",
        context: ">",
        program: async (input, values) => {
          let results = [];

          // Load themes dynamically from generated themes.json
          try {
            const themesResponse = await fetch(
              new URL("../themes.json", import.meta.url).href,
            );
            const themesData = await themesResponse.json();

            Object.keys(themesData).forEach((elementName) => {
              const theme = themesData[elementName];
              if (
                input == "" ||
                elementName.includes(input) ||
                theme.name.toLowerCase().includes(input.toLowerCase())
              ) {
                results.push({
                  title: theme.name,
                  icon: "image:style",
                  tags: ["theme"],
                  value: {
                    target: globalThis.HAXCMS,
                    method: "setTheme",
                    args: [elementName],
                  },
                  eventName: "super-daemon-element-method",
                  context: [">", ">settings/theme/" + elementName],
                  path: ">settings/theme/" + elementName,
                });
              }
            });
          } catch (error) {
            console.warn(
              "Failed to load themes.json, falling back to basic theme:",
              error,
            );
            // Fallback to a basic theme if themes.json fails to load
            if (input == "" || "clean-one".includes(input)) {
              results.push({
                title: "Clean One",
                icon: "image:style",
                tags: ["theme"],
                value: {
                  target: globalThis.HAXCMS,
                  method: "setTheme",
                  args: ["clean-one"],
                },
                eventName: "super-daemon-element-method",
                context: [">", ">settings/theme/clean-one"],
                path: ">settings/theme/clean-one",
              });
            }
          }

          return results;
        },
      },
    });
    SuperDaemonInstance.defineOption({
      title: "HAX Labs",
      icon: "hax:hax2022",
      tags: ["Developer", "labs", "experiments"],
      eventName: "super-daemon-element-method",
      path: ">hax/labs",
      context: [">"],
      value: {
        target: this,
        method: "enableLabExperiments",
        args: [],
      },
    });
    SuperDaemonInstance.defineOption({
      title: "View only mode",
      icon: "visibility",
      tags: ["CMS", "view", "read-only", "preview"],
      eventName: "super-daemon-element-method",
      path: "CMS/mode/view-only",
      context: ["CMS"],
      more: html`<span
        >Enable view only mode to hide all editing tools and experience the site
        as a visitor would see it</span
      >`,
      voice: "view only mode",
      value: {
        target: this,
        method: "enableViewOnlyMode",
        args: [],
      },
    });
    // force item to load schema
    SuperDaemonInstance.defineOption({
      title: "Go to site",
      icon: "hax:hax2022",
      tags: ["Developer", "change", "sites", "administration"],
      eventName: "super-daemon-run-program",
      path: "/hax/changeSite",
      context: ["CMS"],
      value: {
        name: "Go to site",
        context: "CMS",
        program: async (input, values) => {
          let results = [];
          // will work in a production haxiam environment to allow hopping between spaces
          await fetch("./../../system/api/listSites")
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              return [];
            })
            .then((manifest) => {
              if (manifest.data && manifest.data.items.length > 0) {
                manifest.data.items.forEach(async (site) => {
                  if (
                    input == "" ||
                    (site.metadata.site &&
                      site.metadata.site.name &&
                      site.metadata.site.name.includes(input) &&
                      store.manifest.metadata.site.name !=
                        site.metadata.site.name)
                  ) {
                    results.push({
                      title: site.title,
                      icon: site.metadata.theme.variables.icon,
                      tags: ["site", site.description],
                      value: {
                        target: this,
                        method: "goToLocation",
                        args: [site.slug],
                      },
                      eventName: "super-daemon-element-method",
                      context: [
                        "/",
                        "/hax/changeSite/" + site.metadata.site.name,
                      ],
                      path: "/hax/changeSite/" + site.metadata.site.name,
                    });
                  }
                });
              }
            });
          return results;
        },
      },
    });

    // Print Options Program
    SuperDaemonInstance.defineOption({
      title: "Print Options",
      icon: "icons:print",
      tags: ["CMS", "print", "page", "site", "pdf"],
      eventName: "super-daemon-run-program",
      path: "CMS/action/print",
      context: ["CMS"],
      voice: "print (options)",
      value: {
        name: "Print Options",
        machineName: "print-options",
        program: async (input, values) => {
          // Import the print program dynamically
          const { createPrintProgram } = await import(
            "./utils/PrintProgram.js"
          );
          const printProgram = createPrintProgram(this);
          return await printProgram(input, values);
        },
      },
    });

    // Export Page Program
    SuperDaemonInstance.defineOption({
      title: "Export page",
      icon: "icons:file-download",
      tags: ["CMS", "export", "page"],
      eventName: "super-daemon-run-program",
      path: "CMS/export/page",
      context: ["CMS", "HAX"],
      voice: "export page",
      value: {
        name: "Export page",
        machineName: "export-page",
        program: async (input, values) => {
          const { createExportPageProgram } = await import(
            "./utils/ExportPageProgram.js"
          );
          const exportPageProgram = createExportPageProgram(this);
          return await exportPageProgram(input, values);
        },
      },
    });

    // Export Site Program
    SuperDaemonInstance.defineOption({
      title: "Export site",
      icon: "icons:file-download",
      tags: ["CMS", "export", "site"],
      eventName: "super-daemon-run-program",
      path: "CMS/export/site",
      context: ["CMS"],
      voice: "export site",
      value: {
        name: "Export site",
        machineName: "export-site",
        program: async (input, values) => {
          const { createExportSiteProgram } = await import(
            "./utils/ExportSiteProgram.js"
          );
          const exportSiteProgram = createExportSiteProgram(this);
          return await exportSiteProgram(input, values);
        },
      },
    });

    // Edit Title Program
    SuperDaemonInstance.defineOption({
      title: "Edit title",
      icon: "editor:title",
      tags: ["CMS", "edit", "title", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/title",
      context: ["CMS"],
      voice: "edit title",
      value: {
        name: "Edit title",
        machineName: "edit-title",
        placeholder: "Enter new title",
        program: async (input, values) => {
          const { createEditTitleProgram } = await import(
            "./utils/EditTitleProgram.js"
          );
          const editTitleProgram = createEditTitleProgram(this);
          return await editTitleProgram(input, values);
        },
      },
    });

    // Edit Description Program
    SuperDaemonInstance.defineOption({
      title: "Edit description",
      icon: "editor:format-quote",
      tags: ["CMS", "edit", "description", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/description",
      context: ["CMS"],
      voice: "edit description",
      value: {
        name: "Edit description",
        machineName: "edit-description",
        placeholder: "Enter new description",
        program: async (input, values) => {
          const { createEditDescriptionProgram } = await import(
            "./utils/EditDescriptionProgram.js"
          );
          const editDescriptionProgram = createEditDescriptionProgram(this);
          return await editDescriptionProgram(input, values);
        },
      },
    });

    // Edit Slug Program
    SuperDaemonInstance.defineOption({
      title: "Edit slug",
      icon: "editor:insert-link",
      tags: ["CMS", "edit", "slug", "url", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/slug",
      context: ["CMS"],
      voice: "edit slug",
      value: {
        name: "Edit slug",
        machineName: "edit-slug",
        placeholder: "Enter new slug (URL path)",
        program: async (input, values) => {
          const { createEditSlugProgram } = await import(
            "./utils/EditSlugProgram.js"
          );
          const editSlugProgram = createEditSlugProgram(this);
          return await editSlugProgram(input, values);
        },
      },
    });

    // Edit Tags Program
    SuperDaemonInstance.defineOption({
      title: "Edit tags",
      icon: "icons:label",
      tags: ["CMS", "edit", "tags", "metadata"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/tags",
      context: ["CMS"],
      voice: "edit tags",
      value: {
        name: "Edit tags",
        machineName: "edit-tags",
        placeholder: "Enter tags separated by commas",
        program: async (input, values) => {
          const { createEditTagsProgram } = await import(
            "./utils/EditTagsProgram.js"
          );
          const editTagsProgram = createEditTagsProgram(this);
          return await editTagsProgram(input, values);
        },
      },
    });

    // Core site navigation programs - available regardless of theme
    SuperDaemonInstance.defineOption({
      title: "Go to page in this site",
      icon: "link",
      tags: ["Site", "navigation"],
      eventName: "super-daemon-run-program",
      context: ["CMS"],
      path: "/site/navigation",
      value: {
        name: "Go to page",
        context: ["CMS"],
        program: async (input, values) => {
          let results = [];
          const manifest = toJS(store.routerManifest) || toJS(store.manifest);
          if (manifest && manifest.items && manifest.items.length > 0) {
            manifest.items.forEach(async (item) => {
              if (
                item.title.toLowerCase().includes(input.toLowerCase()) ||
                input === ""
              ) {
                results.push({
                  title: item.title,
                  icon: "link",
                  tags: ["CMS", "page"],
                  value: {
                    target: globalThis.location,
                    method: "assign",
                    args: [item.slug],
                  },
                  context: ["CMS"],
                  eventName: "super-daemon-element-method",
                  path: "site/navigation/page",
                });
              }
            });
          }
          return results;
        },
      },
    });

    // Core site page linking program - available in HAX editor for linking to pages
    SuperDaemonInstance.defineOption({
      title: "Link to site page",
      icon: "hax:file-link-outline",
      tags: ["Search", "pages", "links"],
      eventName: "super-daemon-run-program",
      path: "/sources/site-pages",
      context: ["HAX", "/"],
      priority: -1,
      value: {
        name: "Search pages",
        context: ["HAX", "/"],
        program: async (input, values) => {
          let results = [];
          const manifest = toJS(store.routerManifest) || toJS(store.manifest);
          if (manifest && manifest.items && manifest.items.length > 0) {
            manifest.items.forEach(async (item) => {
              if (
                item.title.toLowerCase().includes(input.toLowerCase()) ||
                input === ""
              ) {
                results.push({
                  title: item.title,
                  icon: "link",
                  tags: ["CMS", "page"],
                  value: {
                    value: "a",
                    eventName: "insert-tag",
                    properties: {
                      href: item.slug,
                      "data-uuid": item.id,
                    },
                    content: item.title,
                  },
                  context: ["HAX", "/", "/sources/site-pages"],
                  eventName: "hax-super-daemon-insert-tag",
                  path: "/sources/site-pages",
                });
              }
            });
          }
          return results;
        },
      },
    });

    // Keyboard shortcuts program - displays all shortcuts and executes them on click
    SuperDaemonInstance.defineOption({
      title: "Keyboard shortcuts",
      icon: "hardware:keyboard",
      tags: ["help", "shortcuts", "keyboard", "reference"],
      eventName: "super-daemon-run-program",
      path: "CMS/help/keyboard-shortcuts",
      context: ["CMS"],
      value: {
        name: "Keyboard shortcuts",
        context: ["CMS"],
        program: async (input) => {
          const shortcuts =
            HAXCMSKeyboardShortcutsInstance.getShortcutsForDisplay();
          const results = [];

          shortcuts.forEach((shortcut) => {
            // Filter by search input
            if (
              input === "" ||
              shortcut.description
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              shortcut.label.toLowerCase().includes(input.toLowerCase())
            ) {
              results.push({
                title: `${shortcut.description} • ${shortcut.label}`,
                icon: "hardware:keyboard",
                tags: ["shortcut", "keyboard", shortcut.context],
                value: {
                  shortcutKey: shortcut.key,
                },
                context: ["CMS"],
                eventName: "execute-keyboard-shortcut",
                path: "CMS/help/keyboard-shortcuts",
              });
            }
          });

          return results;
        },
      },
    });

    // Listen for keyboard shortcut execution from Merlin
    this.addEventListener("execute-keyboard-shortcut", (e) => {
      const shortcutKey = e.detail.value.shortcutKey;
      // Parse the shortcut key to get individual components
      const parts = shortcutKey.split("+");
      const key = parts[parts.length - 1];
      const ctrl = parts.includes("Ctrl");
      const shift = parts.includes("Shift");
      const alt = parts.includes("Alt");
      const meta = parts.includes("Meta");

      // Get the shortcut and execute its callback
      const shortcut = HAXCMSKeyboardShortcutsInstance.getShortcut(
        key,
        ctrl,
        shift,
        alt,
        meta,
      );
      if (shortcut && shortcut.callback) {
        // Create a synthetic keyboard event
        const syntheticEvent = new KeyboardEvent("keydown", {
          key: key,
          ctrlKey: ctrl,
          shiftKey: shift,
          altKey: alt,
          metaKey: meta,
          bubbles: true,
        });
        shortcut.callback(syntheticEvent);
      }
    });

    this.updateAvailableButtons();
    // load user data
    this.dispatchEvent(
      new CustomEvent("haxcms-load-user-data", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );

    // Auto-trigger welcome program for first-time users
    this.checkAndTriggerWelcomeProgram();
  }
  // enable lab experiments
  enableLabExperiments() {
    // lecture player
    import("@haxtheweb/video-player/lib/lecture-player.js");
    // AI chat bot
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/magic/site-ai-chat.js"
    );
  }

  // Check if user should see welcome program and trigger it
  checkAndTriggerWelcomeProgram() {
    // Only trigger if user is logged in and hasn't seen the welcome before
    if (
      store.isLoggedIn &&
      !UserScaffoldInstance.readMemory("hasSeenHaxWelcome")
    ) {
      // Wait for the store and UI to be fully ready
      const triggerWelcome = () => {
        if (
          store.appReady &&
          this.shadowRoot &&
          this.shadowRoot.querySelector("#merlin")
        ) {
          // Auto-trigger the welcome program using waveWand for mini mode
          SuperDaemonInstance.waveWand(
            [
              "", // empty search to show all results
              "CMS", // context
              { operation: "welcome" }, // values
              "welcome", // program machine name
              "Welcome to HAX", // display name
            ],
            this.shadowRoot.querySelector("#merlin"), // target for mini mode
            "magic", // sound
          );

          // Show a toast to let the user know Merlin is here to help
          store.toast(
            "👋 Welcome to HAX! Merlin is here to help you get started",
            8000,
            {
              hat: "wizard",
            },
          );
        } else {
          // Retry after a short delay if not ready yet
          setTimeout(triggerWelcome, 500);
        }
      };

      // Give some time for everything to initialize
      setTimeout(triggerWelcome, 2000);
    }
  }

  // Method to dismiss the welcome program permanently
  dismissWelcomeProgram() {
    // Mark that the user has seen and dismissed the welcome program
    UserScaffoldInstance.writeMemory("hasSeenHaxWelcome", true, "long");

    // Close Merlin
    SuperDaemonInstance.close();

    // Show confirmation toast
    store.toast(
      "Welcome program dismissed. You can always access Merlin by pressing Alt+Shift or clicking the search bar.",
      5000,
      {
        hat: "check",
      },
    );
  }

  // Method to execute welcome program actions
  executeWelcomeAction(actionType) {
    // Execute the appropriate action based on type
    switch (actionType) {
      case "create-page":
        // Trigger the add page button
        SuperDaemonInstance.close();
        setTimeout(() => {
          this.shadowRoot.querySelector("#addpagebutton").HAXCMSButtonClick();
        }, 100);
        break;
      case "edit-page":
        // Trigger the edit page button
        this._editButtonTap();
        break;

      case "upload-file":
        // Use waveWand to trigger the file upload program
        SuperDaemonInstance.waveWand(
          [
            "", // empty search to show all file options
            "/", // context for file operations
            { operation: "file-upload" },
            "hax-agent",
            "File Agent",
          ],
          this.shadowRoot.querySelector("#merlin"),
          "coin2",
        );
        break;

      case "outline-designer":
        // Trigger the Site Outline
        this._outlineButtonTap();
        break;

      case "site-settings":
        // Trigger the site settings
        this._manifestButtonTap({
          target: this.shadowRoot.querySelector("#manifestbtn"),
        });
        break;

      default:
        console.warn("Unknown welcome action type:", actionType);
    }
  }

  // enable view only mode
  enableViewOnlyMode() {
    // Set ViewOnlyMode in UserContext as a session variable
    UserScaffoldInstance.writeMemory("ViewOnlyMode", true, "long");

    // Show toast notification with exit button
    store.showViewOnlyModeToast();

    // Refresh the page to apply view only mode
    setTimeout(() => {
      globalThis.location.reload();
    }, 600);
  }

  goToLocation(location) {
    globalThis.location = location;
  }

  // Export methods from ExportPageProgram
  async exportPageAs(format) {
    const { exportPageAs } = await import("./utils/ExportPageProgram.js");
    return exportPageAs.call(this, format);
  }

  async _exportPageAsHTML(content, title) {
    const { _exportPageAsHTML } = await import("./utils/ExportPageProgram.js");
    return _exportPageAsHTML.call(this, content, title);
  }

  async _exportPageAsMarkdown(content, title) {
    const { _exportPageAsMarkdown } = await import(
      "./utils/ExportPageProgram.js"
    );
    return _exportPageAsMarkdown.call(this, content, title);
  }

  async _exportPageAsDOCX(content, title) {
    const { _exportPageAsDOCX } = await import("./utils/ExportPageProgram.js");
    return _exportPageAsDOCX.call(this, content, title);
  }

  async _exportPageAsPDF(content, title) {
    const { _exportPageAsPDF } = await import("./utils/ExportPageProgram.js");
    return _exportPageAsPDF.call(this, content, title);
  }

  async _exportPageAsHAXSchema() {
    const { _exportPageAsHAXSchema } = await import(
      "./utils/ExportPageProgram.js"
    );
    return _exportPageAsHAXSchema.call(this);
  }

  // Export methods from ExportSiteProgram
  async exportSiteAs(format) {
    const { exportSiteAs } = await import("./utils/ExportSiteProgram.js");
    return exportSiteAs.call(this, format);
  }

  async _exportSiteAsHTML(manifest, title, baseUrl) {
    const { _exportSiteAsHTML } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsHTML.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsMarkdown(manifest, title, baseUrl) {
    const { _exportSiteAsMarkdown } = await import(
      "./utils/ExportSiteProgram.js"
    );
    return _exportSiteAsMarkdown.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsDOCX(manifest, title, baseUrl) {
    const { _exportSiteAsDOCX } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsDOCX.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsPDF(manifest, title, baseUrl) {
    const { _exportSiteAsPDF } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsPDF.call(this, manifest, title, baseUrl);
  }

  async _exportSiteAsEPUB(manifest, title, baseUrl) {
    const { _exportSiteAsEPUB } = await import("./utils/ExportSiteProgram.js");
    return _exportSiteAsEPUB.call(this, manifest, title, baseUrl);
  }

  async _downloadSiteArchive() {
    const { _downloadSiteArchive } = await import(
      "./utils/ExportSiteProgram.js"
    );
    return _downloadSiteArchive.call(this);
  }

  async _exportSiteAsSkeleton(manifest, title, baseUrl) {
    const { _exportSiteAsSkeleton } = await import(
      "./utils/ExportSiteProgram.js"
    );
    return _exportSiteAsSkeleton.call(this, manifest, title, baseUrl);
  }

  // Utility methods from both export programs
  _downloadFile(content, filename, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    this._downloadBlob(blob, filename);
  }

  _downloadBlob(blob, filename) {
    const link = globalThis.document.createElement("a");
    link.href = globalThis.URL.createObjectURL(blob);
    link.download = filename;
    link.target = "_blank";
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    globalThis.URL.revokeObjectURL(link.href);
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "userMenuOpen" && oldValue !== undefined) {
        if (this.userMenuOpen) {
          this.rpgHat = "edit";
        } else {
          this.rpgHat = "none";
        }
      }
      if (propName === "responsiveSize") {
        this._updateEditButtonLabel();
      }
      if (propName == "editMode") {
        if (this.editMode) {
          this.rpgHat = "construction";
        } else {
          this.rpgHat = "none";
        }
        // Update edit button label when mode changes
        this._updateEditButtonLabel();
        if (oldValue !== undefined) {
          SuperDaemonInstance.close();
        }
        // observer
        this._editModeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("edit-mode-changed", {
            detail: this[propName],
          }),
        );
      }
      if (propName == "manifestEditMode") {
        // observer
        this._manifestEditModeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("manifest-edit-mode-changed", {
            detail: this[propName],
          }),
        );
      }
    });
  }
  _redoChanged(e) {
    this.canRedo = e.detail.value;
  }
  _undoChanged(e) {
    this.canUndo = e.detail.value;
  }
  static get properties() {
    return {
      ...super.properties,
      t: {
        type: Object,
      },
      userName: {
        type: String,
        attribute: "user-name",
      },
      activeDrag: {
        type: Boolean,
      },
      activeType: {
        type: String,
      },
      activeNode: {
        type: Object,
      },
      activeTagName: {
        type: String,
      },
      /**
       * If we can currently undo based on stack position
       */
      canUndo: {
        type: Boolean,
        attribute: "can-undo",
      },
      /**
       * If we can currently redo based on stack position
       */
      canRedo: {
        type: Boolean,
        attribute: "can-redo",
      },
      rpgHat: { type: String },
      userPicture: {
        type: String,
        attribute: "user-picture",
      },
      userMenuOpen: {
        type: Boolean,
      },
      soundIcon: { type: String },
      darkMode: { type: Boolean, reflect: true, attribute: "dark-mode" },
      backLink: {
        type: String,
      },
      backText: {
        type: String,
      },
      __editIcon: {
        type: String,
      },
      __editText: {
        type: String,
      },
      /**
       * small visual lock that events break on initial paint
       */
      painting: {
        type: Boolean,
        reflect: true,
      },
      /**
       * page allowed
       */
      pageAllowed: {
        type: Boolean,
        attribute: "page-allowed",
        reflect: true,
      },
      /**
       * if the page is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * Manifest editing state
       */
      manifestEditMode: {
        type: Boolean,
        attribute: "manifest-edit-mode",
        reflect: true,
      },
      activeTitle: {
        type: String,
        attribute: "active-title",
      },
      activeItem: {
        type: Object,
      },
      manifest: {
        type: Object,
      },
      /**
       * Whether we're currently on an internal route
       */
      onInternalRoute: {
        type: Boolean,
      },
      /**
       * Platform configuration from manifest.metadata.platform
       * Controls additional restrictions on site editing capabilities
       */
      platformConfig: {
        type: Object,
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();

    // Register keyboard shortcuts
    this._registerKeyboardShortcuts();
    HAXCMSKeyboardShortcutsInstance.enable();

    autorun((reaction) => {
      if (store.userData) {
        this.userName = toJS(store.userData.userName);
        this.userPicture = toJS(store.userData.userPicture);
        // update buttons to match since we got a state response
        this.updateAvailableButtons();
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      UserScaffoldInstance.writeMemory("editMode", this.editMode);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      // Extract platform configuration from manifest metadata
      if (
        this.manifest &&
        this.manifest.metadata &&
        this.manifest.metadata.platform
      ) {
        this.platformConfig = toJS(this.manifest.metadata.platform);
      } else {
        // Default to empty object if no platform config exists
        this.platformConfig = {};
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.pageAllowed = toJS(store.pageAllowed);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      const activeItem = toJS(store.activeItem);
      this.activeItem = activeItem;
      // update buttons to match since we got a state response
      this.updateAvailableButtons();
      if (activeItem && activeItem.id) {
        this.activeTitle = activeItem.title;
        this.onInternalRoute = activeItem._internalRoute || false;
        // Use the store method to determine if editing is allowed
        const supportsEditor = store.currentRouteSupportsHaxEditor();
        // Show the button if editor is supported, regardless of lock status
        store.pageAllowed = supportsEditor;
      } else {
        this.onInternalRoute = false;
        store.pageAllowed = false;
      }
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    // Unregister keyboard shortcuts
    HAXCMSKeyboardShortcutsInstance.disable();

    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }

  /**
   * Update edit button label with appropriate shortcut
   */
  _updateEditButtonLabel() {
    if (this.editMode) {
      this.__editText = `${this.t.save} • Ctrl⇧S`;
    } else {
      this.__editText = `${this.t.edit} • Ctrl⇧E`;
    }
  }

  /**
   * Register all keyboard shortcuts for HAXcms
   */
  _registerKeyboardShortcuts() {
    // Ctrl+Shift+S - Save (only when in edit mode)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "S",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._editButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.pageAllowed && this.editMode,
      description: "Save page and exit edit mode",
      context: "edit",
    });

    // Ctrl+Shift+E - Edit (only when NOT in edit mode)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "E",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._editButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.pageAllowed && !this.editMode,
      description: "Enter edit mode",
      context: "view",
    });

    // Ctrl+Shift+W - Save and Edit (when in edit mode)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "W",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._saveAndEditButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.pageAllowed && this.editMode,
      description: "Save and continue editing",
      context: "edit",
    });

    // Ctrl+Shift+/ - Cancel editing (register as / not ?)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "/",
      ctrl: true,
      shift: true,
      callback: (e) => {
        this._cancelButtonTap(e);
      },
      condition: () => store.isLoggedIn && this.editMode,
      description: "Cancel editing",
      context: "edit",
    });




    // Ctrl+Shift+V - Toggle view source mode in HAX
    HAXCMSKeyboardShortcutsInstance.register({
      key: "V",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (HAXStore.haxTray) {
          if (HAXStore.haxTray.trayDetail === "view-source") {
            HAXStore.haxTray.collapsed = true;
          } else {
            HAXStore.haxTray.trayDetail = "view-source";
            HAXStore.haxTray.shadowRoot
              .querySelector("#view-source")
              .openSource();
            HAXStore.haxTray.collapsed = false;
          }
        }
      },
      condition: () => store.isLoggedIn && this.editMode,
      description: "Toggle view source mode",
      context: "edit",
    });

    // Ctrl+Shift+B - Open block browser in HAX
    HAXCMSKeyboardShortcutsInstance.register({
      key: "B",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (HAXStore.haxTray) {
          if (HAXStore.haxTray.trayDetail === "content-add") {
            HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
          } else {
            HAXStore.haxTray.trayDetail = "content-add";
            HAXStore.haxTray.collapsed = false;
          }
        }
      },
      condition: () => store.isLoggedIn && this.editMode,
      description: "Open block browser",
      context: "edit",
    });

    // Numbered shortcuts - contextual based on edit mode
    // Ctrl+Shift+1 - Configure panel (edit) OR Add page (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "1",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (this.editMode) {
          // Edit mode: Open configure panel
          if (HAXStore.haxTray) {
            HAXStore.haxTray.trayDetail = "content-edit";
            HAXStore.haxTray.collapsed = false;
          }
        } else {
          // Non-edit mode: Add page
          if (this.platformAllows("addPage")) {
            const addButton = this.shadowRoot.querySelector("#addpagebutton");
            if (addButton) {
              addButton.HAXCMSButtonClick();
            }
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: "Configure panel (edit) / Add page (view)",
      context: "global",
    });

    // Ctrl+Shift+2 - Blocks browser (edit) OR Site outline (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "2",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (this.editMode) {
          // Edit mode: Blocks browser
          if (HAXStore.haxTray) {
            if (HAXStore.haxTray.trayDetail === "content-add") {
              HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
            } else {
              HAXStore.haxTray.trayDetail = "content-add";
              HAXStore.haxTray.collapsed = false;
            }
          }
        } else {
          // Non-edit mode: Site outline
          if (this.platformAllows("outlineDesigner")) {
            this._outlineButtonTap(e);
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: "Blocks browser (edit) / Site outline (view)",
      context: "global",
    });

    // Ctrl+Shift+3 - Page structure (edit) OR Style guide (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "3",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (this.editMode) {
          // Edit mode: Page structure
          if (HAXStore.haxTray) {
            if (HAXStore.haxTray.trayDetail === "content-map") {
              HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
            } else {
              HAXStore.haxTray.trayDetail = "content-map";
              HAXStore.haxTray.collapsed = false;
            }
          }
        } else {
          // Non-edit mode: Style guide
          if (this.platformAllows("styleGuide")) {
            this._styleGuideButtonTap(e);
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: "Page structure (edit) / Style guide (view)",
      context: "global",
    });

    // Ctrl+Shift+4 - View source (edit) OR Insights dashboard (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "4",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (this.editMode) {
          // Edit mode: View source
          if (HAXStore.haxTray) {
            if (HAXStore.haxTray.trayDetail === "view-source") {
              HAXStore.haxTray.collapsed = true;
            } else {
              HAXStore.haxTray.trayDetail = "view-source";
              HAXStore.haxTray.shadowRoot
                .querySelector("#view-source")
                .openSource();
              HAXStore.haxTray.collapsed = false;
            }
          }
        } else {
          // Non-edit mode: Insights dashboard
          if (this.platformAllows("insights")) {
            this._insightsButtonTap(e);
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: "View source (edit) / Insights dashboard (view)",
      context: "global",
    });

    // Ctrl+Shift+5 - Media browser (edit) OR Site settings (non-edit)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "5",
      ctrl: true,
      shift: true,
      callback: (e) => {
        if (this.editMode) {
          // Edit mode: Media browser
          SuperDaemonInstance.waveWand(
            ["sources", "/"],
            this.shadowRoot.querySelector("#merlin"),
            null,
          );
        } else {
          // Non-edit mode: Site settings
          if (this.platformAllows("manifest")) {
            this._manifestButtonTap(e);
          }
        }
      },
      condition: () => store.isLoggedIn,
      description: "Media browser (edit) / Site settings (view)",
      context: "global",
    });

    // Ctrl+Shift+6 - Super Daemon (alternative shortcut)
    HAXCMSKeyboardShortcutsInstance.register({
      key: "6",
      ctrl: true,
      shift: true,
      callback: (e) => {
        SuperDaemonInstance.waveWand(
          ["", "*"],
          this.shadowRoot.querySelector("#merlin"),
          null,
        );
      },
      condition: () => store.isLoggedIn,
      description: "Open Merlin (Super Daemon)",
      context: "global",
    });
  }

  /**
   * toggle state on button tap
   */
  _editButtonTap(e) {
    // Check if the active page is locked
    const activeItem = toJS(store.activeItem);
    if (
      activeItem &&
      activeItem.metadata &&
      activeItem.metadata.locked &&
      !this.editMode
    ) {
      store.toast(
        "This page is locked. Click the lock button to unlock it before editing.",
        3000,
        { hat: "error" },
      );
      store.playSound("error");
      return false;
    }

    if (this.editMode && HAXStore.haxTray.trayDetail === "view-source") {
      if (!globalThis.confirm(this.t.confirmHtmlSourceExit)) {
        return false;
      }
    }
    store.playSound("click");
    this.editMode = !this.editMode;
    // save button shifted to edit
    if (!this.editMode) {
      this.dispatchEvent(
        new CustomEvent("haxcms-save-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: store.activeItem,
        }),
      );
    }
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  /**
   * Save and edit button tap - saves but keeps edit mode active
   */
  _saveAndEditButtonTap(e) {
    if (this.editMode && HAXStore.haxTray.trayDetail === "view-source") {
      if (!globalThis.confirm(this.t.confirmHtmlSourceExit)) {
        return false;
      }
    }
    store.playSound("click");
    // Save the content but keep edit mode active
    this.dispatchEvent(
      new CustomEvent("haxcms-save-node", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { ...store.activeItem, keepEditMode: true },
      }),
    );
    // Hide any modals that might be open
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  _insightsButtonTap(e) {
    store.playSound("click");
    const c = globalThis.document.createElement("haxcms-site-insights");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.insights,
        styles: {
          "--simple-modal-titlebar-background": "black",
          "--simple-modal-titlebar-color": "var(--hax-ui-background-color)",
          "--simple-modal-width": "94vw",
          "--simple-modal-min-width": "300px",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-height": "94vh",
          "--simple-modal-min-height": "300px",
          "--simple-modal-titlebar-height": "80px",
        },
        elements: { content: c },
        invokedBy: this.shadowRoot.querySelector("#insightsbutton"),
        clone: false,
        modal: false,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  /**
   * Navigate to style guide route
   */
  _styleGuideButtonTap(e) {
    store.playSound("click");
    globalThis.location.href = "x/theme/style-guide";
  }
  async _cancelButtonTap(e) {
    const body = await HAXStore.activeHaxBody.haxToContent();
    if (
      body != this._originalContent &&
      !globalThis.confirm(
        this.t.unsavedChangesWillBeLostIfSelectingOkAreYouSure,
      )
    ) {
      return false;
    }
    this.editMode = false;
    store.playSound("error");
    this.dispatchEvent(
      new CustomEvent("hax-cancel", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.detail,
      }),
    );
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  /**
   * Delete button hit, confirm they want to do this
   */
  _deleteButtonTap(e) {
    store.playSound("click");
    let c = globalThis.document.createElement("span");
    c.innerHTML = `"${store.activeItem.title}" will be removed from the outline but its content stays on the file system.`;
    let b1 = globalThis.document.createElement("button");
    b1.appendChild(globalThis.document.createTextNode("Confirm"));
    b1.classList.add("hax-modal-btn");
    b1.addEventListener("click", this._deleteActive.bind(this));
    let b2 = globalThis.document.createElement("button");
    b2.appendChild(globalThis.document.createTextNode("cancel"));
    b2.addEventListener("click", () => store.playSound("error"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    b2.classList.add("hax-modal-btn");
    b2.classList.add("cancel");
    let b = globalThis.document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: "Are you sure you want to delete this page?",
        styles: {
          "--simple-modal-titlebar-background": "black",
          "--simple-modal-titlebar-color": "var(--hax-ui-background-color)",
          "--simple-modal-width": "25vw",
          "--simple-modal-min-width": "300px",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-height": "15vh",
          "--simple-modal-min-height": "300px",
          "--simple-modal-titlebar-height": "80px",
        },
        elements: { content: c, buttons: b },
        invokedBy: this,
        clone: false,
        modal: true,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  /**
   * delete active item
   */
  _deleteActive(e) {
    store.playSound("click");
    const evt = new CustomEvent("haxcms-delete-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        item: store.activeItem,
      },
    });
    this.dispatchEvent(evt);
  }
  /**
   * Edit title via Merlin program
   */
  _editTitlePrompt(e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) {
      return;
    }
    const currentTitle = activeItem.title || "";
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");
    SuperDaemonInstance.waveWand([
      currentTitle,
      "/",
      {},
      "edit-title",
      "Edit title",
      "",
    ]);
  }
  /**
   * Edit description via Merlin program
   */
  _editDescriptionPrompt(e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) {
      return;
    }
    const currentDescription = activeItem.description || "";
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");
    SuperDaemonInstance.waveWand([
      currentDescription,
      "/",
      {},
      "edit-description",
      "Edit description",
      "",
    ]);
  }
  /**
   * Toggle lock status
   */
  _toggleLockStatus(e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) return;

    const isLocked = activeItem.metadata && activeItem.metadata.locked;
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: activeItem.id,
          operation: "setLocked",
          locked: !isLocked,
        },
      }),
    );
  }
  /**
   * Duplicate page prompt
   */
  _duplicatePagePrompt(e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) return;

    const newTitle = globalThis.prompt(
      "Enter title for duplicated page:",
      `${activeItem.title} (copy)`,
    );
    if (newTitle && newTitle.trim() !== "") {
      store.playSound("click");
      const SuperDaemonInstance =
        globalThis.SuperDaemonManager.requestAvailability();
      // Use the create-page program with duplicate option
      SuperDaemonInstance.waveWand([
        newTitle,
        "/",
        {},
        "create-page",
        "Add Page",
      ]);
    }
  }
  /**
   * Edit slug prompt
   */
  _editSlugPrompt(e) {
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) {
      return;
    }
    const currentSlug = activeItem.slug || "";
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");
    SuperDaemonInstance.waveWand([
      currentSlug,
      "/",
      {},
      "edit-slug",
      "Edit slug",
      "",
    ]);
  }
  /**
   * Move page program from menu
   */
  _movePageProgramFromMenu(e) {
    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      return;
    }
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");
    SuperDaemonInstance.waveWand([
      "",
      "/",
      { pageId: item.id },
      "move-page",
      "Move Page",
      "",
    ]);
  }
  /**
   * Toggle locked status
   */
  _toggleLockedStatus(e) {
    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      return;
    }
    const currentStatus = item.metadata && item.metadata.locked ? true : false;
    const newStatus = !currentStatus;
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          operation: "setLocked",
          locked: newStatus,
        },
      }),
    );
  }
  /**
   * Toggle published status
   */
  _togglePublishedStatus(e) {
    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      return;
    }
    const currentStatus = item.metadata && item.metadata.published !== false;
    const newStatus = !currentStatus;
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          operation: "setPublished",
          published: newStatus,
        },
      }),
    );
  }
  /**
   * toggle state on button tap
   */
  _outlineButtonTap(e) {
    store.playSound("click");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.outlineDesigner,
        styles: {
          "--simple-modal-titlebar-background": "black",
          "--simple-modal-titlebar-color": "var(--hax-ui-background-color)",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-titlebar-height": "80px",
          "--simple-modal-width": "85vw",
          "--simple-modal-max-width": "85vw",
          "--simple-modal-height": "85vh",
          "--simple-modal-max-height": "85vh",
        },
        elements: {
          content: globalThis.document.createElement(
            "haxcms-outline-editor-dialog",
          ),
        },
        invokedBy: this.shadowRoot.querySelector("#outlinebutton"),
        clone: false,
        modal: true,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  _addButtonTap() {
    store.playSound("click");
    setTimeout(() => {
      globalThis.location = this.backLink;
    }, 100);
  }
  /**
   * toggle state on button tap
   */
  _manifestButtonTap(e) {
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
    // prettier-ignore
    import("@haxtheweb/haxcms-elements/lib/core/haxcms-site-dashboard.js").then(() => {
      globalThis.dispatchEvent(new CustomEvent("simple-modal-show", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          title: this.t.siteSettings,
          styles: {
            "--simple-modal-titlebar-background": "black",
            "--simple-modal-titlebar-color": "var(--hax-ui-background-color)",
            "--simple-modal-z-index": "100000000",
            "--simple-modal-titlebar-height": "80px",
            "--simple-modal-width": "85vw",
            "--simple-modal-max-width": "85vw",
            "--simple-modal-height": "85vh",
            "--simple-modal-max-height": "85vh",
          },
          elements: {
            content: globalThis.document.createElement("haxcms-site-dashboard"),
          },
          invokedBy: this.shadowRoot.querySelector("#manifestbtn"),
          clone: false,
          modal: true,
        },
      }));
      // delay send so that the modal can be created
      setTimeout(() => {
        globalThis.dispatchEvent(
          new CustomEvent("haxcms-load-site-dashboard", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: e.target,
          })
        );          
      }, 0);
    });
  }
  /**
   * Edit state has changed.
   */
  _editModeChanged(newValue, oldValue) {
    if (newValue) {
      // store a content copy of original state as text, waiting for a paint / full setup
      setTimeout(async () => {
        this._originalContent = await HAXStore.activeHaxBody.haxToContent();
      }, 100);
      this.__editIcon = "icons:save";
      SuperDaemonInstance.appendContext("HAX");
      SuperDaemonInstance.removeContext("CMS");
    } else {
      this.__editIcon = "icons:create";
      SuperDaemonInstance.appendContext("CMS");
      SuperDaemonInstance.removeContext("HAX");
    }
    this._updateEditButtonLabel();
    if (typeof oldValue !== typeof undefined) {
      store.editMode = newValue;
      // force tray status to be the opposite of the editMode
      // to open when editing and close when not
      if (newValue) {
        HAXStore.haxTray.collapsed = false;
      }
    }
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _outlineEditModeChanged(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-outline-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue,
      }),
    );
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _manifestEditModeChanged(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-manifest-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue,
      }),
    );
  }

  /**
   * Handle Konami Code activation - dynamically load cheat codes
   */
  async _konamiCodeActivated(e) {
    if (!this.konamiCodeActivated) {
      this.konamiCodeActivated = true;

      try {
        // Dynamically import the cheat codes module for performance
        const cheatModule = await import("./haxcms-cheat-codes.js");

        // Add all cheat code methods to this instance
        cheatModule.addCheatCodeMethods(this, SuperDaemonInstance);

        // Define all cheat code programs in Merlin
        cheatModule.defineCheatCodes(this, SuperDaemonInstance);

        // Show notification that cheat codes are now available
        HAXStore.toast(
          "🎮 Cheat codes unlocked! Check Merlin for new programs.",
        );

        // Close Merlin first to reset state, then reopen after delay
        SuperDaemonInstance.close();

        setTimeout(() => {
          SuperDaemonInstance.mini = true;
          SuperDaemonInstance.wand = true;
          SuperDaemonInstance.activeNode =
            this.shadowRoot.querySelector("#merlin");
          SuperDaemonInstance.open();
          // Force refresh of items to include new cheat codes
          SuperDaemonInstance.items = SuperDaemonInstance.filterItems(
            SuperDaemonInstance.allItems,
            SuperDaemonInstance.context,
          );
          SuperDaemonInstance.runProgram("", "*");
        }, 100);
      } catch (error) {
        console.error("🎮 Failed to load cheat codes:", error);
        HAXStore.toast("🎮 Failed to unlock cheat codes");
      }
    }
  }
}
globalThis.customElements.define(HAXCMSSiteEditorUI.tag, HAXCMSSiteEditorUI);
export { HAXCMSSiteEditorUI };
