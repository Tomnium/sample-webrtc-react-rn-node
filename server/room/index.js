const express = require('express');
const router = express.Router();

router.get('/', (req, res) => console.log('Hello World!!!!!'));

router.get('/:id', (req, res, next) => {});

router.post('/:id', (req, res, next) => {
    console.log(req.body);
    res.status(200).json({data: req.body})
});

module.exports = router;
