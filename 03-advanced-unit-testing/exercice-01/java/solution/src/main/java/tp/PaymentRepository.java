package tp;

import java.time.YearMonth;
import java.util.List;

public interface PaymentRepository {

    /**
     * Retourne les paiements effectués par l'utilisateur pendant le mois donné.
     */
    List<Payment> fetchPayments(String userId, YearMonth month);
}
