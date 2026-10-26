const { TennisGame } = require("../src/tennisGame");

describe("TennisGame", () => {
  test("score is 0 - 0 at the start of the game", () => {
    // Arrange
    const game = new TennisGame();

    // Act
    const result = game.score();

    // Assert
    expect(result).toBe("0 - 0");
  });
});
