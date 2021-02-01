const Buyer = require("../models/buyer");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { Bid } = require("../models/sellerCar");

exports.getBuyerById = (req, res, next, id) => {
  Buyer.findById(id).exec((err, buyer) => {
    if (err || !buyer) {
      return res.status(400).json({ msg: "No buyer is found" });
    }
    req.buyer = buyer;
    next();
  });
};

exports.getBuyer = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined; // hiding the passwords form users
  req.profile.createdAt = undefined; // Hiding the creation date
  req.profile.updatedAt = undefined; // Hiding the update date
  return res.json(req.profile);
};

//req.body is coming up from the frontend && req.profile is coming up from the getBuyerById middleware
exports.updateBuyer = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with profile pic" });
    }

    // Updation Code
    let buyer = req.profile;
    buyer = _.extend(buyer, fields);

    if (file.profile) {
      if (file.profile.size > 300000) {
        return res.status(400).json({ err: "File size greater than 3Mb" });
      }
      buyer.profile.data = fs.readFileSync(file.profile.path);
      buyer.profile.contentType = file.profile.type;
    }
    buyer.save((err, buy) => {
      if (err) {
        return res.status(402).json({ error: "Updating details failed" });
      }
      buy.salt = undefined;
      buy.encry_password = undefined; // hiding the passwords form users
      buy.createdAt = undefined; // Hiding the creation date
      buy.updatedAt = undefined; // Hiding the update date
      res.json(buy);
    });
  });
};

//TODO make the route to see all the request made by the buyer

exports.myBids = (req, res) => {
  Bid.find({ bidder: req.buyer._id }).exec((err, myBids) => {
    if (err) {
      return res.json({ err });
    }
    if (!myBids) {
      return res.json({ msg: "No bid founds" });
    }
    return res.json(myBids);
  });
};
