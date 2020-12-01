const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
// const {HOST, PORT_DB, NAME_DB} = require('./config/devConfig');
const {MONGO_URI} = require('./config/config');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const loadRouter = require('./routers/loadRouter');
const truckRouter = require('./routers/truckRouter');

app.use(cors());

const PORT = process.env.PORT || 8080;

mongoose
  // .connect(`mongodb://${HOST}:${PORT_DB}/${NAME_DB}`, {
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB has been started...'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(helmet());
app.use(compression());

app.use('/uploads', express.static('uploads'));
app.use('/history', express.static('logs'));

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', loadRouter);
app.use('/api', truckRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/client'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'client', 'dist', 'client', 'index.html')
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}...`);
});
