# Teste Técnico NodeJS

Desenvolva uma API RESTful de “Avaliações” em NodeJS, utilizando Express e TypeScript. Nenhum framework adicional deve ser utilizado. Decisões de
arquitetura e organização do projeto serão avaliadas. Não utilize ORM para comunicação com o Banco de Dados.

## Requisitos da API

A API deve permitir ao usuário cadastrar, editar, excluir e listar avaliações em rotas autenticadas.   Os atributos de uma avaliação devem ser os seguintes:

- **id**: ID da avaliação.
- **userId**: ID do usuário que fez a avaliação.
- **rating**: Nota da avaliação (1 a 5).
- **comment**: Comentário da avaliação.

### Requisitos

- **Banco de Dados** MongoDB
- **Documentação da API** Swagger
- **Validação dos dados de entrada**
- **Tratamento de erros**
- **Rotas protegidas** Padrão Bearer Authentication
- **Testes unitários** Jest
- **Testes de integração** Supertest

### Diferenciais

- Refresh Token
- Rotas protegidas por controle de acesso de usuário
-  Implementar endpoints adicionais que utilizem operações avançadas e agregações do MongoDB

## Instruções

Você pode disponibilizar o código em algum repositório público do GitHub
ou algum similar com as instruções de como executá-lo no read-me
