import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-toolbar/lib/simple-button-grid.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
/**
 * `hax-stax-browser`
 * @element hax-stax-browser
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxStaxBrowser extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex: 0 0 auto;
          overflow-y: auto;
        }
        hax-tray-button {
          flex: auto;
          font-size: 12px;
          --hax-ui-font-size-sm: 12px;
          --simple-toolbar-button-height: 22px;
          --simple-toolbar-button-width: 22px;
        }
        hax-tray-button[small] {
          font-size: 8px;
          --hax-ui-font-size-sm: 8px;
          --simple-toolbar-button-height: 16px;
          --simple-toolbar-button-width: 16px;
        }
        hax-tray-button::part(button) {
          font-size: var(hax-ui-font-size-xs);
        }
        simple-button-grid {
          overflow: auto;
          --simple-button-grid-margin: 2px;
        }
        a11y-collapse {
          margin: 0;
          --a11y-collapse-margin: 0;
          --a11y-collapse-vertical-padding: 8px;
          --a11y-collapse-horizontal-padding: 4px;
        }
        a11y-collapse::part(heading) {
          margin: 8px 0px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.staxList = [];
    this.label = "Templates";
  }
  render() {
    return html`
      <a11y-collapse heading="${this.label}" heading-button>
        <simple-button-grid columns="2" rows="1" always-expanded>
          ${this.staxList.map(
            (stax) => html`
              <hax-tray-button
                icon-position="top"
                show-text-label
                index="${stax.index}"
                label="${stax.details.title}"
                .stax="${stax.stax}"
                icon="hax:templates"
                color="green"
                event-name="insert-stax"
              ></hax-tray-button>
            `,
          )}
        </simple-button-grid>
      </a11y-collapse>
    `;
  }
  static get tag() {
    return "hax-stax-browser";
  }
  static get properties() {
    return {
      /**
       * The list of stax
       */
      staxList: {
        type: Array,
      },
      label: { type: String },
    };
  }
}
customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
