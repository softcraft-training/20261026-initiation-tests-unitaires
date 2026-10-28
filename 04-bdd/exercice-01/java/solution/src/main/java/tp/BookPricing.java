package tp;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

public final class BookPricing {

    private static final double BOOK_PRICE = 8;

    // Remise selon le nombre de tomes différents dans un lot (index = taille du lot)
    private static final double[] DISCOUNTS = {0, 0, 0.05, 0.10, 0.20, 0.25};

    private BookPricing() {
    }

    /**
     * Retourne le prix en euros d'un panier de livres.
     *
     * @param books les tomes du panier, par leur numéro (de 1 à 5). Ex. : price(1, 1, 2)
     */
    public static double price(int... books) {
        return cheapestPrice(copiesPerTome(books));
    }

    private static int[] copiesPerTome(int[] books) {
        Map<Integer, Integer> copies = new HashMap<>();
        for (int book : books) {
            copies.merge(book, 1, Integer::sum);
        }
        return copies.values().stream().mapToInt(Integer::intValue).toArray();
    }

    // Essaie chaque taille possible pour le prochain lot de tomes différents
    // (en prenant les tomes les plus nombreux) et retient le regroupement le moins cher.
    private static double cheapestPrice(int[] copies) {
        int[] remaining = Arrays.stream(copies)
                .filter(count -> count > 0)
                .boxed()
                .sorted(Comparator.reverseOrder())
                .mapToInt(Integer::intValue)
                .toArray();
        if (remaining.length == 0) {
            return 0;
        }

        double cheapest = Double.MAX_VALUE;
        for (int size = 1; size <= remaining.length; size++) {
            int[] rest = remaining.clone();
            for (int index = 0; index < size; index++) {
                rest[index]--;
            }
            cheapest = Math.min(cheapest, lotPrice(size) + cheapestPrice(rest));
        }
        return cheapest;
    }

    private static double lotPrice(int size) {
        return size * BOOK_PRICE * (1 - DISCOUNTS[size]);
    }
}
