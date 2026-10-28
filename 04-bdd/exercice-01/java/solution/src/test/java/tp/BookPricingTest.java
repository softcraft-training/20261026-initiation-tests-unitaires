package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static tp.BookPricing.price;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("Prix d'un panier de livres")
class BookPricingTest {

    private static final double CENT = 0.001;

    @Nested
    @DisplayName("un livre coûte 8 €")
    class UnLivreCoute8Euros {

        @Test
        @DisplayName("panier vide : 0 €")
        void panierVide() {
            assertEquals(0, price(), CENT);
        }

        @Test
        @DisplayName("un tome : 8 €")
        void unTome() {
            assertEquals(8, price(1), CENT);
        }

        @Test
        @DisplayName("le tome 1 en deux exemplaires : 16 €")
        void tome1EnDeuxExemplaires() {
            assertEquals(16, price(1, 1), CENT);
        }
    }

    @Nested
    @DisplayName("des titres différents donnent une remise de 5 à 25 %")
    class TitresDifferents {

        @Test
        @DisplayName("tomes 1 et 2 : 15,20 €")
        void deuxTomesDifferents() {
            assertEquals(15.20, price(1, 2), CENT);
        }

        @Test
        @DisplayName("tomes 1, 2 et 3 : 21,60 €")
        void troisTomesDifferents() {
            assertEquals(21.60, price(1, 2, 3), CENT);
        }

        // Exemple ajouté à l'étape 1 : la remise de 20 % n'était pas illustrée
        @Test
        @DisplayName("tomes 1 à 4 : 25,60 €")
        void quatreTomesDifferents() {
            assertEquals(25.60, price(1, 2, 3, 4), CENT);
        }

        @Test
        @DisplayName("les 5 tomes : 30 €")
        void cinqTomesDifferents() {
            assertEquals(30, price(1, 2, 3, 4, 5), CENT);
        }
    }

    @Nested
    @DisplayName("les doublons sont au prix plein")
    class Doublons {

        @Test
        @DisplayName("tomes 1, 1 et 2 : 23,20 €")
        void unDoublon() {
            assertEquals(23.20, price(1, 1, 2), CENT);
        }

        @Test
        @DisplayName("tomes 1, 2, 3 et 3 : 29,60 €")
        void unDoublonAvecTroisTitres() {
            assertEquals(29.60, price(1, 2, 3, 3), CENT);
        }
    }

    @Nested
    @DisplayName("le regroupement le moins cher est retenu")
    class RegroupementLeMoinsCher {

        @Test
        @DisplayName("tomes 1 à 3 en double, tomes 4 et 5 : 51,20 €")
        void deuxLotsDeQuatrePlutotQueCinqPlusTrois() {
            assertEquals(51.20, price(1, 1, 2, 2, 3, 3, 4, 5), CENT);
        }
    }
}
