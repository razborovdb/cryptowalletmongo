const bcrypt = require("bcrypt");
const joi = require("joi");
const express = require("express");
const { Users } = require("../modules/users");
const genAuthToken = require("../utils/genWebAuthToken");

const router = express.Router();

router.post("/", async (req, res) => {

    let user = await Users.findOne({email: req.body.email});
    if (user) return res.status(400).send("User already exist ...");

    user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save()
    .then(item => {
        const token = genAuthToken(item);
        res.send(token);
    })
    .catch(err => {
        res.status(400).send(err.message);
    });

} );

module.exports = router;