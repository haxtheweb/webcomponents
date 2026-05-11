/**
 * Share Page Program for Merlin
 * Returns a single result for sharing the currently active page link.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

export const createSharePageProgram = (context) => {
  return async (input, values) => {
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
          path: "CMS/action/share/page/error",
        },
      ];
    }

    const shareLink = context.getCurrentPageShareLink(activeItem);
    const pageTitle = activeItem.title || "current page";
    const normalizedInput =
      input && input.trim() !== "" ? input.toLowerCase().trim() : "";

    if (
      normalizedInput === "" ||
      pageTitle.toLowerCase().includes(normalizedInput) ||
      shareLink.toLowerCase().includes(normalizedInput) ||
      "share link copy url current page".includes(normalizedInput)
    ) {
      results.push({
        title: `Copy link to ${pageTitle}`,
        icon: "editor:insert-link",
        tags: ["CMS", "share", "link", "copy", "url", "page"],
        more: shareLink,
        value: {
          target: context,
          method: "copyCurrentPageShareLink",
          args: [shareLink, pageTitle],
        },
        eventName: "super-daemon-element-method",
        path: "CMS/action/share/page/current",
        context: ["CMS", "HAX"],
      });
    }

    return results;
  };
};
