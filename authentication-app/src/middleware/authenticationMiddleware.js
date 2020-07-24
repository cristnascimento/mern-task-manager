const serviceToken = require('./../service/token');

let validateToken = (req, res, next) => {

  let token = req.cookies['token'];

  serviceToken.verify(token, (err, decoded) => {
    if (err) {
      console.log("Invalid token: " + token);
      req.user = null;
      req.decoded = null;
    }
    else {
      req.user = {id: decoded.id};
      req.decoded = decoded;
    }
    next();
  });
}

let checkToken = (req, res, next) => {
  if (req.user) {
        next();
  }
  else {
    return res.json({
      success: false,
      message: 'Auth token is not valid.'
    });
  }
}

module.exports = {
  validateToken,
  checkToken
}