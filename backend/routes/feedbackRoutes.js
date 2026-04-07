const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET ALL FEEDBACK
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE FEEDBACK
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment, date } = req.body;
    
    const newFeedback = new Feedback({
      name,
      rating,
      comment,
      date
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
