import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

/**
 * Demo-only @site/* operation registrations.
 *
 * In demo mode (globalThis.HAXCMSContext === "demo") the real site API
 * bootstrap (configureHAXCMSSiteApiRegistry) is a no-op because appSettings
 * has no siteApiBasePath/siteOpenApiPath. This helper directly registers
 * every @site/* operation the Files Admin and Views Admin dialogs rely on,
 * pointing each at a static JSON fixture served by the dev server. All
 * operations are forced to GET so a static file server can answer them
 * (mutation endpoints GET a canned-success file; the UI only checks
 * status===200 and toasts, it does not verify persisted state).
 */
const SITE_STATE_KEY = "__HAXCMSSiteApiRegistryState";
const DEFAULT_FIXTURE_BASE = "dist/dev/site-api";

const DEMO_OPERATIONS = [
  // spec / discovery — used by loadHAXCMSViewsSpec()
  { name: "@site/getSiteOpenApiJson", file: "openapi.json" },
  { name: "@site/listEntityDescriptors", file: "entities.json" },
  // Files Admin
  { name: "@site/listFiles", file: "listFiles.json" },
  { name: "@site/deleteFileByUuid", file: "fileDelete.json" },
  { name: "@site/updateFileByUuid", file: "fileUpdate.json" },
  // Views Admin entity list endpoints
  { name: "@site/listItems", file: "listItems.json" },
  { name: "@site/listContent", file: "listContent.json" },
  { name: "@site/listTags", file: "listTags.json" },
  { name: "@site/listCustomElements", file: "listCustomElements.json" },
  { name: "@site/listBlocks", file: "listBlocks.json" },
  { name: "@site/listThemes", file: "listThemes.json" },
  { name: "@site/listViews", file: "listViews.json" },
  { name: "@site/listRegions", file: "listRegions.json" },
  { name: "@site/listReports", file: "listReports.json" },
  { name: "@site/getAnalyticsCapabilities", file: "analytics.json" },
  { name: "@site/listItemRevisions", file: "listItemRevisions.json" },
];

function cleanString(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

function resolveFixtureBase(appSettings = {}) {
  const fromSettings = cleanString(appSettings.demoSiteApiBasePath);
  if (fromSettings !== "") {
    return fromSettings;
  }
  return DEFAULT_FIXTURE_BASE;
}

function joinPath(base = "", file = "") {
  const cleanBase = cleanString(base);
  const cleanFile = cleanString(file);
  if (cleanBase === "") {
    return cleanFile;
  }
  if (cleanBase.charAt(cleanBase.length - 1) === "/") {
    return `${cleanBase}${cleanFile}`;
  }
  return `${cleanBase}/${cleanFile}`;
}

function registerDemoOperation(endpoint, name) {
  const definition = {
    endpoint,
    name,
    title: name,
    description: "Demo fixture response",
    params: {},
    headers: {},
    security: [],
    method: "GET",
  };
  if (MicroFrontendRegistry.has(name)) {
    // already registered (e.g. jwtChanged re-call) — update in place
    if (MicroFrontendRegistry.MicroFrontend) {
      MicroFrontendRegistry.set(
        name,
        new MicroFrontendRegistry.MicroFrontend(definition),
      );
    } else {
      MicroFrontendRegistry.set(name, definition);
    }
  } else {
    MicroFrontendRegistry.add(definition);
  }
}

function markRegistryReady() {
  if (!globalThis[SITE_STATE_KEY]) {
    globalThis[SITE_STATE_KEY] = {};
  }
  const state = globalThis[SITE_STATE_KEY];
  state.bootstrapping = false;
  state.bootstrapped = true;
  state.readyPromise = Promise.resolve(true);
}

/**
 * Registers demo @site/* MicroFrontend operations against static JSON
 * fixtures so Files Admin and Views Admin work without a live backend.
 * No-op unless globalThis.HAXCMSContext === "demo".
 */
export function configureHAXCMSDemoSiteApiRegistry(appSettings = {}) {
  if (globalThis.HAXCMSContext !== "demo") {
    return;
  }
  const fixtureBase = resolveFixtureBase(appSettings);
  for (let i = 0; i < DEMO_OPERATIONS.length; i++) {
    const op = DEMO_OPERATIONS[i];
    const endpoint = joinPath(fixtureBase, op.file);
    registerDemoOperation(endpoint, op.name);
  }
  markRegistryReady();
}
