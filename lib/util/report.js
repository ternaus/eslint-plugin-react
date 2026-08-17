import getMessageData from './message.js';

const exported = function report(context, message, messageId, data) {
  context.report(Object.assign(getMessageData(messageId, message), data));
};

export default exported;
export { exported as 'module.exports' };
