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
    carowner: {
      type: ObjectId,
      ref: "Seller",
    },
    car: {
      // NOTE: This is exclusively for deletion of the bids after the car is deleted
      type: ObjectId,
      ref: "Car",
    },

    message: {
      type: String,
    },
    buyername: {
      type: String,
      reuired: true,
    },
    carname: {
      type: String,
      reuired: true,
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
      type: ObjectId,
      ref: "CompanyName",
    },
    variant: {
      type: ObjectId,
      ref: "CarVariant",
    },
    carName: {
      type: ObjectId,
      ref: "CarName",
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
      type: String,
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
    milage: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    luggage: {
      type: Boolean,
      default: false,
    },
    bid: [
      {
        type: ObjectId,
        ref: "Bid",
      },
    ],
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
