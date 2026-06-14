const express = require('express');
const account = express.Router();
const User = require('../models/user');
const path = require('path');
const mongoose = require('mongoose');

account.get('/', (req, res)=>{
  if (req.session.user) {
    return res.redirect('/account');
  }
  else {
  return res.sendFile(path.join(__dirname, '../public', 'landing.html'));
  }
});
account.get('/account', (req, res)=>{
  if (req.session.user) {
  res.sendFile(path.join(__dirname, '../public', 'account.html'))
}
else {
  res.redirect('/');
}
});







/*
Records area and all routes to be handled
*/
//Sending the page when needed

account.get('/account/settings', (req, res)=>{
  res.sendFile(path.join(__dirname, "../public", "settings.html"));
})
account.get('/account/reports', (req, res)=>{
  res.sendFile(path.join(__dirname, "../public", "reports.html"));
})


/*
ALL API LINKS WITH THEIR USES
*/
//=>Getting the core user of the page
account.get('/account/api/user', async (req, res)=>{
  const _user = await User.findOne({ _id: req.session.user });
  return res.json(_user);
})

//=>Adding one more store product
account.post('/account/api/store/add', async(req, res)=>{
  const { name, qn, unitPrice, unitFrom, runOut, sellPrice, time } = req.body;

})
//=>Getting targetted store product
account.get('/account/api/store/:id', async (req, res)=>{
  const { id } = req.params;
  const _user = await User.findOne({ _id: req.session.user });
  const _all = await _user.store;
  if (id>_all.length) {
    return res.status(500).sendFile(path.join(__dirname, "public", "error.html"));
  }
  const _target = await _all[id];
  return res.status(200).json(_target);
})

//=>Updating the targetted store data
account.put('/account/api/store/:id', async (req, res)=>{
  const { id } = req.params;
  const _user = await User.findOne({ _id: req.session.user });


})
//=>Getting all records
account.get('/account/api/records', async (req, res)=>{
  const _user = await User.findOne({ _id: req.session.user });
  const _records = await _user.dailyRecords;
  res.status(200).json(_records);
})





module.exports = account;