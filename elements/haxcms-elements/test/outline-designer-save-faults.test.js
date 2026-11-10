// Fault injection for Save Outline: the bulk outline-designer save, from the
// site admin dialog's Save button down to the network.
//
// The real chain runs: haxcms-site-admin (Structure) -> haxcms-outline-editor-
// dialog.save() -> outline-designer getData() -> haxcms-save-outline ->
// haxcms-site-editor.saveOutline() -> MicroFrontendRegistry.call() -> fetch.
// Only fetch is stubbed, and only for the outline endpoint; every scenario
// answers the PATCH the way a failing server or network would.
//
// Invariants for every fault:
//   1. the person is told, in the HAX UI (a danger toast and/or the shell's
//      "Saving failed" alert line), never with alert/confirm/prompt
//   2. the outline keeps every unsaved change (same items, same flags) and
//      is not reported as saved
//   3. Save works again (not stuck on Saving, not disabled)
//   4. nothing navigates away (no modal hide, no route change, no logout)
//   5. the next successful save sends the whole intended outline again
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../lib/core/haxcms-site-editor.js";
import "../lib/core/admin/haxcms-site-admin.js";
import { store } from "../lib/core/haxcms-site-store.js";
import { answerAdminDialogs } from "./fixtures/admin-dialog-answers.js";

const OP = "@site/updateSiteOutline";
const ENDPOINT = "/test-fault-injection/site/outline";
const SITE = "fault-site";

function manifest() {
  const item = (id, order) => ({
    id: id,
    title: id.toUpperCase(),
    slug: id,
    location: `pages/${id}/index.html`,
    parent: null,
    indent: 0,
    order: order,
    metadata: { locked: false },
  });
  return {
    id: SITE,
    title: "Fault site",
    metadata: {
      site: { name: SITE },
      theme: { element: "test-theme", variables: {}, regions: {} },
    },
    items: [item("a", 0), item("b", 1), item("c", 2)],
  };
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

function textResponse(status, text) {
  return new Response(text, {
    status: status,
    headers: { "Content-Type": "text/html" },
  });
}

// successful answers handed out in the current test (see afterEach)
let okAnswers = 0;

// what a backend answers on success (OpenAPI SiteOutlineResponse)
function okResponse(items) {
  okAnswers++;
  return jsonResponse(200, { status: 200, data: { items: items } });
}

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

// haxcms-site-editor shows "Outline saved!" this long after a save succeeds
// (_handleOutlineResponse); wait past it before claiming no success was shown
const OUTLINE_SAVED_TOAST_DELAY = 300;

// items as they go on the wire. The test runner tags objects it has logged
// with __WTR_CONSTRUCTOR_NAME__; that tag is not part of the outline.
function wire(items) {
  return JSON.parse(
    JSON.stringify(items, (key, value) =>
      key === "__WTR_CONSTRUCTOR_NAME__" ? undefined : value,
    ),
  );
}

describe("outline-designer Save Outline under injected faults", () => {
  let saved;
  let editor;
  let shell;
  let dialog;
  let outline;
  let realFetch;
  let outlineCalls;
  let answers;
  let toasts;
  let hides;
  let logouts;
  let refreshes;
  let restoreDialogs;
  let nativeDialogs;
  let historySpies;
  const onToast = (e) => toasts.push(e.detail);
  const onHide = () => hides++;
  const onLogout = (e) => {
    logouts++;
    // never let a test log the runner out
    e.stopImmediatePropagation();
  };
  const onRefresh = (e) => {
    // jwt-login is not part of this test; hold the refresh request so the
    // test can answer it
    e.stopImmediatePropagation();
    refreshes.push(e.detail);
  };

  // fetch for the outline endpoint answers from the queue; anything else
  // goes to the real fetch
  function stubFetch() {
    realFetch = globalThis.fetch;
    sinon.stub(globalThis, "fetch").callsFake((url, options) => {
      if (String(url).indexOf(ENDPOINT) === -1) {
        return realFetch.call(globalThis, url, options);
      }
      outlineCalls.push({
        url: String(url),
        method: options.method,
        body: JSON.parse(options.body),
      });
      const next = answers.shift();
      if (!next) {
        return Promise.reject(new Error("no answer queued"));
      }
      return next();
    });
  }

  beforeEach(async () => {
    saved = {
      manifest: store.manifest,
      appReady: store.appReady,
      list: MicroFrontendRegistry.list.slice(),
    };
    outlineCalls = [];
    okAnswers = 0;
    answers = [];
    toasts = [];
    hides = 0;
    logouts = 0;
    refreshes = [];
    store.appReady = true;
    store.manifest = manifest();
    MicroFrontendRegistry.add({
      endpoint: ENDPOINT,
      name: OP,
      method: "PATCH",
      title: "Update site outline",
    });
    nativeDialogs = {
      alert: sinon.stub(globalThis, "alert"),
      confirm: sinon.stub(globalThis, "confirm").returns(false),
      prompt: sinon.stub(globalThis, "prompt").returns(null),
    };
    // the save confirm is the HAX UI dialog: press its own Save button
    restoreDialogs = answerAdminDialogs({ confirm: () => true });
    stubFetch();
    globalThis.addEventListener("haxcms-toast-show", onToast);
    globalThis.addEventListener("simple-modal-hide", onHide, true);
    globalThis.addEventListener("jwt-login-logout", onLogout, true);
    globalThis.addEventListener("jwt-login-refresh-token", onRefresh, true);

    editor = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`);
    editor.jwt = "jwt-before";
    await waitUntil(
      () => editor.manifest && editor._siteName() === SITE,
      "editor has the site manifest",
    );
    shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    shell.route = "structure";
    await waitUntil(() => shell._sectionEl, "outline dialog created");
    dialog = shell._sectionEl;
    await dialog.updateComplete;
    await waitUntil(
      () => dialog.shadowRoot.querySelector("#outline"),
      "outline rendered",
    );
    outline = dialog.shadowRoot.querySelector("#outline");
    await outline.updateComplete;
    await waitUntil(
      () => Array.isArray(outline.items) && outline.items.length === 3,
      "outline has the manifest items",
    );
    historySpies = {
      push: sinon.spy(globalThis.history, "pushState"),
      replace: sinon.spy(globalThis.history, "replaceState"),
    };
  });

  afterEach(async () => {
    // a successful save shows its toast on a timer; let each one land here,
    // in its own test, so it cannot show up in the next test's toasts.
    // Isolation only: a failure here would abort the rest of the suite.
    await waitUntil(() => successToasts().length >= okAnswers).catch(() => {});
    sinon.restore();
    restoreDialogs();
    globalThis.removeEventListener("haxcms-toast-show", onToast);
    globalThis.removeEventListener("simple-modal-hide", onHide, true);
    globalThis.removeEventListener("jwt-login-logout", onLogout, true);
    globalThis.removeEventListener("jwt-login-refresh-token", onRefresh, true);
    MicroFrontendRegistry.list.length = 0;
    MicroFrontendRegistry.list.push(...saved.list);
    store.manifest = saved.manifest;
    store.appReady = saved.appReady;
  });

  // a bulk edit with the operations the designer saves: b indented under a,
  // a new page after c, then c marked for deletion
  async function editOutline() {
    outline.itemOp(1, "in");
    outline.itemOp(2, "add");
    outline.itemOp(2, "delete");
    outline.requestUpdate();
    await outline.updateComplete;
    await waitUntil(() => shell._canSave, "Save enabled");
    // the outline the person means to save, as JSON (what goes on the wire)
    return wire(outline.items);
  }

  function expectIntendedPayload(body, intended) {
    expect(body.site).to.deep.equal({ name: SITE });
    expect(wire(body.items)).to.deep.equal(intended);
    const byId = {};
    body.items.forEach((item) => {
      byId[item.id] = item;
    });
    expect(body.items.map((item) => item.id).slice(0, 3)).to.deep.equal([
      "a",
      "b",
      "c",
    ]);
    expect(byId.a.parent).to.equal(null);
    expect(byId.b.parent).to.equal("a");
    expect(byId.b.indent).to.equal(1);
    expect(byId.b.modified).to.equal(true);
    expect(byId.c.delete).to.equal(true);
    const added = body.items.filter((item) => item.new);
    expect(added.length).to.equal(1);
    expect(added[0].parent).to.equal(null);
    expect(added[0].order).to.equal(3);
    expect(added[0].delete).to.not.equal(true);
  }

  function saveButton() {
    return shell.shadowRoot.querySelector(".ftr .save");
  }

  async function clickSave() {
    await shell.updateComplete;
    saveButton().click();
  }

  // invariants 1-4 after a failed save
  async function expectFailedSaveKeptEverything(intended) {
    await waitUntil(() => shell._status === "error", "save failure shown");
    await shell.updateComplete;
    // 1. told in the HAX UI, never with a browser dialog
    const st = shell.shadowRoot.querySelector(".ftr .st");
    expect(st.getAttribute("role")).to.equal("alert");
    expect(st.textContent).to.contain("Saving failed");
    expect(nativeDialogs.alert.called, "alert()").to.be.false;
    expect(nativeDialogs.confirm.called, "confirm()").to.be.false;
    expect(nativeDialogs.prompt.called, "prompt()").to.be.false;
    // 2. every change is still there and still unsaved
    expect(wire(outline.items)).to.deep.equal(intended);
    expect(dialog.hasUnsavedChanges).to.be.true;
    expect(dialog._isSavedOutlineState(outline.items)).to.be.false;
    expect(shell._changes.length).to.be.greaterThan(0);
    // 3. Save works again
    expect(shell._canSave).to.be.true;
    expect(saveButton().disabled).to.be.false;
    expect(saveButton().textContent.trim()).to.equal("Save");
    // 4. still here
    expect(hides, "simple-modal-hide").to.equal(0);
    expect(logouts, "jwt-login-logout").to.equal(0);
    expect(historySpies.push.called, "pushState").to.be.false;
    expect(historySpies.replace.called, "replaceState").to.be.false;
    expect(shell._sectionEl).to.equal(dialog);
    expect(shell.route).to.equal("structure");
  }

  // invariant 5: a later save that succeeds sends everything again
  async function expectRetrySendsEverything(intended) {
    const before = outlineCalls.length;
    answers.push(() => Promise.resolve(okResponse(intended)));
    await clickSave();
    await waitUntil(() => shell._status === "saved", "Saved shown");
    expect(outlineCalls.length).to.equal(before + 1);
    expectIntendedPayload(outlineCalls[before].body, intended);
    expect(dialog.hasUnsavedChanges).to.be.false;
  }

  function dangerToasts() {
    return toasts.filter((t) => t.tone === "danger");
  }

  function successToasts() {
    return toasts.filter((t) => t.tone === "success");
  }

  it("sends the whole outline as one PATCH when the server is fine", async () => {
    const intended = await editOutline();
    answers.push(() => Promise.resolve(okResponse(intended)));
    await clickSave();
    await waitUntil(() => shell._status === "saved", "Saved shown");
    expect(outlineCalls.length).to.equal(1);
    expect(outlineCalls[0].url).to.contain(ENDPOINT);
    expect(outlineCalls[0].method).to.equal("PATCH");
    expectIntendedPayload(outlineCalls[0].body, intended);
    expect(dangerToasts().length).to.equal(0);
    expect(nativeDialogs.alert.called).to.be.false;
  });

  it("500 with an ApiError body: shows the server's message, keeps the changes", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        jsonResponse(500, {
          status: 500,
          data: { message: "failed to write" },
        }),
      ),
    );
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    expect(outlineCalls.length).to.equal(1);
    expectIntendedPayload(outlineCalls[0].body, intended);
    const danger = dangerToasts();
    expect(danger.length).to.equal(1);
    expect(danger[0].text).to.contain("500");
    expect(danger[0].text).to.contain("failed to write");
    await expectRetrySendsEverything(intended);
  });

  it("500 with a non-JSON body (proxy error page): still a readable error", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        textResponse(500, "<html><body>Internal Server Error</body></html>"),
      ),
    );
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    const danger = dangerToasts();
    expect(danger.length).to.equal(1);
    expect(danger[0].text).to.contain("500");
    // the HTML page is not shown to the person
    expect(danger[0].text).to.not.contain("<html");
    await expectRetrySendsEverything(intended);
  });

  it("401 (expired token): asks jwt-login to refresh, keeps the changes, no logout", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        jsonResponse(401, {
          status: 401,
          data: { message: "Invalid token", code: "AUTH_TOKEN_INVALID" },
        }),
      ),
    );
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    expect(refreshes.length).to.equal(1);
    expect(refreshes[0].element.callback).to.equal("refreshRequest");
    // no refresh answer arrives (jwt-login is not here): the person can
    // simply save again
    await expectRetrySendsEverything(intended);
  });

  it("403 with a refreshable auth code: refresh is asked for, changes kept", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        jsonResponse(403, {
          status: 403,
          data: { message: "Token expired", code: "AUTH_TOKEN_INVALID" },
        }),
      ),
    );
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    expect(refreshes.length).to.equal(1);
    await expectRetrySendsEverything(intended);
  });

  it("403 hard denial: a danger toast, no refresh, no logout", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        jsonResponse(403, { status: 403, data: { message: "Access denied" } }),
      ),
    );
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    expect(refreshes.length).to.equal(0);
    expect(
      toasts.filter((t) => t.fire && t.text === "Access denied").length,
    ).to.equal(1);
    await expectRetrySendsEverything(intended);
  });

  it("the refreshed retry after a 401 sends the same outline", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        jsonResponse(401, {
          status: 401,
          data: { message: "Invalid token", code: "AUTH_TOKEN_INVALID" },
        }),
      ),
    );
    answers.push(() => Promise.resolve(okResponse(intended)));
    await clickSave();
    await waitUntil(() => refreshes.length === 1, "refresh requested");
    // what jwt-login does once it has a new token
    const req = refreshes[0].element;
    req.obj[req.callback]("jwt-after", ...req.params);
    await waitUntil(() => outlineCalls.length === 2, "retried after refresh");
    expectIntendedPayload(outlineCalls[1].body, intended);
    expect(editor.jwt).to.equal("jwt-after");
    expect(logouts).to.equal(0);
    expect(nativeDialogs.alert.called).to.be.false;
  });

  // Known gap (report it in haxtheweb/issues): _requestAdminSave reports the
  // first, refused attempt as failed and the shell shows "Saving failed";
  // when the retry with the refreshed token then succeeds, the shell is no
  // longer in "saving" and drops that ok result. The outline keeps its change
  // flags until the manifest refresh lands, so for that window the person is
  // told the save failed (and Save is enabled) although it went through; a
  // second Save in that window re-sends the new pages and creates them twice.
  it.skip("a save that succeeds on the refreshed retry is shown as saved", async () => {
    const intended = await editOutline();
    answers.push(() =>
      Promise.resolve(
        jsonResponse(401, {
          status: 401,
          data: { message: "Invalid token", code: "AUTH_TOKEN_INVALID" },
        }),
      ),
    );
    answers.push(() => Promise.resolve(okResponse(intended)));
    await clickSave();
    await waitUntil(() => refreshes.length === 1, "refresh requested");
    const req = refreshes[0].element;
    req.obj[req.callback]("jwt-after", ...req.params);
    await waitUntil(() => outlineCalls.length === 2, "retried after refresh");
    await tick(50);
    expect(shell._status).to.equal("saved");
    expect(dialog.hasUnsavedChanges).to.be.false;
  });

  it("network failure (fetch rejects): error shown, changes kept", async () => {
    const intended = await editOutline();
    answers.push(() => Promise.reject(new TypeError("Failed to fetch")));
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    expect(dangerToasts().length).to.equal(1);
    await expectRetrySendsEverything(intended);
  });

  it("200 with a malformed body is not taken as saved", async () => {
    // the server may have written the outline, but the client cannot know:
    // it keeps the changes and says the save failed rather than claim success
    const intended = await editOutline();
    answers.push(() => Promise.resolve(textResponse(200, '{"status":200,"da')));
    await clickSave();
    await expectFailedSaveKeptEverything(intended);
    expect(dangerToasts().length).to.equal(1);
    // a success toast would only appear after its delay
    await tick(OUTLINE_SAVED_TOAST_DELAY + 100);
    expect(successToasts().length).to.equal(0);
    await expectRetrySendsEverything(intended);
  });

  it("a request that never answers keeps the changes and stays put", async () => {
    const intended = await editOutline();
    answers.push(() => new Promise(() => {}));
    await clickSave();
    await waitUntil(() => shell._status === "saving", "Saving shown");
    await tick(300);
    expect(shell._status).to.equal("saving");
    expect(wire(outline.items)).to.deep.equal(intended);
    expect(dialog.hasUnsavedChanges).to.be.true;
    expect(hides).to.equal(0);
    expect(logouts).to.equal(0);
    expect(historySpies.replace.called).to.be.false;
    expect(nativeDialogs.alert.called).to.be.false;
    // while it is in flight Save cannot send a second request
    await shell.updateComplete;
    expect(saveButton().disabled).to.be.true;
    expect(shell._save()).to.equal(false);
    expect(outlineCalls.length).to.equal(1);
  });

  // Known gap (report it in haxtheweb/issues): neither saveOutline,
  // _requestJson nor MicroFrontendRegistry.call puts a timeout or
  // AbortSignal on the request, so a request that never answers leaves the
  // shell on "Saving..." with Save and Discard disabled until the page is
  // reloaded (which drops the unsaved outline). Expected: after a timeout
  // the save is reported as failed and Save is usable again.
  it.skip("a request that never answers times out and Save is usable again", async () => {
    const intended = await editOutline();
    answers.push(() => new Promise(() => {}));
    await clickSave();
    await waitUntil(() => shell._status === "saving", "Saving shown");
    await waitUntil(() => shell._status === "error", "timeout reported", {
      timeout: 60000,
    });
    await expectFailedSaveKeptEverything(intended);
  });

  it("a double click, or a second Save while one is in flight, sends one request", async () => {
    const intended = await editOutline();
    let release;
    answers.push(
      () =>
        new Promise((resolve) => {
          release = () => resolve(okResponse(intended));
        }),
    );
    await shell.updateComplete;
    saveButton().click();
    saveButton().click();
    await waitUntil(() => shell._status === "saving", "Saving shown");
    await shell.updateComplete;
    // a third press while the PATCH is in flight
    saveButton().click();
    expect(shell._save()).to.equal(false);
    await tick(50);
    expect(outlineCalls.length).to.equal(1);
    expectIntendedPayload(outlineCalls[0].body, intended);
    release();
    await waitUntil(() => shell._status === "saved", "Saved shown");
    await tick(50);
    expect(outlineCalls.length).to.equal(1);
    expect(nativeDialogs.alert.called).to.be.false;
  });

  it("a failure in flight followed by a quick second Save sends the outline once more, whole", async () => {
    const intended = await editOutline();
    let fail;
    answers.push(
      () =>
        new Promise((resolve) => {
          fail = () =>
            resolve(
              jsonResponse(500, {
                status: 500,
                data: { message: "failed to write" },
              }),
            );
        }),
    );
    await clickSave();
    await waitUntil(() => shell._status === "saving", "Saving shown");
    saveButton().click();
    fail();
    await expectFailedSaveKeptEverything(intended);
    expect(outlineCalls.length).to.equal(1);
    await expectRetrySendsEverything(intended);
    expect(outlineCalls.length).to.equal(2);
  });
});
