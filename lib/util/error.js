/**
 * Logs out a message if there is no format option set.
 * @param {string} message - Message to log.
 */
function error(message) {
  if (!/=-(f|-format)=/.test(process.argv.join('='))) {
    console.error(message);
  }
}

const exported = error;

export default exported;
export { exported as 'module.exports' };
