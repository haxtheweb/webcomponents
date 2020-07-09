/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `service-card`
 * `simple showcase of services provided`
 * @demo demo/index.html
 * @element service-card
 */
class ServiceCard extends LitElement {
  static get tag() {
    return "service-card";
  }

  static get properties() {
    return {
      source: { type: String },
      title: { type: String },
      alt: { type: String }
    };
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Service card",
        description: "Simple presentation of services or info",
        icon: "icons:credit-card",
        color: "orange",
        groups: ["Card"],
        handles: [],
        meta: {
          author: "McGarvelcuddy",
          owner: "elmsln"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "source",
            title: "Source",
            inputMethod: "haxupload",
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Alternative text for non-sighted users",
            inputMethod: "alt"
          },
          {
            property: "title",
            title: "Title",
            description: "Service title / name",
            inputMethod: "textfield"
          },
          {
            slot: "",
            title: "Decription",
            description: "Details of the service",
            inputMethod: "code-editor"
          },
        ],
        advanced: []
      }
    };
  }

  constructor() {
    super();
    this.alt = "";
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        margin: 16px;
      }
      .card {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s all ease-in-out;
        width: var(--service-card-card-width, 300px);
      }
      .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
      }
      .container {
        padding: 2px 2px 2px 2px;
      }
      .avatar {
        border-radius: 50%;
        width: calc(var(--service-card-card-width, 300px) - 10px);
        padding: 5px;
      }
      .title {
        padding: 4px 4px 4px 4px;
        text-align: center;
        font-family: "Courier New", courier, sans-serif;
      }
      .info {
        padding: 4px 4px 4px 4px;
        height: 125px;
        overflow-y: auto;
      }
    `;
  }

  render() {
    return html`
      <div class="card">
        <div class="container">
          <img
            loading="lazy"
            class="avatar"
            src="${this.source}"
            alt="${this.alt}"
          />
          <h3 class="title"><b>${this.title}</b></h3>
          <p class="info"><slot></slot></p>
        </div>
      </div>
    `;
  }
}

customElements.define(ServiceCard.tag, ServiceCard);
export { ServiceCard };
