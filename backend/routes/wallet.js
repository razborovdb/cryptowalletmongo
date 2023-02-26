const express = require("express");
const router = express.Router();
const { Cryptocurrency } = require("../modules/cryptocurrency");
const { Wallet } = require("../modules/wallets");
const {isAdmin, isUserQuery, isUserBody, isUserBodyId} = require("../middleware/auth");

// ADD wallet
router.post("/", isUserBodyId, async (req, res) => {
    
    try {

    const findedWallet = await Wallet.findOne(
        {
            walletName: req.body.walletName,
            userId: req.body.userId,
        }
      );
      if (findedWallet) {
        res.status(400).send("Wallet already exist");
      } else {
        const addedWallet = await Wallet.save(
            {
              $set: {
                ... req.body,
                
              },
            },
            { new: true }
          );
          res.status(200).send(addedWallet);
      }
    } catch (error) {
        res.status(500).send(error);
      }

});




module.exports = router;


