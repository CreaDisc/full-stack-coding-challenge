const express = require('express')
const router = express.Router()

router.use(express.json());

router.post('/', (req, res) => {
    res.send(req.body);
})

router.get('/', (req, res) => {
    const pizzas = require('../example-pizzas.json')
    res.send(pizzas)
})

module.exports = router;