import { Email, Payment, YearMonth } from "./models";

export interface PaymentRepository {
  /** Retourne les paiements effectués par l'utilisateur pendant le mois donné. */
  fetchPayments(userId: string, month: YearMonth): Payment[];
}

export interface EmailSender {
  /** Envoie un email à l'utilisateur. */
  sendEmail(userId: string, email: Email): void;
}

export interface Clock {
  /** Retourne le mois courant. */
  currentMonth(): YearMonth;
}
