const express = require('express');
const account = express.Router();
const User = require('../models/user');
const path = require('path');
const mongoose = require('mongoose');

account.get('/', (req, res)=>{
  let isLogged = false;
  if (req.session.user) {
    isLogged = true;
  }
   return res.render('landing', { isLogged: isLogged })
});

account.get('/account', async (req, res) => {
	if (req.session.user) {
		return res.render('account');
	} else {
		return res.redirect('/');
	}
});





/*
Records area and all routes to be handled
*/
//Sending the page when needed

account.get('/account/settings', (req, res)=>{
  res.sendFile(path.join(__dirname, "../public/views", "settings.html"));
})
account.get('/account/reports', (req, res)=>{
  res.sendFile(path.join(__dirname, "../public/views", "reports.html"));
})


/*
ALL API LINKS WITH THEIR USES
*/
//=>Getting the core user of the page
account.get('/account/api/user', async (req, res)=>{
  let _user = await User.findOne({ _id: req.session.user });
  return res.json({
    "name": _user.name,
    "dailyRecords": _user.dailyRecords
  });
})





module.exports = account;