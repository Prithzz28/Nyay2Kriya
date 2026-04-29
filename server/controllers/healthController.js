const { sendSuccess } = require("../utils/response");

const getHealth = (req, res) => {
  return sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "CCMS Judgment Intelligence Backend",
  });
};

module.exports = {
  getHealth,
};
