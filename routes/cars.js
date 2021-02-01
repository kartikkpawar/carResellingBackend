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
} = require("../controllers/cars");
const router = express.Router();
const { getSellerById } = require("../controllers/seller");
const {
  isSignedIn,
  isAuthenticated,
  isSeller,
} = require("../controllers/sellerAuth");

router.param("sellerId", getSellerById);
router.param("carId", getCarById);
router.param("bidId", getBidbyId);

router.post("/addCar/:sellerId", isSignedIn, isAuthenticated, isSeller, addCar);

// NOTE Details: Use to view the all cars uploaded by the seller
router.post(
  "/mycars/:sellerId",
  isSignedIn,
  isAuthenticated,
  isSeller,
  sellerCars
);
router.post(
  "/cars/:sellerId/remove/:carId",
  isSignedIn,
  isAuthenticated,
  isSeller,
  deleteCar
);

router.get("/car/:carId", getCar);
router.get("/car/:carId/photo", carImages);

router.get("/getAllCars", getAllCars);

//TODO secure this route for the buyer
router.post("/sendrequest/:carId", makeBid);
router.get("/bidInfo/:bidId", bidMakerInfo);
router.get("/highestBid/:carId", highestBid);

module.exports = router;
