import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-seo-admin-dialog.js";

describe("haxcms-seo-admin-dialog site language", () => {
  it("uses the shared language picker, allowing custom codes", () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    const field = el
      ._buildSeoGroups()
      .flatMap((group) => group.fields)
      .find((f) => f.property === "manifest-metadata-site-settings-lang");
    expect(field.inputMethod).to.equal("haxcms-language-picker");
    expect(field.allowCustom).to.equal(true);
    expect(field.description).to.not.contain("ISO 639-1");
  });
});
