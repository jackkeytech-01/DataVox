const mongoose = require('mongoose');
const tempo_url = process.env.tempo_url;
const MONGO_URI = process.env.MONGO_URI;
const connectDB = ()=>{
    mongoose.connect(MONGO_URI)
    .then(()=>{ console.log('Database Connected') })
    .catch((err)=>{ console.log(`Database Connection Error:\n${err}`)})
  
}
module.exports = connectDB;