const VIEWS_SPEC_CACHE = new Map();

function normalizePath(path = "") {
  let normalized = String(path || "").trim();
  if (!normalized) {
    return "/";
  }
  if (normalized.charAt(0) !== "/") {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/{2,}/g, "/");
  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }
  return normalized;
}

function toPathname(urlOrPath = "") {
  const normalizedInput = String(urlOrPath || "").trim();
  if (!normalizedInput) {
    return "";
  }
  if (
    normalizedInput.indexOf("http://") === 0 ||
    normalizedInput.indexOf("https://") === 0
  ) {
    try {
      const parsed = new URL(normalizedInput);
      return normalizePath(parsed.pathname || "/");
    } catch (e) {
      return normalizePath(normalizedInput);
    }
  }
  return normalizePath(normalizedInput.split("?")[0]);
}

function toTitleCase(value = "") {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function refNameFromPointer(pointer = "") {
  const parts = String(pointer || "").split("/");
  if (parts.length < 1) {
    return "";
  }
  return parts[parts.length - 1];
}

function extractApiPathFromEndpoint(endpointPath = "") {
  const normalizedPath = toPathname(endpointPath);
  if (!normalizedPath) {
    return "";
  }
  const apiIndex = normalizedPath.indexOf("/x/api/");
  if (apiIndex !== -1) {
    return normalizePath(normalizedPath.substring(apiIndex));
  }
  if (normalizedPath === "/x/api") {
    return normalizedPath;
  }
  return normalizedPath;
}

function resolveSiteApiBasePath() {
  let baseHref = "";
  const baseElement = globalThis.document
    ? globalThis.document.querySelector("base")
    : null;
  if (baseElement && typeof baseElement.href === "string" && baseElement.href) {
    baseHref = baseElement.href;
  }
  if (!baseHref && globalThis.location) {
    baseHref = globalThis.location.href;
  }
  if (baseHref) {
    try {
      const apiUrl = new URL("x/api", baseHref);
      return normalizePath(apiUrl.pathname || "/x/api");
    } catch (e) {}
  }
  return "/x/api";
}

function resolveOpenApiRef(ref = "", openapi = {}) {
  if (
    !ref ||
    typeof ref !== "string" ||
    ref.indexOf("#/components/parameters/") !== 0
  ) {
    return null;
  }
  const refName = refNameFromPointer(ref);
  if (!refName) {
    return null;
  }
  if (
    openapi &&
    openapi.components &&
    openapi.components.parameters &&
    Object.prototype.hasOwnProperty.call(openapi.components.parameters, refName)
  ) {
    return openapi.components.parameters[refName];
  }
  return null;
}

function normalizeParameter(parameter = {}, openapi = {}) {
  let working = parameter;
  if (working && typeof working.$ref === "string") {
    const resolved = resolveOpenApiRef(working.$ref, openapi);
    if (!resolved) {
      return null;
    }
    working = resolved;
  }
  if (!working || typeof working !== "object") {
    return null;
  }
  const schema =
    working.schema && typeof working.schema === "object" ? working.schema : {};
  const enumValues = Array.isArray(schema.enum)
    ? schema.enum.map((value) => `${value}`)
    : [];
  let defaultValue = "";
  if (Object.prototype.hasOwnProperty.call(schema, "default")) {
    defaultValue = schema.default;
  } else if (enumValues.length > 0) {
    defaultValue = enumValues[0];
  }
  return {
    name: working.name ? String(working.name) : "",
    in: working.in ? String(working.in) : "",
    required: working.required === true,
    description: working.description ? String(working.description) : "",
    type: schema.type ? String(schema.type) : "string",
    enumValues,
    defaultValue,
    minimum:
      typeof schema.minimum === "number" ? Number(schema.minimum) : null,
    maximum:
      typeof schema.maximum === "number" ? Number(schema.maximum) : null,
    referenceName:
      working.$ref && typeof working.$ref === "string"
        ? refNameFromPointer(working.$ref)
        : "",
  };
}

function dedupeParameters(parameters = []) {
  const map = {};
  parameters.forEach((parameter) => {
    if (!parameter || !parameter.name || !parameter.in) {
      return;
    }
    const key = `${parameter.in}:${parameter.name}`;
    map[key] = parameter;
  });
  return Object.keys(map).map((key) => map[key]);
}

function getPathItemForEndpoint(openapiPaths = {}, endpointPath = "") {
  const normalizedEndpoint = extractApiPathFromEndpoint(endpointPath);
  if (!normalizedEndpoint) {
    return null;
  }
  if (
    Object.prototype.hasOwnProperty.call(openapiPaths, normalizedEndpoint) &&
    openapiPaths[normalizedEndpoint]
  ) {
    return {
      pathKey: normalizedEndpoint,
      item: openapiPaths[normalizedEndpoint],
    };
  }
  const keys = Object.keys(openapiPaths || {});
  for (let i = 0; i < keys.length; i++) {
    const pathKey = normalizePath(keys[i]);
    if (normalizedEndpoint === pathKey || normalizedEndpoint.endsWith(pathKey)) {
      return {
        pathKey,
        item: openapiPaths[keys[i]],
      };
    }
  }
  return null;
}

function getListEndpoint(entity = {}) {
  const endpoints = Array.isArray(entity.endpoints)
    ? entity.endpoints.map((endpoint) => String(endpoint))
    : [];
  if (endpoints.length < 1) {
    return "";
  }
  for (let i = 0; i < endpoints.length; i++) {
    if (endpoints[i].indexOf("{") === -1) {
      return endpoints[i];
    }
  }
  return endpoints[0];
}

function normalizeEntityDescriptor(entity = {}, openapi = {}, apiBasePath = "") {
  const openapiPaths =
    openapi && openapi.paths && typeof openapi.paths === "object"
      ? openapi.paths
      : {};
  const endpoint = getListEndpoint(entity);
  const resolvedPath = getPathItemForEndpoint(openapiPaths, endpoint);
  const pathItem = resolvedPath && resolvedPath.item ? resolvedPath.item : {};
  const getOperation =
    pathItem && pathItem.get && typeof pathItem.get === "object"
      ? pathItem.get
      : {};
  const pathParameters = Array.isArray(pathItem.parameters)
    ? pathItem.parameters
    : [];
  const operationParameters = Array.isArray(getOperation.parameters)
    ? getOperation.parameters
    : [];
  const normalizedParams = dedupeParameters(
    [...pathParameters, ...operationParameters]
      .map((parameter) => normalizeParameter(parameter, openapi))
      .filter((parameter) => !!parameter),
  );
  const queryParams = normalizedParams.filter(
    (parameter) => parameter.in === "query",
  );
  const queryParamMap = {};
  queryParams.forEach((parameter) => {
    queryParamMap[parameter.name] = parameter;
  });
  const filterableFields = Array.isArray(entity.filterableFields)
    ? entity.filterableFields.map((field) => String(field))
    : [];
  const selectableFields = Array.isArray(entity.selectableFields)
    ? entity.selectableFields.map((field) => String(field))
    : [];
  const sortableFields = Array.isArray(entity.sortableFields)
    ? entity.sortableFields.map((field) => String(field))
    : [];
  const includes = Array.isArray(entity.includes)
    ? entity.includes.map((field) => String(field))
    : [];
  const endpoints = Array.isArray(entity.endpoints)
    ? entity.endpoints.map((item) => String(item))
    : [];
  const entityName = entity.name ? String(entity.name) : "";
  const defaultFields = selectableFields.slice(0, 6);
  const title = toTitleCase(entityName);
  return {
    name: entityName,
    title: title || entityName,
    description: entity.description ? String(entity.description) : "",
    primaryKey: entity.primaryKey ? String(entity.primaryKey) : "id",
    endpoints,
    listEndpoint: endpoint || `${apiBasePath}/v1/${entityName}s`,
    listPath: resolvedPath ? resolvedPath.pathKey : "",
    queryParams,
    queryParamMap,
    filterableFields,
    selectableFields,
    sortableFields,
    includes,
    formats: Array.isArray(entity.formats)
      ? entity.formats.map((value) => String(value))
      : [],
    modes: Array.isArray(entity.modes)
      ? entity.modes.map((value) => String(value))
      : [],
    defaultFields,
  };
}

function getEntitiesFromPayload(payload = {}) {
  const top =
    payload && typeof payload === "object" ? payload : { data: { entities: [] } };
  const data =
    top &&
    top.data &&
    typeof top.data === "object" &&
    !Array.isArray(top.data)
      ? top.data
      : {};
  return Array.isArray(data.entities) ? data.entities : [];
}

function getArrayFromObject(data = {}, candidateKeys = []) {
  for (let i = 0; i < candidateKeys.length; i++) {
    const key = candidateKeys[i];
    if (data && Array.isArray(data[key])) {
      return data[key];
    }
  }
  const keys = Object.keys(data || {});
  for (let i = 0; i < keys.length; i++) {
    const value = data[keys[i]];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
}

function getContentKeyByEntityName(entityName = "") {
  switch (String(entityName || "").toLowerCase()) {
    case "item":
      return "items";
    case "content":
      return "content";
    case "file":
      return "files";
    case "tag":
      return "tags";
    case "block":
      return "blocks";
    case "view":
      return "views";
    case "theme":
      return "themes";
    case "region":
      return "regions";
    case "customelement":
      return "customElements";
    default:
      return "";
  }
}

export function extractViewsRecords(payload = {}, entityConfig = {}) {
  const envelope =
    payload && typeof payload === "object" ? payload : { status: 200, data: {} };
  const data =
    envelope &&
    envelope.data &&
    typeof envelope.data === "object" &&
    !Array.isArray(envelope.data)
      ? envelope.data
      : envelope;
  const entityName =
    entityConfig && entityConfig.name ? String(entityConfig.name) : "";
  const key = getContentKeyByEntityName(entityName);
  const records = getArrayFromObject(data, [
    key,
    "results",
    "records",
    "items",
    "files",
    "content",
    "tags",
  ]);
  const outputRecords = Array.isArray(records) ? records : [];
  return {
    records: outputRecords,
    count:
      typeof data.count === "number"
        ? data.count
        : outputRecords.length,
    total:
      typeof data.total === "number"
        ? data.total
        : outputRecords.length,
    page:
      data && data.page && typeof data.page === "object" ? data.page : {},
  };
}

async function fetchJson(url = "") {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed for ${url} (${response.status})`);
  }
  return await response.json();
}

export async function loadHAXCMSViewsSpec(options = {}) {
  const requestedApiBasePath =
    options && options.apiBasePath ? String(options.apiBasePath) : "";
  const apiBasePath = normalizePath(
    requestedApiBasePath || resolveSiteApiBasePath(),
  );
  const forceRefresh = options && options.forceRefresh === true;
  if (!forceRefresh && VIEWS_SPEC_CACHE.has(apiBasePath)) {
    return await VIEWS_SPEC_CACHE.get(apiBasePath);
  }
  const loader = (async () => {
    const entitiesUrl = `${apiBasePath}/v1/entities`;
    const openapiUrl = `${apiBasePath}/openapi.json`;
    const [entitiesPayload, openapi] = await Promise.all([
      fetchJson(entitiesUrl),
      fetchJson(openapiUrl),
    ]);
    const entities = getEntitiesFromPayload(entitiesPayload).map((entity) =>
      normalizeEntityDescriptor(entity, openapi, apiBasePath),
    );
    entities.sort((a, b) => a.title.localeCompare(b.title));
    const entityMap = {};
    entities.forEach((entity) => {
      if (entity && entity.name) {
        entityMap[entity.name] = entity;
      }
    });
    return {
      apiBasePath,
      entities,
      entityMap,
      openapi,
      links:
        entitiesPayload &&
        entitiesPayload.data &&
        entitiesPayload.data.links &&
        typeof entitiesPayload.data.links === "object"
          ? entitiesPayload.data.links
          : {},
    };
  })();
  VIEWS_SPEC_CACHE.set(apiBasePath, loader);
  try {
    return await loader;
  } catch (e) {
    VIEWS_SPEC_CACHE.delete(apiBasePath);
    throw e;
  }
}

export function clearHAXCMSViewsSpecCache() {
  VIEWS_SPEC_CACHE.clear();
}

