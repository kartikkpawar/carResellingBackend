const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bidSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    bidder: {
      type: ObjectId,
      ref: "Buyer",
    },
    car: {
      type: ObjectId,
      ref: "Car",
    },
    carOwner: {
      type: ObjectId,
      ref: "Seller",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);
const carSchema = new mongoose.Schema(
  {
    carImage: {
      data: Buffer,
      contentType: String,
    },

    companyName: {
      type: String,
      required: true,
    },
    carName: {
      type: String,
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownership: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    kmDriven: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },
    regNumber: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    bid: [bidSchema],
    sold: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: ObjectId,
      ref: "Seller",
    },
  },
  { timestamps: true }
);
const Car = mongoose.model("Car", carSchema);
const Bid = mongoose.model("Bid", bidSchema);
module.exports = { Car, Bid };
