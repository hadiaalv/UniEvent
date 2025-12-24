// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// module.exports = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Check if admin is approved
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }
    
//     if (user.role === "ADMIN" && !user.isApproved) {
//       return res.status(403).json({ message: "Admin account pending approval" });
//     }
    
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
