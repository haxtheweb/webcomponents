import { expect } from "@open-wc/testing";
import { zipSync, strToU8 } from "fflate";
import {
  unpackH5P,
  mimeFor,
  resolvePath,
  toDataUri,
} from "../lib/h5p-package.js";

const lib = (machineName, major, minor, deps = [], extra = {}) => ({
  machineName,
  majorVersion: major,
  minorVersion: minor,
  title: machineName,
  preloadedDependencies: deps,
  preloadedJs: [{ path: "main.js" }],
  preloadedCss: [{ path: "main.css" }],
  ...extra,
});

/** Build a small but structurally real .h5p archive. */
function makePackage(overrides = {}, prefix = "") {
  const files = {
    "h5p.json": JSON.stringify({
      title: "Sample",
      mainLibrary: "H5P.Main",
      preloadedDependencies: [
        { machineName: "H5P.Main", majorVersion: 1, minorVersion: 2 },
      ],
    }),
    "content/content.json": JSON.stringify({ hello: "world" }),
    "content/images/pic 1.png": "png-bytes",
    "H5P.Main-1.2/library.json": JSON.stringify(
      lib("H5P.Main", 1, 2, [
        { machineName: "H5P.Dep", majorVersion: 1, minorVersion: 0 },
      ]),
    ),
    "H5P.Main-1.2/main.js": "window.main = true;",
    "H5P.Main-1.2/main.css": ".a{}",
    "H5P.Dep-1.0/library.json": JSON.stringify(lib("H5P.Dep", 1, 0)),
    "H5P.Dep-1.0/main.js": "window.dep = true;",
    "H5P.Dep-1.0/main.css": ".b{}",
    ...overrides,
  };
  const entries = {};
  Object.keys(files).forEach((k) => {
    if (files[k] !== null) entries[prefix + k] = strToU8(files[k]);
  });
  return zipSync(entries);
}

describe("h5p-package helpers", () => {
  it("guesses mime types and falls back to octet-stream", () => {
    expect(mimeFor("a/b.MP4")).to.equal("video/mp4");
    expect(mimeFor("font.woff2")).to.equal("font/woff2");
    expect(mimeFor("thing.unknown")).to.equal("application/octet-stream");
  });

  it("resolves relative paths against a base directory", () => {
    expect(resolvePath("Lib-1.0/css", "../fonts/a.woff")).to.equal(
      "Lib-1.0/fonts/a.woff",
    );
    expect(resolvePath("", "./a/./b.png")).to.equal("a/b.png");
  });

  it("encodes bytes as a base64 data URI, including large buffers", () => {
    expect(toDataUri(strToU8("hi"), "text/plain")).to.equal(
      "data:text/plain;base64,aGk=",
    );
    const big = new Uint8Array(200000).fill(65);
    expect(toDataUri(big, "text/plain")).to.have.length.above(200000);
  });
});

describe("unpackH5P", () => {
  it("reads h5p.json, content and libraries from the archive", () => {
    const pkg = unpackH5P(makePackage());
    expect(pkg.h5p.title).to.equal("Sample");
    expect(pkg.mainLibraryString).to.equal("H5P.Main 1.2");
    expect(JSON.parse(pkg.contentJson).hello).to.equal("world");
    expect(pkg.totalBytes).to.be.above(0);
    pkg.dispose();
  });

  it("orders libraries so every dependency comes first", () => {
    const pkg = unpackH5P(makePackage());
    expect(pkg.libraries.map((l) => l.folder)).to.deep.equal([
      "H5P.Dep-1.0",
      "H5P.Main-1.2",
    ]);
    expect(pkg.libraries[1].js).to.deep.equal(["main.js"]);
    expect(pkg.libraries[1].css).to.deep.equal(["main.css"]);
    pkg.dispose();
  });

  it("falls back to the same major version when the minor differs", () => {
    const pkg = unpackH5P(
      makePackage({
        "h5p.json": JSON.stringify({
          title: "Sample",
          mainLibrary: "H5P.Main",
          preloadedDependencies: [
            { machineName: "H5P.Main", majorVersion: 1, minorVersion: 9 },
          ],
        }),
      }),
    );
    expect(pkg.libraries.some((l) => l.folder === "H5P.Main-1.2")).to.equal(
      true,
    );
    pkg.dispose();
  });

  it("unwraps a single top level folder some exporters add", () => {
    const pkg = unpackH5P(makePackage({}, "my-export/"));
    expect(pkg.has("h5p.json")).to.equal(true);
    expect(pkg.libraries).to.have.length(2);
    pkg.dispose();
  });

  it("never keeps entries that climb out of the package", () => {
    const pkg = unpackH5P(
      makePackage({
        "../evil.js": "x",
        "a/../../evil2.js": "x",
        "__MACOSX/._h5p.json": "x",
      }),
    );
    expect(pkg.has("../evil.js")).to.equal(false);
    expect(pkg.has("evil.js")).to.equal(false);
    expect(pkg.has("evil2.js")).to.equal(false);
    expect(
      [...pkg.files.keys()].some((k) => k.startsWith("__MACOSX")),
    ).to.equal(false);
    pkg.dispose();
  });

  it("serves content assets as cached blob URLs, decoding the path", () => {
    const pkg = unpackH5P(makePackage());
    const url = pkg.contentUrl("images/pic%201.png");
    expect(url).to.match(/^blob:/);
    expect(pkg.contentUrl("images/pic 1.png")).to.equal(url);
    expect(pkg.contentUrl("images/missing.png")).to.equal(null);
    pkg.dispose();
  });

  it("explains what is wrong with a file that is not a zip", () => {
    expect(() => unpackH5P(strToU8("<html>nope</html>"))).to.throw(
      /not read this file as a zip/i,
    );
  });

  it("explains what is wrong with a zip that is not an H5P package", () => {
    expect(() =>
      unpackH5P(zipSync({ "readme.txt": strToU8("hello") })),
    ).to.throw(/not an H5P package/i);
  });

  it("reports libraries the package needs but does not contain", () => {
    expect(() =>
      unpackH5P(makePackage({ "H5P.Dep-1.0/library.json": null })),
    ).to.throw(/missing libraries.*H5P\.Dep 1\.0/i);
  });
});
