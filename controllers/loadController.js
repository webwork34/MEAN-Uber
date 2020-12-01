const Load = require('./../models/loadModel');
const Truck = require('./../models/truckModel');
const User = require('./../models/userModel');
const {
  changeStatus,
  findTruck,
  writeLog,
  findUserByTruckId,
} = require('../shared/system');
const {copyArray, copyObj} = require('./../shared/makeCopy');

// ===================== Get user's loads GET =====================
module.exports.getLoads = async (req, res) => {
  const offset = +req.query.offset || 0;
  let limit = +req.query.limit || 10;
  limit = limit > 50 ? 50 : limit;
  const {email} = req.user;

  if (req.user.role === 'DRIVER') {
    const driverId = req.user.userId;
    let {status} = req.query;

    const message = status
      ? `You don't have available loads with status ${status}`
      : `No ASSIGNED or SHIPPED loads for driver ${email}`;

    status = status ? status : {$in: ['ASSIGNED', 'SHIPPED']};

    Load.find({
      assigned_to: driverId,
      status,
    })
      .limit(limit)
      .skip(10 * offset)
      .then(data => {
        if (data.length === 0) {
          return res.status(404).json({message});
        }

        const loads = copyArray(data);
        return res.status(200).json({loads});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    const created_by = req.user.userId;
    const {status} = req.query;

    const message = status
      ? `You don't have available loads with status ${status}`
      : `No available loads for shipper ${email}`;

    Load.find({created_by})
      .limit(limit)
      .skip(10 * offset)
      .then(data => {
        if (data.length === 0) {
          return res.status(404).json({message});
        }

        const loads = copyArray(data);

        return res.status(200).json([{loads}]);
      })
      .catch(err => res.status(500).json({message: err.message}));
  }
};

// ===================== Get driver active load GET =====================
module.exports.getActiveLoad = (req, res) => {
  if (req.user.role === 'DRIVER') {
    const assigned_to = req.user.userId;

    Load.findOne({assigned_to, status: 'ASSIGNED'})
      .exec()
      .then(data => {
        if (!data) {
          return res
            .status(404)
            .json({message: `You don't have any active load now`});
        }

        const load = copyObj(data);

        return res.status(200).json({load});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for DRIVER role'});
  }
};

// ===================== Get user's Load by id GET =====================
module.exports.getLoadById = async (req, res) => {
  const loadId = req.params.id;
  const {userId} = req.user;
  const {email} = req.user;

  if (req.user.role === 'SHIPPER') {
    Load.findOne({
      _id: loadId,
      created_by: userId,
      status: {$in: ['NEW', 'POSTED']},
    })
      .exec()
      .then(data => {
        if (!data) {
          return res.status(404).json({
            // eslint-disable-next-line max-len
            message: `Available load with id ${loadId} for shipper ${email} hasn't found`,
          });
        }

        const load = copyObj(data);
        return res.status(200).json({load});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    let truckId;

    await Truck.findOne({assigned_to: userId})
      .exec()
      .then(truck => {
        if (!truck) {
          return res
            .status(404)
            .json({message: `Truck assigned to driver ${email} hasn't found`});
        }
        truckId = truck._id;
      })
      .catch(err => res.status(500).json({message: err.message}));

    Load.findOne({
      _id: loadId,
      assigned_to: truckId,
      status: {$in: ['ASSIGNED', 'SHIPPED']},
    })
      .exec()
      .then(data => {
        if (!data) {
          return res.status(404).json({
            // eslint-disable-next-line max-len
            message: `Available load with id ${loadId} for driver ${email} hasn't found`,
          });
        }

        const load = copyObj(data);
        return res.status(200).json({load});
      })
      .catch(err => res.status(500).json({message: err.message}));
  }
};

// ================= Get user's Load shipping info by id GET =================
module.exports.getLoadShippingInfoById = (req, res) => {
  if (req.user.role === 'SHIPPER') {
    const _id = req.params.id;
    const created_by = req.user.userId;

    Load.findOne({_id, created_by, status: {$in: ['ASSIGNED', 'SHIPPED']}})
      .exec()
      .then(async loadData => {
        if (!loadData) {
          return res.status(404).json({
            message: `No available load shipping with id ${_id}`,
          });
        }

        const load = copyObj(loadData);
        const {_id} = loadData.assigned_to;
        let driver;
        let truck;

        await User.findById(_id)
          .exec()
          .then(async data => {
            if (!data) {
              return res
                .status(404)
                .json({message: `Your load hasn't assigned yet`});
            }

            try {
              const truckCandidate = await Truck.findOne({
                assigned_to: data._id,
              });

              truck = copyObj(truckCandidate);
            } catch (err) {
              return res.status(500).json({message: err.message});
            }

            driver = copyObj(data);
            delete driver.password;
          })
          .catch(err => res.status(500).json({message: err.message}));

        return res.status(200).json({load, truck, driver});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for SHIPPER role'});
  }
};

// ======================= Add Load for User POST =======================
module.exports.addLoadForUser = (req, res) => {
  if (req.user.role === 'SHIPPER') {
    const {
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions,
    } = req.body;

    const load = new Load({
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions,
      created_by: req.user.userId,
    });

    load
      .save()
      .then(load => {
        if (!load) {
          return res
            .status(500)
            .json({message: 'Something went wrong. Try again later'});
        }
        return res.status(201).json({message: 'Load created successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for SHIPPER role'});
  }
};

// ======================= Post a user's load by id POST =======================
module.exports.postLoadById = (req, res) => {
  if (req.user.role === 'SHIPPER') {
    const loadId = req.params.id;

    Load.findOne({_id: loadId, status: 'NEW'})
      .then(async load => {
        if (!load) {
          return res.status(404).json({
            // eslint-disable-next-line max-len
            message: `You don't have load with id ${loadId} available for posting`,
          });
        }

        const loadDemensions = load.dimensions;
        const loadPayload = load.payload;

        await changeStatus(res, loadId, 'POSTED');
        const truckId = await findTruck(
          res,
          loadDemensions,
          loadPayload,
          loadId
        );

        if (!truckId) {
          await changeStatus(res, loadId, 'NEW');
          await writeLog(res, loadId, `Driver hasn't found`);
          return res.status(404).json({message: `Driver hasn't found`});
        }

        const userId = await findUserByTruckId(res, truckId);

        await writeLog(
          res,
          loadId,
          `Load assigned to driver with id ${userId}`
        );

        return res.status(200).json({
          message: 'Load posted successfully',
          driver_found: !!truckId,
        });
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for SHIPPER role'});
  }
};

// ===================== Iterate to next Load state PATCH =====================
module.exports.nextLoadState = async (req, res) => {
  if (req.user.role === 'DRIVER') {
    let truckId;
    let loadStatus = 'ASSIGNED';
    let truckStatus;
    const {userId} = req.user;

    await Truck.findOne({assigned_to: userId})
      .then(truck => {
        if (!truck) {
          return res.status(404).json({
            message: `You don't have assigned to you truck`,
          });
        }
        truckId = truck._id;
      })
      .catch(err => res.status(500).json({message: err.message}));

    Load.findOne({assigned_to: userId, status: 'ASSIGNED'})
      // Load.findOne({assigned_to: truckId, status: 'ASSIGNED'})
      .exec()
      .then(async load => {
        if (!load) {
          return res.status(404).json({
            message: `You don't have active load`,
          });
        }
        let loadSate = load.state;

        switch (loadSate) {
          case 'En route to Pick Up':
            loadSate = 'Arrived to Pick Up';
            break;
          case 'Arrived to Pick Up':
            loadSate = 'En route to delivery';
            break;
          case 'En route to delivery':
            loadSate = 'Arrived to delivery';
            loadStatus = 'SHIPPED';
            truckStatus = 'IS';
            break;
          // case 'Arrived to delivery':
          //   break;
        }

        try {
          await Load.findByIdAndUpdate(
            load._id,
            {$set: {state: loadSate, status: loadStatus}},
            {new: true}
          );

          writeLog(res, load._id, `Load state was changed to ${loadSate}`);

          if (truckStatus === 'IS') {
            await Truck.findByIdAndUpdate(
              truckId,
              {$set: {status: 'IS'}},
              {new: true}
            );
          }
        } catch (err) {
          return res.status(500).json({message: err.message});
        }

        return res
          .status(200)
          .json({message: `Load state changed to ${loadSate}`});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for DRIVER role'});
  }
};

// ======================= Update user's load by id PUT =======================
module.exports.updateLoadById = async (req, res) => {
  if (req.user.role === 'SHIPPER') {
    const _id = req.params.id;
    const created_by = req.user.userId;

    let {
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions,
    } = req.body;

    await Load.findOne({_id, status: 'NEW'})
      .exec()
      .then(load => {
        if (!load) {
          return res.status(404).json({
            message: `No available load with id ${_id} and status NEW`,
          });
        }

        name = name ? name : load.name;
        payload = payload ? payload : load.payload;
        pickup_address = pickup_address ? pickup_address : load.pickup_address;

        delivery_address = delivery_address
          ? delivery_address
          : load.delivery_address;

        if (!dimensions) {
          dimensions = load.dimensions;
        } else {
          dimensions.width = dimensions.width
            ? dimensions.width
            : load.dimensions.width;

          dimensions.length = dimensions.length
            ? dimensions.length
            : load.dimensions.length;

          dimensions.height = dimensions.height
            ? dimensions.height
            : load.dimensions.height;
        }
      })
      .catch(err => res.status(500).json({message: err.message}));

    Load.findOneAndUpdate(
      {_id, created_by, status: 'NEW'},
      {$set: {name, payload, pickup_address, delivery_address, dimensions}},
      {new: true}
    )
      .exec()
      .then(async load => {
        if (!load) {
          return res.status(404).json({
            message: `No available load with id ${_id} for changing`,
          });
        }

        await writeLog(res, _id, 'Load was changed');

        return res
          .status(200)
          .json({message: 'Load details changed successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for SHIPPER role'});
  }
};

// ======================= Delete user load by id DELETE =======================
module.exports.deleteLoadById = (req, res) => {
  if (req.user.role === 'SHIPPER') {
    const _id = req.params.id;
    const created_by = req.user.userId;

    Load.findOneAndDelete({_id, created_by, status: 'NEW'})
      .exec()
      .then(load => {
        if (!load) {
          return res.status(404).json({
            message: `No available load with id ${_id} for deleting`,
          });
        }
        return res.status(200).json({message: 'Load deleted successfully'});
      })
      .catch(err => res.status(500).json({message: err.message}));
  } else {
    return res.status(409).json({message: 'abailable only for SHIPPER role'});
  }
};
