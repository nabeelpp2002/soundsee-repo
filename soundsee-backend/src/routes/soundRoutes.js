const express = require('express');
const router = express.Router();
const soundController = require('../controllers/soundController');

router.post('/log', soundController.logSound);
router.get('/history/:userId', soundController.getHistory);

module.exports = router;
