const errorHandler = (err, req, res, next) => {
  switch (err.message) {
    case "nilai kunci ganda melanggar batasan unik « lis_order_pkey »":
      return res.status(400).json({
        message: err.detail,
      });
    default:
      return res.status(500).json({
        message: "Internal server error",
      });
  }
};

module.exports = errorHandler;
