const express = require('express');
const auth = express.Router();
const path = require('path');
const bcrypt = require('bcrypt')
const User = require('../models/user');
auth.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '../public', 'login.html'))
})
auth.get('/signup', (req, res)=>{
  res.sendFile(path.join(__dirname, '../public','sign.html'))
})
auth.get('/logout', async (req, res)=>{
  req.session.destroy();
  res.redirect('/login')
})
auth.post('/account/updateProfile', async (req, res)=>{
  const { name, password, password1, password2 } = req.body;
  const user = await User.findOne({ _id: req.session.user });
  if (!user) {return res.json({ problem: true, message: 'Session Expired. Please Log in Again.'})}
  if (!password && !password2 && !password1) {
    //Just update user name
    try {
    await User.findOneAndUpdate(
      {"_id": req.session.user },
      {$set:{
        "name": name
      }})
    return res.json({
      problem: false,
      message: 'Profile Updated Successfully'
    })
  }
  catch (err) {
    console.log(err.message);
    return res.json({
      problem: true,
      message: 'An Error Occured'
    })
  }
  }
  else {
  //const MASTER_KEY = process.env.MASTER_KEY;
  const isMatch = await bcrypt.compare(password, user.password);
  const isMasterMatch = await bcrypt.compare(password, user.masterkey);
  if (!isMatch && !isMasterMatch) {
    return res.json({
      problem: true,
      message: 'Incorrect current Password'
    })
  }
  else if (isMatch || isMasterMatch) {
  const newHashedPassword = await bcrypt.hash(password1, 10);
  //Update every thing
  try {
  await User.findOneAndUpdate(
    {"_id": req.session.user },
    { $set: {
      "name": name,
      "password": newHashedPassword
    }})
  return res.json({
    problem: false,
    message: 'Profile Updated Successfully'
  })
} catch (err) {
  console.log(err.message);
  return res.json({
    problem: true,
    message: 'An Error Occured'
  })
}
}
}
})
auth.post('/login', async (req, res)=>{
  const { username, password } = req.body;
  const userExist = await User.findOne({ username: username });

  if (!userExist) {
    return res.json({
      success:false,
      message: 'Username does not exist'
    })
  }
  const MASTER_KEY = process.env.MASTER_KEY;
  if (password === MASTER_KEY) {
    req.session.user = userExist._id;
    return res.json({
      success: true,
      message: 'Master Key Unlocked'
    })
  }
  const isMatch = await bcrypt.compare(password, userExist.password)
  if (!isMatch) {
    return res.json({
      success:false,
      message: 'Incorrect Password'
    })
  }
  req.session.user = userExist._id;
  return res.json({
    success: true,
    message: 'Go on...'
  })
})

auth.post('/signup', async(req, res)=>{
  const { name, username, email, password} = req.body;
  const userExist = await User.findOne({ username: username });
  if (userExist) {
    return res.json({
      success: false,
      message: 'Username Already Exist'
    })
  }
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.json({
      success:false,
      message: 'Email already exist'
    })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({
    name: name,
    username: username,
    email: email,
    password: hashedPassword
  })
  await newUser.save();
  return res.json({
    success: true,
    messsage: 'Account created!'
  })
})
module.exports = auth;