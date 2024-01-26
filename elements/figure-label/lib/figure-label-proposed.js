/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { DDDSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
/**
  * `figure-label`
  * @element figure-label
  * `Figure label element to mark media assets within content.`
  *
  * @microcopy - language worth noting:
  *  -
  *
 
  * @lit-element
  * @demo demo/index.html
  */
class FigureLabelProposed extends DDDSuper(LitElement) {
  //styles function
  static get styles() {
    return [...super.styles, 
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        #wrap {
          display: flex;
          margin-bottom: var(--ddd-spacing-4);
        }

        #title {
          display: flex;
          align-items: center;
          font-family: var(--ddd-font-primary);
          background-color: var(--ddd-component-figure-label-title, var(--ddd-app-accent-color , var(--ddd-theme-polaris-limestoneLight)));
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-3);
          font-weight: var(--ddd-font-primary-bold);
        }

        #description {
          font-family: var(--ddd-font-primary);
          border-color: var(--ddd-component-figure-label-border, var(--ddd-app-accent-color , var(--ddd-theme-polaris-limestoneLight)));
          padding: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="wrap">
      <div id="title">${this.title}</div>
      <div id="description" class="b-sm bl-0">${this.description}</div>
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Figure label",
        description:
          "Figure label element to mark media assets within content.",
        icon: "icons:android",
        color: "green",
        tags: [
          "content",
          "figure",
          "a11y",
          "accessibility",
          "image",
          "caption",
          "description",
        ],
        meta: {
          author: "HAXTheWeb core team",
          owner: "PSU",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
          {
            property: "description",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      title: {
        type: String,
      },
      description: {
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "figure-label-proposed";
  }
}
customElements.define(FigureLabelProposed.tag, FigureLabelProposed);

export { FigureLabelProposed };
