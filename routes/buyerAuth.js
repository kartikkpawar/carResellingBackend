const express = require("express");
const router = express.Router();
const { signUp, singIn, signOut } = require("../controllers/buyerAuth");

router.post("/buyer/signup", signUp);
router.post("/signin/buyer", singIn);
router.get("/signout", signOut);

module.exports = router;
