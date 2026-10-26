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
    │   └── TennisGame.java                  # Code de production
    └── test/java/tp
        └── TennisGameTest.java              # Tests unitaires
```

## Restaurer le projet

```bash
mvn install -DskipTests
```

## Exécuter les tests

Ce kata n'a pas de programme principal : le code est exécuté uniquement par les tests.

```bash
mvn test
```

> Dans un IDE, vous pouvez aussi cliquer sur l'icône ▶ à côté d'une classe ou d'une méthode de test. En TDD, c'est souvent le plus rapide.

## Cheat sheet JUnit 5

### Écrire un test

- Chaque test est une méthode annotée `@Test`.
- Une méthode **sans** `@Test` (ex. une méthode utilitaire) n'est pas exécutée comme un test.

```java
package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class TennisGameTest {

    @Test
    void score_is0_0_atTheStartOfTheGame() {
        // Arrange
        TennisGame game = new TennisGame();

        // Act
        String result = game.score();

        // Assert
        assertEquals("0 - 0", result);
    }
}
```

### Assertions

`import static org.junit.jupiter.api.Assertions.*;`

```java
assertEquals("15 - 0", result);     // égalité : assertEquals(attendu, obtenu)
assertNotEquals("0 - 0", result);   // différence
```

> ⚠️ L'ordre des paramètres compte : **valeur attendue d'abord**, valeur obtenue ensuite.

### Vérifier qu'une exception est levée (bonus)

```java
assertThrows(IllegalStateException.class, () -> game.serverScores());
```

### Grouper les tests (optionnel)

```java
@Nested
class DeuceAndAdvantage {
    @Test
    void score_isDeuce_whenBothPlayersScore3Points() { ... }
}
```

### Tests paramétrés (bonus)

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

@ParameterizedTest
@CsvSource({
    "1, 0, 15 - 0",
    "2, 0, 30 - 0",
})
void score_isCorrect_forSimpleScores(int serverPoints, int receiverPoints, String expected) {
    ...
}
```

### Lire le résultat

- `Tests run: 1, Failures: 0` / `BUILD SUCCESS` : test vert ✅
- `Failures: 1` / `BUILD FAILURE` : test rouge ❌ — JUnit affiche la valeur attendue et la valeur obtenue :

```
expected: <15 - 0> but was: <0 - 0>
```

- `Errors: 1` : une exception inattendue a été levée (ex. `UnsupportedOperationException: À implémenter`).
