/**
 * Copyright 2025 The Pennsylvania State University
 * Copyright 2025 luckyshearer
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./ddd-steps-list-item.js";

/**
 * `ddd-steps-list`
 *
 * @demo index.html
 * @element ddd-steps-list
 */
export class DddStepsList extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "ddd-steps-list";
  }

  constructor() {
    super();
    this.horizontal = false;
    this.current = 0;
    this.t = {
      completed: "completed",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      dddPrimary: { type: String, attribute: "ddd-primary" },
      // a compact row of step titles that shows progress ("step 2 of 4")
      horizontal: { type: Boolean, reflect: true },
      // the step the reader is on, counting from 1; earlier steps are done
      current: { type: Number, reflect: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }
        /* a primary picked on the list is a local choice: its items use it
           instead of the palette */
        :host([data-primary]) {
          --ddd-steps-list-item-local: var(--ddd-theme-primary);
          --ddd-steps-list-item-local-ink: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, var(--ddd-theme-default-white))
          );
          --ddd-steps-list-item-local-title: var(
            --lowContrast-override,
            var(--ddd-theme-primary)
          );
        }

        .steps-container {
          position: relative;
          padding-inline-start: calc(var(--ddd-icon-lg) + var(--ddd-spacing-4));
        }

        /* step indicator: titles in a row, joined by a progress line */
        :host([horizontal]) .steps-container {
          display: flex;
          padding-inline-start: 0;
        }

        @media (max-width: 768px) {
          :host {
            padding: 0px;
          }
          .steps-container {
            padding-inline-start: 0px;
          }
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.updateNumbers();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("horizontal") ||
      changedProperties.has("current") ||
      changedProperties.has("t")
    ) {
      this.updateNumbers();
    }
  }

  updateNumbers() {
    const children = Array.from(this.children);
    const current = Number(this.current) || 0;
    let step = 0;
    children.forEach((child) => {
      const tag = child.tagName.toLowerCase();
      if (tag === "ddd-steps-list-item") {
        step++;
        child.step = step;
        // layout and progress are passed as properties, never as attributes,
        // so nothing is added to the saved content
        child.horizontal = Boolean(this.horizontal);
        child.progress =
          this.horizontal && current > 0
            ? step < current
              ? "done"
              : step === current
                ? "current"
                : ""
            : "";
        child.doneLabel = this.t.completed;
      }
    });
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="steps-container">
        <slot @slotchange="${this.updateNumbers}"></slot>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(DddStepsList.tag, DddStepsList);
