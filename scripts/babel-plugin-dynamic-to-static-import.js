let counter = 0;

export default function(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      ExpressionStatement(path) {
        // handle `import("module-name")`
        if (
          t.isCallExpression(path.node.expression) &&
          t.isImport(path.node.expression.callee)
        ) {
          // create static import
          const staticImport = t.importDeclaration(
            [],
            t.stringLiteral(path.node.expression.arguments[0].value)
          );
          // prepend to program
          path
            .findParent(path => path.isProgram())
            .node.body.unshift(staticImport);
          // remove dynamic import
          path.remove();
          return;
        }

        // handle `await import("module-name")`
        if (
          t.isAwaitExpression(path.node.expression) &&
          t.isCallExpression(path.node.expression.argument) &&
          t.isImport(path.node.expression.argument.callee)
        ) {
          // create static import
          const staticImport = t.importDeclaration(
            [],
            t.stringLiteral(path.node.expression.argument.arguments[0].value)
          );
          // prepend to program
          path
            .findParent(path => path.isProgram())
            .node.body.unshift(staticImport);
          // remove dynamic import
          path.remove();
        }
      },
      MemberExpression(path) {
        // handle `import("module-name").then()`
        if (
          t.isCallExpression(path.node.object) &&
          t.isImport(path.node.object.callee)
        ) {
          const importIdentifier = `\$\$${counter}`;

          // create static import
          const staticImport = t.importDeclaration(
            [t.importNamespaceSpecifier(t.identifier(importIdentifier))],
            t.stringLiteral(path.node.object.arguments[0].value)
          );
          // prepend to program
          path
            .findParent(path => path.isProgram())
            .node.body.unshift(staticImport);
          // replace `import("module-name").then`
          // with `Promise.resolve($$moduleId).then
          path.replaceWith(
            t.memberExpression(
              t.callExpression(
                t.memberExpression(
                  t.identifier("Promise"),
                  t.identifier("resolve")
                ),
                [t.identifier(importIdentifier)]
              ),
              t.identifier("then")
            )
          );
          counter++;
          return;
        }
      }
    }
  };
}
