const fs = require('fs');
const url = require('url');
const moment = require('moment');

function checkLog(res, user, pathname) {
  if (!fs.existsSync('./logs/logs.json')) {
    fs.writeFileSync('./logs/logs.json', '');
  }

  fs.readFile('./logs/logs.json', (err, data) => {
    const logs = [];
    if (err) {
      throw err;
    } else {
      const obj = data.toString() !== '' ? JSON.parse(data) : {logs: logs};

      let operation;
      switch (pathname) {
        case 'register':
          operation = 'was created';
          break;
        case 'login':
          operation = 'logged in';
          break;
        case 'create_newPassword':
          operation = 'changed password successfuly';
          break;
      }

      obj.logs.push({
        userId: `${user._id}`,
        email: `${user.email}`,
        message: `User '${user.email}' ${operation}`,
        time: moment().format('Do MMMM YYYY, HH:mm:ss'),
      });

      fs.writeFile(
        './logs/logs.json',
        `${JSON.stringify(obj, null, 2)}`,
        (err, data) => {
          if (err) throw err;
          res.end(JSON.stringify(data));
        }
      );
    }
  });
}

module.exports = (req, res, user) => {
  try {
    const {pathname} = url.parse(req.url.slice(6), true);
    checkLog(res, user, pathname);
  } catch (error) {
    console.log('error: ', error);
    return res
      .status(500)
      .json({message: 'Something went wrong, try again later'});
  }
};
