# desafio-cubos

## ⭐Tecnologias usadas no projeto

- Node.js 
- HTML 5 / CSS
- SQL Server (Postgres)

### ⭐Bibliotecas aplicadas

- aws-sdk
- bcrypt
- dotenv
- express
- handlebars
- joi
- jwt
- knex
- multer
- nodemailer

### ⭐bibliotecas de desenvolvimento

- nodemon

## ⭐Descrição do projeto

- criar um banco de dados e manipular.
- fizemos um crud para:

    - usuarios do projeto
    - clientes
    - produtos
    - e pedidos

- para os crud utilizamos cryptografia hash para garantir a proteção de dados sensiveis
como cpf e senha
- verificamos se email e cpf é valido, ou se outra pessoa esta usando o email ou cpf identico.
- utilizamos um servidor SMTP para os envios de email onde ultilizamos html/css para estilização.
- ultilizamos uma plataforma para deploy.
- ultilizamos uma plataforma para envio de imagem para nao desgastar nosso banco de dados.
- garantimos quando fizesse o pedido do produto ele teria em estoque.
- verificamos cada produto do pedido e registramos com o id do cliente.