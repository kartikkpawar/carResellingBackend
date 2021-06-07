const express = require("express");
const router = express.Router();
const { signUp, singIn, signOut } = require("../controllers/buyerAuth");

router.post("/buyer/signup", signUp);
router.post("/buyer/signin", singIn);
router.get("/signout", signOut);

module.exports = router;
