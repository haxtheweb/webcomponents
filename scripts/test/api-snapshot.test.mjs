// The HAX element API gate: once an authorable tag's attributes, slots and
// HAX settings are in the snapshot, removing or renaming one fails the check
// unless allowed-removals.json lists it; additions only warn; elements that
// are not authorable (no HAXSchema) are never snapshotted.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  loadAnalyzer,
  buildSnapshot,
  evaluate,
  loadAllowed,
} from "../api-snapshot.mjs";

const PLAYER = ({
  attr = "source-type",
  slot = "caption",
  withTitle = true,
} = {}) => `
import { LitElement, html } from "lit";
export class ProbePlayer extends LitElement {
  static get tag() {
    return "probe-player";
  }
  static get properties() {
    return {
      ...super.properties,
      source: { type: String },
      sourceType: { type: String, attribute: "${attr}" },
      ${withTitle ? 'mediaTitle: { type: String, attribute: "media-title" },' : ""}
      _internal: { type: String },
      quiet: { type: Boolean, state: true },
    };
  }
  render() {
    return html\`<div part="frame"><slot name="${slot}"></slot><slot></slot></div>\`;
  }
  _go() {
    this.dispatchEvent(new CustomEvent("probe-play", { bubbles: true }));
  }
  static get haxProperties() {
    return new URL(\`./lib/\${this.tag}.haxProperties.json\`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(ProbePlayer.tag, ProbePlayer);
`;

const HAX = {
  gizmo: {
    title: "Probe player",
    handles: [{ type: "video", source: "source" }],
  },
  settings: {
    configure: [
      { property: "source", title: "Source", inputMethod: "haxupload" },
      { property: "mediaTitle", title: "Title", inputMethod: "textfield" },
      { slot: "caption", title: "Caption", inputMethod: "textfield" },
    ],
    advanced: [],
  },
  demoSchema: [{ tag: "probe-player", properties: { source: "a.mp4" } }],
};

// listed in the registry (it mentions haxProperties in a comment) but has no
// HAXSchema: an app shell, not something an author can place in content
const SHELL = (attr = "menu-open") => `
import { LitElement, html } from "lit";
export class ShellApp extends LitElement {
  static get tag() {
    return "shell-app";
  }
  static get properties() {
    return { menuOpen: { type: Boolean, attribute: "${attr}" } };
  }
  render() {
    return html\`<slot name="toolbar"></slot>\`;
  }
  // haxProperties integration via file reference
}
globalThis.customElements.define(ShellApp.tag, ShellApp);
`;

let cem = null;
before(async () => {
  cem = await loadAnalyzer();
});

function fixture({ player = PLAYER(), shell = SHELL(), hax = HAX } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "api-snapshot-"));
  const write = (rel, text) => {
    const f = path.join(root, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, text);
  };
  write(
    "hax-elements-registry.json",
    JSON.stringify({
      p: "Paragraph",
      "probe-player": "Probe",
      "shell-app": "Shell",
    }),
  );
  write(
    "elements/probe-player/package.json",
    JSON.stringify({
      name: "@haxtheweb/probe-player",
      main: "probe-player.js",
    }),
  );
  write("elements/probe-player/probe-player.js", player);
  write(
    "elements/probe-player/lib/probe-player.haxProperties.json",
    JSON.stringify(hax),
  );
  write(
    "elements/shell-app/package.json",
    JSON.stringify({ name: "@haxtheweb/shell-app", main: "shell-app.js" }),
  );
  write("elements/shell-app/shell-app.js", shell);
  return root;
}

function snap(opts) {
  const root = fixture(opts);
  try {
    return buildSnapshot(root, cem).records;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

const gate = (committed, current, allowed = [], base = null) =>
  evaluate({
    current,
    committed,
    baselines: [
      { label: "committed", snapshot: committed },
      ...(base ? [{ label: "base", snapshot: base }] : []),
    ],
    allowed,
    allowedErrors: [],
  });

test("snapshots authorable tags only, with the authored-content contract", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const records = snap();
  assert.deepEqual(Object.keys(records), ["probe-player"]);
  const r = records["probe-player"];
  assert.deepEqual(r.attributes, {
    "media-title": "mediaTitle",
    source: "source",
    "source-type": "sourceType",
  });
  assert.deepEqual(r.slots, ["(default)", "caption"]);
  assert.deepEqual(r.events, ["probe-play"]);
  assert.deepEqual(r.cssParts, ["frame"]);
  assert.equal(r.hax.gizmo, true);
  assert.deepEqual(r.hax.properties, ["mediaTitle", "source"]);
  assert.deepEqual(r.hax.slots, ["caption"]);
  assert.deepEqual(r.hax.demoTags, ["probe-player"]);
  assert.equal(
    r.hax.schema,
    "elements/probe-player/lib/probe-player.haxProperties.json",
  );
});

test("a removed attribute fails and names the element, item and way forward", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const committed = snap();
  const res = gate(committed, snap({ player: PLAYER({ withTitle: false }) }));
  assert.equal(res.ok, false);
  assert.equal(res.errors.length, 1);
  assert.match(
    res.errors[0],
    /<probe-player> attribute "media-title" \(property mediaTitle\) was removed/,
  );
  assert.match(res.errors[0], /allowed-removals\.json/);
  assert.match(res.errors[0], /"kind": "attributes", "item": "media-title"/);
});

test("a renamed attribute fails and is reported as a rename", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const res = gate(
    snap(),
    snap({ player: PLAYER({ attr: "media-source-type" }) }),
  );
  assert.equal(res.ok, false);
  assert.match(
    res.errors[0],
    /attribute "source-type" was renamed to "media-source-type" \(property sourceType\)/,
  );
});

test("a removed slot fails", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const res = gate(snap(), snap({ player: PLAYER({ slot: "figcaption" }) }));
  assert.equal(res.ok, false);
  assert.ok(
    res.errors.some((e) =>
      /<probe-player> slot "caption" was removed \(renamed to "figcaption"\?\)/.test(
        e,
      ),
    ),
  );
});

test("additions pass with a warning to refresh the snapshot", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const res = gate(snap({ player: PLAYER({ withTitle: false }) }), snap());
  assert.equal(res.ok, true);
  assert.equal(res.errors.length, 0);
  assert.match(
    res.warnings[0],
    /<probe-player> gained attribute "media-title".*yarn api:snapshot/,
  );
});

test("non-HAX elements are excluded: their API can change freely", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const committed = snap();
  const current = snap({ shell: SHELL("drawer-open") });
  assert.equal(current["shell-app"], undefined);
  const res = gate(committed, current);
  assert.equal(res.ok, true);
  assert.deepEqual(res.warnings, []);
});

test("an allowed removal passes, but only once the snapshot is regenerated", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const before = snap();
  const after = snap({ player: PLAYER({ withTitle: false }) });
  const allowed = [
    {
      tag: "probe-player",
      kind: "attributes",
      item: "media-title",
      reason: "replaced by the caption slot",
    },
  ];
  // allowed, but the committed snapshot still lists it
  const stale = gate(before, after, allowed);
  assert.equal(stale.ok, false);
  assert.match(
    stale.errors.join("\n"),
    /still lists it: run yarn api:snapshot/,
  );
  // regenerated in the same PR; the base branch still has it
  const done = gate(after, after, allowed, before);
  assert.equal(done.ok, true, done.errors.join("\n"));
  assert.match(done.notes.join("\n"), /allowed by/);
});

test("regenerating the snapshot does not hide a removal from the base branch", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  const base = snap();
  const after = snap({ player: PLAYER({ withTitle: false }) });
  const res = gate(after, after, [], base);
  assert.equal(res.ok, false);
  assert.match(res.errors[0], /"media-title".*was removed \(in base\)/);
});

test("allowed-removals entries need a kind, item and reason", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "api-allowed-"));
  const f = path.join(dir, "allowed.json");
  fs.writeFileSync(
    f,
    JSON.stringify({
      removals: [
        { tag: "probe-player", kind: "attributes", item: "media-title" },
        {
          tag: "probe-player",
          kind: "colors",
          item: "x",
          reason: "a long enough reason",
        },
        {
          tag: "probe-player",
          kind: "slots",
          item: "caption",
          reason: "moved into the default slot",
        },
      ],
    }),
  );
  const { allowed, errors } = loadAllowed(f);
  fs.rmSync(dir, { recursive: true, force: true });
  assert.equal(allowed.length, 1);
  assert.equal(errors.length, 2);
  assert.match(errors[0], /reason/);
  assert.match(errors[1], /unknown kind "colors"/);
});

function built(opts) {
  const root = fixture(opts);
  try {
    return buildSnapshot(root, cem);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("every HAX setting and gizmo handle must name something the element has", (t) => {
  if (!cem) return t.skip("@custom-elements-manifest/analyzer not installed");
  // the fixture's own settings and handles all resolve
  const ok = built();
  assert.deepEqual(ok.broken, []);
  // handles may map to a property, a slot or a DOM property like innerHTML
  const fine = built({
    hax: {
      ...HAX,
      gizmo: {
        ...HAX.gizmo,
        handles: [
          {
            type: "video",
            type_exclusive: true,
            source: "source",
            title: "caption",
            text: "innerHTML",
            blank: "",
          },
        ],
      },
    },
  });
  assert.deepEqual(fine.broken, []);
  const bad = built({
    hax: {
      ...HAX,
      gizmo: {
        ...HAX.gizmo,
        handles: [{ type: "video", source: "source", color: "primaryColor" }],
      },
      settings: {
        ...HAX.settings,
        configure: [
          ...HAX.settings.configure,
          { property: "animated", title: "Animated", inputMethod: "boolean" },
        ],
      },
    },
  });
  assert.equal(bad.broken.length, 2);
  assert.match(
    bad.broken.join("\n"),
    /probe-player: HAX setting property "animated" is not a property/,
  );
  assert.match(
    bad.broken.join("\n"),
    /probe-player: gizmo handle video:color=primaryColor names a property/,
  );
  // the gate fails on them even when the API snapshot itself is unchanged
  const res = evaluate({
    current: bad.records,
    committed: bad.records,
    baselines: [{ label: "committed", snapshot: bad.records }],
    allowed: [],
    allowedErrors: [],
    broken: bad.broken,
  });
  assert.equal(res.ok, false);
  assert.equal(res.errors.length, 2);
  assert.match(res.errors.join("\n"), /does nothing/);
});
