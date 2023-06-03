const express = require("express")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const jwt_secret = "FaizanFazalisagood"
router.post("/createuser", [
  body('email', "Enter a valid email").notEmpty().isEmail(),
  body("name", "Enter a valid name").notEmpty().isLength({ min: 3 }),
  body("password", "Enter the correct Password").isLength({ min: 5 }).notEmpty()

], async (req, res) => {
  let success=false;
  //crete user to the endpoint and shows the errors if the information is not valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  //If the email alreaady exists
  try {

    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({success, errors: "Sorry a user with This email is already exists" })
    }
    //Store a Hash Password
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt)
    //Create a news user
    user = await User.create({
      name: req.body.name,
      password: secPassword,
      email: req.body.email,
    })
    //Jwt Tokens Using here
    const data = {
      user: {
        id: user.id
      }
    }
    success=true
    const authtoken = jwt.sign(data, jwt_secret)
    res.json({ success,authtoken })

  }
  catch (error) {
    console.log(error.message)
    res.status(500).send("Internal errors occured")
  }
})
//Create a login end point

router.post("/login", [
  body('email', "Enter a valid email").notEmpty().isEmail(),
  body("password", "Password cannot be blank").exists()

], async (req, res) => {
  let success = false;
  //crete user to the endpoint and shows the errors if the information is not valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({success, errors: "Please provide a valid login account" });
    }
    let comparepass = await bcrypt.compare(password, user.password);
    if (!comparepass) {
      return res.status(400).json({ success, errors: "Please provide a valid login account" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, jwt_secret)
    success=true
    res.json({success, authtoken })
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send("Internal errors occured")
  }
})
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal error occurred");
  }
});
module.exports = router