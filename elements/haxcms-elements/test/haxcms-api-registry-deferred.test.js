import { expect } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  configureHAXCMSSiteApiRegistry,
  deferHAXCMSSiteApiRegistry,
  waitForHAXCMSSiteApiRegistryReady,
} from "../lib/core/utils/haxcms-site-api-registry.js";
import "../lib/core/backends/haxcms-backend-php.js";
import "../lib/core/backends/haxcms-backend-nodejs.js";
import { store } from "../lib/core/haxcms-site-store.js";

// Visitors without a session no longer download the site and system OpenAPI
// specs at boot (178 KB + 88 KB raw on a live site). The site registry is
// deferred until something needs it; logged-in boot is unchanged.

const SPEC = {
  openapi: "3.0.0",
  paths: {
    "/x/api/v1/site": {
      get: { operationId: "getSiteSummary", summary: "Site summary" },
    },
  },
};

const getState = () => globalThis.__HAXCMSSiteApiRegistryState;
function resetState() {
  const state = getState();
  if (state) {
    state.appSettings = {};
    state.auth = { jwt: "", siteToken: "", userToken: "" };
    state.securitySchemes = {};
    state.siteApiBasePath = "";
    state.siteOpenApiPath = "";
    state.readyPromise = null;
    state.bootstrapping = false;
    state.bootstrapped = false;
    state.deferred = false;
    state.previousAuthProvider = null;
    state.providerApplied = false;
  }
}

function recordFetch() {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).indexOf("openapi") !== -1) {
      return { ok: true, json: async () => SPEC };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

describe("site API registry: deferred for visitors without a session", () => {
  let savedList;
  let f;
  beforeEach(() => {
    savedList = MicroFrontendRegistry.list.slice();
    MicroFrontendRegistry.setAuthProvider(null);
    resetState();
    f = recordFetch();
  });
  afterEach(() => {
    f.restore();
    MicroFrontendRegistry.list.length = 0;
    MicroFrontendRegistry.list.push(...savedList);
    MicroFrontendRegistry.setAuthProvider(null);
    resetState();
  });

  it("defer does not download the spec", async () => {
    const ok = await deferHAXCMSSiteApiRegistry({ siteApiBasePath: "/x/api" });
    expect(ok).to.equal(false);
    expect(f.calls.length).to.equal(0);
    expect(getState().deferred).to.equal(true);
    expect(MicroFrontendRegistry.has("@site/getSiteSummary")).to.equal(false);
  });

  it("the first waitFor...Ready() loads it", async () => {
    deferHAXCMSSiteApiRegistry({ siteApiBasePath: "/x/api" });
    const ok = await waitForHAXCMSSiteApiRegistryReady();
    expect(ok).to.equal(true);
    expect(f.calls).to.deep.equal(["/x/api/openapi.json"]);
    expect(getState().deferred).to.equal(false);
    expect(MicroFrontendRegistry.has("@site/getSiteSummary")).to.equal(true);
    // later waits reuse it
    await waitForHAXCMSSiteApiRegistryReady();
    expect(f.calls.length).to.equal(1);
  });

  it("a later configure (login) loads it", async () => {
    deferHAXCMSSiteApiRegistry({ siteApiBasePath: "/x/api" });
    const ok = await configureHAXCMSSiteApiRegistry(
      { siteApiBasePath: "/x/api" },
      "jwt-after-login",
    );
    expect(ok).to.equal(true);
    expect(f.calls.length).to.equal(1);
    expect(getState().auth.jwt).to.equal("jwt-after-login");
  });

  it("defer after it is loaded keeps it loaded and clears the jwt (logout)", async () => {
    await configureHAXCMSSiteApiRegistry(
      { siteApiBasePath: "/x/api" },
      "jwt-1",
    );
    await deferHAXCMSSiteApiRegistry({ siteApiBasePath: "/x/api" }, null);
    expect(getState().deferred).to.equal(false);
    expect(getState().bootstrapped).to.equal(true);
    expect(getState().auth.jwt).to.equal("");
    expect(MicroFrontendRegistry.has("@site/getSiteSummary")).to.equal(true);
    expect(f.calls.length).to.equal(1);
  });

  it("defer with no site API paths resolves false and stays idle", async () => {
    const ok = await deferHAXCMSSiteApiRegistry({});
    expect(ok).to.equal(false);
    expect(getState().deferred).to.equal(false);
    expect(await waitForHAXCMSSiteApiRegistryReady()).to.equal(false);
    expect(f.calls.length).to.equal(0);
  });
});

describe("backends: anonymous boot downloads no OpenAPI spec", () => {
  let savedList;
  let f;
  let savedSettings;
  beforeEach(async () => {
    savedList = MicroFrontendRegistry.list.slice();
    MicroFrontendRegistry.setAuthProvider(null);
    resetState();
    f = recordFetch();
    const { store } = await import("../lib/core/haxcms-site-store.js");
    savedSettings = { appSettings: store.appSettings, jwt: store.jwt };
    store.jwt = null;
    store.appSettings = {
      siteApiBasePath: "/x/api",
      systemApiBasePath: "/system/api/v1",
    };
  });
  afterEach(async () => {
    f.restore();
    const { store } = await import("../lib/core/haxcms-site-store.js");
    store.appSettings = savedSettings.appSettings;
    store.jwt = savedSettings.jwt;
    MicroFrontendRegistry.list.length = 0;
    MicroFrontendRegistry.list.push(...savedList);
    MicroFrontendRegistry.setAuthProvider(null);
    resetState();
  });

  for (const tag of ["haxcms-backend-php", "haxcms-backend-nodejs"]) {
    it(`${tag}: no session, no spec downloads`, async () => {
      const el = document.createElement(tag);
      el.jwt = null;
      await el._syncSiteApiRegistry();
      expect(f.calls.filter((u) => u.indexOf("openapi") !== -1)).to.deep.equal(
        [],
      );
      expect(el.__systemRegistryLoaded).to.not.equal(true);
      expect(getState().deferred).to.equal(true);
    });

    it(`${tag}: with a session, both registries load`, async () => {
      const el = document.createElement(tag);
      store.jwt = "a.b.c";
      el.jwt = "a.b.c";
      await el._syncSiteApiRegistry();
      await waitForHAXCMSSiteApiRegistryReady();
      expect(f.calls).to.include("/system/api/v1/openapi.json");
      expect(f.calls).to.include("/x/api/openapi.json");
      expect(el.__systemRegistryLoaded).to.equal(true);
    });

    it(`${tag}: logout after login still updates the system registry`, async () => {
      const el = document.createElement(tag);
      store.jwt = "a.b.c";
      el.jwt = "a.b.c";
      await el._syncSiteApiRegistry();
      const system = globalThis.__AppHaxSystemApiRegistryState;
      expect(system.auth.jwt).to.equal("a.b.c");
      store.jwt = null;
      el.jwt = null;
      await el._syncSiteApiRegistry();
      // the system registry was configured again, so it dropped the old jwt
      expect(system.auth.jwt).to.equal("");
      expect(getState().auth.jwt).to.equal("");
    });
  }
});
