/**
 * Share Page Program for Merlin
 * Returns a single result for sharing the currently active page link.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

// English defaults for the labels this program shows; translations come from
// the context element's this.t (haxcms-site-editor-ui, haxcms namespace)
const SHARE_PAGE_T = {
  noActivePageFound: "No active page found",
  currentPageLowercase: "current page",
  copyLinkToPage: "Copy link to {title}",
};
const _t = (context, key) =>
  context && context.t && context.t[key] ? context.t[key] : SHARE_PAGE_T[key];

export const createSharePageProgram = (context) => {
  return async (input, _values) => {
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
          path: "CMS/action/share/page/error",
        },
      ];
    }

    const shareLink = context.getCurrentPageShareLink(activeItem);
    const pageTitle = activeItem.title || _t(context, "currentPageLowercase");
    const normalizedInput =
      input && input.trim() !== "" ? input.toLowerCase().trim() : "";

    if (
      normalizedInput === "" ||
      pageTitle.toLowerCase().includes(normalizedInput) ||
      shareLink.toLowerCase().includes(normalizedInput) ||
      "share link copy url current page".includes(normalizedInput)
    ) {
      results.push({
        title: _t(context, "copyLinkToPage").replace("{title}", () => pageTitle),
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
