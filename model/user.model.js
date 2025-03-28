// const mongoose = require('mongoose')
// const UserSchema = new mongoose.Schema({
//     // id: Number,
//     Stdid: {
//         type: String,
//         required: true,
//     },
//     Stdname: String,
//     stdDateOfAdmission : Date,
//     StdAdmittedBy: String,
//     stdUniversityName: String,
//     Stdcourse:String,
//     StdExamSession: String,
//     Stdgrandtotal: Number,

//     // ** NEW SCHEMA 
//     Stdfullfees:Number,
//     Stdpaidfee: Number, // Total Paid
    
//     Stdduefee: { 
//         type: Number, 
//         default: function() {
//             // Calculate the due fee based on the total fee minus the paid fee
//             return this.Stdfullfees - this.Stdpaidfee; 
//         } 
//     },
//     stdpaymentnumber : String,
//     Stdlastpaiddate: { type: Date },

//     // Payment history to track each payment
//     PaymentHistory: [
//         {
//             amountPaid: Number,
//             paymentDate: Date
//         }
//     ]
//    })
// // const DEFAULT_USERNAME = 'user';
// // const DEFAULT_PASSWORD = 'password';

// const UserModel = mongoose.model('admin', UserSchema)
// module.exports = UserModel
