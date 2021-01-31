const Seller = require("../models/seller");

const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getSellerById = (req, res, next, id) => {
  Seller.findById(id).exec((err, seller) => {
    if (err || !seller) {
      return res.status(400).json({ msg: "No seller is found" });
    }
    req.profile = seller;
    next();
  });
};

exports.getSeller = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined; // hiding the passwords form users
  req.profile.createdAt = undefined; // Hiding the creation date
  req.profile.updatedAt = undefined; // Hiding the update date
  return res.json(req.profile);
};

//req.body is coming up from the frontend && req.profile is coming up from the getSellerById middleware
exports.updateSeller = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with profile pic" });
    }

    // Updation Code
    let seller = req.profile;
    seller = _.extend(seller, fields);

    if (file.profile) {
      if (file.profile.size > 300000) {
        return res.status(400).json({ err: "File size greater than 3Mb" });
      }
      seller.profile.data = fs.readFileSync(file.profile.path);
      seller.profile.contentType = file.profile.type;
    }
    seller.save((err, sell) => {
      if (err) {
        return res.status(402).json({ error: "Updating details failed" });
      }
      sell.salt = undefined;
      sell.encry_password = undefined; // hiding the passwords form users
      sell.createdAt = undefined; // Hiding the creation date
      sell.updatedAt = undefined; // Hiding the update date
      res.json(sell);
    });
  });
};
