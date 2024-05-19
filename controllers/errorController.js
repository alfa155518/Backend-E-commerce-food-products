// 1) Global Error
const globalError = (res, message) => {
  return res.status(500).json({
    status: 'error',
    message,
  });
};

// 2) User Not Found Error
const userNotFound = (res, message) => {
  return res.status(404).json({
    status: 'error',
    message: message,
  });
};

// 3) Confirm Password Or Email Error
const confirmPasswordOrEmail = (res, status, message) => {
  return res.status(status).json({
    status: 'error',
    message: message,
  });
};

module.exports = {
  userNotFound,
  globalError,
  confirmPasswordOrEmail,
};
