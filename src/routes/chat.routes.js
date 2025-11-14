const express = require("express");
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware.authUser, chatController.createChat);
router.get("/");
router.get("/messages/:id");
