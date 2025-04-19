const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, authenticateUser } = require("../middlewares/auth");

router.get("/", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile", userController.profile);
router.get("/current", verifyToken, (req, res) => {
  const { id, full_name, email, phone, address, created_at } = req.user;

  res.json({
    user: {
      id,
      full_name,
      email,
      phone,
      address,
      created_at,
    },
  });
});




module.exports = router;
