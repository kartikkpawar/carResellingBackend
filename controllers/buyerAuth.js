const Buyer = require("../models/buyer");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
var epressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");

exports.signUp = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with profile pic" });
    }

    let buyer = new Buyer(fields);

    if (file.profile) {
      //if crashes use this line
      // if (buyer.profile) {
      if (file.profile.size > 300000) {
        return res.status(400).json({ error: "File size greater than 3Mb" });
      }
      buyer.profilePic.data = fs.readFileSync(file.profile.path);
      buyer.profilePic.contentType = file.profile.type;
    }

    Buyer.findOne({ email: buyer.email }, (err, buyers) => {
      if (buyers) {
        return res.status(402).json({ error: "Already Registered as buyer" });
      }
      buyer.save((err, buy) => {
        if (err) {
          return res.status(402).json({ error: err });
        }
        res.json(buy);
      });
    });
  });
};

exports.singIn = (req, res) => {
  const { email, password } = req.body;

  Buyer.findOne({ email }, (err, buyer) => {
    if (err || !buyer) {
      return res.status(400).json({ error: "Buyer dont exist" });
    }
    if (!buyer.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password doesn't match" });
    }

    //Creating the token for signIn process
    const token = jwt.sign({ _id: buyer._id }, process.env.SECRET);

    res.cookie("token", token, { expire: new Date() + 9999 });

    //FIXME Just send the auth token to the frontend and id
    res.json({ token: token, user: buyer });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token"); // clearing the cookies to signout
  res.json({
    msg: "Sign Out Sucessfully",
  });
};

//Protected Routes.....
exports.isSignedIn = epressJwt({
  secret: process.env.SECRET,
  userProperty: "auth", // this is passed to req and is accessed as req.auth
});

//Custom middlewares for the Buyer..
exports.isAuthenticatedBuyer = (req, res, next) => {
  // Checking for the authentication of the Buyer / user

  let checker = req.buyer && req.auth && req.buyer._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({ msg: "Access Denied as buyer " });
  }
  next();
};
exports.isBuyer = (req, res, next) => {
  if (req.buyer.role !== 0) {
    return res.status(403).json({ msg: "You are not Buyer " });
  }
  next();
};
