const mongoose = require("mongoose");
const clc = require("cli-color");
require('dotenv').config();


const dbconnect = async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI);
                console.log(clc.yellowBright('MongoDB connected Successfully'));
        }
        catch (error) {
            console.log(clc.redBright(error))
        };
};
module.exports = dbconnect;
