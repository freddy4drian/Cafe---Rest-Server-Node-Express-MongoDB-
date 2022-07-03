const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify")

const { User } = require('../models');


const login = async(req, res = response) => {

   const { email, password } = req.body;

   try {
      
      const user = await User.findOne({email});

      // checking email if user are active
      if(!user.estado) {
         return res.json({
            error: 'Wrong Email / Password'
         })
      }

      // checking password
      const checkPassword = bcryptjs.compareSync( password, user.password );
      if( !checkPassword ){
         return res.json({
            error: 'Wrong Email / Password'
         })
      }

      // generate JWT
      const token = await generateJWT( user.id );

      res.json({
         token
      })

   } catch (error) {

      console.log(error)
      return res.status(500).json({
         msg: 'Something wrong'
      })
   }
   
}

const googleSignIn = async( req, res = response ) => {

   const  { id_token } = req.body

   try {
      
      const { name, img, email } = await googleVerify( id_token );
      
      let user = await User.findOne({ email });

      if( !user ) {
         const data = {
            name,
            email, 
            password: '::',
            img,
            google: true
         };

         user = new User( data );
         await user.save();
      }



      //if user is disabled
      if( !user.estado ) {
         return res.status(401).json({
            msg: 'User is disabled'
         })
      }

      // generate JWT
      const token = await generateJWT( user.id );

      res.json({
         user,
         token
      })

   } catch (error) {
      res.status(400).json({
         ok: false,
         msg: 'Token could not be verified'
      })
   }


}

module.exports = {
   login,
   googleSignIn
}