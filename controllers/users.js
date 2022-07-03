const { response } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');


//Get User Data
const usersGet = async( req, res = response ) => {

   const { limit = 5, skip = 0 } = req.query;
   const query = { estado:true };

   const [ total, users ] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
         .skip( Number(skip) )
         .limit( Number(limit) )
   ])

   res.json({
      total,
      users
   });
}

//Create User
const usersPost = async (req, res = response) => {

   const {name, email, password, role } = req.body;
   const user = new User({ name, email, password, role });

   //password encrypt
   const salt = bcryptjs.genSaltSync();
   user.password = bcryptjs.hashSync( password, salt );

   await user.save();

   res.json(user);
}

//Update User
const usersPut = async( req, res = response ) => {

   const { id } = req.params;
   const { _id, password, google, email, ...rest } = req.body;

   if( password ) {
       //password encrypt
      const salt = bcryptjs.genSaltSync();
      rest.password = bcryptjs.hashSync( password, salt );
   }

   const user = await User.findByIdAndUpdate( id, rest );
   
   res.json(user);
} 

//Delete User
const usersDelete = async( req, res = response ) => {

   const { id } = req.params;

   const authenticatedUser = req.authenticatedUser;

   // const user = await User.findByIdAndDelete( id );
   const user = await User.findByIdAndUpdate( id, { estado: false } );


   res.json({ user });
} 

module.exports = {
   usersGet,
   usersPost,
   usersPut,
   usersDelete,
}