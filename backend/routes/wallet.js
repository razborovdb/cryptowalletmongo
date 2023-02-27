const express = require("express");
const router = express.Router();
const { Cryptocurrency } = require("../modules/cryptocurrency");
const { Wallets } = require("../modules/wallets");
const {isAdmin, isUserQuery, isUserBody, isUserBodyId} = require("../middleware/auth");

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
        res.status(400).send("Wallet already exist");
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
router.get ("/", isUserQuery, async (req,res) => {
  try {

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
  } catch(err) {

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
            ... req.body,
          },
        },
        { new: true }
      );
        res.status(200).send(updatedWallet);
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



module.exports = router;


