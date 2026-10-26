# Solution Java - JUnit 5

## Prérequis

- JDK 17 ou plus récent : `java -version`
- Maven 3.9 ou plus récent : `mvn -v` (ou utilisez le Maven intégré à IntelliJ IDEA / Eclipse / VS Code)

## Structure

```
starter
├── pom.xml                                  # Dépendances (JUnit 5) et plugins Maven
└── src
    ├── main/java/tp
    │   ├── Calculator.java                  # Code de production
    │   ├── FizzBuzz.java                    # Code de production (FizzBuzz)
    │   └── Main.java                        # Programme principal
    └── test/java/tp
        ├── CalculatorTest.java              # Tests unitaires
        └── FizzBuzzTest.java                # Tests unitaires (FizzBuzz)
```

## Restaurer le projet

```bash
mvn install -DskipTests
```

## Exécuter le projet

```bash
mvn compile exec:java
```

## Exécuter les tests

```bash
mvn test
```

> Dans un IDE, vous pouvez aussi cliquer sur l'icône ▶ à côté d'une classe ou d'une méthode de test.

## Cheat sheet JUnit 5

### Écrire un test

- La classe de test se place dans `src/test/java/tp` et son nom se termine par `Test` (ex. `FizzBuzzTest`).
- Chaque test est une méthode annotée `@Test`.

```java
package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class CalculatorTest {

    @Test
    void add_returnsTheSumOfTwoNumbers() {
        // Arrange
        Calculator calculator = new Calculator();

        // Act
        int result = calculator.add(2, 3);

        // Assert
        assertEquals(5, result);
    }
}
```

### Assertions

`import static org.junit.jupiter.api.Assertions.*;`

```java
assertEquals(5, result);          // égalité : assertEquals(attendu, obtenu)
assertEquals("Fizz", result);     // égalité de chaînes (utilise equals)
assertNotEquals(0, result);       // différence
assertTrue(condition);            // condition vraie
```

> ⚠️ L'ordre des paramètres compte : **valeur attendue d'abord**, valeur obtenue ensuite. Sinon le message d'erreur est inversé.

### Tests paramétrés (bonus)

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@ParameterizedTest
@ValueSource(ints = {3, 6, 9})
void fizzBuzz_returnsFizz_whenDivisibleBy3(int number) {
    assertEquals("Fizz", new FizzBuzz().fizzBuzz(number));
}
```

### Lire le résultat

- `Tests run: 1, Failures: 0` / `BUILD SUCCESS` : test vert ✅
- `Failures: 1` / `BUILD FAILURE` : test rouge ❌ - JUnit affiche la valeur attendue et la valeur obtenue :

```
CalculatorTest.add_returnsTheSumOfTwoNumbers:18 expected: <6> but was: <5>
```
