const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const path = require("path");
const cors = require('cors');

const dbConnect = require("./config/db-connect");
require("dotenv").config();
const courseRouter = require("./routes/course-routes");

const authRouter = require("./routes/auth-routes");
const userRouter = require("./routes/user-routes");


dbConnect();



const app = express();


app.use(cors({origin: "http://localhost:4200"}));

app.use(express.json());

app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/courses", courseRouter);

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRouter);


app.listen(process.env.PORT, () => {
  console.log("Server listening on port 5000");
});
