import { EmailSender, PaymentRepository } from "./contracts";

export class UnusualSpendingService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly emailSender: EmailSender,
  ) {}

  notify(userId: string): void {
    throw new Error("À implémenter");
  }
}
