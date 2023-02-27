const express = require("express");
const router = express.Router();
const { Wallets } = require("../modules/wallets");
const {isUserQuery, isUserBody} = require("../middleware/auth");




router.get ("/", isUserQuery, async (req,res) => {
    try {

        const wallets = await Wallets.find({userId: req.query.email});

        res.status(200).send(wallets);
    } catch(err) {

        res.status(500).send(err);
    };
})



module.exports = router;