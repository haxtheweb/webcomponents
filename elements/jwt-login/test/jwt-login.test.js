import { fixture, expect, html } from "@open-wc/testing";

import "../jwt-login.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const okJson = (body) => ({
  ok: true,
  json: async () => body,
});

const badResponse = () => ({
  ok: false,
  status: 401,
});

const makeJwt = (payload) => {
  const b64 = globalThis.btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `header.${b64}.signature`;
};

describe("jwt-login test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <jwt-login title="test-title"></jwt-login> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("jwt-login behavior", () => {
  let element;
  let fetchCalls;
  let originalFetch;

  beforeEach(async () => {
    fetchCalls = [];
    originalFetch = globalThis.fetch;
    globalThis.fetch = (url, init) => {
      fetchCalls.push({ url: url, init: init });
      return Promise.resolve(okJson({ jwt: "stub-jwt" }));
    };
    element = await fixture(html`<jwt-login></jwt-login>`);
  });

  afterEach(async () => {
    globalThis.fetch = originalFetch;
    if (element && element.parentNode) {
      element.remove();
    }
    await sleep(0);
  });

  it("has default state", () => {
    expect(element.auto).to.equal(false);
    expect(element.method).to.equal("GET");
    expect(element.body).to.deep.equal({});
    expect(element.key).to.equal("jwt");
    expect(element.jwt).to.equal(null);
    expect(element.url).to.equal(undefined);
    expect(element.ready).to.equal(true);
  });

  it("firstUpdated clears stale localStorage tokens", async () => {
    localStorage.setItem("jwt", "stale-token");
    const el = await fixture(html`<jwt-login></jwt-login>`);
    await sleep(20);
    expect(localStorage.getItem("jwt")).to.equal(null);
    el.remove();
  });

  it("_jwtChanged dispatches token events for a string value", async () => {
    const tokens = [];
    const loggedIn = [];
    element.addEventListener("jwt-token", (e) => tokens.push(e.detail));
    element.addEventListener("jwt-logged-in", (e) => loggedIn.push(e.detail));
    element.jwt = "my-jwt";
    await sleep(0);
    expect(tokens).to.deep.equal(["my-jwt"]);
    expect(loggedIn).to.deep.equal([true]);
  });

  it("_jwtChanged unwraps object tokens", async () => {
    const tokens = [];
    element.addEventListener("jwt-token", (e) => tokens.push(e.detail));
    element.jwt = { jwt: "wrapped-jwt" };
    await sleep(0);
    expect(tokens).to.deep.equal(["wrapped-jwt"]);
  });

  it("_jwtChanged dispatches logged-out when the jwt clears", async () => {
    const loggedIn = [];
    element.addEventListener("jwt-logged-in", (e) => loggedIn.push(e.detail));
    element.jwt = "my-jwt";
    await sleep(0);
    element.jwt = null;
    await sleep(0);
    expect(loggedIn).to.deep.equal([true, false]);
  });

  it("_jwtChanged dispatches logged-out for empty string values", async () => {
    const loggedIn = [];
    element.addEventListener("jwt-logged-in", (e) => loggedIn.push(e.detail));
    element.jwt = "first";
    await sleep(0);
    element.jwt = "";
    await sleep(0);
    expect(loggedIn).to.deep.equal([true, false]);
    element.jwt = "null";
    await sleep(0);
    expect(loggedIn).to.deep.equal([true, false, false]);
  });

  it("generateRequest sends GET without a body by default", async () => {
    await element.generateRequest("https://example.com/login");
    expect(fetchCalls.length).to.equal(1);
    expect(fetchCalls[0].url).to.equal("https://example.com/login");
    expect(fetchCalls[0].init.method).to.equal("GET");
    expect(fetchCalls[0].init.body === undefined).to.equal(true);
    expect(fetchCalls[0].init.headers["Content-Type"]).to.equal(
      "application/json",
    );
  });

  it("generateRequest stringifies the body for non-GET methods", async () => {
    element.method = "POST";
    await element.generateRequest("https://example.com/login", {
      user: "me",
    });
    expect(fetchCalls[0].init.method).to.equal("POST");
    expect(fetchCalls[0].init.body).to.equal('{"user":"me"}');
  });

  it("generateRequest reads nested token shapes", async () => {
    const shapes = [
      { jwt: "flat-jwt" },
      { data: { jwt: "nested-jwt" } },
      "string-jwt",
    ];
    for (const shape of shapes) {
      globalThis.fetch = () => Promise.resolve(okJson(shape));
      element.jwt = null;
      await element.generateRequest("https://example.com/login");
      await sleep(0);
    }
    expect(element.jwt).to.equal("string-jwt");
  });

  it("generateRequest login failure fires jwt-login-login-failed", async () => {
    const failed = [];
    element.addEventListener("jwt-login-login-failed", (e) =>
      failed.push(e.detail),
    );
    globalThis.fetch = () => Promise.resolve(badResponse());
    await element.generateRequest("https://example.com/login");
    await sleep(0);
    expect(failed).to.deep.equal([true]);
    expect(element.jwt).to.equal(null);
  });

  it("generateRequest network failure clears login state", async () => {
    element.__loginInFlight = true;
    globalThis.fetch = () => Promise.reject(new Error("offline"));
    await element.generateRequest("https://example.com/login");
    await sleep(0);
    expect(element.__loginInFlight).to.equal(false);
  });

  it("updated triggers the auto login once ready", async () => {
    element.url = "https://example.com/auto";
    element.auto = true;
    await sleep(20);
    expect(fetchCalls.length).to.equal(1);
    expect(fetchCalls[0].url).to.equal("https://example.com/auto");
  });

  it("updated skips the auto login without auto or url", async () => {
    element.url = "https://example.com/auto";
    await sleep(20);
    expect(fetchCalls.length).to.equal(0);
    element.auto = true;
    element.jwt = "already-here";
    element.url = "https://example.com/other";
    await sleep(20);
    expect(fetchCalls.length).to.equal(0);
  });

  it("loginRequest posts the detail body through the login context", async () => {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-login", { detail: { user: "abc" } }),
    );
    await sleep(20);
    expect(element.__loginInFlight).to.equal(false);
    expect(element.body).to.deep.equal({ user: "abc" });
    expect(element.jwt).to.equal("stub-jwt");
  });

  it("toggleLogin logs in when logged out", async () => {
    globalThis.dispatchEvent(new CustomEvent("jwt-login-toggle"));
    await sleep(20);
    expect(element.jwt).to.equal("stub-jwt");
  });

  it("toggleLogin logs out when logged in", async () => {
    element.jwt = "stub-jwt";
    await sleep(0);
    const loggedIn = [];
    element.addEventListener("jwt-logged-in", (e) => loggedIn.push(e.detail));
    globalThis.dispatchEvent(new CustomEvent("jwt-login-toggle"));
    await sleep(20);
    expect(element.jwt).to.equal(null);
    expect(loggedIn[loggedIn.length - 1]).to.equal(false);
    expect(fetchCalls.length).to.equal(0);
  });

  it("logoutRequest with no logout url only resets state", async () => {
    element.jwt = "stub-jwt";
    await sleep(0);
    element.__logoutInFlight = false;
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", { detail: {} }),
    );
    await sleep(20);
    expect(element.__logoutInFlight).to.equal(true);
    expect(element.jwt).to.equal(null);
    expect(fetchCalls.length).to.equal(0);
  });

  it("logoutRequest calls a same-domain logout url", async () => {
    element.logoutUrl = `${globalThis.location.origin}/logout`;
    element.jwt = "stub-jwt";
    await sleep(0);
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", { detail: {} }),
    );
    await sleep(20);
    expect(fetchCalls.length).to.equal(1);
    expect(fetchCalls[0].url).to.equal(`${globalThis.location.origin}/logout`);
    expect(element.__logoutInFlight).to.equal(false);
  });

  it("isDifferentDomain compares hostnames", () => {
    expect(
      element.isDifferentDomain("https://other.example.com/logout"),
    ).to.equal(true);
    expect(element.isDifferentDomain("/local-logout")).to.equal(false);
    expect(element.isDifferentDomain(`${globalThis.location.origin}/x`)).to.equal(
      false,
    );
    expect(element.isDifferentDomain("http://[invalid")).to.equal(false);
  });

  it("safeRedirect only allows http(s) urls", () => {
    expect(element.safeRedirect("https://example.com/ok")).to.equal(
      "https://example.com/ok",
    );
    expect(element.safeRedirect("javascript:alert(1)")).to.equal("/");
    expect(element.safeRedirect("http://[invalid")).to.equal("/");
    expect(element.safeRedirect("/relative-path")).to.equal(
      new URL("/relative-path", globalThis.location.href).href,
    );
  });

  it("_decodeJwtExpUnverified decodes the exp claim", () => {
    const exp = Math.floor(Date.now() / 1000) + 500;
    expect(element._decodeJwtExpUnverified(makeJwt({ exp: exp }))).to.equal(
      exp,
    );
    expect(element._decodeJwtExpUnverified(makeJwt({ other: 1 }))).to.equal(0);
    expect(element._decodeJwtExpUnverified("short")).to.equal(0);
    expect(element._decodeJwtExpUnverified("a.$$$b.c")).to.equal(0);
    expect(element._decodeJwtExpUnverified(null)).to.equal(0);
    expect(element._decodeJwtExpUnverified(123)).to.equal(0);
  });

  it("_hasValidJwtForRefresh validates jwt shapes", () => {
    expect(element._hasValidJwtForRefresh("ok-token")).to.equal(true);
    expect(element._hasValidJwtForRefresh("")).to.equal(false);
    expect(element._hasValidJwtForRefresh("null")).to.equal(false);
    expect(element._hasValidJwtForRefresh(null)).to.equal(false);
    expect(element._hasValidJwtForRefresh({ jwt: "ok" })).to.equal(true);
    expect(element._hasValidJwtForRefresh({ jwt: "" })).to.equal(false);
    expect(element._hasValidJwtForRefresh({ jwt: "null" })).to.equal(false);
    expect(element._hasValidJwtForRefresh({ nope: 1 })).to.equal(false);
    expect(element._hasValidJwtForRefresh(123)).to.equal(false);
  });

  it("requestRefreshToken refreshes and notifies the element", async () => {
    element.refreshUrl = "https://example.com/refresh";
    const calls = [];
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-refresh-token", {
        detail: {
          element: {
            obj: { onJwt: (jwt, p) => calls.push([jwt, p]) },
            callback: "onJwt",
            params: ["p1"],
          },
        },
      }),
    );
    await sleep(20);
    expect(calls).to.deep.equal([["stub-jwt", "p1"]]);
    expect(element.__refreshInFlight).to.equal(false);
    expect(fetchCalls.length).to.equal(1);
    expect(fetchCalls[0].url).to.equal("https://example.com/refresh");
  });

  it("requestRefreshToken subscribes while a refresh is in flight", async () => {
    element.refreshUrl = "https://example.com/refresh";
    let resolveFetch;
    globalThis.fetch = () =>
      new Promise((resolve) => {
        resolveFetch = resolve;
      });
    const calls = [];
    const makeElement = (tag) => ({
      obj: { onJwt: (jwt) => calls.push([tag, jwt]) },
      callback: "onJwt",
      params: [],
    });
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-refresh-token", {
        detail: { element: makeElement("first") },
      }),
    );
    // second request while the first is pending: queued as a subscriber
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-refresh-token", {
        detail: { element: makeElement("second") },
      }),
    );
    // the first element was queued by _startRefresh and the second as a
    // subscriber while the refresh was pending
    expect(element.__refreshSubscribers.length).to.equal(2);
    resolveFetch(okJson({ jwt: "refreshed-jwt" }));
    await sleep(20);
    expect(calls).to.deep.equal([
      ["first", "refreshed-jwt"],
      ["second", "refreshed-jwt"],
    ]);
    expect(element.jwt).to.equal("refreshed-jwt");
  });

  it("_startRefresh does nothing without a refresh url", () => {
    element._startRefresh(null, false);
    expect(element.__refreshInFlight).to.equal(false);
  });

  it("refresh failure fires jwt-login-refresh-error", async () => {
    element.refreshUrl = "https://example.com/refresh";
    const errors = [];
    element.addEventListener("jwt-login-refresh-error", (e) =>
      errors.push(e.detail.value.status),
    );
    globalThis.fetch = () => Promise.resolve(badResponse());
    element._startRefresh(null, false);
    await sleep(20);
    expect(errors).to.deep.equal([401]);
    expect(element.__refreshInFlight).to.equal(false);
    expect(element.__refreshPromise === null).to.equal(true);
  });

  it("proactive refresh failure stays silent", async () => {
    element.refreshUrl = "https://example.com/refresh";
    const errors = [];
    element.addEventListener("jwt-login-refresh-error", (e) =>
      errors.push(true),
    );
    globalThis.fetch = () => Promise.resolve(badResponse());
    element._startRefresh(null, true);
    await sleep(20);
    expect(errors.length).to.equal(0);
    expect(element.__refreshInFlight).to.equal(false);
  });

  it("refresh network failure fires jwt-login-refresh-error", async () => {
    element.refreshUrl = "https://example.com/refresh";
    const errors = [];
    element.addEventListener("jwt-login-refresh-error", (e) =>
      errors.push(true),
    );
    globalThis.fetch = () => Promise.reject(new Error("offline"));
    element._startRefresh(null, false);
    await sleep(20);
    expect(errors.length).to.equal(1);
  });

  it("refresh network failure is silent when proactive", async () => {
    element.refreshUrl = "https://example.com/refresh";
    const errors = [];
    element.addEventListener("jwt-login-refresh-error", (e) =>
      errors.push(true),
    );
    globalThis.fetch = () => Promise.reject(new Error("offline"));
    element._startRefresh(null, true);
    await sleep(20);
    expect(errors.length).to.equal(0);
  });

  it("_invokeRefreshCallback guards invalid callbacks", () => {
    expect(element._invokeRefreshCallback(null, "jwt")).to.equal(undefined);
    expect(
      element._invokeRefreshCallback({ obj: null, callback: "x" }, "jwt"),
    ).to.equal(undefined);
    expect(
      element._invokeRefreshCallback({ obj: {}, callback: "missing" }, "jwt"),
    ).to.equal(undefined);
    // a throwing callback is caught and warned
    element._invokeRefreshCallback(
      {
        obj: { boom: () => { throw new Error("boom"); } },
        callback: "boom",
        params: [],
      },
      "jwt",
    );
    expect(true).to.equal(true);
  });

  it("_scheduleProactiveRefresh arms a timer for a valid jwt", async () => {
    // the test harness injects window.appSettings with a jwt, which is the
    // app-bootstrap guard, so clear it while exercising the scheduler
    const savedSettings = globalThis.appSettings;
    globalThis.appSettings = undefined;
    element.refreshUrl = "https://example.com/refresh";
    const exp = Math.floor(Date.now() / 1000) + 3600;
    element.jwt = makeJwt({ exp: exp });
    await sleep(0);
    expect(element.__proactiveRefreshTimer === null).to.equal(false);
    // no refresh url, in-flight logins, app bootstrap or missing exp skip it
    element.__proactiveRefreshTimer = null;
    element.refreshUrl = "";
    element._scheduleProactiveRefresh();
    expect(element.__proactiveRefreshTimer === null).to.equal(true);
    element.refreshUrl = "https://example.com/refresh";
    element.__loginInFlight = true;
    element._scheduleProactiveRefresh();
    expect(element.__proactiveRefreshTimer === null).to.equal(true);
    element.__loginInFlight = false;
    element.__logoutInFlight = true;
    element._scheduleProactiveRefresh();
    expect(element.__proactiveRefreshTimer === null).to.equal(true);
    element.__logoutInFlight = false;
    globalThis.appSettings = { jwt: "bootstrapped" };
    element._scheduleProactiveRefresh();
    expect(element.__proactiveRefreshTimer === null).to.equal(true);
    globalThis.appSettings = undefined;
    element._scheduleProactiveRefresh();
    expect(element.__proactiveRefreshTimer === null).to.equal(false);
    // an expired jwt schedules nothing
    element.__proactiveRefreshTimer = null;
    element.jwt = makeJwt({ exp: Math.floor(Date.now() / 1000) - 10 });
    await sleep(0);
    element._scheduleProactiveRefresh();
    expect(element.__proactiveRefreshTimer === null).to.equal(true);
    globalThis.appSettings = savedSettings;
  });

  it("_requestProactiveRefreshToken guards then refreshes", async () => {
    element.refreshUrl = "https://example.com/refresh";
    element.__refreshInFlight = true;
    element._requestProactiveRefreshToken();
    expect(fetchCalls.length).to.equal(0);
    element.__refreshInFlight = false;
    element.__loginInFlight = true;
    element._requestProactiveRefreshToken();
    expect(fetchCalls.length).to.equal(0);
    element.__loginInFlight = false;
    element.__logoutInFlight = true;
    element._requestProactiveRefreshToken();
    expect(fetchCalls.length).to.equal(0);
    element.__logoutInFlight = false;
    element.jwt = null;
    element._requestProactiveRefreshToken();
    expect(fetchCalls.length).to.equal(0);
    element.jwt = "valid-token";
    element.refreshUrl = "";
    element._requestProactiveRefreshToken();
    expect(fetchCalls.length).to.equal(0);
    element.refreshUrl = "https://example.com/refresh";
    element._requestProactiveRefreshToken();
    expect(fetchCalls.length).to.equal(1);
    expect(fetchCalls[0].url).to.equal("https://example.com/refresh");
  });

  it("_onVisibilityChange refreshes nearly-expired tokens", async () => {
    element.refreshUrl = "https://example.com/refresh";
    element.jwt = makeJwt({ exp: Math.floor(Date.now() / 1000) - 5 });
    await sleep(0);
    globalThis.dispatchEvent(new Event("focus"));
    await sleep(20);
    expect(fetchCalls.length).to.equal(1);
  });

  it("_onVisibilityChange reschedules far-future tokens", async () => {
    // clear the injected appSettings bootstrap so scheduling can arm
    const savedSettings = globalThis.appSettings;
    globalThis.appSettings = undefined;
    element.refreshUrl = "https://example.com/refresh";
    element.jwt = makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
    await sleep(0);
    globalThis.dispatchEvent(new Event("visibilitychange"));
    await sleep(20);
    expect(fetchCalls.length).to.equal(0);
    expect(element.__proactiveRefreshTimer === null).to.equal(false);
    globalThis.appSettings = savedSettings;
  });

  it("_onVisibilityChange skips without a valid jwt", async () => {
    element.refreshUrl = "https://example.com/refresh";
    element.jwt = null;
    globalThis.dispatchEvent(new Event("focus"));
    await sleep(20);
    expect(fetchCalls.length).to.equal(0);
  });

  it("disconnectedCallback detaches the global listeners", async () => {
    const el = await fixture(html`<jwt-login></jwt-login>`);
    // detach both elements so no live listener reacts to the event
    element.remove();
    el.remove();
    await sleep(0);
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-login", { detail: {} }),
    );
    await sleep(20);
    expect(el.jwt).to.equal(null);
    expect(element.jwt).to.equal(null);
    expect(fetchCalls.length).to.equal(0);
  });
});

/* eslint-disable */
/*
describe("A11y/chai axe tests", () => {
  it("jwt-login passes accessibility test", async () => {
    const el = await fixture(html` <jwt-login></jwt-login> `);
    await expect(el).to.be.accessible();
  });
  it("jwt-login passes accessibility negation", async () => {
    const el = await fixture(
      html`<jwt-login
        aria-labelledby="jwt-login"
      ></jwt-login>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("jwt-login can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<jwt-login .foo=${'bar'}></jwt-login>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
        await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
        const el = await fixture(html`<jwt-login ></jwt-login>`);
        const width = getComputedStyle(el).width;
        expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
        await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
        const el = await fixture(html`<jwt-login></jwt-login>`);
        const width = getComputedStyle(el).width;
        expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
        const el await fixture(html`<jwt-login></jwt-login>`);
        const hidden = el.getAttribute('hidden');
        expect(hidden).to.equal(true);
    })
}) */
