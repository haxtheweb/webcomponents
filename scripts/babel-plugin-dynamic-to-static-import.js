export default function(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      ExpressionStatement(path) {
        // find dynamic import expression
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
        }
      }
    }
  };
}
