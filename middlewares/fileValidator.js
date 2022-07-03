const { response } = require("express");


const fileValidator = (req, res = response , next) => {

   if( !req.files || Object.keys(req.files).length === 0 || !req.files.file ) {
      return res.status(400).json({ msg: 'please select a file to upload'});
   }
   next();
}

module.exports = {
   fileValidator
}