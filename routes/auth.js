const  { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { inputValidator } = require('../middlewares');

const router = Router();

router.post('/login', [
   check('email', 'Email is required').isEmail(),
   check('password', 'Password is required').not().isEmpty(),
   inputValidator
], login);

router.post('/google', [
   check('id_token', 'id_token is required').not().isEmpty(),
   inputValidator
], googleSignIn);

module.exports = router;