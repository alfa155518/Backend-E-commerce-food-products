const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Confirm password is required'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  photo: {
    type: Object,
    default: {
      url: 'https://pixabay.com/get/g02778b0ab92a3b1c1d23f3b2e43e6c97f4d09630d60ec185125c13054bb44cdeafa91ebd7194c9a9ee877a0448f55cbd71e0581ca728aec05e16559e386a1f35aa41bacb9cb5e22843687aa8af1ffbc6_640.png',
      publicId: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// set ConfirmPassword as undefined
userSchema.pre('save', async function (next) {
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
