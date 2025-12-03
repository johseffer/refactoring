// Importação dos módulos necessários
const fs = require('fs');
const path = require('path');
const { statement, htmlStatement } = require('./statement.js');

// Lendo os arquivos JSON
const invoices = JSON.parse(fs.readFileSync(path.join(__dirname, 'invoices.json'), 'utf8'));
const plays = JSON.parse(fs.readFileSync(path.join(__dirname, 'plays.json'), 'utf8'));

// Executando a função para cada fatura
for (const invoice of invoices) {
  const result = statement(invoice, plays);
  console.log(result);
  console.log('-----------------------------------');
}
// Executando a função para cada fatura no formato HTML
for (const invoice of invoices) {
  const result = htmlStatement(invoice, plays);
  console.log(result);
  console.log('-----------------------------------');
}
