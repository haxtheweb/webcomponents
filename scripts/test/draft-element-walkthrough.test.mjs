// Generated walkthrough drafts teach what an author sets, in sentences that
// say something the settings panel does not already show.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  attributesOf,
  settingsOf,
  goodDesc,
  draftWalkthrough,
} from "../draft-element-walkthrough.mjs";

const attr = (name, description = "", type = "string", def = "") => ({
  name,
  property: name,
  type,
  default: def,
  description,
  hax: null,
});

// a plain (not HAX-capable) element: the demo sets label and size
const plain = {
  tag: "docs-probe",
  folder: "docs-probe-not-on-disk",
  title: "Docs probe",
  description: "A probe for the walkthrough generator.",
  import: "@haxtheweb/docs-probe/docs-probe.js",
  haxCapable: false,
  hax: {},
  demoHtml: '<docs-probe label="Hello" size="large"></docs-probe>',
  attributes: [
    attr("opened", "Whether the probe is open", "boolean"),
    attr("focused", "Whether toggle is disabled", "boolean"),
    attr("disabled", "Whether toggle is disabled", "boolean"),
    attr("expanded", "Whether toggle is disabled", "boolean"),
    attr("items", "Items to list", "Array"),
    attr("old-title", "DEPRECATED: use the heading slot"),
    attr("label", "Text the probe shows"),
    attr("size", ""),
    attr("color", "Accent color for the probe"),
  ],
  slots: [],
  events: [],
  surfaceHash: "000000000000",
};

test("attributes the demo sets come first, live state and lists are left out", () => {
  const names = attributesOf(plain).map((r) => r.name);
  assert.deepEqual(names.slice(0, 2), ["label", "size"]);
  assert.ok(names.includes("color"));
  for (const left of ["opened", "focused", "items", "old-title"]) {
    assert.ok(!names.includes(left), `${left} should not be taught`);
  }
});

test("two fields may share a description; three sharing one is copy-paste", () => {
  const withDemo = {
    ...plain,
    demoHtml: '<docs-probe top-alt="A" bottom-alt="B"></docs-probe>',
    attributes: [
      attr("top-alt", "Required alt text for accessibility."),
      attr("bottom-alt", "Required alt text for accessibility."),
    ],
  };
  const rows = attributesOf(withDemo);
  assert.equal(
    rows.find((r) => r.name === "top-alt").desc,
    "Required alt text for accessibility.",
  );
});

test("a description copied onto several attributes is not used for any of them", () => {
  const withDemo = {
    ...plain,
    demoHtml: '<docs-probe disabled label="Hello"></docs-probe>',
  };
  const disabled = attributesOf(withDemo).find((r) => r.name === "disabled");
  assert.equal(disabled.desc, "");
  assert.equal(disabled.value, true);
});

test("a description only repeats the name, or is a question, is not a caption", () => {
  assert.equal(
    goodDesc({ desc: "Title", title: "Title", name: "title" }),
    false,
  );
  assert.equal(
    goodDesc({
      desc: "Is this an audio file?",
      title: "Audio only",
      name: "audio-only",
    }),
    false,
  );
  assert.equal(
    goodDesc({
      desc: "Optional. Label shown above the field.",
      title: "Label",
      name: "label",
    }),
    true,
  );
});

test("captions say what a setting does or fall back to one short line", () => {
  const scene = draftWalkthrough(plain);
  const texts = scene.beats.map((b) => b.text);
  assert.ok(texts.some((t) => t.startsWith("Text the probe shows.")));
  for (const t of texts) {
    assert.ok(!/^Fill in the|^Add (a|an|the) [\w-]+ attribute/.test(t), t);
    assert.ok(t.length <= 80, t);
    assert.ok(!t.endsWith("…"), `cut mid-sentence: ${t}`);
  }
});

test("select settings list their choices by label, without the empty one", () => {
  const hax = {
    ...plain,
    haxCapable: true,
    hax: {
      settings: {
        configure: [
          {
            property: "kind",
            title: "Kind",
            inputMethod: "select",
            options: { "": "None", a: "Alpha", b: "Beta" },
          },
        ],
      },
      demoSchema: [{ tag: "docs-probe", properties: {}, content: "" }],
    },
    attributes: [attr("kind")],
  };
  const [kind] = settingsOf(hax);
  assert.deepEqual(kind.options, ["Alpha", "Beta"]);
  assert.deepEqual(kind.optionValues, ["a", "b"]);
});
