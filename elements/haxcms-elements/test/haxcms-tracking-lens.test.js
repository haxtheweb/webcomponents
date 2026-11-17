import { expect } from "@open-wc/testing";
import { trackingCategory } from "../lib/ui-components/progress/haxcms-tracking-lens.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import {
  XAPI_DECLARED_SILENT,
  XAPI_VOCABULARY,
} from "@haxtheweb/user-action/lib/xapi-vocabulary.js";

const el = (tag) => globalThis.document.createElement(tag);

describe("tracking lens: which group a block is in", () => {
  it("reads silent-on-purpose from what the elements declare", () => {
    Object.keys(XAPI_DECLARED_SILENT).forEach((tag) => {
      expect(trackingCategory(el(tag)), tag).to.equal("none");
    });
    expect(trackingCategory(el("stop-note"))).to.equal("none");
  });

  it("counts, tracks, or flags the rest", () => {
    expect(trackingCategory(el("multiple-choice"))).to.equal("counts");
    // opening an image is recorded but never required
    expect(XAPI_VOCABULARY["media-image"].countsTowardCompletion).to.equal(
      false,
    );
    expect(trackingCategory(el("media-image"))).to.equal("tracked");
    expect(trackingCategory(el("made-up-block"))).to.equal("undeclared");
  });

  it("says where reading stands with its checkpoints", async () => {
    const lens = el("haxcms-tracking-lens");
    // reading is not looking at a page: nothing to say
    expect(lens._checkpoints()).to.equal(null);
    expect(lens._checkpointSeen(el("stop-note"))).to.equal(null);
    const note = el("stop-note");
    const reading = LearnerProgress.reading;
    const saved = { page: reading.page, checkpoints: reading.checkpoints };
    reading.page = { id: "p" };
    reading.checkpoints = () => [note];
    try {
      globalThis.document.body.appendChild(note);
      note.style.cssText = "display:block;height:40px;width:40px";
      const status = lens._checkpoints();
      expect(status.total).to.equal(1);
      expect(status.seen).to.equal(0);
      expect(lens._checkpointSeen(note)).to.equal(false);
      expect(lens.renderCheckpointLine().values).to.include(
        lens.t.checkpointLine.replace("{seen}", 0).replace("{total}", 1),
      );
    } finally {
      note.remove();
      reading.page = saved.page;
      reading.checkpoints = saved.checkpoints;
    }
  });
});
