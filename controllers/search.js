const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const allowedCollections = [
   'all',
   'users',
   'products',
   'categories',
   'roles'
];

//search on users collection
const searchUser = async( term = '', res = response ) => {

   const isMongoId = ObjectId.isValid( term );
   
   if ( isMongoId ) {
      const user = await User.findById( term );
      return res.json({ 
         results: ( user ) ? [ user ] : []
       });
   }

   const regex = new RegExp( term, 'i');

   const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ estado: true }]
   });

   res.json({
      results: users
   });

}

//search on products collection
const searchProduct = async( term = '', res = response ) => {

   const regex = new RegExp( term, 'i');

   const products = await Product.find({
      $or: [{ name: regex }, { sku: regex }],
      $and: [{ status: true }]
   }).populate('category', 'name');

   res.json({
      results: products
   });
}

//search on categories collection
const searchCategory = async( term = '', res = response ) => {

   const isMongoId = ObjectId.isValid( term );
   if( isMongoId ){
      const category = await Category.findById( term );
      return res.json({
         results: ( category ) ? [ category ] : []
      })
   }

   const regex = new RegExp( term, 'i' );

   const categories = await Category.find({
      name: regex
   }).where({ status: true });

   res.json({
      results: categories
   });
}

//Global search
const searchInAllCollections = async( term = '', res = response ) => {


   const regex = new RegExp( term, 'i' );

   const [ categories, users, products ] = await Promise.all([
      Category.find({
         name: regex
      }).where({ status: true }),
      User.find({
         $or: [{ name: regex }, { email: regex }],
         $and: [{ estado: true }]
      }),
      Product.find({
         $or: [{ name: regex }, { sku: regex }],
         $and: [{ status: true }]
      }).populate('category', 'name'),

   ]);

   return res.json({ results: { categories, users, products } })


}

//search controller
const search = ( req, res = response ) => {

   const { collection, term } = req.params

   if ( !allowedCollections.includes( collection )) {
      return res.status(400).json({
         msg: `Allowed collections: ${ allowedCollections }`
      })
   }

   switch ( collection ) {
      case 'users':
         searchUser( term, res );
      break;
      case 'products':
         searchProduct( term, res );
      break;
      case 'categories':
         searchCategory( term, res );
      break;
      case 'all':
         searchInAllCollections( term, res );
      break;
      default:
         res.status(500).json({
            msg: 'Missing search result'
         })
   }
}

module.exports = {
   search
}



// **** Search in all collections by id  ****** 
// const isMongoId = ObjectId.isValid( term );
   
//    if( isMongoId ){

//       const [ category, user, product ] = await Promise.all([
//          Category.findById( term ),
//          User.findById( term ),
//          Product.findById( term )
//       ]);

//       if( category !== null ) {
//          return res.json({ category })
//       }

//       if( user !== null) {
//          return res.json({ user })
//       }

//       if( product !== null ) {
//          return res.json({ product })
//       }
//    }