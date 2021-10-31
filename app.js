const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Hub = require('./models/hub');
const { AsyncResource } = require('async_hooks');

mongoose.connect('mongodb://localhost:27017/foodhub');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/hubs', async (req, res) => {
    const hubs = await Hub.find({})
    res.render('hubs/index', { hubs })
})

app.get('/hubs/new', (req, res) => {
    res.render('hubs/new');
})

app.post('/hubs', async (req, res) => {
    const hub = new Hub(req.body.hub);
    await hub.save();
    res.redirect(`/hubs/${hub._id}`)
})

app.get('/hubs/:id', async (req, res) => {
    const hub = await Hub.findById(req.params.id)
    res.render('hubs/show', { hub })
})

app.get('/hubs/:id/edit', async (req, res) => {
    const hub = await Hub.findById(req.params.id)
    res.render('hubs/edit', { hub })
})

app.put('/hubs/:id/', async (req, res) => {
    const { id } = req.params;
    const hub = await Hub.findByIdAndUpdate(id, { ...req.body.hub });
    res.redirect(`/hubs/${hub._id}`);
})

app.delete('/hubs/:id', async (req, res) => {
    const { id } = req.params;
    await Hub.findByIdAndDelete(id);
    res.redirect(`/hubs`);
})

app.listen(3000, () => {
    console.log('Listening to port 3000')
})