const { validationResult } = require('express-validator');

const inputValidator = ( req, res, next ) => {

   const errors = validationResult(req);

   if( !errors.isEmpty() ){
      return res.status(200).json(errors);
   }
   next();
}

module.exports = {
   inputValidator
}