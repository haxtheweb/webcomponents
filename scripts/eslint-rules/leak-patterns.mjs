/**
 * ESLint rules for the four code patterns behind the front-end memory leaks
 * in haxtheweb/issues#3237 (haxtheweb/issues#3246). Each one keeps a removed
 * element reachable, so it is never garbage collected and keeps growing over
 * a long editing session.
 *
 *   haxtheweb-leaks/autorun-in-constructor
 *     autorun()/reaction() called from a constructor. The element may never
 *     connect, and after a disconnect + reconnect the constructor does not
 *     run again, so the reaction can't be both disposed and recreated.
 *     Create it in connectedCallback, dispose it in disconnectedCallback.
 *   haxtheweb-leaks/disposer-without-disconnect
 *     A class that fills this.__disposer but has no disconnectedCallback
 *     that runs it.
 *   haxtheweb-leaks/responsive-element-unregister
 *     A class that registers with responsive-utility (the
 *     "responsive-element" event, or registerResponsiveElement()) but has no
 *     disconnectedCallback that unregisters (unregisterResponsiveElement()).
 *     responsive-utility keeps a ResizeObserver on every registered element.
 *   haxtheweb-leaks/live-document-parse
 *     Markup parsed in the live document only to be read back: custom
 *     elements in it upgrade, register globally, and stay alive. Parse in
 *     an inert document (document.implementation.createHTMLDocument("")) or
 *     a <template> instead.
 *
 * Existing hits are recorded in eslint-suppressions.json, so only new code is
 * reported. Fixing one: `npx eslint elements --prune-suppressions`.
 *
 * These catch the patterns while the code is being written; `yarn test:leaks`
 * (scripts/leak-check.mjs) measures what actually leaks at runtime.
 */

const DOCS = "https://github.com/haxtheweb/issues/issues/3246";

function isNamed(node, names) {
  if (!node) {
    return false;
  }
  if (node.type === "Identifier") {
    return names.indexOf(node.name) !== -1;
  }
  if (node.type === "MemberExpression" && !node.computed) {
    return names.indexOf(node.property.name) !== -1;
  }
  return false;
}

function getAncestors(context, node) {
  const source = context.sourceCode || context.getSourceCode();
  return source.getAncestors
    ? source.getAncestors(node)
    : context.getAncestors();
}

// method definitions of a class body by name
function classMethod(classBody, name) {
  for (let i = 0; i < classBody.body.length; i++) {
    const member = classBody.body[i];
    if (
      member.type === "MethodDefinition" &&
      member.key &&
      member.key.type === "Identifier" &&
      member.key.name === name
    ) {
      return member;
    }
  }
  return null;
}

// does any node under `root` satisfy `test`? (shallow AST walk, no scope)
function contains(root, test) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node.type !== "string") {
      continue;
    }
    if (test(node)) {
      return true;
    }
    for (const key of Object.keys(node)) {
      if (key === "parent") {
        continue;
      }
      const value = node[key];
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          stack.push(value[i]);
        }
      } else if (value && typeof value.type === "string") {
        stack.push(value);
      }
    }
  }
  return false;
}

function isThisMember(node, name) {
  return (
    node &&
    node.type === "MemberExpression" &&
    node.object.type === "ThisExpression" &&
    !node.computed &&
    node.property.name === name
  );
}

const autorunInConstructor = {
  meta: {
    type: "problem",
    docs: {
      description: "MobX autorun/reaction must not be created in a constructor",
      url: DOCS,
    },
    messages: {
      constructor:
        "{{name}}() in a constructor leaks when the element never connects and can't be recreated after a reconnect. Create it in connectedCallback and dispose it in disconnectedCallback.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (!isNamed(node.callee, ["autorun", "reaction"])) {
          return;
        }
        const ancestors = getAncestors(context, node);
        for (let i = ancestors.length - 1; i >= 0; i--) {
          const a = ancestors[i];
          if (a.type === "MethodDefinition") {
            if (a.kind === "constructor") {
              context.report({
                node: node,
                messageId: "constructor",
                data: {
                  name:
                    node.callee.type === "Identifier"
                      ? node.callee.name
                      : node.callee.property.name,
                },
              });
            }
            return;
          }
        }
      },
    };
  },
};

const disposerWithoutDisconnect = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A class that fills this.__disposer must dispose it in disconnectedCallback",
      url: DOCS,
    },
    messages: {
      missing:
        "{{name}} fills this.__disposer but no disconnectedCallback disposes it, so its reactions outlive the element.",
    },
    schema: [],
  },
  create(context) {
    return {
      ClassBody(body) {
        const fills = contains(body, function (n) {
          // this.__disposer.push(...) or this.__disposer = [...]
          if (
            n.type === "CallExpression" &&
            n.callee.type === "MemberExpression" &&
            !n.callee.computed &&
            n.callee.property.name === "push" &&
            isThisMember(n.callee.object, "__disposer")
          ) {
            return true;
          }
          return false;
        });
        if (!fills) {
          return;
        }
        const disconnected = classMethod(body, "disconnectedCallback");
        const disposes =
          disconnected &&
          contains(disconnected, function (n) {
            return isThisMember(n, "__disposer");
          });
        if (!disposes) {
          const owner = body.parent;
          context.report({
            node: owner.id || owner,
            messageId: "missing",
            data: { name: owner.id ? owner.id.name : "this class" },
          });
        }
      },
    };
  },
};

const responsiveElementUnregister = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Elements registered with responsive-utility must unregister on disconnect",
      url: DOCS,
    },
    messages: {
      missing:
        "{{name}} registers with responsive-utility but never unregisters on disconnect; its ResizeObserver keeps the removed element alive. Call unregisterResponsiveElement() in disconnectedCallback.",
    },
    schema: [],
  },
  create(context) {
    function registers(node) {
      if (
        node.type === "NewExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "CustomEvent" &&
        node.arguments.length &&
        node.arguments[0].type === "Literal" &&
        node.arguments[0].value === "responsive-element"
      ) {
        return true;
      }
      return (
        node.type === "CallExpression" &&
        isNamed(node.callee, ["registerResponsiveElement"])
      );
    }
    return {
      ClassBody(body) {
        if (!contains(body, registers)) {
          return;
        }
        const disconnected = classMethod(body, "disconnectedCallback");
        const unregisters =
          disconnected &&
          contains(disconnected, function (n) {
            return (
              n.type === "CallExpression" &&
              isNamed(n.callee, ["unregisterResponsiveElement"])
            );
          });
        if (!unregisters) {
          const owner = body.parent;
          context.report({
            node: owner.id || owner,
            messageId: "missing",
            data: { name: owner.id ? owner.id.name : "this class" },
          });
        }
      },
    };
  },
};

// `document` / `globalThis.document` / `window.document`
function isLiveDocument(node) {
  if (!node) {
    return false;
  }
  if (node.type === "Identifier") {
    return node.name === "document";
  }
  return (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.property.name === "document" &&
    node.object.type === "Identifier" &&
    (node.object.name === "globalThis" || node.object.name === "window")
  );
}

// uses of a parsing scratch element that only read markup back out of it
const READ_ONLY_MEMBERS = [
  "innerHTML",
  "outerHTML",
  "textContent",
  "innerText",
  "children",
  "childNodes",
  "firstChild",
  "firstElementChild",
  "lastChild",
  "lastElementChild",
  "querySelector",
  "querySelectorAll",
  "getElementsByTagName",
  "getAttribute",
  "hasAttribute",
  "remove",
];

const liveDocumentParse = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Don't parse markup in the live document just to read it back",
      url: DOCS,
    },
    messages: {
      fragment:
        'createContextualFragment() on a live-document range upgrades every custom element in the markup. Parse in document.implementation.createHTMLDocument("") instead.',
      scratch:
        "'{{name}}' is only used to parse and read markup, but it belongs to the live document, so custom elements in it upgrade and stay registered. Parse in document.implementation.createHTMLDocument(\"\") or a <template> instead.",
    },
    schema: [],
  },
  create(context) {
    const source = context.sourceCode || context.getSourceCode();
    return {
      CallExpression(node) {
        // document.createRange().createContextualFragment(...)
        if (
          node.callee.type === "MemberExpression" &&
          !node.callee.computed &&
          node.callee.property.name === "createContextualFragment" &&
          node.callee.object.type === "CallExpression" &&
          node.callee.object.callee.type === "MemberExpression" &&
          node.callee.object.callee.property.name === "createRange" &&
          isLiveDocument(node.callee.object.callee.object)
        ) {
          context.report({ node: node, messageId: "fragment" });
        }
      },
      VariableDeclarator(node) {
        // const el = document.createElement("div") ... el.innerHTML = x;
        // ... only reads of el afterwards
        const init = node.init;
        if (
          node.id.type !== "Identifier" ||
          !init ||
          init.type !== "CallExpression" ||
          init.callee.type !== "MemberExpression" ||
          init.callee.property.name !== "createElement" ||
          !isLiveDocument(init.callee.object)
        ) {
          return;
        }
        // <template> parses into an inert fragment
        const tagArg = init.arguments[0];
        if (
          tagArg &&
          tagArg.type === "Literal" &&
          String(tagArg.value).toLowerCase() === "template"
        ) {
          return;
        }
        const variable = source.getDeclaredVariables(node).find(function (v) {
          return v.name === node.id.name;
        });
        if (!variable) {
          return;
        }
        let assignsMarkup = false;
        for (let i = 0; i < variable.references.length; i++) {
          const ref = variable.references[i];
          if (ref.init) {
            continue;
          }
          const id = ref.identifier;
          const parent = id.parent;
          // every use must be `el.<member>` with a read-only member, or the
          // markup assignment itself
          if (
            !parent ||
            parent.type !== "MemberExpression" ||
            parent.object !== id ||
            parent.computed
          ) {
            return;
          }
          const member = parent.property.name;
          const isAssignTarget =
            parent.parent &&
            parent.parent.type === "AssignmentExpression" &&
            parent.parent.left === parent;
          if (isAssignTarget) {
            if (member === "innerHTML" || member === "outerHTML") {
              assignsMarkup = true;
              continue;
            }
            return;
          }
          if (READ_ONLY_MEMBERS.indexOf(member) === -1) {
            return;
          }
        }
        if (assignsMarkup) {
          context.report({
            node: node,
            messageId: "scratch",
            data: { name: node.id.name },
          });
        }
      },
    };
  },
};

export default {
  meta: { name: "haxtheweb-leaks" },
  rules: {
    "autorun-in-constructor": autorunInConstructor,
    "disposer-without-disconnect": disposerWithoutDisconnect,
    "responsive-element-unregister": responsiveElementUnregister,
    "live-document-parse": liveDocumentParse,
  },
};
