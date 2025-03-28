const mongoose = require ('mongoose')
const AccDbConnnect  = mongoose.connect('mongodb://0.0.0.0/adminPannel').then(() => {
    console.log('Accountant Database is ready');
    
})
module.exports = AccDbConnnect 