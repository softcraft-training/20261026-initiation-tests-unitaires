package tp;

public interface EmailSender {

    /**
     * Envoie un email à l'utilisateur.
     */
    void sendEmail(String userId, Email email);
}
