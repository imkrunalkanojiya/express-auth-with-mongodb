const jwt = require("jsonwebtoken");

// Importing User Model
const UserModel = require("../models/users");

// Check User Authenticate
const checkUserAuth = async (req, res, next) => {
  try {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      // Get Token From Headers
      token = authorization.split(" ")[1];

      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KET);

      // Get user from token
      req.user = await UserModel.findById(userID).select('-password');

      next();
    }else{
        res.send({status:"failed",message:"Unauthorized User, Token Not Found!"})
    }
  } catch (error) {
    res.status(401).send({ status: "failed", message: "Token Is Not Valid!" });
  }
};

module.exports = checkUserAuth;
