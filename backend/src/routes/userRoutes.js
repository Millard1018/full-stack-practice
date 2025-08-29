const express = require("express");
const authenticateToken = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const {createUser, pagination, getUser, postLog, getLog, getRole, changeRole, deleteUser, refreshToken} = require("../controllers/userController");

const router = express.Router();

router.post("/signups", createUser);
router.post("/login", postLog);
router.post("/auth/refresh", refreshToken);
router.get("/users", pagination);
router.get("/signups", getUser);
router.get("/login", authenticateToken, authorization('user', 'admin', 'superadmin'), getLog);
router.get("/role", authenticateToken, authorization('user', 'admin', 'superadmin'), getRole);
router.post("/change-role", changeRole);
router.delete("/user/:id", deleteUser);

module.exports = router;
