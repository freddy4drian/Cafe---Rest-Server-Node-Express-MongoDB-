const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

//Controller
const { usersGet, 
      usersPut, 
      usersPost, 
      usersDelete } = require('../controllers/users');

//Middlewares      
const { inputValidator,
      JWTValidator,
      roleType      } = require('../middlewares');
      const { validRole, validEmail, validUser } = require('../helpers/dbValidators');

router.get('/',  usersGet);

 router.put('/:id', [
       check('id', 'Invalid id').isMongoId(),
       check('id').custom( validUser ),
       check('role').custom( validRole ),
       inputValidator
 ], usersPut);

 router.post('/', [
       check('name', 'Name is empty').not().isEmpty(),
       check('password', 'password must contain more than 8 characters').isLength({min: 8}),
       check('email', 'Invalid email').isEmail(),
       check('email').custom( validEmail ),
      //  check('role', 'Invalid Role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
      check('role').custom( validRole ),
       inputValidator
 ], usersPost);

 router.delete('/:id', [
       JWTValidator,
       roleType('USER_ROLE'),
      check('id', 'Invalid id').isMongoId(),
      check('id').custom( validUser ),
      inputValidator
 ], usersDelete);

 module.exports = router;