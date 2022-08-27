const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Hub = require('../models/hub');
const { isLoggedIn, isAuthor, validateHub } = require('../middleware');
const hubs = require('../controllers/hubs');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(hubs.index))
    .post(isLoggedIn, upload.array('image'), validateHub, catchAsync(hubs.createHub))

router.get('/new', isLoggedIn, hubs.renderNewForm)

router.route('/:id')
    .get(catchAsync(hubs.showHub))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHub, catchAsync(hubs.updateHub))
    .delete(isLoggedIn, isAuthor, catchAsync(hubs.deleteHub));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hubs.renderEditForm))

module.exports = router;
