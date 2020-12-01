const express = require('express');
const router = express.Router();
const authMiddleware = require('./../middlewares/authMiddleware');

const {
  addLoadForUser,
  postLoadById,
  updateLoadById,
  deleteLoadById,
  nextLoadState,
  getLoads,
  getActiveLoad,
  getLoadById,
  getLoadShippingInfoById,
} = require('./../controllers/loadController');

router.get('/loads', authMiddleware, getLoads);
router.get('/loads/active', authMiddleware, getActiveLoad);
router.get('/loads/:id', authMiddleware, getLoadById);
router.get('/loads/:id/shipping_info', authMiddleware, getLoadShippingInfoById);

router.post('/loads', authMiddleware, addLoadForUser);
router.post('/loads/:id/post', authMiddleware, postLoadById);

router.put('/loads/:id', authMiddleware, updateLoadById);
router.patch('/loads/active/state', authMiddleware, nextLoadState);

router.delete('/loads/:id', authMiddleware, deleteLoadById);

module.exports = router;
