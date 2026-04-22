const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');

router.get('/', async (req, res) => {
  try {
    const data = await Interview.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newDoc = new Interview(req.body);
    await newDoc.save();
    res.json(newDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedDoc = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
