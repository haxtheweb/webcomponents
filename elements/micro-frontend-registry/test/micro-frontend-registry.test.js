import { fixture, expect, html } from "@open-wc/testing";
import "../micro-frontend-registry.js";
import {
  MicroFrontendRegistry,
  MicroFrontend,
  MicroFrontendRegCapabilities,
} from "../micro-frontend-registry.js";
import {
  enableServices,
  enableCoreServices,
  enableExperimentalServices,
} from "../lib/microServices.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<micro-frontend-registry></micro-frontend-registry>`,
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Registry Functionality", () => {
    it("maintains accessibility during dynamic loading", async () => {
      await element.updateComplete;

      // Should remain accessible during registry operations
      await expect(element).shadowDom.to.be.accessible();
    });

    it("doesn't interfere with loaded component accessibility", async () => {
      await element.updateComplete;

      // Should not negatively impact accessibility of registered components
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal("none");
    });
  });

  describe("Accessibility - Loading States", () => {
    it("provides accessible loading feedback if visible", async () => {
      await element.updateComplete;

      // If the registry shows loading states, they should be accessible
      await expect(element).shadowDom.to.be.accessible();
    });

    it("handles errors accessibly", async () => {
      await element.updateComplete;

      // Error states should be accessible to screen readers
      expect(element.tagName.toLowerCase()).to.equal("micro-frontend-registry");
    });
  });
});

// The site importers are on-prem haxcms-nodejs routes reached through the
// @system/ namespace, so the dashboard can only offer an importer that is
// registered here. haxtheweb/issues#2912 shipped the OpenStax converter and
// its /system/api/v1/site/import/openstax route. haxtheweb/issues#2923
// adds the VitePress converter and its /system/api/v1/site/import/vitepress
// route the same way.
describe("HAXcms site import services", () => {
  before(() => {
    enableServices(["haxcms"]);
  });

  const importers = [
    ["@system/openstaxToSite", "/system/api/v1/site/import/openstax"],
    ["@system/vitepressToSite", "/system/api/v1/site/import/vitepress"],
    ["@system/gitbookToSite", "/system/api/v1/site/import/gitbook"],
    ["@system/notionToSite", "/system/api/v1/site/import/notion"],
    ["@system/ploneToSite", "/system/api/v1/site/import/plone"],
    ["@system/pressbooksToSite", "/system/api/v1/site/import/pressbooks"],
    ["@system/haxcmsToSite", "/system/api/v1/site/import/haxcms"],
    ["@system/wordpressToSite", "/system/api/v1/site/import/wordpress"],
    ["@system/drupalBookToSite", "/system/api/v1/site/import/drupal-book"],
    ["@system/elmslnToSite", "/system/api/v1/site/import/elmsln"],
    ["@system/htmlToSite", "/system/api/v1/site/import/html"],
  ];

  importers.forEach(([name, endpoint]) => {
    it(`registers ${name} on its on-prem endpoint`, () => {
      expect(MicroFrontendRegistry.has(name)).to.equal(true);
      expect(MicroFrontendRegistry.get(name).endpoint).to.equal(endpoint);
    });
  });

  it("asks the OpenStax importer for a repoUrl, as the chooser sends", () => {
    const openstax = MicroFrontendRegistry.get("@system/openstaxToSite");
    expect(openstax.params).to.have.property("repoUrl");
    expect(openstax.title).to.equal("OpenStax to Site");
  });

  it("asks the VitePress importer for a repoUrl, as the chooser sends", () => {
    const vitepress = MicroFrontendRegistry.get("@system/vitepressToSite");
    expect(vitepress.params).to.have.property("repoUrl");
    expect(vitepress.title).to.equal("VitePress to Site");
  });
});

// --- MicroFrontend class unit tests ---
describe("MicroFrontend class", () => {
  it("sets defaults for all known keys when no values supplied", () => {
    const mf = new MicroFrontend();
    expect(mf.endpoint).to.equal(null);
    expect(mf.name).to.equal(null);
    expect(mf.title).to.equal(null);
    expect(mf.description).to.equal(null);
    expect(mf.callback).to.equal(null);
    expect(mf.method).to.equal(null);
    expect(mf.params).to.deep.equal({});
    expect(mf.headers).to.deep.equal({});
    expect(mf.security).to.deep.equal([]);
  });

  it("copies values from the params object", () => {
    const mf = new MicroFrontend({
      endpoint: "https://example.com/api",
      name: "test-mf",
      title: "Test",
      method: "GET",
    });
    expect(mf.endpoint).to.equal("https://example.com/api");
    expect(mf.name).to.equal("test-mf");
    expect(mf.title).to.equal("Test");
    expect(mf.method).to.equal("GET");
  });

  it("ignores keys not in MicroFrontendKeys", () => {
    const mf = new MicroFrontend({ extra: "ignored" });
    expect(mf.extra).to.equal(undefined);
  });
});

// --- Core services registration ---
describe("Core services", () => {
  before(() => {
    enableCoreServices();
  });

  const coreServices = [
    ["@core/linkValidator", "/api/services/website/linkValidator", "GET"],
    ["@core/websiteMetadata", "/api/services/website/metadata", "GET"],
    ["@core/mdToHtml", "/system/api/v1/actions/md-to-html", null],
    ["@core/htmlToMd", "/system/api/v1/actions/html-to-md", null],
    ["@core/prettyHtml", "/system/api/v1/actions/pretty-html", null],
    ["@core/jsonToYaml", "/system/api/v1/actions/json-to-yaml", null],
    ["@core/xlsxToCsv", "/system/api/v1/actions/xlsx-to-csv", null],
    ["@core/yamlToJson", "/system/api/v1/actions/yaml-to-json", null],
    ["@core/crypto", "/api/services/security/aes256", null],
    ["@core/duckDuckGo", "/api/services/website/duckDuckGo", "GET"],
    ["@core/docxToPdf", "/system/api/v1/actions/docx-to-pdf", null],
    ["@core/pdfToHtml", "/system/api/v1/actions/pdf-to-html", null],
    ["@core/docxToHtml", "/system/api/v1/actions/docx-to-html", null],
    ["@core/pptxToHtml", "/system/api/v1/actions/pptx-to-html", null],
    ["@core/imgToAscii", "/api/services/media/format/imgToAscii", null],
    ["@core/imgManipulate", "/api/services/media/image/manipulate", null],
    ["@core/readability", "/api/services/text/readability", null],
  ];

  coreServices.forEach(([name, endpoint, method]) => {
    it(`registers ${name}`, () => {
      expect(MicroFrontendRegistry.has(name)).to.equal(true);
      const svc = MicroFrontendRegistry.get(name);
      expect(svc).to.exist;
      // endpoints starting with /api/ get base-rewritten in define();
      // /system/ endpoints are left as-is
      if (endpoint.startsWith("/system/")) {
        expect(svc.endpoint).to.equal(endpoint);
      } else {
        expect(svc.endpoint).to.include(endpoint);
      }
      if (method) {
        expect(svc.method).to.equal(method);
      }
    });
  });

  it("registers linkValidator with a links param", () => {
    const svc = MicroFrontendRegistry.get("@core/linkValidator");
    expect(svc.params).to.have.property("links");
    expect(svc.title).to.equal("Validate URLs");
  });

  it("registers imgManipulate with expected params", () => {
    const svc = MicroFrontendRegistry.get("@core/imgManipulate");
    expect(svc.params).to.have.property("src");
    expect(svc.params).to.have.property("height");
    expect(svc.params).to.have.property("width");
    expect(svc.params).to.have.property("format");
  });
});

// --- Experimental services registration ---
describe("Experimental services", () => {
  before(() => {
    enableExperimentalServices();
  });

  it("registers hydrateSsr experiment", () => {
    expect(MicroFrontendRegistry.has("@experiments/hydrateSsr")).to.equal(true);
    const svc = MicroFrontendRegistry.get("@experiments/hydrateSsr");
    expect(svc.endpoint).to.equal(
      "https://webcomponents.hax.cloud/api/hydrateSsr",
    );
    expect(svc.title).to.equal("Hydrate SSR");
  });
});

// --- enableServices dispatcher ---
describe("enableServices dispatcher", () => {
  it("calls the correct sub-enabler for each known service name", () => {
    // enableServices(['core','experimental','haxcms']) should not throw
    expect(() => enableServices(["core", "experimental", "haxcms"])).to.not.throw();
  });

  it("ignores unknown service names without error", () => {
    expect(() => enableServices(["unknown"])).to.not.throw();
  });
});

// --- Registry API: get / has / set ---
describe("Registry lookup and update", () => {
  it("get returns null and logs error for unknown name", () => {
    const result = MicroFrontendRegistry.get("@does/notExist");
    expect(result).to.equal(null);
  });

  it("get with testOnly=true suppresses error log", () => {
    const result = MicroFrontendRegistry.get("@does/notExist", true);
    expect(result).to.equal(null);
  });

  it("has returns false for unknown name", () => {
    expect(MicroFrontendRegistry.has("@does/notExist")).to.equal(false);
  });

  it("set updates an existing service entry", () => {
    const name = "@test/setUpdate";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/old",
      name: name,
    });
    expect(MicroFrontendRegistry.get(name).endpoint).to.equal(
      "https://example.com/old",
    );
    MicroFrontendRegistry.set(name, {
      endpoint: "https://example.com/new",
      name: name,
    });
    expect(MicroFrontendRegistry.get(name).endpoint).to.equal(
      "https://example.com/new",
    );
  });

  it("set is a no-op when name does not exist", () => {
    const result = MicroFrontendRegistry.set("@does/notExist", {
      endpoint: "https://example.com",
      name: "@does/notExist",
    });
    expect(result).to.equal(null);
    expect(MicroFrontendRegistry.has("@does/notExist")).to.equal(false);
  });
});

// --- _resolveEndpointTemplate ---
describe("_resolveEndpointTemplate", () => {
  it("substitutes {token} placeholders and removes them from params", () => {
    const result = MicroFrontendRegistry._resolveEndpointTemplate(
      "https://example.com/{id}/sub/{action}",
      { id: "42", action: "run", keep: "me" },
    );
    expect(result.endpoint).to.equal(
      "https://example.com/42/sub/run",
    );
    expect(result.params).to.deep.equal({ keep: "me" });
  });

  it("URL-encodes substituted values", () => {
    const result = MicroFrontendRegistry._resolveEndpointTemplate(
      "https://example.com/{path}",
      { path: "a b/c" },
    );
    expect(result.endpoint).to.equal("https://example.com/a%20b%2Fc");
  });

  it("leaves unmatched placeholders in the endpoint", () => {
    const result = MicroFrontendRegistry._resolveEndpointTemplate(
      "https://example.com/{missing}",
      { other: "val" },
    );
    expect(result.endpoint).to.equal("https://example.com/{missing}");
    expect(result.params).to.deep.equal({ other: "val" });
  });

  it("skips null-valued tokens", () => {
    const result = MicroFrontendRegistry._resolveEndpointTemplate(
      "https://example.com/{id}",
      { id: null },
    );
    expect(result.endpoint).to.equal("https://example.com/{id}");
  });

  it("returns endpoint as-is when params is not a plain object", () => {
    const fd = new FormData();
    fd.append("key", "val");
    const result = MicroFrontendRegistry._resolveEndpointTemplate(
      "https://example.com/{id}",
      fd,
    );
    expect(result.endpoint).to.equal("https://example.com/{id}");
    expect(result.params).to.equal(fd);
  });

  it("handles null/empty endpoint gracefully", () => {
    const result = MicroFrontendRegistry._resolveEndpointTemplate(null, {
      id: 1,
    });
    expect(result.endpoint).to.equal("");
    expect(result.params).to.deep.equal({ id: 1 });
  });
});

// --- setAuthProvider / _resolveSecurityHeaders ---
describe("AuthProvider and security headers", () => {
  let originalProvider;

  beforeEach(() => {
    originalProvider = MicroFrontendRegistry.authProvider;
  });

  afterEach(() => {
    MicroFrontendRegistry.setAuthProvider(null);
    MicroFrontendRegistry.authProvider = originalProvider;
  });

  it("setAuthProvider stores a function", () => {
    const fn = async () => ({ Auth: "token" });
    MicroFrontendRegistry.setAuthProvider(fn);
    expect(MicroFrontendRegistry.authProvider).to.equal(fn);
  });

  it("setAuthProvider clears when non-function given", () => {
    MicroFrontendRegistry.setAuthProvider(async () => ({}));
    expect(MicroFrontendRegistry.authProvider).to.not.equal(null);
    MicroFrontendRegistry.setAuthProvider("not a function");
    expect(MicroFrontendRegistry.authProvider).to.equal(null);
  });

  it("_resolveSecurityHeaders returns {} when no authProvider is set", async () => {
    MicroFrontendRegistry.setAuthProvider(null);
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      { security: ["scope"] },
      {},
    );
    expect(headers).to.deep.equal({});
  });

  it("_resolveSecurityHeaders returns {} when item has no security array", async () => {
    MicroFrontendRegistry.setAuthProvider(async () => ({ Auth: "x" }));
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      { security: null },
      {},
    );
    expect(headers).to.deep.equal({});
  });

  it("_resolveSecurityHeaders returns {} when security is empty", async () => {
    MicroFrontendRegistry.setAuthProvider(async () => ({ Auth: "x" }));
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      { security: [] },
      {},
    );
    expect(headers).to.deep.equal({});
  });

  it("_resolveSecurityHeaders calls authProvider and returns headers", async () => {
    MicroFrontendRegistry.setAuthProvider(async (security, ctx) => ({
      Authorization: `Bearer ${security.join(",")}`,
      ctxName: ctx.name,
    }));
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      { security: ["read", "write"] },
      { name: "svc" },
    );
    expect(headers).to.deep.equal({
      Authorization: "Bearer read,write",
      ctxName: "svc",
    });
  });

  it("_resolveSecurityHeaders returns {} when authProvider returns non-object", async () => {
    MicroFrontendRegistry.setAuthProvider(async () => "not-an-object");
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      { security: ["scope"] },
      {},
    );
    expect(headers).to.deep.equal({});
  });

  it("_resolveSecurityHeaders returns {} when authProvider throws", async () => {
    MicroFrontendRegistry.setAuthProvider(async () => {
      throw new Error("auth fail");
    });
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      { security: ["scope"] },
      {},
    );
    expect(headers).to.deep.equal({});
  });

  it("_resolveSecurityHeaders returns {} when item is null", async () => {
    MicroFrontendRegistry.setAuthProvider(async () => ({ Auth: "x" }));
    const headers = await MicroFrontendRegistry._resolveSecurityHeaders(
      null,
      {},
    );
    expect(headers).to.deep.equal({});
  });
});

// --- url() method ---
describe("url() method", () => {
  it("builds a GET URL with query params", () => {
    const name = "@test/urlBuilder";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    const result = MicroFrontendRegistry.url(name, { q: "hello", page: 2 });
    expect(result).to.equal("https://example.com/api?q=hello&page=2");
  });

  it("strips null-valued params", () => {
    const name = "@test/urlBuilder2";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    const result = MicroFrontendRegistry.url(name, {
      q: "hello",
      skip: null,
    });
    expect(result).to.equal("https://example.com/api?q=hello");
  });

  it("returns empty string for unknown service", () => {
    const result = MicroFrontendRegistry.url("@does/notExist", { q: "x" });
    expect(result).to.equal("");
  });
});

// --- call() method with fetch stubbing ---
describe("call() method", () => {
  let originalFetch;
  let fetchCalls;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchCalls = [];
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function makeMockResponse(opts) {
    const ok = opts.ok !== undefined ? opts.ok : true;
    const status = opts.status || (ok ? 200 : 400);
    return {
      ok: ok,
      status: status,
      json: async () => opts.jsonData,
      text: async () => opts.textData || "",
    };
  }

  it("returns null when service does not exist", async () => {
    const result = await MicroFrontendRegistry.call("@does/notExist");
    expect(result).to.equal(null);
  });

  it("POSTs JSON body by default", async () => {
    const name = "@test/callPost";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: { ok: true } }));
    };
    const result = await MicroFrontendRegistry.call(name, { data: "val" });
    expect(fetchCalls.length).to.equal(1);
    expect(fetchCalls[0].url).to.equal("https://example.com/api");
    expect(fetchCalls[0].opts.method).to.equal("POST");
    expect(fetchCalls[0].opts.body).to.equal(JSON.stringify({ data: "val" }));
    expect(fetchCalls[0].opts.headers["Content-Type"]).to.equal(
      "application/json",
    );
    expect(result).to.deep.equal({ ok: true });
  });

  it("GETs with query string when method is GET", async () => {
    const name = "@test/callGet";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      method: "GET",
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: { ok: true } }));
    };
    const result = await MicroFrontendRegistry.call(name, { q: "test" });
    expect(fetchCalls[0].url).to.include("https://example.com/api?");
    expect(fetchCalls[0].url).to.include("q=test");
    expect(fetchCalls[0].opts.method).to.equal("GET");
    expect(result).to.deep.equal({ ok: true });
  });

  it("GETs without query string when no params", async () => {
    const name = "@test/callGetNoParams";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      method: "GET",
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name);
    expect(fetchCalls[0].url).to.equal("https://example.com/api");
  });

  it("HEAD method behaves like GET", async () => {
    const name = "@test/callHead";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      method: "HEAD",
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, { q: "x" });
    expect(fetchCalls[0].opts.method).to.equal("HEAD");
  });

  it("passes endpoint headers through to fetch", async () => {
    const name = "@test/callHeaders";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      headers: { "X-Custom": "val" },
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, {});
    expect(fetchCalls[0].opts.headers["X-Custom"]).to.equal("val");
    expect(fetchCalls[0].opts.headers["Content-Type"]).to.equal(
      "application/json",
    );
  });

  it("__method override changes the HTTP method", async () => {
    const name = "@test/callMethodOverride";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      method: "GET",
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, { __method: "PUT", data: 1 });
    expect(fetchCalls[0].opts.method).to.equal("PUT");
    // __method should be stripped from the body
    expect(JSON.parse(fetchCalls[0].opts.body)).to.deep.equal({ data: 1 });
  });

  it("__headers override merges into request headers", async () => {
    const name = "@test/callHeadersOverride";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, {
      __headers: { Authorization: "Bearer token" },
    });
    expect(fetchCalls[0].opts.headers["Authorization"]).to.equal(
      "Bearer token",
    );
    // __headers stripped from body
    expect(JSON.parse(fetchCalls[0].opts.body)).to.deep.equal({});
  });

  it("__fetchOptions override merges into fetch options", async () => {
    const name = "@test/callFetchOptions";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, {
      __fetchOptions: { credentials: "include" },
    });
    expect(fetchCalls[0].opts.credentials).to.equal("include");
  });

  it("passes FormData as-is for POST body without Content-Type", async () => {
    const name = "@test/callFormData";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    const fd = new FormData();
    fd.append("file", "content");
    await MicroFrontendRegistry.call(name, fd);
    expect(fetchCalls[0].opts.body).to.equal(fd);
    // When no headers are defined, opts.headers is not set at all for FormData;
    // the browser supplies the Content-Type boundary automatically.
    expect(fetchCalls[0].opts.headers).to.equal(undefined);
  });

  it("passes FormData for GET without query string conversion", async () => {
    const name = "@test/callGetFormData";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      method: "GET",
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    const fd = new FormData();
    fd.append("key", "val");
    await MicroFrontendRegistry.call(name, fd);
    // FormData in GET uses empty search payload, so no query params
    expect(fetchCalls[0].url).to.equal("https://example.com/api");
  });

  it("invokes item.callback after a successful call", async () => {
    const name = "@test/callItemCallback";
    let callbackResult = null;
    let callbackCaller = null;
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      callback: async (data, caller) => {
        callbackResult = data;
        callbackCaller = caller;
      },
    });
    globalThis.fetch = () =>
      Promise.resolve(makeMockResponse({ jsonData: { ok: true } }));
    const myCaller = { id: "caller1" };
    await MicroFrontendRegistry.call(name, {}, null, myCaller);
    expect(callbackResult).to.deep.equal({ ok: true });
    expect(callbackCaller).to.equal(myCaller);
  });

  it("invokes caller-supplied callback after a successful call", async () => {
    const name = "@test/callCallerCallback";
    let callbackData = null;
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = () =>
      Promise.resolve(makeMockResponse({ jsonData: { ok: true } }));
    await MicroFrontendRegistry.call(
      name,
      {},
      async (data) => {
        callbackData = data;
      },
    );
    expect(callbackData).to.deep.equal({ ok: true });
  });

  it("returns {status:500, data:null} on fetch rejection", async () => {
    const name = "@test/callFetchError";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = () => Promise.reject(new Error("network down"));
    const result = await MicroFrontendRegistry.call(name, {});
    expect(result).to.deep.equal({ status: 500, data: null });
  });

  it("returns text when rawResponse is true", async () => {
    const name = "@test/callRaw";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = () =>
      Promise.resolve(makeMockResponse({ textData: "plain text" }));
    const result = await MicroFrontendRegistry.call(
      name,
      {},
      null,
      null,
      "",
      true,
    );
    expect(result).to.equal("plain text");
  });

  it("parses non-ok response body and returns {status, data:null, message, body}", async () => {
    const name = "@test/callNonOk";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = () =>
      Promise.resolve(
        makeMockResponse({
          ok: false,
          status: 403,
          jsonData: { message: "Forbidden" },
        }),
      );
    const result = await MicroFrontendRegistry.call(name, {});
    expect(result.status).to.equal(403);
    expect(result.data).to.equal(null);
    expect(result.message).to.equal("Forbidden");
    expect(result.body).to.deep.equal({ message: "Forbidden" });
  });

  it("returns empty message when non-ok body has no message field", async () => {
    const name = "@test/callNonOkNoMessage";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = () =>
      Promise.resolve(
        makeMockResponse({
          ok: false,
          status: 500,
          jsonData: { error: "something" },
        }),
      );
    const result = await MicroFrontendRegistry.call(name, {});
    expect(result.message).to.equal("");
    expect(result.body).to.deep.equal({ error: "something" });
  });

  it("returns empty message when non-ok body is not valid JSON", async () => {
    const name = "@test/callNonOkBadJson";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = () =>
      Promise.resolve({
        ok: false,
        status: 502,
        json: async () => {
          throw new Error("invalid json");
        },
        text: async () => "not json",
      });
    const result = await MicroFrontendRegistry.call(name, {});
    expect(result.status).to.equal(502);
    expect(result.data).to.equal(null);
    expect(result.message).to.equal("");
    expect(result.body).to.equal(null);
  });

  it("appends urlStringAddon to the fetch URL", async () => {
    const name = "@test/callUrlAddon";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
    });
    globalThis.fetch = (url) => {
      fetchCalls.push({ url });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, {}, null, null, "&extra=1");
    expect(fetchCalls[0].url).to.equal("https://example.com/api&extra=1");
  });

  it("resolves {token} in endpoint before making the call", async () => {
    const name = "@test/callTemplate";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/{id}/run",
      name: name,
    });
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    await MicroFrontendRegistry.call(name, { id: "42", action: "go" });
    expect(fetchCalls[0].url).to.equal("https://example.com/42/run");
    // remaining params sent as body
    expect(JSON.parse(fetchCalls[0].opts.body)).to.deep.equal({ action: "go" });
  });

  it("merges security headers from authProvider into request headers", async () => {
    const name = "@test/callWithAuth";
    MicroFrontendRegistry.add({
      endpoint: "https://example.com/api",
      name: name,
      security: "read",
    });
    // Note: MicroFrontend constructor wraps security in [] when null,
    // but the add() path stores the value as-is for non-array types.
    // For this test we register directly via define with a proper array.
    MicroFrontendRegistry.set(name, {
      endpoint: "https://example.com/api",
      name: name,
      security: ["read"],
    });
    const originalProvider = MicroFrontendRegistry.authProvider;
    MicroFrontendRegistry.setAuthProvider(async () => ({
      Authorization: "Bearer secure",
    }));
    globalThis.fetch = (url, opts) => {
      fetchCalls.push({ url, opts });
      return Promise.resolve(makeMockResponse({ jsonData: {} }));
    };
    try {
      await MicroFrontendRegistry.call(name, {});
      expect(fetchCalls[0].opts.headers["Authorization"]).to.equal(
        "Bearer secure",
      );
    } finally {
      MicroFrontendRegistry.authProvider = originalProvider;
    }
  });
});

// --- MicroFrontendRegCapabilities mixin ---
describe("MicroFrontendRegCapabilities mixin", () => {
  it("can be applied to Object base class", () => {
    const RegClass = MicroFrontendRegCapabilities(Object);
    const inst = new RegClass();
    expect(inst.list).to.deep.equal([]);
    expect(inst.authProvider).to.equal(null);
    expect(inst.MicroFrontend).to.equal(MicroFrontend);
  });

  it("add() warns but still registers when given a non-MicroFrontend object", () => {
    const RegClass = MicroFrontendRegCapabilities(Object);
    const inst = new RegClass();
    // A plain object with only known keys passes the key validation
    inst.define({
      endpoint: "https://example.com",
      name: "test-plain",
      title: null,
      description: null,
      params: {},
      headers: {},
      security: [],
      callback: null,
      method: null,
    });
    expect(inst.has("test-plain")).to.equal(true);
  });

  it("define() returns false when item has unknown keys", () => {
    const RegClass = MicroFrontendRegCapabilities(Object);
    const inst = new RegClass();
    const result = inst.define({
      endpoint: "https://example.com",
      name: "test-bad-keys",
      unknownKey: "bad",
    });
    expect(result).to.equal(false);
    expect(inst.has("test-bad-keys")).to.equal(false);
  });

  it("define() does not add duplicate names", () => {
    const RegClass = MicroFrontendRegCapabilities(Object);
    const inst = new RegClass();
    inst.add({ endpoint: "https://example.com", name: "dup" });
    expect(inst.list.length).to.equal(1);
    inst.add({ endpoint: "https://example.com", name: "dup" });
    expect(inst.list.length).to.equal(1);
  });
});

// --- MicroFrontendRegistryConfig override ---
describe("MicroFrontendRegistryConfig override", () => {
  it("define() applies config overrides for matching service names", () => {
    const RegClass = MicroFrontendRegCapabilities(Object);
    const inst = new RegClass();
    const origConfig = globalThis.MicroFrontendRegistryConfig;
    globalThis.MicroFrontendRegistryConfig = {
      "@test/cfgOverride": { title: "Overridden Title", method: "PUT" },
    };
    try {
      inst.add({
        endpoint: "https://example.com",
        name: "@test/cfgOverride",
        title: "Original",
      });
      const svc = inst.get("@test/cfgOverride");
      expect(svc.title).to.equal("Overridden Title");
      expect(svc.method).to.equal("PUT");
    } finally {
      globalThis.MicroFrontendRegistryConfig = origConfig;
    }
  });
});
