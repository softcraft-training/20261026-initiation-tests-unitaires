# Starter JavaScript — Jest

## Prérequis

- Node.js 18 ou plus récent : `node --version`

## Structure

```
starter
├── package.json             # Dépendances (jest) et scripts
├── src
│   └── bookPricing.js       # Fonction price(books) à implémenter
└── tests                    # Vos tests (à créer)
```

## Restaurer le projet

```bash
npm install
```

## Exécuter les tests

```bash
npm test                    # tous les tests
npm test -- --verbose       # rapport détaillé : se lit comme la carte
npm test -- --watchAll      # relance les tests à chaque sauvegarde
```

Créez votre fichier de test dans `tests/bookPricing.test.js`.

## Cheat sheet Jest pour le BDD

### Story, règles, exemples

```javascript
const { price } = require("../src/bookPricing");

describe("Prix d'un panier de livres", () => {   // 🟨 la story
  describe("un livre coûte 8 €", () => {          // 🟦 une règle
    it("un tome : 8 €", () => {                   // 🟩 un exemple
      // Given : un panier contenant le tome 1
      const books = [1];

      // When : on calcule le prix
      const total = price(books);

      // Then : il vaut 8 €
      expect(total).toBeCloseTo(8, 2);
    });
  });
});
```

> Quand l'exemple tient en une ligne, Given / When / Then peuvent être réunis : `expect(price([1])).toBeCloseTo(8, 2);`

### Tests en attente : la liste de tests

`it.todo` déclare un exemple **sans corps** : il apparaît dans le rapport comme « todo ».

```javascript
describe("les doublons sont au prix plein", () => {
  it.todo("tomes 1, 1 et 2 : 23,20 €");
});
```

Pour activer l'exemple, remplacez `it.todo("…")` par `it("…", () => { … })`.

### Comparer des prix décimaux

En virgule flottante, `16 * 0.95` ne vaut pas exactement `15.2`. Comparez avec une tolérance :

```javascript
expect(price([1, 2])).toBeCloseTo(15.2, 2);   // égal à 2 décimales près
```

### Lire le rapport

```
Prix d'un panier de livres
  un livre coûte 8 €
    √ un tome : 8 €
  les doublons sont au prix plein
    ✎ todo tomes 1, 1 et 2 : 23,20 €
```

- `√` : exemple vert ✅
- `✕` : exemple rouge ❌
- `✎ todo` : exemple en attente
