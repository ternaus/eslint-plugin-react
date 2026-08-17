/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Ev Haus
 */

import astUtil from '../util/ast.js';
import Components from '../util/Components.js';
import docsUrl from '../util/docsUrl.js';
import eslintUtil from '../util/eslint.js';
import propsUtil from '../util/props.js';
import propWrapperUtil from '../util/propWrapper.js';
import report from '../util/report.js';

const getText = eslintUtil.getText;

/**
 * Checks if prop is nested
 * @param {Object} prop Property object, single prop type declaration
 * @returns {boolean}
 */
function nestedPropTypes(prop) {
  return prop.type === 'Property' && astUtil.isCallExpression(prop.value);
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  patternMismatch: 'Prop name `{{propName}}` doesn’t match rule `{{pattern}}`',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Enforces consistent naming for boolean props',
      recommended: false,
      url: docsUrl('boolean-prop-naming'),
    },

    messages,

    schema: [
      {
        additionalProperties: false,
        properties: {
          propTypeNames: {
            items: {
              type: 'string',
            },
            minItems: 1,
            type: 'array',
            uniqueItems: true,
          },
          rule: {
            default: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
            minLength: 1,
            type: 'string',
          },
          message: {
            minLength: 1,
            type: 'string',
          },
          validateNested: {
            default: false,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
  },

  create: Components.detect((context, components, utils) => {
    const config = context.options[0] || {};
    const rule = config.rule ? new RegExp(config.rule) : null;
    const propTypeNames = config.propTypeNames || ['bool'];

    // Remembers local Flow and TypeScript object definitions.
    const objectTypeAnnotations = new Map();

    /**
     * Returns the prop key to ensure we handle the following cases:
     * propTypes: {
     *   full: React.PropTypes.bool,
     *   short: PropTypes.bool,
     *   direct: bool,
     *   required: PropTypes.bool.isRequired
     * }
     * @param {Object} node The node we're getting the name of
     * @returns {string | null}
     */
    function getPropKey(node) {
      // Spread properties do not declare a prop key.
      if (node.type === 'SpreadElement') {
        return null;
      }
      if (node.value && node.value.property) {
        const name = node.value.property.name;
        if (name === 'isRequired') {
          if (node.value.object && node.value.object.property) {
            return node.value.object.property.name;
          }
          return null;
        }
        return name;
      }
      if (node.value && node.value.type === 'Identifier') {
        return node.value.name;
      }
      return null;
    }

    /**
     * Returns the name of the given node (prop)
     * @param {Object} node The node we're getting the name of
     * @returns {string | null}
     */
    function getPropName(node) {
      if (node.key?.name) {
        return node.key.name;
      }
      if (typeof node.key?.value === 'string') {
        return node.key.value;
      }
      if (node.type !== 'ObjectTypeProperty') {
        return null;
      }

      const propertyName = getText(context, node).split(':', 1)[0].trim();
      return /^[A-Za-z_$][\w$]*$/u.test(propertyName) ? propertyName : null;
    }

    /**
     * Checks if prop is declared in flow way
     * @param {Object} prop Property object, single prop type declaration
     * @returns {boolean}
     */
    function flowCheck(prop) {
      return (
        prop.type === 'ObjectTypeProperty' &&
        prop.value.type === 'BooleanTypeAnnotation' &&
        getPropName(prop) !== null &&
        rule.test(getPropName(prop)) === false
      );
    }

    /**
     * Checks if prop is declared in regular way
     * @param {Object} prop Property object, single prop type declaration
     * @returns {boolean}
     */
    function regularCheck(prop) {
      const propKey = getPropKey(prop);
      const propName = getPropName(prop);
      return propKey && propName !== null && propTypeNames.includes(propKey) && rule.test(propName) === false;
    }

    function tsCheck(prop) {
      if (prop.type !== 'TSPropertySignature') return false;
      const typeAnnotation = (prop.typeAnnotation || {}).typeAnnotation;
      const propName = getPropName(prop);
      return (
        typeAnnotation &&
        typeAnnotation.type === 'TSBooleanKeyword' &&
        propName !== null &&
        rule.test(propName) === false
      );
    }

    function getTypeMembers(type, seenTypes = new Set()) {
      if (!type || seenTypes.has(type)) {
        return [];
      }
      seenTypes.add(type);

      if (Array.isArray(type)) {
        return type.flatMap((member) => getTypeMembers(member, seenTypes));
      }

      if (type.type === 'TSTypeLiteral') {
        return type.members;
      }
      if (type.type === 'TSInterfaceBody') {
        return type.body;
      }
      if (type.type === 'TSParenthesizedType') {
        return getTypeMembers(type.typeAnnotation, seenTypes);
      }
      if (type.type === 'TSIntersectionType' || type.type === 'TSUnionType') {
        return type.types.flatMap((member) => getTypeMembers(member, seenTypes));
      }
      if (type.type === 'TSTypeReference' && type.typeName.type === 'Identifier') {
        return getTypeMembers(objectTypeAnnotations.get(type.typeName.name), seenTypes);
      }
      return [];
    }

    function getNestedTypeMembers(prop, seenTypes) {
      if (prop.type !== 'TSPropertySignature' || !prop.typeAnnotation) {
        return [];
      }
      return getTypeMembers(prop.typeAnnotation.typeAnnotation, seenTypes);
    }

    /**
     * Runs recursive check on all proptypes
     * @param {Array} proptypes A list of Property object (for each proptype defined)
     * @param {Function} addInvalidProp callback to run for each error
     */
    function runCheck(proptypes, addInvalidProp, seenTypes = new Set()) {
      if (proptypes) {
        proptypes.forEach((prop) => {
          if (config.validateNested && nestedPropTypes(prop)) {
            runCheck(prop.value.arguments[0].properties, addInvalidProp, seenTypes);
            return;
          }
          if (config.validateNested && prop.type === 'TSPropertySignature') {
            const nestedTypeSeen = new Set(seenTypes);
            const nestedTypeMembers = getNestedTypeMembers(prop, nestedTypeSeen);
            if (nestedTypeMembers.length > 0) {
              runCheck(nestedTypeMembers, addInvalidProp, nestedTypeSeen);
              return;
            }
          }
          if (flowCheck(prop) || regularCheck(prop) || tsCheck(prop)) {
            addInvalidProp(prop);
          }
        });
      }
    }

    /**
     * Checks and mark props with invalid naming
     * @param {Object} node The component node we're testing
     * @param {Array} proptypes A list of Property object (for each proptype defined)
     */
    function validatePropNaming(node, proptypes) {
      const component = components.get(node) || node;
      const invalidProps = component.invalidProps || [];

      runCheck(proptypes, (prop) => {
        invalidProps.push(prop);
      });

      components.set(node, {
        invalidProps,
      });
    }

    /**
     * Reports invalid prop naming
     * @param {Object} component The component to process
     */
    function reportInvalidNaming(component) {
      component.invalidProps.forEach((propNode) => {
        const propName = getPropName(propNode);
        report(context, config.message || messages.patternMismatch, !config.message && 'patternMismatch', {
          node: propNode,
          data: {
            component: propName,
            propName,
            pattern: config.rule,
          },
        });
      });
    }

    function checkPropWrapperArguments(node, args) {
      if (!node || !Array.isArray(args)) {
        return;
      }
      args
        .filter((arg) => arg.type === 'ObjectExpression')
        .forEach((object) => validatePropNaming(node, object.properties));
    }

    function getComponentFunction(node) {
      let componentNode = node;
      while (astUtil.isCallExpression(componentNode)) {
        componentNode = componentNode.arguments[0];
      }
      return componentNode && astUtil.isFunctionLike(componentNode) ? componentNode : null;
    }

    function getComponentTypeAnnotation(component) {
      const componentFunction = getComponentFunction(component.node);

      // If this is a functional component that uses a global type, check it
      if (
        componentFunction &&
        componentFunction.params &&
        componentFunction.params.length > 0 &&
        componentFunction.params[0].typeAnnotation
      ) {
        return componentFunction.params[0].typeAnnotation.typeAnnotation;
      }

      if (
        !component.node.parent ||
        component.node.parent.type !== 'VariableDeclarator' ||
        !component.node.parent.id ||
        component.node.parent.id.type !== 'Identifier' ||
        !component.node.parent.id.typeAnnotation ||
        !component.node.parent.id.typeAnnotation.typeAnnotation
      ) {
        return;
      }

      const annotationTypeArguments = propsUtil.getTypeArguments(
        component.node.parent.id.typeAnnotation.typeAnnotation,
      );
      if (
        annotationTypeArguments &&
        (annotationTypeArguments.type === 'TSTypeParameterInstantiation' ||
          annotationTypeArguments.type === 'TypeParameterInstantiation')
      ) {
        return annotationTypeArguments.params.find(
          (param) => param.type === 'TSTypeReference' || param.type === 'GenericTypeAnnotation',
        );
      }
    }

    function findAllTypeAnnotations(identifier, node) {
      if (node.type === 'TSTypeLiteral' || node.type === 'ObjectTypeAnnotation' || node.type === 'TSInterfaceBody') {
        const currentNode = [].concat(objectTypeAnnotations.get(identifier.name) || [], node);
        objectTypeAnnotations.set(identifier.name, currentNode);
      } else if (
        node.type === 'TSParenthesizedType' &&
        (node.typeAnnotation.type === 'TSIntersectionType' || node.typeAnnotation.type === 'TSUnionType')
      ) {
        node.typeAnnotation.types.forEach((type) => {
          findAllTypeAnnotations(identifier, type);
        });
      } else if (
        node.type === 'TSIntersectionType' ||
        node.type === 'TSUnionType' ||
        node.type === 'IntersectionTypeAnnotation' ||
        node.type === 'UnionTypeAnnotation'
      ) {
        node.types.forEach((type) => {
          findAllTypeAnnotations(identifier, type);
        });
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      'ClassProperty, PropertyDefinition'(node) {
        if (!rule || !propsUtil.isPropTypesDeclaration(node)) {
          return;
        }
        if (
          node.value &&
          astUtil.isCallExpression(node.value) &&
          propWrapperUtil.isPropWrapperFunction(context, getText(context, node.value.callee))
        ) {
          checkPropWrapperArguments(node, node.value.arguments);
        }
        if (node.value && node.value.properties) {
          validatePropNaming(node, node.value.properties);
        }
        if (node.typeAnnotation && node.typeAnnotation.typeAnnotation) {
          validatePropNaming(node, node.typeAnnotation.typeAnnotation.properties);
        }
      },

      MemberExpression(node) {
        if (!rule || !propsUtil.isPropTypesDeclaration(node)) {
          return;
        }
        const component = utils.getRelatedComponent(node);
        if (!component || !node.parent.right) {
          return;
        }
        const right = node.parent.right;
        if (
          astUtil.isCallExpression(right) &&
          propWrapperUtil.isPropWrapperFunction(context, getText(context, right.callee))
        ) {
          checkPropWrapperArguments(component.node, right.arguments);
          return;
        }
        validatePropNaming(component.node, node.parent.right.properties);
      },

      ObjectExpression(node) {
        if (!rule) {
          return;
        }

        // Search for the proptypes declaration
        node.properties.forEach((property) => {
          if (!propsUtil.isPropTypesDeclaration(property)) {
            return;
          }
          validatePropNaming(node, property.value.properties);
        });
      },

      TypeAlias(node) {
        findAllTypeAnnotations(node.id, node.right);
      },

      TSTypeAliasDeclaration(node) {
        findAllTypeAnnotations(node.id, node.typeAnnotation);
      },

      TSInterfaceDeclaration(node) {
        findAllTypeAnnotations(node.id, node.body);
      },

      'Program:exit'() {
        if (!rule) {
          return;
        }

        Object.values(components.list()).forEach((component) => {
          const annotation = getComponentTypeAnnotation(component);

          if (annotation) {
            let propType;
            if (annotation.type === 'GenericTypeAnnotation') {
              propType = objectTypeAnnotations.get(annotation.id.name);
            } else if (annotation.type === 'ObjectTypeAnnotation' || annotation.type === 'TSTypeLiteral') {
              propType = annotation;
            } else if (annotation.type === 'TSTypeReference') {
              propType = objectTypeAnnotations.get(annotation.typeName.name);
            } else if (annotation.type === 'TSIntersectionType') {
              propType = annotation.types.flatMap((type) =>
                type.type === 'TSTypeReference' ? objectTypeAnnotations.get(type.typeName.name) : type,
              );
            }

            if (propType) {
              []
                .concat(propType)
                .filter(Boolean)
                .forEach((prop) => {
                  validatePropNaming(component.node, prop.properties || prop.members || prop.body);
                });
            }
          }

          if (component.invalidProps && component.invalidProps.length > 0) {
            reportInvalidNaming(component);
          }
        });

        // Reset cache
        objectTypeAnnotations.clear();
      },
    };
  }),
};

export default exported;
export { exported as 'module.exports' };
