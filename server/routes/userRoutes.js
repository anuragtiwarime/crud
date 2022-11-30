const express = require("express");
const {
  home,
  createUser,
  getUsers,
  deleteUser,
  editUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", home);
router.post("/createUser", createUser);
router.get("/getUsers", getUsers);
router.put("/editUser/:id", editUser);
router.delete("/deleteUser/:id", deleteUser);

module.exports = router;
