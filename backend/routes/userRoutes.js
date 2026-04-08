const express = require('express');
const router = express.Router();
const User = require('../models/User');

// UPDATE PROFILE
router.put('/profile/:id', async (req, res) => {
  try {
    const { firstName, lastName, university, degree, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, university, degree, bio },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    const userToReturn = { ...updatedUser._doc };
    delete userToReturn.password;

    res.json(userToReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
