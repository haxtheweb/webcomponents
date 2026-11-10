import { expect } from "@open-wc/testing";
import { toJS } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import { HAXCMSBackendNodeJS } from "../lib/core/backends/haxcms-backend-nodejs.js";
import { HAXCMSBackendPHP } from "../lib/core/backends/haxcms-backend-php.js";
import {
  USER_TOKEN_HEADER,
  SITE_TOKEN_HEADER,
} from "../lib/core/utils/session-request-tokens.js";

// haxcms-backend-nodejs and haxcms-backend-php decide whether the editor is
// loaded at all: a JWT has to look valid, and when the backend gives a
// connectionTest endpoint the server has to confirm the session before
// haxcms-site-editor is imported. Anything else clears the JWT and fires
// haxcms-not-logged-in. Both backends must behave the same, so every case
// runs against both. The elements are created but never attached, so their
// firstUpdated() boot (which reads globalThis.appSettings) never runs and
// each test drives the gate directly with a stubbed fetch.

// test-only credentials, generated per run
function randomHex(bytes = 16) {
  const buf = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}
const testJwt = () => `test.${randomHex()}.jwt`;

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

[
  ["haxcms-backend-nodejs", HAXCMSBackendNodeJS],
  ["haxcms-backend-php", HAXCMSBackendPHP],
].forEach(([tag, BackendClass]) => {
  describe(`${tag} auth gate`, () => {
    let el;
    let saved;
    let fetchCalls;
    let fetchImpl;
    let notLoggedIn;
    let editorImports;
    const onNotLoggedIn = () => {
      notLoggedIn += 1;
    };

    beforeEach(async () => {
      saved = {
        fetch: globalThis.fetch,
        appSettings: toJS(store.appSettings),
        globalAppSettings: globalThis.appSettings,
        jwt: store.jwt,
        connectionValidated: store.connectionValidated,
      };
      fetchCalls = [];
      fetchImpl = async () => jsonResponse({ authenticated: false });
      globalThis.fetch = (url, options) => {
        // jwt changes re-sync the API registries, which load the system
        // OpenAPI spec; only the connection test calls are of interest here
        if (/openapi\.json$/.test(String(url))) {
          return Promise.resolve(jsonResponse({}, false, 404));
        }
        fetchCalls.push({ url: String(url), options });
        return fetchImpl(url, options);
      };
      notLoggedIn = 0;
      globalThis.addEventListener("haxcms-not-logged-in", onNotLoggedIn);
      store.jwt = null;
      store.connectionValidated = false;
      store.appSettings = {};
      el = document.createElement(tag);
      expect(el).to.be.instanceOf(BackendClass);
      editorImports = 0;
      // never pull the real editor into the test page
      el.dynamicallyImportEditor = () => {
        editorImports += 1;
      };
      // let the constructor's store.jwt autorun settle before tests set jwt
      await flush();
    });

    afterEach(async () => {
      await flush();
      (el.__disposer || []).forEach((d) => {
        if (typeof d === "function") {
          d();
        } else if (d && typeof d.dispose === "function") {
          d.dispose();
        }
      });
      globalThis.removeEventListener("haxcms-not-logged-in", onNotLoggedIn);
      globalThis.fetch = saved.fetch;
      globalThis.appSettings = saved.globalAppSettings;
      store.appSettings = saved.appSettings;
      store.jwt = saved.jwt;
      store.connectionValidated = saved.connectionValidated;
    });

    describe("_hasValidJWT", () => {
      it("accepts only non-empty strings other than 'null'", () => {
        expect(el._hasValidJWT(testJwt())).to.equal(true);
        expect(el._hasValidJWT("x")).to.equal(true);
        expect(el._hasValidJWT(null)).to.equal(false);
        expect(el._hasValidJWT(undefined)).to.equal(false);
        expect(el._hasValidJWT("")).to.equal(false);
        expect(el._hasValidJWT("null")).to.equal(false);
        expect(el._hasValidJWT(12345)).to.equal(false);
        expect(el._hasValidJWT({})).to.equal(false);
      });
    });

    describe("without a connectionTest endpoint", () => {
      it("trusts a JWT that looks valid, without calling the server", async () => {
        el.jwt = testJwt();
        expect(await el._runConnectionTest()).to.equal(true);
        expect(store.connectionValidated).to.equal(true);
        expect(fetchCalls.length).to.equal(0);
      });

      it("rejects a missing JWT", async () => {
        el.jwt = null;
        expect(await el._runConnectionTest()).to.equal(false);
        expect(store.connectionValidated).to.equal(false);
        expect(fetchCalls.length).to.equal(0);
      });
    });

    describe("with a connectionTest endpoint", () => {
      const endpoint = "/system/api/v1/connectionTest";
      beforeEach(() => {
        store.appSettings = { connectionTest: endpoint };
      });

      it("POSTs with the JWT as a bearer token and cookies included", async () => {
        const jwt = testJwt();
        el.jwt = jwt;
        fetchImpl = async () => jsonResponse({ authenticated: true });
        expect(await el._runConnectionTest()).to.equal(true);
        expect(fetchCalls.length).to.equal(1);
        const { url, options } = fetchCalls[0];
        expect(url).to.equal(endpoint);
        expect(options.method).to.equal("POST");
        expect(options.credentials).to.equal("include");
        expect(options.headers.Authorization).to.equal(`Bearer ${jwt}`);
        expect(options.headers["Content-Type"]).to.equal("application/json");
        expect(options.body).to.equal("{}");
        expect(store.connectionValidated).to.equal(true);
        expect(store.jwt).to.equal(jwt);
      });

      it("sends no Authorization header without a JWT (cookie refresh)", async () => {
        el.jwt = null;
        const issued = testJwt();
        fetchImpl = async () =>
          jsonResponse({ authenticated: true, jwt: issued });
        expect(await el._runConnectionTest()).to.equal(true);
        expect(fetchCalls[0].options.headers).to.not.have.property(
          "Authorization",
        );
        // the server-issued JWT is adopted
        expect(el.jwt).to.equal(issued);
        expect(store.jwt).to.equal(issued);
        expect(el.__ignoreNextJwtValidation).to.equal(issued);
      });

      it("adopts a rotated JWT from the server", async () => {
        const first = testJwt();
        const rotated = testJwt();
        el.jwt = first;
        fetchImpl = async () =>
          jsonResponse({ authenticated: true, jwt: rotated });
        expect(await el._runConnectionTest()).to.equal(true);
        expect(el.jwt).to.equal(rotated);
        expect(store.jwt).to.equal(rotated);
        expect(el.__validatedJwt).to.equal(rotated);
      });

      it("does not ask again for a JWT it already validated", async () => {
        el.jwt = testJwt();
        fetchImpl = async () => jsonResponse({ authenticated: true });
        expect(await el._runConnectionTest()).to.equal(true);
        expect(await el._runConnectionTest()).to.equal(true);
        expect(fetchCalls.length).to.equal(1);
        // a new JWT is checked again
        el.jwt = testJwt();
        expect(await el._runConnectionTest()).to.equal(true);
        expect(fetchCalls.length).to.equal(2);
      });

      it("shares one request between overlapping checks", async () => {
        el.jwt = testJwt();
        let release;
        fetchImpl = () =>
          new Promise((resolve) => {
            release = () => resolve(jsonResponse({ authenticated: true }));
          });
        const a = el._runConnectionTest();
        const b = el._runConnectionTest();
        await flush();
        release();
        expect(await a).to.equal(true);
        expect(await b).to.equal(true);
        expect(fetchCalls.length).to.equal(1);
        expect(el.__connectionTestPending).to.equal(null);
      });

      const failures = [
        [
          "the server says not authenticated",
          async () => jsonResponse({ authenticated: false }),
        ],
        [
          "the response is not ok",
          async () => jsonResponse({ authenticated: true }, false, 401),
        ],
        [
          "the body is not JSON",
          async () => ({
            ok: true,
            status: 200,
            json: async () => {
              throw new SyntaxError("bad json");
            },
          }),
        ],
        [
          "the request fails",
          async () => {
            throw new TypeError("network down");
          },
        ],
        [
          "it is authenticated but gives no usable JWT",
          async () => jsonResponse({ authenticated: true, jwt: "" }),
        ],
      ];
      failures.forEach(([label, impl]) => {
        it(`fails closed when ${label}`, async () => {
          el.jwt = label.indexOf("no usable JWT") !== -1 ? null : testJwt();
          store.connectionValidated = true;
          fetchImpl = impl;
          expect(await el._runConnectionTest()).to.equal(false);
          expect(store.connectionValidated).to.equal(false);
          expect(el.__validatedJwt).to.equal("");
          expect(el.__connectionTestPending).to.equal(null);
        });
      });

      it("stores request tokens from the connection test", async () => {
        const userToken = randomHex();
        const siteToken = randomHex();
        globalThis.appSettings = {
          connectionTest: endpoint,
          appStore: { url: "appstore.json" },
        };
        store.appSettings = {
          connectionTest: endpoint,
          appStore: { url: "appstore.json" },
        };
        el.jwt = testJwt();
        fetchImpl = async () =>
          jsonResponse({
            authenticated: true,
            data: { userToken: ` ${userToken} `, siteToken },
          });
        expect(await el._runConnectionTest()).to.equal(true);
        const settings = toJS(store.appSettings);
        expect(settings.userToken).to.equal(userToken);
        expect(settings.siteToken).to.equal(siteToken);
        expect(settings.getUserDataHeaders[USER_TOKEN_HEADER]).to.equal(
          userToken,
        );
        expect(settings.appStore.headers[SITE_TOKEN_HEADER]).to.equal(
          siteToken,
        );
        // the global settings are updated in place too
        expect(globalThis.appSettings.userToken).to.equal(userToken);
        expect(
          globalThis.appSettings.appStore.headers[SITE_TOKEN_HEADER],
        ).to.equal(siteToken);
      });
    });

    describe("_applySessionRequestTokens", () => {
      it("ignores payloads without tokens", () => {
        store.appSettings = { connectionTest: "/x" };
        const before = toJS(store.appSettings);
        expect(el._applySessionRequestTokens(null)).to.equal(false);
        expect(el._applySessionRequestTokens({})).to.equal(false);
        expect(
          el._applySessionRequestTokens({ userToken: "   ", siteToken: 5 }),
        ).to.equal(false);
        expect(toJS(store.appSettings)).to.deep.equal(before);
      });

      it("does not add app store headers when there is no app store", () => {
        const siteToken = randomHex();
        globalThis.appSettings = {};
        store.appSettings = {};
        expect(el._applySessionRequestTokens({ siteToken })).to.equal(true);
        const settings = toJS(store.appSettings);
        expect(settings.siteToken).to.equal(siteToken);
        expect(settings).to.not.have.property("appStore");
      });

      it("picks up tokens re-broadcast by jwt-login", () => {
        const userToken = randomHex();
        globalThis.appSettings = {};
        store.appSettings = {};
        el.sessionTokensReceived({ detail: { userToken } });
        expect(toJS(store.appSettings).userToken).to.equal(userToken);
        // and ignores events without detail
        el.sessionTokensReceived({});
        el.sessionTokensReceived(null);
      });
    });

    describe("_gateEditorAccess", () => {
      it("loads the editor once the session is confirmed", async () => {
        el.jwt = testJwt();
        await el._gateEditorAccess();
        expect(editorImports).to.equal(1);
        expect(notLoggedIn).to.equal(0);
      });

      it("clears the JWT and reports not logged in when rejected", async () => {
        store.appSettings = { connectionTest: "/system/api/v1/connectionTest" };
        el.jwt = testJwt();
        store.jwt = el.jwt;
        fetchImpl = async () => jsonResponse({ authenticated: false });
        await el._gateEditorAccess();
        expect(editorImports).to.equal(0);
        expect(el.jwt).to.equal(null);
        expect(store.jwt).to.equal(null);
        expect(store.connectionValidated).to.equal(false);
        expect(notLoggedIn).to.equal(1);
      });

      it("reaches the editor instance when one is loaded", async () => {
        store.appSettings = { connectionTest: "/system/api/v1/connectionTest" };
        const savedEditor = store.cmsSiteEditor;
        const instance = { jwt: "stale" };
        store.cmsSiteEditor = { instance };
        try {
          el.jwt = testJwt();
          fetchImpl = async () => jsonResponse({ authenticated: false });
          await el._gateEditorAccess();
          expect(instance.jwt).to.equal(null);
        } finally {
          store.cmsSiteEditor = savedEditor;
        }
      });
    });

    describe("jwtChanged", () => {
      it("reports not logged in for an empty JWT without calling the server", async () => {
        store.appSettings = { connectionTest: "/system/api/v1/connectionTest" };
        await el.jwtChanged({ detail: { value: "" } });
        expect(store.jwt).to.equal("");
        expect(store.connectionValidated).to.equal(false);
        expect(notLoggedIn).to.equal(1);
        expect(fetchCalls.length).to.equal(0);
        expect(editorImports).to.equal(0);
      });

      it("validates a new JWT before loading the editor", async () => {
        store.appSettings = { connectionTest: "/system/api/v1/connectionTest" };
        const jwt = testJwt();
        fetchImpl = async () => jsonResponse({ authenticated: true });
        await el.jwtChanged({ detail: { value: jwt } });
        expect(store.jwt).to.equal(jwt);
        expect(fetchCalls.length).to.equal(1);
        expect(editorImports).to.equal(1);
      });

      it("skips re-validating the JWT the server just issued", async () => {
        store.appSettings = { connectionTest: "/system/api/v1/connectionTest" };
        const issued = testJwt();
        el.__ignoreNextJwtValidation = issued;
        await el.jwtChanged({ detail: { value: issued } });
        expect(fetchCalls.length).to.equal(0);
        expect(el.__ignoreNextJwtValidation).to.equal(null);
        expect(store.jwt).to.equal(issued);
      });
    });
  });
});
