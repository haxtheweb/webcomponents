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
 * literal with no expressions), or a call to a function whose name starts
 * with "sanitize" (sanitizeHTMLString in @haxtheweb/utils/lib/sanitize.js),
 * or a ternary / || / ?? whose every branch is one of those.
 *
 * Existing hits are recorded in eslint-suppressions.json, so only new code is
 * reported. Fixing one: `npx eslint elements --prune-suppressions`.
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

function isSafe(node) {
  if (!node) {
    return true;
  }
  switch (node.type) {
    case "Literal":
      return true;
    case "TemplateLiteral":
      return node.expressions.length === 0;
    case "CallExpression":
      return /^sanitize/.test(calleeName(node.callee));
    case "ConditionalExpression":
      return isSafe(node.consequent) && isSafe(node.alternate);
    case "LogicalExpression":
      return isSafe(node.left) && isSafe(node.right);
    case "AwaitExpression":
      return isSafe(node.argument);
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
        if (isSinkMember(node.left) && !isSafe(node.right)) {
          report(node.right, node.left.property.name);
        }
      },
      CallExpression(node) {
        const name = calleeName(node.callee);
        if (name === "insertAdjacentHTML") {
          if (!isSafe(node.arguments[1])) {
            report(node, name);
          }
        } else if (name === "createContextualFragment") {
          if (!isSafe(node.arguments[0])) {
            report(node, name);
          }
        } else if (
          (name === "write" || name === "writeln") &&
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "document"
        ) {
          if (!isSafe(node.arguments[0])) {
            report(node, "document." + name);
          }
        } else if (
          node.callee.type === "Identifier" &&
          DIRECTIVES.indexOf(name) !== -1
        ) {
          if (!isSafe(node.arguments[0])) {
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
          if (match && !isSafe(quasi.expressions[i])) {
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
