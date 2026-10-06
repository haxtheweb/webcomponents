import { expect } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  resolveSiteApiBasePath,
  extractViewsRecords,
  loadHAXCMSViewsSpec,
  clearHAXCMSViewsSpecCache,
} from "../lib/core/utils/haxcms-views-spec-utility.js";

// loadHAXCMSViewsSpec awaits the shared @site api registry's readyPromise;
// force it resolved-true so spec loads never depend on a real backend.
const REG_STATE_KEY = "__HAXCMSSiteApiRegistryState";

function forceRegistryReady() {
  if (!globalThis[REG_STATE_KEY]) {
    globalThis[REG_STATE_KEY] = {};
  }
  globalThis[REG_STATE_KEY].readyPromise = Promise.resolve(true);
}

const OPENAPI_SPEC = {
  openapi: "3.0.0",
  paths: {
    "/x/api/v1/items": {
      parameters: [
        { name: "pathParam", in: "path", description: "Path-level param" },
      ],
      get: {
        operationId: "listItems",
        parameters: [
          {
            name: "status",
            in: "query",
            description: "Status filter",
            schema: { type: "string", enum: ["draft", "published"] },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 25, minimum: 1, maximum: 100 },
          },
          // duplicate of the path-level param — operation wins on dedupe
          {
            name: "pathParam",
            in: "path",
            description: "Operation-level param",
            schema: { type: "number" },
          },
          // resolvable $ref parameter
          { $ref: "#/components/parameters/refParam" },
          // unresolvable $ref — dropped
          { $ref: "#/components/parameters/missing" },
          // non-$ref garbage — dropped
          null,
        ],
      },
    },
  },
  components: {
    parameters: {
      refParam: {
        name: "refResolved",
        in: "query",
        required: true,
        description: "Resolved via $ref",
        schema: { type: "string", enum: [1, 2] },
      },
    },
  },
};

const ENTITIES_PAYLOAD = {
  data: {
    entities: [
      {
        name: "item",
        description: "Site items",
        primaryKey: "uuid",
        endpoints: ["/x/api/v1/items", "/x/api/v1/items/{id}"],
        filterableFields: ["status"],
        selectableFields: [
          "id",
          "title",
          "slug",
          "status",
          "created",
          "updated",
          "extra",
        ],
        sortableFields: ["title"],
        includes: ["author"],
        formats: ["json"],
        modes: ["list"],
      },
      {
        name: "brokenRef",
        endpoints: ["/x/api/v1/broken"],
      },
      {
        name: "noEndpoint",
      },
    ],
    links: { self: "/x/api/v1/entities" },
  },
};

describe("haxcms-views-spec-utility", () => {
  let savedList;
  let savedConfig;
  let originalFetch;

  beforeEach(() => {
    savedList = MicroFrontendRegistry.list.slice();
    savedConfig = globalThis.MicroFrontendRegistryConfig;
    globalThis.MicroFrontendRegistryConfig = {};
    originalFetch = globalThis.fetch;
    forceRegistryReady();
    clearHAXCMSViewsSpecCache();
  });

  afterEach(() => {
    MicroFrontendRegistry.list.length = 0;
    MicroFrontendRegistry.list.push(...savedList);
    globalThis.MicroFrontendRegistryConfig = savedConfig;
    globalThis.fetch = originalFetch;
    clearHAXCMSViewsSpecCache();
  });

  describe("resolveSiteApiBasePath", () => {
    it("returns a normalized x/api path derived from the base element", () => {
      const result = resolveSiteApiBasePath();
      expect(result.charAt(0)).to.equal("/");
      expect(result.endsWith("/x/api")).to.equal(true);
    });
  });

  describe("extractViewsRecords", () => {
    it("extracts records via the entity name content key", () => {
      const result = extractViewsRecords(
        {
          data: {
            items: [{ id: 1 }],
            count: 42,
            total: 100,
            page: { current: 1 },
          },
        },
        { name: "item" },
      );
      expect(result.records).to.deep.equal([{ id: 1 }]);
      expect(result.count).to.equal(42);
      expect(result.total).to.equal(100);
      expect(result.page).to.deep.equal({ current: 1 });
    });

    it("falls back to generic keys when the entity key misses", () => {
      const result = extractViewsRecords(
        { data: { results: [{ a: 1 }] } },
        { name: "item" },
      );
      expect(result.records).to.deep.equal([{ a: 1 }]);
      expect(result.count).to.equal(1);
      expect(result.total).to.equal(1);
      expect(result.page).to.deep.equal({});
    });

    it("uses the first array on the object when no candidate key matches", () => {
      const result = extractViewsRecords(
        { data: { weird: [{ z: 9 }] } },
        { name: "theme" },
      );
      expect(result.records).to.deep.equal([{ z: 9 }]);
    });

    it("handles a payload whose data is not an object by reading the envelope", () => {
      const result = extractViewsRecords(
        { data: ["x", "y"] },
        { name: "content" },
      );
      // data is an array so the envelope itself is scanned; `data` is the first array
      expect(result.records).to.deep.equal(["x", "y"]);
    });

    it("returns empty records for null payload", () => {
      const result = extractViewsRecords(null, { name: "item" });
      expect(result.records).to.deep.equal([]);
      expect(result.count).to.equal(0);
      expect(result.total).to.equal(0);
    });

    it("maps every known entity name to its content key", () => {
      const cases = {
        item: "items",
        content: "content",
        file: "files",
        tag: "tags",
        block: "blocks",
        view: "views",
        theme: "themes",
        region: "regions",
        customElement: "customElements",
      };
      Object.keys(cases).forEach((name) => {
        const key = cases[name];
        const data = {};
        data[key] = [{ from: key }];
        const result = extractViewsRecords({ data }, { name });
        expect(result.records).to.deep.equal([{ from: key }]);
      });
      // unknown entity name still finds generic keys
      const result = extractViewsRecords(
        { data: { records: [1] } },
        { name: "mystery" },
      );
      expect(result.records).to.deep.equal([1]);
    });
  });

  describe("loadHAXCMSViewsSpec via direct fetch", () => {
    it("loads entities + openapi, normalizes descriptors, and caches", async () => {
      let fetchCount = 0;
      globalThis.fetch = async (url) => {
        fetchCount++;
        if (url === "/x/api/v1/entities") {
          return { ok: true, json: async () => ENTITIES_PAYLOAD };
        }
        if (url === "/x/api/openapi.json") {
          return { ok: true, json: async () => OPENAPI_SPEC };
        }
        throw new Error(`unexpected fetch ${url}`);
      };

      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(spec.apiBasePath).to.equal("/x/api");
      expect(spec.links).to.deep.equal({ self: "/x/api/v1/entities" });
      expect(spec.entities.length).to.equal(3);
      // sorted by title ascending
      expect(spec.entities.map((e) => e.name)).to.deep.equal([
        "brokenRef",
        "item",
        "noEndpoint",
      ]);
      expect(spec.entityMap.item).to.exist;

      // second call hits the cache, not fetch
      const again = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(again).to.equal(spec);
      expect(fetchCount).to.equal(2);
    });

    it("normalizes an entity descriptor against the OpenAPI spec", async () => {
      globalThis.fetch = async (url) => ({
        ok: true,
        json: async () =>
          url.endsWith("/entities") ? ENTITIES_PAYLOAD : OPENAPI_SPEC,
      });
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      const item = spec.entityMap.item;

      expect(item.name).to.equal("item");
      expect(item.title).to.equal("Item");
      expect(item.description).to.equal("Site items");
      expect(item.primaryKey).to.equal("uuid");
      expect(item.listEndpoint).to.equal("/x/api/v1/items");
      expect(item.listPath).to.equal("/x/api/v1/items");
      expect(item.listOperationId).to.equal("listItems");
      expect(item.filterableFields).to.deep.equal(["status"]);
      expect(item.sortableFields).to.deep.equal(["title"]);
      expect(item.includes).to.deep.equal(["author"]);
      expect(item.formats).to.deep.equal(["json"]);
      expect(item.modes).to.deep.equal(["list"]);
      expect(item.defaultFields).to.deep.equal([
        "id",
        "title",
        "slug",
        "status",
        "created",
        "updated",
      ]);

      // query params only, keyed map
      expect(Object.keys(item.queryParamMap).sort()).to.deep.equal([
        "limit",
        "refResolved",
        "status",
      ]);
      const status = item.queryParamMap.status;
      expect(status.enumValues).to.deep.equal(["draft", "published"]);
      expect(status.defaultValue).to.equal("draft");
      expect(status.required).to.equal(false);
      expect(status.type).to.equal("string");

      const limit = item.queryParamMap.limit;
      expect(limit.defaultValue).to.equal(25);
      expect(limit.minimum).to.equal(1);
      expect(limit.maximum).to.equal(100);

      // $ref resolved param keeps the resolved name/values; enum first value is default
      const refResolved = item.queryParamMap.refResolved;
      expect(refResolved.required).to.equal(true);
      // referenceName keeps the original pointer name from before the $ref
      // was resolved (fixed: it previously read $ref after resolution,
      // always losing the name)
      expect(refResolved.referenceName).to.equal("refParam");
      expect(refResolved.enumValues).to.deep.equal(["1", "2"]);
      expect(refResolved.defaultValue).to.equal("1");
    });

    it("dedupes path/operation params with operation winning", async () => {
      globalThis.fetch = async (url) => ({
        ok: true,
        json: async () =>
          url.endsWith("/entities") ? ENTITIES_PAYLOAD : OPENAPI_SPEC,
      });
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      const item = spec.entityMap.item;
      // pathParam is a path-level param so it is NOT in queryParams; but the
      // descriptor keeps all normalized params deduped internally — the
      // operation-level definition (number type) must have won the merge
      // observable via queryParamMap absence + no duplicates in queryParams
      const names = item.queryParams.map((p) => p.name);
      expect(names.length).to.equal(new Set(names).size);
      expect(names).to.not.include("pathParam");
    });

    it("derives fallback listEndpoint and empty listPath when the endpoint misses the spec", async () => {
      globalThis.fetch = async (url) => ({
        ok: true,
        json: async () =>
          url.endsWith("/entities") ? ENTITIES_PAYLOAD : OPENAPI_SPEC,
      });
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      const broken = spec.entityMap.brokenRef;
      expect(broken.listEndpoint).to.equal("/x/api/v1/broken");
      expect(broken.listPath).to.equal("");
      expect(broken.listOperationId).to.equal("");
      expect(broken.title).to.equal("Broken Ref");
      // an entity with no endpoints gets the conventional fallback path
      const noEndpoint = spec.entityMap.noEndpoint;
      expect(noEndpoint.listEndpoint).to.equal("/x/api/v1/noEndpoints");
    });

    it("forceRefresh bypasses the cache", async () => {
      let fetchCount = 0;
      globalThis.fetch = async (url) => {
        fetchCount++;
        return {
          ok: true,
          json: async () =>
            url.endsWith("/entities") ? ENTITIES_PAYLOAD : OPENAPI_SPEC,
        };
      };
      await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      await loadHAXCMSViewsSpec({ apiBasePath: "/x/api", forceRefresh: true });
      expect(fetchCount).to.equal(4);
    });

    it("clearHAXCMSViewsSpecCache empties the cache", async () => {
      let fetchCount = 0;
      globalThis.fetch = async (url) => {
        fetchCount++;
        return {
          ok: true,
          json: async () =>
            url.endsWith("/entities") ? ENTITIES_PAYLOAD : OPENAPI_SPEC,
        };
      };
      await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      clearHAXCMSViewsSpecCache();
      await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(fetchCount).to.equal(4);
    });

    it("rejects and evicts the cache entry when a fetch fails", async () => {
      globalThis.fetch = async () => ({ ok: false, status: 500 });
      let threw = false;
      try {
        await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      } catch (e) {
        threw = true;
      }
      expect(threw).to.equal(true);
    });
  });

  describe("loadHAXCMSViewsSpec via MicroFrontendRegistry operations", () => {
    function registerOp(name, endpoint, payload, ok = true, status = 200) {
      MicroFrontendRegistry.add({
        endpoint,
        name,
        title: name,
        description: "test op",
        params: {},
        headers: {},
        security: [],
        method: "GET",
      });
      return { name, payload, ok, status };
    }

    it("uses @site operations when they are registered", async () => {
      registerOp(
        "@site/listEntityDescriptors",
        "/fixtures/entities.json",
        ENTITIES_PAYLOAD,
      );
      registerOp(
        "@site/getSiteOpenApiJson",
        "/fixtures/openapi.json",
        OPENAPI_SPEC,
      );
      globalThis.fetch = async (url) => {
        if (url === "/fixtures/entities.json") {
          return { ok: true, status: 200, json: async () => ENTITIES_PAYLOAD };
        }
        if (url === "/fixtures/openapi.json") {
          return { ok: true, status: 200, json: async () => OPENAPI_SPEC };
        }
        throw new Error(`unexpected fetch ${url}`);
      };
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(spec.entityMap.item).to.exist;
      expect(spec.openapi.paths["/x/api/v1/items"]).to.exist;
    });

    it("unwraps a registry openapi payload nested under data", async () => {
      registerOp(
        "@site/listEntityDescriptors",
        "/fixtures/entities.json",
        ENTITIES_PAYLOAD,
      );
      MicroFrontendRegistry.add({
        endpoint: "/fixtures/openapi-wrapped.json",
        name: "@site/getSiteOpenApiJson",
        title: "wrapped",
        description: "",
        params: {},
        headers: {},
        security: [],
        method: "GET",
      });
      globalThis.fetch = async (url) => {
        if (url === "/fixtures/entities.json") {
          return { ok: true, status: 200, json: async () => ENTITIES_PAYLOAD };
        }
        // wrapped in an envelope; utility must unwrap .data
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: 200, data: OPENAPI_SPEC }),
        };
      };
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(spec.openapi.openapi).to.equal("3.0.0");
      expect(spec.entityMap.item.listOperationId).to.equal("listItems");
    });

    it("falls back to direct fetch when a registry call returns a non-200 status", async () => {
      registerOp(
        "@site/listEntityDescriptors",
        "/fixtures/entities.json",
        ENTITIES_PAYLOAD,
      );
      registerOp(
        "@site/getSiteOpenApiJson",
        "/fixtures/openapi.json",
        OPENAPI_SPEC,
      );
      globalThis.fetch = async (url) => {
        if (
          url === "/fixtures/entities.json" ||
          url === "/fixtures/openapi.json"
        ) {
          // registry-backed calls report failure status so the utility falls
          // back to direct fetches of apiBasePath endpoints
          return {
            ok: false,
            status: 500,
            json: async () => ({ message: "broken" }),
          };
        }
        if (url === "/x/api/v1/entities") {
          return { ok: true, json: async () => ENTITIES_PAYLOAD };
        }
        if (url === "/x/api/openapi.json") {
          return { ok: true, json: async () => OPENAPI_SPEC };
        }
        throw new Error(`unexpected fetch ${url}`);
      };
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(spec.entityMap.item).to.exist;
      expect(spec.openapi.openapi).to.equal("3.0.0");
    });

    it("handles an entities payload with no entities array", async () => {
      registerOp("@site/listEntityDescriptors", "/fixtures/entities.json", {});
      registerOp(
        "@site/getSiteOpenApiJson",
        "/fixtures/openapi.json",
        OPENAPI_SPEC,
      );
      globalThis.fetch = async (url) => {
        if (url === "/fixtures/entities.json") {
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: "not-an-object" }),
          };
        }
        return { ok: true, status: 200, json: async () => OPENAPI_SPEC };
      };
      const spec = await loadHAXCMSViewsSpec({ apiBasePath: "/x/api" });
      expect(spec.entities).to.deep.equal([]);
      expect(spec.entityMap).to.deep.equal({});
      expect(spec.links).to.deep.equal({});
    });
  });
});
