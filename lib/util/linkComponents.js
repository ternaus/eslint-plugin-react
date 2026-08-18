/**
 * @fileoverview Utility functions for propWrapperFunctions setting
 */

const DEFAULT_LINK_COMPONENTS = ['a'];
const DEFAULT_LINK_ATTRIBUTE = 'href';

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
  getLinkComponents,
};

export default exported;
export { exported as 'module.exports' };
