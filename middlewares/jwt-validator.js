const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

const  JWTValidator = async(req = request, res = response, next) => {

   const token = req.header('Authorization')

   if( !token ) {
      return res.status(401).json({
         msg: 'Missing authorization token'
      })
   }

   try {
      
      const { uid } = jwt.verify( token, process.env.PRIVATEKEY );
      const user = await User.findById( uid );

      if( !user ){
         return res.status(401).json({
            msg: 'Invalid authorization token'
         });
      }

      // checking if the user is active
      if( !user.estado ) {
         return res.status(401).json({
            msg: 'Invalid authorization token'
         });
      }

      req.authenticatedUser = user;

      next();

   } catch (error) {

      console.log(error);
      res.status(401).json({
         msg: 'Invalid authorization token'
      });

   }

}

module.exports = {
   JWTValidator
}