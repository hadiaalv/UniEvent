const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log("🔍 Register attempt:", req.body.email);
  
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Determine role and approval status
    let userRole = "USER";
    let isApproved = true;
    let message = "Registration successful";
    
    // If requesting admin role, set as ADMIN but not approved
    if (role === "ADMIN") {
      userRole = "ADMIN";
      isApproved = false;
      message = "Admin request submitted. Awaiting Super Admin approval.";
    }
    
    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: userRole,
      isApproved: isApproved
    });
    
    console.log("✅ User registered:", user.email, "Role:", user.role, "Approved:", user.isApproved);
    
    res.json({ 
      msg: message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ msg: "Registration failed: " + err.message });
  }
});
// Login
router.post("/login", async (req, res) => {
  console.log("🔍 Login attempt:", req.body.email);
  
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ msg: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("👤 User found:", user.email, "Role:", user.role, "Approved:", user.isApproved);

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Wrong password for:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // If admin is not approved, let them login as USER temporarily
    let effectiveRole = user.role;
    let message = "Login successful";
    
    if (user.role === "ADMIN" && !user.isApproved) {
      effectiveRole = "USER";
      message = "Logged in as USER. Your admin request is pending approval.";
      console.log("⏳ Admin pending approval, logging in as USER:", email);
    }

    // Create token with effective role
    const token = jwt.sign(
      { id: user._id, role: effectiveRole }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    console.log("✅ Login successful:", user.email, "Effective role:", effectiveRole);
    
    res.json({ 
      token, 
      role: effectiveRole,
      message: message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: effectiveRole,
        isApproved: user.isApproved,
        actualRole: user.role // Include actual role for reference
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Login failed: " + err.message });
  }
});

module.exports = router;