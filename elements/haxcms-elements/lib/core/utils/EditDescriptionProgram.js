/**
 * Edit Description Program for Merlin - Provides description editing capability for HAXcms pages
 * This program allows editing the description on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

// English defaults for the labels this program shows; translations come from
// the context element's this.t (haxcms-site-editor-ui, haxcms namespace)
const EDIT_DESCRIPTION_T = {
  noActivePageFound: "No active page found",
  saveDescriptionValue: "Save description: {description}",
  clearDescription: "Clear description",
};
const _t = (context, key) =>
  context && context.t && context.t[key] ? context.t[key] : EDIT_DESCRIPTION_T[key];

/**
 * Creates the edit description program for use in SuperDaemon
 * @param {Object} context - The context object (typically the haxcms-site-editor-ui instance)
 * @returns {Function} The program function that returns description editing options
 */
export const createEditDescriptionProgram = (context) => {
  return async (input) => {
    const results = [];
    const activeItem = toJS(store.activeItem);

    if (!activeItem || !activeItem.id) {
      return [
        {
          title: _t(context, "noActivePageFound"),
          icon: "icons:warning",
          tags: ["error"],
          value: { disabled: true },
          eventName: "disabled",
          path: "CMS/edit/description/error",
        },
      ];
    }

    // Save button first - most common action
    results.push({
      title:
        input && input.trim() !== ""
          ? _t(context, "saveDescriptionValue").replace(
              "{description}",
              () => (`${input.substring(0, 50)}${input.length > 50 ? "..." : ""}`),
            )
          : _t(context, "clearDescription"),
      icon: "icons:check",
      tags: ["confirm", "save"],
      value: {
        target: globalThis,
        method: "dispatchEvent",
        args: [
          new CustomEvent("haxcms-save-node-details", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              id: activeItem.id,
              idOrSlug: activeItem.id,
              operation: "setDescription",
              description: input || "",
            },
          }),
        ],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/edit/description/confirm",
    });

    return results;
  };
};
