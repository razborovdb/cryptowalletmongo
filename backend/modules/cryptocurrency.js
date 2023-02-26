const mongoose = require("mongoose");

const cryptocurrencySchema = new mongoose.Schema ({
    cryptoName: {type: String, require: true},
    image: {type: Object, require: true},
    imageUrl: {type: Object, require: true},
    cryptoDescription: {type: String, require: true},
    cryptoAmount: {type: Number, require: true},
    cryptoCost: {type: Number, require: true},
},
{
    timestamps: true,
});

const Cryptocurrency = mongoose.model("Cryptocurrency", cryptocurrencySchema);

exports.Cryptocurrency = Cryptocurrency;