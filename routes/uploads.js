const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { allowCollections } = require('../helpers/dbValidators');

const { inputValidator, fileValidator } = require('../middlewares');

const router = Router();

router.post('/', fileValidator, uploadFile);

router.put('/:collection/:id', [
   fileValidator,
   check('id', 'invalid id').isMongoId(),
   check('collection').custom( c => allowCollections( c, ['users', 'products'] )),
   inputValidator
], updateImageCloudinary );

router.get('/:collection/:id', [
   check('id', 'invalid id').isMongoId(),
   check('collection').custom( c => allowCollections( c, ['users', 'products'] )),
   inputValidator
], showImage )

module.exports = router;