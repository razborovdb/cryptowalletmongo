const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const { Users } = require("../modules/users");
const {isUserQuery, isUserBody} = require("../middleware/auth");

//GET USER

router.get("/", isUserQuery, async (req, res) => {

    try {
      const user = await Users.findOne({email: req.query.email});

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  //UPDATE USER
  
  router.put("/", isUserBody, async (req, res) => {
    
    try {
      if (req.body.avatarUrl) {
        const destroyResponse = req.body.avatar ? await cloudinary.uploader.destroy(
          req.body.avatar
        ) : true;

        if (destroyResponse) {
          const uploadedResponse = await cloudinary.uploader.upload(
            req.body.avatarUrl,
            {
              upload_preset: "cryptowallet",
            }
          );    

          if (uploadedResponse) {
            const updatedUser = await Users.findOneAndUpdate(
                {email: req.body.email},
              {
                $set: {
                  ... req.body,
                  avatar: uploadedResponse.public_id,
                  avatarUrl: uploadedResponse.url,
                },
              },
              { new: true }
            );
            res.status(200).send(updatedUser);
          }
        } 
        
      } else {
        const updatedUser = await Users.findOneAndUpdate(
            {email: req.body.email},
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).send(updatedUser);
      }
      
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  module.exports = router;