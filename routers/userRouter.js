const express = require('express');
const router = express.Router();
const upload = require('./../middlewares/upload');
const authMiddleware = require('./../middlewares/authMiddleware');
const {
  getUserInfoController,
  changePasswordController,
  deleteUserAccountController,
  addUserPhotoController,
  historyController,
} = require('../controllers/userController');

const isOnLoadMiddleware = require('./../middlewares/isOnLoad');

router.get('/users/me', authMiddleware, getUserInfoController);

router.get('/history', authMiddleware, historyController);

router.patch(
  '/users/me/password',
  authMiddleware,
  isOnLoadMiddleware,
  changePasswordController
);

router.delete(
  '/users/me',
  authMiddleware,
  isOnLoadMiddleware,
  deleteUserAccountController
);

router.patch(
  '/users/me/change_photo',
  authMiddleware,
  isOnLoadMiddleware,
  upload.single('image'),
  addUserPhotoController
);

module.exports = router;
