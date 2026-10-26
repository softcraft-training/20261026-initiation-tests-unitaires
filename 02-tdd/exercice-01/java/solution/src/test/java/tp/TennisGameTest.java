package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class TennisGameTest {

    private static TennisGame play(int serverPoints, int receiverPoints) {
        TennisGame game = new TennisGame();
        for (int i = 0; i < serverPoints; i++) {
            game.serverScores();
        }
        for (int i = 0; i < receiverPoints; i++) {
            game.receiverScores();
        }
        return game;
    }

    @Test
    void score_is0_0_atTheStartOfTheGame() {
        // Arrange
        TennisGame game = new TennisGame();

        // Act
        String result = game.score();

        // Assert
        assertEquals("0 - 0", result);
    }

    @Nested
    class SimpleScores {

        @Test
        void score_is15_0_whenServerScores1Point() {
            assertEquals("15 - 0", play(1, 0).score());
        }

        @Test
        void score_is30_0_whenServerScores2Points() {
            assertEquals("30 - 0", play(2, 0).score());
        }

        @Test
        void score_is40_0_whenServerScores3Points() {
            assertEquals("40 - 0", play(3, 0).score());
        }

        @Test
        void score_is0_15_whenReceiverScores1Point() {
            assertEquals("0 - 15", play(0, 1).score());
        }

        @Test
        void score_is15_30_whenServerScores1PointAndReceiver2Points() {
            assertEquals("15 - 30", play(1, 2).score());
        }
    }

    @Nested
    class WinningAGame {

        @Test
        void serverWinsTheGame_after4Points() {
            assertEquals("Jeu serveur", play(4, 0).score());
        }

        @Test
        void receiverWinsTheGame_after4Points() {
            assertEquals("Jeu receveur", play(0, 4).score());
        }
    }

    @Nested
    class DeuceAndAdvantage {

        @Test
        void score_isDeuce_whenBothPlayersScore3Points() {
            assertEquals("Égalité", play(3, 3).score());
        }

        @Test
        void serverHasAdvantage_whenScoringAfterDeuce() {
            // Arrange
            TennisGame game = play(3, 3);

            // Act
            game.serverScores();

            // Assert
            assertEquals("Avantage serveur", game.score());
        }

        @Test
        void receiverHasAdvantage_whenScoringAfterDeuce() {
            // Arrange
            TennisGame game = play(3, 3);

            // Act
            game.receiverScores();

            // Assert
            assertEquals("Avantage receveur", game.score());
        }

        @Test
        void score_isBackToDeuce_whenReceiverScoresAfterServerAdvantage() {
            // Arrange
            TennisGame game = play(3, 3);
            game.serverScores();

            // Act
            game.receiverScores();

            // Assert
            assertEquals("Égalité", game.score());
        }

        @Test
        void serverWinsTheGame_whenScoringWithAdvantage() {
            // Arrange
            TennisGame game = play(3, 3);
            game.serverScores();

            // Act
            game.serverScores();

            // Assert
            assertEquals("Jeu serveur", game.score());
        }

        @Test
        void receiverWinsTheGame_whenScoringWithAdvantage() {
            // Arrange
            TennisGame game = play(3, 3);
            game.receiverScores();

            // Act
            game.receiverScores();

            // Assert
            assertEquals("Jeu receveur", game.score());
        }
    }

    @Nested
    class Bonus {

        @Test
        void scoringAfterTheGameIsOver_throwsAnError() {
            // Arrange
            TennisGame game = play(4, 0);

            // Act & Assert
            assertThrows(IllegalStateException.class, game::serverScores);
        }

        @ParameterizedTest
        @CsvSource({
            "0, 0, 0 - 0",
            "1, 0, 15 - 0",
            "2, 0, 30 - 0",
            "3, 0, 40 - 0",
            "0, 1, 0 - 15",
            "1, 2, 15 - 30",
            "2, 3, 30 - 40",
        })
        void score_isCorrect_forSimpleScores(int serverPoints, int receiverPoints, String expected) {
            assertEquals(expected, play(serverPoints, receiverPoints).score());
        }
    }
}
