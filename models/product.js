const { Schema, model } = require('mongoose');


const ProductSchema = Schema({
   name: {
      type: String,
      required: [true, 'Name is required'],
   },
   status: {
      type: Boolean,
      default: true,
      required: true
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   price: {
      type: Number,
      default: 0
   },
   category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
   },
   desc: {
      type: String
   },
   stock: {
      type: Boolean,
      default: true
   },
   sku: {
      type: String,
      required: [ true, ' SKU is required']
   },
   img: {
      type: String
   }
})

ProductSchema.methods.toJSON = function() {
   const { __v, estado, ...data } = this.toObject();
   return data;
}

module.exports = model( 'Product', ProductSchema );