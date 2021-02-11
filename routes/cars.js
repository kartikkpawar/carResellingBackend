const express = require("express");
const {
  addCar,
  sellerCars,
  getCarById,
  deleteCar,
  getAllCars,
  makeBid,
  getBidbyId,
  bidMakerInfo,
  highestBid,
  getCar,
  carImages,
  soldStatus,
  sellerMyBid,
  buyerMyBid,
} = require("../controllers/cars");
const router = express.Router();
const { getSellerById } = require("../controllers/seller");
const {
  isSignedIn,
  isAuthenticated,
  isSeller,
} = require("../controllers/sellerAuth");
const { isBuyer } = require("../controllers/buyerAuth");

router.param("sellerId", getSellerById);
router.param("carId", getCarById);
router.param("bidId", getBidbyId);

router.post("/addCar/:sellerId", isSignedIn, isAuthenticated, isSeller, addCar);

// NOTE Details: Use to view the all cars uploaded by the seller
router.get(
  "/mycars/:sellerId",
  isSignedIn,
  isAuthenticated,
  isSeller,
  sellerCars
);
router.delete(
  "/cars/:sellerId/remove/:carId",
  isSignedIn,
  isAuthenticated,
  isSeller,
  deleteCar
);
router.put(
  "/:sellerId/:carId/soldStatus",
  isSignedIn,
  isAuthenticated,
  isSeller,
  soldStatus
);

router.get("/car/:carId", getCar);
router.get("/car/:carId/photo", carImages);

router.get("/getAllCars", getAllCars);

//TODO secure this route for the buyer
router.post(
  "/sendrequest/:carId",
  isSignedIn,
  isAuthenticated,
  isBuyer,
  makeBid
);
router.get("/bidInfo/:bidId", bidMakerInfo);
router.get("/highestBid/:carId", highestBid);
router.get(
  "/:sellerId/sellerBids",
  isSignedIn,
  isAuthenticated,
  isSeller,
  sellerMyBid
);
router.get(
  "/:buyer/buyerBids",
  isSignedIn,
  isAuthenticated,
  isBuyer,
  buyerMyBid
);

module.exports = router;
