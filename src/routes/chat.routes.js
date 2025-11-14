const express = require("express");
const chatController = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", chatController.createChat);
router.get("/");
router.get("/messages/:id");
