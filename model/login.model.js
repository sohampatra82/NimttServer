const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minlength: [5, "Username must be 5 character"]
  },
  password: {
    type: String,
    require: true,
    minlength: [4, "Password must be 4 character"]
  },
  email: {
    type: String,
    require: true,
    minlength: [8, "Email must be 8 character"]
  }
});

const loginModel = mongoose.model("accountant-login", UserSchema);

module.exports = loginModel;
