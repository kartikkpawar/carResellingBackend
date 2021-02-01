const { Car, Bid } = require("../models/sellerCar");
const Buyer = require("../models/buyer");
const formidable = require("formidable");
const fs = require("fs");

exports.getCarById = (req, res, next, id) => {
  Car.findById(id).exec((err, cars) => {
    if (err || !cars) {
      return res.status(400).json({ msg: "No Car found" });
    }
    req.car = cars;
    next();
  });
};
exports.getCar = (req, res) => {
  req.car.createdAt = undefined; // Hiding the creation date
  req.car.updatedAt = undefined; // Hiding the update date
  req.car.carImage = undefined; // Hiding the profilePic
  return res.json(req.car);
};
exports.carImages = (req, res) => {
  if (req.car.carImage.length == 0) {
    return res.json({ msg: "No images found" });
  }
  return res.json(req.car.carImage);

  next();
};

exports.addCar = (req, res, next) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    let car = new Car(fields);

    if (err) {
      return res.status(400).json({ error: "Problem with profile pic" });
    }

    if (files) {
      let images = [];
      let imageObject = {};
      for (let i = 0; i < files.image.length; i++) {
        imageObject.data = fs.readFileSync(files.image[i].path);
        imageObject.contentType = files.image[i].type;
        images.push(imageObject);
      }
      car.carImage = images;
    }
    car.save((err, cars) => {
      if (err) return res.json({ err });
      return res.json(cars);
    });
  });
};

exports.sellerCars = (req, res) => {
  Car.find({ owner: req.profile._id }).exec((err, cars) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(cars);
  });
};

exports.deleteCar = (req, res) => {
  Car.findByIdAndDelete({ _id: req.car._id }).exec((err, cars) => {
    if (err) return res.json({ err: "Unable to delete car" });

    return res.json({ msg: "Deletion Successful" });
  });
};

exports.getAllCars = (req, res) => {
  Car.find().exec((err, cars) => {
    if (err || !cars) {
      return res.json({ err: "Something went wrong" });
    }

    return res.json(cars);
  });
};

exports.makeBid = (req, res) => {
  const bid = new Bid(req.body);
  bid.save((err, bid) => {
    if (err) {
      return res.json({ err });
    }
    Car.findByIdAndUpdate(
      { _id: req.car._id },
      { $push: { bid: bid } },
      { new: true },
      (err, car) => {
        if (err) {
          return res.json({ err });
        }
        return res.json({ car });
      }
    );
  });
};

exports.getBidbyId = (req, res, next, id) => {
  Bid.findById(id).exec((err, bids) => {
    if (err || !bids) {
      return res.status(400).json({ msg: "No Bid found" });
    }
    req.bid = bids;
    next();
  });
};

exports.bidMakerInfo = (req, res) => {
  Buyer.findById({ _id: req.bid.bidder }).exec((err, bidder) => {
    if (err) {
      return res.json({ msg: "Unable to found Info" });
    }
    res.json({
      name: bidder.name,
      email: bidder.email,
      contact: bidder.contact,
    });
  });
};

exports.highestBid = (req, res) => {
  let highestBid;
  let allBids = req.car.bid;

  allBids.sort((a, b) => {
    return b.amount - a.amount;
  });
  highestBid = allBids[0];
  res.json(highestBid);
};

//TODO: make the route to update the status of sold or not
