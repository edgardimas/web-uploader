const { orderLogger, resultLogger, errorLogger } = require("../helpers/logger");

const errorHandler = (err, req, res, next) => {
  // console.log(err, "<<<<< errrrrr");

  switch (err.message) {
    case "nilai kunci ganda melanggar batasan unik « lis_order_pkey »":
      orderLogger.info(err.detail);
      errorLogger.info(err.detail);
      return res.status(400).json({
        message: err.detail,
      });
    default:
      return res.status(500).json({
        message: "Internal server error",
        detail: err.message,
      });
  }
};

module.exports = errorHandler;
