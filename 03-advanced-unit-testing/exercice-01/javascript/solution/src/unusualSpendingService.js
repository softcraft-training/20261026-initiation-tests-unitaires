const { Category } = require("./models");

/**
 * @typedef {import("./contracts").PaymentRepository} PaymentRepository
 * @typedef {import("./contracts").EmailSender} EmailSender
 * @typedef {import("./contracts").Clock} Clock
 * @typedef {import("./models").Payment} Payment
 * @typedef {import("./models").Email} Email
 */

class UnusualSpendingService {
  /**
   * @param {PaymentRepository} paymentRepository
   * @param {EmailSender} emailSender
   * @param {Clock} clock
   */
  constructor(paymentRepository, emailSender, clock) {
    this.paymentRepository = paymentRepository;
    this.emailSender = emailSender;
    this.clock = clock;
  }

  /** @param {string} userId */
  notify(userId) {
    const currentMonth = this.clock.currentMonth();
    const currentTotals = totalsByCategory(this.paymentRepository.fetchPayments(userId, currentMonth));
    const previousTotals = totalsByCategory(this.paymentRepository.fetchPayments(userId, currentMonth.previous()));

    const unusualSpending = new Map();
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

/**
 * @param {Payment[]} payments
 * @returns {Map<string, number>}
 */
function totalsByCategory(payments) {
  const totals = new Map();
  for (const payment of payments) {
    totals.set(payment.category, (totals.get(payment.category) ?? 0) + payment.price);
  }
  return totals;
}

function isUnusual(current, previous) {
  // current >= previous * 1.5, en nombres entiers
  return previous > 0 && current * 2 >= previous * 3;
}

/**
 * @param {Map<string, number>} unusualSpending
 * @returns {Email}
 */
function composeEmail(unusualSpending) {
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

module.exports = { UnusualSpendingService };
