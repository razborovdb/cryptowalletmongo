const express = require("express");
const router = express.Router();
const { Cryptocurrency } = require("../modules/cryptocurrency");
const axios = require("axios");
const dotenv = require("dotenv");




router.get("/", async (req, res) => {
    try {

        const cryptocurrencies = await Cryptocurrency.find();

        res.status(200).send(cryptocurrencies);
    } catch (err) {

        res.status(500).send(err);
    };
})


router.post("/", async (req, res) => {
    try {

        const url = `http://api.coinlayer.com/live?access_key=`+process.env.CRYPTO_ACCESS_KEY;

        //const getCryptoFromExternalSource = await axios.get(url);



        const cryptosList =  {
            
            BTC: 27159.849078,
            ETC: 19.63375,
            ETH: 1708.041875,
            LTC: 88.117413
          }


        //const cryptosList = getCryptoFromExternalSource.data.rates;

        const map = new Map(Object.entries(JSON.parse(JSON.stringify(cryptosList))));

        var cryptocurrencies = await Cryptocurrency.find();

        

        const newCryptoList = cryptocurrencies.map(async crypto =>  {
            const finded = map.get(crypto.cryptoName);
            if (finded) {
                crypto.cryptoCost = finded;
                await Cryptocurrency.findOneAndUpdate(
                    { cryptoName: crypto.cryptoName },
                    crypto,
                    { new: true }
                )
            }
            return crypto;
        })

        cryptocurrencies = await Cryptocurrency.find();

        res.status(200).send(cryptocurrencies);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    };
})


module.exports = router;