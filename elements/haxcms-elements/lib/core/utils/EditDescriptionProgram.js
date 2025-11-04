/**
 * Edit Description Program for Merlin - Provides description editing capability for HAXcms pages
 * This program allows editing the description on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

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
          title: "No active page found",
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
          ? `Save description: ${input.substring(0, 50)}${input.length > 50 ? "..." : ""}`
          : "Remove description",
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
