/**
 * web-test-runner command "ax-focused": what assistive technology sees for
 * the element that holds focus, read from Chromium's accessibility tree over
 * the DevTools protocol (Playwright's page.accessibility was removed).
 *
 *   import { executeServerCommand } from "@web/test-runner-commands";
 *   const ax = await executeServerCommand("ax-focused");
 *   // { role, name, expanded, activeDescendant: { role, name, selected } }
 *
 * Resolves to null outside Playwright Chromium (no DevTools protocol), so a
 * test can skip there.
 */
const valueOf = (node, prop) => {
  const found = (node.properties || []).find((p) => p.name === prop);
  return found ? found.value : undefined;
};

const summary = (node) =>
  node
    ? {
        role: node.role ? node.role.value : null,
        name: node.name ? node.name.value : "",
        expanded: valueOf(node, "expanded")
          ? valueOf(node, "expanded").value
          : undefined,
        selected: valueOf(node, "selected")
          ? valueOf(node, "selected").value
          : undefined,
      }
    : null;

export function axTreePlugin() {
  return {
    name: "ax-tree",
    async executeCommand({ command, session }) {
      if (command !== "ax-focused") return undefined;
      if (
        session.browser.type !== "playwright" ||
        session.browser.name.toLowerCase() !== "chromium"
      ) {
        return null;
      }
      const page = session.browser.getPage(session.id);
      const cdp = await page.context().newCDPSession(page);
      try {
        const { nodes } = await cdp.send("Accessibility.getFullAXTree");
        // the document node also reports focused; take the element
        const focused = nodes.find((node) => {
          const value = valueOf(node, "focused");
          return (
            value &&
            value.value === true &&
            !(node.role && node.role.value === "RootWebArea")
          );
        });
        if (!focused) return { focused: null };
        const active = valueOf(focused, "activedescendant");
        let activeNode = null;
        if (active && active.relatedNodes && active.relatedNodes.length) {
          const id = active.relatedNodes[0].backendDOMNodeId;
          activeNode = nodes.find((node) => node.backendDOMNodeId === id);
        }
        return {
          ...summary(focused),
          activeDescendant: summary(activeNode),
        };
      } finally {
        await cdp.detach();
      }
    },
  };
}
