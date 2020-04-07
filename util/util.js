const jwt = require("jsonwebtoken");
const keys = require("../config/keys");


const generateToken = (payLoad, callback) => {
    let result
    const time = Date.now();
    const newPayload  = {...payLoad, time}
    jwt.sign(
        {newPayload},
        keys.secretOrKey,
        { expiresIn: 60000},
        (err, token) => {
          if (token) {
              result = {error: false, token};
              return callback(result);
          }
          result = {error: true, err}
          return callback(result);
        }
      );
    };
    

    module.exports = generateToken;