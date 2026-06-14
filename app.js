const express = require('express')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') })
const app = express();
const auth = require('./routes/auth')
const account = require('./routes/account');
const store = require('./routes/store');
const record = require('./routes/record');
const reports = require('./routes/reports')
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const connectDB = require('./config/db')
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
app.use(express.json())
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}));
connectDB();
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))
const logger = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}
app.use('/account', logger);
app.use('/', auth);
app.use('/', account);
app.use('/', store);
app.use('/', record);
app.use('/',reports);
app.listen(PORT, ()=>{
  console.log(`App running on port ${PORT}`);
})