# Solution TypeScript - Jest

## Prérequis

- Node.js 18 ou plus récent : `node --version`

## Structure

```
starter
├── package.json             # Dépendances (jest, ts-jest, typescript) et scripts
├── jest.config.js           # Configuration de Jest (ts-jest)
├── tsconfig.json            # Configuration de TypeScript
├── src
│   ├── calculator.ts        # Code de production
│   ├── fizzBuzz.ts          # Code de production (FizzBuzz)
│   └── main.ts              # Programme principal
└── tests
    ├── calculator.test.ts   # Tests unitaires
    └── fizzBuzz.test.ts     # Tests unitaires (FizzBuzz)
```

## Restaurer le projet

```bash
npm install
```

## Exécuter le projet

```bash
npm start      # compile dans dist/ puis exécute dist/main.js
```

## Exécuter les tests

```bash
npm test                 # tous les tests
npm test -- --verbose    # affichage détaillé (un test par ligne)
```

> Pensez à exporter vos fonctions (`export function fizzBuzz(...)`) pour pouvoir les importer dans les tests.
> Type de retour possible pour `fizzBuzz` : `number | string`.

## Cheat sheet Jest

### Écrire un test

- Le fichier de test se termine par `.test.ts` (ex. `fizzBuzz.test.ts`) et se place dans `tests/`.
- `describe` regroupe les tests d'une même fonction, `test` (ou `it`) définit un test.

```typescript
import { add } from "../src/calculator";

describe("add", () => {
  test("returns the sum of two numbers", () => {
    // Arrange
    const a = 2;
    const b = 3;

    // Act
    const result = add(a, b);

    // Assert
    expect(result).toBe(5);
  });
});
```

### Assertions

```typescript
expect(result).toBe(5);          // égalité stricte (===) : nombres, chaînes, booléens
expect(result).toBe("Fizz");
expect(result).not.toBe(0);      // négation
expect(result).toEqual([1, 2]);  // égalité de contenu : tableaux, objets
```

### Tests paramétrés (bonus)

```typescript
test.each([3, 6, 9])("returns Fizz when %i is divisible by 3", (n) => {
  expect(fizzBuzz(n)).toBe("Fizz");
});
```

### Lire le résultat

- `✓` / `PASS` : test vert ✅
- `✕` / `FAIL` : test rouge ❌ - Jest affiche la valeur attendue et la valeur reçue :

```
    Expected: 6
    Received: 5
```
