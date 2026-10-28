# Starter TypeScript — Jest, Stryker

## Prérequis

- Node.js 22.12 ou plus récent : `node --version`
- SonarQube démarré (voir l'étape 0 de l'énoncé)

## Structure

```
starter
├── package.json               # Dépendances et scripts
├── jest.config.js             # Configuration de Jest (couverture au format lcov)
├── tsconfig.json              # Configuration de TypeScript
├── stryker.config.json        # Configuration de Stryker (mutation)
├── sonar-project.properties   # Configuration de l'analyse SonarQube
├── src
│   └── gildedRose.ts          # Le code à analyser puis à refactorer
└── tests
    └── gildedRose.test.ts     # Les tests existants
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
