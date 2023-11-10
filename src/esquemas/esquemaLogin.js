const joi = require('joi');

const esquemaLogin = joi.object({

    email: joi.string().email().required().messages({
		'string.email': 'O campo email precisa ter um formato válido',
		'any.required': 'O campo email é obrigatório',
		'string.empty': 'O campo email é obrigatório',
	}),

    senha: joi.string().required().messages({
        'string.empty': 'O campo senha é obrigatório',
        'any.required': 'Senha Invalida',
    }),
});

module.exports = esquemaLogin