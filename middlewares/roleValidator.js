const { response } = require("express");

//admin users
const adminRole = (req, res = response, next) => {

   if( !req.authenticatedUser ) {
      return res.status(500).jsom({
         msg: 'It is trying to validate the role without first validating the token'
      })
   }
   
   const { role, name } = req.authenticatedUser;

   if (role !== 'ADMIN_ROLE' ) {
      return res.status(401).json({
         msg: `${ name } is not an administrator`
      })
   }
   
   next();

}

// Validate all roles, including administrator
const roleType = ( ...roles ) => {

   return (req, res = response, next) => {

      if( !req.authenticatedUser ) {
         return res.status(500).json({
            msg: 'It is trying to validate the role without first validating the token'
         })
      }

      const { name } = req.authenticatedUser;

      if( !roles.includes( req.authenticatedUser.role) ) {
         return res.status(401).json({
            msg: `${ name } role does not have access to this function`
         })
      }


      next();
   }

}

module.exports = {
   adminRole,
   roleType
}