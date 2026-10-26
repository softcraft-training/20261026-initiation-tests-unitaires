const POINT_LABELS = ["0", "15", "30", "40"];

export class TennisGame {
  private serverPoints = 0;
  private receiverPoints = 0;

  serverScores(): void {
    this.ensureGameIsNotOver();
    this.serverPoints++;
  }

  receiverScores(): void {
    this.ensureGameIsNotOver();
    this.receiverPoints++;
  }

  score(): string {
    const difference = this.serverPoints - this.receiverPoints;

    if (this.isDeuce()) {
      return "Égalité";
    }
    if (this.serverPoints < 4 && this.receiverPoints < 4) {
      return `${POINT_LABELS[this.serverPoints]} - ${POINT_LABELS[this.receiverPoints]}`;
    }
    if (difference === 1) {
      return "Avantage serveur";
    }
    if (difference === -1) {
      return "Avantage receveur";
    }
    return difference > 0 ? "Jeu serveur" : "Jeu receveur";
  }

  private isDeuce(): boolean {
    return this.serverPoints >= 3 && this.serverPoints === this.receiverPoints;
  }

  private ensureGameIsNotOver(): void {
    if (this.score().startsWith("Jeu")) {
      throw new Error("Le jeu est terminé");
    }
  }
}
