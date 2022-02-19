const express = require('express');

const router = express.Router({ mergeParams: true });

router.route('/:type/:name').get((req, res, next) => {
  console.log(req.params);
  res.sendFile('/');
});

module.exports = router;
