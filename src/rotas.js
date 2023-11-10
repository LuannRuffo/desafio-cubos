const { Router } = require("express");
const multer = require('./services/multer');
const rotas = Router();

const { autenticarUsuarioLogado } = require("./intermediarios/usuarios");
const validarCorpoReq = require("./intermediarios/validarCorpoReq");
const esquemaLogin = require("./esquemas/esquemaLogin");
const esquemaUsuario = require("./esquemas/esquemaUsuario");
const esquemaCliente = require("./esquemas/esquemaCliente");
const validarBancoDeDados = require("./intermediarios/validarBancoDeDados");
const esquemaProduto = require("./esquemas/esquemaProduto");
const validarIDProduto = require("./intermediarios/validarIDProduto");


const {
    cadastrarUsuario,
    realizarlogin,
    atualizarUsuario,
    listarCategorias,
    detalharUsuario
  } = require("./controladores/usuarios");

const {
  cadastroProduto,
  editarProduto,
  listarProduto,
  detalharProduto,
  excluirProduto
} = require('./controladores/produtos');

const { cadastrarCliente,
        editarCliente,
        listarCliente,
        detalharCliente
} = require('./controladores/clientes');

const {
  cadastrarPedido,
  listarPedidos
} = require('./controladores/pedidos');
const esquemaPedido = require("./esquemas/esquemaPedido");

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", validarCorpoReq(esquemaUsuario), cadastrarUsuario);
rotas.post("/login", validarCorpoReq(esquemaLogin), realizarlogin);

rotas.use(autenticarUsuarioLogado);

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarCorpoReq(esquemaUsuario),atualizarUsuario);

rotas.post('/produto', multer.single('arquivo'), validarCorpoReq(esquemaProduto), cadastroProduto);
rotas.put('/produto/:id', multer.single('arquivo'), validarIDProduto, validarCorpoReq(esquemaProduto), editarProduto);
rotas.get('/produto', listarProduto);
rotas.get('/produto/:id', detalharProduto);
rotas.delete('/produto/:id', excluirProduto);

rotas.post('/cliente',validarCorpoReq(esquemaCliente), validarBancoDeDados, cadastrarCliente);
rotas.put('/cliente/:id',validarCorpoReq(esquemaCliente), validarBancoDeDados, editarCliente);
rotas.get('/cliente', listarCliente);
rotas.get('/cliente/:id', detalharCliente);

rotas.post('/pedido',validarCorpoReq(esquemaPedido), cadastrarPedido);
rotas.get('/pedido',listarPedidos);

module.exports = rotas;
