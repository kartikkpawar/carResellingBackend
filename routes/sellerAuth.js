const express = require("express");
const router = express.Router();
const { signUp, singIn, signOut } = require("../controllers/sellerAuth");

router.post("/seller/signup", signUp);
router.post("/seller/signin", singIn);
router.post("/seller/signout", signOut);

module.exports = router;
