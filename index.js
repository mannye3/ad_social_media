const express = require("express");
const connectDB = require("./database/db");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute=require("./routes/auth")

const { errorHandler } = require('./middlewares/error');




app.use(express.json());
app.use(cookieParser())





dotenv.config()
app.use("/api/auth",authRoute)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    connectDB()
  console.log("Server is running on port 3000");
});