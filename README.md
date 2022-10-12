# Sistema de eleições

Esse repositório contém a correção de um exercício construído em aula

## Como executar

1. Criar uma cópia do arquivo ```.env.example``` com o nome ```.env```
```
cp .env.example .env
```

2. Preencher as variáveis com os valores
```
PORT=

DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DIALECT=
```

3. Instalar os pacotes
```
npm install
```

4. Executar o projeto
```
npm run serve
```

## Descrição do exercício
Implementar uma API que possibilite registrar e consultar votos de um processo eleitoral. Duas rotas devem estar disponíveis.

```get /votes```: consultar todos os votos registrados

```post /vote```: registro do voto

Os dados da votação devem ser salvos no Banco de Dados. A estrutura dessa votação é composta da seguinte forma:

![Modelagem do banco](docs/db.png)

### Legenda
- Role: pres, gov, sen, depf, depe.
- Party: pl, pt, mdb…

### Requisitos
- Utilizar TypeScript
- Implementar a API
- Publicar na sua VM
# mestreDetalheTS
