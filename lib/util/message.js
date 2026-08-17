const exported = function getMessageData(messageId, message) {
  return typeof messageId === 'string' ? { messageId } : { message };
};

export default exported;
export { exported as 'module.exports' };
