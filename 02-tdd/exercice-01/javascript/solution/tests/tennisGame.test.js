const { TennisGame } = require("../src/tennisGame");

function play(serverPoints, receiverPoints) {
  const game = new TennisGame();
  for (let i = 0; i < serverPoints; i++) {
    game.serverScores();
  }
  for (let i = 0; i < receiverPoints; i++) {
    game.receiverScores();
  }
  return game;
}

describe("TennisGame", () => {
  test("score is 0 - 0 at the start of the game", () => {
    // Arrange
    const game = new TennisGame();

    // Act
    const result = game.score();

    // Assert
    expect(result).toBe("0 - 0");
  });

  describe("simple scores", () => {
    test("score is 15 - 0 when server scores 1 point", () => {
      expect(play(1, 0).score()).toBe("15 - 0");
    });

    test("score is 30 - 0 when server scores 2 points", () => {
      expect(play(2, 0).score()).toBe("30 - 0");
    });

    test("score is 40 - 0 when server scores 3 points", () => {
      expect(play(3, 0).score()).toBe("40 - 0");
    });

    test("score is 0 - 15 when receiver scores 1 point", () => {
      expect(play(0, 1).score()).toBe("0 - 15");
    });

    test("score is 15 - 30 when server scores 1 point and receiver 2 points", () => {
      expect(play(1, 2).score()).toBe("15 - 30");
    });
  });

  describe("winning a game", () => {
    test("server wins the game after 4 points", () => {
      expect(play(4, 0).score()).toBe("Jeu serveur");
    });

    test("receiver wins the game after 4 points", () => {
      expect(play(0, 4).score()).toBe("Jeu receveur");
    });
  });

  describe("deuce and advantage", () => {
    test("score is deuce when both players score 3 points", () => {
      expect(play(3, 3).score()).toBe("Égalité");
    });

    test("server has advantage when scoring after deuce", () => {
      // Arrange
      const game = play(3, 3);

      // Act
      game.serverScores();

      // Assert
      expect(game.score()).toBe("Avantage serveur");
    });

    test("receiver has advantage when scoring after deuce", () => {
      // Arrange
      const game = play(3, 3);

      // Act
      game.receiverScores();

      // Assert
      expect(game.score()).toBe("Avantage receveur");
    });

    test("score is back to deuce when receiver scores after server advantage", () => {
      // Arrange
      const game = play(3, 3);
      game.serverScores();

      // Act
      game.receiverScores();

      // Assert
      expect(game.score()).toBe("Égalité");
    });

    test("server wins the game when scoring with advantage", () => {
      // Arrange
      const game = play(3, 3);
      game.serverScores();

      // Act
      game.serverScores();

      // Assert
      expect(game.score()).toBe("Jeu serveur");
    });

    test("receiver wins the game when scoring with advantage", () => {
      // Arrange
      const game = play(3, 3);
      game.receiverScores();

      // Act
      game.receiverScores();

      // Assert
      expect(game.score()).toBe("Jeu receveur");
    });
  });

  describe("bonus", () => {
    test("scoring after the game is over throws an error", () => {
      // Arrange
      const game = play(4, 0);

      // Act & Assert
      expect(() => game.serverScores()).toThrow();
    });

    test.each([
      [0, 0, "0 - 0"],
      [1, 0, "15 - 0"],
      [2, 0, "30 - 0"],
      [3, 0, "40 - 0"],
      [0, 1, "0 - 15"],
      [1, 2, "15 - 30"],
      [2, 3, "30 - 40"],
    ])("score is correct when server scores %i and receiver scores %i", (serverPoints, receiverPoints, expected) => {
      expect(play(serverPoints, receiverPoints).score()).toBe(expected);
    });
  });
});
