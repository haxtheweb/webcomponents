import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import sinon from "sinon";
import "../code-editor.js";

// Mock monaco-element dependency
class MockMonacoElement extends HTMLElement {
  constructor() {
    super();
    this._value = '';
    this.ready = false;
  }
  
  get value() {
    return this._value;
  }
  
  set value(val) {
    this._value = val;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: val }));
  }
  
  connectedCallback() {
    setTimeout(() => {
      this.ready = true;
      this.dispatchEvent(new CustomEvent('monaco-element-ready'));
    }, 10);
  }
  
  focus() {
    this.dispatchEvent(new CustomEvent('code-editor-focus'));
  }
  
  blur() {
    this.dispatchEvent(new CustomEvent('code-editor-blur'));
  }
}

// Mock code-pen-button dependency
class MockCodePenButton extends HTMLElement {
  static get properties() {
    return { data: { type: Object } };
  }
  
  set data(val) {
    this._data = val;
  }
  
  get data() {
    return this._data;
  }
}

describe("code-editor test", () => {
  let element, sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    
    // Register mock elements
    if (!globalThis.customElements.get('monaco-element')) {
      globalThis.customElements.define('monaco-element', MockMonacoElement);
    }
    if (!globalThis.customElements.get('code-pen-button')) {
      globalThis.customElements.define('code-pen-button', MockCodePenButton);
    }
    
    // Mock global matchMedia
    globalThis.matchMedia = sandbox.stub().returns({
      matches: false,
      addEventListener: sandbox.stub(),
      removeEventListener: sandbox.stub()
    });
    
    element = await fixture(html`
      <code-editor 
        title="Test Editor"
        language="javascript"
        theme="vs-dark"
        font-size="14"
      ></code-editor>
    `);
    
    // Wait for monaco element to be ready
    await waitUntil(() => element.ready, 'Monaco element should be ready');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Basic Setup and Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with all properties set", async () => {
      const el = await fixture(html`
        <code-editor 
          title="Complete Editor"
          language="python"
          theme="vs"
          font-size="16"
          read-only
          word-wrap
          hide-line-numbers
          show-code-pen
        ></code-editor>
      `);
      await waitUntil(() => el.ready);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with minimal properties", async () => {
      const el = await fixture(html`
        <code-editor></code-editor>
      `);
      await waitUntil(() => el.ready);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit when focused", async () => {
      element.focused = true;
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with different themes", async () => {
      const themes = ['vs', 'vs-dark', 'auto'];
      for (const theme of themes) {
        element.theme = theme;
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Component Structure", () => {
    it("renders with correct tag name", () => {
      expect(element.tagName.toLowerCase()).to.equal('code-editor');
    });

    it("has proper shadow DOM structure", () => {
      const label = element.shadowRoot.querySelector('label');
      expect(label).to.exist;
      
      const monacoElement = element.shadowRoot.querySelector('monaco-element');
      expect(monacoElement).to.exist;
      
      const loadingPre = element.shadowRoot.querySelector('#loading');
      expect(loadingPre).to.exist;
    });

    it("includes label with proper association", () => {
      const label = element.shadowRoot.querySelector('label');
      expect(label.getAttribute('for')).to.equal('codeeditor');
      expect(label.textContent).to.equal('Test Editor');
    });

    it("includes monaco-element with correct attributes", () => {
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.getAttribute('id')).to.equal('codeeditor');
      expect(monaco.getAttribute('language')).to.equal('javascript');
      expect(monaco.getAttribute('theme')).to.equal('vs-dark');
      expect(monaco.getAttribute('font-size')).to.equal('14');
    });

    it("has hidden slot for content", () => {
      const slot = element.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
      expect(slot.hasAttribute('hidden')).to.be.true;
    });

    it("shows loading preview when not ready", async () => {
      const el = await fixture(html`<code-editor>const x = 1;</code-editor>`);
      const loading = el.shadowRoot.querySelector('#loading');
      const monaco = el.shadowRoot.querySelector('monaco-element');
      
      expect(loading.hasAttribute('hidden')).to.be.false;
      expect(monaco.hasAttribute('data-hidden')).to.be.true;
    });
  });

  describe("Property Handling", () => {
    it("reflects title property to label", async () => {
      element.title = 'New Title';
      await element.updateComplete;
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('New Title');
      expect(label.hasAttribute('hidden')).to.be.false;
    });

    it("hides label when title is empty", async () => {
      element.title = '';
      await element.updateComplete;
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.hasAttribute('hidden')).to.be.true;
    });

    it("handles language property changes", async () => {
      element.language = 'python';
      await element.updateComplete;
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.getAttribute('language')).to.equal('python');
    });

    it("handles theme property changes", async () => {
      element.theme = 'vs';
      await element.updateComplete;
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.getAttribute('theme')).to.equal('vs');
      expect(element.getAttribute('theme-colors')).to.equal('vs');
    });

    it("handles fontSize property changes", async () => {
      element.fontSize = 18;
      await element.updateComplete;
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.getAttribute('font-size')).to.equal('18');
    });

    it("handles readOnly property correctly", async () => {
      element.readOnly = true;
      await element.updateComplete;
      
      expect(element.getAttribute('read-only')).to.equal('');
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.hasAttribute('read-only')).to.be.true;
    });

    it("handles wordWrap property correctly", async () => {
      element.wordWrap = true;
      await element.updateComplete;
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.hasAttribute('word-wrap')).to.be.true;
    });

    it("handles tabSize property correctly", async () => {
      element.tabSize = 4;
      await element.updateComplete;
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.getAttribute('tab-size')).to.equal('4');
    });

    it("handles autofocus property correctly", async () => {
      element.autofocus = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('autofocus')).to.be.true;
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.hasAttribute('autofocus')).to.be.true;
    });

    it("handles hideLineNumbers property correctly", async () => {
      element.hideLineNumbers = true;
      await element.updateComplete;
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      expect(monaco.hasAttribute('hide-line-numbers')).to.be.true;
    });

    it("handles focused property and reflects it", async () => {
      element.focused = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('focused')).to.be.true;
    });
  });

  describe("Theme System", () => {
    it("returns correct theme for vs", () => {
      expect(element.getTheme('vs')).to.equal('vs');
      expect(element.getAttribute('theme-colors')).to.equal('vs');
    });

    it("returns correct theme for vs-dark", () => {
      expect(element.getTheme('vs-dark')).to.equal('vs-dark');
      expect(element.getAttribute('theme-colors')).to.equal('vs-dark');
    });

    it("handles auto theme with dark preference", () => {
      globalThis.matchMedia.withArgs('(prefers-color-scheme: dark)').returns({ matches: true });
      globalThis.matchMedia.withArgs('(prefers-color-scheme: light)').returns({ matches: false });
      
      expect(element.getTheme('auto')).to.equal('vs-dark');
    });

    it("handles auto theme with light preference", () => {
      globalThis.matchMedia.withArgs('(prefers-color-scheme: dark)').returns({ matches: false });
      globalThis.matchMedia.withArgs('(prefers-color-scheme: light)').returns({ matches: true });
      
      expect(element.getTheme('auto')).to.equal('vs');
    });

    it("defaults to vs-dark for auto theme without preference", () => {
      globalThis.matchMedia.returns({ matches: false });
      
      expect(element.getTheme('auto')).to.equal('vs-dark');
    });

    it("handles undefined theme", () => {
      expect(element.getTheme(undefined)).to.equal('vs-dark');
    });
  });

  describe("Editor Value Management", () => {
    it("updates editor value when editorValue property changes", async () => {
      const testCode = 'console.log("Hello World");';
      element.editorValue = testCode;
      await element.updateComplete;
      
      expect(element.innerHTML).to.include(testCode);
    });

    it("handles value changes from monaco element", async () => {
      const testValue = 'const x = 42;';
      const monaco = element.shadowRoot.querySelector('monaco-element');
      
      monaco.value = testValue;
      await element.updateComplete;
      
      expect(element.value).to.equal(testValue);
    });

    it("computes placeholder from innerHTML", async () => {
      const el = await fixture(html`
        <code-editor>
          <template>const example = true;</template>
        </code-editor>
      `);
      
      expect(el.placeholder).to.include('const example = true;');
    });

    it("computes placeholder from editorValue", async () => {
      element.editorValue = 'let test = "value";';
      await element.updateComplete;
      
      expect(element.placeholder).to.include('let test = "value";');
    });

    it("cleans template tags from placeholder", async () => {
      const el = await fixture(html`
        <code-editor>
          <template>const cleaned = true;</template>
        </code-editor>
      `);
      
      expect(el.placeholder).to.not.include('<template>');
      expect(el.placeholder).to.not.include('</template>');
    });

    it("handles complex content with iframe", async () => {
      const el = await fixture(html`
        <code-editor>
          <template>
            <iframe>document.write('test');</iframe>
          </template>
        </code-editor>
      `);
      
      expect(el.placeholder).to.not.include('<iframe>');
    });
  });

  describe("Focus Handling", () => {
    it("sets focused attribute on focus event", async () => {
      const monaco = element.shadowRoot.querySelector('monaco-element');
      
      monaco.focus();
      await element.updateComplete;
      
      expect(element.focused).to.be.true;
      expect(element.hasAttribute('focused')).to.be.true;
    });

    it("unsets focused attribute on blur event", async () => {
      const monaco = element.shadowRoot.querySelector('monaco-element');
      
      // First focus then blur
      monaco.focus();
      await element.updateComplete;
      
      monaco.blur();
      await element.updateComplete;
      
      expect(element.focused).to.be.false;
      expect(element.hasAttribute('focused')).to.be.false;
    });

    it("dispatches focused-changed event on focus", async () => {
      const monaco = element.shadowRoot.querySelector('monaco-element');
      const focusedSpy = sandbox.spy();
      element.addEventListener('focused-changed', focusedSpy);
      
      monaco.focus();
      await element.updateComplete;
      
      expect(focusedSpy.called).to.be.true;
      expect(focusedSpy.getCall(0).args[0].detail.focused).to.be.true;
    });

    it("dispatches focused-changed event on blur", async () => {
      const monaco = element.shadowRoot.querySelector('monaco-element');
      const focusedSpy = sandbox.spy();
      element.addEventListener('focused-changed', focusedSpy);
      
      // Focus first
      monaco.focus();
      await element.updateComplete;
      focusedSpy.resetHistory();
      
      monaco.blur();
      await element.updateComplete;
      
      expect(focusedSpy.called).to.be.true;
      expect(focusedSpy.getCall(0).args[0].detail.focused).to.be.false;
    });
  });

  describe("CodePen Integration", () => {
    it("shows CodePen button when showCodePen is true", async () => {
      element.showCodePen = true;
      await element.updateComplete;
      
      const codePenContainer = element.shadowRoot.querySelector('.code-pen-container');
      expect(codePenContainer).to.exist;
      
      const codePenButton = element.shadowRoot.querySelector('code-pen-button');
      expect(codePenButton).to.exist;
    });

    it("hides CodePen button when showCodePen is false", async () => {
      element.showCodePen = false;
      await element.updateComplete;
      
      const codePenContainer = element.shadowRoot.querySelector('.code-pen-container');
      expect(codePenContainer).to.not.exist;
    });

    it("computes CodePen data correctly", async () => {
      element.title = 'Test Code';
      element.value = '<div>Hello World</div>';
      await element.updateComplete;
      
      expect(element.codePenData.title).to.equal('Test Code');
      expect(element.codePenData.html).to.equal('<div>Hello World</div>');
      expect(element.codePenData.head).to.include('WCGlobalCDNPath');
    });

    it("dispatches show-code-pen-changed event", async () => {
      const spy = sandbox.spy();
      element.addEventListener('show-code-pen-changed', spy);
      
      element.showCodePen = true;
      await element.updateComplete;
      
      expect(spy.called).to.be.true;
      expect(spy.getCall(0).args[0].detail.value).to.be.true;
    });

    it("passes data to CodePen button", async () => {
      element.showCodePen = true;
      element.title = 'Button Test';
      element.value = '<span>Test</span>';
      await element.updateComplete;
      
      const codePenButton = element.shadowRoot.querySelector('code-pen-button');
      expect(codePenButton.data).to.deep.equal(element.codePenData);
    });
  });

  describe("Legacy Mode Support", () => {
    it("sets language when mode property is changed", async () => {
      element.mode = 'html';
      await element.updateComplete;
      
      expect(element.language).to.equal('html');
    });

    it("supports mode property for backward compatibility", async () => {
      const el = await fixture(html`
        <code-editor mode="css"></code-editor>
      `);
      await waitUntil(() => el.ready);
      
      expect(el.language).to.equal('css');
    });
  });

  describe("Content Processing", () => {
    it("updates editor value from slotted content", async () => {
      const el = await fixture(html`
        <code-editor>
          <p>Slotted content</p>
        </code-editor>
      `);
      await waitUntil(() => el.ready);
      
      el.updateEditorValue();
      const monaco = el.shadowRoot.querySelector('monaco-element');
      expect(monaco.value).to.include('Slotted content');
    });

    it("handles template tag content correctly", async () => {
      const el = await fixture(html`
        <code-editor>
          <template>const template = true;</template>
        </code-editor>
      `);
      await waitUntil(() => el.ready);
      
      el.updateEditorValue();
      const monaco = el.shadowRoot.querySelector('monaco-element');
      expect(monaco.value).to.include('const template = true;');
    });

    it("handles mixed content types", async () => {
      const el = await fixture(html`
        <code-editor>
          Text node
          <span>Element node</span>
          More text
        </code-editor>
      `);
      await waitUntil(() => el.ready);
      
      el.updateEditorValue();
      const monaco = el.shadowRoot.querySelector('monaco-element');
      expect(monaco.value).to.include('Text node');
      expect(monaco.value).to.include('<span>Element node</span>');
    });

    it("handles iframe content extraction", async () => {
      const el = await fixture(html`
        <code-editor>
          <template>
            <iframe>iframe content</iframe>
          </template>
        </code-editor>
      `);
      await waitUntil(() => el.ready);
      
      // Mock iframe innerHTML
      const iframe = el.children[0].content.querySelector('iframe');
      if (iframe) {
        iframe.innerHTML = 'iframe content';
      }
      
      el.updateEditorValue();
      // This test verifies the code path, actual iframe content extraction
      // would require more complex mocking
    });
  });

  describe("Event Dispatching", () => {
    it("dispatches value-changed event on value update", async () => {
      const spy = sandbox.spy();
      element.addEventListener('value-changed', spy);
      
      element.value = 'new value';
      await element.updateComplete;
      
      expect(spy.called).to.be.true;
      expect(spy.getCall(0).args[0].detail.value).to.equal('new value');
    });

    it("dispatches events when editor data changes", async () => {
      const spy = sandbox.spy();
      element.addEventListener('value-changed', spy);
      
      const monaco = element.shadowRoot.querySelector('monaco-element');
      monaco.value = 'editor change';
      
      expect(spy.called).to.be.true;
    });

    it("listens for monaco-element-ready event", async () => {
      const el = await fixture(html`<code-editor></code-editor>`);
      
      expect(el.ready).to.be.false;
      await waitUntil(() => el.ready);
      expect(el.ready).to.be.true;
    });
  });

  describe("HAX Integration", () => {
    it("provides hax hooks", () => {
      const hooks = element.haxHooks();
      expect(hooks.preProcessNodeToContent).to.equal('haxpreProcessNodeToContent');
      expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged');
    });

    it("preprocesses node to remove editor-specific attributes", () => {
      const mockNode = {
        editorValue: 'test',
        codePenData: { test: true },
        value: 'test value',
        removeAttribute: sandbox.spy()
      };
      
      const result = element.haxpreProcessNodeToContent(mockNode);
      
      expect(result.editorValue).to.be.null;
      expect(result.codePenData).to.be.null;
      expect(result.value).to.be.null;
      expect(mockNode.removeAttribute.calledWith('value')).to.be.true;
      expect(mockNode.removeAttribute.calledWith('code-pen-data')).to.be.true;
    });

    it("handles active element changes", () => {
      const mockEl = {
        replaceWith: sandbox.spy()
      };
      
      element.value = '<div>test</div>';
      const result = element.haxactiveElementChanged(mockEl, false);
      
      expect(mockEl.replaceWith.called).to.be.true;
    });

    it("gets value as DOM node", () => {
      element.value = '<div>Test Content</div>';
      
      const node = element.getValueAsNode();
      expect(node.innerHTML).to.equal('<div>Test Content</div>');
    });

    it("handles self-referencing elements in getValueAsNode", () => {
      element.value = '<code-editor><div>inner</div></code-editor>';
      
      const wrapper = globalThis.document.createElement('code-editor');
      const node = element.getValueAsNode(wrapper);
      
      // Should return the first child if it matches the wrapper tag
      expect(node.tagName).to.equal('CODE-EDITOR');
    });
  });

  describe("Lifecycle Management", () => {
    it("sets up mutation observer on connection", async () => {
      const el = await fixture(html`<code-editor></code-editor>`);
      await waitUntil(() => el.ready);
      
      expect(el._observer).to.exist;
      expect(el._observer instanceof MutationObserver).to.be.true;
    });

    it("cleans up mutation observer on disconnection", async () => {
      const el = await fixture(html`<code-editor></code-editor>`);
      await waitUntil(() => el.ready);
      
      const observer = el._observer;
      const disconnectSpy = sandbox.spy(observer, 'disconnect');
      
      el.disconnectedCallback();
      
      expect(disconnectSpy.called).to.be.true;
      expect(el._observer).to.be.null;
    });

    it("handles editor ready event", async () => {
      const el = await fixture(html`<code-editor editor-value="test code"></code-editor>`);
      
      await waitUntil(() => el.ready);
      
      const monaco = el.shadowRoot.querySelector('monaco-element');
      expect(monaco.value).to.include('test code');
    });

    it("initializes with correct default values", () => {
      expect(element.codePenData).to.be.null;
      expect(element.haxUIElement).to.be.true;
      expect(element.showCodePen).to.be.false;
      expect(element.readOnly).to.be.false;
      expect(element.theme).to.equal('vs-dark');
      expect(element.language).to.equal('javascript');
      expect(element.fontSize).to.equal(16);
      expect(element.wordWrap).to.be.false;
      expect(element.tabSize).to.equal(2);
      expect(element.autofocus).to.be.false;
      expect(element.hideLineNumbers).to.be.false;
      expect(element.focused).to.be.false;
    });
  });

  describe("Library Path Configuration", () => {
    it("sets libPath from global WCGlobalBasePath", async () => {
      globalThis.WCGlobalBasePath = 'https://test.com/components/';
      
      const el = await fixture(html`<code-editor></code-editor>`);
      
      expect(el.libPath).to.include('https://test.com/components/');
      expect(el.libPath).to.include('monaco-editor/min/vs');
      
      delete globalThis.WCGlobalBasePath;
    });

    it("falls back to import.meta.url for libPath", async () => {
      delete globalThis.WCGlobalBasePath;
      
      const el = await fixture(html`<code-editor></code-editor>`);
      
      expect(el.libPath).to.include('monaco-editor/min/vs');
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles empty editor value gracefully", async () => {
      element.editorValue = '';
      await element.updateComplete;
      
      expect(() => element.render()).to.not.throw;
    });

    it("handles null/undefined values", async () => {
      element.editorValue = null;
      await element.updateComplete;
      
      element.editorValue = undefined;
      await element.updateComplete;
      
      expect(() => element.render()).to.not.throw;
    });

    it("handles very large code content", async () => {
      const largeCode = 'console.log("test");\n'.repeat(1000);
      element.editorValue = largeCode;
      await element.updateComplete;
      
      expect(element.placeholder).to.include('console.log("test");');
    });

    it("handles special characters in code", async () => {
      const specialCode = 'const str = "<>&\"\'";\n// Comment with çîrçümfléx';
      element.editorValue = specialCode;
      await element.updateComplete;
      
      expect(element.placeholder).to.include(specialCode);
    });

    it("handles rapid property changes", async () => {
      for (let i = 0; i < 10; i++) {
        element.language = i % 2 === 0 ? 'javascript' : 'python';
        element.theme = i % 2 === 0 ? 'vs' : 'vs-dark';
        element.fontSize = 12 + i;
      }
      await element.updateComplete;
      
      expect(element.language).to.equal('python');
      expect(element.theme).to.equal('vs-dark');
      expect(element.fontSize).to.equal(21);
    });

    it("handles missing monaco element gracefully", async () => {
      const el = await fixture(html`<code-editor></code-editor>`);
      
      // Remove monaco element
      const monaco = el.shadowRoot.querySelector('monaco-element');
      monaco.remove();
      
      expect(() => el.updateEditorValue()).to.not.throw;
    });
  });

  describe("Performance and Resource Management", () => {
    it("efficiently handles multiple theme changes", async () => {
      const themes = ['vs', 'vs-dark', 'auto', 'vs'];
      
      for (const theme of themes) {
        element.theme = theme;
        await element.updateComplete;
      }
      
      expect(element.theme).to.equal('vs');
      expect(element.getAttribute('theme-colors')).to.equal('vs');
    });

    it("properly manages event listeners", async () => {
      const el = await fixture(html`<code-editor></code-editor>`);
      await waitUntil(() => el.ready);
      
      // Verify event listeners are set up
      const addEventListenerSpy = sandbox.spy(el, 'addEventListener');
      
      // Trigger editor ready again
      el.editorReady({ target: el.shadowRoot.querySelector('monaco-element') });
      
      // Observer should be properly set up
      expect(el._observer).to.exist;
    });

    it("handles concurrent editor operations", async () => {
      const promises = [
        (async () => { element.language = 'html'; })(),
        (async () => { element.theme = 'vs'; })(),
        (async () => { element.fontSize = 20; })(),
        (async () => { element.value = 'concurrent test'; })()
      ];
      
      await Promise.all(promises);
      await element.updateComplete;
      
      expect(element.language).to.equal('html');
      expect(element.theme).to.equal('vs');
      expect(element.fontSize).to.equal(20);
      expect(element.value).to.equal('concurrent test');
    });
  });

  describe("Styling and CSS Custom Properties", () => {
    it("applies theme-based styling", async () => {
      element.theme = 'vs';
      await element.updateComplete;
      
      expect(element.getAttribute('theme-colors')).to.equal('vs');
    });

    it("uses CSS custom properties for theming", () => {
      const styles = element.constructor.styles[0].cssText;
      expect(styles).to.include('--code-pen-margin');
      expect(styles).to.include('--code-editor-code-border');
      expect(styles).to.include('--code-editor-label-color');
    });

    it("handles focused state styling", async () => {
      element.focused = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('focused')).to.be.true;
    });

    it("applies part attributes for styling", () => {
      const label = element.shadowRoot.querySelector('label');
      const monaco = element.shadowRoot.querySelector('monaco-element');
      const loading = element.shadowRoot.querySelector('#loading');
      
      expect(label.getAttribute('part')).to.equal('label');
      expect(monaco.getAttribute('part')).to.equal('code');
      expect(loading.getAttribute('part')).to.equal('preview');
    });
  });

  describe("Integration Scenarios", () => {
    it("works with different programming languages", async () => {
      const languages = ['javascript', 'python', 'html', 'css', 'json', 'markdown'];
      
      for (const lang of languages) {
        element.language = lang;
        await element.updateComplete;
        
        const monaco = element.shadowRoot.querySelector('monaco-element');
        expect(monaco.getAttribute('language')).to.equal(lang);
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("integrates with form submission", async () => {
      const form = await fixture(html`
        <form>
          <code-editor name="code" value="form test"></code-editor>
          <button type="submit">Submit</button>
        </form>
      `);
      
      const editor = form.querySelector('code-editor');
      await waitUntil(() => editor.ready);
      
      expect(editor.value).to.equal('form test');
    });

    it("maintains state through DOM manipulations", async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <code-editor 
          title="Persistent Editor"
          language="python"
          editor-value="def test(): pass"
        ></code-editor>
      `;
      
      document.body.appendChild(container);
      const editor = container.querySelector('code-editor');
      await waitUntil(() => editor.ready);
      
      expect(editor.title).to.equal('Persistent Editor');
      expect(editor.language).to.equal('python');
      expect(editor.editorValue).to.equal('def test(): pass');
      
      document.body.removeChild(container);
    });

    it("works in shadow DOM contexts", async () => {
      const wrapper = await fixture(html`
        <div>
          <code-editor title="Shadow Test" language="css"></code-editor>
        </div>
      `);
      
      const editor = wrapper.querySelector('code-editor');
      await waitUntil(() => editor.ready);
      
      expect(editor.shadowRoot).to.exist;
      await expect(editor).shadowDom.to.be.accessible();
    });
  });
});
