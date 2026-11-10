/**
 * Known-good and known-leaky elements for `yarn test:leaks --self-test`,
 * which proves the leak check still sees each kind of leak (and does not
 * blame a singleton). Test fixtures only; never registered outside that run.
 */
import { LitElement, html } from "lit";

const schema = (tag) => ({
  gizmo: { title: tag },
  settings: { configure: [], advanced: [] },
  demoSchema: [{ tag, properties: {}, content: "" }],
});

// one shared store, created once: a singleton, never a leak
globalThis.LeakFixtureStore = globalThis.LeakFixtureStore || {
  instances: [],
  singletonListener: null,
};

/** cleans up everything it sets up; keeps one singleton listener */
class LeakFixtureClean extends LitElement {
  static get tag() {
    return "leak-fixture-clean";
  }
  static get haxProperties() {
    return schema(this.tag);
  }
  constructor() {
    super();
    this._onResize = () => {};
  }
  connectedCallback() {
    super.connectedCallback();
    if (!globalThis.LeakFixtureStore.singletonListener) {
      globalThis.LeakFixtureStore.singletonListener = () => {};
      globalThis.addEventListener(
        "hashchange",
        globalThis.LeakFixtureStore.singletonListener,
      );
    }
    globalThis.addEventListener("resize", this._onResize);
    this._interval = globalThis.setInterval(() => {}, 10000);
    this._observer = new globalThis.ResizeObserver(() => {});
    this._observer.observe(this);
    const tick = () => {
      this._frame = globalThis.requestAnimationFrame(tick);
    };
    tick();
  }
  disconnectedCallback() {
    globalThis.removeEventListener("resize", this._onResize);
    globalThis.clearInterval(this._interval);
    this._observer.disconnect();
    globalThis.cancelAnimationFrame(this._frame);
    super.disconnectedCallback();
  }
  render() {
    return html`<p>clean</p>`;
  }
}

/** leaks one of everything per instance */
class LeakFixtureLeaky extends LitElement {
  static get tag() {
    return "leak-fixture-leaky";
  }
  static get haxProperties() {
    return schema(this.tag);
  }
  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("resize", () => this.requestUpdate());
    this._interval = globalThis.setInterval(() => {}, 10000);
    this._observer = new globalThis.MutationObserver(() => {});
    this._observer.observe(globalThis.document.body, { childList: true });
    const tick = () => {
      if (this.isConnected || this.__leaky) {
        globalThis.requestAnimationFrame(tick);
      }
    };
    this.__leaky = true;
    tick();
    globalThis.LeakFixtureStore.instances.push(this);
  }
  render() {
    return html`<p>leaky</p>`;
  }
}

globalThis.customElements.define(LeakFixtureClean.tag, LeakFixtureClean);
globalThis.customElements.define(LeakFixtureLeaky.tag, LeakFixtureLeaky);
