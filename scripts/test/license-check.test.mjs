// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, purlKey, reviewPr, sweep } from "../license-check.mjs";

const policy = {
  allow: new Set(["MIT", "ISC", "Apache-2.0", "BSD-3-Clause", "CC0-1.0"]),
  review: ["LGPL-", "MPL-"],
  exceptions: {
    "pkg:npm/%40img/sharp-libvips-linux-x64": ["LGPL-3.0-or-later"],
  },
};

test("allowed ids and expressions pass", () => {
  assert.equal(evaluate("MIT", policy), "ok");
  assert.equal(evaluate("MIT AND ISC", policy), "ok");
  assert.equal(evaluate("(MIT OR GPL-3.0-or-later)", policy), "ok");
  assert.equal(evaluate("MIT OR (CC0-1.0 AND MIT)", policy), "ok");
  assert.equal(evaluate("Apache-2.0 WITH LLVM-exception", policy), "ok");
});

test("strong copyleft, unknown and LicenseRef fail", () => {
  assert.equal(evaluate("GPL-3.0-only", policy), "fail");
  assert.equal(evaluate("AGPL-3.0-or-later", policy), "fail");
  assert.equal(evaluate("SSPL-1.0", policy), "fail");
  assert.equal(evaluate("BUSL-1.1", policy), "fail");
  assert.equal(evaluate("MIT AND GPL-2.0-only", policy), "fail");
  assert.equal(evaluate("LicenseRef-scancode-commons-clause", policy), "fail");
  assert.equal(evaluate("NOASSERTION", policy), "fail");
  assert.equal(evaluate(null, policy), "fail");
  assert.equal(evaluate("", policy), "fail");
  assert.equal(evaluate("(MIT", policy), "fail");
});

test("LGPL and MPL need review", () => {
  assert.equal(evaluate("LGPL-3.0-or-later", policy), "review");
  assert.equal(evaluate("Apache-2.0 AND LGPL-3.0-or-later", policy), "review");
  assert.equal(evaluate("MPL-2.0", policy), "review");
  assert.equal(evaluate("(MPL-2.0 OR Apache-2.0)", policy), "ok");
  assert.equal(evaluate("MPL-2.0 AND GPL-3.0-only", policy), "fail");
});

test("purlKey drops the version but keeps the scope", () => {
  assert.equal(
    purlKey("pkg:npm/%40img/sharp-libvips-linux-x64@1.3.4"),
    "pkg:npm/%40img/sharp-libvips-linux-x64",
  );
  assert.equal(purlKey("pkg:npm/lodash@4.17.21"), "pkg:npm/lodash");
  assert.equal(purlKey("pkg:npm/lodash"), "pkg:npm/lodash");
});

function pkg(purl, license) {
  return {
    name: purl,
    versionInfo: "1.0.0",
    licenseConcluded: license,
    externalRefs: [{ referenceType: "purl", referenceLocator: purl }],
  };
}

test("sweep flags new problems, honours exceptions and notices changes", () => {
  const sbom = {
    sbom: {
      packages: [
        pkg("pkg:npm/ok@1.0.0", "MIT"),
        pkg("pkg:npm/ok@1.0.0", "MIT"),
        pkg("pkg:npm/bad@1.0.0", "GPL-3.0-only"),
        pkg(
          "pkg:npm/%40img/sharp-libvips-linux-x64@1.3.4",
          "LGPL-3.0-or-later",
        ),
        pkg("pkg:npm/%40haxtheweb/own@26.0.0", undefined),
        // a workspace the lockfile lists by its folder
        pkg("pkg:npm/elements/own-element@26.0.0", undefined),
        pkg("pkg:githubactions/actions/checkout@v7", undefined),
      ],
    },
  };
  const r = sweep(sbom, policy);
  assert.equal(r.total, 3);
  assert.deepEqual(
    r.problems.map((p) => p.key),
    ["pkg:npm/bad"],
  );
  assert.equal(r.accepted.length, 1);
  assert.deepEqual(r.stale, []);

  sbom.sbom.packages[3].licenseConcluded = "GPL-3.0-only";
  const changed = sweep(sbom, policy);
  assert.equal(changed.problems.length, 2);
  assert.ok(changed.problems.find((p) => p.changed));
  assert.deepEqual(changed.stale, ["pkg:npm/%40img/sharp-libvips-linux-x64"]);
});

test("reviewPr fails on unknown licenses and labels weak copyleft", () => {
  const change = (name, license) => ({
    name,
    version: "1.0.0",
    manifest: "yarn.lock",
    license,
    package_url: `pkg:npm/${name}@1.0.0`,
  });
  const problems = reviewPr(
    {
      unlicensed: [
        change("mystery", null),
        // a workspace package a regenerated lockfile lists by its folder
        change("elements/own-element", null),
        {
          name: "actions/checkout",
          license: null,
          package_url: "pkg:githubactions/actions/checkout@v7",
        },
      ],
      unresolved: [],
      forbidden: [
        change("lgpl-thing", "LGPL-2.1-only"),
        change("gpl-thing", "GPL-2.0-only"),
        change("either", "MIT OR GPL-2.0-only"),
      ],
    },
    policy,
  );
  assert.deepEqual(
    problems.map((p) => [p.name, p.verdict]),
    [
      ["mystery", "fail"],
      ["lgpl-thing", "review"],
      ["gpl-thing", "fail"],
    ],
  );
});
