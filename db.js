const mongoose = require("mongoose");
const MOGODBURI = process.env.MOGODBCONNECTIONSTRING; // Replace "mydatabase" with the name of your actual database

const dbconnect = async () => {
    try {
         await mongoose.connect(MOGODBURI).then(()=>console.log("CONNECTED TO THE MONGODB DATABASE"));
        
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

module.exports = dbconnect;
