require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

/*
Connecting to the online database 


*/
const MongoClient = require("mongodb").MongoClient;

//Getting the Routes

const sellerAuthRoutes = require("./routes/sellerAuth"); // Authentication Routes
const buyerAuthRoutes = require("./routes/buyerAuth"); // Authentication Routes
const sellerRoutes = require("./routes/seller"); // Seller route
const buyerRoutes = require("./routes/buyer"); // Buyer route
const carRoutes = require("./routes/cars"); // cars route
const categoryRoutes = require("./routes/carCategory"); // cars company and category routes
//Connection to the database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log(err));

// Getting the Middlewares working
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

//Routing for the portal
app.use("/api", sellerAuthRoutes);
app.use("/api", buyerAuthRoutes);
app.use("/api", sellerRoutes);
app.use("/api", buyerRoutes);
app.use("/api", carRoutes);
app.use("/api", categoryRoutes);

//Starting the server
app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
