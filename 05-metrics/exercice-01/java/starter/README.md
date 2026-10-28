# Starter Java — JUnit 5, JaCoCo, PIT

## Prérequis

- JDK 17 ou plus récent : `java -version`
- Maven 3.9 ou plus récent : `mvn -v`
- SonarQube démarré (voir l'étape 0 de l'énoncé)

## Structure

```
starter
├── pom.xml                          # JUnit 5, JaCoCo (couverture), PIT (mutation), SonarQube
└── src
    ├── main/java/tp
    │   ├── GildedRose.java          # Le code à analyser puis à refactorer
    │   └── Item.java                # Un objet de l'inventaire (ne pas modifier)
    └── test/java/tp
        └── GildedRoseTest.java      # Les tests existants
```

## Commandes

| Action                                   | Commande                                                     | Rapport                              |
|------------------------------------------|--------------------------------------------------------------|--------------------------------------|
| Restaurer le projet                      | `mvn install -DskipTests`                                    |                                      |
| Lancer les tests                         | `mvn test`                                                   |                                      |
| Tests + couverture                       | `mvn verify`                                                 | `target/site/jacoco/index.html`      |
| Tests de mutation                        | `mvn test-compile org.pitest:pitest-maven:mutationCoverage`  | `target/pit-reports/index.html`      |
| Analyse SonarQube (avec la couverture)   | `mvn verify sonar:sonar "-Dsonar.token=VOTRE_JETON"`         | <http://localhost:9000>              |

> Avec un serveur SonarQube partagé, ajoutez `"-Dsonar.host.url=ADRESSE_DU_SERVEUR"`.
>
> Le premier lancement de l'analyse télécharge l'environnement d'exécution du scanner : il peut prendre une minute.

## Lire le rapport de couverture (JaCoCo)

Ouvrez `target/site/jacoco/index.html` puis la classe `GildedRose` :

- 🟩 ligne verte : exécutée par les tests ;
- 🟥 ligne rouge : jamais exécutée ;
- 🟨 ligne jaune : condition dont toutes les branches n'ont pas été prises (survolez le losange pour le détail).

## Lire le rapport de mutation (PIT)

Ouvrez `target/pit-reports/index.html` :

- **Line Coverage** : la couverture de lignes ;
- **Mutation Coverage** : le **score de mutation** (mutants tués / mutants générés).

Dans le détail de `GildedRose.java`, chaque ligne mutée est colorée et la liste des mutants est en bas de page :

| Statut PIT      | Signification                                   |
|-----------------|-------------------------------------------------|
| `KILLED`        | 🟢 Mutant tué : un test a échoué                |
| `SURVIVED`      | 🔴 Mutant survivant : aucun test n'a échoué     |
| `NO_COVERAGE`   | ⚪ Aucun test n'exécute cette ligne             |

Exemple de mutant survivant :

```
changed conditional boundary → SURVIVED
```

Sur la ligne `if (items[i].sellIn < 11)`, PIT a remplacé `<` par `<=` et aucun test n'a échoué : aucun test ne vérifie ce qui se passe quand il reste **exactement** 11 jours.
