const jwt = require("jsonwebtoken");
const config = require("./config");

const checkToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(token);
  if (token) {
    jwt.verify(token, config.key, (err, decoded) => {
      if (err) {
        return res.send({
          status: false,
          msg: "token is invalid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.send({
      status: false,
      msg: "Token is not provided",
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
