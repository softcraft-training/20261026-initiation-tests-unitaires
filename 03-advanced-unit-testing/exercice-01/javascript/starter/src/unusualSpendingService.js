/**
 * @typedef {import("./contracts").PaymentRepository} PaymentRepository
 * @typedef {import("./contracts").EmailSender} EmailSender
 */

class UnusualSpendingService {
  /**
   * @param {PaymentRepository} paymentRepository
   * @param {EmailSender} emailSender
   */
  constructor(paymentRepository, emailSender) {
    this.paymentRepository = paymentRepository;
    this.emailSender = emailSender;
  }

  /** @param {string} userId */
  notify(userId) {
    throw new Error("À implémenter");
  }
}

module.exports = { UnusualSpendingService };
