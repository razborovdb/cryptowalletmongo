const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

app.use(express.json());

app.use(cors());

const userInfoRoute = require("./routes/userinfo");
app.use("/api/user", userInfoRoute);

const cryptosRoute = require("./routes/cryptos");
app.use("/api/cryptos", cryptosRoute);

const cryptoRoute = require("./routes/crypto");
app.use("/api/crypto", cryptoRoute);

const loginRoute = require("./routes/login");
app.use("/api/user/login", loginRoute);

const registerRoute = require("./routes/register");
app.use("/api/user/register", registerRoute);

const walletsRoute = require("./routes/wallets");
app.use("/api/wallets", walletsRoute);

const walletRoute = require("./routes/wallet");
app.use("/api/wallet", walletRoute);

const projectsRoute = require("./routes/projects");
app.use("/api/project", projectsRoute);

const port = process.env.PORT || 5000;
const url = process.env.DB_URL;

app.listen(port, console.log('Server running on port ' + port));
mongoose.set('strictQuery', false);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,
    }).then(() => console.log("MongoDB connection successful ..."))
    .catch((err) => console.log("MongoDB connection failed",err.message));