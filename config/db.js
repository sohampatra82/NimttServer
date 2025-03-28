const mongoose = require('mongoose')
const dbConnect = mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Admin Database is ready');
    
})

module.exports = dbConnect
