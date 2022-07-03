const { response } = require('express');
const { Product } = require('../models');


//Get list of products
const getAllProducts = async(req, res = response) => {

   const { limit = 5, skip = 0 } = req.query;
   const query = { status: true };

   const [ total, products ] = await Promise.all([
      Product.countDocuments( query ),
      Product.find( query )
      .limit( Number(limit) )
      .skip( Number(skip) )
      .populate('user', 'name')
      .populate('category', 'name')
   ]);

   res.json({
      total,
      products
   });
}

//Get a product
const getProduct = async( req, res = response ) => {

   const { id } = req.params;
   const product = await Product.findById( id )
                        .where({ status: true })
                        .populate('user', 'name')
                        .populate('category', 'name');

   if( !product ) {
      return res.status(401).json({
         msg: 'product does not exist'
      });
   }

   res.json({ product });
}

//Create a product
const createProduct = async( req, res = response ) => {

   const { name, price, category, desc, sku } = req.body;

   const productExist = await Product.findOne({ sku });

   if( productExist ) {
      return res.status(400).json({
         msg: `Product already exist`
      });
   }


   const data = {
      name,
      user: req.authenticatedUser._id,
      price,
      category,
      desc,
      sku
   }

   const product = new Product( data );
   await product.save();

   res.status(201).json(product);
}

//Update a product
const updateProduct = async( req, res = response ) => {

   const { id } = req.params;

   const { _id, status, user, ...data } = req.body;
   data.user = req.authenticatedUser._id;

   const [ skuExist, product ] = await Promise.all([
      Product.findOne({ sku: data.sku }).where({status: true}),
      Product.findByIdAndUpdate( id, data, {new: true})
            .populate('user', 'name')
            .populate('category', 'name')
   ])

   if( skuExist && String(skuExist._id) !== id ) {
      return res.status(400).json({
         msg: `SKU is already in use`,
      });
   }

   res.json({product});

}

//Delete a product
const deleteProduct = async( req, res = response ) => {

   const { id } = req.params;

   const data = { 
      status: false, 
      user: req.authenticatedUser._id 
   };

   const product = await Product.findByIdAndUpdate(id, data, {new: true})
                                 .where({ status: true })
                                 .populate('user', 'name');

   if( !product ) {
      return res.status(401).json({
         msg: 'Product does not exist'
      });
   }

   res.json({
      product
   })
}

module.exports = {
   getAllProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct
}
