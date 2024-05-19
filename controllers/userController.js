const User = require(`../models/userModel`);
const errorHandler = require(`./errorController`);

// Get Single User By Id
const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return next(errorHandler.userNotFound(res, 404, 'User not found'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    return next(errorHandler.globalError(res, err.message));
  }
};

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().select('+password').select('-__v');
    if (!allUsers) {
      return next(errorHandler.userNotFound(res, 404, 'Users not found'));
    }
    res.status(200).json({
      status: 'success',
      results: allUsers.length,
      data: {
        allUsers,
      },
    });
  } catch (err) {
    return next(errorHandler.globalError(res, err.message));
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(errorHandler.userNotFound(res, 404, 'User not found'));
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
  getSingleUser,
  getAllUsers,
  deleteUser,
};
