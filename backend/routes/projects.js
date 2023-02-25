const express = require("express");
const router = express.Router();
const { Projects } = require("../modules/projects");




router.get ("/", async (req,res) => {
    try {

        const projects = await Projects.find();

        const pr = projects ? projects[0] : {};

        res.status(200).send(pr);
    } catch(err) {

        res.status(500).send(err);
    };
})



module.exports = router;