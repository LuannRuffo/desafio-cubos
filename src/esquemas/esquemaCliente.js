const { validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const esquemaCliente = joi.object({

    email: joi.string().email().required().trim().messages({
		'string.email': 'O campo email precisa ter um formato válido',
		'any.required': 'O campo email é obrigatório',
		'string.empty': 'O campo email é obrigatório',
	}),

    nome: joi.string().required().trim().messages({
		'any.required': 'O campo nome é obrigatório',
		'string.empty': 'O campo nome é obrigatório',
    }),

    cpf: joi.document().cpf().required().trim().messages({
        'any.required': 'O campo CPF é obrigatório',
        'string.empty': 'O campo CPF é obrigatório'
    }),

    cep: joi.string().empty().allow("").trim(),

    rua: joi.string().empty().allow("").trim(),

    numero_casa: joi.number().allow("").messages({
      'number.integer': 'O campo precisa ser um numero inteiro',
  }),

  bairro: joi.string().empty().allow("").trim(),

  cidade: joi.string().empty().allow("").trim(),

  estado: joi.string().empty().allow("").trim()
    
});

module.exports = esquemaCliente