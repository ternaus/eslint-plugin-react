// React documents `value` as a controlled prop for these host components even
// though WHATWG does not list it as an HTML content attribute on either element.
// https://react.dev/reference/react-dom/components/select
// https://react.dev/reference/react-dom/components/textarea
const REACT_DOM_ATTRIBUTE_OVERRIDES = Object.freeze({
  select: Object.freeze({ value: null }),
  textarea: Object.freeze({ value: null }),
});

export default REACT_DOM_ATTRIBUTE_OVERRIDES;
export { REACT_DOM_ATTRIBUTE_OVERRIDES as 'module.exports' };
