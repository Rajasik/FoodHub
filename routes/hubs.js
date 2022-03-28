const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Hub = require("../models/hub");
const { hubSchema } = require("../schemas.js");

const validateHub = (req, res, next) => {
    const { error } = hubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get(
    "/",
    catchAsync(async (req, res) => {
        const hubs = await Hub.find({});
        res.render("hubs/index", { hubs });
    })
);

router.get("/new", (req, res) => {
    res.render("hubs/new");
});

router.post(
    "/",
    validateHub,
    catchAsync(async (req, res) => {
        const hub = new Hub(req.body.hub);
        await hub.save();
        req.flash("success", "Successfully made a new hub!");
        res.redirect(`/hubs/${hub._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const hub = await Hub.findById(req.params.id).populate("reviews");
        if (!hub) {
            req.flash("error", "Cannot find that hub!");
            return res.redirect("/hubs");
        }
        res.render("hubs/show", { hub });
    })
);

router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
        const hub = await Hub.findById(req.params.id);
        if (!hub) {
            req.flash("error", "Cannot find that hub!");
            return res.redirect("/hubs");
        }
        res.render("hubs/edit", { hub });
    })
);

router.put(
    "/:id/",
    validateHub,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const hub = await Hub.findByIdAndUpdate(id, { ...req.body.hub });
        req.flash("success", "Successfully updated hub!");
        res.redirect(`/hubs/${hub._id}`);
    })
);

router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Hub.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted hub");
        res.redirect(`/hubs`);
    })
);

module.exports = router;
