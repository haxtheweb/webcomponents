import { I18NManagerStore } from "../i18n-manager.js";
export { I18NManagerStore };
// SuperClass to simplify wiring up and noticing changes to t values
// this is not required as you can simply use the event system
// to keep to 0 dependencies but this helps simplify and standardize
// integration with lots of downstream i18n files
export const I18NMixin = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Life cycle
     */
    constructor() {
      super();
      if (!this.t) {
        this.t = {};
      }
    }
    /**
     * Enhanced data reactivity for LitElement if available
     */
    static get properties() {
      return {
        ...super.properties,
        t: {
          type: Object,
        },
      };
    }
    /**
     * Set a property to a translated default and keep it translated.
     * Translations load after the constructor runs, so a value copied
     * from this.t there would otherwise stay in English. The property
     * follows this.t until something sets it to a different value
     * (an attribute, the author, the app), then it is left alone.
     * @param {String} prop property on this element
     * @param {String|Function} key this.t key, or (t) => value
     */
    i18nDefault(prop, key) {
      return this.i18nBind(this, prop, key);
    }
    /**
     * Same as i18nDefault for a field on any object (an option, a program
     * definition...). onChange(obj) runs after the field is re-translated.
     * @param {Object} obj
     * @param {String} field
     * @param {String|Function} key this.t key, or (t) => value
     * @param {Function} [onChange]
     */
    i18nBind(obj, field, key, onChange) {
      if (!this.__i18nBindings) {
        this.__i18nBindings = [];
      }
      const value = this._i18nValue(key);
      obj[field] = value;
      this.__i18nBindings.push({ obj, field, key, value, onChange });
      return value;
    }
    _i18nValue(key) {
      const t = this.t || {};
      return typeof key === "function" ? key(t) : t[key];
    }
    /**
     * Re-apply translated defaults; bindings whose value was changed by
     * something else are dropped.
     */
    _syncI18nBindings() {
      if (!this.__i18nBindings || this.__i18nBindings.length === 0) {
        return;
      }
      this.__i18nBindings = this.__i18nBindings.filter((b) => {
        if (b.obj[b.field] !== b.value) {
          return false;
        }
        const next = this._i18nValue(b.key);
        if (next !== undefined && !this._i18nSame(next, b.value)) {
          b.obj[b.field] = next;
          b.value = next;
          if (b.onChange) {
            b.onChange(b.obj);
          }
        }
        return true;
      });
    }
    // function keys build a new array / object each time; only swap it in
    // when the text in it actually changed
    _i18nSame(a, b) {
      if (a === b) {
        return true;
      }
      const plain = (v) =>
        v &&
        typeof v === "object" &&
        (Array.isArray(v) || Object.getPrototypeOf(v) === Object.prototype);
      if (plain(a) && plain(b)) {
        try {
          return JSON.stringify(a) === JSON.stringify(b);
        } catch {
          return false;
        }
      }
      return false;
    }
    /**
     * An attribute written by an author is an explicit value, even when it
     * matches the English default, so stop translating that property.
     * Attributes Lit reflects during its own update don't count.
     */
    attributeChangedCallback(name, oldValue, value) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, value);
      }
      if (
        this.__i18nInUpdate ||
        !this.__i18nBindings ||
        !this.constructor.elementProperties
      ) {
        return;
      }
      this.__i18nBindings = this.__i18nBindings.filter((b) => {
        if (b.obj !== this) {
          return true;
        }
        const options = this.constructor.elementProperties.get(b.field);
        if (!options || options.attribute === false) {
          return true;
        }
        const attribute =
          typeof options.attribute === "string"
            ? options.attribute
            : String(b.field).toLowerCase();
        return attribute !== name;
      });
    }
    update(changedProperties) {
      this.__i18nInUpdate = true;
      try {
        if (super.update) {
          super.update(changedProperties);
        }
      } finally {
        this.__i18nInUpdate = false;
      }
    }
    /**
     * LitElement: translations arrive as a new this.t, which schedules an update
     */
    willUpdate(changedProperties) {
      if (super.willUpdate) {
        super.willUpdate(changedProperties);
      }
      if (changedProperties.has("t")) {
        this._syncI18nBindings();
      }
    }
    // pass through to the manager, automatically adding some namespace values
    registerLocalization(detail) {
      // ensure we have a namespace for later use
      if (
        !detail.namespace &&
        detail.context &&
        detail.context.tagName &&
        detail.context.tagName
      ) {
        detail.namespace = detail.context.tagName.toLowerCase();
      }
      // support fallback calls for requestUpdate; you can always supply one
      if (!detail.updateCallback) {
        if (detail.context.requestUpdate) {
          detail.updateCallback = "requestUpdate";
          // automatically set for common VanillaJS convention
        } else if (detail.context.render) {
          detail.updateCallback = "render";
        }
      }
      // auto-detect localePath if we have a basePath
      // this is another short hand that allows for enforcing the location
      // of the locales bucket of files. You can define where these are
      // per request but this helps simplify the original implementation
      if (!detail.localesPath && detail.basePath) {
        // clean up path and force adding locales. part security thing as well
        detail.localesPath = `${decodeURIComponent(
          detail.basePath,
        )}/../locales`;
      }
      // register the localization directly, skipping event
      // this also ensures that things leveraging the Mixin will never miss
      // the singleton being registered
      if (I18NManagerStore) {
        I18NManagerStore.registerLocalization(detail);
      }
    }
  };
};
