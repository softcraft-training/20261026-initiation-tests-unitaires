# Solution Python — pytest, pytest-cov, mutmut

## Prérequis

- Python 3.10 ou plus récent : `python --version`
- Docker : mutmut, l'outil de mutation, ne fonctionne pas nativement sous Windows, on l'exécute donc dans un conteneur
- SonarQube démarré (voir l'étape 0 de l'énoncé)

## Structure

```
solution
├── requirements.txt         # pytest, pytest-cov (couverture), pysonar (analyse SonarQube)
├── pyproject.toml           # Configuration de pytest, mutmut et SonarQube
├── src
│   └── gilded_rose.py       # Le code refactoré
└── tests
    └── test_gilded_rose.py  # Les tests renforcés
```

## Restaurer le projet

Créer un environnement virtuel puis installer les dépendances :

```bash
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

> **Windows (PowerShell)** : si l'activation échoue avec l'erreur « l'exécution de scripts est désactivée sur ce système », autorisez les scripts pour la session en cours, puis relancez l'activation :
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .venv\Scripts\Activate.ps1
> ```

## Commandes

| Action                  | Commande                                                         | Rapport                     |
|-------------------------|------------------------------------------------------------------|-----------------------------|
| Lancer les tests        | `pytest`                                                         |                             |
| Tests + couverture      | `pytest --cov=src --cov-report=term-missing --cov-report=xml`    | terminal + `coverage.xml`   |
| Analyse SonarQube       | `pysonar --sonar-token=VOTRE_JETON`                              | <http://localhost:9000>     |
| Tests de mutation       | voir ci-dessous                                                  | `mutmut results`            |

> ⚠️ SonarQube lit le fichier `coverage.xml` : lancez toujours les tests avec la couverture **avant** `pysonar`, sinon la couverture affichée sera périmée.
>
> Avec un serveur SonarQube partagé, ajoutez `--sonar-host-url=ADRESSE_DU_SERVEUR`.
>
> Le premier lancement de l'analyse télécharge le scanner et son environnement d'exécution : il peut prendre une minute.

### Tests de mutation (dans Docker)

Depuis le dossier `starter` :

```powershell
# Windows (PowerShell)
docker run --rm -it -v "${PWD}:/app" -w /app python:3.12-slim sh -c "rm -rf mutants && pip install -q -r requirements.txt mutmut==3.8.0 && mutmut run && mutmut results"
```

```bash
# macOS / Linux
docker run --rm -it -v "$PWD:/app" -w /app python:3.12-slim sh -c "rm -rf mutants && pip install -q -r requirements.txt mutmut==3.8.0 && mutmut run && mutmut results"
```

> ⚠️ mutmut garde ses résultats dans le dossier `mutants/` et ne les recalcule **pas** quand seuls les tests changent. La commande commence donc par `rm -rf mutants` pour repartir de zéro à chaque lancement.
>
> Sous Windows, utilisez **PowerShell** plutôt que Git Bash, qui transforme les chemins passés à Docker.

## Lire la couverture

```
Name                 Stmts   Miss  Cover   Missing
--------------------------------------------------
src\gilded_rose.py      64     18    72%   61, 63-64, ...
```

- `Cover` : la couverture de lignes ;
- `Missing` : les lignes jamais exécutées par les tests.

## Lire le rapport de mutation (mutmut)

Pendant l'exécution, mutmut affiche sa progression :

```
169/169  🎉 51 🫥 0  ⏰ 0  🤔 0  🙁 118  🔇 0
```

| Symbole | Signification                                                                     |
|---------|-----------------------------------------------------------------------------------|
| 🎉      | 🟢 mutants tués : un test a échoué                                                |
| 🙁      | 🔴 mutants survivants : aucun test n'a échoué (y compris le code non couvert)     |
| ⏰      | délai dépassé : le mutant a probablement créé une boucle infinie                  |

**Score de mutation** = 🎉 / nombre total de mutants.

`mutmut results` liste les mutants survivants, par fonction :

```
gilded_rose.xǁGildedRoseǁupdate_quality__mutmut_7: survived
```

Pour voir la modification appliquée par un mutant, ajoutez `mutmut show NOM_DU_MUTANT` à la commande Docker (à la place de `mutmut results`) :

```diff
-        if self.items[i].sell_in < 11:
+        if self.items[i].sell_in <= 11:
```

Aucun test n'a échoué : aucun test ne vérifie ce qui se passe quand il reste **exactement** 11 jours.

## Notes pour le formateur

### Métriques mesurées

Mesures réalisées avec SonarQube Community Build 26.9 et mutmut.

| Métrique                  | Starter | Après étape 3 (tests renforcés) | Solution (refactorée) |
|---------------------------|---------|---------------------------------|-----------------------|
| Couverture (SonarQube)    | 71,9 % | < 100 % : le code mort de la copie « Conjured » ne peut pas être couvert | 100 % |
| Lignes dupliquées         | 47,7 % | inchangé | 0 % |
| Complexité cyclomatique   | 41 | inchangé | 16 |
| Complexité cognitive      | 123 (2 problèmes *S3776* : 71 et 52) | inchangé | 12 (aucun problème) |
| Score de mutation         | 30 % (51/169) | 67 % (113/169) : tous les survivants sont dans la copie « Conjured » | 100 % (80/80) |

SonarQube ne signale qu'**un seul** test faible : `python:S5914` (expression toujours vraie) sur `assert True` ; le test sans assertion n'est **pas** signalé. Les autres ne sont révélés que par les tests de mutation.

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
