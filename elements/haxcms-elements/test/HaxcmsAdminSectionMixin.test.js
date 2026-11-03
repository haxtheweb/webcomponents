import { expect } from "@open-wc/testing";
import {
  ADMIN_SECTION_STATE_EVENT,
  cloneData,
  toBoolValue,
  dispatchAdminSectionState,
  HaxcmsAdminSectionMixin,
  HaxcmsAdminFieldsMixin,
} from "../lib/core/admin/HaxcmsAdminSectionMixin.js";

class Base extends HTMLElement {
  disconnectedCallback() {
    this.baseDisconnected = true;
  }
}

class SectionEl extends HaxcmsAdminSectionMixin(Base) {
  get changedFields() {
    return this._changed || [];
  }
  get canSave() {
    return true;
  }
}
customElements.define("test-admin-section-mixin", SectionEl);

class FieldsEl extends HaxcmsAdminFieldsMixin(Base) {
  get changedFields() {
    return this._changed || [];
  }
  get canSave() {
    return false;
  }
}
customElements.define("test-admin-fields-mixin", FieldsEl);

function capture(el, fn) {
  let event = null;
  el.addEventListener(ADMIN_SECTION_STATE_EVENT, (e) => {
    event = e;
  });
  fn();
  return event;
}

describe("HaxcmsAdminSectionMixin", () => {
  it("cloneData deep copies and passes undefined / null through", () => {
    const src = { a: [1, { b: 2 }] };
    const copy = cloneData(src);
    expect(copy).to.deep.equal(src);
    expect(copy).to.not.equal(src);
    expect(copy.a[1]).to.not.equal(src.a[1]);
    expect(cloneData(undefined)).to.equal(undefined);
    expect(cloneData(null)).to.equal(null);
    expect(cloneData("x")).to.equal("x");
  });

  it("toBoolValue normalises boolean-ish values", () => {
    [true, "true", "1", 1].forEach((v) =>
      expect(toBoolValue(v)).to.equal(true),
    );
    [false, "false", "0", 0].forEach((v) =>
      expect(toBoolValue(v, true)).to.equal(false),
    );
    expect(toBoolValue("maybe")).to.equal(false);
    expect(toBoolValue(undefined, true)).to.equal(true);
  });

  it("dispatches the section state event with the same options", () => {
    const el = document.createElement("div");
    const detail = { selected: 2 };
    const e = capture(el, () => dispatchAdminSectionState(el, detail));
    expect(e.type).to.equal("haxcms-admin-section-state");
    expect(e.bubbles).to.equal(true);
    expect(e.composed).to.equal(true);
    expect(e.cancelable).to.equal(false);
    expect(e.detail).to.equal(detail);
  });

  it("_emitState reports changedFields labels as they are", () => {
    const el = document.createElement("test-admin-section-mixin");
    el._changed = ["Experience level"];
    const e = capture(el, () => el._emitState());
    expect(e.detail).to.deep.equal({
      dirty: true,
      changes: ["Experience level"],
      canSave: true,
    });
    el._changed = [];
    expect(capture(el, () => el._emitState()).detail.dirty).to.equal(false);
  });

  it("fields mixin reports field titles and compares to the baseline", () => {
    const el = document.createElement("test-admin-fields-mixin");
    el._changed = [{ property: "a", title: "Title A" }];
    const e = capture(el, () => el._emitState());
    expect(e.detail).to.deep.equal({
      dirty: true,
      changes: ["Title A"],
      canSave: false,
    });
    el.values = { a: [1], b: "x" };
    el.__baseline = { a: [1], b: "y" };
    expect(el._isChanged("a")).to.equal(false);
    expect(el._isChanged("b")).to.equal(true);
    expect(el._toBoolValue("0", true)).to.equal(false);
    expect(el._cloneData(null)).to.equal(null);
  });

  it("fields mixin disposes the manifest reaction on disconnect", () => {
    const el = document.createElement("test-admin-fields-mixin");
    let disposed = 0;
    el.__manifestReaction = () => {
      disposed++;
    };
    document.body.appendChild(el);
    el.remove();
    expect(disposed).to.equal(1);
    expect(el.__manifestReaction).to.equal(null);
    expect(el.baseDisconnected).to.equal(true);
  });
});
