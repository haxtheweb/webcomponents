import { fixture, expect, html } from "@open-wc/testing";
import { HAXStore } from "../lib/hax-store.js";
import "../lib/hax-tray-upload.js";

// haxtheweb/issues#3401: an upload that never reached a server (status 0)
// must not be reported as the server refusing the file

async function failedToast(detail) {
  const el = await fixture(html`<hax-tray-upload></hax-tray-upload>`);
  const original = HAXStore.toast;
  let message = "";
  HAXStore.toast = (msg) => {
    message = msg;
  };
  try {
    el._uploadFailed({ detail });
  } finally {
    HAXStore.toast = original;
  }
  return { el, message };
}

describe("hax-tray-upload failed upload toast", () => {
  it("says the server could not be reached when there was no answer", async () => {
    const { el, message } = await failedToast({
      file: { name: "photo.jpg" },
      xhr: { status: 0, responseText: "" },
    });
    expect(message).to.equal(
      el.t.uploadOfFileFailed
        .replace("{name}", "photo.jpg")
        .replace("{reason}", el.t.uploadServerUnreachable),
    );
  });

  it("keeps the generic reason for a cancelled upload", async () => {
    const { el, message } = await failedToast({
      file: { name: "photo.jpg" },
      xhr: { status: 0, responseText: "" },
      aborted: true,
    });
    expect(message).to.equal(
      el.t.uploadOfFileFailed
        .replace("{name}", "photo.jpg")
        .replace("{reason}", el.t.uploadFailedReason),
    );
  });

  it("keeps the generic reason when the server answers with an error", async () => {
    const { el, message } = await failedToast({
      file: { name: "photo.jpg" },
      xhr: { status: 500, responseText: "<html>500</html>" },
    });
    expect(message).to.contain("photo.jpg");
    expect(message).to.not.contain(el.t.uploadServerUnreachable);
  });
});
