/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * KeyboardShortcutManager
 * Centralized, framework-agnostic registry for all keyboard/insertion
 * shortcuts in the HAX ecosystem.
 *
 * This is the single source of truth that three previously-disconnected
 * subsystems register into and query from:
 *  - HAXcms Ctrl+Shift+[Key] bindings (binding shortcuts)
 *  - HAXStore markdown-trigger-to-gizmo map (markdown shortcuts)
 *  - Super Daemon (Merlin) options that carry shortcut metadata
 *
 * It intentionally has NO dependencies on Lit, MobX, or any HAX package so it
 * can be imported from haxcms-elements, hax-body, and super-daemon without
 * creating circular imports. The CMS-specific keydown *execution* (modifier
 * gating, admin-mode/modal guards, callback dispatch) lives in the
 * HAXCMSKeyboardShortcuts facade which delegates storage here.
 *
 * Canonical descriptor shape (a strict superset of all three legacy formats):
 * {
 *   id: String,                    // stable unique id, e.g. 'cms-save' or 'markdown-h3'
 *   type: 'binding' | 'markdown',  // binding = modifier+key; markdown = typed trigger insert
 *   key: String,                   // physical key (binding) e.g. 'S'
 *   ctrl, shift, alt, meta: Boolean, // binding modifiers
 *   trigger: String,               // markdown trigger e.g. '###'
 *   tag: String,                   // markdown insert target tag e.g. 'h3'
 *   content: String,               // markdown insert inner content
 *   description: String,
 *   context: String,               // 'edit' | 'view' | 'global'
 *   allowInInput: Boolean,
 *   callback: Function,            // optional direct callback (binding)
 *   condition: Function,           // optional active-condition (binding)
 *   eventName: String,             // optional event to fire instead of/alongside callback
 *   ...                             // any extra payload fields pass through
 * }
 */
class KeyboardShortcutManager {
  constructor() {
    this._byId = new Map();
    this._byBinding = new Map();
    this._byTrigger = new Map();
  }

  /**
   * Build the canonical binding-combo string used to index binding shortcuts.
   * Modifier order (Ctrl, Alt, Shift, Meta) matches the legacy
   * HAXCMSKeyboardShortcuts._generateKey so existing keydown matching is
   * preserved when the facade queries via getByBinding.
   */
  _bindingKey(descriptor) {
    const parts = [];
    if (descriptor.ctrl) parts.push("Ctrl");
    if (descriptor.alt) parts.push("Alt");
    if (descriptor.shift) parts.push("Shift");
    if (descriptor.meta) parts.push("Meta");
    parts.push(String(descriptor.key).toUpperCase());
    return parts.join("+");
  }

  /**
   * Fill in defaults so callers can use the minimal legacy shapes:
   *  - no type => 'binding'
   *  - no id => derived from binding combo or markdown trigger
   */
  _normalizeDescriptor(options) {
    const type = options.type || "binding";
    let id = options.id;
    if (!id) {
      id =
        type === "markdown"
          ? `markdown-${options.trigger}`
          : this._bindingKey(options);
    }
    return { ...options, id, type };
  }

  /**
   * Register a shortcut descriptor. Accepts the full canonical shape or any
   * legacy subset (defaults are applied). Re-registering the same id/combo
   * overwrites the previous entry, mirroring legacy Map.set behavior.
   * @param {Object} options - Shortcut descriptor
   * @returns {Object} the normalized descriptor that was stored
   */
  register(options) {
    if (!options) return null;
    const descriptor = this._normalizeDescriptor(options);
    // If this id already exists, clear its previous indexes so re-registering
    // the same id with a different combo/trigger does not leave stale entries.
    const existing = this._byId.get(descriptor.id);
    if (existing) {
      if (existing.type === "binding") {
        this._byBinding.delete(this._bindingKey(existing));
      } else if (existing.type === "markdown" && existing.trigger) {
        this._byTrigger.delete(existing.trigger);
      }
    }
    if (descriptor.type === "binding") {
      const combo = this._bindingKey(descriptor);
      // Re-registering the same combo with a new id displaces the old id
      // entirely, mirroring legacy single-Map overwrite semantics.
      const displacedId = this._byBinding.get(combo);
      if (displacedId && displacedId !== descriptor.id) {
        this._byId.delete(displacedId);
      }
      this._byBinding.set(combo, descriptor.id);
    } else if (descriptor.type === "markdown") {
      if (descriptor.trigger) {
        const displacedId = this._byTrigger.get(descriptor.trigger);
        if (displacedId && displacedId !== descriptor.id) {
          this._byId.delete(displacedId);
        }
        this._byTrigger.set(descriptor.trigger, descriptor.id);
      }
    }
    this._byId.set(descriptor.id, descriptor);
    return descriptor;
  }

  /**
   * Unregister a shortcut.
   * Backward-compatible signature: unregister(key, ctrl, shift, alt, meta)
   * resolves the binding combo and removes it. Otherwise pass an id string.
   * @param {String} idOrKey - descriptor id, or a key when modifiers follow
   */
  unregister(idOrKey, ctrl = false, shift = false, alt = false, meta = false) {
    if (
      typeof idOrKey === "string" &&
      (ctrl || shift || alt || meta || arguments.length > 1)
    ) {
      const combo = this._bindingKey({
        key: idOrKey,
        ctrl,
        shift,
        alt,
        meta,
      });
      const id = this._byBinding.get(combo);
      if (id) {
        const descriptor = this._byId.get(id);
        this._byBinding.delete(combo);
        this._byId.delete(id);
        if (
          descriptor &&
          descriptor.type === "markdown" &&
          descriptor.trigger
        ) {
          this._byTrigger.delete(descriptor.trigger);
        }
      }
      return;
    }
    const descriptor = this._byId.get(idOrKey);
    if (!descriptor) return;
    if (descriptor.type === "binding") {
      this._byBinding.delete(this._bindingKey(descriptor));
    } else if (descriptor.type === "markdown" && descriptor.trigger) {
      this._byTrigger.delete(descriptor.trigger);
    }
    this._byId.delete(idOrKey);
  }

  /** All registered descriptors (newest-stable copies). */
  getAll() {
    return Array.from(this._byId.values()).map((d) => ({ ...d }));
  }

  /** Descriptor by id, or null. */
  getById(id) {
    const d = this._byId.get(id);
    return d ? { ...d } : null;
  }

  /** Descriptors whose context matches or is 'global'. */
  getByContext(context) {
    return this.getAll().filter(
      (s) => s.context === context || s.context === "global",
    );
  }

  /** Descriptors of a given type ('binding' | 'markdown'). */
  getByType(type) {
    return this.getAll().filter((s) => s.type === type);
  }

  /** Binding descriptor matching a key + modifiers, or null. */
  getByBinding(key, ctrl = false, shift = false, alt = false, meta = false) {
    const combo = this._bindingKey({ key, ctrl, shift, alt, meta });
    const id = this._byBinding.get(combo);
    return id ? this.getById(id) : null;
  }

  /** Markdown descriptor matching a typed trigger, or null. */
  getByTrigger(trigger) {
    const id = this._byTrigger.get(trigger);
    return id ? this.getById(id) : null;
  }

  /**
   * First markdown descriptor whose insert tag matches, or null.
   * Useful for surfacing a trigger chip on a gizmo/option that inserts a
   * given tag (e.g. a gizmo whose tag is "h3" resolves to the "###" trigger).
   * Several triggers can map to the same tag (---, ***, ___ all -> hr); the
   * first registered one is returned.
   */
  getMarkdownByTag(tag) {
    if (!tag) return null;
    const found = this.getByType("markdown").find((d) => d.tag === tag);
    return found || null;
  }

  /**
   * Generate a human-readable label for a descriptor.
   * Binding labels keep the legacy visual format (e.g. "Ctrl⇧S"); markdown
   * labels are the trigger itself (e.g. "###").
   */
  static generateLabel(options) {
    if (!options) return "";
    if (options.type === "markdown" && options.trigger) {
      return options.trigger;
    }
    const {
      key,
      ctrl = false,
      shift = false,
      alt = false,
      meta = false,
    } = options;
    const parts = [];
    if (ctrl) parts.push("Ctrl");
    if (alt) parts.push("Alt");
    if (meta) parts.push("Meta");
    if (shift) parts.push("\u21e7");
    parts.push(String(key).toUpperCase());
    return parts.join("");
  }

  /** Instance helper delegating to static generateLabel. */
  getLabel(descriptor) {
    return KeyboardShortcutManager.generateLabel(descriptor);
  }

  /**
   * All shortcuts formatted for display (e.g. the "View keyboard shortcuts"
   * Merlin program and the About dialog). `key` is the physical key for
   * bindings and the trigger for markdown, matching legacy output.
   */
  getForDisplay() {
    return this.getAll().map((descriptor) => ({
      id: descriptor.id,
      type: descriptor.type,
      label: KeyboardShortcutManager.generateLabel(descriptor),
      description: descriptor.description,
      context: descriptor.context,
      key: descriptor.type === "binding" ? descriptor.key : descriptor.trigger,
    }));
  }
}

// Singleton wired onto globalThis so the same instance is shared across
// every package that imports it (mirrors the HAXCMSKeyboardShortcutsManager
// singleton pattern for backward compatibility).
globalThis.KeyboardShortcutManager = globalThis.KeyboardShortcutManager || {};
globalThis.KeyboardShortcutManager.requestAvailability = () => {
  if (!globalThis.KeyboardShortcutManager.instance) {
    globalThis.KeyboardShortcutManager.instance = new KeyboardShortcutManager();
  }
  return globalThis.KeyboardShortcutManager.instance;
};

export const KeyboardShortcutManagerInstance =
  globalThis.KeyboardShortcutManager.requestAvailability();
export { KeyboardShortcutManager };
