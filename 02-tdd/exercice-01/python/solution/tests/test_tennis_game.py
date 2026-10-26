import pytest

from tennis_game import TennisGame


def play(server_points, receiver_points):
    game = TennisGame()
    for _ in range(server_points):
        game.server_scores()
    for _ in range(receiver_points):
        game.receiver_scores()
    return game


def test_score_is_0_0_at_the_start_of_the_game():
    # Arrange
    game = TennisGame()

    # Act
    result = game.score()

    # Assert
    assert result == "0 - 0"


# Étape 2 — Les scores simples

def test_score_is_15_0_when_server_scores_1_point():
    assert play(1, 0).score() == "15 - 0"


def test_score_is_30_0_when_server_scores_2_points():
    assert play(2, 0).score() == "30 - 0"


def test_score_is_40_0_when_server_scores_3_points():
    assert play(3, 0).score() == "40 - 0"


def test_score_is_0_15_when_receiver_scores_1_point():
    assert play(0, 1).score() == "0 - 15"


def test_score_is_15_30_when_server_scores_1_point_and_receiver_2_points():
    assert play(1, 2).score() == "15 - 30"


# Étape 3 — Gagner un jeu

def test_server_wins_the_game_after_4_points():
    assert play(4, 0).score() == "Jeu serveur"


def test_receiver_wins_the_game_after_4_points():
    assert play(0, 4).score() == "Jeu receveur"


# Étape 4 — Égalité et avantage

def test_score_is_deuce_when_both_players_score_3_points():
    assert play(3, 3).score() == "Égalité"


def test_server_has_advantage_when_scoring_after_deuce():
    # Arrange
    game = play(3, 3)

    # Act
    game.server_scores()

    # Assert
    assert game.score() == "Avantage serveur"


def test_receiver_has_advantage_when_scoring_after_deuce():
    # Arrange
    game = play(3, 3)

    # Act
    game.receiver_scores()

    # Assert
    assert game.score() == "Avantage receveur"


def test_score_is_back_to_deuce_when_receiver_scores_after_server_advantage():
    # Arrange
    game = play(3, 3)
    game.server_scores()

    # Act
    game.receiver_scores()

    # Assert
    assert game.score() == "Égalité"


def test_server_wins_the_game_when_scoring_with_advantage():
    # Arrange
    game = play(3, 3)
    game.server_scores()

    # Act
    game.server_scores()

    # Assert
    assert game.score() == "Jeu serveur"


def test_receiver_wins_the_game_when_scoring_with_advantage():
    # Arrange
    game = play(3, 3)
    game.receiver_scores()

    # Act
    game.receiver_scores()

    # Assert
    assert game.score() == "Jeu receveur"


# Bonus

def test_scoring_after_the_game_is_over_raises_an_error():
    # Arrange
    game = play(4, 0)

    # Act & Assert
    with pytest.raises(RuntimeError):
        game.server_scores()


@pytest.mark.parametrize(
    "server_points, receiver_points, expected",
    [
        (0, 0, "0 - 0"),
        (1, 0, "15 - 0"),
        (2, 0, "30 - 0"),
        (3, 0, "40 - 0"),
        (0, 1, "0 - 15"),
        (1, 2, "15 - 30"),
        (2, 3, "30 - 40"),
    ],
)
def test_simple_scores(server_points, receiver_points, expected):
    assert play(server_points, receiver_points).score() == expected
