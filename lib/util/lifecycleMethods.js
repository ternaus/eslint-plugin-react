/**
 * @fileoverview lifecycle methods
 * @author Tan Nguyen
 */

const exported = {
  instance: [
    'getDefaultProps',
    'getInitialState',
    'getChildContext',
    'componentWillMount',
    'UNSAFE_componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'UNSAFE_componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'UNSAFE_componentWillUpdate',
    'getSnapshotBeforeUpdate',
    'componentDidUpdate',
    'componentDidCatch',
    'componentWillUnmount',
    'render',
  ],
  static: ['getDerivedStateFromProps'],
};

export default exported;
export { exported as 'module.exports' };
