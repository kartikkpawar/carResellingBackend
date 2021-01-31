const Car = require("../models/sellerCar");
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
  Car.findByIdAndUpdate(
    { _id: req.car._id },
    { $push: { bid: req.body } },
    { new: true },
    (err, car) => {
      if (err) {
        return res.json({ err });
      }
      return res.json({ car });
    }
  );
};

/*
NOTE: WORKING

The bid gets store in the car details and later seller can access the bid and contact the buyer 
The buyer can see the highest bid going on for the car.

TODO:  UPDATE CAR, FIX THE WORKING OF THE carCategory and link it to the cars. 


Backend completed.

*/
