const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

app.use(express.json());

app.use(cors());

const projectsRoute = require("./routes/projects");
app.use("/api/project", projectsRoute);

const port = process.env.PORT || 5000;
const url = process.env.DB_URL;

app.listen(port, console.log('Server running on port ' + port));
mongoose.set('strictQuery', false);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,
    }).then(() => console.log("MongoDB connection successful ..."))
    .catch((err) => console.log("MongoDB connection failed",err.message));