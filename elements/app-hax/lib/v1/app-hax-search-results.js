/* eslint-disable no-return-assign */
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js';
import { html, css } from 'lit';
import { autorun, toJS } from 'mobx';
import { store } from './AppHaxStore.js';
import { varGet } from '@lrnwebcomponents/utils/utils.js';
import './app-hax-site-bar.js';
import './app-hax-site-details.js';

export class AppHaxSearchResults extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'app-hax-search-results';
  }

  constructor() {
    super();
    this.searchItems = [];
    this.displayItems = [];
    this.searchTerm = '';
    this.dark = false;
    autorun(() => {
      this.searchTerm = toJS(store.searchTerm);
    });
    autorun(() => {
      this.dark = toJS(store.darkMode);
    });
    autorun(() => {
      const manifest = toJS(store.manifest);
      if (manifest && manifest.items) {
        this.searchItems = toJS(store.manifest.items);
        this.displayItems = [...this.searchItems];
      }
    });
  }

  // Site.json is coming from

  static get properties() {
    return {
      ...super.properties,
      searchTerm: { type: String, reflect: true },
      searchItems: { type: Array },
      displayItems: { type: Array },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'searchTerm') {
        this.displayItems = this.searchItems.filter(word => {
          if (
            word.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            word.description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            word.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            word.slug.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
      }
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          overflow: hidden;
        }
        ul {
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <ul id="results">
        ${this.displayItems.map(
          item =>
            html`<li>
              <app-hax-site-bar
                @opened-changed="${this.openedChanged}"
                ?dark="${this.dark}"
                accent-color="${varGet(item,'metadata.theme.variables.cssVariable', 'orange').replace('--simple-colors-default-theme-','').replace('-7','')}"
                icon="${varGet(item,'metadata.theme.variables.icon', 'icons:home')}"
                icon-link="${'https://iam.hax.psu.edu' + item.slug}"
                >
                <p slot="heading">${item.title}</p>
                <p slot="subHeading">${item.author}</p>
                <p slot="band">${item.description}</p>
                <app-hax-site-details slot="band"></app-hax-site-details>
              </app-hax-site-bar>
            </li>`
        )}
      </ul>
    `;
  }
  
  openedChanged(e) {
    if (!e.detail.value) {
      this.shadowRoot.querySelector("app-hax-site-details").setAttribute("tabindex", "-1");
    }
    else {
      this.shadowRoot.querySelector("app-hax-site-details").removeAttribute("tabindex");
    }
  }
}
customElements.define(AppHaxSearchResults.tag, AppHaxSearchResults);