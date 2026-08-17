/**
 * Logs out a message if there is no format option set.
 * @param {string} message - Message to log.
 */
function log(message) {
  if (!/=-(f|-format)=/.test(process.argv.join('='))) {
    console.log(message);
  }
}

const exported = log;

export default exported;
export { exported as 'module.exports' };
