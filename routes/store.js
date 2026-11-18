const express = require('express');
const store = express.Router();
const path = require('path');
const User = require('../models/user');
const mongoose = require('mongoose');
/*

=====================================
===STORE SECTOR ONLY WITH ALL ASSOCIATED DATA NEEDED
=====================================

*/
//=>Get all store products
store.get('/account/api/store/all', async (req, res)=>{
  const store_data = await User.findOne({ _id: req.session.user })
  return res.json(store_data.store);
})
//=>Adding one more store product
store.post('/account/api/store/add', async(req, res)=>{
  const { name, qn, unitPrice, unitFrom, runOut, sellPrice, time } = req.body;

})
//=>Getting targetted store product
store.get('/account/api/store/:id', async (req, res)=>{
  const { id } = req.params;
  const _user = await User.findOne({ _id: req.session.user });
  const _all = await _user.store;
  if (id>_all.length) {
    return res.status(500).sendFile(path.join(__dirname, "../public/views", "error.html"));
  }
  const _target = await _all[id];
  return res.status(200).json(_target);
})

//=>Updating the targetted store data
store.put('/account/api/store/:id', async (req, res)=>{
  const { id } = req.params;
  const _user = await User.findOne({ _id: req.session.user });


})

store.get('/account/store', async (req, res)=>{
  res.sendFile(path.join(__dirname, "../public/views", "store.html"))  
})

store.post('/account/store/add', async (req, res)=>{
  const { name, id__, qn, unitPrice, unitFrom, runOut, sellPrice, time } = req.body;
  const _user = await User.findById(req.session.user);
  let _exist = false;
  for (var i=0; i<_user.store.length; i++) {
    if (_user.store[i].id.toLowerCase()===id__.toLowerCase()) {
      _exist = true;
    }
  }
  if (_exist) {
    return res.json({
        problem: true,
        message: 'Product Already Exist. Please Check ID.'
      })
  }
  //Add new store product
  try {
  await User.updateOne(
    {_id: req.session.user },
    { $push: { store: {
      $each: [{      
      name: name,
      id: id__,
      qn: qn,
      unitPrice: unitPrice,
      unitFrom: unitFrom,
      running_out: runOut,
      sellingPrice: sellPrice,
      createdAt: time
    }],
    $position: 0
    }
  }
}
); 
let name_exist = false;
for (var i=0; i<_user.names.length; i++) {
  if (_user.names[i].toString().toLowerCase()===name.toString().toLowerCase()) {
    name_exist = true;
  }
}
if (name_exist) {
  //Pass
}
else {
await User.updateOne(
  {_id: req.session.user},
  { $push: { names: {
    $each: [name],
  $position: 0 
}
  }}
);
}
  return res.json({
    problem: false,
    message: 'Product Added successfully'
  })
} catch (err) {
  console.log(err.message);
  return res.json({
    problem: true,
    message: 'An Error Occured. Please try again.'
  })
}

})

store.delete('/account/store/delete/:id', async (req, res)=>{
  const id = req.params.id;
  try {
  const _user = await User.findById(req.session.user);
  await _user.store.pull({ _id: id });
  await _user.save();
  return res.json({
    problem: false,
    message: 'Product Deleted successfully'
  })
}
catch (err) {
  console.log(err.message);
  return res.json({
    problem: true,
    message: 'Server Error Occurred'
  })
}

})
//=>Editing and updating the store stuff
store.put('/account/store/edit/:id', async (req, res)=>{
  try {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const { name, id__, qn, unitPrice, unitFrom, runOut, sellPrice } = req.body;
  const _user = await User.findById(req.session.user);

  //Checking ID similarities
  for (var i=0; i<_user.store.length; i++) {
    if (
      (id__===_user.store[i].id)
       && 
      (_user.store[i]._id.toString() !== id.toString())
    ) {
      return res.json({
        problem: true,
        message: 'Product Already Exist. Please Check Product ID.'
      })
    }
  }
  await User.updateOne(
    {_id: req.session.user, "store._id": id },
    {
      $set: {
        "store.$.name": name,
        "store.$.id": id__,
        "store.$.qn": qn,
        "store.$.unitPrice": unitPrice,
        "store.$.unitFrom": unitFrom,
        "store.$.running_out": runOut,
        "store.$.sellingPrice": sellPrice
      }
    });
  return res.json({
    problem: false,
    message: 'Product Edited successfully.'
  })
  }
  catch (err) {
    console.log(err);
    console.log(err.message);
    return res.json({
      problem: true,
      message: 'Server Error Occurred'
    })
  }
});

module.exports = store;
