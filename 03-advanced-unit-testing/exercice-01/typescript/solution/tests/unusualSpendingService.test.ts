import { Clock, EmailSender, PaymentRepository } from "../src/contracts";
import { Category, Email, Payment, YearMonth } from "../src/models";
import { UnusualSpendingService } from "../src/unusualSpendingService";

const USER_ID = "user-42";
const CURRENT_MONTH = new YearMonth(2026, 10);
const PREVIOUS_MONTH = new YearMonth(2026, 9);

function payment(category: Category, price: number): Payment {
  return { price, description: "Paiement", category };
}

describe("UnusualSpendingService", () => {
  let paymentRepository: jest.Mocked<PaymentRepository>;
  let emailSender: jest.Mocked<EmailSender>;
  let clock: jest.Mocked<Clock>;
  let service: UnusualSpendingService;

  beforeEach(() => {
    paymentRepository = { fetchPayments: jest.fn().mockReturnValue([]) };
    emailSender = { sendEmail: jest.fn() };
    clock = { currentMonth: jest.fn().mockReturnValue(CURRENT_MONTH) };

    service = new UnusualSpendingService(paymentRepository, emailSender, clock);
  });

  function givenPayments(previousMonth: Payment[], currentMonth: Payment[]): void {
    paymentRepository.fetchPayments.mockImplementation((userId, month) => {
      if (month.equals(CURRENT_MONTH)) return currentMonth;
      if (month.equals(PREVIOUS_MONTH)) return previousMonth;
      return [];
    });
  }

  function sentEmail(): Email {
    expect(emailSender.sendEmail).toHaveBeenCalledTimes(1);
    const [userId, email] = emailSender.sendEmail.mock.calls[0];
    expect(userId).toBe(USER_ID);
    return email;
  }

  describe("Étape 2 — Premier test : pas d'email", () => {
    test("sends no email when user has no payments", () => {
      service.notify(USER_ID);

      expect(emailSender.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe("Étape 3 — Une catégorie inhabituelle", () => {
    test("sends an email to the user when spending increases by at least 50%", () => {
      // Arrange
      givenPayments([payment(Category.Groceries, 100)], [payment(Category.Groceries, 200)]);

      // Act
      service.notify(USER_ID);

      // Assert
      expect(emailSender.sendEmail).toHaveBeenCalledWith(USER_ID, expect.anything());
    });

    test("email subject contains the unusual amount", () => {
      givenPayments([payment(Category.Groceries, 90)], [payment(Category.Groceries, 148)]);

      service.notify(USER_ID);

      expect(sentEmail().subject).toBe("Dépenses inhabituelles de 148 $ détectées !");
    });

    test("email body lists the unusual category", () => {
      givenPayments([payment(Category.Groceries, 90)], [payment(Category.Groceries, 148)]);

      service.notify(USER_ID);

      expect(sentEmail().body).toBe(
        "Bonjour cher client !\n" +
          "\n" +
          "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :\n" +
          "\n" +
          "* Vous avez dépensé 148 $ en courses\n" +
          "\n" +
          "Cordialement,\n" +
          "\n" +
          "La Compagnie de Carte de Crédit",
      );
    });
  });

  describe("Étape 4 — Les règles de comparaison", () => {
    test("sends no email when spending increases by less than 50%", () => {
      givenPayments([payment(Category.Groceries, 100)], [payment(Category.Groceries, 149)]);

      service.notify(USER_ID);

      expect(emailSender.sendEmail).not.toHaveBeenCalled();
    });

    test("sends an email when spending increases by exactly 50%", () => {
      givenPayments([payment(Category.Groceries, 100)], [payment(Category.Groceries, 150)]);

      service.notify(USER_ID);

      expect(emailSender.sendEmail).toHaveBeenCalledWith(USER_ID, expect.anything());
    });

    test("sends no email when category had no spending last month", () => {
      givenPayments(
        [payment(Category.Groceries, 100)],
        [payment(Category.Groceries, 100), payment(Category.Golf, 500)],
      );

      service.notify(USER_ID);

      expect(emailSender.sendEmail).not.toHaveBeenCalled();
    });

    test("payments of the same category are summed", () => {
      givenPayments(
        [payment(Category.Groceries, 60), payment(Category.Groceries, 40)],
        [payment(Category.Groceries, 80), payment(Category.Groceries, 70)],
      );

      service.notify(USER_ID);

      expect(sentEmail().subject).toBe("Dépenses inhabituelles de 150 $ détectées !");
    });
  });

  describe("Étape 5 — Plusieurs catégories", () => {
    test("only unusual categories are listed", () => {
      givenPayments(
        [payment(Category.Groceries, 90), payment(Category.Travel, 100)],
        [payment(Category.Groceries, 148), payment(Category.Travel, 120)],
      );

      service.notify(USER_ID);

      const email = sentEmail();
      expect(email.subject).toBe("Dépenses inhabituelles de 148 $ détectées !");
      expect(email.body).not.toContain("voyages");
    });

    test("several unusual categories are listed in enum order with their total in subject", () => {
      givenPayments(
        [payment(Category.Travel, 300), payment(Category.Groceries, 90)],
        [payment(Category.Travel, 928), payment(Category.Groceries, 148)],
      );

      service.notify(USER_ID);

      expect(emailSender.sendEmail).toHaveBeenCalledWith(USER_ID, {
        subject: "Dépenses inhabituelles de 1076 $ détectées !",
        body:
          "Bonjour cher client !\n" +
          "\n" +
          "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :\n" +
          "\n" +
          "* Vous avez dépensé 148 $ en courses\n" +
          "* Vous avez dépensé 928 $ en voyages\n" +
          "\n" +
          "Cordialement,\n" +
          "\n" +
          "La Compagnie de Carte de Crédit",
      });
    });
  });

  describe("Étape 6 — Les mois", () => {
    test("fetches payments of current and previous month", () => {
      service.notify(USER_ID);

      expect(paymentRepository.fetchPayments).toHaveBeenCalledWith(USER_ID, CURRENT_MONTH);
      expect(paymentRepository.fetchPayments).toHaveBeenCalledWith(USER_ID, PREVIOUS_MONTH);
    });

    test("previous month of January is December of previous year", () => {
      clock.currentMonth.mockReturnValue(new YearMonth(2027, 1));

      service.notify(USER_ID);

      expect(paymentRepository.fetchPayments).toHaveBeenCalledWith(USER_ID, new YearMonth(2027, 1));
      expect(paymentRepository.fetchPayments).toHaveBeenCalledWith(USER_ID, new YearMonth(2026, 12));
    });
  });
});
