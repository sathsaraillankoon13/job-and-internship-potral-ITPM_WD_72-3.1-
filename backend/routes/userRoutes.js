const express = require('express');
const router = express.Router();
const User = require('../models/User');

function sanitizeUser(userDoc) {
  if (!userDoc) return null;
  const user = typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
}

// GET USERS (for admin dashboard recent registrations)
router.get('/', async (req, res) => {
  try {
    const includeAll = String(req.query.all || '').toLowerCase() === 'true';
    const query = User.find({}, { password: 0 }).sort({ createdAt: -1 });

    if (!includeAll) {
      const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 100));
      query.limit(limit);
    }

    const users = await query;

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE USER (admin)
router.put('/:id', async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'name', 'role', 'status', 'email', 'type', 'phoneNumber'];
    const payload = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        payload[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE USER STATUS (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const nextStatus = String(req.body?.status || '').trim().toLowerCase();
    const allowedStatuses = ['active', 'pending', 'suspended'];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: nextStatus },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

    res.json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
