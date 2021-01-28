/* eslint no-undef: 0 */
import Prism from "prism-es6/prism.js";
import Marked from "marked/lib/marked.esm.js";

self.Prism = Prism;

export class WCMarkdown extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  get src() {
    return this.getAttribute("src");
  }
  set src(value) {
    this.setAttribute("src", value);
    this.setSrc(value);
  }

  get value() {
    return this.__value;
  }
  set value(value) {
    this.__value = value;
    this.setValue();
  }

  constructor() {
    super();
    this.__value = "";
  }

  async connectedCallback() {
    this.style.display = "block";

    const scriptTag = this.getElementsByTagName("script")[0];

    if (scriptTag) {
      if (scriptTag.getAttribute("type") === "wc-content") {
        let content = WCMarkdown.dedentText(scriptTag.innerHTML);
        content = content.replace(/&lt;(\/?script)(.*?)&gt;/g, "<$1$2>");
        this.value = content;
      }
    } else {
      if (this.textContent) {
        this.__value = this.textContent;
        this.setValue();
      }
    }
  }

  async setSrc(src) {
    this.__value = await this.fetchSrc(src);
    this.setValue();
  }

  async fetchSrc(src) {
    const response = await fetch(src);
    return response.text();
  }

  setValue() {
    let contents = this.__value;
    contents = WCMarkdown.prepare(contents);
    contents = WCMarkdown.toHtml(contents);
    this.innerHTML = contents;

    if (this.hasAttribute("highlight")) {
      WCMarkdown.highlight(this);
    }
  }

  static prepare(markdown) {
    return markdown
      .split("\n")
      .map((line) => {
        line = line.replace("&lt;", "<");
        return line.replace("&gt;", ">");
      })
      .join("\n");
  }

  static toHtml(markdown) {
    return Marked(markdown);
  }

  static highlight(element) {
    Prism.highlightAllUnder(element);
  }

  /**
   * De-dents the code by getting the padding from the first line,
   * then removes the same indent amount padding from the rest of the lines
   *
   * @param {string} text - the text to dedent
   * @returns {string} the dedented text
   */
  static dedentText(text) {
    const lines = text.split("\n");

    // remove the first line if it is an empty line
    if (lines[0] === "") lines.splice(0, 1);

    const initline = lines[0];
    let fwdPad = 0;
    const usingTabs = initline[0] === "\t";
    const checkChar = usingTabs ? "\t" : " ";

    while (true) {
      if (initline[fwdPad] === checkChar) {
        fwdPad += 1;
      } else {
        break;
      }
    }

    const fixedLines = [];

    for (const line of lines) {
      let fixedLine = line;
      for (let i = 0; i < fwdPad; i++) {
        if (fixedLine[0] === checkChar) {
          fixedLine = fixedLine.substring(1);
        } else {
          break;
        }
      }
      fixedLines.push(fixedLine);
    }

    if (fixedLines[fixedLines.length - 1] === "")
      fixedLines.splice(fixedLines.length - 1, 1);

    return fixedLines.join("\n");
  }
}

customElements.define("wc-markdown", WCMarkdown);
