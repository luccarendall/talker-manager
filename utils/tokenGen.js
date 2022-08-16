const crypto = require('crypto');

const tokenGen = () => {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
};

module.exports = {
  tokenGen,
};