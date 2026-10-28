const BOOK_PRICE = 8;

// Remise selon le nombre de tomes différents dans un lot (index = taille du lot)
const DISCOUNTS = [0, 0, 0.05, 0.1, 0.2, 0.25];

/**
 * Retourne le prix en euros d'un panier de livres.
 *
 * @param books les tomes du panier, par leur numéro (de 1 à 5). Ex. : [1, 1, 2]
 */
export function price(books: number[]): number {
  return cheapestPrice(copiesPerTome(books));
}

function copiesPerTome(books: number[]): number[] {
  const copies = new Map<number, number>();
  for (const book of books) {
    copies.set(book, (copies.get(book) ?? 0) + 1);
  }
  return [...copies.values()];
}

// Essaie chaque taille possible pour le prochain lot de tomes différents
// (en prenant les tomes les plus nombreux) et retient le regroupement le moins cher.
function cheapestPrice(copies: number[]): number {
  const remaining = copies.filter((count) => count > 0).sort((a, b) => b - a);
  if (remaining.length === 0) {
    return 0;
  }

  let cheapest = Infinity;
  for (let size = 1; size <= remaining.length; size++) {
    const rest = remaining.map((count, index) => (index < size ? count - 1 : count));
    cheapest = Math.min(cheapest, lotPrice(size) + cheapestPrice(rest));
  }
  return cheapest;
}

function lotPrice(size: number): number {
  return size * BOOK_PRICE * (1 - DISCOUNTS[size]);
}
