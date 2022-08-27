const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const Hub = require('../models/hub');

mongoose.connect('mongodb://localhost:27017/foodhub');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Hub.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const hub = new Hub({
            author: '63096725b9267dd3978fc560',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/1353633',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium nisi aut neque ratione in dolorem ipsam recusandae omnis pariatur? Nihil eligendi doloremque nam perspiciatis possimus. Quisquam accusamus ullam unde illum?'
        })
        await hub.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})