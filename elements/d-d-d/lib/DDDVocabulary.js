/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * DDD shared vocabulary: three words every block can answer the same way.
 *
 *   variant     what does it mean?   brand, neutral, success, warning, danger
 *   appearance  how loud is it?      filled, tonal, outlined, plain
 *   size        how big?             s, m, l
 *
 * Elements were written before these words existed, so each one names the
 * same ideas its own way (stop-note has status="stop", simple-cta has light
 * and large). This mixin bridges the two without renaming anything:
 *
 * - The existing attributes are read forever and never rewritten, so content
 *   already saved keeps rendering the same.
 * - An element declares how its existing attributes translate:
 *
 *     static get dddVocabulary() {
 *       return {
 *         variant: {
 *           from: "status",
 *           values: { stop: "danger", warning: "warning", info: "brand" },
 *         },
 *         size: { from: "large", values: { true: "l" }, default: "m" },
 *       };
 *     }
 *
 * - dddWord("variant") gives the resolved value: the shared word when it is
 *   set to a known value, otherwise the translated existing attribute,
 *   otherwise the declared default. The shared word wins when both are set.
 * - The resolved value is exposed to CSS as a custom state
 *   (:host(:state(variant-danger))), so nothing is added to the HTML the
 *   author saved. dddLegacy("variant") gives the existing attribute's value
 *   that matches the resolved word, for elements that keep drawing from it.
 *
 * The words only name things. They do not restyle an element: what a variant
 * looks like stays the element's own design.
 */
export const DDD_VOCABULARY = {
  variant: ["brand", "neutral", "success", "warning", "danger"],
  appearance: ["filled", "tonal", "outlined", "plain"],
  size: ["s", "m", "l"],
};

export const DDDVocabulary = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
        ...super.properties,
        variant: { type: String },
        appearance: { type: String },
        size: { type: String },
      };
    }

    /**
     * How this element's existing attributes translate; override per element.
     */
    static get dddVocabulary() {
      return {};
    }

    constructor() {
      super();
      this.variant = null;
      this.appearance = null;
      this.size = null;
      // custom states carry the resolved words; an element that attaches
      // internals itself shares this field instead of attaching twice
      if (!this.__internals) {
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      }
    }

    /**
     * Resolved value of a shared word, or null when the element has none.
     */
    dddWord(word) {
      const known = DDD_VOCABULARY[word];
      if (!known) return null;
      if (this[word] && known.includes(this[word])) return this[word];
      const rule = this.constructor.dddVocabulary[word];
      if (!rule) return null;
      const legacy = this[rule.from];
      const key = legacy === null || legacy === undefined ? "" : String(legacy);
      if (
        rule.values &&
        Object.prototype.hasOwnProperty.call(rule.values, key)
      ) {
        return rule.values[key];
      }
      return rule.default || null;
    }

    /**
     * The existing attribute's value that matches the resolved shared word,
     * so an element can keep drawing from its own attribute. Falls back to
     * the attribute's current value when the word has no translation.
     */
    dddLegacy(word) {
      const rule = this.constructor.dddVocabulary[word];
      if (!rule) return null;
      const own = this[word];
      if (own && DDD_VOCABULARY[word].includes(own) && rule.values) {
        const match = Object.keys(rule.values).find(
          (key) => rule.values[key] === own,
        );
        if (match !== undefined) return match;
      }
      return this[rule.from];
    }

    willUpdate(changedProperties) {
      if (super.willUpdate) super.willUpdate(changedProperties);
      const states =
        this.__internals && this.__internals.states
          ? this.__internals.states
          : null;
      if (!states) return;
      Object.keys(DDD_VOCABULARY).forEach((word) => {
        const value = this.dddWord(word);
        try {
          DDD_VOCABULARY[word].forEach((known) => {
            if (known === value) {
              states.add(`${word}-${known}`);
            } else {
              states.delete(`${word}-${known}`);
            }
          });
        } catch {
          // engines without CustomStateSet keep the element's default look
        }
      });
    }
  };
};
