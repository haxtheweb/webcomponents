/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html } from "lit";

/**
 * Contributing to HAX happens through the goggles: one Merlin option, the
 * same everywhere it shows (the HAXcms editor, the sites dashboard and the
 * network bar on every public HAX site), so the goggles are the one way in.
 *
 * Each place that defines the option keeps these strings in its own `this.t`
 * (so they are translated with the rest of that element) and passes itself
 * as `host`. GOGGLES_CONTRIBUTE_T is the English those keys hold.
 */
export const GOGGLES_CONTRIBUTE_T = {
  gogglesContribute: "Contribute with the goggles",
  gogglesContributeAbout:
    "Put on the goggles to learn how HAX is made and help make it better: X-ray any piece to see the code behind it, see who built it, report a bug or an idea with a screenshot pointed right at it, fix a translation in your language, and find the open issues for what is in front of you.",
  gogglesProjectLinks: "More about the project",
  gogglesLinkLab: "HAX Lab: how to get involved",
  gogglesLinkPraw: "PRAW: the people, ideas and stories behind HAX",
  gogglesLinkLearn: "Learn HAX: tutorials",
  gogglesLinkCode: "HAX on GitHub: the code",
};

/** Where the details send people to learn more about the project (keys into `host.t`) */
export const GOGGLES_PROJECT_LINKS = [
  { label: "gogglesLinkLab", href: "https://lab.hax.cloud" },
  { label: "gogglesLinkPraw", href: "https://hax.cloud" },
  { label: "gogglesLinkLearn", href: "https://learn.hax.cloud" },
  { label: "gogglesLinkCode", href: "https://github.com/haxtheweb" },
];

/** Searches that find the option */
export const GOGGLES_CONTRIBUTE_TAGS = [
  "community",
  "contribute",
  "goggles",
  "bug",
  "Bug report",
  "Feature request",
  "idea",
  "issue",
  "report",
  "translate",
  "translation",
  "x-ray",
  "makers",
  "learn",
  "help",
];

/**
 * The goggles option for Merlin.
 * @param {object} host the element defining it; its `t` holds GOGGLES_CONTRIBUTE_T's keys
 * @param {object} opts `method` (on host) that puts the goggles on, and the
 *   `priority`, `context` and `path` for where it sits in that Merlin
 * @returns {object} an option for SuperDaemon's defineOption
 */
export function gogglesContributeOption(host, opts) {
  const o = opts || {};
  const t = (host && host.t) || GOGGLES_CONTRIBUTE_T;
  const say = (key) => t[key] || GOGGLES_CONTRIBUTE_T[key];
  return {
    i18n: {
      context: host,
      title: "gogglesContribute",
      description: "gogglesContributeAbout",
    },
    title: say("gogglesContribute"),
    description: say("gogglesContributeAbout"),
    icon: "hax:goggles",
    priority: o.priority || 0,
    tags: GOGGLES_CONTRIBUTE_TAGS.slice(),
    path: o.path || "Community/Contribute",
    context: o.context || "*",
    more: html`<span>${say("gogglesProjectLinks")}</span>
      <ul>
        ${GOGGLES_PROJECT_LINKS.map(
          (l) =>
            html`<li>
              <a href="${l.href}" target="_blank" rel="noopener noreferrer"
                >${say(l.label)}</a
              >
            </li>`,
        )}
      </ul>`,
    value: { target: host, method: o.method, args: o.args || [] },
    eventName: "super-daemon-element-method",
  };
}
