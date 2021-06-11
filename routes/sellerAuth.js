const express = require("express");
const router = express.Router();
const { signUp, singIn, signOut } = require("../controllers/sellerAuth");

router.post("/seller/signup", signUp);
router.post("/signin/seller", singIn);
router.post("/signout", signOut);

module.exports = router;
