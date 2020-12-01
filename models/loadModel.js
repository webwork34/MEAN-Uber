const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const LoadSchema = new Schema({
  created_by: {
    ref: 'user',
    type: Schema.Types.ObjectId,
  },
  assigned_to: {
    ref: 'user',
    type: Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
    default: 'NEW',
  },
  state: {
    type: String,
    enum: [
      'En route to Pick Up',
      'Arrived to Pick Up',
      'En route to delivery',
      'Arrived to delivery',
    ],
  },
  name: {
    required: true,
    type: String,
  },
  payload: {
    required: true,
    type: Number,
    default: 0,
  },
  pickup_address: {
    required: true,
    type: String,
  },
  delivery_address: {
    required: true,
    type: String,
  },
  dimensions: {
    width: {type: Number, default: 0},
    length: {type: Number, default: 0},
    height: {type: Number, default: 0},
  },
  logs: [],
  created_date: {
    type: String,
    default: moment().format('Do MMMM YYYY, HH:mm:ss'),
  },
});

// prettier-ignore
LoadSchema.pre('save', function(next) {
  if (this.logs.length === 0) {
    this.logs.push({
      message: 'Load was created',
      time: moment().format('Do MMMM YYYY, HH:mm:ss'),
    });
  }
  next();
});

module.exports = mongoose.model('load', LoadSchema);
