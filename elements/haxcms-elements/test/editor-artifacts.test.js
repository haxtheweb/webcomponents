import { expect } from "@open-wc/testing";
import { removeEditorArtifacts } from "../lib/core/utils/editor-artifacts.js";

// a detached tree, as the site builder parses page HTML
const page = (html) => {
  const doc = globalThis.document.implementation.createHTMLDocument("");
  const root = doc.createElement("div");
  root.innerHTML = html;
  return root;
};

describe("removeEditorArtifacts", () => {
  it("drops role=textbox and keeps every other role", () => {
    const root = removeEditorArtifacts(
      page(
        '<p role="textbox">a</p><li role="textbox">b</li><div role="note">c</div><span role="textbox presentation">d</span>',
      ),
    );
    expect(root.querySelectorAll("[role=textbox]").length).to.equal(0);
    expect(root.querySelector("div").getAttribute("role")).to.equal("note");
    // only the exact editor value is editor state
    expect(root.querySelector("span").getAttribute("role")).to.equal(
      "textbox presentation",
    );
  });

  it("drops contenteditable and the text editor's editing name", () => {
    const root = removeEditorArtifacts(
      page(
        '<p contenteditable="true">a</p><p data-rte-editing-name="x" aria-label="Paragraph">b</p><p aria-label="Keep me">c</p>',
      ),
    );
    expect(root.querySelector("[contenteditable]")).to.equal(null);
    expect(root.querySelector("[data-rte-editing-name]")).to.equal(null);
    expect(root.querySelectorAll("[aria-label]").length).to.equal(1);
    expect(root.querySelector("[aria-label]").textContent).to.equal("c");
  });

  it("unwraps the text editor's highlight and keeps what it held", () => {
    const root = removeEditorArtifacts(
      page(
        '<p>Before <rich-text-editor-highlight id="rte-1" range="{}"><b>Contact</b> us</rich-text-editor-highlight> after</p>',
      ),
    );
    expect(root.querySelector("rich-text-editor-highlight")).to.equal(null);
    expect(root.querySelector("p").innerHTML).to.equal(
      "Before <b>Contact</b> us after",
    );
  });

  it("leaves layout attributes and plain content alone", () => {
    const html =
      '<grid-plate layout="1-1" data-hax-layout="true"><p data-hax-grid="" slot="col-1">x</p></grid-plate>';
    expect(removeEditorArtifacts(page(html)).innerHTML).to.equal(html);
  });

  it("ignores what is not a node", () => {
    expect(removeEditorArtifacts(null)).to.equal(null);
    expect(removeEditorArtifacts("text")).to.equal("text");
  });
});
