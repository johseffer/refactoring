const { statement } = require('./statement.js');

describe('Statement Function', () => {
  // Dados de teste básicos
  const basicPlays = {
    "hamlet": { "name": "Hamlet", "type": "tragedy" },
    "as-like": { "name": "As You Like It", "type": "comedy" },
    "othello": { "name": "Othello", "type": "tragedy" }
  };

  describe('Cenários básicos', () => {
    test('deve gerar extrato para uma única performance de tragédia', () => {
      const invoice = {
        customer: "BigCo",
        performances: [
          { playID: "hamlet", audience: 55 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Statement for BigCo");
      expect(result).toContain("Hamlet: $650.00 (55 seats)");
      expect(result).toContain("Amount owed is $650.00");
      expect(result).toContain("You earned 25 credits");
    });

    test('deve gerar extrato para uma única performance de comédia', () => {
      const invoice = {
        customer: "SmallCo",
        performances: [
          { playID: "as-like", audience: 35 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Statement for SmallCo");
      expect(result).toContain("As You Like It: $580.00 (35 seats)");
      expect(result).toContain("Amount owed is $580.00");
      expect(result).toContain("You earned 12 credits");
    });

    test('deve gerar extrato para múltiplas performances', () => {
      const invoice = {
        customer: "BigCo",
        performances: [
          { playID: "hamlet", audience: 55 },
          { playID: "as-like", audience: 35 },
          { playID: "othello", audience: 40 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Statement for BigCo");
      expect(result).toContain("Hamlet: $650.00 (55 seats)");
      expect(result).toContain("As You Like It: $580.00 (35 seats)");
      expect(result).toContain("Othello: $500.00 (40 seats)");
      expect(result).toContain("Amount owed is $1,730.00");
      expect(result).toContain("You earned 47 credits");
    });
  });

  describe('Cálculo de valores para tragédias', () => {
    test('deve calcular valor base para tragédia com audiência <= 30', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 30 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Hamlet: $400.00 (30 seats)");
      expect(result).toContain("Amount owed is $400.00");
      expect(result).toContain("You earned 0 credits");
    });

    test('deve calcular valor com taxa extra para tragédia com audiência > 30', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 50 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Hamlet: $600.00 (50 seats)");
      expect(result).toContain("Amount owed is $600.00");
      expect(result).toContain("You earned 20 credits");
    });
  });

  describe('Cálculo de valores para comédias', () => {
    test('deve calcular valor para comédia com audiência <= 20', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "as-like", audience: 20 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("As You Like It: $360.00 (20 seats)");
      expect(result).toContain("Amount owed is $360.00");
      expect(result).toContain("You earned 4 credits");
    });

    test('deve calcular valor com taxa extra para comédia com audiência > 20', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "as-like", audience: 30 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("As You Like It: $540.00 (30 seats)");
      expect(result).toContain("Amount owed is $540.00");
      expect(result).toContain("You earned 6 credits");
    });
  });

  describe('Cálculo de créditos por volume', () => {
    test('deve calcular créditos base (audiência - 30) para qualquer tipo', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 40 },
          { playID: "othello", audience: 35 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      // 40 - 30 = 10 créditos + 35 - 30 = 5 créditos = 15 total
      expect(result).toContain("You earned 15 credits");
    });

    test('deve calcular créditos extras para comédias (audiência / 5)', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "as-like", audience: 50 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      // Créditos base: 50 - 30 = 20
      // Créditos extras comédia: Math.floor(50 / 5) = 10
      // Total: 20 + 10 = 30
      expect(result).toContain("You earned 30 credits");
    });

    test('não deve dar créditos negativos para audiência < 30', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 20 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("You earned 0 credits");
    });
  });

  describe('Formatação de saída', () => {
    test('deve formatar valores monetários corretamente', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 31 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      // Valor: 40000 + 1000 = 41000 centavos = $410.00
      expect(result).toContain("$410.00");
    });

    test('deve incluir nome do cliente no cabeçalho', () => {
      const invoice = {
        customer: "Acme Corp",
        performances: [
          { playID: "hamlet", audience: 30 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toMatch(/^Statement for Acme Corp/);
    });

    test('deve incluir número de assentos para cada performance', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 42 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("(42 seats)");
    });
  });

  describe('Casos extremos', () => {
    test('deve lidar com fatura sem performances', () => {
      const invoice = {
        customer: "EmptyCo",
        performances: []
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Statement for EmptyCo");
      expect(result).toContain("Amount owed is $0.00");
      expect(result).toContain("You earned 0 credits");
    });

    test('deve lidar com audiência zero', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 0 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      expect(result).toContain("Hamlet: $400.00 (0 seats)");
      expect(result).toContain("You earned 0 credits");
    });

    test('deve lidar com audiência muito grande', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "hamlet", audience: 1000 }
        ]
      };

      const result = statement(invoice, basicPlays);
      
      // 40000 + 970 * 1000 = 1010000 centavos = $10,100.00
      expect(result).toContain("$10,100.00");
      expect(result).toContain("You earned 970 credits");
    });
  });

  describe('Validação de erros', () => {
    test('deve lançar erro para tipo de peça desconhecido', () => {
      const playsWithUnknownType = {
        "unknown": { "name": "Unknown Play", "type": "musical" }
      };
      
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "unknown", audience: 30 }
        ]
      };

      expect(() => {
        statement(invoice, playsWithUnknownType);
      }).toThrow("unknown type: musical");
    });

    test('deve lidar com playID inexistente', () => {
      const invoice = {
        customer: "TestCo",
        performances: [
          { playID: "nonexistent", audience: 30 }
        ]
      };

      expect(() => {
        statement(invoice, basicPlays);
      }).toThrow();
    });
  });
});

// Testes específicos para a função amountFor (função auxiliar)
describe('AmountFor Function', () => {
  // Como amountFor não é exportada, vamos testá-la indiretamente através de statement
  // Mas vamos criar alguns testes focados nos cálculos específicos
  
  test('deve calcular valor correto para tragédia com diferentes audiências', () => {
    const plays = { "test": { "name": "Test Tragedy", "type": "tragedy" } };
    
    // Teste com audiência 30 (valor base)
    let invoice = {
      customer: "Test",
      performances: [{ playID: "test", audience: 30 }]
    };
    let result = statement(invoice, plays);
    expect(result).toContain("$400.00");
    
    // Teste com audiência 31 (valor base + 1000)
    invoice.performances[0].audience = 31;
    result = statement(invoice, plays);
    expect(result).toContain("$410.00");
    
    // Teste com audiência 50 (valor base + 20000)
    invoice.performances[0].audience = 50;
    result = statement(invoice, plays);
    expect(result).toContain("$600.00");
  });

  test('deve calcular valor correto para comédia com diferentes audiências', () => {
    const plays = { "test": { "name": "Test Comedy", "type": "comedy" } };
    
    // Teste com audiência 20 (valor base + 300*20)
    let invoice = {
      customer: "Test",
      performances: [{ playID: "test", audience: 20 }]
    };
    let result = statement(invoice, plays);
    expect(result).toContain("$360.00"); // 30000 + 6000 = 36000 centavos
    
    // Teste com audiência 21 (valor base + 10000 + 500*1 + 300*21)
    invoice.performances[0].audience = 21;
    result = statement(invoice, plays);
    expect(result).toContain("$468.00"); // 30000 + 10000 + 500 + 6300 = 46800 centavos
    
    // Teste com audiência 30 (valor base + 10000 + 500*10 + 300*30)
    invoice.performances[0].audience = 30;
    result = statement(invoice, plays);
    expect(result).toContain("$540.00"); // 30000 + 10000 + 5000 + 9000 = 54000 centavos
  });
});
