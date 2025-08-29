const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });
const JWT_ACCESSKEY = process.env.ACCESSKEY;

function authenticateToken(req, res, next) {
  const autHeader = req.headers.authorization;
  if(!autHeader || !autHeader.startsWith('Bearer ')) {
    console.log('Something went wrong: No token Provided');
    return res.status(401).json({error: 'No Token Provided'});
  }

  const token = autHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESSKEY);
    req.user = decoded;
    console.log(decoded)
    next();
  }catch(err) {
    if(err.name === 'TokenExpiredError') {
      console.log('Expired Token')
      return res.status(401).json({error: 'TokenExpiredError'});
    }
    else {
      console.log('Invalid Token')
      return res.status(401).json({error: 'Invalid Token'})
    }
  }
}

module.exports = authenticateToken;