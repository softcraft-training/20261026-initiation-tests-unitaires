# Starter Java — JUnit 5

## Prérequis

- JDK 17 ou plus récent : `java -version`
- Maven 3.9 ou plus récent : `mvn -v` (ou utilisez le Maven intégré à IntelliJ IDEA / Eclipse / VS Code)

## Structure

```
starter
├── pom.xml                                  # Dépendances (JUnit 5) et plugins Maven
└── src
    ├── main/java/tp
    │   └── BookPricing.java                 # Méthode price(books...) à implémenter
    └── test/java/tp                         # Vos tests (à créer)
```

## Restaurer le projet

```bash
mvn install -DskipTests
```

## Exécuter les tests

```bash
mvn test
```

Créez votre classe de test dans `src/test/java/tp/BookPricingTest.java`.

> 💡 Le rapport de Maven n'affiche pas les noms métier des tests. Lancez plutôt les tests depuis votre **IDE** (icône ▶) : l'arbre des résultats affiche les `@DisplayName` et se lit comme la carte.

## Cheat sheet JUnit 5 pour le BDD

### Story, règles, exemples

- `@DisplayName` donne au test un nom en langage métier, avec espaces et accents.
- `@Nested` permet d'imbriquer une classe de test par règle.

```java
package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static tp.BookPricing.price;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("Prix d'un panier de livres")         // 🟨 la story
class BookPricingTest {

    @Nested
    @DisplayName("un livre coûte 8 €")             // 🟦 une règle
    class UnLivreCoute8Euros {

        @Test
        @DisplayName("un tome : 8 €")              // 🟩 un exemple
        void unTome() {
            // Given : un panier contenant le tome 1
            int[] books = {1};

            // When : on calcule le prix
            double total = price(books);

            // Then : il vaut 8 €
            assertEquals(8, total, 0.001);
        }
    }
}
```

> Quand l'exemple tient en une ligne, Given / When / Then peuvent être réunis : `assertEquals(8, price(1), 0.001);`

### Tests en attente : la liste de tests

```java
import org.junit.jupiter.api.Disabled;

@Test
@Disabled("à faire")
@DisplayName("tomes 1, 1 et 2 : 23,20 €")
void unDoublon() {
}
```

Pour activer l'exemple, retirez l'annotation `@Disabled` et écrivez le corps du test.

### Comparer des prix décimaux

En virgule flottante, `16 * 0.95` ne vaut pas exactement `15.2`. Comparez avec une tolérance (3ᵉ paramètre) :

```java
assertEquals(15.20, price(1, 2), 0.001);   // attendu, obtenu, tolérance
```

### Lire le rapport (dans l'IDE)

```
Prix d'un panier de livres
  un livre coûte 8 €
    ✔ un tome : 8 €
  les doublons sont au prix plein
    ⊘ tomes 1, 1 et 2 : 23,20 €
```

- ✔ : exemple vert ✅
- ✘ : exemple rouge ❌
- ⊘ : exemple en attente (`@Disabled`)
