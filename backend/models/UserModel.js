
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password hash is required']
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
}, {
  timestamps: true
});


const userModel = mongoose.model("User", userSchema);
export default userModel;
