const { CompanyName, CarName, CarVariant } = require("../models/carCategory");

exports.addcompany = (req, res) => {
  const company = new CompanyName(req.body);
  company.save((err, companyname) => {
    if (err) {
      return res.status(422).json({
        error: "Unable to add company pls try after some time",
      });
    }
    return res.json(companyname);
  });
};
exports.addcar = (req, res) => {
  const carName = new CarName(req.body);
  carName.save((err, carname) => {
    if (err) {
      return res.status(422).json({
        error: "Unable to add company pls try after some time",
      });
    }
    return res.json(carname);
  });
};
exports.addvariant = (req, res) => {
  const variant = new CarVariant(req.body);
  variant.save((err, carvariant) => {
    if (err) {
      return res.status(422).json({
        error: "Unable to add company pls try after some time",
      });
    }
    return res.json(carvariant);
  });
};

exports.getCompanies = (req, res) => {
  CompanyName.find().exec((err, name) => {
    if (err || !name) {
      return res.json({ error: "Something went wrong" });
    }

    return res.json(name);
  });
};
exports.getCars = (req, res) => {
  const { companyId } = req.params;
  CarName.find({ company: companyId }).exec((err, car) => {
    if (err || !car) {
      return res.json({ error: "Something went wrong" });
    }

    return res.json(car);
  });
};
exports.getVariants = (req, res) => {
  const { carId } = req.params;
  CarVariant.find({ car: carId }).exec((err, variant) => {
    if (err || !variant) {
      return res.json({ error: "Something went wrong" });
    }

    return res.json(variant);
  });
};
exports.getcarname = (req, res) => {
  const { carId } = req.params;
  CarName.findById(carId).exec((err, car) => {
    if (err || !car) {
      return res.json({ error: "Something went wrong" });
    }

    return res.json({ name: car.name });
  });
};
exports.getvariantmane = (req, res) => {
  const { varId } = req.params;
  CarVariant.findById(varId).exec((err, variant) => {
    if (err || !variant) {
      return res.json({ error: "Something went wrong" });
    }

    return res.json({ name: variant.name });
  });
};
