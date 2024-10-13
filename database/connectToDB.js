let mongoose = require("mongoose")
require('dotenv').config()
async function connectToDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("connected to DB");
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectToDB