# BookTrack Backend

Projeto desenvolvido para a disciplina **Projetos Integrados** do curso de **Desenvolvimento Web Full Stack** da **PUC Minas**. Ele consiste em uma API construída com **Express** e utiliza o banco de dados **PostgreSQL**. O projeto segue os princípios da **arquitetura hexagonal**, garantindo uma separação clara entre camadas de domínio, aplicação e infraestrutura.

O objetivo do BookTrack é facilitar o gerenciamento de livros e comentários, oferecendo rotas para registrar, atualizar, visualizar e deletar livros, bem como adicionar e remover comentários.

## Repositórios relacionados

[Repositório do frontend](https://github.com/marcosparreiras/book-track-frontend)

[Repositório da iac](https://github.com/marcosparreiras/book-track-iac)

## Requisitos funcionais

- [x] Deve ser possível criar um usuário comum;
- [x] Deve ser possível um usuário iniciar uma sessão com seu email e password;
- [x] Deve ser possível atualizar o avatar de um usuário;
- [x] Deve ser possível de recuperar os dados de perfil de um usuário authenticado;
- [x] Deve ser possível um administrador cadastrar um livro;
- [x] Deve ser possível um administrador atualizar as informações de um livro;
- [x] Deve ser possível um administrador deletar um livro;
- [x] Deve ser possivel um usuário criar apenas um único comentário por livro;
- [x] Deve ser possível um usuário deletar os seu comentario em um livro;
- [x] Deve ser possível listar os livros cadastrados utilizando parametros de paginação;
- [x] Deve ser possível buscar livros por títulos;
- [x] Deve ser possível buscar um livro por seu id, o livro deve ser recuperado com os seus comentários e os dados dos usuários;

## Requisitos não funcionais

- [x] Deve persistir dados em um banco de dados PostgreSQL;
- [x] Deve persistir imagens em um bucket S3;
- [x] Deve possuir testes de integração e unidade;
- [x] Deve ser disponibilizado por container Docker;
- [x] Deve ser implantado na AWS;
- [x] Deve possuir logs estrututados;
- [x] Deve possuir pipeline de CI/CD no Github Actions;

# Rotas

| Método | Rota                  | Descrição                       |
| ------ | --------------------- | ------------------------------- |
| GET    | /health               | Verificar a saúde da API        |
| POST   | /users                | Registrar um novo usuário       |
| POST   | /session              | Autenticar um usuário           |
| GET    | /me                   | Obter dados do usuário logado   |
| PATCH  | /me/avatar            | Atualizar avatar do usuário     |
| POST   | /book                 | Registrar um novo livro         |
| GET    | /book                 | Obter lista de livros           |
| GET    | /book/:bookId         | Obter detalhes de um livro      |
| PUT    | /book/:bookId         | Atualizar dados de um livro     |
| DELETE | /book/:bookId         | Deletar um livro                |
| POST   | /book/:bookId/comment | Adicionar comentário a um livro |
| DELETE | /comment/:commentId   | Deletar um comentário           |

# Banco de dados

## Execute o banco localmente com o docker

```bash
docker run --rm -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_DB=booktrack -e POSTGRES_PASSWORD=admin -v ./schema.sql:/docker-entrypoint-initdb.d/schema.sql -d postgres
```

## Tabelas

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP NOT NULL
);

CREATE TABLE comments (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 book_id TEXT NOT NULL,
 content TEXT NOT NULL,
 rate INTEGER NOT NULL,
 CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT book_fk FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

# Execute a aplicação localmente

```bash
npm insatall # Para instalar as dependências
npm run dev # Para executar a aplicação em modo de desnvolvimento
```
