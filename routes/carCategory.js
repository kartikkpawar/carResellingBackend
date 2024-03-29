const express = require("express");
const {
  addcompany,
  addcar,
  addvariant,
  getCompanies,
  getCars,
  getVariants,
  getcarname,
  getvariantmane,
} = require("../controllers/carCategory");
const router = express.Router();
const { isSignedIn } = require("../controllers/sellerAuth");

router.post("/addcompany", addcompany);
router.post("/addcar", addcar);
router.post("/addvariant", addvariant);

router.get("/getcompanies", getCompanies);
router.get("/getcars/:companyId", getCars);
router.get("/getvariants/:carId", getVariants);

// GET CAR Name and variant by id
router.get("/getcarname/:carId", getcarname);
router.get("/getvariantname/:varId", getvariantmane);

// TODO this are the delete routes build and edit them later
// router.delete("/getcompanie", isSignedIn, getCompanies);
// router.delete("/getcars/:companyId", isSignedIn, getCars);
// router.delete("/getvariants/:carId", isSignedIn, getVariants);

module.exports = router;
