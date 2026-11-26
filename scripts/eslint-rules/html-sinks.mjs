/**
 * ESLint rule for markup sinks: places where a string is parsed as HTML.
 *
 *   haxtheweb-html/unsanitized-html-sink
 *     A value that is not a fixed string reaches an HTML sink without passing
 *     through a sanitize function first. Page content can carry any element
 *     with any attribute, so an element's own properties, attributes, data
 *     and fetched text are never trusted markup. Sinks checked:
 *       el.innerHTML = x / el.outerHTML = x (also +=)
 *       el.insertAdjacentHTML(position, x)
 *       range.createContextualFragment(x)
 *       document.write(x) / document.writeln(x)
 *       unsafeHTML(x) / unsafeSVG(x) (lit directives)
 *       .innerHTML / .outerHTML property bindings in lit html`` templates
 *
 * A value is accepted when it is a fixed string (a literal, or a template
 * literal whose every expression is itself accepted), or a call to a function whose name starts
 * with "sanitize" (sanitizeHTMLString in @haxtheweb/utils/lib/sanitize.js),
 * or a ternary / || / ?? whose every branch is one of those, or a local
 * variable (not a parameter) whose every assignment is one of those.
 *
 * A sink that is safe for a reason the rule can't see (an inert <template>,
 * the element's own static template) carries an inline exemption that says
 * why: `// eslint-disable-next-line haxtheweb-html/unsanitized-html-sink --
 * <reason>`. There is no suppressions-file baseline for this rule, so every
 * new sink in any file is reported.
 */

const SINK_PROPERTIES = ["innerHTML", "outerHTML"];
const DIRECTIVES = ["unsafeHTML", "unsafeSVG"];

function calleeName(callee) {
  if (!callee) {
    return "";
  }
  if (callee.type === "Identifier") {
    return callee.name;
  }
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    return callee.property.name;
  }
  return "";
}

// the variable a name refers to, from the innermost scope out
function findVariable(scope, name) {
  for (let current = scope; current; current = current.upper) {
    const variable = current.set.get(name);
    if (variable) {
      return variable;
    }
  }
  return null;
}

// a local variable is safe when it is declared in this file (not a
// parameter, import or global) and every value written to it is safe.
// `seen` holds the variables being checked, so a cycle counts as unsafe.
function isSafeVariable(node, context, seen) {
  const variable = findVariable(context.sourceCode.getScope(node), node.name);
  if (
    !variable ||
    seen.has(variable) ||
    variable.defs.length === 0 ||
    variable.defs.some((def) => def.type !== "Variable")
  ) {
    return false;
  }
  const writes = variable.references.filter((ref) => ref.isWrite());
  if (writes.length === 0) {
    return false;
  }
  seen.add(variable);
  const safe = writes.every((ref) => {
    const parent = ref.identifier.parent;
    // `x += y` keeps the old value too; a for-in/of loop writes items
    if (
      (parent.type === "AssignmentExpression" && parent.operator !== "=") ||
      parent.type === "ForInStatement" ||
      parent.type === "ForOfStatement"
    ) {
      return false;
    }
    return Boolean(ref.writeExpr) && isSafe(ref.writeExpr, context, seen);
  });
  seen.delete(variable);
  return safe;
}

function isSafe(node, context, seen = new Set()) {
  if (!node) {
    return true;
  }
  switch (node.type) {
    case "Identifier":
      return context ? isSafeVariable(node, context, seen) : false;
    case "Literal":
      return true;
    case "TemplateLiteral":
      return node.expressions.every((expression) =>
        isSafe(expression, context, seen),
      );
    case "CallExpression":
      return /^sanitize/.test(calleeName(node.callee));
    case "ConditionalExpression":
      return (
        isSafe(node.consequent, context, seen) &&
        isSafe(node.alternate, context, seen)
      );
    case "LogicalExpression":
      return isSafe(node.left, context, seen) && isSafe(node.right, context, seen);
    case "AwaitExpression":
      return isSafe(node.argument, context, seen);
    default:
      return false;
  }
}

function isSinkMember(node) {
  return (
    node &&
    node.type === "MemberExpression" &&
    !node.computed &&
    node.property.type === "Identifier" &&
    SINK_PROPERTIES.indexOf(node.property.name) !== -1
  );
}

// the lit tag: html`` or a member ending in .html (e.g. lit.html``)
function isHtmlTag(tag) {
  return calleeName(tag) === "html";
}

const unsanitizedHtmlSink = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require values written as HTML to be fixed strings or sanitized first",
    },
    schema: [],
    messages: {
      sink: "{{sink}} receives a value that is not a fixed string. Sanitize it first (sanitizeHTMLString from @haxtheweb/utils/lib/sanitize.js), or write text with textContent.",
    },
  },
  create(context) {
    function report(node, sink) {
      context.report({ node: node, messageId: "sink", data: { sink: sink } });
    }
    return {
      AssignmentExpression(node) {
        if (isSinkMember(node.left) && !isSafe(node.right, context)) {
          report(node.right, node.left.property.name);
        }
      },
      CallExpression(node) {
        const name = calleeName(node.callee);
        if (name === "insertAdjacentHTML") {
          if (!isSafe(node.arguments[1], context)) {
            report(node, name);
          }
        } else if (name === "createContextualFragment") {
          if (!isSafe(node.arguments[0], context)) {
            report(node, name);
          }
        } else if (
          (name === "write" || name === "writeln") &&
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "document"
        ) {
          if (!isSafe(node.arguments[0], context)) {
            report(node, "document." + name);
          }
        } else if (
          node.callee.type === "Identifier" &&
          DIRECTIVES.indexOf(name) !== -1
        ) {
          if (!isSafe(node.arguments[0], context)) {
            report(node, name);
          }
        }
      },
      TaggedTemplateExpression(node) {
        if (!isHtmlTag(node.tag)) {
          return;
        }
        const quasi = node.quasi;
        for (let i = 0; i < quasi.expressions.length; i++) {
          const before = quasi.quasis[i].value.raw;
          const match = /\.(innerHTML|outerHTML)\s*=\s*["']?$/.exec(before);
          if (match && !isSafe(quasi.expressions[i], context)) {
            report(quasi.expressions[i], "." + match[1] + " binding");
          }
        }
      },
    };
  },
};

export default {
  meta: { name: "haxtheweb-html" },
  rules: {
    "unsanitized-html-sink": unsanitizedHtmlSink,
  },
};
