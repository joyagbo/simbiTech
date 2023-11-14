const passport = require("passport");
const { validateSignup } = require("../validation/inputValidaion");
const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports.auth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

module.exports.homepage = async (req, res) => {
  res.send("home");
};

module.exports.signUp_post = async (req, res) => {
  const { error } = validateSignup(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    res.status(400).send("Passwords do not match");

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      authenticationMethod: "local",
    });
    await newUser.save();
    res.status(201).send("User created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports.login = passport.authenticate("local", {
  successRedirect: "/auth/dashboard",
  failureRedirect: "/auth/login",
});

module.exports.dashboard = async (req, res) => {
  res.send("Welcome");
};
