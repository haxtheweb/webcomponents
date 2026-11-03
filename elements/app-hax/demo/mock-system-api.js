/**
 * app-hax DEMO ONLY: an in-page fake of the HAXcms system API.
 *
 * Loaded by demo/index.html as a classic script BEFORE app-hax boots. Nothing
 * in app-hax.js or lib/ imports this file, so production builds never see it.
 * It wraps globalThis.fetch and answers only requests under MOCK_BASE; every
 * other request (fixtures, modules, images) passes through untouched.
 *
 * Why in-page instead of static JSON files: app-hax discovers @system/*
 * operations from <systemApiBasePath>/openapi.json and then calls them with
 * their real methods (POST / PATCH / DELETE) and real auth headers. A static
 * host (dev server, Vercel PR previews) can't answer those, and a mock that
 * skips the OpenAPI bootstrap would not exercise the real client code path.
 *
 * What it imitates (shapes follow haxcms-nodejs):
 *   - session/login        any username + non-empty password signs in;
 *                          password "wrong" returns 401 to test the error UI
 *   - session/connection-test + refresh  rehydrate from sessionStorage, the
 *                          stand-in for the HttpOnly refresh cookie
 *   - session/logout       clears the session
 *   - every other route    enforces Bearer JWT + X-HAXCMS-User-Token exactly
 *                          as the system spec declares, so a logged-out UI
 *                          still gets 401s the way it would in production
 *
 * URL switches:
 *   ?demo-login=auto   start signed in (skips the login modal)
 *   ?demo-login=reset  start signed out (clears any stored demo session)
 *   ?demo-sites=empty  start with no sites (empty dashboard state)
 */
(function () {
  "use strict";
  const script = globalThis.document && globalThis.document.currentScript;
  const scriptUrl = new URL(
    script && script.src ? script.src : "mock-system-api.js",
    globalThis.location.href,
  );
  // belt and braces: refuse to install anywhere but a demo folder
  if (scriptUrl.pathname.indexOf("/demo/") === -1) {
    console.warn("app-hax mock system API refused: not loaded from /demo/");
    return;
  }
  const DEMO_DIR = new URL("./", scriptUrl).pathname;
  const SPEC_BASE = "/system/api/v1";
  const MOCK_BASE = `${DEMO_DIR}mock-api${SPEC_BASE}`;
  const SESSION_KEY = "app-hax-demo-session";
  const JWT_TTL_SECONDS = 15 * 60;
  const realFetch = globalThis.fetch.bind(globalThis);
  const params = new URLSearchParams(globalThis.location.search);

  // ---------------------------------------------------------------------------
  // session (sessionStorage plays the role of the HttpOnly refresh cookie)
  // ---------------------------------------------------------------------------
  function b64url(value) {
    return globalThis
      .btoa(unescape(encodeURIComponent(JSON.stringify(value))))
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
  function randomId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  // unsigned but well formed, so jwt-login can read exp for proactive refresh
  function mintJwt(user) {
    const now = Math.floor(Date.now() / 1000);
    return [
      b64url({ alg: "none", typ: "JWT" }),
      b64url({ user, iat: now, exp: now + JWT_TTL_SECONDS, demo: true }),
      "demo-signature",
    ].join(".");
  }
  function readSession() {
    try {
      const raw = globalThis.sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  function writeSession(session) {
    try {
      if (session) {
        globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        globalThis.sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // storage blocked: the session just won't survive a reload
    }
    return session;
  }
  function startSession(user) {
    return writeSession({
      user,
      jwt: mintJwt(user),
      userToken: `demo-user-token-${randomId()}`,
      siteToken: `demo-site-token-${randomId()}`,
    });
  }
  function rotateJwt(session) {
    session.jwt = mintJwt(session.user);
    return writeSession(session);
  }
  function sessionTokens(session) {
    return { userToken: session.userToken, siteToken: session.siteToken };
  }
  if (params.get("demo-login") === "reset") {
    writeSession(null);
  } else if (params.get("demo-login") === "auto" && !readSession()) {
    startSession("demo");
  }

  // ---------------------------------------------------------------------------
  // fixtures: the existing demo/*.json files, loaded once and kept in memory so
  // mutations (create, clone, archive, toggles) show up until the page reloads
  // ---------------------------------------------------------------------------
  const fixtureCache = {};
  function fixture(name) {
    if (!fixtureCache[name]) {
      fixtureCache[name] = realFetch(`${DEMO_DIR}${name}`)
        .then((r) => r.json())
        .catch(() => ({ status: 200, data: {} }));
    }
    return fixtureCache[name].then((d) => JSON.parse(JSON.stringify(d)));
  }
  let sitesState = null;
  async function sites() {
    if (!sitesState) {
      sitesState = await fixture(
        params.get("demo-sites") === "empty" ? "sitesEmpty.json" : "sites.json",
      );
    }
    return sitesState;
  }
  function siteItems(state) {
    return state.data && Array.isArray(state.data.items)
      ? state.data.items
      : [];
  }
  function findSite(state, name) {
    return siteItems(state).find(
      (item) =>
        item.metadata && item.metadata.site && item.metadata.site.name === name,
    );
  }
  const settingsState = {};
  async function settings(key, fixtureName) {
    if (!settingsState[key]) {
      settingsState[key] = fixtureName
        ? await fixture(fixtureName)
        : { status: 200, data: {} };
    }
    return settingsState[key];
  }
  function patchSettings(state, body) {
    const patch = body && typeof body === "object" ? body : {};
    state.data = Object.assign({}, state.data, patch.data || patch);
    return state;
  }

  // ---------------------------------------------------------------------------
  // routes. `security` mirrors the haxcms-nodejs system spec so the client's
  // registry resolves the same headers it would against a real backend.
  // ---------------------------------------------------------------------------
  const USER = [{ bearerAuth: [], userTokenHeader: [] }];
  const BEARER = [{ bearerAuth: [] }];
  const SITE = [{ siteTokenHeader: [] }];
  const OPEN = [];
  const ok = (data) => ({ status: 200, data });
  const routes = [];
  function route(method, path, operationId, security, handler) {
    routes.push({ method, path, operationId, security, handler });
  }

  // --- session ---------------------------------------------------------------
  async function login(req) {
    const body = req.body || {};
    const user = String(body.username || "").trim();
    const password = String(body.password || "");
    if (user === "" || password === "") {
      return [
        401,
        { status: 401, data: { message: "Authentication required" } },
      ];
    }
    // same status and body haxcms-nodejs sends for bad credentials
    if (password === "wrong") {
      return [
        401,
        { status: 401, data: { message: "Invalid username or password" } },
      ];
    }
    const session = startSession(user);
    return [
      200,
      Object.assign({ status: 200, jwt: session.jwt }, sessionTokens(session)),
    ];
  }
  async function refresh() {
    const session = readSession();
    if (!session) {
      return [401, { status: 401, data: { message: "No refresh session" } }];
    }
    rotateJwt(session);
    return [
      200,
      Object.assign({ status: 200, jwt: session.jwt }, sessionTokens(session)),
    ];
  }
  async function connectionTest(req) {
    const session = readSession();
    if (!session) {
      return [401, { status: 401, authenticated: false }];
    }
    // a bearer that doesn't match is treated like an expired one: recover
    // from the "refresh cookie" and hand back a fresh token
    const refreshed = req.bearer !== session.jwt;
    if (refreshed) {
      rotateJwt(session);
    }
    return [
      200,
      Object.assign(
        {
          status: 200,
          authenticated: true,
          refreshed,
          jwt: session.jwt,
          user: session.user,
        },
        sessionTokens(session),
      ),
    ];
  }
  route("POST", "/session/login", "sessionLogin", OPEN, login);
  route("GET", "/session/refresh", "sessionRefreshGet", OPEN, refresh);
  route("POST", "/session/refresh", "sessionRefreshPost", OPEN, refresh);
  route(
    "GET",
    "/session/connection-test",
    "sessionConnectionTestGet",
    OPEN,
    connectionTest,
  );
  route(
    "POST",
    "/session/connection-test",
    "sessionConnectionTestPost",
    OPEN,
    connectionTest,
  );
  route("POST", "/session/logout", "sessionLogout", OPEN, async () => {
    writeSession(null);
    return [200, ok("logged out")];
  });
  async function userData(req) {
    const data = await fixture("getUserData.json");
    data.data.userName = req.session.user;
    return [200, data];
  }
  route("GET", "/session/user", "sessionUserGet", USER, userData);
  route("POST", "/session/user", "sessionUserPost", USER, userData);

  // --- sites -----------------------------------------------------------------
  route("GET", "/sites", "listSites", USER, async () => [200, await sites()]);
  route("POST", "/sites", "createSite", USER, async (req) => {
    const state = await sites();
    const created = await fixture("createSite.json");
    const site = (req.body && req.body.site) || {};
    const name = String(site.name || `demo-${randomId()}`).trim();
    created.data.id = randomId();
    created.data.title = name;
    if (created.data.metadata && created.data.metadata.site) {
      created.data.metadata.site.name = name;
      if (site.theme && created.data.metadata.theme) {
        created.data.metadata.theme.element = site.theme;
      }
    }
    siteItems(state).push(JSON.parse(JSON.stringify(created.data)));
    return [200, created];
  });
  route("GET", "/sites/{siteName}", "siteInfoGet", USER, async (req) => {
    const site = findSite(await sites(), req.path.siteName);
    return site ? [200, ok(site)] : notFound("Site not found");
  });
  route("POST", "/sites/{siteName}/clone", "cloneSite", USER, async (req) => {
    const state = await sites();
    const source = findSite(state, req.path.siteName);
    if (!source) {
      return notFound("Site not found");
    }
    const copy = JSON.parse(JSON.stringify(source));
    const name = `${req.path.siteName}-copy`;
    copy.id = randomId();
    copy.title = `${source.title} (copy)`;
    copy.metadata.site.name = name;
    siteItems(state).push(copy);
    return [200, ok({ detail: "Site copied", name })];
  });
  route(
    "POST",
    "/sites/{siteName}/archive",
    "archiveSite",
    USER,
    async (req) => {
      const state = await sites();
      const items = siteItems(state);
      const index = items.indexOf(findSite(state, req.path.siteName));
      if (index === -1) {
        return notFound("Site not found");
      }
      items.splice(index, 1);
      return [200, ok({ detail: "Site archived", name: req.path.siteName })];
    },
  );
  route(
    "POST",
    "/sites/{siteName}/download",
    "downloadSite",
    USER,
    async (req) => [
      200,
      ok({
        link: `${DEMO_DIR}downloadSite.json`,
        name: `${req.path.siteName}.zip`,
      }),
    ],
  );
  route(
    "POST",
    "/sites/{siteName}/download-skeleton",
    "downloadSiteSkeleton",
    USER,
    async (req) => [
      200,
      ok({
        link: `${DEMO_DIR}skeletons/course-site-template.json`,
        name: `${req.path.siteName}-skeleton.json`,
      }),
    ],
  );
  route(
    "POST",
    "/sites/{siteName}/save-as-template",
    "saveSiteAsTemplate",
    USER,
    async (req) => [
      200,
      ok({
        saved: true,
        name: req.path.siteName,
        message: "Saved as template (demo)",
      }),
    ],
  );

  // --- system configuration ----------------------------------------------------
  route("GET", "/status", "systemStatusGet", USER, async () => [
    200,
    await fixture("connectionSettings.json"),
  ]);
  route("GET", "/system/version", "systemVersionGet", USER, async () => [
    200,
    ok({ version: "26.0.0" }),
  ]);
  route("GET", "/entities", "systemEntitiesGet", USER, async () => [
    200,
    ok([]),
  ]);
  route("GET", "/schemas", "systemSchemasGet", USER, async () => [200, ok([])]);
  route("GET", "/skeletons", "systemSkeletonsGet", BEARER, async () => [
    200,
    await fixture("skeletons.json"),
  ]);
  route("PATCH", "/skeletons", "saveEnabledSkeletonsPatch", USER, async () => [
    200,
    await fixture("saveEnabledSkeletons.json"),
  ]);
  route(
    "GET",
    "/skeletons/{skeletonName}",
    "systemSkeletonDetailGet",
    BEARER,
    async (req) => {
      const name = req.path.skeletonName.replace(/[^a-z0-9-]/gi, "");
      const res = await realFetch(`${DEMO_DIR}skeletons/${name}.json`);
      return res.ok
        ? [200, ok(await res.json())]
        : notFound("Skeleton not found");
    },
  );
  route(
    "PATCH",
    "/skeletons/{skeletonName}",
    "systemSkeletonDetailPatch",
    USER,
    async () => [200, ok({ saved: true, message: "Saved (demo)" })],
  );
  route(
    "DELETE",
    "/skeletons/{skeletonName}",
    "systemSkeletonDetailDelete",
    USER,
    async () => [200, ok({ saved: true, message: "Deleted (demo)" })],
  );
  route("GET", "/themes", "systemThemesGet", USER, async () => [
    200,
    await fixture("themesList.json"),
  ]);
  route("PATCH", "/themes", "saveEnabledThemesPatch", USER, async () => [
    200,
    await fixture("saveEnabledThemes.json"),
  ]);
  route("GET", "/blocks", "systemBlocksGet", USER, async () => [
    200,
    await fixture("systemBlocksList.json"),
  ]);
  route("PATCH", "/blocks", "saveEnabledBlocksPatch", USER, async () => [
    200,
    await fixture("saveEnabledBlocks.json"),
  ]);
  route(
    "POST",
    "/configuration/schema-files/operations",
    "schemaFileOperation",
    USER,
    async () => [200, await fixture("schemaFileOperation.json")],
  );
  [
    ["api-keys", "getApiKeys", "saveApiKeysPatch", "getApiKeys.json"],
    ["media", "getMediaSettings", "saveMediaSettingsPatch", null],
    [
      "localization",
      "getLocalizationSettings",
      "saveLocalizationSettingsPatch",
      null,
    ],
  ].forEach(([path, getId, patchId, fixtureName]) => {
    route("GET", `/configuration/${path}`, getId, USER, async () => [
      200,
      await settings(path, fixtureName),
    ]);
    route("PATCH", `/configuration/${path}`, patchId, USER, async (req) => [
      200,
      patchSettings(await settings(path, fixtureName), req.body),
    ]);
  });
  route(
    "GET",
    "/integrations/app-store",
    "generateAppStore",
    SITE,
    async () => [200, await fixture("appstore.json")],
  );
  route(
    "POST",
    "/haxiamAddUserAccess",
    "haxiamAddUserAccess",
    USER,
    async () => [200, await fixture("haxiamAddUserAccess.json")],
  );

  // ---------------------------------------------------------------------------
  // OpenAPI document generated from the route table, so the client's real
  // bootstrap (configureAppHAXSystemApiRegistry) registers exactly these ops
  // ---------------------------------------------------------------------------
  function openApiSpec() {
    const paths = {};
    routes.forEach((r) => {
      const specPath = `${SPEC_BASE}${r.path}`;
      paths[specPath] = paths[specPath] || {};
      const pathParams = (r.path.match(/\{[^}]+\}/g) || []).map((p) => ({
        name: p.slice(1, -1),
        in: "path",
        required: true,
        schema: { type: "string" },
      }));
      paths[specPath][r.method.toLowerCase()] = {
        operationId: r.operationId,
        summary: `${r.operationId} (demo mock)`,
        security: r.security,
        parameters: pathParams,
      };
    });
    return {
      openapi: "3.0.3",
      info: { title: "HAXcms System API (app-hax demo mock)", version: "demo" },
      servers: [{ url: "/" }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
          userTokenHeader: {
            type: "apiKey",
            in: "header",
            name: "X-HAXCMS-User-Token",
          },
          siteTokenHeader: {
            type: "apiKey",
            in: "header",
            name: "X-HAXCMS-Site-Token",
          },
        },
      },
      paths,
    };
  }

  // ---------------------------------------------------------------------------
  // request handling
  // ---------------------------------------------------------------------------
  function notFound(message) {
    // 404 is reserved by app-hax as "session gone"; a missing record in the
    // demo is reported as 422 so it surfaces as an error without logging out
    return [422, { status: 422, data: { message, code: "NOT_FOUND" } }];
  }
  function matchRoute(method, path) {
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      if (r.method !== method) {
        continue;
      }
      const names = [];
      const pattern = new RegExp(
        "^" +
          r.path.replace(/\{([^}]+)\}/g, (_m, name) => {
            names.push(name);
            return "([^/]+)";
          }) +
          "$",
      );
      const hit = path.match(pattern);
      if (hit) {
        const pathValues = {};
        names.forEach((name, idx) => {
          pathValues[name] = decodeURIComponent(hit[idx + 1]);
        });
        return { route: r, pathValues };
      }
    }
    return null;
  }
  function header(headers, name) {
    return headers.get(name) || "";
  }
  // enforce the spec's security requirement against the live demo session
  function authorize(security, req) {
    if (!security || security.length === 0) {
      return null;
    }
    const session = readSession();
    for (let i = 0; i < security.length; i++) {
      const need = security[i];
      const bearerOk =
        !need.bearerAuth || (session && req.bearer === session.jwt);
      const userOk =
        !need.userTokenHeader ||
        (session &&
          header(req.headers, "X-HAXCMS-User-Token") === session.userToken);
      const siteOk =
        !need.siteTokenHeader ||
        (session &&
          header(req.headers, "X-HAXCMS-Site-Token") === session.siteToken);
      if (bearerOk && userOk && siteOk) {
        req.session = session;
        return null;
      }
    }
    if (!session || !req.bearer || req.bearer !== session.jwt) {
      return [
        401,
        { status: 401, data: { message: "Invalid or expired token" } },
      ];
    }
    return [
      403,
      {
        status: 403,
        data: {
          message: "Invalid X-HAXCMS-User-Token header",
          code: "USER_TOKEN_REQUIRED",
        },
      },
    ];
  }
  function respond(status, body) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  async function handle(url, init) {
    const method = String((init && init.method) || "GET").toUpperCase();
    const path = url.pathname.substring(MOCK_BASE.length) || "/";
    if (path === "/openapi.json" || path === "/openapi") {
      return respond(200, openApiSpec());
    }
    const headers = new Headers((init && init.headers) || {});
    const auth = header(headers, "Authorization");
    let body = null;
    if (init && typeof init.body === "string" && init.body !== "") {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = null;
      }
    }
    const req = {
      method,
      headers,
      body,
      query: Object.fromEntries(url.searchParams.entries()),
      bearer:
        auth.toLowerCase().indexOf("bearer ") === 0
          ? auth.substring(7).trim()
          : "",
      path: {},
      session: null,
    };
    const hit = matchRoute(method, path);
    if (!hit) {
      // 501, not 404: app-hax treats 404 as a lost session
      return respond(501, {
        status: 501,
        data: {
          message: `${method} ${path} is not implemented in the app-hax demo mock`,
        },
      });
    }
    req.path = hit.pathValues;
    const denied = authorize(hit.route.security, req);
    if (denied) {
      return respond(denied[0], denied[1]);
    }
    const [status, payload] = await hit.route.handler(req);
    return respond(status, payload);
  }
  // recent calls, newest last: handy for agents and devtools
  const callLog = [];
  async function handleAndLog(url, init) {
    const response = await handle(url, init);
    callLog.push({
      method: String((init && init.method) || "GET").toUpperCase(),
      path: url.pathname.substring(MOCK_BASE.length),
      status: response.status,
    });
    if (callLog.length > 200) {
      callLog.shift();
    }
    return response;
  }

  globalThis.fetch = function (input, init) {
    let url = null;
    try {
      url = new URL(
        typeof input === "string" || input instanceof URL ? input : input.url,
        globalThis.location.href,
      );
    } catch {
      url = null;
    }
    if (
      url &&
      url.origin === globalThis.location.origin &&
      (url.pathname === MOCK_BASE ||
        url.pathname.indexOf(`${MOCK_BASE}/`) === 0)
    ) {
      const requestInit =
        input instanceof Request && !init
          ? { method: input.method, headers: input.headers }
          : init;
      return handleAndLog(url, requestInit).catch((e) =>
        respond(500, { status: 500, data: { message: String(e) } }),
      );
    }
    return realFetch(input, init);
  };
  globalThis.AppHaxDemoMockApi = {
    basePath: MOCK_BASE,
    session: readSession,
    signOut: () => writeSession(null),
    calls: callLog,
  };
  console.info(
    `%capp-hax demo%c system API is mocked at ${MOCK_BASE} — sign in with any username/password (password "wrong" fails). ?demo-login=auto skips the login.`,
    "background:#1e407c;color:#fff;padding:2px 6px;border-radius:3px",
    "",
  );
})();
