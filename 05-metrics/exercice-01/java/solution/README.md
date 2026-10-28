# Solution Java — JUnit 5, JaCoCo, PIT

## Prérequis

- JDK 17 ou plus récent : `java -version`
- Maven 3.9 ou plus récent : `mvn -v`
- SonarQube démarré (voir l'étape 0 de l'énoncé)

## Structure

```
solution
├── pom.xml                          # JUnit 5, JaCoCo (couverture), PIT (mutation), SonarQube
└── src
    ├── main/java/tp
    │   ├── GildedRose.java          # Le code refactoré
    │   └── Item.java                # Un objet de l'inventaire (ne pas modifier)
    └── test/java/tp
        └── GildedRoseTest.java      # Les tests renforcés
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

## Notes pour le formateur

### Métriques mesurées

Mesures réalisées avec SonarQube Community Build 26.9 et PIT.

| Métrique                  | Starter | Après étape 3 (tests renforcés) | Solution (refactorée) |
|---------------------------|---------|---------------------------------|-----------------------|
| Couverture (SonarQube)    | 63,5 % | < 100 % : le code mort de la copie « Conjured » ne peut pas être couvert | 100 % |
| Lignes dupliquées         | 25,0 % | inchangé | 0 % |
| Complexité cyclomatique   | 41 | inchangé | 20 |
| Complexité cognitive      | 123 (2 problèmes *S3776* : 71 et 52) | inchangé | 8 (aucun problème) |
| Score de mutation         | 30 % (22/73) | 73 % (53/73) : tous les survivants sont dans la copie « Conjured » | 100 % (26/26) |

SonarQube ne signale qu'**un seul** test faible : `java:S2699` (test sans assertion) sur `agedBrie_increasesInQuality`. Les autres ne sont révélés que par les tests de mutation.

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
