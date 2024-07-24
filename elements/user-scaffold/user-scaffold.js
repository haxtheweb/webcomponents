/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import {
  localStorageSet,
  localStorageGet,
  localStorageDelete,
  validURL,
} from "@haxtheweb/utils/utils.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false }); // strict mode off
// register globally so we can make sure there is only one
globalThis.UserScaffold = globalThis.UserScaffold || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same user-scaffold element, making it a singleton.
globalThis.UserScaffold.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (
    !globalThis.UserScaffold.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.UserScaffold.instance =
      globalThis.document.createElement("user-scaffold");
    globalThis.document.body.appendChild(globalThis.UserScaffold.instance);
  }
  return globalThis.UserScaffold.instance;
};
export const UserScaffoldInstance =
  globalThis.UserScaffold.requestAvailability();

const MEMORYINTERVALPOLLING = 300;
/**
 * `user-scaffold`
 * `memory and context to establish and maintain appropriate user scaffolding`
 *
 * @demo demo/index.html
 * @element user-scaffold
 */
export class UserScaffold extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "user-scaffold";
  }

  constructor() {
    super();
    // DEBUG MODE
    this.debug = false;
    this.windowControllers = new AbortController();
    this.stMemory = {
      interactionDelay: 0,
      interactionCount: 0,
    };
    this.ltMemory = localStorageGet("user-scaffold-ltMemory", {});
    this.action = {
      type: null,
      architype: null,
    };
    this.data = {
      raw: null,
      value: null,
      architype: null,
    };
    this.active = true;
    // event wiring
    this.userActionArchitypes();
    makeObservable(this, {
      debug: observable,
      stMemory: observable,
      ltMemory: observable,
      action: observable,
      data: observable,
      active: observable,
      memory: computed,
    });
    autorun(() => {
      if (this.debug) {
        console.trace(this);
      }
    });
  }
  // @todo active / inactive state -- any program NOT scaffold needs to sete active false
  // required action - here'es something and you MUST pick one (docx, cancel edited page)
  // suggested action - here's some things you MIGHT want to do (link that inserts title instead)

  // brings in our standard user action architypes
  // these should provide the basis for understanding
  // what the user is attempting to do in an application
  userActionArchitypes() {
    // always polling to understand if an action is taken
    this.interactionInterval = setInterval(() => {
      // limit writes to 12 seconds. Not going to track beyond that
      if (
        this.active &&
        this.readMemory("interactionDelay") <= MEMORYINTERVALPOLLING * 10
      ) {
        this.incrementWriteMemory(
          "interactionDelay",
          MEMORYINTERVALPOLLING * 2,
        );
      }
    }, MEMORYINTERVALPOLLING);
    // events
    globalThis.addEventListener("click", this.userMouseAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    // @todo COMMENT IN AFTER WE GET UX PATTERN DOWN FOR USERS PASTING
    /*globalThis.addEventListener("paste", this.userPasteAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("keydown", this.userKeyDownAction.bind(this), {
      signal: this.windowControllers.signal,
    });*/
    globalThis.addEventListener("drop", this.userDropAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("dragover", this.userDragAction.bind(this), {
      signal: this.windowControllers.signal,
    });
  }
  userKeyDownAction(e) {
    if (e.isTrusted) {
      this.action = {
        type: "key",
        architype: "input",
      };
      this.data = {
        raw: e.key,
        value: e.key,
        architype: "text",
      };
      this.writeMemory("recentTarget", e.target);
      this.writeMemory("interactionDelay", 0);
    }
  }
  // user has pasted, anywhere which is them indicating
  // they want to bring something into the application
  userPasteAction(e) {
    if (e.isTrusted) {
      this.action = {
        type: "paste",
        architype: "input",
      };
      let pasteContent = "";
      // default is text
      let architype = "text";
      // intercept paste event
      if (e.clipboardData || e.originalEvent.clipboardData) {
        pasteContent = (e.originalEvent || e).clipboardData.getData(
          "text/html",
        );
        // if it is purely plain text it could fail to come across as HTML and be empty
        if (pasteContent == "") {
          pasteContent = (e.originalEvent || e).clipboardData.getData("text");
        } else {
          architype = "text/html";
        }
      } else if (globalThis.clipboardData) {
        pasteContent = globalThis.clipboardData.getData("Text");
      }
      const raw = pasteContent;
      pasteContent = pasteContent.trim();
      // clear empty span tags that can pop up
      pasteContent = pasteContent.replace(/<span>\s*?<\/span>/g, " ");
      //remove styling
      pasteContent = pasteContent.replace(
        /(?:style="(\S+:\s*[^;"]+;\s*)*)+"/g,
        "",
      );
      // clean up div tags that can come in from contenteditable pastes
      // p tags make more sense in the content area
      pasteContent = pasteContent.replace(/<div/g, "<p");
      pasteContent = pasteContent.replace(/<\/div>/g, "</p>");
      let safe = pasteContent;
      // evaluate architype based on what this might be..
      // look for base64 like copy and paste of an image from clipboard
      if (this.isBase64(pasteContent)) {
        architype = "base64";
        safe = this.isBase64(pasteContent);
      } else if (e.clipboardData.files.length > 0) {
        architype = "file";
        if (e.clipboardData.files.length > 1) {
          architype = "files";
        }
      } else if (validURL(pasteContent)) {
        architype = "url";
      }

      this.data = {
        raw: raw,
        value: safe,
        architype: architype,
      };
    }
  }
  // dropping a file in implies certain capabilities
  userDropAction(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.isTrusted) {
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...e.dataTransfer.items].forEach((item, i) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            let file = item.getAsFile();
            this.action = {
              type: "drop",
              architype: "input",
            };
            this.data = {
              event: e,
              file: file,
              raw: e.dataTransfer.items[0].type,
              value: e.dataTransfer.items[0].type,
              architype: e.dataTransfer.items[0].kind,
            };
          }
        });
      } else {
        // Use DataTransfer interface to access the file(s)
        [...e.dataTransfer.files].forEach((file, i) => {
          this.action = {
            type: "drop",
            architype: "input",
          };
          this.data = {
            event: e,
            file: file,
            raw: e.dataTransfer.items[0].type,
            value: e.dataTransfer.items[0].type,
            architype: e.dataTransfer.items[0].kind,
          };
        });
      }
    }
  }
  // dragging a file in implies certain capabilities
  userDragAction(e) {
    if (
      e.isTrusted &&
      e.dataTransfer &&
      e.dataTransfer.items &&
      e.dataTransfer.items.length > 0
    ) {
      this.action = {
        type: "drag",
        architype: "input",
      };
      this.data = {
        raw: e.dataTransfer.items[0].type,
        value: e.dataTransfer.items[0].type,
        architype: e.dataTransfer.items[0].kind,
      };
    }
  }

  // reset interaction counter
  userMouseAction(e) {
    // don't respond to fake click events
    if (e.isTrusted) {
      this.action = {
        type: "click",
        architype: "input",
      };
      this.writeMemory("recentTarget", e.target);
      this.writeMemory("interactionDelay", 0);
      this.incrementWriteMemory("interactionCount", 1);
    }
  }
  incrementWriteMemory(key, value, type = "short") {
    let prop = "stMemory";
    if (type == "long") {
      prop = "ltMemory";
    }
    this.writeMemory(key, this[prop][key] + value, type);
  }
  // write memory state for long or short term memory
  // short is default, while long also is going to write localStorage
  writeMemory(key, value, type = "short") {
    let prop = "stMemory";
    if (type == "long") {
      prop = "ltMemory";
      this[prop][key] = value;
      localStorageSet(`user-scaffold-${prop}`, this[prop]);
    } else {
      this[prop][key] = value;
    }
  }
  // remove from memory
  deleteMemory(key, type = "short") {
    let prop = "stMemory";
    if (type == "long") {
      prop = "ltMemory";
      delete this[prop][key];
      localStorageDelete(`user-scaffold-${prop}`);
    } else {
      delete this[prop][key];
    }
  }
  // read memory state
  readMemory(key) {
    if (this.memory[key]) {
      return toJS(this.memory[key]);
    }
    return null;
  }
  // combine long and short term memory
  // this should ensure that short overrides long if
  // key is the same
  get memory() {
    return { ...this.ltMemory, ...this.stMemory };
  }
  /**
   * detect base64 object
   */
  isBase64(str) {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}
customElements.define(UserScaffold.tag, UserScaffold);
