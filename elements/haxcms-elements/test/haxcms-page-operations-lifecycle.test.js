import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { getObserverTree, runInAction } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/micros/haxcms-page-operations.js";

const observers = (prop) => {
  const tree = getObserverTree(store, prop);
  return tree.observers ? tree.observers.length : 0;
};
const settle = () => aTimeout(0);

const MANIFEST = {
  id: "site",
  title: "Lifecycle site",
  metadata: { site: { name: "lifecycle" } },
  items: [
    {
      id: "open",
      title: "Open",
      slug: "open",
      location: "pages/open/index.html",
      order: 0,
      indent: 0,
      parent: null,
      metadata: {},
    },
    {
      id: "locked",
      title: "Locked",
      slug: "locked",
      location: "pages/locked/index.html",
      order: 1,
      indent: 0,
      parent: null,
      metadata: { locked: true },
    },
  ],
};

describe("haxcms-page-operations store subscriptions", () => {
  let saved;
  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
    };
    runInAction(() => {
      store.manifest = JSON.parse(JSON.stringify(MANIFEST));
      store.activeId = "open";
    });
  });
  afterEach(() => {
    runInAction(() => {
      store.manifest = saved.manifest;
      store.activeId = saved.activeId;
      store.editMode = saved.editMode;
    });
  });

  it("does not subscribe to the store until connected", () => {
    const baseItem = observers("activeItem");
    const baseEdit = observers("editMode");
    document.createElement("haxcms-page-operations");
    expect(observers("activeItem")).to.equal(baseItem);
    expect(observers("editMode")).to.equal(baseEdit);
  });

  it("tracks the active item's lock state and edit mode while connected", async () => {
    const el = await fixture(
      html`<haxcms-page-operations></haxcms-page-operations>`,
    );
    await settle();
    expect(el.isLocked).to.equal(false);
    runInAction(() => {
      store.activeId = "locked";
    });
    await settle();
    expect(el.isLocked).to.equal(true);
    runInAction(() => {
      store.editMode = true;
    });
    await settle();
    expect(el.editMode).to.equal(true);
    runInAction(() => {
      store.editMode = false;
      store.activeId = "open";
    });
    await settle();
    expect(el.editMode).to.equal(false);
    expect(el.isLocked).to.equal(false);
  });

  it("releases its subscriptions when removed, over many cycles", async () => {
    const baseItem = observers("activeItem");
    const baseEdit = observers("editMode");
    const host = await fixture(html`<div></div>`);
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("haxcms-page-operations");
      host.appendChild(el);
      await el.updateComplete;
      expect(observers("activeItem")).to.equal(baseItem + 1);
      el.remove();
    }
    expect(observers("activeItem")).to.equal(baseItem);
    expect(observers("editMode")).to.equal(baseEdit);
  });

  it("stops reacting after removal and reacts again when re-added", async () => {
    const host = await fixture(html`<div></div>`);
    const el = document.createElement("haxcms-page-operations");
    host.appendChild(el);
    await settle();
    el.remove();
    runInAction(() => {
      store.activeId = "locked";
    });
    await settle();
    expect(el.isLocked).to.equal(false);
    expect(store.pageOperationsElement).to.not.equal(el);
    host.appendChild(el);
    await settle();
    expect(el.isLocked).to.equal(true);
    expect(store.pageOperationsElement).to.equal(el);
  });
});
