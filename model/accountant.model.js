// const mongoose = require('mongoose')
// const UserSchema = new mongoose.Schema({
//     // id: Number,
//     UpdateStudentId: {
//          type: String,
//         required: true,
        
//     },
//     UpdateStudenName: String,
//     UpdateStudentDateOfAdmission : Date,
//     UpdateStudentAdmittedBy: String,
//     UpdateStudentUniversityName: String,
//     UpdateStudentCourse:String,
//     UpdateStudentExamSession: String,
//     // Stdgrandtotal: Number,

//     // ** NEW SCHEMA 
//     UpdateStudentFullfees:Number,
//     UpdateStudentPaidfees: Number, // Total Paid
    
//     UpdateStudentDuefees: { 
//         type: Number, 
//         default: function() {
//             // Calculate the due fee based on the total fee minus the paid fee
//             return this.UpdateStudentFullfees - this.UpdateStudentPaidfees; 
//         } 
//     },
//     Updatepaymentnumber : String,
//     UpdateStudentLastPayDate: Date ,

//     // Payment history to track each payment
//     // PaymentHistory: [
//     //     {
//     //         amountPaid: Number,
//     //         paymentDate: Date
//     //     }
//     // ]

//  // Payment History: Tracks all past payments
//     PaymentHistory: [
//         {
//             paymentNumber: String,
//             amountPaid: Number,
//             paymentDate: Date
//         }
//     ]

//    })
// // const DEFAULT_USERNAME = 'user';
// // const DEFAULT_PASSWORD = 'password';

// const AccUserModel = mongoose.model('Accountant', UserSchema)
// module.exports = AccUserModel
