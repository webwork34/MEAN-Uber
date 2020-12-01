const Truck = require('./../models/truckModel');
const {copyArray, copyObj} = require('./../shared/makeCopy');

// ===================== Get user's truck by id GET =====================
module.exports.getTruckById = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const _id = req.params.id;
    const created_by = req.user.userId;

    Truck.findOne({_id, created_by})
      .exec()
      .then(data => {
        if (!data) {
          return res
            .status(404)
            .json({message: `You don't have truck with id ${_id}`});
        }

        const truck = copyObj(data);

        return res.status(200).json({truck});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'Available only for DRIVER role'});
  }
};

// ===================== Get user's trucks GET =====================
module.exports.getUserTrucks = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const created_by = req.user.userId;

    Truck.find({created_by})
      .exec()
      .then(data => {
        if (!data) {
          return res
            .status(500)
            .json({message: `Something went wrong, try again later.`});
        }

        if (data.length === 0) {
          return res
            .status(404)
            .json({message: `You haven't had any truck yet.`});
        }

        const trucks = copyArray(data);

        return res.status(200).json([{trucks}]);
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'Available only for DRIVER role'});
  }
};

// ===================== Add Truck for user POST =====================
module.exports.addTruckForUser = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const {type} = req.body;

    if (
      type !== 'SPRINTER' &&
      type !== 'SMALL STRAIGHT' &&
      type !== 'LARGE STRAIGHT'
    ) {
      return res.status(400).json({
        message: 'Type have to be SPRINTER or SMALL STRAIGHT or LARGE STRAIGHT',
      });
    }

    const truck = new Truck({
      type,
      created_by: req.user.userId,
    });

    truck
      .save()
      .then(truck => {
        if (!truck) {
          return res
            .status(500)
            .json({message: 'Something went wrong. Try again later'});
        }
        return res.status(201).json({message: 'Truck created successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for DRIVER role'});
  }
};

// ===================== Assign truck to user by id POST =====================
module.exports.assignTruckById = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const truckId = req.params.id;
    const created_by = req.user.userId;

    Truck.find({created_by})
      .exec()
      .then(trucks => {
        if (!trucks) {
          return res
            .status(404)
            .json({message: `You haven't created any trucks yet.`});
        }

        const assignedTruck = trucks.some(truck => truck.assigned_to);

        if (assignedTruck) {
          return res
            .status(409)
            .json({message: 'You have already had assigned to you truck.'});
        }

        Truck.findOneAndUpdate(
          {created_by, _id: truckId},
          {$set: {assigned_to: created_by, status: 'IS'}},
          {new: true}
        )
          .exec()
          .then(truck => {
            if (!truck) {
              return res
                .status(404)
                .json({message: `You don't have any track with id ${truckId}`});
            }

            return res
              .status(200)
              .json({message: 'Truck assigned successfully'});
          })
          .catch(err => res.status(500).json({message: err.message}));
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'Available only for DRIVER role'});
  }
};

// ==================== unAssign truck from user by id POST ====================
module.exports.unAssignTruckById = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const truckId = req.params.id;

    Truck.findOneAndUpdate(
      {_id: truckId, status: 'IS'},
      {$set: {assigned_to: null, status: 'OS'}},
      {new: true}
    )
      .exec()
      .then(truck => {
        if (!truck) {
          return res.status(404).json({
            // eslint-disable-next-line max-len
            message: `You don't have assigned to you track with id ${truckId}`,
          });
        }

        return res.status(200).json({message: 'Truck unassigned successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'Available only for DRIVER role'});
  }
};

// ===================== Update user's truck by id PUT =====================
module.exports.updateTruckById = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const _id = req.params.id;
    const created_by = req.user.userId;
    const {type} = req.body;

    if (
      type !== 'SPRINTER' &&
      type !== 'SMALL STRAIGHT' &&
      type !== 'LARGE STRAIGHT'
    ) {
      return res.status(400).json({
        message: 'Type have to be SPRINTER or SMALL STRAIGHT or LARGE STRAIGHT',
      });
    }

    Truck.findOneAndUpdate(
      {_id, created_by, assigned_to: undefined || null},
      {$set: {type}},
      {new: true}
    )
      .exec()
      .then(truck => {
        if (!truck) {
          return res
            .status(404)
            .json({message: `You can't update truck with id ${_id}`});
        }

        return res
          .status(200)
          .json({message: 'Truck details have been changed successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'Available only for DRIVER role'});
  }
};

// ===================== Delete user's truck by id DELETE =====================
module.exports.deleteTruckById = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const _id = req.params.id;
    const created_by = req.user.userId;

    Truck.findOneAndDelete({_id, created_by, assigned_to: undefined})
      .exec()
      .then(truck => {
        if (!truck) {
          return res.status(404).json({
            message: `You are not available deleting truck with id ${_id}`,
          });
        }
        return res.status(200).json({message: 'Truck deleted successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'Available only for DRIVER role'});
  }
};
