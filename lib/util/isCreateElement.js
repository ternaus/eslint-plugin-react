import isDestructuredFromPragmaImport from './isDestructuredFromPragmaImport.js';
import pragmaUtil from './pragma.js';

/**
 * Checks if the node is a createElement call
 * @param {Context} context - The AST node being checked.
 * @param {ASTNode} node - The AST node being checked.
 * @returns {boolean} - True if node is a createElement call object literal, False if not.
 */
const exported = function isCreateElement(context, node) {
  if (!node.callee) {
    return false;
  }

  if (
    node.callee.type === 'MemberExpression' &&
    node.callee.property.name === 'createElement' &&
    node.callee.object &&
    node.callee.object.name === pragmaUtil.getFromContext(context)
  ) {
    return true;
  }

  if (node.callee.name === 'createElement' && isDestructuredFromPragmaImport(context, node, 'createElement')) {
    return true;
  }

  return false;
};

export default exported;
export { exported as 'module.exports' };
