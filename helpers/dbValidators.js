const Role = require('../models/role');
const User = require('../models/user');
const { Category, Product } = require('../models');

//Role validation w/ database
const validRole = async(role = '') => {

   const RoleExist = await Role.findOne({ role });
   if( !RoleExist ) {
         throw new Error(`Role: ${role}, does not exist`)
   }

   return true;

}

//Email validation w/ database
const validEmail = async( email ) => {
   
   const findEmail = await User.findOne({ email });
   if( findEmail ) {
      throw new Error(`Email already in use`)
   }

   return true;
}

//user ID validation w/ database
const validUser = async( id ) => {
   
   const findUserById = await User.findById(id).where({ status: true });
   if( !findUserById ) {
      throw new Error(`ID does not exist`)
   }

   return true;
}

//category ID validation w/ database
const validCategoryId = async( id ) => {

   const findCategoryById = await Category.findById(id).where({ status: true });
   if( !findCategoryById ) {
      throw new Error('Category ID does not exist');
   }

   return true;
}

//Product ID validation w/ database
const validProductId = async( id ) => {

   const findProductById = await Product.findById(id).where({ status: true });
   if( !findProductById ) {
      throw new Error('Product ID does not exist');
   }

   return true;
}

//Collections validations
const allowCollections = ( collection = '', collections = []) => {

   const include = collections.includes( collection );
   if( !include ) {
      throw new Error( `collection '${collection}' isn't allowed`);
   }

   return true;
}


module.exports = {
   validRole,
   validEmail,
   validUser,
   validCategoryId,
   validProductId,
   allowCollections
}