require("dotenv").config();
const express = require("express");
const app = express();
const StudentModel = require("./model/student.model");
const loginModel = require("./model/login.model");
const adminLoginModel = require('./model/adminlogin.model')
const dbConnect = require("./config/db");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { body, validationResult} = require("express-validator");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
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
app.get("/sign-up", (req, res) => {
  res.render("signup");
});
app.get("/admin-signup", (req, res) => {
  res.render("adminsignup");
});

// app.post("/", (req, res) => {
//   const { account, admin } = req.body;
//   if (account) res.render("accountantlogin");
//   else if (admin) res.render("adminlogin");
// });
// app.post("/nimtt", (req, res) => {
//   const { account, admin } = req.body;
//   if (account) res.render("accountantlogin");
//   else if (admin) res.render("adminlogin");
// });

app.get("/accountantlogin", (req, res) => {
  res.render("accountantlogin");
});
app.get("/AccountantIndex", (req, res) => {
  res.render("select");
});

app.get("/adminlogin", (req, res) => {
  res.render("adminlogin");
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
// app.get('*', function (req, res){
//   res.redirect("/nimtt");
// });



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
 

// route: /api/student/:id
app.get("/api/student/:id", async (req, res) => {
  try {
    const student = await StudentModel.findOne({ Stdid: req.params.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
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
// app.post("/admin-fetch-update-data", async (req, res) => {
//   try {
//     const { Stdid } = req.body; // Renamed UpdateStudentId to Stdid for consistency
//     if (!Stdid) {
//       return res.status(400).json({ message: "Student ID is required" });
//     }

//     const student = await StudentModel.findOne({ Stdid });
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.status(200).json(student);
//   } catch (error) {
//     console.error("Error fetching updated student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Accountant Update Payment via /money-recipt (Fixed Fee Calculation)
app.get("/money-recipt", (req, res) => {
  res.render("account");
});

app.post("/money-recipt", async (req, res) => {
  const { Stdid, Stdname, stdDateOfAdmission, StdAdmittedBy, stdUniversityName, Stdcourse, StdExamSession, Stdgrandtotal, Stdfullfees, stdmode, Stdpaidfee: amountPaidStr, stdpaymentnumber, Stdlastpaiddate, brkcoursefee, brkprospectusfee, brkexamfee, brkothersfee, brkdiscount, brktotalpayble, stdtotalbreakdetails } = req.body; // Current payment amount as string

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
        stdmode,
        StdExamSession,
        Stdgrandtotal,
        brkcoursefee,
        brkprospectusfee,
        brkexamfee,
        brkothersfee,
        brkdiscount,
        brktotalpayble,
        stdtotalbreakdetails,
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

    res.json({ success: true, message: "Payment submitted successfully!" });

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Accountant Edit Page via /AccountantEditPage (Kept from original)
app.post("/admin-update-data", async (req, res) => {
  try {
    const {
      Stdid,
      Stdname,
      StdAdmittedBy,
      stdUniversityName,
      Stdcourse,
      stdmode,
      stdDateOfAdmission,
      StdExamSession,
      Stdfullfees,
      Stdpaidfee,
      Stdduefee,
      stdtotalbreakdetails
    } = req.body;

    if (!Stdid) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Validate numeric fields
    const fullFees = Number(Stdfullfees);
    const paidFee = Number(Stdpaidfee);
    const dueFee = Number(Stdduefee);
    if (isNaN(fullFees) || fullFees < 0) {
      return res.status(400).json({ message: "Invalid full fees amount" });
    }
    if (isNaN(paidFee) || paidFee < 0) {
      return res.status(400).json({ message: "Invalid paid fee amount" });
    }
    if (isNaN(dueFee) || dueFee < 0) {
      return res.status(400).json({ message: "Invalid due fee amount" });
    }

    // Ensure paid fee and due fee align with full fees
    if (fullFees !== paidFee + dueFee) {
      return res
        .status(400)
        .json({ message: "Full fees must equal paid fee plus due fee" });
    }

    const student = await StudentModel.findOne({ Stdid });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update student document with provided fields
    const updatedStudent = await StudentModel.findOneAndUpdate(
      { Stdid },
      {
        $set: {
          Stdname: Stdname || student.Stdname,
          StdAdmittedBy: StdAdmittedBy || student.StdAdmittedBy,
          stdUniversityName: stdUniversityName || student.stdUniversityName,
          Stdcourse: Stdcourse || student.Stdcourse,
          stdmode: stdmode || student.stdmode,
          stdDateOfAdmission: stdDateOfAdmission || student.stdDateOfAdmission,
          StdExamSession: StdExamSession || student.StdExamSession,
          Stdfullfees: fullFees,
          Stdpaidfee: paidFee,
          Stdduefee: dueFee,
          stdtotalbreakdetails:
            stdtotalbreakdetails || student.stdtotalbreakdetails
        }
      },
      { new: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
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
        stdmode,
        StdExamSession,
         brkcoursefee,
        brkprospectusfee,
        brkexamfee,
        brkothersfee,
        brkdiscount,
        brktotalpayble,
        stdtotalbreakdetails,
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
// app.post("/AccountantIndex", (req, res) => {
//   const { username, password } = req.body;
//   const DEFAULT_AccUSERNAME = process.env.ACC_ID ;
//   const DEFAULT_AccPASSWORD = process.env.ACC_PASS ;

//   try {
//     if (username === DEFAULT_AccUSERNAME && password === DEFAULT_AccPASSWORD) {
//       res.render("account");
//     } else {
//       res.render("accountantlogin");
//     }
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     res.render("error");
//   }
// });

// SIGN UP FOR ACCOUNTANT
app.post(
  "/signup",
  body("email").isEmail().trim().isLength({ min: 8 }),
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">${errorMessage}</p>
                <a href="/sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUser = await loginModel.findOne({
        $or: [{ username }, { email }]
      });
      if (existingUser) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Sign-up Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or email is already in use.</p>
                <a href="/sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Hash password and create new user
      const hashPassword = await bcrypt.hash(password, 10);
      await loginModel.create({
        username,
        email,
        password: hashPassword
      });

      // Show success message and redirect to login
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Sign-up Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Sign-up Successful</h2>
              <p class="text-gray-700 mb-4">Your account has been successfully created.</p>
              <p class="text-gray-600">Redirecting to the login page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/accountantlogin";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Sign-up error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during sign-up. Please try again later.</p>
              <a href="/sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

// SIGN IN FOR ACCOUNTANT
app.post(
  "/AccountantIndex",
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">The username must be at least 5 characters, and the password must be at least 4 characters.</p>
                <a href="/accountantlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, password } = req.body;

      // Check if user exists
      const Employeedata = await loginModel.findOne({ username });
      if (!Employeedata) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/accountantlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Verify password
      const loginPassWord = await bcrypt.compare(
        password,
        Employeedata.password
      );
      if (!loginPassWord) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/accountantlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          UserID: Employeedata._id,
          username: Employeedata.username,
          email: Employeedata.email
        },
        process.env.JWT_SECRET
      );

      // Set token in cookie and show success message
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Login Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Login Successful</h2>
              <p class="text-gray-700 mb-4">You have successfully logged in to your account.</p>
              <p class="text-gray-600">Redirecting to the accountant page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/account";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Login error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during login. Please try again later.</p>
              <a href="/accountantlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

//UPDATE PASSWORD FOR ACCOUNTANT
app.get("/change-password", (req, res) => {
  res.render("changepassword");
});


// UPDATE PASSWORD FOR ACCOUNTANT
app.post(
  "/change-password",
  [
    body("currentPassword").trim().isLength({ min: 4 }).withMessage("Current password must be at least 4 characters"),
    body("newPassword").trim().isLength({ min: 4 }).withMessage("New password must be at least 4 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirm password do not match");
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success: false, error: errorMessage });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify JWT token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Authentication required" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid or expired token" });
      }

      // Find user by ID from token
      const user = await loginModel.findById(decoded.UserID);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Current password is incorrect" });
      }

      // Hash new password and update user
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      // Clear token cookie to force re-login
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      return res
        .status(500)
        .json({
          success: false,
          error: "An unexpected error occurred. Please try again later."
        });
    }
  }
);



//SIGN UP FOR ADMIN
app.post(
  "/admin-signup",
  body("email").isEmail().trim().isLength({ min: 8 }),
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">${errorMessage}</p>
                <a href="/admin-signup" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUser = await adminLoginModel.findOne({
        $or: [{ username }, { email }]
      });
      if (existingUser) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Sign-up Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or email is already in use.</p>
                <a href="/admin-signup" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Hash password and create new user
      const hashPassword = await bcrypt.hash(password, 10);
      await adminLoginModel.create({
        username,
        email,
        password: hashPassword
      });

      // Show success message and redirect to login
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Sign-up Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Sign-up Successful</h2>
              <p class="text-gray-700 mb-4">Your account has been successfully created.</p>
              <p class="text-gray-600">Redirecting to the login page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/adminlogin";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Sign-up error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during sign-up. Please try again later.</p>
              <a href="/sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

// SIGN IN FOR ADMIN
app.post(
  "/AdminIndex",
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">The username must be at least 5 characters, and the password must be at least 4 characters.</p>
                <a href="/adminlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, password } = req.body;

      // Check if user exists
      const Employeedata = await adminLoginModel.findOne({ username });
      if (!Employeedata) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/adminlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Verify password
      const loginPassWord = await bcrypt.compare(
        password,
        Employeedata.password
      );
      if (!loginPassWord) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/adminlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          UserID: Employeedata._id,
          username: Employeedata.username,
          email: Employeedata.email
        },
        process.env.JWT_SECRET
      );

      // Set token in cookie and show success message
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Login Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Login Successful</h2>
              <p class="text-gray-700 mb-4">You have successfully logged in to your account.</p>
              <p class="text-gray-600">Redirecting to the admin page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/admin-fetch-data";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Login error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during login. Please try again later.</p>
              <a href="/adminlogin" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);


app.get("/admin-change-password", (req, res) => {
  res.render("adminchangepass");
});

// UPDATE PASSWORD FOR ACCOUNTANT
app.post(
  "/admin-change-password",
  [
    body("currentPassword").trim().isLength({ min: 4 }).withMessage("Current password must be at least 4 characters"),
    body("newPassword").trim().isLength({ min: 4 }).withMessage("New password must be at least 4 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirm password do not match");
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success: false, error: errorMessage });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify JWT token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Authentication required" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid or expired token" });
      }

      // Find user by ID from token
      const user = await adminLoginModel.findById(decoded.UserID);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Current password is incorrect" });
      }

      // Hash new password and update user
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      // Clear token cookie to force re-login
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      return res
        .status(500)
        .json({
          success: false,
          error: "An unexpected error occurred. Please try again later."
        });
    }
  }
);

// Admin Login
// app.post("/AdminIndex", (req, res) => {
//   const { username, password } = req.body;
//   const DEFAULT_AdminUSERNAME = process.env.ADMIN_ID ;
//   const DEFAULT_AdminPASSWORD = process.env.ADMIN_PASS ;  ;

//   try {
//     if (
//       username === DEFAULT_AdminUSERNAME &&
//       password === DEFAULT_AdminPASSWORD
//     ) {
//       res.render("AdminDataFetch");
//     } else {
//       res.render("adminlogin");
//     }
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     res.render("error");
//   }
// });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/nimtt`);
});
