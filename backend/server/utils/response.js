const sendSuccess = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    error: null,
  });
};

const sendError = (res, message, status = 500, details = null) => {
  return res.status(status).json({
    success: false,
    data: null,
    error: {
      message,
      details,
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
