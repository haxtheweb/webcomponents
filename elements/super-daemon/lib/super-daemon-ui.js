import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import "./super-daemon-row.js";

export class SuperDaemonUI extends SimpleFilterMixin(LitElement) {
  constructor() {
    super();
    this.items = [];
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
        .search simple-icon-lite {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 100px;
          border-radius: 0px;
        }
        .results {
          width: 100%;
          display: block;
          border: 2px solid black;
          max-height: 40vh;
          min-height: 20vh;
          overflow-y: scroll;
        }
        simple-fields-field,
        simple-fields-field:focus,
        simple-fields-field:hover {
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
      `,
    ];
  }

  inputfilterChanged(e) {
    this.like = e.target.value;
  }

  render() {
    return html`
      <div class="search">
        <simple-fields-field
          id="inputfilter"
          @value-changed="${this.inputfilterChanged}"
          .value="${this.like}"
          aria-controls="filter"
          label="Filter commands"
          placeholder="What are you looking to do?"
          type="text"
          auto-validate=""
          autofocus
          part="filter"
        ></simple-fields-field>
        <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
      </div>
      <div class="results">
        ${this.filtered.map(
          (item, i) => html`
            <super-daemon-row
              data-row-index="${i}"
              .value="${item.value}"
              icon="${item.icon}"
              title="${item.title}"
              .tags="${item.tags}"
              event-name="${item.eventName}"
              path="${item.path}"
              key="${item.key}"
            ></super-daemon-row>
          `
        )}
      </div>
    `;
  }
}

customElements.define(SuperDaemonUI.tag, SuperDaemonUI);
