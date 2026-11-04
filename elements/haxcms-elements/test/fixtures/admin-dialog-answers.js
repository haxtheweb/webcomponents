// Test helper: answer haxcms-admin-confirm dialogs the way tests used to
// stub globalThis.confirm / globalThis.prompt. Each dialog that opens is
// answered by pressing its own buttons, so the real element runs.
//
//   const restore = answerAdminDialogs({
//     confirm: (message) => true,
//     prompt: (message, value) => "new name", // null cancels
//   });
//   ...
//   restore();
//
// message is the dialog's message, or its field label (then its title) when
// it has none; value is a prompt's starting value.

export function answerAdminDialogs(answers = {}) {
  const answer = async (el) => {
    await el.updateComplete;
    const root = el.shadowRoot;
    if (!root) return;
    const text = el.message || el.label || el.title;
    if (el.mode === "prompt") {
      const reply =
        typeof answers.prompt === "function"
          ? answers.prompt(text, el.value)
          : null;
      if (typeof reply === "string") {
        const input = root.querySelector("input");
        input.value = reply;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        await el.updateComplete;
        root.querySelector(".ok").click();
        return;
      }
      root.querySelector(".cancel").click();
      return;
    }
    const yes =
      typeof answers.confirm === "function" ? answers.confirm(text) : false;
    root.querySelector(yes ? ".ok" : ".cancel").click();
  };
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.tagName === "HAXCMS-ADMIN-CONFIRM") {
          answer(node);
        }
      });
    });
  });
  observer.observe(globalThis.document.body, { childList: true });
  return () => observer.disconnect();
}
