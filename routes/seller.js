const express = require("express");
const router = express.Router();
const {
  getSellerById,
  getSeller,
  updateSeller,
} = require("../controllers/seller");
const { isSignedIn, isAuthenticated } = require("../controllers/sellerAuth");

router.param("sellerId", getSellerById);

router.get("/seller/:sellerId", isSignedIn, isAuthenticated, getSeller);
router.put(
  "/seller/:sellerId/update",
  isSignedIn,
  isAuthenticated,
  updateSeller
);

module.exports = router;
