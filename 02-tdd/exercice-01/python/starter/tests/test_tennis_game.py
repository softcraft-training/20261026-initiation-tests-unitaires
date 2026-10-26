from tennis_game import TennisGame


def test_score_is_0_0_at_the_start_of_the_game():
    # Arrange
    game = TennisGame()

    # Act
    result = game.score()

    # Assert
    assert result == "0 - 0"
