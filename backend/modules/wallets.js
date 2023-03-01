const mongoose = require("mongoose");

const walletsSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        walletName: { type: String, require: true },
        walletDescription: { type: String, require: true },
        cryptosCount: { type: Number, require: true },
        cryptosCost: { type: Number, require: true },
        cryptocurrenciesList: {
            type: [
                {
                    cryptoName: { type: String },
                    cryptoType: { type: String },
                    image: { type: Object },
                    imageUrl: { type: Object },
                    cryptoDescription: { type: String },
                    cryptoAmount: { type: Number },
                    cryptoCost: { type: Number },
                }
            ],
            default: []
        },

    },
    {
        timestamps: true,
    }
);

const Wallets = mongoose.model("Wallets", walletsSchema);

exports.Wallets = Wallets;