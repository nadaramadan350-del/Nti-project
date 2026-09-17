require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/course-model");

const sampleCourses = [
  {
    title: "Modern JavaScript Essentials",
    instructor: "Maya Hassan",
    category: "programming",
    description: "Build a strong JavaScript foundation with modern syntax, asynchronous programming, and practical projects.",
    price: 0,
    duration: "6 weeks",
    level: "beginner",
    rating: 4.8,
  },
  {
    title: "Angular Application Development",
    instructor: "Omar Khaled",
    category: "frontend",
    description: "Create maintainable Angular applications with components, routing, forms, services, and API integration.",
    price: 149,
    duration: "8 weeks",
    level: "intermediate",
    rating: 4.7,
  },
  {
    title: "Node.js and Express APIs",
    instructor: "Nour Adel",
    category: "backend",
    description: "Design secure REST APIs with Node.js, Express, validation, authentication, and MongoDB.",
    price: 179,
    duration: "7 weeks",
    level: "intermediate",
    rating: 4.9,
  },
  {
    title: "MongoDB Data Modeling",
    instructor: "Youssef Samir",
    category: "database",
    description: "Learn document modeling, indexes, aggregation, and reliable data access patterns with MongoDB.",
    price: 129,
    duration: "5 weeks",
    level: "intermediate",
    rating: 4.6,
  },
  {
    title: "Docker and Deployment Fundamentals",
    instructor: "Salma Nabil",
    category: "devops",
    description: "Containerize applications and prepare dependable development and deployment workflows with Docker.",
    price: 199,
    duration: "6 weeks",
    level: "advanced",
    rating: 4.8,
  },
  {
    title: "Flutter Mobile Interfaces",
    instructor: "Karim Mostafa",
    category: "mobile",
    description: "Build responsive cross-platform mobile interfaces with Flutter, navigation, state, and reusable widgets.",
    price: 159,
    duration: "8 weeks",
    level: "beginner",
    rating: 4.5,
  },
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    let added = 0;
    for (const course of sampleCourses) {
      const result = await Course.updateOne(
        { title: course.title },
        { $setOnInsert: course },
        { upsert: true }
      );
      if (result.upsertedCount === 1) added += 1;
    }

    console.log(`Sample courses ready. Added ${added}; already existed ${sampleCourses.length - added}.`);
  } finally {
    await mongoose.disconnect();
  }
}

seedCourses().catch((error) => {
  console.error(`Failed to seed courses: ${error.message}`);
  process.exitCode = 1;
});
