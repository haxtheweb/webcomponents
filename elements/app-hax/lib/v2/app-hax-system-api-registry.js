import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'

const SYSTEM_STATE_KEY = '__AppHaxSystemApiRegistryState'
const SYSTEM_OPERATION_PREFIX = '@system/'
const SYSTEM_SPEC_BASE_PATH = '/system/api/v1'
const SYSTEM_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']

function cleanString(value) {
  if (typeof value === 'string') {
    return value.trim()
  }
  return ''
}

function normalizePath(value = '') {
  let normalized = cleanString(value)
  if (normalized === '') {
    return ''
  }
  if (normalized.charAt(0) !== '/') {
    normalized = '/' + normalized
  }
  while (
    normalized.length > 1 &&
    normalized.charAt(normalized.length - 1) === '/'
  ) {
    normalized = normalized.substring(0, normalized.length - 1)
  }
  return normalized
}

function deriveSystemApiBasePath(appSettings = {}) {
  const fromSettings = normalizePath(appSettings.systemApiBasePath || '')
  if (fromSettings !== '') {
    return fromSettings
  }
  const explicitOpenApiPath = cleanString(appSettings.systemOpenApiPath || '')
  if (explicitOpenApiPath !== '') {
    return normalizePath(
      explicitOpenApiPath.replace(/\/openapi(?:\.json|\.yaml)?$/, ''),
    )
  }
  const fromConnectionSettings = cleanString(appSettings.connectionSettings || '')
  if (fromConnectionSettings !== '') {
    return normalizePath(
      fromConnectionSettings.replace(/\/session\/connection-settings$/, ''),
    )
  }
  const fromLoginPath = cleanString(appSettings.login || '')
  if (fromLoginPath !== '') {
    return normalizePath(fromLoginPath.replace(/\/session\/login$/, ''))
  }
  return ''
}

function getSystemOpenApiPath(appSettings = {}, systemApiBasePath = '') {
  const explicitPath = cleanString(appSettings.systemOpenApiPath || '')
  if (explicitPath !== '') {
    return explicitPath
  }
  if (systemApiBasePath === '') {
    return ''
  }
  return `${systemApiBasePath}/openapi.json`
}

function buildEndpoint(systemApiBasePath = '', openApiPath = '') {
  const normalizedBasePath = normalizePath(systemApiBasePath)
  if (normalizedBasePath === '') {
    return ''
  }
  let endpointPath = cleanString(openApiPath)
  if (endpointPath === '') {
    return ''
  }
  if (endpointPath.charAt(0) !== '/') {
    endpointPath = '/' + endpointPath
  }
  if (endpointPath === SYSTEM_SPEC_BASE_PATH) {
    return normalizedBasePath
  }
  if (endpointPath.indexOf(`${SYSTEM_SPEC_BASE_PATH}/`) === 0) {
    return `${normalizedBasePath}${endpointPath.substring(SYSTEM_SPEC_BASE_PATH.length)}`
  }
  return `${normalizedBasePath}${endpointPath}`
}

function buildOperationName(operationId = '') {
  const normalizedOperationId = cleanString(operationId)
  if (normalizedOperationId === '') {
    return ''
  }
  return `${SYSTEM_OPERATION_PREFIX}${normalizedOperationId}`
}

function getState() {
  if (!globalThis[SYSTEM_STATE_KEY]) {
    globalThis[SYSTEM_STATE_KEY] = {
      appSettings: {},
      auth: {
        jwt: '',
        siteToken: '',
        userToken: '',
      },
      securitySchemes: {},
      systemApiBasePath: '',
      systemOpenApiPath: '',
      readyPromise: null,
      bootstrapping: false,
      bootstrapped: false,
      previousAuthProvider: null,
      providerApplied: false,
    }
  }
  return globalThis[SYSTEM_STATE_KEY]
}

function readSecuritySchemes(openApiSpec = {}) {
  if (
    !openApiSpec ||
    typeof openApiSpec !== 'object' ||
    !openApiSpec.components ||
    typeof openApiSpec.components !== 'object' ||
    !openApiSpec.components.securitySchemes ||
    typeof openApiSpec.components.securitySchemes !== 'object'
  ) {
    return {}
  }
  return openApiSpec.components.securitySchemes
}

function normalizeOperationSecurity(pathConfig = {}, operation = {}) {
  if (
    operation &&
    Object.prototype.hasOwnProperty.call(operation, 'security')
  ) {
    if (Array.isArray(operation.security)) {
      return operation.security
    }
    return []
  }
  if (Array.isArray(pathConfig.security)) {
    return pathConfig.security
  }
  return []
}

function mapParams(pathConfig = {}, operation = {}) {
  const mapped = {}
  const params = []
  if (Array.isArray(pathConfig.parameters)) {
    pathConfig.parameters.forEach((parameter) => params.push(parameter))
  }
  if (Array.isArray(operation.parameters)) {
    operation.parameters.forEach((parameter) => params.push(parameter))
  }
  params.forEach((parameter) => {
    if (!parameter || typeof parameter !== 'object') {
      return
    }
    const name = cleanString(parameter.name || '')
    if (name === '') {
      return
    }
    const description =
      cleanString(parameter.description || '') ||
      `${cleanString(parameter.in || 'query')} parameter`
    mapped[name] = description
  })
  return mapped
}

function registerOrUpdate(definition = {}) {
  const name = cleanString(definition.name || '')
  if (name === '') {
    return
  }
  if (MicroFrontendRegistry.has(name)) {
    if (MicroFrontendRegistry.MicroFrontend) {
      MicroFrontendRegistry.set(
        name,
        new MicroFrontendRegistry.MicroFrontend(definition),
      )
    } else {
      MicroFrontendRegistry.set(name, definition)
    }
  } else {
    MicroFrontendRegistry.add(definition)
  }
}

function registerFromOpenApi(openApiSpec = {}, systemApiBasePath = '') {
  let count = 0
  if (
    !openApiSpec ||
    typeof openApiSpec !== 'object' ||
    !openApiSpec.paths ||
    typeof openApiSpec.paths !== 'object'
  ) {
    return count
  }
  const normalizedSystemBasePath = normalizePath(systemApiBasePath)
  if (normalizedSystemBasePath === '') {
    return count
  }
  const pathKeys = Object.keys(openApiSpec.paths)
  for (let i = 0; i < pathKeys.length; i++) {
    const openApiPath = pathKeys[i]
    if (String(openApiPath).indexOf(SYSTEM_SPEC_BASE_PATH) !== 0) {
      continue
    }
    const pathConfig = openApiSpec.paths[openApiPath]
    if (!pathConfig || typeof pathConfig !== 'object') {
      continue
    }
    for (let methodIndex = 0; methodIndex < SYSTEM_METHODS.length; methodIndex++) {
      const method = SYSTEM_METHODS[methodIndex]
      if (!Object.prototype.hasOwnProperty.call(pathConfig, method)) {
        continue
      }
      const operation = pathConfig[method]
      if (!operation || typeof operation !== 'object') {
        continue
      }
      const name = buildOperationName(operation.operationId || '')
      if (name === '') {
        continue
      }
      const summary = cleanString(operation.summary || '')
      const description = cleanString(operation.description || '')
      registerOrUpdate({
        endpoint: buildEndpoint(normalizedSystemBasePath, openApiPath),
        name,
        title: summary || name,
        description: description || summary,
        params: mapParams(pathConfig, operation),
        headers: {},
        security: normalizeOperationSecurity(pathConfig, operation),
        method: method.toUpperCase(),
      })
      count += 1
    }
  }
  return count
}

function resolveToken(schemeName = '', scheme = {}, auth = {}) {
  const normalizedSchemeName = cleanString(schemeName).toLowerCase()
  const normalizedSchemeHeader = cleanString(scheme.name || '').toLowerCase()
  if (
    normalizedSchemeName.indexOf('bearer') !== -1 ||
    normalizedSchemeName.indexOf('jwt') !== -1
  ) {
    return cleanString(auth.jwt || '')
  }
  if (
    normalizedSchemeName.indexOf('site') !== -1 ||
    normalizedSchemeHeader === 'site_token'
  ) {
    return cleanString(auth.siteToken || '')
  }
  if (
    normalizedSchemeName.indexOf('user') !== -1 ||
    normalizedSchemeHeader === 'user_token'
  ) {
    return cleanString(auth.userToken || '')
  }
  return ''
}

function resolveQueryTokenHeaderName(schemeName = '', scheme = {}) {
  const tokenKey = cleanString(scheme.name || '').toLowerCase()
  const normalizedSchemeName = cleanString(schemeName).toLowerCase()
  if (tokenKey === 'user_token' || normalizedSchemeName.indexOf('user') !== -1) {
    return 'X-HAXCMS-User-Token'
  }
  if (tokenKey === 'site_token' || normalizedSchemeName.indexOf('site') !== -1) {
    return 'X-HAXCMS-Site-Token'
  }
  return ''
}

function headersForRequirement(requirement = {}, schemes = {}, auth = {}) {
  if (!requirement || typeof requirement !== 'object') {
    return null
  }
  const keys = Object.keys(requirement)
  if (keys.length === 0) {
    return {}
  }
  const headers = {}
  for (let i = 0; i < keys.length; i++) {
    const schemeName = keys[i]
    const scheme = schemes[schemeName] || {}
    const schemeType = cleanString(scheme.type || '').toLowerCase()
    const schemeIn = cleanString(scheme.in || '').toLowerCase()
    const schemeValue = cleanString(scheme.scheme || '').toLowerCase()
    if (schemeType === 'http' && schemeValue === 'bearer') {
      const token = resolveToken(schemeName, scheme, auth)
      if (token === '') {
        return null
      }
      headers.Authorization = `Bearer ${token}`
      continue
    }
    if (schemeType === 'apikey' && schemeIn === 'header') {
      const token = resolveToken(schemeName, scheme, auth)
      const headerName = cleanString(scheme.name || schemeName)
      if (token === '' || headerName === '') {
        return null
      }
      headers[headerName] = token
      continue
    }
    if (schemeType === 'apikey' && schemeIn === 'query') {
      const token = resolveToken(schemeName, scheme, auth)
      const headerName = resolveQueryTokenHeaderName(schemeName, scheme)
      if (token === '' || headerName === '') {
        return null
      }
      headers[headerName] = token
      continue
    }
    if (schemeName === 'bearerAuth') {
      const token = resolveToken(schemeName, scheme, auth)
      if (token === '') {
        return null
      }
      headers.Authorization = `Bearer ${token}`
      continue
    }
    const fallbackToken = resolveToken(schemeName, scheme, auth)
    if (fallbackToken === '') {
      return null
    }
    headers[schemeName] = fallbackToken
  }
  return headers
}

function resolveHeaders(requirements = [], schemes = {}, auth = {}) {
  if (!Array.isArray(requirements) || requirements.length === 0) {
    return {}
  }
  for (let i = 0; i < requirements.length; i++) {
    const headers = headersForRequirement(requirements[i], schemes, auth)
    if (headers !== null) {
      return headers
    }
  }
  return {}
}

function ensureAuthProvider(state) {
  if (state.providerApplied) {
    return
  }
  if (
    !state.previousAuthProvider &&
    typeof MicroFrontendRegistry.authProvider === 'function'
  ) {
    state.previousAuthProvider = MicroFrontendRegistry.authProvider
  }
  const provider = async (security = [], context = {}) => {
    let headers = {}
    if (typeof state.previousAuthProvider === 'function') {
      const previousHeaders = await state.previousAuthProvider(security, context)
      if (previousHeaders && typeof previousHeaders === 'object') {
        headers = Object.assign(headers, previousHeaders)
      }
    }
    const name = context && typeof context.name === 'string' ? context.name : ''
    if (name.indexOf(SYSTEM_OPERATION_PREFIX) !== 0) {
      return headers
    }
    return Object.assign(
      headers,
      resolveHeaders(security, state.securitySchemes, state.auth),
    )
  }
  if (typeof MicroFrontendRegistry.setAuthProvider === 'function') {
    MicroFrontendRegistry.setAuthProvider(provider)
    state.providerApplied = true
  }
}

function updateAuth(state, appSettings = {}, jwtValue, hasJwtOverride) {
  if (hasJwtOverride) {
    state.auth.jwt = cleanString(jwtValue || '')
  } else {
    const appJwt = cleanString(appSettings.jwt || '')
    if (appJwt !== '') {
      state.auth.jwt = appJwt
    }
  }
  if (Object.prototype.hasOwnProperty.call(appSettings, 'siteToken')) {
    state.auth.siteToken = cleanString(appSettings.siteToken || '')
  }
  if (Object.prototype.hasOwnProperty.call(appSettings, 'userToken')) {
    state.auth.userToken = cleanString(appSettings.userToken || '')
  }
}

async function bootstrapFromOpenApi(state, systemApiBasePath, systemOpenApiPath) {
  const response = await fetch(systemOpenApiPath, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`Unable to load system OpenAPI (${response.status})`)
  }
  const openApiSpec = await response.json()
  state.securitySchemes = readSecuritySchemes(openApiSpec)
  const count = registerFromOpenApi(openApiSpec, systemApiBasePath)
  if (count === 0) {
    throw new Error('No @system operations registered from OpenAPI')
  }
}

export function configureAppHAXSystemApiRegistry(appSettings = {}, jwtValue) {
  const state = getState()
  if (appSettings && typeof appSettings === 'object') {
    state.appSettings = appSettings
  } else if (!state.appSettings || typeof state.appSettings !== 'object') {
    state.appSettings = {}
  }
  const hasJwtOverride = arguments.length > 1
  updateAuth(state, state.appSettings, jwtValue, hasJwtOverride)
  ensureAuthProvider(state)
  const systemApiBasePath = deriveSystemApiBasePath(state.appSettings)
  const systemOpenApiPath = getSystemOpenApiPath(
    state.appSettings,
    systemApiBasePath,
  )
  if (systemApiBasePath === '' || systemOpenApiPath === '') {
    state.bootstrapping = false
    state.bootstrapped = false
    state.readyPromise = Promise.resolve(false)
    return state.readyPromise
  }
  const sameBootstrapTarget =
    state.systemApiBasePath === systemApiBasePath &&
    state.systemOpenApiPath === systemOpenApiPath
  if (
    sameBootstrapTarget &&
    state.bootstrapping === true &&
    state.readyPromise &&
    typeof state.readyPromise.then === 'function'
  ) {
    return state.readyPromise
  }
  const shouldReload = !sameBootstrapTarget || state.bootstrapped !== true
  if (!shouldReload && state.readyPromise) {
    return state.readyPromise
  }
  state.systemApiBasePath = systemApiBasePath
  state.systemOpenApiPath = systemOpenApiPath
  state.bootstrapping = true
  state.readyPromise = (async () => {
    try {
      await bootstrapFromOpenApi(state, systemApiBasePath, systemOpenApiPath)
      state.bootstrapped = true
      state.bootstrapping = false
      return true
    } catch (e) {
      state.bootstrapped = false
      state.bootstrapping = false
      return false
    }
  })()
  return state.readyPromise
}

export function waitForAppHAXSystemApiRegistryReady() {
  const state = getState()
  if (state.readyPromise && typeof state.readyPromise.then === 'function') {
    return state.readyPromise
  }
  return configureAppHAXSystemApiRegistry(state.appSettings || {}, state.auth.jwt)
}
