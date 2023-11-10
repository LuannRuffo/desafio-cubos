const joi = require('joi');

const esquemaUsuario = joi.object({

    nome: joi.string().required().trim().messages({
		'any.required': 'O campo nome é obrigatório',
		'string.empty': 'O campo nome é obrigatório',
	}),

    email: joi.string().email().required().trim().messages({
		'string.email': 'O campo email precisa ter um formato válido',
		'any.required': 'O campo email é obrigatório',
		'string.empty': 'O campo email é obrigatório',
	}),

    senha: joi.string().required().trim().messages({
        'string.empty': 'O campo senha é obrigatório',
        'any.required': 'O campo senha é obrigatório',
    })
});

module.exports = esquemaUsuario