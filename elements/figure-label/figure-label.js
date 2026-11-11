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
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-2);
          padding-bottom: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          /* an authored figure-label colour now draws the rule under it */
          border-color: var(
            --ddd-component-figure-label-title,
            var(
              --ddd-theme-accent,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-limestoneGray)
              )
            )
          );
        }
        #title {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          /* an authored colour applies in both schemes; light-dark() only
             supplies the DDD default */
          color: var(
            --ddd-component-figure-label-title-text,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-white)
            )
          );
        }
        :host(:lang(ar)) #title,
        :host(:lang(fa)) #title,
        :host(:lang(he)) #title,
        :host(:lang(ur)) #title {
          letter-spacing: 0;
        }
        #description {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          color: var(
            --ddd-component-figure-label-description-text,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          background-color: var(
            --ddd-component-figure-label-description-background,
            transparent
          );
        }
      `,
    ];
  }

  // render function
  render() {
    return html`<div id="wrap">
      <div id="title" property="oer:name">${this.title}</div>
      <div id="description" property="oer:description">${this.description}</div>
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
        icon: "editor:insert-photo",
        color: "green",
        tags: [
          "Content",
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
            title: "Figure number",
            description: "Number or short label for the figure, e.g. 1.3",
            inputMethod: "textfield",
            required: false,
            icon: "editor:format-list-numbered",
          },
          {
            property: "description",
            title: "Description",
            description: "Short description of the figure",
            inputMethod: "textfield",
            required: false,
            icon: "editor:short-text",
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
globalThis.customElements.define(FigureLabel.tag, FigureLabel);

export { FigureLabel };
