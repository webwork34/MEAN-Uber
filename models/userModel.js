const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  createdDate: {
    type: String,
    default: moment().format('Do MMMM YYYY, HH:mm:ss'),
  },
  imageSrc: {
    type: String,
    default:
      'https://nogivruki.ua/wp-content/uploads/2018/08/default-user-image.png',
  },
  role: {
    type: String,
    enum: ['SHIPPER', 'DRIVER'],
    required: true,
  },
  pathLogs: {
    type: String,
    default: 'logs/logs.json',
  },
  resetToken: String,
  resetTokenExp: Date,
});

module.exports = mongoose.model('user', UserSchema);
