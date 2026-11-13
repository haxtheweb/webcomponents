/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Web Awesome as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Web Awesome tokens plus the DDD → Web Awesome map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  WebawesomeTokens,
  WebawesomeFonts,
} from "@haxtheweb/webawesome-theme/lib/WebawesomeTokens.js";
import { WebawesomeDDDMap } from "@haxtheweb/webawesome-theme/lib/WebawesomeDDDMap.js";

export const WEBAWESOME_SYSTEM = "webawesome";

/** register Web Awesome with the design system manager (once) */
export function registerWebawesomeDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[WEBAWESOME_SYSTEM]) {
    manager.addDesignSystem({
      name: WEBAWESOME_SYSTEM,
      extends: "ddd",
      styles: [WebawesomeTokens, WebawesomeDDDMap],
      fonts: WebawesomeFonts,
    });
  }
  return manager;
}

/** make Web Awesome the active design system */
export function activateWebawesomeDesignSystem(manager = DesignSystemManager) {
  registerWebawesomeDesignSystem(manager);
  if (manager && manager.active !== WEBAWESOME_SYSTEM) {
    manager.active = WEBAWESOME_SYSTEM;
  }
  return manager;
}
