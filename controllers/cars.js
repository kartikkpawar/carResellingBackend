const { Car, Bid } = require("../models/sellerCar");
const Buyer = require("../models/buyer");
const Seller = require("../models/seller");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getCarById = (req, res, next, id) => {
  Car.findById(id)
    .populate("bid")
    .exec((err, cars) => {
      if (err || !cars) {
        return res.status(400).json({ error: "No Car found" });
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

exports.editCar = (req, res) => {
  console.log("edit car hit");
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with profile pic" });
    }

    // Updation Code
    let car = req.car;
    car = _.extend(car, fields);

    if (file.image) {
      car.carImage.data = fs.readFileSync(file.image.path);
      car.carImage.contentType = file.image.type;
    }
    car.save((err, card) => {
      if (err) {
        return res.status(402).json({ error: "Updating details failed" });
      }

      card.createdAt = undefined; // Hiding the creation date
      card.updatedAt = undefined; // Hiding the update date
      res.json(card);
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
    // Deleting the Bids assosiated with the cars.
    Bid.deleteMany({ car: id })
      .then(() => res.status(200).json({ msg: "Deletion Successfull" }))
      .catch((err) => {
        res.status(400).json({ error: "Something went Wrong" });
      });
  });
};

exports.getAllCars = (req, res) => {
  Car.find({ sold: false }).exec((err, cars) => {
    if (err || !cars) {
      return res.json({ err: "Something went wrong" });
    }

    return res.json(cars);
  });
};

exports.makeBid = async (req, res) => {
  const { amount, bidder, message, carowner, carname, buyername } = req.body;
  const { carId, buyerId } = req.params;

  const bid = new Bid({
    amount,
    bidder: buyerId,
    message,
    carowner,
    car: carId,
    carname,
    buyername,
  });

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
      return res.status(400).json({ msg: "No not found" });
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
  console.log("sold route hit");
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
      return res.json({ error: "No Bids Found" });
    }
    res.json(bids);
  });
};
exports.carBids = (req, res) => {
  const { carId } = req.params;
  console.log(carId);
  console.log("Route Hit");
  Bid.find({ car: carId }).exec((err, bids) => {
    if (err) {
      return res.json({ error: "No Bids Found" });
    }
    res.json(bids);
  });
};

exports.getBid = (req, res) => {
  return res.json(req.bid);
};

exports.deleteBid = (req, res) => {
  const { bidId } = req.params;
  Bid.findByIdAndDelete({ _id: bidId }).exec((err, bid) => {
    if (err) return res.json({ error: "Something went Wrong" });
    return res.status(200).json({ msg: "Deletion Successfull" });
  });
};

exports.carFilter = (req, res) => {
  const { kmDriven, category, fuel, ownership, mode, cost } = req.body;

  const queryBuilder = () => {
    if (kmDriven !== "" && cost === "") {
      return {
        category: category,
        fuel: fuel,
        ownership: ownership,
        mode: mode,
        kmDriven: { $lte: kmDriven },
      };
    } else if (cost !== "" && kmDriven === "") {
      return {
        category: category,
        fuel: fuel,
        ownership: ownership,
        mode: mode,
        cost: { $lte: cost },
      };
    } else if (cost !== "" && kmDriven !== "") {
      return {
        category: category,
        fuel: fuel,
        ownership: ownership,
        mode: mode,
        cost: { $lte: cost },
        kmDriven: { $lte: kmDriven },
      };
    } else {
      return {
        category: category,
        fuel: fuel,
        ownership: ownership,
        mode: mode,
      };
    }
  };

  Car.find(queryBuilder()).exec((err, cars) => {
    if (err || cars.length === 0) {
      return res.json({ error: "No cars found,Try again" });
    }
    return res.json(cars);
  });
};
