POINT_LABELS = ["0", "15", "30", "40"]


class TennisGame:
    def __init__(self):
        self._server_points = 0
        self._receiver_points = 0

    def server_scores(self):
        self._ensure_game_is_not_over()
        self._server_points += 1

    def receiver_scores(self):
        self._ensure_game_is_not_over()
        self._receiver_points += 1

    def score(self):
        difference = self._server_points - self._receiver_points

        if self._is_deuce():
            return "Égalité"
        if self._server_points < 4 and self._receiver_points < 4:
            return f"{POINT_LABELS[self._server_points]} - {POINT_LABELS[self._receiver_points]}"
        if difference == 1:
            return "Avantage serveur"
        if difference == -1:
            return "Avantage receveur"
        if difference > 0:
            return "Jeu serveur"
        return "Jeu receveur"

    def _is_deuce(self):
        return self._server_points >= 3 and self._server_points == self._receiver_points

    def _ensure_game_is_not_over(self):
        if self.score().startswith("Jeu"):
            raise RuntimeError("Le jeu est terminé")
