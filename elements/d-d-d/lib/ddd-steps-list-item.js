/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `ddd-steps-list-item`
 *
 * @demo index.html
 * @element ddd-steps-list-item
 */
export class DddStepsListItem extends DDDSuper(LitElement) {
  static get tag() {
    return "ddd-steps-list-item";
  }

  constructor() {
    super();
    this.step = 0;
    this.title = "";
    this.horizontal = false;
    this.progress = "";
    this.doneLabel = "";
    // layout and progress come from the list and show as custom states
    // (:state(horizontal), :state(done), :state(current)), so they never
    // become attributes in saved content
    try {
      this.__internals = this.attachInternals();
    } catch {
      this.__internals = null;
    }
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    const internals = this.__internals;
    if (!internals || !internals.states) return;
    try {
      [
        ["horizontal", this.horizontal],
        ["done", this.progress === "done"],
        ["current", this.progress === "current"],
      ].forEach(([state, on]) => {
        if (on) {
          internals.states.add(state);
        } else {
          internals.states.delete(state);
        }
      });
      internals.ariaCurrent = this.progress === "current" ? "step" : null;
    } catch {
      // engines without CustomStateSet keep the vertical list
    }
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      step: { type: Number },
      title: { type: String },
      // set by ddd-steps-list
      horizontal: { type: Boolean },
      progress: { type: String },
      doneLabel: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          /* default primary when no data-primary is set: Beaver blue in light,
             Pugh blue in dark so the line and title stay readable on dark surfaces */
          /* last match wins: that default, theme primary, the palette accent
             (data-palette), a data-primary on the list or on this item */
          --ddd-steps-list-item-primary: var(
            --ddd-steps-list-item-local,
            var(
              --ddd-palette-accent,
              var(
                --ddd-theme-primary,
                light-dark(
                  var(--ddd-theme-default-beaverBlue, #1e407c),
                  var(--ddd-theme-default-pughBlue, #96bee6)
                )
              )
            )
          );
          --ddd-steps-list-item-ink: var(
            --ddd-steps-list-item-local-ink,
            var(
              --ddd-palette-accent-ink,
              var(
                --lowContrast-override,
                var(
                  --ddd-theme-bgContrast,
                  light-dark(
                    var(--ddd-theme-default-white, #ffffff),
                    var(--ddd-theme-default-coalyGray, #262626)
                  )
                )
              )
            )
          );
          --ddd-steps-list-item-title: var(
            --ddd-steps-list-item-local-title,
            var(
              --ddd-palette-accent,
              var(--lowContrast-override, var(--ddd-steps-list-item-primary))
            )
          );
          display: flex;
          border-inline-start: 2px dashed var(--ddd-steps-list-item-primary);
          padding-inline-start: 36px;
        }
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

        .circle {
          width: var(--ddd-icon-sm);
          height: var(--ddd-icon-sm);
          border-radius: 50%;
          background-color: var(--ddd-steps-list-item-primary);
          /* data-primary always sets bgContrast or lowContrast-override; without it
             the number is white on Beaver blue, or coaly gray on Pugh blue in dark */
          color: var(--ddd-steps-list-item-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-inline-start: -56px;
          position: absolute;
          padding: 0px;
        }

        .step-content div ::slotted(p) {
          padding: 0;
          margin: 0;
        }

        .step-content div {
          min-height: 36px;
          padding: 0;
          margin: 0;
        }

        h3 {
          margin: 4px 0 0 0;
          color: var(--ddd-steps-list-item-title);
        }

        :host(:last-of-type) {
          border-inline-start: unset;
        }

        @media (max-width: 768px) {
          :host {
            border-inline-start: unset;
            padding-inline-start: unset;
            display: block;
          }
          .circle {
            position: relative;
            margin-inline-start: unset;
          }
        }

        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* step indicator (horizontal list): a numbered circle above the
           title, joined to the next step by a line; steps before the
           current one are filled and checked */
        :host(:state(horizontal)) {
          --ddd-steps-list-item-line: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateLight)
          );
          display: flex;
          flex-direction: column;
          flex: 1 1 0;
          min-width: 0;
          position: relative;
          gap: var(--ddd-spacing-2);
          border-inline-start: unset;
          padding-inline: 0 var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
        }
        :host(:state(horizontal)) .circle {
          position: relative;
          z-index: 1;
          box-sizing: border-box;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          margin-inline-start: 0;
          border: var(--ddd-border-size-sm) solid
            var(--ddd-steps-list-item-line);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: inherit;
          font-size: var(--ddd-font-size-4xs);
        }
        :host(:state(horizontal))::after {
          content: "";
          position: absolute;
          top: calc(var(--ddd-icon-xs) / 2 - var(--ddd-border-size-sm) / 2);
          inset-inline: var(--ddd-icon-xs) 0;
          height: var(--ddd-border-size-sm);
          background-color: var(--ddd-steps-list-item-line);
        }
        :host(:state(horizontal):last-of-type)::after {
          display: none;
        }
        :host(:state(horizontal):state(current)) .circle {
          border-color: var(--ddd-steps-list-item-primary);
        }
        :host(:state(horizontal):state(done)) .circle {
          border-color: var(--ddd-steps-list-item-primary);
          background-color: var(--ddd-steps-list-item-primary);
          color: var(--ddd-steps-list-item-ink);
        }
        :host(:state(horizontal):state(done))::after {
          background-color: var(--ddd-steps-list-item-primary);
        }
        :host(:state(horizontal)) h3 {
          margin: 0;
          font-size: inherit;
          font-weight: var(--ddd-font-weight-regular);
          line-height: var(--ddd-lh-120, 1.2);
          color: inherit;
          overflow-wrap: anywhere;
        }
        :host(:state(horizontal):state(current)) h3 {
          font-weight: var(--ddd-font-weight-bold);
        }
        /* an indicator shows titles only */
        :host(:state(horizontal)) .step-content div {
          display: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="circle">
        ${
          this.horizontal && this.progress === "done"
            ? html`<span aria-hidden="true">✓</span
                ><span class="sr">${this.step}, ${this.doneLabel}</span>`
            : this.step
        }
      </div>
      <div class="step-content">
        ${this.title ? html`<h3>${this.title}</h3>` : ""}
        <div><slot></slot></div>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(DddStepsListItem.tag, DddStepsListItem);
