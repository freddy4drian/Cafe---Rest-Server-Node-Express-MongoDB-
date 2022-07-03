const path = require('path');
const { v4: uuidv4 } = require('uuid');

 const uploadFiles = ( { file }, extentions = [ 'jpg', 'jpeg', 'png', 'gif', 'webp'], folder = '' ) => {

   return new Promise (( resolve, reject ) => {
   
      const splitName = file.name.split('.');
      const extention = splitName[ splitName.length - 1 ];
   
      const validExtentions = extentions;
   
      if( !validExtentions.includes( extention )) {
         return reject(`Invalid extention: ${extention}, please use: ${ validExtentions } extentions.`)
      }
   
      const tempName = uuidv4() + '.' + extention;
      const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);
   
      file.mv( uploadPath, (err) => {
         if(err){
            return reject( err );
         }
   
         resolve( tempName )
      });

   })


 }

 module.exports = {
    uploadFiles
 }