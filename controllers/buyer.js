const Buyer = require("../models/buyer");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { Bid } = require("../models/sellerCar");

// FIXME: ERROR WITH THE PROFILE IMAGE

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
  req.buyer.salt = undefined;
  req.buyer.encry_password = undefined; // hiding the passwords form users
  req.buyer.createdAt = undefined; // Hiding the creation date
  req.buyer.updatedAt = undefined; // Hiding the update date

  return res.json(req.buyer);
};
exports.profilePic = (req, res) => {
  if (req.buyer.profilePic.data) {
    // if there is data then only it will set true
    res.set("Content-Type", req.buyer.profilePic.contentType);
    return res.send(req.buyer.profilePic.data);
  }

  next();
};

//req.body is coming up from the frontend && req.buyer is coming up from the getBuyerById middleware
exports.updateBuyer = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with profile pic" });
    }

    // Updation Code
    let buyer = req.buyer;
    buyer = _.extend(buyer, fields);

    if (file.profile) {
      if (file.profile.size > 300000) {
        return res.status(400).json({ err: "File size greater than 3Mb" });
      }
      buyer.profilePic.data = fs.readFileSync(file.profile.path);
      buyer.profilePic.contentType = file.profile.type;
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
