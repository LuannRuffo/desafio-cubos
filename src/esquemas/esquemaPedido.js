const joi = require('joi');

const esquemaPedido = joi.object({

    cliente_id: joi.number().required().messages({
		'any.required': 'O cliente a ser vinculado ao pedido é obrigatório',
		'string.empty': 'O cliente a ser vinculado ao pedido é obrigatório',
	}),

    observacao: joi.string().empty().allow("").trim(),

    pedido_produtos: joi.array().items(
        joi.object({

            produto_id: joi.number().required().messages({
                'string.empty': 'O produto desejado precisa ser informado',
                'any.required': 'O produto desejado precisa ser informado',
            }),

            quantidade_produto: joi.number().required().messages({
                'string.empty': 'Quantidade desejada do produto precisa ser informada',
                'any.required': 'Quantidade desejada do produto precisa ser informada',
            })
        })
        
    ).min(1).messages({
        'array.min': 'Precisa ter pelo menos um pedido'
    })
});

module.exports = esquemaPedido