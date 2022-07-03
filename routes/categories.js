const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, 
        getAllCategories, 
        getCategoryById, 
        updateCategory, 
        deleteCategory } = require('../controllers/categories');

const { inputValidator, 
        JWTValidator, 
        roleType} = require('../middlewares');

const { validCategoryId } = require('../helpers/dbValidators');

const router = Router();

/**
 * {{url}}/pi/categories
 */

//get all categories -public
router.get('/', getAllCategories);

//get an especific category - public
router.get('/:id', [
   check('id', 'Invalid id').isMongoId(),
   check('id').custom( validCategoryId ),
   inputValidator
], getCategoryById);

//create a category - private
router.post('/', [
   JWTValidator,
   check('name', 'Name is required').not().isEmpty(),
   inputValidator
], createCategory);

//update a category - private
router.put('/:id', [
   JWTValidator,
   check('id', 'Invalid id').isMongoId(),
   check('id').custom( validCategoryId ),
   roleType('ADMIN_ROLE'),
   check('name', 'Name is required').not().isEmpty(),
   inputValidator
], updateCategory);

//Delete a category (soft-delete) - private
router.delete('/:id', [
   JWTValidator,
   roleType('ADMIN_ROLE'),
   check('id', 'Invalid id').isMongoId(),
   check('id').custom( validCategoryId ),
   inputValidator
], deleteCategory)


module.exports = router;