/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
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
class FigureLabel extends DDD {
  //styles function
  static get styles() {
    return [
      super.styles,
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
          background-color: var(
            --ddd-component-figure-label-title,
            var(
              --ddd-theme-accent,
              var(
                --simple-colors-default-theme-accent-2,
                var(--ddd-theme-default-limestoneLight)
              )
            )
          );
          color: var(
            --ddd-component-figure-label-title-text,
            var(
              --ddd-theme-primary,
              var(
                --simple-colors-default-theme-accent-11,
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-3);
          font-weight: var(--ddd-font-weight-bold);
        }

        #description {
          display: flex;
          align-items: center;
          font-family: var(--ddd-font-primary);
          border: var(--ddd-border-sm);
          border-color: var(
            --ddd-component-figure-label-title,
            var(
              --ddd-theme-accent,
              var(
                --simple-colors-default-theme-accent-2,
                var(--ddd-theme-default-limestoneLight)
              )
            )
          );
          border-left: none;
          padding: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          background-color: var(
            --ddd-component-figure-label-description-background,
            var(--ddd-theme-default-white)
          );
          color: var(
            --ddd-component-figure-label-description-text,
            var(
              --simple-colors-default-theme-accent-11,
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          font-weight: var(--ddd-font-weight-regular);
        }
      `,
    ];
  }

  // render function
  render() {
    return html`<div id="wrap">
      <div id="title">${this.title}</div>
      <div id="description">${this.description}</div>
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,

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
    return "figure-label";
  }
}
customElements.define(FigureLabel.tag, FigureLabel);

export { FigureLabel };
