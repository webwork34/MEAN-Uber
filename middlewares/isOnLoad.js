const Truck = require('./../models/truckModel');

module.exports = (req, res, next) => {
  const {userId} = req.user;

  Truck.find({created_by: userId})
    .exec()
    .then(trucks => {
      const isOL = trucks.some(truck => truck.status === 'OL');

      if (isOL) {
        return res
          .status(400)
          .json({message: `You can't do this action while you are on load`});
      }
      next();
    })
    .catch(err => res.status(500).json({message: err.message}));
};
