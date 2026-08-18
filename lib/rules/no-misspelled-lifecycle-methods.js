import docsUrl from '../util/docsUrl.js';
import lifecycleMethods from '../util/lifecycleMethods.js';
import reactComponents from '../util/reactComponents.js';

const INSTANCE_METHODS = new Set(lifecycleMethods.instance);
const STATIC_METHODS = new Set(lifecycleMethods.static);
const LIFECYCLE_METHODS = new Map(
  [...INSTANCE_METHODS, ...STATIC_METHODS].map((method) => [method.toLowerCase(), method]),
);
const COMMON_TYPOS = new Map([
  ['componentdidmout', 'componentDidMount'],
  ['componentdidupate', 'componentDidUpdate'],
  ['componentwillrecieveprops', 'componentWillReceiveProps'],
  ['componentwillunmout', 'componentWillUnmount'],
  ['getderivedstatefromprpos', 'getDerivedStateFromProps'],
  ['getsnapshotbeforeupate', 'getSnapshotBeforeUpdate'],
  ['shouldcomponentupate', 'shouldComponentUpdate'],
]);

function getMethodName(node) {
  if (node.computed || node.key.type === 'PrivateIdentifier') {
    return null;
  }
  if (node.key.type === 'Identifier') {
    return node.key.name;
  }
  return node.key.type === 'Literal' && typeof node.key.value === 'string' ? node.key.value : null;
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow misspelled or incorrectly static React lifecycle methods',
      recommended: false,
      url: docsUrl('no-misspelled-lifecycle-methods'),
    },
    messages: {
      instanceMethod: '{{method}} is a React instance lifecycle method and cannot be static.',
      misspelledMethod: 'React lifecycle method {{actual}} is misspelled; use {{expected}}.',
      staticMethod: '{{method}} is a React static lifecycle method and must be static.',
    },
    schema: [],
  },

  create(context) {
    return {
      MethodDefinition(node) {
        if (!reactComponents.isReactComponentClass(context, node.parent.parent)) {
          return;
        }

        const name = getMethodName(node);
        if (!name) {
          return;
        }

        const expected = LIFECYCLE_METHODS.get(name.toLowerCase()) ?? COMMON_TYPOS.get(name.toLowerCase());
        if (expected && expected !== name) {
          context.report({ data: { actual: name, expected }, messageId: 'misspelledMethod', node });
          return;
        }

        if (INSTANCE_METHODS.has(name) && node.static) {
          context.report({ data: { method: name }, messageId: 'instanceMethod', node });
        }
        if (STATIC_METHODS.has(name) && !node.static) {
          context.report({ data: { method: name }, messageId: 'staticMethod', node });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
