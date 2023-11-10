const knex = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");

const validarBancoDeDados = async (req, res, next) => {

    try {

        const { email, cpf } = req.body
        const { id } = req.params

        if (id) {

            const idPesquisado = await knex('clientes').select('cpf', 'email').where({ id })

            if (idPesquisado.length > 0) {

                const cpfDoID = await bcrypt.compare(cpf, idPesquisado[0].cpf)

                if (cpfDoID && idPesquisado[0].email === email) {

                    return next()
                }

            }

        }
        
        const procurarCPF = await knex('clientes')
        .select('cpf')

        for (const linha of procurarCPF) {
            
            if (await bcrypt.compare(cpf, linha.cpf)) {

                return res.status(400).json({ mensagem: "CPF já esta sendo usado" })
            }
        }

    if (await knex('clientes').where({ email }).first()) {

       return res.status(400).json({ mensagem: "Email já esta sendo usado" })
    }

    next()

    } catch (error) {

        return res.status(400).json({
            mensagem: error.message
        }) 
    }

}

module.exports = validarBancoDeDados