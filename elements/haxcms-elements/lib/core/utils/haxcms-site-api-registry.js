import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

const SITE_STATE_KEY = "__HAXCMSSiteApiRegistryState";
const SITE_OPERATION_PREFIX = "@site/";
const SITE_METHODS = ["get", "post", "put", "patch", "delete", "options", "head"];

function cleanString(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

function normalizePath(value = "") {
  let normalized = cleanString(value);
  if (normalized === "") {
    return "";
  }
  if (normalized.charAt(0) !== "/") {
    normalized = "/" + normalized;
  }
  while (
    normalized.length > 1 &&
    normalized.charAt(normalized.length - 1) === "/"
  ) {
    normalized = normalized.substring(0, normalized.length - 1);
  }
  return normalized;
}

function getState() {
  if (!globalThis[SITE_STATE_KEY]) {
    globalThis[SITE_STATE_KEY] = {
      appSettings: {},
      auth: {
        jwt: "",
        siteToken: "",
        userToken: "",
      },
      securitySchemes: {},
      siteApiBasePath: "",
      siteOpenApiPath: "",
      readyPromise: null,
      bootstrapping: false,
      bootstrapped: false,
      previousAuthProvider: null,
      providerApplied: false,
    };
  }
  return globalThis[SITE_STATE_KEY];
}

function deriveSiteApiBasePath(appSettings = {}) {
  const fromSettings = normalizePath(appSettings.siteApiBasePath || "");
  if (fromSettings !== "") {
    return fromSettings;
  }
  const openApiPath = cleanString(appSettings.siteOpenApiPath || "");
  if (openApiPath !== "") {
    return normalizePath(openApiPath.replace(/\/openapi(?:\.json|\.yaml)?$/, ""));
  }
  return "";
}

function getSiteOpenApiPath(appSettings = {}, siteApiBasePath = "") {
  const explicitPath = cleanString(appSettings.siteOpenApiPath || "");
  if (explicitPath !== "") {
    return explicitPath;
  }
  if (siteApiBasePath === "") {
    return "";
  }
  return `${siteApiBasePath}/openapi.json`;
}

function buildEndpoint(siteApiBasePath = "", openApiPath = "") {
  let endpoint = String(openApiPath || "");
  endpoint = endpoint.replace(/^\/x\/api/, "");
  if (endpoint === "") {
    endpoint = "/";
  }
  if (endpoint.charAt(0) !== "/") {
    endpoint = "/" + endpoint;
  }
  return `${normalizePath(siteApiBasePath)}${endpoint}`;
}

function buildOperationName(operationId = "") {
  const normalizedOperationId = cleanString(operationId);
  if (normalizedOperationId === "") {
    return "";
  }
  return `${SITE_OPERATION_PREFIX}${normalizedOperationId}`;
}

function readSecuritySchemes(openApiSpec = {}) {
  if (
    !openApiSpec ||
    typeof openApiSpec !== "object" ||
    !openApiSpec.components ||
    typeof openApiSpec.components !== "object" ||
    !openApiSpec.components.securitySchemes ||
    typeof openApiSpec.components.securitySchemes !== "object"
  ) {
    return {};
  }
  return openApiSpec.components.securitySchemes;
}

function normalizeOperationSecurity(pathConfig = {}, operation = {}) {
  if (
    operation &&
    Object.prototype.hasOwnProperty.call(operation, "security")
  ) {
    if (Array.isArray(operation.security)) {
      return operation.security;
    }
    return [];
  }
  if (Array.isArray(pathConfig.security)) {
    return pathConfig.security;
  }
  return [];
}

function mapParams(pathConfig = {}, operation = {}) {
  const mapped = {};
  const params = [];
  if (Array.isArray(pathConfig.parameters)) {
    pathConfig.parameters.forEach((parameter) => params.push(parameter));
  }
  if (Array.isArray(operation.parameters)) {
    operation.parameters.forEach((parameter) => params.push(parameter));
  }
  params.forEach((parameter) => {
    if (!parameter || typeof parameter !== "object") {
      return;
    }
    const name = cleanString(parameter.name || "");
    if (name === "") {
      return;
    }
    const description =
      cleanString(parameter.description || "") ||
      `${cleanString(parameter.in || "query")} parameter`;
    mapped[name] = description;
  });
  return mapped;
}

function registerOrUpdate(definition = {}) {
  const name = cleanString(definition.name || "");
  if (name === "") {
    return;
  }
  if (MicroFrontendRegistry.has(name)) {
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

function registerFromOpenApi(openApiSpec = {}, siteApiBasePath = "") {
  let count = 0;
  if (
    !openApiSpec ||
    typeof openApiSpec !== "object" ||
    !openApiSpec.paths ||
    typeof openApiSpec.paths !== "object"
  ) {
    return count;
  }
  Object.keys(openApiSpec.paths).forEach((openApiPath) => {
    if (String(openApiPath).indexOf("/x/api") !== 0) {
      return;
    }
    const pathConfig = openApiSpec.paths[openApiPath];
    if (!pathConfig || typeof pathConfig !== "object") {
      return;
    }
    SITE_METHODS.forEach((method) => {
      if (!Object.prototype.hasOwnProperty.call(pathConfig, method)) {
        return;
      }
      const operation = pathConfig[method];
      if (!operation || typeof operation !== "object") {
        return;
      }
      const name = buildOperationName(operation.operationId || "");
      if (name === "") {
        return;
      }
      const summary = cleanString(operation.summary || "");
      const description = cleanString(operation.description || "");
      registerOrUpdate({
        endpoint: buildEndpoint(siteApiBasePath, openApiPath),
        name,
        title: summary || name,
        description: description || summary,
        params: mapParams(pathConfig, operation),
        headers: {},
        security: normalizeOperationSecurity(pathConfig, operation),
        method: method.toUpperCase(),
      });
      count += 1;
    });
  });
  return count;
}

function resolveToken(schemeName = "", auth = {}) {
  const normalizedName = String(schemeName || "").toLowerCase();
  if (
    normalizedName.indexOf("bearer") !== -1 ||
    normalizedName.indexOf("jwt") !== -1
  ) {
    return cleanString(auth.jwt || "");
  }
  if (normalizedName.indexOf("site") !== -1) {
    return cleanString(auth.siteToken || "");
  }
  if (normalizedName.indexOf("user") !== -1) {
    return cleanString(auth.userToken || "");
  }
  return "";
}

function headersForRequirement(requirement = {}, schemes = {}, auth = {}) {
  if (!requirement || typeof requirement !== "object") {
    return null;
  }
  const keys = Object.keys(requirement);
  if (keys.length === 0) {
    return {};
  }
  const headers = {};
  for (let i = 0; i < keys.length; i++) {
    const schemeName = keys[i];
    const scheme = schemes[schemeName] || {};
    const schemeType = cleanString(scheme.type || "").toLowerCase();
    const schemeIn = cleanString(scheme.in || "").toLowerCase();
    const schemeValue = cleanString(scheme.scheme || "").toLowerCase();
    if (schemeType === "http" && schemeValue === "bearer") {
      const token = resolveToken(schemeName, auth);
      if (token === "") {
        return null;
      }
      headers.Authorization = `Bearer ${token}`;
      continue;
    }
    if (schemeType === "apikey" && schemeIn === "header") {
      const token = resolveToken(schemeName, auth);
      const headerName = cleanString(scheme.name || schemeName);
      if (token === "" || headerName === "") {
        return null;
      }
      headers[headerName] = token;
      continue;
    }
    if (schemeName === "bearerAuth") {
      const token = resolveToken(schemeName, auth);
      if (token === "") {
        return null;
      }
      headers.Authorization = `Bearer ${token}`;
      continue;
    }
    const fallbackToken = resolveToken(schemeName, auth);
    if (fallbackToken === "") {
      return null;
    }
    headers[schemeName] = fallbackToken;
  }
  return headers;
}

function resolveHeaders(requirements = [], schemes = {}, auth = {}) {
  if (!Array.isArray(requirements) || requirements.length === 0) {
    return {};
  }
  for (let i = 0; i < requirements.length; i++) {
    const headers = headersForRequirement(requirements[i], schemes, auth);
    if (headers !== null) {
      return headers;
    }
  }
  return {};
}

function ensureAuthProvider(state) {
  if (state.providerApplied) {
    return;
  }
  if (!state.previousAuthProvider && typeof MicroFrontendRegistry.authProvider === "function") {
    state.previousAuthProvider = MicroFrontendRegistry.authProvider;
  }
  const provider = async (security = [], context = {}) => {
    let headers = {};
    if (typeof state.previousAuthProvider === "function") {
      const previousHeaders = await state.previousAuthProvider(security, context);
      if (previousHeaders && typeof previousHeaders === "object") {
        headers = Object.assign(headers, previousHeaders);
      }
    }
    const name = context && typeof context.name === "string" ? context.name : "";
    if (name.indexOf(SITE_OPERATION_PREFIX) !== 0) {
      return headers;
    }
    return Object.assign(
      headers,
      resolveHeaders(security, state.securitySchemes, state.auth),
    );
  };
  if (typeof MicroFrontendRegistry.setAuthProvider === "function") {
    MicroFrontendRegistry.setAuthProvider(provider);
    state.providerApplied = true;
  }
}

function updateAuth(state, appSettings = {}, jwtValue, hasJwtOverride) {
  if (hasJwtOverride) {
    state.auth.jwt = cleanString(jwtValue || "");
  } else {
    const appJwt = cleanString(appSettings.jwt || "");
    if (appJwt !== "") {
      state.auth.jwt = appJwt;
    }
  }
  if (Object.prototype.hasOwnProperty.call(appSettings, "siteToken")) {
    state.auth.siteToken = cleanString(appSettings.siteToken || "");
  }
  if (Object.prototype.hasOwnProperty.call(appSettings, "userToken")) {
    state.auth.userToken = cleanString(appSettings.userToken || "");
  }
}

async function bootstrapFromOpenApi(state, siteApiBasePath, siteOpenApiPath) {
  const response = await fetch(siteOpenApiPath, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Unable to load site OpenAPI (${response.status})`);
  }
  const openApiSpec = await response.json();
  state.securitySchemes = readSecuritySchemes(openApiSpec);
  const count = registerFromOpenApi(openApiSpec, siteApiBasePath);
  if (count === 0) {
    throw new Error("No @site operations registered from OpenAPI");
  }
}

export function configureHAXCMSSiteApiRegistry(appSettings = {}, jwtValue) {
  const state = getState();
  if (appSettings && typeof appSettings === "object") {
    state.appSettings = appSettings;
  } else if (!state.appSettings || typeof state.appSettings !== "object") {
    state.appSettings = {};
  }
  const hasJwtOverride = arguments.length > 1;
  updateAuth(state, state.appSettings, jwtValue, hasJwtOverride);
  ensureAuthProvider(state);
  const siteApiBasePath = deriveSiteApiBasePath(state.appSettings);
  const siteOpenApiPath = getSiteOpenApiPath(
    state.appSettings,
    siteApiBasePath,
  );
  if (siteApiBasePath === "" || siteOpenApiPath === "") {
    state.bootstrapping = false;
    state.bootstrapped = false;
    state.readyPromise = Promise.resolve(false);
    return state.readyPromise;
  }
  const sameBootstrapTarget =
    state.siteApiBasePath === siteApiBasePath &&
    state.siteOpenApiPath === siteOpenApiPath;
  if (
    sameBootstrapTarget &&
    state.bootstrapping === true &&
    state.readyPromise &&
    typeof state.readyPromise.then === "function"
  ) {
    return state.readyPromise;
  }
  const shouldReload =
    !sameBootstrapTarget ||
    state.bootstrapped !== true;
  if (!shouldReload && state.readyPromise) {
    return state.readyPromise;
  }
  state.siteApiBasePath = siteApiBasePath;
  state.siteOpenApiPath = siteOpenApiPath;
  state.bootstrapping = true;
  state.readyPromise = (async () => {
    try {
      await bootstrapFromOpenApi(
        state,
        siteApiBasePath,
        siteOpenApiPath,
      );
      state.bootstrapped = true;
      state.bootstrapping = false;
      return true;
    } catch (e) {
      state.bootstrapping = false;
      state.bootstrapped = false;
      return false;
    }
  })();
  return state.readyPromise;
}

export function waitForHAXCMSSiteApiRegistryReady() {
  const state = getState();
  if (state.readyPromise && typeof state.readyPromise.then === "function") {
    return state.readyPromise;
  }
  return Promise.resolve(false);
}
