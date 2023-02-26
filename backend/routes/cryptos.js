const express = require("express");
const router = express.Router();
const { Cryptocurrency } = require("../modules/cryptocurrency");




router.get ("/", async (req,res) => {
    try {

        const cryptocurrencies = await Cryptocurrency.find();

        res.status(200).send(cryptocurrencies);
    } catch(err) {

        res.status(500).send(err);
    };
})



module.exports = router;