/**
 * Edit Tags Program for Merlin - Provides tag editing capability for HAXcms pages
 * This program allows editing tags on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

/**
 * Creates the edit tags program for use in SuperDaemon
 * @param {Object} context - The context object (typically the haxcms-site-editor-ui instance)
 * @returns {Function} The program function that returns tag editing options
 */
export const createEditTagsProgram = (context) => {
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
          path: "CMS/edit/tags/error",
        },
      ];
    }

    // Save button first - most common action
    results.push({
      title:
        input && input.trim() !== ""
          ? `Save tags: ${input}`
          : "Remove all tags",
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
              operation: "setTags",
              tags: input || "",
            },
          }),
        ],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/edit/tags/confirm",
    });

    return results;
  };
};
