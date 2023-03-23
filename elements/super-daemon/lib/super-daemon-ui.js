import { LitElement, html, css, nothing } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "./super-daemon-row.js";

export class SuperDaemonUI extends SimpleFilterMixin(I18NMixin(LitElement)) {
  constructor() {
    super();
    this._defaultTextEmpty = "No results for this term";
    this.t.noResultsForThisTerm = this._defaultTextEmpty;
    this.t.whatAreYouLookingFor = "What are you looking for?";
    this.t.filterCommands = "Filter commands";
    this.t.commands = "Commands";
    this.t.loadingResults = "Loading results";
    this.opened = false;
    this.items = [];
    this.mini = false;
    this.loading = false;
    this.programSearch = '';
    this.commandContext = "*";
    this.programName = null;
    this.shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true,
    };
    this.where = "index";
    this.icon = "hardware:keyboard-return";
  }
  static get tag() {
    return "super-daemon-ui";
  }

  static get properties() {
    return {
      ...super.properties,
      icon: { type: String },
      mini: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true},
      programSearch: { type: String, attribute: "program-search" },
      programName: { type: String, attribute: "program-name" },
      commandContext: { type: String, attribute: "command-context" },
      opened: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
        }
        .search {
          display: flex;
        }
        .search input {
          display: inline-flex;
          width: 100%;
        }
        .search .icon {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 100px;
        }
        
        .search .user-context-icon {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 30px;
        }
        .loading {
          font-size: 24px;
          font-family: "Roboto Mono", monospace;
          font-style: italic;
          margin: 16px;
        }
        .program {
          display: inline-flex;
          font-family: "Roboto Mono", monospace;
          background-color: black;
          color: white;
          line-break: anywhere;
          word-break: break-all;
          word-wrap: break-word;
          text-overflow: clip;
          overflow: hidden;
          line-height: 16px;
          height: 16px;
          padding: 2px 4px;
          margin: 16px 0 0 -2px;
          font-size: 10px;
          width: 100%;
          max-width: 100px;
        }
        .results-stats {
          right: 0;
          position: absolute;
          font-size: 12px;
          color: #666;
          padding: 8px;
          margin: 8px;
        }
        .results {
          width: 100%;
          display: block;
          border: 2px solid black;
          max-height: 50vh;
          min-height: 30vh;
          overflow-y: scroll;
          scroll-snap-align: start;
          scroll-snap-type: y mandatory;
          padding: 32px 0px;
        }
        .no-results {
          font-size: 32px;
          font-weight: bold;
          max-width: 90%;
          word-break: break-all;
          overflow: hidden;
          line-height: 32px;
          height: 32px;
          margin: 16px auto;
          border: 1px solid transparent;
          box-shadow: none;
          outline: 0px;
        }
        simple-fields-field {
          line-height: 40px;
          padding: 8px;
          color: inherit;
          line-height: normal;
          font-family: inherit;
          width: 100%;
          margin: 0px;
        }
        simple-fields-field::part(option-input) {
          padding: 0px 2px;
          font-size: 24px;
        }
        simple-fields-field::part(label) {
          opacity: 0;
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }

        @media screen and (max-width: 800px) {
          .results {
            padding: 0px;
          }
          simple-fields-field {
            line-height: 20px;
          }
          .search .icon {
            display: none;
          }
          super-daemon-row {
            --super-daemon-row-icon: 32px;
            margin: 8px;
          }
          super-daemon-row::part(button) {
            padding: 4px;
          }
          super-daemon-row::part(action) {
            font-size: 28px;
            line-height: 28px;
            height: 28px;
          }
          super-daemon-row::part(path) {
            font-size: 16px;
          }
          super-daemon-row::part(tags) {
            width: 20%;
          }
          super-daemon-row::part(tag) {
            display: none;
          }
          super-daemon-row::part(tag-0) {
            display: inline-flex !important;
            --simple-fields-font-size: 12px;
          }
          super-daemon-row::part(key-combo) {
            display: none;
          }
        }
        @media screen and (max-width: 640px) {
          super-daemon-row::part(path) {
            font-size: 12px;
          }
          super-daemon-row::part(action) {
            font-size: 24px;
            line-height: 24px;
            height: 24px;
          }
        }

        :host([mini]) {
          background-color: white;
        }
        :host([mini]) super-daemon-row {
          --super-daemon-row-icon: 24px;
        }
        :host([mini]) .results-stats {
          display: none;
        }
        :host([mini]) {
          max-width: 50vw;
          max-height: 40vh;
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        if (this.opened) {
          this.shadowRoot.querySelector("#inputfilter").focus();
          // reset to top of results
          this.shadowRoot.querySelector(".results").scrollTo(0,0);
        }
      }
      if (propName == "commandContext") {
        this.dispatchEvent(new CustomEvent("super-daemon-command-context-changed", {
          detail: {
            value: this[propName],
          },
        }));
      }
    });
  }

  setupProgram() {
    this.programSearch = '';
    this.shadowRoot.querySelector("#inputfilter").focus();
    this.shadowRoot.querySelector("#inputfilter").select();
    // reset to top of results
    this.shadowRoot.querySelector(".results").scrollTo(0,0);
  }
  // feed results to the program as opposed to the global context based on program running
  inputfilterChanged(e) {
    if (this.programName) {
      // don't set like if we're in a program
      this.programSearch = e.target.value;
    }
    else {
      this.like = e.target.value;
    }
  }
  // reset search values because we selected something
  itemSelected(e) {
    this.like = '';
    this.programSearch = '';
  }

  _resultsKeydown(e) {
    if (this.filtered.length > 0 && this.shadowRoot.querySelector("super-daemon-row[active]")) {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
            // allow wrap around
          if (this.shadowRoot.querySelector("super-daemon-row[active]") === this.shadowRoot.querySelector("super-daemon-row")) {
            this.shadowRoot.querySelector("super-daemon-row:last-child").shadowRoot.querySelector("button").focus();
          }
          else { 
            this.shadowRoot.querySelector("super-daemon-row[active]").previousElementSibling.shadowRoot.querySelector("button").focus();
          }
          break;
        case "ArrowDown":
        case "ArrowRight":
            // allow wrap around 
          if (this.shadowRoot.querySelector("super-daemon-row[active]") === this.shadowRoot.querySelector("super-daemon-row:last-child")) {
            this.shadowRoot.querySelector("super-daemon-row").shadowRoot.querySelector("button").focus();
          }
          else { 
            this.shadowRoot.querySelector("super-daemon-row[active]").nextElementSibling.shadowRoot.querySelector("button").focus();
          }
        break;
      }
    }
  }
  // keydown when we have focus on the input field
  _inputKeydown(e) {
    if (this.filtered.length > 0) {
      switch (e.key) {
        case "Enter":
          this.shadowRoot.querySelector("super-daemon-row")
          .selected();
        break;
        case "ArrowUp":
          // @todo get focus on the row via an "active" parameter so we can just target that in the UI
          this.shadowRoot.querySelector("super-daemon-row:last-child")
            .shadowRoot.querySelector("button")
            .focus();
            this.shadowRoot.querySelector("super-daemon-row:last-child").scrollIntoView({block: "end", inline: "nearest"});
        break;
        case "ArrowDown":
          this.shadowRoot.querySelector("super-daemon-row")
            .shadowRoot.querySelector("button")
            .focus();
            this.shadowRoot.querySelector("super-daemon-row").scrollIntoView({block: "start", inline: "nearest"});
        break;
      }
    }
    // account for global override keys
    switch (e.key) {
      case "!":
      case "/":
      case "\\":
      case ">":
      case "<":
      case "?":
        // support variations on "slash" and developer commands that should interpret as same thing
        if (e.key === "\\" && this.like == "") {
          this.commandContext = "/";
          e.preventDefault();
        }
        else if (e.key === "!" && this.like == "") {
          this.commandContext = "/";
          e.preventDefault();
        }
        else if (e.key === "<" && this.like == "") {
          this.commandContext = ">";
          e.preventDefault();
        }
        else if (this.like == ""){
          this.commandContext = e.key;
          e.preventDefault();
        }
      break;
      case "Backspace":
        // use this to back out of a program context
        if (this.programSearch == "" && this.programName) {
          // run this to unset the program context
          this.dispatchEvent(new CustomEvent("super-daemon-run-program", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: false
          }));
          e.preventDefault();
        }
        else if (!this.programName && this.like == "" && this.commandContext) {
          this.commandContext = "*";
          e.preventDefault();
        }
      break;
    }
  }

  getActiveTitle(context) {
    switch(context) {
      case "/":
        return this.t.slashCommandsActive;
      case ">":
        return this.t.developerConsoleActive;
      case "?":
        return this.t.helpActive;
    }
    return "";
  }

  getActiveIcon(context) {
    switch(context) {
      case "/":
        return "hax:slash";
      case ">":
        return "hax:console-line";
      case "?":
        return "icons:help";
    }
    return "";
  }

  render() {
    return html`
      <div class="search">
      ${this.commandContext != "*" ? html`<simple-icon-lite title="${this.getActiveTitle(this.commandContext)}" icon="${this.getActiveIcon(this.commandContext)}" class="user-context-icon"></simple-icon-lite>` : ``}
      ${this.programName ? html`<span class="program">${this.programName}</span>`: ``}
      <simple-fields-field
          id="inputfilter"
          @value-changed="${this.inputfilterChanged}"
          @keydown="${this._inputKeydown}"
          .value="${this.like}"
          aria-controls="filter"
          label="${this.t.filterCommands}"
          placeholder="${this.t.whatAreYouLookingFor}"
          type="text"
          auto-validate=""
          autofocus
          part="filter"
        ></simple-fields-field>
        <simple-icon-lite icon="${this.icon}" class="icon"></simple-icon-lite>
      </div>
      <div class="results-stats">
        ${this.filtered.length} / ${this.items.length} ${this.t.commands}
      </div>
      <div class="results" @keydown="${this._resultsKeydown}" @super-daemon-row-selected="${this.itemSelected}">
      ${this.loading ? html`<div class="loading">${this.t.loadingResults}..</div>` : html`
      ${this.filtered.length === 0 ? html`<div class="no-results">${this.t.noResultsForThisTerm}</div>` : html`
          ${this.filtered.map(
            (item, i) => html`
              <super-daemon-row
                data-row-index="${i}"
                .value="${item.value}"
                icon="${item.icon}"
                image="${item.image}"
                title="${item.title}"
                .tags="${item.tags}"
                event-name="${item.eventName}"
                path="${item.path}"
                key="${item.key}"
                ?more="${item.more}"
              >${item.more ? item.more : nothing}</super-daemon-row>
            `
          )}
        `}
      `}
      </div>
    `;
  }
}

customElements.define(SuperDaemonUI.tag, SuperDaemonUI);
