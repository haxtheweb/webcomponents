import { expect, fixture, html } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/backends/haxcms-backend-demo.js";

// The demo backend wires jwt state into the store and syncs the @site/* api
// registries. firstUpdated runs its body after a 500ms timeout; tests that
// need that path wait it out explicitly.

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("haxcms-backend-demo", () => {
  let savedJwt;
  let savedAppSettings;
  let savedCmsSiteEditor;
  let savedAppSettingsGlobal;
  let savedHAXCMSContext;
  let savedList;
  let savedConfig;
  let savedViewOnly;

  beforeEach(() => {
    savedJwt = store.jwt;
    savedAppSettings = store.appSettings;
    savedCmsSiteEditor = store.cmsSiteEditor;
    savedAppSettingsGlobal = globalThis.appSettings;
    savedHAXCMSContext = globalThis.HAXCMSContext;
    savedList = MicroFrontendRegistry.list.slice();
    savedConfig = globalThis.MicroFrontendRegistryConfig;
    savedViewOnly = UserScaffoldInstance.readMemory("ViewOnlyMode");
    globalThis.MicroFrontendRegistryConfig = {};
    MicroFrontendRegistry.setAuthProvider(null);
    store.jwt = null;
    // keep a truthy fake editor instance: firstUpdated timers and the editor
    // module import resolve across test boundaries, and a null instance makes
    // the backend's .then() callback throw (unhandled rejections in logs).
    // A truthy instance also skips constructing the real site editor.
    store.cmsSiteEditor = { instance: { jwt: null } };
    delete globalThis.appSettings;
    delete globalThis.HAXCMSContext;
  });

  afterEach(() => {
    store.jwt = savedJwt;
    store.appSettings = savedAppSettings;
    store.cmsSiteEditor = savedCmsSiteEditor;
    MicroFrontendRegistry.list.length = 0;
    MicroFrontendRegistry.list.push(...savedList);
    globalThis.MicroFrontendRegistryConfig = savedConfig;
    MicroFrontendRegistry.setAuthProvider(null);
    if (savedAppSettingsGlobal === undefined) {
      delete globalThis.appSettings;
    } else {
      globalThis.appSettings = savedAppSettingsGlobal;
    }
    if (savedHAXCMSContext === undefined) {
      delete globalThis.HAXCMSContext;
    } else {
      globalThis.HAXCMSContext = savedHAXCMSContext;
    }
    if (savedViewOnly === null || savedViewOnly === undefined) {
      UserScaffoldInstance.deleteMemory("ViewOnlyMode", "short");
    } else {
      UserScaffoldInstance.writeMemory("ViewOnlyMode", savedViewOnly);
    }
  });

  it("has the expected tag name and defaults", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    expect(el.constructor.tag).to.equal("haxcms-backend-demo");
    expect(el.__disposer.length).to.be.greaterThan(0);
  });

  it("renders a jwt-login element", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    expect(el.shadowRoot.querySelector("jwt-login")).to.exist;
  });

  it("mirrors store.jwt onto the element via the autorun", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    store.jwt = "autorun-jwt";
    await wait(20);
    expect(el.jwt).to.equal("autorun-jwt");
  });

  it("jwtChanged updates element jwt, the store, and the editor instance", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    const editorInstance = { jwt: null };
    store.cmsSiteEditor = { instance: editorInstance };
    await el.jwtChanged({ detail: { value: "new-jwt" } });
    expect(el.jwt).to.equal("new-jwt");
    expect(store.jwt).to.equal("new-jwt");
    expect(editorInstance.jwt).to.equal("new-jwt");
  });

  it("jwtChanged works when no editor instance exists", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    await el.jwtChanged({ detail: { value: "solo-jwt" } });
    expect(store.jwt).to.equal("solo-jwt");
  });

  it("_syncSiteApiRegistry configures the site registry without a system backend", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    el.jwt = "sync-jwt";
    store.appSettings = {};
    await el._syncSiteApiRegistry();
    // no systemApiBasePath in settings: the dynamic system-registry import
    // must be skipped entirely and the site registry no-ops to false
    const state = globalThis.__HAXCMSSiteApiRegistryState;
    expect(state.readyPromise).to.exist;
    expect(await state.readyPromise).to.equal(false);
    expect(state.auth.jwt).to.equal("sync-jwt");
  });

  it("_syncSiteApiRegistry registers demo operations in demo context", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    el.jwt = "demo-jwt";
    globalThis.HAXCMSContext = "demo";
    store.appSettings = { demoSiteApiBasePath: "test/fixtures" };
    await el._syncSiteApiRegistry();
    expect(MicroFrontendRegistry.has("@site/listEntityDescriptors")).to.equal(
      true,
    );
    expect(MicroFrontendRegistry.has("@site/getSiteOpenApiJson")).to.equal(
      true,
    );
    const op = MicroFrontendRegistry.get("@site/listEntityDescriptors");
    expect(op.endpoint).to.equal("test/fixtures/entities.json");
    const state = globalThis.__HAXCMSSiteApiRegistryState;
    expect(await state.readyPromise).to.equal(true);
  });

  it("firstUpdated applies appSettings to the jwt-login element after the timeout", async () => {
    globalThis.appSettings = {
      login: "/session/login",
      refreshUrl: "/session/refresh",
      logout: "/session/logout",
      redirectUrl: "/redirect",
      jwt: "app-jwt",
    };
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    await wait(600);
    expect(store.appSettings.login).to.equal("/session/login");
    const jwtlogin = el.shadowRoot.querySelector("#jwt");
    expect(jwtlogin.url).to.equal("/session/login");
    expect(jwtlogin.refreshUrl).to.equal("/session/refresh");
    expect(jwtlogin.logoutUrl).to.equal("/session/logout");
    expect(jwtlogin.redirectUrl).to.equal("/redirect");
    expect(el.jwt).to.equal("app-jwt");
  });

  it("firstUpdated skips the editor import in view-only mode", async () => {
    UserScaffoldInstance.writeMemory("ViewOnlyMode", true);
    globalThis.appSettings = { login: "/session/login" };
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    await wait(600);
    // view-only mode short-circuits editor availability entirely
    expect(store.cmsSiteEditorAvailability()).to.equal(null);
    expect(el).to.exist;
  });

  it("_jwtChanged is a harmless no-op hook", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    expect(() => el._jwtChanged("x")).to.not.throw();
  });

  it("disconnectedCallback disposes registered autoruns", async () => {
    const el = await fixture(html`<haxcms-backend-demo></haxcms-backend-demo>`);
    el.remove();
    expect(el.__disposer.length).to.be.greaterThan(0);
    // after disconnect the autorun must not fire: mutating the store
    // should no longer update the element's jwt
    store.jwt = "post-disconnect";
    await wait(20);
    expect(el.jwt).to.not.equal("post-disconnect");
  });
});
