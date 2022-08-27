const Hub = require('../models/hub');

module.exports.index = async (req, res) => {
    const hubs = await Hub.find({});
    res.render('hubs/index', { hubs })
}

module.exports.renderNewForm = (req, res) => {
    res.render('hubs/new');
}

module.exports.createHub = async (req, res, next) => {
    const hub = new Hub(req.body.hub);
    hub.author = req.user._id;
    await hub.save();
    req.flash('success', 'Successfully made a new hub!');
    res.redirect(`/hubs/${hub._id}`)
}

module.exports.showHub = async (req, res,) => {
    const hub = await Hub.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!hub) {
        req.flash('error', 'Cannot find that hub!');
        return res.redirect('/hubs');
    }
    res.render('hubs/show', { hub });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hub = await Hub.findById(id)
    if (!hub) {
        req.flash('error', 'Cannot find that hub!');
        return res.redirect('/hubs');
    }
    res.render('hubs/edit', { hub });
}

module.exports.updateHub = async (req, res) => {
    const { id } = req.params;
    const hub = await Hub.findByIdAndUpdate(id, { ...req.body.hub });
    req.flash('success', 'Successfully updated hub!');
    res.redirect(`/hubs/${hub._id}`)
}

module.exports.deleteHub = async (req, res) => {
    const { id } = req.params;
    await Hub.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hub')
    res.redirect('/hubs');
}