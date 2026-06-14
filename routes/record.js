const express = require('express');
const record = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const path = require('path');
record.get('/account/records', (req, res)=>{
  res.sendFile(path.join(__dirname, "../public", "records.html"));
})

record.post('/account/records/new', async (req, res)=>{
  try {
  const { title } = req.body;
  const _user = await User.findById(req.session.user);

  if (!_user) {
    return res.json({
      problem: true,
      message: 'User Session Expired'
    })
  }
  for (var i = 0; i<_user.dailyRecords.length; i++) {
    if (title.toLowerCase().toString()===_user.dailyRecords[i].title.toLowerCase().toString()) {
      return res.json({
        problem: true,
        message: 'Record Already Exist. Please check title (date)'
      })
    }
  }
  await _user.dailyRecords.unshift({ title: title, sales: [], expense: []});
  await _user.save();
  return res.json({
    problem: false,
    message: 'New Record created successfully.'
  })
}
catch (err) {
  return res.json({
    problem: true,
    message: 'Server Error occurred. Please try again.'
  })
}
})

//let idCarrier = ''; //Global variable to handle ID
//When user wants to edit records
record.get('/account/records/edit/:id', async (req, res)=>{
  const _user = await User.findById(req.session.user);
  const { id } = await req.params;
  let serial = 0;
  let found = false;
  let sale_total = 0;
  let exp_total = 0;
  let net = 0;
  for (var i=0; i<_user.dailyRecords.length; i++) {
    if (id.toString()===_user.dailyRecords[i]._id.toString()) {
      found = true;
      serial = i;
      idCarrier = await _user.dailyRecords[i]._id.toString();
    }
  }
  if (found) {
    //Lets do some serious math here ans everything gonna be Good
    for (var i = 0; i<_user.dailyRecords[serial].sales.length; i++) {
      sale_total += _user.dailyRecords[serial].sales[i].cost;
    }
    for (var j = 0; j<_user.dailyRecords[serial].expense.length; j++) {
      exp_total += _user.dailyRecords[serial].expense[j].cost;
    }
    net = sale_total - exp_total;
    return res.render('record', { info: _user.dailyRecords[serial], idCarrier: idCarrier, sale_total: sale_total, exp_total: exp_total, net: net});
  }
  else {
    return res.redirect('/account/records');
  }
})


record.delete('/account/records/delete/:id', async (req, res)=>{
  try {
  const _user = await User.findById(req.session.user);
  await _user.dailyRecords.pull({ _id: req.params.id });
  await _user.save();
  return res.json({
    problem: false,
    message: 'Record Deleted Successfully'
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


record.post('/account/records/edit/add/sale', async (req, res)=>{
  let connected = false;
  try {
  const { storeID, idCarrier, newQN, name, id__, qn, total, time } = req.body;
  const _user = await User.findOne({ _id: req.session.user });
  //Boom from there if yes then we have ID
  //Lets add sale on target dailyrecord
  for (var i=0; i<_user.dailyRecords.length; i++) {
    if (idCarrier.toString()===_user.dailyRecords[i]._id.toString()) {
      await _user.dailyRecords[i].sales.push({ name: name, id: id__,qn: qn, cost: total, createdAt: time });
      await _user.save();

      connected = true;
    }
  }
  /*
  await User.updateOne(
    { _id: req.session.user, "dailyRecords._id": id },
    { $push: { sales: {
      name: name,
      qn: qn,
      cost: total,
      createdAt: time
    }}});
    */
  //Lets minus from the store
  if (connected) {
  let new_qn = newQN;
  
  await User.updateOne(
    { _id: req.session.user, "store._id": storeID },
    {
      $set: {
        "store.$.qn": new_qn
      }
    });
    //console.log(req.body);
  return res.json({
    problem: false,
    message: 'New Sale Added'
  })
  } else {
    return res.json({
      problem: true,
      message: 'An Error Occurred. Please try again.'
    })
  }
} catch (err) {
  console.log(err.message);
  return res.json({
    problem: true,
    message: 'Server Error Occurred. Please try again.'
  })
}

})

record.delete('/account/records/edit/delete/sale/:id', async (req, res)=>{
  const saleID = req.params.id;
  let recordTarget = 0;
  let saleTarget = 0;
  try {
    const _user = await User.findById(req.session.user);
    for (var i=0; i<_user.dailyRecords.length; i++) {
      for (var s=0; s<_user.dailyRecords[i].sales.length; s++) {
        if (_user.dailyRecords[i].sales[s]._id.toString()===saleID) {
            recordTarget = i;
            saleTarget = s;
        } 
      }
    }
    //Returning qn back to store product
    for (var i=0; i<_user.store.length; i++) {
      if (
        (_user.store[i].name.toString()===_user.dailyRecords[recordTarget].sales[saleTarget].name)
        &&
        (_user.store[i].id.toString()===_user.dailyRecords[recordTarget].sales[saleTarget].id.toString())
      )
      {
        let new_qn = 0;
        let store_qn = _user.store[i].qn;
        new_qn = store_qn + _user.dailyRecords[recordTarget].sales[saleTarget].qn;
          await User.updateOne(
            { _id: req.session.user, "store._id": _user.store[i]._id },
            {
            $set: {
              "store.$.qn": new_qn
            }
    });
      }
    }
    await _user.dailyRecords[recordTarget].sales.pull({ _id: saleID });
    await _user.save();
    return res.json({
      problem: false,
      message: 'Sale deleted successfully'
    })
  }
  catch (err) {
    console.log(err.message);
    return res.json({
      problem: true,
      message: 'Server Error Occurred. Please try again.'
    })
  }
});
record.put('/account/records/edit/sale/all', async (req, res)=>{
  try {
  const _user = await User.findById(req.session.user);
    await User.updateOne(
      { _id: req.session.user },
      { $set: { [`store.${req.body.storeSN}.qn`]: req.body.new_qn }}
    ); 
    await User.updateOne(
      { _id: req.session.user },
      { $set: { [`dailyRecords.${req.body.recordSN}.sales.${req.body.saleSN}.cost`]: req.body.cost }}
    );
    await User.updateOne(
      { _id: req.session.user },
      { $set: { [`dailyRecords.${req.body.recordSN}.sales.${req.body.saleSN}.qn`]: req.body.qn }}
    );
    return res.json({
      problem: false,
      message: 'Sale Updates successfully'
    })
  }
  catch (err) {
    console.log(err.message);
    return res.json({
      problem: true,
      message: 'Server Error Occurred. Please try again.'
    })
  }
})
record.put('/account/records/edit/sale/cost', async (req, res)=>{
  const { recordSN, saleSN, qn, cost } = req.body;
  try {
    await User.updateOne(
      { _id: req.session.user },
      { $set: { [`dailyRecords.${recordSN}.sales.${saleSN}.cost`]: cost }}
    );
    return res.json({
      problem: false,
      message: 'Sale Updated successfull'
    })
  }
  catch (err) {
    console.log(err.message)
    return res.json({
      problem: true,
      message: 'Server Error Occurred'
    })
  }
})
record.post('/account/records/edit/add/exp', async (req, res)=>{
  try { 
    const { idCarrier, title, cost, time } = req.body;
    const _user = await User.findById(req.session.user);
    for (var i=0; i<_user.dailyRecords.length; i++) {
      if (_user.dailyRecords[i]._id.toString()===idCarrier.toString()) {
        await _user.dailyRecords[i].expense.push({ title: title, cost: cost, createdAt: time });
        await _user.save();
        return res.json({
          problem: false,
          message: 'Expense Added Successfully'
        })
      }
    }
  }
  catch (err) {
    console.log(err.message);
    return res.json({
      problem: true,
      message: 'Server Error Occurred'
    })
  }
})
record.put('/account/records/edit/exp', async (req, res)=>{
  try {
     await User.updateOne(
      { _id: req.session.user },
      { $set: { [`dailyRecords.${req.body.ExpRecordSN}.expense.${req.body.ExpTargetSN}.title`]: req.body.title }}
    );
     await User.updateOne(
      { _id: req.session.user },
      { $set: { [`dailyRecords.${req.body.ExpRecordSN}.expense.${req.body.ExpTargetSN}.cost`]: req.body.cost }}
    );
    return res.json({
      problem: false,
      message: 'Expense Edited Successfully'
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
record.delete('/account/records/edit/delete/exp/:id', async (req, res)=>{
  try {
  const _user = await User.findById(req.session.user);
  let ExpRecordSN = 0;
  let ExpTargetSN = 0;
            for (var i=0; i<_user.dailyRecords.length; i++) {
                for (var e=0; e<_user.dailyRecords[i].expense.length; e++) {
                    if (_user.dailyRecords[i].expense[e]._id.toString()===req.params.id.toString()) {
                        ExpRecordSN = i;
                        ExpTargetSN = e;
                    }
                }
            }
            await _user.dailyRecords[ExpRecordSN].expense.pull({ _id: req.params.id });
            await _user.save();
            return res.json({
              problem: false,
              message: 'Expense Deleted successfully'
            })
          }
          catch (err) {
            console.log(`Back: ${err.message}`);
            return res.json({
              problem: true,
              message: 'Server Error Occurred'
            })
          }
})
module.exports = record;