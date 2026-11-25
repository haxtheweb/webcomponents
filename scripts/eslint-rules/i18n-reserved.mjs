/**
 * ESLint rule for names I18NMixin keeps on the element
 * (haxtheweb/issues#3414).
 *
 *   haxtheweb-i18n/reserved-t
 *     I18NMixin and the i18n-manager keep an element's English strings in
 *     `this._t` and copy them back into `this.t` when the language returns
 *     to English (elements/i18n-manager/lib/I18NMixin.js). An element that
 *     uses `_t` for anything else overwrites those strings, and its labels go
 *     wrong with no error. Reported, in a class that uses I18NMixin:
 *       a property named _t (static properties / static get properties())
 *       a class field or method named _t
 *       this._t = x, unless x is an object that first spreads this._t
 *         (adding English defaults: this._t = { ...this._t, ...more })
 *
 * A class uses I18NMixin when I18NMixin(...) appears in its extends clause,
 * or when its file imports I18NMixin. Name the value something else (the
 * growth element's time state is _now).
 */

const NAME = "_t";

function keyName(node) {
  if (!node || node.computed) {
    return "";
  }
  if (node.key && node.key.type === "Identifier") {
    return node.key.name;
  }
  if (node.key && node.key.type === "Literal") {
    return String(node.key.value);
  }
  return "";
}

function callsMixin(node) {
  if (!node) {
    return false;
  }
  if (node.type === "CallExpression") {
    if (node.callee.type === "Identifier" && node.callee.name === "I18NMixin") {
      return true;
    }
    return node.arguments.some(callsMixin);
  }
  return false;
}

function isThisT(node) {
  return (
    node &&
    node.type === "MemberExpression" &&
    !node.computed &&
    node.object.type === "ThisExpression" &&
    node.property.type === "Identifier" &&
    node.property.name === NAME
  );
}

// this._t = { ...this._t, ...more }: adding to the English defaults
function mergesDefaults(value) {
  return (
    value &&
    value.type === "ObjectExpression" &&
    value.properties.length > 0 &&
    value.properties[0].type === "SpreadElement" &&
    isThisT(value.properties[0].argument)
  );
}

// the object a static properties declaration lists its properties in
function propertiesObject(member) {
  if (!member.static || keyName(member) !== "properties") {
    return null;
  }
  if (member.type === "PropertyDefinition") {
    return member.value && member.value.type === "ObjectExpression"
      ? member.value
      : null;
  }
  if (member.type === "MethodDefinition" && member.kind === "get") {
    const body = member.value.body && member.value.body.body;
    const ret = (body || []).find((s) => s.type === "ReturnStatement");
    const arg = ret && ret.argument;
    return arg && arg.type === "ObjectExpression" ? arg : null;
  }
  return null;
}

const reservedT = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow _t in an element that uses I18NMixin: the mixin keeps the English strings there",
    },
    schema: [],
    messages: {
      reserved:
        "`_t` is where I18NMixin keeps this element's English strings ({{what}}); using it for anything else breaks this.t. Use another name.",
    },
  },
  create(context) {
    let imported = false;
    const classes = [];
    function inMixinClass() {
      return classes.length > 0 && classes[classes.length - 1];
    }
    function enter(node) {
      classes.push(imported || callsMixin(node.superClass));
      if (!classes[classes.length - 1]) {
        return;
      }
      node.body.body.forEach((member) => {
        if (
          (member.type === "PropertyDefinition" ||
            member.type === "MethodDefinition") &&
          keyName(member) === NAME
        ) {
          context.report({
            node: member,
            messageId: "reserved",
            data: { what: "a class member" },
          });
        }
        const props = propertiesObject(member);
        if (props) {
          props.properties.forEach((p) => {
            if (p.type === "Property" && keyName(p) === NAME) {
              context.report({
                node: p,
                messageId: "reserved",
                data: { what: "a declared property" },
              });
            }
          });
        }
      });
    }
    function leave() {
      classes.pop();
    }
    return {
      ImportDeclaration(node) {
        if (
          node.specifiers.some(
            (s) => s.imported && s.imported.name === "I18NMixin",
          )
        ) {
          imported = true;
        }
      },
      ClassDeclaration: enter,
      ClassExpression: enter,
      "ClassDeclaration:exit": leave,
      "ClassExpression:exit": leave,
      AssignmentExpression(node) {
        if (
          inMixinClass() &&
          isThisT(node.left) &&
          !(node.operator === "=" && mergesDefaults(node.right))
        ) {
          context.report({
            node,
            messageId: "reserved",
            data: { what: "an assignment" },
          });
        }
      },
    };
  },
};

export default {
  meta: { name: "haxtheweb-i18n" },
  rules: {
    "reserved-t": reservedT,
  },
};
