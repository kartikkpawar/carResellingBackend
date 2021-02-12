const express = require("express");
const router = express.Router();
const {
  getBuyerById,
  updateBuyer,
  getBuyer,
  myBids,
  profilePic,
} = require("../controllers/buyer");
const {
  isSignedIn,
  isAuthenticatedBuyer,
  isBuyer,
} = require("../controllers/buyerAuth");

router.param("buyerId", getBuyerById);

router.get(
  "/buyer/:buyerId",
  isSignedIn,
  isAuthenticatedBuyer,
  isBuyer,
  getBuyer
);

router.get("/buyer/:buyerId/photo", profilePic);

router.put(
  "/buyer/:buyerId/update",
  isSignedIn,
  isAuthenticatedBuyer,
  isBuyer,
  updateBuyer
);

router.get(
  "/:buyerId/myBids",
  isSignedIn,
  isAuthenticatedBuyer,
  isBuyer,
  myBids
);

module.exports = router;
