# Solution TypeScript — Jest, Stryker

## Prérequis

- Node.js 22.12 ou plus récent : `node --version`
- SonarQube démarré (voir l'étape 0 de l'énoncé)

## Structure

```
solution
├── package.json               # Dépendances et scripts
├── jest.config.js             # Configuration de Jest (couverture au format lcov)
├── tsconfig.json              # Configuration de TypeScript
├── stryker.config.json        # Configuration de Stryker (mutation)
├── sonar-project.properties   # Configuration de l'analyse SonarQube
├── src
│   └── gildedRose.ts          # Le code refactoré
└── tests
    └── gildedRose.test.ts     # Les tests renforcés
```

## Commandes

| Action                    | Commande                                         | Rapport                              |
|---------------------------|--------------------------------------------------|--------------------------------------|
| Restaurer le projet       | `npm install`                                    |                                      |
| Lancer les tests          | `npm test`                                       |                                      |
| Tests + couverture        | `npm run coverage`                               | `coverage/lcov-report/index.html`    |
| Tests de mutation         | `npm run mutation`                               | `reports/mutation/mutation.html`     |
| Analyse SonarQube         | `npm run coverage` puis `npm run sonar -- "-Dsonar.token=VOTRE_JETON"` | <http://localhost:9000> |

> ⚠️ SonarQube lit le fichier de couverture `coverage/lcov.info` : lancez toujours `npm run coverage` **avant** `npm run sonar`, sinon la couverture affichée sera périmée.
>
> Avec un serveur SonarQube partagé, ajoutez `"-Dsonar.host.url=ADRESSE_DU_SERVEUR"`.
>
> Le premier lancement de l'analyse télécharge le scanner et son environnement d'exécution : il peut prendre une minute.

## Lire le rapport de couverture

`npm run coverage` affiche un résumé dans le terminal :

| Colonne      | Signification                                |
|--------------|----------------------------------------------|
| `% Stmts`    | instructions exécutées                       |
| `% Branch`   | branches des conditions prises               |
| `% Funcs`    | fonctions appelées                           |
| `% Lines`    | lignes exécutées                             |
| `Uncovered Line #s` | lignes jamais exécutées               |

Le détail ligne par ligne est dans `coverage/lcov-report/index.html`.

## Lire le rapport de mutation (Stryker)

`npm run mutation` affiche un résumé dans le terminal, et le rapport complet dans `reports/mutation/mutation.html` (à ouvrir dans un navigateur) :

| Colonne        | Signification                                              |
|----------------|------------------------------------------------------------|
| `% score`      | le **score de mutation** : mutants tués / mutants générés  |
| `# killed`     | 🟢 mutants tués : un test a échoué                         |
| `# survived`   | 🔴 mutants survivants : aucun test n'a échoué              |
| `# no cov`     | ⚪ mutants dans du code qu'aucun test n'exécute            |

Dans le rapport HTML, cliquez sur un mutant (rond coloré) pour voir la modification appliquée au code. Exemple de mutant survivant :

```diff
- if (this.items[i].sellIn < 11) {
+ if (this.items[i].sellIn <= 11) {
```

Aucun test n'a échoué : aucun test ne vérifie ce qui se passe quand il reste **exactement** 11 jours.

## Notes pour le formateur

### Métriques mesurées

Mesures réalisées avec SonarQube Community Build 26.9 et Stryker.

| Métrique                  | Starter | Après étape 3 (tests renforcés) | Solution (refactorée) |
|---------------------------|---------|---------------------------------|-----------------------|
| Couverture (SonarQube)    | 67,6 % | < 100 % : le code mort de la copie « Conjured » ne peut pas être couvert | 100 % |
| Lignes dupliquées         | 49,2 % | inchangé | 0 % |
| Complexité cyclomatique   | 41 | inchangé | 21 |
| Complexité cognitive      | 123 (2 problèmes *S3776* : 71 et 52) | inchangé | 8 (aucun problème) |
| Score de mutation         | 28 % (58/208) | 70 % (145/208) : tous les survivants sont dans la copie « Conjured » | 100 % (45/45) |

SonarQube ne signale qu'**un seul** test faible : `typescript:S2699` (test sans assertion) sur « aged brie: increases in quality ». Les autres ne sont révélés que par les tests de mutation.

### Les tests faibles du starter

| Test du starter | Faiblesse |
|---|---|
| le nom de l'objet ne change pas (`foo`) | ne vérifie ni `sellIn` ni `quality` |
| objet normal, après la date de vente | assertion vague (`quality < 10`) : accepte -1 au lieu de -2 |
| Aged Brie augmente en qualité | **aucune assertion** |
| Aged Brie, après la date de vente | assertion presque toujours vraie (`quality >= 10`) |
| Aged Brie, qualité plafonnée à 50 | assertion vague (`<= 50`), `sellIn` non vérifié |
| Backstage passes, 10 jours ou moins | assertion vague (`quality > 20`) : accepte +1 au lieu de +2 |
| Backstage passes, 5 jours ou moins | assertion **toujours vraie** (objet non nul / défini) |
| objet Conjured | assertion **toujours vraie** (`true`) |

Tests manquants : bornes des Backstage passes (11, 10, 6, 5, 1 jours), veille de la date de vente, qualité qui atteint exactement 0 ou 50, plusieurs objets dans l'inventaire (dont un Conjured suivi d'un autre objet), affichage d'un `Item`.

### Les mutants restants après l'étape 3

Ils sont tous dans la méthode copiée pour les objets « Conjured » :

- **non couverts** : les branches Aged Brie / Backstage passes / Sulfuras de la copie ne sont jamais exécutées pour un objet « Conjured ». C'est du **code mort**, impossible à couvrir ;
- **équivalents** : par exemple `quality > 0` remplacé par `quality >= 0` devant `max(quality - 2, 0)` ne change pas le comportement.

Le refactoring les fait disparaître : sur la solution, le score de mutation est de 100 %.
