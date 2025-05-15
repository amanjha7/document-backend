const express = require('express');
const router = express.Router();

// Example route
router.get('/ping', (req, res) => {
  res.send('pong');
});



module.exports.routes = router;
