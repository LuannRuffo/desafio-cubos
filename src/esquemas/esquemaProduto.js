const joi = require('joi');

const esquemaProduto = joi.object({

    descricao: joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição é obrigatório',
    }),

    quantidade_estoque: joi.number().required().messages({
        'any.required': 'O campo quantidade em estoque é obrigatório',
        'string.empty': 'O campo quantidade em estoque é obrigatório',
        'number.integer': 'O campo precisa ser um numero inteiro',
    }),

    valor: joi.number().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'string.empty': 'O campo valor é obrigatório',
        'number.integer': 'O campo precisa ser um numero inteiro em centavos',
    }),

    categoria_id: joi.number().required().messages({
        'any.required': 'O campo categoria é obrigatório',
        'string.empty': 'O campo id da categoria é obrigatório',
        'number.integer': 'O campo precisa ser um numero inteiro',
    })
});

module.exports = esquemaProduto