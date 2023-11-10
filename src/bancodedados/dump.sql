
create database pdv;

create table if not exists usuarios (
id serial primary key,
nome varchar (50),
email varchar (50) unique not null,
senha varchar (150) not null
);

create table if not exists categorias (
    id serial primary key,
    descricao text
);

create table if not exists produtos (
  id serial primary key
  produto_imagem BYTEA NOT NULL,
  descricao text unique not null,
  quantidade_estoque integer not null,
  valor integer not null,
  categoria_id integer references categorias(id)
);

create table if not exists clientes (
  id serial primary key
  nome varchar(50) not null,
  email varchar(50) unique not null,
  cpf varchar(150) unique not null,
  cep varchar(10),
  rua varchar(50),
  numero varchar(10),
  bairro varchar(50),
  cidade varchar(50),
  estado varchar(50)
);

create table if not exists pedidos (
id serial primary key,
cliente_id integer references clientes(id),
observacao varchar(50),
valor_total integer not null
);

create table if not exists pedido_produtos (
id serial primary key,
pedido_id integer references pedidos(id),
produto_id integer references produtos(id),
quantidade_produto integer not null,
valor_produto integer not null
);

insert into categorias (descricao)
values 
('informatica'),
('celulares'),
('beleza e perfumaria'),
('mercado'),
('livros e papelaria'),
('brinquedos'),
('moda'),
('bebe'),
('games');
