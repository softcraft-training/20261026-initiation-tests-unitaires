package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.YearMonth;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class UnusualSpendingServiceTest {

    private static final String USER_ID = "user-42";
    private static final YearMonth CURRENT_MONTH = YearMonth.of(2026, 10);
    private static final YearMonth PREVIOUS_MONTH = YearMonth.of(2026, 9);

    private PaymentRepository paymentRepository;
    private EmailSender emailSender;
    private Clock clock;
    private UnusualSpendingService service;

    @BeforeEach
    void setUp() {
        paymentRepository = mock(PaymentRepository.class);
        emailSender = mock(EmailSender.class);
        clock = mock(Clock.class);
        when(clock.currentMonth()).thenReturn(CURRENT_MONTH);

        service = new UnusualSpendingService(paymentRepository, emailSender, clock);
    }

    private static Payment payment(Category category, int price) {
        return new Payment(price, "Paiement", category);
    }

    private void givenPayments(YearMonth month, Payment... payments) {
        when(paymentRepository.fetchPayments(USER_ID, month)).thenReturn(List.of(payments));
    }

    private Email sentEmail() {
        ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);
        verify(emailSender).sendEmail(eq(USER_ID), captor.capture());
        return captor.getValue();
    }

    private void assertNoEmailSent() {
        verify(emailSender, never()).sendEmail(any(), any());
    }

    // Étape 2 — Premier test : pas d'email

    @Test
    void sendsNoEmail_whenUserHasNoPayments() {
        service.notify(USER_ID);

        assertNoEmailSent();
    }

    // Étape 3 — Une catégorie inhabituelle

    @Test
    void sendsEmailToTheUser_whenSpendingIncreasesByAtLeast50Percent() {
        // Arrange
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 100));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 200));

        // Act
        service.notify(USER_ID);

        // Assert
        verify(emailSender).sendEmail(eq(USER_ID), any(Email.class));
    }

    @Test
    void emailSubject_containsTheUnusualAmount() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 90));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 148));

        service.notify(USER_ID);

        assertEquals("Dépenses inhabituelles de 148 $ détectées !", sentEmail().subject());
    }

    @Test
    void emailBody_listsTheUnusualCategory() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 90));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 148));

        service.notify(USER_ID);

        assertEquals("""
                Bonjour cher client !

                Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :

                * Vous avez dépensé 148 $ en courses

                Cordialement,

                La Compagnie de Carte de Crédit""", sentEmail().body());
    }

    // Étape 4 — Les règles de comparaison

    @Test
    void sendsNoEmail_whenSpendingIncreasesByLessThan50Percent() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 100));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 149));

        service.notify(USER_ID);

        assertNoEmailSent();
    }

    @Test
    void sendsEmail_whenSpendingIncreasesByExactly50Percent() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 100));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 150));

        service.notify(USER_ID);

        verify(emailSender).sendEmail(eq(USER_ID), any(Email.class));
    }

    @Test
    void sendsNoEmail_whenCategoryHadNoSpendingLastMonth() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 100));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 100), payment(Category.GOLF, 500));

        service.notify(USER_ID);

        assertNoEmailSent();
    }

    @Test
    void paymentsOfTheSameCategory_areSummed() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 60), payment(Category.GROCERIES, 40));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 80), payment(Category.GROCERIES, 70));

        service.notify(USER_ID);

        assertEquals("Dépenses inhabituelles de 150 $ détectées !", sentEmail().subject());
    }

    // Étape 5 — Plusieurs catégories

    @Test
    void onlyUnusualCategories_areListed() {
        givenPayments(PREVIOUS_MONTH, payment(Category.GROCERIES, 90), payment(Category.TRAVEL, 100));
        givenPayments(CURRENT_MONTH, payment(Category.GROCERIES, 148), payment(Category.TRAVEL, 120));

        service.notify(USER_ID);

        Email email = sentEmail();
        assertEquals("Dépenses inhabituelles de 148 $ détectées !", email.subject());
        assertFalse(email.body().contains("voyages"));
    }

    @Test
    void severalUnusualCategories_areListedInEnumOrderWithTheirTotalInSubject() {
        givenPayments(PREVIOUS_MONTH, payment(Category.TRAVEL, 300), payment(Category.GROCERIES, 90));
        givenPayments(CURRENT_MONTH, payment(Category.TRAVEL, 928), payment(Category.GROCERIES, 148));

        service.notify(USER_ID);

        verify(emailSender).sendEmail(USER_ID, new Email(
                "Dépenses inhabituelles de 1076 $ détectées !",
                """
                Bonjour cher client !

                Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :

                * Vous avez dépensé 148 $ en courses
                * Vous avez dépensé 928 $ en voyages

                Cordialement,

                La Compagnie de Carte de Crédit"""));
    }

    // Étape 6 — Les mois

    @Test
    void fetchesPaymentsOfCurrentAndPreviousMonth() {
        service.notify(USER_ID);

        verify(paymentRepository).fetchPayments(USER_ID, CURRENT_MONTH);
        verify(paymentRepository).fetchPayments(USER_ID, PREVIOUS_MONTH);
    }

    @Test
    void previousMonthOfJanuary_isDecemberOfPreviousYear() {
        when(clock.currentMonth()).thenReturn(YearMonth.of(2027, 1));

        service.notify(USER_ID);

        verify(paymentRepository).fetchPayments(USER_ID, YearMonth.of(2027, 1));
        verify(paymentRepository).fetchPayments(USER_ID, YearMonth.of(2026, 12));
    }
}
