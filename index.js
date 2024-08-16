const express = require("express");
const connectDB = require("./database/db");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute=require("./routes/auth")
const userRoute=require("./routes/users")
const { errorHandler } = require('./middlewares/error');





 




dotenv.config()
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    connectDB()
  console.log("Server is running on port 3000");
});