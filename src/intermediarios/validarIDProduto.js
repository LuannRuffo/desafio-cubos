const knex = require("../bancodedados/conexao");

const validarIDProduto = async (req, res, next) => {
    
    try {

        const { id } = req.params
        
        if (!await knex('produtos').where({ id }).first()) {

            return res.status(400).json({ mensagem: "Produto não existe em nosso estoque"})
    
        }

        next()

    } catch (error) {
        
        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = validarIDProduto