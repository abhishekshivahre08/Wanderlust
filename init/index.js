const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

const Mongourl = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to db");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongourl);
}

const initDB = async() => {
    initData.data = initData.data.map((obj) => ({...obj, owner: "69398658db316ea5d7722923" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();