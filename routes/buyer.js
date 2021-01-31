const express = require("express");
const router = express.Router();
const { getBuyerById, updateBuyer, getBuyer } = require("../controllers/buyer");
const {
  isSignedIn,
  isAuthenticated,
  isBuyer,
} = require("../controllers/buyerAuth");

router.param("buyerId", getBuyerById);

router.get(
  "/buyer/:buyerId",
  isSignedIn,
  isAuthenticated,
  //  isBuyer,
  getBuyer
);
router.put(
  "/buyer/:buyerId/update",
  isSignedIn,
  isAuthenticated,
  //  isBuyer,
  updateBuyer
);

module.exports = router;
