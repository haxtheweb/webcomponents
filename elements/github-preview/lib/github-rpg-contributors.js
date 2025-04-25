/**
 * Copyright 2025 Tushar
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/rpg-character/rpg-character.js";

/**
 * `github-rpg-contributors`
 * 
 * @demo index.html
 * @element github-rpg-contributors
 */
export class GithubRpgContributors extends DDDSuper(LitElement) {

  static get tag() {
    return "github-rpg-contributors";
  }

  constructor() {
    super();
    this.org = '';
    this.repo = '';
    this.limit = 50;
    this.contributors = [];
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      org: { type: String },
      repo: { type: String },
      limit: { type: Number, reflect: true },
      contributors: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--github-rpg-contributors-label-font-size, var(--ddd-font-size-s));
      }
      .rpg-wrapper  {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
      
      }
      .contributor {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: var(--ddd-spacing-1, 4px);
        padding: var(--ddd-spacing-2, 8px);
        border: 1px solid var(--ddd-theme-primary);
        border-radius: var(--ddd-border-radius);
        background-color: var(--ddd-theme-accent);
        color: var(--ddd-theme-primary);
      }
      .content {
        margin-top: var(--ddd-spacing-2);
      }
      .content div{
        text-align: center;
        display: block;
        color: var(--ddd-theme-primary);
        text-decoration: none;
      }
      :host:hover {
        text-decoration: underline;
      }
    `];
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if ((changedProperties.has("org") || changedProperties.has("repo") && this.org && this.repo)) {
      this.fetchContributors();
    }
  }

  fetchContributors() {
    const url = `https://api.github.com/repos/${this.org}/${this.repo}/contributors`;
    try {
      fetch(url).then(d => d.ok ? d.json(): {}).then(data => {
        if (data) 
          this.contributors = [...data];
        }
      );
    } catch (error) {
      console.error("error", error);
    }
  }   

  // Lit render the HTML
  render() {
    return html`
  <div class="wrapper">
    <h3>GitHub Repo: <a href="https://github.com/${this.org}/${this.repo}">${this.org}/${this.repo}</a></h3>
    </div>
    <div class="rpg-wrapper">
    ${this.contributors.filter((item, index) => ((index < this.limit) || this.limit === 0)).map(item => html`
    <div class="contributor">
      <a href=https://github.com/${item.login}>
        <rpg-character seed="${item.login}"></rpg-character>
        <div class="content">
          <div>${item.login}</div>
          <div>Commits: ${item.contributions}</div>
        </div>
      </a>
    </div>
  `)}
  </div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GithubRpgContributors.tag, GithubRpgContributors);