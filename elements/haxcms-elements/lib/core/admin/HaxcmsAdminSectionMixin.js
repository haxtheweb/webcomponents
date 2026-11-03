/**
 * Shared helpers for the sections of the one admin dialog
 * (haxcms-site-admin). Each section reports its staged edits to the shell
 * with a `haxcms-admin-section-state` event; these helpers hold the
 * implementations that used to be copied into every section.
 */

/** the event a section fires to tell the shell about its state */
export const ADMIN_SECTION_STATE_EVENT = "haxcms-admin-section-state";

/** deep copy of plain data; undefined and null pass through untouched */
export function cloneData(data) {
  if (typeof data === "undefined") {
    return data;
  }
  if (data === null) {
    return null;
  }
  return JSON.parse(JSON.stringify(data));
}

/** normalise the boolean-ish values the site.json settings can hold */
export function toBoolValue(value, fallback = false) {
  if (value === true || value === false) {
    return value;
  }
  if (value === "true" || value === "1" || value === 1) {
    return true;
  }
  if (value === "false" || value === "0" || value === 0) {
    return false;
  }
  return fallback;
}

/** fire the section state event from a section element */
export function dispatchAdminSectionState(target, detail) {
  target.dispatchEvent(
    new CustomEvent(ADMIN_SECTION_STATE_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: detail,
    }),
  );
}

/**
 * Base section helpers. `_emitState()` reports `changedFields` (a list of
 * labels) with `canSave`; sections whose state looks different override it
 * and call `_dispatchSectionState(detail)` themselves.
 */
export const HaxcmsAdminSectionMixin = function (SuperClass) {
  return class extends SuperClass {
    _dispatchSectionState(detail) {
      dispatchAdminSectionState(this, detail);
    }

    _emitState() {
      const changed = this.changedFields;
      this._dispatchSectionState({
        dirty: changed.length > 0,
        changes: changed,
        canSave: this.canSave,
      });
    }

    _cloneData(data) {
      return cloneData(data);
    }
  };
};

/**
 * Sections that stage a `values` object against a `__baseline` copy and
 * follow the site manifest with a mobx reaction (SEO, site details).
 * `changedFields` holds field definitions, reported by their title.
 */
export const HaxcmsAdminFieldsMixin = function (SuperClass) {
  return class extends HaxcmsAdminSectionMixin(SuperClass) {
    disconnectedCallback() {
      if (this.__manifestReaction) {
        this.__manifestReaction();
        this.__manifestReaction = null;
      }
      super.disconnectedCallback();
    }

    _emitState() {
      const changed = this.changedFields;
      this._dispatchSectionState({
        dirty: changed.length > 0,
        changes: changed.map((field) => field.title),
        canSave: this.canSave,
      });
    }

    _toBoolValue(value, fallback = false) {
      return toBoolValue(value, fallback);
    }

    _isChanged(key) {
      return (
        JSON.stringify(this.values[key]) !==
        JSON.stringify(this.__baseline[key])
      );
    }
  };
};
