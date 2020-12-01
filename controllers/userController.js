const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// =================== show user info ===================
module.exports.getUserInfoController = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        created_date: user.createdDate,
        role: user.role,
        imageSrc: user.imageSrc,
      },
    });
  } catch (error) {
    console.log('error: ', error);
    return res
      .status(500)
      .json({message: 'Something went wrong, try again later'});
  }
};

// =================== change user password ===================
module.exports.changePasswordController = async (req, res) => {
  const {oldPassword, newPassword} = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({message: 'You should pass old and new passwords'});
  }

  let passwordResult;

  await User.findById(req.user.userId)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(500)
          .json({message: 'Something went wrong, try again later'});
      }

      passwordResult = bcrypt.compareSync(oldPassword, user.password);
    })
    .catch(err => res.status(500).json({message: err.status}));

  if (!passwordResult) {
    return res
      .status(400)
      .json({message: 'Wrong old password. Check it and try again...'});
  }

  const salt = bcrypt.genSaltSync(10);

  User.findByIdAndUpdate(req.user.userId, {
    $set: {password: bcrypt.hashSync(newPassword, salt)},
  })
    .exec()
    .then(() =>
      res.status(200).json({message: 'Password has been changed successfully'})
    )
    .catch(err => res.status(500).json({message: err.status}));
};

// =================== delete user account ===================
module.exports.deleteUserAccountController = (req, res) => {
  User.findByIdAndDelete(req.user.userId)
    .then(user => {
      if (!user) return res.status(404).json({message: `User hasn't found`});
      return res.json({message: 'Profile deleted successfully'});
    })
    .catch(err => res.status(500).json({error: err.message}));
};

// =================== add user photo ===================
module.exports.addUserPhotoController = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {$set: {imageSrc: req.file.path}},
      {new: true}
    );
    return res.status(200).json({
      user: {
        userId: user._id,
        email: user.email,
        createdDate: user.createdDate,
        role: user.role,
        imageSrc: user.imageSrc,
      },
    });
  } catch (error) {
    console.log('error: ', error);
    return res
      .status(500)
      .json({message: 'Something went wrong, try again later'});
  }
};

// =================== show history ===================
module.exports.historyController = (req, res) => {
  try {
    fs.readFile('./logs/logs.json', (err, data) => {
      if (err) {
        throw err;
      } else {
        const {userId} = req.user;
        const {logs} = JSON.parse(data);
        const historyFiltered = logs.filter(log => log.userId === userId);

        return res.status(200).json({logs: historyFiltered});
      }
    });
  } catch (error) {
    console.log('error: ', error);
    return res
      .status(500)
      .json({message: 'Something went wrong, try again later'});
  }
};
