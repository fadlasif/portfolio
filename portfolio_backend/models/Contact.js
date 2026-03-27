/**
 * models/Contact.js
 * Stores contact form submissions in MongoDB
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true } // auto adds createdAt + updatedAt
);

module.exports = mongoose.model('Contact', contactSchema);