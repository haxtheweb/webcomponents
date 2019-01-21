/**
 * Gets injected into the iframe after monaco loader runs.
 */
export default `
var eventTypes = {
  ready: 'ready',
  valueChanged: 'valueChanged',
  languageChanged: 'languageChanged',
  themeChanged: 'themeChanged',
};

class MonacoEditor {
  constructor() {
    this.language = 'javascript';
    this.value = '';
    this.editor = null;
    this.setupEventListener('message', this.handleMessage.bind(this));
    this.setupEditor();
  }

  setupEditor() {
    require.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], () => {
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: this.value,
        language: this.language,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      });

      const model = this.editor.getModel();
      model.onDidChangeContent(() => {
        const value = model.getValue();
        this.onValueChanged(value);
      });

      this.ready();
    });
  }

  ready() {
    this.postMessage(eventTypes.ready, null);
    this.setupEventListener(
      eventTypes.valueChanged,
      this.onValueChanged.bind(this)
    );
  }

  _handleMessage(data) {
    switch (data.event) {
      case eventTypes.valueChanged:
        this.onInputValueChanged(data.payload);
        break;
      case eventTypes.languageChanged:
        this.onLanguageChanged(data.payload);
        break;
      case eventTypes.themeChanged:
        this.onThemeChanged(data.payload);
        break;
      default:
        break;
    }
  }

  handleMessage(message) {
    try {
      const data = JSON.parse(message.data);
      this._handleMessage(data);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  postMessage(event, payload) {
    window.parent.postMessage(
      JSON.stringify({ event, payload }),
      window.parent.location.href
    );
  }

  setupEventListener(type, callback) {
    window.addEventListener(type, data => {
      callback(data);
    });
  }

  onInputValueChanged(newValue) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.editor.getModel().setValue(newValue);
      this.postMessage(eventTypes.valueChanged, newValue);
    }
  } 

  onValueChanged(newValue) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.postMessage(eventTypes.valueChanged, newValue);
    }
  }

  onLanguageChanged(newLang) {
    monaco.editor.setModelLanguage(this.editor.getModel(), newLang);
  }

  onThemeChanged(newValue) {
    monaco.editor.setTheme(newValue);
  }
}

new MonacoEditor();
`;
