const Seller = require("../models/seller");
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

    let seller = new Seller(fields);

    if (file.profile) {
      if (file.profile.size > 300000) {
        return res.status(400).json({ err: "File size greater than 3Mb" });
      }
      seller.profilePic.data = fs.readFileSync(file.profile.path);
      seller.profilePic.contentType = file.profile.type;
    }
    Seller.findOne({ email: seller.email }, (err, sellers) => {
      if (sellers) {
        return res.status(402).json({ error: "Already Registered as seller" });
      }

      seller.save((err, sell) => {
        if (err) {
          return res.status(402).json({ err });
        }

        return res.status(200).json(sell);
      });
    });
  });
};

exports.singIn = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  Seller.findOne({ email }, (err, seller) => {
    if (err || !seller) {
      return res.status(400).json({ error: "Seller dont exist" });
    }
    if (!seller.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password doesn't match" });
    }

    //Creating the token for signIn process
    const token = jwt.sign({ _id: seller._id }, process.env.SECRET);

    res.cookie("token", token, { expire: new Date() + 9999 });

    //FIXME Just send the auth token to the frontend and id
    res.json({ token: token, user: seller });
  });
};

exports.signOut = (req, res) => {
  console.log("signout hit");

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

//Custom middlewares for the sellers..
exports.isAuthenticated = (req, res, next) => {
  // Checking for the authentication of the seller / user
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({ msg: "Access Denied" });
  }
  next();
};
exports.isSeller = (req, res, next) => {
  if (req.profile.role !== 1) {
    return res.status(403).json({ msg: "Access denied as you are not seller" });
  }
  next();
};
