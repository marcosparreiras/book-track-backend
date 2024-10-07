# BookTrack Backend

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
- [] Deve possuir pipeline de CI/CD no Github Actions;
