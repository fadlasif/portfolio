/**
 * routes/contact.js
 * POST /api/contact — receives form data and saves to MongoDB
 */

const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  /* Basic validation */
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Message too short.' });
  }

  try {
    /* Save to MongoDB */
    const contact = await Contact.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      message: message.trim(),
    });

    console.log(`✅ Saved: ${contact.name} <${contact.email}> [${contact._id}]`);

    res.status(201).json({ success: true, message: "Message saved successfully!" });

  } catch (err) {
    console.error('❌ Save error:', err.message);
    res.status(500).json({ success: false, error: 'Server error. Try again.' });
  }
});

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;