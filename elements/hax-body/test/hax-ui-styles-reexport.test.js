import { expect } from "@open-wc/testing";
import * as fromHaxBody from "../lib/hax-ui-styles.js";
import * as fromDDD from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";

describe("hax-ui-styles re-exports the d-d-d HAX UI admin layer", () => {
  it("hands out the same objects, so there is one source", () => {
    [
      "HaxUiAdminTokens",
      "HaxUiAdminPrimitives",
      "HaxUiAdminControls",
      "HaxUiAdminSimpleFields",
      "HaxUiAdminScheme",
      "HaxUiAdminStyles",
      "HaxUiAdminProposed",
      "HaxUiAdminIcons",
    ].forEach((name) => {
      expect(fromHaxBody[name], name).to.exist;
      expect(fromHaxBody[name], name).to.equal(fromDDD[name]);
    });
  });
});
