const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const companyNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const carNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: ObjectId,
    ref: "CompanyName",
  },
});
const variantSchema = new mongoose.Schema({
  variant: {
    type: String,
    required: true,
  },
  company: {
    type: ObjectId,
    ref: "CarName",
  },
});

const CompanyName = mongoose.model("CompanyName", companyNameSchema);
const CarVariant = mongoose.model("CarVariant", variantSchema);
const CarName = mongoose.model("CarName", carNameSchema);

module.exports = { CompanyName, CarName, CarVariant };
