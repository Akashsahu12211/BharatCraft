const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const getToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email and password are required." });
    return;
  }

  const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });

  if (existingUser) {
    res.status(409).json({ message: "User already exists with this email." });
    return;
  }

  const requestedRole = role === "admin" && process.env.ALLOW_ADMIN_SIGNUP === "true" ? "admin" : "user";

  const user = await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password: String(password),
    role: requestedRole
  });

  res.status(201).json({
    message: "Signup successful.",
    token: getToken(user),
    user: sanitizeUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });

  if (!user) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const validPassword = await user.matchPassword(String(password));

  if (!validPassword) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  res.status(200).json({
    message: "Login successful.",
    token: getToken(user),
    user: sanitizeUser(user)
  });
});

module.exports = {
  signup,
  login
};
