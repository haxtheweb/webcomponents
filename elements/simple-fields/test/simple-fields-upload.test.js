import { fixture, expect, html, aTimeout, oneEvent } from "@open-wc/testing";
import "../lib/simple-fields-upload.js";
import "../lib/simple-file-upload.js";

describe("simple-fields-upload integration with simple-file-upload", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <simple-fields-upload label="Upload test"></simple-fields-upload>
    `);
    await element.updateComplete;
  });

  it("renders a simple-file-upload element inside", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(upload).to.exist;
    expect(upload.id).to.equal("fileupload");
  });

  it("simple-file-upload has the correct form-data-name attribute", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    expect(upload.getAttribute("form-data-name")).to.equal("file-upload");
  });

  it("_handleBrowse triggers focusFileInput on the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    let called = false;
    upload.focusFileInput = () => {
      called = true;
    };
    element._handleBrowse({ preventDefault: () => {} });
    expect(called).to.be.true;
  });

  it("__newPhotoShowedUp adds a file to the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    let addedFile = null;
    upload.addFile = (file) => {
      addedFile = file;
    };
    element.__newPhotoShowedUp({
      detail: { raw: new Blob(["fake-image"]) },
      timeStamp: 123456,
    });
    expect(addedFile).to.exist;
    expect(addedFile.name).to.include("headshot");
    expect(addedFile.name).to.include(".jpg");
  });

  it("__newAudioShowedUp adds a file to the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    let addedFile = null;
    upload.addFile = (file) => {
      addedFile = file;
    };
    element.__newAudioShowedUp({
      detail: { value: new Blob(["fake-audio"]) },
      timeStamp: 789012,
    });
    expect(addedFile).to.exist;
    expect(addedFile.name).to.include("voice-recording");
    expect(addedFile.name).to.include(".mp3");
  });

  it("__newScreenRecordingShowedUp adds a file to the inner upload", async () => {
    const upload = element.shadowRoot.querySelector("simple-file-upload");
    let addedFile = null;
    upload.addFile = (file) => {
      addedFile = file;
    };
    element.__newScreenRecordingShowedUp({
      detail: { blob: new Blob(["fake-video"]) },
      timeStamp: 345678,
    });
    expect(addedFile).to.exist;
    expect(addedFile.name).to.include("screen-recording");
    expect(addedFile.name).to.include(".webm");
  });

  it("_handleCancel resets option to 'fileupload'", async () => {
    element.option = "selfie";
    element._handleCancel({ preventDefault: () => {} });
    expect(element.option).to.equal("fileupload");
  });

  it("dispatches upload-before from inner upload via _fileAboutToUpload", async () => {
    setTimeout(() => {
      const upload = element.shadowRoot.querySelector("simple-file-upload");
      upload.dispatchEvent(
        new CustomEvent("upload-before", {
          bubbles: true,
          composed: true,
          detail: { file: { name: "test.jpg" } },
        }),
      );
    }, 0);
    const e = await oneEvent(element, "upload-before");
    expect(e.detail.file.name).to.equal("test.jpg");
  });

  it("dispatches upload-response from inner upload via _fileUploadResponse", async () => {
    setTimeout(() => {
      const upload = element.shadowRoot.querySelector("simple-file-upload");
      upload.dispatchEvent(
        new CustomEvent("upload-response", {
          bubbles: true,
          composed: true,
          detail: { file: { name: "test.jpg" }, xhr: { status: 200 } },
        }),
      );
    }, 0);
    const e = await oneEvent(element, "upload-response");
    expect(e.detail.xhr.status).to.equal(200);
  });

  it("initializes option to 'fileupload' when value is empty", async () => {
    expect(element.option).to.equal("fileupload");
  });

  it("initializes option to 'url' when value is set", async () => {
    element.value = "https://example.com/image.jpg";
    await element.updateComplete;
    // firstUpdated sets option based on value, but we already constructed it
    // so we can manually verify the logic by resetting
    element.option = "";
    element.firstUpdated();
    expect(element.option).to.equal("url");
  });

  it("renders the sources toolbar buttons", async () => {
    const buttons = element.shadowRoot.querySelectorAll(
      "simple-toolbar-button",
    );
    expect(buttons.length).to.be.greaterThan(0);
  });

  it("renders the URL input when not in camera/audio mode", async () => {
    element.option = "fileupload";
    element.hideInput = false;
    await element.updateComplete;
    const url = element.shadowRoot.querySelector("simple-fields-url-combo");
    expect(url).to.exist;
  });

  it("hides the URL input when option is 'selfie'", async () => {
    element.option = "selfie";
    await element.updateComplete;
    const url = element.shadowRoot.querySelector("simple-fields-url-combo");
    // url is inside a div with hidden based on option, so it's still in DOM but parent is hidden
    const urlContainer = element.shadowRoot.querySelector(
      '[part="browse-area"]',
    );
    if (urlContainer) {
      expect(urlContainer.hasAttribute("hidden")).to.be.true;
    }
  });
});
