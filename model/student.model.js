const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  Stdid: {
    type: String,
    required: true,
    unique: true // Like a bank account number
  },
  Stdname: String,
  stdDateOfAdmission: String,
  StdAdmittedBy: String,
  stdUniversityName: String,
  Stdcourse: String,
  StdExamSession: String,
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
      paymentDate: { type: Date, default: Date.now }, // Transaction timestamp
      paymentMode: { type: String } // Payment mode (e.g., "Online", "Cash")
    }
  ],
  brkcoursefee: Number,
  brkprospectusfee: Number,
  brkexamfee: Number,
  brkothersfee: Number,
  brkdiscount: Number,
  stdmode: String,
  stdpaymode: String,
  brktotalpayble: Number, // Total payable amount
  stdtotalbreakdetails: {
    type: String,
    default: ""
  } // Details of the break-up
});

const StudentModel = mongoose.model("Student", StudentSchema);
module.exports = StudentModel;
