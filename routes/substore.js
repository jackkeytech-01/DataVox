const express = require('express');
const substore = express.Router();
const User = require('../models/user')
substore.get('/account/store/sub', async (req, res)=>{
  const _user = User.findById(req.session.user);
  console.log(_user);
  res.render('sub_store', { user: _user });
})

//Creating a new sub_store working with the api key encrypted in .env file
substore.post(process.env.NEW_SUB_STORE_API, async (req, res)=>{

})

//Updating the sub store itself API
substore.patch(process.env.UPDATE_SUB_STORE_API, async (req, res)=>{

})

//Deleting the sub store API
substore.delete(process.env.DELETE_SUB_STORE_API, async (req, res)=>{

})
//Invoking sub store itself, The API key for it
substore.get(process.env.GET_SUB_STORE_API, async (req, res)=>{

})

module.exports = substore;