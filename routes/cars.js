const express = require("express");
const {
  addCar,
  sellerCars,
  getCarById,
  deleteCar,
  getAllCars,
  makeBid,
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

router.get("/getAllCars", getAllCars);
router.post("/sendrequest/:carId", makeBid);

module.exports = router;
