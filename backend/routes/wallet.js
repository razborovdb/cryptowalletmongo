const express = require("express");
const router = express.Router();
const { Cryptocurrency } = require("../modules/cryptocurrency");
const { Wallets } = require("../modules/wallets");
const { isAdmin, isUserQuery, isUserBody, isUserBodyId } = require("../middleware/auth");

// ADD wallet
router.post("/", isUserBodyId, async (req, res) => {

  try {

    const findedWallet = await Wallets.findOne(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );
    if (findedWallet) {
      return res.status(400).send("Wallet already exist");
    } else {
      const wallet = new Wallets({
        userId: req.body.userId,
        walletName: req.body.walletName,
        walletDescription: req.body.walletDescription,
        cryptosCount: 0,
        cryptosCost: 0,
        cryptocurrenciesList: [],
      });
      const addedWallet = await wallet.save();
      res.status(200).send(addedWallet);
    }
  } catch (error) {

    res.status(500).send(error);
  }

});
// Get one wallet
router.get("/", isUserQuery, async (req, res) => {
  try {
    const wallets = await Wallets.find({ userId: req.query.email });
    const cryptocurrencies = await Cryptocurrency.find();
    updateAllWallets(wallets, cryptocurrencies);
    const wallet = await Wallets.findOne(
      {
        walletName: req.query.walletName,
        userId: req.query.email,
      }
    );
    if (wallet) {

      res.status(200).send(wallet);
    } else {
      res.status(400).send("Wallet doesn't exist");
    }
  } catch (err) {

    res.status(500).send(err);
  };
})

// Update wallet
router.put("/", isUserBodyId, async (req, res) => {

  try {

    const findedWallet = await Wallets.findOne(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );
    if (!findedWallet) {
      res.status(400).send("Wallet doesn't exist");
    } else {
      const updatedWallet = await Wallets.findOneAndUpdate(
        {
          walletName: req.body.walletName,
          userId: req.body.userId,
        },
        {
          $set: {
            ...req.body,
          },
        },
        { new: true }
      );

      const wallets = await Wallets.find({ userId: req.query.email });
      const cryptocurrencies = await Cryptocurrency.find();
      updateAllWallets(wallets, cryptocurrencies);
      const findWallet = await Wallets.findOne(
        {
          walletName: req.body.walletName,
          userId: req.body.userId,
        }
      );

      res.status(200).send(findWallet);
    }
  } catch (error) {

    res.status(500).send(error);
  }

});



//DELETE wallet

router.delete("/", isUserBodyId, async (req, res) => {
  try {
    const wallet = await Wallets.findOne(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );
    if (!wallet) return res.status(404).send("Wallet not found...");

    const deleteProduct = await Wallets.findOneAndDelete(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );
    res.status(200).send(req.body.walletName);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add crypto to wallet
router.post("/crypto/", isUserBodyId, async (req, res) => {

  try {

    const findedWallet = await Wallets.findOne(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );

    if (findedWallet === null) {

      return res.status(400).send("Wallet doesn't exist");
    } else {
      let cryptos = findedWallet.cryptocurrenciesList;


      const findCrypto = cryptos?.find((crypto) => (crypto.cryptoName === req.body.cryptoName))

      if (findCrypto) {
        return res.status(400).send("Crypto already exist");
      }


      if (cryptos) {
        cryptos.push({
          cryptoName: req.body.cryptoName,
          cryptoType: req.body.cryptoType,
          image: req.body.image,
          imageUrl: req.body.imageUrl,
          cryptoDescription: req.body.cryptoDescription,
          cryptoAmount: req.body.cryptoAmount,
          cryptoCost: req.body.cryptoCost,
        });
      } else {
        cryptos = [{
          cryptoName: req.body.cryptoName,
          cryptoType: req.body.cryptoType,
          image: req.body.image,
          imageUrl: req.body.imageUrl,
          cryptoDescription: req.body.cryptoDescription,
          cryptoAmount: req.body.cryptoAmount,
          cryptoCost: req.body.cryptoCost,
        }]
      }

      findedWallet.cryptocurrenciesList = cryptos;
      await findedWallet.save();

      const wallets = await Wallets.find({ userId: req.body.userId });
      const cryptocurrencies = await Cryptocurrency.find();


      updateAllWallets(wallets, cryptocurrencies);
      const findWallet = await Wallets.findOne(
        {
          walletName: req.body.walletName,
          userId: req.body.userId,
        }
      );

      res.status(200).send(findWallet);
    }
  } catch (error) {

    res.status(500).send(error);
  }

});

// Update crypto in wallet
router.put("/crypto/", isUserBodyId, async (req, res) => {

  try {

    const findedWallet = await Wallets.findOne(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );

    if (findedWallet === null) {

      return res.status(400).send("Wallet doesn't exist");
    } else {
      let cryptos = findedWallet.cryptocurrenciesList;


      const findCrypto = cryptos?.find((crypto) => (crypto.cryptoName === req.body.cryptoName))

      if (findCrypto === null) {
        return res.status(400).send("Crypto doesn't exist");
      }

      const newCryptos = cryptos.map(crypto => {

        if (crypto.cryptoName === req.body.cryptoName) {
          crypto.cryptoType = req.body.cryptoType;
          crypto.image = req.body.image;
          crypto.imageUrl = req.body.imageUrl;
          crypto.cryptoDescription = req.body.cryptoDescription;
          crypto.cryptoAmount = req.body.cryptoAmount;
          crypto.cryptoCost = req.body.cryptoCost;
        }
        return crypto;
      })


      findedWallet.cryptocurrenciesList = newCryptos;
      await findedWallet.save();

      const wallets = await Wallets.find({ userId: req.body.userId });
      const cryptocurrencies = await Cryptocurrency.find();


      updateAllWallets(wallets, cryptocurrencies);
      const findWallet = await Wallets.findOne(
        {
          walletName: req.body.walletName,
          userId: req.body.userId,
        }
      );

      res.status(200).send(findWallet);
    }
  } catch (error) {

    res.status(500).send(error);
  }

});


// delete crypto from wallet
router.delete("/crypto/", isUserBodyId, async (req, res) => {

  try {

    const findedWallet = await Wallets.findOne(
      {
        walletName: req.body.walletName,
        userId: req.body.userId,
      }
    );

    if (findedWallet === null) {

      return res.status(400).send("Wallet doesn't exist");
    } else {
      let cryptos = findedWallet.cryptocurrenciesList;


      const findCrypto = cryptos?.find((crypto) => (crypto.cryptoName === req.body.cryptoName))

      if (findCrypto === null) {
        return res.status(400).send("Crypto doesn't exist");
      }


      const newCryptos = cryptos.filter((crypto) => crypto.cryptoName !== req.body.cryptoName);

      findedWallet.cryptocurrenciesList = newCryptos;
      await findedWallet.save();

      const wallets = await Wallets.find({ userId: req.body.userId });
      const cryptocurrencies = await Cryptocurrency.find();


      updateAllWallets(wallets, cryptocurrencies);
      const findWallet = await Wallets.findOne(
        {
          walletName: req.body.walletName,
          userId: req.body.userId,
        }
      );

      res.status(200).send(findWallet);
    }
  } catch (error) {

    res.status(500).send(error);
  }

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


