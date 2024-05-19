const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require(`../models/userModel`);
const errorHandler = require('./errorController');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require('../utils/cloudinary');
// signup User
const signup = async (req, res, next) => {
  try {
    // 1) Create a new user And Generate Token
    let user = await User.create(req.body);
    let token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 1) Hash PAssword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = await hashedPassword;

    // 1 Validation
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 2) Get The Path To Image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    // 3) Upload To Cloudinary
    const result = await cloudinaryUploadImage(imagePath);
    console.log(result);
    // 4) Get The User From DB

    // 5)Delete Old Profile photo if exit
    if (user.photo.publicId !== null) {
      await cloudinaryRemoveImage(user.photo.publicId);
    }
    // 6) Change the ProfilePhoto in The DB
    user.photo = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    // 7) Send Response)
    res.status(201).json({
      status: 'success',
      token,
      data: user,
    });
    // 8) Remove Img From Images Folder
    fs.unlinkSync(imagePath);
  } catch (err) {
    // Handel errors
    if (
      err.message.startsWith(
        'User validation failed: passwordConfirm: Passwords do not match'
      )
    ) {
      return next(
        errorHandler.confirmPasswordOrEmail(
          res,
          400,
          'You Must Confirm correct password'
        )
      );
    } else if (err.code === 11000) {
      return next(
        errorHandler.confirmPasswordOrEmail(res, 400, 'Email Already Exist')
      );
    } else {
      return errorHandler.globalError(res, err.message);
    }
  }
};

// login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Find the user
    const user = await User.findOne({ email: email }).select(`+password`);

    // 2) Check if the user & password exists
    if (!email || !password) {
      return next(errorHandler.userNotFound(res, 'User not found'));
    }

    // 2) Check if the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorHandler.confirmPasswordOrEmail(
        res,
        401,
        'Invalid email or password'
      );
    }

    // 3) verify token
    if (!req.headers.authorization) {
      return next(errorHandler.globalError(res, 'Invalid token'));
    }

    const token = await req.headers.authorization.split(' ')[1];
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    return next(errorHandler.globalError(res, err.message));
  }
};

// logout User
const logout = async (req, res, next) => {
  try {
    // 1) Get Token
    const token = await req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 2) Get User To Be Logged out
    let user = await User.findByIdAndDelete(decoded.id);

    if (!user) {
      return next(errorHandler.userNotFound(res, 'User not found'));
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    return next(errorHandler.globalError(res, err.message));
  }
};
module.exports = {
  signup,
  login,
  logout,
};
