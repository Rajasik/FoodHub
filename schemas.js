const Joi = require('joi');

module.exports.hubSchema =  Joi.object({
    hub: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})