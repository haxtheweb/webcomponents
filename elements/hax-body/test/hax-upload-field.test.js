import { fixture, expect, html, aTimeout, oneEvent } from "@open-wc/testing";
import "../lib/hax-upload-field.js";
import "../lib/hax-tray-upload.js";
import "@haxtheweb/simple-fields/lib/simple-file-upload.js";

describe("hax-upload-field integration with simple-file-upload", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <hax-upload-field label="Upload"></hax-upload-field>
    `);
    await element.updateComplete;
  });

  it("renders a simple-file-upload element inside", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(upload).to.exist;
    expect(upload.id).to.equal("fileupload");
  });

  it("sets method, target, and headers on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    upload.method = "POST";
    upload.target = "https://example.com/api/upload";
    upload.headers = { Authorization: "Bearer test" };
    expect(upload.method).to.equal("POST");
    expect(upload.target).to.equal("https://example.com/api/upload");
    expect(upload.headers.Authorization).to.equal("Bearer test");
  });

  it("uploadFiles() is exposed on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(typeof upload.uploadFiles).to.equal("function");
  });

  it("can clear files on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    upload.files = [];
    expect(upload.files).to.deep.equal([]);
  });
});

describe("hax-tray-upload integration with simple-file-upload", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <hax-tray-upload label="Tray upload"></hax-tray-upload>
    `);
    await element.updateComplete;
  });

  it("renders a simple-file-upload element inside", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(upload).to.exist;
    expect(upload.id).to.equal("fileupload");
  });

  it("exposes handleDrop as a public method on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(typeof upload.handleDrop).to.equal("function");
  });

  it("exposes addFile as a public method on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(typeof upload.addFile).to.equal("function");
  });

  it("adds a file via addFile on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    const file = new File(["blob"], "tray.png", { type: "image/png" });
    upload.addFile(file);
    expect(upload.files.length).to.equal(1);
    expect(upload.files[0].name).to.equal("tray.png");
  });

  it("handles a drop via handleDrop on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    const file = new File(["blob"], "drop.png", { type: "image/png" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true });
    upload.handleDrop(dropEvent);
    await aTimeout(0);
    expect(upload.files.length).to.equal(1);
    expect(upload.files[0].name).to.equal("drop.png");
  });

  it("clears files array when leaving edit mode", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    upload.files = [{ name: "old.png" }];
    element._editModeChanged(false);
    expect(upload.files).to.deep.equal([]);
  });
});
