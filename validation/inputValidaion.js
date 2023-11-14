const Joi = require('joi')

function validateSignup(data) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().error(() => 'Passwords do not match'),
    });

    return schema.validate(data);
}

module.exports = {
    validateSignup,
};
