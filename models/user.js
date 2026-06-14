const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  masterkey: {
  type: String, default: "$2b$10$j2L4hm/uSV5T6d6OkRd9e.I.8/OaG3WJnK82RnL5cYDidJGV/yGiW"
},
names: [],
store: [
  {
    name: String,
    id: String,
    qn: Number,
    unitPrice: Number,
    unitFrom: Number,
    running_out: Number,
    sellingPrice: Number,
    createdAt: String
  }
], 
dailyRecords: [
  {
    title: String,
    sales: [
    {
    name: String,
    id: String,
    qn: Number,
    cost: Number,
    createdAt: String
  }
  ],
  expense: [
    {
      title: String,
      cost: Number,
      createdAt: String
    }
  ]
  }
],
  bin: {
    type: Array,
    default: []
  }
})
module.exports = mongoose.model('user', userSchema);