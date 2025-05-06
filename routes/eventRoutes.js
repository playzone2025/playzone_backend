const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createEvent,
  listEvents,
  joinEvent,
  closeEvent
} = require('../controllers/eventController');

router.post('/create', protect, createEvent);
router.get('/list', protect, listEvents);
router.post('/join/:id', protect, joinEvent);
router.post('/close/:id', protect, closeEvent);

module.exports = router;
