const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const TruckSchema = new Schema({
  created_by: {
    ref: 'user',
    type: Schema.Types.ObjectId,
  },
  assigned_to: {
    ref: 'user',
    type: Schema.Types.ObjectId,
  },
  type: {
    type: String,
    enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
  },
  status: {
    type: String,
    enum: ['OL', 'IS'],
  },
  created_date: {
    type: String,
    default: moment().format('Do MMMM YYYY, HH:mm:ss'),
  },
});

module.exports = mongoose.model('truck', TruckSchema);
