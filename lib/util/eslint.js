function getSourceCode(context) {
  return context.sourceCode;
}

function getFilename(context) {
  return context.filename;
}

function getAncestors(context, node) {
  return context.sourceCode.getAncestors(node);
}

function getScope(context, node) {
  return context.sourceCode.getScope(node);
}

function markVariableAsUsed(name, node, context) {
  return context.sourceCode.markVariableAsUsed(name, node);
}

function getFirstTokens(context, node, count) {
  return context.sourceCode.getFirstTokens(node, count);
}

function getText(context) {
  return context.sourceCode.getText(...Array.prototype.slice.call(arguments, 1));
}

function isSpaceBetweenTokens(sourceCode, left, right) {
  return /\s/u.test(sourceCode.text.slice(left.range[1], right.range[0]));
}

function getJSDocComment(sourceCode, node) {
  return (
    sourceCode
      .getCommentsBefore(node)
      .findLast((comment) => comment.type === 'Block' && comment.value.startsWith('*')) ?? null
  );
}

const exported = {
  getAncestors,
  getFilename,
  getFirstTokens,
  getJSDocComment,
  getScope,
  getSourceCode,
  getText,
  isSpaceBetweenTokens,
  markVariableAsUsed,
};

export default exported;
export { exported as 'module.exports' };
