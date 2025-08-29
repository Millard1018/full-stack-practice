const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" })
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const JWT_REFRESHKEY = process.env.REFRESHKEY;

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', //frontend origin
  credentials: true //allow cookies to be sent in backend
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(JWT_REFRESHKEY));

app.use("/api/users", userRoutes); // route

app.use(errorHandler);

module.exports = app;