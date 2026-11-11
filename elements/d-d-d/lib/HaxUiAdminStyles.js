/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * HAX UI: DDD's layer for admin chrome, the screens a signed-in editor uses
 * to change settings or data (site admin, system admin, outline-designer,
 * revisions, reports, Merlin). Content a visitor sees stays on DDD's
 * content scale. See design-system/source/hax-ui-admin.md for when to
 * apply it, the tokens and the patterns.
 *
 * This file is the one entry point for the layer. Its pieces live next to
 * it, split by what elements import, so a page loads only what it uses:
 * HaxUiAdminTokens.js (Tokens, Scheme, Primitives), HaxUiAdminIcons.js,
 * HaxUiAdminControls.js (Controls, SimpleFields, SidePanelFields), HaxUiAdminShell.js and
 * HaxUiDialogFrame.js (the one modal frame).
 * This file re-exports all of them plus the combined HaxUiAdminStyles, so
 * existing imports keep working. The layer lives in d-d-d so every
 * admin element can import it, including packages hax-body depends on
 * (super-daemon, simple-modal, rpg-character, simple-fields).
 * @haxtheweb/hax-body/lib/hax-ui-styles.js re-exports it for existing
 * imports.
 */
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
  HaxUiAdminScheme,
} from "./HaxUiAdminTokens.js";
import {
  HaxUiAdminControls,
  HaxUiAdminSimpleFields,
  HaxUiAdminSidePanelFields,
} from "./HaxUiAdminControls.js";

export {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
  HaxUiAdminScheme,
  HaxUiAdminControls,
  HaxUiAdminSimpleFields,
  HaxUiAdminSidePanelFields,
};
export {
  HAX_UI_DARK_CHROME,
  HaxUiDarkChromeDeclarations,
} from "./HaxUiAdminTokens.js";
export { HaxUiAdminIcons } from "./HaxUiAdminIcons.js";
export { HaxUiAdminShell } from "./HaxUiAdminShell.js";
export {
  HaxUiDialogTitlebar,
  HaxUiDialogSurface,
  HaxUiDialogFrame,
  HaxUiDialogConfirm,
  HaxUiDialogTitlebarStyles,
  haxUiDialogVars,
} from "./HaxUiDialogFrame.js";

/**
 * Everything an admin surface needs, in order: tokens, scheme, primitives,
 * controls and the simple-fields field style.
 */
export const HaxUiAdminStyles = [
  ...HaxUiAdminTokens,
  ...HaxUiAdminScheme,
  ...HaxUiAdminPrimitives,
  ...HaxUiAdminControls,
  ...HaxUiAdminSimpleFields,
];
