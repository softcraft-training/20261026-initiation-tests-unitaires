# Starter JavaScript — Jest

## Prérequis

- Node.js 18 ou plus récent : `node --version`

## Structure

```
starter
├── package.json             # Dépendances (jest) et scripts
├── src
│   └── tennisGame.js        # Code de production (classe TennisGame)
└── tests
    └── tennisGame.test.js   # Tests unitaires
```

## Restaurer le projet

```bash
npm install
```

## Exécuter les tests

Ce kata n'a pas de programme principal : le code est exécuté uniquement par les tests.

```bash
npm test                    # tous les tests
npm test -- --verbose       # affichage détaillé (un test par ligne)
npm test -- --watchAll      # relance les tests à chaque sauvegarde (idéal en TDD)
```

## Cheat sheet Jest

### Écrire un test

- `describe` regroupe des tests (il peut être imbriqué), `test` (ou `it`) définit un test.
- Une fonction utilitaire déclarée en dehors de `test` n'est pas exécutée comme un test.

```javascript
const { TennisGame } = require("../src/tennisGame");

describe("TennisGame", () => {
  test("score is 0 - 0 at the start of the game", () => {
    // Arrange
    const game = new TennisGame();

    // Act
    const result = game.score();

    // Assert
    expect(result).toBe("0 - 0");
  });
});
```

### Assertions

```javascript
expect(result).toBe("15 - 0");       // égalité stricte (===)
expect(result).not.toBe("0 - 0");    // négation
```

### Vérifier qu'une erreur est levée (bonus)

L'appel doit être placé dans une fonction fléchée :

```javascript
expect(() => game.serverScores()).toThrow();
```

### Tests paramétrés (bonus)

```javascript
test.each([
  [1, 0, "15 - 0"],
  [2, 0, "30 - 0"],
])("score when server scores %i and receiver scores %i", (serverPoints, receiverPoints, expected) => {
  // ...
});
```

### Lire le résultat

- `✓` / `PASS` : test vert ✅
- `✕` / `FAIL` : test rouge ❌ — Jest affiche la valeur attendue et la valeur reçue :

```
    Expected: "15 - 0"
    Received: "0 - 0"
```
