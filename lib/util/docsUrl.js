function docsUrl(ruleName) {
  return `https://github.com/ternaus/eslint-plugin-react/blob/main/docs/rules/${ruleName}.md`;
}

const exported = docsUrl;

export default exported;
export { exported as 'module.exports' };
