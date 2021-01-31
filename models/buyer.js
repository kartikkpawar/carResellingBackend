const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const buyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    contact: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
    },
    district: {
      type: String,
      trim: true,
      required: true,
    },
    pincode: {
      type: Number,
      trim: true,
      required: true,
    },
    profilePic: {
      data: Buffer,
      contentType: String,
    },
    dob: {
      type: Date,
      trim: true,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    messageSent: {
      type: Array,
      default: [],
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
);

buyerSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

buyerSchema.methods = {
  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
};

module.exports = mongoose.model("Buyer", buyerSchema);
