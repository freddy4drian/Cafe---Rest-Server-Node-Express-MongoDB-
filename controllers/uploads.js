const { uploadFiles } = require('../helpers/upload-file');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL )


const { response } = require("express");
const { update } = require('../models/product');

const { User, Product } = require('../models');
const path  = require('path');


const uploadFile = async(req, res = response ) => {


   try{

      // const path = await uploadFiles( req.files, ['txt', 'md'], 'textos' );
      const name = await uploadFiles( req.files, undefined, 'imgs' );
   
      res.json({ name });
   } catch( msg ) {
      res.status(400).json({ msg }) 
   }
   
}

const updateImage = async( req, res = response ) => {

   const { id, collection } = req.params;
   let model;

   switch ( collection ) {
      case 'users':
         model = await User.findById(id);
         if( !model ) {
            return res.status(400).json({
               msg: `user with id: ${ id } doesn't exists`
            })
         }
         break;
      case 'products':
         model = await Product.findById(id);
         if( !model ) {
            return res.status(400).json({
               msg: `product with id: ${ id } doesn't exists`
            })
         }
         break;
   
      default:
         return res.status(500).json({ msg: 'forgot some validations'})
   }

   if( model.img ) {  
      const pathImage = path.join( __dirname, '../uploads/images', collection, id, model.img);

      if( fs.existsSync( pathImage ) ){
         fs.unlinkSync( pathImage );
      }
   }


   const name = await uploadFiles( req.files, undefined, `images/${collection}/${id}` );
   model.img = name;

   await model.save();

   res.json(model);


}

const updateImageCloudinary = async( req, res = response ) => {

   const { id, collection } = req.params;
   let model;

   switch ( collection ) {
      case 'users':
         model = await User.findById(id);
         if( !model ) {
            return res.status(400).json({
               msg: `user with id: ${ id } doesn't exists`
            })
         }
         break;
      case 'products':
         model = await Product.findById(id);
         if( !model ) {
            return res.status(400).json({
               msg: `product with id: ${ id } doesn't exists`
            })
         }
         break;
   
      default:
         return res.status(500).json({ msg: 'forgot some validations'})
   }

   if( model.img ) {  

      const nameArr = model.img.split('/');
      const name = nameArr[nameArr.length - 1];
      const [ public_id ] = name.split('.')

      cloudinary.uploader.destroy( public_id );
   }


   const { tempFilePath } = req.files.file
   const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

   model.img = secure_url;

   await model.save();

   res.json(model);


}

const showImage = async( req, res= response) => {

   const { id, collection } = req.params;

   let model;

   switch ( collection ) {
      case 'users':
         model = await User.findById(id);
         if( !model ) {
            return res.status(400).json({
               msg: `user with id: ${ id } doesn't exists`
            })
         }
         break;
      case 'products':
         model = await Product.findById(id);
         if( !model ) {
            return res.status(400).json({
               msg: `product with id: ${ id } doesn't exists`
            })
         }
         break;
   
      default:
         return res.status(500).json({ msg: 'forgot some validations'})
   }

   if( model.img ) {  
      //delete img from server
      const pathImage = path.join( __dirname, '../uploads/images', collection, id, model.img);

      if( fs.existsSync( pathImage ) ){
         return res.sendFile( pathImage );
      }

   }
   
   const pathImage = path.join( __dirname, '../assets/no-image.jpg');
   res.sendFile( pathImage );

}

module.exports = {
   uploadFile,
   updateImage,
   showImage,
   updateImageCloudinary
}