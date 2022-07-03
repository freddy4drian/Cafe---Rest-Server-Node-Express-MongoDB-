const { response } = require('express');
const { Category } = require('../models');



//Get a list of categories
const getAllCategories = async( req, res = response ) => {

   const { limit = 5, skip = 0 } = req.query;
   const query = { status: true };
      
   const [ total, categories ] = await Promise.all([
      Category.countDocuments( query ),
      Category.find( query )
      .limit( Number(limit) )
      .skip( Number(skip) )
      .populate('user', 'name')
   ]);

   res.json({
      total,
      categories
   });
   
}

// get an especific category
const getCategoryById = async( req, res = response ) => {

   const { id } = req.params;
   const category = await Category
   .findById( id )
   .where( { status: true })
   .populate('user', 'name');

   if( !category ){
      return res.status(401).json({
         msg: 'Category does not exist'
      })
   } 

   res.json({ category })
}

//Create category
const createCategory = async( req, res = response ) => {
   const name = req.body.name.toUpperCase();

   const categoryDB = await Category.findOne({ name });

   if( categoryDB ) {
      return res.status(400).json({
         msg: `Category: ${ categoryDB.name } already exist`
      });
   }


   const data = {
      name,
      user: req.authenticatedUser._id,
   }

   const category = new Category( data );
   await category.save();

   res.status(201).json(category);
}

//update a category
const updateCategory = async( req, res = response ) => {

   const { id } = req.params;
   const {status, user, ...data } = req.body;

   data.name = data.name.toUpperCase();
   data.user = req.authenticatedUser._id;

   const category = await Category.findByIdAndUpdate( id, data, { new: true }).populate('user');

   res.json({category});

}

//delete category
const deleteCategory = async( req, res = response ) => {

   const { id } = req.params;
   const category = await Category.findByIdAndUpdate(id, {status: false}, {new: true}).populate('user', 'name');

   res.json({category});
}


module.exports = {
   createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}