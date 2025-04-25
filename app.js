require("dotenv").config();
const express = require("express");
const app = express();
const StudentModel = require("./model/student.model");
const dbConnect = require("./config/db");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// All Routes from Your Original Code
app.get("/", (req, res) => {
  res.render("select");
});
app.get("/nimtt", (req, res) => {
  res.render("select");
});
app.post("/", (req, res) => {
  const { account, admin } = req.body;
  if (account) res.render("accountantlogin");
  else if (admin) res.render("adminlogin");
});
app.post("/nimtt", (req, res) => {
  const { account, admin } = req.body;
  if (account) res.render("accountantlogin");
  else if (admin) res.render("adminlogin");
});

app.get("/accountantlogin", (req, res) => {
  res.render("select");
});
app.get("/AccountantIndex", (req, res) => {
  res.render("select");
});

app.get("/adminlogin", (req, res) => {
  res.render("select");
});
app.get("/AdminIndex", (req, res) => {
  res.render("select");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/select", (req, res) => {
  res.render("select");
});

app.get('/account', (req, res) => {
    res.render('account');
});
// app.get("/account", (req, res) => {
//   res.render("select");
// });

// app.get('/admin', (req, res) => {
//     res.render('admin');
// });

// app.get('/money-receipt-print', (req, res) => {
//     res.render('accountPrint');
// });

app.get('/admin-fetch-data', (req, res) => {
    res.render('AdminDataFetch');
});
// app.get("/admin-fetch-data", (req, res) => {
//   res.render("select");
// });

// app.get('/admin-fetch-update-data', (req, res) => {
//     res.render('AdminFetchUptadeData');
// });

app.get("/back", (req, res) => {
  res.render("back");
});

app.post("/back", (req, res) => {
  res.render("back");
});

app.get("/accountantback", (req, res) => {
  res.render("accountantback");
});

app.post("/accountantback", (req, res) => {
  res.render("accountantback");
});

app.get("/AccountantUpdateStudentDetails", (req, res) => {
  res.render("AccountantUpdateStudentDetails");
});

// app.get('/Accountant-SeeUpdated-Student-And-Edit', (req, res) => {
//     res.render('AccountantSeeUpdatedStudentAndEdit');
// });

// app.get('/AccountantEditPage', (req, res) => {
//     res.render('AccountantEditPage');
// });

app.get("/adminlogin", (req, res) => {
  res.render("adminlogin");
});
app.post("/adminlogin", (req, res) => {
  res.render("adminlogin");
});
app.get("/accountantlogin", (req, res) => {
  res.render("accountantlogin");
});
app.post("/accountantlogin", (req, res) => {
  res.render("accountantlogin");
});

// Admin Fetch All Payment Records
app.post("/admin-fetch-data", async (req, res) => {
  try {
    const { Stdid } = req.body;
    if (!Stdid) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await StudentModel.findOne({ Stdid });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Admin Fetch Updated Data (Optional, kept from original)
app.post("/admin-fetch-update-data", async (req, res) => {
  try {
    const { Stdid } = req.body; // Renamed UpdateStudentId to Stdid for consistency
    if (!Stdid) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await StudentModel.findOne({ Stdid });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching updated student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Accountant Update Payment via /money-recipt (Fixed Fee Calculation)
app.get("/money-recipt", (req, res) => {
  res.render("account");
});

app.post("/money-recipt", async (req, res) => {
  const { Stdid, Stdname, stdDateOfAdmission, StdAdmittedBy, stdUniversityName, Stdcourse, StdExamSession, Stdgrandtotal, Stdfullfees, Stdpaidfee: amountPaidStr, stdpaymentnumber, Stdlastpaiddate, brkcoursefee, brkprospectusfee, brkexamfee, brkothersfee, brkdiscount, brktotalpayble } = req.body; // Current payment amount as string

  try {
    // Convert and validate inputs
    const amountPaid = Number(amountPaidStr);
    const fullFees = Number(Stdfullfees);
    if (isNaN(amountPaid) || amountPaid < 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }
    if (isNaN(fullFees) || fullFees < 0) {
      return res.status(400).json({ message: "Invalid full fees amount" });
    }

    const student = await StudentModel.findOne({ Stdid });

    if (!student) {
      // Create new student account if not found
      const newStudent = await StudentModel.create({
        Stdid,
        Stdname,
        stdDateOfAdmission,
        StdAdmittedBy,
        stdUniversityName,
        Stdcourse,
        StdExamSession,
        Stdgrandtotal,
        brkcoursefee,
        brkprospectusfee,
        brkexamfee,
        brkothersfee,
        brkdiscount,
        brktotalpayble,
        Stdfullfees: fullFees,
        Stdpaidfee: amountPaid,
        Stdduefee: fullFees - amountPaid,
        stdpaymentnumber,
        Stdlastpaiddate: Stdlastpaiddate || new Date(),
        PaymentHistory: [
          {
            paymentNumber: stdpaymentnumber,
            amountPaid,
            paymentDate: Stdlastpaiddate || new Date()
          }
        ]
      });
      // console.log('New student created:', newStudent);
    } else {
      // Update existing student account
      const newPaidFee = student.Stdpaidfee + amountPaid;
      const newDueFee = student.Stdfullfees - newPaidFee;

      const updatedStudent = await StudentModel.findOneAndUpdate(
        { Stdid },
        {
          $push: {
            PaymentHistory: {
              paymentNumber: stdpaymentnumber,
              amountPaid,
              paymentDate: Stdlastpaiddate || new Date()
            }
          },
          $set: {
            Stdpaidfee: newPaidFee,
            Stdduefee: newDueFee,
            stdpaymentnumber,
            Stdlastpaiddate: Stdlastpaiddate || new Date()
          }
        },
        { new: true }
      );
      // console.log('Student updated:', updatedStudent);
    }

    res.render("back");
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Accountant Update via /update-student-details (Kept from original)
app.get("/update-student-details", (req, res) => {
  res.render("AccountantEditPage");
});

app.post("/update-student-details", async (req, res) => {
  const {
    UpdateStudentId: Stdid,
    UpdateStudenName: Stdname,
    UpdateStudentDateOfAdmission: stdDateOfAdmission,
    UpdateStudentAdmittedBy: StdAdmittedBy,
    UpdateStudentUniversityName: stdUniversityName,
    UpdateStudentCourse: Stdcourse,
    UpdateStudentExamSession: StdExamSession,
    UpdateStudentFullfees: Stdfullfees,
    UpdateStudentPaidfees: amountPaidStr,
    Updatepaymentnumber: stdpaymentnumber,
    UpdateStudentLastPayDate: Stdlastpaiddate
  } = req.body;

  try {
    const amountPaid = Number(amountPaidStr);
    const fullFees = Number(Stdfullfees);
    if (isNaN(amountPaid) || amountPaid < 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }
    if (isNaN(fullFees) || fullFees < 0) {
      return res.status(400).json({ message: "Invalid full fees amount" });
    }

    const student = await StudentModel.findOne({ Stdid });

    if (!student) {
      await StudentModel.create({
        Stdid,
        Stdname,
        stdDateOfAdmission,
        StdAdmittedBy,
        stdUniversityName,
        Stdcourse,
        StdExamSession,
         brkcoursefee,
        brkprospectusfee,
        brkexamfee,
        brkothersfee,
        brkdiscount,
        brktotalpayble,
        Stdfullfees: fullFees,
        Stdpaidfee: amountPaid,
        Stdduefee: fullFees - amountPaid,
        stdpaymentnumber,
        Stdlastpaiddate: Stdlastpaiddate || new Date(),
        PaymentHistory: [
          {
            paymentNumber: stdpaymentnumber,
            amountPaid,
            paymentDate: Stdlastpaiddate || new Date()
          }
        ]
      });
    } else {
      const newPaidFee = student.Stdpaidfee + amountPaid;
      const newDueFee = student.Stdfullfees - newPaidFee;

      await StudentModel.findOneAndUpdate(
        { Stdid },
        {
          $push: {
            PaymentHistory: {
              paymentNumber: stdpaymentnumber,
              amountPaid,
              paymentDate: Stdlastpaiddate || new Date()
            }
          },
          $set: {
            Stdpaidfee: newPaidFee,
            Stdduefee: newDueFee,
            stdpaymentnumber,
            Stdlastpaiddate: Stdlastpaiddate || new Date()
          }
        },
        { new: true }
      );
    }

    res.render("accountantback");
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Accountant Login
app.post("/AccountantIndex", (req, res) => {
  const { username, password } = req.body;
  const DEFAULT_AccUSERNAME = "nimtt@accountant";
  const DEFAULT_AccPASSWORD = "account12345";

  try {
    if (username === DEFAULT_AccUSERNAME && password === DEFAULT_AccPASSWORD) {
      res.render("account");
    } else {
      res.render("accountantlogin");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.render("error");
  }
});

// Admin Login
app.post("/AdminIndex", (req, res) => {
  const { username, password } = req.body;
  const DEFAULT_AdminUSERNAME = "nimtt@admin";
  const DEFAULT_AdminPASSWORD = "admin56789";

  try {
    if (
      username === DEFAULT_AdminUSERNAME &&
      password === DEFAULT_AdminPASSWORD
    ) {
      res.render("AdminDataFetch");
    } else {
      res.render("adminlogin");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.render("error");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/nimtt`);
});
