const { convertToken } = require("../helpers/jwt");
const { findUserById } = require("../users/controller");
const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw {
        name: "Unauthorized",
        statusCode: 401,
        mesasage: "Access token is required",
      };
    }
    const payload = convertToken(access_token);
    const targetId = payload.id;
    const foundUser = await findUserById(targetId);
    if (!foundUser) {
      req.user = {
        id: foundUser.id,
        username: foundUser.username,
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
