const { Router } = require('express');
const { check } = require('express-validator');

//Middleware
const { inputValidator, 
   JWTValidator,  
   roleType} = require('../middlewares');

const { validCategoryId, validProductId } = require('../helpers/dbValidators');

//Controller   
const { createProduct, getAllProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/products');

//Router
const router = Router();

//get all products
router.get('/', getAllProducts);

//get a product
router.get('/:id', [
   check('id', 'Invalid id').isMongoId(),
   check('id').custom( validProductId ),
   inputValidator
], getProduct);


//create a product
router.post('/', [
   JWTValidator,
   roleType('ADMIN_ROLE'),
   check('name', 'Name is required').not().isEmpty(),
   check('category', 'Category is required').not().isEmpty(),
   check('category').custom( validCategoryId ),
   check('sku', ' SKU is required').not().isEmpty(),
   inputValidator
], createProduct);


//Product Update
router.put('/:id', [
   JWTValidator,
   roleType('ADMIN_ROLE'),
   check('id', 'Invalid id').isMongoId(),
   check('id').custom( validProductId ),
   check('name', 'Name is required').not().isEmpty(),
   check('category', 'Category is required').not().isEmpty(),
   check('category').custom( validCategoryId ),
   check('sku', ' SKU is required').not().isEmpty(),
   inputValidator
], updateProduct);


//Product Delete
router.delete('/:id', [
   JWTValidator,
   roleType('ADMIN_ROLE'),
   check('id', 'Invalid id').isMongoId(),
   check('id').custom( validProductId ),
   inputValidator
], deleteProduct);


module.exports = router