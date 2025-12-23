const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Event = require("./models/Event");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    const hashedPassword = await bcrypt.hash("password", 10);

    const users = await User.insertMany([
      {
        name: "Regular User",
        email: "user@test.com",
        password: hashedPassword,
        role: "USER"
      },
      {
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "ADMIN"
      },
      {
        name: "Super Admin",
        email: "super@test.com",
        password: hashedPassword,
        role: "SUPER_ADMIN"
      }
    ]);

    console.log("✅ Created test users");

    // Create some sample events
    const adminUser = users.find(u => u.role === "ADMIN");
    
    await Event.insertMany([
      {
        title: "Welcome Orientation",
        description: "Welcome event for new students",
        date: new Date("2024-09-01"),
        category: "Orientation",
        organizer: "Student Affairs",
        status: "APPROVED",
        createdBy: adminUser._id
      },
      {
        title: "Tech Workshop",
        description: "Learn about the latest technologies",
        date: new Date("2024-09-15"),
        category: "Workshop",
        organizer: "CS Department",
        status: "APPROVED",
        createdBy: adminUser._id
      },
      {
        title: "Career Fair",
        description: "Meet potential employers",
        date: new Date("2024-10-01"),
        category: "Career",
        organizer: "Career Services",
        status: "PENDING",
        createdBy: adminUser._id
      }
    ]);

    console.log("✅ Created sample events");
    console.log("\n📋 Test Credentials:");
    console.log("User: user@test.com / password");
    console.log("Admin: admin@test.com / password");
    console.log("Super Admin: super@test.com / password");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();