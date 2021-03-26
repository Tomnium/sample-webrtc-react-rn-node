const express = require('express');
const router = express.Router();

router.get('/:id', (req, res, next) => {
});

router.post('/:id', (req, res, next) => {
    res.status(200).json({data: req.body})
});

module.exports = router;
