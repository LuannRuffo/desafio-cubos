const knex = require('../bancodedados/conexao')
const enviarEmail = require('../email')
require('dotenv').config()
const compiladorHTML = require('../utils/compilador')

const cadastrarPedido = async (req, res) => {
    
    const { cliente_id, observacao, pedido_produtos } = req.body

    try {

        const cliente = await knex('clientes').where({ id: cliente_id }).first()

    if (cliente.length === 0) {

        return res.status(404).json({ mensagem: "Cliente não existe em nosso cadastro"})
    }

    for (let item of pedido_produtos) {
        
        const produto = await knex('produtos').where({ id: item.produto_id }).first()

        if (!produto) {

            return res.status(404).json({
                mensagem: `O produto com id ${item.produto_id} nao existe em nosso estoque`
            }) 
        }

        if (produto.quantidade_estoque < item.quantidade_produto) {

            return res.status(404).json({
                mensagem: `O produto com id ${item.produto_id} não tem essa quantidade no estoque`
            })  
        }
    }

    let precoTotal = 0
    let quantidadeProduto = []
    let nomeProduto = []
    let valorProdutoUn = []
    
    const pedido = await knex('pedidos')
    .insert({
        cliente_id,
        observacao,
        valor_total: precoTotal
    }).returning('id')

    for (let item of pedido_produtos) {

        const produto = await knex('produtos')
        .where({ id: item.produto_id })
        .first()
        .select('valor', 'quantidade_estoque', 'descricao')

        precoTotal += produto.valor * item.quantidade_produto
        
        await knex('produtos')
        .update({ 
            quantidade_estoque: produto.quantidade_estoque - item.quantidade_produto
        })
        .where({ id: item.produto_id })

        await knex('pedido_produtos')
        .insert({
            pedido_id: pedido[0].id,
            produto_id: item.produto_id,
            quantidade_produto: item.quantidade_produto,
            valor_produto: produto.valor
        })

        quantidadeProduto.push(item.quantidade_produto)
        nomeProduto.push(produto.descricao)
        valorProdutoUn.push((produto.valor / 100).toFixed(2))

    }

    await knex('pedidos')
    .update({ valor_total: precoTotal })
    .where({ id: pedido[0].id })

    
       const html = await compiladorHTML("./src/templates/emailPedido.html", {
            nome: cliente.nome,
            id: pedido[0].id,
            quantidadeProduto,
            nomeProduto,
            valorProdutoUn,
            precoTotal: (precoTotal / 100).toFixed(2)
       })

    enviarEmail.sendMail({
        from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
        to: `${cliente.nome} <${cliente.email}>`,
        subject: "Pedido",
        html,
    })

    return res.status(201).json({
        mensagem: 'um email foi enviado com as informações de sua compra'
    })

    } catch (error) {

        return res.status(500).json({ mensagem: error.message })
    }
};

const listarPedidos = async (req, res) => {
    
    try {

        const { cliente_id } = req.query
        
            if(!await knex('pedidos').where({ cliente_id }).first()){
        
                return res.status(400).json({
                    mensagem: "Cliente não cadastrado"
                    })
            }
        
            if (cliente_id) {
        
                const pedidosDoCliente = await knex('pedidos').where({ cliente_id })
        
                return res.status(200).json(pedidosDoCliente)
            }
                
            const todosOsPedidos = await knex('pedidos').returning()
            return res.status(200).json(todosOsPedidos);

        }

    catch (error) {

        return res.status(500).json({ mensagem: "erro interno do servidor" });
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos
};