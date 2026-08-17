/**
 * @fileoverview Utility functions for propWrapperFunctions setting
 */

const DEFAULT_LINK_COMPONENTS = ['a'];
const DEFAULT_LINK_ATTRIBUTE = 'href';

const DEFAULT_FORM_COMPONENTS = ['form'];
const DEFAULT_FORM_ATTRIBUTE = 'action';

function getFormComponents(context) {
  const settings = context.settings || {};
  const formComponents = /** @type {typeof DEFAULT_FORM_COMPONENTS} */ (
    DEFAULT_FORM_COMPONENTS.concat(settings.formComponents || [])
  );
  return new Map(
    formComponents.map((value) => {
      if (typeof value === 'string') {
        return [value, [DEFAULT_FORM_ATTRIBUTE]];
      }
      return [value.name, [].concat(value.formAttribute)];
    }),
  );
}

function getLinkComponents(context) {
  const settings = context.settings || {};
  const linkComponents = /** @type {typeof DEFAULT_LINK_COMPONENTS} */ (
    DEFAULT_LINK_COMPONENTS.concat(settings.linkComponents || [])
  );
  return new Map(
    linkComponents.map((value) => {
      if (typeof value === 'string') {
        return [value, [DEFAULT_LINK_ATTRIBUTE]];
      }
      return [value.name, [].concat(value.linkAttribute)];
    }),
  );
}

const exported = {
  getFormComponents,
  getLinkComponents,
};

export default exported;
export { exported as 'module.exports' };
