const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration
const userRegistration = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "User already exist!" });
    } else {
      if (name && email && password && password_confirmation) {
        if (password === password_confirmation) {
          try {
            // Generate hash password using bcrypt
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password, salt);

            // Register new user
            const user = await UserModel({
              name: name,
              email: email,
              password: hashPassword,
            });
            await user.save();

            // Generate JWT Token
            const getUser = await UserModel.findOne({ email: email });
            const token = jwt.sign(
              { userID: getUser._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.status(201).send({
              status: "success",
              message: "User register succesfully!",
              token:token
            });
          } catch (error) {
            res.send({
              status: "failed",
              message: "Unable to register new user!",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "Password & Confirm Password does not match!",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required!" });
      }
    }
  } catch (error) {
    res.send({
      status: "failed",
      message: "Something went wront with registration!",
    });
  }
};

// User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const isPassMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isPassMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );          
          res.send({ status: "success", message: "Login Succesfully!",token:token });
        } else {
          res.send({
            status: "failed",
            message: "Please enter valid email and password!",
          });
        }
      } else {
        res.send({ status: "failed", message: "User not exist!" });
      }
    } else {
      res.send({ status: "failed", messgae: "All fields are required!" });
    }
  } catch (error) {
    res.send({ status: "failed", message: "Something went wront with login!" });
  }
};

// User Change Password
const userChangePassword = async (req,res) => {
  try {
    const {password,password_confirmation} = req.body
    if(password && password_confirmation){
      if(password === password_confirmation){

        // Generate hash password using bcrypt
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        // Update Password
        await UserModel.findByIdAndUpdate(req.user._id,{password:hashPassword},{new:true})

        res.send({
          status: "success",
          message: "Password changes succesfully!",
        })
      }else{
        res.send({
          status: "failed",
          message: "Password & Confirm Password does not match!",
        });
      }
    }else{
      res.send({ status: "failed", messgae: "All fields are required!" });
    }
  } catch (error) {
    res.send({ status: "failed", message: "Something went wront with changing passowrd!" });
  }
}

// User LoggedIn 
const userLoggedIn = async (req,res) => {
  res.send({status:"success",user:req.user})
}

// User send mail for reset password
const userSendMailForResetPassword = async (req,res) => {
  try {
    const {email} = req.body
    if(email){
      const user = await UserModel.findOne({email:email})
      if(user){
        const secret = user._id + process.env.JWT_SECRET_KEY
        const token = await jwt.sign({userID:user._id},secret,{expiresIn:"15m"})
        const link = `${process.env.PASSWORD_RESET_URL}${user._id}/${token}`
        console.log(link);
        res.send({status:"success",message:"Email sent succesfully!"});
      }else{
        res.send({status:"failed",message:"Email does not exist!"})
      }
    }else{
      res.send({status:"failed",message:"Email field is required!"})
    }

  } catch (error) {
    res.send({status:"failed",message:"Something went wrong with email sending!"})
  }
}

const userResetPassword = async (req,res) => {
  try {
    const {password,password_confirmation} = req.body;
    const {id,token} = req.params
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token,new_secret)
      if(password && password_confirmation){
        if(password === password_confirmation){
          // Generate hash password using bcrypt
          const salt = await bcrypt.genSalt(12);
          const hashPassword = await bcrypt.hash(password, salt);

          // Update Password
          await UserModel.findByIdAndUpdate(user._id,{password:hashPassword},{new:true})

          res.send({
            status: "success",
            message: "Password reset succesfully!",
          })

        }else{
          res.send({
            status: "failed",
            message: "Password & Confirm Password does not match!",
          });
        }
      }else{
        res.send({ status: "failed", messgae: "All fields are required!" });
      }
    } catch (error) {
      res.send({status:"failed",message:"Invalid Token!"})
    }
  } catch (error) {
    res.send({status:"failed",message:"Something went wrong with reset password!"})
  }
}

// export functions
module.exports = { userRegistration, userLogin, userChangePassword, userLoggedIn, userSendMailForResetPassword,userResetPassword };
