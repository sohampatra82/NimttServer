const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    Stdid: {
        type: String,
        required: true,
        unique: true // Like a bank account number
    },
    Stdname: String,
    stdDateOfAdmission: Date,
    StdAdmittedBy: String,
    stdUniversityName: String,
    Stdcourse: String,
    StdExamSession: String,
    Stdgrandtotal: Number, // Optional legacy field
    Stdfullfees: { 
        type: Number, 
        required: true // Total "loan" or course fee
    },
    Stdpaidfee: { 
        type: Number, 
        default: 0 // Running balance of payments
    },
    Stdduefee: { 
        type: Number, 
        default: function() {
            return this.Stdfullfees - this.Stdpaidfee; // Remaining "debt"
        }
    },
    stdpaymentnumber: String, // Latest transaction number
    Stdlastpaiddate: { type: Date }, // Last transaction date
    PaymentHistory: [
        {
            paymentNumber: { type: String, required: true }, // Transaction ID (e.g., "1st", "2nd")
            amountPaid: { type: Number, required: true }, // Transaction amount
            paymentDate: { type: Date, default: Date.now } // Transaction timestamp
        }
    ]
});

const StudentModel = mongoose.model('Student', StudentSchema);
module.exports = StudentModel;