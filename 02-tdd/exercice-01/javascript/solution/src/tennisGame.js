const POINT_LABELS = ["0", "15", "30", "40"];

class TennisGame {
  #serverPoints = 0;
  #receiverPoints = 0;

  serverScores() {
    this.#ensureGameIsNotOver();
    this.#serverPoints++;
  }

  receiverScores() {
    this.#ensureGameIsNotOver();
    this.#receiverPoints++;
  }

  score() {
    const difference = this.#serverPoints - this.#receiverPoints;

    if (this.#isDeuce()) {
      return "Égalité";
    }
    if (this.#serverPoints < 4 && this.#receiverPoints < 4) {
      return `${POINT_LABELS[this.#serverPoints]} - ${POINT_LABELS[this.#receiverPoints]}`;
    }
    if (difference === 1) {
      return "Avantage serveur";
    }
    if (difference === -1) {
      return "Avantage receveur";
    }
    return difference > 0 ? "Jeu serveur" : "Jeu receveur";
  }

  #isDeuce() {
    return this.#serverPoints >= 3 && this.#serverPoints === this.#receiverPoints;
  }

  #ensureGameIsNotOver() {
    if (this.score().startsWith("Jeu")) {
      throw new Error("Le jeu est terminé");
    }
  }
}

module.exports = { TennisGame };
