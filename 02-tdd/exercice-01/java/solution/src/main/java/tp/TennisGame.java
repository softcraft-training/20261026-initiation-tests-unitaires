package tp;

public class TennisGame {

    private static final String[] POINT_LABELS = {"0", "15", "30", "40"};

    private int serverPoints = 0;
    private int receiverPoints = 0;

    public void serverScores() {
        ensureGameIsNotOver();
        serverPoints++;
    }

    public void receiverScores() {
        ensureGameIsNotOver();
        receiverPoints++;
    }

    public String score() {
        int difference = serverPoints - receiverPoints;

        if (isDeuce()) {
            return "Égalité";
        }
        if (serverPoints < 4 && receiverPoints < 4) {
            return POINT_LABELS[serverPoints] + " - " + POINT_LABELS[receiverPoints];
        }
        if (difference == 1) {
            return "Avantage serveur";
        }
        if (difference == -1) {
            return "Avantage receveur";
        }
        return difference > 0 ? "Jeu serveur" : "Jeu receveur";
    }

    private boolean isDeuce() {
        return serverPoints >= 3 && serverPoints == receiverPoints;
    }

    private void ensureGameIsNotOver() {
        if (score().startsWith("Jeu")) {
            throw new IllegalStateException("Le jeu est terminé");
        }
    }
}
