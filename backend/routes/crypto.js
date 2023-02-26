const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const { Cryptocurrency } = require("../modules/cryptocurrency");
const {isAdmin} = require("../middleware/auth");

// GET crypto from cryptocyrrencies list


router.get ("/", async (req,res) => {
    try {

        const crypto = await Cryptocurrency.findOne({cryptoName: req.query.cryptoName});

        res.status(200).send(crypto);
    } catch(err) {

        res.status(500).send(err);
    };
})



// ADD crypto
router.post("/", isAdmin, async (req, res) => {
    const {cryptoName, image, imageUrl, cryptoDescription, cryptoAmount, cryptoCost} = req.body;
    
    try {
        
        if(imageUrl) {
            const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                upload_preset: "cryptowallet"
            });
            
            if (uploadRes) {
                const crypto = new Cryptocurrency({
                    cryptoName, cryptoDescription, cryptoAmount, cryptoCost,
                    image: uploadRes.public_id,
                    imageUrl: uploadRes.url
                });

                const savedCrypto = await crypto.save();

                

                res.status(200).send(savedCrypto);
                
            } else {
                const crypto = new Cryptocurrency({
                    cryptoName, cryptoDescription, cryptoAmount, cryptoCost,
                    image, imageUrl
                });
    
                const savedCrypto = await crypto.save();
                res.status(200).send(savedCrypto);
            }
        } else {
            const crypto = new Cryptocurrency({
                cryptoName, cryptoDescription, cryptoAmount, cryptoCost,
                image, imageUrl
            });

            const savedCrypto = await crypto.save();

            res.status(200).send(savedCrypto);
        }
    } catch(err) {

        res.status(500).send(err);
    };

});

//UPDATE

router.put("/", isAdmin, async (req, res) => {

  try {
    if (req.body.imageUrl) {
      const destroyResponse = req.body.image ? await cloudinary.uploader.destroy(req.body.image) : true;
      
      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.imageUrl,
          {
            upload_preset: "cryptowallet",
          }
        );    
        if (uploadedResponse) {
          const updatedCrypto = await Cryptocurrency.findOneAndUpdate(
            {cryptoName: req.body.cryptoName},
            {
              $set: {
                ... req.body,
                image: uploadedResponse.public_id,
                imageUrl: uploadedResponse.url,
              },
            },
            { new: true }
          );
          res.status(200).send(updatedCrypto);
        }
      } 
      
    } else {
      const findedCrypto = await Cryptocurrency.findOne(
        {cryptoName: req.body.cryptoName},
      );
      if (findedCrypto) {
        const updatedCrypto = await Cryptocurrency.findOneAndUpdate(
              {cryptoName: req.body.cryptoName},
          {
            $set: {
              ... req.body,
              image: findedCrypto.public_id,
              imageUrl: findedCrypto.url,
            },
          },
          { new: true }
        );
        res.status(200).send(updatedCrypto);
      } else {
        res.status(400).send("Crypto nor found");
      }
    }
    
  } catch (error) {
    res.status(500).send(error);
  }
});

//DELETE

router.delete("/", isAdmin, async (req, res) => {
    try {
        const crypto = await Cryptocurrency.findOne({cryptoName: req.body.cryptoName});
        if (!crypto) return res.status(404).send("Crypto not found...");
        if(crypto.image) {
            const destroyResponse = await cloudinary.uploader.destroy(
                crypto.image
            );

                const deleteCrypto = await Cryptocurrency.findOneAndDelete({cryptoName: req.body.cryptoName});
                res.status(200).send(req.body.cryptoName);
            
        } else {
          const deleteCrypto = await Cryptocurrency.findOneAndDelete({cryptoName: req.body.cryptoName});
          res.status(200).send(req.body.cryptoName);
        }
  
    } catch (error) {
      res.status(500).send(error);
    }
  });






module.exports = router;