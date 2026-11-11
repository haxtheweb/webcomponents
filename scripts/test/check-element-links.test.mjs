import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkElement } from "../check-element-links.mjs";

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "links-"));
  for (const [rel, text] of Object.entries(files)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return root;
}

test("flags missing relative files in README and demos, line by line", () => {
  const root = fixture({
    "elements/el/README.md":
      "# el\n\n[ok](demo/index.html)\n![gone](lib/missing.png)\n",
    "elements/el/demo/index.html":
      '<a href="../README.md">r</a>\n<track src="files/gone.vtt">\n<img src="/elements/el/demo/index.html">',
  });
  const result = checkElement("el", root);
  assert.equal(result.checked, 2);
  assert.deepEqual(result.broken, [
    { file: "elements/el/README.md", line: 4, target: "lib/missing.png" },
    { file: "elements/el/demo/index.html", line: 2, target: "files/gone.vtt" },
  ]);
});

test("skips external, fragment, templated, node_modules, code and route links", () => {
  const root = fixture({
    "elements/el/README.md": [
      "[web](https://example.com/x) [mail](mailto:a@b.c) [top](#usage)",
      "`[code](nowhere.md)`",
      "```html",
      '<img src="not/checked.png">',
      "```",
    ].join("\n"),
    "elements/el/demo/index.html": [
      '<script src="../../../node_modules/x/x.js"></script>',
      '<a href="${base}/x.html">t</a>',
      '<a href="/step2">route</a>',
      '<a href="//cdn.example.com/a.js">cdn</a>',
    ].join("\n"),
  });
  assert.deepEqual(checkElement("el", root).broken, []);
});

test("honors a demo's <base href> and refuses links that leave the repo", () => {
  const root = fixture({
    "elements/el/demo/index.html":
      '<base href="/elements/el/">\n<a href="README.md">r</a>\n<a href="../../../../etc/passwd">x</a>',
    "elements/el/README.md": "# el\n",
  });
  assert.deepEqual(
    checkElement("el", root).broken.map((b) => b.target),
    ["../../../../etc/passwd"],
  );
});
