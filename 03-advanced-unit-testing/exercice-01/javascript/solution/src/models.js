/**
 * Énumération des catégories. La valeur est le libellé affiché dans l'email.
 * @readonly
 * @enum {string}
 */
const Category = Object.freeze({
  ENTERTAINMENT: "divertissement",
  RESTAURANTS: "restaurants",
  GOLF: "golf",
  GROCERIES: "courses",
  TRAVEL: "voyages",
});

/**
 * Un paiement (objet valeur).
 * @typedef {Object} Payment
 * @property {number} price - Montant en dollars entiers
 * @property {string} description
 * @property {Category} category
 */

/**
 * Le contenu d'un email (objet valeur).
 * @typedef {Object} Email
 * @property {string} subject
 * @property {string} body
 */

class YearMonth {
  /**
   * @param {number} year
   * @param {number} month - de 1 (janvier) à 12 (décembre)
   */
  constructor(year, month) {
    this.year = year;
    this.month = month;
  }

  /** @returns {YearMonth} */
  previous() {
    if (this.month === 1) {
      return new YearMonth(this.year - 1, 12);
    }
    return new YearMonth(this.year, this.month - 1);
  }

  /** @param {YearMonth} other */
  equals(other) {
    return this.year === other.year && this.month === other.month;
  }
}

module.exports = { Category, YearMonth };
