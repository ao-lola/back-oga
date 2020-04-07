const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: false
  },

  phone: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  is_admin: {
    type: Boolean,
    checked: true, 
    default: false

  },

  date: {
    type: "Date",
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
