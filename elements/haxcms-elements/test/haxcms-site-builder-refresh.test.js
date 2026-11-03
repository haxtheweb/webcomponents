import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-site-builder.js";

// a bulk delete fires one haxcms-trigger-update per page; each must change
// the cache-busting stamp, or the manifest is only fetched once
describe("haxcms-site-builder refresh stamp", () => {
  it("changes on every update, even within the same second", async () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    const stub = { isLoggedIn: true, _timeStamp: "" };
    Builder.prototype._triggerUpdatedData.call(stub);
    const first = stub._timeStamp;
    await new Promise((r) => setTimeout(r, 5));
    Builder.prototype._triggerUpdatedData.call(stub);
    expect(stub._timeStamp).to.not.equal(first);
  });

  it("stays empty when logged out, as before", () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    const stub = { isLoggedIn: false, _timeStamp: 1 };
    Builder.prototype._triggerUpdatedData.call(stub);
    expect(stub._timeStamp).to.equal("");
  });
});
