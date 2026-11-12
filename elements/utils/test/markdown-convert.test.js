import { expect } from "@open-wc/testing";
import {
  htmlToMarkdown,
  markdownToHTML,
  restoreManagedAttributes,
  MANAGED_ATTRIBUTES,
} from "../lib/markdown.js";

const OPTS = { headerIds: false, mangle: false };

async function roundTrip(html) {
  const r = htmlToMarkdown(html);
  return restoreManagedAttributes(
    await markdownToHTML(r.markdown, OPTS),
    r.managed,
  );
}

describe("lib/markdown htmlToMarkdown", () => {
  it("writes headings, paragraphs, lists and emphasis as Markdown", () => {
    const { markdown } = htmlToMarkdown(
      '<h2 id="h2--1128800479">Getting started</h2>' +
        "<p>Plants use <strong>light</strong> and <em>water</em>.</p>" +
        "<ul><li>One</li><li>Two</li></ul>" +
        "<ol><li>First</li><li>Second</li></ol>",
    );
    expect(markdown).to.equal(
      "## Getting started\n\n" +
        "Plants use **light** and *water*.\n\n" +
        "- One\n- Two\n\n" +
        "1. First\n2. Second",
    );
  });

  it("leaves out the page-break that opens a page", () => {
    const { markdown } = htmlToMarkdown(
      '<page-break title="Home" slug="home"></page-break><p>Hi</p>',
    );
    expect(markdown).to.equal("Hi");
  });

  it("keeps HAX elements as raw HTML with the open tag on its own line", () => {
    const { markdown } = htmlToMarkdown(
      '<stop-note title="Safety" status="warning"><p slot="message">Keep it.</p></stop-note>',
    );
    expect(markdown).to.equal(
      '<stop-note title="Safety" status="warning">\n<p slot="message">Keep it.</p>\n</stop-note>',
    );
  });

  it("keeps elements with attributes Markdown cannot hold as HTML", () => {
    const { markdown } = htmlToMarkdown(
      '<p data-primary="3">Styled</p><h2 id="custom">Custom id</h2>',
    );
    expect(markdown).to.equal(
      '<p data-primary="3">Styled</p>\n\n<h2 id="custom">Custom id</h2>',
    );
  });

  it("hides the attributes HAX manages and reports them", () => {
    const r = htmlToMarkdown(
      '<stop-note title="Safety" resource="#abc" prefix="oer:x" typeof="oer:LearningComponent"></stop-note>',
    );
    MANAGED_ATTRIBUTES.forEach((name) => {
      expect(r.markdown).to.not.include(name + "=");
    });
    expect(r.managed).to.deep.equal([
      {
        tag: "stop-note",
        index: 0,
        attrs: {
          resource: "#abc",
          prefix: "oer:x",
          typeof: "oer:LearningComponent",
        },
      },
    ]);
  });

  it("escapes text that would read as Markdown syntax", () => {
    const { markdown } = htmlToMarkdown(
      "<p>1. not a list and *not* bold &lt;b&gt;</p><p># not a heading</p>",
    );
    expect(markdown).to.equal(
      "1\\. not a list and \\*not\\* bold \\<b>\n\n\\# not a heading",
    );
  });

  it("writes links, code, quotes, rules and nested lists", () => {
    const { markdown } = htmlToMarkdown(
      '<p><a href="https://haxtheweb.org" title="HAX">HAX</a> and <code>a`b</code></p>' +
        "<blockquote>Quote me</blockquote><hr>" +
        "<ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul>" +
        '<pre><code class="language-js">const a = 1;\n</code></pre>',
    );
    expect(markdown).to.equal(
      '[HAX](https://haxtheweb.org "HAX") and ``a`b``\n\n' +
        "> Quote me\n\n---\n\n" +
        "- one\n  - nested\n- two\n\n" +
        "```js\nconst a = 1;\n```",
    );
  });
});

describe("lib/markdown round trip", () => {
  it("comes back as the same blocks, attributes restored", async () => {
    const html = await roundTrip(
      "<h2>Title</h2><p>Text</p>" +
        '<stop-note title="Safety" status="warning" resource="#abc" typeof="oer:LearningComponent">' +
        '<p slot="message">Keep it.</p></stop-note>',
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelector("h2").textContent).to.equal("Title");
    const note = doc.querySelector("stop-note");
    expect(note).to.exist;
    expect(note.parentElement.tagName).to.equal("BODY");
    expect(note.getAttribute("resource")).to.equal("#abc");
    expect(note.getAttribute("typeof")).to.equal("oer:LearningComponent");
    expect(note.querySelector('p[slot="message"]').textContent).to.equal(
      "Keep it.",
    );
  });

  it("matches restored attributes by tag and position", () => {
    const managed = [
      { tag: "stop-note", index: 1, attrs: { resource: "#second" } },
    ];
    const html = restoreManagedAttributes(
      "<stop-note></stop-note><stop-note></stop-note>",
      managed,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    const notes = doc.querySelectorAll("stop-note");
    expect(notes[0].hasAttribute("resource")).to.be.false;
    expect(notes[1].getAttribute("resource")).to.equal("#second");
  });

  it("keeps an attribute the author typed over the stored one", () => {
    const html = restoreManagedAttributes(
      '<stop-note resource="#typed"></stop-note>',
      [{ tag: "stop-note", index: 0, attrs: { resource: "#stored" } }],
    );
    expect(html).to.include('resource="#typed"');
  });

  it("converts long input in linear time", () => {
    const started = performance.now();
    htmlToMarkdown(
      "<p>" + "* ".repeat(20000) + "</p>" + "<p>#</p>".repeat(2000),
    );
    expect(performance.now() - started).to.be.below(2000);
  });
});
