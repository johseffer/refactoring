# Sistema de Geração de Extratos Teatrais

Este projeto implementa um sistema para gerar extratos de faturamento para performances teatrais.

## Estrutura do Projeto

- `statement.js` - Contém a função principal `statement` e função auxiliar `amountFor`
- `statement.test.js` - Suite completa de testes unitários
- `run.js` - Script para executar o sistema com dados de exemplo
- `invoices.json` - Dados de exemplo de faturas
- `plays.json` - Dados de exemplo de peças teatrais
- `package.json` - Configurações do projeto e dependências

## Funcionalidades

### Função `statement(invoice, plays)`
Gera um extrato formatado contendo:
- Nome do cliente
- Lista de performances com valores e número de assentos
- Valor total devido
- Créditos por volume ganhos

### Tipos de Peças Suportadas
- **Tragédia**: Valor base $400.00, taxa extra de $10.00 por espectador acima de 30
- **Comédia**: Valor base $300.00 + $3.00 por espectador, taxa extra de $100.00 + $5.00 por espectador acima de 20

### Cálculo de Créditos
- Créditos base: máximo de (audiência - 30, 0) para qualquer tipo
- Créditos extras para comédias: audiência ÷ 5 (arredondado para baixo)

## Executando o Sistema

### Instalação das Dependências
```bash
npm install
```

### Executar com Dados de Exemplo
```bash
node run.js
```

### Executar Testes
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Testes Implementados

### Cenários Básicos
- ✅ Extrato para performance única de tragédia
- ✅ Extrato para performance única de comédia  
- ✅ Extrato para múltiplas performances

### Cálculos de Valores
- ✅ Tragédias com audiência ≤ 30 e > 30
- ✅ Comédias com audiência ≤ 20 e > 20

### Cálculos de Créditos
- ✅ Créditos base para qualquer tipo
- ✅ Créditos extras para comédias
- ✅ Não dar créditos negativos

### Formatação
- ✅ Formatação monetária correta
- ✅ Inclusão do nome do cliente
- ✅ Número de assentos por performance

### Casos Extremos
- ✅ Fatura sem performances
- ✅ Audiência zero
- ✅ Audiência muito grande

### Validação de Erros
- ✅ Tipo de peça desconhecido
- ✅ PlayID inexistente

## Cobertura de Testes

Os testes cobrem:
- **20 casos de teste** implementados
- **100% das funcionalidades** da função `statement`
- **Todos os cenários** da função `amountFor`
- **Casos extremos** e validação de erros
- **Formatação** e apresentação dos dados

## Exemplo de Uso

```javascript
const { statement } = require('./statement.js');

const invoice = {
  customer: "BigCo",
  performances: [
    { playID: "hamlet", audience: 55 },
    { playID: "as-like", audience: 35 }
  ]
};

const plays = {
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" }
};

console.log(statement(invoice, plays));
```

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Jest** - Framework de testes
- **JavaScript ES6+** - Linguagem de programação
