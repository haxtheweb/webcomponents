/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * A person's saved avatar, as a character code. A backend that stores it
 * supplies it as userData.avatarCode; until then it is kept per user in this
 * browser. Saving fires `rpg-character-avatar-changed` on globalThis
 * (detail: { userName, code }) so every avatar on the page updates and a
 * backend integration can persist it.
 */
import { decodeCharacter } from "./rpg-character-code.js";

export const AVATAR_EVENT = "rpg-character-avatar-changed";

const storageKey = (userName) => `rpg-character-avatar:${userName}`;

export function loadAvatarCode(userName, userData) {
  const fromServer = userData && userData.avatarCode;
  if (fromServer && decodeCharacter(fromServer)) {
    return fromServer;
  }
  if (!userName) {
    return "";
  }
  try {
    const local = globalThis.localStorage.getItem(storageKey(userName));
    if (local && decodeCharacter(local)) {
      return local;
    }
  } catch {
    // storage blocked: the seed look is used
  }
  return "";
}

export function saveAvatarCode(userName, code) {
  if (!userName) {
    return;
  }
  try {
    if (code) {
      globalThis.localStorage.setItem(storageKey(userName), code);
    } else {
      globalThis.localStorage.removeItem(storageKey(userName));
    }
  } catch {
    // storage blocked: the change still applies for this page view
  }
  globalThis.dispatchEvent(
    new CustomEvent(AVATAR_EVENT, { detail: { userName, code } }),
  );
}
