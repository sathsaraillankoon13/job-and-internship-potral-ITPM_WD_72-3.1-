const express = require("express");
const router = express.Router();
const { sendAssistantMessage } = require("../controllers/assistantController");

router.post("/message", sendAssistantMessage);

module.exports = router;
