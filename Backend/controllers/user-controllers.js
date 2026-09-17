const User = require("../models/user-model");
const Course = require("../models/course-model");

const addCourseToUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "fail", message: "Course not found" });
    }

    const alreadyEnrolled = user.myCourses.some(
      (id) => id.toString() === courseId,
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        status: "fail",
        message: "Course already enrolled",
      });
    }

    user.myCourses.push(courseId);
    course.students = (course.students || 0) + 1;

    await course.save();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Course added successfully to your courses",
      data: {
        myCourses: user.myCourses,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error in adding course ${error.message}`,
    });
  }
};

const getUserCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("myCourses");
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res
      .status(200)
      .json({ status: "success", data: { myCourses: user.myCourses } });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error in fetching your course ${error.message}`,
    });
  }
};

module.exports = { addCourseToUser, getUserCourses };
