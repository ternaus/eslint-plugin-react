/**
 * @fileoverview Common propTypes sorting functionality.
 */

import astUtil from './ast.js';
import eslintUtil from './eslint.js';

const getSourceCode = eslintUtil.getSourceCode;
const getText = eslintUtil.getText;

/**
 * Returns the value name of a node.
 *
 * @param {ASTNode} node the node to check.
 * @returns {string} The name of the node.
 */
function getValueName(node) {
  return node.type === 'Property' && node.value.property && node.value.property.name;
}

/**
 * Checks if the prop is required or not.
 *
 * @param {ASTNode} node the prop to check.
 * @returns {boolean} true if the prop is required.
 */
function isRequiredProp(node) {
  return getValueName(node) === 'isRequired';
}

/**
 * Checks if the proptype is a callback by checking if it starts with 'on'.
 *
 * @param {string} propName the name of the proptype to check.
 * @returns {boolean} true if the proptype is a callback.
 */
function isCallbackPropName(propName) {
  return /^on[A-Z]/.test(propName);
}

/**
 * Checks if the prop is PropTypes.shape.
 *
 * @param {ASTNode} node the prop to check.
 * @returns {boolean} true if the prop is PropTypes.shape.
 */
function isShapeProp(node) {
  return !!(node && node.callee && node.callee.property && node.callee.property.name === 'shape');
}

/**
 * Returns the properties of a PropTypes.shape.
 *
 * @param {ASTNode} node the prop to check.
 * @returns {Array} the properties of the PropTypes.shape node.
 */
function getShapeProperties(node) {
  return node.arguments && node.arguments[0] && node.arguments[0].properties;
}

/**
 * Compares two elements.
 *
 * @param {ASTNode} a the first element to compare.
 * @param {ASTNode} b the second element to compare.
 * @param {Context} context The context of the two nodes.
 * @param {boolean=} ignoreCase whether or not to ignore case when comparing the two elements.
 * @param {boolean=} requiredFirst whether or not to sort required elements first.
 * @param {boolean=} callbacksLast whether or not to sort callbacks after everything else.
 * @param {boolean=} noSortAlphabetically whether or not to disable alphabetical sorting of the elements.
 * @returns {number} the sort order of the two elements.
 */
function sorter(a, b, context, ignoreCase, requiredFirst, callbacksLast, noSortAlphabetically) {
  const aKey = String(astUtil.getKeyValue(context, a));
  const bKey = String(astUtil.getKeyValue(context, b));

  if (requiredFirst) {
    if (isRequiredProp(a) && !isRequiredProp(b)) {
      return -1;
    }
    if (!isRequiredProp(a) && isRequiredProp(b)) {
      return 1;
    }
  }

  if (callbacksLast) {
    if (isCallbackPropName(aKey) && !isCallbackPropName(bKey)) {
      return 1;
    }
    if (!isCallbackPropName(aKey) && isCallbackPropName(bKey)) {
      return -1;
    }
  }

  if (!noSortAlphabetically) {
    if (ignoreCase) {
      return aKey.localeCompare(bKey);
    }

    if (aKey < bKey) {
      return -1;
    }
    if (aKey > bKey) {
      return 1;
    }
  }
  return 0;
}

const commentnodeMap = new WeakMap(); // all nodes reference WeakMap for start and end range

function getTrailingComments(sourceCode, node) {
  const comments = sourceCode.getCommentsAfter(node);
  const nextToken = sourceCode.getTokenAfter(node);

  if (nextToken && [',', ';', '}'].includes(nextToken.value)) {
    return comments.filter((comment) => comment.range[1] <= nextToken.range[0]);
  }

  return comments.filter((comment) => comment.loc.start.line === node.loc.end.line);
}

function hasAmbiguousTypeCommentAttachment(sourceCode, declarations) {
  if (typeof sourceCode.getAllComments !== 'function') {
    return false;
  }

  const comments = sourceCode.getAllComments();
  for (let index = 0; index < declarations.length - 1; index++) {
    const previous = declarations[index];
    const next = declarations[index + 1];
    if (previous.type !== 'TSPropertySignature' || next.type !== 'TSPropertySignature') {
      continue;
    }

    const commentsBetweenDeclarations = comments.filter(
      (comment) => comment.range[0] >= previous.range[1] && comment.range[1] <= next.range[0],
    );
    for (const comment of commentsBetweenDeclarations) {
      const isTrailingComment = comment.loc.start.line === previous.loc.end.line;
      const linesAfterComment = sourceCode.lines.slice(comment.loc.end.line, next.loc.start.line - 1);
      const hasBlankLineBeforeNextDeclaration = linesAfterComment.some((line) => line.trim() === '');
      if (!isTrailingComment && hasBlankLineBeforeNextDeclaration) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Fixes sort order of prop types.
 *
 * @param {Context} context the second element to compare.
 * @param {Fixer} fixer the first element to compare.
 * @param {Array} declarations The context of the two nodes.
 * @param {boolean=} ignoreCase whether or not to ignore case when comparing the two elements.
 * @param {boolean=} requiredFirst whether or not to sort required elements first.
 * @param {boolean=} callbacksLast whether or not to sort callbacks after everything else.
 * @param {boolean=} noSortAlphabetically whether or not to disable alphabetical sorting of the elements.
 * @param {boolean=} sortShapeProp whether or not to sort propTypes defined in PropTypes.shape.
 * @param {boolean=} checkTypes whether or not sorting of prop type definitions are checked.
 * @returns {Object|*|{range, text}} the sort order of the two elements.
 */
function fixPropTypesSort(
  context,
  fixer,
  declarations,
  ignoreCase,
  requiredFirst,
  callbacksLast,
  noSortAlphabetically,
  sortShapeProp,
  checkTypes,
) {
  const sourceCode = getSourceCode(context);
  if (hasAmbiguousTypeCommentAttachment(sourceCode, declarations)) {
    return null;
  }

  function sortInSource(allNodes, source) {
    const originalSource = source;
    const trailingCommentRanges = new Set();
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      let commentAfter = [];
      let commentBefore = [];
      let newStart = 0;
      let newEnd = 0;
      try {
        commentBefore = sourceCode
          .getCommentsBefore(node)
          .filter((comment) => !trailingCommentRanges.has(comment.range.join(':')));
        commentAfter = getTrailingComments(sourceCode, node);
        commentAfter.forEach((comment) => trailingCommentRanges.add(comment.range.join(':')));
      } catch {
        /**/
      }

      if (commentAfter.length === 0 || commentBefore.length === 0) {
        newStart = node.range[0];
        newEnd = node.range[1];
      }

      const firstCommentBefore = commentBefore[0];
      if (commentBefore.length >= 1) {
        newStart = firstCommentBefore.range[0];
      }
      const lastCommentAfter = commentAfter[commentAfter.length - 1];
      if (commentAfter.length >= 1) {
        newEnd = lastCommentAfter.range[1];
      }
      commentnodeMap.set(node, { start: newStart, end: newEnd, hasComment: true });
    }
    const nodeGroups = allNodes.reduce(
      (acc, curr) => {
        if (curr.type === 'SpreadElement') {
          acc.push([]);
        } else {
          acc[acc.length - 1].push(curr);
        }
        return acc;
      },
      [[]],
    );

    nodeGroups.forEach((nodes) => {
      const sortedAttributes = nodes.toSorted((a, b) =>
        sorter(a, b, context, ignoreCase, requiredFirst, callbacksLast, noSortAlphabetically),
      );

      const sourceCodeText = getText(context);
      let separator = '';
      source = nodes.reduceRight((acc, attr, index) => {
        const sortedAttr = sortedAttributes[index];
        const commentNode = commentnodeMap.get(sortedAttr);
        let sortedAttrText = sourceCodeText.slice(commentNode.start, commentNode.end);
        let sortedAttrTextStart = commentNode.start;
        if (sortShapeProp && isShapeProp(sortedAttr.value)) {
          const shape = getShapeProperties(sortedAttr.value);
          if (shape) {
            const attrSource = sortInSource(shape, originalSource);
            sortedAttrText = attrSource.slice(sortedAttr.range[0], sortedAttr.range[1]);
            sortedAttrTextStart = sortedAttr.range[0];
          }
        }
        const trailingComment = getTrailingComments(sourceCode, sortedAttr)[0];
        const separatorIndex = trailingComment ? trailingComment.range[0] - sortedAttrTextStart : sortedAttrText.length;
        const sortedAttrTextLastChar = sortedAttrText.slice(0, separatorIndex).trim().slice(-1);
        if (!separator && [';', ','].includes(sortedAttrTextLastChar)) {
          separator = sortedAttrTextLastChar;
        }
        const hasSeparator = sortedAttrText.slice(0, separatorIndex).trim().endsWith(separator);
        const needsSeparator = checkTypes && separator && !hasSeparator;
        const sortedAttrTextVal = needsSeparator
          ? `${sortedAttrText.slice(0, separatorIndex)}${separator}${sortedAttrText.slice(separatorIndex)}`
          : sortedAttrText;
        return `${acc.slice(0, commentnodeMap.get(attr).start)}${sortedAttrTextVal}${acc.slice(commentnodeMap.get(attr).end)}`;
      }, source);
    });
    return source;
  }

  const source = sortInSource(declarations, getText(context));

  const rangeStart = commentnodeMap.get(declarations[0]).start;
  const rangeEnd = commentnodeMap.get(declarations[declarations.length - 1]).end;
  return fixer.replaceTextRange([rangeStart, rangeEnd], source.slice(rangeStart, rangeEnd));
}

const exported = {
  fixPropTypesSort,
  isCallbackPropName,
  isRequiredProp,
  isShapeProp,
};

export default exported;
export { exported as 'module.exports' };
