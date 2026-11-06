import { expect } from "@open-wc/testing";
import * as barrel from "../lib/HaxUiAdminStyles.js";
import * as tokensModule from "../lib/HaxUiAdminTokens.js";
import * as iconsModule from "../lib/HaxUiAdminIcons.js";
import * as controlsModule from "../lib/HaxUiAdminControls.js";
import * as shellModule from "../lib/HaxUiAdminShell.js";
import * as dialogModule from "../lib/HaxUiDialogFrame.js";

// where each piece of the HAX UI admin layer lives; HaxUiAdminStyles.js
// re-exports all of them so every existing import keeps working
const HOME = {
  HaxUiAdminTokens: tokensModule,
  HaxUiAdminScheme: tokensModule,
  HaxUiAdminPrimitives: tokensModule,
  HaxUiAdminIcons: iconsModule,
  HaxUiAdminControls: controlsModule,
  HaxUiAdminSimpleFields: controlsModule,
  HaxUiAdminShell: shellModule,
  HaxUiDialogTitlebar: dialogModule,
  HaxUiDialogSurface: dialogModule,
  HaxUiDialogFrame: dialogModule,
  HaxUiDialogConfirm: dialogModule,
  HaxUiDialogTitlebarStyles: dialogModule,
  haxUiDialogVars: dialogModule,
};

const cssText = (list) => list.map((sheet) => sheet.cssText).join("\n");

describe("HAX UI admin layer split into small modules", () => {
  it("keeps every export name on HaxUiAdminStyles.js", () => {
    expect(Object.keys(barrel).sort()).to.deep.equal(
      [...Object.keys(HOME), "HaxUiAdminStyles"].sort(),
    );
  });

  it("each small module exists and exports only its pieces", () => {
    const expected = new Map();
    Object.keys(HOME).forEach((name) => {
      const mod = HOME[name];
      if (!expected.has(mod)) {
        expected.set(mod, []);
      }
      expected.get(mod).push(name);
    });
    expected.forEach((names, mod) => {
      expect(Object.keys(mod).sort()).to.deep.equal(names.sort());
    });
  });

  it("the barrel hands out the same objects and CSS text as the small modules", () => {
    Object.keys(HOME).forEach((name) => {
      const piece = HOME[name][name];
      expect(barrel[name], name).to.equal(piece);
      if (Array.isArray(piece)) {
        expect(piece.length, name).to.be.greaterThan(0);
        expect(cssText(barrel[name]), name).to.equal(cssText(piece));
        piece.forEach((sheet) => {
          expect(sheet.cssText, name).to.be.a("string").and.not.equal("");
        });
      }
    });
  });

  it("HaxUiAdminStyles is still tokens, scheme, primitives, controls and simple-fields, in order", () => {
    const combined = [
      ...tokensModule.HaxUiAdminTokens,
      ...tokensModule.HaxUiAdminScheme,
      ...tokensModule.HaxUiAdminPrimitives,
      ...controlsModule.HaxUiAdminControls,
      ...controlsModule.HaxUiAdminSimpleFields,
    ];
    expect(barrel.HaxUiAdminStyles.length).to.equal(combined.length);
    barrel.HaxUiAdminStyles.forEach((sheet, i) => {
      expect(sheet).to.equal(combined[i]);
    });
    expect(cssText(barrel.HaxUiAdminStyles)).to.equal(cssText(combined));
    // the shell stays out of the combined set, as before
    shellModule.HaxUiAdminShell.forEach((sheet) => {
      expect(barrel.HaxUiAdminStyles).to.not.include(sheet);
    });
  });

  it("HaxUiAdminIcons stays a frozen map of hax:admin-* names", () => {
    const icons = iconsModule.HaxUiAdminIcons;
    expect(Object.isFrozen(icons)).to.equal(true);
    expect(icons.close).to.equal("hax:admin-close");
    Object.keys(icons).forEach((key) => {
      expect(icons[key], key).to.match(/^hax:admin-/);
    });
  });
});
