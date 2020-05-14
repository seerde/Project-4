const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  image: {
    type: String,
    default: "ava2.jpg",
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  score: {
    type: Number,
    default: 0,
  },

  feedback: {
    type: Number,
    default: 0,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  let hash = bcrypt.hashSync(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

let User = mongoose.model("User", userSchema);
module.exports = User;
