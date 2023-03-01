const express = require("express");
const router = express.Router();
const { Cryptocurrency } = require("../modules/cryptocurrency");
const { Wallets } = require("../modules/wallets");
const { isUserQuery, isUserBody } = require("../middleware/auth");




router.get("/", isUserQuery, async (req, res) => {
  try {

    let wallets = await Wallets.find({ userId: req.query.email });
    const cryptocurrencies = await Cryptocurrency.find();
    updateAllWallets(wallets, cryptocurrencies);
    wallets = await Wallets.find({ userId: req.query.email });
    res.status(200).send(wallets);
  } catch (err) {

    res.status(500).send(err);
  };
});

// update all wallet

function updateAllWallets(wallets, cryptocurrencies) {
  if (wallets) {
    if (cryptocurrencies) {
      wallets.forEach(wallet => {

        var cryptos = wallet.cryptocurrenciesList;

        let count = 0;
        let cost = 0;
        cryptos.forEach((crpt, index) => {
          count = count + 1;
          const fnd = cryptocurrencies.find((crypto) => (crypto.cryptoName === crpt.cryptoType));
          if (fnd) {
            cryptos[index].cryptoCost = crpt.cryptoAmount * fnd.cryptoCost;
            cost = cost + cryptos[index].cryptoCost;
          }
        }

        )


        wallet.cryptocurrenciesList = cryptos;
        wallet.cryptosCount = count;
        wallet.cryptosCost = cost;
        try {
          wallet.save();
        } catch (error) {

        }
      });
    }
  }
};



module.exports = router;