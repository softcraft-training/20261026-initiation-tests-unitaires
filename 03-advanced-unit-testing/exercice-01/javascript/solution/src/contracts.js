// JavaScript n'a pas d'interfaces : les contrats sont documentés avec JSDoc.
// Toute dépendance injectée dans UnusualSpendingService doit respecter ces contrats.

/**
 * @typedef {import("./models").Payment} Payment
 * @typedef {import("./models").Email} Email
 * @typedef {import("./models").YearMonth} YearMonth
 */

/**
 * @typedef {Object} PaymentRepository
 * @property {(userId: string, month: YearMonth) => Payment[]} fetchPayments
 *   Retourne les paiements effectués par l'utilisateur pendant le mois donné.
 */

/**
 * @typedef {Object} EmailSender
 * @property {(userId: string, email: Email) => void} sendEmail
 *   Envoie un email à l'utilisateur.
 */

/**
 * @typedef {Object} Clock
 * @property {() => YearMonth} currentMonth
 *   Retourne le mois courant.
 */

module.exports = {};
