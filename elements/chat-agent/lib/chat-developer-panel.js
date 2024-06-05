/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatDeveloperPanel extends DDD {

  static get tag() {
    return "chat-developer-panel";
  }

  constructor() {
    super();
    this.engine = "alfred";
  }

  static get styles() {
    return[
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
        }

        .chat-developer-panel-wrapper {
          background-color: var(--ddd-theme-default-keystoneYellow);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-sm);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        .console-table {
          display: flex;
          gap: var(--ddd-spacing-1);
          justify-content: space-between;
          align-items: center;
          /* flex-direction: column; */
        }

        .switch-engine-controls {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          gap: var(--ddd-spacing-1);
        }
      `
    ];
  }

  // TODO add option to disable <type-writer>
  render() {
    return html`
      <div class="chat-developer-panel-wrapper">
        <div class="console-table">
          <button id="console-table-user">
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
            </div>
            <div class="button-text">
              console.table() user chat log
            </div> 
          </button>

          <button id="console-table-merlin">
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite> 
            </div>
            <div class="button-text">
              console.table() merlin chat log
            </div>
          </button>

          <button id="console-table-all">
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
            </div>
            <div class="button-text">
              console.table() entire chat log
            </div>
          </button>
        </div>

        <div class="switch-engine-controls">
          <button id="switch-engine-btn">
          <div class="button-icon">
              <simple-icon-lite icon="hardware:memory"></simple-icon-lite>
            </div>
            <div class="button-text" @click=${this.handleSwitchEngineButton}>
              Switch LLM Engine (Current Engine = <em>${this.engine}</em>)
            </div>
          </button>
        </div>
      </div>
    `;
  }

  handleConsoleTableButton(e) {
    switch (e.target.id) {
      case "console-table-user":
        // TODO console.table() user chat log
        console.table();
        break;
      case "console-table-merlin":
        // TODO console.table() merlin chat log
        console.table()
        break;
      case "console-table-all":
        // TODO console.table() entire chat log
        console.table()
        break;
    }
  }

  handleSwitchEngineButton(e) {
    switch (this.engine) {
      case "alfred":
        this.engine = "robin";
        break;
      case "robin":
        this.engine = "alfred";
        break;
    }

    console.info("HAX-DEV-MODE: Engine switched to " + this.engine);

    e.target.innerHTML = `Switch LLM Engine (Current Engine = <em>${this.engine}</em>)`;
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ChatDeveloperPanel.tag, ChatDeveloperPanel);
export { ChatDeveloperPanel };