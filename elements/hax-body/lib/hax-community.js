/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Merlin's Community group, defined in one place for the editor (hax-store)
 * and the sites dashboard (app-hax). It sits at the very end of Merlin's
 * list (a high priority sinks it), so what can be done right now comes
 * first. Contributing leads the group: the goggles, defined by the HAXcms
 * editor and the dashboard at HAX_COMMUNITY_PRIORITY - 1.
 */
export const HAX_COMMUNITY_PRIORITY = 100000;

/**
 * Where the group shows: the editor's "community" context and anywhere
 * global ("*", the dashboard), whichever defines it first on a page.
 */
export const HAX_COMMUNITY_CONTEXT = ["community", "*"];

/**
 * Tutorials and the Discord, once per Merlin.
 * @param {object} merlin the SuperDaemon instance
 * @param {object} host the element defining them; its `t` holds
 *   `userTutorials` and `joinHaxCommunity`, and it has `_openExternalLink`
 */
export function defineCommunityOptions(merlin, host) {
  if (!merlin || merlin.__haxCommunity) {
    return;
  }
  merlin.__haxCommunity = true;
  merlin.defineOption({
    i18n: { context: host, title: "userTutorials" },
    title: host.t.userTutorials,
    icon: "hax:hax2022",
    priority: HAX_COMMUNITY_PRIORITY,
    tags: ["Documentation", "tutorials", "learn", "community", "help"],
    externalLink: true,
    value: {
      target: host,
      method: "_openExternalLink",
      args: ["https://learn.hax.cloud/"],
    },
    eventName: "super-daemon-element-method",
    path: "Community/Tutorials",
    context: HAX_COMMUNITY_CONTEXT.slice(),
  });
  merlin.defineOption({
    i18n: { context: host, title: "joinHaxCommunity" },
    title: host.t.joinHaxCommunity,
    icon: "hax:discord",
    priority: HAX_COMMUNITY_PRIORITY + 1,
    tags: ["community", "discord", "chat", "help"],
    externalLink: true,
    value: {
      target: host,
      method: "_openExternalLink",
      args: ["https://discord.gg/aCGxmRHEJP"],
    },
    eventName: "super-daemon-element-method",
    path: "Community/Join",
    context: HAX_COMMUNITY_CONTEXT.slice(),
  });
}
