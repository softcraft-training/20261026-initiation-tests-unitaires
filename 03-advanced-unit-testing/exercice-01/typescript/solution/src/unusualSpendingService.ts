import { Clock, EmailSender, PaymentRepository } from "./contracts";
import { Category, Email, Payment } from "./models";

export class UnusualSpendingService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly emailSender: EmailSender,
    private readonly clock: Clock,
  ) {}

  notify(userId: string): void {
    const currentMonth = this.clock.currentMonth();
    const currentTotals = totalsByCategory(this.paymentRepository.fetchPayments(userId, currentMonth));
    const previousTotals = totalsByCategory(this.paymentRepository.fetchPayments(userId, currentMonth.previous()));

    const unusualSpending = new Map<Category, number>();
    for (const category of Object.values(Category)) {
      const current = currentTotals.get(category) ?? 0;
      const previous = previousTotals.get(category) ?? 0;
      if (isUnusual(current, previous)) {
        unusualSpending.set(category, current);
      }
    }

    if (unusualSpending.size > 0) {
      this.emailSender.sendEmail(userId, composeEmail(unusualSpending));
    }
  }
}

function totalsByCategory(payments: Payment[]): Map<Category, number> {
  const totals = new Map<Category, number>();
  for (const payment of payments) {
    totals.set(payment.category, (totals.get(payment.category) ?? 0) + payment.price);
  }
  return totals;
}

function isUnusual(current: number, previous: number): boolean {
  // current >= previous * 1.5, en nombres entiers
  return previous > 0 && current * 2 >= previous * 3;
}

function composeEmail(unusualSpending: Map<Category, number>): Email {
  const amounts = [...unusualSpending.values()];
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  const lines = [...unusualSpending]
    .map(([category, amount]) => `* Vous avez dépensé ${amount} $ en ${category}`)
    .join("\n");

  return {
    subject: `Dépenses inhabituelles de ${total} $ détectées !`,
    body: [
      "Bonjour cher client !",
      "",
      "Nous avons détecté des dépenses inhabituellement élevées sur votre carte dans ces catégories :",
      "",
      lines,
      "",
      "Cordialement,",
      "",
      "La Compagnie de Carte de Crédit",
    ].join("\n"),
  };
}
