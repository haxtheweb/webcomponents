/**
 * The sanitizer tree walk was rewritten to visit each element once
 * (haxtheweb/issues#3263). These tests run the new walk and a frozen copy of
 * the old one (sanitize-legacy-reference.js) on the same hostile inputs and
 * require byte-identical output, so the speedup cannot have loosened what is
 * removed. They also pin the walk to linear time on large nested content.
 */
import { expect } from "@open-wc/testing";
import fc from "fast-check";
import {
  sanitizeHTMLString,
  sanitizeHTMLForImport,
  sanitizeNodeTree,
  removeBadJSEventAttributes,
  removeUnsafeElements,
  removeUnsafeURLAttributes,
  removeUnsafeIframeAttributes,
} from "../lib/sanitize.js";
import {
  legacySanitizeHTMLString,
  legacySanitizeNodeTree,
  legacyRemoveBadJSEventAttributes,
  legacyRemoveUnsafeElements,
  legacyRemoveUnsafeURLAttributes,
  legacyRemoveUnsafeIframeAttributes,
} from "./sanitize-legacy-reference.js";

const FIXTURES = [
  // event handlers in many casings, on many kinds of element
  '<img src="x.png" onerror="alert(1)">',
  '<img src=x ONERROR="alert(1)" OnLoad="alert(2)">',
  '<div oNcLiCk="alert(1)" onmouseover="x()"><p onfocus="y()">t</p></div>',
  '<details open ontoggle="alert(1)"><summary>s</summary></details>',
  '<body onload="alert(1)"><p>x</p></body>',
  '<svg onload="alert(1)"><circle onclick="x()" r="4"></circle></svg>',
  '<svg><animate onbegin="alert(1)" attributeName="x"></animate></svg>',
  '<button onpointerrawupdate="x()" oncontentvisibilityautostatechange="y()">b</button>',
  '<video onloadstart="x()" poster="javascript:alert(1)" src="v.mp4"></video>',
  // custom element attributes that only look like handlers are kept
  '<my-thing one-line onboarding="1" online-only="yes" on="x">k</my-thing>',
  // URL attributes
  '<a href="javascript:alert(1)">x</a>',
  '<a href="  JaVaScRiPt:alert(1)">x</a>',
  '<a href="java&#x09;script:alert(1)">x</a>',
  '<a href="java\nscript:alert(1)">x</a>',
  '<a href="https://example.com/ok">ok</a>',
  '<a href="/relative/ok#frag">ok</a>',
  '<img src="data:image/svg+xml;base64,PHN2Zz4=">',
  '<img srcset="javascript:alert(1) 1x">',
  '<a href="vbscript:msgbox(1)">v</a>',
  '<form action="javascript:alert(1)"><button formaction="javascript:x()">b</button></form>',
  '<object data="javascript:alert(1)"></object>',
  '<blockquote cite="javascript:alert(1)">q</blockquote>',
  '<my-el data-src="javascript:alert(1)" link-url="javascript:x()" image_url="data:x" source="vbscript:y" x:href="javascript:z" keep-src="https://ok.example/a.png"></my-el>',
  '<svg><a xlink:href="javascript:alert(1)"><text>x</text></a></svg>',
  '<svg><use href="data:image/svg+xml,&lt;svg&gt;"></use></svg>',
  // iframes and webviews
  '<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe>',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>',
  '<iframe src="  https://www.youtube.com/embed/x  "></iframe>',
  '<iframe src="ftp://example.com/x"></iframe>',
  '<webview src="javascript:alert(1)" srcdoc="x"></webview>',
  '<div><div><iframe src="https://ok.example" srcdoc="x" onload="y()"></iframe></div></div>',
  // unsafe elements
  '<base href="https://evil.example/"><p>x</p>',
  '<meta http-equiv="refresh" content="0;url=javascript:alert(1)"><p>x</p>',
  "<lrn-math-controller><p>x</p></lrn-math-controller><p>kept</p>",
  '<svg><a><animate attributeName="href" values="javascript:alert(1)"></animate><text>x</text></a></svg>',
  '<svg><a><set attributeName="xlink:href" to="javascript:alert(1)"></set></a></svg>',
  '<svg><a><set attributeName=" HREF " to="javascript:alert(1)"></set></a></svg>',
  '<svg><rect><animate attributeName="x" from="0" to="9"></animate></rect></svg>',
  '<div><meta charset="x"><div><base href="//evil"><img src="javascript:x" onerror="y()"></div></div>',
  // templates, nested templates, scripts
  '<template><img src=x onerror="alert(1)"><a href="javascript:x">a</a></template>',
  '<template id="t" onclick="x()"><template><iframe srcdoc="x"></iframe><meta charset="x"></template></template>',
  '<code-sample><template><script>alert(1)</script><p onclick="x()">c</p></template></code-sample>',
  "<template></template><script>alert(1)</script>",
  "<!--<template>--><script>alert(1)</script><style>p{}</style>",
  "<SCRIPT>alert(1)</SCRIPT><p>after</p>",
  // tables, math, malformed soup
  '<table><tr><td onclick="x()"><a href="javascript:y">c</a></td></tr></table>',
  "<tr><td onmouseover=x()>orphan cell</td></tr>",
  '<math><mi xlink:href="javascript:alert(1)">x</mi></math>',
  '<p>unclosed <b onclick="x()">bold <i onfocus="y()">it',
  '<div onclick="a()" onclick="b()">duplicate</div>',
  "",
  "plain text only",
];

/**
 * A deeply nested page resembling real HAX content: grid-plates inside
 * grid-plates, each column holding paragraphs, links and images, with a few
 * hostile attributes sprinkled through.
 */
function nestedContent(blocks, depth) {
  let out = "";
  for (let b = 0; b < blocks; b++) {
    let open = "";
    let close = "";
    for (let d = 0; d < depth; d++) {
      open += '<grid-plate layout="1-1"><div slot="col-1">';
      close = '</div><div slot="col-2"><p>col 2</p></div></grid-plate>' + close;
    }
    out +=
      open +
      '<p onclick="x()">Block ' +
      b +
      ' <a href="javascript:y()">link</a> <a href="/ok">ok</a></p>' +
      '<img src="i.png" onerror="z()" alt="a">' +
      '<iframe src="https://ok.example/e" srcdoc="x"></iframe>' +
      close;
  }
  return out;
}

// build a detached tree in an inert document so nothing in it can run
function inertTree(html) {
  const inert = document.implementation.createHTMLDocument("");
  const template = inert.createElement("template");
  template.innerHTML = html;
  return template;
}

function serialize(node) {
  const inert = document.implementation.createHTMLDocument("");
  const wrap = inert.createElement("template");
  wrap.content.appendChild(node);
  return wrap.innerHTML;
}

describe("sanitizer one-pass walk matches the legacy walk", () => {
  FIXTURES.forEach((html, i) => {
    it(`sanitizeHTMLString fixture ${i}`, () => {
      expect(sanitizeHTMLString(html)).to.equal(legacySanitizeHTMLString(html));
    });
  });

  it("matches with template contents left alone and scripts not encapsulated", () => {
    const opts = {
      sanitizeTemplateContents: false,
      encapsulateScriptTags: false,
    };
    FIXTURES.forEach((html) => {
      expect(sanitizeHTMLString(html, opts)).to.equal(
        legacySanitizeHTMLString(html, opts),
      );
    });
  });

  it("sanitizeHTMLForImport matches the legacy pipeline", () => {
    FIXTURES.forEach((html) => {
      const frag = sanitizeHTMLForImport(html);
      expect(serialize(frag)).to.equal(legacySanitizeHTMLString(html));
    });
  });

  it("matches on large nested grid-plate content", () => {
    const html = nestedContent(6, 5) + FIXTURES.join("");
    expect(sanitizeHTMLString(html)).to.equal(legacySanitizeHTMLString(html));
  });

  it("sanitizeNodeTree matches on element, fragment and template roots", () => {
    FIXTURES.forEach((html) => {
      // a fragment root
      const a = inertTree(html).content;
      const b = inertTree(html).content;
      sanitizeNodeTree(a);
      legacySanitizeNodeTree(b);
      expect(serialize(a)).to.equal(serialize(b));
      // an element root with hostile attributes of its own
      const c = inertTree(
        '<section onclick="x()" href="javascript:y">' + html + "</section>",
      ).content.firstElementChild;
      const d = inertTree(
        '<section onclick="x()" href="javascript:y">' + html + "</section>",
      ).content.firstElementChild;
      sanitizeNodeTree(c);
      legacySanitizeNodeTree(d);
      expect(c.outerHTML).to.equal(d.outerHTML);
      // a template root
      const e = inertTree('<template onclick="x()">' + html + "</template>")
        .content.firstElementChild;
      const f = inertTree('<template onclick="x()">' + html + "</template>")
        .content.firstElementChild;
      sanitizeNodeTree(e);
      legacySanitizeNodeTree(f);
      expect(e.outerHTML).to.equal(f.outerHTML);
      expect(e.innerHTML).to.equal(f.innerHTML);
    });
  });

  it("never removes the root itself, even an unsafe one", () => {
    const root = inertTree('<meta charset="x" onclick="y()">').content
      .firstElementChild;
    sanitizeNodeTree(root);
    expect(root.localName).to.equal("meta");
    expect(root.hasAttribute("onclick")).to.equal(false);
  });

  it("each exported helper matches its legacy version", () => {
    const pairs = [
      [removeBadJSEventAttributes, legacyRemoveBadJSEventAttributes],
      [removeUnsafeElements, legacyRemoveUnsafeElements],
      [removeUnsafeURLAttributes, legacyRemoveUnsafeURLAttributes],
      [removeUnsafeIframeAttributes, legacyRemoveUnsafeIframeAttributes],
    ];
    FIXTURES.forEach((html) => {
      const wrapped =
        '<div onclick="x()" src="javascript:y">' + html + "</div>";
      pairs.forEach(([next, legacy]) => {
        // called on an element
        const a = inertTree(wrapped).content.firstElementChild;
        const b = inertTree(wrapped).content.firstElementChild;
        next(a);
        legacy(b);
        expect(a.outerHTML).to.equal(b.outerHTML);
        // called on a fragment (event handlers were never stripped here)
        const c = inertTree(html).content;
        const d = inertTree(html).content;
        next(c);
        legacy(d);
        expect(serialize(c)).to.equal(serialize(d));
        // called on an iframe directly
        const e = inertTree(
          '<iframe src="javascript:x" srcdoc="y" onload="z()"></iframe>',
        ).content.firstElementChild;
        const f = inertTree(
          '<iframe src="javascript:x" srcdoc="y" onload="z()"></iframe>',
        ).content.firstElementChild;
        next(e);
        legacy(f);
        expect(e.outerHTML).to.equal(f.outerHTML);
      });
    });
  });

  it("tolerates empty and non-element input like before", () => {
    expect(removeBadJSEventAttributes(null)).to.equal(null);
    expect(sanitizeNodeTree(undefined)).to.equal(undefined);
    const text = document.createTextNode("x");
    expect(removeBadJSEventAttributes(text)).to.equal(text);
    expect(removeUnsafeURLAttributes(text)).to.equal(text);
    expect(removeUnsafeIframeAttributes(text)).to.equal(text);
    expect(removeUnsafeElements(text)).to.equal(text);
    expect(sanitizeNodeTree(text)).to.equal(text);
  });

  it("also strips odd-cased handler names set through setAttributeNS", () => {
    const el = inertTree("<div><span>x</span></div>").content.firstElementChild;
    el.firstElementChild.setAttributeNS(null, "ONCLICK", "x()");
    removeBadJSEventAttributes(el);
    expect(el.firstElementChild.attributes.length).to.equal(0);
  });

  it("matches the legacy walk on generated hostile soup", () => {
    const tag = fc.constantFrom(
      "div",
      "p",
      "a",
      "img",
      "svg",
      "iframe",
      "webview",
      "template",
      "meta",
      "base",
      "set",
      "animate",
      "grid-plate",
      "lrn-math-controller",
      "form",
    );
    const attrName = fc.constantFrom(
      "onclick",
      "OnError",
      "ONLOAD",
      "onbegin",
      "one-line",
      "href",
      "xlink:href",
      "src",
      "SRC",
      "srcdoc",
      "data-src",
      "action",
      "attributeName",
      "title",
    );
    const attrValue = fc.constantFrom(
      "javascript:alert(1)",
      " JAVASCRIPT:x",
      "data:text/html,x",
      "vbscript:x",
      "https://ok.example/",
      "/ok",
      "href",
      "xlink:href",
      "x()",
    );
    const attr = fc
      .tuple(attrName, attrValue)
      .map(([n, v]) => " " + n + '="' + v.replace(/"/g, "") + '"');
    const element = fc.letrec((tie) => ({
      node: fc.oneof(
        { depthSize: "small", withCrossShrink: true },
        fc.constant("t"),
        fc
          .tuple(
            tag,
            fc.array(attr, { maxLength: 3 }),
            fc.array(tie("node"), { maxLength: 3 }),
          )
          .map(
            ([t, attrs, kids]) =>
              "<" + t + attrs.join("") + ">" + kids.join("") + "</" + t + ">",
          ),
      ),
    })).node;
    fc.assert(
      fc.property(fc.array(element, { maxLength: 4 }), (parts) => {
        const html = parts.join("");
        return sanitizeHTMLString(html) === legacySanitizeHTMLString(html);
      }),
      { numRuns: 300, seed: 20261109 },
    );
  });
});

describe("sanitizer one-pass walk is linear", () => {
  it("sanitizes ~5000 nested nodes quickly and strips every hostile attribute", () => {
    // 60 blocks x 8 levels of nested grid-plate is about 5000 elements
    const html = nestedContent(60, 8);
    const start = performance.now();
    const out = sanitizeHTMLString(html);
    const elapsed = performance.now() - start;
    expect(out).to.not.contain("onclick");
    expect(out).to.not.contain("onerror");
    expect(out).to.not.contain("javascript:");
    expect(out).to.not.contain("srcdoc");
    expect(out).to.contain('href="/ok"');
    // the old walk took ~250ms here and grew with nesting depth; this runs
    // in under 10ms locally, so the bound only has to absorb slow CI
    expect(elapsed).to.be.below(1500);
  });

  it("doubling the content roughly doubles the time, not quadruples it", () => {
    const time = (blocks) => {
      const html = nestedContent(blocks, 8);
      // best of 3 to smooth out GC pauses
      let best = Infinity;
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        sanitizeHTMLString(html);
        best = Math.min(best, performance.now() - start);
      }
      return best;
    };
    time(10);
    const small = Math.max(time(20), 1);
    const large = time(80);
    // 4x the content; quadratic would be ~16x, linear ~4x
    expect(large / small).to.be.below(10);
  });
});
