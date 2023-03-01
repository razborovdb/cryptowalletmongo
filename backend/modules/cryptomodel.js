const mongoose = require("mongoose");

const cryptoModelSchema = new mongoose.Schema(
    {
        cryptoName: { type: String, require: true },
        cryptoType: { type: String, require: true },
        image: { type: Object, require: true },
        imageUrl: { type: Object, require: true },
        cryptoDescription: { type: String, require: true },
        cryptoAmount: { type: Number, require: true },
        cryptoCost: { type: Number, require: true },
    },
    {
        timestamps: true,
    }
);

const CryptoModel = mongoose.model("CryptoModel", cryptoModelSchema);

exports.CryptoModel = CryptoModel;