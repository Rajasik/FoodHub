const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { hubSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
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

const validateHub = (req, res, next) => {
    const { error } = hubSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/hubs', catchAsync(async (req, res) => {
    const hubs = await Hub.find({})
    res.render('hubs/index', { hubs })
}))

app.get('/hubs/new', (req, res) => {
    res.render('hubs/new');
})

app.post('/hubs', validateHub, catchAsync(async (req, res) => {
    const hub = new Hub(req.body.hub);
    await hub.save();
    res.redirect(`/hubs/${hub._id}`)
}))

app.get('/hubs/:id', catchAsync(async (req, res) => {
    const hub = await Hub.findById(req.params.id)
    res.render('hubs/show', { hub })
}))

app.get('/hubs/:id/edit', catchAsync(async (req, res) => {
    const hub = await Hub.findById(req.params.id)
    res.render('hubs/edit', { hub })
}))

app.put('/hubs/:id/', validateHub, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hub = await Hub.findByIdAndUpdate(id, { ...req.body.hub });
    res.redirect(`/hubs/${hub._id}`);
}))

app.delete('/hubs/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Hub.findByIdAndDelete(id);
    res.redirect(`/hubs`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Listening to port 3000')
})