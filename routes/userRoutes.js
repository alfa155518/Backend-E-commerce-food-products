const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticationUsers = require('../controllers/authenticationController');
const uploadPhotoMiddleware = require('../middlewares/uploadPhoto');

router.post(
  '/signup',
  uploadPhotoMiddleware.uploadUserPhoto,
  authenticationUsers.signup
);
router.post('/login', authenticationUsers.login);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
router.delete('/logout', authenticationUsers.logout);

module.exports = router;
