const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,/*
  masterkey: {
  type: String, default: "$2b$10$j2L4hm/uSV5T6d6OkRd9e.I.8/OaG3WJnK82RnL5cYDidJGV/yGiW"
},*/
schemaVersion: {
  type: Number,
  default: 2
},
phone: {
  type: String,
  default: ''
},
isFreezed: {
  type: Boolean,
  default: false
},
sockets : [{
  type: [String],
  default: []
  }
],
store_security: {
  isLocked: {
    type: Boolean,
    default: false
  },
  adminOnly: {
    type: Boolean,
    default: false
  }
},
store_fields: [
  {
    title: { type: String, default:'Name'},
    holder: { type: String, default:'Product Name'},
    unit: {type: String, default:''},
    show: { type:Boolean, default:true }
  }, 
  {
    title: { type: String, default: 'ID' },
    holder: { type: String, default:'Product ID'},
    unit: {type: String, default:''},
    show: { type:Boolean, default:true }
  }, 
  {
    title: { type: String, default: 'Quantity' },
    holder: { type: String, default:'Quantity'},
    unit: {type: String, default:'pcs'},
    show: { type:Boolean, default:true }
  }, 
  {
    title: { type: String, default: 'Whole Price' },
    holder: { type: String, default:'Product Whole Price'},
    unit: {type: String, default:'TZS'},
    show: { type:Boolean, default:true }
  }, 
  {
    title: { type: String, default: 'Whole From' },
    holder: { type: String, default:'Whole Price from'},
    unit: {type: String, default:'pcs'},
    show: { type:Boolean, default:true }
  }, 
  {
    title: { type: String, default: 'Running Alert' },
    holder: { type: String, default:'e.g. 10'},
    unit: {type: String, default:'pcs'},
    show: { type:Boolean, default:true }
  }, 
  {
    title: { type: String, default: 'Retail Price' },
    holder: { type: String, default:'e.g. 1000'},
    unit: {type: String, default:'TZS'},
    show: { type:Boolean, default:true }
  }
],
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
/*
userSchema.statics.toJSON = async function() {
  const userObject = this;
  delete userObject.password;
  delete userObject.email;
  delete userObject.bin;
  delete userObject.phone;
  return userObject;
};
/*
userSchema.methods.toJSON = async function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.email;
  delete userObject.store;
  delete userObject.names;
  delete userObject.dailyRecords;
  delete userObject.bin;
  delete userObject.phone;
  return userObject;
};
//=> To get all names of the products from the store
userSchema.methods.getNames = function () {
  const user = this
  const userObject = user.toObject()
  return userObject.names;
}
//=> To get all product from the store
userSchema.statics.getStore = async function () {
  const user = await this
  return user.store;
}
//=> To get daily Records recorded
userSchema.methods.getRecords = function () {
  const user = this
  const Object = user.toObject()
  return Object.dailyRecords;
}
//=> To get bin products and records
userSchema.methods.getBin = function () {
  const user = this
  const userObject = user.toObject()
  return userObject.bin;
}
  */
module.exports = mongoose.model('user', userSchema);