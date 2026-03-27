/**
 * server.js — Portfolio Contact Backend
 * Saves form submissions to MongoDB. That's it.
 */

require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');

const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(express.json());
app.use(cors());

/* ── MongoDB ── */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });

/* ── Routes ── */
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/contact', contactRoutes);

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});