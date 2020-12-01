const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const {SECRET, SENDGRID_API_KEY} = require('./../config/config');
// const {regEmail} = require('./../emails/registration');
const {resetPassword} = require('./../emails/resetPassword');

const User = require('./../models/userModel');
const logFunc = require('./../logs/logFunc');

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {api_key: SENDGRID_API_KEY},
  })
);

// ======================= registration =======================
module.exports.register = async (req, res) => {
  const {email, password, role} = req.body;

  if (role !== 'DRIVER' && role !== 'SHIPPER') {
    return res.status(400).json({message: 'Role have to be DRIVER or SHIPPER'});
  }
  const candidate = await User.findOne({email});

  if (!candidate) {
    const salt = bcrypt.genSaltSync(10);
    const user = new User({
      email,
      password: bcrypt.hashSync(password, salt),
      role,
    });

    try {
      await user.save();
      await logFunc(req, res, user);

      // await transporter.sendMail(regEmail(email));

      return res.status(201).json({message: 'Profile created successfully'});
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  } else {
    return res
      .status(409)
      .json({message: `User with email - ${email} has already exist.`});
  }
};

// ======================= login =======================
module.exports.login = async (req, res) => {
  const {email, password} = req.body;
  const candidate = await User.findOne({email});

  if (candidate) {
    const passwordResult = bcrypt.compareSync(password, candidate.password);
    if (passwordResult) {
      const objUser = {
        email: candidate.email,
        userId: candidate._id,
        createdDate: candidate.createdDate,
        role: candidate.role,
        imageSrc: candidate.imageSrc,
        pathLogs: candidate.pathLogs,
      };
      const token = jwt.sign(objUser, SECRET, {expiresIn: '24h'});
      // const token = jwt.sign(objUser, SECRET, {expiresIn: '1h'});

      res.status(200).json({
        jwt_token: `Bearer ${token}`,
        // role: candidate.role,
      });

      logFunc(req, res, candidate);
    } else {
      return res
        .status(401)
        .json({message: `Passwords didn't match. Check and try again.`});
    }
  } else {
    return res.status(404).json({message: `User hasn't found.`});
  }
};

// ======================= forgot password =======================
module.exports.forgotPassword = async (req, res) => {
  const {email} = req.body;

  await User.findOne({email})
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({message: `Usera with email - ${email} hasn't found.`});
      }

      return res
        .status(200)
        .json({message: 'New password sent to your email address'});
    })
    .catch(err => res.status(500).json({message: err.status}));
};

// ======================= reset password =======================
module.exports.resetPassword = (req, res) => {
  const {email} = req.body;
  try {
    // сгенерируем рендомный ключ
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.status(500).json({message: err.status});
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({email});

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resetPassword(candidate.email, token));
        return res.status(200).json({
          message: 'Email with instructions has been sent successfuly',
          reset_token: token,
        });
      } else {
        return res
          .status(404)
          .json({message: `User with email ${email} hasn't found`});
      }
    });
  } catch (err) {
    return res.status(500).json({message: err.status});
  }
};

// ======================= create new password =======================
module.exports.createNewPassword = async (req, res) => {
  const {password, token} = req.body;

  if (!token) {
    return res
      .status(403)
      .json({message: 'No valid token for changing password'});
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: {$gt: Date.now()},
    });

    if (!user) {
      return res.status(403).json({message: 'No valid expiration date'});
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await logFunc(req, res, user);
    await user.save();
    return res
      .status(200)
      .json({message: 'Password has been changed successfuly'});
  } catch (err) {
    return res.status(500).json({message: err.status});
  }
};
