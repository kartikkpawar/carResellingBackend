const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bidSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  bidder: {
    type: ObjectId,
    ref: "Buyer",
  },
  message: {
    type: String,
  },
});
const carSchema = new mongoose.Schema(
  {
    carImage: {
      type: Array,
    },
    companyName: {
      type: String,
      required: true,
    },
    carName: {
      type: String,
      required: true,
    },

    variant: {
      type: String,
      required: true,
    },
    ownership: {
      type: Number,
      required: true,
    },
    kmDriven: {
      type: Number,
      required: true,
    },
    puchaseDate: {
      type: Date,
      required: true,
    },

    //NOTE: Date should be in this format --  2016-05-18

    color: {
      type: String,
      required: true,
    },
    regNumber: {
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
