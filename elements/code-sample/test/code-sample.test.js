import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";

import "../code-sample.js";

// Basic functionality and accessibility tests
describe("code-sample basic functionality", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <code-sample type="javascript">
        <template preserve-content="preserve-content">
const hello = "world";
console.log(hello);
        </template>
      </code-sample>
    `);
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("CODE-SAMPLE");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    
    expect(el.editMode).to.be.false;
    expect(el._haxstate).to.be.false;
    expect(el.copyClipboardButton).to.be.false;
    expect(el.type).to.equal("html");
    expect(el.highlightStart).to.be.null;
    expect(el.highlightEnd).to.be.null;
    expect(el.theme).to.exist;
  });

  it("renders required DOM elements", () => {
    const codeContainer = element.shadowRoot.querySelector('#code-container');
    const codeElement = element.shadowRoot.querySelector('#code');
    const demoElement = element.shadowRoot.querySelector('#demo');
    const themeElement = element.shadowRoot.querySelector('#theme');
    
    expect(codeContainer).to.exist;
    expect(codeElement).to.exist;
    expect(demoElement).to.exist;
    expect(themeElement).to.exist;
  });
});

// Comprehensive A11y tests
describe("code-sample accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const test = "example";
        </template>
      </code-sample>
    `);
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with copy button enabled", async () => {
    const el = await fixture(html`
      <code-sample copy-clipboard-button>
        <template preserve-content="preserve-content">
          function example() {
            return "Hello World";
          }
        </template>
      </code-sample>
    `);
    
    await expect(el).to.be.accessible();
  });

  it("has proper semantic structure for code", async () => {
    const el = await fixture(html`
      <code-sample type="javascript">
        <template preserve-content="preserve-content">
          const example = true;
        </template>
      </code-sample>
    `);
    
    const pre = el.shadowRoot.querySelector('pre');
    const code = el.shadowRoot.querySelector('code');
    
    expect(pre).to.exist;
    expect(code).to.exist;
    expect(code.tagName).to.equal('CODE');
  });

  it("copy button has proper accessibility attributes", async () => {
    const el = await fixture(html`
      <code-sample copy-clipboard-button>
        <template preserve-content="preserve-content">
          const example = "test";
        </template>
      </code-sample>
    `);
    
    const copyButton = el.shadowRoot.querySelector('#copyButton');
    expect(copyButton).to.exist;
    expect(copyButton.getAttribute('title')).to.exist;
    expect(copyButton.getAttribute('type')).to.equal('button');
  });

  it("maintains accessibility with line highlighting", async () => {
    const el = await fixture(html`
      <code-sample highlight-start="1" highlight-end="2">
        <template preserve-content="preserve-content">
const line1 = "first";
const line2 = "second";
const line3 = "third";
        </template>
      </code-sample>
    `);
    
    await expect(el).to.be.accessible();
  });
});

// Property validation tests
describe("code-sample property validation", () => {
  it("accepts valid boolean properties", async () => {
    const el = await fixture(html`
      <code-sample
        edit-mode
        copy-clipboard-button
      >
        <template preserve-content="preserve-content">
          const test = true;
        </template>
      </code-sample>
    `);
    
    expect(el.editMode).to.be.true;
    expect(el.copyClipboardButton).to.be.true;
  });

  it("accepts valid type values", async () => {
    const types = ['javascript', 'html', 'css', 'xml', 'json', 'yaml', 'php'];
    
    for (const type of types) {
      const el = await fixture(html`
        <code-sample type="${type}">
          <template preserve-content="preserve-content">
            example code
          </template>
        </code-sample>
      `);
      
      expect(el.type).to.equal(type);
      expect(typeof el.type).to.equal('string');
    }
  });

  it("accepts valid highlight range properties", async () => {
    const el = await fixture(html`
      <code-sample highlight-start="2" highlight-end="4">
        <template preserve-content="preserve-content">
line 1
line 2
line 3
line 4
line 5
        </template>
      </code-sample>
    `);
    
    expect(el.highlightStart).to.equal(2);
    expect(el.highlightEnd).to.equal(4);
    expect(typeof el.highlightStart).to.equal('number');
    expect(typeof el.highlightEnd).to.equal('number');
  });

  it("updates properties reactively", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const example = "test";
        </template>
      </code-sample>
    `);
    
    el.type = 'javascript';
    el.copyClipboardButton = true;
    el.highlightStart = 1;
    el.highlightEnd = 2;
    
    await el.updateComplete;
    
    expect(el.type).to.equal('javascript');
    expect(el.copyClipboardButton).to.be.true;
    expect(el.highlightStart).to.equal(1);
    expect(el.highlightEnd).to.equal(2);
  });

  it("validates theme object property", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    
    expect(el.theme).to.exist;
    expect(typeof el.theme).to.equal('object');
  });
});

// Template content and code highlighting tests
describe("code-sample template usage and highlighting", () => {
  it("processes template content correctly", async () => {
    const el = await fixture(html`
      <code-sample type="javascript">
        <template preserve-content="preserve-content">
const message = "Hello, World!";
console.log(message);
        </template>
      </code-sample>
    `);
    
    const template = el.querySelector('template');
    expect(template).to.exist;
    expect(template.innerHTML).to.include('Hello, World!');
  });

  it("handles different programming languages", async () => {
    const languages = [
      { type: 'javascript', code: 'const test = () => true;' },
      { type: 'html', code: '<div class="test">Hello</div>' },
      { type: 'css', code: '.test { color: red; }' },
      { type: 'json', code: '{"key": "value"}' },
      { type: 'xml', code: '<root><child>content</child></root>' }
    ];
    
    for (const lang of languages) {
      const el = await fixture(html`
        <code-sample type="${lang.type}">
          <template preserve-content="preserve-content">
${lang.code}
          </template>
        </code-sample>
      `);
      
      expect(el.type).to.equal(lang.type);
      const template = el.querySelector('template');
      expect(template.innerHTML).to.include(lang.code);
    }
  });

  it("handles complex multi-line code", async () => {
    const complexCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result);`;
    
    const el = await fixture(html`
      <code-sample type="javascript">
        <template preserve-content="preserve-content">
${complexCode}
        </template>
      </code-sample>
    `);
    
    const template = el.querySelector('template');
    expect(template.innerHTML).to.include('fibonacci');
    expect(template.innerHTML).to.include('console.log');
  });

  it("preserves special characters in code", async () => {
    const codeWithSpecialChars = `const html = "<div class='test'>Hello & welcome!</div>";
const regex = /\d+/g;`;
    
    const el = await fixture(html`
      <code-sample type="javascript">
        <template preserve-content="preserve-content">
${codeWithSpecialChars}
        </template>
      </code-sample>
    `);
    
    const template = el.querySelector('template');
    expect(template.innerHTML).to.include('&');
    expect(template.innerHTML).to.include('class=');
  });

  it("handles empty template gracefully", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content"></template>
      </code-sample>
    `);
    
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });
});

// Copy to clipboard functionality tests
describe("code-sample copy functionality", () => {
  it("shows copy button when enabled", async () => {
    const el = await fixture(html`
      <code-sample copy-clipboard-button>
        <template preserve-content="preserve-content">
          const test = "copy me";
        </template>
      </code-sample>
    `);
    
    const copyButton = el.shadowRoot.querySelector('#copyButton');
    expect(copyButton).to.exist;
    expect(copyButton.hasAttribute('hidden')).to.be.false;
  });

  it("hides copy button when disabled", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const test = "no copy";
        </template>
      </code-sample>
    `);
    
    const copyButton = el.shadowRoot.querySelector('#copyButton');
    expect(copyButton).to.exist;
    expect(copyButton.hasAttribute('hidden')).to.be.true;
  });

  it("copy button has correct text content", async () => {
    const el = await fixture(html`
      <code-sample copy-clipboard-button>
        <template preserve-content="preserve-content">
          const test = "copy";
        </template>
      </code-sample>
    `);
    
    const copyButton = el.shadowRoot.querySelector('#copyButton');
    expect(copyButton.textContent.trim()).to.equal('Copy');
  });

  it("has working _textAreaWithClonedContent method", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const test = "clone me";
        </template>
      </code-sample>
    `);
    
    const textarea = el._textAreaWithClonedContent();
    expect(textarea).to.exist;
    expect(textarea.tagName).to.equal('TEXTAREA');
    expect(textarea.value).to.include('clone me');
    textarea.remove(); // Clean up
  });
});

// Line highlighting functionality tests
describe("code-sample line highlighting", () => {
  it("applies highlighting to specified line range", async () => {
    const el = await fixture(html`
      <code-sample highlight-start="2" highlight-end="3">
        <template preserve-content="preserve-content">
line 1
line 2
line 3
line 4
        </template>
      </code-sample>
    `);
    
    // Wait for highlighting to be applied
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(el.highlightStart).to.equal(2);
    expect(el.highlightEnd).to.equal(3);
  });

  it("handles single line highlighting", async () => {
    const el = await fixture(html`
      <code-sample highlight-start="1" highlight-end="1">
        <template preserve-content="preserve-content">
const singleLine = true;
        </template>
      </code-sample>
    `);
    
    expect(el.highlightStart).to.equal(1);
    expect(el.highlightEnd).to.equal(1);
  });

  it("has working highlightLines method", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
line 1
line 2
line 3
        </template>
      </code-sample>
    `);
    
    expect(typeof el.highlightLines).to.equal('function');
    
    // Method should execute without errors
    el.highlightLines(1, 2);
  });
});

// HAX integration tests
describe("code-sample HAX integration", () => {
  it("has proper haxProperties configuration", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    const haxProps = el.constructor.haxProperties;
    
    expect(haxProps).to.exist;
    expect(haxProps.type).to.equal('element');
    expect(haxProps.canScale).to.be.false;
    expect(haxProps.canEditSource).to.be.false;
    expect(haxProps.gizmo.title).to.equal('Code sample');
    expect(haxProps.gizmo.icon).to.equal('icons:code');
  });

  it("has proper settings configuration", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    const haxProps = el.constructor.haxProperties;
    const settings = haxProps.settings.configure;
    
    expect(settings).to.be.an('array');
    expect(settings.length).to.be.greaterThan(0);
    
    const typeConfig = settings.find(s => s.property === 'type');
    expect(typeConfig).to.exist;
    expect(typeConfig.inputMethod).to.equal('select');
    expect(typeConfig.options).to.have.property('javascript');
  });

  it("has demo schema configuration", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    const haxProps = el.constructor.haxProperties;
    const demoSchema = haxProps.demoSchema;
    
    expect(demoSchema).to.be.an('array');
    expect(demoSchema.length).to.be.greaterThan(0);
    
    const demo = demoSchema[0];
    expect(demo.tag).to.equal('code-sample');
    expect(demo.content).to.include('template');
    expect(demo.properties.type).to.equal('javascript');
  });

  it("implements haxHooks correctly", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    const hooks = el.haxHooks();
    
    expect(hooks).to.have.property('gizmoRegistration');
    expect(hooks).to.have.property('inlineContextMenu');
    expect(hooks).to.have.property('activeElementChanged');
    expect(hooks).to.have.property('editModeChanged');
  });

  it("provides example code for different languages", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    
    const jsExample = el.getExample('javascript');
    const htmlExample = el.getExample('html');
    const cssExample = el.getExample('css');
    
    expect(jsExample).to.include('const');
    expect(htmlExample).to.include('<');
    expect(cssExample).to.include('{');
  });
});

// Responsive design tests
describe("code-sample responsive design", () => {
  beforeEach(async () => {
    await setViewport({width: 375, height: 750});
  });

  afterEach(async () => {
    await setViewport({width: 1024, height: 768});
  });

  it("adapts to mobile viewport", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const mobile = true;
        </template>
      </code-sample>
    `);
    
    expect(el).to.exist;
    await el.updateComplete;
    
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal('block');
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`
      <code-sample copy-clipboard-button>
        <template preserve-content="preserve-content">
          const mobile = "accessible";
        </template>
      </code-sample>
    `);
    
    await expect(el).to.be.accessible();
  });
});

describe("code-sample desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({width: 1200, height: 800});
  });

  afterEach(async () => {
    await setViewport({width: 1024, height: 768});
  });

  it("adapts to desktop viewport", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const desktop = true;
        </template>
      </code-sample>
    `);
    
    expect(el).to.exist;
    await el.updateComplete;
    
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal('block');
  });
});

// Error handling and edge cases
describe("code-sample error handling", () => {
  it("handles missing template gracefully", async () => {
    const el = await fixture(html`<code-sample></code-sample>`);
    
    expect(el).to.exist;
    // Element should auto-generate a template if none exists
    expect(el.innerHTML).to.include('template');
  });

  it("handles invalid type gracefully", async () => {
    const el = await fixture(html`
      <code-sample type="invalid-language">
        <template preserve-content="preserve-content">
          some code
        </template>
      </code-sample>
    `);
    
    expect(el.type).to.equal('invalid-language');
    expect(el).to.exist;
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const test = "changes";
        </template>
      </code-sample>
    `);
    
    // Rapidly change properties
    for(let i = 0; i < 10; i++) {
      el.type = i % 2 === 0 ? 'javascript' : 'html';
      el.copyClipboardButton = i % 2 === 0;
      el.highlightStart = i + 1;
    }
    
    await el.updateComplete;
    expect(el.type).to.equal('javascript');
    expect(el.copyClipboardButton).to.be.false;
    expect(el.highlightStart).to.equal(10);
  });

  it("handles special characters in code content", async () => {
    const specialContent = `const html = "<div>&nbsp;\"test\"</div>";
const regex = /[<>&"']/g;`;
    
    const el = await fixture(html`
      <code-sample type="javascript">
        <template preserve-content="preserve-content">
${specialContent}
        </template>
      </code-sample>
    `);
    
    expect(el).to.exist;
    const template = el.querySelector('template');
    expect(template.innerHTML).to.include('&');
  });

  it("handles empty highlight range", async () => {
    const el = await fixture(html`
      <code-sample highlight-start="0" highlight-end="0">
        <template preserve-content="preserve-content">
          const empty = true;
        </template>
      </code-sample>
    `);
    
    expect(el.highlightStart).to.equal(0);
    expect(el.highlightEnd).to.equal(0);
    expect(el).to.exist;
  });

  it("maintains functionality with edit mode toggling", async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          const editable = true;
        </template>
      </code-sample>
    `);
    
    el.editMode = true;
    await el.updateComplete;
    
    el.editMode = false;
    await el.updateComplete;
    
    expect(el.editMode).to.be.false;
  });
});
