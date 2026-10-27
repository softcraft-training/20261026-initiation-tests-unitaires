package tp;

public class UnusualSpendingService {

    private final PaymentRepository paymentRepository;
    private final EmailSender emailSender;

    public UnusualSpendingService(PaymentRepository paymentRepository, EmailSender emailSender) {
        this.paymentRepository = paymentRepository;
        this.emailSender = emailSender;
    }

    public void notify(String userId) {
        throw new UnsupportedOperationException("À implémenter");
    }
}
