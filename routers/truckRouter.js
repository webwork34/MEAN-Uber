const express = require('express');
const router = express.Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const isOnLoadMiddleware = require('./../middlewares/isOnLoad');
const {
  addTruckForUser,
  assignTruckById,
  getUserTrucks,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  unAssignTruckById,
} = require('./../controllers/truckController');

router.post('/trucks', authMiddleware, addTruckForUser);
router.post('/trucks/:id/assign', authMiddleware, assignTruckById);
router.post(
  '/trucks/:id/unassign',
  authMiddleware,
  isOnLoadMiddleware,
  unAssignTruckById
);

router.get('/trucks', authMiddleware, getUserTrucks);
router.get('/trucks/:id', authMiddleware, getTruckById);

router.put('/trucks/:id', authMiddleware, isOnLoadMiddleware, updateTruckById);

router.delete(
  '/trucks/:id',
  authMiddleware,
  isOnLoadMiddleware,
  deleteTruckById
);

module.exports = router;
