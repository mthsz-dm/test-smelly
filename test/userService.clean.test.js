const { UserService } = require("../src/userService");

describe("UserService - Suíte de Testes com Smells", () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  test("deve criar e buscar um usuário corretamente", () => {
    // Arrange
    const nome = "Matheus";
    const email = "email";
    const idade = 21;
    // Act: Criar
    const usuarioCriado = userService.createUser(nome, email, idade);
    expect(usuarioCriado.id).toBeDefined();
    // Act: Buscar
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);
    // Assert
    expect(usuarioBuscado.nome).toBe(nome);
    expect(usuarioBuscado.status).toBe("ativo");
  });

  test("deve desativar usuários se forem usuarios comuns", () => {
    // Arrange
    const usuarioComum = userService.createUser("Comum", "comum@teste.com", 30);
    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    // Assert
    expect(resultado).toBe(true);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    expect(usuarioAtualizado.status).toBe("inativo");
  });

  test("deve manter usuarios admistradores", () => {
    // Arrange
    const usuarioAdmin = userService.createUser(
      "Admin",
      "admin@test.com",
      40,
      true
    );
    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    // Assert
    expect(resultado).toBe(false);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);
    expect(usuarioAtualizado.status).toBe("ativo");
  });

  test("deve gerar um relatório de usuários", () => {
    // Arrange
    const usuario1 = userService.createUser("Alice", "alice@email.com", 28);
    const usuario2 = userService.createUser("Bob", "bob@email.com", 32);
    // Act
    const relatorio = userService.generateUserReport();
    // Assert
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain(usuario1.nome);
    expect(relatorio).toContain(usuario1.status);

    expect(relatorio).toContain(usuario2.id);
    expect(relatorio).toContain(usuario2.nome);
    expect(relatorio).toContain(usuario2.status);
  });

  test("deve lançar erro ao tentar criar usuário menor de idade", () => {
    // Arrange
    const nome = "joao";
    const email = "joao@gmail.com";
    const idade = 16;
    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow("O usuário deve ser maior de idade");
  });

  //Tirei o .skip porque o teste está válido agora
  test("deve retornar uma lista vazia quando não há usuários", () => {
    // Arrange
    userService._clearDB();
    // Act
    const relatorio = userService.generateUserReport();
    // Assert
    expect(relatorio).toContain("Nenhum usuário cadastrado.");
    expect(relatorio.startsWith("--- Relatório de Usuários ---")).toBe(true);
  });
});
