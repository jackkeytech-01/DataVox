const express = require('express');
const substore = express.Router();
const User = require('../models/user')
substore.get('/account/store/sub', async (req, res)=>{
  const _user = User.findById(req.session.user);
  console.log(_user.sub_store);
  res.render('sub_store', {user: _user });
})
module.exports = substore;