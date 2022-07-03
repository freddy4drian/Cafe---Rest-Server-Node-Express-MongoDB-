

const { inputValidator } = require('./inputValidator');
const { JWTValidator } = require('./jwt-validator');
const { adminRole, roleType } = require('./roleValidator');
const fileValidator = require('./fileValidator');

module.exports = {
   inputValidator,
   JWTValidator,
   adminRole, 
   roleType,
   ...fileValidator
}