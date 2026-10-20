// Bulk file action confirmation (haxtheweb/issues#3121)
import { fixture, expect, html } from "@open-wc/testing";
import "../lib/core/haxcms-files-admin-dialog.js";

describe("haxcms-files-admin-dialog bulk confirmation", () => {
  let el, realConfirm, prompts, ran;
  const rows = (n) =>
    Array.from({ length: n }, (_, i) => ({
      path: `files/img-${i}.png`,
      name: `img-${i}.png`,
    }));

  beforeEach(async () => {
    el = await fixture(html`<haxcms-files-admin-dialog></haxcms-files-admin-dialog>`);
    prompts = [];
    ran = [];
    realConfirm = globalThis.confirm;
    el._canScale = () => true;
    el._canConvertToJpg = () => true;
    el._runBulkOp = async (r) => {
      ran.push(r.length);
    };
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });
  const answer = (value) => {
    globalThis.confirm = (msg) => {
      prompts.push(msg);
      return value;
    };
  };

  it("delete confirms with the item count and stops on cancel", async () => {
    answer(false);
    await el._onBulkDelete(rows(3));
    expect(prompts.length).to.equal(1);
    expect(prompts[0]).to.contain("3");
    expect(ran).to.deep.equal([]);
  });

  it("multi-file overwrite actions name the action and count, and run only when confirmed", async () => {
    answer(true);
    await el._onBulkScale(rows(4), "md").catch(() => {});
    await el._onBulkRotate(rows(4));
    await el._onBulkCompress(rows(4), "light").catch(() => {});
    await el._onBulkTransform(rows(4), "convert-jpg");
    expect(prompts.length).to.be.greaterThan(0);
    prompts.forEach((p) => expect(p).to.contain("4"));
    expect(prompts.some((p) => p.startsWith("Rotate 4 files"))).to.equal(true);
    expect(prompts.some((p) => p.startsWith("Convert to JPG 4 files"))).to.equal(true);
  });

  it("cancelling a multi-file rotate does not run the operation", async () => {
    answer(false);
    await el._onBulkRotate(rows(2));
    expect(prompts.length).to.equal(1);
    expect(ran).to.deep.equal([]);
  });

  it("single-file overwrite actions are not prompted", async () => {
    answer(false);
    await el._onBulkRotate(rows(1));
    expect(prompts.length).to.equal(0);
    expect(ran).to.deep.equal([1]);
  });

  it("non-destructive duplicate is never prompted", async () => {
    answer(false);
    await el._onBulkDuplicate(rows(5));
    expect(prompts.length).to.equal(0);
    expect(ran).to.deep.equal([5]);
  });
});
