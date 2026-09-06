import docsUrl from '../util/docsUrl.js';
import reactComponents from '../util/reactComponents.js';
import reactImports from '../util/reactImports.js';

const API_REPLACEMENTS = new Map([
  ['react', new Map([['createFactory', ['createFactory', 'JSX']]])],
  [
    'react-dom',
    new Map([
      ['findDOMNode', ['findDOMNode', 'a ref']],
      ['hydrate', ['ReactDOM.hydrate', 'hydrateRoot']],
      ['render', ['ReactDOM.render', 'createRoot']],
      ['unmountComponentAtNode', ['ReactDOM.unmountComponentAtNode', 'root.unmount']],
      ['useFormState', ['useFormState', 'useActionState', 'deprecated']],
    ]),
  ],
  [
    'react-dom/server',
    new Map([
      ['renderToNodeStream', ['renderToNodeStream', 'renderToPipeableStream']],
      ['renderToStaticNodeStream', ['renderToStaticNodeStream', 'renderToPipeableStream']],
    ]),
  ],
]);

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow removed React APIs and deprecated useFormState',
      recommended: true,
      url: docsUrl('no-deprecated'),
    },
    messages: {
      removedContext: '{{name}} is removed in React 19. Pass data with props or use createContext instead.',
      removed: '{{api}} is removed in React 19. Use {{replacement}} instead.',
      deprecated: '{{api}} is deprecated in React 19. Use {{replacement}} instead.',
    },
    schema: [],
  },

  create(context) {
    function reportReplacement(node, entry) {
      const [api, replacement, messageId = 'removed'] = entry;
      context.report({
        data: { api, replacement },
        messageId,
        node,
      });
    }

    function checkIdentifierCall(node) {
      const replacement = [...API_REPLACEMENTS.entries()]
        .map(([moduleName, exports]) => {
          for (const [exportName, value] of exports) {
            if (reactImports.isNamedImport(context, node.callee, moduleName, exportName)) {
              return value;
            }
          }
          return null;
        })
        .find(Boolean);

      if (replacement) {
        reportReplacement(node.callee, replacement);
      }
    }

    function checkMemberCall(node) {
      const member = node.callee;
      if (member.computed || member.object.type !== 'Identifier' || member.property.type !== 'Identifier') {
        return;
      }

      for (const [moduleName, exports] of API_REPLACEMENTS) {
        if (!reactImports.isModuleObject(context, member.object, moduleName)) {
          continue;
        }
        const replacement = exports.get(member.property.name);
        if (replacement) {
          reportReplacement(member.property, replacement);
        }
        return;
      }
    }

    function checkClassProperty(node) {
      if (
        !node.static ||
        node.key.type !== 'Identifier' ||
        !['childContextTypes', 'contextTypes'].includes(node.key.name) ||
        !reactComponents.isReactComponentClass(context, node.parent.parent)
      ) {
        return;
      }

      context.report({
        data: { name: node.key.name },
        messageId: 'removedContext',
        node: node.key,
      });
    }

    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier') {
          checkIdentifierCall(node);
        } else if (node.callee.type === 'MemberExpression') {
          checkMemberCall(node);
        }
      },
      PropertyDefinition: checkClassProperty,
    };
  },
};

export default exported;
export { exported as 'module.exports' };
