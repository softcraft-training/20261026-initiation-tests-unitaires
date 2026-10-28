from collections import Counter
from typing import List

BOOK_PRICE = 8

# Remise selon le nombre de tomes différents dans un lot (index = taille du lot)
DISCOUNTS = [0, 0, 0.05, 0.10, 0.20, 0.25]


def price(books: List[int]) -> float:
    """Retourne le prix en euros d'un panier de livres.

    books : les tomes du panier, par leur numéro (de 1 à 5). Ex. : [1, 1, 2]
    """
    return _cheapest_price(list(Counter(books).values()))


def _cheapest_price(copies: List[int]) -> float:
    # Essaie chaque taille possible pour le prochain lot de tomes différents
    # (en prenant les tomes les plus nombreux) et retient le regroupement le moins cher.
    remaining = sorted((count for count in copies if count > 0), reverse=True)
    if not remaining:
        return 0

    return min(
        _lot_price(size) + _cheapest_price(
            [count - 1 if index < size else count for index, count in enumerate(remaining)]
        )
        for size in range(1, len(remaining) + 1)
    )


def _lot_price(size: int) -> float:
    return size * BOOK_PRICE * (1 - DISCOUNTS[size])
