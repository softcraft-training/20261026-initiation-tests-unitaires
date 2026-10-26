package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class TennisGameTest {

    @Test
    void score_is0_0_atTheStartOfTheGame() {
        // Arrange
        TennisGame game = new TennisGame();

        // Act
        String result = game.score();

        // Assert
        assertEquals("0 - 0", result);
    }
}
