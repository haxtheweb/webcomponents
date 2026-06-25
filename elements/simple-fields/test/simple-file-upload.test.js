import { fixture, expect, html, oneEvent, aTimeout } from "@open-wc/testing";
import "../lib/simple-file-upload.js";

describe("simple-file-upload", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <simple-file-upload
        method="POST"
        target="https://example.com/upload"
        accept="image/*"
      ></simple-file-upload>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("instantiates with default properties", async () => {
    expect(element.files).to.deep.equal([]);
    expect(element.method).to.equal("POST");
    expect(element.target).to.equal("https://example.com/upload");
    expect(element.accept).to.equal("image/*");
    expect(element.withCredentials).to.equal(false);
    expect(element.formDataName).to.equal("file");
    expect(element.nodrop).to.equal(false);
  });

  it("adds a file to the queue via addFile()", async () => {
    const file = new File(["blob"], "test.png", { type: "image/png" });
    element.addFile(file);
    expect(element.files.length).to.equal(1);
    expect(element.files[0].name).to.equal("test.png");
    expect(element.files[0].status).to.equal("Pending");
    expect(element.files[0].progress).to.equal(0);
  });

  it("rejects a file that does not match accept and fires file-reject", async () => {
    element.accept = "image/*";
    const file = new File(["blob"], "test.txt", { type: "text/plain" });
    setTimeout(() => element.addFile(file));
    const e = await oneEvent(element, "file-reject");
    expect(e.detail.error).to.include("File type not accepted");
    expect(element.files.length).to.equal(0);
  });

  it("sets _dragover on dragenter and clears on dragleave", async () => {
    element.nodrop = false;
    const dragEnter = new Event("dragenter", { bubbles: true });
    dragEnter.preventDefault = () => {};
    element.dispatchEvent(dragEnter);
    expect(element._dragover).to.be.true;

    const dragLeave = new Event("dragleave", { bubbles: true });
    dragLeave.preventDefault = () => {};
    element.dispatchEvent(dragLeave);
    expect(element._dragover).to.be.false;
  });

  it("keeps _dragover when dragleave fires to a child element", async () => {
    element.nodrop = false;
    const dragEnter = new Event("dragenter", { bubbles: true });
    dragEnter.preventDefault = () => {};
    element.dispatchEvent(dragEnter);
    expect(element._dragover).to.be.true;

    const dragLeave = new Event("dragleave", { bubbles: true });
    dragLeave.preventDefault = () => {};
    dragLeave.relatedTarget = element.shadowRoot.querySelector(".drop-zone");
    element.dispatchEvent(dragLeave);
    expect(element._dragover).to.be.true;
  });

  it("adds files via handleDrop() with a mock DragEvent", async () => {
    const file = new File(["blob"], "drop.png", { type: "image/png" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true });
    element.handleDrop(dropEvent);
    await aTimeout(0);
    expect(element.files.length).to.equal(1);
    expect(element.files[0].name).to.equal("drop.png");
  });

  it("does not auto-upload when addFile() is called", async () => {
    const file = new File(["blob"], "trigger.png", { type: "image/png" });
    element.addFile(file);
    expect(element.files.length).to.equal(1);
    expect(element.files[0].status).to.equal("Pending");
    expect(element.files[0].xhr).to.equal(null);
  });

  it("supports the add-button slot", async () => {
    const slot = element.shadowRoot.querySelector("slot[name='add-button']");
    expect(slot).to.exist;
  });

  it("supports the drop-label slot", async () => {
    const slot = element.shadowRoot.querySelector("slot[name='drop-label']");
    expect(slot).to.exist;
  });

  it("renders file-list part", async () => {
    const list = element.shadowRoot.querySelector('[part="file-list"]');
    expect(list).to.exist;
  });

  it("renders drop-label part", async () => {
    const label = element.shadowRoot.querySelector('[part="drop-label"]');
    expect(label).to.exist;
  });

  it("exposes uploadFiles() as a public method", () => {
    expect(typeof element.uploadFiles).to.equal("function");
  });

  it("exposes addFile() as a public method", () => {
    expect(typeof element.addFile).to.equal("function");
  });

  it("exposes handleDrop() as a public method", () => {
    expect(typeof element.handleDrop).to.equal("function");
  });

  it("allows removing a file from the queue", async () => {
    const file = new File(["blob"], "remove.png", { type: "image/png" });
    element.addFile(file);
    expect(element.files.length).to.equal(1);
    element._removeFile(0);
    expect(element.files.length).to.equal(0);
  });

  it("exposes _retryFile as a method", async () => {
    const file = new File(["blob"], "retry.png", { type: "image/png" });
    element.addFile(file);
    element.files[0].error = "Upload failed";
    element.files[0].status = "Error";
    element.files[0].complete = true;
    element.files[0].xhr = {};
    element._retryFile(0);
    expect(element.files[0].error).to.equal("");
    expect(element.files[0].status).to.equal("Pending");
    expect(element.files[0].complete).to.equal(false);
    expect(element.files[0].xhr).to.equal(null);
  });
});
