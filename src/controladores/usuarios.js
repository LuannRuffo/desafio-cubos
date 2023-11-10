const knex = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
require('dotenv').config();

const listarCategorias = async (req, res) => {
    try {

        const categoria = await knex('categorias').returning()

          return res.status(200).json(categoria);

    } catch (error) {
        return res.status(500).json({ mensagem: "erro interno do servidor" });
    }
}
const cadastrarUsuario = async (req, res) => {

    try {

        const { nome, email, senha } = req.body

        if (await knex('usuarios').where({ email }).first()){

            return res.status(400).json({ mensagem: "Já existe um cadastro com esse email"})
        }

        const senhaCryptografada = await bcrypt.hash(senha, 10)

        await knex('usuarios').insert({
            nome,
            email,
            senha: senhaCryptografada
        })

        res.status(204).json()
        
    } catch (error) {
        
        return res.status(500).json({ mensagem: error.message })

    }
}

const realizarlogin = async (req, res) => {

    try {

        const { email, senha } = req.body

        const usuario = await knex('usuarios').where({ email }).first().returning()
        
        if (!usuario) {
            
            return res.status(404).json({
                mensagem: "Senha ou email incorreto"
            })
        }
        
        const senhaCorreta = !await bcrypt.compare(senha, usuario.senha)

        if (senhaCorreta){

            return res.status(404).json({
                mensagem: "Senha ou email incorreto"
            })
        }

        let { senha: senhaUsuario, ...usuarioSemSenha } = usuario

        const token = sign(
            {
                id: usuarioSemSenha.id
            },
            process.env.SENHA_JWT,
            {
                'expiresIn': '8h'
            }
        )

        return res.status(200).json({
            mensagem: usuarioSemSenha,
            token
        })
        
    } catch (error) {

        return res.status(500).json({
            mensagem: error.message
        })
    }
}

const detalharUsuario = async (req, res) => {

    try {

        const { id } = req.usuario

        const rows = await knex
        .select('id', 'nome', 'email')
        .from('usuarios')
        .where({ id })
        .first()

        return res.status(200).json(rows)

    } catch (error) {

        return res.status(400).json({ mensagem: error.message })
    }
}
    
const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario

    try {
        
        const emailReq = await knex('usuarios').where({ email })
        const emailUsuario = await knex('usuarios').select('email').where({ id })
        
        if (emailReq.length > 0 && emailReq[0].email !== emailUsuario[0].email){

            return res.status(400).json({ mensagem: "Já existe um cadastro com esse email"})

        }

        const senhaCripografada = await bcrypt.hash(`${senha}`, 10)
        await knex('usuarios')
        .where({ id })
        .update({
            nome,
            email,
            senha: senhaCripografada
        })

        return res.status(204).json()

    } catch (error) {

        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = {
    listarCategorias,
    cadastrarUsuario,
    realizarlogin,
    detalharUsuario,
    atualizarUsuario
}
