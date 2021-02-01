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
      if (file.profile.size > 300000) {
        return res.status(400).json({ err: "File size greater than 3Mb" });
      }
      buyer.profile.data = fs.readFileSync(file.profile.path);
      buyer.profile.contentType = file.profile.type;
    }

    buyer.save((err, buy) => {
      if (err) {
        return res.status(402).json({ err });
      }
      res.json(buy);
    });
  });
};

exports.singIn = (req, res) => {
  const { email, password } = req.body;

  Buyer.findOne({ email }, (err, buyer) => {
    if (err || !buyer) {
      return res.status(400).json({ err: "buyer dont exist" });
    }
    if (!buyer.authenticate(password)) {
      return res.status(401).json({ err: "Email and password doesn't match" });
    }

    //Creating the token for signIn process
    const token = jwt.sign({ _id: buyer._id }, process.env.SECRET);

    res.cookie("token", token, { expire: new Date() + 9999 });

    //FIXME Just send the auth token to the frontend and id
    res.json({ token: token, buyer });
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
exports.isAuthenticated = (req, res, next) => {
  // Checking for the authentication of the Buyer / user
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({ msg: "Access Denied" });
  }
  next();
};
exports.isBuyer = (req, res, next) => {
  if (req.profile.role !== 0) {
    return res.status(403).json({ msg: "You are not Buyer " });
  }
  next();
};
