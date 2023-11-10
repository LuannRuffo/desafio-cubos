const jwt = require('jsonwebtoken')
require('dotenv').config()
const knex = require("../bancodedados/conexao")

const autenticarUsuarioLogado = async (req, res, next) => {
   
    const { authorization } = req.headers

    if (!authorization) {

        return res.status(401).json({
            mensagem: "Você precisa estar logado para acessar esta página."
        })
    }

    const token = authorization.split(' ')[1]
    
    try {

        const { id } = jwt.verify(token, process.env.SENHA_JWT)
        const usuario = await knex('usuarios').where({ id }).first()

        if (!usuario) {

            return res.status(401).json({
                mensagem: "Usuário não autorizado."
            })
        }

        req.usuario = usuario

        next()        

    } catch (error) {
        
        return res.status(401).json({
            mensagem: "Usuário não autorizado."
        });
    }
}
    module.exports = {autenticarUsuarioLogado}