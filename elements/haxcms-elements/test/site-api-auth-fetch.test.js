import { expect } from "@open-wc/testing";
import {
  SITE_API_STATE_KEY,
  getSiteApiJwt,
  getSiteApiAuthHeaders,
  requestSiteApiJwtRefresh,
  siteApiFetch,
} from "../lib/core/utils/site-api-auth-fetch.js";

// Files that call x/api/v1 directly for export / print.
const siteExportsAs = [
  "ExportSiteProgram.js",
  "ExportPageProgram.js",
  "PDFPageMixin.js",
  "PrintProgram.js",
  "PrintBranchMixin.js",
];

// The HAXcms site API only reads credentials from the Authorization header.
// A cookie-only fetch from a logged-in editor is answered as anonymous, which
// made pdf / docx / epub exports 401 while every server-side test (which sent
// a bearer token) passed. These tests pin the client half of that contract.

function headersOf(init) {
  const headers = (init && init.headers) || {};
  const out = {};
  Object.keys(headers).forEach((key) => {
    out[key.toLowerCase()] = headers[key];
  });
  return out;
}

describe("site-api-auth-fetch", () => {
  let savedState;
  let originalFetch;

  beforeEach(() => {
    savedState = globalThis[SITE_API_STATE_KEY];
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis[SITE_API_STATE_KEY] = savedState;
    globalThis.fetch = originalFetch;
  });

  function setJwt(jwt) {
    globalThis[SITE_API_STATE_KEY] = Object.assign({}, savedState || {}, {
      auth: { jwt: jwt, siteToken: "", userToken: "" },
    });
  }

  it("shares its state key with the site API registry", async () => {
    // importing the registry must not replace or fork the state object the
    // helper reads; configureHAXCMSSiteApiRegistry writes auth.jwt into it
    const registry = await import(
      "../lib/core/utils/haxcms-site-api-registry.js"
    );
    const prevFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: false, status: 404 });
    try {
      registry.configureHAXCMSSiteApiRegistry({}, "registry-jwt");
      expect(getSiteApiJwt()).to.equal("registry-jwt");
      registry.configureHAXCMSSiteApiRegistry({}, "");
      expect(getSiteApiJwt()).to.equal("");
    } finally {
      globalThis.fetch = prevFetch;
    }
  });

  it("returns no auth headers when logged out", () => {
    setJwt("");
    expect(getSiteApiAuthHeaders()).to.deep.equal({});
    delete globalThis[SITE_API_STATE_KEY];
    expect(getSiteApiJwt()).to.equal("");
    expect(getSiteApiAuthHeaders()).to.deep.equal({});
  });

  it("builds a bearer header from the registry JWT", () => {
    setJwt("  abc.def.ghi  ");
    expect(getSiteApiAuthHeaders()).to.deep.equal({
      Authorization: "Bearer abc.def.ghi",
    });
  });

  it("sends Authorization and keeps cookies when logged in", async () => {
    setJwt("token-1");
    let seen = null;
    globalThis.fetch = async (url, init) => {
      seen = init;
      return { ok: true, status: 200 };
    };
    await siteApiFetch("x/api/v1/site/export/pdf", {
      headers: { Accept: "application/pdf" },
    });
    expect(headersOf(seen).authorization).to.equal("Bearer token-1");
    expect(headersOf(seen).accept).to.equal("application/pdf");
    expect(seen.credentials).to.equal("include");
  });

  it("lets the caller's credentials mode and Authorization win", async () => {
    setJwt("token-1");
    let seen = null;
    globalThis.fetch = async (url, init) => {
      seen = init;
      return { ok: true, status: 200 };
    };
    await siteApiFetch("x/api/v1/content", {
      credentials: "same-origin",
      headers: { authorization: "Basic dTpw" },
    });
    expect(seen.credentials).to.equal("same-origin");
    expect(headersOf(seen).authorization).to.equal("Basic dTpw");
  });

  it("sends no Authorization when logged out (published sites)", async () => {
    setJwt("");
    let seen = null;
    globalThis.fetch = async (url, init) => {
      seen = init;
      return { ok: true, status: 200 };
    };
    await siteApiFetch("x/api/v1/site/export/html");
    expect(headersOf(seen)).to.not.have.property("authorization");
  });

  it("does not try to refresh on 401 (no credentials is not refreshable)", async () => {
    setJwt("token-1");
    let calls = 0;
    let refreshAsked = false;
    const onRefresh = () => {
      refreshAsked = true;
    };
    globalThis.addEventListener("jwt-login-refresh-token", onRefresh);
    globalThis.fetch = async () => {
      calls++;
      return { ok: false, status: 401 };
    };
    try {
      const res = await siteApiFetch("x/api/v1/site/export/pdf");
      expect(res.status).to.equal(401);
      expect(calls).to.equal(1);
      expect(refreshAsked).to.equal(false);
    } finally {
      globalThis.removeEventListener("jwt-login-refresh-token", onRefresh);
    }
  });

  it("refreshes the JWT on 403 and retries once with the new token", async () => {
    setJwt("stale");
    const onRefresh = (e) => {
      const el = e.detail.element;
      el.obj[el.callback]("fresh", ...el.params);
    };
    globalThis.addEventListener("jwt-login-refresh-token", onRefresh);
    const seen = [];
    globalThis.fetch = async (url, init) => {
      seen.push(headersOf(init).authorization);
      return seen.length === 1
        ? { ok: false, status: 403 }
        : { ok: true, status: 200 };
    };
    try {
      const res = await siteApiFetch("x/api/v1/site/export/pdf");
      expect(res.status).to.equal(200);
      expect(seen).to.deep.equal(["Bearer stale", "Bearer fresh"]);
    } finally {
      globalThis.removeEventListener("jwt-login-refresh-token", onRefresh);
    }
  });

  it("returns the 403 when the refresh fails", async () => {
    setJwt("stale");
    const onRefresh = () => {
      globalThis.dispatchEvent(new CustomEvent("jwt-login-refresh-error"));
    };
    globalThis.addEventListener("jwt-login-refresh-token", onRefresh);
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return { ok: false, status: 403 };
    };
    try {
      const res = await siteApiFetch("x/api/v1/site/export/pdf");
      expect(res.status).to.equal(403);
      expect(calls).to.equal(1);
    } finally {
      globalThis.removeEventListener("jwt-login-refresh-token", onRefresh);
    }
  });

  it("gives up on a refresh nobody answers", async () => {
    const jwt = await requestSiteApiJwtRefresh(20);
    expect(jwt).to.equal("");
  });

  // Regression guard: every export / print path that calls the site API
  // directly must go through siteApiFetch. A bare fetch() there compiles,
  // passes mocked unit tests, and 401s for real logged-in users.
  describe("export and print paths never use a bare fetch()", () => {
    siteExportsAs.forEach((file) => {
      it(`${file} uses siteApiFetch`, async () => {
        const src = await (
          await originalFetch(
            new URL(`../lib/core/utils/${file}`, import.meta.url),
          )
        ).text();
        expect(
          src.includes('from "./site-api-auth-fetch.js"'),
          `${file} must import siteApiFetch from ./site-api-auth-fetch.js`,
        ).to.equal(true);
        expect(
          /(^|[^\w])fetch\(/m.test(src),
          `${file} calls fetch() directly; use siteApiFetch() so the editor JWT is sent`,
        ).to.equal(false);
      });
    });
  });
});
