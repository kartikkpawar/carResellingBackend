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
  getBid,
  deleteBid,
  editCar,
  carBids,
} = require("../controllers/cars");
const router = express.Router();
const { getSellerById } = require("../controllers/seller");
const {
  isSignedIn,
  isAuthenticated,
  isSeller,
} = require("../controllers/sellerAuth");
const { isBuyer, isAuthenticatedBuyer } = require("../controllers/buyerAuth");
const { getBuyerById } = require("../controllers/buyer");

router.param("sellerId", getSellerById);
router.param("buyerId", getBuyerById);
router.param("carId", getCarById);
router.param("bidId", getBidbyId);

router.post("/addCar/:sellerId", isSignedIn, isAuthenticated, isSeller, addCar);
router.put(
  "/:sellerId/editcar/:carId",
  isSignedIn,
  isAuthenticated,
  isSeller,
  editCar
);

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
  "/:buyerId/sendrequest/:carId",
  isSignedIn,
  isAuthenticatedBuyer,
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
router.delete("/deleteBid/:bidId", isSignedIn, deleteBid);

router.get(
  "/:buyerId/buyerBids",
  isSignedIn,
  isAuthenticatedBuyer,
  isBuyer,
  buyerMyBid
);
router.get("/bid/:bidId", getBid);
router.get("/carBids/:carId", carBids);

module.exports = router;
