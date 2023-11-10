const knex = require("../bancodedados/conexao");
const { s3 } = require("../bancodedados/awsConfig");

const cadastroProduto = async (req, res) => {

const {descricao, quantidade_estoque, valor, categoria_id} = req.body

    try {

        if(await knex('produtos').where({ descricao }).first()){

            return res.status(400).json({
                 mensagem: "Ja existe um produto com essa descrição"
                })
        };

        if(!await knex('categorias').where({ id: categoria_id }).first()){

            return res.status(400).json({
                 mensagem: "essa categoria não existe"
                })
        };

        if(req.file){

            const arquivo = await s3.upload({

                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: `produto_imagens/${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            
              }).promise()

            const produto_imagem = arquivo.Location

            const produtoCadastrado = await knex('produtos')
            .insert({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem
              })
        .returning('*');

        res.status(201).json(produtoCadastrado[0])

        };

        const produtoCadastrado = await knex('produtos')
        .insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        })
        .returning('*');

        res.status(201).json(produtoCadastrado[0])
        
    } catch (error) {

        return res.status(400).json({ mensagem: error.message })

    }
}

const editarProduto = async (req, res) => {
    const { id } = req.params
    const { descricao, quantidade_estoque, valor, categoria_id} = req.body

    try {

        if(!await knex('categorias').where({ id: categoria_id }).first()){

            return res.status(400).json({
                 mensagem: "essa categoria não existe"
                })
        }

        if(req.file){

            const arquivo = await s3.upload({

                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: `produto_imagens/${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            
              }).promise()

            const produto_imagem = arquivo.Location

                const produtoEditado = await knex('produtos')
                .where({ id })
                .update({
                    descricao,
                    quantidade_estoque,
                    valor,
                    categoria_id,
                    produto_imagem
        }).returning('*');

        return res.status(200).json(produtoEditado[0])

        };

        const produtoEditado = await knex('produtos')
        .where({ id })
        .update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning('*');

        return res.status(200).json(produtoEditado[0])

    } catch (error) {

        return res.status(500).json({ mensagem: error.message })
    }
}

const listarProduto = async (req, res) => {
    try {

        const { categoria_id } = req.query

        if (categoria_id) {

            const produto = await knex('produtos').where({ categoria_id })

            return res.status(200).json(produto)
        }
        
        const produtos = await knex('produtos').returning()
        return res.status(200).json(produtos);

    } catch (error) {

        return res.status(500).json({ mensagem: "erro interno do servidor" });
    }
}

const detalharProduto = async (req, res) => {
    const { id } = req.params
         
    try {

        const produto = await knex('produtos').where({ id }).first()

      if (!produto) {

        return res.status(400).json({ mensagem: "Produto não encontrado"})

      }

      return res.status(200).json(produto)

    } catch (error) {

      return res.status(500).json({ mensagem: error.message });
    }
  }

    const excluirProduto = async (req, res) => {
    const { id } = req.params;

    try {

        if (await knex('pedido_produtos').where({ produto_id: id }).first()) {

            return res.status(404).json({
                mensagem: "Não é possível excluir um produto vinculado a um pedido"
            });

        }

        const produto = await knex('produtos').where({ id }).first();

        if (!produto) {

            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }
                
        knex('produtos').where({ id }).del()
        
        return res.status(204).json();
        
    } catch (error) {

        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    cadastroProduto,
    editarProduto,
    listarProduto,
    detalharProduto,
    excluirProduto
}