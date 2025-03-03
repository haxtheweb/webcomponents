/**
 * Copyright 2024 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { WebContainer } from "@webcontainer/api";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
/**
 * `web-container`
 * 
 * @demo index.html
 * @element web-container
 */
export class WebContainerEl extends DDDSuper(LitElement) {

  static get tag() {
    return "web-container";
  }

  constructor() {
    super();
    this.filesShown = [];
    this.status = "Loading";
    this.fname = null;
    this.hideEditor = false;
    this.hideTerminal = false;
    this.hideWindow = false;
    this.webcontainerInstance = null;
    this.files ={
      'index.js': {
        file: {
          contents: ` `,
        },
      },
      'package.json': {
        file: {
          contents: `
            {
              "name": "hax-webcontainer",
              "type": "module",
              "dependencies": {
              }
            }`,
        },
      },
    };
    this.commands = [];
  }

  async installDependencies() {
    // Install dependencies
    const installProcess = await this.webcontainerInstance.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      }),
    );
    // Wait for install command to exit
    return installProcess.exit;
  }

  async startDevServer() {
    // Run `npm run start` to start the Express app
    await this.webcontainerInstance.spawn("npm", ["run", "start"]);
  }

  async startShell(terminal) {
    const shellProcess = await this.webcontainerInstance.spawn("jsh", {
      terminal: {
        cols: terminal.cols,
        rows: terminal.rows,
      },
    });
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      }),
    );

    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
      input.write(data);
    });

    return shellProcess;
  }

  /** @param {string} content*/
  async writeFile(filename, content) {
    // forces it to be at root of the active directory in the container
    await this.webcontainerInstance.fs.writeFile(`/${filename}`, content);
  }

  async readFile(filename) {
    return await this.webcontainerInstance.fs.readFile(`/${filename}`, 'utf-8');
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      fname: { type: String, reflect: true },
      status: { type: String, reflect: true },
      files: { type: Object },
      filesShown: { type: Array },
      hideTerminal: { type: Boolean, reflect: true, attribute: 'hide-terminal' },
      hideEditor: { type: Boolean, reflect: true, attribute: 'hide-editor' },
      hideWindow: { type: Boolean, reflect: true, attribute: 'hide-window' },
    };
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (this.querySelector('template')) {
      let commands = this.querySelector('template').content.textContent.trim().split('\n');
      if (commands.length > 0) {
        for (let i=0; i<commands.length; i++) {
          commands[i] = commands[i].trim();
          this.commands.push(commands[i].split(' '));
        }
      }
    }
    if (!this.hideEditor) {
      import("@haxtheweb/code-editor/code-editor.js").then((e) => {
        setTimeout(() => {
          
          if (this.files['index.js']) {
            this.fname = 'index.js';
          }
          else if (this.files['index.html']) {
            this.fname = 'index.html';
          }
          if (this.fname) {
            this.setCodeEditor(this.files[this.fname].file.contents, this.getLanguageFromFileEnding(this.fname));
          }
        }, 100);
      });
    }
    this.setupWebContainers();
  }

  getLanguageFromFileEnding(filename) {
    if (filename.endsWith('.js')) {
      return 'javascript';
    }
    else if (filename.endsWith('.json')) {
      return 'json';
    }
    else if (filename.endsWith('.html')) {
      return 'html';
    }
    else if (filename.endsWith('.yaml')) {
      return 'yaml';
    }
    return 'javascript';
  }

  setCodeEditor(content, language = 'javascript') {
    if (this.shadowRoot && this.shadowRoot.querySelector('code-editor')) {
      if (language === 'html') {
        // hack that allows full HTML doc editing to still function if passed a full file
        this.shadowRoot.querySelector('code-editor').innerHTML = `<template><iframe>${content}</iframe></template>`;
      }
      else {
        // ensures it does not get processed by the larger DOM
        this.shadowRoot.querySelector('code-editor').innerHTML = `<template>${content}</template>`;
      }
      this.shadowRoot.querySelector('code-editor').language = language;
    }
  }

  async setupWebContainers() {
    const fitAddon = new FitAddon();
    const terminal = new Terminal({
      convertEol: true,
    });
    terminal.loadAddon(fitAddon);
    terminal.open(this.shadowRoot.querySelector('.terminal'));
  
    fitAddon.fit();
    // Call only once
    this.status = "Setting up container";
    this.webcontainerInstance = await globalThis.WebContainerManager.requestAvailability();
    await this.webcontainerInstance.mount(this.files);
    const shellProcess = await this.startShell(terminal);
    if (this.commands.length > 0) {
      this.status = "Running commands";
      await this.runCommands(this.commands);
    }
    else {
      this.status = "Installing..";
      this.dispatchEvent(new CustomEvent('web-container-dependencies-installing', { bubbles: true, compose: true, cancelable: false, detail: true }))
      await this.installDependencies();
      this.dispatchEvent(new CustomEvent('web-container-dependencies-installed', { bubbles: true, compose: true, cancelable: false, detail: true }))
      this.status = "Running Start..";
      await this.startDevServer();
      this.dispatchEvent(new CustomEvent('web-container-npm-start', { bubbles: true, compose: true, cancelable: false, detail: true }))
    }
    // Wait for `server-ready` event
    this.webcontainerInstance.on("server-ready", (port, url) => {
      this.dispatchEvent(new CustomEvent('web-container-server-ready', { bubbles: true, compose: true, cancelable: false, detail: {
        port: port,
        url: url
      } }))
      // incase hiding preview
      if (this.shadowRoot.querySelector('iframe')) {
        this.shadowRoot.querySelector('iframe').src = url;
      }
      // this makes message hide in the end as we don't have a status that needs to be constantly shown
      this.status = "";
    });
  
    globalThis.addEventListener("resize", () => {
      fitAddon.fit();
      shellProcess.resize({
        cols: terminal.cols,
        rows: terminal.rows,
      });
    });
  }

  async runCommands(commands) {
    var commandProcess;
    for (let i=0; i<commands.length; i++) {
      this.dispatchEvent(new CustomEvent('web-container-command-start', { bubbles: true, compose: true, cancelable: false, detail: {
        command: commands[i],
      } }));
      // support command vs command + arguments
      if (Array.isArray(commands[i])) {
        const tmp = Object.assign([], commands[i]);
        let command = (tmp.length <= 1) ? tmp[0] : tmp.shift();
        this.status = `Running command (${i}/${commands.length}): ${command}`;
        commandProcess = await this.webcontainerInstance.spawn(command, tmp);
        commandProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          }),
        );

      }
      else {
        this.status = `Running command (${i}/${commands.length}): ${commands[i]}`;
        commandProcess = await this.webcontainerInstance.spawn(commands[i]);  
        commandProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          }),
        );
      }
      this.dispatchEvent(new CustomEvent('web-container-command-finished', { bubbles: true, compose: true, cancelable: false, detail: {
        command: commands[i]
      } }));
    }
    // Wait for install command to exit
    return commandProcess.exit;
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
      :host([hide-terminal]) .terminal {
        display: none;
      }
      :host([hide-editor]) .editor {
        display: none;
      }
      :host([hide-window]) iframe {
        display: none;
      }

      :host([hide-editor]) .container,
      :host([hide-window]) .container {
        display: block;
      }
      
      .status {
        background-color: var(--web-container-status-bg-color, var(--ddd-theme-default-infoLight, lightblue));
        color: var(--web-container-status-color, var(--ddd-theme-default-info, navy));
        font-size: var(--ddd-font-size-xxs);
        font-family: var(--ddd-font-navigation);
        padding: 4px 8px;
      }
      iframe {
        width: 100%;
        height: var(--web-container-iframe-height, 500px);
        border: none;
        background-color: transparent;
      }

      .terminal {
        padding: 0;
        margin: 0;
        height: var(--web-container-terminal-height, 200px);
        overflow: hidden;
      }
      .container {
        display: grid; 
        grid-template-columns: auto auto; 
        grid-template-rows: auto auto; 
        gap: 0px 0px; 
        grid-template-areas: 
          "editor preview"
          "terminal terminal"; 
      }
      .editor {
        grid-area: editor;
        height: 100%;
        display: contents;
      }
      code-editor {
        margin: 0;
      }
      .editor {
        display: grid; 
        gap: 0px 0px; 
        grid-template-areas: 
          "files"
          "codeeditor"; 
        grid-area: editor; 
      }
      .files {
        grid-area: files;
        width: 100%;
      }
      .files button {
        opacity: .9;
        background-color: #333333;
        color: white;
        font-size: var(--ddd-font-size-4xs);
        padding: 4px 16px;
      }
      .files button:hover,
      .files button:focus {
        opacity: 1;
      }
      .files button[active] {
        opacity: 1;
        background-color: black;
        border-color: var(--ddd-primary-1);
      }
      code-editor {
        grid-area: codeeditor;
        height: var(--web-container-iframe-height, 500px);
      }
      .terminal {
        grid-area: terminal;
        max-height: 200px;
      }
      .preview {
        grid-area: preview;
        height: 100%;
        display: grid; 
        grid-template-columns:auto; 
        grid-template-rows: auto; 
        gap: 0px 0px; 
        grid-template-areas: 
          "status"
          "iframe"; 
        grid-area: preview; 
      }
      .iframe { grid-area: iframe; }
      .status { grid-area: status; }
      /**
      * Copyright (c) 2014 The xterm.js authors. All rights reserved.
      * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
      * https://github.com/chjj/term.js
      * @license MIT
      *
      * Permission is hereby granted, free of charge, to any person obtaining a copy
      * of this software and associated documentation files (the "Software"), to deal
      * in the Software without restriction, including without limitation the rights
      * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      * copies of the Software, and to permit persons to whom the Software is
      * furnished to do so, subject to the following conditions:
      *
      * The above copyright notice and this permission notice shall be included in
      * all copies or substantial portions of the Software.
      *
      * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
      * THE SOFTWARE.
      *
      * Originally forked from (with the author's permission):
      *   Fabrice Bellard's javascript vt100 for jslinux:
      *   http://bellard.org/jslinux/
      *   Copyright (c) 2011 Fabrice Bellard
      *   The original design remains. The terminal itself
      *   has been extended to include xterm CSI codes, among
      *   other features.
      */

      /**
      *  Default styles for xterm.js
      */

      .xterm {
          cursor: text;
          position: relative;
          user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
      }

      .xterm.focus,
      .xterm:focus {
          outline: none;
      }

      .xterm .xterm-helpers {
          position: absolute;
          top: 0;
          /**
          * The z-index of the helpers must be higher than the canvases in order for
          * IMEs to appear on top.
          */
          z-index: 5;
      }

      .xterm .xterm-helper-textarea {
          padding: 0;
          border: 0;
          margin: 0;
          /* Move textarea out of the screen to the far left, so that the cursor is not visible */
          position: absolute;
          opacity: 0;
          left: -9999em;
          top: 0;
          width: 0;
          height: 0;
          z-index: -5;
          /** Prevent wrapping so the IME appears against the textarea at the correct position */
          white-space: nowrap;
          overflow: hidden;
          resize: none;
      }

      .xterm .composition-view {
          /* TODO: Composition position got messed up somewhere */
          background: #000;
          color: #FFF;
          display: none;
          position: absolute;
          white-space: nowrap;
          z-index: 1;
      }

      .xterm .composition-view.active {
          display: block;
      }

      .xterm .xterm-viewport {
          /* On OS X this is required in order for the scroll bar to appear fully opaque */
          background-color: #000;
          overflow-y: scroll;
          cursor: default;
          position: absolute;
          right: 0;
          left: 0;
          top: 0;
          bottom: 0;
      }

      .xterm .xterm-screen {
          position: relative;
      }

      .xterm .xterm-screen canvas {
          position: absolute;
          left: 0;
          top: 0;
      }

      .xterm .xterm-scroll-area {
          visibility: hidden;
      }

      .xterm-char-measure-element {
          display: inline-block;
          visibility: hidden;
          position: absolute;
          top: 0;
          left: -9999em;
          line-height: normal;
      }

      .xterm.enable-mouse-events {
          /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
          cursor: default;
      }

      .xterm.xterm-cursor-pointer,
      .xterm .xterm-cursor-pointer {
          cursor: pointer;
      }

      .xterm.column-select.focus {
          /* Column selection mode */
          cursor: crosshair;
      }

      .xterm .xterm-accessibility:not(.debug),
      .xterm .xterm-message {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 10;
          color: transparent;
          pointer-events: none;
      }

      .xterm .xterm-accessibility-tree:not(.debug) *::selection {
        color: transparent;
      }

      .xterm .xterm-accessibility-tree {
        user-select: text;
        white-space: pre;
      }

      .xterm .live-region {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
      }

      .xterm-dim {
          /* Dim should not apply to background, so the opacity of the foreground color is applied
          * explicitly in the generated class and reset to 1 here */
          opacity: 1 !important;
      }

      .xterm-underline-1 { text-decoration: underline; }
      .xterm-underline-2 { text-decoration: double underline; }
      .xterm-underline-3 { text-decoration: wavy underline; }
      .xterm-underline-4 { text-decoration: dotted underline; }
      .xterm-underline-5 { text-decoration: dashed underline; }

      .xterm-overline {
          text-decoration: overline;
      }

      .xterm-overline.xterm-underline-1 { text-decoration: overline underline; }
      .xterm-overline.xterm-underline-2 { text-decoration: overline double underline; }
      .xterm-overline.xterm-underline-3 { text-decoration: overline wavy underline; }
      .xterm-overline.xterm-underline-4 { text-decoration: overline dotted underline; }
      .xterm-overline.xterm-underline-5 { text-decoration: overline dashed underline; }

      .xterm-strikethrough {
          text-decoration: line-through;
      }

      .xterm-screen .xterm-decoration-container .xterm-decoration {
        z-index: 6;
        position: absolute;
      }

      .xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer {
        z-index: 7;
      }

      .xterm-decoration-overview-ruler {
          z-index: 8;
          position: absolute;
          top: 0;
          right: 0;
          pointer-events: none;
      }

      .xterm-decoration-top {
          z-index: 2;
          position: relative;
      }
    `];
  }

  editorValueChanged(e) {
    this.writeFile(this.fname, e.detail.value);
  }

  async updateFile(e) {
    this.fname = e.target.getAttribute('data-fname');
    let code = await this.readFile(this.fname);
    this.setCodeEditor(code, this.getLanguageFromFileEnding(this.fname));
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="container" part="container">
      ${!this.hideEditor ? html`
        <div class="editor" part="editor">
          <div class="files" part="files">
            ${this.filesShown.map(file => html`<button @click="${this.updateFile}" data-fname="${file.file}" ?active="${file.file === this.fname}">${file.label}</button>`)}
          </div>
          <code-editor part="code-editor" @value-changed="${this.editorValueChanged}"></code-editor>
        </div>` : ``}
      <div class="preview" part="preview">
        ${!this.hideWindow ? html`<div class="status" part="status">${this.status}</div><iframe part="iframe" src="${new URL('./lib/loading.html', import.meta.url).href}"></iframe>`: ``}
      </div>
    </div>
    <div class="terminal" part="terminal"></div>`;
  }

  refreshIframe() {
    const iframe = this.shadowRoot.querySelector('iframe');
    iframe.src = iframe.src;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(WebContainerEl.tag, WebContainerEl);

// register globally so we can make sure there is only one
globalThis.WebContainerManager = globalThis.WebContainerManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.WebContainerManager.requestAvailability = async() => {
  if (!globalThis.WebContainerManager.instance && globalThis.document) {
    globalThis.WebContainerManager.instance = await WebContainer.boot();
  }
  return globalThis.WebContainerManager.instance;
};