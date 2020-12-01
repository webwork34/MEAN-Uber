const moment = require('moment');
const Load = require('../models/loadModel');
const Truck = require('../models/truckModel');
const truckTypes = require('./../shared/truckTypes');

async function findUserByTruckId(res, truckId) {
  return await Truck.findById(truckId)
    .exec()
    .then(truck => {
      if (!truck) {
        return res
          .status(404)
          .json({message: `Truck with id ${truckId} hasn't found`});
      }
      return truck.assigned_to;
    })
    .catch(err => res.status(500).json({message: err.message}));
}

module.exports.findUserByTruckId = findUserByTruckId;

module.exports.changeStatus = async (res, loadId, status) => {
  try {
    await Load.findByIdAndUpdate(loadId, {$set: {status}}, {new: true});
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
};

module.exports.findTruck = async (
  res,
  loadDemensions,
  loadPayload,
  loadId = null
) => {
  try {
    let truckId = null;
    const trucks = await Truck.find({status: 'IS'});

    if (trucks.length === 0) {
      return false;
    }

    trucks.some(async truck => {
      const type = truck.type.split(' ')[0];

      if (
        truckTypes[type].width >= loadDemensions.width &&
        truckTypes[type].length >= loadDemensions.length &&
        truckTypes[type].height >= loadDemensions.height &&
        truckTypes[type].payload >= loadPayload
      ) {
        truckId = truck._id;

        const userId = await findUserByTruckId(res, truckId);

        try {
          await Truck.findByIdAndUpdate(
            truckId,
            {$set: {status: 'OL'}},
            {new: true}
          );

          await Load.findByIdAndUpdate(
            loadId,
            {
              $set: {
                assigned_to: userId,
                status: 'ASSIGNED',
                state: 'En route to Pick Up',
              },
            },
            {new: true}
          );
        } catch (err) {
          res.status(500).json({message: err.message});
        }

        return true;
      }
      return false;
    });

    return truckId;
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
};

module.exports.writeLog = async (res, loadId, message) => {
  await Load.findById(loadId)
    .exec()
    .then(async load => {
      if (!load) {
        return res
          .status(404)
          .json({message: `Load with id ${loadId} hasn't found.`});
      }

      const loadLogs = load.logs;
      loadLogs.push({
        message,
        time: moment().format('Do MMMM YYYY, HH:mm:ss'),
      });

      try {
        await Load.findByIdAndUpdate(
          loadId,
          {$set: {logs: loadLogs}},
          {new: true}
        );
      } catch (err) {
        return res.status(500).json({message: err.message});
      }
    })
    .catch(err => res.status(500).json({message: err.message}));
};
