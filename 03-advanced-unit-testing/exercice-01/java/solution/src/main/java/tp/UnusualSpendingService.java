package tp;

import java.time.YearMonth;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UnusualSpendingService {

    private final PaymentRepository paymentRepository;
    private final EmailSender emailSender;
    private final Clock clock;

    public UnusualSpendingService(PaymentRepository paymentRepository, EmailSender emailSender, Clock clock) {
        this.paymentRepository = paymentRepository;
        this.emailSender = emailSender;
        this.clock = clock;
    }

    public void notify(String userId) {
        YearMonth currentMonth = clock.currentMonth();
        Map<Category, Integer> currentTotals = totalsByCategory(paymentRepository.fetchPayments(userId, currentMonth));
        Map<Category, Integer> previousTotals = totalsByCategory(paymentRepository.fetchPayments(userId, currentMonth.minusMonths(1)));

        Map<Category, Integer> unusualSpending = new EnumMap<>(Category.class);
        currentTotals.forEach((category, current) -> {
            int previous = previousTotals.getOrDefault(category, 0);
            if (isUnusual(current, previous)) {
                unusualSpending.put(category, current);
            }
        });

        if (!unusualSpending.isEmpty()) {
            emailSender.sendEmail(userId, composeEmail(unusualSpending));
        }
    }

    private static Map<Category, Integer> totalsByCategory(List<Payment> payments) {
        return payments.stream().collect(Collectors.groupingBy(
                Payment::category,
                () -> new EnumMap<>(Category.class),
                Collectors.summingInt(Payment::price)));
    }

    private static boolean isUnusual(int current, int previous) {
        // current >= previous * 1.5, en nombres entiers
        return previous > 0 && current * 2 >= previous * 3;
    }

    private static Email composeEmail(Map<Category, Integer> unusualSpending) {
        int total = unusualSpending.values().stream().mapToInt(Integer::intValue).sum();
        String lines = unusualSpending.entrySet().stream()
                .map(entry -> "* Vous avez dépensé " + entry.getValue() + " $ en " + entry.getKey().label())
                .collect(Collectors.joining("\n"));

        String subject = "Dépenses inhabituelles de " + total + " $ détectées !";
        String body = "Bonjour cher client !\n"
                + "\n"
                + "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :\n"
                + "\n"
                + lines + "\n"
                + "\n"
                + "Cordialement,\n"
                + "\n"
                + "La Compagnie de Carte de Crédit";
        return new Email(subject, body);
    }
}
