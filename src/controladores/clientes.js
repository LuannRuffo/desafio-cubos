const knex = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");

const cadastrarCliente = async (req, res) => {
    
    try {

        const { nome, email, cpf, cep, rua, numero_casa, bairro, cidade, estado } = req.body


        const cpfCryptografado = await bcrypt.hash(cpf, 10)

        await knex('clientes').insert({
            nome,
            email,
            cpf: cpfCryptografado,
            cep,
            rua,
            numero_casa,
            bairro,
            cidade,
            estado
        })

        res.status(204).json()
        
    } catch (error) {
        
        return res.status(500).json({ mensagem: error.message })

    }

}

const editarCliente = async (req, res) => {

    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero_casa, bairro, cidade, estado } = req.body

    try {

        const cliente = await knex('clientes').where({ id }).first();

        if (!cliente) {

            return res.status(404).json({
                mensagem: `Não foi encontrada Cliente para o ID informado`
            });
        }
           
        const cpfCryptografado = await bcrypt.hash(cpf, 10)


        await knex('clientes')
            .where({ id })
            .update({ 
            nome,
            email,
            cpf: cpfCryptografado,
            cep,
            rua,
            numero_casa,
            bairro,
            cidade,
            estado
        });

        return res.status(200).json({
            mensagem: `Cliente atualizado com sucesso`
        });


    } catch (error) {

        return res.status(500).json({ mensagem: error.message });
    }
};


const listarCliente = async (req, res) => {


    const lista = await knex('clientes')

    return res.status(200).json(lista)
    
}

const detalharCliente = async (req, res) => {

    const {id} = req.params

    try {

        const cliente = await knex('clientes').where({ id }).first();
        
        if (!cliente) {

            return res.status(404).json({mensagem: "Cliente não encontrado"});
       
        }

        return res.status(200).json(cliente);
   
            
    } catch (error) {

        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    cadastrarCliente,
    editarCliente,
    listarCliente,
    detalharCliente
}
