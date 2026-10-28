# Starter Python — pytest, pytest-cov, mutmut

## Prérequis

- Python 3.10 ou plus récent : `python --version`
- Docker : mutmut, l'outil de mutation, ne fonctionne pas nativement sous Windows, on l'exécute donc dans un conteneur
- SonarQube démarré (voir l'étape 0 de l'énoncé)

## Structure

```
starter
├── requirements.txt         # pytest, pytest-cov (couverture), pysonar (analyse SonarQube)
├── pyproject.toml           # Configuration de pytest, mutmut et SonarQube
├── src
│   └── gilded_rose.py       # Le code à analyser puis à refactorer
└── tests
    └── test_gilded_rose.py  # Les tests existants
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
