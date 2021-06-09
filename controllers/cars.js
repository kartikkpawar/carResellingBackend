const { Car, Bid } = require("../models/sellerCar");
const Buyer = require("../models/buyer");
const Seller = require("../models/seller");
const formidable = require("formidable");
const fs = require("fs");

exports.getCarById = (req, res, next, id) => {
  Car.findById(id)
    .populate("bid")
    .exec((err, cars) => {
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
  if (req.car.carImage.data) {
    // if there is data then only it will set true
    res.set("Content-Type", req.car.carImage.contentType);
  }
  return res.send(req.car.carImage.data);
  next();
};

exports.addCar = (req, res, next) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (err, fields, file) => {
    let car = new Car(fields);

    if (err) {
      return res.status(400).json({ error: "Problem with picture" });
    }

    // if (files.image) {
    //   car.carImage.data = fs.readFileSync(file.image.path);
    //   car.carImage.contentType = file.image.type;
    //   car.carImage = images;
    // }

    if (file.image) {
      car.carImage.data = fs.readFileSync(file.image.path);
      car.carImage.contentType = file.image.type;
    }

    car.save((err, cars) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Something went wrong" });
      }
      return res.json(cars);
    });
  });
};

exports.sellerCars = (req, res) => {
  Car.find({ owner: req.profile._id }).exec((err, cars) => {
    if (err) {
      return res.json({ err });
    }
    if (!cars) {
      return res.json({ error: "No cars found" });
    }
    return res.json(cars);
  });
};

exports.deleteCar = (req, res) => {
  const id = req.car._id;
  Car.findByIdAndDelete({ _id: id }).exec((err, cars) => {
    if (err) return res.json({ error: "Unable to delete car" });
    Bid.deleteMany({ car: id })
      .then(() => res.status(200).json({ msg: "Deletion Successfull" }))
      .catch((err) => {
        res.status(400).json({ error: "Something went Wrong" });
      });
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

exports.makeBid = async (req, res) => {
  const { amount, bidder, message, owner } = req.body;
  const { carId } = req.params;

  const bid = new Bid({ amount, bidder, message, owner, car: carId });

  await Car.findById(carId).exec((err, car) => {
    car.bid.push(bid);
    bid.save();
    car.save();
    return res.json(car);
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
      return res.json({ error: err });
    }
    res.json({
      name: bidder.name,
      email: bidder.email,
      contact: bidder.contact,
      address: bidder.address,
      state: bidder.state,
      district: bidder.district,
    });
  });
};

exports.highestBid = (req, res) => {
  let highestBid;
  let allBids = req.car.bid;
  if (req.car.bid.length > 0) {
    allBids.sort((a, b) => {
      return b.amount - a.amount;
    });
    highestBid = allBids[0];
    return res.json(highestBid);
  } else {
    return res.json({ error: "No bids have been made" });
  }
};

exports.soldStatus = (req, res) => {
  Car.findByIdAndUpdate(
    { _id: req.car._id },
    { $set: { sold: req.body.soldStatus } },
    { new: true },
    (err, car) => {
      if (err) {
        return res.json({ err });
      }
      return res.json({ car });
    }
  );
};
exports.sellerMyBid = (req, res) => {
  Bid.find({ carOwner: req.profile._id }).exec((err, bids) => {
    if (err) {
      return res.json({ error: "No Request has been made for your cars" });
    }
    res.json(bids);
  });
};
exports.buyerMyBid = (req, res) => {
  Bid.find({ bidder: req.buyer._id }).exec((err, bids) => {
    if (err) {
      return res.json({ error: "You have made no request till yet" });
    }
    res.json(bids);
  });
};

exports.getBid = (req, res) => {
  return res.json(req.bid);
};
