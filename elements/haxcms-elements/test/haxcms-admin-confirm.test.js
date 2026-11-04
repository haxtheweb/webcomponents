import { expect, waitUntil } from "@open-wc/testing";
import {
  adminConfirm,
  adminPrompt,
} from "../lib/core/admin/haxcms-admin-confirm.js";

const current = async () => {
  await waitUntil(() => document.querySelector("haxcms-admin-confirm"));
  const el = document.querySelector("haxcms-admin-confirm");
  await el.updateComplete;
  await waitUntil(() => el.shadowRoot.querySelector("dialog").open);
  return el;
};

describe("haxcms-admin-confirm", () => {
  afterEach(() => {
    document
      .querySelectorAll("haxcms-admin-confirm")
      .forEach((n) => n.remove());
  });

  it("confirm resolves true from its action and removes itself", async () => {
    const answer = adminConfirm({
      title: "Delete files",
      message: "Delete 3 selected files? This cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      danger: true,
    });
    const el = await current();
    const root = el.shadowRoot;
    const dialog = root.querySelector("dialog");
    expect(dialog.getAttribute("role")).to.equal("alertdialog");
    expect(root.querySelector("h3").textContent).to.equal("Delete files");
    expect(root.querySelector("p").textContent).to.contain("3 selected");
    // the safe choice is focused, and a destructive action looks like one
    expect(root.activeElement).to.equal(root.querySelector(".cancel"));
    expect(root.querySelector(".ok").classList.contains("danger-fill")).to.be
      .true;
    expect(root.querySelector(".ok").textContent.trim()).to.equal("Delete");
    root.querySelector(".ok").click();
    expect(await answer).to.equal(true);
    expect(document.querySelector("haxcms-admin-confirm")).to.equal(null);
  });

  it("confirm resolves false from Cancel and from Escape", async () => {
    let answer = adminConfirm({ title: "Sure?" });
    let el = await current();
    expect(el.shadowRoot.querySelector(".ok").classList.contains("primary")).to
      .be.true;
    el.shadowRoot.querySelector(".cancel").click();
    expect(await answer).to.equal(false);

    answer = adminConfirm({ title: "Sure?" });
    el = await current();
    el.shadowRoot
      .querySelector("dialog")
      .dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(await answer).to.equal(false);
  });

  it("prompt returns the trimmed answer, or null when cancelled", async () => {
    let answer = adminPrompt({
      title: "Rename skeleton",
      label: "Skeleton name",
      value: "Course",
    });
    let el = await current();
    const input = el.shadowRoot.querySelector("input");
    expect(el.shadowRoot.activeElement).to.equal(input);
    expect(input.value).to.equal("Course");
    expect(el.shadowRoot.querySelector("label").textContent).to.equal(
      "Skeleton name",
    );
    input.value = "  Course two  ";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".ok").click();
    expect(await answer).to.equal("Course two");

    answer = adminPrompt({ title: "Rename", value: "x" });
    el = await current();
    el.shadowRoot.querySelector(".cancel").click();
    expect(await answer).to.equal(null);
  });

  it("a required prompt keeps its action off until something is typed", async () => {
    const answer = adminPrompt({ title: "Import from a URL", required: true });
    const el = await current();
    const ok = el.shadowRoot.querySelector(".ok");
    expect(ok.disabled).to.be.true;
    const input = el.shadowRoot.querySelector("input");
    // Enter on an empty required field does nothing
    el.shadowRoot.querySelector("form").requestSubmit();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("dialog").open).to.be.true;
    input.value = "https://example.com";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(ok.disabled).to.be.false;
    el.shadowRoot.querySelector("form").requestSubmit();
    expect(await answer).to.equal("https://example.com");
  });
});
